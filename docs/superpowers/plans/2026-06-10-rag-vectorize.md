# RAG Grounding via Cloudflare Vectorize — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ground AI explanations in the app's own AWS-verified content (197 glossary terms + 109 labs) by retrieving semantically similar entries from a Cloudflare Vectorize index before calling the LLM — replacing pure keyword matching with vector similarity.

**Architecture:** A single Vectorize index (`glossary-rag`, 768-dim cosine) stores embeddings for glossary terms (`type: glossary`) and lab summaries (`type: lab`), generated offline via the Workers AI REST API. At runtime, `lib/ai/rag.ts` embeds the user query via the `AI` Workers-AI binding, queries `GLOSSARY_INDEX`, and returns top-K matches above a 0.6 similarity threshold. The `/api/ai/explain` and `/api/ai/explain-arch` routes call this helper and prepend matched definitions to the LLM prompt as grounding context. Falls back to `[]` silently on any error so no AI surface breaks.

**Tech Stack:** Cloudflare Vectorize v2, Workers AI `@cf/baai/bge-base-en-v1.5` (768-dim), Cloudflare REST API (offline sync only), Bun, TypeScript

---

## File map

| File | Action | Purpose |
|---|---|---|
| `wrangler.jsonc` | Modify | Add `vectorize` + `ai` bindings |
| `worker-configuration.d.ts` | Modify | Add `AI: Ai` and `GLOSSARY_INDEX: VectorizeIndex` to `CloudflareEnv` |
| `lib/ai/rag.ts` | **Create** | Runtime retrieval — `queryRag()` + `formatRagContext()` |
| `scripts/sync-rag-index.ts` | **Create** | Offline sync: embed 197 glossary + 109 labs, upsert to Vectorize |
| `app/api/ai/explain/route.ts` | Modify | Call `queryRag('glossary')`, inject context into prompt |
| `app/api/ai/explain-arch/route.ts` | Modify | Call `queryRag()` (both types), inject context into prompt |
| `package.json` | Modify | Add `rag:sync` script |

---

### Task 1: Create the Vectorize index and add bindings

**Files:**

- Modify: `wrangler.jsonc`
- Modify: `worker-configuration.d.ts`

- [ ] **Step 1: Create the Vectorize index**

```bash
bunx wrangler vectorize create glossary-rag --dimensions=768 --metric=cosine
```

Expected output contains:
```
✅ Successfully created a new Vectorize index: 'glossary-rag'
```

- [ ] **Step 2: Verify the index exists**

```bash
bunx wrangler vectorize list
```

Expected: shows `glossary-rag` with dimensions=768, metric=cosine.

- [ ] **Step 3: Update `wrangler.jsonc` to add bindings**

Replace the full file content with:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "aws-saa-study",
  "compatibility_date": "2026-05-19",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": ".vercel/output/static",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "aws-saa-questions",
      "database_id": "fcd5855c-4ff3-4c38-a1c0-3e5e94d1a5ba"
    }
  ],
  "vectorize": [
    {
      "binding": "GLOSSARY_INDEX",
      "index_name": "glossary-rag"
    }
  ],
  "ai": {
    "binding": "AI"
  }
  // AI keys are Secrets — NOT vars here (empty vars blocked dashboard + broke /api/ai/*).
  // Set via CF Dashboard → Settings → Variables → Add → Secret (Preview + Production).
  // Or: bunx wrangler pages secret put ILMU_API_KEY --project-name aws-saa-study
  // See docs/deploy-cloudflare.md
}
```

- [ ] **Step 4: Update `worker-configuration.d.ts`**

Replace full file content:

```typescript
interface CloudflareEnv {
  DB: D1Database
  AI: Ai
  GLOSSARY_INDEX: VectorizeIndex
  AI_GATEWAY_BASE_URL: string
  GROQ_API_KEY: string
  GEMINI_API_KEY: string
  ILMU_API_KEY: string
  NVIDIA_API_KEY: string
}
```

- [ ] **Step 5: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add wrangler.jsonc worker-configuration.d.ts
git commit -m "feat: add Vectorize (GLOSSARY_INDEX) and Workers AI bindings"
```

---

### Task 2: Create `lib/ai/rag.ts` — runtime retrieval module

**Files:**

- Create: `lib/ai/rag.ts`

This is called at runtime inside edge routes. It uses `AI` and `GLOSSARY_INDEX` from `CloudflareEnv`. Returns `[]` on any error (missing binding, embedding failure, network issue) so it is purely additive and never blocks a response.

- [ ] **Step 1: Create `lib/ai/rag.ts`**

```typescript
import { getRequestContext } from '@cloudflare/next-on-pages'

export type RagEntry = {
  id: string
  type: 'glossary' | 'lab'
  label: string
  content: string
  score: number
}

const SIMILARITY_THRESHOLD = 0.6

function getRagEnv(): { AI: Ai; GLOSSARY_INDEX: VectorizeIndex } | null {
  try {
    const { env } = getRequestContext()
    const cf = env as CloudflareEnv
    if (!cf.AI || !cf.GLOSSARY_INDEX) return null
    return { AI: cf.AI, GLOSSARY_INDEX: cf.GLOSSARY_INDEX }
  } catch {
    return null
  }
}

export async function queryRag(
  query: string,
  topK = 4,
  type?: 'glossary' | 'lab'
): Promise<RagEntry[]> {
  const env = getRagEnv()
  if (!env) return []

  try {
    const embedded = (await env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [query],
    })) as { data: number[][] }
    const vector = embedded.data[0]
    if (!vector?.length) return []

    const filter = type ? { type: { $eq: type } } : undefined
    const result = await env.GLOSSARY_INDEX.query(vector, {
      topK,
      returnMetadata: 'all',
      filter,
    })

    return result.matches
      .filter((m) => m.score >= SIMILARITY_THRESHOLD && m.metadata)
      .map((m) => ({
        id: m.id,
        type: m.metadata!.type as 'glossary' | 'lab',
        label: m.metadata!.label as string,
        content: m.metadata!.content as string,
        score: m.score,
      }))
  } catch {
    return []
  }
}

export function formatRagContext(entries: RagEntry[]): string {
  if (!entries.length) return ''
  const lines = entries.map((e) => `- ${e.label}: ${e.content}`)
  return `\nAWS-verified reference material (use where relevant):\n${lines.join('\n')}`
}
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/ai/rag.ts
git commit -m "feat: add queryRag() runtime retrieval module for Vectorize"
```

---

### Task 3: Create offline sync script

**Files:**

- Create: `scripts/sync-rag-index.ts`
- Modify: `package.json`

This script runs locally via `bun run rag:sync`. It imports `data/glossary.ts` (197 terms) and `data/labsCatalog.ts` (109 labs), calls the Workers AI REST API to embed each entry in batches of 20, then upserts to the Vectorize v2 REST API. Upserts are idempotent by ID (`glossary::SSM`, `lab::ec2-intro`).

- [ ] **Step 1: Create `scripts/sync-rag-index.ts`**

```typescript
import { glossary } from '../data/glossary'
import { labsCatalog } from '../data/labsCatalog'

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID ?? ''
const API_TOKEN = process.env.CF_API_TOKEN ?? ''
const INDEX_NAME = 'glossary-rag'
const EMBED_MODEL = '@cf/baai/bge-base-en-v1.5'
const BATCH_SIZE = 20

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('Usage: CF_ACCOUNT_ID=<id> CF_API_TOKEN=<token> bun run rag:sync')
  process.exit(1)
}

const cfHeaders = {
  Authorization: `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json',
}

type VectorRecord = {
  id: string
  values: number[]
  metadata: { type: string; label: string; content: string }
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${EMBED_MODEL}`,
    { method: 'POST', headers: cfHeaders, body: JSON.stringify({ text: texts }) }
  )
  if (!res.ok) throw new Error(`Embed failed ${res.status}: ${await res.text()}`)
  const json = (await res.json()) as { result: { data: number[][] } }
  return json.result.data
}

async function upsertBatch(vectors: VectorRecord[]): Promise<void> {
  const ndjson = vectors.map((v) => JSON.stringify(v)).join('\n')
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/vectorize/v2/indexes/${INDEX_NAME}/upsert`,
    {
      method: 'POST',
      headers: { ...cfHeaders, 'Content-Type': 'application/x-ndjson' },
      body: ndjson,
    }
  )
  if (!res.ok) throw new Error(`Upsert failed ${res.status}: ${await res.text()}`)
}

function chunks<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function run() {
  const records: Array<{ text: string; meta: VectorRecord['metadata'] & { id: string } }> = []

  for (const [term, definition] of Object.entries(glossary)) {
    records.push({
      text: `${term}: ${definition}`,
      meta: { id: `glossary::${term}`, type: 'glossary', label: term, content: definition },
    })
  }

  for (const lab of labsCatalog) {
    const takeaways = lab.takeaways.slice(0, 3).join('. ')
    const content = takeaways ? `${lab.summary} Key takeaways: ${takeaways}` : lab.summary
    records.push({
      text: `${lab.title}: ${content}`,
      meta: { id: `lab::${lab.slug}`, type: 'lab', label: lab.title, content },
    })
  }

  console.log(`Syncing ${records.length} records to '${INDEX_NAME}'…`)
  let upserted = 0
  let failed = 0

  for (const batch of chunks(records, BATCH_SIZE)) {
    try {
      const embeddings = await embedBatch(batch.map((r) => r.text))
      const vectors: VectorRecord[] = batch.map((r, i) => ({
        id: r.meta.id,
        values: embeddings[i],
        metadata: { type: r.meta.type, label: r.meta.label, content: r.meta.content },
      }))
      await upsertBatch(vectors)
      upserted += batch.length
      process.stdout.write(`\r  ✓ ${upserted}/${records.length}`)
    } catch (err) {
      console.error(`\n  ✗ batch failed:`, err)
      failed += batch.length
    }
  }

  console.log(`\n\nDone. ${upserted} upserted, ${failed} failed.`)
  if (failed > 0) process.exit(1)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Add `rag:sync` to `package.json` scripts**

In the `"scripts"` block, add after `"pwa:icons"`:

```json
"rag:sync": "bun scripts/sync-rag-index.ts"
```

- [ ] **Step 3: Type-check (script itself doesn't need edge types so just check project)**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add scripts/sync-rag-index.ts package.json
git commit -m "feat: add rag:sync script to embed glossary + labs into Vectorize"
```

---

### Task 4: Run the sync to populate the index

**Prerequisite:** Create a Cloudflare API token at <https://dash.cloudflare.com/profile/api-tokens> with permissions:
- `Vectorize: Edit` (under Account resources)
- `Workers AI: Run` (under Account resources)

Your account ID is `1a172b38ed8312117940a3c976c51637`.

- [ ] **Step 1: Run the sync**

```bash
CF_ACCOUNT_ID=1a172b38ed8312117940a3c976c51637 CF_API_TOKEN=<your-token> bun run rag:sync
```

Expected output:
```
Syncing 306 records to 'glossary-rag'…
  ✓ 306/306

Done. 306 upserted, 0 failed.
```

- [ ] **Step 2: Verify index stats**

```bash
bunx wrangler vectorize info glossary-rag
```

Expected: shows vector count ~306.

---

### Task 5: Wire RAG into `/api/ai/explain`

**Files:**

- Modify: `app/api/ai/explain/route.ts`

The change: call `queryRag` with the question + keywords as the query string, type-filter to `'glossary'` only, then append the formatted context to the user prompt before sending to the LLM.

- [ ] **Step 1: Add import at the top of `app/api/ai/explain/route.ts`**

After the existing imports, add:

```typescript
import { queryRag, formatRagContext } from '@/lib/ai/rag'
```

- [ ] **Step 2: Update `buildExplainUserPrompt` to accept and append `ragContext`**

Replace the current function:

```typescript
function buildExplainUserPrompt(body: ExplainRequest, notesUrl: string, ragContext: string): string {
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
  if (ragContext) lines.push(ragContext)
  return lines.join('\n')
}
```

- [ ] **Step 3: Update the `POST` handler to call `queryRag` and pass context**

Replace the `POST` function body with:

```typescript
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
  const searchParts = [parsed.question, parsed.domainLabel ?? '', keywords.join(' ')]

  const ragQuery = [parsed.question, ...keywords].filter(Boolean).join(' ')
  const ragEntries = await queryRag(ragQuery, 4, 'glossary')
  const ragContext = formatRagContext(ragEntries)

  const userPrompt = buildExplainUserPrompt(parsed, notesUrl, ragContext)

  const aiResult = await completeJson(provider, apiKey, EXPLAIN_SYSTEM_PROMPT, userPrompt, 600)
  if ('error' in aiResult) {
    return Response.json({ error: aiResult.error } satisfies ErrorResponse, { status: aiResult.status })
  }

  const json = parseAIJson<ExplainJson>(aiResult.text)
  return Response.json(await toExplainResponse(json, aiResult.text, notesUrl, searchParts))
}
```

- [ ] **Step 4: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/api/ai/explain/route.ts
git commit -m "feat: inject Vectorize RAG context into question explainer prompt"
```

---

### Task 6: Wire RAG into `/api/ai/explain-arch` (visual page)

**Files:**

- Modify: `app/api/ai/explain-arch/route.ts`

The change: call `queryRag` without a type filter (returns both glossary + lab matches) using the focus node or architecture title + domain + tags as the query, run it in parallel with the existing AWS docs search, and append the formatted context to the userPrompt.

- [ ] **Step 1: Add import at the top of `app/api/ai/explain-arch/route.ts`**

After the existing imports, add:

```typescript
import { queryRag, formatRagContext } from '@/lib/ai/rag'
```

- [ ] **Step 2: Replace the full `POST` function**

```typescript
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

  const ragQuery = [body.focusNode ?? body.title, body.domain, ...body.tags]
    .filter(Boolean)
    .join(' ')

  const searchTerm = buildDocsSearchPhrase([
    body.focusNode ?? body.title,
    body.domain,
    'SAA-C03',
  ])

  const searchTerms = [body.focusNode ?? body.title, body.domain, ...body.tags, ...body.nodeLabels]
  const internalLinks = findInternalLinks(searchTerms)

  const [ragEntries, awsDocs] = await Promise.all([
    queryRag(ragQuery, 5),
    searchAwsMultipleLinks(searchTerm, ['general', 'reference_documentation'], 3),
  ])

  const ragContext = formatRagContext(ragEntries)

  const userPrompt = [
    `Architecture: ${body.title}`,
    `Domain: ${body.domain}`,
    body.tags.length ? `Tags: ${body.tags.join(', ')}` : '',
    `Description: ${body.description}`,
    body.nodeLabels.length ? `All components: ${body.nodeLabels.join(', ')}` : '',
    body.focusNode ? `Focus service: ${body.focusNode}` : '',
    ragContext,
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
```

- [ ] **Step 3: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/ai/explain-arch/route.ts
git commit -m "feat: inject Vectorize RAG context into visual page arch explainer"
```

---

### Task 7: Build, deploy, and verify

- [ ] **Step 1: Build**

```bash
bun run pages:build
```

Expected: no errors. This runs `next build && bunx next-on-pages` and produces the Cloudflare Pages bundle.

- [ ] **Step 2: Deploy**

```bash
bun run deploy
```

Wait for Cloudflare Pages to finish deploying.

- [ ] **Step 3: Verify question explainer (practice page)**

Open the live site. Navigate to `/practice`. Answer any question, then click "Explain". The explanation should reference AWS-verified definitions grounded in your glossary (e.g., if the question is about S3, it should cite definitions like CRR, WORM, SSE-KMS, etc. from your glossary rather than generic model knowledge).

- [ ] **Step 4: Verify visual page arch explainer**

Open `/visual`. Click any node (e.g. "EC2", "RDS", "CloudFront"). Request an explanation. The response should contain `whatItDoes`, `trafficFlow`, `examRelevance`, `examTraps` grounded in your glossary terms and lab knowledge.

- [ ] **Step 5: Final commit if anything was adjusted during verification**

```bash
git add -p
git commit -m "fix: adjust RAG threshold / topK after production verification"
```

---

## Operational notes

- **Re-sync**: run `bun run rag:sync` (with env vars) whenever `data/glossary.ts` or `data/labsCatalog.ts` changes meaningfully. Upserts are idempotent by ID.
- **Threshold tuning**: `SIMILARITY_THRESHOLD = 0.6` in `lib/ai/rag.ts`. Raise to 0.7 if unrelated terms appear in explanations; lower to 0.5 if RAG matches are too sparse for niche questions.
- **topK**: explain uses `topK=4` (glossary only, tight focus); explain-arch uses `topK=5` (both types, broader context). Adjust as needed.
- **Local dev**: `queryRag` returns `[]` silently when `GLOSSARY_INDEX` binding isn't available (plain `next dev`). No breakage — explanations fall back to non-grounded behavior exactly as before.
