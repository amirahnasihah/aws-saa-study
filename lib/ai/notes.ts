// Study notes live on the in-app /learn guide. Each domain section there has an
// `id` anchor (see app/learn/page.tsx), so we deep-link straight to the relevant
// topic. Keeping these in-app means every cited link resolves within this
// deployment — no external site that can 404.
export const NOTES_BASE = '/learn'

export const NOTES_SLUGS: Record<string, string> = {
  storage: '#d3-storage',
  s3: '#d3-storage',
  ebs: '#d3-storage',
  efs: '#d3-storage',
  glacier: '#d3-storage',
  compute: '#d3-compute',
  ec2: '#d3-compute',
  lambda: '#d3-compute',
  'auto scaling': '#d3-compute',
  networking: '#d3-network',
  vpc: '#d3-network',
  'route 53': '#d3-network',
  cloudfront: '#d3-network',
  'direct connect': '#d3-network',
  database: '#d3-db',
  rds: '#d3-db',
  dynamodb: '#d3-db',
  aurora: '#d3-db',
  elasticache: '#d3-db',
  security: '#d1-netsec',
  iam: '#d1-iam',
  kms: '#d1-data',
  waf: '#d1-netsec',
  shield: '#d1-netsec',
  // No dedicated observability section in /learn — fall back to the guide root.
  monitoring: '',
  cloudwatch: '',
  cloudtrail: '',
}

export function findNotesUrl(keywords: string[]): string {
  const lower = keywords.map((k) => k.toLowerCase())
  for (const kw of lower) {
    for (const [key, slug] of Object.entries(NOTES_SLUGS)) {
      if (kw.includes(key) || key.includes(kw)) return NOTES_BASE + slug
    }
  }
  return NOTES_BASE
}
