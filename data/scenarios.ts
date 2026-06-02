export type ScenarioTag = string

export type FlowNode = {
  id: string
  label: string
  sublabel?: string
  color: 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'gray'
  optional?: boolean
}

export type AnatomyItem = {
  component: string
  role: string
  notes: string[]
}

export type ExamNuance = {
  trap: string
  correct: string
}

export type Scenario = {
  id: string
  title: string
  subtitle: string
  domain: 'd1' | 'd2' | 'd3' | 'd4' | 'extra'
  tags: ScenarioTag[]
  overview: string
  flow: FlowNode[]
  anatomy: AnatomyItem[]
  nuances: ExamNuance[]
  tips: string[]
  sources: { label: string; url: string }[]
}

export const scenarios: Scenario[] = [
  {
    id: 's3-cloudfront-static',
    title: 'S3 + CloudFront Static Website',
    subtitle: 'Secure global delivery of static content via CDN with private S3 origin',
    domain: 'd3',
    tags: ['S3', 'CloudFront', 'OAC', 'ACM', 'Route 53', 'Static Hosting'],
    overview:
      'Host static assets (HTML, CSS, JS, images) in a private S3 bucket. ' +
      'CloudFront acts as the CDN — caching content at 400+ edge locations globally, ' +
      'enforcing HTTPS, and being the ONLY entry point to the bucket via OAC. ' +
      'S3 Block Public Access stays ON; users never hit S3 directly.',
    flow: [
      { id: 'user',    label: 'User Browser',     sublabel: 'HTTP/HTTPS request',                 color: 'gray' },
      { id: 'r53',     label: 'Route 53',          sublabel: 'ALIAS → CloudFront domain',          color: 'c4',  optional: true },
      { id: 'cf',      label: 'CloudFront',         sublabel: 'Edge PoP · Cache · HTTPS · OAC',    color: 'c1' },
      { id: 'acm',     label: 'ACM Certificate',   sublabel: 'SSL/TLS · must be us-east-1',        color: 'c5',  optional: true },
      { id: 's3',      label: 'S3 Bucket',          sublabel: 'Private · Block Public Access ON',  color: 'c2' },
    ],
    anatomy: [
      {
        component: 'S3 Bucket',
        role: 'Origin — stores all static files',
        notes: [
          'Block Public Access = ON (bucket stays private)',
          'Use S3 REST API endpoint as origin — NOT the S3 website endpoint',
          'Website endpoint → must use Custom Origin + OAC is NOT supported',
          'SSE-KMS encrypted bucket → MUST use CloudFront + OAC (SSE-KMS blocks anonymous access)',
          'Object Ownership must be "Bucket owner enforced" when using OAC',
        ],
      },
      {
        component: 'Origin Access Control (OAC)',
        role: 'Grants CloudFront permission to read from private S3',
        notes: [
          'Replaces legacy OAI (Origin Access Identity) — AWS recommends OAC for all new distributions',
          'OAC adds a signed SigV4 request header so S3 knows the request comes from your CF distribution',
          'Bucket policy: Principal = cloudfront.amazonaws.com + Condition on AWS:SourceArn = your distribution ARN',
          'OAC supports all AWS regions (including opt-in regions after Dec 2022)',
          'OAC supports SSE-KMS encryption — OAI does NOT',
          'OAC supports dynamic requests (PUT, DELETE) — OAI does NOT',
        ],
      },
      {
        component: 'CloudFront Distribution',
        role: 'CDN — caches and serves content globally from 400+ edge PoPs',
        notes: [
          'Viewer Protocol Policy: "Redirect HTTP to HTTPS" (recommended) or "HTTPS Only"',
          'Default TTL: 86,400s (24h) · Min TTL: 0 · Max TTL: 31,536,000s (1 year)',
          'Cache Invalidation: /path or /* to clear cache — first 1,000 paths/month free, then $0.005/path',
          'Geo Restriction: allowlist (only these countries) or blocklist (block these countries)',
          'Signed URLs: restrict access to individual files with expiry time',
          'Signed Cookies: restrict access to multiple files (good for premium/subscription users)',
          'Response headers policy: add security headers (HSTS, X-Frame-Options, CSP, etc.)',
        ],
      },
      {
        component: 'ACM Certificate',
        role: 'Provides SSL/TLS for HTTPS on custom domain',
        notes: [
          'MUST be provisioned in us-east-1 (N. Virginia) — this is a hard requirement for CloudFront',
          'Works with any AWS region for the actual distribution',
          'Supports wildcard certificates (*.example.com)',
          'Free for use with AWS services (no charge for ACM-issued certs)',
        ],
      },
      {
        component: 'Route 53',
        role: 'DNS — routes custom domain to CloudFront',
        notes: [
          'Use ALIAS record (not CNAME) pointing to the CloudFront domain (xxx.cloudfront.net)',
          'ALIAS is free and works at zone apex (e.g., example.com, not just www.example.com)',
          'CNAME cannot be used at zone apex — use ALIAS instead',
        ],
      },
    ],
    nuances: [
      {
        trap: 'Using S3 website endpoint as CloudFront origin and adding OAC',
        correct: 'S3 website endpoint requires Custom Origin — OAC is NOT supported with website endpoints. Only the S3 REST API endpoint (bucket-name.s3.region.amazonaws.com) supports OAC.',
      },
      {
        trap: 'Provisioning the ACM certificate in the same region as the S3 bucket (e.g., ap-southeast-1)',
        correct: 'ACM certificates for CloudFront MUST be in us-east-1 regardless of where your bucket or users are.',
      },
      {
        trap: 'Confusing OAC (origin access) with "Restrict Viewer Access" (signed URLs/cookies)',
        correct: 'OAC restricts who can call S3 directly (only CF can). Signed URLs/cookies restrict who can call CloudFront (only authorised users). They solve different problems.',
      },
      {
        trap: 'Thinking S3 Transfer Acceleration = CloudFront',
        correct: 'S3 Transfer Acceleration speeds up direct uploads TO S3 via edge nodes. CloudFront is for content DELIVERY FROM S3 to users. Different use cases.',
      },
      {
        trap: 'Assuming SSE-S3 encrypted buckets need CloudFront',
        correct: 'SSE-S3 (AES-256) supports anonymous public access. Only SSE-KMS requires CloudFront + OAC because SSE-KMS does not allow unauthenticated requests.',
      },
      {
        trap: 'Using a CNAME record at zone apex (e.g., example.com) in Route 53',
        correct: 'CNAME cannot be used at zone apex. Use Route 53 ALIAS record instead — it maps example.com directly to the CloudFront distribution domain.',
      },
    ],
    tips: [
      'Always say "OAC" not "OAI" in exam answers — AWS deprecated OAI for new distributions',
      'S3 REST endpoint format: bucket-name.s3.region.amazonaws.com (use this as CF origin, not the website endpoint)',
      'If the question mentions SSE-KMS + static website → the answer always involves CloudFront + OAC',
      'CloudFront Functions (not Lambda@Edge) for lightweight tasks: URL rewrites, security headers, A/B testing at viewer level',
      'Lambda@Edge for heavier customisation: auth checks, dynamic origin routing, request body inspection',
      'Cache invalidation is expensive at scale — prefer versioned file names (app.v2.js) over invalidation',
      'geo restriction is per-distribution, not per-path — use Lambda@Edge for path-level geo control',
    ],
    sources: [
      {
        label: 'Hosting a static website using Amazon S3',
        url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html',
      },
      {
        label: 'Restrict access to an Amazon S3 origin — OAC',
        url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html',
      },
      {
        label: 'Get started with a secure static website (CloudFront + S3 + ACM + Route 53)',
        url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/getting-started-secure-static-website-cloudformation-template.html',
      },
      {
        label: 'Serve private content with signed URLs and signed cookies',
        url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html',
      },
      {
        label: 'Ways to use CloudFront — use cases overview',
        url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/IntroductionUseCases.html',
      },
    ],
  },
]

export const domainLabel: Record<Scenario['domain'], string> = {
  d1: 'D1 · Secure',
  d2: 'D2 · Resilient',
  d3: 'D3 · High-Perf',
  d4: 'D4 · Cost-Opt',
  extra: 'Extra',
}

export const domainColor: Record<Scenario['domain'], string> = {
  d1: 'text-c3 border-c3/30 bg-c3/8',
  d2: 'text-c2 border-c2/30 bg-c2/8',
  d3: 'text-c1 border-c1/30 bg-c1/8',
  d4: 'text-c6 border-c6/30 bg-c6/8',
  extra: 'text-c5 border-c5/30 bg-c5/8',
}

export const nodeColorMap: Record<FlowNode['color'], { border: string; text: string; bg: string; dot: string }> = {
  c1:   { border: 'border-c1/40',   text: 'text-c1',        bg: 'bg-c1/8',   dot: 'bg-c1' },
  c2:   { border: 'border-c2/40',   text: 'text-c2',        bg: 'bg-c2/8',   dot: 'bg-c2' },
  c3:   { border: 'border-c3/40',   text: 'text-c3',        bg: 'bg-c3/8',   dot: 'bg-c3' },
  c4:   { border: 'border-c4/40',   text: 'text-c4',        bg: 'bg-c4/8',   dot: 'bg-c4' },
  c5:   { border: 'border-c5/40',   text: 'text-c5',        bg: 'bg-c5/8',   dot: 'bg-c5' },
  c6:   { border: 'border-c6/40',   text: 'text-c6',        bg: 'bg-c6/8',   dot: 'bg-c6' },
  gray: { border: 'border-aws-border', text: 'text-aws-muted', bg: 'bg-white/4', dot: 'bg-aws-muted' },
}
