# AI Explain Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a manual "Ask AI" button to the practice page that explains the current question using the user's own Anthropic API key, returning grounded links to aws.amrhnshh.com and official AWS docs.

**Architecture:** A BYOK flow — user pastes their Anthropic key into a modal, it's stored in `localStorage`, sent as `x-api-key` header to a new edge route `/api/ai/explain`, which validates the key, builds a prompt server-side, and calls Claude via Cloudflare AI Gateway (with direct-Anthropic fallback). Response includes explanation text + two links rendered in an inline panel below the existing explanation block.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Cloudflare Workers edge runtime, Anthropic Messages API (raw `fetch` — no SDK, edge-compatible), Cloudflare AI Gateway (optional caching layer)

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `hooks/useAIKey.ts` | localStorage read/write/clear for the API key |
| Create | `components/AIKeyModal.tsx` | Modal to enter and save API key |
| Create | `components/AIExplanationPanel.tsx` | Displays explanation text + two links |
| Create | `components/AskAIButton.tsx` | Button, loading state, error display, orchestrates the above |
| Create | `app/api/ai/explain/route.ts` | Edge route — validates key, builds prompt, calls Claude |
| Modify | `worker-configuration.d.ts` | Add `AI_GATEWAY_BASE_URL` to `CloudflareEnv` |
| Modify | `wrangler.jsonc` | Add `AI_GATEWAY_BASE_URL` var (empty string = direct Anthropic) |
| Modify | `app/practice/page.tsx` | Add `<AskAIButton>` inside `ExplanationBlock` |

---

## Task 1: `useAIKey` hook

**Files:**
- Create: `hooks/useAIKey.ts`

- [ ] **Step 1: Create the hook**

```typescript
// hooks/useAIKey.ts
'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'aws_study_ai_key'

export function useAIKey() {
  const [key, setKeyState] = useState<string | null>(null)

  useEffect(() => {
    setKeyState(localStorage.getItem(STORAGE_KEY))
  }, [])

  const saveKey = (k: string) => {
    localStorage.setItem(STORAGE_KEY, k)
    setKeyState(k)
  }

  const clearKey = () => {
    localStorage.removeItem(STORAGE_KEY)
    setKeyState(null)
  }

  return { key, saveKey, clearKey }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/amirahnasihah/Developer/AMRHNSHH/aws-saa-study && bun run lint
```

Expected: no errors on the new file.

- [ ] **Step 3: Commit**

```bash
git add hooks/useAIKey.ts
git commit -m "feat: add useAIKey hook for BYOK localStorage management"
```

---

## Task 2: `AIKeyModal` component

**Files:**
- Create: `components/AIKeyModal.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/AIKeyModal.tsx
'use client'

import { useState } from 'react'

interface AIKeyModalProps {
  onSave: (key: string) => void
  onDismiss: () => void
}

export default function AIKeyModal({ onSave, onDismiss }: AIKeyModalProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    const trimmed = input.trim()
    if (!trimmed.startsWith('sk-ant-')) {
      setError("That doesn't look like a valid Anthropic key.")
      return
    }
    onSave(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative bg-aws-card border border-aws-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="font-space-mono text-sm font-bold text-aws-text mb-1">
          Enter your Anthropic API key
        </h2>
        <p className="font-space-mono text-[0.65rem] text-aws-muted mb-4">
          Stored only in your browser. Never sent to our servers beyond your AI request.
          Get one at{' '}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-c1 hover:underline"
          >
            console.anthropic.com
          </a>
        </p>

        <input
          type="password"
          placeholder="sk-ant-api03-..."
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null) }}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="w-full bg-white/5 border border-aws-border rounded-xl px-4 py-2.5 font-space-mono text-xs text-aws-text placeholder-aws-muted/50 focus:outline-none focus:border-c1/50 mb-2"
          autoFocus
        />

        {error && (
          <p className="font-space-mono text-[0.62rem] text-red-400 mb-3">{error}</p>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={onDismiss}
            className="flex-1 py-2 rounded-xl font-space-mono text-xs text-aws-muted border border-aws-border/50 hover:text-aws-text hover:bg-white/4 transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!input.trim()}
            className="flex-1 py-2 rounded-xl font-space-mono text-xs font-bold bg-c1/15 border border-c1/40 text-c1 hover:bg-c1/25 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bun run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/AIKeyModal.tsx
git commit -m "feat: add AIKeyModal component for BYOK key entry"
```

---

## Task 3: `AIExplanationPanel` component

**Files:**
- Create: `components/AIExplanationPanel.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/AIExplanationPanel.tsx
'use client'

interface AIExplanationPanelProps {
  explanation: string
  notesUrl: string
  awsDocsUrl: string
  onDismiss: () => void
}

export default function AIExplanationPanel({
  explanation,
  notesUrl,
  awsDocsUrl,
  onDismiss,
}: AIExplanationPanelProps) {
  return (
    <div className="mt-3 bg-c1/5 border border-c1/20 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-c1/15">
        <span className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c1/70">
          AI Explanation
        </span>
        <button
          onClick={onDismiss}
          className="font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">
        <p className="text-[0.85rem] text-aws-text leading-relaxed">{explanation}</p>

        <div className="space-y-1.5 pt-1 border-t border-c1/10">
          <p className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted mb-2">
            Read more
          </p>
          <a
            href={notesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-space-mono text-[0.62rem] text-c1 hover:underline"
          >
            <span>📖</span>
            <span>Study notes → aws.amrhnshh.com</span>
          </a>
          <a
            href={awsDocsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-space-mono text-[0.62rem] text-aws-muted hover:text-c4 transition-colors"
          >
            <span>📎</span>
            <span>Official AWS docs →</span>
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bun run lint
```

- [ ] **Step 3: Commit**

```bash
git add components/AIExplanationPanel.tsx
git commit -m "feat: add AIExplanationPanel component"
```

---

## Task 4: `/api/ai/explain` edge route

**Files:**
- Create: `app/api/ai/explain/route.ts`
- Modify: `worker-configuration.d.ts`
- Modify: `wrangler.jsonc`

**Note on AWS docs:** The route uses a static `AWS_DOCS_MAP` (keyword → URL) rather than a live search fetch. Live fetching AWS docs in an edge function is fragile and adds latency. Claude picks the best match from the map; falls back to the base docs URL if no keyword matches. During implementation, verify the slug list for `aws.amrhnshh.com` by visiting the live site and update `NOTES_SLUGS` accordingly.

- [ ] **Step 1: Update `worker-configuration.d.ts`**

```typescript
// worker-configuration.d.ts
interface CloudflareEnv {
  DB: D1Database
  AI_GATEWAY_BASE_URL: string
}
```

- [ ] **Step 2: Update `wrangler.jsonc` to add the var**

Add this block inside the JSON object in `wrangler.jsonc` (after the `d1_databases` array):

```jsonc
"vars": {
  "AI_GATEWAY_BASE_URL": ""
}
```

`AI_GATEWAY_BASE_URL` is left empty in wrangler.jsonc (direct Anthropic). In the Cloudflare dashboard for the Pages project, set it to your AI Gateway URL: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_name}/anthropic` — see Task 6 for setup steps.

- [ ] **Step 3: Create the edge route**

```typescript
// app/api/ai/explain/route.ts
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

interface ExplainRequest {
  questionId: string
  question: string
  userAnswerId: string
  userAnswerText: string
  correctAnswerId: string
  correctAnswerText: string
  domainLabel: string
  keywords: string[]
}

interface ExplainResponse {
  explanation: string
  notesUrl: string
  awsDocsUrl: string
}

interface ErrorResponse {
  error: string
}

const NOTES_BASE = 'https://aws.amrhnshh.com'

// Visit aws.amrhnshh.com and update these slugs to match actual pages
const NOTES_SLUGS: Record<string, string> = {
  storage: '/storage',
  s3: '/storage',
  'ebs': '/storage',
  'efs': '/storage',
  'glacier': '/storage',
  compute: '/compute',
  ec2: '/compute',
  lambda: '/compute',
  'auto scaling': '/compute',
  networking: '/networking',
  vpc: '/networking',
  'route 53': '/networking',
  cloudfront: '/networking',
  'direct connect': '/networking',
  database: '/database',
  rds: '/database',
  dynamodb: '/database',
  aurora: '/database',
  elasticache: '/database',
  security: '/security',
  iam: '/security',
  kms: '/security',
  'waf': '/security',
  'shield': '/security',
  monitoring: '/monitoring',
  cloudwatch: '/monitoring',
  cloudtrail: '/monitoring',
}

const AWS_DOCS_MAP: Record<string, string> = {
  s3: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html',
  's3 transfer acceleration': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html',
  glacier: 'https://docs.aws.amazon.com/amazonglacier/latest/dev/introduction.html',
  ebs: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html',
  efs: 'https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html',
  ec2: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html',
  lambda: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html',
  'auto scaling': 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html',
  vpc: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html',
  'route 53': 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html',
  cloudfront: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html',
  'direct connect': 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html',
  rds: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html',
  aurora: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html',
  dynamodb: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html',
  elasticache: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html',
  iam: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html',
  kms: 'https://docs.aws.amazon.com/kms/latest/developerguide/overview.html',
  cloudwatch: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html',
  cloudtrail: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html',
  sqs: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html',
  sns: 'https://docs.aws.amazon.com/sns/latest/dg/welcome.html',
  elb: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html',
  'application load balancer': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html',
  'network load balancer': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html',
  waf: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html',
  shield: 'https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html',
}

function findNotesUrl(keywords: string[]): string {
  const lower = keywords.map((k) => k.toLowerCase())
  for (const kw of lower) {
    for (const [key, slug] of Object.entries(NOTES_SLUGS)) {
      if (kw.includes(key) || key.includes(kw)) return NOTES_BASE + slug
    }
  }
  return NOTES_BASE
}

function findAwsDocsUrl(keywords: string[]): string {
  const lower = keywords.map((k) => k.toLowerCase())
  for (const kw of lower) {
    for (const [key, url] of Object.entries(AWS_DOCS_MAP)) {
      if (kw.includes(key) || key.includes(kw)) return url
    }
  }
  return 'https://docs.aws.amazon.com'
}

function buildPrompt(body: ExplainRequest, notesUrl: string, awsDocsUrl: string): string {
  return `Question domain: ${body.domainLabel}
Keywords: ${body.keywords.join(', ')}

Question: ${body.question}

The user selected: (${body.userAnswerId.toUpperCase()}) ${body.userAnswerText}
Correct answer: (${body.correctAnswerId.toUpperCase()}) ${body.correctAnswerText}

Study notes URL: ${notesUrl}
Official AWS docs URL: ${awsDocsUrl}

Explain why the correct answer is right (2-3 sentences) and briefly why the user's choice was wrong if they were incorrect (1-2 sentences). Be specific to AWS. End with: "Read more at ${notesUrl}".`
}

const SYSTEM_PROMPT =
  'You are an AWS Solutions Architect study assistant. Give concise, accurate explanations. Always reference the official AWS documentation URL provided to you at the end of your response.'

function classifyAnthropicError(status: number): string {
  if (status === 401) return 'Your API key was rejected. Check it is active at console.anthropic.com.'
  if (status === 429) return 'You have hit your API rate limit. Wait a moment and try again.'
  if (status === 408 || status === 524) return 'AI explanation timed out. Try again.'
  return 'AI explanation failed. Try again.'
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = request.headers.get('x-api-key') ?? ''

  if (!apiKey.startsWith('sk-ant-')) {
    const body: ErrorResponse = { error: "That doesn't look like a valid Anthropic key." }
    return Response.json(body, { status: 400 })
  }

  let parsed: ExplainRequest
  try {
    parsed = (await request.json()) as ExplainRequest
  } catch {
    return Response.json({ error: 'Invalid request body.' } satisfies ErrorResponse, { status: 400 })
  }

  const notesUrl = findNotesUrl(parsed.keywords)
  const awsDocsUrl = findAwsDocsUrl(parsed.keywords)
  const userPrompt = buildPrompt(parsed, notesUrl, awsDocsUrl)

  let gatewayBase = 'https://api.anthropic.com'
  try {
    const { env } = getRequestContext()
    const cfEnv = env as CloudflareEnv
    if (cfEnv.AI_GATEWAY_BASE_URL) gatewayBase = cfEnv.AI_GATEWAY_BASE_URL
  } catch {
    // running outside Cloudflare (local dev) — use direct Anthropic
  }

  const anthropicUrl = gatewayBase === 'https://api.anthropic.com'
    ? 'https://api.anthropic.com/v1/messages'
    : `${gatewayBase}/v1/messages`

  let anthropicRes: Response
  try {
    anthropicRes = await fetch(anthropicUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })
  } catch {
    return Response.json({ error: 'AI explanation timed out. Try again.' } satisfies ErrorResponse, { status: 503 })
  }

  if (!anthropicRes.ok) {
    const errMsg = classifyAnthropicError(anthropicRes.status)
    return Response.json({ error: errMsg } satisfies ErrorResponse, { status: anthropicRes.status })
  }

  interface AnthropicMessage {
    content: Array<{ type: string; text: string }>
  }

  const data = (await anthropicRes.json()) as AnthropicMessage
  const explanation = data.content.find((c) => c.type === 'text')?.text ?? 'No explanation returned.'

  const result: ExplainResponse = { explanation, notesUrl, awsDocsUrl }
  return Response.json(result)
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
bun run lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/api/ai/explain/route.ts worker-configuration.d.ts wrangler.jsonc
git commit -m "feat: add /api/ai/explain edge route with BYOK and AI Gateway support"
```

---

## Task 5: `AskAIButton` component

**Files:**
- Create: `components/AskAIButton.tsx`

This component orchestrates the hook, modal, API call, and panel. It receives all question context as props so it can fire the request without the user typing anything.

- [ ] **Step 1: Create the component**

```tsx
// components/AskAIButton.tsx
'use client'

import { useState } from 'react'
import { useAIKey } from '@/hooks/useAIKey'
import AIKeyModal from '@/components/AIKeyModal'
import AIExplanationPanel from '@/components/AIExplanationPanel'

interface AskAIButtonProps {
  questionId: string
  question: string
  userAnswerId: string
  userAnswerText: string
  correctAnswerId: string
  correctAnswerText: string
  domainLabel: string
  keywords: string[]
}

type UIState = 'idle' | 'awaiting-key' | 'loading' | 'done' | 'error'

interface AIResult {
  explanation: string
  notesUrl: string
  awsDocsUrl: string
}

export default function AskAIButton({
  questionId,
  question,
  userAnswerId,
  userAnswerText,
  correctAnswerId,
  correctAnswerText,
  domainLabel,
  keywords,
}: AskAIButtonProps) {
  const { key, saveKey } = useAIKey()
  const [uiState, setUiState] = useState<UIState>('idle')
  const [result, setResult] = useState<AIResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fireRequest = async (apiKey: string) => {
    setUiState('loading')
    setErrorMsg(null)
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          questionId,
          question,
          userAnswerId,
          userAnswerText,
          correctAnswerId,
          correctAnswerText,
          domainLabel,
          keywords,
        }),
      })
      const data = (await res.json()) as AIResult | { error: string }
      if ('error' in data) {
        setErrorMsg(data.error)
        setUiState('error')
      } else {
        setResult(data)
        setUiState('done')
      }
    } catch {
      setErrorMsg('Could not reach the AI service. Check your connection.')
      setUiState('error')
    }
  }

  const handleClick = () => {
    if (!key) {
      setUiState('awaiting-key')
    } else {
      void fireRequest(key)
    }
  }

  const handleKeySaved = (newKey: string) => {
    saveKey(newKey)
    setUiState('loading')
    void fireRequest(newKey)
  }

  if (uiState === 'done' && result) {
    return (
      <AIExplanationPanel
        explanation={result.explanation}
        notesUrl={result.notesUrl}
        awsDocsUrl={result.awsDocsUrl}
        onDismiss={() => { setUiState('idle'); setResult(null) }}
      />
    )
  }

  return (
    <>
      {uiState === 'awaiting-key' && (
        <AIKeyModal
          onSave={handleKeySaved}
          onDismiss={() => setUiState('idle')}
        />
      )}

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleClick}
          disabled={uiState === 'loading'}
          className="inline-flex items-center gap-1.5 font-space-mono text-[0.62rem] font-bold px-3 py-1.5 rounded-lg border border-c1/30 text-c1 bg-c1/8 hover:bg-c1/15 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uiState === 'loading' ? (
            <>
              <span className="inline-block w-2.5 h-2.5 border border-c1 border-t-transparent rounded-full animate-spin" />
              Asking AI...
            </>
          ) : (
            <>✦ Ask AI</>
          )}
        </button>

        {uiState === 'error' && errorMsg && (
          <p className="font-space-mono text-[0.6rem] text-red-400">{errorMsg}</p>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bun run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/AskAIButton.tsx
git commit -m "feat: add AskAIButton component — orchestrates BYOK AI explain flow"
```

---

## Task 6: Wire `AskAIButton` into the practice page

**Files:**
- Modify: `app/practice/page.tsx`

The `AskAIButton` goes inside `ExplanationBlock`, after the keywords section. It needs the current question and the selected answer. `ExplanationBlock` already receives `q` and `selected`, so we just need to pass them through to `AskAIButton`.

- [ ] **Step 1: Add import at top of `app/practice/page.tsx`**

Add this import after the existing imports:

```typescript
import AskAIButton from '@/components/AskAIButton'
```

- [ ] **Step 2: Update `ExplanationBlock` to include `AskAIButton`**

Find the `ExplanationBlock` function (line 624). Add `AskAIButton` after the keywords `<div>` and before the `q.reference` block. The updated inner `<div className="px-5 py-4 space-y-4">` section should look like this (only showing the addition — do not remove existing content):

```tsx
{/* keywords */}
<div className="flex flex-wrap gap-1.5 pt-1">
  {q.keywords.map((kw) => (
    <span
      key={kw}
      className="font-space-mono text-[0.6rem] px-2.5 py-0.5 rounded-full border border-c1/25 text-c1/70 bg-c1/5"
    >
      {kw}
    </span>
  ))}
</div>

{/* AI explain button — new */}
<AskAIButton
  questionId={q.id}
  question={q.scenario}
  userAnswerId={selected}
  userAnswerText={q.options.find((o) => o.id === selected)?.text ?? ''}
  correctAnswerId={q.correctId}
  correctAnswerText={q.options.find((o) => o.id === q.correctId)?.text ?? ''}
  domainLabel={q.domainLabel}
  keywords={q.keywords}
/>

{q.reference && (
```

- [ ] **Step 3: Verify TypeScript compiles with no errors**

```bash
bun run lint
```

- [ ] **Step 4: Start dev server and manually test**

```bash
bun run dev
```

Open `http://localhost:3000/practice`. Answer a question. After reveal:
- Confirm "✦ Ask AI" button appears below the keyword tags
- Click it → AIKeyModal should open (if no key saved)
- Enter a key starting with `sk-ant-` → modal closes, spinner appears
- Within ~3 seconds: explanation panel appears with text + two links
- Links open in new tab
- ✕ button dismisses the panel
- Clicking "Ask AI" again re-fires (uses cached key)

- [ ] **Step 5: Commit**

```bash
git add app/practice/page.tsx
git commit -m "feat: wire AskAIButton into ExplanationBlock on practice page"
```

---

## Task 7: Cloudflare AI Gateway setup (manual — do once)

This task configures the Cloudflare AI Gateway so repeated questions are cached and usage is visible in the dashboard. Skip this if you want to use direct Anthropic only.

- [ ] **Step 1: Create a gateway in the Cloudflare dashboard**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → your account → **AI** → **AI Gateway**
2. Click **Create Gateway** → name it `aws-study` → Save
3. Copy your **Account ID** (visible in the dashboard URL or sidebar)
4. Your gateway base URL is: `https://gateway.ai.cloudflare.com/v1/{account_id}/aws-study/anthropic`

- [ ] **Step 2: Set the env var in Cloudflare Pages**

1. Go to Cloudflare Dashboard → **Pages** → `aws-saa-study` → **Settings** → **Environment variables**
2. Add variable: `AI_GATEWAY_BASE_URL` = `https://gateway.ai.cloudflare.com/v1/{your_account_id}/aws-study/anthropic`
3. Set for both Production and Preview

- [ ] **Step 3: Redeploy**

```bash
bun run deploy
```

- [ ] **Step 4: Verify in AI Gateway dashboard**

After making an "Ask AI" request on the deployed site, go to **AI Gateway** → **aws-study** → **Logs**. You should see the request logged. A second identical request should show as a cache hit.

---

## Task 8: Update notes slugs for `aws.amrhnshh.com`

The `NOTES_SLUGS` map in `app/api/ai/explain/route.ts` was written with guessed slugs. Update it to match the actual pages on the live site.

- [ ] **Step 1: Check live pages**

Visit `https://aws.amrhnshh.com` and note the actual URL paths (e.g. `/s3`, `/networking`, `/iam-roles`, etc.).

- [ ] **Step 2: Update `NOTES_SLUGS` in `app/api/ai/explain/route.ts`**

Replace the `NOTES_SLUGS` object with the correct paths. Example — if the site has `/s3-storage` instead of `/storage`:

```typescript
const NOTES_SLUGS: Record<string, string> = {
  s3: '/s3-storage',   // updated to match actual slug
  // ...etc
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/ai/explain/route.ts
git commit -m "fix: update NOTES_SLUGS to match actual aws.amrhnshh.com pages"
```
