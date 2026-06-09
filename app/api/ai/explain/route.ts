import { buildDocsSearchPhrase, resolveAwsDocLink } from '@/lib/ai/aws-knowledge'
import { completeJson, resolveAiProvider } from '@/lib/ai/complete-json'
import { findInternalLinks } from '@/lib/ai/internal-links'
import { parseAIJson } from '@/lib/ai/json'
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

const EXPLAIN_SYSTEM_PROMPT = `You are an AWS Solutions Architect study assistant. Analyze the practice question AFTER the student answered.

Respond ONLY with valid JSON (no markdown, no code fences):
{"conceptName":"string","focusArea":"string","studyKeywords":["string","string","string"],"explanation":"string","docsSearchPhrase":"string"}

Rules:
- conceptName: the specific AWS concept being tested
- focusArea: exam domain and sub-topic
- studyKeywords: exactly 3-5 key AWS terms
- explanation: why correct answer is right (2-3 sentences) + why wrong answers were wrong (1-2 sentences)
- docsSearchPhrase: phrase to search official AWS documentation
- Do not mention YouTube`

interface ExplainJson {
  conceptName?: string
  focusArea?: string
  studyKeywords?: string[]
  explanation?: string
  docsSearchPhrase?: string
}

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

async function toExplainResponse(
  json: ExplainJson | null,
  rawText: string,
  notesUrl: string,
  searchParts: string[]
): Promise<ExplainResponse> {
  const docsSearchPhrase = buildDocsSearchPhrase([
    json?.docsSearchPhrase ?? '',
    json?.conceptName ?? '',
    ...(json?.studyKeywords ?? []),
    ...searchParts,
  ])
  const [awsDoc, internalLinks] = await Promise.all([
    resolveAwsDocLink(docsSearchPhrase, ['general', 'reference_documentation']),
    Promise.resolve(findInternalLinks([...searchParts, ...(json?.studyKeywords ?? [])])),
  ])

  return {
    explanation: json?.explanation ?? rawText,
    notesUrl,
    awsDocsUrl: awsDoc.url,
    awsDocsTitle: awsDoc.title,
    conceptName: json?.conceptName ?? '',
    focusArea: json?.focusArea ?? '',
    studyKeywords: json?.studyKeywords ?? [],
    internalLinks,
  }
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = request.headers.get('x-api-key') ?? ''
  const provider = resolveAiProvider(request.headers.get('x-ai-provider'), apiKey)

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

  const aiResult = await completeJson(provider, apiKey, EXPLAIN_SYSTEM_PROMPT, userPrompt, 600)
  if ('error' in aiResult) {
    return Response.json({ error: aiResult.error } satisfies ErrorResponse, { status: aiResult.status })
  }

  const json = parseAIJson<ExplainJson>(aiResult.text)
  return Response.json(await toExplainResponse(json, aiResult.text, notesUrl, searchParts))
}
