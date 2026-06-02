# Changelog

All notable changes to this project are documented here.
The changelog page at `/changelog` is the canonical version — this file mirrors it.

---

## 2026-06-02

- **feat** PT6 (wz6): 65 Whizlabs Practice Test 6 questions seeded to remote D1 — answers verified via AWS docs MCP
- **feat** Screenshots for wz6 (65 images) added to public/questions/wz6/
- **feat** Glossary: 6 new terms — delete marker, noncurrent versions, secondary VPC CIDR, SNI, OAC, OAI
- **feat** awsServices notes: CloudFront OAC + Lambda@Edge hooks, ALB SNI multi-cert, API Gateway cache key + CORS + VPC Link, AppFlow SaaS connector, SageMaker custom ML platform

## 2026-05-28

- **feat** PT4 (wz4): 65 Whizlabs Practice Test 4 questions seeded to remote D1
- **feat** PT5 (wz5): 65 Whizlabs Practice Test 5 questions seeded to remote D1 — answers verified via AWS docs MCP
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

- **feat** Quiz scraping script for Whizlabs questions
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
