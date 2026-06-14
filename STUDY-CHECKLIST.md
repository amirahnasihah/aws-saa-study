# AWS SAA-C03 — Study Checklist

**Progress:** 71 / 199 lectures (36%) · **Exam target:** ~2026-06-28 · **Started checklist:** 2026-06-14

✅ **Done:** Introduction · Getting Started · Compute (8h7m, 4 labs) · Storage (4h18m, 1 lab)
🎯 **Remaining:** ~35.5h content + 17 labs across sections 5–14

### How to use this
Tick **Watch** as you complete each lecture. The **Must be able to answer** items are the real test — if you can't answer one out loud without notes, rewatch. Don't move to the next section until its quiz is ≥80%.

### Exam domain weights (what to protect if time runs short)
| Domain | Weight | Where it lives below |
|--------|--------|----------------------|
| 1 · Design Secure Architectures | **30%** | §5, IAM/KMS everywhere |
| 2 · Design Resilient Architectures | **26%** | §6 DB, §9 Networking, Multi-AZ |
| 3 · Design High-Performing Architectures | **24%** | §6, §9, §10, caching/scaling |
| 4 · Design Cost-Optimized Architectures | **20%** | §14, purchasing options |

Priority legend: 🔴 master fully · 🟠 important · 🟡 moderate · 🟢 know-what-it-does

---

## 5. Security, Identity & Compliance — 🔴 Domain 1 (30%) · 4h37m · 2 labs

### Watch
- [ ] AWS IAM: Users, Groups, Policies & MFA
- [ ] IAM Users and IAM Groups — Demo
- [ ] IAM Policies — Demo
- [ ] IAM Roles — Demo
- [ ] AWS IAM Identity Center (+ Demo)
- [ ] AWS KMS — Overview & Features
- [ ] AWS Directory Service
- [ ] AWS Cognito
- [ ] AWS Secrets Manager (+ Demo)
- [ ] AWS WAF · AWS Shield
- [ ] Amazon GuardDuty (+ Demo)
- [ ] Amazon Inspector (+ Demo)
- [ ] Amazon Macie (+ Create job / Findings)
- [ ] AWS Resource Access Manager · AWS Certificate Manager (ACM)

### Must be able to answer
- [ ] IAM policy evaluation: default deny, **explicit deny always wins** over allow
- [ ] IAM role vs IAM user vs resource-based policy — and cross-account access via roles
- [ ] IAM Identity Center (SSO) + permission sets — when over plain IAM users?
- [ ] KMS: customer-managed vs AWS-managed vs AWS-owned keys; **envelope encryption**; key rotation; multi-region keys
- [ ] KMS vs CloudHSM
- [ ] Directory Service: Managed Microsoft AD vs AD Connector vs Simple AD
- [ ] Cognito **user pool (authN)** vs **identity pool (authZ / temp AWS creds)**
- [ ] Secrets Manager (auto-rotation, RDS integration) vs SSM Parameter Store (free, no rotation)
- [ ] WAF (L7, on ALB/CloudFront/API GW) vs Shield Standard (free L3/4) vs Shield Advanced (paid DDoS)
- [ ] GuardDuty (threat detection from logs) vs Inspector (EC2/ECR/Lambda vuln scan) vs Macie (S3 PII)
- [ ] ACM: free public certs, auto-renew; **must be in us-east-1 for CloudFront**
- [ ] RAM — what can be shared cross-account (VPC subnets, Transit Gateway, etc.)?

### Labs
- [ ] 🧪 Introduction to Amazon GuardDuty
- [ ] 🧪 Discover sensitive data in S3 with Macie

### Quiz
- [ ] Security, Identity & Compliance (12Q) — target ≥80%

---

## 6. Database — 🟠 Domains 2 & 3 · 4h29m · 2 labs

### Watch
- [ ] Amazon RDS Overview · Creating an RDS Instance
- [ ] RDS Multi-AZ Deployment · RDS Read Replicas · Multi-AZ vs Read Replicas
- [ ] Amazon RDS Proxy · RTO and RPO
- [ ] DynamoDB Overview · Create Table · Indexes (LSI & GSI) · DAX
- [ ] Aurora Serverless · Serverless V1 vs V2 · Aurora Global
- [ ] ElastiCache · ElastiCache Security · Session Store

### Must be able to answer
- [ ] **Multi-AZ (sync, HA, auto-failover, same region) vs Read Replicas (async, read scaling, cross-region)** — and when you'd use both
- [ ] RDS backups: automated vs manual snapshots; what RTO and RPO actually mean
- [ ] RDS Proxy: connection pooling, the Lambda use case, faster failover
- [ ] DynamoDB: partition-key design; on-demand vs provisioned (+ auto scaling); DynamoDB Streams
- [ ] **LSI** (same PK, alt sort, at creation, ≤10GB) vs **GSI** (different PK/sort, anytime, own capacity)
- [ ] DAX — microsecond caching for read-heavy DynamoDB
- [ ] Aurora: 6 copies / 3 AZs, up to 15 replicas; Serverless v1 vs v2; Aurora Global (cross-region <1s, DR)
- [ ] ElastiCache **Redis** (persistence, replication, Multi-AZ) vs **Memcached** (multi-threaded, no persistence)
- [ ] Caching strategies: lazy loading vs write-through; session-store pattern

### Labs
- [ ] 🧪 Deploy RDS Multi-AZ + Read Replica, simulate failover
- [ ] 🧪 Create Redis cluster with ElastiCache

### Quiz
- [ ] Database Services (8Q) — target ≥80%

---

## 9. Networking & Content Delivery — 🔴 heavily tested · 8h59m · 5 labs

> Biggest section and very high yield. Do this thoroughly even if it means skimming §7/§10/§13.

### Watch
- [ ] VPC Overview: Subnets & CIDR · Security Groups & NACLs
- [ ] VPC Demo · Route Tables Demo · NAT Gateway Demo
- [ ] VPC Peering & VPC Endpoints · NAT Gateway vs NAT Instance
- [ ] PrivateLink · Transit Gateway · VPN · Direct Connect · API Gateway
- [ ] CloudFront: Overview · TTL/Pricing · Distribution Creation · Caching & Geo Restrictions
- [ ] CloudFront OAC · S3 Presigned URL vs CloudFront Signed URL
- [ ] Route 53: Register Domain · Create A Record
- [ ] Route 53 policies: Simple · Weighted · Latency · Failover · Multivalue (all demos)
- [ ] 3rd-Party Domain Integration · AWS Global Accelerator

### Must be able to answer
- [ ] VPC CIDR sizing; public vs private subnet (= route to IGW or not); 5 reserved IPs per subnet
- [ ] **Security Groups (stateful, allow-only, instance) vs NACLs (stateless, allow+deny, subnet, ordered)**
- [ ] IGW vs **NAT Gateway** (managed, AZ-resilient, outbound for private) vs NAT Instance
- [ ] **VPC Peering** (non-transitive, no overlapping CIDR) vs **Transit Gateway** (hub, transitive)
- [ ] VPC Endpoints: **Gateway** (S3/DynamoDB, free, route table) vs **Interface/PrivateLink** (ENI, hourly)
- [ ] VPN (internet, encrypted, fast setup) vs Direct Connect (dedicated, consistent, slow provision); DX+VPN for encryption
- [ ] Route 53 policies — pick one per scenario; **alias vs CNAME** (alias for zone apex, free, AWS targets)
- [ ] CloudFront caching/TTL; **OAC** locks the S3 origin; geo restriction; signed URL/cookie
- [ ] **CloudFront signed URL vs S3 presigned URL** — when each
- [ ] **Global Accelerator** (anycast IPs, TCP/UDP, network layer) vs CloudFront (HTTP caching)
- [ ] API Gateway: REST vs HTTP vs WebSocket; throttling, caching, authorizers

### Labs
- [ ] 🧪 Build VPC with public & private subnets from scratch
- [ ] 🧪 VPC Flow Logs + generate traffic
- [ ] 🧪 Create NAT Gateways
- [ ] 🧪 CloudFront intro
- [ ] 🧪 Peer VPC with Transit Gateway

### Quiz
- [ ] Networking & Content Delivery (10Q) — target ≥80%

---

## 11. Application Integration — 🟠 SQS/SNS tested · 1h43m

### Watch
- [ ] Step Functions · Amazon MQ
- [ ] Amazon SQS (+ Demo) · Amazon SNS (+ Demo)
- [ ] AWS AppSync · EventBridge (+ Demo) · AWS Amplify

### Must be able to answer
- [ ] SQS **Standard** (at-least-once, best-effort order) vs **FIFO** (exactly-once, ordered)
- [ ] Visibility timeout, dead-letter queue, long polling — what each solves
- [ ] **SQS vs SNS vs EventBridge** — when to reach for each
- [ ] **Fan-out pattern**: SNS → multiple SQS queues
- [ ] EventBridge: event bus, rules, cron schedules, SaaS/schema integration
- [ ] Step Functions: orchestration; Standard vs Express
- [ ] Amazon MQ — when (lift-and-shift apps using MQTT/AMQP) over SQS/SNS

### Quiz
- [ ] Application Integration (6Q) — target ≥80%

---

## 14. Cost Management — 🟠 Domain 4 (20%) · 19m

### Watch
- [ ] AWS Cost Explorer (+ Demo)
- [ ] Reading material (1)

### Must be able to answer
- [ ] Cost Explorer (visualize/forecast) vs AWS Budgets (alert on cost/usage threshold)
- [ ] Cost allocation tags
- [ ] **On-Demand vs Reserved Instances vs Savings Plans vs Spot** — pick per workload
- [ ] Consolidated billing (Organizations): volume discounts, shared RIs
- [ ] Storage cost levers: S3 lifecycle, Intelligent-Tiering (cross-ref Storage)

### Quiz
- [ ] AWS Cost Management (3Q) — target ≥80%

---

## 8. Management & Governance — 🟡 · 6h28m · 4 labs

> Long section. Prioritize the conceptual lectures; the demos are skimmable at 1.5×.

### Watch
- [ ] AWS Organizations (+ Demo)
- [ ] CloudWatch Overview (+ Hands On) · Logs Agent / Unified Agent
- [ ] AWS Config (+ SNS hands-on, Compliance monitoring)
- [ ] AWS CloudTrail (+ Hands On)
- [ ] CloudFormation: Overview · Creating Stack · Update & Cleanup
- [ ] Compute Optimizer · Trusted Advisor · Health Dashboard · Systems Manager

### Must be able to answer
- [ ] Organizations: OUs, **SCPs (set boundaries — don't grant)**, consolidated billing
- [ ] CloudWatch: standard (5min) vs detailed (1min) metrics; **EC2 memory/disk need the CloudWatch agent**; alarms, Logs Insights
- [ ] **CloudTrail (API audit) vs CloudWatch (performance) vs Config (config state + compliance)** — the classic triad
- [ ] Config rules + remediation; conformance packs
- [ ] CloudFormation: change sets, drift detection, nested stacks, **StackSets (multi-account/region)**
- [ ] Trusted Advisor 5 categories (cost, security, fault tolerance, performance, service limits)
- [ ] Systems Manager: **Session Manager (no SSH/bastion)**, Parameter Store, Patch Manager, Run Command

### Labs
- [ ] 🧪 CloudWatch monitoring, alarms & dashboards
- [ ] 🧪 Check S3 compliance with AWS Config
- [ ] 🧪 Audit resource compliance with AWS Config
- [ ] 🧪 Amazon CloudFormation intro

### Quiz
- [ ] Management & Governance (5Q) — target ≥80%

---

## 12. Containers — 🟡 · 3h0m · 2 labs

### Watch
- [ ] AWS ECS · Creating Cluster · Task Definitions · Services & Tasks · Task Placements
- [ ] AWS EKS · AWS ECR

### Must be able to answer
- [ ] ECS **EC2 launch type (you manage instances) vs Fargate (serverless)**
- [ ] Task definition vs service vs task
- [ ] Task placement strategies: binpack, spread, random
- [ ] ECS task role (per-task IAM)
- [ ] EKS (managed Kubernetes) — when over ECS
- [ ] ECR — container registry; **Fargate as the serverless-container answer**

### Labs
- [ ] 🧪 Create EKS cluster + install kubectl
- [ ] 🧪 Build Docker image from Dockerfile → push to ECR

### Quiz
- [ ] Containers (5Q) — target ≥80%

---

## 10. Analytics — 🟢/🟡 · 4h25m · 2 labs

> Skim EMR/QuickSight/OpenSearch; focus the comparisons below.

### Watch
- [ ] Amazon Redshift · Amazon EMR (+ Launch / Submit / Validate)
- [ ] AWS Kinesis · Kinesis Data Streams · Data Firehose
- [ ] AWS Glue (+ Crawler / Job / Validate)
- [ ] Amazon QuickSight · Amazon Athena (+ Lab I/II) · Amazon OpenSearch

### Must be able to answer
- [ ] **Kinesis Data Streams** (real-time, shards, custom consumers) vs **Firehose** (near-real-time, managed delivery, no code)
- [ ] Redshift — data warehouse / OLAP / columnar; Redshift Spectrum (query S3)
- [ ] Glue — serverless ETL + Data Catalog + Crawlers
- [ ] **Athena** — serverless SQL on S3; cost = data scanned (partition + columnar to cut it)
- [ ] The serverless analytics pattern: **S3 + Glue + Athena + QuickSight**
- [ ] EMR (managed Hadoop/Spark) and OpenSearch (search/log analytics) — what each is for

### Labs
- [ ] 🧪 Transfer data to S3 with Kinesis Firehose
- [ ] 🧪 Perform ETL in Glue with S3

### Quiz
- [ ] Analytics (5Q) — target ≥80%

---

## 7. Machine Learning — 🟢 know-what-it-does · 51m

> Exam tests these shallowly: match the service to the use case.

### Watch
- [ ] Amazon Polly (+ Demo) · Amazon Translate · Amazon Comprehend
- [ ] Amazon Rekognition · Amazon Lex

### Must be able to answer
- [ ] Polly = text→speech · Translate = language translation
- [ ] Comprehend = NLP / sentiment / entities (Comprehend Medical)
- [ ] Rekognition = image/video analysis, face detection, moderation
- [ ] Lex = chatbots (ASR + NLU), powers Alexa
- [ ] (Bonus) Transcribe = speech→text · Textract = doc text extraction · SageMaker = build/train/deploy

### Quiz
- [ ] Machine Learning (3Q) — target ≥80%

---

## 13. Migration & Transfer — 🟢 · 37m

### Watch
- [ ] AWS Snow Family · AWS Database Migration Service · AWS DataSync
- [ ] AWS Migration Hub · AWS Transfer Family

### Must be able to answer
- [ ] Snow Family: Snowcone / Snowball Edge / Snowmobile — pick by data size; when vs network transfer
- [ ] **DMS**: homogeneous vs heterogeneous (+ Schema Conversion Tool); continuous replication
- [ ] **DataSync**: online on-prem (NFS/SMB) → S3/EFS/FSx, scheduled
- [ ] Transfer Family: SFTP/FTPS/FTP into S3/EFS
- [ ] Migration Hub — tracks migrations across tools

### Quiz
- [ ] Migration & Transfer (5Q) — target ≥80%

---

## Final exam-readiness (last 3–4 days — separate from this course)

> This course has **no practice exams**. Use your own ~493-question bank here.

- [ ] Practice Exam #1 (timed, 65Q / 130min) → review every wrong + flagged answer
- [ ] Practice Exam #2 → re-watch weakest-domain lectures
- [ ] Practice Exam #3 → drill recurring miss patterns (RDS vs Aurora · gateway vs interface endpoint · SG vs NACL · S3 storage classes)
- [ ] Practice Exam #4 → **scoring ≥80% on fresh questions = ready**
- [ ] Final review: skim glossary + flagged terms only. Nothing new the night before.
- [ ] 🎯 Exam day — light AM glance at cheat sheet, sleep well, arrive early.
