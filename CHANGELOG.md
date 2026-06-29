# Changelog

All notable changes to this project are documented here.
The changelog page at `/changelog` is the canonical version — this file mirrors it.

---

## 2026-06-30

- **feat** Deep Notes — DataSync incremental transfer sifir + S3 Lifecycle "all storage classes" rule line

## 2026-06-29

- **feat** Deep Notes — full GWLB card (ALB recipe depth); NLB enriched to match ALB; Lambda fungsi rewritten to Manglish plain-meaning + compute-vs-router framing
- **feat** Deep Notes — Elastic Beanstalk enriched to Lambda depth (deployment policies, tiers, perangkap)
- **feat** RDS encryption-at-rest — Deep Notes guidance + glossary entry (snapshot→copy→restore, RR inherits source); trigger words for unencrypted instances
- **feat** Trigger words — ELB Health Check row; Ingress=Inbound terminology module on Peta Besar
- **feat** Exam guide — auto-generated service index from awsServices; STUDY-CHECKLIST extended
- **refactor** Practice page — question loading state + improved error handling

## 2026-06-28

- **feat** Trigger words — Peta Besar mermaid, decision trees, core-pattern modules; Migration & Transfer, Threat detection & protection, deregistration-delay, RDS Segitiga Emas, CMK, Kinesis Video, confused-pair rows
- **feat** Deep Notes §5 Security — capstone overview card; Security Hub, Firewall Manager, IAM Roles Anywhere, Artifact; IAM Access Analyzer + RAM; KMS symmetric vs asymmetric + digital signing
- **feat** Deep Notes §5 IAM — ABAC vs RBAC, Permissions Boundary traps, 4-layer permission + cross-account decision mermaids; Confused Deputy + Credential Report
- **feat** Deep Notes §6 Database — Timestream, MemoryDB, DocumentDB, Neptune, Keyspaces to full recipe; RDS TDE engine list (Oracle+SQL Server); at-rest/in-transit peta row
- **feat** Deep Notes §9 Networking — ALB full enrichment (anatomy, Spot+ASG connection draining); Load Balancer docs + glossary; ADS/Inspector/WAF anatomy
- **feat** Deep Notes §2 Compute — EC2 Hibernation 8/8; User Data + Metadata (IMDSv1/v2 SSRF); high-yield thin cards (Shield, Client VPN, Recycle Bin, DynamoDB On-Demand)
- **feat** Deep Notes storage — EBS Volume Types decision-tree + kenderaan analogy; Snapshots enrichment; Pilih Storage tree on /trigger-words; Region & AZ card; Storage Gateway FBT mnemonic
- **feat** Deep Notes containers — ECS/Fargate storage cross-refs (EFS/EBS/bind mount); EKS persistent storage (EBS/EFS/FSx, RWO vs RWX)
- **feat** Deep Notes D2 resilience — AWS Elastic Disaster Recovery (DRS) card; DR strategy + Monolithic/Legacy lifecycle cards
- **feat** Deep Notes skim-tier enrichments — MSK, Kendra, SageMaker, AppSync, AppFlow, CI/CD, Rekognition + practice question; §7 AI services update
- **feat** Exam-confusion gap-fill across §5/§9/§10/§11/§14; SSM enhancements; search relevance ranking fix; SQS write-heavy perangkap
- **feat** CFN helper scripts + VPC endpoint condition keys; merged duplicate Penetration Testing cards
- **fix** Trigger words page — layout and responsiveness improvements

## 2026-06-27

- **refactor** Trap-question field renamed jebakan → umpan (proper Bahasa Melayu) across awsServices data model + LearnCard
- **feat** Recall scaffold on all Deep Notes cards — sebabApa, sifir, perangkap on every service card for exam-pressure recall
- **feat** Deep Notes §6 Database gap-fill — compare tables + analogy mermaids (Aurora, DynamoDB, RDS, ElastiCache, etc.)
- **feat** Deep Notes §9 Networking — NAT GW (shared vs dedicated, no Stop/Start, IPv6/EIGW, conn limits, pricing), VPC Endpoints/PrivateLink mermaid, SG vs NACL intra-subnet traps, VPC Packet Journey card, EC2 IP types + networking analogies
- **feat** Deep Notes §8 Mgmt + S3 Access Control; Secrets Manager (custom Lambda rotation, private VPC endpoint trap)
- **feat** Foundational comparison tables — EC2 Fleet types, scheduling, block/file/object storage, SQL vs NoSQL; Step Functions vs SQS/Batch/Glue
- **feat** Practice scenarios: KMS multi-region, RDS Proxy + Lambda, ACM cert validation, async S3 file upload, e-commerce ALB configuration
- **feat** EC2 cards — Hibernation Stop/Start trap + sizing formula; Spot standby analogy; ASG Mixed Instances perangkap
- **feat** Cheat Sheet/LearnCard: D1–D4 domain pills on ServiceCard + LearnCard via domainId props
- **feat** deepNotesLinkIndex searchBlob expanded — richer AI internal-link matching for IAM, NAT GW, hibernation topics
- **feat** STUDY-CHECKLIST.md — detailed SAA-C03 exam requirements and AWS concept cross-references
- **chore** CLAUDE.md — Mermaid syntax rules for Deep Notes authoring; NACL rule numbers clarified as priorities not codes
- **feat** Glossary: ECMP, VGW, TGW, Private NAT GW, ephemeral ports, Fault tolerance terms
- **fix** Mermaid label parsing for edge cases in LearnCard renderer
- **feat** Trigger words page (/trigger-words) — keyword→service cheat sheet launched with domain grouping
- **feat** STS card — Kaunter Pengawal / temporary-pass analogy mermaid (AssumeRole); SQS cross-account "Dua Kunci" + DLQ coverage (maxReceiveCount, Redrive)
- **feat** Cross-account "Dua Kunci" pattern + Organizations account-hierarchy diagram; Control Tower + AWS Config anatomy; Principal:"*" public-access trap
- **feat** Lake Formation + Data Lake vs Warehouse coverage; HA vs FT vs Scalability vs Elasticity vs Throughput concepts
- **feat** Firebase↔Amplify BaaS mapping; Route 53 + SQS 4-option perangkap

## 2026-06-26

- **feat** Recall scaffold (sebabApa/sifir/perangkap) on §5 Security, Networking, multi-account, §9 routing/VPC, D2 resilience, SQS/SNS/Kinesis cards
- **feat** §7 ML — AI services decision-tree mermaid; §8 Mgmt — Compute Optimizer FREE, Trusted Advisor 7-check/support-tier pricing
- **feat** §5 Security analogies — Inspector, Macie, CloudHSM; ACM + IAM Identity Center enrichment
- **feat** §6 Aurora Serverless enrichment; AWS Batch full recipe + Lambda Food Truck analogy
- **feat** NACL/SG visual analogies + ephemeral ports glossary
- **fix** Next 16 middleware — valid Headers instance for Supabase auth (fixes edge runtime crash on protected routes)

## 2026-06-25

- **feat** Deep Notes §11 App Integration, §12 Containers (ECS anatomy), §14 Cost Mgmt enrichments
- **feat** CLAUDE.md + STUDY-CHECKLIST — expanded AWS pricing reference table for exam cost-optimization questions
- **feat** STUDY-CHECKLIST + awsServices formatting — enhanced diagrams and section structure
- **fix** OnThisPage responsive classes on Cheat Sheet TOC

## 2026-06-23

- **chore** Deep Notes authoring standard codified in CLAUDE.md — 6-ingredient recipe (anatomy, comparison tables, mermaid, memory aids, exam traps, sources + glossary) for every awsServices/scenarios enrichment
- **feat** Analytics §10 (D4) Deep Notes enrichment — EMR node roles + Kilang Kerupuk analogy, Glue Jus Mangga anatomy, Athena cost model, Redshift cluster anatomy, OpenSearch/MSK/CUR comparisons; 15+ glossary terms added
- **feat** Scenarios: long-running / async processing pattern — Lambda → SQS → Batch/Fargate/EC2 beyond 15-minute limit; matching architecture on /visual
- **feat** Deep Notes: S3 bucket policy insights (sourceVpce denial trap), VPC endpoint connectivity clarifications, KMS + monitoring service mermaid diagrams
- **feat** AI routes (chat, explain, hint, explain-arch): mirror user language — Malay or English prose, AWS service names and technical terms stay English
- **fix** Bookmark sync: Supabase aws_study_notes schema USAGE + API exposure — silent write failures fixed; useBookmarks error logging + local→remote merge upsert

## 2026-06-21

- **feat** Bookmarks page (/bookmarks): full list of saved services and AI answers — export .md, clear all, synced to Supabase when signed in
- **feat** Bookmark detail (/bookmarks/[id]): full saved AI answer with ChatMarkdown rendering, AWS docs link, remove action
- **feat** Bookmarks panel: title links to /bookmarks; AI answer rows open detail page; Bookmarks added to mobile nav drawer
- **fix** Cloudflare Pages deploy: edge runtime on /bookmarks/[id] — fixes next-on-pages build failure for dynamic bookmark routes
- **feat** Practice page redesign: desktop sidebar question grid (answered/current states), wider 1280px layout, PracticeModeToggle, InlineQuizFooter + shared FloatingQuizNav
- **feat** Practice question picker: FloatingBar hides on mobile while the jump-to-question modal is open — no overlap with bottom nav
- **feat** FloatingBar: AskAIButton with aria-controls + static aria-expanded for Edge Tools a11y; dedicated toggle wired to AI chat dialog
- **feat** VPC page (/vpc): sticky “On this page” TOC with scrollspy, nested AWS-style architecture diagram, route-table comparison blocks
- **feat** OnThisPage (Cheat Sheet + Deep Notes): Notion-style vertical rail on xl screens, horizontal sticky domain pills below — scrollspy highlights active section
- **feat** Deep Notes comparison tables: LearnCard renders CompareTable side-by-side blocks (e.g. Multi-AZ vs Read Replicas, NAT GW vs Instance) from awsServices data
- **chore** AI internal links: generated deepNotesLinkIndex + labsLinkIndex at build time (bun run scripts/generate-ai-link-indexes.ts); pages:build runs index gen before next-on-pages
- **feat** Practice quiz mode: floating bottom nav (← Prev · N/M · Next →) matches Review — answer history preserved when jumping back
- **fix** Mobile nav drawer: Browse Services section restored (D1–D4 domain jump pills to Cheat Sheet sections)
- **feat** FloatingBar: single bottom pill (Ask AI · Search · Bookmarks) replaces separate corner FABs; lifts above Practice action bar
- **feat** Exam guide page (/exam-guide): D1–D4 weight bars, competencies, topics, scoring note — shared data/exam.ts module; linked from About page
- **feat** LearnCard: Mermaid diagrams, static images, and flow diagrams rendered inline in Deep Notes cards
- **feat** Scenarios page (/scenarios): domain filter pills (D1–D4), 18 SAA-C03 architecture patterns — VPC connectivity, TGW, endpoints, CloudFront+OAC, IAM, security
- **feat** Visual page: structured sidebar navigation, DiagramPanel layout, 15 architectures — TGW hub, VPC Endpoints (gateway vs interface), CloudFront+OAC; canvas 460→520px
- **feat** VPC page + Deep Notes: VPC Flow Logs section — ACCEPT/REJECT metadata, CloudWatch Logs / S3 / Firehose destinations, exam traps
- **feat** Deep Notes D1–D3 enrichments: STS, Directory Service, KMS, Aurora vs DynamoDB comparisons, S3 storage classes, Fargate anatomy
- **feat** AIChatView: message edit + resend; ChatMarkdown image fallback

## 2026-06-11

- **feat** RAG over glossary + labs: 197 glossary terms and 110 labs embedded into Cloudflare Vectorize (@cf/baai/bge-base-en-v1.5, 768-dim cosine index "glossary-rag") for semantic retrieval
- **feat** lib/ai/rag.ts — queryRag() embeds the question and retrieves the top-K most similar entries (similarity ≥ 0.6); formatRagContext() injects them as AWS-verified grounding context
- **feat** /api/ai/explain (practice AI Explain drawer) now grounds answers in semantically matched glossary definitions, not just keyword matches
- **feat** /api/ai/explain-arch (Visual page sidebar) now grounds node + diagram explanations in retrieved glossary and lab content alongside live AWS docs search
- **chore** scripts/sync-rag-index.ts (bun run rag:sync): offline embedding + upsert pipeline via Workers AI and Vectorize v2 REST APIs, idempotent by content hash

## 2026-06-09

- **feat** Labs section (/labs): new index + detail pages for personal hands-on lab notes — typed data model (slug, level, services, tasks, takeaways), anchor navigation between tasks, "What I Learned" section
- **feat** Labs: seeded with IAM intro lab (users, groups, least-privilege policies) and EC2 fundamentals lab (VPC, instance launch, Apache, custom page)
- **feat** Nav: Labs added to desktop nav bar and mobile drawer (🧪 icon)
- **feat** SiteFooter: Labs link added site-wide ("Labs · hands-on practice notes")
- **feat** AI sources: internal site pages (Labs, VPC Guide) now surface as clickable source links alongside AWS Docs and YouTube — powered by keyword-scored findInternalLinks() matcher
- **feat** Internal sources wired into all AI flows: chat, explain (practice), hint (practice), and Visual page explain-arch sidebar

## 2026-06-06

- **feat** Visual page: always-visible AI sidebar — click any node for per-service explanation or "✦ Explain diagram" for full architecture overview; structured sections: What problem, How traffic flows, SAA-C03 Exam Relevance, Common Exam Traps, Sources
- **feat** Visual page: Sources section now powered by AWS Knowledge MCP — up to 3 live docs.aws.amazon.com links fetched in parallel with AI explanation (replaced static study PDFs)
- **fix** aws-knowledge.ts pickBestHit: optional chaining on h.url prevents TypeError when MCP returns hits with missing url field (was causing 500s)
- **feat** ReactFlow Controls panel: dark theme override via globals.css — transparent bg, visible icons, consistent with site dark palette
- **feat** AI page (/ai) now linked in nav — animated sparkle ✦ icon on desktop, "Ask AI" in mobile drawer
- **feat** Free AI: ILMU (primary) → NVIDIA NIM → Gemini 2.5 Flash automatic fallback chain — if one hits rate limits, next kicks in transparently
- **feat** NVIDIA NIM added as free server-side provider (nvapi- key, 40 RPM, 100+ models including Llama 3.3 70B)
- **feat** OpenRouter BYOK: access 27+ free models (Llama, DeepSeek, Qwen) via single sk-or- key
- **feat** AI provider toggle redesigned: Auto (free fallback) + OpenRouter/Ollama as BYOK — no manual free provider selection needed
- **feat** AI chat: viewport-height layout, example prompt chips, Chat / Explain question mode toggle, trash icon to clear history
- **fix** SSR hydration mismatch on AI provider — localStorage now read in useEffect, not useState initializer
- **refactor** ILMU, Gemini, NVIDIA use server-side keys (no user config); Claude/Anthropic BYOK hidden from UI (backend still functional)

## 2026-06-05

- **feat** Global PWA MVP: manifest.webmanifest + icon-192/512 PNG on whole site (installable from any page); /pwa stays hidden design lab for mockups
- **fix** AI leave warnings (beforeunload / Back / in-app links) only on /ai and /practice — not site-wide
- **feat** Hidden PWA preview page (/pwa): iOS/Android home-screen mockups, install sheet, standalone chrome, icon size grid

## 2026-06-04

- **feat** AI study page (/ai): Chat + Explain question modes — Groq (server), Claude & ILMU (BYOK); not linked in main nav (direct URL only)
- **feat** AI session persistence: chat + practice hints in sessionStorage (survives refresh, cleared when browser/tab session ends)
- **feat** Native leave warnings when AI session has data: beforeunload (close/refresh), confirm on Back, confirm on in-app link navigation
- **feat** Practice: “Understand this question” pre-answer hint — what the question asks, keywords, how to tackle; AWS docs via Knowledge MCP + study notes; no YouTube
- **feat** API routes: /api/ai/chat (YouTube search links on chat only), /api/ai/explain, /api/ai/hint — shared provider routing (Groq / Anthropic / ILMU)
- **feat** AWS Knowledge MCP: real docs.aws.amazon.com URLs resolved server-side from docsSearchPhrase (no hallucinated doc links)
- **feat** ILMU BYOK: api.ilmu.ai Anthropic-compatible messages API (nemo-super) alongside Claude sk-ant- keys
- **feat** Ollama Cloud BYOK: ollama.com/api/chat with Bearer API key (default model gpt-oss:120b) on /ai, practice hints, and explain routes
- **chore** wrangler.jsonc: GROQ_API_KEY and AI_GATEWAY_BASE_URL binding placeholders — secrets via .dev.vars locally or wrangler secret in production
- **refactor** lib/ai: providers, complete-json, aws-knowledge, client-headers; AWSDocsLink / QuestionHintPanel / PracticeQuestionHint components
- **feat** Practice hints: bullet-point concise copy, amber keyword highlights, session cache per questionId (instant replay + Regenerate)
- **feat** Practice hints: Deep Notes link to /learn#section (matched from awsServices index — e.g. EC2 User Data → Compute section)

## 2026-06-03

- **feat** wzs4–wzs9 (API GW, Lambda, App Integration, Database, ML, Analytics): 35 questions seeded to remote D1 — all answers verified via AWS docs MCP
- **feat** Screenshots for wzs4 (5), wzs5 (4), wzs6 (7), wzs7 (10), wzs8 (4), wzs9 (5) added to public/questions/
- **feat** Practice page: new "By Set" filter — All / Practice Tests / Section Tests / Final Test
- **feat** API route: new ?set= filter param (pt / section / final) with SQLite LIKE conditions
- **feat** Glossary: 35+ new terms — VPC Link, API throttling, API caching, Lambda authorizer, Usage Plan, SQS Long Polling, Visibility Timeout, SQS FIFO, Dead Letter Queue, SNS fan-out, Step Functions, RDS Multi-AZ, Aurora Serverless, DynamoDB PITR, DynamoDB Auto Scaling, AWS DMS, CloudFormation DeletionPolicy, Secrets Manager, Aurora Replicas, Comprehend, Lex, Textract, Kendra, Rekognition, Polly, MSK, OpenSearch, Data Exchange, Kinesis Data Streams, Glue
- **feat** awsServices notes: SQS Long Polling + Visibility Timeout + FIFO + SNS→SQS→Lambda tips; MSK no-SSH + ESM + Serverless tips; new Kendra, Data Exchange cards; AI/ML card updated with Comprehend/Textract/Lex differentiators
- **feat** Scenarios page (/scenarios): architecture pattern study page — flow diagram, anatomy breakdown, exam traps, tips, official docs links
- **feat** First scenario: S3 + CloudFront static website hosting — OAC vs OAI, ACM us-east-1 requirement, signed URLs/cookies, geo restriction, caching, Lambda@Edge vs CF Functions — verified via AWS docs MCP
- **feat** data/scenarios.ts: extensible scenario data schema (flow nodes, anatomy, nuances, tips, sources)
- **feat** Scenarios page: added new architecture patterns — expanded beyond S3+CloudFront to cover additional AWS solution flows; refined scenario details and metadata layout for better clarity

## 2026-06-02

- **feat** wzs3 (EFS Section Test): 5 questions seeded to remote D1 — answers verified via AWS docs MCP
- **feat** wzs2 (Storage Section Test): 5 questions seeded to remote D1 — answers verified via AWS docs MCP
- **feat** wzs1 (VPC Section Test): 10 questions seeded to remote D1 — answers verified via AWS docs MCP
- **feat** PT6 (wz6): 65 Core Practice Test 6 questions seeded to remote D1 — answers verified via AWS docs MCP
- **feat** Screenshots for wz6 (65), wzs1 (10), wzs2 (5), wzs3 (5) added to public/questions/
- **feat** Glossary: 14 new terms — delete marker, noncurrent versions, secondary VPC CIDR, SNI, OAC, OAI, edge-to-edge routing, transitive peering, instance store, EBS-backed, Elastic Volumes, EBS snapshot, AWS Backup, EFS performance/throughput modes, EFS mount helper
- **feat** awsServices notes: CloudFront OAC + Lambda@Edge, ALB SNI, API Gateway, AppFlow, SageMaker, VPC Peering edge-to-edge, EBS storage types, EFS performance/throughput modes + encryption in transit + cross-VPC tips, AWS Backup
- **fix** Official AWS docs reference URLs added to all wzs1, wzs2, wzs3 questions

## 2026-05-28

- **feat** PT4 (wz4): 65 Core Practice Test 4 questions seeded to remote D1
- **feat** PT5 (wz5): 65 Core Practice Test 5 questions seeded to remote D1 — answers verified via AWS docs MCP
- **feat** Screenshots for wz4 and wz5 (130 images) added to public/questions/
- **feat** Glossary: 15 new terms — awsvpc, ENI, EBK, PBK, ABAC, NotPrincipal, CORS, Anycast, PoP, DRA, Standby state, cooldown period, InService, bridge, host
- **feat** awsServices notes: CloudHSM backup (EBK/PBK), FSx Lustre DRA + S3 integration, QuickSight ML forecasting, Client VPN, Step Functions Distributed Map, X-Ray Insights, Glue Crawler, Polly StartSpeechSynthesisTask, Global Accelerator static IPs

## 2026-05-27

- **feat** Changelog page at /changelog — type filters, collapsible releases, relative dates
- **feat** Timeline sidebar with scroll spy, progress rail, and jump-to-date
- **feat** Desktop layout: scrollable changelog panel beside pinned timeline
- **feat** Changelog link on About page and footer
- **feat** changelog:draft script — draft new entries from git log
- **refactor** Changelog data and types moved to data/changelog.ts
- **refactor** Changelog entries use native details/summary for accessibility

## 2026-05-26

- **feat** Quiz scraping script for Core practice questions
- **chore** Extended .gitignore for generated files and workspace config

## 2026-05-25

- **feat** Screenshot support for practice questions
- **feat** AWS reference URL verification script
- **feat** Seed script for screenshot metadata

## 2026-05-21

- **feat** Question filtering by source in API and practice page
- **fix** Reset quiz state after fetching new questions
- **feat** Glossary batch 2 — disaster recovery, compute, IAM terms
- **chore** MCP server config for AWS documentation
- **feat** Service tips and keywords added to awsServices
- **refactor** FilterSource: renamed 'custom' → 'others' for clarity

## 2026-05-20

- **feat** Glossary schema and initial seed data
- **chore** Dependabot cooldown period (3 days) for update management
- **chore** CI: added bun audit step for dependency security checks
- **chore** Upgraded GitHub Actions to checkout@v5
- **feat** More AWS service tips and descriptions

## 2026-05-19

- **feat** About page with GitHub and portfolio links
- **fix** OG image previews for Meta platforms (IG, Threads, WhatsApp)
- **fix** Canonical URL set to aws.amrhnshh.com
- **chore** Switched to static OG/Twitter PNG images
- **refactor** Renamed project to aws-saa-study
- **feat** Cloudflare Pages integration and deployment config
- **refactor** Layout and spacing improvements across all pages

## 2026-05-18

- **feat** Bookmark feature — save and persist AWS service cards

## 2026-05-17

- **feat** SiteFooter component added across all pages
- **feat** Extra common networking patterns section

## 2026-05-11

- **feat** VPC page: RFC 1918 private ranges, prefix-bit breakdown, network/host division
- **feat** Glossary: octet tooltip wired into GlossaryText component
- **fix** Removed 2 duplicate practice questions
- **fix** ESLint 10 compat — pinned react version in config
- **chore** Regenerated bun.lock to fix CI frozen-lockfile failure
