import { completeJson } from '@/lib/ai/complete-json'
import { findInternalLinks } from '@/lib/ai/internal-links'
import { parseAIJson } from '@/lib/ai/json'
import { searchAwsMultipleLinks, buildDocsSearchPhrase } from '@/lib/ai/aws-knowledge'
import { formatRagContext, queryRag } from '@/lib/ai/rag'

export const runtime = 'edge'

const SYSTEM_NODE = `You are an AWS Solutions Architect exam tutor. Analyze a specific AWS service as it appears in an architecture diagram.

Respond ONLY with valid JSON — no markdown, no code fences, no explanation outside the JSON:
{
  "whatItDoes": "2-3 sentences: what this service is and why it is used specifically in this architecture",
  "trafficFlow": ["short step 1", "short step 2", "short step 3", "short step 4"],
  "examRelevance": "1-2 sentences on why this service matters for SAA-C03 and which domain it falls under",
  "examTraps": ["short exam trap or common mistake 1", "short exam trap or common mistake 2", "short exam trap 3"]
}

Write the human-readable string VALUES in the same language as the user's question/context (Malay or English); default to English if unclear. Keep JSON keys, AWS service names, and technical terms in English.`

const SYSTEM_DIAGRAM = `You are an AWS Solutions Architect exam tutor. Analyze an AWS architecture pattern.

Respond ONLY with valid JSON — no markdown, no code fences, no explanation outside the JSON:
{
  "whatItDoes": "2-3 sentences: what this architecture does and what problem it solves",
  "trafficFlow": ["short step 1 of the data flow", "short step 2", "short step 3", "short step 4"],
  "examRelevance": "1-2 sentences on what SAA-C03 domain this demonstrates and why it appears on the exam",
  "examTraps": ["short exam trap or common mistake 1", "short exam trap 2", "short exam trap 3"]
}

Write the human-readable string VALUES in the same language as the user's question/context (Malay or English); default to English if unclear. Keep JSON keys, AWS service names, and technical terms in English.`

export interface ExplainSections {
  whatItDoes: string
  trafficFlow: string[]
  examRelevance: string
  examTraps: string[]
  awsDocs?: Array<{ url: string; title: string }>
  internalLinks?: import('@/lib/ai/internal-links').InternalLink[]
}

interface ExplainArchRequest {
  title: string
  description: string
  domain: string
  tags: string[]
  nodeLabels: string[]
  focusNode?: string
}

export async function POST(request: Request): Promise<Response> {
  let body: ExplainArchRequest
  try {
    body = (await request.json()) as ExplainArchRequest
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!body.title?.trim()) {
    return Response.json({ error: 'Missing architecture title.' }, { status: 400 })
  }

  const system = body.focusNode ? SYSTEM_NODE : SYSTEM_DIAGRAM

  // run AI explanation + AWS docs search + RAG retrieval in parallel
  const searchTerm = buildDocsSearchPhrase([
    body.focusNode ?? body.title,
    body.domain,
    'SAA-C03',
  ])

  const searchTerms = [body.focusNode ?? body.title, body.domain, ...body.tags, ...body.nodeLabels]
  const internalLinks = findInternalLinks(searchTerms)
  const ragQuery = [body.focusNode ?? body.title, body.domain, ...body.tags].filter(Boolean).join(' ')

  const [awsDocs, ragEntries] = await Promise.all([
    searchAwsMultipleLinks(searchTerm, ['general', 'reference_documentation'], 3),
    queryRag(ragQuery, 5),
  ])

  const userPrompt = [
    `Architecture: ${body.title}`,
    `Domain: ${body.domain}`,
    body.tags.length ? `Tags: ${body.tags.join(', ')}` : '',
    `Description: ${body.description}`,
    body.nodeLabels.length ? `All components: ${body.nodeLabels.join(', ')}` : '',
    body.focusNode ? `Focus service: ${body.focusNode}` : '',
    formatRagContext(ragEntries),
  ]
    .filter(Boolean)
    .join('\n')

  const result = await completeJson('free', '', system, userPrompt, 500)

  if ('error' in result) {
    return Response.json({ error: result.error }, { status: result.status })
  }

  const parsed = parseAIJson<ExplainSections>(result.text)
  if (parsed?.whatItDoes) {
    return Response.json({ ...parsed, awsDocs, internalLinks })
  }

  return Response.json({ fallbackText: result.text, awsDocs, internalLinks })
}
