# Claude Code Actions

On-demand AI assistance via `@claude` in issues and PR comments. Claude runs **only when explicitly invoked** — no automatic workflows.

## Workflow

### Claude @claude (`.github/workflows/claude.yml`)

| Trigger | When `@claude` is mentioned in an issue or PR comment |
|---------|------------------------------------------------------|
| Action | Answers questions, implements features, fixes bugs on request |
| Output | Reply comment with analysis or code changes |

**How to use:**
- Add a comment like `@claude What does this function do?`
- Or `@claude Please review this PR`
- Or `@claude Can you fix the bug in this file?`

Slash-style requests work when combined with the tag: `@claude explain this code` or `@claude /explain this`.

---

## Cost Optimizations

The workflow uses **Claude 3.5 Haiku** (~$0.80/$4 per 1M tokens) and `--max-turns 10` to limit iterations. Cost is fully user-controlled since it runs only when someone explicitly tags `@claude`.

---

## Prerequisites

- `ANTHROPIC_API_KEY` secret in repository Settings → Secrets
- Claude GitHub App installed: https://github.com/apps/claude

---

## Deploy (`.github/workflows/deploy.yml`)

| Trigger | Push to `main`, or manual **workflow_dispatch** |
|---------|--------------------------------------------------|
| Action | `bun run build` → `wrangler pages deploy` to **aws-saa-study** (via `wrangler.jsonc`) |

**Secrets:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (see README Deploy section).

Release merges to the `release` branch also deploy via `.github/workflows/release.yml`.
