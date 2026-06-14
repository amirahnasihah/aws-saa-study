// Embeds glossary terms + lab content via Workers AI and upserts them into the
// `glossary-rag` Vectorize index via the Cloudflare REST API.
//
// Usage:
//   CF_ACCOUNT_ID=... CF_API_TOKEN=... bun run rag:sync
import { createHash } from 'node:crypto'
import { glossary } from '@/data/glossary'
import { labsCatalog } from '@/data/labsCatalog'

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID
const API_TOKEN = process.env.CF_API_TOKEN
const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5'
const INDEX_NAME = 'glossary-rag'
const BATCH_SIZE = 20

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('CF_ACCOUNT_ID and CF_API_TOKEN env vars are required')
  process.exit(1)
}

type RagRecord = {
  id: string
  type: 'glossary' | 'lab'
  label: string
  content: string
}

type EmbeddingResponse = {
  result: { data: number[][] }
  success: boolean
  errors: unknown[]
}

// Vectorize IDs are capped at 64 bytes, so derive a short stable hash from
// the natural key rather than using terms/slugs directly (some lab slugs
// exceed the limit on their own).
const shortId = (prefix: string, key: string): string =>
  `${prefix}::${createHash('sha256').update(key).digest('hex').slice(0, 16)}`

const buildRecords = (): RagRecord[] => {
  const glossaryRecords: RagRecord[] = Object.entries(glossary).map(([term, definition]) => ({
    id: shortId('glossary', term),
    type: 'glossary',
    label: term,
    content: `${term}: ${definition}`,
  }))

  const labRecords: RagRecord[] = labsCatalog.map((lab) => {
    const stepTitles = lab.tasks.map((task) => task.title).join('; ')
    return {
      id: shortId('lab', lab.slug),
      type: 'lab',
      label: lab.title,
      content: `${lab.title} (${lab.level}, ${lab.duration}). Steps: ${stepTitles}`,
    }
  })

  return [...glossaryRecords, ...labRecords]
}

const embedBatch = async (texts: string[]): Promise<number[][]> => {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${EMBEDDING_MODEL}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: texts }),
    }
  )

  if (!res.ok) {
    throw new Error(`Embedding request failed: ${res.status} ${await res.text()}`)
  }

  const json = (await res.json()) as EmbeddingResponse
  if (!json.success) {
    throw new Error(`Embedding request unsuccessful: ${JSON.stringify(json.errors)}`)
  }

  return json.result.data
}

const upsertBatch = async (
  records: RagRecord[],
  vectors: number[][]
): Promise<void> => {
  const ndjson = records
    .map((record, i) =>
      JSON.stringify({
        id: record.id,
        values: vectors[i],
        metadata: { type: record.type, label: record.label, content: record.content },
      })
    )
    .join('\n')

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/vectorize/v2/indexes/${INDEX_NAME}/upsert`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/x-ndjson',
      },
      body: ndjson,
    }
  )

  if (!res.ok) {
    throw new Error(`Upsert request failed: ${res.status} ${await res.text()}`)
  }
}

const main = async () => {
  const records = buildRecords()
  console.log(`Built ${records.length} records (glossary + labs)`)

  let upserted = 0
  let failed = 0

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE)
    try {
      const vectors = await embedBatch(batch.map((r) => r.content))
      await upsertBatch(batch, vectors)
      upserted += batch.length
      console.log(`Upserted ${upserted}/${records.length}`)
    } catch (err) {
      failed += batch.length
      console.error(`Batch starting at ${i} failed:`, err)
    }
  }

  console.log(`Done. Upserted: ${upserted}, failed: ${failed}`)
}

main()
