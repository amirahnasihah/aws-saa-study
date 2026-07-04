export type ColorCategory =
  | 'compute'
  | 'storage'
  | 'network'
  | 'messaging'
  | 'infra'
  | 'pricing'
  | 'd4store'
  | 'd4net'
  | 'd4db'
  | 'd4dr'
  | 'd1iam'
  | 'd1net'
  | 'd1data'
  | 'd1connect'
  | 'd2ha'
  | 'd2dr'
  | 'd2backup'
  | 'd2migrate'
  | 'd3db'
  | 'd3analytics'
  | 'tools'

// Prefixed with sectionId because some services (e.g. Penetration Testing, CloudFront)
// appear in more than one section — a bare name slug would collide.
export const serviceSlug = (sectionId: string, shortName: string): string =>
  `${sectionId}-${shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`

// Structured side-by-side comparison rendered as a real table (VPC-page style).
// `headers[0]` labels the attribute column; the rest are the things being compared.
// Each row is [attribute, ...valuesPerComparedColumn] — keep row length === headers length.
export interface CompareTable {
  label?: string
  headers: string[]
  rows: string[][]
  takeaway?: string
}

// Lightweight anatomy/flow diagram — the AWS-docs style "boxes + arrows" picture.
// Each step is rendered left→right with an arrow between steps; a step holding more
// than one node renders as stacked parallel boxes (fan-out / branching).
export type DiagramTone = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6'
export interface DiagramNode {
  label: string
  sub?: string
  tone?: DiagramTone
}
export interface DiagramStep {
  nodes: DiagramNode[]
}
export interface FlowDiagram {
  label?: string
  steps: DiagramStep[]
  caption?: string
}

// An official AWS diagram (or any static image). `src` may be a remote URL or a
// path under /public. Rendered with a caption + optional eyebrow label.
export interface CardImage {
  src: string
  alt: string
  label?: string
  caption?: string
}

// A Mermaid diagram rendered client-side by components/ai/MermaidDiagram.tsx.
// Use for flows too branchy for the box-and-arrow FlowDiagram (decision trees,
// sequence diagrams, state machines).
export interface MermaidSpec {
  label?: string
  source: string
  caption?: string
}

// One exam-style trap question: the baited stem, the wrong-but-tempting answer
// (and why it's bait), and the correct pick (with the discriminating keyword).
export interface TrapQuestion {
  soalan: string  // the question stem, phrased like the real exam
  umpan: string // the tempting wrong answer + why it's a trap
  betul: string   // the correct answer + the keyword that gives it away
}

export interface ServiceCard {
  shortName: string
  fullName: string
  ingat: string
  gunaUntuk: string
  fungsi: string
  sebabApa?: string // WHY it exists — the problem it solves (rationale)
  contohGuna?: string
  scenario?: string
  storageDetails?: string
  detailsLabel?: string
  diagram?: FlowDiagram | FlowDiagram[]
  mermaid?: MermaidSpec | MermaidSpec[]
  image?: CardImage | CardImage[]
  compare?: CompareTable | CompareTable[]
  sifir?: string[] // quick cheat-sheet — crisp recall lines to memorize
  perangkap?: TrapQuestion[] // example exam-trap questions
  tips?: string[]
  docs?: Array<{ label: string; url: string }>
  keywords: string[]
}

// Slim projection for the home-page Quick Reference. ServiceCard.tsx is a
// client component — every prop field is serialized into the page's RSC
// payload, so passing full cards ships all Deep Notes content (~2MB) to the
// browser. Only these fields are actually rendered on the cheatsheet.
export type ServiceCardSummary = Pick<
  ServiceCard,
  'shortName' | 'fullName' | 'ingat' | 'gunaUntuk' | 'storageDetails' | 'keywords'
>

export const toServiceCardSummary = ({
  shortName,
  fullName,
  ingat,
  gunaUntuk,
  storageDetails,
  keywords,
}: ServiceCard): ServiceCardSummary => ({
  shortName,
  fullName,
  ingat,
  gunaUntuk,
  storageDetails,
  keywords,
})

export interface SectionData {
  id: string
  icon: string
  title: string
  category: ColorCategory
  services: ServiceCard[]
}

export interface DomainData {
  id: string
  badge: string
  title: string
  subtitle: string
  variant: 'd1' | 'd2' | 'd3' | 'd4'
  sections: SectionData[]
  extra?: boolean
}

export const categoryStyles: Record<
  ColorCategory,
  { title: string; accent: string; keyword: string; nav: string; scenario: string }
> = {
  compute:   { title: 'text-c1', accent: 'bg-c1',  keyword: 'text-c1 border-c1/20 bg-c1/5',   nav: 'text-c1 border-c1/20',   scenario: 'bg-c6/5 border-c6/15' },
  storage:   { title: 'text-c2', accent: 'bg-c2',  keyword: 'text-c2 border-c2/20 bg-c2/5',   nav: 'text-c2 border-c2/20',   scenario: 'bg-c6/5 border-c6/15' },
  network:   { title: 'text-c4', accent: 'bg-c4',  keyword: 'text-c4 border-c4/20 bg-c4/5',   nav: 'text-c4 border-c4/20',   scenario: 'bg-c6/5 border-c6/15' },
  messaging: { title: 'text-c3', accent: 'bg-c3',  keyword: 'text-c3 border-c3/20 bg-c3/5',   nav: 'text-c3 border-c3/20',   scenario: 'bg-c6/5 border-c6/15' },
  infra:     { title: 'text-c5', accent: 'bg-c5',  keyword: 'text-c5 border-c5/20 bg-c5/5',   nav: 'text-c5 border-c5/20',   scenario: 'bg-c6/5 border-c6/15' },
  pricing:   { title: 'text-c6', accent: 'bg-c6',  keyword: 'text-c6 border-c6/20 bg-c6/5',   nav: 'text-c6 border-c6/20',   scenario: 'bg-c6/5 border-c6/15' },
  d4store:   { title: 'text-c2', accent: 'bg-c2',  keyword: 'text-c2 border-c2/20 bg-c2/5',   nav: 'text-c2 border-c2/20',   scenario: 'bg-c6/5 border-c6/15' },
  d4net:     { title: 'text-c4', accent: 'bg-c4',  keyword: 'text-c4 border-c4/20 bg-c4/5',   nav: 'text-c4 border-c4/20',   scenario: 'bg-c6/5 border-c6/15' },
  d4db:      { title: 'text-c1', accent: 'bg-c1',  keyword: 'text-c1 border-c1/20 bg-c1/5',   nav: 'text-c1 border-c1/20',   scenario: 'bg-c6/5 border-c6/15' },
  d4dr:      { title: 'text-c5', accent: 'bg-c5',  keyword: 'text-c5 border-c5/20 bg-c5/5',   nav: 'text-c5 border-c5/20',   scenario: 'bg-c6/5 border-c6/15' },
  d1iam:     { title: 'text-c3', accent: 'bg-c3',  keyword: 'text-c3 border-c3/20 bg-c3/5',   nav: 'text-c3 border-c3/20',   scenario: 'bg-c6/5 border-c6/15' },
  d1net:     { title: 'text-c4', accent: 'bg-c4',  keyword: 'text-c4 border-c4/20 bg-c4/5',   nav: 'text-c4 border-c4/20',   scenario: 'bg-c6/5 border-c6/15' },
  d1data:    { title: 'text-c6', accent: 'bg-c6',  keyword: 'text-c6 border-c6/20 bg-c6/5',   nav: 'text-c6 border-c6/20',   scenario: 'bg-c6/5 border-c6/15' },
  d1connect: { title: 'text-c1', accent: 'bg-c1',  keyword: 'text-c1 border-c1/20 bg-c1/5',   nav: 'text-c1 border-c1/20',   scenario: 'bg-c6/5 border-c6/15' },
  d2ha:      { title: 'text-c2', accent: 'bg-c2',  keyword: 'text-c2 border-c2/20 bg-c2/5',   nav: 'text-c2 border-c2/20',   scenario: 'bg-c6/5 border-c6/15' },
  d2dr:      { title: 'text-c5', accent: 'bg-c5',  keyword: 'text-c5 border-c5/20 bg-c5/5',   nav: 'text-c5 border-c5/20',   scenario: 'bg-c6/5 border-c6/15' },
  d2backup:  { title: 'text-c4', accent: 'bg-c4',  keyword: 'text-c4 border-c4/20 bg-c4/5',   nav: 'text-c4 border-c4/20',   scenario: 'bg-c6/5 border-c6/15' },
  d2migrate: { title: 'text-c2', accent: 'bg-c2',  keyword: 'text-c2 border-c2/20 bg-c2/5',   nav: 'text-c2 border-c2/20',   scenario: 'bg-c6/5 border-c6/15' },
  d3db:      { title: 'text-c1', accent: 'bg-c1',  keyword: 'text-c1 border-c1/20 bg-c1/5',   nav: 'text-c1 border-c1/20',   scenario: 'bg-c6/5 border-c6/15' },
  d3analytics: { title: 'text-c3', accent: 'bg-c3',  keyword: 'text-c3 border-c3/20 bg-c3/5',   nav: 'text-c3 border-c3/20',   scenario: 'bg-c6/5 border-c6/15' },
  tools:       { title: 'text-c5', accent: 'bg-c5',  keyword: 'text-c5 border-c5/20 bg-c5/5',   nav: 'text-c5 border-c5/20',   scenario: 'bg-c5/5 border-c5/15' },
}

// SAA-C03 exam-domain pill shown on every card. The domain is known structurally
// (each card lives under domains[].sections[].services[]) so renderers derive the
// badge from the domain id rather than storing it on all 150+ cards. Colours cue
// the four exam pillars; framework/extras get a muted neutral.
export const domainPill: Record<string, { label: string; cls: string }> = {
  domain1: { label: 'D1 · Secure', cls: 'text-rose-300 border-rose-400/30 bg-rose-400/10' },
  domain2: { label: 'D2 · Resilient', cls: 'text-sky-300 border-sky-400/30 bg-sky-400/10' },
  domain3: { label: 'D3 · High-Performing', cls: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10' },
  domain4: { label: 'D4 · Cost-Optimized', cls: 'text-amber-300 border-amber-400/30 bg-amber-400/10' },
  'domain-well-architected': { label: 'Framework · all domains', cls: 'text-violet-300 border-violet-400/30 bg-violet-400/10' },
  'domain-extras': { label: 'Extra · not in exam', cls: 'text-aws-muted border-white/15 bg-white/5' },
}

// Deep Notes is split into per-domain routes (/learn/d1 … /learn/d4, /learn/extras).
// Every anchor on those pages is prefixed (d1-, d2-, wa-, extras-, or a domain id),
// so a bare anchor is enough to compute which page renders it.
export const learnDomainSlugs = ['d1', 'd2', 'd3', 'd4', 'extras'] as const
export type LearnDomainSlug = (typeof learnDomainSlugs)[number]

export const learnDomainIds: Record<LearnDomainSlug, string[]> = {
  d1: ['domain1'],
  d2: ['domain2'],
  d3: ['domain3'],
  d4: ['domain4'],
  extras: ['domain-well-architected', 'domain-extras'],
}

const anchorDomainSlug: Record<string, LearnDomainSlug> = {
  d1: 'd1',
  d2: 'd2',
  d3: 'd3',
  d4: 'd4',
  wa: 'extras',
  extras: 'extras',
  domain1: 'd1',
  domain2: 'd2',
  domain3: 'd3',
  domain4: 'd4',
  'domain-well-architected': 'extras',
  'domain-extras': 'extras',
}

/** Href for a Deep Notes anchor (section id, domain id, or serviceSlug). */
export const learnHref = (anchor?: string): string => {
  if (!anchor) return '/learn'
  const slug = anchorDomainSlug[anchor] ?? anchorDomainSlug[anchor.split('-')[0] ?? '']
  return slug ? `/learn/${slug}#${anchor}` : '/learn'
}

export interface NavItem {
  href: string
  label: string
  className: string
}

export interface NavDomain {
  href: string
  label: string
  colorClass: string
  items: NavItem[]
}

export const navDomains: NavDomain[] = [
  {
    href: '#domain1',
    label: 'D1 · Secure',
    colorClass: 'text-c3',
    items: [
      { href: '#d1-iam',     label: '🔑 IAM',      className: 'text-c3 border-c3/20' },
      { href: '#d1-netsec',  label: '🛡️ Net Sec', className: 'text-c4 border-c4/20' },
      { href: '#d1-data',    label: '🔐 Data',     className: 'text-c6 border-c6/20' },
      { href: '#d1-connect', label: '🔗 Connect',  className: 'text-c1 border-c1/20' },
      { href: '#d1-vpc',     label: '🏘️ VPC',      className: 'text-c2 border-c2/20' },
    ],
  },
  {
    href: '#domain2',
    label: 'D2 · Resilient',
    colorClass: 'text-c2',
    items: [
      { href: '#d2-ha',      label: '⚡ HA',       className: 'text-c2 border-c2/20' },
      { href: '#d2-dr',      label: '🔄 DR',       className: 'text-c5 border-c5/20' },
      { href: '#d2-backup',  label: '🗂️ Backup',  className: 'text-c4 border-c4/20' },
      { href: '#d2-migrate', label: '🚚 Migrate',  className: 'text-c2 border-c2/20' },
    ],
  },
  {
    href: '#domain3',
    label: 'D3 · High-Performing',
    colorClass: 'text-c1',
    items: [
      { href: '#d3-compute',    label: '🖥️ Compute',    className: 'text-c1 border-c1/20' },
      { href: '#d3-storage',    label: '💾 Storage',     className: 'text-c2 border-c2/20' },
      { href: '#d3-network',    label: '🌐 Network',     className: 'text-c4 border-c4/20' },
      { href: '#d3-messaging',  label: '📨 Messaging',   className: 'text-c3 border-c3/20' },
      { href: '#d3-infra',      label: '🏗️ Infra',      className: 'text-c5 border-c5/20' },
      { href: '#d3-db',         label: '🗄️ DB',         className: 'text-c1 border-c1/20' },
      { href: '#d3-analytics',  label: '📊 Analytics',   className: 'text-c3 border-c3/20' },
    ],
  },
  {
    href: '#domain4',
    label: 'D4 · Cost-Optimized',
    colorClass: 'text-c6',
    items: [
      { href: '#d4-pricing',   label: '💰 Pricing',   className: 'text-c6 border-c6/20' },
      { href: '#d4-storage',   label: '💾 Storage',   className: 'text-c2 border-c2/20' },
      { href: '#d4-network',   label: '🌐 Network',   className: 'text-c4 border-c4/20' },
      { href: '#d4-database',  label: '🗄️ Database', className: 'text-c1 border-c1/20' },
      { href: '#d4-dr',        label: '🔄 DR Cost',   className: 'text-c5 border-c5/20' },
    ],
  },
]
