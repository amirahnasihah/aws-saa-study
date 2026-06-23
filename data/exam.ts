// Exam-day & registration content — sourced from AWS Certification policies
// (aws.amazon.com/certification/policies/during-testing). Shared by the
// about page and the exam-guide page. Literal Tailwind class strings only
// (no dynamic `text-${x}`) so JIT keeps them in the build.

export type DeliveryMode = 'center' | 'online'

export const registerSteps = [
  {
    n: '01',
    title: 'Sign in to AWS Certification',
    body: "Use aws.training/certification. Your AWS Certification Account name must be in Roman characters and match the ID you'll bring to the exam.",
  },
  {
    n: '02',
    title: 'Pick SAA-C03',
    body: 'Solutions Architect Associate — confirm the current exam guide (65 questions, 130 min, 720/1000 to pass).',
  },
  {
    n: '03',
    title: 'Choose delivery',
    body: 'Pearson VUE test center (in person) or Online Proctored / OnVUE (remote, live proctor via webcam).',
  },
  {
    n: '04',
    title: 'Pay & schedule',
    body: '$150 USD. Holders of an active AWS certification get 50% off. Pick a date, time, and language.',
  },
  {
    n: '05',
    title: 'Pick a language',
    body: 'English, Japanese, Korean, Simplified Chinese, Spanish, Portuguese-BR, French, Italian, and more depending on availability.',
  },
] as const

export const delivery: {
  mode: DeliveryMode
  label: string
  sub: string
  points: string[]
}[] = [
  {
    mode: 'center',
    label: 'Test Center',
    sub: 'Pearson VUE · in person',
    points: [
      'Arrive 15–30 min before your appointment',
      '2 primary IDs, or 1 primary + 1 secondary ID',
      'A photo may be taken at check-in',
      'Unscheduled breaks allowed — timer keeps running',
      'You cannot leave the building during the exam',
      'Scratch work: use the provided erasable note board — no personal paper or pens',
    ],
  },
  {
    mode: 'online',
    label: 'Online Proctored',
    sub: 'OnVUE · remote live proctor',
    points: [
      'Launch up to 30 min early; >15 min late = forfeit',
      '1 primary ID (name must match account exactly)',
      'Pass the system test + workspace check first',
      'Stay on camera the entire time, no standing',
      "No breaks — don't leave the camera frame",
      'No physical paper or pens — use the on-screen whiteboard/notes only',
    ],
  },
]

export const deliveryAccent: Record<DeliveryMode, { dot: string; pill: string; text: string }> = {
  center: { dot: 'bg-c3', pill: 'bg-c3/10 text-c3 border-c3/20', text: 'text-c3' },
  online: { dot: 'bg-c4', pill: 'bg-c4/10 text-c4 border-c4/20', text: 'text-c4' },
}

export const duringTesting = [
  'Agree to the Candidate Code of Conduct (5 min). Refusal ends the exam with no refund.',
  'No penalty for wrong answers — blanks are scored as wrong, so answer every question.',
  'Navigate freely and flag items for review before submitting.',
  'No scheduled breaks on any AWS exam, test center or online.',
  'The Roman-character name on your ID must match your AWS Certification Account exactly.',
  'Need a name change? Process it at least 2 business days before your exam.',
] as const

// Study-readiness checklist — mirrors STUDY-CHECKLIST.md. Each section's
// `mustAnswer` items are the real exam test: if you can't say one out loud
// without notes, rewatch that lecture before moving on.
export type ChecklistStatus = 'done' | 'high' | 'medium' | 'light'

export const checklistStatus: Record<
  ChecklistStatus,
  { label: string; dot: string; text: string; pill: string }
> = {
  done: { label: 'Done', dot: 'bg-c2', text: 'text-c2', pill: 'bg-c2/10 text-c2 border-c2/20' },
  high: { label: 'Master fully', dot: 'bg-c3', text: 'text-c3', pill: 'bg-c3/10 text-c3 border-c3/20' },
  medium: { label: 'Important', dot: 'bg-c5', text: 'text-c5', pill: 'bg-c5/10 text-c5 border-c5/20' },
  light: { label: 'Know-what-it-does', dot: 'bg-c4', text: 'text-c4', pill: 'bg-c4/10 text-c4 border-c4/20' },
}

export type ChecklistSection = {
  n: number
  title: string
  status: ChecklistStatus
  meta: string
  mustAnswer: string[]
}

export const studyChecklist: ChecklistSection[] = [
  {
    n: 1, title: 'Introduction', status: 'done', meta: '2 lectures',
    mustAnswer: ['Cloud computing fundamentals and why move to the cloud'],
  },
  {
    n: 2, title: 'Getting Started With AWS', status: 'done', meta: '5 lectures',
    mustAnswer: ['Account setup, the AWS Console, and the SAA-C03 exam shape'],
  },
  {
    n: 3, title: 'Compute', status: 'done', meta: '28 lectures · 4 labs',
    mustAnswer: ['EC2 (types, purchasing, storage), ELB/ASG, Lambda, Elastic Beanstalk, Outposts'],
  },
  {
    n: 4, title: 'Storage', status: 'done', meta: '34 lectures · 1 lab',
    mustAnswer: ['S3 (classes, lifecycle, replication, encryption), EBS, EFS, Glacier, Storage Gateway, Backup'],
  },
  {
    n: 5, title: 'Security, Identity & Compliance', status: 'high', meta: 'Domain 1 (30%) · 23 lectures · 2 labs',
    mustAnswer: [
      'IAM policy evaluation: default deny, explicit deny always wins over allow',
      'IAM role vs IAM user vs resource-based policy — and cross-account access via roles',
      'IAM Identity Center (SSO) + permission sets — when over plain IAM users?',
      'KMS: customer-managed vs AWS-managed vs AWS-owned keys; envelope encryption; rotation; multi-region keys',
      'KMS vs CloudHSM',
      'Directory Service: Managed Microsoft AD vs AD Connector vs Simple AD',
      'Cognito user pool (authN) vs identity pool (authZ / temp AWS creds)',
      'Secrets Manager (auto-rotation, RDS integration) vs SSM Parameter Store (free, no rotation)',
      'WAF (L7, on ALB/CloudFront/API GW) vs Shield Standard (free L3/4) vs Shield Advanced (paid DDoS)',
      'GuardDuty (threat detection from logs) vs Inspector (EC2/ECR/Lambda vuln scan) vs Macie (S3 PII)',
      'ACM: free public certs, auto-renew; must be in us-east-1 for CloudFront',
      'RAM — what can be shared cross-account (VPC subnets, Transit Gateway, etc.)?',
    ],
  },
  {
    n: 6, title: 'Database', status: 'medium', meta: 'Domains 2 & 3 · 17 lectures · 2 labs',
    mustAnswer: [
      'Multi-AZ (sync, HA, auto-failover, same region) vs Read Replicas (async, read scaling, cross-region) — and using both',
      'RDS backups: automated vs manual snapshots; what RTO and RPO actually mean',
      'RDS Proxy: connection pooling, the Lambda use case, faster failover',
      'DynamoDB: partition-key design; on-demand vs provisioned (+ auto scaling); DynamoDB Streams',
      'LSI (same PK, alt sort, at creation, ≤10GB) vs GSI (different PK/sort, anytime, own capacity)',
      'DAX — microsecond caching for read-heavy DynamoDB',
      'Aurora: 6 copies / 3 AZs, up to 15 replicas; Serverless v1 vs v2; Aurora Global (cross-region <1s, DR)',
      'ElastiCache Redis (persistence, replication, Multi-AZ) vs Memcached (multi-threaded, no persistence)',
      'Caching strategies: lazy loading vs write-through; session-store pattern',
    ],
  },
  {
    n: 7, title: 'Machine Learning', status: 'light', meta: '6 lectures',
    mustAnswer: [
      'Polly = text→speech · Translate = language translation',
      'Comprehend = NLP / sentiment / entities (Comprehend Medical)',
      'Rekognition = image/video analysis, face detection, moderation',
      'Lex = chatbots (ASR + NLU), powers Alexa',
      'Transcribe = speech→text · Textract = doc text extraction · SageMaker = build/train/deploy',
    ],
  },
  {
    n: 8, title: 'Management & Governance', status: 'medium', meta: '17 lectures · 4 labs',
    mustAnswer: [
      'Organizations: OUs, SCPs (set boundaries — don’t grant), consolidated billing',
      'CloudWatch: standard (5min) vs detailed (1min) metrics; EC2 memory/disk need the CloudWatch agent; alarms, Logs Insights',
      'CloudTrail (API audit) vs CloudWatch (performance) vs Config (config state + compliance) — the classic triad',
      'Config rules + remediation; conformance packs',
      'CloudFormation: change sets, drift detection, nested stacks, StackSets (multi-account/region)',
      'Trusted Advisor 5 categories (cost, security, fault tolerance, performance, service limits)',
      'Systems Manager: Session Manager (no SSH/bastion), Parameter Store, Patch Manager, Run Command',
    ],
  },
  {
    n: 9, title: 'Networking & Content Delivery', status: 'high', meta: 'Heavily tested · 27 lectures · 5 labs',
    mustAnswer: [
      'VPC CIDR sizing; public vs private subnet (= route to IGW or not); 5 reserved IPs per subnet',
      'Security Groups (stateful, allow-only, instance) vs NACLs (stateless, allow+deny, subnet, ordered)',
      'IGW vs NAT Gateway (managed, AZ-resilient, outbound for private) vs NAT Instance',
      'VPC Peering (non-transitive, no overlapping CIDR) vs Transit Gateway (hub, transitive)',
      'VPC Endpoints: Gateway (S3/DynamoDB, free, route table) vs Interface/PrivateLink (ENI, hourly)',
      'VPN (internet, encrypted, fast setup) vs Direct Connect (dedicated, consistent, slow provision); DX+VPN for encryption',
      'Route 53 policies — pick one per scenario; alias vs CNAME (alias for zone apex, free, AWS targets)',
      'CloudFront caching/TTL; OAC locks the S3 origin; geo restriction; signed URL/cookie',
      'CloudFront signed URL vs S3 presigned URL — when each',
      'Global Accelerator (anycast IPs, TCP/UDP, network layer) vs CloudFront (HTTP caching)',
      'API Gateway: REST vs HTTP vs WebSocket; throttling, caching, authorizers',
    ],
  },
  {
    n: 10, title: 'Analytics', status: 'light', meta: '16 lectures · 2 labs',
    mustAnswer: [
      'Kinesis Data Streams (real-time, shards, custom consumers) vs Firehose (near-real-time, managed delivery, no code)',
      'Redshift — data warehouse / OLAP / columnar; Redshift Spectrum (query S3)',
      'Glue — serverless ETL + Data Catalog + Crawlers',
      'Athena — serverless SQL on S3; cost = data scanned (partition + columnar to cut it)',
      'The serverless analytics pattern: S3 + Glue + Athena + QuickSight',
      'EMR (managed Hadoop/Spark) and OpenSearch (search/log analytics) — what each is for',
    ],
  },
  {
    n: 11, title: 'Application Integration', status: 'medium', meta: 'SQS/SNS tested · 10 lectures',
    mustAnswer: [
      'SQS Standard (at-least-once, best-effort order) vs FIFO (exactly-once, ordered)',
      'Visibility timeout, dead-letter queue, long polling — what each solves',
      'SQS vs SNS vs EventBridge — when to reach for each',
      'Fan-out pattern: SNS → multiple SQS queues',
      'EventBridge: event bus, rules, cron schedules, SaaS/schema integration',
      'Step Functions: orchestration; Standard vs Express',
      'Amazon MQ — when (lift-and-shift apps using MQTT/AMQP) over SQS/SNS',
    ],
  },
  {
    n: 12, title: 'Containers', status: 'medium', meta: '7 lectures · 2 labs',
    mustAnswer: [
      'ECS EC2 launch type (you manage instances) vs Fargate (serverless)',
      'Task definition vs service vs task',
      'Task placement strategies: binpack, spread, random',
      'ECS task role (per-task IAM)',
      'EKS (managed Kubernetes) — when over ECS',
      'ECR — container registry; Fargate as the serverless-container answer',
    ],
  },
  {
    n: 13, title: 'Migration & Transfer', status: 'light', meta: '5 lectures',
    mustAnswer: [
      'Snow Family: Snowcone (8-14TB) / Snowball Edge Storage (210TB) / Compute (28TB, 104 vCPUs) — pick by data size + compute need; >1 week via internet → Snow',
      'DMS: homogeneous vs heterogeneous (+ Schema Conversion Tool); CDC for continuous replication; Multi-AZ replication instance',
      'DataSync: online on-prem (NFS/SMB/HDFS) → S3/EFS/FSx; EFS cross-region replication via private network; scheduled + auto-verify',
      'Transfer Family: managed SFTP/FTPS/FTP/AS2 endpoints → S3/EFS; legacy protocol support, no code change',
      'Migration Hub: tracks migrations across tools (DMS, MGN, DataSync) — does NOT migrate; home region; Strategy Recommendations; Orchestrator',
      'MGN vs DMS vs DataSync: MGN = server lift-and-shift; DMS = database; DataSync = file/object transfer',
    ],
  },
  {
    n: 14, title: 'AWS Cost Management', status: 'medium', meta: 'Domain 4 (20%) · 2 lectures · 1 reading',
    mustAnswer: [
      'Cost Explorer (visualize/forecast up to 12 months, anomaly detection, RI/SP recommendations) vs AWS Budgets (ALERT on threshold, Budget Actions)',
      'Cost allocation tags (user-defined + AWS-generated, activate in billing console)',
      'On-Demand vs Reserved Instances vs Savings Plans vs Spot — pick per workload',
      'Consolidated billing (Organizations): volume discounts, shared RIs across accounts',
      'Storage cost levers: S3 lifecycle, Intelligent-Tiering (cross-ref Storage)',
      'Cost and Usage Report (CUR): most detailed line-item billing data → S3 → Athena/QuickSight for deep analysis',
      'Compute Optimizer (ML-based rightsizing) vs Trusted Advisor (broad checks: cost, security, perf, limits)',
    ],
  },
]
