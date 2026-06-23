export type ChangeType = 'feat' | 'fix' | 'chore' | 'refactor'

export type ChangeItem = {
  type: ChangeType
  text: string
}

export type ChangeEntry = {
  id: string
  date: string
  /** Shown in timeline when multiple releases share the same date */
  subtitle?: string
  changes: ChangeItem[]
}

export const changelog: ChangeEntry[] = [
  {
    id: '2026-06-23',
    date: '2026-06-23',
    changes: [
      { type: 'chore', text: 'Deep Notes authoring standard codified in CLAUDE.md — 6-ingredient recipe (anatomy, comparison tables, mermaid, memory aids, exam traps, sources + glossary) for every awsServices/scenarios enrichment' },
      { type: 'feat', text: 'Analytics §10 (D4) Deep Notes enrichment — EMR node roles + Kilang Kerupuk analogy, Glue Jus Mangga anatomy, Athena cost model, Redshift cluster anatomy, OpenSearch/MSK/CUR comparisons; 15+ glossary terms added' },
      { type: 'feat', text: 'Scenarios: long-running / async processing pattern — Lambda → SQS → Batch/Fargate/EC2 beyond 15-minute limit; matching architecture on /visual' },
      { type: 'feat', text: 'Deep Notes: S3 bucket policy insights (sourceVpce denial trap), VPC endpoint connectivity clarifications, KMS + monitoring service mermaid diagrams' },
      { type: 'feat', text: 'AI routes (chat, explain, hint, explain-arch): mirror user language — Malay or English prose, AWS service names and technical terms stay English' },
      { type: 'fix', text: 'Bookmark sync: Supabase aws_study_notes schema USAGE + API exposure — silent write failures fixed; useBookmarks error logging + local→remote merge upsert' },
    ],
  },
  {
    id: '2026-06-21',
    date: '2026-06-21',
    changes: [
      { type: 'feat', text: 'Bookmarks page (/bookmarks): full list of saved services and AI answers — export .md, clear all, synced to Supabase when signed in' },
      { type: 'feat', text: 'Bookmark detail (/bookmarks/[id]): full saved AI answer with ChatMarkdown rendering, AWS docs link, remove action' },
      { type: 'feat', text: 'Bookmarks panel: title links to /bookmarks; AI answer rows open detail page; Bookmarks added to mobile nav drawer' },
      { type: 'fix', text: 'Cloudflare Pages deploy: edge runtime on /bookmarks/[id] — fixes next-on-pages build failure for dynamic bookmark routes' },
      { type: 'feat', text: 'Practice page redesign: desktop sidebar question grid (answered/current states), wider 1280px layout, PracticeModeToggle, InlineQuizFooter + shared FloatingQuizNav' },
      { type: 'feat', text: 'Practice question picker: FloatingBar hides on mobile while the jump-to-question modal is open — no overlap with bottom nav' },
      { type: 'feat', text: 'FloatingBar: AskAIButton with aria-controls + static aria-expanded for Edge Tools a11y; dedicated toggle wired to AI chat dialog' },
      { type: 'feat', text: 'VPC page (/vpc): sticky “On this page” TOC with scrollspy, nested AWS-style architecture diagram, route-table comparison blocks' },
      { type: 'feat', text: 'OnThisPage (Cheat Sheet + Deep Notes): Notion-style vertical rail on xl screens, horizontal sticky domain pills below — scrollspy highlights active section' },
      { type: 'feat', text: 'Deep Notes comparison tables: LearnCard renders CompareTable side-by-side blocks (e.g. Multi-AZ vs Read Replicas, NAT GW vs Instance) from awsServices data' },
      { type: 'chore', text: 'AI internal links: generated deepNotesLinkIndex + labsLinkIndex at build time (bun run scripts/generate-ai-link-indexes.ts); pages:build runs index gen before next-on-pages' },
      { type: 'feat', text: 'Practice quiz mode: floating bottom nav (← Prev · N/M · Next →) matches Review — answer history preserved when jumping back' },
      { type: 'fix', text: 'Mobile nav drawer: Browse Services section restored (D1–D4 domain jump pills to Cheat Sheet sections)' },
      { type: 'feat', text: 'FloatingBar: single bottom pill (Ask AI · Search · Bookmarks) replaces separate corner FABs; lifts above Practice action bar' },
      { type: 'feat', text: 'Exam guide page (/exam-guide): D1–D4 weight bars, competencies, topics, scoring note — shared data/exam.ts module; linked from About page' },
      { type: 'feat', text: 'LearnCard: Mermaid diagrams, static images, and flow diagrams rendered inline in Deep Notes cards' },
      { type: 'feat', text: 'Scenarios page (/scenarios): domain filter pills (D1–D4), 18 SAA-C03 architecture patterns — VPC connectivity, TGW, endpoints, CloudFront+OAC, IAM, security' },
      { type: 'feat', text: 'Visual page: structured sidebar navigation, DiagramPanel layout, 15 architectures — TGW hub, VPC Endpoints (gateway vs interface), CloudFront+OAC; canvas 460→520px' },
      { type: 'feat', text: 'VPC page + Deep Notes: VPC Flow Logs section — ACCEPT/REJECT metadata, CloudWatch Logs / S3 / Firehose destinations, exam traps' },
      { type: 'feat', text: 'Deep Notes D1–D3 enrichments: STS, Directory Service, KMS, Aurora vs DynamoDB comparisons, S3 storage classes, Fargate anatomy' },
      { type: 'feat', text: 'AIChatView: message edit + resend; ChatMarkdown image fallback' },
    ],
  },
  {
    id: '2026-06-11',
    date: '2026-06-11',
    changes: [
      { type: 'feat', text: 'RAG over glossary + labs: 197 glossary terms and 110 labs embedded into Cloudflare Vectorize (@cf/baai/bge-base-en-v1.5, 768-dim cosine index "glossary-rag") for semantic retrieval' },
      { type: 'feat', text: 'lib/ai/rag.ts — queryRag() embeds the question and retrieves the top-K most similar entries (similarity ≥ 0.6); formatRagContext() injects them as AWS-verified grounding context' },
      { type: 'feat', text: '/api/ai/explain (practice AI Explain drawer) now grounds answers in semantically matched glossary definitions, not just keyword matches' },
      { type: 'feat', text: '/api/ai/explain-arch (Visual page sidebar) now grounds node + diagram explanations in retrieved glossary and lab content alongside live AWS docs search' },
      { type: 'chore', text: 'scripts/sync-rag-index.ts (bun run rag:sync): offline embedding + upsert pipeline via Workers AI and Vectorize v2 REST APIs, idempotent by content hash' },
    ],
  },
  {
    id: '2026-06-09',
    date: '2026-06-09',
    changes: [
      { type: 'feat', text: 'Labs section (/labs): new index + detail pages for personal hands-on lab notes — typed data model (slug, level, services, tasks, takeaways), anchor navigation between tasks, "What I Learned" section' },
      { type: 'feat', text: 'Labs: seeded with IAM intro lab (users, groups, least-privilege policies) and EC2 fundamentals lab (VPC, instance launch, Apache, custom page)' },
      { type: 'feat', text: 'Nav: Labs added to desktop nav bar and mobile drawer (🧪 icon)' },
      { type: 'feat', text: 'SiteFooter: Labs link added site-wide ("Labs · hands-on practice notes")' },
      { type: 'feat', text: 'AI sources: internal site pages (Labs, VPC Guide) now surface as clickable source links alongside AWS Docs and YouTube — powered by keyword-scored findInternalLinks() matcher' },
      { type: 'feat', text: 'Internal sources wired into all AI flows: chat, explain (practice), hint (practice), and Visual page explain-arch sidebar' },
    ],
  },
  {
    id: '2026-06-06',
    date: '2026-06-06',
    changes: [
      { type: 'feat', text: 'Visual page: always-visible AI sidebar — click any node for per-service explanation or "✦ Explain diagram" for full architecture overview; structured sections: What problem, How traffic flows, SAA-C03 Exam Relevance, Common Exam Traps, Sources' },
      { type: 'feat', text: 'Visual page: Sources section now powered by AWS Knowledge MCP — up to 3 live docs.aws.amazon.com links fetched in parallel with AI explanation (replaced static study PDFs)' },
      { type: 'fix', text: 'aws-knowledge.ts pickBestHit: optional chaining on h.url prevents TypeError when MCP returns hits with missing url field (was causing 500s)' },
      { type: 'feat', text: 'ReactFlow Controls panel: dark theme override via globals.css — transparent bg, visible icons, consistent with site dark palette' },
      { type: 'feat', text: 'AI page (/ai) now linked in nav — animated sparkle ✦ icon on desktop, "Ask AI" in mobile drawer' },
      { type: 'feat', text: 'Free AI: ILMU (primary) → NVIDIA NIM → Gemini 2.5 Flash automatic fallback chain — if one hits rate limits, next kicks in transparently' },
      { type: 'feat', text: 'NVIDIA NIM added as free server-side provider (nvapi- key, 40 RPM, 100+ models including Llama 3.3 70B)' },
      { type: 'feat', text: 'OpenRouter BYOK: access 27+ free models (Llama, DeepSeek, Qwen) via single sk-or- key' },
      { type: 'feat', text: 'AI provider toggle redesigned: Auto (free fallback) + OpenRouter/Ollama as BYOK — no manual free provider selection needed' },
      { type: 'feat', text: 'AI chat: viewport-height layout, example prompt chips, Chat / Explain question mode toggle, trash icon to clear history' },
      { type: 'fix', text: 'SSR hydration mismatch on AI provider — localStorage now read in useEffect, not useState initializer' },
      { type: 'refactor', text: 'ILMU, Gemini, NVIDIA use server-side keys (no user config); Claude/Anthropic BYOK hidden from UI (backend still functional)' },
    ],
  },
  {
    id: '2026-06-05',
    date: '2026-06-05',
    changes: [
      {
        type: 'feat',
        text: 'Global PWA MVP: manifest.webmanifest + icon-192/512 PNG on whole site (installable from any page); /pwa stays hidden design lab for mockups',
      },
      {
        type: 'fix',
        text: 'AI leave warnings (beforeunload / Back / in-app links) only on /ai and /practice — not site-wide',
      },
    ],
  },
  {
    id: '2026-06-04',
    date: '2026-06-04',
    changes: [
      { type: 'feat', text: 'AI study page (/ai): Chat + Explain question modes — Groq (server), Claude & ILMU (BYOK); not linked in main nav (direct URL only)' },
      { type: 'feat', text: 'AI session persistence: chat + practice hints in sessionStorage (survives refresh, cleared when browser/tab session ends)' },
      { type: 'feat', text: 'Native leave warnings when AI session has data: beforeunload (close/refresh), confirm on Back, confirm on in-app link navigation' },
      { type: 'feat', text: 'Practice: “Understand this question” pre-answer hint — what the question asks, keywords, how to tackle; AWS docs via Knowledge MCP + study notes; no YouTube' },
      { type: 'feat', text: 'API routes: /api/ai/chat (YouTube search links on chat only), /api/ai/explain, /api/ai/hint — shared provider routing (Groq / Anthropic / ILMU)' },
      { type: 'feat', text: 'AWS Knowledge MCP: real docs.aws.amazon.com URLs resolved server-side from docsSearchPhrase (no hallucinated doc links)' },
      { type: 'feat', text: 'ILMU BYOK: api.ilmu.ai Anthropic-compatible messages API (nemo-super) alongside Claude sk-ant- keys' },
      { type: 'feat', text: 'Ollama Cloud BYOK: ollama.com/api/chat with Bearer API key (default model gpt-oss:120b) on /ai, practice hints, and explain routes' },
      { type: 'chore', text: 'wrangler.jsonc: GROQ_API_KEY and AI_GATEWAY_BASE_URL binding placeholders — secrets via .dev.vars locally or wrangler secret in production' },
      { type: 'refactor', text: 'lib/ai: providers, complete-json, aws-knowledge, client-headers; AWSDocsLink / QuestionHintPanel / PracticeQuestionHint components' },
      { type: 'feat', text: 'Practice hints: bullet-point concise copy, amber keyword highlights, session cache per questionId (instant replay + Regenerate)' },
      { type: 'feat', text: 'Practice hints: Deep Notes link to /learn#section (matched from awsServices index — e.g. EC2 User Data → Compute section)' },
    ],
  },
  {
    id: '2026-06-03-glossary',
    date: '2026-06-03',
    subtitle: 'Glossary & UI',
    changes: [
      { type: 'feat', text: 'Glossary page (/glossary): new standalone page — search + 14 category filters, 2-col responsive grid' },
      { type: 'feat', text: 'About page: Glossary card added to link grid (Portfolio / GitHub / Changelog / Glossary)' },
      { type: 'feat', text: 'Glossary: synced TS ↔ D1 — added 51 new terms from SQL (DR strategies, IAM policies, Lambda, Fargate, load balancers, S3 features, DynamoDB DAX/TTL) + generated glossary-batch3.sql (64 rows) for D1 update' },
      { type: 'fix', text: 'Reserved Instances definition corrected: Standard RIs up to 72% off, Convertible RIs up to 66% — verified via AWS docs MCP' },
      { type: 'feat', text: 'glossaryCategories: added IAM & Policies, Load Balancers, S3 Features categories; expanded Compute, Networking, Architecture with new terms' },
      { type: 'feat', text: '404 page (/not-found.tsx): gradient 404, ambient glow blobs, quick-nav cards to all sections' },
      { type: 'feat', text: 'Custom scrollbar: slim 6px global scrollbar replacing browser default — applied via globals.css' },
      { type: 'fix', text: 'GlossaryTerm tooltip: switched to position:fixed to escape overflow:hidden table containers; atomic TooltipState prevents position race' },
      { type: 'fix', text: 'Visual page ArchNode: removed left-side accent bar that the user flagged' },
      { type: 'feat', text: 'Scenarios page: added new architecture patterns — expanded beyond S3+CloudFront to cover additional AWS solution flows; refined scenario details and metadata layout for better clarity' },
    ],
  },
  {
    id: '2026-06-03-practice-tests',
    date: '2026-06-03',
    subtitle: 'Core wzs4–9',
    changes: [
      { type: 'feat', text: 'wzs4–wzs9 (API GW, Lambda, App Integration, Database, ML, Analytics): 35 questions seeded to remote D1 — all answers verified via AWS docs MCP' },
      { type: 'feat', text: 'Screenshots for wzs4 (5), wzs5 (4), wzs6 (7), wzs7 (10), wzs8 (4), wzs9 (5) added to public/questions/' },
      { type: 'feat', text: 'Practice page: new "By Set" filter — All / Practice Tests / Section Tests / Final Test' },
      { type: 'feat', text: 'API route: new ?set= filter param (pt / section / final) with SQLite LIKE conditions' },
      { type: 'feat', text: 'Glossary: 35+ new terms — VPC Link, API throttling, API caching, Lambda authorizer, Usage Plan, SQS Long Polling, Visibility Timeout, SQS FIFO, Dead Letter Queue, SNS fan-out, Step Functions, RDS Multi-AZ, Aurora Serverless, DynamoDB PITR, DynamoDB Auto Scaling, AWS DMS, CloudFormation DeletionPolicy, Secrets Manager, Aurora Replicas, Comprehend, Lex, Textract, Kendra, Rekognition, Polly, MSK, OpenSearch, Data Exchange, Kinesis Data Streams, Glue' },
      { type: 'feat', text: 'awsServices notes: SQS Long Polling + Visibility Timeout + FIFO + SNS→SQS→Lambda tips; MSK no-SSH + ESM + Serverless tips; new Kendra, Data Exchange cards; AI/ML card updated with Comprehend/Textract/Lex differentiators' },
      { type: 'feat', text: 'Scenarios page (/scenarios): architecture pattern study page — flow diagram, anatomy breakdown, exam traps, tips, official docs links' },
      { type: 'feat', text: 'First scenario: S3 + CloudFront static website hosting — OAC vs OAI, ACM us-east-1 requirement, signed URLs/cookies, geo restriction, caching, Lambda@Edge vs CF Functions — verified via AWS docs MCP' },
      { type: 'feat', text: 'data/scenarios.ts: extensible scenario data schema (flow nodes, anatomy, nuances, tips, sources)' },
    ],
  },
  {
    id: '2026-06-02',
    date: '2026-06-02',
    changes: [
      { type: 'feat', text: 'wzs3 (EFS Section Test): 5 questions seeded to remote D1 — answers verified via AWS docs MCP' },
      { type: 'feat', text: 'wzs2 (Storage Section Test): 5 questions seeded to remote D1 — answers verified via AWS docs MCP' },
      { type: 'feat', text: 'wzs1 (VPC Section Test): 10 questions seeded to remote D1 — answers verified via AWS docs MCP' },
      { type: 'feat', text: 'PT6 (wz6): 65 Core Practice Test 6 questions seeded to remote D1 — answers verified via AWS docs MCP' },
      { type: 'feat', text: 'Screenshots for wz6 (65), wzs1 (10), wzs2 (5), wzs3 (5) added to public/questions/' },
      { type: 'feat', text: 'Glossary: 14 new terms — delete marker, noncurrent versions, secondary VPC CIDR, SNI, OAC, OAI, edge-to-edge routing, transitive peering, instance store, EBS-backed, Elastic Volumes, EBS snapshot, AWS Backup, EFS performance/throughput modes, EFS mount helper' },
      { type: 'feat', text: 'awsServices notes: CloudFront OAC + Lambda@Edge, ALB SNI, API Gateway, AppFlow, SageMaker, VPC Peering edge-to-edge, EBS storage types, EFS performance/throughput modes + encryption in transit + cross-VPC tips, AWS Backup' },
      { type: 'fix', text: 'Official AWS docs reference URLs added to all wzs1, wzs2, wzs3 questions' },
    ],
  },
  {
    id: '2026-05-28',
    date: '2026-05-28',
    changes: [
      { type: 'feat', text: 'PT4 (wz4): 65 Core Practice Test 4 questions seeded to remote D1' },
      { type: 'feat', text: 'PT5 (wz5): 65 Core Practice Test 5 questions seeded to remote D1 — answers verified via AWS docs MCP' },
      { type: 'feat', text: 'Screenshots for wz4 and wz5 (130 images) added to public/questions/' },
      { type: 'feat', text: 'Glossary: 15 new terms — awsvpc, ENI, EBK, PBK, ABAC, NotPrincipal, CORS, Anycast, PoP, DRA, Standby state, cooldown period, InService, bridge, host' },
      { type: 'feat', text: 'awsServices notes: CloudHSM backup (EBK/PBK), FSx Lustre DRA + S3 integration, QuickSight ML forecasting, Client VPN, Step Functions Distributed Map, X-Ray Insights, Glue Crawler, Polly StartSpeechSynthesisTask, Global Accelerator static IPs' },
    ],
  },
  {
    id: '2026-05-27',
    date: '2026-05-27',
    changes: [
      { type: 'feat', text: 'Changelog page at /changelog — type filters, collapsible releases, relative dates' },
      { type: 'feat', text: 'Timeline sidebar with scroll spy, progress rail, and jump-to-date' },
      { type: 'feat', text: 'Desktop layout: scrollable changelog panel beside pinned timeline' },
      { type: 'feat', text: 'Changelog link on About page and footer' },
      { type: 'feat', text: 'changelog:draft script — draft new entries from git log' },
      { type: 'refactor', text: 'Changelog data and types moved to data/changelog.ts' },
      { type: 'refactor', text: 'Changelog entries use native details/summary for accessibility' },
    ],
  },
  {
    id: '2026-05-26',
    date: '2026-05-26',
    changes: [
      { type: 'feat', text: 'Quiz import script for Core practice questions' },
      { type: 'chore', text: 'Extended .gitignore for generated files and workspace config' },
    ],
  },
  {
    id: '2026-05-25',
    date: '2026-05-25',
    changes: [
      { type: 'feat', text: 'Screenshot support for practice questions' },
      { type: 'feat', text: 'AWS reference URL verification script' },
      { type: 'feat', text: 'Seed script for screenshot metadata' },
    ],
  },
  {
    id: '2026-05-21',
    date: '2026-05-21',
    changes: [
      { type: 'feat', text: 'Question filtering by source in API and practice page' },
      { type: 'fix', text: 'Reset quiz state after fetching new questions' },
      { type: 'feat', text: 'Glossary batch 2 — disaster recovery, compute, IAM terms' },
      { type: 'chore', text: 'MCP server config for AWS documentation' },
      { type: 'feat', text: 'Service tips and keywords added to awsServices' },
      { type: 'refactor', text: "FilterSource: renamed 'custom' → 'others' for clarity" },
    ],
  },
  {
    id: '2026-05-20',
    date: '2026-05-20',
    changes: [
      { type: 'feat', text: 'Glossary schema and initial seed data' },
      { type: 'chore', text: 'Dependabot cooldown period (3 days) for update management' },
      { type: 'chore', text: 'CI: added bun audit step for dependency security checks' },
      { type: 'chore', text: 'Upgraded GitHub Actions to checkout@v5' },
      { type: 'feat', text: 'More AWS service tips and descriptions' },
    ],
  },
  {
    id: '2026-05-19',
    date: '2026-05-19',
    changes: [
      { type: 'feat', text: 'About page with GitHub and portfolio links' },
      { type: 'fix', text: 'OG image previews for Meta platforms (IG, Threads, WhatsApp)' },
      { type: 'fix', text: 'Canonical URL set to aws.amrhnshh.com' },
      { type: 'chore', text: 'Switched to static OG/Twitter PNG images' },
      { type: 'refactor', text: 'Renamed project to aws-saa-study' },
      { type: 'feat', text: 'Cloudflare Pages integration and deployment config' },
      { type: 'refactor', text: 'Layout and spacing improvements across all pages' },
    ],
  },
  {
    id: '2026-05-18',
    date: '2026-05-18',
    changes: [
      { type: 'feat', text: 'Bookmark feature — save and persist AWS service cards' },
    ],
  },
  {
    id: '2026-05-17',
    date: '2026-05-17',
    changes: [
      { type: 'feat', text: 'SiteFooter component added across all pages' },
      { type: 'feat', text: 'Extra common networking patterns section' },
    ],
  },
  {
    id: '2026-05-11',
    date: '2026-05-11',
    changes: [
      { type: 'feat', text: 'VPC page: RFC 1918 private ranges, prefix-bit breakdown, network/host division' },
      { type: 'feat', text: 'Glossary: octet tooltip wired into GlossaryText component' },
      { type: 'fix', text: 'Removed 2 duplicate practice questions' },
      { type: 'fix', text: 'ESLint 10 compat — pinned react version in config' },
      { type: 'chore', text: 'Regenerated bun.lock to fix CI frozen-lockfile failure' },
    ],
  },
]

export const typeLabel: Record<ChangeType, string> = {
  feat: 'feat',
  fix: 'fix',
  chore: 'chore',
  refactor: 'refactor',
}

export const typeColor: Record<ChangeType, string> = {
  feat: 'text-c1',
  fix: 'text-amber-400',
  chore: 'text-aws-muted',
  refactor: 'text-purple-400',
}

export const typeFilterColor: Record<ChangeType | 'all', string> = {
  all: 'border-aws-border text-aws-muted hover:border-aws-text/30 hover:text-aws-text',
  feat: 'border-c1/30 text-c1 hover:border-c1/60',
  fix: 'border-amber-400/30 text-amber-400 hover:border-amber-400/60',
  chore: 'border-aws-border text-aws-muted hover:border-aws-muted/80',
  refactor: 'border-purple-400/30 text-purple-400 hover:border-purple-400/60',
}

export const typeFilterActive: Record<ChangeType | 'all', string> = {
  all: 'border-aws-text/40 bg-aws-text/10 text-aws-text',
  feat: 'border-c1/60 bg-c1/10 text-c1',
  fix: 'border-amber-400/60 bg-amber-400/10 text-amber-400',
  chore: 'border-aws-muted/60 bg-aws-muted/10 text-aws-text',
  refactor: 'border-purple-400/60 bg-purple-400/10 text-purple-400',
}

export const changeTypes: ChangeType[] = ['feat', 'fix', 'chore', 'refactor']

export const formatChangelogDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export const formatChangelogEntryLabel = (entry: ChangeEntry) =>
  entry.subtitle
    ? `${formatChangelogDate(entry.date)} · ${entry.subtitle}`
    : formatChangelogDate(entry.date)

export const formatRelativeDate = (date: string) => {
  const target = new Date(`${date}T12:00:00`)
  const now = new Date()
  const diffDays = Math.round((now.getTime() - target.getTime()) / 86_400_000)

  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} wk ago`
  return formatChangelogDate(date)
}
