export const NOTES_BASE = 'https://aws.amrhnshh.com'

export const NOTES_SLUGS: Record<string, string> = {
  storage: '/storage',
  s3: '/storage',
  ebs: '/storage',
  efs: '/storage',
  glacier: '/storage',
  compute: '/compute',
  ec2: '/compute',
  lambda: '/compute',
  'auto scaling': '/compute',
  networking: '/networking',
  vpc: '/networking',
  'route 53': '/networking',
  cloudfront: '/networking',
  'direct connect': '/networking',
  database: '/database',
  rds: '/database',
  dynamodb: '/database',
  aurora: '/database',
  elasticache: '/database',
  security: '/security',
  iam: '/security',
  kms: '/security',
  waf: '/security',
  shield: '/security',
  monitoring: '/monitoring',
  cloudwatch: '/monitoring',
  cloudtrail: '/monitoring',
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
