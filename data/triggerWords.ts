// Trigger-word cheat sheet — "nampak keyword → tembak service → buang perangkap".
// Built from the SAA-C03 questions worked through in study sessions. Grow this list
// over time: each row maps a cluster of exam keywords to the service that answers it,
// plus a one-line WHY and a deep link to the full Deep Notes card.
//
// `slug` = serviceSlug(sectionId, shortName) so it anchors directly into /learn.
// `accent` = a c1–c6 token for fast visual scanning (not tied to domain).
// `domain` = which SAA-C03 domain the keyword is tested under (D1–D4).

export type Accent = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6'

export interface TriggerRow {
  id: string
  keywords: string[] // the grey-box trigger phrases the exam uses
  service: string // the answer to fire
  why: string // one-line reason / discriminator
  accent: Accent
  domain: string // e.g. 'D2 · Resilient'
  slug: string // /learn anchor → serviceSlug(sectionId, shortName)
}

export interface TrapRow {
  bait: string // the answer that looks right
  fix: string // why it's wrong + the real pick
}

export const triggerRows: TriggerRow[] = [
  {
    id: 'rds-proxy',
    keywords: ['too many connections', 'connection pooling', 'Lambda spam RDS', 'idle connections'],
    service: 'RDS Proxy',
    why: 'Pool & reuse DB connections so a burst of Lambdas tak banjirkan RDS sampai "too many connections".',
    accent: 'c1',
    domain: 'D2 · Resilient',
    slug: 'd2-ha-rds-proxy',
  },
  {
    id: 'cfn-mappings',
    keywords: ['AMI ID beza ikut region', 'hardcode value per region', 'same template, many regions'],
    service: 'CloudFormation Mappings',
    why: 'Mappings = lookup table dalam template (region → AMI). Satu template jalan di semua region tanpa edit.',
    accent: 'c4',
    domain: 'D3 · High-Perf',
    slug: 'd3-infra-cloudformation',
  },
  {
    id: 's3-sqs',
    keywords: ['simpan file jangan hilang', 'async upload', 'burst traffic', 'durable file store'],
    service: 'S3 (+ SQS buffer)',
    why: 'S3 = simpan FILE sebenar (11 nines, murah). SQS depan = serap burst & decouple supaya upload tak hilang.',
    accent: 'c2',
    domain: 'D2 · Resilient',
    slug: 'd3-storage-s3',
  },
  {
    id: 'step-functions',
    keywords: ['orchestrate Lambda', 'visual workflow', 'track each step', 'state machine', 'avoid custom failure logic'],
    service: 'Step Functions',
    why: 'Orchestrate multi-step workflow secara visual + auto retry/catch per step — tak payah tulis state/failure logic sendiri.',
    accent: 'c5',
    domain: 'D3 · High-Perf',
    slug: 'd3-messaging-step-functions',
  },
  {
    id: 'acm-dns',
    keywords: ['cert validation pending', 'auto-renew SSL', 'ACM stuck', 'certificate renewal'],
    service: 'ACM — DNS validation',
    why: 'DNS validation = ACM auto-renew selamanya (selagi CNAME wujud). Email validation = manual, senang tersangkut.',
    accent: 'c3',
    domain: 'D1 · Secure',
    slug: 'd1-data-acm',
  },
  {
    id: 'route53-alias',
    keywords: ['root / apex domain ke ALB', 'zone apex', 'no CNAME at root', 'naked domain'],
    service: 'Route 53 — Alias record',
    why: 'Apex MESTI Alias (CNAME haram kat root). Alias point ke ALB tanpa IP tetap + query FREE.',
    accent: 'c1',
    domain: 'D3 · High-Perf',
    slug: 'd3-network-route-53',
  },
  {
    id: 'resource-policy',
    keywords: ['cross-account send to SQS/S3', 'other accounts access', 'centralized queue/bucket'],
    service: 'Resource-based policy',
    why: 'Cross-account grant kena datang dari sisi RESOURCE (queue/bucket policy) — IAM policy urus akaun sendiri je.',
    accent: 'c4',
    domain: 'D1 · Secure',
    slug: 'd3-messaging-sqs',
  },
  {
    id: 'asg-mixed',
    keywords: ['fault-tolerant + lowest cost', 'handle 500% spike cheaply', 'survive interruption'],
    service: 'ASG Mixed Instances Policy',
    why: 'On-Demand baseline (jamin minimum) + Spot (murah untuk lebihan). Bukan Spot 100% — semua boleh kena reclaim serentak.',
    accent: 'c6',
    domain: 'D2 · Resilient',
    slug: 'd2-ha-auto-scaling-groups',
  },
  {
    id: 'sqs-dlq',
    keywords: ['mesej gagal berulang blok queue', 'corrupted / poison message', 'isolate & debug messages'],
    service: 'SQS DLQ + maxReceiveCount',
    why: 'Lepas gagal N kali (maxReceiveCount), SQS auto-pindah ke DLQ → queue utama jalan, developer bedah asingan.',
    accent: 'c2',
    domain: 'D2 · Resilient',
    slug: 'd3-messaging-sqs',
  },
  {
    id: 'sqs-fifo',
    keywords: ['order must be preserved', 'no duplicate processing', 'exactly-once'],
    service: 'SQS FIFO queue',
    why: 'FIFO = strict order (per MessageGroupId) + exactly-once dedup. Standard = best-effort order + at-least-once.',
    accent: 'c5',
    domain: 'D2 · Resilient',
    slug: 'd3-messaging-sqs',
  },
]

export const trapRows: TrapRow[] = [
  {
    bait: 'DynamoDB simpan file',
    fix: 'DynamoDB simpan METADATA je (max 400 KB/item) — bukan file sebenar. Simpan FILE → S3, metadata → DynamoDB.',
  },
  {
    bait: 'RDS simpan file/binary besar',
    fix: 'RDS = relational data, bukan blob store. Mahal + tak durable untuk file. File besar → S3.',
  },
  {
    bait: 'CNAME pada root/apex domain',
    fix: 'DNS spec larang CNAME kat zone apex. Untuk root domain → Route 53 Alias; subdomain (www) → CNAME/Alias.',
  },
  {
    bait: 'A / AAAA record (IP tetap) untuk ALB',
    fix: 'ALB takde static IP (IP berubah). Jangan hardcode IP — guna Alias yang auto-track ALB.',
  },
  {
    bait: 'IAM policy untuk bagi akaun lain akses',
    fix: 'IAM policy urus apa principal AKU boleh buat — tak boleh grant akaun lain. Cross-account → resource-based policy.',
  },
  {
    bait: 'Spot 100% untuk fault-tolerant + murah',
    fix: 'Kalau semua Spot, AWS boleh reclaim serentak → app down. Guna Mixed: On-Demand baseline + Spot.',
  },
  {
    bait: 'Naikkan visibility timeout / retry dalam kod untuk poison pill',
    fix: 'Timeout cuma tangguh; poison pill tetap pusing & crash. Selesai → DLQ + maxReceiveCount.',
  },
  {
    bait: 'Read Replica untuk "too many connections"',
    fix: 'Read Replica = offload READ, bukan urus connection. Connection exhaustion → RDS Proxy (pooling).',
  },
  {
    bait: 'Email validation untuk ACM auto-renew',
    fix: 'Email validation = manual & senang tersangkut. Untuk auto-renew selamanya → DNS validation (CNAME).',
  },
]
