export type ChangeType = 'feat' | 'fix' | 'chore' | 'refactor'

export type ChangeItem = {
  type: ChangeType
  text: string
}

export type ChangeEntry = {
  date: string
  changes: ChangeItem[]
}

export const changelog: ChangeEntry[] = [
  {
    date: '2026-06-02',
    changes: [
      { type: 'feat', text: 'wzs3 (EFS Section Test): 5 questions seeded to remote D1 — answers verified via AWS docs MCP' },
      { type: 'feat', text: 'wzs2 (Storage Section Test): 5 questions seeded to remote D1 — answers verified via AWS docs MCP' },
      { type: 'feat', text: 'wzs1 (VPC Section Test): 10 questions seeded to remote D1 — answers verified via AWS docs MCP' },
      { type: 'feat', text: 'PT6 (wz6): 65 Whizlabs Practice Test 6 questions seeded to remote D1 — answers verified via AWS docs MCP' },
      { type: 'feat', text: 'Screenshots for wz6 (65), wzs1 (10), wzs2 (5), wzs3 (5) added to public/questions/' },
      { type: 'feat', text: 'Glossary: 14 new terms — delete marker, noncurrent versions, secondary VPC CIDR, SNI, OAC, OAI, edge-to-edge routing, transitive peering, instance store, EBS-backed, Elastic Volumes, EBS snapshot, AWS Backup, EFS performance/throughput modes, EFS mount helper' },
      { type: 'feat', text: 'awsServices notes: CloudFront OAC + Lambda@Edge, ALB SNI, API Gateway, AppFlow, SageMaker, VPC Peering edge-to-edge, EBS storage types, EFS performance/throughput modes + encryption in transit + cross-VPC tips, AWS Backup' },
      { type: 'fix', text: 'Official AWS docs reference URLs added to all wzs1, wzs2, wzs3 questions' },
    ],
  },
  {
    date: '2026-05-28',
    changes: [
      { type: 'feat', text: 'PT4 (wz4): 65 Whizlabs Practice Test 4 questions seeded to remote D1' },
      { type: 'feat', text: 'PT5 (wz5): 65 Whizlabs Practice Test 5 questions seeded to remote D1 — answers verified via AWS docs MCP' },
      { type: 'feat', text: 'Screenshots for wz4 and wz5 (130 images) added to public/questions/' },
      { type: 'feat', text: 'Glossary: 15 new terms — awsvpc, ENI, EBK, PBK, ABAC, NotPrincipal, CORS, Anycast, PoP, DRA, Standby state, cooldown period, InService, bridge, host' },
      { type: 'feat', text: 'awsServices notes: CloudHSM backup (EBK/PBK), FSx Lustre DRA + S3 integration, QuickSight ML forecasting, Client VPN, Step Functions Distributed Map, X-Ray Insights, Glue Crawler, Polly StartSpeechSynthesisTask, Global Accelerator static IPs' },
    ],
  },
  {
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
    date: '2026-05-26',
    changes: [
      { type: 'feat', text: 'Quiz scraping script for Whizlabs questions' },
      { type: 'chore', text: 'Extended .gitignore for generated files and workspace config' },
    ],
  },
  {
    date: '2026-05-25',
    changes: [
      { type: 'feat', text: 'Screenshot support for practice questions' },
      { type: 'feat', text: 'AWS reference URL verification script' },
      { type: 'feat', text: 'Seed script for screenshot metadata' },
    ],
  },
  {
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
    date: '2026-05-18',
    changes: [
      { type: 'feat', text: 'Bookmark feature — save and persist AWS service cards' },
    ],
  },
  {
    date: '2026-05-17',
    changes: [
      { type: 'feat', text: 'SiteFooter component added across all pages' },
      { type: 'feat', text: 'Extra common networking patterns section' },
    ],
  },
  {
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
