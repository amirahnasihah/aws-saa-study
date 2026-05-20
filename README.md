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
- **Cloudflare Pages** for hosting (Git integration — push to deploy)

## Local dev

```bash
bun install
bun dev
```

## Deploy

Push to `main` — Cloudflare builds and deploys automatically.

**One-time setup** in [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**:

| Setting | Value |
|---------|-------|
| Repository | `amirahnasihah/aws-saa-study` |
| Production branch | `main` |
| Framework preset | None (or Next.js Static HTML Export) |
| Build command | `bun run build` |
| Build output directory | `out` |
| Root directory | `/` |

**Environment variable** (Production):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://aws.amrhnshh.com` |

If the project already exists from the old repo name, open **Settings → Builds & deployments** and reconnect Git to `aws-saa-study`.

Live: **https://aws.amrhnshh.com** (also **https://aws-saa-study.pages.dev**)

Manual deploy from your machine (optional):

```bash
bunx wrangler login   # once
bun run deploy
```

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
