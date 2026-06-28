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
    keywords: ['cross-account send to SQS/S3', 'cross-account KMS decrypt', 'other accounts access', 'set IAM + bucket/queue/key policy'],
    service: 'IAM (source) + Resource-based policy (dest)',
    why: 'Cross-account = DUA kunci: IAM policy belah source (bagi user/app keluar) AND resource-based policy belah destination (bucket/queue/key policy sebut Principal). Set satu belah je → Access Denied. Member account → IAM + SCP.',
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
  {
    id: 'data-lake-s3',
    keywords: ['store all/any data types, any scale', 'structured + unstructured + raw', 'central repository semua data'],
    service: 'S3 (Data Lake)',
    why: 'Data Lake = humban SEMUA jenis data mentah (struct/unstruct/semi) di satu tempat murah & scale tanpa had → Amazon S3.',
    accent: 'c2',
    domain: 'D3 · High-Perf',
    slug: 'd3-storage-s3',
  },
  {
    id: 'lake-formation',
    keywords: ['fine-grained access data lake', 'row/column/cell-level security', 'simplify/accelerate secure data lake'],
    service: 'AWS Lake Formation',
    why: 'Kawalan akses halus (row/column/cell) ATAS data lake + bina secure lake laju. Glue Catalog metadata je, IAM S3 object-level je.',
    accent: 'c3',
    domain: 'D3 · High-Perf',
    slug: 'd3-analytics-lake-formation',
  },
  {
    id: 'organizations-billing',
    keywords: ['consolidated billing', 'centralized management many accounts', 'one bill for all accounts', 'volume discount across accounts'],
    service: 'AWS Organizations',
    why: 'Satu payer (Management acct) untuk semua → consolidated billing + volume discount + central guardrail. Kelola banyak account dari satu tempat.',
    accent: 'c3',
    domain: 'D1 · Secure',
    slug: 'd1-iam-aws-organizations',
  },
  {
    id: 'scp-restrict',
    keywords: ['restrict org-wide', 'block region/service for all accounts', 'prevent even root/admin', 'guardrail across accounts'],
    service: 'SCP @ Management Account',
    why: 'SCP = siling maksimum (SEKAT, bukan BAGI) atas OU/account. Apply kat Management acct utk had semua member — even root member tak boleh lepas. TAK apply ke management acct sendiri.',
    accent: 'c3',
    domain: 'D1 · Secure',
    slug: 'd1-iam-aws-organizations',
  },
  {
    id: 'control-tower',
    keywords: ['automated landing zone', 'set up multi-account baseline / governance at scale', 'provision many accounts self-service', 'pre-built guardrails + drift detection'],
    service: 'AWS Control Tower',
    why: 'Automated landing zone + Account Factory + pre-built guardrails + drift detection DI ATAS Organizations. Organizations = building block manual; Control Tower = setup laju & konsisten.',
    accent: 'c3',
    domain: 'D1 · Secure',
    slug: 'd1-iam-aws-organizations',
  },
  {
    id: 'aws-config',
    keywords: ['ensure resources stay compliant', 'config drift / configuration history', 'enforce encryption/tagging + auto-fix violations', 'what changed on this resource & when'],
    service: 'AWS Config',
    why: 'Rekod config STATE resource over time + Config Rules semak compliant/non-compliant + auto-remediation (SSM). "WHO call API" tu CloudTrail; Config = "WHAT state + comply ke tak".',
    accent: 'c3',
    domain: 'D1 · Secure',
    slug: 'd3-infra-aws-config',
  },
  {
    id: 'redshift-warehouse',
    keywords: ['complex SQL + BI on structured data', 'data warehouse', 'analyze structured data, recurring reports'],
    service: 'Amazon Redshift',
    why: 'Data Warehouse OLAP — structured data dah kemas, complex SQL + BI berulang atas berbilion baris. BUKAN Data Lake (mentah) / Athena (ad-hoc jarang).',
    accent: 'c5',
    domain: 'D3 · High-Perf',
    slug: 'd3-analytics-redshift',
  },
  {
    id: 'ebs-io2',
    keywords: ['highest IOPS', 'mission-critical database', 'sub-millisecond latency', 'I/O-intensive', 'provisioned IOPS', 'SAP HANA / Oracle / SQL Server on EBS'],
    service: 'EBS io2 Block Express (Provisioned IOPS SSD)',
    why: 'Bila soalan tekan IOPS paling tinggi + latency rendah konsisten untuk DB kritikal → io2/io1. io2 Block Express = sampai 256,000 IOPS, 99.999% durability. BUKAN gp3 (gp3 cuma sampai 16,000 IOPS).',
    accent: 'c4',
    domain: 'D3 · High-Perf',
    slug: 'd3-storage-ebs-volume-types',
  },
  {
    id: 'ebs-gp3',
    keywords: ['default SSD', 'cost-effective general purpose', 'boot volume', 'balanced price/performance', 'baseline 3000 IOPS'],
    service: 'EBS gp3 (General Purpose SSD)',
    why: 'Default & paling worth untuk majoriti workload — gp3 bagi 3,000 IOPS + 125 MB/s baseline TANPA bayar ikut saiz (gp2 IOPS terikat saiz). Boot disk, web/app server. Naik IOPS/throughput asing-asing.',
    accent: 'c1',
    domain: 'D3 · High-Perf',
    slug: 'd3-storage-ebs-volume-types',
  },
  {
    id: 'ebs-st1',
    keywords: ['sequential access', 'big data', 'log processing', 'data warehouse on EBS', 'high throughput cheap', 'streaming workload'],
    service: 'EBS st1 (Throughput Optimized HDD)',
    why: 'Akses SEQUENTIAL besar-besar + throughput tinggi murah (MB/s, bukan IOPS) → st1. Big data, log/ETL, streaming. Kalau jarang sentuh & nak paling murah → sc1 (Cold HDD). HDD = TAK boleh jadi boot volume.',
    accent: 'c6',
    domain: 'D3 · High-Perf',
    slug: 'd3-storage-ebs-volume-types',
  },
  {
    id: 'aurora-serverless',
    keywords: ['intermittent / spiky workload', 'unpredictable traffic', 'dev / test database', 'don\'t pay when idle', 'auto-scale capacity', 'new app unknown load'],
    service: 'Aurora Serverless v2',
    why: 'Beban naik-turun / tak boleh teka / dev-test / nak jimat masa idle → Aurora Serverless auto-scale capacity (ACU) ikut load, bayar ikut guna. BUKAN Aurora provisioned (kena set instance size tetap = bazir bila idle).',
    accent: 'c2',
    domain: 'D2 · Resilient',
    slug: 'd2-ha-aurora-serverless',
  },
  {
    id: 'elasticache-redis-vs-memcached',
    keywords: ['session store', 'cache + persistence', 'pub/sub', 'leaderboard / sorted set', 'replication & Multi-AZ failover', 'multi-threaded simple cache', 'Redis vs Memcached'],
    service: 'ElastiCache — Redis (persist/HA) vs Memcached (simple)',
    why: 'Perlu persistence, replication, Multi-AZ failover, pub/sub, struktur kompleks (sorted set/leaderboard), backup → Redis. Cuma nak cache key-value ringkas, multi-threaded, scale-out mendatar, boleh buang bila-bila → Memcached.',
    accent: 'c5',
    domain: 'D3 · High-Perf',
    slug: 'd4-database-elasticache',
  },
  {
    id: 'rds-engines',
    keywords: ['managed relational database', 'MySQL / PostgreSQL / MariaDB managed', 'Oracle / SQL Server on AWS', 'lift-and-shift commercial DB', 'bring your own license (BYOL)', 'which RDS engine'],
    service: 'Amazon RDS (6 engines)',
    why: 'RDS support 6 engine: MySQL, PostgreSQL, MariaDB (open-source) · Oracle, SQL Server (commercial, kena license/BYOL) · Aurora (AWS-native, paling laju & HA). Soalan sebut Oracle/SQL Server → RDS (Aurora TAK support dua tu).',
    accent: 'c3',
    domain: 'D2 · Resilient',
    slug: 'd2-ha-rds-multi-az',
  },
  {
    id: 'kinesis-video-streams',
    keywords: ['live video', 'CCTV / camera feed', 'drone / dashcam / video doorbell', 'facial recognition on video', 'two-way / interactive video (WebRTC)', 'ingest & playback media'],
    service: 'Kinesis Video Streams (KVS)',
    why: 'Perkataan VIDEO / camera / CCTV / media → KVS (BUKAN Kinesis Data Streams, itu untuk text/log/telemetry). Real-time face/object detection atas video → KVS + Rekognition Video. Dua-hala / interactive / talk-back (video doorbell, baby monitor, telehealth) → KVS with WebRTC.',
    accent: 'c4',
    domain: 'D3 · High-Perf',
    slug: 'd3-messaging-kinesis-video-streams',
  },
  {
    id: 'deregistration-delay',
    keywords: ['5xx / 502 error masa scale-in', 'dropped connection bila Spot ditutup', 'graceful shutdown behind ALB', 'finish in-flight requests before terminate', 'connection draining'],
    service: 'ALB Deregistration Delay (Connection Draining)',
    why: 'Bila target di-deregister (scale-in / Spot rampas / deploy), ALB stop trafik BARU tapi biar request sedia ada habis dulu (default 300s) → elak error 5xx. "Connection Draining" = nama lama pada CLB. Combo: ALB + ASG Mixed Instances (On-Demand + Spot) + deregistration delay. BUKAN tukar semua ke On-Demand.',
    accent: 'c1',
    domain: 'D2 · Resilient',
    slug: 'd3-network-alb',
  },
]

// ── Pokok keputusan (decision tree) ─────────────────────────────────────────
// One root question splits into families; each leaf maps an exam keyword cluster
// to the service that answers it. Shared shape so /trigger-words can carry more
// than one tree (Database, Storage, ...) with the same renderer.
export interface TreeLeaf {
  svc: string // the service to fire
  cond: string // the keyword cluster / discriminator that picks it
}

export interface TreeBranch {
  cat: string // family label
  accent: Accent
  leaves: TreeLeaf[]
}

export interface DecisionTree {
  root: string
  branches: TreeBranch[]
}

export const dbDecisionTree: DecisionTree = {
  root: 'Apa bentuk data + cara akses?',
  branches: [
    {
      cat: 'Relational / SQL (transaksi OLTP)',
      accent: 'c4',
      leaves: [
        { svc: 'Aurora', cond: 'perlu HA hebat · auto-scale storage · Global DB · MySQL/PostgreSQL je' },
        { svc: 'RDS', cond: 'standard, atau perlu Oracle / SQL Server / MariaDB' },
      ],
    },
    {
      cat: 'NoSQL — ikut shape data',
      accent: 'c5',
      leaves: [
        { svc: 'DynamoDB', cond: 'key-value · serverless · single-digit ms · spiky traffic' },
        { svc: 'DocumentDB', cond: 'document · "MongoDB-compatible"' },
        { svc: 'Neptune', cond: 'graph · hubungan · fraud ring · recommendation' },
        { svc: 'Keyspaces', cond: 'wide-column · "Cassandra / CQL"' },
        { svc: 'ElastiCache / DAX', cond: 'cache laju · DAX khusus depan DynamoDB' },
        { svc: 'MemoryDB', cond: 'in-memory tapi DURABLE (boleh jadi primary DB)' },
      ],
    },
    {
      cat: 'Analytics / time-series',
      accent: 'c3',
      leaves: [
        { svc: 'Redshift', cond: 'OLAP warehouse · BI · agregat berjuta baris · report berulang' },
        { svc: 'Timestream', cond: 'time-series · sensor IoT · metrik ikut masa' },
      ],
    },
  ],
}

// ── Pilih Storage — pokok keputusan ─────────────────────────────────────────
// Three families by access pattern: BLOCK (attach as disk), FILE (mount shared
// filesystem), OBJECT (HTTP API, flat). The exam's favourite trap lives in the
// takeaway: "shared across many" → EFS (file) BUKAN EBS, melainkan soalan tanya
// shared BLOCK device → io1/io2 Multi-Attach.
export const storageDecisionTree: DecisionTree = {
  root: 'Macam mana nak akses? (disk · mount share · HTTP API)',
  branches: [
    {
      cat: 'Block — attach jadi disk (1 EC2)',
      accent: 'c4',
      leaves: [
        { svc: 'EBS', cond: 'volume persistent satu EC2 (RWO) · boot/DB disk · Multi-Attach HANYA io1/io2 = shared BLOCK (max 16 EC2, same AZ); gp/st1/sc1 TAK boleh' },
        { svc: 'Instance Store', cond: 'disk fizikal ephemeral · hilang bila stop/terminate · paling laju · buffer/cache/scratch' },
      ],
    },
    {
      cat: 'File — mount share (ramai serentak)',
      accent: 'c1',
      leaves: [
        { svc: 'EFS', cond: 'NFS · Linux · ReadWriteMany (RWX) · ribuan EC2/pod merentas AZ · auto-grow · "shared file" · "multiple pods different nodes" → EFS' },
        { svc: 'FSx for Windows', cond: 'SMB · Windows file share · Active Directory · NTFS' },
        { svc: 'FSx for Lustre', cond: 'HPC / ML / analytics · throughput gila · boleh link ke S3' },
      ],
    },
    {
      cat: 'Object — HTTP API (flat, unlimited)',
      accent: 'c6',
      leaves: [
        { svc: 'S3', cond: 'object · 11 nines · unlimited · web asset / data lake / backup · akses via API' },
        { svc: 'S3 Glacier', cond: 'arkib murah · retrieval lambat (ms→jam ikut tier) · compliance/long-term' },
        { svc: 'Storage Gateway', cond: 'hybrid · on-prem sentuh AWS storage (File/Volume/Tape Gateway)' },
      ],
    },
  ],
}

// ── Peta Besar — corak teras (ringkasan) ────────────────────────────────────
// Condensed version of the visual blueprint: each module = a few "X vs/→/⊃ Y"
// rows, each with the exam discriminator. Uniform shape so it renders as a grid
// of mini-diagram cards without per-module bespoke layout.
export interface PetaRow {
  left: string // box A
  rel: string // relation: 'vs' (confused-pair) · '→' (flow) · '⊃' (contains) · '+' (both needed)
  right: string // box B
  note: string // the discriminator / exam takeaway
}

export interface PetaModule {
  num: string
  title: string
  accent: Accent
  rows: PetaRow[]
}

export const petaModules: PetaModule[] = [
  {
    num: '01',
    title: 'Security & multi-account',
    accent: 'c3',
    rows: [
      { left: 'Management acct', rel: '⊃', right: 'OU → member accts', note: 'Organizations = satu payer · consolidated billing + volume discount.' },
      { left: 'SCP', rel: 'vs', right: 'IAM policy', note: 'SCP = siling maksimum (SEKAT, bukan BAGI) — even root member tak lepas.' },
      { left: 'IAM (source)', rel: '+', right: 'Resource policy (dest)', note: 'Cross-account = DUA kunci; set satu belah je → Access Denied.' },
      { left: 'Resource policy', rel: 'vs', right: 'Role + AssumeRole', note: 'Org luar read S3/SQS → resource policy (kemas). Permission kompleks / temp creds / banyak service → Role + STS.' },
      { left: 'IAM Group', rel: 'vs', right: 'IAM Role', note: 'Group = bakul kumpul user (tak boleh login/assume). Role = identiti sementara di-assume (EC2/Lambda/cross-account).' },
      { left: 'Secrets Manager', rel: 'vs', right: 'SSM Parameter Store', note: 'Secrets Manager = auto-rotate built-in (Lambda), bayar/secret — DB password/API key. Parameter Store = config biasa, Standard FREE, no native rotation.' },
      { left: 'AWS-managed key', rel: 'vs', right: 'Customer-managed key (CMK)', note: 'AWS-managed = AWS urus penuh, takde kawalan rotation/policy. CMK = kau cipta & kawal: "control over keys / rotate own key / audit who used key / custom key policy" → CMK.' },
      { left: 'KMS', rel: 'vs', right: 'CloudHSM', note: 'KMS = multi-tenant managed (FIPS 140-2 L2), AWS urus. CloudHSM = single-tenant dedicated HW (FIPS L3), AWS tak boleh access — bank/regulasi ketat.' },
      { left: 'Encryption at rest', rel: 'vs', right: 'Encryption in transit', note: 'At rest = data DUDUK disimpan (S3/EBS/RDS/snapshot): "stored data / on disk / encrypt at rest" → KMS (SSE-KMS). In transit = data JALAN atas network: "in flight / over the network / man-in-the-middle / secure communication" → TLS/SSL (ACM cert) atau IPSec VPN.' },
    ],
  },
  {
    num: '02',
    title: 'Monitoring & audit',
    accent: 'c1',
    rows: [
      { left: 'CloudWatch', rel: 'vs', right: 'CloudTrail', note: 'CloudWatch = metrics/logs/alarms (APA jadi); CloudTrail = SIAPA call API (audit).' },
      { left: 'CloudTrail', rel: 'vs', right: 'AWS Config', note: 'CloudTrail = siapa buat action; Config = STATE resource + comply ke tak.' },
    ],
  },
  {
    num: '03',
    title: 'Networking',
    accent: 'c4',
    rows: [
      { left: 'VPC', rel: '⊃', right: 'Subnet (public/private)', note: 'VPC = rangkaian sendiri; subnet pecah ikut AZ.' },
      { left: 'Security Group', rel: 'vs', right: 'NACL', note: 'SG = stateful, instance-level, allow je; NACL = stateless, subnet-level, allow + deny.' },
      { left: 'CloudFront', rel: 'vs', right: 'Global Accelerator', note: 'CloudFront = CDN, cache content (statik/dynamic) di edge. GA = NO cache, 2 static anycast IP, route TCP/UDP via AWS backbone + failover cross-region <30s.' },
    ],
  },
  {
    num: '04',
    title: 'Load Balancer',
    accent: 'c2',
    rows: [
      { left: 'ALB (L7)', rel: 'vs', right: 'NLB (L4)', note: 'ALB = HTTP path/host routing; NLB = TCP/UDP, juta conn, static IP, latency rendah.' },
      { left: 'NLB', rel: 'vs', right: 'GWLB', note: 'GWLB = depan appliance pihak ketiga (firewall / IDS / IPS).' },
    ],
  },
  {
    num: '05',
    title: 'Database',
    accent: 'c5',
    rows: [
      { left: 'Multi-AZ', rel: 'vs', right: 'Read Replica', note: 'Multi-AZ = survive AZ outage (HA); Read Replica = offload READ (scaling).' },
      { left: '10,000 Lambda', rel: '→', right: 'RDS Proxy → RDS', note: 'Proxy pool connection; elak "too many connections". Pilih DB? Tengok pokok keputusan atas ↑' },
    ],
  },
  {
    num: '06',
    title: 'Compute & scaling',
    accent: 'c6',
    rows: [
      { left: 'Scale UP (vertical)', rel: 'vs', right: 'Scale OUT (horizontal)', note: 'UP = instance lagi besar (ada had); OUT = tambah instance (ASG) = elastik.' },
      { left: 'On-Demand / Reserved', rel: 'vs', right: 'Spot', note: 'Spot = sampai 90% murah, 2-min notice; Mixed = On-Demand baseline + Spot.' },
      { left: 'EBS (1 AZ)', rel: 'vs', right: 'EFS (multi-AZ)', note: 'EBS = block, 1 instance; EFS = file, share ramai; S3 = object; Instance Store = ephemeral.' },
      { left: 'Beanstalk', rel: 'vs', right: 'CloudFormation', note: 'Beanstalk = PaaS, deploy APP cepat (opinionated: auto EC2+ALB+ASG). CloudFormation = IaC general untuk SEMUA jenis resource.' },
    ],
  },
  {
    num: '07',
    title: 'Geografi — Region / AZ',
    accent: 'c1',
    rows: [
      { left: 'Region', rel: '⊃', right: 'AZ (≥3)', note: 'Region = geografi; AZ = data center berasingan dalam region.' },
      { left: 'AZ', rel: '⊃', right: 'Subnet', note: '1 subnet = 1 AZ; deploy Multi-AZ = tahan 1 AZ tumbang.' },
    ],
  },
  {
    num: '08',
    title: 'Aliran data',
    accent: 'c3',
    rows: [
      { left: 'Kinesis Streams', rel: 'vs', right: 'Firehose', note: 'Streams = real-time custom (shard); Firehose = auto-deliver ke S3/Redshift (serverless).' },
      { left: 'SQS', rel: 'vs', right: 'SNS', note: 'SQS = queue, pull, 1 consumer; SNS = pub/sub, push, fan-out ramai.' },
    ],
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
    bait: 'Set IAM policy SAHAJA untuk cross-account S3/SQS/KMS',
    fix: 'Cross-account = DUA kunci. IAM (source) bagi user keluar, TAPI resource-based policy (bucket/queue/key) di destination mesti sebut Principal source acct juga. Satu belah je → Access Denied.',
  },
  {
    bait: 'Set resource-based policy SAHAJA untuk cross-account akses',
    fix: 'Resource policy izin source masuk, tapi user/app di source masih perlu IAM policy bagi dia buat action keluar. Dua-dua pintu kena buka.',
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
