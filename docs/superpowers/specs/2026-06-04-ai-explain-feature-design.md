# AI Explain Feature — Design Spec

**Date:** 2026-06-04
**Status:** Approved

## Problem

When doing practice questions, users sometimes need deeper explanation than the static text provides. They also want to be pointed to relevant study notes and official AWS documentation for the specific concept in question — without leaving the page to search manually.

## Solution

A manual-trigger "Ask AI" button that appears after answer reveal. One click fires a grounded AI explanation using the user's own Anthropic API key (BYOK), with links to `aws.amrhnshh.com` and official AWS docs.

---

## Architecture

```
Browser
  └─ localStorage: aws_study_ai_key (user's Anthropic key)
  └─ "Ask AI" click → POST /api/ai/explain
        headers: { x-api-key: <key> }
        body: { questionId, question, userAnswer, correctAnswer, domain, keywords }
        ↓
  Edge Route (Cloudflare Workers, runtime: 'edge')
        1. Validate key format (sk-ant-api03-...)
        2. Fetch AWS docs snippet via public search (keywords)
        3. Build prompt server-side with full question context + doc snippet
        4. Call Claude (claude-haiku-4-5) via Cloudflare AI Gateway
        5. Return { explanation, notesUrl, awsDocsUrl }
        [key never logged, never written to D1]
        ↓
  Browser renders AI panel inline under question explanation
```

**AI Gateway** provides caching (same question = free repeat hit), rate limiting, and a usage dashboard. Cache TTL: 24h per unique question+keywords combo.

---

## Components

### 1. `AskAIButton` component
- Renders after answer reveal alongside existing explanation
- Shows loading spinner while request is in-flight
- On success: expands `AIExplanationPanel`
- On error: shows inline error message (never raw API error)

### 2. `AIKeyModal` component
- Shown when "Ask AI" is clicked and no key is in `localStorage`
- Single input (placeholder: `sk-ant-api03-...`), "Save & Continue" button
- Writes key to `localStorage` under `aws_study_ai_key`
- Has a "Remove key" link that clears `localStorage` (also accessible from page footer/settings)

### 3. `AIExplanationPanel` component
- Inline expandable panel below existing explanation
- Shows: explanation text, "Read more on your notes" link (aws.amrhnshh.com), "Official AWS docs" link
- Dismissible with [x]

### 4. `/api/ai/explain` edge route (`app/api/ai/explain/route.ts`)
- `runtime = 'edge'`
- Validates `x-api-key` header: must match `/^sk-ant-/`, else 400 (covers all Anthropic key formats)
- Fetches AWS docs: queries `https://docs.aws.amazon.com/search/doc-search.html` with question keywords, extracts top result URL + title
- Builds Claude prompt server-side (question, correct answer, domain, AWS doc snippet)
- Calls Claude via Cloudflare AI Gateway using the user's key
- Returns `{ explanation: string, notesUrl: string, awsDocsUrl: string }`
- On any failure (bad key, Claude down, doc fetch timeout): returns a clean `{ error: string }` with appropriate HTTP status — no stack traces

### 5. `useAIKey` hook
- Encapsulates all `localStorage` read/write/clear for the API key
- Used by `AskAIButton` and `AIKeyModal` to keep key management in one place

---

## API Route: Prompt Design

System prompt:
```
You are an AWS Solutions Architect study assistant. Explain the concept being tested concisely (3-5 sentences). Focus on WHY the correct answer is right and why the others are wrong. End with one sentence pointing to where in the study notes this is covered (you will be given the notes URL). Always include the official AWS documentation link provided to you.
```

User prompt includes:
- Question text
- User's chosen answer
- Correct answer + existing explanation text
- Domain label (e.g., "Design Resilient Architectures")
- Keywords array
- Top AWS doc result URL + title (from live fetch)
- Notes site base URL and known page slugs: `https://aws.amrhnshh.com` with a hardcoded list of valid slugs (e.g. `/storage`, `/compute`, `/networking`, `/database`, `/security`, `/monitoring`, `/iam`) — gathered during implementation by checking the live site. Claude picks the closest match; falls back to base URL if none fit.

---

## Security

| Concern | Mitigation |
|---|---|
| Key exposure at rest | `localStorage` only — user's own machine, personal study tool |
| Key in transit | HTTPS only; sent as request header to own edge route |
| Key logged server-side | Edge route never logs headers; no DB writes of the key |
| Prompt injection | Prompt constructed server-side from structured fields, not raw user text |
| Bad key format | Rejected with 400 before any Claude call |
| Key removal | `useAIKey.clearKey()` wipes `localStorage`; no server-side state to clean |

---

## Error States

| Situation | User sees |
|---|---|
| No API key saved | Key setup modal |
| Invalid key format | "That doesn't look like a valid Anthropic key." |
| Key rejected by Anthropic | "Your API key was rejected. Check it's active in console.anthropic.com." |
| Claude API timeout | "AI explanation timed out. Try again." |
| AWS docs fetch fails | Explanation proceeds without doc snippet; notesUrl still returned |
| Rate limited | "You've hit your API rate limit. Wait a moment and try again." |

---

## Data Flow Summary

1. User answers question → reveals answer
2. "Ask AI" button appears
3. User clicks → key check → modal if needed → POST `/api/ai/explain`
4. Edge route: validate → docs fetch → build prompt → Claude via AI Gateway → response
5. `AIExplanationPanel` renders explanation + two links
6. User clicks link → opens `aws.amrhnshh.com/<relevant-page>` or `docs.aws.amazon.com/...` in new tab

---

## Out of Scope

- Streaming responses (keep it simple — full response then render)
- Conversation history / follow-up questions
- Server-side key storage or user accounts
- Saving AI explanations to D1
- Support for providers other than Anthropic
