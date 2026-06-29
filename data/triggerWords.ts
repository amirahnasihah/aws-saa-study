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
    id: 'instance-scheduler',
    keywords: ['office hours only', 'stop EC2 nights & weekends', 'start stop schedule', 'dev/test idle after hours', 'cut cost non-prod'],
    service: 'Instance Scheduler on AWS',
    why: 'CloudFormation solution yang auto start/stop EC2 + RDS ikut tag schedule. Savings Plan/RI TAK boleh stop instance — itu komitmen harga je.',
    accent: 'c6',
    domain: 'D4 · Cost-Opt',
    slug: 'd3-compute-ec2',
  },
  {
    id: 'lambda-snapstart',
    keywords: ['Java cold start', 'reduce cold start cheapest', 'most cost-effective cold start', '.NET / Python startup latency'],
    service: 'Lambda SnapStart',
    why: 'Snapshot execution environment (Firecracker) → restore cepat, NO extra charge. "strict zero cold start / any runtime / predictable spike" → Provisioned Concurrency (bayar per jam).',
    accent: 'c3',
    domain: 'D4 · Cost-Opt',
    slug: 'd3-compute-lambda',
  },
  {
    id: 'lambda-throttle-sqs',
    keywords: ['Lambda throttling 429', 'downstream overwhelmed', 'spiky traffic decouple', 'smooth out burst to Lambda'],
    service: 'SQS + Lambda (decouple)',
    why: 'SQS depan Lambda serap burst + retry; Lambda poll ikut kadar sendiri. SNS push terus → tak buffer, masih throttle.',
    accent: 'c2',
    domain: 'D2 · Resilient',
    slug: 'd3-compute-lambda',
  },
  {
    id: 'eks-alb-ingress',
    keywords: ['EKS route by URL path', 'L7 HTTP routing for pods', 'Kubernetes Ingress least effort', 'expose EKS service to internet'],
    service: 'AWS Load Balancer Controller (ALB Ingress)',
    why: 'Ingress → ALB (L7 path/host routing) auto-provisioned. NLB = L4 je; NGINX Ingress = self-managed (lagi banyak kerja).',
    accent: 'c4',
    domain: 'D2 · Resilient',
    slug: 'd3-compute-eks',
  },
  {
    id: 'control-tower-drift',
    keywords: ['monitor OU hierarchy changes', 'alert account governance drift', 'SCP removed notification', 'account moved out of OU'],
    service: 'Control Tower account drift notifications',
    why: 'Control Tower auto-detect drift dari landing-zone baseline → publish ke SNS. BUKAN StackSets drift (itu drift template infra) dan BUKAN raw Config.',
    accent: 'c1',
    domain: 'D1 · Secure',
    slug: 'd1-iam-aws-organizations',
  },
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
  {
    id: 'elb-health-check',
    keywords: ['jangan hantar trafik ke EC2 crash', 'auto-detect unhealthy instance', 'stop routing to failed server', 'how does ELB avoid dead backend', 'remove unhealthy target from rotation'],
    service: 'ELB Health Check (dalam Target Group)',
    why: 'ELB ketuk setiap target ikut interval; pulang 200 OK = Healthy (hantar trafik), gagal threshold (cth 500/timeout) = Unhealthy → ELB STOP hantar trafik ke situ sampai sihat balik. Ini asas HA — auto-buang server rosak dari rotation. ASG patut guna ELB health check (bukan EC2 je) supaya app-level hang pun dikira unhealthy.',
    accent: 'c2',
    domain: 'D2 · Resilient',
    slug: 'd3-network-alb',
  },
  {
    id: 'gwlb-inspection',
    keywords: ['transparent inspection semua trafik', '3rd-party firewall / IDS / IPS inline', 'centralized inspection untuk banyak VPC', 'GENEVE port 6081', 'salur trafik ke virtual appliance', 'bump-in-the-wire'],
    service: 'Gateway Load Balancer (GWLB) + GWLBe',
    why: 'GWLB = Layer 3, dengar SEMUA IP packet, salur ke fleet virtual appliance (firewall/IDS/IPS) secara transparent guna GENEVE port 6081. Pasangan GWLBe (next hop dalam route table) sambung spoke VPC ↔ security VPC via PrivateLink. Flow stickiness (5/3/2-tuple) pastikan stateful firewall nampak dua hala. BUKAN NLB (L4 connection je) atau appliance per-VPC (tak scale). Keyword "transparent + 3rd-party firewall + GENEVE 6081 + centralized" → GWLB.',
    accent: 'c1',
    domain: 'D1 · Secure',
    slug: 'd3-network-gwlb',
  },
  {
    id: 'efs-one-zone-ia',
    keywords: ['rarely accessed shared files', 'low-cost EFS', 'single AZ + can be regenerated', 're-creatable / not critical data', 'cheapest EFS class', 'redundant backup file storage'],
    service: 'EFS One Zone-IA',
    why: '2 soalan je: (1) jarang akses → IA. (2) 1 AZ cukup sebab data boleh dijana semula → One Zone. Gabung "rarely accessed + single AZ + re-creatable + low-cost" = One Zone-IA (paling murah). "frequently accessed + multi-AZ HA" = Standard; "infrequent tapi masih multi-AZ" = Standard-IA.',
    accent: 'c4',
    domain: 'D4 · Cost-Opt',
    slug: 'd3-storage-efs',
  },
  {
    id: 'data-lake-zones-swamp',
    keywords: ['raw / landing zone', 'cleanse / processed zone', 'curated / analytics zone', 'data lake unmanageable / unsearchable', 'data swamp', 'organize data lake by zone'],
    service: 'Data Lake zones + Lake Formation governance',
    why: 'Data lake matang = 3 zon: Raw/Landing (mentah as-is) → Cleanse/Processed (Glue ETL, Parquet) → Curated/Analytics (sedia BI/ML). Humban tanpa Glue Catalog + Lake Formation = DATA SWAMP (ada data tapi tak boleh cari/percaya). "lake jadi tak terurus" → fix dengan catalog + governance.',
    accent: 'c3',
    domain: 'D3 · High-Perf',
    slug: 'd3-analytics-lake-formation',
  },
  {
    id: 'not-rds-purpose-built',
    keywords: ['shopping cart / session store', 'schemaless / key-value', 'graph / mutual friends / fraud ring', 'data warehouse / OLAP / BI', 'time-series / IoT metrics', 'cache in-memory', 'serverless DB scale-to-zero'],
    service: 'Purpose-built DB (BUKAN RDS)',
    why: 'RDS = 6 enjin RELATIONAL je (MySQL/PostgreSQL/MariaDB/Oracle/SQL Server/Aurora). Apa-apa NoSQL/cache/warehouse/graph/time-series = BUKAN RDS: cart/session/key-value → DynamoDB; graph/fraud → Neptune; OLAP/BI → Redshift; IoT/time-series → Timestream; cache → ElastiCache. "Aurora" ≠ serverless melainkan ada perkataan "Serverless".',
    accent: 'c1',
    domain: 'D3 · High-Perf',
    slug: 'd3-db-pilih-database',
  },
  {
    id: 'aqua-redshift',
    keywords: ['Redshift performance issues', 'network bandwidth + CPU processing limits', 'accelerate Redshift query, minimize overhead/cost', 'reduce data movement in cluster'],
    service: 'AQUA (Advanced Query Accelerator)',
    why: 'Push compute dekat storage → kurang data lalu NETWORK + kurang beban CPU compute node. Auto-managed (RA3, no extra charge) = minimum operational overhead. BUKAN Spectrum (Spectrum extend ke S3, boleh TAMBAH trafik), BUKAN ElastiCache (itu cache OLTP, bukan analytics columnar).',
    accent: 'c3',
    domain: 'D3 · High-Perf',
    slug: 'd3-analytics-redshift',
  },
  {
    id: 'route53-failover-eth',
    keywords: ['AWS primary + on-prem secondary failover', 'DR active-passive via Route 53', 'failover alias record', 'Evaluate Target Health for ALB', 'health check for on-prem endpoint'],
    service: 'Route 53 — DUA failover records (ETH + custom health check)',
    why: 'Active-passive failover perlu DUA record berasingan. AWS resource (ALB) → Evaluate Target Health = Yes (auto-check). On-prem BUKAN AWS resource → kena custom Route 53 health check. Tak boleh combine dua endpoint dalam satu record.',
    accent: 'c1',
    domain: 'D2 · Resilient',
    slug: 'd3-network-route-53',
  },
  {
    id: 'inter-region-vpc-peering',
    keywords: ['VPC in different regions, private', 'access EFS across regions without internet', 'eu-west-2 to us-east-1 private link', 'minimize latency cross-region', 'Direct Connect + cross-region access'],
    service: 'Inter-Region VPC Peering (+ Direct Connect)',
    why: 'VPC beza REGION → inter-region VPC peering (private, elak internet, low-latency). PrivateLink TAK support EFS (ia untuk service-based, bukan file system). On-prem via Direct Connect ke satu VPC → route through peering ke VPS lain. BUKAN Managed VPN (mahal+latency), BUKAN same-region peering.',
    accent: 'c2',
    domain: 'D3 · High-Perf',
    slug: 'd1-vpc-vpc-peering',
  },
  {
    id: 'glacier-legal-hold',
    keywords: ['retain indefinitely, no expiration', 'no user can delete forever', 'immutable compliance policy Glacier', 'block delete without time limit', 'compliance hold on archive'],
    service: 'S3 Glacier — Legal Hold + Vault Lock policy',
    why: '"indefinitely" (tiada tempoh tamat) → Legal Hold (apply serta-merta, halang delete selamanya). "fixed duration" → retention period (BUKAN indefinite). Compliance ketat → Vault LOCK policy (immutable lepas lock), BUKAN Vault ACCESS policy (mutable, boleh ubah).',
    accent: 'c4',
    domain: 'D1 · Secure',
    slug: 'd1-data-s3-glacier-vault',
  },
  {
    id: 'ec2-hibernation',
    keywords: ['same application state on recovery', 'avoid long initialization', 'memory-intensive app fast recovery', 'preserve RAM across stop', 'in-memory state persistence', 'resume exactly where it stopped'],
    service: 'EC2 Hibernation',
    why: 'Hibernation simpan RAM (in-memory state: OS, processes, cache) ke EBS root volume. Resume sambung tepat di mana berhenti — cepat, tak reinitialize. Stop/Start = RAM HILANG (macam reboot). AMI = disk je, bukan RAM.',
    accent: 'c3',
    domain: 'D2 · Resilient',
    slug: 'd3-compute-ec2-hibernation',
  },
  {
    id: 'cloudwatch-alb-metrics',
    keywords: ['track ALB request count / latency / HTTP codes', 'alarm when threshold crossed on load balancer', 'monitor ALB without installing agent', 'ALB metrics to CloudWatch'],
    service: 'CloudWatch — ALB metrics (auto, no agent)',
    why: 'ALB AUTOMATIK hantar metrics (request count, latency, HTTP response codes) ke CloudWatch. Buat alarm terus dari CW — tak perlu install apa-apa. CloudWatch Agent kumpul OS-level metrics DALAM EC2 (CPU/memory), BUKAN metrics ALB. X-Ray = trace dalam app, ALB tak native integrate.',
    accent: 'c5',
    domain: 'D3 · High-Perf',
    slug: 'd3-infra-cloudwatch',
  },
  {
    id: 'elasticache-realtime-kv',
    keywords: ['real-time recommendation engine', 'low-latency read/write at scale', 'high-velocity user interactions', 'sub-millisecond key-value', 'in-memory personalized suggestions'],
    service: 'ElastiCache for Redis (in-memory key-value)',
    why: '"real-time" + "low-latency" + "high-velocity" + key-value at scale → ElastiCache Redis (sub-millisecond, in-memory). Redshift = analytics/BATCH (OLAP, lawan real-time). Aurora = relational, tak sepantas Redis. Neptune = graph DB, latency lebih tinggi, untuk hubungan kompleks bukan real-time KV.',
    accent: 'c5',
    domain: 'D3 · High-Perf',
    slug: 'd4-database-elasticache',
  },
  {
    id: 'rekognition-custom-labels-species',
    keywords: ['identify specific animal species in images', 'camera trap species monitoring', 'automate image recognition without building from scratch', 'custom object recognition managed training', 'recognize custom/specific objects not generic labels'],
    service: 'Rekognition Custom Labels (managed training)',
    why: 'Kenal SPESIES/objek KHSUSUS → Custom Labels (label imej, Rekognition urus training & hosting — managed, bukan from-scratch). DetectLabels (Object/Scene Detection) = label GENERIK je ("animal", "outdoor"), tak kenal spesies. "from scratch" exclude SageMaker (D), BUKAN Custom Labels (A, managed). Facial Analysis = muka MANUSIA, bukan haiwan.',
    accent: 'c6',
    domain: 'D3 · High-Perf',
    slug: 'd3-analytics-aws-ai-ml-services',
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
  // Mermaid flowchart that renders the same confused-pairs visually. Edge style
  // encodes the relation: solid `-->` = flow/contains (→/⊃), dashed `-.->` = vs
  // (confused pair, pick one), thick `==>` = `+` (both needed). Discriminator
  // rides on the edge/node label so no exam content is lost when the text cards
  // are replaced by the diagram.
  mermaid: string
}

export const petaModules: PetaModule[] = [
  {
    num: '01',
    title: 'Security & multi-account',
    accent: 'c3',
    mermaid: `flowchart LR
  a1["Management acct"] -->|"⊃ Organizations:<br/>1 payer + consolidated billing"| a2["OU → member accts"]
  a3["SCP"] -. "siling MAX: SEKAT<br/>bukan BAGI, root pun kena" .-> a4["IAM policy"]
  a5["IAM (source)"] == "DUA kunci · set 1 belah<br/>je = Access Denied" ==> a6["Resource policy (dest)"]
  a7["Resource policy<br/>(org read S3/SQS)"] -. "kemas vs kompleks" .-> a8["Role + AssumeRole<br/>(temp creds)"]
  a9["IAM Group<br/>(bakul user)"] -. "tak boleh assume vs<br/>identiti sementara" .-> a10["IAM Role"]
  a11["Secrets Manager<br/>(auto-rotate)"] -. "rotate vs config" .-> a12["SSM Param Store<br/>(Standard FREE)"]
  a13["AWS-managed key"] -. "kawal rotation/<br/>policy/audit → CMK" .-> a14["CMK"]
  a15["KMS<br/>(multi-tenant, FIPS L2)"] -. "regulasi ketat<br/>→ HSM" .-> a16["CloudHSM<br/>(single-tenant L3)"]
  a17["Encryption at rest<br/>(KMS/SSE)"] -. "disk vs network" .-> a18["In transit<br/>(TLS/ACM/VPN)"]`,
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
    mermaid: `flowchart LR
  b1["CloudWatch<br/>(metrics/logs/alarm · APA jadi)"] -. "apa vs siapa" .-> b2["CloudTrail<br/>(SIAPA call API · audit)"]
  b3["CloudTrail<br/>(siapa buat action)"] -. "action vs state" .-> b4["AWS Config<br/>(STATE resource + comply)"]`,
    rows: [
      { left: 'CloudWatch', rel: 'vs', right: 'CloudTrail', note: 'CloudWatch = metrics/logs/alarms (APA jadi); CloudTrail = SIAPA call API (audit).' },
      { left: 'CloudTrail', rel: 'vs', right: 'AWS Config', note: 'CloudTrail = siapa buat action; Config = STATE resource + comply ke tak.' },
    ],
  },
  {
    num: '03',
    title: 'Networking',
    accent: 'c4',
    mermaid: `flowchart LR
  c1["VPC<br/>(rangkaian sendiri)"] -->|"⊃ subnet pecah ikut AZ"| c2["Subnet (public/private)"]
  c3["Security Group<br/>(stateful · instance · allow je)"] -. "vs" .-> c4["NACL<br/>(stateless · subnet · allow+deny)"]
  c5["CloudFront<br/>(CDN · cache di edge)"] -. "cache vs no-cache" .-> c6["Global Accelerator<br/>(2 anycast IP · TCP/UDP · failover &lt;30s)"]`,
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
    mermaid: `flowchart LR
  d1["ALB (L7)<br/>(HTTP path/host routing)"] -. "L7 vs L4" .-> d2["NLB (L4)<br/>(TCP/UDP · juta conn · static IP)"]
  d3["NLB"] -. "depan appliance<br/>pihak ketiga" .-> d4["GWLB<br/>(firewall / IDS / IPS)"]`,
    rows: [
      { left: 'ALB (L7)', rel: 'vs', right: 'NLB (L4)', note: 'ALB = HTTP path/host routing; NLB = TCP/UDP, juta conn, static IP, latency rendah.' },
      { left: 'NLB', rel: 'vs', right: 'GWLB', note: 'GWLB = depan appliance pihak ketiga (firewall / IDS / IPS).' },
    ],
  },
  {
    num: '05',
    title: 'Database',
    accent: 'c5',
    mermaid: `flowchart LR
  e1["Multi-AZ<br/>(survive AZ outage · HA)"] -. "HA vs scaling" .-> e2["Read Replica<br/>(offload READ)"]
  e3["10,000 Lambda"] -->|"pool conn · elak<br/>too many connections"| e4["RDS Proxy"] --> e5["RDS"]`,
    rows: [
      { left: 'Multi-AZ', rel: 'vs', right: 'Read Replica', note: 'Multi-AZ = survive AZ outage (HA); Read Replica = offload READ (scaling).' },
      { left: '10,000 Lambda', rel: '→', right: 'RDS Proxy → RDS', note: 'Proxy pool connection; elak "too many connections". Pilih DB? Tengok pokok keputusan atas ↑' },
    ],
  },
  {
    num: '06',
    title: 'Compute & scaling',
    accent: 'c6',
    mermaid: `flowchart LR
  f1["Scale UP (vertical)<br/>(instance besar · ada had)"] -. "vs" .-> f2["Scale OUT (horizontal)<br/>(tambah instance · ASG · elastik)"]
  f3["On-Demand / Reserved"] -. "harga vs interruptible" .-> f4["Spot<br/>(90% murah · 2-min notice)"]
  f5["EBS<br/>(block · 1 instance · 1 AZ)"] -. "1 vs ramai" .-> f6["EFS<br/>(file · share ramai · multi-AZ)"]
  f7["Beanstalk<br/>(PaaS · deploy APP · auto EC2+ALB+ASG)"] -. "app vs semua resource" .-> f8["CloudFormation<br/>(IaC general)"]`,
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
    mermaid: `flowchart LR
  g1["Region<br/>(geografi)"] -->|"⊃ ≥3 AZ"| g2["AZ<br/>(data center berasingan)"]
  g2 -->|"⊃ 1 subnet = 1 AZ"| g3["Subnet<br/>(Multi-AZ = tahan 1 AZ tumbang)"]`,
    rows: [
      { left: 'Region', rel: '⊃', right: 'AZ (≥3)', note: 'Region = geografi; AZ = data center berasingan dalam region.' },
      { left: 'AZ', rel: '⊃', right: 'Subnet', note: '1 subnet = 1 AZ; deploy Multi-AZ = tahan 1 AZ tumbang.' },
    ],
  },
  {
    num: '08',
    title: 'Aliran data',
    accent: 'c3',
    mermaid: `flowchart LR
  h1["Kinesis Streams<br/>(real-time custom · shard)"] -. "custom vs auto-deliver" .-> h2["Firehose<br/>(auto → S3/Redshift · serverless)"]
  h3["SQS<br/>(queue · pull · 1 consumer)"] -. "queue vs pub/sub" .-> h4["SNS<br/>(push · fan-out ramai)"]`,
    rows: [
      { left: 'Kinesis Streams', rel: 'vs', right: 'Firehose', note: 'Streams = real-time custom (shard); Firehose = auto-deliver ke S3/Redshift (serverless).' },
      { left: 'SQS', rel: 'vs', right: 'SNS', note: 'SQS = queue, pull, 1 consumer; SNS = pub/sub, push, fan-out ramai.' },
    ],
  },
  {
    num: '09',
    title: 'Threat detection & protection',
    accent: 'c6',
    mermaid: `flowchart LR
  g1["GuardDuty<br/>(threat dari LOGS · ML · no agent)"] -. "logs vs CVE" .-> g2["Inspector<br/>(scan CVE/vuln · EC2/ECR/Lambda)"]
  g3["Inspector<br/>(CVE software)"] -. "software vs data" .-> g4["Macie<br/>(PII/sensitive data dalam S3)"]
  g5["GuardDuty<br/>(DETECT real-time)"] -. "detect vs investigate" .-> g6["Detective<br/>(INVESTIGATE · behavior graph · root cause)"]
  g7["GuardDuty/Inspector/Macie<br/>(detector)"] -->|"feed finding"| g8["Security Hub<br/>(AGGREGATOR + compliance CIS/PCI · 1 dashboard)"]
  p1["WAF<br/>(L7 web exploit · SQLi/XSS/bot)"] -. "web exploit vs DDoS" .-> p2["Shield<br/>(DDoS L3/4 flood)"]
  p3["Shield Standard<br/>(FREE · auto · L3/4)"] -. "free vs DRT+cost" .-> p4["Shield Advanced<br/>($3k/bln · DRT 24/7 · cost protection · WAF free)"]
  p5["WAF<br/>(HTTP request je)"] -. "web vs VPC-wide" .-> p6["Network Firewall<br/>(semua traffic VPC · L3-7 · Suricata · domain/egress)"]
  p7["WAF<br/>(rule 1 resource)"] -->|"sebar ke semua acct"| p8["Firewall Manager<br/>(enforce WAF/Shield/SG/NF · seluruh Org)"]`,
    rows: [
      { left: 'GuardDuty', rel: 'vs', right: 'Inspector', note: 'GuardDuty = threat dari LOGS (CloudTrail/VPC Flow/DNS, ML, no agent). Inspector = scan CVE/vulnerability (EC2/ECR/Lambda). "unusual activity / crypto-mining / compromised" → GuardDuty; "CVE / patch / vulnerability" → Inspector.' },
      { left: 'Inspector', rel: 'vs', right: 'Macie', note: 'Inspector = CVE/vuln dalam SOFTWARE (EC2/ECR/Lambda). Macie = PII/sensitive data dalam S3. "vulnerability scan" → Inspector; "PII / credit card / sensitive data in S3" → Macie.' },
      { left: 'GuardDuty', rel: 'vs', right: 'Detective', note: 'GuardDuty = DETECT (real-time, cari ancaman). Detective = INVESTIGATE (post-incident, behavior graph, root cause). "investigate finding / root cause / scope / visualize attack" → Detective.' },
      { left: 'Security Hub', rel: 'vs', right: 'GuardDuty/Inspector/Macie', note: 'Security Hub = AGGREGATOR (kumpul semua finding + compliance score CIS/PCI, satu dashboard) — TAK detect sendiri. "single pane of glass / aggregate findings / compliance across accounts" → Security Hub.' },
      { left: 'WAF', rel: 'vs', right: 'Shield', note: 'WAF = L7 web exploit (SQLi/XSS/bad bot/rate limit). Shield = DDoS (L3/4 volumetric flood). "SQL injection / XSS" → WAF; "DDoS flood" → Shield.' },
      { left: 'Shield Standard', rel: 'vs', right: 'Shield Advanced', note: 'Standard = FREE, auto, L3/4 — takyah buat apa. Advanced = $3k/bln: DRT 24/7 + cost protection + WAF free + L7. "free DDoS" → Standard; "DRT / cost protection / maximum DDoS" → Advanced.' },
      { left: 'WAF', rel: 'vs', right: 'Network Firewall', note: 'WAF = HTTP request je (L7, pasang CloudFront/ALB/API GW). Network Firewall = SEMUA traffic VPC (L3-7, Suricata, domain/egress filter). "domain filtering / egress / IDS-IPS VPC-wide" → Network Firewall.' },
      { left: 'WAF', rel: 'vs', right: 'Firewall Manager', note: 'WAF = tulis rule untuk SATU resource. Firewall Manager = sebar policy (WAF/Shield/SG/Network Firewall) merentas SEMUA account Organization + auto-cover account baru. "centrally enforce across all accounts incl. new ones" → Firewall Manager.' },
    ],
  },
  {
    num: '10',
    title: 'Migration & Transfer',
    accent: 'c2',
    mermaid: `flowchart LR
  m1["MGN<br/>(whole SERVER → EC2 · lift-and-shift)"] -. "server vs DB vs file" .-> m2["DMS<br/>(DATABASE · minimal downtime)"]
  m2 -. "DB vs file" .-> m3["DataSync<br/>(FILE/object → S3/EFS/FSx)"]
  d1["DMS sahaja<br/>(engine SAMA · homogeneous)"] -. "sama vs beza engine" .-> d2["DMS + SCT<br/>(engine BEZA · heterogeneous)"]
  f1["DataSync<br/>(ONLINE · scheduled · verify)"] -. "online vs hybrid vs offline" .-> f2["Storage Gateway<br/>(ONGOING hybrid access)"]
  f2 -. "hybrid vs offline" .-> f3["Snow Family<br/>(OFFLINE peti fizikal · PB-scale)"]
  s1["Snowcone<br/>(8TB HDD / 14TB SSD · kecik)"] -. "ikut saiz" .-> s2["Snowball Edge Storage<br/>(210TB · bulk migration)"]
  s2 -. "storage vs compute" .-> s3["Snowball Edge Compute<br/>(28TB · 104 vCPU · edge ML)"]
  t1["Transfer Family<br/>(partner upload SFTP/FTPS/FTP/AS2 → S3/EFS)"]
  p1["App Discovery Service<br/>(DISCOVER + dependency · planning)"] -->|"feed inventory"| p2["Migration Hub<br/>(TRACK je · home region · TAK migrate)"]`,
    rows: [
      { left: 'MGN', rel: 'vs', right: 'DMS vs DataSync', note: 'Apa yang dipindah? MGN = whole SERVER (OS+apps+data) → EC2, lift-and-shift. DMS = DATABASE je (minimal downtime). DataSync = FILE/object → S3/EFS/FSx. "entire server to EC2" → MGN; "migrate database" → DMS; "transfer NAS/NFS files" → DataSync.' },
      { left: 'DMS sahaja', rel: 'vs', right: 'DMS + SCT', note: 'Engine SAMA (MySQL→RDS MySQL) = homogeneous = DMS sorang cukup. Engine BEZA (Oracle→Aurora PostgreSQL) = heterogeneous = wajib SCT convert schema dulu, baru DMS. CDC = keep source↔target sync sampai cutover. Multi-AZ replication instance = HA masa migrate.' },
      { left: 'DataSync', rel: 'vs', right: 'Storage Gateway vs Snow', note: 'DataSync = migration ONLINE (one-time/scheduled, NFS/SMB/HDFS → S3/EFS/FSx, +EFS cross-region private network). Storage Gateway = akses hybrid BERTERUSAN. Snow = OFFLINE peti fizikal bila PB-scale / bandwidth lambat. "no public internet EFS cross-region" → DataSync.' },
      { left: 'Snowcone', rel: 'vs', right: 'Snowball Edge', note: 'Ikut saiz: Snowcone = 8TB HDD / 14TB SSD (paling kecik, edge). Snowball Edge Storage Optimized = 210TB (bulk migration). Snowball Edge Compute Optimized = 28TB · 104 vCPU · 416GB RAM (edge ML/video). "smallest/portable" → Snowcone; "petabyte bulk" → Snowball Edge Storage.' },
      { left: 'Transfer Family', rel: '=', right: 'SFTP / FTPS / FTP / AS2', note: 'Managed SFTP/FTPS/FTP/AS2 endpoint, backend S3/EFS — untuk partner/customer hantar fail guna protokol lama tanpa tukar code mereka. "partner uploads via SFTP into S3" → Transfer Family (BUKAN DataSync, BUKAN Storage Gateway).' },
      { left: 'App Discovery Service', rel: 'vs', right: 'Migration Hub', note: 'ADS = DISCOVER + inventory + dependency on-prem (fasa planning; agentless via VMware vCenter, agent-based untuk network dependency). Migration Hub = TRACK progress merentas MGN/DMS/DataSync (home region, Strategy Recommendations, Orchestrator) — TAK migrate apa-apa. "track migrations one dashboard" → Migration Hub.' },
    ],
  },
  {
    num: '11',
    title: 'Terma: Ingress = Inbound · Egress = Outbound',
    accent: 'c4',
    mermaid: `flowchart LR
  i1["Inbound<br/>(SG/NACL · nama UI Console)"] -. "SAMA · trafik MASUK ⬇" .-> i2["Ingress<br/>(code: Terraform/CFN/K8s)"]
  o1["Outbound<br/>(SG/NACL · nama UI Console)"] -. "SAMA · trafik KELUAR ⬆" .-> o2["Egress<br/>(code: Terraform/CFN/K8s)"]
  l1["SG/NACL Inbound (L4)<br/>(perimeter infra · port/IP je)"] -. "L4 infra vs L7 app" .-> l2["K8s Ingress (L7)<br/>(baca URL path → Pod betul)"]
  k1["Kubernetes Ingress<br/>(EKS · rule pintu masuk)"] -->|"auto-create di belakang tabir<br/>(Load Balancer Controller)"| k2["AWS ALB (L7)<br/>(agih trafik ikut path/host)"]`,
    rows: [
      { left: 'Inbound', rel: '=', right: 'Ingress', note: 'Maksud SAMA: trafik MASUK dari luar → dalam sistem. "Inbound" = nama mesra UI (AWS Console Security Group/NACL). "Ingress" = nama saintifik bila tulis code (Terraform/CloudFormation/Kubernetes). Nampak `ingress {}` dalam Terraform → otak tukar: "ooo ini Inbound rules".' },
      { left: 'Outbound', rel: '=', right: 'Egress', note: 'Maksud SAMA: trafik KELUAR dari sistem → internet luar. "Outbound" = UI Console; "Egress" = code. Terraform: blok `ingress{}` = inbound rules, blok `egress{}` = outbound rules.' },
      { left: 'SG/NACL Inbound (L4)', rel: 'vs', right: 'Kubernetes Ingress (L7)', note: 'Konsep sama (jaga pintu masuk) tapi beza LAPISAN. SG/NACL Inbound = L4 perimeter infra — tengok port/IP je ("Port 443 bukak? Lepas masuk"), tak kisah app apa. K8s Ingress = L7 aplikasi — boleh baca URL path ("request ke /api/v1/users → hantar ke Pod backend-user").' },
      { left: 'Kubernetes Ingress', rel: '→', right: 'AWS ALB', note: 'Pasang K8s Ingress dalam EKS → AWS Load Balancer Controller AUTO-create sebiji ALB di belakang tabir untuk agih trafik HTTP ikut path/host. Ingress Controller = "polis trafik / pengagih URL" = kerja sama macam ALB. Mereka berkawan baik.' },
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
    bait: 'aws:SourceVpc untuk hadkan akses ke satu endpoint je (least privilege)',
    fix: 'SourceVpc = SELURUH VPC (luas). Untuk least privilege "satu endpoint tertentu" → aws:SourceVpce (ada "e" hujung = VPC Endpoint ID, lebih spesifik).',
  },
  {
    bait: 'cfn-signal / cfn-hup untuk install packages masa EC2 launch',
    fix: 'Baca metadata + INSTALL masa launch → cfn-init (init = setup). cfn-signal = bagi tahu CFN dah siap; cfn-hup = pantau metadata berubah; cfn-get-metadata = ambil info je.',
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
  {
    bait: 'DMS untuk migrate whole server (OS + apps) ke EC2',
    fix: 'DMS = DATABASE je. "minimal downtime" mengumpan, tapi whole server (OS+apps) → AWS MGN (lift-and-shift). Files → DataSync.',
  },
  {
    bait: 'Migration Hub untuk migrate server/DB',
    fix: 'Nama "Migration Hub" mengumpan — ia TRACK je, tak migrate. Server → MGN, DB → DMS, file → DataSync. Hub cuma dashboard progress.',
  },
  {
    bait: 'DMS sahaja untuk Oracle → Aurora PostgreSQL',
    fix: 'Engine BEZA (heterogeneous) → wajib SCT convert schema/stored procedure dulu, baru DMS pindah data. DMS sorang cukup hanya kalau engine SAMA.',
  },
  {
    bait: 'Evaluate Target Health = Yes untuk on-prem backup endpoint',
    fix: 'Evaluate Target Health cuma untuk AWS resource (ALB, ELB, API Gateway…). On-prem BUKAN AWS resource → kena create custom Route 53 health check. DR failover juga perlu DUA record berasingan (primary+secondary), bukan satu record gabungan.',
  },
  {
    bait: 'Stop/Start EC2 untuk preserve "same application state" & elak long init',
    fix: 'Stop/Start = RAM HILANG, macam reboot, kena reinitialize. Nak simpan in-memory state (OS, processes, cache) + resume cepat → EC2 Hibernation (RAM → EBS root). AMI simpan disk je, bukan RAM.',
  },
  {
    bait: 'Retention period untuk retain records "indefinitely"',
    fix: 'Retention period = tempoh TETAP (fixed duration), bukan indefinite. "indefinitely / no expiration" → Legal Hold (tiada tempoh tamat). Dan compliance ketat → Vault LOCK policy (immutable), bukan Vault ACCESS policy (mutable, boleh ubah).',
  },
  {
    bait: 'AWS PrivateLink untuk access EFS across VPC/region',
    fix: 'PrivateLink TAK support EFS (ia untuk service-based connection, bukan file system). VPC beza region nak akses EFS private → inter-region VPC peering (+ Direct Connect untuk on-prem).',
  },
  {
    bait: 'Same-region VPC peering untuk VPC di region berbeza',
    fix: 'VPC peering biasa = same region. VPC di REGION berbeza → inter-region VPC peering (kalau tak, trafik tak mengalir private). VPN = mahal + latency, bukan optimum.',
  },
  {
    bait: 'Install CloudWatch Agent pada EC2 untuk collect ALB metrics',
    fix: 'ALB AUTOMATIK hantar metrics (request, latency, HTTP codes) ke CloudWatch — tak perlu agent. CW Agent kumpul metrics OS-level DALAM EC2 (CPU/memory/disk), bukan metrics load balancer.',
  },
  {
    bait: 'Redshift untuk real-time recommendation / low-latency read-write',
    fix: 'Redshift = data warehouse OLAP untuk analytics/BATCH, bukan real-time (lambat). Real-time + sub-millisecond + key-value at scale → ElastiCache for Redis. Aurora = relational, Neptune = graph — dua-dua tak sepantas Redis utk real-time KV.',
  },
  {
    bait: 'Rekognition Object/Scene Detection untuk identify specific animal species',
    fix: 'DetectLabels bagi label GENERIK ("animal", "outdoor") — tak kenal spesies tertentu (harimau Malaya vs Benggala). Spesies/objek khusus → Rekognition Custom Labels (label imej, Rekognition urus training — managed). Jangan anggap "train" = "from scratch"; SageMaker je yang from-scratch.',
  },
  {
    bait: 'Rekognition Facial Analysis untuk detect animals via facial features',
    fix: 'Facial Analysis direka untuk MUKA MANUSIA (emosi, umur, jantina, landmark). Bukan untuk haiwan langsung. Kenal objek/haiwan → Object/Scene Detection (generik) atau Custom Labels (spesifik).',
  },
]
