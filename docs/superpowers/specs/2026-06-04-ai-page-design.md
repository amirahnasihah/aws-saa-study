# AI Page — Design Spec

**Date:** 2026-06-04
**Status:** Approved

## Problem

The existing "Ask AI" button on the practice page covers one narrow use case: explaining a question after it's revealed. Users also want to ask free-form AWS questions during study, get hints about what a question is testing, and find relevant learning resources (docs, videos) — all in one place with a choice of AI provider.

## Solution

A dedicated `/ai` page with two modes on the same view: free-form AWS chat and question explainer. Dual free-tier plus BYOK support: Groq (free, default), BYOK Claude (Anthropic), and BYOK ILMU Chat (Malaysian-hosted, Anthropic Messages API at `https://api.ilmu.ai/anthropic`). Every response surfaces official AWS docs and a YouTube search link. The question explainer mode additionally gives study-oriented guidance: what concept is being tested, which domain to focus on, and key terms.

---

## Architecture

```
Browser
  └─ /ai page
       ├─ Provider toggle (localStorage: 'aws_study_ai_provider' = 'groq' | 'anthropic' | 'ilmu')
       ├─ Mode selector: 'chat' | 'question'
       │
       ├─ Chat mode → POST /api/ai/chat
       │     body: { message, history[] }
       │     headers: x-api-key (only for anthropic provider)
       │     x-ai-provider: 'groq' | 'anthropic' | 'ilmu'
       │
       └─ Question mode → POST /api/ai/explain  (existing route, extended)
             body: { questionId?, question, userAnswer?, correctAnswer?, domain, keywords }
             headers: x-api-key (only for anthropic), x-ai-provider

Edge Routes (Cloudflare Workers, runtime: 'edge')
  /api/ai/chat    — new route
  /api/ai/explain — existing route, extended with Groq support + richer response
```

**Provider routing** is handled server-side: the `x-ai-provider` header tells the edge route which backend to call. Groq uses `https://api.groq.com/openai/v1/chat/completions` (OpenAI-compatible). Anthropic uses the existing Messages API path (direct or via AI Gateway).

**Groq key** is stored server-side as an environment variable `GROQ_API_KEY` in `wrangler.jsonc` secrets — it is a shared free-tier key, not per-user. No key management UI needed for Groq.

**YouTube links** are not fetched via API. The AI is instructed to output a `youtubeQuery` field; the client constructs `https://www.youtube.com/results?search_query=<encoded>`. No YouTube API key required.

---

## Components

### 1. `/app/ai/page.tsx`
- `'use client'`
- Reads provider from `localStorage` on mount; defaults to `'groq'`
- Contains `AIProviderToggle`, `AIModeSelector`, and conditionally renders `AIChatView` or `AIQuestionView`
- URL param `?questionId=<id>` pre-fills question mode and fetches question data from D1 (or passed as query params)

### 2. `AIProviderToggle` component
- Three-way toggle: "Groq (Free)" | "Claude (My Key)" | "ILMU (My Key)"
- Selecting Claude or ILMU checks for stored key; if absent, opens `AIKeyModal` (provider tabs: Anthropic vs ILMU)
- Persists choice to `localStorage`
- ILMU keys: `sk-` prefix from [console.ilmu.ai](https://console.ilmu.ai/dashboard/usage); routed to `https://api.ilmu.ai/anthropic/v1/messages` with model `nemo-super`

### 3. `AIChatView` component
- Scrollable message history (session only, no persistence)
- Text input + send button
- Shows loading skeleton per message
- Each AI message renders: explanation text + `AISourceLinks` (docs + YouTube)

### 4. `AIQuestionView` component
- Question text display (read-only)
- "Explain this question" button
- Response renders `AIQuestionExplanation` component

### 5. `AIQuestionExplanation` component
Structured response card with sections:
- **What's being tested** — one sentence naming the exact concept
- **Focus area** — domain + sub-topic (e.g. "Resilient Architectures → Multi-AZ failover")
- **Keywords** — 3–5 chip-style tags
- **Explanation** — why correct answer is right, why distractors are wrong (3–5 sentences)
- `AISourceLinks` (docs + YouTube)

### 6. `AISourceLinks` component
Reusable row of two link cards:
- Official AWS docs (icon + title + URL)
- YouTube search (icon + query label, links to `youtube.com/results?search_query=...`)

### 7. `/api/ai/chat/route.ts` (new edge route)
- `runtime = 'edge'`
- Reads `x-ai-provider` header to route to Groq or Anthropic
- For Anthropic: validates `x-api-key` starts with `sk-ant-`; for ILMU: `sk-` (not `sk-ant-`)
- For Groq: uses `env.GROQ_API_KEY` from Cloudflare env
- System prompt: "You are an AWS Solutions Architect study assistant. Answer concisely. Always include: 1) a relevant official AWS documentation URL, 2) a YouTube search query (as `youtubeQuery` JSON field) the user can use to find tutorials."
- Returns `{ reply: string, awsDocsUrl: string, youtubeQuery: string }` or `{ error: string }`

### 8. `/api/ai/explain/route.ts` (existing, extended)
Additions:
- Reads `x-ai-provider` header; routes to Groq or Anthropic accordingly
- Extended response adds `youtubeQuery: string`, `conceptName: string`, `focusArea: string`, `studyKeywords: string[]`
- Updated prompt instructs AI to return structured JSON with all fields

---

## API Route: Prompt Design

### Chat prompt (system)
```
You are an AWS Solutions Architect study assistant. Be concise (3-5 sentences per answer).
Always respond with valid JSON: { "reply": "...", "awsDocsUrl": "https://docs.aws.amazon.com/...", "youtubeQuery": "AWS <topic> tutorial" }
Use real AWS documentation URLs. For youtubeQuery, write a specific search query that would find a good tutorial video.
```

### Question explainer prompt (system)
```
You are an AWS Solutions Architect study assistant analyzing a practice question.
Respond with valid JSON:
{
  "conceptName": "one-sentence name of the concept being tested",
  "focusArea": "Domain → Sub-topic",
  "studyKeywords": ["keyword1", "keyword2", "keyword3"],
  "explanation": "3-5 sentences: why correct answer is right, why distractors are wrong",
  "awsDocsUrl": "https://docs.aws.amazon.com/...",
  "youtubeQuery": "AWS <topic> tutorial"
}
```

---

## Navigation Integration

- Practice page "Ask AI" button gains a secondary action: "Open in AI page →" which navigates to `/ai?mode=question&questionId=<id>&question=<encoded>&domain=<domain>&keywords=<csv>`
- Existing inline drawer (AIExplanationPanel) stays as the primary quick-access path
- `/ai` link added to main nav (header or sidebar, wherever nav lives)

---

## Provider Configuration

| Provider | Key location | Who controls it |
|---|---|---|
| Groq | `GROQ_API_KEY` env var (Cloudflare secret) | Developer |
| Anthropic | `localStorage: aws_study_ai_key` + `aws_study_ai_provider=anthropic` | User (BYOK) |
| ILMU | `localStorage: aws_study_ai_key` + `aws_study_ai_provider=ilmu` | User (BYOK) — [ILMU docs](https://docs.ilmu.ai/docs/getting-started/overview) |

Groq free tier: 14,400 req/day, 500K tokens/day on `llama-3.1-8b-instant`. Sufficient for a personal study tool.

---

## Error States

| Situation | User sees |
|---|---|
| Groq API down | "Free AI is temporarily unavailable. Switch to Claude (BYOK) or try again." |
| Groq rate limited | "Daily free limit reached. Switch to Claude (BYOK) or come back tomorrow." |
| No Anthropic key | Key setup modal |
| Bad Anthropic key | "Invalid key. Check console.anthropic.com." |
| Bad ILMU key | "Invalid key. Check console.ilmu.ai." |
| JSON parse failure from AI | Graceful fallback: show raw text, no source links |

---

## Out of Scope

- Persistent chat history across sessions
- User accounts or server-side key storage
- Streaming responses
- Mobile-specific layout (responsive but not redesigned)
- Saving explanations to D1
- Video embedding (link only, no iframe)
