# AI Chat Markdown + Mermaid Diagrams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AI chat replies render as Markdown (bold, lists, inline code, fenced code blocks) and can include AI-generated Mermaid diagrams, matching the design in `docs/superpowers/specs/2026-06-15-ai-chat-markdown-mermaid-design.md`.

**Architecture:** Fix the JSON-fence-stripping bug that currently corrupts any ` ``` ` inside a chat reply, loosen the chat system prompt to allow Markdown + optional ` ```mermaid ` blocks, and add two new client components (`ChatMarkdown`, `MermaidDiagram`) wired into `AIChatView` to render the result.

**Tech Stack:** Next.js 16 (App Router, edge runtime for API routes), React 19, Tailwind v4, Bun (package manager + test runner), `react-markdown` + `remark-gfm` + `mermaid`.

---

### Task 1: Fix `stripFences` so embedded code fences survive JSON parsing

**Files:**
- Modify: `lib/ai/json.ts:1-4`
- Create: `lib/ai/json.test.ts`
- Modify: `package.json` (`scripts.test`)

- [ ] **Step 1: Write the failing test**

Create `lib/ai/json.test.ts`:

```ts
import { describe, expect, test } from 'bun:test'
import { parseAIJson, salvageText } from './json'

describe('parseAIJson', () => {
  test('parses plain JSON', () => {
    expect(parseAIJson<{ reply: string }>('{"reply":"hi"}')).toEqual({ reply: 'hi' })
  })

  test('strips a fence wrapping the whole response', () => {
    const text = '```json\n{"reply":"hi"}\n```'
    expect(parseAIJson<{ reply: string }>(text)).toEqual({ reply: 'hi' })
  })

  test('preserves a fenced mermaid block inside a reply value', () => {
    const text =
      '{"reply":"Here is a diagram:\\n```mermaid\\ngraph TD\\nA-->B\\n```","youtubeQuery":"x"}'
    const parsed = parseAIJson<{ reply: string; youtubeQuery: string }>(text)
    expect(parsed?.reply).toContain('```mermaid')
    expect(parsed?.reply).toContain('A-->B')
    expect(parsed?.youtubeQuery).toBe('x')
  })

  test('repairs truncated JSON', () => {
    const text = '{"reply":"partial tex'
    const parsed = parseAIJson<{ reply: string }>(text)
    expect(parsed?.reply).toBe('partial tex')
  })
})

describe('salvageText', () => {
  test('extracts a string field from malformed JSON', () => {
    const text = '{"reply":"fallback value", "extra": '
    expect(salvageText(text, 'reply')).toBe('fallback value')
  })
})
```

- [ ] **Step 2: Run the test to verify the mermaid case fails**

Run: `bun test lib/ai/json.test.ts`

Expected: the `'parses plain JSON'`, `'strips a fence...'`, `'repairs truncated JSON'`, and `'salvageText'` tests PASS (current `stripFences` already handles those), but `'preserves a fenced mermaid block inside a reply value'` FAILS — the global `replace(/```(?:json)?/gi, '')` strips the ` ```mermaid ` / ` ``` ` markers from inside the `reply` string, so `parsed?.reply` no longer contains `` ```mermaid ``.

- [ ] **Step 3: Fix `stripFences`**

In `lib/ai/json.ts`, replace:

```ts
/** Remove markdown code fences that some models wrap JSON in. */
function stripFences(text: string): string {
  return text.replace(/```(?:json)?/gi, '')
}
```

with:

```ts
/** Remove a code fence that wraps the ENTIRE response (some models do this),
 *  without touching fences that appear inside a JSON string value. */
function stripFences(text: string): string {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun test lib/ai/json.test.ts`

Expected: PASS — all 5 tests green.

- [ ] **Step 5: Wire up `bun test` as the project test command**

In `package.json`, change:

```json
"test": "echo \"No tests configured\"",
```

to:

```json
"test": "bun test",
```

- [ ] **Step 6: Run the full test command**

Run: `bun test`

Expected: PASS — `lib/ai/json.test.ts` (5 tests) runs and passes.

- [ ] **Step 7: Commit**

```bash
git add lib/ai/json.ts lib/ai/json.test.ts package.json
git commit -m "fix: preserve fenced code blocks inside AI JSON reply values"
```

---

### Task 2: Allow Markdown + Mermaid in chat replies, raise token budget

**Files:**
- Modify: `app/api/ai/chat/route.ts:19-27` (`CHAT_SYSTEM_PROMPT`) and `:56` (`maxTokens`)

- [ ] **Step 1: Update the system prompt**

In `app/api/ai/chat/route.ts`, replace:

```ts
const CHAT_SYSTEM_PROMPT = `You are an AWS Solutions Architect study assistant. Answer questions about AWS services, architecture patterns, and exam topics concisely (3-5 sentences).

Respond ONLY with valid JSON (no markdown, no code fences):
{"reply":"string","youtubeQuery":"string","docsSearchPhrase":"string"}

Rules:
- reply: your answer, concise and specific to AWS
- youtubeQuery: a specific search query for a YouTube tutorial (e.g. "AWS VPC peering tutorial")
- docsSearchPhrase: a short phrase to search official AWS documentation (e.g. "S3 bucket versioning configuration") — do NOT invent URLs`
```

with:

```ts
const CHAT_SYSTEM_PROMPT = `You are an AWS Solutions Architect study assistant. Answer questions about AWS services, architecture patterns, and exam topics concisely (3-6 sentences, or a short list).

Respond with a single valid JSON object — the object itself must NOT be wrapped in a code fence:
{"reply":"string","youtubeQuery":"string","docsSearchPhrase":"string"}

Rules:
- reply: your answer as Markdown. Use **bold**, lists, and inline \`code\` where helpful. When a diagram would help explain an architecture, request flow, or comparison, include a fenced \`\`\`mermaid code block with valid Mermaid flowchart or sequence-diagram syntax. Escape newlines and quotes correctly so "reply" remains valid JSON.
- youtubeQuery: a specific search query for a YouTube tutorial (e.g. "AWS VPC peering tutorial")
- docsSearchPhrase: a short phrase to search official AWS documentation (e.g. "S3 bucket versioning configuration") — do NOT invent URLs`
```

- [ ] **Step 2: Raise the token budget**

In the same file, find the `completeChatMessages` call:

```ts
  const aiResult = await completeChatMessages(
    provider,
    apiKey,
    CHAT_SYSTEM_PROMPT,
    allMessages,
    // Headroom for the JSON envelope + youtubeQuery/docsSearchPhrase so a
    // concise reply isn't truncated mid-string (parser salvages either way).
    700
  )
```

Change `700` to `1300` and update the comment:

```ts
  const aiResult = await completeChatMessages(
    provider,
    apiKey,
    CHAT_SYSTEM_PROMPT,
    allMessages,
    // Headroom for the JSON envelope + youtubeQuery/docsSearchPhrase, plus
    // room for an optional ```mermaid block, so a reply isn't truncated
    // mid-string (parser salvages either way).
    1300
  )
```

- [ ] **Step 3: Commit**

```bash
git add app/api/ai/chat/route.ts
git commit -m "feat: allow markdown and mermaid diagrams in chat replies"
```

---

### Task 3: Add markdown + mermaid dependencies

**Files:**
- Modify: `package.json`, `bun.lock` (via `bun add`)

- [ ] **Step 1: Install dependencies**

Run: `bun add react-markdown remark-gfm mermaid`

- [ ] **Step 2: Verify the project still builds**

Run: `bun run build`

Expected: build succeeds. If it fails with a module-resolution error mentioning `mermaid` or `d3` (ESM/CJS interop), add a `transpilePackages` entry to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  transpilePackages: ['mermaid'],
}
```

and re-run `bun run build` to confirm it now succeeds.

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock next.config.ts
git commit -m "chore: add react-markdown, remark-gfm, mermaid dependencies"
```

---

### Task 4: `MermaidDiagram` component

**Files:**
- Create: `components/ai/MermaidDiagram.tsx`

- [ ] **Step 1: Create the component**

Create `components/ai/MermaidDiagram.tsx`:

```tsx
'use client'

import { useEffect, useId, useState } from 'react'

interface MermaidDiagramProps {
  source: string
}

let mermaidInitPromise: Promise<typeof import('mermaid')['default']> | null = null

function getMermaid() {
  if (!mermaidInitPromise) {
    mermaidInitPromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          background: '#111827',
          primaryColor: '#1e2d40',
          primaryTextColor: '#e2e8f0',
          primaryBorderColor: '#00d4ff',
          lineColor: '#64748b',
          secondaryColor: '#111827',
          tertiaryColor: '#111827',
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '12px',
        },
      })
      return mermaid
    })
  }
  return mermaidInitPromise
}

export default function MermaidDiagram({ source }: MermaidDiagramProps) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [svg, setSvg] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const mermaid = await getMermaid()
        const { svg: rendered } = await mermaid.render(`mermaid-${reactId}`, source)
        if (!cancelled) setSvg(rendered)
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [reactId, source])

  if (failed) {
    return (
      <div className="mb-2 space-y-1.5 last:mb-0">
        <pre className="overflow-x-auto rounded-xl bg-aws-card border border-aws-border/60 p-3 font-space-mono text-[0.7rem] leading-relaxed">
          <code>{source}</code>
        </pre>
        <p className="font-space-mono text-[0.58rem] text-amber-400/70">
          Couldn&apos;t render diagram.
        </p>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="mb-2 rounded-xl bg-aws-card border border-aws-border/60 p-3 font-space-mono text-[0.6rem] text-aws-muted/60 last:mb-0">
        Rendering diagram…
      </div>
    )
  }

  return (
    <div
      className="mb-2 overflow-x-auto rounded-xl bg-aws-card border border-aws-border/60 p-3 last:mb-0"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ai/MermaidDiagram.tsx
git commit -m "feat: add MermaidDiagram component for AI chat"
```

---

### Task 5: `ChatMarkdown` component

**Files:**
- Create: `components/ai/ChatMarkdown.tsx`

- [ ] **Step 1: Create the component**

Create `components/ai/ChatMarkdown.tsx`:

```tsx
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MermaidDiagram from '@/components/ai/MermaidDiagram'

const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc pl-4 space-y-0.5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 space-y-0.5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-aws-text">{children}</strong>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-c1 underline hover:text-c1/80"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => <h3 className="mb-1.5 font-bold text-aws-text">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-1.5 font-bold text-aws-text">{children}</h3>,
  h3: ({ children }) => <h3 className="mb-1.5 font-bold text-aws-text">{children}</h3>,
  table: ({ children }) => (
    <div className="mb-2 overflow-x-auto last:mb-0">
      <table className="min-w-full text-left text-[0.74rem]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-aws-border/60 px-2 py-1 font-bold text-aws-text">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-b border-aws-border/30 px-2 py-1">{children}</td>,
  // react-markdown nests block code inside <pre>; pass <pre> through so
  // `code` below fully controls block-level rendering (incl. mermaid).
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const match = /language-(\w+)/.exec(className ?? '')
    const value = String(children).replace(/\n$/, '')

    if (!match) {
      return (
        <code className="rounded bg-aws-card border border-aws-border/60 px-1 py-0.5 font-space-mono text-[0.74rem]">
          {children}
        </code>
      )
    }

    if (match[1] === 'mermaid') {
      return <MermaidDiagram source={value} />
    }

    return (
      <pre className="mb-2 overflow-x-auto rounded-xl bg-aws-card border border-aws-border/60 p-3 font-space-mono text-[0.7rem] leading-relaxed last:mb-0">
        <code>{value}</code>
      </pre>
    )
  },
}

interface ChatMarkdownProps {
  content: string
}

export default function ChatMarkdown({ content }: ChatMarkdownProps) {
  return (
    <div className="font-space-mono text-[0.82rem] leading-[1.8] text-aws-text">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ai/ChatMarkdown.tsx
git commit -m "feat: add ChatMarkdown component for AI chat"
```

---

### Task 6: Wire `ChatMarkdown` into `AIChatView`

**Files:**
- Modify: `components/ai/AIChatView.tsx:1-12` (imports) and `:163-167` (assistant bubble)

- [ ] **Step 1: Add the import**

In `components/ai/AIChatView.tsx`, add to the imports (near the other `components/ai/*` imports):

```tsx
import ChatMarkdown from '@/components/ai/ChatMarkdown'
```

- [ ] **Step 2: Replace the assistant message bubble**

Replace:

```tsx
              <div className="max-w-[92%] space-y-2">
                <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-aws-card border border-aws-border/60 text-[0.82rem] text-aws-text leading-[1.8]">
                  {msg.content}
                </div>
```

with:

```tsx
              <div className="max-w-[92%] space-y-2">
                <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-aws-card border border-aws-border/60">
                  <ChatMarkdown content={msg.content} />
                </div>
```

(`ChatMarkdown`'s own wrapper already applies `font-space-mono text-[0.82rem] leading-[1.8] text-aws-text`, so those classes move from the outer `div` into the component.)

- [ ] **Step 3: Verify the project builds (type-checks `ChatMarkdown`/`MermaidDiagram`)**

Run: `bun run build`

Expected: build succeeds with no TypeScript errors from `components/ai/ChatMarkdown.tsx` or `components/ai/MermaidDiagram.tsx`.

- [ ] **Step 4: Run the dev server and manually verify**

Run: `bun run dev`

In the browser, open the AI chat and:
1. Ask "Aurora vs RDS — when to use which?" — confirm the reply renders with markdown formatting (bold/lists) instead of raw `**`/`-` characters.
2. Ask "How does S3 cross-region replication work?" — confirm a Mermaid diagram renders inside the reply, scrolls horizontally if wide, and the rest of the message still renders normally around it.
3. Confirm Copy, Bookmark, and "Download chat as Markdown" still work on a message containing a diagram (the exported `.md` should contain the raw ` ```mermaid ` block).
4. Confirm the existing example prompts, retry-on-error, and BYOK provider flow are unaffected.

- [ ] **Step 5: Commit**

```bash
git add components/ai/AIChatView.tsx
git commit -m "feat: render AI chat replies as markdown with mermaid diagrams"
```
