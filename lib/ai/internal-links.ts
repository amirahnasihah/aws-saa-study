import { labsLinkIndex } from '@/data/labsLinkIndex'
import { learnHref } from '@/data/awsMeta'

export type InternalLink = {
  url: string
  label: string
  sublabel: string
  icon: string
}

// ── VPC Guide section map ─────────────────────────────────────────────────────

const vpcSections: Array<{ keywords: string[]; anchor: string; title: string }> = [
  { keywords: ['vpc', 'virtual private cloud', 'mental model'], anchor: 'mental-model', title: 'VPC Mental Model' },
  { keywords: ['cidr', 'ip address', 'ip range', 'subnet mask', '/16', '/24', 'ipv4'], anchor: 'cidr', title: 'CIDR & IP Structure' },
  { keywords: ['subnet', 'public subnet', 'private subnet'], anchor: 'subnets', title: 'Public vs Private Subnet' },
  { keywords: ['security group', 'nacl', 'network acl', 'stateful', 'stateless'], anchor: 'sg-nacl', title: 'Security Groups vs NACLs' },
  { keywords: ['traffic flow', 'request', 'inbound', 'outbound', 'internet gateway', 'igw'], anchor: 'traffic', title: 'Traffic Flow' },
  { keywords: ['nat gateway', 'nat instance', 'outbound only', 'private instance'], anchor: 'nat-flow', title: 'NAT Gateway Flow' },
  { keywords: ['vpc peering', 'transit gateway', 'vpn', 'direct connect', 'site-to-site', 'connectivity'], anchor: 'connectivity', title: 'VPC Connectivity' },
]

function matchVpcSection(terms: string[]): InternalLink | null {
  const blob = terms.map((t) => t.toLowerCase()).join(' ')
  let best: { anchor: string; title: string; score: number } | null = null

  for (const section of vpcSections) {
    const score = section.keywords.reduce((s, kw) => (blob.includes(kw) ? s + kw.length : s), 0)
    if (score > 0 && (!best || score > best.score)) {
      best = { anchor: section.anchor, title: section.title, score }
    }
  }

  if (!best) return null
  return {
    url: `/vpc#${best.anchor}`,
    label: 'VPC Guide',
    sublabel: best.title,
    icon: '🏘️',
  }
}

// ── Labs index ────────────────────────────────────────────────────────────────

// Words that appear in a large fraction of lab titles (e.g. "Amazon EC2 ...",
// "... using AWS ...") — too generic to signal which lab is relevant.
const TITLE_STOPWORDS = new Set([
  'amazon', 'aws', 'and', 'with', 'using', 'how', 'for', 'from', 'into', 'via',
  'the', 'your', 'introduction', 'create', 'creating', 'build', 'building',
  'part', 'case', 'study', 'challenge', 'configure', 'configuring', 'setup',
  'set', 'service', 'services', 'instance', 'instances',
])

type IndexedLab = {
  slug: string
  title: string
  titleWords: string[]     // lower-cased, non-generic words from the lab title
}

const labsIndex: IndexedLab[] = labsLinkIndex.map((lab) => ({
  slug: lab.slug,
  title: lab.title,
  titleWords: lab.title
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2 && !TITLE_STOPWORDS.has(w)),
}))

function matchLab(terms: string[]): InternalLink | null {
  const termBlob = terms.map((t) => t.toLowerCase()).join(' ')
  let best: { lab: IndexedLab; score: number } | null = null

  for (const lab of labsIndex) {
    // Title-word hit — highest signal (e.g. "RDS" in title matches "RDS" in terms)
    const score = lab.titleWords.reduce(
      (s, word) => (termBlob.includes(word) ? s + word.length * 3 : s),
      0
    )

    if (score >= 12 && (!best || score > best.score)) best = { lab, score }
  }

  if (!best) return null
  return {
    url: `/labs/${best.lab.slug}`,
    label: 'Labs',
    sublabel: best.lab.title,
    icon: '🧪',
  }
}

// ── Study notes (in-app /learn guide) ──────────────────────────────────────────

// The /learn page renders each domain section with an `id` anchor (see
// app/learn/page.tsx), so we can deep-link straight to the relevant topic —
// no external site needed, every link resolves within this app.
const notesSections: Array<{ keywords: string[]; anchor: string; title: string }> = [
  { keywords: ['ec2', 'lambda', 'fargate', 'compute', 'serverless', 'container', 'ecs', 'eks', 'instance type', 'auto scaling', 'asg'], anchor: 'd3-compute', title: 'Compute' },
  { keywords: ['s3', 'ebs', 'efs', 'fsx', 'storage', 'glacier', 'object storage', 'block storage', 'file storage', 'volume', 'iops', 'throughput'], anchor: 'd3-storage', title: 'Storage' },
  { keywords: ['cloudfront', 'route 53', 'route53', 'elb', 'load balancer', 'cdn', 'global accelerator', 'api gateway', 'delivery'], anchor: 'd3-network', title: 'Networking & Delivery' },
  { keywords: ['rds', 'aurora', 'dynamodb', 'database', 'redshift', 'elasticache', 'documentdb', 'neptune', 'read replica'], anchor: 'd3-db', title: 'Databases' },
  { keywords: ['sqs', 'sns', 'eventbridge', 'messaging', 'step functions', 'kinesis', 'amazon mq', 'decoupling'], anchor: 'd3-messaging', title: 'Messaging & Serverless' },
  { keywords: ['iam', 'identity', 'iam role', 'iam policy', 'sts', 'permission', 'principal', 'assume role'], anchor: 'd1-iam', title: 'IAM & Identity' },
  { keywords: ['security group', 'nacl', 'waf', 'shield', 'network security', 'firewall', 'ddos'], anchor: 'd1-netsec', title: 'Network Security' },
  { keywords: ['kms', 'encryption', 'data protection', 'secrets manager', 'acm', 'certificate', 'at rest', 'in transit'], anchor: 'd1-data', title: 'Data Protection' },
  { keywords: ['high availability', 'multi-az', 'multi az', 'failover', 'availability zone'], anchor: 'd2-ha', title: 'High Availability & Scaling' },
  { keywords: ['disaster recovery', 'rpo', 'rto', 'pilot light', 'warm standby', 'backup'], anchor: 'd2-dr', title: 'Disaster Recovery' },
  { keywords: ['pricing', 'cost', 'savings plan', 'reserved instance', 'spot instance', 'on-demand'], anchor: 'd4-pricing', title: 'EC2 Pricing Models' },
]

function matchNotes(terms: string[]): InternalLink | null {
  const blob = terms.map((t) => t.toLowerCase()).join(' ')
  let best: { anchor: string; title: string; score: number } | null = null

  for (const section of notesSections) {
    // Longer, more specific keywords (e.g. "dynamodb") outweigh broad ones ("database").
    const score = section.keywords.reduce((s, kw) => (blob.includes(kw) ? s + kw.length : s), 0)
    if (score > 0 && (!best || score > best.score)) {
      best = { anchor: section.anchor, title: section.title, score }
    }
  }

  if (!best) return null
  return {
    url: learnHref(best.anchor),
    label: 'Study Notes',
    sublabel: best.title,
    icon: '📓',
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns relevant internal site links for a given set of search terms.
 * Study notes (the /learn guide) come first (highest value to the learner),
 * then Labs and the VPC Guide. Capped at 3 to keep the sources panel clean.
 */
export function findInternalLinks(terms: string[]): InternalLink[] {
  const links: InternalLink[] = []

  const notes = matchNotes(terms)
  if (notes) links.push(notes)

  const lab = matchLab(terms)
  if (lab) links.push(lab)

  const vpc = matchVpcSection(terms)
  if (vpc) links.push(vpc)

  return links.slice(0, 3)
}
