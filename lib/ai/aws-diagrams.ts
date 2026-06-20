/**
 * AWS diagram tool — lets the model fetch an official AWS image when a visual
 * would help the learner.
 *
 * Tool-use flow (Anthropic path only):
 *   1. The model emits a `get_aws_diagram` tool call mid-stream.
 *   2. `runAwsDiagramTool` resolves it server-side to a known image URL.
 *   3. The result is fed back into the next model turn, which embeds the URL as
 *      a Markdown image. When no image is known the model falls back to a
 *      ```mermaid diagram (which the app already renders).
 */

export interface AwsDiagram {
  url: string
  title: string
}

/**
 * Curated map of AWS service / topic → an official AWS image you trust.
 * Keys are lowercase. Seeded empty on purpose — extend it with image URLs you
 * have verified resolve (AWS Architecture Icons, or reference-architecture
 * diagrams hosted on docs.aws.amazon.com / d1.awsstatic.com).
 *
 * Example entry:
 *   's3': {
 *     url: 'https://d1.awsstatic.com/.../Amazon-S3.png',
 *     title: 'Amazon S3 architecture',
 *   },
 *
 * Until you add entries, the tool returns `not_found` and the model draws a
 * Mermaid diagram instead — so the chat is never broken, just icon-less.
 */
const AWS_DIAGRAMS: Record<string, AwsDiagram> = {}

/** Resolve a service/topic query to a known AWS image, or null when unseeded. */
export function resolveAwsDiagram(query: string): AwsDiagram | null {
  const key = query.trim().toLowerCase()
  if (!key) return null

  const exact = AWS_DIAGRAMS[key]
  if (exact) return exact

  const looseKey = Object.keys(AWS_DIAGRAMS).find(
    (k) => key.includes(k) || k.includes(key)
  )
  return looseKey ? AWS_DIAGRAMS[looseKey] : null
}

/** Anthropic tool schema for fetching an official AWS diagram/icon. */
export const AWS_DIAGRAM_TOOL = {
  name: 'get_aws_diagram',
  description:
    'Fetch an official AWS architecture diagram or service icon for an AWS service or architecture topic. Call this when a visual would help the learner understand a service, request flow, or comparison. If the result status is "ok", embed result.url in your answer as a Markdown image: ![title](url). If the status is "not_found", do NOT invent an image URL — draw a ```mermaid diagram instead.',
  input_schema: {
    type: 'object',
    properties: {
      service: {
        type: 'string',
        description:
          'AWS service or topic, e.g. "S3", "VPC peering", "Aurora Global Database"',
      },
    },
    required: ['service'],
  },
} as const

interface DiagramToolResult {
  status: 'ok' | 'not_found'
  service: string
  url?: string
  title?: string
  hint?: string
}

/** Run the diagram tool against a model-provided input object. */
export function runAwsDiagramTool(input: unknown): string {
  const service =
    typeof input === 'object' && input !== null && 'service' in input
      ? String((input as { service: unknown }).service ?? '').trim()
      : ''

  const diagram = resolveAwsDiagram(service)
  const result: DiagramToolResult = diagram
    ? { status: 'ok', service, url: diagram.url, title: diagram.title }
    : {
        status: 'not_found',
        service,
        hint: 'No official AWS image is available for this topic. Render a mermaid diagram instead.',
      }
  return JSON.stringify(result)
}
