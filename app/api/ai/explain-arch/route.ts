import { completeJson } from '@/lib/ai/complete-json'

export const runtime = 'edge'

const SYSTEM = `You are an AWS Solutions Architect exam tutor. Explain this AWS architecture diagram to a student preparing for the SAA-C03 certification.

Write exactly three paragraphs, each separated by a blank line:

Paragraph 1: What this architecture does and what problem it solves. 2-3 sentences.
Paragraph 2: How the key components work together. Walk through the data or traffic flow, naming the specific AWS services involved.
Paragraph 3: When to use this pattern, its main trade-offs, and which SAA-C03 domain (security, resilience, performance, or cost-optimization) it demonstrates.

Write in direct, clear prose. No markdown. No bullet points. No headers. Keep each paragraph to 3-4 sentences.`

interface ExplainArchRequest {
  title: string
  description: string
  domain: string
  tags: string[]
  nodeLabels: string[]
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

  const userPrompt = [
    `Architecture: ${body.title}`,
    `Domain: ${body.domain}`,
    body.tags.length ? `Tags: ${body.tags.join(', ')}` : '',
    `Description: ${body.description}`,
    body.nodeLabels.length ? `Components: ${body.nodeLabels.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const result = await completeJson('free', '', SYSTEM, userPrompt, 520)

  if ('error' in result) {
    return Response.json({ error: result.error }, { status: result.status })
  }

  return Response.json({ text: result.text })
}
