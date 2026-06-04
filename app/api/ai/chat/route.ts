import {
  inferProviderFromKey,
  isByokProvider,
  parseAIProvider,
  validateByokKey,
  type AIProvider,
  type ByokProvider,
} from '@/lib/ai/providers'
import {
  buildDocsSearchPhrase,
  resolveAwsDocLink,
} from '@/lib/ai/aws-knowledge'
import { readGatewayBase, readGroqApiKey } from '@/lib/ai/env'
import { callGroq } from '@/lib/ai/groq'
import { parseAIJson } from '@/lib/ai/json'
import { callByokChatMessages } from '@/lib/ai/messages'
import type { ChatResponse, ErrorResponse } from '@/lib/ai/types'

export const runtime = 'edge'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  history: ChatMessage[]
}

const CHAT_SYSTEM_PROMPT = `You are an AWS Solutions Architect study assistant. Answer questions about AWS services, architecture patterns, and exam topics concisely (3-5 sentences).

Respond ONLY with valid JSON (no markdown, no code fences):
{"reply":"string","youtubeQuery":"string","docsSearchPhrase":"string"}

Rules:
- reply: your answer, concise and specific to AWS
- youtubeQuery: a specific search query for a YouTube tutorial (e.g. "AWS VPC peering tutorial")
- docsSearchPhrase: a short phrase to search official AWS documentation (e.g. "S3 bucket versioning configuration") — do NOT invent URLs`

interface ChatJson {
  reply?: string
  youtubeQuery?: string
  docsSearchPhrase?: string
}

function resolveProvider(header: string | null, apiKey: string): AIProvider {
  const fromHeader = parseAIProvider(header)
  if (fromHeader) return fromHeader
  if (apiKey.trim()) return inferProviderFromKey(apiKey)
  return 'groq'
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = request.headers.get('x-api-key') ?? ''
  const provider = resolveProvider(request.headers.get('x-ai-provider'), apiKey)

  let body: ChatRequest
  try {
    body = (await request.json()) as ChatRequest
  } catch {
    return Response.json({ error: 'Invalid request body.' } satisfies ErrorResponse, { status: 400 })
  }

  const historyMessages = body.history.slice(-6)
  const allMessages: ChatMessage[] = [...historyMessages, { role: 'user', content: body.message }]

  let rawText: string

  if (provider === 'groq') {
    const groqKey = readGroqApiKey()
    if (!groqKey) {
      return Response.json(
        { error: 'Free AI is not configured. Use Claude or ILMU (BYOK) instead.' } satisfies ErrorResponse,
        { status: 503 }
      )
    }
    const groqMessages = allMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
    const aiResult = await callGroq(CHAT_SYSTEM_PROMPT, groqMessages, groqKey, 500)
    if ('error' in aiResult) {
      return Response.json({ error: aiResult.error } satisfies ErrorResponse, { status: aiResult.status })
    }
    rawText = aiResult.text
  } else {
    const byok: ByokProvider = isByokProvider(provider) ? provider : 'anthropic'
    const keyError = validateByokKey(byok, apiKey)
    if (keyError) {
      return Response.json({ error: keyError } satisfies ErrorResponse, { status: 400 })
    }
    const aiResult = await callByokChatMessages(
      byok,
      apiKey,
      CHAT_SYSTEM_PROMPT,
      allMessages,
      500,
      readGatewayBase()
    )
    if ('error' in aiResult) {
      return Response.json({ error: aiResult.error } satisfies ErrorResponse, { status: aiResult.status })
    }
    rawText = aiResult.text
  }

  const parsed = parseAIJson<ChatJson>(rawText)
  const reply = parsed?.reply ?? rawText
  const youtubeQuery = parsed?.youtubeQuery ?? 'AWS Solutions Architect tutorial'
  const docsSearchPhrase = buildDocsSearchPhrase([
    parsed?.docsSearchPhrase ?? '',
    body.message,
    reply.slice(0, 120),
  ])

  const awsDoc = await resolveAwsDocLink(docsSearchPhrase, ['general'])

  return Response.json({
    reply,
    awsDocsUrl: awsDoc.url,
    awsDocsTitle: awsDoc.title,
    youtubeQuery,
  } satisfies ChatResponse)
}
