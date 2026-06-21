# Cloudflare Pages deploy checklist

Use this when `/api/ai/*` returns **503** on a deployed URL (including PR preview URLs like `addition-i49-….pages.dev`).

## Why 503 happens

Free AI uses a server-side fallback chain: **ILMU → NVIDIA → Gemini**. If all three keys are empty in Cloudflare, the API returns:

```json
{ "error": "Free AI is unavailable right now. Try BYOK (OpenRouter, Ollama)." }
```

Local dev works because keys live in `.dev.vars` (gitignored). Cloudflare does **not** read that file automatically.

## wrangler.jsonc vs Dashboard (read this)

This project uses `wrangler.jsonc`. Cloudflare shows:

> *Environment variables for this project are being managed through wrangler.toml. Only **Secrets** (encrypted variables) can be managed via the Dashboard.*

That means:

| Type in Dashboard | Works? | Notes |
| --- | --- | --- |
| **Secret** (encrypted) | Yes | Use this for all API keys |
| **Plaintext** variable | No | Ignored — names may show with empty values |

**Do not** add API keys as Plaintext in the dashboard.  
**Do not** put API keys in `wrangler.jsonc` `vars` (empty strings override secrets).

API keys must be **Secrets** only — dashboard or CLI.

## Required secrets

Set in **Cloudflare Dashboard → Workers & Pages → aws-saa-study → Settings → Variables and Secrets**.

Click **Add** → choose **Secret** (not Plaintext).

| Secret name | Required | Where to get the key |
| --- | --- | --- |
| `ILMU_API_KEY` | At least one of the three | [console.ilmu.ai](https://console.ilmu.ai) — `sk-…` |
| `NVIDIA_API_KEY` | At least one of the three | [build.nvidia.com](https://build.nvidia.com) — `nvapi-…` |
| `GEMINI_API_KEY` | At least one of the three | Google AI Studio — `AIza…` |
| `GROQ_API_KEY` | Optional (legacy Groq provider) | [console.groq.com](https://console.groq.com) — `gsk_…` |
| `AI_GATEWAY_BASE_URL` | Optional (Anthropic BYOK via CF AI Gateway) | Secret or leave unset |

**Minimum:** one of `ILMU_API_KEY`, `NVIDIA_API_KEY`, or `GEMINI_API_KEY`.  
**Recommended:** **ILMU + GEMINI** (matches local `.dev.vars`).

## Preview vs Production

PR preview URLs use the **Preview** environment. Production uses **Production**.

Set the same secrets on **both** tabs, or preview URLs will still 503.

## Setup steps (dashboard)

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **aws-saa-study**.
2. **Settings** → **Variables and Secrets**.
3. Delete any **Plaintext** rows for API keys (they do nothing).
4. **Add** → **Secret** — for **Preview** and **Production**:
   - `ILMU_API_KEY` — paste from `.dev.vars`
   - `GEMINI_API_KEY` — paste from `.dev.vars`
   - (Optional) `NVIDIA_API_KEY`
5. **Save**.
6. **Redeploy** (Retry deployment) — secrets apply on next deployment.

## Setup steps (CLI)

Wrangler is not global — use `bunx`:

```bash
bunx wrangler login

# Prompts for value — paste from .dev.vars
bunx wrangler pages secret put ILMU_API_KEY --project-name aws-saa-study
bunx wrangler pages secret put GEMINI_API_KEY --project-name aws-saa-study
bunx wrangler pages secret put NVIDIA_API_KEY --project-name aws-saa-study

bun run deploy
```

For Preview secrets, use the dashboard **Preview** tab when adding secrets.

## Verify after deploy

```bash
curl -s -X POST "https://YOUR-DEPLOY-URL/api/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"What is S3?","history":[]}' | head -c 200
```

Expected: HTTP **200** with `"reply"` in JSON.

## Local dev secrets

Copy `.dev.vars.example` to `.dev.vars` with the same secret names. Wrangler reads this during local dev.

Never commit `.dev.vars` or `.env` with real keys.

## Worker size (free plan 3 MiB)

Cloudflare Pages bundles all `@cloudflare/next-on-pages` function chunks into one Worker. The **free plan limit is 3 MiB (gzip)**.

If deploy fails with `Worker exceeded the size limit of 3 MiB`:

1. Run `bun run pages:build` locally and check sizes:
   ```bash
   find .vercel/output/static/_worker.js -name "*.func.js" -exec sh -c 'echo "$(gzip -c "$1" | wc -c) $1"' _ {} \; | sort -rn
   ```
2. This repo keeps AI link indexes compact (`data/labsLinkIndex.ts`, `data/deepNotesLinkIndex.ts`) via `scripts/generate-ai-link-indexes.ts` — **do not** import full `labsCatalog` / `awsServices` from edge API routes.
3. Mermaid loads client-only (`next/dynamic` with `ssr: false`) so it is not in the Worker bundle.
4. If still over limit: upgrade to Workers Paid ($5/mo) for **10 MiB**, or split heavy API routes to a separate Worker.

`bun run deploy` runs the index generator before build automatically.

## D1 binding

The `DB` binding is in `wrangler.jsonc` — no manual env var needed.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Dashboard says "managed through wrangler.toml" | Add **Secret**, not Plaintext |
| Plaintext rows show empty values | Delete them; they are ignored |
| 503 on preview URL only | Add secrets under **Preview** |
| 503 after adding secrets | Retry deployment |
| `wrangler: command not found` | Use `bunx wrangler` not `wrangler` |
| CF build fails on `account_id` | Pages `wrangler.jsonc` must **not** include `account_id` — use `CLOUDFLARE_ACCOUNT_ID` env locally if needed |
