import { writeFileSync } from 'fs'

const escape = (s: string) => s.replace(/'/g, "''")

interface Q {
  id: string
  domain: 'd1' | 'd2' | 'd3' | 'd4'
  domainLabel: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  scenario: string
  options: { id: string; text: string }[]
  correctId: string
  explanation: string
  reference: string
  keywords: string[]
}

const questions: Q[] = [
  {
    id: 'wzs4-001', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A Company has hundreds of REST APIs exposed internally from their on-premises network. They have already established a private network connection to AWS using AWS Direct Connect. The company wants to front those REST APIs with Amazon API Gateway to benefit from its resiliency and cost-reduction features. What is the most suitable and cost-effective solution for integrating API Gateway with the on-premises backend APIs privately?',
    options: [
      { id: 'a', text: 'API Gateway cannot integrate with on-premises backend APIs that are not over the public internet.' },
      { id: 'b', text: 'Build API Gateway using VPC Link and integrate with a Network Load Balancer (NLB) in a private VPC; which then connects to the on-premises network via Direct Connect.' },
      { id: 'c', text: 'Build API Gateway using the existing on-premises public-facing REST APIs as an HTTPS endpoint integration type.' },
      { id: 'd', text: 'Build API Gateway with integration type as AWS Service and select the Direct Connect service.' },
    ],
    correctId: 'b',
    explanation: 'API Gateway VPC Link connects to a Network Load Balancer inside a VPC. Traffic flows: Client → API Gateway → VPC Link → NLB (in VPC) → Direct Connect → on-premises backend. This keeps all traffic private (no public internet), leverages the existing Direct Connect connection, and is the recommended private integration pattern for on-premises backends. Option A is wrong: API Gateway CAN integrate with on-premises backends via VPC Link + Direct Connect. Option C uses public-facing APIs over the internet — not private. Option D is wrong: "AWS Service" integration type is for calling AWS services directly (e.g., SQS, DynamoDB), not for Direct Connect routing.',
    reference: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-private-integration.html',
    keywords: ['API Gateway', 'VPC Link', 'NLB', 'Direct Connect', 'private integration', 'on-premises REST API', 'backend integration'],
  },
  {
    id: 'wzs4-002', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'You have a REST API built using Amazon API Gateway distributed to customers. The API is suddenly receiving a large number of requests, leading to the backend system becoming overloaded, causing performance bottlenecks and subsequent failures for important customers. How would a Solutions Architect improve the overall API performance and protect the backend system? (Select TWO)',
    options: [
      { id: 'a', text: 'Enable throttling and control the steady-state and burst rate of requests per second at the API Gateway level.' },
      { id: 'b', text: 'Create a resource policy to allow access for specific customers during a specific time period.' },
      { id: 'c', text: 'Enable API caching in API Gateway to serve frequently requested data from the cache.' },
      { id: 'd', text: 'Deploy an Application Load Balancer in front of the backend systems.' },
      { id: 'e', text: 'Restrict API access to only unauthenticated users to reduce load.' },
    ],
    correctId: 'a,c',
    explanation: 'Two complementary solutions: (A) API Gateway throttling limits the steady-state request rate and burst rate at the API level — this directly protects the backend from being overwhelmed by rate-limiting incoming requests before they reach the origin. (C) API Gateway caching stores responses at the API layer so repeated identical requests are served from cache without hitting the backend — dramatically reducing backend load for frequently accessed data. Option B (resource policy for time-based access) is an access control mechanism, not a performance/protection solution. Option D (ALB) adds infrastructure but doesn\'t reduce API Gateway-level load. Option E is nonsensical — restricting to unauthenticated users would break the API.',
    reference: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html',
    keywords: ['API Gateway throttling', 'API caching', 'steady-state rate', 'burst rate', 'backend protection', 'reduce load', 'cache responses'],
  },
  {
    id: 'wzs4-003', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Hard',
    scenario: 'Which of the following are NOT considered direct access control mechanisms for an Amazon API Gateway REST API? (Select TWO)',
    options: [
      { id: 'a', text: 'Resource policies.' },
      { id: 'b', text: 'Lambda authorizers.' },
      { id: 'c', text: 'Server-side certificates.' },
      { id: 'd', text: 'VPC RouteTables.' },
      { id: 'e', text: 'Usage Plans.' },
    ],
    correctId: 'c,d',
    explanation: 'Direct access control mechanisms for API Gateway REST APIs are: Resource policies (A — grant/deny API access by IP, VPC, account), Lambda authorizers (B — custom token or request-based authorization), Usage plans + API keys (E — control who can call the API and at what rate). NOT access control mechanisms: (C) Server-side certificates are client certificates that API Gateway generates for you to send to the backend HTTP endpoint — they authenticate API Gateway TO the backend, not the caller to the API. (D) VPC RouteTables are a networking construct that routes traffic between subnets/VPCs — they have no role in API Gateway access control.',
    reference: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html',
    keywords: ['API Gateway access control', 'resource policy', 'Lambda authorizer', 'usage plan', 'server-side certificate', 'VPC RouteTables', 'NOT access control'],
  },
  {
    id: 'wzs4-004', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Easy',
    scenario: 'In Amazon API Gateway, which security measure is provided by default by AWS to protect the backend systems without requiring customer configuration?',
    options: [
      { id: 'a', text: 'Default Cross-Origin Resource Sharing (CORS) configuration.' },
      { id: 'b', text: 'Default Resource Policy.' },
      { id: 'c', text: 'Protection from distributed denial-of-service (DDoS) attacks.' },
      { id: 'd', text: 'Security of backend systems falls entirely under customer responsibility, and AWS provides no default protection.' },
    ],
    correctId: 'c',
    explanation: 'Amazon API Gateway is integrated with AWS Shield Standard, which provides automatic protection against the most common DDoS attacks at no additional cost. This is applied automatically to all API Gateway endpoints without any customer configuration. It protects at the network and transport layer (L3/L4) and provides basic application layer protection. CORS (A) is NOT enabled by default — you must configure CORS per resource/method. Resource Policy (B) is NOT created by default — APIs are accessible without one unless you configure private APIs. Option D is wrong: AWS does provide default DDoS protection.',
    reference: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/security.html',
    keywords: ['API Gateway DDoS protection', 'AWS Shield Standard', 'default security', 'no configuration required', 'L3 L4 protection'],
  },
  {
    id: 'wzs4-005', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A Solutions Architect is configuring API caching for a new stage in an Amazon API Gateway REST API via the AWS Management Console. Which of the following is NOT a configurable cache setting available directly in the API Gateway console?',
    options: [
      { id: 'a', text: 'Cache capacity.' },
      { id: 'b', text: 'Encrypt cache data.' },
      { id: 'c', text: 'Import cache.' },
      { id: 'd', text: 'Flush entire cache.' },
    ],
    correctId: 'c',
    explanation: 'In the API Gateway console under Stage → Cache Settings, the configurable options include: Cache capacity (A — cluster size from 0.5 GB to 237 GB), Encrypt cache data (B — enable at-rest encryption for cached responses), and Flush entire cache (D — invalidate all cached entries immediately). "Import cache" (C) does NOT exist as a concept in API Gateway caching — there is no mechanism to bulk import pre-built cache data into an API Gateway stage cache. The cache is populated organically as requests arrive and responses are cached.',
    reference: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html',
    keywords: ['API Gateway caching', 'cache capacity', 'encrypt cache', 'flush cache', 'cache settings', 'stage settings', 'NOT configurable'],
  },
]

const rows = questions.map((q, i) => {
  const options = escape(JSON.stringify(q.options))
  const expl = escape(JSON.stringify({ correct: q.explanation, incorrects: {} }))
  const keywords = escape(JSON.stringify(q.keywords))
  const reference = q.reference ? `'${escape(q.reference)}'` : 'NULL'
  const pageNumber = i + 1
  const screenshotUrl = `'/questions/wzs4/${escape(q.id)}.png'`
  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source, page_number, screenshot_url) VALUES ('${escape(q.id)}', '${q.domain}', '${escape(q.domainLabel)}', '${q.difficulty}', '${escape(q.scenario)}', '${options}', '${escape(q.correctId)}', '${expl}', ${reference}, '${keywords}', 'core', ${pageNumber}, ${screenshotUrl});`
})

writeFileSync('scripts/wzs4.sql', rows.join('\n'))
console.log(`Generated ${rows.length} INSERT statements → scripts/wzs4.sql`)
