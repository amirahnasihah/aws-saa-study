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
import { callByokMessages } from '@/lib/ai/messages'
import { findNotesUrl } from '@/lib/ai/notes'
import type { ErrorResponse, ExplainResponse } from '@/lib/ai/types'

export const runtime = 'edge'

export type { ExplainResponse } from '@/lib/ai/types'

interface ExplainRequest {
  questionId?: string
  question: string
  userAnswerId?: string
  userAnswerText?: string
  correctAnswerId?: string
  correctAnswerText?: string
  domainLabel?: string
  keywords?: string[]
}

const EXPLAIN_SYSTEM_PROMPT = `You are an AWS Solutions Architect study assistant. Analyze the practice question and respond ONLY with valid JSON (no markdown, no code fences, no extra text). Use exactly this schema:
{"conceptName":"string","focusArea":"string","studyKeywords":["string","string","string"],"explanation":"string","youtubeQuery":"string","docsSearchPhrase":"string"}

Rules:
- conceptName: the specific AWS concept being tested
- focusArea: exam domain and sub-topic
- studyKeywords: exactly 3-5 key AWS terms
- explanation: why correct answer is right (2-3 sentences) + why wrong answers are wrong (1-2 sentences)
- youtubeQuery: a specific YouTube tutorial search query
- docsSearchPhrase: a short phrase to search official AWS documentation for this topic — do NOT invent URLs`

function buildExplainUserPrompt(body: ExplainRequest, notesUrl: string): string {
  const lines: string[] = [`Domain: ${body.domainLabel ?? 'AWS Solutions Architect'}`]
  if (body.keywords?.length) lines.push(`Keywords: ${body.keywords.join(', ')}`)
  lines.push(`\nQuestion: ${body.question}`)
  if (body.correctAnswerText) {
    lines.push(
      `Correct answer: (${(body.correctAnswerId ?? '').toUpperCase()}) ${body.correctAnswerText}`
    )
  }
  if (body.userAnswerText && body.userAnswerText !== body.correctAnswerText) {
    lines.push(
      `User's answer: (${(body.userAnswerId ?? '').toUpperCase()}) ${body.userAnswerText}`
    )
  }
  lines.push(`\nStudy notes URL: ${notesUrl}`)
  return lines.join('\n')
}

interface ExplainJson {
  conceptName?: string
  focusArea?: string
  studyKeywords?: string[]
  explanation?: string
  youtubeQuery?: string
  docsSearchPhrase?: string
}

async function toExplainResponse(
  json: ExplainJson | null,
  rawText: string,
  notesUrl: string,
  searchParts: string[]
): Promise<ExplainResponse> {
  const explanation = json?.explanation ?? rawText
  const docsSearchPhrase = buildDocsSearchPhrase([
    json?.docsSearchPhrase ?? '',
    json?.conceptName ?? '',
    ...(json?.studyKeywords ?? []),
    ...searchParts,
  ])
  const awsDoc = await resolveAwsDocLink(docsSearchPhrase, ['general', 'reference_documentation'])

  return {
    explanation,
    notesUrl,
    awsDocsUrl: awsDoc.url,
    awsDocsTitle: awsDoc.title,
    youtubeQuery: json?.youtubeQuery ?? 'AWS Solutions Architect tutorial',
    conceptName: json?.conceptName ?? '',
    focusArea: json?.focusArea ?? '',
    studyKeywords: json?.studyKeywords ?? [],
  }
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

  let parsed: ExplainRequest
  try {
    parsed = (await request.json()) as ExplainRequest
  } catch {
    return Response.json({ error: 'Invalid request body.' } satisfies ErrorResponse, { status: 400 })
  }

  const keywords = parsed.keywords ?? []
  const notesUrl = findNotesUrl(keywords)
  const userPrompt = buildExplainUserPrompt(parsed, notesUrl)
  const searchParts = [parsed.question, parsed.domainLabel ?? '', keywords.join(' ')]

  if (provider === 'groq') {
    const groqKey = readGroqApiKey()
    if (!groqKey) {
      return Response.json(
        { error: 'Free AI is not configured. Use Claude or ILMU (BYOK) instead.' } satisfies ErrorResponse,
        { status: 503 }
      )
    }
    const aiResult = await callGroq(
      EXPLAIN_SYSTEM_PROMPT,
      [{ role: 'user', content: userPrompt }],
      groqKey,
      600
    )
    if ('error' in aiResult) {
      return Response.json({ error: aiResult.error } satisfies ErrorResponse, { status: aiResult.status })
    }
    const json = parseAIJson<ExplainJson>(aiResult.text)
    return Response.json(await toExplainResponse(json, aiResult.text, notesUrl, searchParts))
  }

  const byok: ByokProvider = isByokProvider(provider) ? provider : 'anthropic'
  const keyError = validateByokKey(byok, apiKey)
  if (keyError) {
    return Response.json({ error: keyError } satisfies ErrorResponse, { status: 400 })
  }

  const aiResult = await callByokMessages(
    byok,
    apiKey,
    EXPLAIN_SYSTEM_PROMPT,
    userPrompt,
    600,
    readGatewayBase()
  )
  if ('error' in aiResult) {
    return Response.json({ error: aiResult.error } satisfies ErrorResponse, { status: aiResult.status })
  }

  const json = parseAIJson<ExplainJson>(aiResult.text)
  return Response.json(await toExplainResponse(json, aiResult.text, notesUrl, searchParts))
}
