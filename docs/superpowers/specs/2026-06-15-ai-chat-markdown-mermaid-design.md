# AI Chat: Markdown + Mermaid Diagrams (Phase 1)

## Context

The user asked for the AI chat to feel "really like Claude" — able to render
rich explanations, flowcharts/diagrams, and (eventually) interactive HTML and
images. That request spans three independent subsystems:

1. **Markdown + diagram rendering** (this spec)
2. **Interactive HTML artifacts** (sandboxed iframe, future spec)
3. **Image generation** (Workers AI, future spec)

This spec covers Phase 1 only: markdown-formatted replies and AI-generated
Mermaid diagrams in `AIChatView`.

## Current State

- `app/api/ai/chat/route.ts` asks the model for strict JSON:
  `{"reply": "...", "youtubeQuery": "...", "docsSearchPhrase": "..."}`,
  `maxTokens: 700`.
- `lib/ai/json.ts`'s `stripFences()` does
  `text.replace(/```(?:json)?/gi, '')` — a **global** replace. Any
  ` ``` ` fences inside the `reply` string (e.g. a code or mermaid block)
  get corrupted before `JSON.parse` ever runs.
- `components/ai/AIChatView.tsx` renders `msg.content` as plain text
  (`{msg.content}`) — no markdown support.
- `PersistedChatMessage` (in `hooks/useAIChatHistory.ts`) stores `content`
  as a plain string — no schema change needed, since the markdown (incl.
  mermaid fences) lives directly in `content`.
- No markdown or diagram libraries are installed. The existing `/visual`
  page uses `@xyflow/react` with a custom `ArchNode`, not Mermaid.
- Cloudflare `AI` binding is already configured in `wrangler.jsonc` (relevant
  to Phase 3, not this spec).

## Design

### 1. Fix `stripFences` (lib/ai/json.ts)

Replace the global strip with an anchored strip that only removes a fence
wrapping the **entire** trimmed response:

```ts
function stripFences(text: string): string {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
}
```

This preserves any ` ``` ` fences that appear *inside* the JSON string
value (e.g. inside `"reply": "...```mermaid\n...\n```..."`), while still
handling the case the function exists for: a model wrapping the whole JSON
object in a code fence.

`repairTruncatedJson` is unaffected — it operates on the JSON structure, not
fence markers.

### 2. Chat system prompt + token budget (app/api/ai/chat/route.ts)

Update `CHAT_SYSTEM_PROMPT`:

- State that `reply` may use Markdown: bold, lists, inline code, and fenced
  code blocks.
- Instruct the model to include a ` ```mermaid ` fenced block (flowchart or
  sequence diagram syntax) **when it would help** explain an architecture,
  request flow, or comparison — proactively, at the model's judgment, not
  only on explicit request.
- Keep the existing `youtubeQuery` / `docsSearchPhrase` fields unchanged.

Bump `maxTokens` from `700` to `1300` so a markdown reply plus a diagram has
room to complete without truncation. `repairTruncatedJson` + the Mermaid
error fallback (below) remain as safety nets for the remaining edge cases.

### 3. `ChatMarkdown` component (components/ai/ChatMarkdown.tsx)

New client component. Renders a markdown string via `react-markdown` +
`remark-gfm` (tables, strikethrough, etc.), with custom element renderers
styled to match the existing chat theme (`font-space-mono`, `text-aws-text`,
`text-aws-muted`, `text-c1`, `bg-aws-card`, `border-aws-border`):

- Headings, paragraphs, lists, bold/italic, links, inline `code`, tables —
  styled to fit the existing `text-[0.82rem] leading-[1.8]` message bubble.
- Fenced code blocks (`code` renderer keyed on the `className`/language):
  - `language-mermaid` → render `<MermaidDiagram source={...} />`.
  - anything else → styled `<pre><code>` block (monospace, `bg-aws-card`,
    rounded, horizontal scroll for long lines).

### 4. `MermaidDiagram` component (components/ai/MermaidDiagram.tsx)

New client component, `source: string` prop:

- Dynamically `import('mermaid')` on mount (client-only, lazy — keeps the
  ~600KB lib out of the initial bundle; only loaded when a chat message
  actually contains a mermaid block).
- Initializes Mermaid with a custom theme matching the dark AWS palette:
  node fills/strokes drawn from the `c1`–`c6` accent colors and
  `aws-card`/`aws-border` for backgrounds/borders, font set to
  `font-space-mono`.
- Renders to inline SVG inside an `overflow-x-auto` wrapper so wide
  flowcharts scroll horizontally on narrow/mobile viewports instead of
  overflowing or squishing.
- Wraps `mermaid.render()` in try/catch. On failure (invalid syntax from a
  weaker free-tier model), falls back to a styled `<pre>` block showing the
  raw mermaid source plus a small "couldn't render diagram" note — the rest
  of the message still renders normally.

### 5. Wire into `AIChatView.tsx`

- Assistant messages: replace `{msg.content}` with
  `<ChatMarkdown content={msg.content} />`.
- User messages: unchanged (plain text) — no need to interpret user input as
  markdown.
- No changes to `PersistedChatMessage`, `useAIChatHistory`, `CopyButton`,
  `BookmarkAnswerButton`, or `chatToMarkdown` export — `content` is already
  the full markdown string, so copy/bookmark/export keep working (and the
  `.md` export becomes more accurate, since the content is genuinely
  markdown now).

## Out of Scope (future phases)

- **Phase 2 — Interactive HTML artifacts**: AI-generated HTML/CSS/JS in a
  ` ```html ` fenced block, rendered in a sandboxed `<iframe srcdoc>`
  (`sandbox="allow-scripts"`, no `allow-same-origin`). Builds on the
  `ChatMarkdown` code-block renderer added here (just another language
  branch).
- **Phase 3 — Image generation**: new `/api/ai/image` route using the
  Cloudflare Workers `AI` binding (e.g. `@cf/black-forest-labs/flux-1-schnell`),
  rendered inline in chat.
- Markdown/diagram rendering for `/api/ai/explain`, `/api/ai/hint`, or
  `/api/ai/explain-arch` responses — not requested, but `ChatMarkdown` would
  be directly reusable there later.

## Testing

- Unit-style check on `stripFences`/`parseAIJson` with a `reply` value
  containing an embedded ` ```mermaid ... ``` ` block — confirm it survives
  `JSON.parse` intact.
- Manual: ask the chat a flow/architecture question (e.g. "How does S3
  cross-region replication work?") on the free provider and on a BYOK
  provider, confirm a diagram renders, and confirm a deliberately-malformed
  mermaid string falls back to the raw-code view without breaking the
  message.
- Confirm existing example prompts, copy/bookmark/export, and retry-on-error
  still work unchanged.
