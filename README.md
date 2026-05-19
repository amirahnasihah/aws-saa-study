# AWS SAA Study

Personal study reference for the **AWS Solutions Architect Associate (SAA-C03)** exam. Built as a Next.js app, deployed to Cloudflare Pages.

## What's inside

| Route | What |
|---|---|
| `/` | Quick cheatsheet — service name, mnemonic, keywords across all 4 domains |
| `/learn` | Deep Notes — full explanations, exam scenarios, tips (Malay + English) |
| `/visual` | Interactive architecture diagrams (React Flow) |
| `/vpc` | VPC deep dive — CIDR, subnets, NAT, routing |
| `/practice` | Practice questions |

## Stack

- **Next.js 16** (App Router, static export)
- **Tailwind CSS v4**
- **React Flow** (`@xyflow/react`) for interactive architecture diagrams
- **Bun** as package manager
- **Cloudflare Pages** for hosting (via `wrangler pages deploy`)

## Local dev

```bash
bun install
bun dev
```

## Deploy

```bash
bunx wrangler login   # once
bun run deploy        # next build + wrangler pages deploy
```

Live: **https://aws-saa-study.pages.dev**

### GitHub Actions

Push to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Add repository secrets:

| Secret | Where to get it |
|--------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens (template: Edit Cloudflare Workers, include **Pages Edit**) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → right sidebar |

## Data files

All content lives in `data/` — no database, fully static:

| File | Content |
|---|---|
| `data/awsServices.ts` | All AWS service cards across all 4 SAA-C03 domains + extra tools |
| `data/practiceQuestions.ts` | Practice Q&A |
| `data/architectures.ts` | React Flow node/edge definitions for visual diagrams |
| `data/glossary.ts` | Tooltip glossary terms |

## Content scope

Covers all 4 SAA-C03 exam domains:

- **D1** — Design Secure Architectures (30%)
- **D2** — Design Resilient Architectures (26%)
- **D3** — Design High-Performing Architectures (24%)
- **D4** — Design Cost-Optimized Architectures (20%)

The `/learn` and `/visual` pages also include a **bonus section** for open-source tools (e.g. Litestream) that are useful in real-world AWS setups but not on the SAA-C03 exam. These are clearly marked with a "not in exam" label.

## GitHub Actions

CI/CD workflows live in `.github/`. See [.github/docs/CLAUDE_ACTIONS.md](.github/docs/CLAUDE_ACTIONS.md) for the Claude Code actions setup and cost optimizations.
