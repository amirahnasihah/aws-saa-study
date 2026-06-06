import { completeJson } from '@/lib/ai/complete-json'
import { parseAIJson } from '@/lib/ai/json'
import { searchAwsMultipleLinks, buildDocsSearchPhrase } from '@/lib/ai/aws-knowledge'

export const runtime = 'edge'

const SYSTEM_NODE = `You are an AWS Solutions Architect exam tutor. Analyze a specific AWS service as it appears in an architecture diagram.

Respond ONLY with valid JSON — no markdown, no code fences, no explanation outside the JSON:
{
  "whatItDoes": "2-3 sentences: what this service is and why it is used specifically in this architecture",
  "trafficFlow": ["short step 1", "short step 2", "short step 3", "short step 4"],
  "examRelevance": "1-2 sentences on why this service matters for SAA-C03 and which domain it falls under",
  "examTraps": ["short exam trap or common mistake 1", "short exam trap or common mistake 2", "short exam trap 3"]
}`

const SYSTEM_DIAGRAM = `You are an AWS Solutions Architect exam tutor. Analyze an AWS architecture pattern.

Respond ONLY with valid JSON — no markdown, no code fences, no explanation outside the JSON:
{
  "whatItDoes": "2-3 sentences: what this architecture does and what problem it solves",
  "trafficFlow": ["short step 1 of the data flow", "short step 2", "short step 3", "short step 4"],
  "examRelevance": "1-2 sentences on what SAA-C03 domain this demonstrates and why it appears on the exam",
  "examTraps": ["short exam trap or common mistake 1", "short exam trap 2", "short exam trap 3"]
}`

export interface ExplainSections {
  whatItDoes: string
  trafficFlow: string[]
  examRelevance: string
  examTraps: string[]
  awsDocs?: Array<{ url: string; title: string }>
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

  const userPrompt = [
    `Architecture: ${body.title}`,
    `Domain: ${body.domain}`,
    body.tags.length ? `Tags: ${body.tags.join(', ')}` : '',
    `Description: ${body.description}`,
    body.nodeLabels.length ? `All components: ${body.nodeLabels.join(', ')}` : '',
    body.focusNode ? `Focus service: ${body.focusNode}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  // run AI explanation + AWS docs search in parallel
  const searchTerm = buildDocsSearchPhrase([
    body.focusNode ?? body.title,
    body.domain,
    'SAA-C03',
  ])

  const [result, awsDocs] = await Promise.all([
    completeJson('free', '', system, userPrompt, 500),
    searchAwsMultipleLinks(searchTerm, ['general', 'reference_documentation'], 3),
  ])

  if ('error' in result) {
    return Response.json({ error: result.error }, { status: result.status })
  }

  const parsed = parseAIJson<ExplainSections>(result.text)
  if (parsed?.whatItDoes) {
    return Response.json({ ...parsed, awsDocs })
  }

  return Response.json({ fallbackText: result.text, awsDocs })
}
