const AWS_KNOWLEDGE_MCP_URL = 'https://knowledge-mcp.global.api.aws'
const SEARCH_TOOL = 'aws___search_documentation'
const DOCS_HOME = 'https://docs.aws.amazon.com'

interface McpSearchHit {
  rank_order: number
  title: string
  url: string
  context: string
}

export interface AwsDocLink {
  url: string
  title: string
}

function parseSearchHits(text: string): McpSearchHit[] {
  try {
    const parsed = JSON.parse(text) as { content?: { result?: McpSearchHit[] } }
    return parsed.content?.result ?? []
  } catch {
    return []
  }
}

function pickBestHit(hits: McpSearchHit[]): AwsDocLink | null {
  const sorted = [...hits].sort((a, b) => a.rank_order - b.rank_order)
  const fromDocs = sorted.find((h) => h.url.startsWith('https://docs.aws.amazon.com/'))
  const chosen = fromDocs ?? sorted.find((h) => h.url.startsWith('https://'))
  if (!chosen?.url) return null
  return { url: chosen.url, title: chosen.title || 'AWS Documentation' }
}

export async function searchAwsDocumentation(
  searchPhrase: string,
  topics: string[] = ['general'],
  limit = 3
): Promise<AwsDocLink | null> {
  const phrase = searchPhrase.trim()
  if (!phrase) return null

  let res: Response
  try {
    res = await fetch(AWS_KNOWLEDGE_MCP_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: SEARCH_TOOL,
          arguments: {
            search_phrase: phrase,
            topics: topics.slice(0, 3),
            limit,
          },
        },
      }),
    })
  } catch {
    return null
  }

  if (!res.ok) return null

  interface McpRpc {
    result?: {
      isError?: boolean
      content?: Array<{ type: string; text: string }>
    }
  }

  let rpc: McpRpc
  try {
    rpc = (await res.json()) as McpRpc
  } catch {
    return null
  }

  if (rpc.result?.isError) return null
  const textBlock = rpc.result?.content?.find((c) => c.type === 'text')?.text
  if (!textBlock) return null

  const hits = parseSearchHits(textBlock)
  return pickBestHit(hits)
}

export function buildDocsSearchPhrase(parts: string[]): string {
  return parts
    .map((p) => p.trim())
    .filter(Boolean)
    .join(' ')
    .slice(0, 240)
}

export const AWS_DOCS_FALLBACK: AwsDocLink = {
  url: DOCS_HOME,
  title: 'AWS Documentation',
}

export async function resolveAwsDocLink(
  searchPhrase: string,
  topics?: string[]
): Promise<AwsDocLink> {
  const found = await searchAwsDocumentation(searchPhrase, topics)
  return found ?? AWS_DOCS_FALLBACK
}
