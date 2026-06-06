import { buildDocsSearchPhrase, resolveAwsDocLink } from '@/lib/ai/aws-knowledge'
import { completeChatMessages, resolveAiProvider } from '@/lib/ai/complete-json'
import { parseAIJson } from '@/lib/ai/json'
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

export async function POST(request: Request): Promise<Response> {
  const apiKey = request.headers.get('x-api-key') ?? ''
  const provider = resolveAiProvider(request.headers.get('x-ai-provider'), apiKey)

  let body: ChatRequest
  try {
    body = (await request.json()) as ChatRequest
  } catch {
    return Response.json({ error: 'Invalid request body.' } satisfies ErrorResponse, { status: 400 })
  }

  const historyMessages = body.history.slice(-6)
  const allMessages: ChatMessage[] = [...historyMessages, { role: 'user', content: body.message }]

  const aiResult = await completeChatMessages(
    provider,
    apiKey,
    CHAT_SYSTEM_PROMPT,
    allMessages,
    500
  )

  if ('error' in aiResult) {
    return Response.json({ error: aiResult.error } satisfies ErrorResponse, { status: aiResult.status })
  }

  const parsed = parseAIJson<ChatJson>(aiResult.text)
  const reply = parsed?.reply ?? aiResult.text
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
