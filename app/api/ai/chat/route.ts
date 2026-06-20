import { resolveAiProvider } from '@/lib/ai/complete-json'
import { streamChat, type ChatTurn } from '@/lib/ai/stream'
import type { ErrorResponse } from '@/lib/ai/types'

export const runtime = 'edge'

interface ChatRequest {
  message: string
  history: ChatTurn[]
}

const CHAT_SYSTEM_PROMPT = `You are an AWS Solutions Architect study assistant. Answer questions about AWS services, architecture patterns, and exam topics concisely (3-6 sentences, or a short list).

Format every answer as GitHub-flavored Markdown: use **bold**, bullet or numbered lists, tables, and inline \`code\` where they make the answer clearer.

When a visual would help explain an architecture, request flow, or comparison:
- Prefer calling the get_aws_diagram tool to fetch an official AWS image. If it returns status "ok", embed the image with ![title](url) using the exact url it returns. If it returns "not_found", do not invent a URL.
- Otherwise (or on not_found), include a fenced \`\`\`mermaid code block with valid flowchart or sequence-diagram syntax.

Answer directly in Markdown — do not wrap your response in JSON or a code fence.`

export async function POST(request: Request): Promise<Response> {
  const apiKey = request.headers.get('x-api-key') ?? ''
  const provider = resolveAiProvider(request.headers.get('x-ai-provider'), apiKey)

  let body: ChatRequest
  try {
    body = (await request.json()) as ChatRequest
  } catch {
    return Response.json({ error: 'Invalid request body.' } satisfies ErrorResponse, { status: 400 })
  }

  const message = (body.message ?? '').trim()
  if (!message) {
    return Response.json({ error: 'Message is required.' } satisfies ErrorResponse, { status: 400 })
  }

  const history = Array.isArray(body.history) ? body.history.slice(-6) : []
  const messages: ChatTurn[] = [...history, { role: 'user', content: message }]

  // Higher cap than the old 1300 — no JSON envelope to budget for, and tool-use
  // rounds (diagram fetches) add follow-up tokens to a single answer.
  return streamChat({
    provider,
    apiKey,
    systemPrompt: CHAT_SYSTEM_PROMPT,
    messages,
    userMessage: message,
    maxTokens: 2048,
  })
}
