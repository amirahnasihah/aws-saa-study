import { getRequestContext } from '@cloudflare/next-on-pages'

const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5'
const SIMILARITY_THRESHOLD = 0.6

export type RagEntryType = 'glossary' | 'lab'

export type RagEntry = {
  type: RagEntryType
  label: string
  content: string
  score: number
}

type VectorizeMetadata = {
  type: RagEntryType
  label: string
  content: string
}

function isRagEntryType(value: unknown): value is RagEntryType {
  return value === 'glossary' || value === 'lab'
}

/**
 * Retrieves the most semantically similar glossary/lab chunks for a query.
 * Returns [] on any binding/embedding/query failure — RAG context is purely
 * additive grounding and must never block an explanation.
 */
export async function queryRag(
  query: string,
  topK = 4,
  type?: RagEntryType
): Promise<RagEntry[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  try {
    const { env } = getRequestContext()
    const { AI, GLOSSARY_INDEX } = env as CloudflareEnv
    if (!AI || !GLOSSARY_INDEX) return []

    const embedding = await AI.run(EMBEDDING_MODEL, { text: [trimmed] })
    const vector = 'data' in embedding ? embedding.data?.[0] : undefined
    if (!vector) return []

    const matches = await GLOSSARY_INDEX.query(vector, {
      topK,
      returnMetadata: true,
      filter: type ? { type: { $eq: type } } : undefined,
    })

    return matches.matches
      .filter((match) => match.score >= SIMILARITY_THRESHOLD)
      .map((match) => {
        const metadata = match.metadata as unknown as VectorizeMetadata | undefined
        if (!metadata || !isRagEntryType(metadata.type)) return null
        return {
          type: metadata.type,
          label: metadata.label,
          content: metadata.content,
          score: match.score,
        }
      })
      .filter((entry): entry is RagEntry => entry !== null)
  } catch (err) {
    console.warn('queryRag failed', err)
    return []
  }
}

/**
 * Formats retrieved entries as a grounding block for the LLM prompt.
 * Returns '' if there are no entries — callers can append unconditionally.
 */
export function formatRagContext(entries: RagEntry[]): string {
  if (entries.length === 0) return ''

  const lines = entries.map((entry) => `- ${entry.label}: ${entry.content}`)
  return [
    'Ground your answer in this AWS-verified content from the site where relevant:',
    ...lines,
  ].join('\n')
}
