import { buildDocsSearchPhrase, resolveAwsDocLink } from '@/lib/ai/aws-knowledge'
import { completeJson, resolveAiProvider } from '@/lib/ai/complete-json'
import { parseAIJson } from '@/lib/ai/json'
import { findNotesUrl } from '@/lib/ai/notes'
import type { ErrorResponse, HintResponse } from '@/lib/ai/types'

export const runtime = 'edge'

interface HintRequest {
  question: string
  domainLabel?: string
  keywords?: string[]
  options?: Array<{ id: string; text: string }>
  reviewMode?: boolean
}

const HINT_SYSTEM_PROMPT = `You are an AWS Solutions Architect study coach helping a student BEFORE they pick an MCQ answer.

Respond ONLY with valid JSON (no markdown, no code fences):
{"conceptName":"string","focusArea":"string","studyKeywords":["string","string","string"],"whatItsAsking":"string","howToTackle":"string","docsSearchPhrase":"string"}

Rules:
- conceptName: the AWS concept being tested (one short sentence)
- focusArea: exam domain → sub-topic
- studyKeywords: 3-5 chips to scan for in the question
- whatItsAsking: what the question is really asking for (2-3 sentences, plain language)
- howToTackle: how to approach eliminating wrong answers (2-4 short sentences; no letter labels like "choose C")
- docsSearchPhrase: phrase to find the official AWS doc page
- NEVER state which MCQ option is correct or name a winning answer letter
- Do not mention YouTube or video tutorials`

interface HintJson {
  conceptName?: string
  focusArea?: string
  studyKeywords?: string[]
  whatItsAsking?: string
  howToTackle?: string
  docsSearchPhrase?: string
}

function buildHintUserPrompt(body: HintRequest, notesUrl: string): string {
  const lines: string[] = [`Domain: ${body.domainLabel ?? 'AWS Solutions Architect'}`]
  if (body.keywords?.length) lines.push(`Keywords from question bank: ${body.keywords.join(', ')}`)
  if (body.reviewMode) {
    lines.push('\nMode: review — student sees the solution later; still do not reveal the correct option letter.')
  }
  lines.push(`\nQuestion:\n${body.question}`)
  if (body.options?.length) {
    lines.push('\nAnswer choices (for context only — do not reveal which is correct):')
    body.options.forEach((opt) => {
      lines.push(`(${opt.id.toUpperCase()}) ${opt.text}`)
    })
  }
  lines.push(`\nStudy notes: ${notesUrl}`)
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

  const aiResult = await completeJson(provider, apiKey, HINT_SYSTEM_PROMPT, userPrompt, 550)
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
    studyKeywords: json?.studyKeywords ?? [],
    whatItsAsking: json?.whatItsAsking ?? aiResult.text,
    howToTackle: json?.howToTackle ?? '',
    notesUrl,
    awsDocsUrl: awsDoc.url,
    awsDocsTitle: awsDoc.title,
  }

  return Response.json(result)
}
