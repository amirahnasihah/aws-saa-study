# Changelog

All notable changes to this project are documented here.
The changelog page at `/changelog` is the canonical version — this file mirrors it.

---

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
- **feat** PT6 (wz6): 65 Whizlabs Practice Test 6 questions seeded to remote D1 — answers verified via AWS docs MCP
- **feat** Screenshots for wz6 (65), wzs1 (10), wzs2 (5), wzs3 (5) added to public/questions/
- **feat** Glossary: 14 new terms — delete marker, noncurrent versions, secondary VPC CIDR, SNI, OAC, OAI, edge-to-edge routing, transitive peering, instance store, EBS-backed, Elastic Volumes, EBS snapshot, AWS Backup, EFS performance/throughput modes, EFS mount helper
- **feat** awsServices notes: CloudFront OAC + Lambda@Edge, ALB SNI, API Gateway, AppFlow, SageMaker, VPC Peering edge-to-edge, EBS storage types, EFS performance/throughput modes + encryption in transit + cross-VPC tips, AWS Backup
- **fix** Official AWS docs reference URLs added to all wzs1, wzs2, wzs3 questions

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
