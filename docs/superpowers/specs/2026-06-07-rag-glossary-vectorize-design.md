# RAG over Glossary — Vectorize-backed semantic grounding

## Problem

The question explainer (`/api/ai/explain`, surfaced in the practice page's AI Explain drawer and `/ai`'s explainer mode) currently grounds AI explanations using keyword/substring matching: `findDeepNotesMatch` scores a `searchBlob` against terms, `findNotesUrl` does keyword→URL lookup, and `searchAwsDocumentation` hits a live AWS MCP search. None of these do semantic similarity — if a user's question phrases a concept differently from how the glossary names it (e.g. "auto-scaling group" vs. the glossary term "ASG"), the matching misses it even though the app already has a verified, AWS-accurate definition for that exact concept.

This produces lower grounding accuracy than necessary: the AI falls back on its general knowledge instead of the app's own 197 AWS-verified glossary definitions (`data/glossary.ts`) when the wording doesn't line up.

## Goal

Improve grounding accuracy for the **question explainer** by retrieving semantically similar glossary entries — not just keyword matches — and injecting their verified definitions into the explanation prompt as grounding context.

Scope is intentionally narrow:

- **Surface**: question explainer only (not free-form chat, not the visual-page sidebar)
- **Content**: the 197 glossary terms in `data/glossary.ts` only (not deep-notes / `awsServices.ts`, not practice questions)
- **Usage**: retrieved matches are injected into the LLM prompt as grounding context (not surfaced as a separate UI panel)

## Approach

**Cloudflare Vectorize + Workers AI embeddings.**

- A Vectorize index (`glossary-terms`, 768-dim, cosine metric) stores an embedding per glossary term, generated via the Workers AI embedding model `@cf/baai/bge-base-en-v1.5`.
- At explain-time, the user's question is embedded with the same model and used to query the index for the top-K most similar glossary entries.
- Matches above a similarity threshold are appended to the prompt as a "verified glossary context" block, alongside the existing deep-notes/docs grounding.

This was chosen over two alternatives:

- *Precomputed static embeddings with in-Worker cosine similarity* — avoids Cloudflare infra, but ships ~600KB of vectors per request and is slower/lower-quality than a real vector index, for no real reduction in the operational overhead the user already accepted.
- *Hybrid keyword-then-vector re-ranking* — keeps the existing keyword candidate set as a ceiling, so it doesn't actually fix the core problem (semantically related but differently-worded content being missed).

Vectorize + Workers AI directly targets the stated goal (better grounding accuracy), matches the chosen content scope (197 terms is small and cheap to embed), and fits the project's existing Cloudflare-native edge stack (it already uses D1 and Workers AI-adjacent patterns).

## Architecture

- **Vectorize binding**: add `GLOSSARY_INDEX` to `wrangler.jsonc`'s `vectorize` bindings, pointing at a `glossary-terms` index (768-dim, cosine).
- **Retrieval module**: new `lib/ai/glossary-rag.ts`, structured like the existing `lib/ai/deep-notes.ts`:

  ```ts
  export async function findGlossaryMatches(
    query: string,
    env: { AI: Ai; GLOSSARY_INDEX: VectorizeIndex },
    topK = 4
  ): Promise<{ term: string; definition: string; score: number }[]>
  ```

- **Sync script**: `scripts/sync-glossary-embeddings.ts` — offline, one-time backfill plus a documented re-sync step whenever `data/glossary.ts` changes.

## Data flow

**Retrieval (`findGlossaryMatches`)**

1. Embed the user's question via `env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [query] })`.
2. Query `env.GLOSSARY_INDEX.query(vector, { topK, returnMetadata: true })`.
3. Map matches to `{ term, definition, score }` directly from stored vector metadata — no secondary lookup into `glossary.ts` needed at runtime.
4. Filter out matches below a similarity threshold (e.g. `score < 0.6`) to avoid polluting the prompt with weak matches.

**Integration**: in `app/api/ai/explain/route.ts`, call `findGlossaryMatches(question, env)` alongside the existing `findDeepNotesMatch` / `searchAwsDocumentation` calls. Append results to the prompt assembly in `lib/ai/messages.ts` as a distinct grounding block:

```text
Ground your answer in these AWS-verified definitions where relevant:
- SSM: AWS Systems Manager — manage EC2 instances remotely without SSH...
- ...
```

**Sync script flow** (run manually after glossary edits, via `wrangler`)

1. Read `glossary` from `data/glossary.ts`.
2. For each `[term, definition]` pair, embed `"${term}: ${definition}"`.
3. Upsert `{ id: term, values: vector, metadata: { term, definition } }` into the Vectorize index — upserts are idempotent by `id`, so re-runs are safe.
4. Log a summary (count upserted, any per-term failures).

## Error handling

- `findGlossaryMatches` is purely additive grounding. If the embedding call fails, the Vectorize query fails, or the `GLOSSARY_INDEX` binding is missing (e.g. local dev without Vectorize configured), it returns `[]` and logs a warning. The explainer continues to function exactly as it does today — this never blocks or breaks an explanation.
- The sync script fails per-term without aborting the whole run: it logs the failing term and error, continues with the rest, and prints a final summary so partial failures are visible and the script can simply be re-run (upserts are idempotent).

## Testing

- **Unit**: test `findGlossaryMatches` with a mocked `env.AI` / `env.GLOSSARY_INDEX` — verify threshold filtering, `topK` limiting, and graceful `[]` fallback when the binding or query throws.
- **Manual verification**: run the sync script against a preview Vectorize index, then exercise the explainer with questions deliberately phrased differently from glossary term names (e.g. "auto-scaling group" vs. glossary term "ASG") and confirm the semantically correct definition appears in the injected grounding context — something keyword matching would miss.

## Out of scope (for this spec)

- Free-form chat mode and the visual-page sidebar (may get RAG grounding in a future iteration, following the same pattern established here)
- Embedding `data/awsServices.ts` deep-notes or `data/practiceQuestions.ts` content
- A visible "related glossary terms" UI panel — matches are injected into the prompt only, not rendered to the user
