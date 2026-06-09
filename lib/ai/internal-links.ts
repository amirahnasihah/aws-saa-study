import { labs } from '@/data/labs'

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

type IndexedLab = {
  slug: string
  title: string
  blob: string
}

const labsIndex: IndexedLab[] = labs.map((lab) => ({
  slug: lab.slug,
  title: lab.title,
  blob: [lab.slug, lab.title, ...lab.services, lab.summary].join(' ').toLowerCase(),
}))

function scoreTerms(blob: string, terms: string[]): number {
  return terms.reduce((score, term) => {
    const t = term.toLowerCase().trim()
    return t.length > 1 && blob.includes(t) ? score + Math.min(t.length, 24) : score
  }, 0)
}

function matchLab(terms: string[]): InternalLink | null {
  const cleaned = terms.map((t) => t.trim()).filter((t) => t.length > 1)
  let best: { lab: IndexedLab; score: number } | null = null

  for (const lab of labsIndex) {
    const score = scoreTerms(lab.blob, cleaned)
    if (score > 0 && (!best || score > best.score)) best = { lab, score }
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
