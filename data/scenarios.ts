export type ScenarioTag = string

export type NodeColor = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'gray'

// A single box in a flow diagram.
export type FlowNode = {
  label: string
  sublabel?: string
  color: NodeColor
  optional?: boolean
}

// A column in the flow. One node = a single box; multiple nodes = stacked /
// parallel boxes at that position (fan-out, branching, HA pairs).
export type FlowStep = {
  nodes: FlowNode[]
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

// Side-by-side comparison rendered as a real table (shared shape with the
// Deep Notes CompareTable so the visual language stays identical site-wide).
// headers[0] labels the attribute column; the rest are the things compared.
// Each row is [attribute, ...valuesPerColumn] — keep row length === headers length.
export type CompareTable = {
  label?: string
  headers: string[]
  rows: string[][]
  takeaway?: string
}

export type Scenario = {
  id: string
  title: string
  subtitle: string
  domain: 'd1' | 'd2' | 'd3' | 'd4' | 'extra'
  tags: ScenarioTag[]
  overview: string
  flow: FlowStep[]
  anatomy: AnatomyItem[]
  compare?: CompareTable[]
  nuances: ExamNuance[]
  tips: string[]
  // "Cara mudah ingat" — punchy memory hooks / mnemonics for the exam.
  mnemonic?: string[]
  sources: { label: string; url: string }[]
}

export const scenarios: Scenario[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // D3 · S3 + CloudFront static website
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 's3-cloudfront-static',
    title: 'S3 + CloudFront Static Website',
    subtitle: 'Secure global delivery of static content via CDN with a private S3 origin',
    domain: 'd3',
    tags: ['S3', 'CloudFront', 'OAC', 'ACM', 'Route 53', 'Static Hosting'],
    overview:
      'Host static assets (HTML, CSS, JS, images) in a private S3 bucket. ' +
      'CloudFront acts as the CDN — caching content at 400+ edge locations globally, ' +
      'enforcing HTTPS, and being the ONLY entry point to the bucket via OAC. ' +
      'S3 Block Public Access stays ON; users never hit S3 directly.',
    flow: [
      { nodes: [{ label: 'User Browser', sublabel: 'HTTP/HTTPS request', color: 'gray' }] },
      { nodes: [{ label: 'Route 53', sublabel: 'ALIAS → CloudFront', color: 'c4', optional: true }] },
      { nodes: [{ label: 'CloudFront', sublabel: 'Edge PoP · Cache · HTTPS · OAC', color: 'c1' }] },
      { nodes: [{ label: 'ACM Cert', sublabel: 'TLS · must be us-east-1', color: 'c5', optional: true }] },
      { nodes: [{ label: 'S3 Bucket', sublabel: 'Private · Block Public Access ON', color: 'c2' }] },
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
    compare: [
      {
        label: 'OAC vs OAI vs Signed URL — who is being restricted?',
        headers: ['Aspect', 'OAC / OAI', 'Signed URL / Cookie'],
        rows: [
          ['Restricts', 'Access to S3 (only CloudFront can read)', 'Access to CloudFront (only authorised viewers)'],
          ['Direction', 'CloudFront → S3 (origin side)', 'Viewer → CloudFront (viewer side)'],
          ['Use case', 'Lock down the bucket', 'Paywall / time-limited / private content'],
          ['SSE-KMS', 'OAC: yes · OAI: no', 'N/A'],
        ],
        takeaway: 'OAC = lock the origin. Signed URL/cookie = lock the viewer. Different problems.',
      },
      {
        label: 'CloudFront Functions vs Lambda@Edge',
        headers: ['Aspect', 'CloudFront Functions', 'Lambda@Edge'],
        rows: [
          ['Runtime', 'JavaScript (lightweight)', 'Node.js / Python'],
          ['Where', 'Viewer request/response only', 'All 4 trigger points (viewer + origin)'],
          ['Latency', 'Sub-millisecond', 'Single-digit ms'],
          ['Use', 'URL rewrite, header manipulation, A/B', 'Auth, dynamic origin, body inspection'],
        ],
        takeaway: 'Light + viewer-only = CloudFront Functions. Heavy or origin-side = Lambda@Edge.',
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
    mnemonic: [
      'us-east-1 for CloudFront certs = "CloudFront lives in Virginia" — always.',
      'OAC = "Only Allowed: CloudFront" reads the bucket.',
      'ALIAS for apex, CNAME for sub — apex never takes a CNAME.',
    ],
    sources: [
      { label: 'Hosting a static website using Amazon S3', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html' },
      { label: 'Restrict access to an Amazon S3 origin — OAC', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html' },
      { label: 'Get started with a secure static website', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/getting-started-secure-static-website-cloudformation-template.html' },
      { label: 'Serve private content with signed URLs and cookies', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // D1 · Cross-account access via IAM roles
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cross-account-iam-role',
    title: 'Cross-Account Access with IAM Roles',
    subtitle: 'Let a user/service in Account A act in Account B — without sharing long-term keys',
    domain: 'd1',
    tags: ['IAM', 'STS', 'AssumeRole', 'Cross-Account', 'Trust Policy', 'Federation'],
    overview:
      'You never copy IAM access keys between accounts. Instead, Account B creates an IAM role ' +
      'whose trust policy says "Account A is allowed to assume me." A principal in Account A calls ' +
      'sts:AssumeRole, gets short-lived temporary credentials, and uses them to act in Account B ' +
      'with exactly the permissions attached to that role. Credentials auto-expire (15 min – 12 h).',
    flow: [
      { nodes: [{ label: 'IAM User (Acct A)', sublabel: 'has sts:AssumeRole permission', color: 'c1' }] },
      { nodes: [{ label: 'AWS STS', sublabel: 'AssumeRole call', color: 'c5' }] },
      { nodes: [{ label: 'Role (Acct B)', sublabel: 'trust policy allows Acct A', color: 'c3' }] },
      { nodes: [{ label: 'Temp Credentials', sublabel: 'AccessKey + Secret + Session token', color: 'c4' }] },
      { nodes: [{ label: 'Resource (Acct B)', sublabel: 'S3 / DynamoDB / etc.', color: 'c2' }] },
    ],
    anatomy: [
      {
        component: 'Trust Policy (role in Account B)',
        role: 'WHO is allowed to assume the role',
        notes: [
          'Attached to the role itself (the "trust relationship" tab)',
          'Principal = the trusted account/user/service ARN (e.g., arn:aws:iam::ACCOUNT_A:root)',
          'Action = sts:AssumeRole',
          'Optional ExternalId condition — defeats the "confused deputy" problem for 3rd-party access',
          'For services (EC2, Lambda) the Principal is a service, e.g., ec2.amazonaws.com',
        ],
      },
      {
        component: 'Permissions Policy (role in Account B)',
        role: 'WHAT the role can do once assumed',
        notes: [
          'Standard IAM policy attached to the role',
          'Defines actions on resources in Account B (s3:GetObject, dynamodb:Query, etc.)',
          'The assumer can never exceed these permissions, regardless of their home-account power',
        ],
      },
      {
        component: 'Identity Policy (user in Account A)',
        role: 'Allows the user to CALL AssumeRole',
        notes: [
          'The Account A user needs an explicit Allow on sts:AssumeRole for the target role ARN',
          'Without this, the AssumeRole call is denied even if the trust policy allows it',
          'Both sides must agree — trust policy (B) AND identity policy (A)',
        ],
      },
      {
        component: 'AWS STS',
        role: 'Issues the temporary security credentials',
        notes: [
          'Returns AccessKeyId + SecretAccessKey + SessionToken (all three required)',
          'Duration: 15 minutes to 12 hours (DurationSeconds), default 1 hour',
          'Role chaining caps the session at 1 hour max',
          'Regional STS endpoints reduce latency vs the global endpoint',
        ],
      },
    ],
    compare: [
      {
        label: 'IAM identity-based vs resource-based vs role',
        headers: ['Type', 'Attached to', 'Cross-account?', 'Example'],
        rows: [
          ['Identity-based', 'User / group / role', 'Only via AssumeRole', 'Allow s3:* to this user'],
          ['Resource-based', 'The resource (S3 bucket, SQS, KMS)', 'Yes — names external principal directly', 'Bucket policy allows Acct B'],
          ['IAM role', 'Assumed temporarily via STS', 'Yes — the standard pattern', 'Cross-account, EC2, federation'],
        ],
        takeaway: 'Cross-account = IAM role (AssumeRole) OR resource-based policy. Never copy access keys.',
      },
    ],
    nuances: [
      {
        trap: 'Creating an IAM user in Account B and sharing its access keys with Account A',
        correct: 'Long-term keys should never cross account boundaries. Use a role + sts:AssumeRole so credentials are temporary and auto-expiring.',
      },
      {
        trap: 'Setting only the trust policy and expecting access to work',
        correct: 'Both sides are required: the trust policy in B must allow A, AND the principal in A must have an identity policy allowing sts:AssumeRole on that role.',
      },
      {
        trap: 'Forgetting ExternalId for third-party (vendor) access',
        correct: 'When a third party assumes your role, add an ExternalId condition. It prevents the confused-deputy attack where the vendor is tricked into acting against your account.',
      },
      {
        trap: 'Thinking resource-based policies always need a role',
        correct: 'S3 bucket policies, SQS, SNS, KMS key policies, and Lambda resource policies can grant access to an external account principal directly — no AssumeRole needed for those services.',
      },
    ],
    tips: [
      'Mantra: "Trust policy = WHO can assume · Permissions policy = WHAT they can do."',
      'EC2 needs AWS access → attach an instance profile (a role), never bake keys into the AMI/user-data',
      'Temporary creds always have 3 parts — if you only see 2 (key + secret), it is a long-term user key',
      'ExternalId = the secret handshake for third-party/vendor cross-account roles',
      'Use IAM Identity Center (SSO) + permission sets instead of per-account IAM users at scale',
    ],
    mnemonic: [
      'Trust = "who knocks", Permissions = "what they touch".',
      'STS creds come in 3s (key/secret/token) — missing the token? it is not temporary.',
      'Vendor access? Add ExternalId or fear the Confused Deputy.',
    ],
    sources: [
      { label: 'IAM tutorial: cross-account access using roles', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html' },
      { label: 'How IAM roles differ from resource-based policies', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_compare-resource-policies.html' },
      { label: 'The confused deputy problem (ExternalId)', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // D1 · 3-tier VPC with SG + NACL
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'three-tier-vpc-security',
    title: '3-Tier VPC — Security Groups & NACLs',
    subtitle: 'Public/private subnet layering with stateful SGs and stateless NACLs',
    domain: 'd1',
    tags: ['VPC', 'Subnets', 'Security Group', 'NACL', 'NAT Gateway', 'IGW'],
    overview:
      'The classic web architecture: an Internet-facing tier (ALB) in public subnets, an app tier ' +
      'in private subnets, and a DB tier in isolated private subnets. Security Groups (stateful, ' +
      'instance-level) and Network ACLs (stateless, subnet-level) layer defence in depth. Private ' +
      'instances reach the internet for patches via a NAT Gateway, but the internet cannot reach them.',
    flow: [
      { nodes: [{ label: 'Internet', sublabel: 'users', color: 'gray' }] },
      { nodes: [{ label: 'IGW', sublabel: 'VPC internet door', color: 'c4' }] },
      {
        nodes: [
          { label: 'Public Subnet', sublabel: 'ALB + NAT Gateway', color: 'c1' },
        ],
      },
      {
        nodes: [
          { label: 'Private App Subnet', sublabel: 'EC2 / ASG', color: 'c3' },
        ],
      },
      {
        nodes: [
          { label: 'Private DB Subnet', sublabel: 'RDS Multi-AZ (isolated)', color: 'c2' },
        ],
      },
    ],
    anatomy: [
      {
        component: 'Public Subnet',
        role: 'Has a route to the Internet Gateway',
        notes: [
          'Definition of "public" = route table has 0.0.0.0/0 → IGW',
          'Holds internet-facing resources: ALB, NAT Gateway, bastion host',
          'Resources need a public IP / Elastic IP to be reachable',
        ],
      },
      {
        component: 'Private Subnet',
        role: 'No direct route to the IGW',
        notes: [
          'Outbound internet (patches, API calls) goes via NAT Gateway in a public subnet',
          'NAT Gateway is one-way: outbound only — the internet cannot initiate inbound',
          'DB subnet is often fully isolated: no NAT, only reachable from the app tier SG',
        ],
      },
      {
        component: 'Security Group (stateful)',
        role: 'Instance/ENI-level firewall — allow rules only',
        notes: [
          'Stateful: if inbound is allowed, the response is auto-allowed (no return rule needed)',
          'Allow rules ONLY — you cannot write an explicit deny',
          'Can reference ANOTHER security group as the source (e.g., DB SG allows App SG) — chaining tiers',
          'Evaluated as a whole: all rules across all attached SGs are unioned',
        ],
      },
      {
        component: 'Network ACL (stateless)',
        role: 'Subnet-level firewall — allow AND deny, ordered',
        notes: [
          'Stateless: you must allow BOTH inbound and the ephemeral-port return traffic (1024–65535)',
          'Rules are numbered and evaluated lowest-first; first match wins',
          'Supports explicit DENY — use it to block a specific malicious IP/CIDR',
          'Default NACL allows all; custom NACL denies all until you add rules',
        ],
      },
      {
        component: 'NAT Gateway',
        role: 'Managed outbound internet for private subnets',
        notes: [
          'AZ-scoped — deploy one per AZ for high availability',
          'Managed, auto-scaling, no admin (vs NAT instance which you manage)',
          'Charged per hour + per GB processed',
          'For IPv6, use an egress-only internet gateway instead',
        ],
      },
    ],
    compare: [
      {
        label: 'Security Group vs Network ACL',
        headers: ['Aspect', 'Security Group', 'Network ACL'],
        rows: [
          ['Level', 'Instance / ENI', 'Subnet'],
          ['State', 'Stateful (return auto-allowed)', 'Stateless (must allow return + ephemeral)'],
          ['Rules', 'Allow only', 'Allow AND deny'],
          ['Evaluation', 'All rules, unioned', 'Numbered, first match wins'],
          ['Source', 'Can reference another SG', 'CIDR ranges only'],
          ['Default', 'Denies all inbound', 'Allows all (default NACL)'],
        ],
        takeaway: 'SG = stateful instance bouncer (allow-list). NACL = stateless subnet gate (allow + deny, ordered). Block one bad IP → NACL.',
      },
      {
        label: 'NAT Gateway vs NAT Instance',
        headers: ['Aspect', 'NAT Gateway', 'NAT Instance'],
        rows: [
          ['Management', 'Fully managed by AWS', 'You manage the EC2 instance'],
          ['Availability', 'AZ-resilient (auto)', 'You build HA yourself'],
          ['Bandwidth', 'Up to 100 Gbps, auto-scales', 'Depends on instance size'],
          ['Security groups', 'Cannot attach', 'Can attach SG'],
          ['Bastion / port-forward', 'No', 'Yes (can double as bastion)'],
        ],
        takeaway: 'Default to NAT Gateway. Choose NAT instance only if you need SG control or a cheap combined bastion.',
      },
    ],
    nuances: [
      {
        trap: 'A request reaches the instance but the response is dropped — blaming the Security Group',
        correct: 'SGs are stateful, so the return is automatically allowed. A one-way drop is almost always a NACL missing the ephemeral-port (1024–65535) return rule.',
      },
      {
        trap: 'Trying to block a single malicious IP with a Security Group',
        correct: 'SGs cannot deny. Use a NACL deny rule (lower rule number than any allow) to block a specific IP/CIDR.',
      },
      {
        trap: 'Putting RDS in a public subnet so the app can reach it',
        correct: 'Keep the DB in a private subnet. The app tier reaches it via SG referencing (DB SG allows the App SG on port 3306) — no public exposure needed.',
      },
      {
        trap: 'Deploying one NAT Gateway and assuming it is highly available',
        correct: 'A NAT Gateway lives in one AZ. If that AZ fails, private instances in other AZs lose internet. Deploy one NAT Gateway per AZ for HA.',
      },
    ],
    tips: [
      '"Public subnet" is defined purely by a route to the IGW — nothing else',
      'SG can reference another SG as source → this is how you chain ALB→App→DB cleanly',
      'Stateless NACL = always think about the RETURN traffic on ephemeral ports',
      'Lowest rule number wins in a NACL — put your DENY rules before the broad ALLOW',
      'NAT Gateway per AZ for HA; egress-only IGW for IPv6 outbound',
    ],
    mnemonic: [
      'SG = "Stateful Guard, allow-list" · NACL = "Numbered, Allow+deny, Check return".',
      'One-way traffic dropped → suspect the stateless NACL ephemeral ports.',
      'Block ONE bad IP → only the NACL can deny.',
    ],
    sources: [
      { label: 'Compare security groups and network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html' },
      { label: 'Security groups for your VPC', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html' },
      { label: 'Network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html' },
      { label: 'NAT gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // D2 · RDS Multi-AZ + Read Replicas
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'rds-multiaz-read-replica',
    title: 'RDS Multi-AZ + Read Replicas',
    subtitle: 'High availability (Multi-AZ) vs read scaling (Read Replicas) — and using both',
    domain: 'd2',
    tags: ['RDS', 'Multi-AZ', 'Read Replica', 'Failover', 'HA', 'RTO/RPO'],
    overview:
      'These two features solve DIFFERENT problems and are commonly combined. Multi-AZ keeps a ' +
      'synchronous standby in another AZ for automatic failover (availability). Read Replicas are ' +
      'asynchronous copies that offload read traffic (performance) and can be cross-region for DR. ' +
      'Apps talk to the primary via a DNS endpoint; on failover, that endpoint is repointed automatically.',
    flow: [
      { nodes: [{ label: 'App', sublabel: 'writes + reads', color: 'gray' }] },
      { nodes: [{ label: 'RDS Primary', sublabel: 'AZ-a · writes', color: 'c1' }] },
      {
        nodes: [
          { label: 'Standby (Multi-AZ)', sublabel: 'AZ-b · SYNC · failover only', color: 'c2' },
          { label: 'Read Replica', sublabel: 'ASYNC · serves reads', color: 'c3' },
        ],
      },
    ],
    anatomy: [
      {
        component: 'Multi-AZ Standby',
        role: 'Hot standby for automatic failover (availability)',
        notes: [
          'Synchronous replication — zero data loss target (RPO ≈ 0)',
          'Standby is NOT readable and serves NO traffic (it just waits)',
          'Automatic failover on AZ outage, instance failure, or maintenance — typically 60–120s',
          'Same region only; failover repoints the DNS CNAME to the standby',
          'Multi-AZ DB cluster (newer) DOES allow readable standbys — but classic Multi-AZ does not',
        ],
      },
      {
        component: 'Read Replica',
        role: 'Asynchronous read-only copy (performance / scaling)',
        notes: [
          'Asynchronous replication — small replication lag, possible eventual consistency',
          'Readable — point read traffic at it via its own endpoint',
          'Up to 15 read replicas (5 for RDS engines; Aurora supports 15)',
          'Can be in the SAME or a DIFFERENT region (cross-region = DR + local reads)',
          'Can be manually promoted to a standalone primary (DR / migration)',
        ],
      },
      {
        component: 'Backups (RTO/RPO)',
        role: 'Recovery point and time objectives',
        notes: [
          'Automated backups: daily snapshot + transaction logs → point-in-time restore (PITR)',
          'Manual snapshots: kept until you delete them (automated ones expire by retention 0–35 days)',
          'RPO = how much data you can lose (gap since last recoverable point)',
          'RTO = how long recovery takes (downtime before service is restored)',
        ],
      },
    ],
    compare: [
      {
        label: 'Multi-AZ vs Read Replica',
        headers: ['Aspect', 'Multi-AZ', 'Read Replica'],
        rows: [
          ['Purpose', 'Availability / failover', 'Read scaling / performance'],
          ['Replication', 'Synchronous', 'Asynchronous'],
          ['Readable?', 'No (classic) — standby idle', 'Yes — serves reads'],
          ['Failover', 'Automatic', 'Manual promotion'],
          ['Region', 'Same region', 'Same OR cross-region'],
          ['Data loss', 'RPO ≈ 0', 'Small lag possible'],
        ],
        takeaway: 'Multi-AZ = stay UP (sync, auto-failover). Read Replica = go FAST (async, scale reads). Need both? Use both.',
      },
      {
        label: 'RTO vs RPO',
        headers: ['Term', 'Meaning', 'Lever'],
        rows: [
          ['RTO', 'How long to recover (downtime)', 'Multi-AZ, warm standby, automation'],
          ['RPO', 'How much data you can lose', 'Backup frequency, sync replication'],
        ],
        takeaway: 'RPO = the PAST (last good data point). RTO = the future (time to be back). Lower both = higher cost.',
      },
    ],
    nuances: [
      {
        trap: 'Using a (classic) Multi-AZ standby to offload read queries',
        correct: 'The classic Multi-AZ standby is NOT readable — it only exists for failover. Use Read Replicas to scale reads. (The newer Multi-AZ DB cluster does add readable standbys.)',
      },
      {
        trap: 'Choosing Read Replicas for high availability',
        correct: 'Read Replicas are asynchronous and need MANUAL promotion — that is read scaling/DR, not automatic HA. Multi-AZ gives automatic failover.',
      },
      {
        trap: 'Assuming Multi-AZ protects against a region failure',
        correct: 'Multi-AZ is single-region (across AZs). For region-level DR use a cross-region read replica or cross-region snapshots/Aurora Global.',
      },
      {
        trap: 'Expecting Read Replica reads to always be up to date',
        correct: 'Replication is asynchronous, so replicas can lag. Use them for reads that tolerate eventual consistency; send strongly-consistent reads to the primary.',
      },
    ],
    tips: [
      'One-liner: "Multi-AZ = up · Read Replica = fast."',
      'Cross-region Read Replica = both DR and serving local reads in another region',
      'Promote a Read Replica to break replication and create a new standalone DB (migrations/DR)',
      'Aurora differs: 6 copies across 3 AZs, up to 15 low-lag replicas, Aurora Global <1s cross-region',
      'RPO = data loss tolerance (past) · RTO = downtime tolerance (recovery time)',
    ],
    mnemonic: [
      'Multi-AZ = "Always available" (sync, auto). Read Replica = "Reads, Rapid" (async, manual).',
      'Standby SLEEPS until failover — it never serves reads (classic).',
      'RPO = Point (in the past you recover to) · RTO = Time (to get back up).',
    ],
    sources: [
      { label: 'Multi-AZ deployments for high availability', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html' },
      { label: 'Working with read replicas', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html' },
      { label: 'Backing up and restoring (PITR)', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_CommonTasks.BackupRestore.html' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // D2 · Highly available web tier (ALB + ASG)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ha-web-tier-alb-asg',
    title: 'Highly Available Web Tier (ALB + Auto Scaling)',
    subtitle: 'Multi-AZ elastic fleet behind an Application Load Balancer',
    domain: 'd2',
    tags: ['ALB', 'Auto Scaling', 'Multi-AZ', 'Target Group', 'Health Check', 'Elasticity'],
    overview:
      'The canonical resilient + elastic web tier. An ALB spreads traffic across an Auto Scaling Group ' +
      'of EC2 instances in multiple AZs. Health checks remove unhealthy instances; scaling policies add ' +
      'or remove capacity with demand. If an AZ fails, the ASG launches replacements in healthy AZs and ' +
      'the ALB stops routing to the dead one — no manual intervention.',
    flow: [
      { nodes: [{ label: 'Users', sublabel: 'HTTPS', color: 'gray' }] },
      { nodes: [{ label: 'Route 53', sublabel: 'ALIAS → ALB', color: 'c4', optional: true }] },
      { nodes: [{ label: 'ALB', sublabel: 'L7 · multi-AZ · health checks', color: 'c1' }] },
      {
        nodes: [
          { label: 'EC2 (AZ-a)', sublabel: 'ASG target', color: 'c3' },
          { label: 'EC2 (AZ-b)', sublabel: 'ASG target', color: 'c3' },
        ],
      },
    ],
    anatomy: [
      {
        component: 'Application Load Balancer',
        role: 'Layer-7 traffic distribution + health checking',
        notes: [
          'Routes on HTTP/HTTPS — path-based (/api/*), host-based, header/query routing',
          'Must span ≥2 AZs (subnets in different AZs) for HA',
          'Health checks mark targets healthy/unhealthy; unhealthy targets get no traffic',
          'Terminates TLS (ACM cert) and can authenticate via Cognito/OIDC',
          'Use NLB instead for ultra-low latency, static IP, or TCP/UDP',
        ],
      },
      {
        component: 'Auto Scaling Group',
        role: 'Maintains and scales the EC2 fleet across AZs',
        notes: [
          'Min / Desired / Max capacity define the bounds',
          'Spreads instances across the AZs you specify (AZ-balanced)',
          'Replaces failed/unhealthy instances automatically (self-healing)',
          'Dynamic scaling: Target Tracking (keep CPU at 50%), Step, Simple, Scheduled',
          'Predictive scaling pre-warms capacity using ML on historical patterns',
        ],
      },
      {
        component: 'Launch Template',
        role: 'The blueprint for new instances',
        notes: [
          'Defines AMI, instance type, key pair, SGs, user-data, IAM instance profile',
          'Versioned — preferred over the legacy launch configuration',
          'Supports mixed instances + Spot/On-Demand blends for cost',
        ],
      },
      {
        component: 'Health Checks',
        role: 'Decide which instances receive traffic / get replaced',
        notes: [
          'EC2 status checks = is the instance alive (default ASG check)',
          'ELB health checks = is the app responding (enable on the ASG to catch app-level failures)',
          'Cooldown / warm-up prevents thrash during scaling events',
        ],
      },
    ],
    compare: [
      {
        label: 'ALB vs NLB vs GWLB',
        headers: ['Aspect', 'ALB', 'NLB', 'GWLB'],
        rows: [
          ['Layer', 'L7 (HTTP/S)', 'L4 (TCP/UDP/TLS)', 'L3/4 (appliances)'],
          ['Routing', 'Path/host/header', 'Connection-based', 'To firewall/IDS fleet'],
          ['Static IP', 'No (use alias)', 'Yes (1 per AZ) + EIP', 'N/A'],
          ['Latency', 'Higher', 'Ultra-low', 'Pass-through'],
          ['Use', 'Web apps, microservices', 'Extreme perf, gaming, IoT', '3rd-party security appliances'],
        ],
        takeaway: 'HTTP routing → ALB. Millions of req/s + static IP → NLB. Insert firewalls/IDS → GWLB.',
      },
    ],
    nuances: [
      {
        trap: 'Putting the ALB or ASG in a single AZ "to keep it simple"',
        correct: 'HA requires ≥2 AZs. A single-AZ ALB/ASG has no resilience — the whole point is surviving an AZ failure.',
      },
      {
        trap: 'Leaving the ASG on EC2 health checks only',
        correct: 'EC2 checks only confirm the VM is running, not that the app works. Enable ELB health checks on the ASG so a hung app gets replaced.',
      },
      {
        trap: 'Using an NLB when you need path-based routing (/api vs /web)',
        correct: 'NLB is layer 4 and cannot see HTTP paths. Path/host-based routing requires the layer-7 ALB.',
      },
      {
        trap: 'Scaling on instance count instead of a demand metric',
        correct: 'Use Target Tracking on a real signal (CPU, request count per target, or a custom queue-depth metric) so capacity follows actual load.',
      },
    ],
    tips: [
      'HA checklist: ≥2 AZs + ASG (self-heal) + ELB health checks + multi-AZ data tier',
      'Target Tracking is the simplest, most-recommended dynamic scaling policy',
      'Scheduled scaling for predictable spikes (e.g., business hours); predictive for learned patterns',
      'ALB to scale HTTP apps; NLB for static IP / extreme throughput / TCP-UDP',
      'Launch Template > Launch Configuration (versioning, Spot mix, newer features)',
    ],
    mnemonic: [
      'HA = "spread across AZs + let the ASG self-heal."',
      'ALB sees URLs (L7), NLB sees connections (L4).',
      'Turn on ELB health checks or a frozen app stays "healthy" forever.',
    ],
    sources: [
      { label: 'What is an Application Load Balancer?', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html' },
      { label: 'Auto Scaling groups', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html' },
      { label: 'Health checks for Auto Scaling instances', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/healthcheck.html' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // D2 · Disaster Recovery strategies
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'dr-strategies-spectrum',
    title: 'Disaster Recovery Strategies',
    subtitle: 'Backup & Restore → Pilot Light → Warm Standby → Multi-Site — the cost/RTO trade-off',
    domain: 'd2',
    tags: ['DR', 'RTO', 'RPO', 'Pilot Light', 'Warm Standby', 'Multi-Site', 'Cross-Region'],
    overview:
      'The four AWS DR patterns trade cost against recovery speed. As you move right, RTO/RPO shrink ' +
      'but you pay to keep more infrastructure running in the recovery region. The exam tests matching ' +
      'a stated RTO/RPO + budget to the right pattern. Pick the cheapest pattern that still meets the objective.',
    flow: [
      { nodes: [{ label: 'Backup & Restore', sublabel: 'RTO/RPO: hours · $', color: 'c2' }] },
      { nodes: [{ label: 'Pilot Light', sublabel: '10s of min · $$', color: 'c3' }] },
      { nodes: [{ label: 'Warm Standby', sublabel: 'minutes · $$$', color: 'c5' }] },
      { nodes: [{ label: 'Multi-Site Active/Active', sublabel: 'near-zero · $$$$', color: 'c1' }] },
    ],
    anatomy: [
      {
        component: 'Backup & Restore',
        role: 'Cheapest — restore from backups after disaster',
        notes: [
          'Back up data (snapshots, S3, AWS Backup) cross-region; provision infra only when disaster hits',
          'RTO/RPO measured in hours — you rebuild everything on demand',
          'Lowest ongoing cost: you pay for storage, not running compute',
          'Good for non-critical workloads with relaxed recovery objectives',
        ],
      },
      {
        component: 'Pilot Light',
        role: 'Core (data) always on; app tier off until needed',
        notes: [
          'Critical core (e.g., a replicated database) runs continuously in the DR region',
          'App/web servers are configured but switched OFF — turned on during recovery',
          'RTO in tens of minutes; cheaper than warm standby (minimal compute running)',
          'Like a furnace pilot light: a small flame ready to ignite the full system',
        ],
      },
      {
        component: 'Warm Standby',
        role: 'A scaled-down but RUNNING full stack',
        notes: [
          'A functional copy of the whole stack runs at reduced capacity in the DR region',
          'On failover you scale it up to production size (and shift traffic)',
          'RTO in minutes — faster than pilot light because everything is already live',
          'Higher cost because compute is always running (just small)',
        ],
      },
      {
        component: 'Multi-Site Active/Active',
        role: 'Full production in 2+ regions, serving live traffic',
        notes: [
          'Both regions handle real traffic (Route 53 / Global Accelerator distributes)',
          'Near-zero RTO/RPO — a region loss just removes capacity, no "recovery" step',
          'Most expensive — you run full production twice',
          'Use for mission-critical, zero-downtime systems',
        ],
      },
    ],
    compare: [
      {
        label: 'The DR spectrum at a glance',
        headers: ['Strategy', 'RTO / RPO', 'Cost', 'What is running in DR region'],
        rows: [
          ['Backup & Restore', 'Hours', '$', 'Just backups/snapshots'],
          ['Pilot Light', '10s of minutes', '$$', 'Data replicated; app servers OFF'],
          ['Warm Standby', 'Minutes', '$$$', 'Whole stack running, scaled down'],
          ['Multi-Site', 'Near-zero', '$$$$', 'Full production, serving traffic'],
        ],
        takeaway: 'Move right = faster recovery, higher cost. Pick the cheapest one that still meets the stated RTO/RPO.',
      },
    ],
    nuances: [
      {
        trap: 'Confusing Pilot Light with Warm Standby',
        correct: 'Pilot Light = app servers are OFF (only core data running). Warm Standby = the whole stack is ON but scaled down. Warm standby recovers faster and costs more.',
      },
      {
        trap: 'Choosing Multi-Site when the budget is tight and RTO is "a few hours"',
        correct: 'Multi-site is the most expensive. If hours of RTO are acceptable, Backup & Restore meets the requirement at a fraction of the cost.',
      },
      {
        trap: 'Ignoring RPO and only optimising RTO',
        correct: 'RPO (data loss tolerance) drives replication strategy; RTO (downtime) drives compute readiness. A scenario can constrain both — match both.',
      },
      {
        trap: 'Assuming Multi-AZ counts as disaster recovery',
        correct: 'Multi-AZ protects against AZ failure within one region. DR strategies here are about REGION failure — they replicate cross-region.',
      },
    ],
    tips: [
      'Memorise the order: Backup&Restore → Pilot Light → Warm Standby → Multi-Site (cheap+slow → costly+instant)',
      'Pilot Light = app servers OFF; Warm Standby = app servers ON (small). That single difference is the exam tell.',
      'Lowest cost + relaxed RTO → Backup & Restore. Zero downtime + budget no object → Multi-Site.',
      'Route 53 failover/latency routing + health checks orchestrate the regional cutover',
      'AWS Backup centralises cross-account, cross-region backup policy in one place',
    ],
    mnemonic: [
      'Pilot Light = "spark only" (app OFF) · Warm Standby = "engine idling" (app ON, small).',
      'Left = cheap + slow, Right = pricey + instant. Pick cheapest that meets RTO/RPO.',
      'Multi-AZ = AZ insurance · DR strategies = REGION insurance.',
    ],
    sources: [
      { label: 'Disaster recovery options in the cloud', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html' },
      { label: 'Plan for Disaster Recovery (Well-Architected)', url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // D3 · DynamoDB + DAX
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'dynamodb-dax-caching',
    title: 'DynamoDB + DAX Microsecond Caching',
    subtitle: 'Single-digit-ms NoSQL turned into microseconds for read-heavy workloads',
    domain: 'd3',
    tags: ['DynamoDB', 'DAX', 'GSI', 'LSI', 'On-Demand', 'Streams'],
    overview:
      'DynamoDB is a fully managed key-value/document store with single-digit-millisecond latency at any ' +
      'scale. DAX (DynamoDB Accelerator) is an in-VPC, write-through cache that drops read latency to ' +
      'microseconds for read-heavy or bursty workloads — with no app rewrite (DAX is API-compatible). ' +
      'Indexes (GSI/LSI) enable alternative query patterns; Streams enable event-driven reactions.',
    flow: [
      { nodes: [{ label: 'App (in VPC)', sublabel: 'DynamoDB SDK calls', color: 'gray' }] },
      { nodes: [{ label: 'DAX Cluster', sublabel: 'in-VPC · µs reads · write-through', color: 'c1' }] },
      { nodes: [{ label: 'DynamoDB Table', sublabel: 'ms reads/writes · auto-scale', color: 'c2' }] },
      { nodes: [{ label: 'DynamoDB Streams', sublabel: '→ Lambda triggers', color: 'c4', optional: true }] },
    ],
    anatomy: [
      {
        component: 'DynamoDB Table',
        role: 'The managed NoSQL store',
        notes: [
          'Partition key chooses the partition — design for HIGH cardinality to avoid hot partitions',
          'Capacity: On-Demand (pay-per-request, unpredictable spiky) vs Provisioned (+ auto scaling, steady)',
          'Single-digit-ms latency; eventually-consistent reads by default, strongly-consistent optional',
          'Global Tables = multi-region, multi-active replication',
        ],
      },
      {
        component: 'DAX (DynamoDB Accelerator)',
        role: 'Write-through, in-memory cache for reads',
        notes: [
          'Microsecond latency for cached reads (vs ms for DynamoDB)',
          'API-compatible — point the SDK at the DAX endpoint, no query rewrite',
          'Runs INSIDE your VPC as a cluster (not serverless)',
          'Write-through: writes go through DAX to the table, keeping the cache fresh',
          'Best for read-heavy / bursty. NOT for write-heavy or strongly-consistent reads (those bypass the cache)',
        ],
      },
      {
        component: 'Secondary Indexes (GSI / LSI)',
        role: 'Alternative query patterns',
        notes: [
          'LSI: SAME partition key, different sort key. Created at table creation ONLY. Shares table capacity. 10GB/partition limit.',
          'GSI: DIFFERENT partition + sort key. Create ANYTIME. Has its OWN provisioned capacity. Eventually consistent only.',
          'Most flexible querying → GSI. Strongly consistent on an alt sort key → LSI.',
        ],
      },
      {
        component: 'DynamoDB Streams',
        role: 'Ordered change log for event-driven flows',
        notes: [
          'Captures item-level changes (INSERT/MODIFY/REMOVE) in order, per partition',
          'Triggers Lambda for fan-out, replication, aggregation, notifications',
          'Retained 24 hours',
        ],
      },
    ],
    compare: [
      {
        label: 'DAX vs ElastiCache (for DynamoDB caching)',
        headers: ['Aspect', 'DAX', 'ElastiCache'],
        rows: [
          ['Built for', 'DynamoDB specifically', 'Any data / general cache'],
          ['Integration', 'API-compatible, drop-in', 'App manages cache logic'],
          ['Write pattern', 'Write-through', 'Lazy load or write-through (you choose)'],
          ['Latency', 'Microseconds', 'Microseconds–ms'],
        ],
        takeaway: 'Caching DynamoDB reads with zero code change → DAX. Generic/cross-source caching → ElastiCache.',
      },
      {
        label: 'LSI vs GSI',
        headers: ['Aspect', 'LSI', 'GSI'],
        rows: [
          ['Partition key', 'Same as table', 'Any attribute'],
          ['Sort key', 'Alternate', 'Any attribute'],
          ['When created', 'Table creation ONLY', 'Anytime'],
          ['Capacity', 'Shares table', 'Its own'],
          ['Consistency', 'Strong or eventual', 'Eventual only'],
          ['Size limit', '10 GB per partition key', 'None'],
        ],
        takeaway: 'Same PK + strong reads on alt sort → LSI (decide upfront). New PK/flexibility → GSI (add anytime).',
      },
    ],
    nuances: [
      {
        trap: 'Adding DAX to fix a write-heavy or strongly-consistent workload',
        correct: 'DAX accelerates eventually-consistent READS. Strongly-consistent reads and writes pass through to the table — DAX gives little benefit there.',
      },
      {
        trap: 'Planning to add an LSI after the table is in production',
        correct: 'LSIs can only be created at table creation. If you need a new index later, it must be a GSI.',
      },
      {
        trap: 'Picking On-Demand capacity for a steady, predictable workload to "save money"',
        correct: 'For steady predictable traffic, Provisioned + auto scaling is cheaper. On-Demand shines for spiky/unknown traffic where you would over-provision otherwise.',
      },
      {
        trap: 'Using RDS for a simple high-scale key-value lookup',
        correct: 'Massive-scale key-value / serverless / single-digit-ms requirements point to DynamoDB, not a relational DB.',
      },
    ],
    tips: [
      'DAX = "microseconds, drop-in, read-heavy." If the question says strongly consistent or write-heavy, DAX is a distractor.',
      'LSI = create at birth, shares capacity, 10GB cap. GSI = create anytime, own capacity, no cap.',
      'On-Demand = spiky/unknown · Provisioned+auto-scaling = steady/predictable (cheaper)',
      'Hot partition? Increase partition-key cardinality (add a random/suffix) so writes spread',
      'DynamoDB Streams + Lambda = the serverless event-driven trigger pattern',
    ],
    mnemonic: [
      'DAX = "Dynamo Accelerated (reads), eXternal cache in your VPC."',
      'LSI = "Locked-in at Start, Identical partition" · GSI = "Grow Sometime, Independent."',
      'Spiky traffic → On-Demand · Flat traffic → Provisioned.',
    ],
    sources: [
      { label: 'In-memory acceleration with DAX', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html' },
      { label: 'Improving data access with secondary indexes', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html' },
      { label: 'Read/write capacity mode', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // D3 · Decoupling with SQS / SNS (fan-out + queue-driven scaling)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'sqs-sns-decoupling',
    title: 'Decoupling with SQS, SNS & Fan-out',
    subtitle: 'Buffer spikes with a queue; broadcast events with fan-out; scale workers on backlog',
    domain: 'd3',
    tags: ['SQS', 'SNS', 'Fan-out', 'DLQ', 'Auto Scaling', 'Decoupling'],
    overview:
      'Decoupling makes systems resilient and elastic. SQS is a pull-based queue that buffers work so ' +
      'producers and consumers scale independently — a traffic spike just lengthens the queue instead of ' +
      'crashing the backend. SNS is push-based pub/sub. The fan-out pattern (SNS → multiple SQS queues) ' +
      'lets one event trigger many independent pipelines. An ASG scales workers on queue depth.',
    flow: [
      { nodes: [{ label: 'Producer', sublabel: 'publishes event', color: 'gray' }] },
      { nodes: [{ label: 'SNS Topic', sublabel: 'push · pub/sub fan-out', color: 'c4' }] },
      {
        nodes: [
          { label: 'SQS Queue A', sublabel: 'orders pipeline', color: 'c2' },
          { label: 'SQS Queue B', sublabel: 'analytics pipeline', color: 'c2' },
          { label: 'Lambda', sublabel: 'notify', color: 'c1' },
        ],
      },
      { nodes: [{ label: 'Worker ASG', sublabel: 'scales on queue depth', color: 'c3' }] },
    ],
    anatomy: [
      {
        component: 'SQS Queue',
        role: 'Durable buffer between producers and consumers (pull)',
        notes: [
          'Standard: at-least-once delivery, best-effort ordering, nearly unlimited throughput',
          'FIFO: exactly-once processing, strict ordering, up to 300 msg/s (3,000 with batching)',
          'Visibility timeout: hides a message while one consumer processes it (default 30s)',
          'Long polling (WaitTimeSeconds up to 20s) cuts empty receives and cost',
          'Messages retained up to 14 days',
        ],
      },
      {
        component: 'Dead-Letter Queue (DLQ)',
        role: 'Catches messages that repeatedly fail',
        notes: [
          'After maxReceiveCount failed processing attempts, the message moves to the DLQ',
          'Isolates "poison pill" messages so they stop blocking the main queue',
          'Lets you inspect/replay failures without losing data',
        ],
      },
      {
        component: 'SNS Topic',
        role: 'Push-based pub/sub broadcaster',
        notes: [
          'Publishers send once; SNS pushes to ALL subscribers (SQS, Lambda, HTTP, email, SMS)',
          'Fan-out: subscribe multiple SQS queues to one topic → each gets its own copy',
          'FIFO topics pair with FIFO queues for ordered fan-out',
          'Message filtering: subscribers receive only messages matching their filter policy',
        ],
      },
      {
        component: 'Queue-driven Auto Scaling',
        role: 'Scale workers to match backlog',
        notes: [
          'Scale on ApproximateNumberOfMessagesVisible (queue depth)',
          'Best practice: target-track a "backlog per instance" custom metric',
          'Queue absorbs spikes so the backend never gets overwhelmed (load levelling)',
        ],
      },
    ],
    compare: [
      {
        label: 'SQS vs SNS vs EventBridge',
        headers: ['Aspect', 'SQS', 'SNS', 'EventBridge'],
        rows: [
          ['Model', 'Queue (pull)', 'Pub/sub (push)', 'Event bus (push)'],
          ['Consumers', 'One per message', 'Many (broadcast)', 'Many, rule-routed'],
          ['Best for', 'Buffer / decouple / level load', 'Fan-out notifications', 'SaaS + AWS event routing, schemas, cron'],
          ['Filtering', 'No', 'Message filter policies', 'Rich content-based rules'],
        ],
        takeaway: 'Buffer work → SQS. Broadcast to many → SNS. Route events by content/from SaaS/on a schedule → EventBridge.',
      },
      {
        label: 'SQS Standard vs FIFO',
        headers: ['Aspect', 'Standard', 'FIFO'],
        rows: [
          ['Ordering', 'Best-effort', 'Strict (per group)'],
          ['Delivery', 'At-least-once (dupes possible)', 'Exactly-once'],
          ['Throughput', 'Nearly unlimited', '300/s (3,000 batched)'],
          ['Use', 'Max throughput, order not critical', 'Order/no-dupes critical'],
        ],
        takeaway: 'Need order or no duplicates → FIFO. Need max throughput and can tolerate occasional dupes/reorder → Standard.',
      },
    ],
    nuances: [
      {
        trap: 'Using SNS alone when each event must trigger several independent pipelines that buffer work',
        correct: 'Use the fan-out pattern: SNS topic → multiple SQS queues. Each queue buffers independently, so a slow consumer never blocks the others.',
      },
      {
        trap: 'Choosing FIFO "to be safe" for a high-throughput, order-insensitive workload',
        correct: 'FIFO caps throughput (300/3,000 msg/s). If order/dedup is not required, Standard gives far higher throughput.',
      },
      {
        trap: 'Blaming SQS when a buggy message keeps reappearing and stalls the queue',
        correct: 'That is a poison-pill. Configure a DLQ with a maxReceiveCount so the bad message is moved aside after N failures.',
      },
      {
        trap: 'Scaling workers on CPU when the real backlog signal is queue length',
        correct: 'Scale the consumer ASG on queue depth (messages visible) / backlog-per-instance, not CPU — that is what reflects pending work.',
      },
    ],
    tips: [
      'Fan-out = SNS → many SQS. One publish, many independent buffered consumers.',
      'Visibility timeout should exceed your processing time, or messages get re-delivered mid-work',
      'Long polling (WaitTimeSeconds=20) reduces empty receives and cost vs short polling',
      'DLQ + maxReceiveCount = the standard answer for "messages keep failing / poison pill"',
      'A queue between tiers = load levelling: spikes lengthen the queue, they do not crash the backend',
    ],
    mnemonic: [
      'SQS = "Someone Queues, Someone pulls" (buffer). SNS = "Send to N Subscribers" (broadcast).',
      'Fan-out = SNS topic with a fan of SQS queues hanging off it.',
      'Failing forever? Send it to the DLQ.',
    ],
    sources: [
      { label: 'Common SQS + SNS fanout scenarios', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-common-scenarios.html' },
      { label: 'Amazon SQS dead-letter queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html' },
      { label: 'Scaling based on Amazon SQS', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // D4 · S3 storage classes + lifecycle (cost optimisation)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 's3-storage-cost-lifecycle',
    title: 'S3 Storage Classes & Lifecycle (Cost)',
    subtitle: 'Tier objects down by access pattern to cut storage cost automatically',
    domain: 'd4',
    tags: ['S3', 'Lifecycle', 'Intelligent-Tiering', 'Glacier', 'Storage Classes', 'Cost'],
    overview:
      'S3 cost optimisation = matching each object to the cheapest class for its access pattern, then ' +
      'letting Lifecycle rules transition objects automatically as they age. When the access pattern is ' +
      'unknown or changing, Intelligent-Tiering moves objects between tiers for you. Archive tiers ' +
      '(Glacier) are cheapest to store but charge for retrieval and have minimum-duration commitments.',
    flow: [
      { nodes: [{ label: 'S3 Standard', sublabel: 'hot · frequent access', color: 'c1' }] },
      { nodes: [{ label: 'Standard-IA', sublabel: 'after 30d · infrequent', color: 'c3' }] },
      { nodes: [{ label: 'Glacier Flexible', sublabel: 'after 90d · archive', color: 'c5' }] },
      { nodes: [{ label: 'Glacier Deep Archive', sublabel: 'after 180d · coldest', color: 'c2' }] },
    ],
    anatomy: [
      {
        component: 'S3 Standard',
        role: 'Default — frequent access, lowest latency',
        notes: [
          '≥99.999999999% (11 nines) durability, 3+ AZs',
          'No retrieval fee, no minimum storage duration — most expensive per GB stored',
          'Use for active/hot data and frequently changing objects',
        ],
      },
      {
        component: 'Standard-IA & One Zone-IA',
        role: 'Infrequent access — cheaper storage, retrieval fee',
        notes: [
          'Lower per-GB storage but you pay a per-GB retrieval fee',
          '30-day minimum storage charge; 128 KB minimum billable object size',
          'One Zone-IA: single AZ → ~20% cheaper, but data lost if that AZ is destroyed (use for reproducible data)',
        ],
      },
      {
        component: 'Intelligent-Tiering',
        role: 'Auto-moves objects between tiers — unknown/changing access',
        notes: [
          'Small monitoring fee per object; no retrieval fees between tiers',
          'Automatically shifts objects across frequent/infrequent/archive tiers based on usage',
          'The "I do not know the access pattern" answer — no minimum duration, no retrieval penalty for tiering',
        ],
      },
      {
        component: 'Glacier tiers',
        role: 'Archive — cheapest storage, retrieval latency + fees',
        notes: [
          'Glacier Instant Retrieval: ms access, archive price, for rarely-accessed-but-instant data',
          'Glacier Flexible Retrieval: minutes–hours; 90-day minimum',
          'Glacier Deep Archive: cheapest; 12h standard retrieval; 180-day minimum — for compliance/long-term',
        ],
      },
      {
        component: 'Lifecycle Rules',
        role: 'Automate transitions and expirations',
        notes: [
          'Transition actions move objects to colder classes after N days',
          'Expiration actions delete objects (or old versions) after N days',
          'Combine with versioning to expire noncurrent versions and clean up incomplete multipart uploads',
        ],
      },
    ],
    compare: [
      {
        label: 'S3 storage classes — pick by access pattern',
        headers: ['Class', 'Access pattern', 'Min duration', 'Note'],
        rows: [
          ['Standard', 'Frequent / hot', 'None', 'Default, no retrieval fee'],
          ['Intelligent-Tiering', 'Unknown / changing', 'None', 'Auto-tiers, small monitor fee'],
          ['Standard-IA', 'Infrequent, multi-AZ', '30 days', 'Retrieval fee'],
          ['One Zone-IA', 'Infrequent, reproducible', '30 days', 'Single AZ — cheaper, less durable'],
          ['Glacier Instant', 'Rare but need instant', '90 days', 'ms retrieval'],
          ['Glacier Flexible', 'Archive, mins–hours OK', '90 days', 'Cheap archive'],
          ['Glacier Deep Archive', 'Cold compliance', '180 days', 'Cheapest, ~12h retrieval'],
        ],
        takeaway: 'Unknown pattern → Intelligent-Tiering. Known + infrequent → IA. Cold/compliance → Glacier (mind retrieval time + min duration).',
      },
    ],
    nuances: [
      {
        trap: 'Putting unpredictably-accessed data into Standard-IA to save money',
        correct: 'IA charges per-GB retrieval + 30-day minimum. If access is unpredictable you can pay MORE. For unknown/changing patterns use Intelligent-Tiering.',
      },
      {
        trap: 'Using One Zone-IA for critical non-reproducible data',
        correct: 'One Zone-IA stores in a single AZ — if that AZ is lost, the data is gone. Only use it for easily reproducible data (e.g., thumbnails, secondary copies).',
      },
      {
        trap: 'Choosing Glacier Deep Archive when retrieval must be fast',
        correct: 'Deep Archive standard retrieval takes ~12 hours. If you need archive pricing but instant access, use Glacier Instant Retrieval.',
      },
      {
        trap: 'Expecting transitions to IA/Glacier to be free for tiny objects',
        correct: 'IA/Glacier have a 128 KB minimum billable size and per-object transition costs. Transitioning millions of tiny objects can cost more than leaving them in Standard.',
      },
    ],
    tips: [
      '"Don\'t know the access pattern" → Intelligent-Tiering. That phrase is the exam trigger.',
      'Minimum durations: IA = 30 days · Glacier Flexible/Instant = 90 · Deep Archive = 180',
      'One Zone-IA = cheaper but single-AZ → only for reproducible data',
      'Deep Archive standard retrieval ≈ 12h; Glacier Instant = milliseconds',
      'Lifecycle rules also expire old versions + abort incomplete multipart uploads (cleanup = cost saving)',
    ],
    mnemonic: [
      'Unknown access = "Intelligent-Tiering decides for me."',
      'IA 30 · Glacier 90 · Deep Archive 180 — minimum-day ladder.',
      'One Zone = one AZ = one disaster from gone → reproducible data only.',
    ],
    sources: [
      { label: 'Amazon S3 storage classes', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html' },
      { label: 'Managing your storage lifecycle', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html' },
      { label: 'Amazon S3 Intelligent-Tiering', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering.html' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // D4 · EC2 purchasing options
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ec2-purchasing-options',
    title: 'EC2 Purchasing Options (Cost)',
    subtitle: 'On-Demand · Reserved · Savings Plans · Spot — match the buy to the workload',
    domain: 'd4',
    tags: ['EC2', 'Spot', 'Reserved Instances', 'Savings Plans', 'On-Demand', 'Cost'],
    overview:
      'Compute cost optimisation = matching the purchase model to workload behaviour. On-Demand for ' +
      'short/unpredictable, commitment-based (Reserved Instances / Savings Plans) for steady baseline ' +
      'load, and Spot for fault-tolerant, interruptible work at up to 90% off. The exam gives you a ' +
      'workload profile and asks for the cheapest option that still meets its constraints.',
    flow: [
      { nodes: [{ label: 'On-Demand', sublabel: 'spiky / short / dev · pay-as-you-go', color: 'c1' }] },
      { nodes: [{ label: 'Savings Plans / RI', sublabel: 'steady baseline · 1–3yr commit', color: 'c3' }] },
      { nodes: [{ label: 'Spot', sublabel: 'fault-tolerant · up to 90% off', color: 'c5' }] },
      { nodes: [{ label: 'Dedicated Host', sublabel: 'compliance / BYOL', color: 'c2', optional: true }] },
    ],
    anatomy: [
      {
        component: 'On-Demand',
        role: 'Pay per second/hour, no commitment',
        notes: [
          'Most expensive per hour; zero commitment, start/stop anytime',
          'Use for short-lived, spiky, unpredictable, or dev/test workloads',
          'The baseline you compare savings against',
        ],
      },
      {
        component: 'Reserved Instances (RI)',
        role: '1- or 3-year commitment for big discount on steady load',
        notes: [
          'Up to ~72% off On-Demand; 1-yr or 3-yr term; All/Partial/No upfront',
          'Standard RI: biggest discount, locked to instance family (can change AZ/size within family)',
          'Convertible RI: smaller discount, can change instance family/OS/tenancy',
          'A billing construct — applies a discount to matching running instances',
        ],
      },
      {
        component: 'Savings Plans',
        role: 'Commit to $/hour of compute for 1–3 yrs (flexible)',
        notes: [
          'Compute Savings Plans: most flexible — applies across EC2, Fargate, Lambda, any region/family',
          'EC2 Instance Savings Plans: bigger discount, locked to an instance family in a region',
          'Generally preferred over RIs now for flexibility at similar savings',
        ],
      },
      {
        component: 'Spot Instances',
        role: 'Spare capacity at up to 90% off — interruptible',
        notes: [
          'AWS can reclaim with a 2-minute interruption notice when it needs the capacity',
          'Perfect for fault-tolerant, stateless, flexible, batch/CI/big-data workloads',
          'Spot Fleet / mixed ASG blends Spot + On-Demand for cost + resilience',
          'NEVER use for stateful, must-not-interrupt workloads (e.g., a primary DB)',
        ],
      },
      {
        component: 'Dedicated Hosts / Instances',
        role: 'Physical isolation / licensing',
        notes: [
          'Dedicated Host: a physical server for your use — required for socket/core-bound BYOL licenses',
          'Dedicated Instance: isolated hardware but without host visibility',
          'Most expensive — only when compliance or licensing demands physical isolation',
        ],
      },
    ],
    compare: [
      {
        label: 'EC2 purchasing options',
        headers: ['Option', 'Commitment', 'Discount', 'Best for'],
        rows: [
          ['On-Demand', 'None', 'Baseline (0%)', 'Spiky, short, unpredictable, dev/test'],
          ['Savings Plans', '1–3 yr ($/hr)', 'Up to ~72%', 'Steady usage, want flexibility'],
          ['Reserved Instances', '1–3 yr (instances)', 'Up to ~72%', 'Steady, known instance type'],
          ['Spot', 'None (interruptible)', 'Up to 90%', 'Fault-tolerant batch / stateless'],
          ['Dedicated Host', 'On-demand or reserved', 'N/A', 'BYOL / compliance isolation'],
        ],
        takeaway: 'Steady baseline → Savings Plans/RI. Spiky → On-Demand. Interruptible batch → Spot. Compliance/BYOL → Dedicated Host.',
      },
    ],
    nuances: [
      {
        trap: 'Running a stateful production database on Spot to save money',
        correct: 'Spot can be reclaimed with 2 minutes notice — never for must-not-interrupt/stateful workloads. Use Spot only for fault-tolerant, restartable work.',
      },
      {
        trap: 'Buying 3-year Standard RIs for a workload whose instance type will likely change',
        correct: 'Standard RIs lock the family. If flexibility matters, use Convertible RIs or (preferably) Compute Savings Plans, which apply across families/regions/Fargate/Lambda.',
      },
      {
        trap: 'Using On-Demand for a 24/7 steady baseline workload',
        correct: 'Always-on predictable load should be covered by a Savings Plan or RI for up to ~72% savings. On-Demand is for variable/short-lived needs.',
      },
      {
        trap: 'Reaching for Dedicated Hosts when isolation is not required',
        correct: 'Dedicated Hosts are for BYOL licensing or strict compliance isolation only — they are the most expensive option, not a default.',
      },
    ],
    tips: [
      'Match by behaviour: spiky→On-Demand · steady→Savings Plan/RI · interruptible→Spot · BYOL→Dedicated Host',
      'Compute Savings Plan is the most flexible commitment (covers EC2 + Fargate + Lambda, any region/family)',
      'Spot interruption notice = 2 minutes — design workers to checkpoint and resume',
      'Mixed-instances ASG (Spot + On-Demand baseline) = cheap AND resilient',
      'Standard RI = max discount but locked family; Convertible RI = flexible, smaller discount',
    ],
    mnemonic: [
      'Spot = "cheap but can be Snatched" (2-min notice) → only fault-tolerant work.',
      'Steady 24/7 = commit (Savings Plan/RI) for ~72% off.',
      'Savings Plan = flexible $/hr · RI = specific instances.',
    ],
    sources: [
      { label: 'Instance purchasing options', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html' },
      { label: 'How Savings Plans work', url: 'https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html' },
      { label: 'Amazon EC2 Spot Instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html' },
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

export const nodeColorMap: Record<NodeColor, { border: string; text: string; bg: string; dot: string }> = {
  c1:   { border: 'border-c1/40',   text: 'text-c1',        bg: 'bg-c1/8',   dot: 'bg-c1' },
  c2:   { border: 'border-c2/40',   text: 'text-c2',        bg: 'bg-c2/8',   dot: 'bg-c2' },
  c3:   { border: 'border-c3/40',   text: 'text-c3',        bg: 'bg-c3/8',   dot: 'bg-c3' },
  c4:   { border: 'border-c4/40',   text: 'text-c4',        bg: 'bg-c4/8',   dot: 'bg-c4' },
  c5:   { border: 'border-c5/40',   text: 'text-c5',        bg: 'bg-c5/8',   dot: 'bg-c5' },
  c6:   { border: 'border-c6/40',   text: 'text-c6',        bg: 'bg-c6/8',   dot: 'bg-c6' },
  gray: { border: 'border-aws-border', text: 'text-aws-muted', bg: 'bg-white/4', dot: 'bg-aws-muted' },
}
