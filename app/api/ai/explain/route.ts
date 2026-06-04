import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

interface ExplainRequest {
  questionId: string
  question: string
  userAnswerId: string
  userAnswerText: string
  correctAnswerId: string
  correctAnswerText: string
  domainLabel: string
  keywords: string[]
}

interface ExplainResponse {
  explanation: string
  notesUrl: string
  awsDocsUrl: string
}

interface ErrorResponse {
  error: string
}

const NOTES_BASE = 'https://aws.amrhnshh.com'

const NOTES_SLUGS: Record<string, string> = {
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

const AWS_DOCS_MAP: Record<string, string> = {
  s3: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html',
  's3 transfer acceleration': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html',
  glacier: 'https://docs.aws.amazon.com/amazonglacier/latest/dev/introduction.html',
  ebs: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html',
  efs: 'https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html',
  ec2: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html',
  lambda: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html',
  'auto scaling': 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html',
  vpc: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html',
  'route 53': 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html',
  cloudfront: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html',
  'direct connect': 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html',
  rds: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html',
  aurora: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html',
  dynamodb: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html',
  elasticache: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html',
  iam: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html',
  kms: 'https://docs.aws.amazon.com/kms/latest/developerguide/overview.html',
  cloudwatch: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html',
  cloudtrail: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html',
  sqs: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html',
  sns: 'https://docs.aws.amazon.com/sns/latest/dg/welcome.html',
  elb: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html',
  'application load balancer': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html',
  'network load balancer': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html',
  waf: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html',
  shield: 'https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html',
}

function findNotesUrl(keywords: string[]): string {
  const lower = keywords.map((k) => k.toLowerCase())
  for (const kw of lower) {
    for (const [key, slug] of Object.entries(NOTES_SLUGS)) {
      if (kw.includes(key) || key.includes(kw)) return NOTES_BASE + slug
    }
  }
  return NOTES_BASE
}

function findAwsDocsUrl(keywords: string[]): string {
  const lower = keywords.map((k) => k.toLowerCase())
  for (const kw of lower) {
    for (const [key, url] of Object.entries(AWS_DOCS_MAP)) {
      if (kw.includes(key) || key.includes(kw)) return url
    }
  }
  return 'https://docs.aws.amazon.com'
}

function buildPrompt(body: ExplainRequest, notesUrl: string, awsDocsUrl: string): string {
  return `Question domain: ${body.domainLabel}
Keywords: ${body.keywords.join(', ')}

Question: ${body.question}

The user selected: (${body.userAnswerId.toUpperCase()}) ${body.userAnswerText}
Correct answer: (${body.correctAnswerId.toUpperCase()}) ${body.correctAnswerText}

Study notes URL: ${notesUrl}
Official AWS docs URL: ${awsDocsUrl}

Explain why the correct answer is right (2-3 sentences) and briefly why the user's choice was wrong if they were incorrect (1-2 sentences). Be specific to AWS. End with: "Read more at ${notesUrl}".`
}

const SYSTEM_PROMPT =
  'You are an AWS Solutions Architect study assistant. Give concise, accurate explanations. Always reference the official AWS documentation URL provided to you at the end of your response.'

function classifyAnthropicError(status: number): string {
  if (status === 401) return 'Your API key was rejected. Check it is active at console.anthropic.com.'
  if (status === 429) return 'You have hit your API rate limit. Wait a moment and try again.'
  if (status === 408 || status === 524) return 'AI explanation timed out. Try again.'
  return 'AI explanation failed. Try again.'
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = request.headers.get('x-api-key') ?? ''

  if (!apiKey.startsWith('sk-ant-')) {
    const body: ErrorResponse = { error: "That doesn't look like a valid Anthropic key." }
    return Response.json(body, { status: 400 })
  }

  let parsed: ExplainRequest
  try {
    parsed = (await request.json()) as ExplainRequest
  } catch {
    return Response.json({ error: 'Invalid request body.' } satisfies ErrorResponse, { status: 400 })
  }

  const notesUrl = findNotesUrl(parsed.keywords)
  const awsDocsUrl = findAwsDocsUrl(parsed.keywords)
  const userPrompt = buildPrompt(parsed, notesUrl, awsDocsUrl)

  let gatewayBase = 'https://api.anthropic.com'
  try {
    const { env } = getRequestContext()
    const cfEnv = env as CloudflareEnv
    if (cfEnv.AI_GATEWAY_BASE_URL) gatewayBase = cfEnv.AI_GATEWAY_BASE_URL
  } catch {
    // running outside Cloudflare (local dev) — use direct Anthropic
  }

  const anthropicUrl = gatewayBase === 'https://api.anthropic.com'
    ? 'https://api.anthropic.com/v1/messages'
    : `${gatewayBase}/v1/messages`

  let anthropicRes: Response
  try {
    anthropicRes = await fetch(anthropicUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })
  } catch {
    return Response.json({ error: 'AI explanation timed out. Try again.' } satisfies ErrorResponse, { status: 503 })
  }

  if (!anthropicRes.ok) {
    const errMsg = classifyAnthropicError(anthropicRes.status)
    return Response.json({ error: errMsg } satisfies ErrorResponse, { status: anthropicRes.status })
  }

  interface AnthropicMessage {
    content: Array<{ type: string; text: string }>
  }

  const data = (await anthropicRes.json()) as AnthropicMessage
  const explanation = data.content.find((c) => c.type === 'text')?.text ?? 'No explanation returned.'

  const result: ExplainResponse = { explanation, notesUrl, awsDocsUrl }
  return Response.json(result)
}
