import { labs, type Lab } from '@/data/labs'

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

// Services that appear on almost every lab — matching these alone is not
// enough to consider a lab relevant for a given context.
const GENERIC_SERVICES = new Set(['vpc', 'iam', 'cloudwatch', 'cloudtrail'])

type IndexedLab = {
  slug: string
  title: string
  services: string[]       // original case preserved for display
  titleWords: string[]     // lower-cased words from the lab title
}

const labsIndex: IndexedLab[] = labs.map((lab: Lab) => ({
  slug: lab.slug,
  title: lab.title,
  services: lab.services,
  titleWords: lab.title.toLowerCase().split(/\W+/).filter((w) => w.length > 2),
}))

function matchLab(terms: string[]): InternalLink | null {
  const termBlob = terms.map((t) => t.toLowerCase()).join(' ')
  let best: { lab: IndexedLab; score: number } | null = null

  for (const lab of labsIndex) {
    let score = 0

    // Title-word hit — highest signal (e.g. "EC2" in title matches "EC2" in terms)
    for (const word of lab.titleWords) {
      if (termBlob.includes(word)) score += word.length * 3
    }

    // Specific service hit — only count non-generic services
    for (const svc of lab.services) {
      const s = svc.toLowerCase()
      if (!GENERIC_SERVICES.has(s) && termBlob.includes(s)) score += s.length * 2
    }

    if (score >= 10 && (!best || score > best.score)) best = { lab, score }
  }

  if (!best) return null
  return {
    url: `/labs/${best.lab.slug}`,
    label: 'Labs',
    sublabel: best.lab.title,
    icon: '🧪',
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns relevant internal site links for a given set of search terms.
 * Results are de-duped and capped at 2 to keep the sources panel clean.
 */
export function findInternalLinks(terms: string[]): InternalLink[] {
  const links: InternalLink[] = []

  const lab = matchLab(terms)
  if (lab) links.push(lab)

  const vpc = matchVpcSection(terms)
  if (vpc) links.push(vpc)

  return links.slice(0, 2)
}
