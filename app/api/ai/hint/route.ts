import { buildDocsSearchPhrase, resolveAwsDocLink } from '@/lib/ai/aws-knowledge'
import { completeJson, resolveAiProvider } from '@/lib/ai/complete-json'
import { toBulletList } from '@/lib/ai/hint-bullets'
import { parseAIJson } from '@/lib/ai/json'
import { findNotesUrl } from '@/lib/ai/notes'
import type { ErrorResponse, HintResponse } from '@/lib/ai/types'

export const runtime = 'edge'

interface HintRequest {
  questionId?: string
  question: string
  domainLabel?: string
  keywords?: string[]
  options?: Array<{ id: string; text: string }>
  reviewMode?: boolean
}

const HINT_SYSTEM_PROMPT = `You are an AWS SAA study coach. The student has NOT answered yet.

Respond ONLY with valid JSON (no markdown):
{"conceptName":"string","focusArea":"string","studyKeywords":["string"],"whatItsAsking":["string"],"howToTackle":["string"],"docsSearchPhrase":"string"}

Be extremely concise:
- conceptName: one short phrase (max 10 words)
- focusArea: "Domain → sub-topic" (max 8 words)
- studyKeywords: exactly 3-4 terms that appear or imply in the question stem
- whatItsAsking: 2 bullets only, max 12 words each — what the question really wants
- howToTackle: 2-3 bullets only, max 14 words each — how to eliminate wrong options (no answer letters)
- docsSearchPhrase: AWS doc search phrase
- NEVER reveal the correct MCQ option or letter
- No YouTube`

interface HintJson {
  conceptName?: string
  focusArea?: string
  studyKeywords?: string[]
  whatItsAsking?: string[] | string
  howToTackle?: string[] | string
  docsSearchPhrase?: string
}

function buildHintUserPrompt(body: HintRequest, notesUrl: string): string {
  const lines: string[] = [`Domain: ${body.domainLabel ?? 'AWS Solutions Architect'}`]
  if (body.keywords?.length) lines.push(`Bank keywords: ${body.keywords.join(', ')}`)
  if (body.reviewMode) {
    lines.push('Mode: review — do not name the correct option letter.')
  }
  lines.push(`\nQuestion:\n${body.question}`)
  if (body.options?.length) {
    lines.push('\nChoices (context only):')
    body.options.forEach((opt) => {
      lines.push(`(${opt.id.toUpperCase()}) ${opt.text}`)
    })
  }
  lines.push(`\nNotes: ${notesUrl}`)
  return lines.join('\n')
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = request.headers.get('x-api-key') ?? ''
  const provider = resolveAiProvider(request.headers.get('x-ai-provider'), apiKey)

  let parsed: HintRequest
  try {
    parsed = (await request.json()) as HintRequest
  } catch {
    return Response.json({ error: 'Invalid request body.' } satisfies ErrorResponse, { status: 400 })
  }

  const keywords = parsed.keywords ?? []
  const notesUrl = findNotesUrl(keywords)
  const userPrompt = buildHintUserPrompt(parsed, notesUrl)

  const aiResult = await completeJson(provider, apiKey, HINT_SYSTEM_PROMPT, userPrompt, 380)
  if ('error' in aiResult) {
    return Response.json({ error: aiResult.error } satisfies ErrorResponse, { status: aiResult.status })
  }

  const json = parseAIJson<HintJson>(aiResult.text)
  const docsSearchPhrase = buildDocsSearchPhrase([
    json?.docsSearchPhrase ?? '',
    json?.conceptName ?? '',
    ...(json?.studyKeywords ?? []),
    parsed.question,
    parsed.domainLabel ?? '',
    keywords.join(' '),
  ])
  const awsDoc = await resolveAwsDocLink(docsSearchPhrase, ['general', 'reference_documentation'])

  const result: HintResponse = {
    conceptName: json?.conceptName ?? 'AWS concept',
    focusArea: json?.focusArea ?? '',
    studyKeywords: (json?.studyKeywords ?? []).slice(0, 4),
    whatItsAsking: toBulletList(json?.whatItsAsking, 2),
    howToTackle: toBulletList(json?.howToTackle, 3),
    notesUrl,
    awsDocsUrl: awsDoc.url,
    awsDocsTitle: awsDoc.title,
  }

  return Response.json(result)
}
