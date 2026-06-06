# AWS SAA Study

Personal study reference for the **AWS Solutions Architect Associate (SAA-C03)** exam. Built as a Next.js app, deployed to Cloudflare Pages with Cloudflare D1 as the database.

## Table of Contents

- [What's inside](#whats-inside)
- [Stack](#stack)
- [Local dev](#local-dev)
- [Deploy](#deploy)
- [Database (Cloudflare D1)](#database-cloudflare-d1)
- [Data files](#data-files)
- [Content scope](#content-scope)
- [MCP Servers](#mcp-servers-claude-code)
- [GitHub Actions](#github-actions)

## What's inside

| Route | What |
| --- | --- |
| `/` | Quick cheatsheet — service name, mnemonic, keywords across all 4 domains |
| `/learn` | Deep Notes — full explanations, exam scenarios, tips (Malay + English) |
| `/visual` | Interactive architecture diagrams (React Flow) |
| `/vpc` | VPC deep dive — CIDR, subnets, NAT, routing |
| `/practice` | Practice questions (fetched from D1, fallback to local data) |

## Stack

- **Next.js 16** (App Router, edge runtime via `@cloudflare/next-on-pages`)
- **Tailwind CSS v4**
- **React Flow** (`@xyflow/react`) for interactive architecture diagrams
- **Bun** as package manager
- **Cloudflare Pages** for hosting
- **Cloudflare D1** (SQLite at edge) for questions and glossary

## Local dev

```bash
bun install
bun dev
```

## Deploy

Push to `main` — Cloudflare Pages builds and deploys automatically using `wrangler.jsonc` config.

**Cloudflare Dashboard setup** → Workers & Pages → aws-saa-study → Settings → Builds & deployments:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `bun run pages:build` |
| Build output directory | `.vercel/output/static` |

### AI secrets (required for `/ai`)

Free AI needs server-side keys as **Cloudflare Secrets** (not Plaintext vars — `wrangler.jsonc` manages vars). Add on **Preview + Production**:

| Secret | Minimum |
| --- | --- |
| `ILMU_API_KEY` | At least one of ILMU / NVIDIA / GEMINI |
| `GEMINI_API_KEY` | Recommended (fallback) |
| `NVIDIA_API_KEY` | Optional fallback |

Dashboard → **Add → Secret**. Copy values from `.dev.vars`. Full checklist: [docs/deploy-cloudflare.md](docs/deploy-cloudflare.md).

Manual deploy from your machine:

```bash
bunx wrangler login   # once
bun run deploy
```

Live: [aws.amrhnshh.com](https://aws.amrhnshh.com) (also [aws-saa-study.pages.dev](https://aws-saa-study.pages.dev))

## Database (Cloudflare D1)

D1 database: `aws-saa-questions` (region: APAC/HKG)

| Table | Rows | Content |
| --- | --- | --- |
| `questions` | 122 | MCQ practice questions (60 custom + 62 Whizlabs SAA-C03) |
| `glossary` | 133 | AWS terms with definitions and categories |

Seed scripts live in `scripts/` — run locally to repopulate D1:

```bash
# Questions
bun run scripts/seed-d1.ts
bunx wrangler d1 execute aws-saa-questions --remote --file=scripts/seed.sql

# Glossary
bun run scripts/seed-glossary.ts
bunx wrangler d1 execute aws-saa-questions --remote --file=scripts/glossary-seed.sql
```

## Data files

Static content lives in `data/` — served as fallback when D1 is empty or unavailable:

| File | Content |
| --- | --- |
| `data/awsServices.ts` | All AWS service cards across all 4 SAA-C03 domains + deep notes |
| `data/practiceQuestions.ts` | Practice Q&A (fallback for D1 questions table) |
| `data/architectures.ts` | React Flow node/edge definitions for visual diagrams |
| `data/glossary.ts` | Tooltip glossary terms (fallback for D1 glossary table) |

## Content scope

Covers all 4 SAA-C03 exam domains:

- **D1** — Design Secure Architectures (30%)
- **D2** — Design Resilient Architectures (26%)
- **D3** — Design High-Performing Architectures (24%)
- **D4** — Design Cost-Optimized Architectures (20%)

## MCP Servers (Claude Code)

`.mcp.json` configures MCP servers for use during development with Claude Code.

### AWS Documentation MCP

```json
"aws-documentation": {
  "command": "uvx",
  "args": ["awslabs.aws-documentation-mcp-server@latest"]
}
```

**Tools available:**

| Tool | Use |
| --- | --- |
| `search_documentation` | Search across all AWS docs by keyword |
| `read_documentation` | Fetch full content of a specific docs URL |
| `read_sections` | Read specific sections from a docs page |
| `recommend` | Find related pages or recently updated content |

**Best used for:**

- Verifying exact AWS service definitions (for glossary accuracy)
- Checking official DR strategy descriptions (Pilot Light, Warm Standby, etc.)
- Finding updated service limits, quotas, or new feature docs
- Getting official wording when writing exam notes

**Limitations:**

- Content often truncated — need multiple calls with `start_index` for long pages
- Useful for **verify + discovery**, not for broad "list everything" queries
- For well-known SAA-C03 content, Claude's training data is usually sufficient — MCP shines for recent updates or exact official wording

## GitHub Actions

CI/CD workflows live in `.github/`. See [.github/docs/CLAUDE_ACTIONS.md](.github/docs/CLAUDE_ACTIONS.md) for the Claude Code actions setup.
