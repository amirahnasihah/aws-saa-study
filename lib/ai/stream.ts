import { AWS_DIAGRAM_TOOL, runAwsDiagramTool } from '@/lib/ai/aws-diagrams'
import {
  AWS_DOCS_FALLBACK,
  buildDocsSearchPhrase,
  resolveAwsDocLink,
} from '@/lib/ai/aws-knowledge'
import { completeChatMessages, streamFree } from '@/lib/ai/complete-json'
import { readGatewayBase } from '@/lib/ai/env'
import { findInternalLinks, type InternalLink } from '@/lib/ai/internal-links'
import {
  BYOK_PROVIDER_META,
  classifyProviderError,
  resolveMessagesUrl,
  validateByokKey,
  type AIProvider,
} from '@/lib/ai/providers'

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

interface DoneMeta {
  awsDocsUrl: string
  awsDocsTitle: string
  youtubeQuery: string
  internalLinks: InternalLink[]
}

interface StreamChatOptions {
  provider: AIProvider
  apiKey: string
  systemPrompt: string
  messages: ChatTurn[]
  userMessage: string
  maxTokens: number
}

type ProviderResult = { text: string } | { error: string; status: number }
type Emit = (event: string, data: unknown) => void

const encoder = new TextEncoder()

function sse(event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
}

// ── done-event metadata (derived server-side now that the model streams raw
//    Markdown instead of a JSON envelope) ──────────────────────────────────────

function deriveYoutubeQuery(message: string): string {
  const trimmed = message.replace(/\s+/g, ' ').trim().slice(0, 80)
  return trimmed ? `${trimmed} AWS tutorial` : 'AWS Solutions Architect tutorial'
}

async function deriveMeta(userMessage: string, reply: string): Promise<DoneMeta> {
  const docsSearchPhrase = buildDocsSearchPhrase([userMessage, reply.slice(0, 120)])
  const [awsDoc, internalLinks] = await Promise.all([
    docsSearchPhrase
      ? resolveAwsDocLink(docsSearchPhrase, ['general'])
      : Promise.resolve(AWS_DOCS_FALLBACK),
    Promise.resolve(findInternalLinks([userMessage, reply.slice(0, 200)])),
  ])
  return {
    awsDocsUrl: awsDoc.url,
    awsDocsTitle: awsDoc.title,
    youtubeQuery: deriveYoutubeQuery(userMessage),
    internalLinks,
  }
}

// ── Anthropic native streaming + tool-use loop ───────────────────────────────

type AnthropicContentBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: unknown }
  | { type: 'tool_result'; tool_use_id: string; content: string }

type AnthropicMessage = {
  role: 'user' | 'assistant'
  content: string | AnthropicContentBlock[]
}

// Accumulator for blocks as they arrive over the stream.
type BlockAccum =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; json: string }

interface AnthropicStreamEvent {
  type: string
  index?: number
  content_block?: { type: string; id?: string; name?: string }
  delta?: {
    type?: string
    text?: string
    partial_json?: string
    stop_reason?: string
  }
}

function safeJson(raw: string): unknown {
  try {
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/** Anthropic requires the first turn to be a user message. */
function normalizeTurns(turns: ChatTurn[]): ChatTurn[] {
  const firstUser = turns.findIndex((t) => t.role === 'user')
  return firstUser <= 0 ? turns : turns.slice(firstUser)
}

/** Apply a single Anthropic stream event; returns a stop_reason when present. */
function applyEvent(
  evt: AnthropicStreamEvent,
  blocks: BlockAccum[],
  emitText: (text: string) => void
): string | null {
  if (
    evt.type === 'content_block_start' &&
    typeof evt.index === 'number' &&
    evt.content_block
  ) {
    const cb = evt.content_block
    blocks[evt.index] =
      cb.type === 'tool_use'
        ? { type: 'tool_use', id: cb.id ?? '', name: cb.name ?? '', json: '' }
        : { type: 'text', text: '' }
    return null
  }

  if (
    evt.type === 'content_block_delta' &&
    typeof evt.index === 'number' &&
    evt.delta
  ) {
    const block = blocks[evt.index]
    if (block?.type === 'text' && evt.delta.type === 'text_delta') {
      const text = evt.delta.text ?? ''
      block.text += text
      emitText(text)
    } else if (block?.type === 'tool_use' && evt.delta.type === 'input_json_delta') {
      block.json += evt.delta.partial_json ?? ''
    }
    return null
  }

  if (evt.type === 'message_delta' && evt.delta?.stop_reason) {
    return evt.delta.stop_reason
  }

  return null
}

/** Read one streamed Anthropic response to completion. */
async function consumeAnthropicStream(
  body: ReadableStream<Uint8Array>,
  emitText: (text: string) => void
): Promise<{ blocks: BlockAccum[]; stopReason: string }> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  const blocks: BlockAccum[] = []
  let stopReason = 'end_turn'
  let buffer = ''

  // An async byte stream that must mutate per-event accumulators — a read loop
  // is the right tool here (cannot yield/await inside forEach).
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let sep = buffer.indexOf('\n\n')
    while (sep !== -1) {
      const rawEvent = buffer.slice(0, sep)
      buffer = buffer.slice(sep + 2)
      const dataLine = rawEvent.split('\n').find((line) => line.startsWith('data:'))
      if (dataLine) {
        const payload = dataLine.slice(5).trim()
        if (payload) {
          try {
            const stop = applyEvent(JSON.parse(payload) as AnthropicStreamEvent, blocks, emitText)
            if (stop) stopReason = stop
          } catch {
            // ignore a malformed event line
          }
        }
      }
      sep = buffer.indexOf('\n\n')
    }
  }

  return { blocks, stopReason }
}

const MAX_TOOL_ROUNDS = 3

async function streamAnthropic(
  apiKey: string,
  systemPrompt: string,
  initialMessages: ChatTurn[],
  maxTokens: number,
  emit: Emit
): Promise<ProviderResult> {
  const url = resolveMessagesUrl('anthropic', readGatewayBase())
  const model = BYOK_PROVIDER_META.anthropic.model
  const convo: AnthropicMessage[] = normalizeTurns(initialMessages).map((m) => ({
    role: m.role,
    content: m.content,
  }))

  let fullText = ''
  let round = 0

  while (round < MAX_TOOL_ROUNDS) {
    round += 1

    let res: Response
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey.trim(),
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: convo,
          stream: true,
          tools: [AWS_DIAGRAM_TOOL],
        }),
      })
    } catch {
      return { error: 'AI request timed out. Try again.', status: 503 }
    }

    if (!res.ok || !res.body) {
      return { error: classifyProviderError('anthropic', res.status), status: res.status }
    }

    const { blocks, stopReason } = await consumeAnthropicStream(res.body, (text) => {
      fullText += text
      emit('delta', { text })
    })

    const toolUses = blocks.filter(
      (b): b is Extract<BlockAccum, { type: 'tool_use' }> => b.type === 'tool_use'
    )

    if (stopReason !== 'tool_use' || toolUses.length === 0) {
      return { text: fullText }
    }

    // Reconstruct the assistant turn (dropping empty text blocks, which the API
    // rejects) so the follow-up call carries the model's own tool calls.
    const assistantContent: AnthropicContentBlock[] = blocks
      .filter((b) => (b.type === 'text' ? b.text.trim() !== '' : true))
      .map((b) =>
        b.type === 'tool_use'
          ? { type: 'tool_use', id: b.id, name: b.name, input: safeJson(b.json) }
          : { type: 'text', text: b.text }
      )
    convo.push({ role: 'assistant', content: assistantContent })

    emit('tool', { name: 'get_aws_diagram', count: toolUses.length })

    convo.push({
      role: 'user',
      content: toolUses.map((tu) => ({
        type: 'tool_result',
        tool_use_id: tu.id,
        content: runAwsDiagramTool(safeJson(tu.json)),
      })),
    })
  }

  return { text: fullText }
}

// ── Non-Anthropic fallback: emit the whole reply as a single delta ───────────

async function streamFallback(
  opts: StreamChatOptions,
  emit: Emit
): Promise<ProviderResult> {
  const result = await completeChatMessages(
    opts.provider,
    opts.apiKey,
    opts.systemPrompt,
    opts.messages,
    opts.maxTokens
  )
  if ('error' in result) return result
  if (result.text) emit('delta', { text: result.text })
  return result
}

async function runProvider(opts: StreamChatOptions, emit: Emit): Promise<ProviderResult> {
  if (opts.provider === 'anthropic') {
    const keyError = validateByokKey('anthropic', opts.apiKey)
    if (keyError) return { error: keyError, status: 400 }
    return streamAnthropic(opts.apiKey, opts.systemPrompt, opts.messages, opts.maxTokens, emit)
  }

  // Free chain (NVIDIA → ILMU → Gemini) streams token-by-token like Anthropic.
  if (opts.provider === 'free') {
    return streamFree(opts.systemPrompt, opts.messages, opts.maxTokens, (text) =>
      emit('delta', { text })
    )
  }

  // Other BYOK providers still emit the whole reply as one delta.
  return streamFallback(opts, emit)
}

/**
 * Stream a chat completion as Server-Sent Events.
 * Events: `delta` { text }, `tool` { name, count }, `done` { …metadata },
 * `error` { error }.
 */
export function streamChat(opts: StreamChatOptions): Response {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit: Emit = (event, data) => controller.enqueue(sse(event, data))
      try {
        const result = await runProvider(opts, emit)
        if ('error' in result) {
          emit('error', { error: result.error })
        } else {
          emit('done', await deriveMeta(opts.userMessage, result.text))
        }
      } catch {
        emit('error', { error: 'AI chat failed. Try again.' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
    },
  })
}
