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

export interface ServiceCard {
  shortName: string
  fullName: string
  ingat: string
  gunaUntuk: string
  fungsi: string
  contohGuna?: string
  scenario?: string
  storageDetails?: string
  detailsLabel?: string
  diagram?: FlowDiagram | FlowDiagram[]
  mermaid?: MermaidSpec | MermaidSpec[]
  image?: CardImage | CardImage[]
  compare?: CompareTable | CompareTable[]
  tips?: string[]
  docs?: Array<{ label: string; url: string }>
  keywords: string[]
}

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

export const domains: DomainData[] = [
  {
    id: 'domain1',
    badge: 'DOMAIN 1 · 30% OF EXAM',
    title: 'Design Secure Architectures',
    subtitle: 'IAM & Identity · Network Security · Data Protection · Connectivity',
    variant: 'd1',
    sections: [
      {
        id: 'd1-iam',
        icon: '🔑',
        title: 'IAM & Identity',
        category: 'd1iam',
        services: [
          {
            shortName: 'IAM',
            fullName: 'AWS Identity and Access Management',
            ingat: '"Siapa boleh buat apa dalam AWS"',
            gunaUntuk: 'Control who can access what AWS resources',
            fungsi: 'Mengurus identiti dan akses kepada perkhidmatan dan sumber AWS dengan policies',
            contohGuna: 'Create IAM Role untuk EC2 boleh read S3 — attach role ke EC2, bukan hardcode credentials dalam code',
            tips: [
              'IAM Principals: entity yang boleh buat request kat AWS — Users (individu), Groups (kumpulan users), atau Roles (identity sementara yang boleh di-assume)',
              'Users & Groups = permanent identities — perlu credentials (password untuk console, access keys untuk CLI) untuk login. Roles = temporary identities — bagi short-lived credentials yang di-assume oleh Users/Applications, tak perlu hardcode long-term credentials',
              'IAM Policy: JSON document yang define Allow/Deny untuk action tertentu pada resource tertentu — attach kat User/Group/Role',
              'Multi-Factor Authentication (MFA): extra layer security — selain password, perlu code dari device (app/hardware token) untuk login',
              'Account best practices: (1) JANGAN guna ROOT user untuk daily tasks — ROOT hanya untuk tasks yang memang require ROOT (billing, close account, dll). (2) Create Administrative User untuk daily admin tasks. (3) Enable MFA untuk ROOT & semua Users. (4) Add Users ke Groups, assign permissions kat Group — bukan standalone kat User',
              'Identity Federation: user luar AWS (corporate AD, Google, Facebook) dapat temporary access AWS resources tanpa IAM user baru — guna SAML/OIDC/STS',
              'Policy evaluation logic: (1) Bila User baru created, semua request implicitly DENIED by default (kecuali ROOT). (2) Explicit Allow dalam Identity-based atau Resource-based Policy overrides implicit Deny tu. (3) Tapi explicit Deny SENTIASA override explicit Allow — Allow + Deny dalam policy = DENIED. (4) Permission Boundary, SCP, atau Session Policy boleh override (restrict) Allow dengan implicit Deny mereka sendiri — even kalau IAM Policy bagi Allow',
              'IAM Role types: (1) Service Role — role yang AWS service assume untuk buat actions on behalf of User (cth: Lambda execution role). (2) Service Role for EC2 — application dalam EC2 assume role ni untuk access resource lain (cth: S3) tanpa hardcode credentials. (3) Service-Linked Role — AWS Managed role yang predefined & linked terus ke satu service, permissions tak boleh edit oleh User. (4) Role Chaining — assume satu role, lepas tu guna credentials tu untuk assume role lain (cth: cross-account role → read-only role untuk S3)',
              'Exam: "Which is NOT a feature of IAM?" → "IAM Resource" is the trick option. Resource = target YANG DIKAWAL aksesnya oleh IAM (cth: S3 bucket, EC2), bukan komponen/feature IAM itu sendiri',
            ],
            keywords: ['users', 'groups', 'roles', 'policies', 'least privilege', 'MFA', 'principals', 'identity federation'],
          },
          {
            shortName: 'STS',
            fullName: 'AWS Security Token Service',
            ingat: '"Pinjam IC sementara — short-lived credentials, auto-expire"',
            gunaUntuk: 'Generate temporary security credentials',
            fungsi: 'Bagi short-lived credentials (access key + secret key + session token) yang auto-expire. Pilih API ikut SIAPA yang minta: AssumeRole (cross-account / EC2 role), AssumeRoleWithSAML (enterprise AD/SAML), AssumeRoleWithWebIdentity (Google/Facebook/Cognito/OIDC). Tak perlu cipta IAM user baru.',
            contohGuna: 'App dalam Account A nak akses S3 dalam Account B — AssumeRole ke role dalam B, dapat temp credentials, tak perlu hardcode long-term keys',
            compare: {
              label: 'STS API — pilih ikut SIAPA yang call',
              headers: ['API', 'Siapa boleh call', 'Guna bila', 'Lifetime'],
              rows: [
                ['AssumeRole', 'IAM user / role sedia ada', 'Cross-account access ATAU role chaining dalam AWS', '15 min → max session (default 1 jam)'],
                ['AssumeRoleWithSAML', 'User yang dah authenticate via SAML 2.0 IdP', 'Enterprise federation — corporate AD / ADFS / Okta', '15 min → max session (default 1 jam)'],
                ['AssumeRoleWithWebIdentity', 'User yang login via OIDC (Google, Facebook, Amazon, Cognito)', 'Web/mobile app — public identity federation', '15 min → max session (default 1 jam)'],
                ['GetSessionToken', 'IAM user / root', 'Hardened MFA-protected temp creds untuk user yang sama', '15 min → 36 jam (default 12 jam)'],
                ['GetFederationToken', 'IAM user / root', 'Custom identity broker bagi creds kat federated user (no role)', '15 min → 36 jam (default 12 jam)'],
              ],
              takeaway: 'Cross-account / EC2 / chaining → AssumeRole. SAML enterprise IdP → AssumeRoleWithSAML. Public social/OIDC login → AssumeRoleWithWebIdentity. Cognito Identity Pool guna AssumeRoleWithWebIdentity bawah hood.',
            },
            tips: [
              'Semua AssumeRole* return temp creds dengan lifetime 15 min sampai "maximum session duration" role tu (default 1 jam, boleh set sampai 12 jam). DurationSeconds tak boleh exceed setting role',
              'Role chaining = guna temp creds dari satu AssumeRole untuk AssumeRole lagi sekali. Bila chain, sesi di-cap kepada 1 jam — DurationSeconds > 1 jam akan gagal',
              'Session policy: pass policy masa AssumeRole untuk SEKAT lagi permissions sesi tu (effective = intersection role policy ∩ session policy). Tak boleh tambah permissions melebihi role',
              'STS endpoint: ada global endpoint + Regional endpoints. Guna Regional endpoint untuk kurangkan latency dan teruskan operasi kalau satu Region down',
              'Exam: "app dalam account lain perlu akses resource saya buat sementara" → AssumeRole (cross-account). "corporate AD users perlu akses AWS" → AssumeRoleWithSAML. "mobile app users login Google/Facebook nak temp AWS creds" → AssumeRoleWithWebIdentity (atau Cognito Identity Pool yang panggil ia)',
              'Exam trap: STS = TEMPORARY credentials yang AUTO-EXPIRE. Kalau soalan minta elak hardcode long-term access keys / rotate manual → STS roles, bukan IAM user access keys',
            ],
            docs: [
              { label: 'Compare AWS STS credentials', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_sts-comparison.html' },
            ],
            keywords: ['temporary credentials', 'AssumeRole', 'AssumeRoleWithSAML', 'AssumeRoleWithWebIdentity', 'GetSessionToken', 'GetFederationToken', 'cross-account', 'role chaining', 'session policy', 'federation', 'auto-expire'],
          },
          {
            shortName: 'Directory Service',
            fullName: 'AWS Directory Service',
            ingat: '"Active Directory dalam AWS — tiga jenis, pilih ikut use case"',
            gunaUntuk: 'Managed Microsoft Active Directory, AD Connector, or Simple AD for AWS workloads',
            fungsi: 'AWS Directory Service ada tiga pilihan: (1) AWS Managed Microsoft AD — full AD dalam AWS. (2) AD Connector — proxy ke on-premises AD. (3) Simple AD — Samba-based, lightweight, bukan full AD.',
            compare: {
              label: 'Managed Microsoft AD vs AD Connector vs Simple AD',
              headers: ['Aspect', 'Managed Microsoft AD', 'AD Connector', 'Simple AD'],
              rows: [
                ['Apa dia', '🟢 Real Microsoft AD dalam AWS', 'Proxy/redirect ke on-prem AD', 'Samba 4 — AD-compatible, BUKAN real AD'],
                ['Directory ada kat mana', 'Dalam AWS (managed by AWS)', 'Kekal on-premises (tiada dalam cloud)', 'Dalam AWS (standalone)'],
                ['Trust ke on-prem AD', '🟢 Ya (one-way / two-way)', 'N/A — guna terus on-prem AD', '❌ Tiada trust'],
                ['Group Policy / Kerberos / LDAP', '🟢 Penuh', 'Guna feature on-prem AD', 'Asas sahaja (subset)'],
                ['Guna bila', 'Perlu full AD features dalam AWS, atau migrate AD', 'Dah ada on-prem AD, tak nak replicate ke cloud', 'Workload kecil, basic AD features, no on-prem'],
              ],
              takeaway: 'Full AD dalam cloud / ada trust → Managed Microsoft AD. AD kekal on-prem, AWS cuma proxy auth → AD Connector. Kecil + murah + basic → Simple AD. (User external Google/Facebook → Cognito, bukan Directory Service.)',
            },
            tips: [
              'AWS Managed Microsoft AD: full Microsoft AD dalam AWS. Untuk apps yang perlukan actual AD features (Group Policy, Kerberos, LDAP). Boleh trust ke on-premises AD',
              'AD Connector: BUKAN AD dalam cloud — ia redirect authentication requests ke on-premises AD. Data tetap on-prem. Untuk existing on-prem AD yang tak nak migrate',
              'Simple AD: Samba-based, basic AD features, standalone (no trust ke on-prem). Untuk simple Linux/Windows workloads yang perlukan basic LDAP/Kerberos',
              'IAM Identity Center + AWS Managed Microsoft AD = SSO untuk AWS + SaaS apps dengan full AD features',
              'Exam: "join EC2 to existing on-premises domain, AD stays on-prem" → AD Connector. "Full AD in cloud, migrate off-prem" → AWS Managed Microsoft AD',
              'Exam: "users all WITHIN AWS, need FULL AD features" → AWS Managed Microsoft AD. "users all WITHIN AWS, need BASIC AD features" → Simple AD. "users on-premises, authenticate to Cloud Native apps using existing on-prem directory" → AD Connector. "users are external (Facebook/Google), no AD needed" → Cognito User Pools (bukan Directory Service)',
            ],
            keywords: ['Active Directory', 'Managed Microsoft AD', 'AD Connector', 'Simple AD', 'LDAP', 'Kerberos', 'Group Policy', 'on-premises AD'],
          },
          {
            shortName: 'IAM Identity Center',
            fullName: 'AWS IAM Identity Center (SSO)',
            ingat: '"Satu login, semua AWS accounts"',
            gunaUntuk: 'Centralized SSO untuk multiple AWS accounts',
            fungsi: 'Membolehkan pengguna login sekali dan access multiple AWS accounts dan business applications',
            contohGuna: 'Staff login dengan corporate email (Microsoft AD / Okta), dapat access semua 10 AWS accounts yang dibenarkan tanpa login semula',
            tips: [
              'IAM Identity Center + SAML 2.0: untuk SSO dari on-premises Active Directory ke AWS + third-party SaaS (Salesforce, etc.)',
              'SAML 2.0 IAM roles alone (tanpa Identity Center) = tak ada SSO portal, tak integrate SaaS apps',
              'Web identity federation = untuk PUBLIC providers (Google, Amazon, Facebook) — bukan enterprise AD',
              'Exam: "on-premises AD + SSO to AWS + SaaS apps" → IAM Identity Center with SAML 2.0',
              'IAM Identity Center features: (1) Multi-account access — centralized access ke multiple AWS accounts dalam Organization, elak repeat config Users per account. (2) SSO ke AWS applications — satu login, tak payah ingat password berasingan. (3) SSO ke Cloud-based/SaaS apps (Salesforce, Microsoft 365) via SAML 2.0. (4) SSO ke EC2 — TAPI khusus untuk EC2 WINDOWS instances (via Fleet Manager, guna existing corporate credentials, elak share admin RDP credentials) — BUKAN Linux',
            ],
            docs: [
              { label: 'IAM Identity Center Features', url: 'https://aws.amazon.com/iam/identity-center/features/' },
              { label: 'Seamless SSO to EC2 Windows instances', url: 'https://aws.amazon.com/blogs/security/how-to-enable-secure-seamless-single-sign-on-to-amazon-ec2-windows-instances-with-aws-sso/' },
            ],
            keywords: ['SSO', 'single sign-on', 'multiple accounts', 'federation', 'SAML 2.0', 'Active Directory', 'SaaS integration', 'EC2 Windows', 'Fleet Manager'],
          },
          {
            shortName: 'Penetration Testing',
            fullName: 'AWS Penetration Testing Policy',
            ingat: '"Boleh test sendiri — tapi ada had"',
            gunaUntuk: 'Security assessments on your own AWS infrastructure',
            fungsi: 'AWS membenarkan pelanggan menjalankan security assessments atau penetration tests terhadap infrastruktur AWS mereka sendiri tanpa kelulusan awal untuk 8 perkhidmatan yang dibenarkan. Activities yang dilarang termasuk DoS/DDoS simulation, port flooding, dan DNS zone walking.',
            contohGuna: 'Security team nak test EC2 instances atau RDS databases untuk vulnerabilities — dibenarkan tanpa minta izin AWS terlebih dahulu.',
            scenario: '"AWS Acceptable Use Policy", "penetration testing position", "security assessments on AWS" → AWS allow for SOME resources WITHOUT prior authorization (not all, not none). 8 permitted services include EC2, RDS, CloudFront, Aurora, API Gateways, Lambda, Lightsail, Elastic Beanstalk.',
            tips: [
              '8 permitted services (no prior approval needed): EC2, RDS, Aurora, CloudFront, API Gateway, Lambda + Lambda@Edge, Lightsail, Elastic Beanstalk',
              'PROHIBITED activities (tetap tak boleh, walaupun atas resource sendiri): DoS / DDoS simulation, port flooding, protocol flooding, request flooding, DNS zone walking via Route 53 Hosted Zones',
              'Test atas resource SENDIRI sahaja — bukan infrastruktur AWS underlying atau resource tenant lain',
              'Exam: kalau soalan kata perlu "request AWS approval first / open support case" untuk pen-test 8 service ni → SALAH; AWS dah pre-authorize. Tapi DDoS simulation / network stress test → perlu engage AWS DDoS Simulation Testing program berasingan',
            ],
            keywords: ['penetration testing', 'security assessment', 'Acceptable Use Policy', 'AUP', 'no prior approval', '8 services', 'prohibited activities', 'DoS DDoS prohibited', 'DNS zone walking'],
          },
          {
            shortName: 'Cognito',
            fullName: 'Amazon Cognito',
            ingat: '"Login untuk user apps — User Pool = siapa kau, Identity Pool = boleh buat apa"',
            gunaUntuk: 'User sign-up/sign-in, federated identity (Google/Facebook), mobile app auth',
            fungsi: 'Identity platform untuk web/mobile apps. Dua komponen yang operate independent atau bersama: User Pools (authentication — siapa user, issue JWT) vs Identity Pools (authorization — tukar token jadi temp AWS credentials via STS).',
            diagram: {
              label: 'User Pool + Identity Pool flow',
              steps: [
                { nodes: [{ label: 'User', sub: 'sign in', tone: 'c4' }] },
                { nodes: [{ label: 'User Pool', sub: 'auth → JWT', tone: 'c3' }] },
                { nodes: [{ label: 'Identity Pool', sub: 'JWT → STS creds', tone: 'c5' }] },
                { nodes: [
                  { label: 'S3', tone: 'c2' },
                  { label: 'DynamoDB', tone: 'c2' },
                ] },
              ],
              caption: '1) Sign in ikut User Pool → dapat JWT. 2) Tukar JWT kat Identity Pool → dapat temp AWS credentials (STS). 3) Guna credentials access AWS services. Dua-dua boleh guna sendiri-sendiri.',
            },
            compare: {
              label: 'User Pool vs Identity Pool',
              headers: ['Aspect', 'User Pool', 'Identity Pool'],
              rows: [
                ['Job', 'Authentication — "siapa kau"', 'Authorization — "boleh access apa kat AWS"'],
                ['Issues', 'JWT tokens (ID, access, refresh)', 'Temp AWS credentials (via STS)'],
                ['Backed by', 'User directory + OIDC IdP', 'IAM roles (role + attribute based)'],
                ['Federated IdP', '🟢 SAML, OIDC, Google, Facebook, Apple', '🟢 Accepts User Pool or external IdP claims'],
                ['Guest/anonymous', 'No', '🟢 Yes — boleh issue creds untuk guest'],
                ['Use when', 'App perlu sign-up / sign-in', 'App perlu call AWS APIs (S3, DynamoDB) directly'],
              ],
              takeaway: '"Web app perlu login/registration" → User Pool. "App perlu access S3/DynamoDB terus dengan temp credentials" → Identity Pool. Selalu pair: User Pool authenticate → Identity Pool bagi AWS creds.',
            },
            tips: [
              'Cognito User Pools support federated identity — users TAK PERLU di-create dalam AWS, boleh authenticate guna external IdPs (Facebook, Google, Apple, SAML, OIDC)',
              'Identity Pool guna IAM roles (role-based + attribute-based access control) untuk decide apa user boleh access. Boleh issue credentials untuk guest/unauthenticated users juga',
              'Exam: "exchange social/SAML login for temporary AWS credentials to access S3" → Identity Pool. "Managed user directory with sign-up, MFA, password policies" → User Pool',
            ],
            docs: [
              { label: 'What is Amazon Cognito (User vs Identity pools)', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html' },
            ],
            keywords: ['User Pools', 'Identity Pools', 'OAuth', 'JWT', 'federated identity', 'MFA', 'STS', 'temp credentials', 'OIDC', 'SAML', 'authentication', 'authorization', 'guest access'],
          },
          {
            shortName: 'RAM',
            fullName: 'AWS Resource Access Manager',
            ingat: '"Share AWS resources antara accounts tanpa copy"',
            gunaUntuk: 'Share subnets, Transit Gateway, Route 53 resolver rules cross-account',
            fungsi: 'Membenarkan perkongsian resources AWS merentasi akaun tanpa pendua.',
            scenario: '"Company ada 10 AWS accounts, semua perlu access sama subnet" → AWS RAM share the subnet. Bukan VPC Peering untuk ni.',
            compare: {
              label: 'RAM vs VPC Peering vs Resource-based policy',
              headers: ['Aspect', 'AWS RAM', 'VPC Peering', 'Resource-based policy'],
              rows: [
                ['Buat apa', 'Share resource sebenar cross-account (no duplicate)', 'Sambung network 2 VPC supaya boleh route traffic', 'Bagi specific principal akses satu resource'],
                ['Use case', 'Banyak account guna subnet / TGW / Resolver rule yang SAMA', 'Resource dalam VPC lain perlu cakap antara satu sama lain via IP', 'Share satu S3 bucket / SQS / KMS key ke account tertentu'],
                ['Skala org', '🟢 Auto-share ke semua account dalam Organization / OU', 'Pairwise sahaja — N VPC = banyak peering', '🟡 Configure satu-satu per resource / account'],
                ['Contoh resource', 'Subnet, Transit Gateway, Route 53 Resolver rule, License Manager config, Prefix list', 'VPC ↔ VPC', 'S3 bucket policy, SQS policy, KMS key policy'],
              ],
              takeaway: 'Kongsi infrastruktur (subnet/TGW/Resolver) merentas banyak account → RAM. Cuma nak network connectivity antara 2 VPC → Peering. Bagi akses satu resource ke account tertentu → resource-based policy. RAM + Organizations = create sekali, share ke semua member auto.',
            },
            tips: [
              'RAM + AWS Organizations → create resources ONCE in one account, share across ALL member accounts — jimat kos dan elak duplicate infrastructure',
              'Shareable resources: VPC subnets, Transit Gateway, Route 53 Resolver rules, License Manager configs, Resource Groups',
              'Exam: "centralized shared resources across multiple accounts, reduce operational overhead" → AWS RAM (bukan resource-based policies yang perlu configure per-account)',
              'Resource-based policies = share satu resource ke specific account. RAM = share ke semua accounts dalam Org systematically',
            ],
            keywords: ['cross-account sharing', 'shared subnets', 'Transit Gateway sharing', 'no resource duplication', 'AWS Organizations', 'centralized resources'],
          },
          {
            shortName: 'AWS Organizations',
            fullName: 'AWS Organizations + Control Tower + SCPs',
            ingat: '"HQ yang kawal semua anak syarikat"',
            gunaUntuk: 'Manage multiple AWS accounts centrally with guardrails',
            fungsi: 'Mengurus pelbagai AWS accounts dalam satu organisasi dengan Service Control Policies (SCPs) sebagai guardrails',
            contohGuna: 'Prevent semua dev accounts dari disable CloudTrail — SCP: Deny cloudtrail:StopLogging. Control Tower automate setup multi-account environment',
            scenario: '"Restrict apa member accounts boleh buat org-wide, exempt management account" → SCP (member accounts only). "Enforce guardrails + auto setup landing zone / multi-account baseline" → Control Tower. "Satu bil + kongsi diskaun" → Consolidated Billing (bukan SCP). Ingat: SCP RESTRICT sahaja, tak GRANT.',
            mermaid: {
              label: 'Adakah action ni dibenarkan? (SCP + IAM evaluation)',
              source: `flowchart TD
  A[Request dari IAM user/role member account] --> B{Akaun management?}
  B -- Ya --> Z[SCP tak apply<br/>ikut IAM policy sahaja]
  B -- Tidak --> C{SCP benarkan action?}
  C -- Tidak/implicit deny --> D[DENIED<br/>SCP cap permissions max]
  C -- Ya --> E{IAM identity policy benarkan?}
  E -- Tidak --> F[DENIED<br/>SCP tak GRANT, IAM kena Allow]
  E -- Ya --> G[ALLOWED]`,
              caption: 'Effective permission = intersection SCP ∩ IAM policy. SCP tak grant apa-apa — kena ADA Allow dalam IAM policy juga. Management account tak terkena SCP langsung.',
            },
            tips: [
              'SCP TIDAK apply ke management (root) account by default — SCPs hanya restrict MEMBER accounts',
              'Kalau soalan tanya "prevent actions org-wide tapi exempt management account" → answer specify "member accounts only"',
              'SCPs cannot GRANT permissions — they only RESTRICT maximum available permissions. IAM policies still needed untuk grant access',
              'S3 Block Public Access via SCP: most scalable way nak prevent public S3 org-wide. SCP prevent members dari disable BPA setting',
            ],
            keywords: ['multi-account', 'SCPs', 'guardrails', 'Control Tower', 'management account', 'OU', 'management account exemption', 'SCP cannot grant', 'S3 Block Public Access SCP'],
          },
        ],
      },
      {
        id: 'd1-netsec',
        icon: '🛡️',
        title: 'Network Security',
        category: 'd1net',
        services: [
          {
            shortName: 'Security Groups',
            fullName: 'VPC Security Groups',
            ingat: '"Bodyguard EC2 — stateful, allow only, ingat connections"',
            gunaUntuk: 'Instance-level firewall — control inbound/outbound per EC2/ENI',
            fungsi: 'Mengawal inbound dan outbound traffic pada peringkat EC2 secara stateful. Custom SG baru: tiada inbound rules (semua inbound ditolak secara implicit), ada satu default outbound rule yang allow semua traffic ke 0.0.0.0/0. Default SG (yang auto-create bersama VPC): ada inbound allow dari dalam group yang sama.',
            contohGuna: 'Web server SG: allow port 443 dari 0.0.0.0/0. DB SG: allow port 3306 dari Web-SG je — DB hanya boleh diakses dari web servers, bukan dari internet.',
            scenario: 'Exam: "New custom SG, no rules — what is default state?" → Inbound: NO rules = ALL DENIED. Outbound: default rule = ALL ALLOWED to 0.0.0.0/0. Jangan confuse dengan default SG (berbeza).',
            tips: [
              'Custom SG default: NO inbound rules (deny all) + 1 outbound rule (allow all to 0.0.0.0/0)',
              'Default SG vs Custom SG: Default SG ada inbound rule allow dari same SG. Custom SG starts empty.',
              'Stateful = SG ingat connections. Outbound reply auto dibenarkan — tak perlu explicit outbound rule',
              'SG = allow only. Nak deny specific IP? → Guna NACL',
              'SG boleh reference SG lain sebagai source — "allow 3306 FROM web-sg" bukan hardcode IP',
            ],
            docs: [
              { label: 'Security Groups', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html' },
            ],
            keywords: ['stateful', 'instance-level', 'allow only', 'custom SG default', 'inbound denied', 'outbound allowed'],
          },
          {
            shortName: 'NACLs',
            fullName: 'Network Access Control Lists',
            ingat: '"Guard kat pintu masuk subnet — check both ways"',
            gunaUntuk: 'Subnet-level firewall, stateless, boleh block IP',
            fungsi: 'Mengawal traffic masuk dan keluar subnet secara stateless — kena ada rule eksplisit untuk inbound DAN outbound. Rules diproses ikut nombor (rendah → tinggi); rule pertama yang match terus apply. Boleh ALLOW dan DENY (tak macam SG yang allow-only). Custom NACL: deny all by default. Default NACL: allow all.',
            contohGuna: 'Block IP range 192.168.1.0/24 dari masuk subnet — tambah DENY rule dalam NACL (Security Groups tak boleh explicitly deny).',
            scenario: '"Block satu malicious IP daripada akses semua instance dalam subnet" → NACL DENY rule (SG tak boleh deny). "Allow/deny per EC2 ikut role" → Security Group. Exam keyword "explicit deny" atau "block specific IP" hampir selalu = NACL.',
            compare: {
              label: 'Security Group vs NACL — THE classic exam trap',
              headers: ['Aspect', 'Security Group', 'NACL'],
              rows: [
                ['Beroperasi di', 'Instance / ENI level', 'Subnet level'],
                ['State', '🟢 Stateful — return traffic auto-allow', 'Stateless — kena rule untuk SETIAP arah'],
                ['Rules', 'ALLOW only (implicit deny)', 'ALLOW dan DENY'],
                ['Evaluation', 'Semua rules dinilai, kalau ada allow → pass', 'Ikut nombor, rendah → tinggi, first match menang'],
                ['Default (custom)', 'No inbound, allow all outbound', 'DENY semua inbound & outbound'],
                ['Apply ke', 'Setiap instance yang attach SG tu', 'Auto semua instance dalam subnet'],
              ],
              takeaway: 'Stateful + allow-only + instance level → Security Group. Stateless + boleh DENY + subnet level + numbered rules → NACL. Nak block satu IP jahat = NACL (SG tak boleh deny). Return traffic kena fikir ephemeral ports = NACL je (SG ingat sendiri).',
            },
            tips: [
              'Stateless = check every packet — kena ada rules untuk BOTH inbound DAN outbound directions',
              'Custom NACL: deny all by default. Default NACL: allow all (berbeza dengan SG!)',
              'Rules by number — rule 100 diprocess sebelum rule 200. First match menang, jadi letak DENY rule nombor lebih kecil dari ALLOW yang nak override',
              'Outbound replies perlu allow ephemeral ports 1024–65535 (Linux 32768–60999, Windows 49152–65535) — sebab NACL stateless, return traffic guna random high port',
              'SG = allow only. Nak EXPLICITLY DENY satu IP/range? → NACL je yang boleh',
              'Mnemonic: NACL = Numbered + Allow/deny + Check both ways + subnet Level. SG = Stateful + allow-only + instance-level',
            ],
            docs: [
              { label: 'Network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html' },
              { label: 'Compare security groups and network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html' },
            ],
            keywords: ['stateless', 'subnet-level', 'allow & deny', 'numbered rules', 'explicit both ways', 'ephemeral ports', 'explicit deny', 'block IP', 'SG vs NACL'],
          },
          {
            shortName: 'WAF',
            fullName: 'AWS Web Application Firewall',
            ingat: '"Penapis website dari serangan Layer 7"',
            gunaUntuk: 'Protect against SQL injection, XSS, rate limiting',
            fungsi: 'Menapis requests HTTP/HTTPS berbahaya sebelum sampai ke aplikasi dengan rules dan managed rule groups',
            contohGuna: 'API kena SQL injection attack — deploy WAF dengan AWS Managed Rules kat ALB atau CloudFront. Boleh rate limit 1000 req/IP per minit',
            tips: [
              'Rate-based rule: throttle requests dari satu IP yang melebihi threshold',
              'URI-specific rate-based rule → throttle ONLY heavy/expensive endpoints (e.g. /api/compute) sambil biarkan lightweight endpoints unrestricted',
              'Blanket rate-based rule = semua endpoint kena limit (too broad). URI-specific = targeted throttling',
              'IP reputation rule = block known bad IPs. Managed rule groups = block known exploits/CVEs',
              'Exam: "throttle specific API endpoint yang computationally expensive" → URI-specific rate-based rule',
            ],
            keywords: ['Layer 7', 'SQL injection', 'XSS', 'rate limiting', 'managed rules', 'ALB', 'CloudFront', 'URI-specific rate-based rule', 'targeted throttling'],
          },
          {
            shortName: 'AWS Shield',
            fullName: 'AWS Shield Standard & Advanced',
            ingat: '"Pelindung DDoS — Standard free, Advanced bayar"',
            gunaUntuk: 'DDoS protection Layer 3/4 (Standard) and Layer 7 (Advanced)',
            fungsi: 'Melindungi dari serangan DDoS — Standard free untuk semua, Advanced untuk protection 24/7 + DDoS Response Team',
            contohGuna: 'Website kena volumetric DDoS — Shield Standard protect automatically. Enterprise nak protection + cost protection + DRT = Shield Advanced',
            compare: {
              label: 'WAF vs Shield Standard vs Shield Advanced — yang mana untuk apa',
              headers: ['Aspect', 'AWS WAF', 'Shield Standard', 'Shield Advanced'],
              rows: [
                ['Lindung dari', 'L7 web exploits (SQLi, XSS, bots)', 'L3/L4 DDoS (SYN flood, UDP reflection)', 'L3/L4 + L7 DDoS, scale besar'],
                ['Layer', 'Layer 7 (HTTP/S)', 'Layer 3/4', 'Layer 3/4/7'],
                ['Harga', 'Bayar per rule + request', '🟢 FREE, auto untuk semua', '$3,000/bulan/org + data'],
                ['Pasang kat', 'CloudFront, ALB, API GW, AppSync, Cognito', 'Auto (semua AWS edge)', 'CloudFront, ALB, NLB, EIP, Route 53, GA'],
                ['Extra', 'Custom + managed rule groups, rate limit', 'Tiada visibility / custom rules', 'DRT/SRT 24/7, cost protection, real-time metrics, WAF percuma'],
              ],
              takeaway: 'SQLi/XSS/bad-bot/rate-limit (Layer 7) → WAF. DDoS asas percuma → Shield Standard (auto, takyah buat apa). DDoS besar + DDoS Response Team + bil tak naik masa diserang → Shield Advanced (selalu dgn WAF).',
            },
            tips: [
              'Shield Standard: FREE, automatic, protect Layer 3/4 DDoS. TIADA: custom rules, real-time visibility, WAF integration',
              'Shield Advanced: PAID ($3,000/month). Ada: DDoS Response Team (DRT), real-time metrics, WAF integration, custom mitigation',
              'GuardDuty = detects threats, bukan protect DDoS. Inspector = vulnerability scanning EC2. Detective = investigate security events',
              'Exam: "custom mitigations + real-time visibility + maximum DDoS protection" → Shield Advanced + WAF',
            ],
            keywords: ['DDoS', 'Layer 3/4', 'Shield Standard', 'Shield Advanced', 'DRT', 'always-on', 'Shield Standard free', 'Shield Advanced paid', 'custom mitigation', 'real-time visibility'],
          },
          {
            shortName: 'Network Firewall',
            fullName: 'AWS Network Firewall',
            ingat: '"Polis traffic dalam VPC — deep inspection, Layer 3-7, pakai Suricata"',
            gunaUntuk: 'VPC-level managed firewall — stateful deep packet inspection, domain filtering, IDS/IPS',
            fungsi: 'Managed network firewall + IDS/IPS untuk VPC. Ada DUA engine: stateless engine (macam NACL, nilai packet sorang-sorang ikut priority) dan stateful engine (guna Suricata-compatible rules, nilai dalam konteks traffic flow). Boleh buat domain/URL filtering, intrusion prevention, dan filter traffic Layer 3 sampai 7. Deploy dalam dedicated firewall subnet, route traffic VPC melaluinya.',
            contohGuna: 'Company policy: semua outbound traffic kena inspect dan block malicious/unapproved domains — deploy Network Firewall kat centralized inspection VPC, route semua traffic melaluinya guna stateful domain-list rules.',
            scenario: '"Filter outbound traffic ikut domain name (allow *.amazonaws.com je), VPC-wide, managed" → AWS Network Firewall. "Block SQLi/XSS pada HTTP request ke website" → WAF (bukan Network Firewall). "DDoS volumetric" → Shield. Network Firewall = traffic dalam/keluar VPC, bukan khusus web app.',
            compare: {
              label: 'WAF vs Shield vs Network Firewall — 3 lapisan, jangan campur',
              headers: ['Aspect', 'AWS WAF', 'AWS Shield', 'Network Firewall'],
              rows: [
                ['Lindung apa', 'Web app exploits (SQLi, XSS, bad bots)', 'DDoS (volumetric, protocol)', 'Traffic masuk/keluar VPC'],
                ['Layer', 'Layer 7 (HTTP/S)', 'Layer 3/4 (+ L7 Advanced)', 'Layer 3-7 (packet + flow)'],
                ['Skop', 'CloudFront, ALB, API GW, AppSync', 'Edge / AWS resources', 'Seluruh VPC (subnet route)'],
                ['Engine / rules', 'Web ACL + managed rule groups', 'Auto mitigation', 'Stateless + Suricata stateful, domain filter'],
                ['Guna untuk', 'Tapis HTTP request berbahaya', 'Tahan serangan DDoS', 'IDS/IPS, domain filtering, egress control'],
              ],
              takeaway: 'HTTP/web exploit (SQLi/XSS) → WAF. DDoS → Shield. Inspect/filter SEMUA traffic VPC ikut domain atau Suricata rule (IDS/IPS, egress filtering) → Network Firewall. Ketiga-tiga boleh berlapis sekali.',
            },
            tips: [
              'Network Firewall = managed AWS alternative kepada third-party firewall appliance — tak payah urus EC2 firewall sendiri',
              'Dua engine: stateless (macam NACL, priority order, first match) + stateful (Suricata-compatible rules, nilai ikut traffic flow)',
              'Stateful rules support pass / drop / reject / alert + domain-list filtering (TLS SNI / HTTP host) untuk allow/block domain',
              'Deploy dalam dedicated firewall subnet; route table hantar traffic VPC melaluinya (selalu pakai centralized inspection VPC + Transit Gateway)',
              'Network Firewall = traffic VPC (Layer 3-7). WAF = HTTP request je (Layer 7 web). Jangan keliru bila soalan sebut "domain filtering / egress" → Network Firewall',
            ],
            docs: [
              { label: 'Network Firewall rules engines', url: 'https://docs.aws.amazon.com/network-firewall/latest/developerguide/firewall-rules-engines.html' },
              { label: 'Stateful rule groups (Suricata)', url: 'https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-ips.html' },
            ],
            keywords: ['deep packet inspection', 'stateful', 'stateless', 'VPC-level', 'intrusion prevention', 'IDS/IPS', 'domain filtering', 'Suricata', 'egress filtering', 'firewall subnet', 'managed firewall'],
          },
          {
            shortName: 'VPC Flow Logs',
            fullName: 'VPC Flow Logs',
            ingat: '"CCTV network VPC — log SIAPA cakap dengan SIAPA, bukan APA dia cakap"',
            gunaUntuk: 'Capture IP traffic metadata to/from ENIs — troubleshoot SG/NACL, security analysis, compliance',
            fungsi: 'Rakam METADATA traffic (srcaddr, dstaddr, src/dst port, protocol, packets, bytes, action ACCEPT/REJECT, log-status) untuk traffic masuk/keluar network interfaces — BUKAN isi packet (payload). Boleh enable pada 3 level: VPC (semua ENI), Subnet, atau satu ENI. Dihantar ke CloudWatch Logs, S3, atau Data Firehose. Dikumpul DI LUAR path network → tiada kesan pada throughput/latency.',
            diagram: {
              label: 'Flow Logs anatomy',
              steps: [
                { nodes: [
                  { label: 'VPC', sub: 'all ENIs', tone: 'c4' },
                  { label: 'Subnet', tone: 'c4' },
                  { label: 'ENI', sub: 'single', tone: 'c4' },
                ] },
                { nodes: [{ label: 'Flow Log', sub: 'metadata only', tone: 'c3' }] },
                { nodes: [
                  { label: 'CloudWatch Logs', sub: 'alarm / Insights', tone: 'c2' },
                  { label: 'S3', sub: 'archive + Athena', tone: 'c2' },
                  { label: 'Data Firehose', sub: 'stream', tone: 'c2' },
                ] },
              ],
              caption: 'Pilih level capture (VPC/Subnet/ENI) → Flow Log rakam metadata → hantar ke salah satu dari 3 destinations. Field action = ACCEPT atau REJECT → ini yang tolong jawab "kenapa traffic tak sampai".',
            },
            scenario: '"EC2 dalam private subnet tak boleh terima traffic, nak tahu SG atau NACL yang block" → enable VPC Flow Logs, cari record dengan action = REJECT. Inbound REJECT = sesuatu blocking. Nak actual packet content (IDS/forensics deep inspection)? → Traffic Mirroring, BUKAN Flow Logs.',
            compare: {
              label: 'Flow Logs vs Traffic Mirroring',
              headers: ['Aspect', 'VPC Flow Logs', 'Traffic Mirroring'],
              rows: [
                ['Captures', '🟢 Metadata only (headers, ACCEPT/REJECT)', 'Full packet content (payload)'],
                ['Use for', 'Troubleshoot SG/NACL, security analysis, compliance', 'Deep inspection — IDS/IPS, packet forensics'],
                ['Destination', 'CloudWatch Logs, S3, Data Firehose', 'Monitoring appliance (ENI / NLB)'],
                ['Cost/overhead', '🟢 Low, outside traffic path', 'Higher — copies real traffic'],
                ['Exam keyword', '"which rule blocked", "REJECT", "audit flows"', '"packet capture", "payload", "IDS/IPS"'],
              ],
              takeaway: 'Nak tau traffic kena ACCEPT/REJECT (siapa→siapa) → Flow Logs. Nak baca actual packet content (apa dalam packet) → Traffic Mirroring.',
            },
            tips: [
              'Rakam METADATA sahaja, bukan packet payload. Nak isi packet → Traffic Mirroring (Nitro instances)',
              '3 capture levels: VPC (auto semua ENI termasuk yang baru), Subnet, atau single ENI',
              '3 destinations: CloudWatch Logs (alarm + Logs Insights query), S3 (murah, archive, query guna Athena), Data Firehose (stream ke OpenSearch/Splunk)',
              'action field = ACCEPT atau REJECT. "Traffic tak sampai instance, SG ke NACL block?" → cari REJECT records dalam Flow Logs',
              'SG stateful: kalau inbound dibenarkan, return traffic auto-allow. NACL stateless: kena allow inbound DAN outbound rule berasingan — Flow Logs boleh tunjuk satu arah ACCEPT, arah balik REJECT (petunjuk NACL)',
              'Immutable: tak boleh edit config/format selepas create — kena delete & buat baru',
              'Tiada data sampai ada active traffic pada ENI/subnet/VPC yang dipilih',
              'Aggregation interval: max 10 minit atau 1 minit (Nitro-based instances SELALU ≤1 minit)',
              'TIDAK log: Amazon DNS server traffic, instance metadata (169.254.169.254), Time Sync (169.254.169.123), DHCP, Windows license activation, ARP, default VPC router reserved IP',
              'Source utama untuk GuardDuty threat detection + Amazon Detective investigation',
              'Tak boleh enable Flow Logs untuk peered VPC melainkan peer VPC dalam account yang sama',
            ],
            docs: [
              { label: 'VPC Flow Logs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html' },
              { label: 'Flow log limitations', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-limitations.html' },
            ],
            keywords: ['VPC Flow Logs', 'network monitoring', 'ACCEPT', 'REJECT', 'metadata', 'CloudWatch Logs', 'S3', 'Data Firehose', 'Athena', 'troubleshoot SG NACL', 'security analysis', 'Traffic Mirroring', 'aggregation interval', 'ENI', 'subnet level', 'GuardDuty source'],
          },
          {
            shortName: 'GuardDuty',
            fullName: 'Amazon GuardDuty',
            ingat: '"Mata-mata AWS — detect threats auto guna ML"',
            gunaUntuk: 'Automated threat detection: crypto-mining, unusual API calls, compromised instances',
            fungsi: 'Pengesanan ancaman menggunakan ML pada CloudTrail, VPC Flow Logs, DNS logs.',
            scenario: '"EC2 buat unusual API calls ke cryptocurrency mining" → GuardDuty detect and alert. Tak perlu install agents.',
            mermaid: {
              label: 'Pilih security service yang betul',
              source: `flowchart TD
  A[Apa masalah security?] --> B{Jenis?}
  B -->|Detect ancaman dari logs| C[GuardDuty<br/>ML, CloudTrail/VPC Flow/DNS]
  B -->|Scan vuln/CVE software| D[Inspector<br/>EC2 ECR Lambda]
  B -->|Cari PII/sensitive data| E[Macie<br/>S3 je]
  B -->|Siasat root cause finding| F[Detective<br/>behavior graph]
  B -->|Pusat semua findings + compliance| G[Security Hub<br/>aggregate + standards]`,
              caption: 'Detect dari logs → GuardDuty. CVE/patch → Inspector. PII dalam S3 → Macie. Siasat selepas detect → Detective. Satu dashboard untuk semua + check compliance → Security Hub.',
            },
            compare: {
              label: 'Threat-detection family — 5 yang selalu keliru',
              headers: ['Service', 'What it does', 'Data / target', 'Keyword'],
              rows: [
                ['GuardDuty', 'Threat detection (ML)', 'CloudTrail, VPC Flow, DNS logs', 'unusual activity, crypto-mining, compromised'],
                ['Inspector', 'Vulnerability scan', 'EC2, ECR images, Lambda', 'CVE, patch, vulnerability'],
                ['Macie', 'Sensitive-data discovery', 'S3 objects', 'PII, credit card, GDPR, S3'],
                ['Detective', 'Investigate / root cause', 'GuardDuty findings + logs (graph)', 'investigate, root cause, behavior graph'],
                ['Security Hub', 'Aggregate + compliance', 'Findings dari GD/Inspector/Macie + standards', 'central dashboard, posture, CIS/PCI standards'],
              ],
              takeaway: 'Threats from logs → GuardDuty. Software vulns/CVEs → Inspector. PII in S3 → Macie. Investigate a finding → Detective. ONE place untuk semua finding + compliance score → Security Hub.',
            },
            tips: [
              'GuardDuty → detect threats (SIEM-like). Detective → investigate findings (forensics). Ingat: GD = detect, Detective = investigate',
              'GuardDuty findings integrate dengan Security Hub untuk centralized view',
              'Foundational threat detection (CloudTrail MANAGEMENT events) ON by default bila GuardDuty enabled — TAK boleh disable. ListBuckets/DeleteBucket = management events, bukan data events',
              'S3 Protection (optional, enable berasingan): monitor CloudTrail DATA events untuk S3 — object-level ops (GetObject, PutObject, DeleteObject, ListObjects) untuk detect data exfiltration/destruction. Tak perlu manually configure S3 data event logging dalam CloudTrail',
              'Security Hub = aggregator/CSPM (kumpul finding GuardDuty + Inspector + Macie + run compliance standards). Bukan dia yang detect — dia central dashboard. Cross-Region aggregation pun ada',
            ],
            keywords: ['threat detection', 'ML', 'CloudTrail logs', 'VPC Flow Logs', 'no agents', 'findings', 'S3 Protection', 'management events', 'data events', 'object-level API', 'Security Hub', 'Detective', 'CSPM'],
          },
          {
            shortName: 'Detective',
            fullName: 'Amazon Detective',
            ingat: '"Siasatan selepas GuardDuty detect — forensics AWS"',
            gunaUntuk: 'Investigate and analyze security findings from GuardDuty, Security Hub, Macie',
            fungsi: 'Amazon Detective automatically collects log data (CloudTrail, VPC Flow Logs, GuardDuty findings) dan guna ML/graph analysis untuk visualize security investigations. Bagi timeline, entity relationships, dan root cause analysis.',
            scenario: '"GuardDuty flagged suspicious EC2 activity — siasatan lanjut untuk faham scope dan root cause" → Amazon Detective.',
            tips: [
              'Detective = POST-INCIDENT investigation tool. GuardDuty = REAL-TIME threat detection',
              'Detective guna behavior graph — visualize relationships antara AWS resources masa incident',
              'Sources: CloudTrail, VPC Flow Logs, GuardDuty findings, EKS audit logs',
              'Exam: "investigate GuardDuty findings, understand root cause, visualize attack" → Amazon Detective',
              'Bukan Inspector (vulnerability scan). Bukan GuardDuty (active detection). Detective = forensics',
            ],
            keywords: ['security investigation', 'forensics', 'GuardDuty findings', 'root cause', 'behavior graph', 'post-incident'],
          },
          {
            shortName: 'Inspector',
            fullName: 'Amazon Inspector',
            ingat: '"Scanner kelemahan — CVE/vuln untuk EC2, ECR, Lambda (continuous, automatic)"',
            gunaUntuk: 'Find OS/software vulnerabilities, CVEs, unintended network exposure in EC2, ECR images, Lambda',
            fungsi: 'Pengimbasan kelemahan automatik dan BERTERUSAN untuk EC2, ECR container images, dan Lambda. Detect CVEs, OS + programming-language package vulnerabilities, dan unintended network exposure / network reachability. Auto re-scan bila CVE baru keluar atau image/function berubah. Aktif sekali → semua scan type auto-on (Lambda code scanning optional).',
            scenario: '"Audit EC2 instances untuk known CVEs dan security misconfigurations" → Amazon Inspector. "Scan container image dalam ECR sebelum deploy untuk vulnerability" → Inspector ECR scanning. Bukan GuardDuty (yang untuk active threats dari logs).',
            tips: [
              'Inspector = vulnerability/CVE scan (software lemah). GuardDuty = threat detection (aktiviti jahat dari logs). Beza ni THE exam trap',
              '3 target: EC2, ECR container images, Lambda functions. Aktif sekali → auto enroll semua (Lambda CODE scanning optional, enable bila-bila)',
              'EC2 scan guna SSM agent ATAU EBS snapshot (agentless/hybrid mode) — detect CVE, OS + language package vuln, dan network reachability',
              'CONTINUOUS, bukan one-off — auto re-scan bila ada CVE baru atau resource berubah, generate findings',
              'Findings boleh push ke Security Hub + EventBridge untuk automated remediation',
              'Bukan Macie (PII dalam S3). Bukan Detective (siasat finding). Inspector = "apa software aku ada known vulnerability?"',
            ],
            docs: [
              { label: 'Amazon Inspector scan types', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning-resources.html' },
            ],
            keywords: ['vulnerability scanning', 'CVE', 'EC2', 'ECR', 'Lambda', 'continuous', 'network reachability', 'package vulnerability', 'automated', 'security findings', 'SSM agent', 'agentless'],
          },
          {
            shortName: 'Macie',
            fullName: 'Amazon Macie',
            ingat: '"Pemburu data sensitif dalam S3 — ML scan PII, credentials, financial data"',
            gunaUntuk: 'Discover and protect sensitive data in S3: PII, credentials, financial data, compliance',
            fungsi: 'Macie adalah data security service yang guna machine learning dan pattern matching untuk discover sensitive data dalam S3. Ia maintain inventory semua S3 buckets, monitor access control, dan alert bila bucket jadi publicly accessible atau ada sensitive data terdetect.',
            scenario: '"Audit S3 buckets untuk cari data sensitif yang ter-upload secara tak sengaja" → Amazon Macie. Keyword: PII, sensitive data, S3 data discovery.',
            tips: [
              'Macie KHUSUS untuk S3 — bukan untuk RDS, EBS, atau services lain',
              'Detect: PII (nama, IC, passport), financial data (credit card), credentials, intellectual property',
              'Dua jenis discovery: (1) Automated sensitive data discovery — continuous sampling. (2) Sensitive data discovery jobs — targeted, scheduled',
              'Macie generate dua jenis findings: Policy findings (bucket jadi public/misconfigured) + Sensitive data findings (PII found in object)',
              'Integrate dengan EventBridge dan Security Hub untuk automated remediation workflow',
              'Exam: "detect PII or sensitive data accidentally uploaded to S3" → Amazon Macie. Bukan GuardDuty (threats), bukan Inspector (vulnerabilities)',
            ],
            keywords: ['PII detection', 'sensitive data', 'S3', 'ML-based', 'data privacy', 'GDPR', 'data discovery', 'policy findings'],
          },
          {
            shortName: 'Penetration Testing',
            fullName: 'AWS Penetration Testing Policy',
            ingat: '"AWS bagi pentest 8 services — tak perlu minta kebenaran dulu"',
            gunaUntuk: 'Understand AWS policy on security testing and acceptable use',
            fungsi: 'AWS membenarkan customers jalankan security assessments dan penetration tests terhadap AWS infrastructure mereka TANPA kelulusan awal untuk 8 services: EC2, RDS, CloudFront, Aurora, API Gateway, Lambda, Lightsail, Elastic Beanstalk. Aktiviti yang DILARANG: DoS/DDoS simulation, DNS zone walking, port/protocol/request flooding.',
            scenario: '"What is AWS position on penetration testing?" → AWS allow pentest on SOME resources WITHOUT prior authorization. Bukan semua resources, bukan tiada langsung — 8 services spesifik sahaja.',
            tips: [
              'AWS MEMBENARKAN pentest pada 8 services tanpa perlu minta approval — ini exam trick, ramai sangka kena minta dulu',
              'Yang DILARANG: DoS/DDoS simulation, DNS zone walking, port flooding — semua ini violate AUP',
              'SALAH: "AWS tak benarkan pentest langsung" — salah, AWS memang bagi untuk services tertentu',
              'SALAH: "Boleh pentest SEMUA resources" — salah, ada services yang tidak dibenarkan',
              'AWS Acceptable Use Policy (AUP) = dokumen yang define apa yang boleh dan tak boleh buat kat AWS',
            ],
            docs: [{ label: 'AWS Penetration Testing', url: 'https://aws.amazon.com/security/penetration-testing/' }],
            keywords: ['penetration testing', 'pentest', 'security assessment', 'AUP', 'Acceptable Use Policy', 'no prior approval', '8 services'],
          },
        ],
      },
      {
        id: 'd1-data',
        icon: '🔐',
        title: 'Data Protection',
        category: 'd1data',
        services: [
          {
            shortName: 'KMS',
            fullName: 'AWS Key Management Service',
            ingat: '"Simpan dan urus kunci enkripsi"',
            gunaUntuk: 'Encrypt data at rest, manage encryption keys',
            fungsi: 'Mencipta dan mengurus cryptographic keys untuk encrypt/decrypt data di pelbagai AWS services',
            contohGuna: 'Encrypt S3, RDS, EBS — enable SSE-KMS. Semua penggunaan key di-audit dalam CloudTrail. KMS key rotation auto setahun sekali',
            tips: [
              'Symmetric KMS keys: satu 256-bit key untuk encrypt + decrypt; never leaves KMS unencrypted; AWS services pakai symmetric',
              'Asymmetric KMS keys: public/private key pair; untuk digital signing atau asymmetric encryption; hanya public key boleh export',
              'For digital signing (only sender signs): Asymmetric. For transparent encrypt+decrypt (no own/manage): Symmetric AWS managed key',
              'Multi-Region KMS keys: replicated across regions, same key material — elak cross-region API calls, reduce latency untuk global apps',
              'KMS key policy + VPC endpoint: guna condition "aws:SourceVpce" (endpoint ID) bukan "aws:SourceVpc" (VPC ID) untuk least-privilege',
              '3 jenis KMS key: (1) AWS Owned keys — fully managed by AWS, free, tak boleh view/manage/audit langsung. (2) AWS Managed keys (aws/service-name) — dalam account anda tapi RESTRICTED kepada satu service, rotation automatic (anual), TAK boleh customize policy/rotation. (3) Customer Managed Keys (CMK) — FULL control: custom key policy, manual/auto rotation, enable/disable, audit penuh dalam CloudTrail',
              'Exam trick: "comprehensive lifecycle management, key rotation, auditing & access control" = ciri CUSTOMER Managed Key (CMK), BUKAN AWS Managed Key — AWS Managed Key tak boleh di-customize oleh user',
            ],
            compare: {
              label: 'KMS vs CloudHSM',
              headers: ['Aspect', 'AWS KMS', 'AWS CloudHSM'],
              rows: [
                ['Tenancy', 'Multi-tenant, shared (AWS managed)', '🟢 Single-tenant, dedicated hardware'],
                ['Who controls keys', 'AWS manages HSM; you manage key policy', '🟢 You fully control — AWS cannot access'],
                ['FIPS 140-2', 'Level 2 (overall)', '🟢 Level 3'],
                ['Key types', 'Symmetric + asymmetric, AWS service integration', 'Symmetric + asymmetric, your own crypto (PKCS#11, JCE)'],
                ['Effort', '🟢 Low — fully managed', 'High — you manage cluster, users, backups'],
                ['Use when', 'Default encryption for S3/RDS/EBS, easy & cheap', 'Regulatory need for dedicated HW + exclusive control'],
              ],
              takeaway: '"Customer-exclusive control / dedicated hardware / FIPS 140-2 Level 3" → CloudHSM. Anything else (normal encrypt-at-rest for AWS services) → KMS. KMS boleh guna CloudHSM sebagai custom key store kalau perlu both.',
            },
            mermaid: {
              label: 'Pilih KMS key type yang betul',
              source: `flowchart TD
  A[Nak encrypt / manage key] --> B{Perlu dedicated hardware<br/>FIPS 140-2 Level 3<br/>exclusive control?}
  B -->|Ya| C[CloudHSM<br/>single-tenant HSM]
  B -->|Tidak| D{Digital signing /<br/>asymmetric encryption?}
  D -->|Ya| E[Asymmetric CMK<br/>public/private key pair]
  D -->|Tidak, symmetric| F{Perlu control penuh:<br/>custom policy, rotation, audit?}
  F -->|Ya| G[Customer Managed Key CMK]
  F -->|Tak, terhad satu service| H[AWS Managed Key<br/>aws/service-name]
  F -->|Langsung tak nak urus| I[AWS Owned Key<br/>free, tak boleh audit]`,
              caption: 'Dedicated HW + FIPS Level 3 + kawalan eksklusif → CloudHSM. Sign/asymmetric → Asymmetric CMK. Nak custom policy + rotation + audit penuh → Customer Managed Key. Terhad satu service, tak nak customize → AWS Managed Key. Zero management → AWS Owned Key.',
            },
            keywords: ['encryption at rest', 'CMK', 'key rotation', 'SSE-KMS', 'envelope encryption', 'CloudTrail audit', 'asymmetric keys', 'digital signing', 'multi-region keys', 'aws:SourceVpce', 'CloudHSM', 'FIPS 140-2', 'single-tenant', 'custom key store'],
          },
          {
            shortName: 'Secrets Manager',
            fullName: 'AWS Secrets Manager',
            ingat: '"Simpan password apps, auto-rotate"',
            gunaUntuk: 'Store dan auto-rotate credentials, API keys, DB passwords',
            fungsi: 'Menyimpan, mendapatkan semula dan memutar rahsia secara automatik tanpa perlu update aplikasi',
            contohGuna: 'Lambda function perlu DB password — jangan letak dalam env var atau code. Store dalam Secrets Manager, Lambda retrieve masa runtime. Auto-rotate setiap 30 hari',
            compare: {
              label: 'Secrets Manager vs Parameter Store',
              headers: ['Aspect', 'Secrets Manager', 'SSM Parameter Store'],
              rows: [
                ['Built for', 'Secrets (DB creds, API keys, OAuth tokens)', 'Config data + secrets (AMI IDs, license codes, passwords)'],
                ['Auto-rotation', '🟢 Built-in (Lambda, scheduled)', 'No native rotation (boleh reference Secrets Manager)'],
                ['Cost', 'Paid per secret + per API call', '🟢 Standard tier free (Advanced tier paid)'],
                ['Encryption', 'Always KMS-encrypted', 'Plaintext (String) or KMS (SecureString)'],
                ['Cross-region replicate', '🟢 Yes, built-in', 'No (per-region)'],
                ['Use when', 'Rotate DB creds automatically, RDS/Redshift integration', 'Store config cheaply, occasional secrets, hierarchy'],
              ],
              takeaway: '"Auto-rotate database credentials" → Secrets Manager. "Cheap/free config + plain parameters, no rotation needed" → Parameter Store. Parameter Store boleh reference Secrets Manager secrets via /aws/reference/secretsmanager.',
            },
            docs: [
              { label: 'Secrets Manager vs Parameter Store', url: 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.secrets.Secrets-Manager-and-Parameter-Store.html' },
            ],
            keywords: ['auto-rotation', 'credentials', 'API keys', 'no hardcoded secrets', 'Lambda integration', 'Parameter Store', 'SecureString', 'cross-region replication', 'KMS'],
          },
          {
            shortName: 'S3 Object Lock',
            fullName: 'Amazon S3 Object Lock',
            ingat: '"Lock file — tak boleh delete atau ubah (WORM)"',
            gunaUntuk: 'WORM compliance, prevent deletion/modification',
            fungsi: 'Menghalang objek S3 dari dipadam atau di-overwrite untuk tempoh tetap (retention period) atau selamanya (legal hold) — WORM model untuk pematuhan kawal selia. WAJIB Versioning ON pada bucket.',
            contohGuna: 'Financial records kena simpan 7 tahun tak boleh diubah — enable Object Lock Compliance mode + retention period 7 tahun. Governance mode untuk internal policy yang admin boleh override.',
            scenario: '"Records mesti immutable, takde sesiapa termasuk root boleh padam dalam tempoh retention" → Compliance mode. "Admin tertentu masih perlu boleh override/padam" → Governance mode (perlu s3:BypassGovernanceRetention). "Hold tanpa tarikh tamat sampai siasatan selesai" → Legal Hold.',
            compare: {
              label: 'Compliance vs Governance vs Legal Hold',
              headers: ['Aspect', 'Compliance mode', 'Governance mode', 'Legal Hold'],
              rows: [
                ['Siapa boleh padam/ubah', '🟢 TIADA sesiapa — termasuk root account', 'Hanya user dengan s3:BypassGovernanceRetention', 'TIADA sampai legal hold di-remove'],
                ['Boleh shorten retention?', 'Tidak — mode & period tak boleh dikurangkan', 'Boleh, kalau ada bypass permission', 'Takde retention period — no expiry'],
                ['Ada tarikh tamat?', '🟢 Ya, Retain Until Date', 'Ya, Retain Until Date', '❌ Kekal sampai di-remove manual'],
                ['Cara override', 'Mustahil (satu-satunya jalan: tutup AWS account)', 'x-amz-bypass-governance-retention:true + permission', 's3:PutObjectLegalHold untuk remove'],
                ['Guna bila', 'Regulatory ketat (SEC 17a-4, FINRA, CFTC)', 'Internal policy, test retention dulu', 'Litigation / siasatan, tempoh tak tentu'],
              ],
              takeaway: '"Tak boleh padam langsung walau root" → Compliance. "Admin masih boleh override bila perlu" → Governance. "Hold tanpa tarikh tamat" → Legal Hold. Semua mode WAJIB Versioning ON dulu.',
            },
            tips: [
              'Object Lock WAJIB ada S3 Versioning ON — kalau soalan kata versioning off, enable dulu',
              'Compliance mode: SATU-SATUNYA cara padam sebelum retention tamat = tutup AWS account. Root pun tak boleh',
              'Governance mode: override perlu DUA benda — permission s3:BypassGovernanceRetention + header x-amz-bypass-governance-retention:true',
              'Legal Hold = TAKDE expiry, independent dari retention period. Boleh ada legal hold + retention period serentak',
              'Retention period boleh EXTEND (Retain Until Date lebih lewat) tapi tak boleh shorten dalam compliance mode',
              'Exam: "WORM untuk SEC/FINRA, mutlak tak boleh ubah" → Compliance. "Hold dokumen untuk litigation, tak tahu bila habis" → Legal Hold',
            ],
            docs: [{ label: 'S3 Object Lock overview', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html' }],
            keywords: ['WORM', 'compliance', 'retention period', 'Governance mode', 'Compliance mode', 'legal hold', 'versioning required', 'BypassGovernanceRetention', 'immutable', 'SEC 17a-4', 'FINRA', 'Retain Until Date'],
          },
          {
            shortName: 'S3 Glacier Vault',
            fullName: 'Amazon S3 Glacier Vault Lock & Access Policy',
            ingat: '"Vault Lock = immutable compliance. Vault Access Policy = mutable access control"',
            gunaUntuk: 'WORM compliance for Glacier archives — enforce retention policies that cannot be changed',
            fungsi: 'Dua policies berbeza: (1) Vault Lock Policy = IMMUTABLE selepas locked, enforce compliance controls (WORM, retention). Cannot be changed. (2) Vault Access Policy = MUTABLE, untuk access control (siapa boleh access). Untuk compliance = Vault Lock. Nota: Glacier vault (standalone) sekarang legacy — AWS galak guna S3 Glacier storage classes untuk arkib baru.',
            scenario: '"Lock retention policy supaya takde sesiapa boleh ubah/padam archive untuk compliance" → Vault Lock Policy. "Grant business partner read access yang boleh berubah-ubah" → Vault Access Policy. "Legal hold tanpa tarikh tamat" → BUKAN Glacier, itu S3 Object Lock feature.',
            compare: {
              label: 'Vault Lock Policy vs Vault Access Policy',
              headers: ['Aspect', 'Vault Lock Policy', 'Vault Access Policy'],
              rows: [
                ['Boleh ubah lepas set?', '❌ IMMUTABLE selepas locked', '🟢 MUTABLE — boleh ubah bila-bila'],
                ['Tujuan', 'Compliance / WORM / retention enforcement', 'Access control biasa (siapa boleh access)'],
                ['Proses set', '2 langkah: initiate (in-progress) → complete dalam 24 jam', 'Terus attach, no lock step'],
                ['Boleh test dulu?', '🟢 Ya — 24 jam in-progress window untuk validate sebelum complete', 'N/A — boleh edit bila-bila'],
                ['Guna bila', 'Regulatory retention, deny deletes', 'Temporary / kerap berubah, grant reads'],
              ],
              takeaway: '"Compliance, retention, tak boleh diubah lagi" → Vault Lock Policy. "Access control yang fleksibel/sementara" → Vault Access Policy. Boleh guna kedua-dua serentak (Lock deny deletes + Access grant reads).',
            },
            tips: [
              'Vault Lock Policy: IMMUTABLE once locked — enforce WORM, retention periods, tag-based deny. Cannot be modified or deleted',
              'Vault Access Policy: MUTABLE — for access control only. Can be changed anytime',
              'Lock process 2 langkah: (1) initiate → in-progress state + lock ID, ada 24 JAM untuk test/validate; (2) complete guna lock ID. Tak complete dalam 24 jam → policy auto-deleted',
              'Best practice: create vault → complete Vault Lock policy → baru upload archives, supaya policy apply pada semua',
              'For compliance/retention requirements → always Vault Lock Policy, BUKAN Vault Access Policy',
              '"Set a legal hold" bukan Glacier Vault feature — legal hold ialah S3 Object Lock feature',
              'Exam: "prevent deletion of archives, compliance, WORM" → Vault Lock Policy + set retention period',
            ],
            docs: [{ label: 'Glacier Vault Lock', url: 'https://docs.aws.amazon.com/amazonglacier/latest/dev/vault-lock.html' }],
            keywords: ['Vault Lock', 'Vault Access Policy', 'WORM', 'compliance', 'immutable', 'retention', 'Glacier archive', 'in-progress state', '24-hour window', 'lock ID', 'two-step lock'],
          },
          {
            shortName: 'Amazon Redshift',
            fullName: 'Amazon Redshift — Encryption & DataShare',
            ingat: '"Data warehouse — KMS untuk at rest, SSL untuk in transit, DataShare untuk cross-account"',
            gunaUntuk: 'Encrypt data warehouse at rest (KMS) and in transit (SSL); share data cross-account via DataShare',
            fungsi: 'Redshift menyimpan data secara terenkripsi menggunakan KMS (AES-256) untuk data at rest. SSL/TLS encrypt data in transit antara client dan cluster. Redshift TIDAK guna EBS — ia manage storage sendiri. Redshift DataShare membenarkan cross-account data sharing tanpa ETL atau data duplication.',
            scenario: '"Encrypt unencrypted Redshift data at rest" → Enable KMS. At rest ≠ in transit. Moving cluster to private subnet = network security, bukan encryption.',
            tips: [
              'KMS = encrypt DATA AT REST (stored on disk)',
              'SSL/TLS = encrypt DATA IN TRANSIT (network)',
              'Redshift tidak guna EBS — cannot encrypt via EBS',
              'Private subnet = network isolation, BUKAN encryption',
              'Redshift DataShare: share live data cross-account TANPA export/ETL/duplication — QA account boleh query production data secara langsung',
              'DataShare vs S3 export: DataShare = live, no copy, secure. S3 export = snapshot, kena sync semula, extra cost',
              'Exam: "separate AWS account needs analytics access to Redshift, no ETL, no duplication" → Redshift DataShare',
              'AQUA (Advanced Query Accelerator): distributed cache yang bawa computation dekat ke storage dalam Redshift',
              'AQUA offload data-intensive query processing — reduce CPU dan network bottlenecks pada compute nodes',
              'Available pada Redshift ra3 instances, no extra charge. Bukan Redshift Spectrum (yang query external S3 data)',
              'Exam: "improve Redshift query performance, minimize cost and overhead" → AQUA (bukan ElastiCache atau Spectrum)',
            ],
            docs: [{ label: 'Redshift Encryption', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-db-encryption.html' }],
            keywords: ['Redshift', 'KMS', 'encryption at rest', 'SSL TLS', 'in transit', 'AES-256', 'data warehouse', 'DataShare', 'cross-account analytics', 'no ETL', 'AQUA', 'query accelerator', 'ra3'],
          },
          {
            shortName: 'CloudTrail',
            fullName: 'AWS CloudTrail',
            ingat: '"CCTV untuk semua API calls AWS"',
            gunaUntuk: 'Audit who did what and when — compliance, forensics, account activity',
            fungsi: 'Merekod setiap API call dalam AWS account: siapa buat, bila, dari mana, apa hasilnya. Default simpan 90 hari. Boleh hantar ke S3 untuk long-term retention.',
            contohGuna: 'Security team nak tau siapa delete S3 bucket semalam — CloudTrail log ada: user, timestamp, source IP, action.',
            scenario: '"Who deleted this resource?", "compliance audit log of all API activity" → CloudTrail. Bukan CloudWatch (yang untuk metrics/logs dari apps). CloudTrail = WHO DID WHAT. CloudWatch = WHAT IS HAPPENING NOW.',
            tips: [
              'CloudTrail Lake: managed data lake untuk CloudTrail events. SQL queries DIRECT dalam console — tanpa export ke S3 atau setup Athena',
              'CloudTrail Lake stores events up to 7 years. Standard CloudTrail = 90 days (kena export ke S3 untuk long-term)',
              'Exam: "query activity logs without exporting to external tools" atau "long-term retention + queryable interface" → CloudTrail Lake',
              'Management Events (Control Plane): merekod MANAGEMENT OPERATIONS pada resources — CreateBucket, TerminateInstances, AttachRolePolicy, CreateTrail etc. ENABLED BY DEFAULT untuk semua Trails.',
              'Data Events (Data Plane): merekod data-level operations — S3 object-level (GetObject, PutObject, DeleteObject) dan Lambda function invocations. TIDAK enabled by default — perlu explicitly enable, ada additional cost.',
              'Setting up CloudTrail itself (CreateTrail) = management event. CloudTrail writing log files to S3 = BUKAN data event — itu management event (PutObject dari CloudTrail service).',
              'Console-created Trail applies to ALL REGIONS by default (multi-region trail). CloudTrail Events dari semua regions dihantar ke satu S3 bucket.',
              'Insight Events: detect unusual API activity patterns (e.g. sudden spike in EC2 TerminateInstances calls). Optional, additional cost.',
              'Exam: "S3 object download activity logging" → CloudTrail data events (not management events). "Who created this IAM role?" → CloudTrail management events (default logging).',
            ],
            compare: {
              label: 'CloudTrail vs CloudWatch vs Config',
              headers: ['Aspect', 'CloudTrail', 'CloudWatch', 'AWS Config'],
              rows: [
                ['Question it answers', 'WHO did WHAT? (API calls)', 'WHAT is happening NOW? (metrics/logs)', 'Is config COMPLIANT & what CHANGED?'],
                ['Records', 'Every API call (user, time, IP, action)', 'Metrics, logs, alarms, dashboards', 'Resource config snapshots over time'],
                ['Main use', 'Audit, forensics, compliance trail', 'Monitoring, alerting, troubleshooting', 'Compliance rules, config history, drift'],
                ['Triggers on', 'API activity', 'Threshold breach → alarm/action', 'Config change → rule evaluation'],
                ['Keyword', '"who deleted…", "audit log of API"', '"alarm when CPU > 80%", "log metrics"', '"is this resource compliant", "config drift"'],
              ],
              takeaway: 'CloudTrail = WHO DID WHAT (API audit). CloudWatch = WHAT IS HAPPENING NOW (metrics/alarms). Config = IS IT COMPLIANT + WHAT CHANGED (resource state history). Soalan sebut "compliance + configuration over time" → Config, bukan CloudTrail.',
            },
            mermaid: {
              label: 'CloudTrail vs CloudWatch vs Config — pilih ikut soalan',
              source: `flowchart TD
  A[Soalan tanya apa?] --> B{Fokus soalan?}
  B -->|Siapa buat apa<br/>API audit, forensics| C[CloudTrail<br/>who did what, when]
  B -->|Apa berlaku sekarang<br/>metrics, alarm, logs| D[CloudWatch<br/>monitoring + alerting]
  B -->|Resource compliant?<br/>apa config berubah?| E[AWS Config<br/>config history + drift]`,
              caption: '"Who deleted / audit log of API calls" → CloudTrail. "Alarm bila CPU > 80%, monitor logs" → CloudWatch. "Is this resource compliant, what changed over time, config drift" → AWS Config.',
            },
            keywords: ['API audit', 'who did what', 'compliance', 'forensics', 'account activity', '90-day retention', 'CloudTrail Lake', 'SQL query', 'long-term retention', '7 years', 'management events', 'data events', 'control plane', 'data plane', 'S3 object-level', 'Lambda invocations', 'multi-region trail', 'Insight Events', 'vs CloudWatch', 'vs Config'],
          },
          {
            shortName: 'ACM',
            fullName: 'AWS Certificate Manager',
            ingat: '"SSL cert percuma untuk HTTPS"',
            gunaUntuk: 'Provision free SSL/TLS certificates for ALB, CloudFront, API Gateway',
            fungsi: 'Menyediakan, mengurus dan auto-renew SSL/TLS certificates secara percuma. Attach terus ke ALB, CloudFront, atau API Gateway. Cert tidak boleh di-export dari ACM untuk install sendiri dalam EC2.',
            scenario: '"Website perlu HTTPS" → request ACM cert, attach ke ALB atau CloudFront (free). Ingat: ACM certs tak boleh export untuk pakai dalam EC2 sendiri — untuk tu kena beli cert luar.',
            tips: [
              'ACM auto-renews certs HANYA bila DNS validation digunakan. Email-validated certs = kena manual re-validate semasa renewal → status "Pending Validation"',
              'Exam trap: "ACM manages renewal automatically" adalah HANYA betul untuk DNS-validated certs. Email validation = manual action required',
              'ACM certs cannot be exported/installed on EC2 directly — for EC2, buy third-party cert or use ACM with ALB/CloudFront',
            ],
            keywords: ['SSL', 'TLS', 'HTTPS', 'free certificate', 'auto-renewal', 'ALB', 'CloudFront', 'API Gateway', 'DNS validation', 'email validation', 'pending validation'],
          },
          {
            shortName: 'CloudHSM',
            fullName: 'AWS CloudHSM',
            ingat: '"KMS tapi kau fully control dedicated hardware"',
            gunaUntuk: 'FIPS 140-2 Level 3 compliance, customer-exclusive HSM hardware',
            fungsi: 'Hardware Security Module yang dedicated untuk kau sahaja — bukan shared infrastructure macam KMS. Kau control dan manage keys sendiri. AWS tak boleh access keys kau.',
            scenario: '"Compliance requires customer-exclusive control of encryption keys with dedicated hardware" → CloudHSM. Bukan KMS (KMS = shared, AWS-managed). CloudHSM = dedicated hardware, kau control. KMS = multi-tenant, AWS managed. FIPS 140-2 Level 3 = CloudHSM. Level 2 = KMS.',
            tips: [
              'Transparent Data Encryption (TDE) support: Oracle RDS + CloudHSM = supported. SQL Server RDS + CloudHSM = NOT directly supported',
              'Single-tenant HSM requirement + TDE + RDS → use Oracle on RDS with CloudHSM integration',
              'Backup mechanism: EBK (Ephemeral Backup Key) encrypts the HSM data; PBK (Persistent Backup Key) encrypts the EBK — encrypted backup stored in S3 in the SAME region as the cluster',
              'Cross-region backup: must explicitly copy the S3 backup to another region — not automatic',
            ],
            keywords: ['dedicated HSM', 'FIPS 140-2 Level 3', 'customer control', 'single-tenant', 'hardware security', 'TDE', 'Oracle RDS', 'Transparent Data Encryption', 'EBK', 'PBK', 'backup'],
          },
        ],
      },
      {
        id: 'd1-connect',
        icon: '🔗',
        title: 'Connectivity',
        category: 'd1connect',
        services: [
          {
            shortName: 'Direct Connect',
            fullName: 'AWS Direct Connect',
            ingat: '"Kabel terus ke AWS — private dedicated lane"',
            gunaUntuk: 'Private dedicated connection from on-premises to AWS',
            fungsi: 'Menyediakan sambungan jaringan peribadi yang berdedikasi antara data center on-premises dengan AWS melalui fiber-optic cable di Direct Connect location (bypass internet/ISP). Private VIF → access VPC. Public VIF → access public AWS services (S3) guna private line. NOTA: DX TIDAK encrypted by default — kalau perlu encryption, run VPN over DX (IPSec).',
            contohGuna: 'Company transfer 100TB data sebulan dari on-prem ke AWS — Direct Connect lebih murah (no internet data transfer charges), consistent latency berbanding internet',
            scenario: '"Steady high-volume transfer + consistent low latency + predictable bandwidth" → Direct Connect. "DX kena encrypted juga (compliance)" → DX + Site-to-Site VPN (run IPSec over DX). "Connect DX ke banyak VPC merentas region/account" → Direct Connect Gateway (global resource).',
            compare: {
              label: 'Direct Connect vs Site-to-Site VPN',
              headers: ['Aspect', 'Direct Connect (DX)', 'Site-to-Site VPN'],
              rows: [
                ['Path', 'Private dedicated line (no internet)', 'Encrypted IPSec tunnel over public internet'],
                ['Latency', '🟢 Consistent, low', 'Variable (depends on internet)'],
                ['Bandwidth', 'High, dedicated (1/10/100 Gbps)', 'Up to ~1.25 Gbps per tunnel'],
                ['Setup time', 'Weeks–months (physical provisioning)', '🟢 Minutes–hours'],
                ['Cost', 'Higher fixed cost, cheaper data transfer at scale', '🟢 Low, pay-as-you-go'],
                ['Encryption', 'Not encrypted by default (add VPN over DX)', '🟢 Encrypted by default (IPSec)'],
                ['Use when', 'Steady high-volume, low-latency, predictable', 'Quick, cheap, encrypted, or DX backup'],
              ],
              takeaway: '"Consistent low latency + high bandwidth + private" → Direct Connect. "Quick, cheap, encrypted over internet" → Site-to-Site VPN. Best resilience = DX primary + VPN backup (encrypted DX = run VPN over DX).',
            },
            tips: [
              'DX = "Dedicated eXpensive" — physical fiber, weeks-months to provision. Tak suitable bila jawapan perlu "quickly/immediately" → itu VPN',
              'DX NOT encrypted by default — exam trap! Perlu private + encrypted = DX + Site-to-Site VPN (IPSec over DX)',
              'Resilience pattern: DX primary + Site-to-Site VPN backup (failover bila DX down). Cheaper than dual-DX',
              'Direct Connect Gateway = global resource, connect satu DX ke banyak VPC merentas Regions + accounts (associate dengan VGW atau Transit Gateway)',
              'Public VIF = access public AWS services (S3, DynamoDB) over private line. Private VIF = access VPC. Transit VIF = access TGW',
              'Bukan untuk "fast setup" — provisioning ambil masa. Untuk migration segera guna VPN dulu, DX kemudian',
            ],
            docs: [
              { label: 'What is Direct Connect', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html' },
              { label: 'Direct Connect Gateways', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways-intro.html' },
            ],
            keywords: ['dedicated connection', 'private', 'consistent latency', '1Gbps/10Gbps', 'no internet', 'vs VPN', 'IPSec backup', 'data transfer cost', 'Direct Connect Gateway', 'not encrypted', 'VPN over DX', 'public VIF', 'private VIF'],
          },
          {
            shortName: 'Site-to-Site VPN',
            fullName: 'AWS Site-to-Site VPN',
            ingat: '"Tunnel rahsia ke AWS, guna internet biasa — NETWORK ke NETWORK"',
            gunaUntuk: 'Encrypted IPSec tunnel from on-premises network to VPC over internet',
            fungsi: 'Mewujudkan sambungan IPSec yang disulitkan antara seluruh on-premises NETWORK dengan AWS VPC menggunakan internet sedia ada. Dua komponen: Customer Gateway (CGW = device/info kat sebelah kau) + target gateway kat AWS — sama ada Virtual Private Gateway (VGW, attach ke 1 VPC) atau Transit Gateway (banyak VPC). Setiap VPN connection ada 2 tunnels untuk high availability. Routing: static atau dynamic (BGP).',
            contohGuna: 'Small office nak access resources dalam VPC secara selamat — setup Site-to-Site VPN. Lebih murah dan cepat setup dari Direct Connect tapi latency tak konsisten (ikut internet)',
            scenario: '"Connect entire branch/office NETWORK ke VPC, encrypted, cepat & murah" → Site-to-Site VPN. "Backup untuk Direct Connect" → Site-to-Site VPN as failover. "Individual remote workers (laptop) nak access VPC" → itu Client VPN, BUKAN Site-to-Site.',
            compare: {
              label: 'Site-to-Site VPN vs Client VPN — siapa yang connect?',
              headers: ['Aspect', 'Site-to-Site VPN', 'Client VPN'],
              rows: [
                ['Siapa connect', '🟢 Entire NETWORK (office/data center)', '🟢 Individual USERS (laptop/device)'],
                ['Sebelah customer', 'Customer Gateway device (router)', 'OpenVPN software client per user'],
                ['Auth', 'Pre-shared key / certificate (device)', 'AD / SAML / mutual certificate (per user)'],
                ['AWS endpoint', 'Virtual Private Gateway atau TGW', 'Client VPN endpoint'],
                ['Use case', 'Hybrid network, branch office, DX backup', 'Remote/WFH staff, vendor temporary access'],
              ],
              takeaway: 'Soalan sebut "network/office/data center connect to VPC" → Site-to-Site. Sebut "users/employees/remote/laptop connect to VPC" → Client VPN.',
            },
            mermaid: {
              label: 'Which hybrid connectivity? (decision tree)',
              source: `flowchart TD
  A[Need connect on-prem to AWS] --> B{Individual users<br/>or whole network?}
  B -->|Individual users / laptops| C[Client VPN]
  B -->|Whole network| D{Need consistent<br/>low latency +<br/>high bandwidth?}
  D -->|No, quick & cheap is fine| E[Site-to-Site VPN<br/>IPSec over internet]
  D -->|Yes, predictable| F{Need encryption<br/>over the private line?}
  F -->|No| G[Direct Connect]
  F -->|Yes| H[Direct Connect + VPN<br/>IPSec over DX]
  D -->|Yes but also want backup| I[DX primary +<br/>Site-to-Site VPN backup]`,
              caption: 'Users vs network is the first fork. DX = consistent/predictable; VPN = quick/cheap/encrypted; combine for encrypted-private or resilient.',
            },
            tips: [
              'Site-to-Site = NETWORK to NETWORK. Client VPN = USER to network. Ini pembeza utama dalam soalan',
              '2 komponen: Customer Gateway (sebelah kau) + Virtual Private Gateway / Transit Gateway (sebelah AWS)',
              'Setiap VPN connection = 2 tunnels auto untuk HA (redundancy)',
              'Encrypted by default (IPSec) — bagus bila jawapan perlu "encrypted" + "quick/cheap setup"',
              'VGW = attach ke 1 VPC sahaja. Nak banyak VPC → guna Transit Gateway sebagai target gateway',
              'Single tunnel ~1.25 Gbps. Nak lebih throughput → multiple VPN ke TGW dengan ECMP (VGW tak support ECMP)',
              'Classic combo: DX primary + Site-to-Site VPN backup = resilient hybrid tanpa dual-DX',
            ],
            docs: [
              { label: 'What is Site-to-Site VPN', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html' },
            ],
            keywords: ['IPSec', 'encrypted', 'internet-based', 'Virtual Private Gateway', 'Customer Gateway', 'Transit Gateway', 'two tunnels', 'quick setup', 'cost-effective', 'network to network', 'DX backup', 'BGP', 'vs Client VPN'],
          },
          {
            shortName: 'Client VPN',
            fullName: 'AWS Client VPN',
            ingat: '"VPN untuk individual users — bukan network-to-network"',
            gunaUntuk: 'Allow individual users to authenticate and connect to a VPC from their devices',
            fungsi: 'Managed VPN endpoint yang individual users install client (OpenVPN-compatible) and authenticate via AD, SAML, or mutual certificate auth. Each user\'s connection is governed by authorization rules that restrict access to specific subnets.',
            scenario: '"Small vendor team needs temporary authenticated access to specific VPC subnets, cost-efficient" → Client VPN. Site-to-Site VPN = entire on-premises NETWORK connects to AWS (not per-user). Client VPN = INDIVIDUAL USER level access.',
            tips: [
              'Authorization rules: restrict each user/group to specific subnets — principle of least privilege at the user level',
              'Scales per connection (charged per endpoint-hour + per client connection-hour) — cost-efficient for small teams',
              'Exam key: "user-level authentication" + "restrict to specific subnets" + "individual remote access" → Client VPN',
              'Not for site-to-site (entire network) connectivity — that is Site-to-Site VPN or Direct Connect',
            ],
            keywords: ['Client VPN', 'user authentication', 'OpenVPN', 'SAML', 'authorization rules', 'per-user access', 'remote access', 'temporary access'],
          },
        ],
      },
      {
        id: 'd1-vpc',
        icon: '🏘️',
        title: 'VPC & Networking',
        category: 'd1net',
        services: [
          {
            shortName: 'VPC',
            fullName: 'Amazon Virtual Private Cloud',
            ingat: '"Kawasan perumahan gated sendiri dalam AWS — kau yang design layout"',
            gunaUntuk: 'Isolated private network — the foundation for all AWS resources',
            fungsi: 'VPC ialah private network terpencil dalam AWS cloud. Macam Tailscale yang buat private overlay network antara devices kau, tapi VPC lebih fundamental — ia adalah "tanah" dimana resources kau dilahirkan, bukan tunnel yang menghubungkan tempat yang dah ada. Kau tentukan IP range (CIDR), buat subnets, configure route tables dan gateways.',
            contohGuna: 'Semua EC2, RDS, Lambda dalam VPC kau sendiri — orang lain tak boleh access kecuali kau explicitly benarkan. Default VPC dah ada di setiap region.',
            storageDetails: 'VPC CIDR → IP range keseluruhan (172.16.0.0/16 = 65,536 IPs)\nPublic Subnet → Ada route ke IGW. EC2 boleh dapat public IP\nPrivate Subnet → Tiada route terus ke internet. DB, app servers letak sini\nAvailability Zone → Setiap subnet duduk dalam SATU AZ sahaja',
            detailsLabel: 'VPC Components',
            scenario: '"Deploy web servers dengan databases yang tak boleh diakses dari internet" → EC2 dalam Public Subnet, RDS dalam Private Subnet, dalam satu VPC.',
            tips: [
              'VPC ≈ Tailscale dari segi konsep private network, tapi VPC adalah "tanah" AWS resources kau. Tailscale lebih mirip Site-to-Site VPN (connect existing places)',
              'VPC span SATU region, tapi subnets boleh tersebar di banyak AZs dalam region tu',
              'Default VPC ada di setiap region — EC2 launch tanpa setup guna default VPC',
              'Satu region boleh ada max 5 VPCs (soft limit, boleh request increase)',
            ],
            docs: [
              { label: 'VPC User Guide', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html' },
            ],
            keywords: ['VPC', 'CIDR', 'subnet', 'public', 'private', 'isolated network', 'default VPC', 'private network'],
          },
          {
            shortName: 'CIDR & Subnets',
            fullName: 'IP Addressing & Subnet Calculator',
            ingat: '"2^(32−prefix) = total IPs, tolak 5 = usable"',
            gunaUntuk: 'Plan IP address ranges — VPC perlu CIDR sebelum boleh buat subnets',
            fungsi: 'CIDR (Classless Inter-Domain Routing) tentukan berapa banyak IP dalam sesebuah network. Format: <network address>/<prefix length>, contoh 172.31.0.0/16.\n\nNombor IP (e.g. 172.31.0.0) — kau yang pilih masa create VPC, dari RFC 1918 private ranges:\n• 10.0.0.0/8 — besar, enterprise\n• 172.16.0.0/12 → 172.16–31.x.x — AWS default VPC guna 172.31.0.0/16\n• 192.168.0.0/16 — rumah/pejabat kecil\nRanges ni tak boleh route kat internet — private sahaja, sebab tu EC2 private subnet pakai IP macam ni.\n\nNombor selepas slash (/16, /24) = prefix length = berapa bits "dikunci" sebagai network. IPv4 ada 32 bits total. Baki bits = hosts.\n• /16 → 16 bits kunci, 16 bits bebas → 2^16 = 65,536 IPs\n• /24 → 24 bits kunci, 8 bits bebas → 2^8 = 256 IPs\n• /25 → 25 bits kunci, 7 bits bebas → 2^7 = 128 IPs\n\nAWS reserve 5 IPs setiap subnet: .0 network, .1 VPC router, .2 DNS, .3 future, .255 broadcast.',
            contohGuna: '192.168.0.0/26 → 32−26=6 bits, 2^6=64 IPs, tolak 5 = 59 usable. VPC /16 boleh dibahagi kepada banyak subnets /24 atau /26.',
            storageDetails: '/16 → 65,536 total → 65,531 usable (guna untuk VPC range)\n/24 → 256 total → 251 usable (subnet standard)\n/25 → 128 total → 123 usable\n/26 → 64 total → 59 usable\n/27 → 32 total → 27 usable (exam favourite)\n/28 → 16 total → 11 usable (AWS minimum)',
            detailsLabel: 'CIDR Quick Reference',
            scenario: '"Exam soal berapa usable IPs dalam /27?" → 32 total, tolak 5 = 27 usable. AWS ALWAYS reserves 5 IPs per subnet.',
            tips: [
              'Formula: 32 − prefix = bits bebas. 2^bits = total IPs. Tolak 5 = usable',
              'IP address tu kau pilih sendiri dari private ranges: 10.x, 172.16–31.x, 192.168.x — bukan public IP',
              'AWS default VPC guna 172.31.0.0/16 — sebab tu nampak 172.31 dalam route tables',
              'Nombor selepas slash bukan bilangan IP — ia bilangan bits yang dikunci. /16 = 65k IPs, /24 = 256 IPs',
              'Hafal 3 ni cukup: /24 = 251, /26 = 59, /27 = 27 usable',
              '5 reserved: .0 (network) .1 (router) .2 (DNS) .3 (future) .255 (broadcast)',
              'AWS minimum subnet = /28 (hanya 11 usable IPs)',
            ],
            docs: [
              { label: 'VPC CIDR Blocks', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html' },
              { label: 'Subnet Sizing', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html' },
            ],
            keywords: ['CIDR', 'subnet mask', 'IP addressing', '/24', '/26', '/27', '5 reserved IPs', 'usable hosts'],
          },
          {
            shortName: 'Internet Gateway',
            fullName: 'VPC Internet Gateway (IGW)',
            ingat: '"Pintu pagar utama — dua arah, free, satu per VPC"',
            gunaUntuk: 'Connect VPC to internet (bidirectional) — kena ada untuk public subnet',
            fungsi: 'IGW enable komunikasi dua arah antara VPC dan internet. Highly available, horizontally scaled, free. Satu VPC = satu IGW sahaja. Sebuah subnet baru jadi "public" bila ada 3 syarat: (1) IGW attached ke VPC, (2) route table ada 0.0.0.0/0 → IGW, (3) EC2 ada public/Elastic IP.',
            contohGuna: 'Web server EC2 dalam public subnet — route table ada 0.0.0.0/0 → igw-xxx. EC2 dapat public IP, users dari internet boleh reach web server.',
            scenario: '"Public subnet boleh access internet" → Internet Gateway. Route table mesti ada 0.0.0.0/0 → IGW untuk subnet jadi public.',
            tips: [
              'IGW = free, highly available, satu per VPC — tak boleh ada 2 IGW dalam satu VPC',
              '3 syarat subnet "public": (1) IGW attach ke VPC, (2) route 0.0.0.0/0 → IGW, (3) EC2 ada public/Elastic IP',
              'IGW = bidirectional (internet boleh masuk). NAT GW = outbound only. Ingat perbezaan ni!',
            ],
            docs: [
              { label: 'Internet Gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html' },
            ],
            keywords: ['IGW', 'internet gateway', 'public subnet', 'bidirectional', 'free', '0.0.0.0/0'],
          },
          {
            shortName: 'NAT Gateway',
            fullName: 'Network Address Translation Gateway',
            ingat: '"Keluar boleh, masuk tak boleh — untuk private subnet"',
            gunaUntuk: 'Private subnet instances download patches/call APIs without being exposed to internet',
            fungsi: 'NAT GW allow instances dalam private subnet buat OUTBOUND connection ke internet (download packages, call external APIs) tanpa exposed kepada inbound connections. NAT GW duduk dalam PUBLIC subnet (bukan private!), ada Elastic IP. Private subnet route: 0.0.0.0/0 → NAT GW.',
            contohGuna: 'RDS dalam private subnet perlu download security patches. Traffic: RDS → NAT GW (public subnet) → IGW → internet. Internet tak boleh initiate connection masuk ke RDS.',
            scenario: '"Private subnet EC2 perlu access internet tapi tak nak exposed" → NAT Gateway. Letak NAT GW dalam public subnet, route private subnet 0.0.0.0/0 → NAT GW.',
            compare: {
              label: 'NAT Gateway vs NAT Instance',
              headers: ['Aspect', 'NAT Gateway', 'NAT Instance'],
              rows: [
                ['Urus oleh', '🟢 AWS (fully managed)', 'Kau sendiri (EC2 biasa)'],
                ['Availability', '🟢 HA dalam 1 AZ auto (deploy 1 per AZ utk multi-AZ)', 'Manual — kena script failover sendiri'],
                ['Bandwidth', '🟢 Auto scale 5→100 Gbps', 'Ikut saiz EC2 instance'],
                ['Security Group', '❌ Tak boleh attach SG', '🟢 Boleh (ia EC2)'],
                ['Bastion / port forward', '❌ Tak boleh', '🟢 Boleh (guna sebagai bastion juga)'],
                ['Patch / maintenance', '🟢 AWS handle', 'Kau patch OS sendiri'],
                ['Kos', 'Per jam + per GB', 'Kos EC2 (boleh lagi murah utk traffic kecik)'],
              ],
              takeaway: 'Default jawapan exam = NAT Gateway (managed, HA, auto-scale). Pilih NAT Instance HANYA bila perlu SG/bastion/port-forwarding atau nak jimat untuk traffic sangat kecil. Source/destination check MESTI disable untuk NAT Instance.',
            },
            mermaid: {
              label: 'Analogi Grab — NAT Gateway vs NAT Instance',
              source: `flowchart TD
  Q["EC2 private subnet<br/>nak keluar internet"] --> PILIH{Nak urus sendiri?}
  PILIH -->|"Tak nak pening<br/>🛵 macam naik Grab"| GW["NAT Gateway<br/>(managed)"]
  PILIH -->|"Nak kawalan penuh<br/>🚗 macam bawa kereta sendiri"| INST["NAT Instance<br/>(EC2 sendiri)"]
  GW --> GW1["AWS bawa & jaga:<br/>auto-scale, HA, patch"]
  GW1 --> ANS["✅ Default exam:<br/>NAT Gateway"]
  INST --> IN1["Kau maintain:<br/>saiz, patch, scaling, baiki sendiri"]
  IN1 --> ANS2["Pilih HANYA bila perlu<br/>SG / bastion / port-forward"]`,
              caption: 'Analogi Grab: NAT Gateway = naik Grab — bayar sikit lebih tapi orang lain (AWS) yang bawa & jaga kereta, kau duduk diam (managed, auto-scale, HA). NAT Instance = bawa kereta sendiri — boleh jimat / kawalan penuh, tapi kau kena beli, isi minyak, dan baiki sendiri bila rosak (EC2 yang kau urus). Default exam = NAT Gateway.',
            },
            tips: [
              'NAT GW DUDUK DALAM PUBLIC SUBNET — bukan private! Ini exam trap paling common',
              'Private subnet route: 0.0.0.0/0 → nat-xxx. Public subnet route: 0.0.0.0/0 → igw-xxx',
              'IGW MESTI attached ke VPC — tanpa IGW, NAT GW tak boleh hantar traffic ke internet walaupun route betul',
              'NAT GW ada Elastic IP. Kena bayar per hour + per GB processed',
              'NAT Instance (lama, EC2 manual) vs NAT Gateway (managed, auto-scale, recommended)',
              'Nak SSH ke private instance? Tak boleh direct dari internet — guna bastion host (EC2 dalam public subnet)',
              'Cross-AZ cost reduction: instances dalam AZ-B routing melalui NAT GW di AZ-A kena bayar cross-AZ transfer charges',
              'Fix: deploy NAT Gateway SATU PER AZ dalam public subnet yang sama AZ dengan EC2 instances — eliminates cross-AZ fees',
              'Public NAT Gateway MESTI dalam PUBLIC subnet (bukan private). Private NAT Gateway = untuk private routing, tak perlu IGW',
            ],
            docs: [
              { label: 'NAT Gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html' },
            ],
            keywords: ['NAT', 'outbound only', 'private subnet', 'Elastic IP', 'paid', 'no inbound', 'bastion host', 'cross-AZ cost', 'per-AZ NAT Gateway', 'data transfer charges'],
          },
          {
            shortName: 'Route Tables',
            fullName: 'VPC Route Tables',
            ingat: '"Papan tanda jalan — arah ke mana traffic pergi"',
            gunaUntuk: 'Control traffic direction: public subnet → IGW, private subnet → NAT GW',
            fungsi: 'Setiap subnet mesti associate dengan satu route table. Route table ada rules yang tentukan ke mana traffic pergi. Tanpa route yang betul, internet tak boleh reach walaupun ada IGW. Main route table (default) dan custom route tables boleh ada dalam satu VPC.',
            contohGuna: 'Public RT: 172.16.0.0/16 → local, 0.0.0.0/0 → igw. Private RT: 172.16.0.0/16 → local, 0.0.0.0/0 → nat-gw.',
            storageDetails: 'Local → traffic dalam VPC sendiri (auto, tak boleh delete)\n0.0.0.0/0 → igw-xxx (public subnet — keluar ke internet)\n0.0.0.0/0 → nat-xxx (private subnet — outbound je)\n10.0.0.0/16 → pcx-xxx (VPC peering route)',
            detailsLabel: 'Common Routes',
            scenario: '"Subnet tak dapat access internet walaupun ada IGW" → check route table! Ada 0.0.0.0/0 → IGW? Subnet dah associate dengan route table tu?',
            tips: [
              'Troubleshoot no internet: (1) route 0.0.0.0/0 ada? (2) subnet associate route table betul? (3) EC2 ada public IP?',
              'Local route (e.g. 172.16.0.0/16 → local) auto ada — tak boleh delete',
              'Satu subnet → satu route table je. Satu route table → boleh serve banyak subnets',
            ],
            docs: [
              { label: 'Route Tables', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html' },
            ],
            keywords: ['route table', 'routing', '0.0.0.0/0', 'local route', 'subnet association', 'main route table'],
          },
          {
            shortName: 'SG vs NACL',
            fullName: 'Security Groups vs Network ACLs — Defence Layers',
            ingat: '"SG = Smart/Stateful (instance). NACL = Needs-both-ways/stateless (subnet)"',
            gunaUntuk: 'Two-layer defence: SG guards each EC2, NACL guards each subnet',
            fungsi: 'SG dan NACL bekerja bersama sebagai firewall berlapis. SG (stateful) bekerja pada peringkat EC2 — ingat connections, reply auto dibenarkan, allow-only rules. NACL (stateless) bekerja pada peringkat subnet — check tiap packet, perlu explicit rules untuk inbound DAN outbound, boleh deny IPs.',
            compare: {
              label: 'Security Group vs NACL',
              headers: ['Aspect', 'Security Group', 'Network ACL'],
              rows: [
                ['Level', 'EC2 instance / ENI', 'Subnet boundary'],
                ['State', '🟢 Stateful — reply auto-allowed', '🔴 Stateless — check every packet both ways'],
                ['Rules', 'Allow only', 'Allow + Deny'],
                ['Default', 'Deny all in, allow all out', 'Default NACL: allow all · custom NACL: deny all'],
                ['Block an IP', '❌ Cannot deny', '✅ Deny rule (lowest number wins)'],
                ['Evaluation', 'All rules combined', 'Rules in order, stops at first match'],
                ['Reference SG?', '✅ Can reference another SG as source', '❌ CIDR ranges only'],
              ],
              takeaway: '"Block a specific IP range" → NACL (only NACL can Deny). "Allow app→DB on port 3306 only" → Security Group. Guna dua-dua = defense-in-depth.',
            },
            scenario: '"Block specific IP range" → NACL Deny rule (SG cannot deny). "Allow web servers talk to DB on port 3306 only" → Security Group. Best practice: guna kedua-dua untuk defense-in-depth.',
            tips: [
              'SG = Stateful (ingat conversations). NACL = Stateless (check every packet)',
              'SG boleh reference SG lain sebagai source — "allow traffic FROM web-sg TO db-sg"',
              'NACL kena ada outbound ephemeral port rules (1024–65535) untuk replies boleh keluar',
              'Default NACL = allow all. Custom NACL = deny all — kena add rules sendiri',
            ],
            docs: [
              { label: 'Security Groups', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html' },
              { label: 'Network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html' },
            ],
            keywords: ['SG', 'NACL', 'stateful', 'stateless', 'instance-level', 'subnet-level', 'deny', 'defense-in-depth'],
          },
          {
            shortName: 'VPC Peering',
            fullName: 'VPC Peering Connection',
            ingat: '"Jambatan terus antara dua VPC — non-transitive"',
            gunaUntuk: 'Connect 2 VPCs privately — same account, cross-account, atau cross-region',
            fungsi: 'VPC Peering allow dua VPC communicate menggunakan private IPs seolah-olah dalam network yang sama. NON-transitive — kalau A↔B dan B↔C, A TIDAK boleh reach C secara automatik. Kena buat A↔C peering berasingan.',
            contohGuna: 'Production VPC (172.16.0.0/16) peer dengan Shared Services VPC (10.0.0.0/16) — team boleh access shared tools secara private.',
            scenario: '"Connect dua VPC" → VPC Peering. Ingat: IP ranges TAK BOLEH overlap! Non-transitive — A reach C kena buat A↔C peering sendiri. 3+ VPCs all-to-all = guna Transit Gateway.',
            tips: [
              'Non-transitive: A↔B dan B↔C, tapi A TIDAK reach C. Macam "kawan kawan bukan kawan aku"',
              'IP ranges WAJIB tak overlap — 172.16.0.0/16 dengan 172.16.0.0/24 = KONFLIK, tak boleh peer',
              '3+ VPCs semua perlu communicate = Transit Gateway (lebih simple dari peering mesh)',
              'Edge-to-edge routing TIDAK disokong: NAT Gateway, IGW, VPN, Direct Connect, dan S3 Gateway endpoint dalam VPC A TIDAK boleh digunakan oleh resources dalam peered VPC B',
              '"VPC A ada NAT Gateway, VPC B peered dengan A, boleh B guna NAT tu?" → TIDAK. B kena ada NAT Gateway sendiri',
              'Route table untuk VPC peering: guna SPECIFIC subnet CIDR (bukan full VPC CIDR) untuk limit access between specific subnets only',
            ],
            docs: [
              { label: 'VPC Peering Guide', url: 'https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html' },
            ],
            keywords: ['VPC peering', 'cross-account', 'cross-region', 'non-transitive', 'no IP overlap', 'private routing'],
          },
          {
            shortName: 'Transit Gateway',
            fullName: 'AWS Transit Gateway',
            ingat: '"Hub tengah yang connect semua VPCs — gantikan peering mesh"',
            gunaUntuk: 'Connect 3+ VPCs dan on-premises networks melalui satu hub yang transitive',
            fungsi: 'TGW bertindak sebagai network transit hub yang boleh connect ribuan VPCs, VPNs, dan Direct Connect. Menggantikan peering mesh yang kompleks. TRANSITIVE — VPC A boleh reach VPC C melalui TGW tanpa A↔C peering. Tanpa TGW, 10 VPCs = n*(n-1)/2 = 45 peering connections.',
            contohGuna: 'Company ada 10 VPCs dari pelbagai teams + 2 on-premises data centers → satu TGW connect semua. Kos naik tapi operationally jauh lebih simple.',
            scenario: '"Many VPCs perlu communicate dengan satu sama lain" → Transit Gateway. "Hanya 2 VPCs" → VPC Peering (simpler, lebih murah). TGW = transitive, VPC Peering = non-transitive.',
            compare: {
              label: 'VPC Peering vs Transit Gateway',
              headers: ['Aspect', 'VPC Peering', 'Transit Gateway'],
              rows: [
                ['Topology', '1-to-1 link between 2 VPCs', '🟢 Hub-and-spoke, central hub'],
                ['Transitive routing', 'No — A↔B, B↔C tapi A✗C', '🟢 Yes — A reach C via hub'],
                ['Scale', 'Mesh grows fast: 10 VPCs = 45 links', '🟢 10 VPCs = 10 attachments'],
                ['On-prem (VPN/DX)', 'Not via peering', '🟢 Attach VPN + Direct Connect to hub'],
                ['Cost', '🟢 No hourly fee (data transfer only)', 'Hourly per attachment + data processing'],
                ['Use when', 'Just 2 VPCs, simplest + cheapest', '3+ VPCs all-to-all, or hybrid network'],
              ],
              takeaway: '2 VPCs → Peering (cheaper, simple). 3+ VPCs all-to-all atau perlu connect on-prem → Transit Gateway (transitive hub, elak peering mesh). Peering non-transitive, TGW transitive.',
            },
            tips: [
              '2 VPCs = Peering (cheaper). 3+ VPCs all-to-all = Transit Gateway (simpler)',
              'TGW support TRANSITIVE routing — ini perbezaan utama dari VPC Peering',
              'TGW boleh connect cross-region (Inter-Region Peering) dan cross-account',
              'ECMP (Equal Cost Multi-Path): hanya Transit Gateway yang support ECMP untuk VPN — Virtual Private Gateway (VGW) TIDAK support',
              'Untuk tingkatkan VPN throughput: buat multiple Site-to-Site VPN connections ke TGW dengan ECMP enabled — aggregate bandwidth',
              'Satu VPN tunnel = max 1.25 Gbps. Dengan ECMP + TGW: boleh aggregate multiple tunnels untuk higher total throughput',
            ],
            docs: [
              { label: 'Transit Gateway', url: 'https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html' },
            ],
            keywords: ['Transit Gateway', 'hub', 'transitive routing', 'many VPCs', 'replace peering mesh', 'on-premises', 'cross-account', 'ECMP', 'VPN throughput', 'multiple tunnels', 'aggregate bandwidth'],
          },
          {
            shortName: 'VPC Endpoints',
            fullName: 'VPC Endpoints (Gateway & Interface)',
            ingat: '"Highway terus ke AWS services — tanpa internet, tanpa NAT fees"',
            gunaUntuk: 'Access S3/DynamoDB (free) atau AWS services lain (paid) dari private subnet secara private',
            fungsi: 'Dua jenis: Gateway Endpoint (S3 + DynamoDB, free, guna route table) dan Interface Endpoint (services lain via PrivateLink, ada ENI dalam subnet, berbayar). Traffic tak keluar ke internet langsung — lebih selamat dan murah (jimat NAT GW data fees).',
            contohGuna: 'EC2 private subnet banyak upload ke S3. Tanpa endpoint: bayar NAT GW per GB. Dengan S3 Gateway Endpoint (free): traffic terus dalam AWS network.',
            scenario: '"Access S3/DynamoDB dari private subnet tanpa internet" → Gateway VPC Endpoint (free). "Access ECR, SSM, atau services lain privately" → Interface Endpoint (PrivateLink).',
            compare: {
              label: 'Gateway vs Interface Endpoint',
              headers: ['Aspect', 'Gateway Endpoint', 'Interface Endpoint'],
              rows: [
                ['Supports', '🟢 S3 + DynamoDB only', 'Most AWS services (ECR, SSM, KMS, SQS…) + PrivateLink'],
                ['How it works', 'Route table entry (prefix list)', 'ENI with private IP in your subnet'],
                ['Cost', '🟢 Free', 'Hourly per-ENI + data processing'],
                ['Access from on-prem', 'No (route-table based, in-VPC only)', '🟢 Yes via VPN/Direct Connect (DNS)'],
                ['DNS', 'No private DNS', 'Private DNS — service name resolves to ENI'],
                ['Use when', 'S3/DynamoDB from private subnet, save NAT cost', 'Any other service privately, or from on-prem'],
              ],
              takeaway: '"GD Free" → Gateway endpoint = S3 + DynamoDB sahaja, percuma, guna route table. Semua service lain (atau access from on-prem) → Interface endpoint (PrivateLink, ENI, berbayar).',
            },
            tips: [
              '"GD Free" — Gateway Endpoint untuk S3 + DynamoDB = PERCUMA',
              'Interface Endpoint = semua services lain (ECR, SSM, KMS...) = berbayar (ada ENI)',
              'Gateway Endpoint guna route table. Interface Endpoint guna DNS/PrivateLink',
              'Gateway Endpoint jimatkan NAT GW cost bila EC2 banyak access S3/DynamoDB',
              'TRAP: Bucket policy boleh kunci S3 supaya HANYA terima request dari satu VPC endpoint guna Condition aws:sourceVpce (atau aws:sourceVpc). Bila ON, request yang lalu NAT Gateway → Internet Gateway (jalan public) di-DENY — walaupun NAT Gateway secara teknikal boleh sampai S3. Soalan uji sama ada kau perasan bucket policy, bukan sekadar network path.',
              'Connectivity ≠ Authorization: NAT Gateway "boleh route ke S3" (connectivity) berbeza dengan "S3 terima request ni" (bucket policy authorization). Dua kawalan berasingan — endpoint kena ada dalam route table DAN bucket policy kena benarkan sumbernya.',
            ],
            docs: [
              { label: 'VPC Endpoints', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html' },
              { label: 'Gateway Endpoints', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html' },
              { label: 'Restrict S3 bucket access to a VPC endpoint', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies-vpc-endpoint.html' },
            ],
            keywords: ['VPC endpoint', 'Gateway endpoint', 'Interface endpoint', 'PrivateLink', 'S3', 'DynamoDB', 'no internet', 'free', 'aws:sourceVpce', 'bucket policy', 'NAT Gateway denied', 'aws:sourceVpc'],
          },
        ],
      },
    ],
  },
  {
    id: 'domain2',
    badge: 'DOMAIN 2 · 26% OF EXAM',
    title: 'Design Resilient Architectures',
    subtitle: 'High Availability · Disaster Recovery · Backup & Storage Resilience',
    variant: 'd2',
    sections: [
      {
        id: 'd2-ha',
        icon: '⚡',
        title: 'High Availability & Scaling',
        category: 'd2ha',
        services: [
          {
            shortName: 'Auto Scaling Groups',
            fullName: 'Amazon EC2 Auto Scaling',
            ingat: '"Auto tambah/kurang server ikut demand"',
            gunaUntuk: 'Automatically scale EC2 instances based on load',
            fungsi: 'Menambah atau mengurangkan bilangan EC2 instances secara automatik berdasarkan policies, schedules, atau metrics',
            scenario: 'E-commerce traffic spike masa sale event — ASG scale out bila CPU >70%, tambah EC2 instances automatik. Bila traffic turun, scale in untuk jimat kos. Set minimum=2 untuk high availability.',
            compare: {
              label: 'Scaling policies — pilih cara scale ikut corak traffic',
              headers: ['Policy', 'Macam mana ia scale', 'Guna bila'],
              rows: [
                ['Target Tracking', 'Kekalkan 1 metric pada target (cth CPU 50%) — auto naik/turun', '🟢 Default & paling senang — most workloads'],
                ['Step Scaling', 'Adjustment berbeza ikut SAIZ breach (CPU 60%→+1, 90%→+3)', 'Perlu reaksi bertingkat ikut keterukan beban'],
                ['Simple Scaling', '1 adjustment per alarm, tunggu cooldown dulu', 'Legacy — guna Step/Target instead'],
                ['Scheduled', 'Scale pada masa tetap (cth Isnin 9am +5)', 'Traffic ikut jadual yang DIKETAHUI'],
                ['Predictive', 'ML forecast beban, scale AWAL sebelum spike', 'Traffic berulang / cyclical (proactive)'],
              ],
              takeaway: 'Senang + default → Target Tracking. Tahu jadual → Scheduled. Corak berulang → Predictive (scale dulu sebelum spike). Reaksi ikut keterukan → Step. Cooldown elak scale berulang terlalu cepat; warm-up bagi instance baru "matang" sebelum dikira dalam metric.',
            },
            tips: [
              'Termination Policies — menentukan instance MANA yang ditamatkan semasa scale in:',
              'OldestLaunchTemplate → terminate instances guna launch template LAMA (guna ni untuk rolling AMI updates — pastikan instances lama diganti dengan yang baru)',
              'OldestInstance → terminate instance yang PALING LAMA berjalan (bukan template, tapi instance age)',
              'ClosestToNextInstanceHour → terminate instance yang paling dekat dengan next billing hour (optimise kos)',
              'AllocationStrategy → untuk Spot instances, terminate berdasarkan allocation strategy',
              'Default policy: OldestLaunchConfiguration → OldestInstance → ClosestToNextInstanceHour',
              'Exam: "phase out old AMI, replace with new" → OldestLaunchTemplate termination policy',
            ],
            keywords: ['horizontal scaling', 'scale out/in', 'launch template', 'scaling policies', 'desired capacity', 'min/max', 'OldestLaunchTemplate', 'termination policy', 'AMI rollout'],
          },
          {
            shortName: 'RDS Multi-AZ',
            fullName: 'Amazon RDS Multi-AZ Deployment',
            ingat: '"Backup database sedia tunggu dalam AZ lain"',
            gunaUntuk: 'High availability for RDS — automatic failover',
            fungsi: 'Menyimpan satu salinan database standby dalam Availability Zone berbeza yang akan take over secara automatik jika primary fail',
            scenario: 'Production RDS kat AZ-1 fail — automatic failover ke standby kat AZ-2 dalam 1-2 minit. Same connection endpoint, app tak perlu tukar config. BUKAN untuk scale reads — guna Read Replicas untuk tu.',
            compare: {
              label: 'Multi-AZ vs Read Replicas — THE classic exam comparison',
              headers: ['Aspect', 'Multi-AZ', 'Read Replicas'],
              rows: [
                ['Purpose', 'High availability (failover)', 'Scale read traffic'],
                ['Replication', '🟢 Synchronous', '🟡 Asynchronous'],
                ['Standby usable?', '❌ Standby idle — no reads', '✅ Serves read queries'],
                ['Failover', 'Automatic (~1–2 min)', 'Manual — can promote to standalone'],
                ['Region', 'Same region (across AZs)', 'Same OR cross-region'],
                ['How many', '1 standby', 'Up to 15'],
              ],
              takeaway: 'Multi-AZ = HA / disaster survival (same region). Read Replicas = read scaling + cross-region reads. Soalan "reporting queries slow down prod" → Read Replica. "Survive an AZ outage" → Multi-AZ. Boleh guna dua-dua sekali.',
            },
            diagram: {
              label: 'Anatomy failover — endpoint SAMA flip ke standby',
              steps: [
                { nodes: [{ label: 'App', sub: '1 endpoint (DNS)', tone: 'c1' }] },
                { nodes: [{ label: 'Primary DB', sub: 'AZ-a · read + write', tone: 'c2' }] },
                { nodes: [{ label: 'Standby DB', sub: 'AZ-b · idle, no reads', tone: 'c4' }] },
              ],
              caption: 'Sync replication Primary → Standby (sentiasa identical). AZ-a fail → AWS auto-flip DNS endpoint ke Standby (AZ-b) dalam ~60–120s; app guna endpoint yang SAMA, tak payah tukar config. Standby TAK serve reads — nak offload reads guna Read Replica.',
            },
            tips: [
              'Automated backups: AWS backup daily (during backup window) + transaction logs — boleh restore ke ANY point-in-time dalam retention period (1-35 hari). Auto-deleted bila instance dipadam.',
              'Manual snapshots: kau trigger sendiri, bila-bila masa — KEKAL walaupun RDS instance dipadam. Guna untuk "before major upgrade" atau long-term retention.',
              'Restore dari snapshot/PITR = create instance BARU dengan endpoint BARU — bukan restore in-place',
              'Exam: "retain backup walaupun delete DB instance" → manual snapshot (automated backups deleted together with instance)',
            ],
            keywords: ['automatic failover', 'standby', 'different AZ', 'sync replication', 'same endpoint', 'HA only', 'automated backups', 'manual snapshot', 'point-in-time restore', 'retention period'],
          },
          {
            shortName: 'RDS Read Replicas',
            fullName: 'Amazon RDS Read Replicas',
            ingat: '"Photocopy database untuk baca je — boleh cross-region"',
            gunaUntuk: 'Scale read traffic, reporting queries, multi-region read access',
            fungsi: 'Mencipta salinan database read-only untuk mengagihkan beban queries baca. Async replication dari primary. Boleh cross-region — master kat Frankfurt, replicas kat US, Singapore, Tokyo untuk serve local users laju. Up to 15 read replicas. Boleh promoted to master untuk DR.',
            contohGuna: 'Multinational company: master DB kat EU-Frankfurt, cross-region read replicas kat US, AP, SA — local users baca dari nearest replica tanpa hantar semua traffic ke Frankfurt.',
            scenario: 'Multi-region database design → RDS cross-region Read Replicas. Reporting queries slow down production → create Read Replica in same/different region, point reporting app ke replica. INGAT: Multi-AZ = same region HA (failover). Read Replicas = read scaling + cross-region reads.',
            tips: [
              'Multi-AZ = HIGH AVAILABILITY (same region, synchronous, auto-failover). Read Replica = READ SCALING (async, can be cross-region)',
              'Cross-region Read Replica untuk: (1) local read access untuk global users, (2) DR in another region',
              'Read Replica boleh dipromote jadi master — guna untuk DR bila primary region down',
              'Up to 15 read replicas per primary. Boleh create replica of replica',
            ],
            docs: [
              { label: 'RDS Read Replicas', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html' },
            ],
            keywords: ['read scaling', 'async replication', 'cross-region', 'up to 15 replicas', 'read-only', 'multi-region', 'promote to master'],
          },
          {
            shortName: 'RDS Proxy',
            fullName: 'Amazon RDS Proxy',
            ingat: '"Perantara yang pool connections — jimat RDS dari connection tsunami"',
            gunaUntuk: 'Connection pooling for RDS — handle too many connections from Lambda/Auto Scaling',
            fungsi: 'RDS Proxy duduk antara application dan RDS, multiplex connections. Bila Lambda scale up kepada 1000 instances, RDS Proxy pool connections — RDS hanya nampak bilangan connections yang manageable. Mengatasi "too many connections" errors.',
            scenario: '"Lambda functions causing too many RDS connections" → RDS Proxy. "Idle connections from Auto Scaling EC2" → RDS Proxy. Read Replicas = read scaling. Multi-AZ = HA. RDS Proxy = connection management.',
            tips: [
              'RDS Proxy solves: "too many connections", "idle connections", "connection exhaustion"',
              'Bukan untuk slow query performance — guna Read Replicas atau upgrade instance untuk query scaling',
              'Bukan untuk read scaling — guna Read Replicas untuk distribute read load',
              'Sangat berguna dengan Lambda (yang scale drastically dan close/open connections rapidly)',
              'Supports IAM authentication + Secrets Manager integration untuk credentials',
            ],
            keywords: ['connection pooling', 'too many connections', 'Lambda scaling', 'idle connections', 'connection multiplexing'],
          },
          {
            shortName: 'Global Accelerator',
            fullName: 'AWS Global Accelerator',
            ingat: '"Highway AWS untuk user seluruh dunia"',
            gunaUntuk: 'Route global users to nearest healthy endpoint via AWS backbone',
            fungsi: 'Menggunakan AWS global network untuk route traffic ke endpoint yang paling dekat dan sihat, bukan melalui internet awam',
            scenario: 'App dengan users dari US dan Asia — Global Accelerator route via AWS backbone (bukan public internet), lagi laju. Kalau satu region fail, auto-failover ke region lain dalam <30 saat. Beza dengan CloudFront: GA untuk TCP/UDP apps, bukan static content caching.',
            compare: {
              label: 'Global Accelerator vs CloudFront — dua-dua guna AWS edge, tapi beza tujuan',
              headers: ['Aspect', 'Global Accelerator', 'CloudFront'],
              rows: [
                ['Tujuan utama', 'Optimize ROUTING ke regional endpoint', 'CACHE content dekat user (CDN)'],
                ['Protocol', '🟢 TCP/UDP (apa-apa app)', 'HTTP/HTTPS sahaja'],
                ['Caching', '❌ Tiada — proxy traffic terus', '🟢 Ya, cache kat edge'],
                ['Entry point', '2 static anycast IP', 'Domain (dxxxx.cloudfront.net)'],
                ['Endpoint', 'ALB, NLB, EC2, Elastic IP', 'S3, ALB, custom origin (HTTP)'],
                ['Best untuk', 'Gaming, IoT, VoIP, non-HTTP, fixed IP, failover Region <30s', 'Website, video/image, static + dynamic web'],
              ],
              takeaway: 'Content boleh cache + HTTP → CloudFront. TCP/UDP atau perlu static IP (gaming/IoT/VoIP) atau cross-Region failover pantas → Global Accelerator. Boleh combine: CloudFront depan untuk caching, GA untuk non-HTTP.',
            },
            tips: [
              'Global Accelerator provisions TWO static Anycast IP addresses — clients always connect to the same two IPs regardless of region',
              'IP caching problem (IoT devices, hard-coded IPs): use Global Accelerator (fixed IPs) not Route 53 (DNS changes require propagation + clients may cache old IPs)',
              'HIPAA-eligible, supports TLS in-transit encryption — suitable for healthcare/IoT workloads',
              'Anycast = both IPs are advertised from ALL edge PoPs; network routes to nearest PoP automatically',
            ],
            keywords: ['global routing', 'AWS backbone', 'anycast', 'static IP', 'TCP/UDP', 'failover <30s', 'two static IPs', 'IP caching', 'IoT', 'HIPAA'],
          },
          {
            shortName: 'Aurora',
            fullName: 'Amazon Aurora',
            ingat: '"RDS tapi 5x laju, 6 copies auto, failover 30 saat"',
            gunaUntuk: 'High-performance relational DB, MySQL/PostgreSQL compatible, enterprise HA',
            fungsi: 'Aurora simpan 6 salinan data merentasi 3 AZs secara automatik. Storage auto-grow hingga 256 TiB. Up to 15 Read Replicas dengan lag <10ms. Failover automatik dalam <30 saat.',
            contohGuna: 'Replace RDS MySQL production — Aurora bagi HA automatik, 6 copies, failover <30s, storage auto-scale, tanpa manage sendiri.',
            scenario: '"High availability relational DB, auto-failover, multiple copies" → Aurora. Bukan RDS Multi-AZ (Aurora lebih canggih: 6 copies vs 1 standby, failover 30s vs 1-2 minit). Aurora Serverless untuk unpredictable/intermittent workloads.',
            diagram: [
              {
                label: 'Cluster anatomy — compute & storage TERPISAH',
                steps: [
                  { nodes: [{ label: 'App', sub: '', tone: 'c1' }] },
                  { nodes: [
                    { label: 'Writer endpoint', sub: '→ primary', tone: 'c2' },
                    { label: 'Reader endpoint', sub: 'load-balance replicas', tone: 'c4' },
                  ] },
                  { nodes: [
                    { label: 'Primary (Writer)', sub: 'read + write · 1 je', tone: 'c2' },
                    { label: 'Aurora Replicas', sub: 'up to 15 · read-only · failover target', tone: 'c4' },
                  ] },
                  { nodes: [{ label: 'Shared Cluster Volume', sub: '6 copies · 3 AZs (2/AZ) · auto-grow → 128 TiB', tone: 'c3' }] },
                ],
                caption: 'SEMUA instance (writer + readers) share SATU cluster volume — bukan tiap instance ada copy sendiri (beza dengan RDS Multi-AZ). Tambah replica = laju sebab tak perlu copy data. Writer endpoint sentiasa tunjuk primary; reader endpoint auto load-balance across replicas. Primary fail → replica dipromote <30s.',
              },
              {
                label: 'Aurora Global Database — cross-region DR',
                steps: [
                  { nodes: [{ label: 'Primary Region', sub: 'read + write', tone: 'c2' }] },
                  { nodes: [{ label: 'Storage replication', sub: 'typical < 1s lag', tone: 'c3' }] },
                  { nodes: [{ label: 'Secondary Region(s)', sub: 'up to 5 · read-only', tone: 'c4' }] },
                  { nodes: [{ label: 'Promote on outage', sub: 'RTO < 1 min · RPO ~1s', tone: 'c5' }] },
                ],
                caption: '1 primary region + up to 5 secondary read-only regions, replicate di peringkat storage (typical <1s lag). Region utama down → promote secondary jadi primary (RTO <1 min). Exam: "cross-region DR, downtime <1 min, low data loss" → Aurora Global Database (bukan Multi-AZ yang same-region je).',
              },
            ],
            tips: [
              'Aurora = 6 copies across 3 AZs auto. RDS Multi-AZ = 1 standby copy sahaja',
              'Aurora failover <30 saat. RDS Multi-AZ failover 1-2 minit',
              'Aurora storage auto-grow hingga 256 TiB — zero storage management',
              'Storage scaling: start 10 GiB, auto-grow dalam 10 GiB increments hingga max (128-256 TiB ikut engine version) — ni SAMA untuk Aurora provisioned dan Aurora Serverless. Jangan keliru dengan Serverless v2 COMPUTE capacity range (0.5-256 ACU)',
              'Aurora Global Database: primary region + up to 5 read-only secondary regions',
              'Aurora Global Database RTO: < 1 minit (automatic managed failover). RPO: ~1 saat (replication lag)',
              'Aurora Global Database failover: secondary region promote jadi primary automatically bila primary region down — minimal manual effort',
              'Exam: "cross-region DR, downtime < 1 minit, minimal manual ops" → Aurora Global Database. Bukan Multi-AZ (same region). Bukan manual snapshot restore (kena buat sendiri)',
              'Multi-AZ Aurora Replicas = same region HA (failover dalam AZ, bukan region)',
            ],
            docs: [
              { label: 'What is Amazon Aurora?', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html' },
            ],
            keywords: ['MySQL compatible', 'PostgreSQL compatible', '6 copies', '3 AZs', 'auto storage 256 TiB', 'fast failover', '15 read replicas', 'Global Database', 'cross-region DR', 'RTO 1 min', 'RPO 1s'],
          },
          {
            shortName: 'Aurora Serverless',
            fullName: 'Amazon Aurora Serverless',
            ingat: '"Database yang tidur bila tak pakai, scale sendiri"',
            gunaUntuk: 'Unpredictable/intermittent workloads — auto-scale DB capacity, pay per second',
            fungsi: 'Aurora Serverless v2 auto-scale capacity dalam fractions of seconds dari minimum hingga ratusan ACUs, dalam increments 0.5 ACU. Boleh scale to near-zero (auto-pause/resume) bila idle.',
            scenario: '"Dev/test database hanya pakai waktu office hours", "app traffic sangat unpredictable, nak zero DB cost masa idle" → Aurora Serverless. Keywords: intermittent, variable traffic, dev/test, scale to zero.',
            tips: [
              'v1 (legacy): scale dalam STEPS (whole capacity unit jumps), connections boleh DROP semasa scaling, limited engine versions',
              'v2 (current): fine-grained scaling 0.5 ACU increments dalam fractions of seconds, NO connection drops, boleh dicampur dengan provisioned Aurora instances dalam cluster yang sama',
              'v2 sokong lebih banyak feature: Global Database, Multi-AZ, Read Replicas — v1 lebih limited',
              'Exam: kalau soalan sebut "instant scaling without dropping connections" atau "mix serverless + provisioned instances" → Aurora Serverless v2',
              'Setup: pilih DB instance class "Serverless v2", set capacity range 0–256 ACU dalam increments 0.5 ACU (limit sebenar ikut engine/version)',
              'Set minimum capacity = 0 ACU → enable auto-pause/resume (database pause sepenuhnya bila tiada connections, resume automatik bila ada request baru)',
            ],
            docs: [
              { label: 'Using Aurora serverless (v2)', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html' },
            ],
            keywords: ['scale to zero', 'ACU', 'pay per second', 'intermittent', 'dev/test', 'auto-pause', 'variable traffic', 'v1 vs v2', '0.5 ACU increments', 'no connection drops'],
          },
          {
            shortName: 'DynamoDB',
            fullName: 'Amazon DynamoDB',
            ingat: '"NoSQL yang tak pernah slow — milliseconds at any scale"',
            gunaUntuk: 'Serverless key-value/document store, single-digit ms latency at any scale',
            fungsi: 'Fully managed NoSQL database. Auto-scale, no servers. DynamoDB Streams capture changes untuk event-driven patterns. DAX (DynamoDB Accelerator) untuk microsecond reads. Global Tables untuk multi-region active-active.',
            contohGuna: 'Shopping cart, user sessions, real-time leaderboards, gaming scores — workloads yang perlu high throughput, low latency, dan serverless.',
            scenario: '"Serverless NoSQL millisecond latency at any scale" → DynamoDB. "Microsecond reads for DynamoDB" → DAX. "Multi-region active-active database" → DynamoDB Global Tables. "Capture DynamoDB changes → trigger Lambda" → DynamoDB Streams.',
            compare: [
              {
                label: 'Capacity modes — On-Demand vs Provisioned',
                headers: ['Aspect', 'On-Demand', 'Provisioned'],
                rows: [
                  ['Billing', 'Pay per request', 'Pay for RCU/WCU reserved per jam'],
                  ['Capacity planning', '🟢 Zero — auto instant', 'Set RCU/WCU (+ optional Auto Scaling)'],
                  ['Best untuk', 'Unpredictable / spiky / baru launch', 'Predictable steady traffic'],
                  ['Cost', 'Mahal sikit per request', '🟢 Murah kalau traffic stabil'],
                  ['Throttling risk', 'Sangat rendah (scale terus)', 'Boleh throttle kalau lebih provisioned'],
                ],
                takeaway: 'Traffic tak menentu / app baru / tak nak fikir capacity → On-Demand. Traffic stabil & nak jimat → Provisioned + Auto Scaling. Boleh tukar mode (had sekali per 24 jam).',
              },
              {
                label: 'LSI vs GSI — secondary indexes',
                headers: ['Aspect', 'LSI (Local)', 'GSI (Global)'],
                rows: [
                  ['Partition key', 'SAME as base table', 'Can be DIFFERENT'],
                  ['Sort key', 'Alternate sort key', 'Different partition + sort key'],
                  ['When created', '🔴 Only at table creation', '🟢 Anytime (create/delete)'],
                  ['Capacity', 'Shares base table throughput', 'Own provisioned RCU/WCU'],
                  ['Consistency', 'Strong OR eventual', 'Eventual only'],
                  ['Limit per table', '5', '20'],
                ],
                takeaway: '"Alternate sort order, must define at creation, same partition key" → LSI. "New query pattern, create anytime, own capacity" → GSI.',
              },
            ],
            tips: [
              'DynamoDB = NoSQL (key-value/document). Aurora/RDS = SQL (relational)',
              'DAX = DynamoDB Accelerator = microsecond reads (in-memory cache for DynamoDB)',
              'Global Tables = automatic multi-region active-active replication',
              'DynamoDB Streams → trigger Lambda = event-driven serverless pattern',
              'Partition key design: choose attribute dengan HIGH CARDINALITY (banyak unique values) supaya traffic diagihkan rata across partitions — elak "hot partition"',
              'Provisioned capacity (set RCU/WCU + Auto Scaling target %) = predictable steady traffic, lebih jimat. On-Demand (pay per request) = unpredictable/spiky traffic, zero capacity planning',
              'Item collection: untuk composite primary key (partition key + sort key), semua item dengan SAME partition key disimpan together dalam satu partition, sorted by sort key — ni yang buat Query by partition key + sort key range jadi efficient',
              'LSI (Local Secondary Index): SAME partition key as base table, alternate SORT key. Mesti dicipta SEMASA create table. Limit 10GB per partition key value — limit ni applies kat ITEM COLLECTION (base table item + semua LSI items utk partition key tu)',
              'GSI (Global Secondary Index): DIFFERENT partition key AND/OR sort key dari base table. Boleh dicipta/delete BILA-BILA masa. Ada own provisioned throughput (RCU/WCU) berasingan dari base table.',
              'Exam shortcut: "alternate query pattern, create anytime, own capacity" → GSI. "Alternate sort order, same partition key, must define at table creation" → LSI',
              'Default quota: 20 GSI dan 5 LSI per table. Partition key jugak dipanggil "hash attribute", sort key dipanggil "range attribute" — istilah ni kadang muncul dalam exam wording',
              'DynamoDB Streams: setiap stream record (INSERT/MODIFY/REMOVE) kekal 24 jam je sebelum auto-removed — kalau Lambda trigger gagal proses dalam masa tu, data tu lost',
              'Item boleh ada NESTED attributes (JSON-like, e.g. Address dalam satu item) sampai 32 levels deep — DynamoDB schemaless except primary key',
              'Primary key attribute (partition key / sort key) MESTI scalar — String, Number, atau Binary sahaja. Tak boleh guna List, Map, atau Set sebagai primary key',
            ],
            docs: [
              { label: 'Improving data access with secondary indexes', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html' },
              { label: 'Partitions and data distribution', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html' },
              { label: 'Core components of Amazon DynamoDB', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html' },
            ],
            keywords: ['NoSQL', 'key-value', 'serverless', 'millisecond latency', 'DAX', 'Global Tables', 'streams', 'auto-scale', 'partition key', 'LSI', 'GSI', 'secondary index', 'provisioned', 'on-demand', 'hot partition', 'item collection', 'hash attribute', 'range attribute', 'nested attributes'],
          },
          {
            shortName: 'DAX',
            fullName: 'Amazon DynamoDB Accelerator (DAX)',
            ingat: '"Cache depan DynamoDB — baca dalam microseconds"',
            gunaUntuk: 'Read-heavy DynamoDB workloads needing microsecond response times',
            fungsi: 'Fully managed, highly available in-memory cache khusus untuk DynamoDB. Drop-in compatible — tak perlu tukar application logic, cuma point ke DAX endpoint. Hanya cache READ operations (GetItem, Query, Scan).',
            scenario: '"DynamoDB read latency perlu microseconds, bukan milliseconds" → DAX. "Cache untuk RDS/Aurora" → ElastiCache, BUKAN DAX (DAX khusus DynamoDB sahaja).',
            tips: [
              'DAX = microsecond reads. DynamoDB sendiri = single-digit millisecond reads. Beza tu yang exam test.',
              'DAX hanya untuk READS — write masih terus ke DynamoDB (write-through cache pada writes yang lalu DAX API)',
              'Drop-in compatible: guna DAX SDK client, code logic tak berubah',
              'DAX ≠ ElastiCache: DAX khusus DynamoDB API. ElastiCache untuk general-purpose caching (RDS, custom data)',
            ],
            keywords: ['DynamoDB Accelerator', 'microsecond latency', 'in-memory cache', 'read caching', 'drop-in compatible'],
          },
        ],
      },
      {
        id: 'd2-dr',
        icon: '🔄',
        title: 'Disaster Recovery Patterns',
        category: 'd2dr',
        services: [
          {
            shortName: 'Backup & Restore',
            fullName: 'DR Pattern: Backup & Restore',
            ingat: '"Save game — kalau rosak restore dari backup"',
            gunaUntuk: 'Non-critical systems, lowest cost DR strategy',
            fungsi: 'Strategi DR paling asas — backup data ke S3/Glacier, restore bila diperlukan. Tiada infrastruktur standby di DR region',
            scenario: 'Non-critical archival system — backup snapshots ke S3/Glacier regularly. RPO: hours/days. RTO: hours. Paling murah tapi paling lambat recover. Guna bila downtime beberapa jam boleh diterima.',
            compare: [
              {
                label: 'RTO vs RPO — jangan keliru!',
                headers: ['Term', 'Maksud', 'Soalan', 'Arah masa'],
                rows: [
                  ['RPO (Recovery Point Objective)', 'Berapa banyak DATA boleh hilang', '"Berapa kerap aku backup?"', '⏪ Ke BELAKANG dari masa crash'],
                  ['RTO (Recovery Time Objective)', 'Berapa lama nak PULIH semula', '"Berapa lama downtime boleh tahan?"', '⏩ Ke HADAPAN dari masa crash'],
                ],
                takeaway: 'RPO = Point = titik data terakhir yang selamat (data loss tolerance). RTO = Time = masa untuk online balik (downtime tolerance). RPO 1 jam → backup tiap jam. RTO 5 minit → kena ada standby panas. Makin kecil dua-dua → makin mahal.',
              },
              {
                label: 'The 4 DR strategies — cost ↔ speed spectrum',
                headers: ['Aspect', 'Backup & Restore', 'Pilot Light', 'Warm Standby', 'Multi-Site Active/Active'],
                rows: [
                  ['RPO', 'Hours–days', 'Minutes', 'Seconds–minutes', '🟢 Near-zero'],
                  ['RTO', 'Hours', 'Minutes–hours', 'Minutes', '🟢 Seconds'],
                  ['What runs in DR', 'Nothing — just backups', 'Core DB only (app off)', 'Scaled-down full stack', '🟢 Full capacity, live'],
                  ['Cost', '🟢 Lowest', 'Low–medium', 'Higher', 'Highest'],
                  ['Use when', 'Non-critical, downtime OK', 'Can tolerate some recovery time', 'Need fast recovery, low traffic loss', 'Mission-critical, zero downtime'],
                ],
                takeaway: 'Cost & recovery speed naik dari kiri → kanan. Cheapest+slowest = Backup & Restore. Fastest+priciest = Multi-Site Active/Active. Pilih ikut RPO/RTO requirement vs budget. Pilot Light = DB on, app off; Warm Standby = full stack scaled-down running.',
              },
            ],
            keywords: ['RPO: hours/days', 'RTO: hours', 'lowest cost', 'no standby infra', 'S3/Glacier backup', 'DR spectrum', 'Pilot Light', 'Warm Standby', 'Multi-Site'],
          },
          {
            shortName: 'Pilot Light',
            fullName: 'DR Pattern: Pilot Light',
            ingat: '"Api kecil sedia — boleh bakar besar bila perlu"',
            gunaUntuk: 'Core DB running in DR region, app servers off until needed',
            fungsi: 'Hanya core components (database) yang running kat DR region scaled down. App servers dilancarkan hanya bila disaster berlaku',
            scenario: 'Core DB replicated ke DR region (running minimal). App servers OFF. Disaster berlaku — turn on app servers, scale up, point DNS ke DR. RPO: minutes, RTO: minutes to hours. Lebih murah dari Warm Standby.',
            keywords: ['RPO: minutes', 'RTO: minutes-hours', 'core DB running', 'app servers off', 'medium cost'],
          },
          {
            shortName: 'Warm Standby',
            fullName: 'DR Pattern: Warm Standby',
            ingat: '"Anak syarikat kecil sedia — scale up masa emergency"',
            gunaUntuk: 'Scaled-down full stack running in DR, quick scale up',
            fungsi: 'Versi scaled-down penuh dari aplikasi running di DR region. Boleh handle traffic pada kapasiti rendah, scale up bila failover diperlukan',
            scenario: 'DR region running dengan 2 EC2 (vs 20 in prod). Disaster — scale up ASG, Route 53 failover ke DR. RPO: seconds/minutes, RTO: minutes. Lebih mahal dari Pilot Light tapi lagi cepat recover.',
            keywords: ['RPO: seconds/minutes', 'RTO: minutes', 'scaled-down active', 'quick scale up', 'higher cost'],
          },
          {
            shortName: 'Multi-Site Active/Active',
            fullName: 'DR Pattern: Multi-Site Active/Active',
            ingat: '"Dua HQ berjalan serentak — saling backup"',
            gunaUntuk: 'Mission-critical — full capacity in both regions simultaneously',
            fungsi: 'Kedua-dua regions running full capacity serentak dengan traffic diagihkan. Tiada downtime bila satu region fail',
            scenario: 'Banking app yang tak boleh ada downtime — full production environment kat dua regions. Route 53 weighted routing 50/50. Satu region fail → 100% traffic ke region sihat automatik. RPO: near-zero, RTO: seconds. Paling mahal tapi paling reliable.',
            keywords: ['RPO: near-zero', 'RTO: seconds', 'full capacity both', 'highest cost', 'mission-critical', 'zero downtime'],
          },
        ],
      },
      {
        id: 'd2-backup',
        icon: '🗂️',
        title: 'Backup & Storage Resilience',
        category: 'd2backup',
        services: [
          {
            shortName: 'AWS Backup',
            fullName: 'AWS Backup',
            ingat: '"Backup manager untuk semua AWS services"',
            gunaUntuk: 'Centralized backup across EC2, RDS, EFS, DynamoDB, S3',
            fungsi: 'Mengurus backup terpusat untuk pelbagai AWS services dengan backup policies, retention rules dan cross-region backup',
            scenario: 'Company kena comply dengan policy backup 90-hari untuk semua databases — AWS Backup create backup plan, auto backup RDS + DynamoDB + EFS setiap hari, retain 90 hari, auto copy ke DR region.',
            tips: [
              'AWS Backup supports: EFS, EBS, RDS, Aurora, DynamoDB, S3, FSx, EC2 AMIs, Storage Gateway volumes',
              '"centralized backup management + monitoring + auditing reporting" → AWS Backup (every time)',
              'Backup Audit Manager: compliance framework + reporting for audit — "prove backups meet policy" → Backup Audit Manager',
              'S3 File Gateway ≠ EFS backup. FSx File Gateway ≠ EFS backup. For EFS backup → AWS Backup.',
            ],
            keywords: ['centralized backup', 'backup plans', 'retention', 'cross-region', 'compliance', 'automated', 'EFS backup', 'Backup Audit Manager', 'monitoring'],
          },
          {
            shortName: 'S3 Versioning & CRR',
            fullName: 'S3 Versioning + Cross-Region Replication',
            ingat: '"Simpan semua versi, auto copy ke region lain"',
            gunaUntuk: 'Protect against accidental deletion, cross-region DR for S3',
            fungsi: 'Versioning simpan semua versi object untuk recovery. CRR auto-replicate objects ke S3 bucket dalam region lain untuk disaster recovery',
            scenario: 'Developer accidentally delete important file dalam S3 — Versioning enable restore previous version. CRR auto-copy semua objects ke DR bucket kat region lain untuk disaster recovery.',
            keywords: ['versioning', 'CRR', 'accidental deletion', 'cross-region replication', 'SRR', 'point-in-time recovery'],
          },
          {
            shortName: 'EBS Snapshots',
            fullName: 'Amazon EBS Snapshots',
            ingat: '"Gambar volume pada satu masa — restore anytime"',
            gunaUntuk: 'Point-in-time backup of EBS volumes, cross-region DR',
            fungsi: 'Mencipta backup incremental EBS volume ke S3 untuk recovery atau create volumes baru dalam AZ atau region lain',
            scenario: 'EC2 kena ransomware, OS corrupted — restore EBS dari snapshot semalam. Atau copy snapshot ke region lain untuk DR, create new EC2 dari snapshot tu.',
            keywords: ['incremental backup', 'point-in-time', 'cross-AZ', 'cross-region copy', 'EC2 recovery'],
          },
          {
            shortName: 'FSx',
            fullName: 'Amazon FSx',
            ingat: '"EFS tapi untuk Windows, HPC, atau enterprise NAS"',
            gunaUntuk: 'Managed file systems: Windows SMB, HPC Lustre, NetApp ONTAP, OpenZFS',
            fungsi: 'Empat pilihan: FSx for Windows (SMB/NTFS, AD integration), FSx for Lustre (high-throughput HPC, S3 integration), FSx for NetApp ONTAP (enterprise NAS migration), FSx for OpenZFS.',
            scenario: '"Windows apps perlu SMB file share" → FSx for Windows. "HPC workload perlu high-throughput scratch storage" → FSx for Lustre. "Migrate on-prem NetApp storage ke AWS" → FSx for NetApp ONTAP.',
            tips: [
              'FSx for Lustre: natively integrates with S3 via Data Repository Associations (DRA) — objects lazily imported from S3, processed files can be exported back to S3',
              'FSx for Lustre + DataSync: DataSync supports FSx for Lustre as a transfer location — use for scheduled bulk transfers to/from FSx Lustre',
              'Exam: "POSIX + S3 integration + high throughput" → FSx for Lustre (not EFS). EFS is general-purpose NFS, no S3 native integration',
              'FSx for Windows: Single-AZ or Multi-AZ deployments; SSD or HDD storage; SMB/NTFS NOT POSIX',
              'FSx for Windows access: supports cross-VPC/account/region via VPC Peering or Transit Gateway; on-premises via Direct Connect or VPN',
              'DRA = Data Repository Association: links FSx Lustre file system to an S3 bucket for automatic import/export',
            ],
            keywords: ['Windows SMB', 'NTFS', 'Active Directory', 'Lustre HPC', 'NetApp ONTAP', 'OpenZFS', 'managed file system', 'S3 integration', 'DRA', 'DataSync', 'multi-AZ', 'single-AZ', 'POSIX'],
          },
          {
            shortName: 'Storage Gateway',
            fullName: 'AWS Storage Gateway',
            ingat: '"Jambatan antara on-premises apps dan AWS storage"',
            gunaUntuk: 'Hybrid cloud storage — on-premises apps guna AWS storage secara seamless',
            fungsi: 'Tiga jenis: File Gateway (NFS/SMB → S3), Volume Gateway (iSCSI block storage → EBS snapshots), Tape Gateway (virtual tape library → S3 Glacier). On-premises apps tak perlu tahu depa sebenarnya guna cloud storage.',
            scenario: '"On-premises apps nak access S3 via NFS" → File Gateway. "Replace physical tape library dengan cloud backup" → Tape Gateway. "Ongoing hybrid access" → Storage Gateway. Bukan DataSync (yang untuk one-time migration).',
            keywords: ['hybrid storage', 'File Gateway', 'Volume Gateway', 'Tape Gateway', 'on-premises', 'NFS', 'SMB', 'iSCSI'],
          },
          {
            shortName: 'DataSync',
            fullName: 'AWS DataSync',
            ingat: '"Pemindah data automatik dan laju — dari on-prem ke AWS atau cross-region"',
            gunaUntuk: 'One-time or recurring data migration from on-premises to S3, EFS, or FSx; also EFS cross-region replication',
            fungsi: 'Automated data transfer service yang handle scheduling, verification, dan network optimization. Boleh transfer data dari NFS, SMB, HDFS, atau S3-compatible storage ke AWS. Juga boleh replicate EFS data ANTARA regions melalui AWS private network.',
            scenario: '"Migrate 50TB dari on-premises NAS ke S3" → DataSync (lebih laju dan auto-verify vs manual). DataSync = MIGRATION task. Storage Gateway = ONGOING hybrid access. Ingat perbezaan ni — exam favourite!',
            tips: [
              'DataSync juga handle EFS → EFS cross-region replication (bukan setakat on-prem ke AWS sahaja)',
              'EFS cross-region via DataSync: transfer melalui AWS private network (bukan public internet) — secure by default',
              'Bukan Snowball untuk cross-region EFS (Snowball = physical device, untuk migration, bukan replication)',
              'Bukan VPN/open-source tools (lebih complex, kena manage sendiri)',
              'Exam: "replicate EFS data between regions securely without public internet" → AWS DataSync',
            ],
            keywords: ['data migration', 'automated transfer', 'S3', 'EFS', 'FSx', 'NFS', 'SMB', 'HDFS', 'one-time migration', 'EFS cross-region', 'private network', 'no public internet'],
          },
          {
            shortName: 'DMS',
            fullName: 'AWS Database Migration Service',
            ingat: '"Pindah database ke AWS tanpa downtime"',
            gunaUntuk: 'Migrate databases to AWS — homogeneous (MySQL→RDS MySQL) or heterogeneous (Oracle→Aurora)',
            fungsi: 'DMS replicate data dari source ke target dengan minimal downtime. Source database kekal running semasa migration. Schema Conversion Tool (SCT) untuk convert schema bila beza engine.',
            scenario: '"Migrate Oracle on-prem ke Aurora PostgreSQL" → DMS + SCT (heterogeneous). "Migrate MySQL on-prem ke RDS MySQL" → DMS sahaja (homogeneous). Source kekal up masa migration — near-zero downtime.',
            tips: [
              'Homogeneous migration (same engine): DMS sahaja cukup. E.g. MySQL → RDS MySQL, PostgreSQL → Aurora PostgreSQL',
              'Heterogeneous migration (different engine): DMS + SCT. SCT convert schema/stored procedures first, then DMS migrates data. E.g. Oracle → Aurora PostgreSQL',
              'CDC (Change Data Capture): continuous replication mode — keeps source and target in sync during cutover. Minimal downtime migration',
              'DMS replication instance runs in a VPC. Must have connectivity to both source and target databases',
              'Exam: "migrate database with minimal downtime" → DMS. "migrate entire server (OS + apps)" → MGN. "transfer files to S3" → DataSync',
              'Supports: on-prem → AWS, AWS → AWS (cross-region), AWS → on-prem. Not just one-way!',
              'Multi-AZ replication instance available for high availability during migration',
            ],
            keywords: ['database migration', 'minimal downtime', 'homogeneous', 'heterogeneous', 'Schema Conversion Tool', 'CDC', 'replication', 'Multi-AZ'],
          },
          {
            shortName: 'Snow Family',
            fullName: 'AWS Snow Family',
            ingat: '"Peti besi AWS untuk data besar-besaran — hantar by post"',
            gunaUntuk: 'Petabyte-scale data transfer bila internet terlalu lambat/mahal, atau edge computing',
            fungsi: 'Physical devices: Snowcone (8-14TB, smallest, edge compute), Snowball Edge Storage Optimized (210TB), Snowball Edge Compute Optimized (28TB NVMe, 104 vCPUs). Encrypt data, hantar ke AWS, AWS load ke S3.',
            scenario: '"Transfer 100TB data tapi internet ambil berbulan-bulan atau bandwidth mahal" → Snow Family. Rule of thumb: >1 week via internet → consider Snowball. Petabyte-scale → order multiple Snowball Edge devices.',
            compare: {
              label: 'Pick a Snow device by data size + compute',
              headers: ['Device', 'Capacity', 'Pick when'],
              rows: [
                ['Snowcone', '8TB HDD / 14TB SSD', 'Small, rugged, portable; light edge + transfer'],
                ['Snowball Edge Storage Optimized', '210TB NVMe', 'Large-scale data migration (default Snowball answer)'],
                ['Snowball Edge Compute Optimized', '28TB · 104 vCPUs · 416GB RAM', 'Edge ML inference / video processing'],
              ],
              takeaway: 'Pilih ikut data size + compute need. >1 week via internet → go Snow. Online migration to S3/EFS (network available) → DataSync, bukan Snow.',
            },
            tips: [
              'Snowcone: 8TB HDD or 14TB SSD. Smallest, lightest (4.5 lbs). Edge computing + data transfer. Battery-powered option. Use DataSync agent to send data online',
              'Snowball Edge Storage Optimized: 210TB NVMe. For large-scale data migration. Supports S3-compatible storage, NFS, EC2 compute',
              'Snowball Edge Compute Optimized: 28TB NVMe, 104 vCPUs, 416GB RAM. For ML inference, video processing at edge. Supports EC2 + EKS Anywhere',
              'All Snow devices: data encrypted with KMS keys (256-bit). Tamper-resistant enclosure. AWS wipes device after import',
              'Exam: "transfer petabytes offline" → Snowball Edge. "edge computing in disconnected location" → Snow Family. "online migration to S3/EFS" → DataSync (not Snow)',
              'Snowmobile: 100PB per truck. For exabyte-scale. Must be requested specially — rarely tested on SAA exam',
              'OpsHub: GUI application to manage Snow devices locally — configure, transfer data, launch EC2 instances',
            ],
            keywords: ['Snowcone', 'Snowball Edge', 'Snowmobile', 'physical transfer', 'petabyte', 'edge computing', 'offline migration', 'OpsHub', '210TB'],
          },
        ],
      },
      {
        id: 'd2-migrate',
        icon: '🚚',
        title: 'Migration & Transfer',
        category: 'd2migrate',
        services: [
          {
            shortName: 'Transfer Family',
            fullName: 'AWS Transfer Family',
            ingat: '"SFTP/FTP managed server — files terus masuk S3 atau EFS"',
            gunaUntuk: 'Legacy FTP/SFTP/FTPS/AS2 file transfers stored directly into S3 or EFS — no code changes needed',
            fungsi: 'Fully managed SFTP, FTPS, FTP, dan AS2 endpoints. Files yang di-upload terus land dalam S3 atau EFS. Partner companies boleh hantar files guna protokol lama tanpa kena tukar workflow mereka.',
            scenario: '"Partner hantar files guna SFTP protocol, nak store dalam S3" → Transfer Family. Fully managed SFTP endpoint — tak perlu setup EC2 SFTP server sendiri.',
            tips: [
              'Protocols supported: SFTP (SSH), FTPS (TLS), FTP (plain, dalam VPC je), AS2 (B2B EDI)',
              'Backend storage: S3 atau EFS. Files appear as normal S3 objects atau EFS files',
              'Exam keyword: "SFTP", "FTP", "legacy file transfer", "partner file exchange", "no code change" → Transfer Family',
              'Bukan DataSync (DataSync = automated scheduled migration. Transfer Family = ongoing SFTP endpoint for users/partners)',
              'Bukan Storage Gateway (Storage Gateway = hybrid storage access. Transfer Family = file transfer protocol endpoint)',
              'Identity providers: Service managed, Active Directory, custom Lambda-based',
            ],
            keywords: ['SFTP', 'FTP', 'FTPS', 'AS2', 'S3 backend', 'EFS backend', 'managed FTP', 'legacy protocol', 'B2B file transfer', 'no code change'],
          },
          {
            shortName: 'AWS MGN',
            fullName: 'AWS Application Migration Service (MGN)',
            ingat: '"Lift-and-shift server migration ke EC2 — continuous replication, minimal downtime"',
            gunaUntuk: 'Migrate servers (physical/virtual/cloud) to AWS EC2 with minimal downtime',
            fungsi: 'MGN melakukan continuous block-level replication dari source server ke AWS. Bila ready cutover, MGN launch EC2 instance dari replikasi latest. Minimal downtime. Gantikan CloudEndure Migration.',
            compare: {
              label: 'MGN vs DMS vs DataSync — what are you moving?',
              headers: ['Aspect', 'MGN', 'DMS', 'DataSync'],
              rows: [
                ['Moves', 'Whole server (OS + apps + data)', 'Databases', 'Files / objects'],
                ['Target', 'EC2', 'RDS, Aurora, EC2 DB, on-prem', 'S3, EFS, FSx'],
                ['How', 'Continuous block-level replication', 'Replication + CDC (live sync)', 'Scheduled transfer + verification'],
                ['Engine change', 'N/A (same server)', '🟢 Heterogeneous via SCT (Oracle→Aurora)', 'N/A'],
                ['Keyword', '"lift-and-shift server to EC2"', '"migrate database, minimal downtime"', '"transfer NAS/NFS files to S3"'],
              ],
              takeaway: 'Server (OS+apps) → MGN. Database → DMS (+SCT kalau tukar engine). Files to S3/EFS/FSx → DataSync. Application Discovery Service = planning sahaja, bukan migrate.',
            },
            tips: [
              'MGN = server migration (OS + apps + data). DMS = database migration only. DataSync = file/object data transfer',
              'Application Discovery Service = discovery/planning phase bukan migration',
              'Exam: "migrate entire server/application to EC2 with minimal downtime" → AWS MGN',
              'Supports: physical servers, VMware, Hyper-V, cloud instances → EC2',
            ],
            keywords: ['MGN', 'lift-and-shift', 'server migration', 'EC2 migration', 'block replication', 'minimal downtime'],
          },
          {
            shortName: 'Migration Hub',
            fullName: 'AWS Migration Hub',
            ingat: '"Dashboard pusat untuk track semua migration activities"',
            gunaUntuk: 'Single pane of glass to track application migrations across multiple AWS tools',
            fungsi: 'Migration Hub aggregates migration status dari pelbagai tools (DMS, MGN, DataSync) ke satu dashboard. Kau boleh group resources into applications dan track progress setiap migration. Requires setting a home region.',
            scenario: '"Migrating 50 servers using MGN + 10 databases using DMS — nak track semua dari satu tempat" → Migration Hub. Track progress, view status, group by application.',
            tips: [
              'Migration Hub does NOT perform migration — it TRACKS migrations done by other tools (DMS, MGN, etc.)',
              'Home region: must select one region to store all migration tracking data. Migration itself can target any region',
              'Strategy Recommendations: helps plan which apps to rehost, replatform, or refactor',
              'Migration Hub Orchestrator: automate migration workflows with predefined templates',
              'Refactor Spaces: starting point for incremental refactoring to microservices',
              'Exam: "single dashboard to track migrations across tools" → Migration Hub. "actually migrate servers" → MGN. "migrate databases" → DMS',
            ],
            keywords: ['migration tracking', 'dashboard', 'home region', 'strategy recommendations', 'orchestrator', 'refactor spaces'],
          },
          {
            shortName: 'AWS Outposts',
            fullName: 'AWS Outposts',
            ingat: '"AWS datang ke rumah kau — rack AWS dalam data center sendiri"',
            gunaUntuk: 'Run AWS services on-premises for compliance, low latency, or data residency requirements',
            fungsi: 'AWS Outposts adalah physical rack AWS yang dihantar dan dipasang dalam data center kau. Kau boleh run EC2, RDS, ECS, EKS, S3 on Outposts — semua dengan AWS APIs yang sama. Data tak keluar dari premise kau.',
            tips: [
              'Outposts = AWS infrastructure ON-PREMISES — bukan data transfer service',
              'Use case: regulatory compliance (data must stay on-prem), low-latency access to on-prem systems, local data processing',
              'Bukan DataSync (data transfer), bukan Storage Gateway (hybrid storage only), bukan Snow Family (one-time migration)',
              'Exam: "database must stay on-premises due to compliance, extend AWS services to on-prem" → AWS Outposts',
              'Outposts connect ke AWS region melalui internet atau Direct Connect untuk management plane',
            ],
            keywords: ['Outposts', 'on-premises AWS', 'data residency', 'compliance', 'local processing', 'hybrid'],
          },
        ],
      },
    ],
  },
  {
    id: 'domain3',
    badge: 'DOMAIN 3 · 24% OF EXAM',
    title: 'Design High-Performing Architectures',
    subtitle: 'Compute · Storage · Networking · Messaging · Infrastructure',
    variant: 'd3',
    sections: [
      {
        id: 'd3-compute',
        icon: '🖥️',
        title: 'Compute',
        category: 'compute',
        services: [
          {
            shortName: 'EC2',
            fullName: 'Elastic Compute Cloud',
            ingat: '"Virtual computer"',
            gunaUntuk: 'Run any workload, full control',
            fungsi: 'Menyediakan kapasiti compute yang boleh diubah saiz dalam cloud',
            contohGuna: 'Host web server, run database, legacy app migration',
            compare: {
              label: 'Placement Groups — macam mana EC2 disusun atas hardware fizikal',
              headers: ['Aspect', 'Cluster', 'Partition', 'Spread'],
              rows: [
                ['Susunan', 'Pack RAPAT dalam 1 AZ, segment network high-bandwidth sama', 'Bahagi kepada partition; tiap partition guna rack (kuasa + network) berasingan', 'Tiap instance atas hardware BERLAINAN (rack berbeza)'],
                ['Tujuan', '🟢 Latency rendah + throughput tinggi (sampai 10 Gbps single-flow)', '🟢 Hadkan kesan kegagalan hardware ke satu partition sahaja', '🟢 Kurangkan correlated failure — instance kritikal tak fail serentak'],
                ['Best untuk', 'HPC, tightly-coupled (banyak traffic node-to-node)', 'Big data teragih: HDFS, HBase, Cassandra, Kafka', 'Segelintir instance kritikal (cth domain controller, node quorum)'],
                ['Span AZ?', '🔴 1 AZ sahaja', '🟢 Multi-AZ (maks 7 partition / AZ)', '🟢 Multi-AZ (maks 7 instance / AZ / group)'],
                ['Tahan failure', 'Paling lemah — 1 rack/AZ jatuh, semua kena', 'Sederhana — failure terhad ke 1 partition', '🟢 Paling tahan — hardware berasingan sepenuhnya'],
              ],
              takeaway: 'Cara ingat 3C-P-S: Cluster = "Close" (rapat, low-latency HPC). Partition = "Pisah rack" (big data teragih — Hadoop/Cassandra/Kafka). Spread = "Separate hardware" (instance kritikal, maks 7/AZ). Placement group PERCUMA. Satu instance = satu placement group sahaja; tak boleh merge group.',
            },
            tips: [
              'Soalan sebut "lowest latency / highest throughput / HPC" → Cluster. Sebut "large distributed/replicated (Hadoop, Cassandra, Kafka)" → Partition. Sebut "critical instances mesti elak simultaneous failure" → Spread',
              'Spread = maks 7 running instances per AZ per group; Partition = maks 7 partition per AZ — angka 7 ni selalu jadi distractor exam',
              'EC2 purchasing: On-Demand (bayar ikut guna, no commit) · Reserved/Savings Plans (commit 1–3 thn, jimat sampai ~72%) · Spot (sampai 90% murah, boleh kena reclaim) · Dedicated Host (hardware fizikal khas, untuk lesen BYOL)',
            ],
            keywords: ['full control', 'custom OS', 'lift and shift', 'placement groups', 'cluster/partition/spread'],
          },
          {
            shortName: 'Lambda',
            fullName: 'AWS Lambda',
            ingat: '"Jalankan code, bayar per run"',
            gunaUntuk: 'Serverless, event-driven',
            fungsi: 'Melaksanakan kod tanpa perlu mengurus server',
            contohGuna: 'Resize image bila upload ke S3, webhook handler, scheduled tasks',
            compare: {
              label: 'Reserved vs Provisioned Concurrency — selalu tertukar',
              headers: ['Aspect', 'Reserved Concurrency', 'Provisioned Concurrency'],
              rows: [
                ['Buat apa', 'Reserve & HADKAN bilangan concurrent execution untuk satu function', 'Pre-init (warm) sejumlah execution environment supaya siap sedia'],
                ['Tujuan utama', 'Jamin kuota function kritikal + halang ia makan semua kuota account', 'Hapuskan COLD START — environment dah init, respond serta-merta'],
                ['Cold start?', '🔴 Masih ada cold start', '🟢 Tiada cold start (dah pre-initialized)'],
                ['Kos', '🟢 Percuma — cuma agih semula kuota sedia ada', '💰 Bayar untuk environment yang di-warm (caj per jam)'],
                ['Guna bila', 'Elak runaway function / jamin kuota function penting', 'Latency-sensitive + trafik boleh dijangka (cth waktu puncak)'],
              ],
              takeaway: 'Reserved = "RESERVE seat + cap" (jamin & hadkan kuota, masih cold start, percuma). Provisioned = "PRE-warm" (bayar untuk buang cold start). Default account = 1,000 concurrent execution per region (soft limit — boleh mohon naik ke puluhan ribu).',
            },
            tips: [
              'Had penting: maks 15 minit (900s) per invocation. Job lebih lama → guna ECS/Fargate, AWS Batch, atau Step Functions',
              'Memory 128 MB–10,240 MB (step 1 MB). CPU naik IKUT memory — 1,769 MB = 1 vCPU penuh. Nak laju? naik memory, CPU auto naik',
              'Concurrent executions default = 1,000/region (soft). Lebih → throttle (429 TooManyRequestsException)',
              '/tmp ephemeral storage: 512 MB default, boleh naik sampai 10,240 MB (10 GB)',
              'Deployment package: 50 MB (zip, direct upload) / 250 MB (unzipped + layers), atau container image sampai 10 GB',
              'Cold start = masa init environment + load code; teruk untuk VPC/package besar. Kurangkan dengan Provisioned Concurrency',
            ],
            scenario: 'Sebut "predictable spike, mesti respond cepat TANPA cold start" → Provisioned Concurrency. Sebut "satu function jangan habiskan semua kuota / jamin kuota function kritikal" → Reserved Concurrency. Sebut "job ambil masa lebih 15 minit" → Lambda TAK sesuai (guna Fargate/Batch/Step Functions).',
            keywords: ['serverless', 'event-driven', '15-min max', 'reserved concurrency', 'provisioned concurrency', 'cold start'],
          },
          {
            shortName: 'Elastic Beanstalk',
            fullName: 'AWS Elastic Beanstalk',
            ingat: '"Hantar code je, AWS urus selebihnya"',
            gunaUntuk: 'Deploy app tanpa urus server',
            fungsi: 'Mengurus deployment, scaling dan monitoring aplikasi secara automatik',
            contohGuna: 'Deploy Node.js / Python app tanpa urus EC2 sendiri',
            compare: {
              label: 'JANGAN KELIRU — semua "Elastic ___" & short form yang serupa',
              headers: ['Short form', 'Nama penuh', 'Ia apa SEBENARNYA'],
              rows: [
                ['Elastic Beanstalk', 'AWS Elastic Beanstalk', '🚀 PaaS — hantar code, AWS auto-bina EC2 + ALB + ASG. Platform untuk DEPLOY app'],
                ['EBS', 'Elastic Block Store', '💾 Disk (block storage) yang attach ke EC2. STORAGE — bukan deploy!'],
                ['EFS', 'Elastic File System', '📁 Shared file storage (NFS) — banyak EC2 mount serentak'],
                ['ELB', 'Elastic Load Balancing', '⚖️ Service load balancer (payung untuk ALB/NLB/GWLB/CLB)'],
                ['ALB / NLB / GWLB', 'Application / Network / Gateway LB', 'Jenis ELB: ALB = L7 HTTP, NLB = L4 TCP/UDP + static IP, GWLB = security appliance'],
                ['EC2', 'Elastic Compute Cloud', '🖥️ Virtual server (compute)'],
                ['ECS / EKS / ECR', 'Container Service / Kubernetes / Registry', 'ECS = run Docker · EKS = run Kubernetes · ECR = simpan image Docker'],
                ['ElastiCache', 'Amazon ElastiCache', '⚡ In-memory cache (Redis/Memcached) — bukan storage kekal'],
              ],
              takeaway: 'Trick: nama ada "Store/Storage/System/File" = SIMPAN data (EBS, EFS). "Beanstalk" = Bina & deploy APP. "Load Balancing/ALB/NLB" = edar trafik. "Compute/EC2" = server. Yang paling kerap tertukar: EBS (disk) vs Elastic Beanstalk (deploy) — keduanya start "EB" tapi langsung tak sama!',
            },
            tips: [
              'Beanstalk = PaaS: kau hantar code (.zip/.war), ia auto-create EC2 + ALB + Auto Scaling + health monitoring. Kau MASIH boleh akses & tweak resource bawah (beza dengan Lambda yang fully managed)',
              'Beanstalk PERCUMA — bayar hanya resource bawah (EC2, ALB, dll) yang ia provision',
              'Beanstalk vs CloudFormation: Beanstalk = deploy APP cepat (opinionated); CloudFormation = IaC general untuk SEMUA jenis resource',
              'Beanstalk vs Lambda: Beanstalk = app sentiasa run atas server (kau nampak EC2); Lambda = event-driven, no server',
              'INGAT: EBS = disk storage. Elastic Beanstalk = deploy app. Exam suka uji kekeliruan ni!',
            ],
            scenario: 'Sebut "developer nak deploy web app cepat, ada CI/CD, tak nak urus infra TAPI masih nak kawalan ke atas EC2/scaling" → Elastic Beanstalk. "Fully serverless, no server langsung" → Lambda/Fargate. "Attach disk ke EC2" → itu EBS, bukan Beanstalk.',
            keywords: ['PaaS', 'deploy app', 'developer friendly', 'auto EC2+ALB+ASG', 'free service'],
          },
          {
            shortName: 'ECS',
            fullName: 'Elastic Container Service',
            ingat: '"Docker manager"',
            gunaUntuk: 'Run containers',
            fungsi: 'Mengurus dan menjalankan Docker containers pada cluster',
            contohGuna: 'Run microservices dalam Docker, e-commerce modules',
            compare: [
              {
                label: 'EC2 launch type vs Fargate',
                headers: ['Aspect', 'EC2 launch type', 'Fargate'],
                rows: [
                  ['Infrastructure', '🔴 You manage EC2 instances', '🟢 Serverless — AWS manages it'],
                  ['Patching/scaling hosts', 'Your responsibility', 'No hosts to manage'],
                  ['Pricing', 'Pay for EC2 instances (per-instance)', 'Pay per task vCPU + memory'],
                  ['Best for', 'Cost control at scale, GPU, special host config', 'Variable load, least ops overhead'],
                ],
                takeaway: '"Least operational overhead / no servers to manage" → Fargate. "Need control over the host (GPU, large reserved fleet, cheaper at steady scale)" → EC2 launch type.',
              },
              {
                label: 'Task Placement Strategies (EC2 launch type sahaja)',
                headers: ['Strategy', 'Buat apa', 'Optimize untuk'],
                rows: [
                  ['binpack', 'Pack tasks ke instance yang ada paling SIKIT CPU/mem lagi cukup', '🟢 Kos — guna instance sepenuh, kurangkan bilangan instance'],
                  ['spread', 'Agih tasks SAMA RATA ikut attribute (cth AZ, instanceId)', '🟢 Availability / HA'],
                  ['random', 'Letak tasks secara rawak', 'Mudah, tiada keutamaan'],
                ],
                takeaway: 'Jimat duit / packing padat → binpack. Tahan failure / sebar across AZ → spread (selalu spread by AZ). Constraint pula: distinctInstance (satu task satu instance), memberOf (ikut syarat). NOTA: Fargate = best-effort AZ spread sahaja, TAK support strategy/constraint.',
              },
            ],
            tips: [
              'Task placement: binpack = jimat kos (padat), spread = HA (sebar AZ), random = rawak. Constraint: distinctInstance, memberOf',
              'Task Definition = JSON template yang describe containers untuk application (image, CPU, memory, ports, env vars, volumes)',
              'Task Definition BUKAN: IAM template, bukan service yang launch clusters, bukan program yang run — ia BLUEPRINT untuk containers',
              'ECS Launch Types: Fargate (serverless, AWS manage infrastructure) vs EC2 (kau manage EC2 cluster)',
              'Task = running instance of a Task Definition. Service = maintain desired number of running tasks',
              'Exam: "best describes a task definition" → JSON template that describes containers that form your application',
            ],
            keywords: ['Docker', 'containers', 'microservices', 'task definition', 'JSON template', 'Fargate', 'EC2 launch type', 'service'],
          },
          {
            shortName: 'EKS',
            fullName: 'Elastic Kubernetes Service',
            ingat: '"Kubernetes manager"',
            gunaUntuk: 'Container orchestration guna K8s',
            fungsi: 'Mengurus Kubernetes cluster untuk container orchestration',
            contohGuna: 'Large-scale containerized apps yang guna K8s',
            compare: {
              label: 'ECS vs EKS — bila pilih yang mana',
              headers: ['Aspect', 'ECS', 'EKS'],
              rows: [
                ['Orchestrator', 'AWS proprietary (mudah)', 'Kubernetes (standard industri)'],
                ['Learning curve', '🟢 Rendah — AWS-native', '🔴 Tinggi — perlu tahu K8s'],
                ['Portability', 'AWS-centric', '🟢 Portable (K8s di mana-mana)'],
                ['Kos control plane', 'Percuma', '~$0.10/jam per cluster'],
                ['Serverless data plane', 'Fargate', 'Fargate (boleh juga)'],
                ['Guna bila', 'Nak cepat, AWS sahaja, simple', 'Dah ada K8s skill/tooling, multi-cloud, ekosistem K8s'],
              ],
              takeaway: 'Default + ringkas + AWS sahaja → ECS. Dah pakai Kubernetes / nak portable / ada team K8s → EKS. Dua-dua boleh guna Fargate untuk buang urusan server. "Least ops + no K8s knowledge" → ECS Fargate.',
            },
            tips: [
              'IRSA (IAM Roles for Service Accounts): pods assume IAM roles via service account annotation — no credentials stored anywhere',
              'Best practice for EKS pods to access AWS services (Secrets Manager, S3, DynamoDB) without embedding credentials',
              'ConfigMaps = non-sensitive config data. NOT for secrets. Kubernetes Secrets + IRSA = proper pattern',
              'Exam: "EKS pods need access to Secrets Manager without credentials in container image" → IRSA + Kubernetes Secrets',
            ],
            keywords: ['Kubernetes', 'K8s', 'container orchestration', 'IRSA', 'IAM Roles for Service Accounts', 'pod identity'],
          },
          {
            shortName: 'EKS Variants',
            fullName: 'EKS Anywhere vs EKS Distro vs ECS Anywhere',
            ingat: '"EKS Anywhere = K8s on-prem + AWS control plane. EKS Distro = pure on-prem, no AWS control plane. ECS Anywhere = ECS on-prem"',
            gunaUntuk: 'Run container workloads on-premises with varying levels of AWS integration',
            fungsi: 'AWS menyediakan pelbagai pilihan untuk run containers on-premises dengan degrees berbeza dari AWS control plane dependency.',
            storageDetails: 'EKS Anywhere → Deploy K8s clusters on-prem using open-source tools, connected to AWS control plane for management consistency\nEKS Distro → AWS K8s distribution used by EKS — run fully on-prem, NO AWS control plane dependency. Full open-source freedom\nECS Anywhere → Run ECS tasks on on-premises servers, managed by AWS ECS control plane',
            detailsLabel: 'Variants',
            tips: [
              'EKS Anywhere: "open-source Kubernetes + on-prem + consistency with AWS control plane" → EKS Anywhere',
              'EKS Distro: "no AWS lock-in + no AWS control plane + on-prem Kubernetes" → EKS Distro',
              'ECS Anywhere: "run ECS tasks on-premises" → ECS Anywhere',
              'Exam trick: kalau soalan sebut "open-source" + "on-prem" + "AWS control plane consistency" → EKS Anywhere (bukan EKS Distro)',
            ],
            keywords: ['EKS Anywhere', 'EKS Distro', 'ECS Anywhere', 'on-premises Kubernetes', 'hybrid containers'],
          },
          {
            shortName: 'EC2 User Data',
            fullName: 'EC2 User Data Scripts',
            ingat: '"Script masa launch"',
            gunaUntuk: 'Auto-configure EC2 instance on first boot',
            fungsi: 'Skrip yang dijalankan sekali masa instance pertama kali launch — install software, configure app, pull code dari repo. Max 16KB. Guna bash script atau cloud-init.',
            contohGuna: 'Launch EC2 → User Data install Apache + download web app secara automatik. Developer tak perlu SSH masuk untuk setup.',
            scenario: '"EC2 fleet baru launch perlu auto-install software tanpa manual SSH" → User Data. Keyword: during instance launch, bootstrap, initialization script.',
            keywords: ['bootstrap', 'launch script', 'cloud-init', 'first boot', 'initialization', '16KB limit'],
          },
          {
            shortName: 'EC2 Hibernation',
            fullName: 'Amazon EC2 Hibernation',
            ingat: '"EC2 tidur tapi ingat semua — RAM saved to EBS"',
            gunaUntuk: 'Preserve in-memory state across stop/start — fast resume for memory-intensive apps',
            fungsi: 'Hibernation saves seluruh RAM contents ke EBS root volume. Bila resume, OS dan app state adalah exactly sama seperti sebelum — tiada re-initialization. Berbeza dengan Stop/Start (yang lose RAM state) dan reboot (yang restart OS).',
            tips: [
              'Hibernation saves RAM to EBS root volume (must be encrypted)',
              'Resume time = sangat cepat vs cold start (no app re-initialization)',
              'Use case: memory-intensive apps yang ambil masa lama nak load (e.g. in-memory cache warm-up)',
              'Not all instance types support hibernation. Root EBS volume MESTI encrypted',
              'Exam: "preserve in-memory state + fast recovery" → EC2 Hibernation. Bukan AMI (AMI = snapshot, no RAM state)',
            ],
            keywords: ['hibernation', 'RAM save', 'EBS root', 'fast resume', 'in-memory state', 'encrypted root volume'],
          },
          {
            shortName: 'EC2 Metadata',
            fullName: 'EC2 Instance Metadata Service (IMDS)',
            ingat: '"ID kad instance sendiri"',
            gunaUntuk: 'Get info about the running instance from within the instance',
            fungsi: 'Menyediakan data tentang instance itu sendiri — IP address, instance ID, IAM role name, security groups, hostname. Accessible dari dalam instance via http://169.254.169.254/latest/meta-data/',
            contohGuna: 'App dalam EC2 nak tau public IP dia sendiri atau nama IAM role yang attached — query Metadata endpoint tanpa perlu AWS CLI.',
            scenario: '"Script dalam EC2 nak retrieve IAM role credentials atau instance ID" → Instance Metadata. Bukan untuk run scripts. Keyword: 169.254.169.254, info about instance.',
            keywords: ['169.254.169.254', 'instance info', 'IMDSv2', 'hostname', 'IP address', 'IAM role name'],
          },
          {
            shortName: 'Recycle Bin',
            fullName: 'AWS Recycle Bin (AMI & EBS Snapshots)',
            ingat: '"Tong sampah untuk AMI dan snapshots — boleh recover dalam tempoh tertentu"',
            gunaUntuk: 'Recover accidentally deleted AMIs and EBS snapshots within a defined retention period',
            fungsi: 'Recycle Bin menyimpan AMIs dan EBS snapshots yang deleted untuk tempoh yang kau tentukan (up to 1 year). Kalau terhapus, boleh restore dari Recycle Bin. Selepas retention period, permanently deleted.',
            tips: [
              'Recycle Bin = safety net untuk accidental AMI/EBS snapshot deletion',
              'Retention period: 1 day to 1 year. Set via Retention Rule dalam Recycle Bin console',
              'Exam: "prevent permanent loss of accidentally deleted AMIs" → Recycle Bin',
              'CloudFormation StackSets tidak boleh recover deleted AMIs — ia untuk multi-account/region deployment',
            ],
            keywords: ['Recycle Bin', 'AMI recovery', 'EBS snapshot recovery', 'accidental deletion', 'retention period'],
          },
          {
            shortName: 'AWS Batch',
            fullName: 'AWS Batch',
            ingat: '"Managed batch jobs — tak payah manage EC2 fleet sendiri"',
            gunaUntuk: 'Run batch computing jobs at scale without managing EC2 infrastructure',
            fungsi: 'AWS Batch menguruskan semua infrastruktur untuk batch jobs: provision compute resources yang sesuai, schedule jobs dalam queues, monitor dan scale EC2 fleet secara automatik. Menggantikan third-party batch software seperti PBS, Slurm, LSF.',
            scenario: '"Company guna third-party software untuk manage EC2 fleet untuk batch jobs, nak switch ke AWS managed service" → AWS Batch.',
            tips: [
              'Batch = untuk jobs yang run sampai habis (start-to-finish), bukan continuous workloads',
              'AWS Batch auto-provision EC2 (termasuk Spot untuk jimat kos)',
              'Ingat: Batch ≠ SSM (SSM = manage existing infra). Batch ≠ Athena (Athena = query S3 data)',
            ],
            docs: [{ label: 'AWS Batch', url: 'https://aws.amazon.com/batch/' }],
            keywords: ['AWS Batch', 'batch computing', 'managed', 'job queue', 'EC2 fleet', 'replace third-party'],
          },
          {
            shortName: 'Fargate',
            fullName: 'AWS Fargate',
            ingat: '"Serverless CONTAINER — bawak Docker image je, tak payah ada EC2"',
            gunaUntuk: 'Run container (ECS/EKS) tanpa urus EC2 langsung',
            fungsi: 'Fargate = serverless compute engine untuk CONTAINER (ECS & EKS). Kau bungkus app dalam Docker image, set CPU + memory per task, define networking + IAM — Fargate yang provision, run, patch & scale compute secara automatik. Tiada EC2 instance untuk kau urus. Tiap task ada isolation sendiri (tak kongsi kernel/CPU/memory/ENI dengan task lain). Bayar per vCPU + memory per SAAT masa task running.',
            diagram: {
              label: 'Macam mana Fargate jalan — kau bagi image, AWS bagi compute',
              steps: [
                { nodes: [{ label: 'Docker Image', sub: 'app kau (dari ECR)', tone: 'c1' }] },
                { nodes: [{ label: 'Task Definition', sub: 'set vCPU + memory + IAM', tone: 'c2' }] },
                { nodes: [{ label: 'ECS / EKS', sub: 'orchestrator', tone: 'c3' }] },
                { nodes: [{ label: 'Fargate', sub: 'auto-provision compute terpencil', tone: 'c5' }] },
                { nodes: [{ label: 'Task Running', sub: 'bayar per vCPU+mem / saat', tone: 'c4' }] },
              ],
              caption: 'Kau TAK pernah sentuh EC2 — no patching, no cluster scaling, no capacity planning. Fargate uruskan compute; kau urus container je. Nak murah + boleh kena interrupt? guna Fargate Spot (diskaun, amaran 2 minit sebelum reclaim).',
            },
            compare: [
              {
                label: 'Fargate vs Lambda — dua-dua "serverless" tapi LAIN',
                headers: ['Aspect', 'Fargate', 'Lambda'],
                rows: [
                  ['Unit', 'CONTAINER (Docker image) — task/pod', 'FUNCTION (code handler)'],
                  ['Cocok untuk', 'App long-running: web server, API, microservice', 'Tugas pendek event-driven: trigger, webhook, ETL kecil'],
                  ['Had masa', '🟢 Tiada had — boleh run 24/7', '🔴 Maks 15 minit per invocation'],
                  ['Cetusan', 'Sentiasa run / desired count (ada orchestrator)', 'Event (S3, API Gateway, EventBridge, dll)'],
                  ['Scaling', 'Naik/turun ikut task count (autoscaling)', '🟢 Auto, sampai ke ZERO, per-request'],
                  ['Bil', 'Per vCPU + memory / saat (masa running)', 'Per request + duration (ms)'],
                  ['Kawalan', 'Penuh atas container/OS image + networking', 'Minimal — AWS urus runtime'],
                ],
                takeaway: 'Cara ingat: Lambda = "Fungsi pendek, event cetus, ≤15 min, scale to zero." Fargate = "Container penuh, run lama/sentiasa, no time limit." Dah ada Docker image / app run berterusan / perlu >15 min → Fargate. Cebisan code dicetus oleh event → Lambda.',
              },
              {
                label: '3 cara run container atas AWS — siapa urus server?',
                headers: ['Cara', 'Siapa urus server?', 'Guna bila'],
                rows: [
                  ['ECS/EKS on EC2', '🔴 Kau urus EC2 (patch, scale, pack)', 'Nak kawal host (GPU, fleet besar steady, murah at scale)'],
                  ['ECS/EKS on Fargate', '🟢 AWS urus (serverless)', 'Least ops, variable load, tak nak fikir server'],
                  ['Lambda', '🟢 AWS urus (serverless)', 'Event-driven, tugas pendek ≤15 min'],
                ],
                takeaway: '"Run container, least operational overhead, no servers" → Fargate. "Need host-level control / cheapest at steady scale" → EC2 launch type. "Short event-driven function" → Lambda (bukan container).',
              },
            ],
            scenario: '"Migrate Docker app ke AWS, run berterusan, TAK nak urus EC2 langsung" → ECS/EKS on Fargate. "Job ambil masa >15 minit" → Fargate (bukan Lambda). "Resize image bila upload S3" → Lambda (event pendek). "Perlu GPU / fleet besar 24/7 paling murah" → ECS on EC2.',
            tips: [
              'Fargate = serverless CONTAINER engine untuk ECS & EKS. Kau bawak image, AWS bawak compute',
              'Fargate Spot: diskaun besar untuk task yang tahan interrupt (amaran 2 minit) — macam Spot untuk container',
              'Tiap Fargate task terpencil (own kernel/CPU/memory/ENI) — tak kongsi dengan task lain',
              'Beza dengan Lambda: Fargate = "Full container, no time limit." Lambda = "Function, ≤15 min, event-driven, scale to zero."',
              'Fargate lagi mahal per unit dari EC2 reserved, tapi zero infra management — kau bayar untuk kesenangan',
            ],
            keywords: ['serverless containers', 'ECS', 'EKS', 'no EC2 management', 'pay per vCPU/memory', 'Fargate Spot', 'vs Lambda', 'no time limit'],
          },
          {
            shortName: 'ECR',
            fullName: 'Amazon Elastic Container Registry',
            ingat: '"Docker Hub versi AWS — private, IAM-controlled"',
            gunaUntuk: 'Simpan, version & deploy Docker image secara private dalam AWS',
            fungsi: 'Fully managed PRIVATE container registry. Simpan & version Docker/OCI images. Integrate dengan IAM untuk access control, auto-scan vulnerability, encrypt at rest (KMS). Native dengan ECS, EKS, dan Fargate.',
            diagram: {
              label: 'Anatomy push → store → pull',
              steps: [
                { nodes: [{ label: 'docker build', sub: 'buat image lokal', tone: 'c1' }] },
                { nodes: [{ label: 'docker push', sub: 'ke ECR repo (IAM auth)', tone: 'c2' }] },
                { nodes: [{ label: 'ECR Repository', sub: 'private · encrypted · scanned', tone: 'c5' }] },
                { nodes: [{ label: 'ECS / EKS / Fargate', sub: 'pull image → run task', tone: 'c4' }] },
              ],
              caption: 'Login dulu (ecr get-login-password), kemudian push image. ECS/EKS/Fargate akan pull dari ECR masa launch task. Lifecycle policy auto-buang image lama supaya jimat storage.',
            },
            scenario: '"Store container images untuk ECS/EKS deployment" → ECR. Bukan Docker Hub (public). ECR = private, IAM-controlled, vulnerability scanning built-in. Images auto-encrypt at rest dengan KMS.',
            tips: [
              'ECR = PRIVATE registry (lawan Docker Hub yang public). Access guna IAM, bukan login Docker Hub',
              'Image scanning: basic (on push) atau enhanced (guna Amazon Inspector) untuk cari CVE/vulnerability',
              'Lifecycle policy: auto-expire image lama / untagged supaya storage tak membengkak',
              'Encrypt at rest dengan KMS; ada cross-region & cross-account replication',
              'Exam: "store container images privately untuk ECS/EKS" → ECR. "scan image untuk vulnerability" → ECR image scanning (+ Inspector)',
            ],
            keywords: ['container registry', 'Docker images', 'private registry', 'IAM integration', 'image scanning', 'lifecycle policy', 'KMS', 'ECS', 'EKS'],
          },
        ],
      },
      {
        id: 'd3-storage',
        icon: '💾',
        title: 'Storage',
        category: 'storage',
        services: [
          {
            shortName: 'EBS',
            fullName: 'Elastic Block Store',
            ingat: '"Hard disk untuk EC2"',
            gunaUntuk: 'Block storage, attach ke 1 EC2',
            fungsi: 'Menyediakan block-level storage yang boleh di-attach kepada EC2 instance',
            contohGuna: 'OS drive untuk EC2, database storage',
            tips: [
              'Instance store vs EBS: Instance store = ephemeral (data HILANG bila stop/terminate). EBS = persistent (data kekal)',
              'Instance store volumes BOLEH ditentukan HANYA masa launch — tak boleh tambah lepas instance running',
              'EBS encryption: encrypts at rest AND in transit (between volume and instance). ALL current AND previous gen instance types supported.',
              'EBS Elastic Volumes: resize, retype, adjust IOPS/throughput TANPA detach atau downtime. Lepas resize, extend filesystem: growpart + resize2fs (Linux)',
              '"Volume running out of space, minimal config changes" → increase EBS volume size (Elastic Volumes). Bukan snapshot+new volume (extra steps).',
              'Unencrypted snapshot → encrypted volume: BOLEH. Pilih encrypt semasa create volume dari snapshot. Tak perlu enable account-level default encryption.',
            ],
            keywords: ['block storage', 'single EC2', 'persistent disk', 'instance store', 'ephemeral', 'Elastic Volumes', 'resize', 'encryption', 'data in transit'],
          },
          {
            shortName: 'EBS Volume Types',
            fullName: 'Amazon EBS — Volume Types & Multi-Attach',
            ingat: '"gp3 = general best. io2 = mission-critical + Multi-Attach. st1 = sequential log. sc1 = cold"',
            gunaUntuk: 'Choose right EBS type for workload: random I/O vs sequential, IOPS vs throughput, cost vs performance',
            fungsi: 'EBS ada 4 jenis: SSD-backed (gp2, gp3, io1, io2) untuk IOPS-intensive, HDD-backed (st1, sc1) untuk throughput-intensive sequential.',
            storageDetails: 'gp3 → General Purpose SSD. Up to 16,000 IOPS, 1,000 MB/s throughput independently configurable. Default choice.\ngp2 → Older General Purpose. Burst IOPS (3 IOPS/GB). Less predictable under sustained load\nio2 → Provisioned IOPS SSD. Up to 64,000 IOPS. 99.999% durability. Supports Multi-Attach\nio1 → Older Provisioned IOPS. Up to 64,000 IOPS. Supports Multi-Attach\nst1 → Throughput-Optimized HDD. Sequential workloads: log processing, ETL, big data. NOT for random I/O\nsc1 → Cold HDD. Lowest cost. Infrequently accessed data',
            detailsLabel: 'EBS Types',
            compare: {
              label: 'EBS volume types — IOPS vs throughput vs cost',
              headers: ['Type', 'Kategori', 'Max prestasi', 'Best untuk', 'Multi-Attach'],
              rows: [
                ['gp3', 'SSD', '16,000 IOPS · 1,000 MB/s', '🟢 Default — boot, most workloads', '❌'],
                ['gp2', 'SSD', '16,000 IOPS (burst 3/GB)', 'Older general purpose', '❌'],
                ['io2', 'SSD', '64,000+ IOPS · 99.999% durable', 'Mission-critical DB, latency rendah', '🟢 Ya'],
                ['io1', 'SSD', '64,000 IOPS', 'Older provisioned IOPS', '🟢 Ya'],
                ['st1', 'HDD', '500 MB/s throughput', 'Big data, log, ETL (sequential)', '❌'],
                ['sc1', 'HDD', '250 MB/s · kos terendah', 'Cold / infrequent access', '❌'],
              ],
              takeaway: 'SSD (gp/io) = random I/O & IOPS-bound (database, boot volume). HDD (st1/sc1) = sequential throughput / cold storage — BUKAN untuk random I/O. Multi-Attach HANYA io1/io2. Tak pasti? → gp3.',
            },
            tips: [
              'Multi-Attach: HANYA io1 dan io2 — attach satu EBS ke multiple EC2 instances simultaneously',
              'gp2, gp3, st1, sc1 TIDAK support Multi-Attach',
              'Exam: "shared block storage across multiple EC2 nodes (EKS)" → io2 with Multi-Attach. "Truly shared file storage" → EFS',
              'Database needing consistent IOPS under sustained load → gp3 (cheaper) atau io2 (mission-critical)',
              'Large sequential writes (log processing) → st1 (bukan gp3 atau io2 — they are random I/O optimized)',
              'Pattern: "database + log processing on same EC2" → io2 or gp3 for DB, st1 for logs',
            ],
            keywords: ['gp3', 'io2', 'st1', 'sc1', 'Multi-Attach', 'Provisioned IOPS', 'throughput HDD', 'EBS types'],
          },
          {
            shortName: 'EFS',
            fullName: 'Elastic File System',
            ingat: '"Shared drive, ramai boleh access — multi-AZ NFS"',
            gunaUntuk: 'Shared file storage for multiple EC2 instances simultaneously',
            fungsi: 'Managed NFS (Network File System) that scales automatically. Multiple EC2 instances across AZs can mount and read/write the same file system at the same time.',
            contohGuna: 'Web content serving across 20 EC2 instances, shared config files, content management systems',
            scenario: 'Multi-EC2 shared storage → EFS. Single-instance persistent block storage → EBS. Object storage (images, backups) → S3.',
            tips: [
              'Performance modes (set at creation): General Purpose = lowest latency, recommended for MOST workloads including web serving. Max I/O = HIGHER latency (not lower!), for massive parallel HPC workloads with 100s of connections.',
              'Throughput modes (can change): Bursting = scales with storage size (50 KiB/s per GiB baseline — 25 GB file system gets only ~1.25 MiB/s). Provisioned = set specific MiB/s regardless of file system size. Elastic (recommended) = auto-scales, pay per use.',
              'Trap: "small EFS + high throughput demand" → Provisioned Throughput. "large file system + occasional access" → Bursting is fine.',
              'Encryption in transit: NOT enabled by default. Enable at MOUNT TIME with EFS mount helper: sudo mount -t efs -o tls fs-xxxx /mnt/efs. Uses TLS 1.2 + AES-256. No console toggle.',
              'Encryption at rest: can enable at CREATION time only. Uses KMS. Encrypts data + metadata + directory names.',
              'Cross-VPC access: create NEW mount targets in VPC B (same file system, no data duplication). Alternatively via VPC peering but need to use mount target IP instead of DNS name.',
              'Connection timeout to EFS mount target = check: (1) SG inbound TCP 2049 from EC2 CIDR, (2) NACL allows TCP 2049. DNS failure → different error (not timeout).',
              'EFS backup: use AWS Backup natively. S3 File Gateway ≠ EFS backup.',
              'Storage classes: Standard (multi-AZ), Standard-IA (infrequent access), One Zone, One Zone-IA (cheapest — data in single AZ).',
            ],
            docs: [
              { label: 'EFS Performance', url: 'https://docs.aws.amazon.com/efs/latest/ug/performance.html' },
              { label: 'EFS Encryption in Transit', url: 'https://docs.aws.amazon.com/efs/latest/ug/encryption-in-transit.html' },
              { label: 'EFS Cross-VPC Mounting', url: 'https://docs.aws.amazon.com/efs/latest/ug/mount-fs-different-vpc.html' },
            ],
            keywords: ['shared storage', 'multiple EC2', 'NFS', 'General Purpose', 'Max I/O', 'Provisioned Throughput', 'Bursting Throughput', 'Elastic Throughput', 'TLS 1.2', 'mount helper', '-o tls', 'TCP 2049', 'cross-VPC EFS', 'EFS mount target'],
          },
          {
            shortName: 'S3',
            fullName: 'Simple Storage Service',
            ingat: '"Infinite bucket — object storage, 11 nines durability"',
            gunaUntuk: 'Object storage: images, video, backup, data lake, static website',
            fungsi: 'Object storage tanpa had — simpan apa-apa jenis fail sebagai OBJECT dalam BUCKET. Bukan block (EBS) bukan file system (EFS). Tiap object ada key (nama penuh), value (data), metadata, version ID. Bucket nama global unik. Max 1 object = 5TB. 11 nines durability (99.999999999%) sebab tiap object auto-replicate across ≥3 AZ.',
            contohGuna: 'Store images/video, backup & restore, data lake untuk Athena/Redshift, static website hosting, log storage, distribute software',
            detailsLabel: 'S3 Anatomy — Bucket → Object',
            storageDetails: 'Bucket → bekas top-level, nama GLOBAL unik (semua AWS), terikat pada 1 Region\nObject → fail sebenar; identified by Key (full path nama, cth photos/2026/cat.jpg)\nKey → "nama penuh" object dalam bucket (prefix + nama). Tiada folder sebenar — prefix je\nValue → kandungan data object (max 5TB)\nMetadata → key-value tags pasal object (content-type, dll)\nVersion ID → bila versioning ON, tiap update dapat ID baru',
            diagram: {
              label: 'S3 Request → Durability Flow',
              steps: [
                { nodes: [{ label: 'Client PUT', sub: 'upload object', tone: 'c1' }] },
                { nodes: [{ label: 'S3 Bucket', sub: 'Region X', tone: 'c2' }] },
                { nodes: [
                  { label: 'AZ-1', sub: 'copy', tone: 'c4' },
                  { label: 'AZ-2', sub: 'copy', tone: 'c4' },
                  { label: 'AZ-3', sub: 'copy', tone: 'c4' },
                ] },
                { nodes: [{ label: '11 Nines', sub: '99.999999999%', tone: 'c5' }] },
              ],
              caption: 'Satu PUT → S3 auto-replicate object across ≥3 AZ dalam Region → 11 nines durability. Ni sebab S3 boleh "kehilangan" 1 object dalam 10,000 tahun untuk 10 juta object.',
            },
            mermaid: {
              label: 'Pilih Encryption S3 (decision tree)',
              source: `flowchart TD
  A[Nak encrypt object S3?] --> B{Sapa urus key?}
  B -->|AWS urus semua, default ON| C[SSE-S3<br/>AES-256, free, auto]
  B -->|Aku nak audit + rotate + control| D[SSE-KMS<br/>CloudTrail log, key policy]
  B -->|Aku bagi key tiap request| E[SSE-C<br/>AWS tak simpan key]
  B -->|Encrypt dulu sebelum hantar| F[Client-Side<br/>AWS tak nampak plaintext]`,
              caption: 'Default sejak 2023: semua bucket auto SSE-S3. Nak audit siapa decrypt + rotate key → SSE-KMS (tapi kena ingat KMS ada request limit). Compliance pegang key sendiri → SSE-C atau client-side.',
            },
            compare: [
              {
                label: 'S3 Encryption — 4 pilihan',
                headers: ['Aspect', 'SSE-S3', 'SSE-KMS', 'SSE-C', 'Client-Side'],
                rows: [
                  ['Sapa urus key', 'AWS sepenuhnya', 'AWS KMS (kau control)', 'Kau bagi key tiap request', 'Kau, sebelum upload'],
                  ['Audit trail', '❌', '🟢 CloudTrail', '❌', '❌'],
                  ['Key rotation', 'Auto (AWS)', '🟢 Boleh atur', 'Manual', 'Manual'],
                  ['Kos / had', 'Free', 'KMS request cost + throttle', 'Free', 'Free'],
                  ['Best bila', 'Default, senang', 'Perlu audit + access control atas key', 'Wajib pegang key sendiri', 'AWS tak boleh nampak plaintext langsung'],
                ],
                takeaway: 'Default = SSE-S3 (auto ON sejak 2023). "Audit & control siapa guna key" → SSE-KMS. "App high-throughput tapi kena 503 sebab KMS throttle" → tukar ke SSE-S3 atau guna S3 Bucket Keys untuk kurangkan KMS calls.',
              },
              {
                label: 'Versioning · Replication · Lock — guna bila',
                headers: ['Feature', 'Apa dia', 'Exam trigger'],
                rows: [
                  ['Versioning', 'Simpan semua versi object; delete = delete marker, boleh restore', '"Protect from accidental delete/overwrite" → enable Versioning'],
                  ['MFA Delete', 'Perlu MFA untuk delete version / matikan versioning', '"Extra protection against deletion"'],
                  ['CRR (Cross-Region)', 'Auto-copy object ke bucket Region LAIN', '"DR / latency / compliance simpan di Region berbeza"'],
                  ['SRR (Same-Region)', 'Auto-copy dalam Region sama, bucket lain', '"Aggregate logs / replicate prod→test sama Region"'],
                  ['Object Lock (WORM)', 'Write-Once-Read-Many: object tak boleh delete/ubah sampai tarikh', '"Compliance, immutable, tak boleh padam" → Object Lock'],
                ],
                takeaway: 'Replication (CRR/SRR) WAJIB versioning ON di SUMBER dan DESTINASI. Replication hanya untuk object BARU selepas enable (guna S3 Batch Replication untuk yang lama).',
              },
            ],
            scenario: 'App tetiba dapat banyak HTTP 503 "Slow Down" masa upload laju → bukan kena scale apa-apa, S3 tengah auto-scale; agih objek across MULTIPLE PREFIX (3,500 PUT / 5,500 GET per prefix/saat, prefix tak terhad). Nak hantar fail besar laju merentas benua → S3 Transfer Acceleration (guna edge CloudFront). Fail >100MB → guna Multipart Upload (wajib >5GB).',
            tips: [
              'Durability = 11 nines (99.999999999%) SEMUA storage class (kecuali One Zone — masih 11 nines tapi 1 AZ je, risiko bila AZ musnah). Availability lain-lain: Standard 99.99%, Standard-IA 99.9%, One Zone-IA 99.5%.',
              'Consistency: STRONG read-after-write untuk semua operation (sejak Dec 2020) — PUT object baru terus boleh GET, tiada "eventual consistency" lagi. Soalan lama cakap eventual = jawapan dah usang.',
              'Performance: 3,500 PUT/COPY/POST/DELETE + 5,500 GET/HEAD per PREFIX per saat. Prefix tak terhad → parallelize across prefix untuk scale. 503 Slow Down = tengah scale, retry with backoff.',
              'Saiz: max 1 object = 5TB. Single PUT max 5GB. Multipart Upload: disyorkan >100MB, WAJIB >5GB. Multipart boleh resume + parallel part.',
              'Encryption default: sejak Jan 2023 semua object baru auto SSE-S3 (AES-256). Nak audit/control key → SSE-KMS (hati2 KMS throttle → guna S3 Bucket Keys).',
              'Security: Block Public Access (account + bucket level, default ON) > bucket policy/ACL. Bucket policy (resource-based JSON) untuk grant cross-account / public; ACL = legacy, AWS galak matikan. "Bucket tak sengaja public" → hidupkan Block Public Access.',
              'Static website hosting: S3 boleh host static site (HTML/JS/CSS) tapi HTTP sahaja — nak HTTPS + custom domain → letak CloudFront depan.',
              'Event notification: S3 boleh trigger SNS / SQS / Lambda / EventBridge bila object dibuat/dipadam (cth auto-process gambar bila upload).',
            ],
            docs: [
              { label: 'S3 performance best practices', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html' },
              { label: 'S3 encryption options', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html' },
              { label: 'S3 Replication', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html' },
            ],
            keywords: ['object storage', '11 nines durability', 'strong consistency', 'bucket policy', 'block public access', 'versioning', 'CRR', 'SRR', 'SSE-S3', 'SSE-KMS', 'SSE-C', 'multipart upload', '5TB', 'transfer acceleration', '503 slow down', 'prefix', 'static website', 'event notification'],
          },
          {
            shortName: 'S3 Glacier',
            fullName: 'Amazon S3 Glacier (storage classes)',
            ingat: '"S3 sejuk beku — murah, tapi tunggu lama nak retrieve"',
            gunaUntuk: 'Archive jangka panjang, jarang/tak pernah access (compliance, backup lama)',
            fungsi: 'Glacier = kelas storan S3 paling murah untuk ARKIB. Tiga jenis ikut berapa laju kau perlu data balik: Instant Retrieval (ms), Flexible Retrieval (minit–jam), Deep Archive (jam). Makin sejuk makin murah, tapi makin lama nak "cairkan" (restore). Nota: servis lama "Glacier Vault" yang berasingan dah legacy — exam & AWS sekarang guna S3 Glacier storage classes.',
            contohGuna: 'Rekod kewangan 7 tahun, arkib perubatan, log compliance, backup yang mungkin tak pernah dibuka',
            mermaid: {
              label: 'Pilih Glacier class (decision tree)',
              source: `flowchart TD
  A[Data arkib, jarang access] --> B{Perlu balik berapa laju?}
  B -->|Milliseconds, instant GET| C[Glacier Instant Retrieval<br/>min 90 hari]
  B -->|Boleh tunggu minit-jam| D[Glacier Flexible Retrieval<br/>min 90 hari]
  B -->|Boleh tunggu 12-48 jam, paling murah| E[Glacier Deep Archive<br/>min 180 hari]
  D --> F{Nak laju ke murah?}
  F -->|Urgent, 1-5 min| G[Expedited]
  F -->|Default, 3-5 jam| H[Standard]
  F -->|Murah, 5-12 jam| I[Bulk]`,
              caption: 'Deep Archive TIADA Expedited — paling laju pun Standard ~12 jam. Kalau soalan kata "retrieve dalam minit" + Deep Archive = jawapan SALAH.',
            },
            compare: [
              {
                label: 'Glacier 3 classes — retrieval & kos',
                headers: ['Aspect', 'Instant Retrieval', 'Flexible Retrieval', 'Deep Archive'],
                rows: [
                  ['Retrieval speed', '🟢 Milliseconds (terus GET)', 'Minit – jam (kena restore)', 'Jam (kena restore)'],
                  ['Min storage duration', '90 hari', '90 hari', '180 hari'],
                  ['Kos storage', 'Murah', 'Lagi murah', '🟢 Paling murah (~$0.00099/GB)'],
                  ['Access pattern', 'Jarang, tapi kena segera bila perlu', 'Arkib, sekali-sekala', 'Arkib jangka sangat panjang'],
                  ['Contoh', 'Medical imaging, news media lama', 'Backup, DR, log arkib', 'Compliance 7-10 thn, regulatory'],
                ],
                takeaway: 'Pilih ikut keperluan retrieval: "rarely access TAPI bila perlu kena ms" → Instant Retrieval (bukan Flexible/Deep). "Petabytes, 10-year retention, paling murah" → Deep Archive.',
              },
              {
                label: 'Retrieval tiers — masa & kos (verified AWS docs)',
                headers: ['Tier', 'Flexible Retrieval', 'Deep Archive', 'Kos'],
                rows: [
                  ['Expedited', '1–5 minit', '❌ Tiada', 'Paling mahal'],
                  ['Standard', '3–5 jam', '~12 jam', 'Sederhana'],
                  ['Bulk', '5–12 jam', '~48 jam', '🟢 Paling murah'],
                ],
                takeaway: 'Trap utama: Deep Archive TAK ADA Expedited. Glacier Instant Retrieval TAK PERLU restore langsung — terus GET macam Standard-IA.',
              },
            ],
            scenario: 'Hospital simpan imej X-ray jarang dibuka TAPI bila doktor minta kena dapat dalam milisaat → S3 Glacier Instant Retrieval (bukan Flexible — Flexible kena tunggu minit-jam). Firma guaman simpan rekod 10 tahun, petabytes, hampir tak pernah buka, nak paling murah → S3 Glacier Deep Archive. Auto-pindah guna S3 Lifecycle Policy (Standard → IA → Glacier ikut umur object).',
            tips: [
              'Glacier Instant Retrieval: retrieve MILLISECONDS, tak payah restore job — terus GET. Untuk data jarang access tapi perlu segera (medical, news archive). Min 90 hari.',
              'Glacier Flexible Retrieval (dulu nama "Glacier"): kena buat restore job dulu. Expedited 1-5min / Standard 3-5jam / Bulk 5-12jam. Min 90 hari.',
              'Glacier Deep Archive: PALING MURAH. Restore Standard ~12 jam, Bulk ~48 jam. TIADA Expedited. Min 180 hari. Untuk compliance 7-10 tahun.',
              'Min storage charge: kalau delete sebelum tempoh minimum (90/90/180 hari) tetap kena bayar baki tempoh — jangan letak data jangka pendek dalam Glacier.',
              'S3 Object Lock + Glacier = WORM compliance (immutable, tak boleh padam sampai tarikh) — untuk regulatory (SEC, FINRA).',
              'Lifecycle Policy: auto-transition object ikut umur (cth >30 hari → Standard-IA, >90 hari → Glacier Flexible, >365 hari → Deep Archive) + auto-expire/delete.',
              'Trap: "rarely accessed + millisecond retrieval" = Instant Retrieval. "retrieve dalam minit" + Deep Archive = SALAH (Deep paling laju ~12 jam).',
            ],
            docs: [
              { label: 'S3 Glacier storage classes', url: 'https://aws.amazon.com/s3/storage-classes/glacier/' },
              { label: 'Archive retrieval options', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects-retrieval-options.html' },
            ],
            keywords: ['archiving', 'cold storage', 'Glacier Instant Retrieval', 'Glacier Flexible Retrieval', 'Glacier Deep Archive', 'restore job', 'Expedited', 'Standard', 'Bulk', 'min storage duration', 'lifecycle policy', 'WORM', '11 nines'],
          },
        ],
      },
      {
        id: 'd3-network',
        icon: '🌐',
        title: 'Networking & Delivery',
        category: 'network',
        services: [
          {
            shortName: 'CloudFront',
            fullName: 'Amazon CloudFront',
            ingat: '"CDN, content laju sampai — cache kat edge"',
            gunaUntuk: 'Deliver content laju via edge locations + serve private content securely',
            fungsi: 'Menghantar content kepada pengguna melalui 600+ edge locations global dengan latency rendah. Cache content dekat dengan user, restrict access (signed URL/cookie, OAC, geo), dan offload origin.',
            contohGuna: 'Deliver images & videos untuk global users, static website laju, stream private paid media',
            scenario: 'Serve private paid video globally dengan low latency → CloudFront signed URLs/cookies (cache kat edge + restrict access). BUKAN S3 presigned URL — presigned = direct S3, takde edge caching, takde IP restriction. Untuk serve private S3 objects → OAC + bucket policy (bucket kekal private).',
            detailsLabel: 'Signed URL vs S3 Presigned URL',
            storageDetails: 'CloudFront Signed URL/Cookie → access private content MELALUI CloudFront (edge-cached, global low latency, boleh restrict by IP range + expiry, guna trusted key group). Untuk serve at scale via CDN.\nS3 Presigned URL → direct access ke SATU S3 object, signed dengan IAM credentials orang yang generate (inherit permission dia), takde CDN caching. Untuk one-off upload/download terus ke S3.',
            compare: {
              label: 'CloudFront Signed URL vs S3 Presigned URL',
              headers: ['Aspect', 'CloudFront Signed URL/Cookie', 'S3 Presigned URL'],
              rows: [
                ['Akses melalui', 'CloudFront (edge cache, global)', 'Direct ke S3 (tiada CDN)'],
                ['Sign guna', 'Trusted key group (public/private key)', 'IAM creds orang yang generate'],
                ['Permission', 'Independent dari IAM caller', 'Inherit permission si-pemberi'],
                ['Skop', 'URL = 1 file; Cookie = banyak file', '1 object sahaja'],
                ['Extra control', '🟢 Restrict by IP, expiry, geo, caching', 'Expiry sahaja'],
                ['Best untuk', 'Serve private media AT SCALE via CDN', 'One-off upload/download terus ke S3'],
              ],
              takeaway: 'Private content ramai user + low latency (paid video, downloads) → CloudFront signed URL/cookie. Bagi satu orang upload/download terus satu file → S3 presigned URL. Nak bucket kekal private tapi serve via CF → OAC + bucket policy (bukan signed URL).',
            },
            mermaid: {
              label: 'Analogi Netflix — Signed URL vs Signed Cookie',
              source: `flowchart TD
  Q["Serve private content<br/>via CloudFront"] --> N{Berapa banyak fail?}
  N -->|"Satu fail je<br/>(cth: 1 installer / 1 PDF)"| URL["Signed URL"]
  N -->|"🎬 Banyak fail sekali gus<br/>(cth: pelanggan Netflix tengok<br/>10 episod HLS dlm 1 folder)"| COOKIE["Signed Cookie"]
  URL --> U1["Restrict access<br/>ke SATU file"]
  COOKIE --> C1["Satu cookie buka SEMUA fail<br/>tanpa jana URL baru tiap fail"]`,
              caption: 'Analogi Netflix: pelanggan langgan Netflix nak tengok 10 episod dalam satu folder S3 — guna Signed Cookie: satu cookie bagi akses SEMUA fail tanpa perlu jana URL baru tiap episod. Kalau setakat satu fail (cth muat turun satu installer), Signed URL dah cukup. Dua-dua untuk private content VIA CloudFront; OAC pula untuk kunci bucket S3 supaya kekal private.',
            },
            tips: [
              'OAC (Origin Access Control) = GANTI OAI. Wajib guna OAC untuk S3 origins yang guna SSE-KMS. OAI tidak support KMS. Update bucket policy grant s3:GetObject kepada CloudFront service principal.',
              '"Serve private S3 objects via CloudFront securely" → OAC + bucket policy. Keep bucket block public access = ON.',
              'Signed URL vs signed cookie (dua-dua CloudFront private content): Signed URL = restrict access ke SATU file individual, atau client yang tak support cookies. Signed cookie = restrict access ke BANYAK files (e.g. semua HLS video segments) tanpa tukar URL.',
              'CloudFront signed URL vs S3 presigned URL: signed URL serve content via CDN (edge cache, IP restriction, trusted key group); S3 presigned = direct S3 object access guna creator IAM creds. Private content at scale → CloudFront. One-off direct S3 → presigned.',
              'Caching / TTL: Minimum / Default / Maximum TTL kawal berapa lama object cached at edge. Origin Cache-Control / Expires headers set freshness; TTL boleh override. Invalidation = force-remove cached object sebelum expiry (berbayar lepas free tier).',
              'Geo restriction (geo blocking): allowlist / denylist at COUNTRY level — block/allow user ikut negara. Native CloudFront feature (akurasi ~99.8%). Untuk granularity lebih halus (state/city) → guna third-party geolocation service.',
              'Price Classes (cost lever): PriceClass_All (semua edge locations, perf terbaik, mahal), PriceClass_200 (exclude region paling mahal), PriceClass_100 (US/Canada/Europe sahaja, paling murah).',
              'Lambda@Edge = run Lambda functions AT CloudFront edge nodes. 4 hooks: Viewer Request, Viewer Response, Origin Request, Origin Response. "Custom auth headers / transform request before origin" → Lambda@Edge',
              'Lambda@Edge vs CloudFront Functions: CF Functions = ultra-fast, lightweight JS at viewer level. Lambda@Edge = full Node.js/Python, longer timeout, can call AWS services, runs at origin/viewer events.',
            ],
            docs: [
              { label: 'Serve private content (signed URLs/cookies)', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html' },
              { label: 'Geographic restrictions', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/georestrictions.html' },
            ],
            keywords: ['CDN', 'edge location', 'low latency', 'static content', 'OAC', 'Origin Access Control', 'Lambda@Edge', 'CloudFront Functions', 'SSE-KMS', 'private S3', 'signed URL', 'signed cookie', 'S3 presigned URL', 'TTL', 'caching', 'invalidation', 'geo restriction', 'geo blocking', 'price class'],
          },
          {
            shortName: 'ALB',
            fullName: 'Application Load Balancer',
            ingat: '"Traffic director — by path/host, Layer 7"',
            gunaUntuk: 'HTTP/HTTPS path-based routing, microservices, containers',
            fungsi: 'Mengagihkan traffic HTTP/HTTPS berdasarkan path atau host rules (Layer 7). Boleh route ke instances dalam peered VPCs menggunakan IP address sebagai target — bukan hanya dalam satu VPC.',
            contohGuna: 'myshop.com/products → service A, myshop.com/cart → service B. Cross-VPC: route ke EC2 instances dalam peered VPCs guna IP targets.',
            scenario: 'Cross-VPC load balancing: company ada 3 VPCs peered. Guna satu ALB dengan IP address targets untuk route ke instances dalam semua 3 VPCs. Classic Load Balancer (CLB) tak boleh buat ni — CLB hanya support instance ID targets dalam same VPC.',
            compare: {
              label: 'ELB types — pilih load balancer ikut layer & keperluan',
              headers: ['Aspect', 'ALB', 'NLB', 'GWLB'],
              rows: [
                ['OSI Layer', '7 — HTTP/HTTPS', '4 — TCP/UDP/TLS', '3 — IP packets'],
                ['Routing', 'Path / host / header / query', 'Connection (ultra-low latency)', 'Forward ke virtual appliance'],
                ['Static IP', '❌ DNS name je', '🟢 Elastic IP per AZ', 'Via GWLB endpoint'],
                ['Preserve client IP', '❌ guna X-Forwarded-For', '🟢 Ya', '🟢 Ya (transparent)'],
                ['Best untuk', 'Web, microservices, containers', 'Gaming/IoT/VoIP, extreme perf, static IP', 'Firewall / IDS / IPS (GENEVE 6081)'],
              ],
              takeaway: 'HTTP + routing pintar (path/host) → ALB. TCP/UDP, latency rendah, perlu static IP → NLB. Nak salurkan traffic melalui virtual appliance (firewall/IDS/IPS) → GWLB. CLB = legacy (L4/L7, instance-ID + same-VPC sahaja) — elak untuk design baru.',
            },
            tips: [
              'ALB = Layer 7 (HTTP/HTTPS). NLB = Layer 4 (TCP/UDP). CLB = legacy, avoid',
              'IP targets membolehkan ALB/NLB route ke peered VPCs, on-premises (via Direct Connect/VPN)',
              'CLB limitation: instance ID only, same VPC only — exam trap!',
              'SNI (Server Name Indication): ALB HTTPS listener boleh hold MULTIPLE TLS certificates serentak. Client sends hostname in TLS ClientHello → ALB picks the right cert. No extra ALB needed per domain!',
              '"two domains, same ALB, each with its own ACM cert, no combined cert" → Add both certs to ALB listener using SNI',
            ],
            docs: [
              { label: 'ALB IP Targets', url: 'https://aws.amazon.com/blogs/aws/new-application-load-balancing-via-ip-address-to-aws-on-premises-resources/' },
              { label: 'ALB User Guide', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html' },
            ],
            keywords: ['path-based routing', 'HTTP', 'layer 7', 'IP targets', 'cross-VPC', 'microservices'],
          },
          {
            shortName: 'NLB',
            fullName: 'Network Load Balancer',
            ingat: '"Traffic director — ultra laju, Layer 4, static IP"',
            gunaUntuk: 'TCP/UDP, low latency, static IP, cross-VPC with IP targets',
            fungsi: 'Mengagihkan traffic TCP/UDP pada Layer 4 dengan latency sangat rendah. Seperti ALB, NLB juga boleh route ke instances dalam peered VPCs menggunakan IP address targets.',
            contohGuna: 'Gaming servers, IoT, VoIP. Cross-VPC: NLB dengan IP targets route ke instances dalam peered VPCs.',
            scenario: 'NLB diperlukan bila: (1) perlukan static IP atau Elastic IP untuk load balancer, (2) TCP/UDP traffic bukan HTTP, (3) extreme performance/low latency. Untuk cross-VPC dengan IP targets, both NLB dan ALB boleh digunakan.',
            tips: [
              'NLB = static IP/Elastic IP support. ALB = tiada static IP (guna static IP alias CloudFront/Global Accelerator)',
              'NLB dan ALB BOLEH route cross-VPC via IP targets. CLB TIDAK boleh',
              'NLB preserve client IP address. ALB tidak (guna X-Forwarded-For header)',
            ],
            docs: [
              { label: 'NLB User Guide', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html' },
            ],
            keywords: ['TCP', 'UDP', 'layer 4', 'static IP', 'IP targets', 'cross-VPC', 'low latency'],
          },
          {
            shortName: 'Route 53',
            fullName: 'Amazon Route 53',
            ingat: '"GPS untuk domain"',
            gunaUntuk: 'DNS management, domain routing',
            fungsi: 'Mengurus DNS dan mengarahkan traffic kepada endpoint yang betul',
            contohGuna: 'Point domain ke server, failover ke backup region',
            tips: [
              'Alias record: AWS-specific DNS extension. Boleh guna untuk APEX/root domain (e.g. example.com). Points ke ALB, CloudFront, S3 website, other Route 53 records',
              'CNAME record: standard DNS. TIDAK BOLEH guna untuk apex/root domain (DNS spec prohibition)',
              'Pattern: apex domain (example.com) → ALWAYS use Alias. Subdomain (www.example.com) → CNAME or Alias both work',
              'Exam: "root domain + www subdomain pointing to ALB" → Alias for root + CNAME (or Alias) for www',
            ],
            keywords: ['DNS', 'domain', 'routing policy', 'failover', 'Alias record', 'CNAME', 'apex domain', 'root domain', 'cannot CNAME apex'],
          },
          {
            shortName: 'Route 53 Routing Policies',
            fullName: 'Amazon Route 53 — Routing Policies',
            ingat: '"Cara Route 53 decide siapa dapat traffic"',
            gunaUntuk: 'Control how DNS traffic is routed to resources',
            fungsi: 'Pelbagai routing policies untuk optimize availability, performance, failover, dan geolocation berdasarkan health checks dan rules',
            detailsLabel: 'Routing Policies',
            storageDetails: 'Simple → 1 resource, no health check, no failover\nWeighted → split traffic by % (A=70%, B=30%)\nLatency-based → route to lowest latency AWS region\nFailover → primary (active) + secondary (passive) via health check\nGeolocation → route by user\'s country/continent\nGeoproximity → route by geographic distance + bias\nMulti-Value → up to 8 healthy records, random selection',
            compare: {
              label: 'Scenario → Policy mana? (exam pakai keyword ni)',
              headers: ['Keyword dalam soalan', 'Policy', 'Kenapa'],
              rows: [
                ['"Satu resource, no rules"', 'Simple', 'Default, tiada health check'],
                ['"A/B test", "split %", "blue-green by %", "gradual shift"', 'Weighted', 'Bahagi traffic ikut peratus'],
                ['"Lowest latency", "fastest response", "nearest Region"', 'Latency-based', 'Route ke Region paling rendah latency (bukan paling dekat geo)'],
                ['"Active-passive", "DR", "failover ke backup"', 'Failover', 'Primary + secondary, ikut health check'],
                ['"Comply by country", "block/serve by location", "bahasa ikut negara"', 'Geolocation', 'Ikut lokasi USER (negara/benua)'],
                ['"Shift traffic toward a Region", "bias"', 'Geoproximity', 'Ikut jarak + bias (besar/kecilkan Region)'],
                ['"Client-side HA", "return multiple healthy IPs"', 'Multivalue Answer', 'Sampai 8 record sihat, random — bukan LB betul'],
              ],
              takeaway: 'Latency-based ≠ Geolocation! Latency = laju (performance). Geolocation = lokasi user (compliance/bahasa). "Fastest" → Latency. "By country/comply" → Geolocation. Active-passive DR → Failover.',
            },
            scenario: 'ALB (primary) unhealthy → Route 53 Failover policy auto-redirect ke S3 static error page (secondary). Health check detect ALB down, traffic pindah ke secondary automatik. BUKAN CloudFront — CF cache content tapi tak handle active-passive failover.',
            tips: [
              'Hybrid failover (AWS primary + on-premises secondary): PERLU DUA alias records berasingan',
              'Record 1 (Primary): Alias ke ALB/CloudFront, Evaluate Target Health = Yes — Route 53 check health automatically',
              'Record 2 (Secondary): Alias ke on-premises IP/endpoint, associate Route 53 health check explicitly',
              'Evaluate Target Health (ETH): untuk AWS resources yang support alias (ALB, ELB, CloudFront) — Route 53 check health target automatically TANPA perlu attach health check',
              'On-premises / non-alias resources: MESTI attach health check explicitly — ETH tak apply',
              'Exam: "AWS primary + on-premises secondary failover" → 2 failover alias records, AWS dengan ETH=Yes, on-premises dengan explicit health check',
            ],
            keywords: ['failover', 'active-passive', 'health check', 'weighted', 'latency-based', 'geolocation', 'simple', 'Evaluate Target Health', 'hybrid failover', 'two alias records', 'on-premises secondary'],
          },
        ],
      },
      {
        id: 'd3-messaging',
        icon: '📨',
        title: 'Messaging & Serverless',
        category: 'messaging',
        services: [
          {
            shortName: 'SQS',
            fullName: 'Simple Queue Service',
            ingat: '"Baris gilir message"',
            gunaUntuk: 'Decouple services, async queue',
            fungsi: 'Mengurus queue untuk menghantar mesej antara komponen aplikasi secara asynchronous. Standard queue: at-least-once delivery, best-effort ordering. FIFO queue: exactly-once, strict order.',
            contohGuna: 'Order processing queue — EC2/Lambda poll SQS, proses order, delete message bila siap.',
            storageDetails: 'Visibility Timeout → Message invisible semasa diproses (max 12 jam). Jika consumer mati sebelum siap → message visible semula selepas timeout\nDelay Seconds → Delay sebelum message pertama kali visible dalam queue (max 15 minit)\nDead Letter Queue (DLQ) → Message yang gagal diproses N kali dihantar ke DLQ untuk debug\nMessage Retention → Default 4 hari, max 14 hari',
            detailsLabel: 'SQS Key Concepts',
            scenario: 'Spot instance terminated masa process SQS message → message TIDAK hilang. Ia akan visible semula selepas Visibility Timeout expired. Message hanya deleted bila consumer call DeleteMessage API selepas berjaya process.',
            compare: {
              label: 'Standard vs FIFO queue',
              headers: ['Aspect', 'Standard', 'FIFO'],
              rows: [
                ['Ordering', 'Best-effort (can arrive out of order)', '🟢 Strict order (per MessageGroupId)'],
                ['Delivery', 'At-least-once (can duplicate)', 'Exactly-once (deduplication)'],
                ['Throughput', 'Nearly unlimited', '300 msg/s (3000 with batching)'],
                ['Name suffix', 'any', 'must end in .fifo'],
                ['Use when', 'Max throughput, dupes OK', 'Order + no duplicates matter'],
              ],
              takeaway: '"Duplicate processing must be eliminated" or "order must be preserved" → FIFO. Default high-throughput decoupling → Standard.',
            },
            tips: [
              'Cross-account SQS access: guna SQS RESOURCE-BASED policy (queue policy) pada queue — bukan IAM policy dalam source account',
              'IAM policy dalam target account SAHAJA tidak cukup untuk cross-account SQS access. Queue policy mesti explicitly allow source account principal',
              'Exam: "allow another AWS account to send messages to SQS queue" → SQS queue policy (resource-based)',
              'Long Polling (ReceiveMessageWaitTimeSeconds > 0, max 20s): consumer WAITS for message before returning. Reduces empty responses + API call costs. Short polling = returns immediately even if empty.',
              'Visibility Timeout: message hidden from OTHER consumers after retrieved. If processing takes longer than timeout → message becomes visible again → DUPLICATE processing. Fix: increase timeout to exceed max processing time, or use ChangeMessageVisibility mid-processing.',
              'Duplicate messages: Standard queue = at-least-once delivery (can duplicate). FIFO queue = exactly-once delivery with deduplication. Switch to FIFO to eliminate duplicates with minimal code change.',
              'Batch operations: ReceiveMessage gets up to 10 messages per call; DeleteMessageBatch deletes up to 10 per call. Use batching to reduce API call count and costs.',
              'SNS→SQS→Lambda pattern: add SQS queue between SNS and Lambda for reliable async processing. If Lambda fails transiently, message waits in SQS and is retried — no message loss, no manual intervention.',
              'SQS FIFO + Lambda: message ordering within MessageGroupId guaranteed. Requires event source mapping (ESM) to connect Lambda to FIFO queue.',
            ],
            keywords: ['queue', 'decouple', 'async', 'pull-based', 'visibility timeout', 'FIFO', 'DLQ', 'at-least-once', 'exactly-once', 'long polling', 'short polling', 'batch operations', 'duplicate messages', 'queue policy', 'cross-account SQS', 'resource-based policy', 'SNS SQS Lambda fan-out'],
          },
          {
            shortName: 'SNS',
            fullName: 'Simple Notification Service',
            ingat: '"Broadcast message ke ramai sekaligus — push, bukan pull"',
            gunaUntuk: 'Push notification ke many subscribers (fan-out)',
            fungsi: 'Pub/sub messaging service — publisher hantar message ke SNS topic, semua subscribers terima serentak. Subscribers boleh jadi SQS, Lambda, HTTP/S endpoints, email, SMS. Push-based (SNS hantar ke subscriber), bukan pull-based macam SQS.',
            contohGuna: 'S3 upload → SNS topic → fan-out ke 3 SQS queues (thumbnail, metadata, archive) sekaligus.',
            diagram: {
              label: 'Fan-out anatomy',
              steps: [
                { nodes: [{ label: 'S3 Upload', sub: 'event source', tone: 'c2' }] },
                { nodes: [{ label: 'SNS Topic', sub: '1 publish', tone: 'c3' }] },
                { nodes: [
                  { label: 'SQS', sub: 'thumbnail', tone: 'c4' },
                  { label: 'SQS', sub: 'metadata', tone: 'c4' },
                  { label: 'SQS', sub: 'archive', tone: 'c4' },
                ] },
              ],
              caption: '1 publish → SNS pecah ke semua subscribers serentak. Tiap SQS queue process independent & scale sendiri. Ingat: queue policy mesti allow SNS SendMessage.',
            },
            storageDetails: 'Message Filtering → Subscriber boleh set filter policy (JSON) supaya hanya terima message yang match criteria — tak perlu filter dalam app code\nMessage Delivery → Push-based, SNS hantar ke subscriber endpoint. Retry policy built-in untuk HTTP/S\nFIFO Topics → Ordered, deduplicated delivery (pair dengan SQS FIFO queues). Max 300 publishes/sec (3000 with batching)\nMessage Size → Max 256 KB per message. Guna Extended Client Library + S3 untuk larger payloads',
            detailsLabel: 'SNS Key Concepts',
            scenario: '"S3 event perlu trigger multiple downstream processes simultaneously" → SNS fan-out. S3 event notification → SNS topic → multiple SQS queues. S3 hanya boleh hantar 1 event notification per prefix+suffix combination ke 1 destination — SNS fan-out bypasses this limitation.',
            tips: [
              'Fan-out pattern: SNS → multiple SQS queues. Decouples publisher from consumers. Each SQS queue processes independently dan boleh scale sendiri',
              'SNS + SQS fan-out: SQS queue perlu RESOURCE-BASED policy (queue policy) yang allow SNS topic to SendMessage. Tanpa queue policy → delivery fails silently',
              'SNS FIFO topic → SQS FIFO queue: strict ordering + exactly-once. SNS Standard topic → SQS Standard queue: at-least-once, best-effort order',
              'Message Filtering: subscriber filter policy avoids unnecessary message processing. Tanpa filter → subscriber terima SEMUA messages dan kena filter sendiri (wasteful)',
              'SNS vs SQS: SNS = push to many (pub/sub, fan-out). SQS = pull by one consumer group (queue, decouple). Combine both: SNS fan-out → SQS queues for reliable async processing',
              'SNS vs EventBridge: SNS = simple fan-out, high throughput. EventBridge = content-based routing with rules, schema registry, SaaS integration, archive & replay. EventBridge lebih flexible tapi SNS lebih simple untuk basic fan-out',
              'Cross-account SNS: guna SNS topic policy (resource-based) untuk allow other accounts subscribe atau publish. Same pattern as SQS cross-account',
              'Exam: "one event must trigger multiple independent processes" → SNS fan-out. "Route different events to different targets based on content" → EventBridge',
            ],
            keywords: ['pub/sub', 'push notification', 'fan-out', 'broadcast', 'topic', 'subscription', 'filter policy', 'message filtering', 'SNS FIFO', 'cross-account SNS', 'S3 event notification', 'push-based'],
          },
          {
            shortName: 'Kinesis',
            fullName: 'Amazon Kinesis (Data Streams vs Firehose)',
            ingat: '"Streaming pipe — Streams = real-time + code, Firehose = auto-deliver no code"',
            gunaUntuk: 'Ingest & process real-time streaming data (logs, clickstream, IoT, metrics)',
            fungsi: 'Kinesis Data Streams (KDS): real-time, data dalam shards, custom consumers baca dengrn code (Lambda/KCL). Retention default 24 jam, boleh extend sampai 365 hari. Kinesis Data Firehose: near-real-time (buffer ~60s/MB), fully managed, ZERO code — auto-deliver ke S3, Redshift, OpenSearch, Splunk, boleh transform guna Lambda.',
            contohGuna: 'Live clickstream/IoT telemetry yang perlu custom real-time processing → Data Streams. "Just load streaming logs into S3/Redshift tanpa manage apa-apa" → Firehose.',
            diagram: {
              label: 'Streaming pipeline anatomy',
              steps: [
                { nodes: [
                  { label: 'Producers', sub: 'IoT · app · logs', tone: 'c1' },
                ] },
                { nodes: [
                  { label: 'Shard 1', tone: 'c3' },
                  { label: 'Shard 2', tone: 'c3' },
                  { label: 'Shard 3', tone: 'c3' },
                ] },
                { nodes: [
                  { label: 'Consumers', sub: 'Lambda / KCL', tone: 'c4' },
                ] },
              ],
              caption: 'Data masuk shards by partition key. Throughput = bilangan shards (1 shard = 1MB/s in, 2MB/s out). Retention 24h→365d → consumers boleh replay. Firehose ganti consumers ni dengan auto-deliver no-code.',
            },
            mermaid: {
              label: 'Pilih ahli keluarga Kinesis (decision tree)',
              source: `flowchart TD
  A[Data streaming masuk] --> B{Nak buat apa?}
  B -->|Custom real-time, replay, ramai consumer| C[Data Streams<br/>shards + code]
  B -->|Hantar terus ke S3/Redshift/OpenSearch, no code| D[Data Firehose<br/>fully managed]
  B -->|Transform/analisa stream guna SQL/Flink masa real-time| E[Managed Service for Apache Flink<br/>dulu: Kinesis Data Analytics]
  B -->|Stream video untuk ML/playback| F[Video Streams]`,
              caption: 'Nota: "Kinesis Data Analytics" dah ditukar nama jadi Amazon Managed Service for Apache Flink — soalan lama mungkin masih guna nama lama. 4 ahli: Data Streams (real-time + code), Firehose (auto-deliver no code), Managed Flink (proses/analisa stream), Video Streams (video).',
            },
            scenario: '"Real-time, sub-second, multiple consumers, replay data" → Data Streams (shards + retention up to 365 days). "Load streaming data ke S3/Redshift/OpenSearch with no servers and no code" → Firehose. "Analisa/transform streaming data guna SQL atau Apache Flink real-time" → Managed Service for Apache Flink (bekas Kinesis Data Analytics).',
            compare: {
              label: 'Data Streams vs Firehose',
              headers: ['Aspect', 'Kinesis Data Streams', 'Kinesis Data Firehose'],
              rows: [
                ['Latency', 'Real-time (~200ms)', 'Near-real-time (min ~60s buffer)'],
                ['Management', 'You manage shards + consumers', '🟢 Fully managed, serverless'],
                ['Consumers', 'Custom code (Lambda, KCL apps)', 'Fixed targets: S3, Redshift, OpenSearch, Splunk'],
                ['Storage / replay', 'Retention 24h → 365 days, replayable', 'No storage — delivers then gone'],
                ['Scaling', 'Provision/adjust shards', 'Auto-scales'],
              ],
              takeaway: '"Custom real-time processing / replay / multiple apps read same stream" → Data Streams. "Just deliver streaming data to a store, no code" → Firehose.',
            },
            docs: [
              { label: 'Change data retention period', url: 'https://docs.aws.amazon.com/streams/latest/dev/kinesis-extended-retention.html' },
            ],
            keywords: ['real-time', 'streaming', 'data pipeline', 'analytics', 'Data Streams', 'Firehose', 'shards', 'retention', 'clickstream', 'IoT', 'replay', 'serverless delivery'],
          },
          {
            shortName: 'API Gateway',
            fullName: 'Amazon API Gateway',
            ingat: '"Pintu masuk untuk API — REST / HTTP / WebSocket"',
            gunaUntuk: 'Manage & expose REST, HTTP, dan WebSocket APIs',
            fungsi: 'Mencipta, mengurus dan mendedahkan API pada mana-mana skala. Handle auth, throttling, caching, request validation, dan integrate ke Lambda / HTTP backend / VPC resources.',
            contohGuna: 'Frontend → API Gateway → Lambda → DynamoDB',
            diagram: {
              label: 'Serverless API anatomy',
              steps: [
                { nodes: [{ label: 'Client', sub: 'web / mobile', tone: 'c4' }] },
                { nodes: [{ label: 'API Gateway', sub: 'auth · throttle · cache', tone: 'c3' }] },
                { nodes: [{ label: 'Lambda', sub: 'business logic', tone: 'c1' }] },
                { nodes: [{ label: 'DynamoDB', sub: 'data', tone: 'c2' }] },
              ],
              caption: 'API Gateway = pintu masuk: handle auth (Cognito/IAM/Lambda authorizer), throttling (429 bila exceed), caching, request validation — backend (Lambda) fokus logic je.',
            },
            scenario: 'Real-time multiplayer game / chat → WebSocket API (server boleh push ke client, two-way). Simple low-cost serverless proxy ke Lambda tanpa API keys/WAF → HTTP API (~70% lebih murah, lower latency). Enterprise API perlu API keys, usage plans, request validation, WAF, atau private endpoint → REST API.',
            detailsLabel: 'REST vs HTTP vs WebSocket',
            storageDetails: 'REST API → full features: API keys + usage plans (per-client throttling), request validation, AWS WAF, resource policies, private endpoint, endpoint types edge-optimized/regional/private\nHTTP API → minimal features, ~70% lebih murah, lower latency, JWT (OIDC/OAuth2) authorizer, regional sahaja — pilih bila tak perlu REST extras\nWebSocket API → bidirectional real-time (chat, games, trading, live dashboard) — server push ke client',
            tips: [
              'REST vs HTTP API: REST = API keys, per-client throttling (usage plans), request validation, AWS WAF, resource policies, private endpoints, edge-optimized/regional/private. HTTP API = minimal, ~70% murah, lower latency, regional sahaja, JWT authorizer — pilih bila simple proxy.',
              'WebSocket API: untuk bidirectional / real-time — server boleh push message ke client (chat, multiplayer game, trading platform, live dashboard). REST/HTTP = request-response sahaja.',
              'Authorizers: IAM (SigV4), Amazon Cognito user pools, Lambda authorizer (TOKEN atau REQUEST — custom auth via bearer token/OAuth/SAML, return IAM policy). HTTP API tambah JWT authorizer (OIDC/OAuth2). Dua-dua support IAM + Lambda authorizer.',
              'Throttling: account-level + per-method + per-client (usage plans + API keys, REST sahaja). Exceed → 429 Too Many Requests. Protect backend dari traffic spikes.',
              'Endpoint types (REST): Edge-optimized (default, via CloudFront edge — global clients), Regional (client dalam region sama / lower in-region latency), Private (access dari dalam VPC sahaja via interface endpoint).',
              'Mapping Templates: transform request/response format antara client dan backend — untuk backward compatibility',
              'Guna mapping templates bila legacy clients expect format lama tapi backend dah upgrade. Transform response tanpa modify backend code',
              'Mapping templates guna Velocity Template Language (VTL). Boleh reshape JSON, rename fields, tambah/buang fields',
              'Method Response Models: define schema untuk response (documentation/validation) — BUKAN untuk transform format',
              'Gateway Response: customize error responses (4xx, 5xx) dari API Gateway itself — bukan dari backend',
              'Exam: "backend upgrade broke legacy clients due to response format change, fix without modifying backend" → Mapping Templates',
              'API Gateway Caching: cache method responses at the stage level. Cache key boleh INCLUDE query string parameters — different param values → different cache entries (e.g. ?type=equity vs ?type=fixed-income cached separately)',
              '"Two product categories, same API, cache must not share entries" → include query param in cache key',
              'Integration types: HTTP (public internet), Lambda (same or cross-account), VPC Link (private VPC resources via NLB/ALB)',
              'CORS: enable on API Gateway untuk allow browser cross-origin requests. REST APIs: OPTIONS preflight handler auto-created.',
            ],
            docs: [
              { label: 'Choose between REST APIs and HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html' },
              { label: 'WebSocket APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html' },
            ],
            keywords: ['REST API', 'HTTP API', 'WebSocket', 'real-time', 'bidirectional', 'API management', 'throttling', 'usage plans', 'API keys', 'request validation', 'AWS WAF', 'JWT authorizer', 'Cognito', 'Lambda authorizer', 'IAM authorizer', 'edge-optimized', 'regional endpoint', 'private endpoint', 'mapping templates', 'backward compatibility', 'VTL', 'response transformation', 'cache key', 'CORS', 'VPC Link', 'cross-account Lambda'],
          },
          {
            shortName: 'EventBridge',
            fullName: 'Amazon EventBridge',
            ingat: '"Trafik light untuk events — route events ke tempat betul"',
            gunaUntuk: 'Serverless event bus: decouple services, schedule tasks, react to AWS service changes',
            fungsi: 'EventBridge route events dari sources (EC2 state change, S3 upload, custom apps, SaaS) ke targets (Lambda, SQS, SNS, Step Functions) berdasarkan rules. Gantikan CloudWatch Events. Boleh schedule events (cron/rate).',
            contohGuna: 'EC2 instance terminate → EventBridge rule detect → trigger Lambda untuk cleanup. Atau schedule Lambda setiap hari pukul 9pm.',
            scenario: '"EC2 instance stop → trigger Lambda automatically" → EventBridge rule. "Schedule Lambda every day at midnight" → EventBridge Scheduler. Bukan SNS (yang untuk broadcast notifications, bukan event routing).',
            compare: {
              label: 'SQS vs SNS vs EventBridge — 3 yang selalu keliru',
              headers: ['Aspect', 'SQS', 'SNS', 'EventBridge'],
              rows: [
                ['Model', 'Queue (pull)', 'Pub/Sub (push)', 'Event bus (push, rule-based)'],
                ['Consumer', '1 queue, ramai poller kongsi', 'Ramai subscriber dapat SAMA salinan', 'Target ikut event pattern'],
                ['Routing pintar', '❌ Tiada', '❌ Tiada (broadcast semua)', '🟢 Content-based (filter by field)'],
                ['Buffer / retry', '🟢 Simpan msg (4–14 hari), DLQ', 'Tiada storage (retry + DLQ)', 'Retry + archive/replay'],
                ['Sumber', 'App kau', 'App kau', '🟢 90+ AWS service + SaaS + custom'],
                ['Guna bila', 'Decouple + buffer kerja, proses ikut kadar sendiri', 'Fan-out satu mesej ke ramai (SNS→banyak SQS)', 'React ke event AWS, route by content, jadual cron'],
              ],
              takeaway: 'Buffer + proses ikut kadar sendiri → SQS. Hantar SATU mesej ke RAMAI serentak → SNS. Route ikut ISI event / event AWS / SaaS / jadual → EventBridge. Fan-out klasik = SNS → banyak SQS. EventBridge latency lebih tinggi (~0.5s) tapi paling pintar.',
            },
            tips: [
              'Schema Registry: EventBridge auto-discovers event schemas dari event bus. Boleh generate code bindings (Java, Python, TypeScript) dari schema — speeds up development',
              'Archive & Replay: archive events dari event bus, replay later untuk debugging atau reprocessing. Useful bila downstream service was down',
              'EventBridge Pipes: point-to-point integration — connect source (SQS, Kinesis, DynamoDB Streams) directly to target dengan optional filtering, enrichment, and transformation. Simpler than writing Lambda glue code',
              'EventBridge vs SNS: EventBridge = content-based routing (route by event pattern/field values), schema discovery, SaaS integration, archive/replay. SNS = simple fan-out to many subscribers, higher throughput',
              'EventBridge Scheduler: one-time or recurring schedules (cron/rate). Replaces CloudWatch Events scheduled rules. Supports >14,000 targets, timezone-aware, flexible time windows',
              'Custom event bus: isolate events per application/team. Default event bus receives AWS service events. Custom bus for your app events + SaaS partner events',
              'Exam: "route events based on content to different targets" → EventBridge. "Simple broadcast to all subscribers" → SNS',
            ],
            keywords: ['event bus', 'event-driven', 'cron schedule', 'rule-based routing', 'decouple', 'SaaS integration', 'CloudWatch Events', 'schema registry', 'archive replay', 'EventBridge Pipes', 'EventBridge Scheduler'],
          },
          {
            shortName: 'Step Functions',
            fullName: 'AWS Step Functions',
            ingat: '"Flowchart yang run sendiri — orchestrate multi-step workflows"',
            gunaUntuk: 'Coordinate multi-step processes with error handling, retry, and branching',
            fungsi: 'Visual workflow orchestration. Setiap step boleh timeout, retry, atau branch ikut result. Integrate dengan Lambda, ECS, Glue, DynamoDB, dan 200+ services. State machine dengan JSON definition.',
            diagram: {
              label: 'Order workflow (state machine)',
              steps: [
                { nodes: [{ label: 'Validate', sub: 'order', tone: 'c3' }] },
                { nodes: [{ label: 'Charge Card', sub: 'retry on fail', tone: 'c1' }] },
                { nodes: [{ label: 'Notify', sub: 'warehouse', tone: 'c4' }] },
                { nodes: [{ label: 'Send Email', sub: 'confirm', tone: 'c2' }] },
              ],
              caption: 'Tiap step ada built-in retry + timeout + branch (Choice state). Kalau step gagal → catch & route ke fallback, bukan crash whole flow. Visual console tunjuk state setiap step.',
            },
            scenario: '"Order processing: validate → charge card → notify warehouse → send email, dengan error handling pada setiap step" → Step Functions. Bukan Lambda je (Lambda tak ada built-in retry/branching logic across services).',
            tips: [
              'Distributed Map state: parallelizes processing over large datasets (e.g. chunk a text file and process each chunk concurrently) — key for PT5 text-to-speech pipeline question',
              '"Graphical/visual console to see each step\'s state" → Step Functions (not SQS, not SWF)',
              'SWF vs Step Functions: Step Functions is the modern replacement; SWF is legacy and lacks the visual console',
            ],
            keywords: ['workflow', 'state machine', 'orchestration', 'retry logic', 'error handling', 'Lambda orchestration', 'visual workflow', 'Distributed Map', 'parallel processing'],
          },
          {
            shortName: 'Amazon MQ',
            fullName: 'Amazon MQ',
            ingat: '"SQS tapi untuk apps lama yang guna ActiveMQ/RabbitMQ"',
            gunaUntuk: 'Migrate existing ActiveMQ/RabbitMQ message brokers to AWS without code changes',
            fungsi: 'Managed message broker service yang support ActiveMQ dan RabbitMQ. Guna AMQP, MQTT, STOMP, OpenWire protocols. Untuk lift-and-shift apps yang dah guna standard protocols.',
            scenario: '"Company ada on-premises app guna ActiveMQ, nak migrate ke AWS tanpa tukar code" → Amazon MQ. App baru? → guna SQS/SNS (simpler, cheaper, cloud-native). Amazon MQ = MIGRATION/LEGACY. SQS = cloud-native new apps.',
            tips: [
              'Amazon MQ vs SQS/SNS: Amazon MQ = lift-and-shift apps yang ALREADY use AMQP/MQTT/STOMP protocols. SQS/SNS = cloud-native new applications (simpler, cheaper, scales better)',
              'Supports both ActiveMQ and RabbitMQ engines. ActiveMQ supports more protocols (AMQP, MQTT, STOMP, OpenWire, WebSocket). RabbitMQ = AMQP + JMS sahaja. App guna MQTT/STOMP → mesti ActiveMQ engine',
              'Deployment: single-instance (dev/test) or active/standby (production HA). Active/standby uses EFS for shared storage — automatic failover',
              'Exam keyword: "migrate", "existing messaging system", "MQTT", "AMQP", "without changing application code" → Amazon MQ. Jangan pilih SQS/SNS untuk migration scenarios',
            ],
            keywords: ['ActiveMQ', 'RabbitMQ', 'AMQP', 'MQTT', 'lift-and-shift', 'message broker', 'legacy migration', 'open protocols', 'STOMP', 'OpenWire'],
          },
          {
            shortName: 'Kinesis Data Firehose',
            fullName: 'Amazon Kinesis Data Firehose',
            ingat: '"Paip streaming data terus ke S3/Redshift — no code needed"',
            gunaUntuk: 'Capture and load streaming data to S3, Redshift, OpenSearch, Splunk automatically',
            fungsi: 'Fully managed delivery stream — tak perlu tulis consumer code. Buffer data sebelum write. Boleh transform inline dengan Lambda. Kinesis Data Streams = real-time processing (kena tulis consumer). Firehose = delivery/loading (no consumer needed).',
            scenario: '"Ingest clickstream data to S3 for analysis" → Kinesis Firehose (automatic, no consumer code). "Real-time fraud detection processing streaming events" → Kinesis Data Streams (more control, write consumer). Ingat perbezaan Streams vs Firehose!',
            keywords: ['delivery stream', 'S3 delivery', 'Redshift', 'OpenSearch', 'no consumer code', 'buffer', 'transform with Lambda'],
          },
          {
            shortName: 'AppFlow',
            fullName: 'AWS AppFlow',
            ingat: '"Penyambung SaaS → AWS, tanpa code"',
            gunaUntuk: 'Automated no-code data transfer between SaaS apps (Salesforce, ServiceNow, Slack) and AWS services',
            fungsi: 'Fully managed integration service dengan 50+ built-in SaaS connectors. Boleh transfer data bidirectionally antara SaaS platforms dan S3, Redshift, EventBridge. Support scheduling, field mapping, filtering, and data transformation.',
            scenario: '"Company guna Salesforce dan ServiceNow, nak sync data ke S3 untuk analytics tanpa custom code" → AppFlow. DataSync = file/storage migration (NFS, SMB, S3). Glue = ETL untuk structured data. AppFlow = SaaS API connectors.',
            tips: [
              'AppFlow vs DataSync: AppFlow = SaaS API integration (Salesforce, ServiceNow, Zendesk). DataSync = file protocol migration (NFS, SMB, HDFS, S3)',
              'AppFlow vs Glue: AppFlow = no-code, event-triggered SaaS sync. Glue = code-based ETL (PySpark/Python), for data lakes',
              '"automate transfer between SaaS app and S3 with no custom development" → AppFlow (every time)',
            ],
            keywords: ['AppFlow', 'SaaS integration', 'Salesforce', 'ServiceNow', 'no-code connector', 'data transfer', 'bidirectional', 'S3', 'Redshift'],
          },
          {
            shortName: 'AppSync',
            fullName: 'AWS AppSync',
            ingat: '"GraphQL API yang managed — real-time + offline sync"',
            gunaUntuk: 'Build GraphQL APIs with real-time data sync and offline capability',
            fungsi: 'Fully managed GraphQL service. Automatically generates resolvers untuk DynamoDB, Lambda, Aurora, OpenSearch, HTTP. Real-time subscriptions via WebSocket. Offline data sync untuk mobile/web apps (conflict resolution built-in). Combine multiple data sources dalam single GraphQL query.',
            contohGuna: 'Mobile app perlukan real-time chat + offline support → AppSync GraphQL API. Frontend query satu endpoint, AppSync resolve dari DynamoDB + Lambda + Aurora sekaligus.',
            scenario: '"Mobile app needs real-time updates and offline data sync with automatic conflict resolution" → AppSync. "REST API for microservices" → API Gateway. AppSync = GraphQL + real-time + offline. API Gateway = REST/WebSocket + throttling + API keys.',
            tips: [
              'AppSync vs API Gateway: AppSync = GraphQL, real-time subscriptions, offline sync, multiple data sources in one query. API Gateway = REST/HTTP/WebSocket APIs, throttling, usage plans, API keys',
              'Data sources: DynamoDB, Aurora, OpenSearch, Lambda, HTTP endpoints, other AWS services. Satu query boleh resolve dari MULTIPLE data sources sekaligus — powerful for aggregation',
              'Real-time: GraphQL subscriptions over WebSocket — clients get push updates automatically. No polling needed',
              'Offline + conflict resolution: AppSync + Amplify DataStore = offline-first mobile/web apps. Data sync automatically bila device reconnects. Conflict resolution strategies: Optimistic Concurrency, Auto Merge, Custom Lambda',
              'Caching: AppSync has server-side caching (optional). Reduces resolver execution and improves latency',
              'Exam: "GraphQL" or "real-time data sync" or "offline mobile app" → AppSync. Bukan API Gateway (yang untuk REST/HTTP)',
            ],
            keywords: ['GraphQL', 'real-time', 'subscriptions', 'WebSocket', 'offline sync', 'conflict resolution', 'resolvers', 'DynamoDB', 'multiple data sources', 'mobile', 'Amplify'],
          },
          {
            shortName: 'Amplify',
            fullName: 'AWS Amplify',
            ingat: '"Heroku/Vercel-nya AWS — fullstack web/mobile hosting + backend"',
            gunaUntuk: 'Build and host fullstack web/mobile apps with managed backend services',
            fungsi: 'Platform untuk build fullstack apps. Amplify Hosting = CI/CD + CDN hosting untuk SSR/SSG web apps (connect Git repo, auto-deploy). Amplify Studio = visual builder untuk backend (auth, data, storage). Backend powered by Cognito (auth), AppSync (API), DynamoDB (data), S3 (storage).',
            contohGuna: 'React/Next.js app → connect GitHub repo ke Amplify → auto build + deploy ke CDN. Add auth dengan Cognito, API dengan AppSync, storage dengan S3 — semua managed.',
            scenario: '"Developer team wants to quickly deploy a React web app with CI/CD, authentication, and a GraphQL backend without managing infrastructure" → Amplify. Bukan EC2 + manual setup. Bukan Elastic Beanstalk (yang untuk traditional server apps).',
            tips: [
              'Amplify Hosting: Git-based CI/CD (GitHub, GitLab, Bitbucket). Supports SSR (Next.js, Nuxt), SSG, SPA. Instant cache invalidation via CloudFront CDN. Custom domains + HTTPS automatic',
              'Amplify vs Elastic Beanstalk: Amplify = frontend/fullstack apps (React, Next.js, mobile). Beanstalk = backend server apps (Node.js, Python, Java, Docker). Different use cases',
              'Amplify vs CloudFront + S3: Amplify includes CI/CD pipeline + backend services. S3+CloudFront = static hosting sahaja, perlu setup pipeline sendiri',
              'Backend: Amplify uses Cognito (auth), AppSync/API Gateway (API), DynamoDB (data), S3 (file storage), Lambda (functions) under the hood. Abstracts away the complexity',
              'Exam: "quickly build and deploy fullstack web application" or "frontend hosting with CI/CD" → Amplify. "Host static website cheaply" → S3 + CloudFront',
            ],
            keywords: ['fullstack', 'CI/CD', 'frontend hosting', 'mobile', 'React', 'Next.js', 'Cognito', 'AppSync', 'backend-as-a-service', 'Git deploy', 'CDN'],
          },
        ],
      },
      {
        id: 'd3-infra',
        icon: '🏗️',
        title: 'Infrastructure',
        category: 'infra',
        services: [
          {
            shortName: 'CloudFormation',
            fullName: 'AWS CloudFormation',
            ingat: '"Blueprint untuk AWS resources"',
            gunaUntuk: 'Automate infrastructure deployment, consistent environment',
            fungsi: 'Mengurus dan menyediakan infrastruktur AWS secara automatik menggunakan template (IaC)',
            contohGuna: 'Deploy EC2 + S3 + RDS sekaligus dari satu template YAML/JSON, replicate environment dev/staging/prod',
            tips: [
              'Lambda-backed Custom Resources: guna Lambda untuk perform logic masa CloudFormation create/update/delete — contoh: lookup AMI ID dynamically',
              'AMI IDs berbeza tiap region + instance type → Lambda custom resource query SSM Parameter Store atau EC2 API untuk get correct AMI ID masa stack creation',
              'Tanpa custom resource: kena maintain separate template per region (manual overhead). Dengan custom resource: satu template, Lambda inject AMI ID automatik',
              'Custom resource flow: CFN trigger Lambda → Lambda query API → return value → CFN inject ke template',
              'Bukan SNS/SQS untuk AMI lookup — SNS = notifications, SQS = queuing, bukan dynamic lookup',
              'Exam: "single CloudFormation template for multiple regions, auto-select correct AMI ID" → Lambda-backed custom resource',
              'Mappings: static key-value lookup tables dalam template (e.g. region → AMI ID). Tak perlu user input, hardcoded dalam template',
              'Outputs: export values dari stack untuk cross-stack reference. Consuming stack guna Fn::ImportValue untuk import',
              'Parameters: user input masa stack launch (dynamic). Conditions: conditional resource creation berdasarkan parameter values',
              'EXAM KEY: "region-specific AMI selection" → Mappings. "Share values between stacks" → Outputs + ImportValue. "User chooses env" → Parameters',
              'cfn-init: reads AWS::CloudFormation::Init metadata + install packages/files/services — PRIMARY bootstrap script',
              'cfn-signal: hantar SUCCESS/FAILURE signal ke CloudFormation (untuk WaitCondition/CreationPolicy)',
              'cfn-hup: daemon yang detect metadata changes dan re-run cfn-init bila stack update',
              'cfn-get-metadata: retrieve metadata SAHAJA — tidak install apa-apa',
              'Exam: "read metadata and install packages on EC2 launch" → cfn-init',
              'Change set: PREVIEW perubahan (resources akan create/update/delete) SEBELUM execute — tak terus apply. Best practice: always review change set before updating production stack',
              'Drift detection: detect bila resource dalam stack diubah MANUALLY (outside CloudFormation, e.g. via console) — stack jadi "DRIFTED" dari template. Tak auto-fix, just detect & report',
              'Stack update failure → automatic ROLLBACK ke previous working state (default behaviour)',
              'Stack deletion: resources dengan DeletionPolicy: Retain akan KEKAL walaupun stack dipadam — guna untuk data store (RDS, S3) yang tak nak accidentally lenyap',
              'Exam: "preview changes before applying" → Change Sets. "Detect manual console changes to stack resources" → Drift Detection',
              'Nested Stacks: stack yang dipanggil dari dalam stack lain (parent stack) menggunakan AWS::CloudFormation::Stack resource type. Guna bila template dah terlalu besar atau ada reusable components (e.g. network layer, security layer yang dipakai oleh banyak stacks).',
              'Nested Stacks benefit: modularization — separate VPC stack, app stack, DB stack. Parent orchestrate semua. Setiap nested stack diupdate/rolledback independently.',
              'Exam: "reuse common infrastructure components (VPC, subnets) across multiple CloudFormation stacks" → Nested Stacks. "Share VPC ID between stacks" → Outputs + ImportValue (cross-stack ref).',
            ],
            keywords: ['IaC', 'Infrastructure as Code', 'template', 'stack', 'rollback', 'repeatable deployment', 'Lambda-backed custom resource', 'AMI lookup', 'dynamic parameters', 'multi-region template', 'Mappings', 'Outputs', 'cross-stack reference', 'Fn::ImportValue', 'cfn-init', 'cfn-signal', 'cfn-hup', 'cfn-get-metadata', 'change set', 'drift detection', 'stack rollback', 'DeletionPolicy', 'nested stacks', 'AWS::CloudFormation::Stack', 'modular templates'],
          },
          {
            shortName: 'SSM',
            fullName: 'AWS Systems Manager',
            ingat: '"Remote control untuk EC2 fleet"',
            gunaUntuk: 'Manage, patch, and run commands on EC2 instances at scale',
            fungsi: 'Suite alat untuk visibility dan kawalan ke atas infrastruktur AWS. Run Command jalankan commands pada existing instances tanpa SSH. Patch Manager automate OS patching. Parameter Store simpan config/secrets.',
            contohGuna: 'Perlu patch 500 EC2 instances serentak — SSM Patch Manager buat semua tanpa perlu SSH satu-satu. Run Command untuk restart service pada semua app servers.',
            scenario: '"Manage existing instances remotely, run commands without SSH, patch fleet at scale" → SSM Run Command. Bukan User Data (User Data hanya masa launch sahaja).',
            tips: [
              'SSM Run Command: jalankan commands pada EC2 instances AT SCALE tanpa SSH. Requirement: SSM Agent installed + instance profile ada AmazonSSMManagedInstanceCore policy',
              'SSM Agent dah pre-installed pada Amazon Linux 2 dan Windows Server. Custom AMI mungkin perlu install sendiri',
              'Run Command vs Session Manager: Run Command = execute scripts/commands (non-interactive, good for patch/config). Session Manager = interactive browser-based shell — NO port 22, NO bastion host needed',
              'Session Manager audit: semua session commands logged ke S3 and/or CloudWatch Logs, dan session start/end dicatat dalam CloudTrail. Fully traceable, no SSH keys to manage.',
              'Parameter Store (free tier): Standard parameters = up to 10,000 params, free, no expiration. Advanced parameters = higher limits + parameter policies (expiration, notification via EventBridge).',
              'Parameter Store SecureString: encrypt value dengan KMS key (default aws/ssm atau custom CMK). Guna untuk passwords, API keys — retrieved via SSM API, plaintext only bila caller ada KMS decrypt permission.',
              'Parameter Store vs Secrets Manager: Parameter Store = cheaper (free for standard), no auto-rotation. Secrets Manager = automatic rotation (supports RDS, Redshift, DocumentDB natively), cross-account access, costs ~$0.40/secret/month.',
              'Exam: "update 100 EC2 instances in parallel, no SSH allowed" → SSM Run Command. "Interactive shell access without opening port 22" → Session Manager. "Store DB password, auto-rotate every 30 days" → Secrets Manager (not Parameter Store).',
              'Exam: "store config values and DB passwords centrally, no rotation needed, minimize cost" → Parameter Store SecureString.',
            ],
            keywords: ['Run Command', 'Patch Manager', 'Parameter Store', 'Session Manager', 'no SSH', 'fleet management', 'parallel execution', 'AmazonSSMManagedInstanceCore', 'SecureString', 'KMS', 'Standard tier', 'Advanced tier', 'bastion-free', 'Secrets Manager', 'auto-rotation'],
          },
          {
            shortName: 'AWS Config',
            fullName: 'AWS Config',
            ingat: '"Audit & track apa yang berubah"',
            gunaUntuk: 'Track configuration changes and compliance of AWS resources',
            fungsi: 'Memantau dan merekod konfigurasi AWS resources dari masa ke masa. Boleh set rules untuk enforce compliance — contoh: "semua S3 mesti ada encryption". Bukan untuk run scripts.',
            contohGuna: 'Security team nak tau siapa yang ubah Security Group semalam dan bila — AWS Config simpan history semua config changes.',
            scenario: '"Audit config changes, check compliance, who changed what and when" → AWS Config. Keyword: configuration changes, compliance, audit trail, resource history.',
            tips: [
              'Config Rules: managed rules (AWS pre-built) atau custom rules (Lambda). Evaluate resources against rules continuously or on change. Non-compliant = flagged, boleh trigger remediation.',
              'Auto-remediation: link Config rule ke SSM Automation document. E.g. rule "S3-bucket-public-read-prohibited" violated → auto remediation revoke public access. Tak perlu manual fix.',
              'Conformance Packs: kumpulan Config rules + remediation actions dalam satu package (YAML). Boleh deploy ke seluruh Org via StackSets. Use cases: CIS AWS Foundations, NIST, PCI DSS compliance bundles.',
              'Config vs CloudTrail: Config = WHAT IS THE CURRENT/PAST STATE of resource config? CloudTrail = WHO CALLED WHAT API WHEN? Dua tool berbeza, sering digunakan bersama.',
              'Config vs CloudWatch: Config = resource config history & compliance. CloudWatch = performance metrics & alarms. Config tidak monitor CPU — CloudWatch yang buat.',
              'Config perlu IAM role dengan permissions untuk describe/record resources. Enable per-region — bukan global service (tapi boleh aggregate ke multi-account, multi-region Config aggregator).',
              'Exam: "ensure all EC2 instances are tagged" atau "enforce all S3 buckets encrypted" + "auto-fix violations" → Config rules + auto-remediation (bukan Lambda alone, bukan CloudTrail).',
              'Config Aggregator: view Config data across multiple accounts & regions dari satu central account — senang untuk compliance reporting org-wide.',
            ],
            keywords: ['compliance', 'audit', 'config changes', 'config rules', 'resource history', 'drift detection', 'auto-remediation', 'conformance packs', 'Config aggregator', 'SSM Automation', 'managed rules', 'custom rules'],
          },
          {
            shortName: 'CodeCommit',
            fullName: 'AWS CodeCommit',
            ingat: '"GitHub tapi dalam AWS"',
            gunaUntuk: 'Private Git repository dalam AWS ecosystem',
            fungsi: 'Managed source control service — store, version, dan collaborate on code securely dalam AWS. Integrate terus dengan IAM untuk access control, dan native dengan CodePipeline/CodeBuild.',
            contohGuna: 'Dev team simpan code dalam CodeCommit → setiap push trigger CodePipeline automatically.',
            scenario: '"Source control dalam AWS", "private Git repository", "version control integrated dengan IAM" → CodeCommit.',
            keywords: ['Git', 'source control', 'version control', 'private repo', 'IAM integration'],
          },
          {
            shortName: 'CI/CD Pipeline',
            fullName: 'CodeCommit → CodeBuild → CodeDeploy → CodePipeline',
            ingat: '"4 Code services = full DevOps pipeline"',
            gunaUntuk: 'Automate build, test, and deploy pipeline end-to-end',
            fungsi: 'Suite 4 perkhidmatan: CodeCommit (store code) → CodeBuild (compile + test) → CodeDeploy (deploy ke EC2/Lambda/ECS) → CodePipeline (orchestrate semua steps automatically bila ada code push).',
            contohGuna: 'Developer push ke CodeCommit → CodePipeline detect → CodeBuild run tests → CodeDeploy push ke production EC2 — semua automatik.',
            storageDetails: 'CodeCommit → Store & version control source code (Git)\nCodeBuild → Compile, test, produce build artifacts\nCodeDeploy → Deploy ke EC2, Lambda, ECS, on-premises\nCodePipeline → Orchestrate & automate the full pipeline',
            detailsLabel: 'CI/CD Suite',
            scenario: 'Soalan sebut "automate deployment", "CI/CD pipeline in AWS", "deploy code automatically on push" → CodePipeline sebagai orchestrator utama.',
            keywords: ['CI/CD', 'CodePipeline', 'CodeBuild', 'CodeDeploy', 'DevOps', 'automation', 'pipeline'],
          },
          {
            shortName: 'CloudWatch',
            fullName: 'Amazon CloudWatch',
            ingat: '"Dashboard, logs, dan alarm untuk semua dalam AWS"',
            gunaUntuk: 'Monitor metrics, collect logs, set alarms, create dashboards for AWS resources',
            fungsi: 'CloudWatch Metrics (CPU, network, custom app metrics). CloudWatch Logs (Lambda logs, EC2 app logs, VPC Flow Logs — set retention). CloudWatch Alarms (trigger SNS/Auto Scaling bila threshold exceeded). Dashboards untuk visualize.',
            contohGuna: 'EC2 CPU >80% → CloudWatch Alarm → SNS notification ke team. Lambda error logs → CloudWatch Logs untuk debug.',
            scenario: '"CPU EC2 melebihi 80%, send alert" → CloudWatch Alarm. "View logs dari Lambda" → CloudWatch Logs. "Custom app metric" → CloudWatch custom metrics. CloudWatch = METRICS & LOGS. CloudTrail = API AUDIT. Ingat perbezaan!',
            tips: [
              'Default EC2 metrics (CPU, network, disk I/O, status checks) = "host-level" metrics dari hypervisor — tak perlu install apa-apa',
              'EC2 MEMORY usage dan DISK SPACE usage = BUKAN default metric — kena install CloudWatch agent untuk collect ni',
              'Unified CloudWatch Agent (current): satu agent untuk metrics (termasuk memory/disk) + logs + traces (X-Ray), support Linux & Windows, boleh push custom metrics via StatsD/collectd',
              'CloudWatch Logs Agent (deprecated/legacy): logs-only, Linux-only — AWS recommend migrate ke unified agent',
              'Exam: "collect EC2 memory utilization metric" → install/configure (unified) CloudWatch agent. Default monitoring TAK CUKUP.',
              'Standard monitoring = every 5 min (free). Detailed monitoring = every 1 min (additional cost)',
              'CloudWatch Logs Insights: interactive query language (SQL-like) untuk search dan analyze log data in CloudWatch Logs. Boleh query across multiple Log Groups. Guna untuk: "find all ERROR logs in last 1 hour from Lambda", "count request counts by status code". Bukan Athena (Athena untuk S3 data).',
              'Exam: "query and analyze CloudWatch Logs with an interactive query interface" → CloudWatch Logs Insights. "Analyze logs stored in S3" → Athena.',
            ],
            keywords: ['metrics', 'logs', 'alarms', 'dashboards', 'CPU monitoring', 'custom metrics', 'Log Groups', 'VPC Flow Logs', 'CloudWatch agent', 'unified agent', 'memory utilization', 'detailed monitoring', 'Logs Insights', 'query logs', 'SQL-like'],
          },
          {
            shortName: 'X-Ray',
            fullName: 'AWS X-Ray',
            ingat: '"GPS untuk trace request melalui microservices"',
            gunaUntuk: 'Distributed tracing — debug latency and errors across microservices and serverless',
            fungsi: 'X-Ray trace setiap request dari masuk (API Gateway) hingga keluar (DynamoDB), nampak berapa lama setiap component ambil masa. Service map visual tunjuk bottleneck. Works dengan Lambda, EC2, ECS, API Gateway.',
            scenario: '"API lambat, tak tahu kat mana bottleneck dalam 10 microservices" → X-Ray service map. Trace request dari API Gateway → Lambda → DynamoDB dan nampak mana paling slow. Keywords: distributed tracing, latency, microservices debugging.',
            tips: [
              'X-Ray traces message paths end-to-end melalui SQS, Lambda, API Gateway — identify bottlenecks atau missing messages',
              'CloudTrail = WHO DID WHAT (API audit). CloudWatch = metrics/alarms. X-Ray = WHY IS IT SLOW / WHERE IS IT FAILING (distributed trace)',
              'Exam: "debug message not reaching destination through SQS distributed system" → X-Ray (not CloudWatch, not CloudTrail)',
              'X-Ray Insights: automatically detects anomalies (error/latency spikes) in your X-Ray data and sends notifications via SNS/EventBridge — answers "automatic anomaly detection with notifications" requirement',
              '"graphical end-to-end visibility" + "anomaly notifications" → X-Ray + X-Ray Insights',
            ],
            keywords: ['distributed tracing', 'service map', 'latency analysis', 'microservices', 'Lambda tracing', 'bottleneck', 'debugging', 'SQS tracing', 'end-to-end trace', 'bottleneck detection', 'X-Ray Insights', 'anomaly detection'],
          },
          {
            shortName: 'AWS Health Dashboard',
            fullName: 'AWS Health Dashboard',
            ingat: '"Status AWS untuk AKAUN KAU sendiri, bukan global"',
            gunaUntuk: 'See AWS service issues and scheduled changes that affect YOUR specific account/resources',
            fungsi: 'Dua bahagian: (1) Service Health Dashboard — overall AWS service status (public, semua org boleh tengok). (2) AWS Health Dashboard (account-specific) — personalized view of operational issues, scheduled maintenance/changes, dan event yang affect resources dalam account kau.',
            scenario: '"AWS region kau experiencing issue — adakah resources SAYA affected?" → AWS Health Dashboard (account view), bukan general Service Health page. Boleh integrate dengan EventBridge untuk auto-notify (e.g. Lambda → Slack) bila ada event affecting your resources.',
            tips: [
              'Service Health Dashboard = general AWS-wide status (public). AWS Health Dashboard = PERSONALIZED, account-specific events/scheduled changes affecting YOUR resources',
              'Boleh route AWS Health events ke EventBridge → Lambda/SNS untuk automated alerting (e.g. notify team bila ada scheduled EC2 retirement)',
              'Full AWS Health API access requires Business atau Enterprise Support plan',
              'Beza dengan Trusted Advisor: Trusted Advisor = proactive recommendations (cost/security/perf checks). AWS Health = reactive/scheduled — notifies about actual AWS-side EVENTS affecting your resources (outages, maintenance, deprecations)',
            ],
            docs: [
              { label: 'What is AWS Health?', url: 'https://docs.aws.amazon.com/health/latest/ug/what-is-aws-health.html' },
            ],
            keywords: ['service health', 'personal health dashboard', 'scheduled changes', 'account events', 'EventBridge', 'operational issues', 'maintenance notification'],
          },
        ],
      },
      {
        id: 'd3-db',
        icon: '🗄️',
        title: 'Databases',
        category: 'd3db',
        services: [
          {
            shortName: 'Pilih Database',
            fullName: 'Which AWS Database? — purpose-built selector',
            ingat: '"Tiap database ada KERJA dia — match shape data dengan engine"',
            gunaUntuk: 'Pilih database betul ikut shape data + access pattern (THE exam decision)',
            fungsi: 'AWS galak "purpose-built database" — pilih ikut bentuk data dan cara access, bukan satu DB untuk semua. Relational (SQL, transaksi) → RDS/Aurora. Key-value laju → DynamoDB. Cache → ElastiCache. Document/Mongo → DocumentDB. Graph → Neptune. Wide-column → Keyspaces. Analytics/warehouse → Redshift. In-memory durable → MemoryDB.',
            mermaid: [
              {
                label: 'Pilih database (decision tree)',
                source: `flowchart TD
  A[Apa bentuk data + access?] --> B{Relational / SQL?}
  B -->|Ya, transaksi OLTP| C{Perlu HA hebat + auto-scale storage?}
  C -->|Ya| C1[Aurora]
  C -->|Standard MySQL/Postgres| C2[RDS]
  B -->|Tak| D{Key-value, ms latency, serverless?}
  D -->|Ya| D1[DynamoDB]
  D -->|Tak| E{Guna untuk apa lagi?}
  E -->|Cache depan DB| E1[ElastiCache / DAX]
  E -->|Document / MongoDB| E2[DocumentDB]
  E -->|Graph, relationship| E3[Neptune]
  E -->|Wide-column / Cassandra| E4[Keyspaces]
  E -->|Analytics / warehouse OLAP| E5[Redshift]`,
                caption: 'Mula-mula tanya "relational ke tak". Relational + transaksi → RDS/Aurora. Lepas tu match keyword soalan: "MongoDB" → DocumentDB, "graph/relationship/fraud" → Neptune, "Cassandra/wide-column" → Keyspaces, "warehouse/analytics" → Redshift, "microsecond cache" → DAX/ElastiCache.',
              },
              {
                label: 'Analogi Shopee — OLTP vs OLAP',
                source: `flowchart TD
  Q["Apa kerja database ni?"] --> T{Transaksi atau analytics?}
  T -->|"🛒 Tekan Checkout di Shopee<br/>(tolak stok, simpan order, millisecond)"| OLTP["OLTP → RDS / Aurora / DynamoDB"]
  T -->|"📊 'Jumlah jualan semua kedai<br/>ikut negeri bulan ni?'"| OLAP["OLAP → Redshift"]
  OLTP --> O1["Banyak insert/update<br/>baris tunggal, laju"]
  OLAP --> A1["Aggregate berjuta baris<br/>(SUM, GROUP BY)"]`,
                caption: 'Analogi Shopee: setiap kali kau tekan Checkout = satu transaksi kecil pantas (tolak stok, simpan order dalam millisecond) = OLTP → RDS/Aurora/DynamoDB. Bila bos minta laporan "jumlah jualan semua kedai ikut negeri bulan ni" = baca & aggregate berjuta baris = OLAP → Redshift. Jangan keliru: checkout = OLTP, dashboard/laporan = OLAP.',
              },
            ],
            compare: {
              label: 'Purpose-built database matrix',
              headers: ['Engine', 'Jenis', 'Guna bila / keyword exam'],
              rows: [
                ['RDS', 'Relational (managed)', 'MySQL/Postgres/Oracle/SQL Server, transaksi standard'],
                ['Aurora', 'Relational (cloud-native)', 'HA hebat, 6 copies, 5x MySQL, auto-scale storage, Global DB'],
                ['DynamoDB', 'Key-value / document NoSQL', 'Serverless, single-digit ms, any scale, spiky traffic'],
                ['ElastiCache', 'In-memory cache', 'Kurangkan load DB, Redis/Memcached, session store'],
                ['DAX', 'In-memory cache (DynamoDB)', 'Microsecond reads KHUSUS DynamoDB'],
                ['DocumentDB', 'Document (Mongo-compat)', '"Migrate MongoDB", JSON documents, collections'],
                ['Neptune', 'Graph', 'Social network, fraud detection, relationship query'],
                ['Keyspaces', 'Wide-column (Cassandra)', '"Migrate Cassandra", CQL, wide-column'],
                ['Redshift', 'Data warehouse (OLAP)', 'Analytics berulang, BI, aggregate berjuta baris'],
                ['Timestream', 'Time-series', 'IoT sensor data, metrics ikut masa'],
              ],
              takeaway: 'Exam fish for KEYWORD: "MongoDB"→DocumentDB, "Cassandra"→Keyspaces, "graph/relationship"→Neptune, "warehouse/analytics"→Redshift, "time-series/IoT metrics"→Timestream, "microsecond DynamoDB"→DAX, "transaksi + HA"→Aurora. Jangan jawab DynamoDB untuk soalan relational/transaksi.',
            },
            tips: [
              'OLTP (transaksi, banyak read/write baris tunggal) → RDS/Aurora. OLAP (analytics, aggregate besar) → Redshift. Ni beza paling kerap ditanya.',
              'SQL/relational + perlu HA terbaik + auto storage + global → Aurora. SQL standard / engine spesifik (Oracle, SQL Server) → RDS.',
              'NoSQL key-value serverless ms latency → DynamoDB. Perlu microsecond reads atas DynamoDB → tambah DAX.',
              'Keyword migrasi: "migrate MongoDB"→DocumentDB, "migrate Cassandra"→Keyspaces, "migrate Kafka"→MSK (streaming, bukan DB).',
              'Cache: ElastiCache = cache depan SEBARANG DB (Redis/Memcached). DAX = cache KHUSUS DynamoDB sahaja.',
              'Graph (mutual friends, fraud rings, recommendation) → Neptune. Bukan DynamoDB, bukan RDS.',
            ],
            keywords: ['purpose-built database', 'OLTP vs OLAP', 'relational', 'NoSQL', 'key-value', 'document', 'graph', 'wide-column', 'time-series', 'database selection', 'which database'],
          },
          {
            shortName: 'DocumentDB',
            fullName: 'Amazon DocumentDB',
            ingat: '"MongoDB dalam AWS — JSON documents"',
            gunaUntuk: 'JSON document store, MongoDB-compatible workloads migrate to AWS',
            fungsi: 'Fully managed document database yang compatible dengan MongoDB APIs. Store data sebagai JSON documents dalam collections. Auto-scale storage hingga 64TB.',
            scenario: '"Migrate MongoDB to AWS managed service" → DocumentDB. NOT Neptune (graph). NOT DynamoDB (key-value). DocumentDB = DOCUMENT/MONGODB. Keywords: JSON, semi-structured data, MongoDB compatible, collections.',
            keywords: ['MongoDB compatible', 'document store', 'JSON', 'collections', 'NoSQL', 'MongoDB migration'],
          },
          {
            shortName: 'Neptune',
            fullName: 'Amazon Neptune',
            ingat: '"Database untuk connections antara data — graph"',
            gunaUntuk: 'Social networks, fraud detection, knowledge graphs, recommendation engines',
            fungsi: 'Fully managed graph database. Optimized untuk traverse relationships dalam data. Support Gremlin (property graph) dan SPARQL (RDF). Highly connected datasets.',
            scenario: '"Social network: cari semua mutual friends antara dua users" → Neptune (graph query efficient). "Fraud detection: cari pattern dalam linked transactions" → Neptune. Bukan DynamoDB (key-value) atau RDS (relational tabular). Keywords: graph, relationships, connected data.',
            keywords: ['graph database', 'social network', 'fraud detection', 'Gremlin', 'SPARQL', 'relationships', 'knowledge graph'],
          },
          {
            shortName: 'Keyspaces',
            fullName: 'Amazon Keyspaces',
            ingat: '"Cassandra dalam AWS — wide column, IoT, time-series"',
            gunaUntuk: 'Migrate Apache Cassandra workloads, IoT telemetry, time-series data',
            fungsi: 'Fully managed Cassandra-compatible database. Guna CQL (Cassandra Query Language) yang sama. Serverless — auto-scale, pay per request. High write throughput.',
            scenario: '"Migrate Apache Cassandra to fully managed AWS service" → Amazon Keyspaces. Same CQL queries, no server management. Atau IoT telemetry data yang perlu high write throughput. Keywords: Cassandra, CQL, wide column.',
            keywords: ['Cassandra compatible', 'CQL', 'wide column', 'IoT telemetry', 'time-series', 'high write throughput'],
          },
        ],
      },
      {
        id: 'd3-analytics',
        icon: '📊',
        title: 'Analytics & Streaming',
        category: 'd3analytics',
        services: [
          {
            shortName: 'Redshift',
            fullName: 'Amazon Redshift',
            ingat: '"Data warehouse — OLAP, columnar, petabyte SQL analytics"',
            gunaUntuk: 'Data warehouse: complex/recurring analytics atas structured data berskala besar',
            fungsi: 'Petabyte-scale data warehouse untuk OLAP (analytics), BUKAN OLTP (transaksi → guna RDS). Simpan data secara COLUMNAR + compress → query aggregate (SUM, GROUP BY) atas berbilion baris jadi laju. Massively Parallel Processing (MPP): leader node agih query ke banyak compute node. Spectrum boleh query S3 terus tanpa load.',
            contohGuna: 'BI/reporting atas data berkumpul (sales, finance), join besar merentas berjuta baris, dashboard berulang yang sama tiap hari',
            detailsLabel: 'Redshift Anatomy (MPP)',
            storageDetails: 'Leader Node → terima query, buat plan, agih ke compute node, kumpul hasil\nCompute Nodes → simpan data + jalankan query selari (MPP)\nRA3 + Managed Storage → compute & storage berasingan, bayar ikut guna; scale tanpa pindah data\nRedshift Spectrum → query data dalam S3 TERUS tanpa load ke cluster\nConcurrency Scaling → auto-tambah cluster sementara bila ramai user query serentak',
            diagram: {
              label: 'Redshift MPP + Spectrum flow',
              steps: [
                { nodes: [{ label: 'SQL Client / BI', sub: 'JDBC/ODBC', tone: 'c1' }] },
                { nodes: [{ label: 'Leader Node', sub: 'plan + agih', tone: 'c5' }] },
                { nodes: [
                  { label: 'Compute 1', tone: 'c3' },
                  { label: 'Compute 2', tone: 'c3' },
                  { label: 'Compute 3', tone: 'c3' },
                ] },
                { nodes: [
                  { label: 'Managed Storage', sub: 'columnar', tone: 'c4' },
                  { label: 'Spectrum → S3', sub: 'query data lake', tone: 'c2' },
                ] },
              ],
              caption: 'Leader node pecahkan query, compute nodes proses selari (MPP) atas data columnar. Spectrum extend query terus ke S3 tanpa load. Inilah sebab Redshift laju untuk aggregate besar — tapi LEMAH untuk single-row insert/update (itu kerja OLTP → RDS).',
            },
            mermaid: [
              {
                label: 'Anatomy komponen Redshift (cluster → slices → storage)',
                source: `flowchart TD
  CL["🏢 Redshift Cluster"] --> LN["Leader Node<br/>terima query · buat plan · kumpul hasil"]
  LN -->|"agih query (MPP)"| CN1["Compute Node 1<br/>CPU · RAM · disk sendiri"]
  LN -->|"agih query (MPP)"| CN2["Compute Node 2<br/>CPU · RAM · disk sendiri"]
  CN1 --> SL1["Slices<br/>node pecah jadi slices,<br/>proses data SELARI"]
  CN2 --> SL2["Slices<br/>node pecah jadi slices,<br/>proses data SELARI"]
  SL1 --> RMS["Managed Storage (RMS)<br/>columnar + compress · atas S3 (RA3)"]
  SL2 --> RMS
  RMS --> SPEC["Spectrum → query S3 terus<br/>tanpa load ke cluster"]`,
                caption: 'Hierarki: satu Cluster = 1 Leader Node (otak: plan & agih query) + banyak Compute Node (pekerja, ada CPU/RAM/disk sendiri). Tiap compute node dipecah jadi Slices — slice inilah unit MPP yang proses data selari. RA3 simpan data dalam Managed Storage (RMS) columnar atas S3, jadi compute & storage boleh scale berasingan. Spectrum extend query terus ke S3.',
              },
              {
                label: 'Pilih servis query/analytics (decision tree)',
                source: `flowchart TD
  A[Nak query / analyze data] --> B{Jenis workload?}
  B -->|Transaksi, banyak insert/update baris tunggal| C[RDS / Aurora<br/>OLTP]
  B -->|Analytics atas data besar| D{Berulang atau ad-hoc?}
  D -->|Recurring, complex join, dashboard tetap| E[Redshift<br/>data warehouse OLAP]
  D -->|Ad-hoc, sekali-sekala, data dalam S3| F[Athena<br/>serverless SQL on S3]
  B -->|Custom Spark/Hadoop, kawalan penuh cluster| G[EMR<br/>big data framework]`,
                caption: 'OLTP (transaksi) → RDS/Aurora. Analytics berulang/kompleks → Redshift. Ad-hoc SQL atas S3 tanpa setup → Athena. Custom Spark/Hadoop → EMR. Ni trap paling kerap di exam: jangan pilih Redshift untuk "ad-hoc, jarang query" (itu Athena) atau untuk OLTP (itu RDS).',
              },
            ],
            compare: [
              {
                label: 'Redshift — komponen dalaman (anatomy)',
                headers: ['Komponen', 'Peranan', 'Nota exam'],
                rows: [
                  ['Cluster', 'Keseluruhan: 1 Leader Node + 1 atau lebih Compute Node', 'Unit yang kau provision (atau guna Serverless)'],
                  ['Leader Node', 'Terima query SQL, buat execution plan, agih kerja ke compute node, kumpul & pulang hasil', 'TAK dikira caj dalam cluster multi-node; single-node = leader & compute jadi satu'],
                  ['Compute Node', 'Simpan data + jalankan query; ada CPU, memory & disk sendiri', 'Tambah node = lebih storage + lebih laju (scale horizontal)'],
                  ['Node Slices', 'Tiap compute node dipecah jadi beberapa slice; tiap slice proses sebahagian data SELARI', 'Inilah unit MPP sebenar — lebih slice = lebih parallelism'],
                  ['Managed Storage (RMS)', 'RA3: data disimpan dalam Redshift Managed Storage atas S3, auto-scale', 'Asingkan compute & storage → scale satu tanpa tambah satu lagi'],
                  ['Columnar + Compression', 'Simpan data ikut COLUMN (bukan row) + mampat', 'Sebab aggregate (SUM/GROUP BY) laju; lemah untuk single-row update'],
                  ['Zone Maps', 'Simpan min/max tiap blok data dalam memory → langkau blok tak relevan', 'Kurangkan jumlah data di-scan = query lagi laju'],
                  ['Distribution Style (DISTKEY)', 'Cara baris diagih antara slices: KEY / EVEN / ALL', 'KEY co-locate baris untuk join; ALL replicate table kecil ke semua node'],
                  ['Sort Key (SORTKEY)', 'Cara data disusun fizikal atas disk', 'Range scan & merge join laju bila filter ikut sort key'],
                  ['Redshift Spectrum', 'Query data dalam S3 TERUS guna external table, tanpa load', 'Warehouse + data lake S3 dalam satu query'],
                  ['Concurrency Scaling', 'Auto-tambah cluster sementara bila ramai query serentak', 'Spike concurrent users → tak beratur'],
                ],
                takeaway: 'Aliran: Cluster → Leader Node (otak: plan & agih) → Compute Nodes (pekerja) → Node Slices (unit selari MPP) → Managed Storage (columnar atas S3). DISTKEY & SORTKEY tuning prestasi; Spectrum extend ke S3; Concurrency Scaling handle ramai user serentak.',
              },
              {
                label: 'Redshift vs Athena vs EMR vs RDS',
                headers: ['Aspect', 'Redshift', 'Athena', 'EMR', 'RDS/Aurora'],
                rows: [
                  ['Jenis', 'Data warehouse (OLAP)', 'Serverless SQL on S3', 'Big-data cluster', 'Relational (OLTP)'],
                  ['Data', 'Structured, loaded/Spectrum', 'Data dalam S3', 'Apa saja dalam S3/HDFS', 'Structured transaksi'],
                  ['Server', 'Cluster (atau Serverless)', '🟢 Serverless, no infra', 'Kau urus cluster', 'Managed instance'],
                  ['Kos model', 'Per node/jam atau RPU', 'Per TB di-scan', 'Per instance (Spot jimat)', 'Per instance/jam'],
                  ['Best bila', 'Recurring complex analytics, BI', 'Ad-hoc, jarang, no setup', 'Custom Spark/Hadoop/ML', 'App transaksi (CRUD)'],
                ],
                takeaway: 'Recurring + complex + structured + perlu laju konsisten → Redshift. Sekali-sekala / jarang / tak nak urus apa-apa → Athena. Custom big-data processing → EMR. Transaksi → RDS. Jangan campur OLAP (Redshift) dengan OLTP (RDS).',
              },
              {
                label: 'Redshift — features penting exam',
                headers: ['Feature', 'Apa dia', 'Trigger'],
                rows: [
                  ['RA3 + Managed Storage', 'Compute & storage berasingan, scale sendiri', '"Scale compute tanpa bayar storage lebih"'],
                  ['Redshift Spectrum', 'Query S3 TERUS tanpa load ke cluster', '"Query data warehouse + data lake S3 sekali"'],
                  ['Redshift Serverless', 'Auto-scale RPU, no cluster management', '"Analytics tapi tak nak urus cluster / beban tak tetap"'],
                  ['Concurrency Scaling', 'Auto-tambah cluster bila ramai query serentak', '"Banyak user query serentak, jangan slow / queue"'],
                  ['Zero-ETL (Aurora→Redshift)', 'Data Aurora auto-flow ke Redshift, tak payah pipeline ETL', '"Analytics near-real-time tanpa bina ETL"'],
                ],
                takeaway: 'Spectrum = warehouse + S3 dalam satu query. Serverless = tak nak urus cluster. Concurrency Scaling = ramai user serentak. Zero-ETL = buang kerja bina pipeline Aurora→Redshift.',
              },
            ],
            scenario: '"Dashboard BI berulang atas berbilion baris sales, perlu join kompleks laju & konsisten" → Redshift. "Banyak analyst query serentak waktu puncak, jangan beratur" → Concurrency Scaling. "Nak query data dalam Redshift DAN data lake S3 dalam satu SQL" → Redshift Spectrum. "Beban analytics tak menentu, tak nak urus cluster" → Redshift Serverless. Bukan Athena (ad-hoc/jarang), bukan RDS (OLTP).',
            tips: [
              'Redshift = OLAP/analytics (columnar, aggregate berjuta baris). RDS/Aurora = OLTP (transaksi, single-row read/write). Jangan keliru — soalan "transactional app" JANGAN jawab Redshift.',
              'Columnar storage + compression = sebab Redshift laju untuk SUM/AVG/GROUP BY atas data besar, tapi teruk untuk insert/update satu-satu baris.',
              'Redshift Spectrum vs Athena: dua-dua query S3. Spectrum = kau dah ada Redshift cluster, nak extend query ke S3. Athena = standalone, no cluster, ad-hoc.',
              'RA3 nodes = compute & managed storage berasingan (scale independent). DC2 = compute+storage bercantum (legacy, dataset kecil).',
              'Concurrency Scaling: auto add transient cluster untuk handle spike concurrent queries — per-second billing, ada free credits harian.',
              'Multi-AZ: Redshift RA3 boleh Multi-AZ untuk HA. Cross-region snapshot untuk DR.',
              'Zero-ETL integration: Aurora/RDS → Redshift tanpa bina ETL pipeline sendiri (near-real-time analytics atas data transaksi).',
            ],
            docs: [
              { label: 'Redshift Spectrum', url: 'https://docs.aws.amazon.com/redshift/latest/dg/c-using-spectrum.html' },
              { label: 'Concurrency Scaling', url: 'https://docs.aws.amazon.com/redshift/latest/dg/concurrency-scaling.html' },
            ],
            keywords: ['data warehouse', 'OLAP', 'columnar', 'MPP', 'RA3', 'managed storage', 'RMS', 'Redshift Spectrum', 'Redshift Serverless', 'concurrency scaling', 'zero-ETL', 'cluster', 'leader node', 'compute node', 'node slices', 'distribution key', 'DISTKEY', 'sort key', 'SORTKEY', 'zone maps', 'petabyte', 'BI analytics'],
          },
          {
            shortName: 'QuickSight',
            fullName: 'Amazon QuickSight',
            ingat: '"BI dashboard AWS — kau drag-drop, dia visualize"',
            gunaUntuk: 'Business intelligence dashboards, data visualization, ML-powered analytics',
            fungsi: 'Serverless BI service. Connect directly to S3, RDS, Redshift, Athena, or other sources. Build dashboards and visualizations. ML Insights feature includes anomaly detection, forecasting (seasonality, trends), and auto-narratives — no separate ML infrastructure needed.',
            scenario: '"Executive dashboards dari IoT data dalam S3 dengan forecasting, no data warehouse" → QuickSight + S3 direct. QuickSight bukan untuk ad-hoc SQL (→ Athena), bukan untuk ETL (→ Glue). Keywords: dashboard, forecast, trend, BI, visualization.',
            tips: [
              'QuickSight connects directly to S3 — no need to load into Redshift first for dashboard use cases',
              'ML Insights = built-in forecasting dan anomaly detection — "usage trends + forecasting" → QuickSight ML Insights',
              'SPICE = QuickSight in-memory engine untuk fast queries on imported data',
              'Exam trap: "dashboards + forecasting, minimal ops" → QuickSight (not Redshift + custom ML)',
            ],
            keywords: ['QuickSight', 'BI', 'dashboard', 'forecasting', 'ML Insights', 'visualization', 'S3 direct', 'SPICE', 'IoT analytics'],
          },
          {
            shortName: 'Athena',
            fullName: 'Amazon Athena',
            ingat: '"SQL terus pada S3 — serverless, bayar per TB scan"',
            gunaUntuk: 'Ad-hoc SQL analysis of data in S3 without loading to a database',
            fungsi: 'Serverless interactive query service. Point ke S3, tulis SQL, dapat results. Bayar per TB data yang di-scan. Sokong CSV, JSON, Parquet, ORC. Pair dengan Glue Data Catalog sebagai metadata store.',
            diagram: {
              label: 'Serverless analytics pattern (100% serverless, no cluster)',
              steps: [
                { nodes: [{ label: 'S3', sub: 'raw data lake', tone: 'c4' }] },
                { nodes: [{ label: 'Glue Crawler', sub: '+ Data Catalog (schema)', tone: 'c3' }] },
                { nodes: [{ label: 'Athena', sub: 'SQL, pay per scan', tone: 'c1' }] },
                { nodes: [{ label: 'QuickSight', sub: 'dashboard / BI', tone: 'c2' }] },
              ],
              caption: 'S3 simpan data → Glue Crawler discover schema isi Data Catalog → Athena query guna SQL → QuickSight visualize. Tiada server/cluster untuk urus. Ini "serverless analytics" classic — kalau soalan kata "no infrastructure / serverless / query S3 directly", ini jawapannya (bukan Redshift/EMR).',
            },
            compare: [
              {
                label: 'Athena — cara kurangkan kos (kos = data di-scan)',
                headers: ['Teknik', 'Kenapa jimat', 'Kesan'],
                rows: [
                  ['Columnar format (Parquet/ORC)', 'Athena scan kolum yang perlu sahaja, bukan seluruh baris', '🟢 Scan ↓ banyak + laju'],
                  ['Partition data (by date/region)', 'Athena langkau partition yang tak kena filter WHERE', '🟢 Scan ↓ ikut partition pruning'],
                  ['Compress (gzip/Snappy)', 'Saiz fail kecil = byte di-scan kurang', '🟢 Kos ↓'],
                  ['SELECT kolum tertentu (bukan SELECT *)', 'Kurangkan kolum dibaca', '🟢 Scan ↓'],
                ],
                takeaway: 'Kos Athena = jumlah data DI-SCAN, bukan bilangan query. Parquet/ORC + partition + compress = combo standard untuk turunkan kos & masa. Soalan "kurangkan kos Athena" → convert ke columnar + partition.',
              },
              {
                label: 'Athena vs Redshift Spectrum vs Redshift',
                headers: ['Aspect', 'Athena', 'Redshift Spectrum', 'Redshift'],
                rows: [
                  ['Perlu cluster?', '🟢 Tidak (serverless)', '🔴 Ya (Redshift cluster)', '🔴 Ya'],
                  ['Data di mana', 'S3', 'S3 (extend dari cluster)', 'Loaded dalam cluster'],
                  ['Guna bila', 'Ad-hoc, jarang, no setup', 'Dah ada Redshift, nak query S3 sekali', 'Recurring complex analytics'],
                  ['Kos model', 'Per TB di-scan', 'Per TB di-scan (+ cluster)', 'Per node/jam atau RPU'],
                ],
                takeaway: 'Ad-hoc tanpa cluster → Athena. Dah ada Redshift, nak gabung query warehouse + S3 → Spectrum. Recurring/complex dengan prestasi konsisten → Redshift loaded. Dua-dua Athena & Spectrum query S3, beza pada "ada cluster ke tak".',
              },
            ],
            scenario: '"Analyse CloudTrail logs atau ALB access logs dalam S3 guna SQL" → Athena. "Ad-hoc analysis tanpa setup database" → Athena. "Kurangkan kos query S3" → convert ke Parquet + partition. Bukan Redshift (yang untuk structured, recurring analytics dengan dedicated cluster).',
            tips: [
              'Kurangkan kos Athena: data di-scan = duit. Guna columnar format (Parquet/ORC) + PARTITION data (by date/region) + compress → scan kurang, murah + laju',
              'Serverless analytics pipeline: S3 (store) → Glue (catalog/ETL) → Athena (query) → QuickSight (visualize). Hafal urutan ni',
              'Athena = ad-hoc/interactive SQL pada S3. Redshift = data warehouse dedicated untuk recurring/complex analytics. Redshift Spectrum = Redshift query terus S3',
            ],
            keywords: ['serverless SQL', 'S3 queries', 'pay per scan', 'Parquet', 'ORC', 'Glue Catalog', 'log analysis', 'ad-hoc', 'partition', 'columnar', 'QuickSight', 'serverless analytics pattern'],
          },
          {
            shortName: 'Glue',
            fullName: 'AWS Glue',
            ingat: '"Crawler endus schema → Catalog simpan → ETL Job transform. Glue = gam yang sambung data lake."',
            gunaUntuk: 'ETL jobs, data catalog for data lake, prepare and transform data for analytics',
            fungsi: 'Glue = serverless ETL + metadata layer untuk data lake. Glue Data Catalog = kedai metadata pusat (table/column) untuk semua data assets (S3, RDS, Redshift) — Athena, EMR, Redshift Spectrum semua baca katalog yang sama. Glue Crawler = auto-endus (discover) schema dari sumber dan ISI Data Catalog. Glue ETL Job = serverless Spark job untuk transform data (cth CSV → Parquet). Bayar per DPU-hour, tiada cluster untuk diurus.',
            detailsLabel: 'Glue — komponen utama',
            storageDetails: 'Data Catalog → kedai metadata pusat (database, table, column, partition). Satu sumber kebenaran untuk Athena, EMR, Redshift Spectrum, Lake Formation\nCrawler → connect ke sumber (S3/JDBC/DynamoDB), infer schema, ISI Data Catalog. Boleh jadual berkala\nClassifier → kenal pasti format data (CSV/JSON/Parquet/custom grok); Crawler panggil Classifier untuk tentukan schema\nETL Job → serverless Spark (atau Python shell) yang transform data; auto-generate kod, bayar per DPU-hour\nTrigger / Workflow → orchestration: jalankan job ikut jadual, event, atau on-demand (rantai crawler → job)\nDataBrew → visual data prep, no-code (250+ transformation) untuk pembersihan data\nGlue Studio → antara muka visual drag-drop untuk bina ETL pipeline',
            mermaid: [
              {
                label: 'Anatomy komponen Glue (crawler → catalog → job)',
                source: `flowchart TD
  SRC["📁 Sumber data<br/>S3 · RDS · DynamoDB · JDBC"] --> CR["Glue Crawler<br/>connect + infer schema"]
  CR -->|"panggil"| CLS["Classifier<br/>kenal format<br/>(CSV/JSON/Parquet/custom)"]
  CLS --> CR
  CR -->|"ISI metadata"| DC["🗂️ Glue Data Catalog<br/>table · column · partition"]
  DC --> JOB["Glue ETL Job<br/>Spark serverless<br/>transform (CSV→Parquet)"]
  JOB --> TGT["🎯 Target<br/>S3 (Parquet) · Redshift"]
  DC -.->|"baca katalog sama"| Q["Athena · EMR ·<br/>Redshift Spectrum"]`,
                caption: 'Aliran: Crawler connect ke sumber → panggil Classifier untuk kenal format → ISI Data Catalog dengan schema. Lepas tu ETL Job (Spark) baca katalog, transform data, tulis ke target. Athena/EMR/Redshift Spectrum semua kongsi Data Catalog yang sama. INGAT exam: komponen yang ISI Data Catalog = Crawler (bukan Job, bukan Table).',
              },
              {
                label: 'Analogi Jus Mangga — apa itu ETL (Extract · Transform · Load)',
                source: `flowchart LR
  E["🥭 EXTRACT<br/>petik mangga dari pokok<br/>(ambil raw data:<br/>S3 · RDS · DynamoDB)"] --> T["🔪 TRANSFORM<br/>kupas kulit, buang biji, blend<br/>(bersih + tukar format:<br/>CSV → Parquet, buang null)"]
  T --> L["🥤 LOAD<br/>tuang jus dalam botol siap jual<br/>(simpan ke target:<br/>S3 Parquet · Redshift · Athena)"]
  L --> USE["😋 Sedia diminum<br/>analyst query &amp; buat dashboard"]`,
                caption: 'ETL = Extract → Transform → Load, macam buat jus mangga. EXTRACT = petik mangga mentah dari pokok (tarik raw data dari sumber). TRANSFORM = kupas, buang biji, blend (bersihkan + tukar format, cth CSV→Parquet) — ini bahagian paling berat & guna Spark. LOAD = tuang jus siap dalam botol (tulis data bersih ke target supaya boleh terus "minum"/query). Glue buat ketiga-tiga langkah ni secara serverless — kau tak payah beli & jaga "blender" (cluster) sendiri.',
              },
            ],
            compare: [
              {
                label: 'Glue — komponen mana buat apa',
                headers: ['Komponen', 'Peranan', 'Trigger exam'],
                rows: [
                  ['Data Catalog', 'Kedai metadata pusat (table/column/partition)', '"central metadata store", "schema registry untuk data lake"'],
                  ['Crawler', 'Endus schema dari sumber & ISI Data Catalog', '"determine schema & populate Data Catalog" → Crawler'],
                  ['Classifier', 'Kenal pasti format data; dipanggil oleh Crawler', '"recognize custom/log format" → custom Classifier'],
                  ['ETL Job', 'Serverless Spark transform (CSV→Parquet)', '"transform/convert data tanpa urus server" → Glue Job'],
                  ['Trigger / Workflow', 'Orchestrate job ikut jadual/event', '"automate & schedule ETL pipeline"'],
                  ['DataBrew', 'Visual no-code data cleaning', '"clean/prep data tanpa tulis kod"'],
                ],
                takeaway: 'Crawler ISI katalog · Classifier kenal format · Job transform · Catalog simpan metadata. Soalan "apa populate Data Catalog?" → Crawler. "Convert CSV ke Parquet serverless?" → Glue ETL Job.',
              },
              {
                label: 'Glue vs EMR vs Athena — bila guna yang mana (ETL/query)',
                headers: ['Aspect', 'Glue', 'EMR', 'Athena'],
                rows: [
                  ['Fungsi utama', 'Serverless ETL + Catalog', 'Cluster Hadoop/Spark', 'Serverless SQL on S3'],
                  ['Urus server?', '🟢 Tidak (serverless)', '🔴 Ya (kau urus cluster)', '🟢 Tidak (serverless)'],
                  ['Guna untuk', 'Transform & catalog data', 'Custom big-data, ML, full control', 'Ad-hoc query data S3'],
                  ['Kos', 'Per DPU-hour', 'Per instance (Spot jimat)', 'Per TB di-scan'],
                  ['Trigger soalan', '"ETL serverless + Data Catalog"', '"Hadoop/Spark cluster, full control"', '"SQL ad-hoc, no setup"'],
                ],
                takeaway: 'ETL ringkas + katalog tanpa cluster → Glue. Custom Spark/Hadoop dengan kawalan penuh → EMR. Query SQL ad-hoc atas S3 → Athena. Ketiga-tiga boleh kongsi Glue Data Catalog.',
              },
            ],
            scenario: '"Transform raw CSV dalam S3 ke Parquet format untuk Athena" → Glue ETL job. "Auto-catalog all data sources for data lake" → Glue Crawler + Data Catalog. "Determine schema dari DynamoDB & populate Data Catalog" → Crawler. "Clean & prep data tanpa tulis kod" → DataBrew. Keywords: ETL, data lake, data catalog, transform, Spark, serverless.',
            tips: [
              'Glue Crawler specifically = the component that connects to a data source, infers schema, and POPULATES the Glue Data Catalog with table metadata',
              'Exam pattern: "determine schema from DynamoDB/S3 and populate Glue Data Catalog" → Crawler (not a Table, not a Classifier)',
              'Glue Classifier helps the Crawler recognize custom data formats — but Crawler is the orchestrator that calls Classifiers',
              'Glue Data Catalog = metadata sahaja (apa data wujud). Lake Formation = kawalan akses (siapa boleh akses) atas katalog yang sama',
              'Serverless analytics pattern: S3 (store) → Glue (crawl + catalog + ETL) → Athena (query) → QuickSight (visualize). Hafal urutan ni',
              'Glue = serverless (no cluster). Kalau soalan tekankan "full control" / "Hadoop/Spark cluster" → itu EMR, bukan Glue',
            ],
            docs: [
              { label: 'AWS Glue components', url: 'https://docs.aws.amazon.com/glue/latest/dg/components-key-concepts.html' },
              { label: 'Glue Crawlers', url: 'https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html' },
            ],
            keywords: ['ETL', 'data catalog', 'Spark', 'serverless', 'crawler', 'classifier', 'ETL job', 'DataBrew', 'Glue Studio', 'workflow', 'data lake', 'transform', 'Parquet', 'schema discovery', 'DynamoDB', 'schema inference', 'DPU'],
          },
          {
            shortName: 'Lake Formation',
            fullName: 'AWS Lake Formation',
            ingat: '"Lapisan keselamatan atas S3/Glue — row, column, cell level access"',
            gunaUntuk: 'Fine-grained access control on data lake: row-level, column-level, cell-level security',
            fungsi: 'Lake Formation duduk atas S3 + Glue Data Catalog dan enforce fine-grained permissions. Glue Data Catalog je hanya ada table/column metadata — Lake Formation enforce ACTUAL access control hingga row, column, dan cell level.',
            tips: [
              'Glue Data Catalog = metadata store (what data exists). Lake Formation = access control (who can access what data)',
              'Lake Formation supports row-level, column-level, dan cell-level security — Glue je tak boleh buat ni',
              'Use case: data lake dengan sensitive data, analysts boleh access hanya specific columns/rows',
              'Exam: "fine-grained access control" atau "row/column/cell-level security" untuk data lake → Lake Formation',
              'Lake Formation juga support data cleansing, data catalog, secure data sharing — one-stop data lake governance',
            ],
            keywords: ['Lake Formation', 'row-level security', 'column-level', 'cell-level', 'fine-grained access', 'data lake', 'Glue Data Catalog'],
          },
          {
            shortName: 'EMR',
            fullName: 'Amazon EMR',
            ingat: '"EMR = Energetik Mandor Ramai-pekerja: Elastic cluster, Mandor (Master node), Ramai pekerja (Core/Task). Hadoop/Spark, kau urus cluster (BUKAN serverless)."',
            gunaUntuk: 'Process petabyte-scale data with Spark, Hadoop, Hive, Presto — full control',
            fungsi: 'Managed cluster platform untuk big data frameworks (Spark, Hadoop, Hive, Presto, HBase). Kau choose cluster size, instance types, frameworks. Cluster ada 3 jenis node: Master (urus cluster), Core (run task + simpan HDFS), Task (run task sahaja, no HDFS). EMRFS benarkan EMR guna S3 sebagai storage layer → decouple compute dari storage. Lebih control dari Glue — untuk complex/custom big-data jobs.',
            diagram: {
              label: 'EMR cluster — node roles',
              steps: [
                { nodes: [{ label: 'Master Node', sub: 'urus + coordinate', tone: 'c5' }] },
                { nodes: [
                  { label: 'Core Node', sub: 'task + HDFS data', tone: 'c1' },
                  { label: 'Core Node', sub: 'task + HDFS data', tone: 'c1' },
                ] },
                { nodes: [
                  { label: 'Task Node (Spot)', sub: 'compute only, no data', tone: 'c3' },
                  { label: 'Task Node (Spot)', sub: 'compute only, no data', tone: 'c3' },
                ] },
                { nodes: [{ label: 'S3 via EMRFS', sub: 'durable storage layer', tone: 'c4' }] },
              ],
              caption: 'Master = otak cluster. Core nodes simpan HDFS data + run tasks → JANGAN letak atas Spot (hilang node = hilang data). Task nodes compute sahaja → selamat & jimat atas Spot. EMRFS guna S3 sebagai storage supaya cluster boleh transient (mati lepas job, data kekal di S3).',
            },
            mermaid: {
              label: 'Analogi Kilang Kerupuk Lekor — EMR cluster nodes',
              source: `flowchart TD
  JOB["🐟 10 tan ikan nak proses<br/>(big data — 1 EC2 tak larat)"] --> CLUSTER["🏭 Kilang EMR (Cluster)<br/>ramai pekerja, satu pasukan"]
  CLUSTER --> M["👷 Mandor = Master Node<br/>pegang klipbod, agih kerja,<br/>tak potong ikan sendiri"]
  M -->|"agih tugas"| C["🔪 Pekerja Tetap = Core Node<br/>potong ikan + ada meja sendiri<br/>(proses + simpan HDFS)"]
  M -->|"upah bila sibuk"| T["🧑‍🍳 Pekerja Sambilan = Task Node<br/>tolong potong je, pinjam meja<br/>(compute only) → halau bila siap (Spot)"]
  C --> S3["🪣 Gudang S3 (EMRFS)<br/>simpan hasil walau kilang tutup"]
  T --> S3`,
              caption: 'EMR = kilang besar proses ikan pukal (big data) sebab satu blender rumah (1 EC2) tak larat. Mandor (Master) agih kerja, tak potong sendiri. Pekerja Tetap (Core) potong + ada meja simpan ikan (HDFS) → jangan Spot, hilang meja = hilang ikan. Pekerja Sambilan (Task) tolong potong je, pinjam meja → selamat & jimat atas Spot, halau bila siap. Gudang S3 (EMRFS) simpan hasil walau kilang dah tutup (transient cluster).',
            },
            compare: [
              {
                label: 'EMR node types — apa boleh Spot, apa tak',
                headers: ['Node', 'Peranan', 'Simpan data?', 'Spot ok?'],
                rows: [
                  ['Master', 'Urus & coordinate cluster', 'Tidak', '🔴 Tak (mati = cluster mati)'],
                  ['Core', 'Run tasks + simpan HDFS', '✅ Ya (HDFS)', '🟡 Berisiko (hilang data)'],
                  ['Task', 'Run tasks sahaja', 'Tidak', '🟢 Ya — jimat selamat'],
                ],
                takeaway: 'Letak Task nodes atas Spot untuk jimat tanpa risiko data. Core nodes pegang HDFS — guna On-Demand/RI. Master tak boleh Spot langsung.',
              },
              {
                label: 'EMR vs Glue — bila guna yang mana',
                headers: ['Aspect', 'EMR', 'Glue'],
                rows: [
                  ['Model', 'Managed cluster (kau urus)', 'Serverless ETL (no cluster)'],
                  ['Control', '🟢 Penuh — pilih framework, tune', 'Terhad (Spark abstracted)'],
                  ['Framework', 'Spark, Hadoop, Hive, Presto, HBase', 'Spark (managed)'],
                  ['Best bila', 'Custom/complex big-data, ML, kawalan penuh', 'ETL ringkas + Data Catalog'],
                  ['Kos', 'Per instance (Spot jimat)', 'Per DPU-hour, no idle cost'],
                ],
                takeaway: 'Nak kawalan penuh framework / custom Spark / ML besar → EMR. Nak ETL serverless tanpa urus cluster → Glue. Soalan sebut "Hadoop/Spark cluster" atau "full control" → EMR.',
              },
              {
                label: 'Glue vs EMR Serverless — dua-dua serverless, beza di mana?',
                headers: ['Aspect', 'AWS Glue', 'EMR Serverless'],
                rows: [
                  ['Tujuan utama', 'ETL + Data Catalog (data integration)', 'Run Spark/Hive jobs serverless (analytics engine)'],
                  ['Framework', 'Spark (abstracted, Glue uruskan)', 'Pilih sendiri: Spark atau Hive, kawal versi'],
                  ['Kawalan Spark', 'Terhad — config diabstrak', '🟢 Lebih — tune Spark config, sizing'],
                  ['Catalog & Crawler', '🟢 Built-in (Crawler, DataBrew, Studio)', 'Tiada — guna Glue Data Catalog bila perlu'],
                  ['Best bila', 'ETL pipeline, catalog data lake, no-code prep', 'Migrate Spark/Hive job sedia ada, tak nak urus cluster'],
                  ['Kos', 'Per DPU-hour', 'Per vCPU + memori (per saat, auto-scale)'],
                ],
                takeaway: 'Dua-dua serverless (tiada cluster). Bezanya: Glue = alat integrasi data lengkap (Crawler + Catalog + ETL) untuk bina pipeline. EMR Serverless = enjin Spark/Hive je dengan lebih kawalan — sesuai kalau kau dah ada Spark job dan cuma nak run tanpa jaga cluster. Soalan "migrate existing Spark job, no cluster management" → EMR Serverless. "ETL + auto data catalog" → Glue.',
              },
            ],
            scenario: '"Process petabytes of log data using custom Spark jobs" → EMR. "Migrate on-prem Hadoop/Spark cluster ke AWS" → EMR. "Jimatkan kos batch processing yang fault-tolerant" → Task nodes atas Spot. Glue = serverless ETL (simpler, less control). EMR = full cluster (more control). Keywords: Hadoop, Spark, big data cluster, full control.',
            tips: [
              'Tiga node: Master (urus), Core (task + HDFS data), Task (task sahaja). Core pegang data → bahaya atas Spot; Task tak pegang data → selamat & jimat atas Spot.',
              'EMRFS = guna S3 sebagai storage layer (bukan HDFS lokal). Ini benarkan TRANSIENT cluster: cluster mati lepas job habis, data kekal di S3 → jimat kos.',
              'Transient cluster = auto-terminate lepas step habis (batch jobs). Long-running cluster = kekal hidup untuk interactive/ad-hoc query.',
              'Exam trigger "managed Hadoop/Spark", "custom big-data framework", atau "full control over cluster" → EMR (bukan Glue, bukan Athena).',
              'EMR Serverless = run Spark/Hive tanpa urus cluster langsung. EMR on EKS = jalankan EMR atas cluster Kubernetes sedia ada.',
              'Instance fleets vs instance groups = dua cara provision capacity; fleets bagi flexibility pilih banyak instance type + Spot strategy.',
            ],
            docs: [
              { label: 'EMR cluster node types', url: 'https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-master-core-task-nodes.html' },
              { label: 'EMRFS', url: 'https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-fs.html' },
            ],
            keywords: ['Hadoop', 'Spark', 'Hive', 'Presto', 'HBase', 'big data', 'cluster', 'petabyte', 'managed', 'Spot instances', 'master node', 'core node', 'task node', 'HDFS', 'EMRFS', 'transient cluster', 'EMR Serverless', 'EMR on EKS'],
          },
          {
            shortName: 'OpenSearch',
            fullName: 'Amazon OpenSearch Service',
            ingat: '"Enjin carian dan log analytics — Elasticsearch dalam AWS"',
            gunaUntuk: 'Full-text search, real-time log/event analytics, dashboard visualisation',
            fungsi: 'Managed OpenSearch (Elasticsearch fork) cluster. Ingestion via Amazon Data Firehose, OpenSearch Ingestion, atau Lambda. Visualise dengan OpenSearch Dashboards (Kibana). Guna untuk search yang perlu relevance ranking, fuzzy matching, atau aggregations real-time. Storage tiers (hot / UltraWarm / cold) untuk imbang kos vs kelajuan.',
            diagram: {
              label: 'Log analytics ingestion pipeline',
              steps: [
                { nodes: [{ label: 'Sources', sub: 'apps, CloudWatch Logs, IoT', tone: 'c4' }] },
                { nodes: [{ label: 'Amazon Data Firehose', sub: 'buffer + deliver, no code', tone: 'c3' }] },
                { nodes: [{ label: 'OpenSearch', sub: 'index + search + aggregate', tone: 'c1' }] },
                { nodes: [{ label: 'OpenSearch Dashboards', sub: 'Kibana visualise', tone: 'c2' }] },
              ],
              caption: 'Pola klasik log/observability: sumber → Firehose hantar ke OpenSearch (no code) → index untuk full-text search + aggregation → Dashboards visualize. Kalau soalan sebut "real-time log analytics + search + dashboard", ini jawapannya.',
            },
            compare: [
              {
                label: 'OpenSearch vs servis "cari/log" yang mengelirukan',
                headers: ['Servis', 'Untuk apa', 'Bila pilih'],
                rows: [
                  ['OpenSearch', 'Full-text search + log analytics + dashboard', 'Search dengan ranking/fuzzy, atau log analytics real-time'],
                  ['CloudWatch Logs Insights', 'Ad-hoc query atas log CloudWatch', 'Cuma nak query log AWS sedia ada, no cluster'],
                  ['Amazon Kendra', 'Enterprise document search (ML, natural language)', 'Soalan natural language atas dokumen/PDF'],
                  ['Athena', 'SQL ad-hoc atas data S3', 'Query log dalam S3 guna SQL, jarang-jarang'],
                  ['DynamoDB', 'Key-value exact lookup', 'Lookup guna primary key — BUKAN full-text search'],
                ],
                takeaway: 'Full-text/fuzzy search + log analytics + dashboard → OpenSearch. Natural-language document search → Kendra. Query log CloudWatch cepat → Logs Insights. Exact key lookup → DynamoDB (bukan OpenSearch).',
              },
            ],
            scenario: '"E-commerce product search dengan fuzzy matching dan relevance ranking" → OpenSearch. "Ingest dan search application logs real-time dengan visualisation" → OpenSearch + Firehose + Dashboards. "Natural-language search atas dokumen korporat" → Kendra (bukan OpenSearch). DynamoDB = exact key lookups. Keywords: search engine, log analytics, Elasticsearch.',
            tips: [
              'Ingestion: Amazon Data Firehose (managed, no code), OpenSearch Ingestion (Data Prepper), atau Lambda. Firehose = jawapan paling kerap untuk "stream logs ke OpenSearch tanpa code".',
              'Storage tiers untuk jimat kos: Hot (laju, mahal) → UltraWarm (S3-backed, baca lambat sikit) → Cold (arkib, paling murah). Soalan "kekal log lama untuk kos rendah" → UltraWarm/Cold.',
              'Dedicated master nodes (3 untuk quorum) = stabilkan cluster besar; berbeza dari data nodes yang simpan/index data.',
              'Multi-AZ with standby untuk HA production. OpenSearch Serverless = auto-scale tanpa urus cluster.',
              'Exam confusion: OpenSearch = full-text/fuzzy SEARCH + log analytics. Kendra = ML natural-language document search. Jangan keliru dua ni.',
              'OpenSearch Dashboards = fork Kibana — soalan lama mungkin sebut "Kibana" untuk visualisation.',
            ],
            docs: [
              { label: 'OpenSearch UltraWarm storage', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ultrawarm.html' },
            ],
            keywords: ['search engine', 'log analytics', 'Elasticsearch compatible', 'Kibana', 'OpenSearch Dashboards', 'real-time analytics', 'full-text search', 'fuzzy', 'UltraWarm', 'cold storage', 'dedicated master', 'Firehose ingestion', 'relevance ranking'],
          },
          {
            shortName: 'MSK',
            fullName: 'Amazon MSK',
            ingat: '"Kafka dalam AWS — managed, tak payah urus brokers"',
            gunaUntuk: 'Real-time event streaming dengan Kafka API — migrate or build Kafka workloads',
            fungsi: 'Fully managed Apache Kafka service. AWS manage brokers, ZooKeeper, patching. Kau guna Kafka Producer/Consumer API yang sama. Cross-AZ untuk HA.',
            scenario: '"Migrate on-premises Apache Kafka cluster ke AWS" → Amazon MSK. Atau streaming pipeline yang perlu Kafka API compatibility. Kinesis = AWS-native proprietary. MSK = Kafka-compatible (for migration or Kafka expertise teams).',
            tips: [
              'MSK is managed BUT does NOT provide SSH/direct access to Kafka brokers — AWS manages the underlying infrastructure.',
              'Lambda + MSK integration REQUIRES configuring an Event Source Mapping (ESM) — Lambda does not automatically pick up MSK events.',
              'MSK Auto Scaling: automatically expands broker storage based on utilization threshold. MSK Serverless: auto-scales compute AND storage, no broker capacity management.',
              'MSK is NOT multi-cloud — AWS-only service. Does NOT span other cloud providers.',
              'Kinesis vs MSK: Kinesis = AWS-native, simpler, no Kafka expertise needed. MSK = Kafka API compatible, for teams with Kafka expertise or migrating existing Kafka workloads.',
            ],
            keywords: ['Kafka', 'managed', 'streaming', 'event streaming', 'migration', 'Kafka API', 'real-time pipeline', 'brokers', 'no SSH', 'event source mapping', 'MSK Serverless', 'auto scaling storage'],
          },
          {
            shortName: 'Kendra',
            fullName: 'Amazon Kendra',
            ingat: '"Google-like ML search for your enterprise documents"',
            gunaUntuk: 'Intelligent enterprise search across diverse document repositories',
            fungsi: 'ML-powered enterprise search. Indexes PDFs, Word docs, HTML, emails, FAQs across S3, SharePoint, Confluence, databases. Understands natural language queries to return precise answers, not just keyword matches.',
            scenario: '"Enterprise wants to search across internal docs, FAQs, emails, PDFs with natural language queries" → Kendra. "E-commerce product search with spell-check/synonyms" → OpenSearch (keyword search engine). Kendra = understanding context + intent. OpenSearch = scalable keyword/full-text search.',
            tips: [
              'Kendra vs OpenSearch: Kendra = ML semantic search for enterprise "find the answer" use cases. OpenSearch = scalable keyword full-text search for high-volume queries (e-commerce, log analytics).',
              'Kendra natively handles FAQs — can provide direct question-answer responses from FAQ documents.',
              'Kendra indexes unstructured content: PDFs, Word, PowerPoint, HTML, emails, wikis.',
            ],
            keywords: ['Kendra', 'enterprise search', 'ML search', 'semantic search', 'natural language query', 'FAQs', 'unstructured documents', 'intelligent search'],
          },
          {
            shortName: 'Data Exchange',
            fullName: 'AWS Data Exchange',
            ingat: '"AWS marketplace untuk beli/subscribe third-party data"',
            gunaUntuk: 'Subscribe to and access third-party datasets for analytics',
            fungsi: 'Marketplace for external data products. Providers publish datasets (market data, financial data, regulatory filings, weather, etc.). Subscribers browse, subscribe, data delivered directly to S3. Handles licensing and subscription management automatically.',
            scenario: '"Company wants to subscribe to market data, economic indicators, and regulatory filings from third-party providers and deliver them to their AWS accounts for analytics" → AWS Data Exchange. Kinesis = your own real-time data. Data Exchange = external third-party data products.',
            keywords: ['Data Exchange', 'third-party data', 'data marketplace', 'data subscription', 'market data', 'financial data', 'data products', 'S3 delivery', 'licensing'],
          },
          {
            shortName: 'AWS AI/ML Services',
            fullName: 'AWS AI Services — Polly, Rekognition, Lex, Comprehend, Textract, Transcribe, Translate',
            ingat: '"Polly = cakap. Transcribe = dengar. Lex = faham + balas. Rekognition = nampak. Comprehend = baca. Textract = scan dokumen. Translate = tukar bahasa"',
            gunaUntuk: 'AI/ML services untuk audio, video, text, image analysis without training models',
            fungsi: 'AWS menyediakan pelbagai AI services ready-to-use: speech, vision, NLP, document processing.',
            storageDetails: 'Amazon Polly → Text-to-Speech (TTS): convert text jadi audio (natural voice)\nAmazon Transcribe → Speech-to-Text (STT): convert audio/video jadi text\nAmazon Lex → Conversational chatbot: NLU + ASR, maintains context, integrates Lambda (powers Alexa)\nAmazon Rekognition → Image/Video analysis: face detection, object/scene detection, labels\nAmazon Comprehend → NLP: sentiment analysis, entities, key phrases, language detection\nAmazon Textract → Document OCR: extract text, forms, tables from PDFs/images\nAmazon Translate → Neural machine translation: convert text between languages, real-time + batch\nKinesis Video Streams → Ingest, store, process video/audio streams (for Rekognition real-time analysis)',
            detailsLabel: 'AI Services Comparison',
            compare: {
              label: 'Match the AI service to the use case (exam guna keyword input→output)',
              headers: ['Service', 'Input → Output', 'Keyword soalan'],
              rows: [
                ['Polly', 'Text → Speech (audio)', '"read aloud", "voice", "audiobook"'],
                ['Transcribe', 'Speech → Text', '"transcribe", "caption", "meeting notes"'],
                ['Translate', 'Text → Text (bahasa lain)', '"translate", "multilingual", "localize"'],
                ['Comprehend', 'Text → Insight (NLP)', '"sentiment", "entities", "key phrases", "topic"'],
                ['Lex', 'Text/Speech → Dialog (chatbot)', '"chatbot", "conversation", "intent", "Alexa"'],
                ['Rekognition', 'Image/Video → Labels/Faces', '"face detection", "object", "moderation", "CCTV"'],
                ['Textract', 'Document → Structured text', '"OCR", "scanned PDF", "forms", "tables", "invoice"'],
                ['SageMaker', 'Data → Custom model', '"train your own", "custom ML", "hyperparameter"'],
              ],
              takeaway: 'Pre-built API (Polly/Transcribe/Translate/Comprehend/Lex/Rekognition/Textract) = no training, call API terus. SageMaker = bina/latih model sendiri. Pipeline klasik: Transcribe → Translate → Comprehend → Polly. CCTV real-time = Rekognition + Kinesis VIDEO Streams.',
            },
            tips: [
              'Polly = text → speech. Transcribe = speech → text. INGAT: P=produce speech, T=transcribe speech',
              'Lex = chatbot dengan context awareness. Kalau soalan sebut "chatbot", "natural language", "conversation turns" → Lex',
              'Rekognition + Kinesis VIDEO Streams = real-time video analysis (e.g. CCTV face mask detection, surveillance cameras)',
              'Rekognition + Kinesis DATA Streams = SALAH untuk video. Data Streams untuk text/structured records',
              'Textract vs Comprehend: Textract = extract text FROM documents (OCR, forms, tables). Comprehend = analyze/understand text content (sentiment, entities)',
              'Exam shortcut: "read quiz questions aloud" → Polly. "CCTV face detection" → Rekognition + Kinesis Video Streams. "Chatbot" → Lex',
              'Polly StartSpeechSynthesisTask = async TTS: starts a long synthesis job and writes audio directly to S3 (use for large text files; SynthesizeSpeech is synchronous/streaming only)',
              '"scanned PDFs → audiobook" = Textract (extract text) + Polly (text → audio)',
              'Kinesis Video Streams = INGESTION layer (secure ingest from cameras/devices). Rekognition Video = ANALYSIS layer. You need both for a real-time surveillance pipeline.',
              'Comprehend = NLP text ANALYSIS (sentiment, entities, key phrases, topic modeling). Use for support tickets, social media, reviews. NOT for document OCR (use Textract) and NOT for chatbots (use Lex).',
              'Textract = EXTRACT structured data from scanned documents. Key-value pairs from forms, data from tables, dates and amounts from invoices/contracts. Goes beyond basic OCR.',
              'Lex = CONVERSATIONAL chatbot with multi-turn dialogue, intent recognition, slot filling. Powers Amazon Alexa. Manages conversation state.',
              'Enterprise search across PDFs/Word/email with natural language? → Amazon Kendra (see Kendra card). Product search with spell-check/synonyms? → OpenSearch.',
              'Translate = neural machine translation (text → text, different language). NOT speech (combine with Transcribe/Polly for audio) dan NOT sentiment analysis (use Comprehend)',
              '"Multilingual chatbot/support ticket pipeline": Transcribe (speech→text) → Translate (translate text) → Comprehend (analyze sentiment) → Polly (text→speech in target language)',
            ],
            keywords: ['Polly', 'Transcribe', 'Lex', 'Rekognition', 'Comprehend', 'Textract', 'Translate', 'Kinesis Video Streams', 'text-to-speech', 'speech-to-text', 'chatbot', 'image analysis', 'StartSpeechSynthesisTask', 'audiobook', 'OCR', 'NLP', 'sentiment analysis', 'entity recognition', 'document extraction', 'machine translation'],
          },
          {
            shortName: 'SageMaker',
            fullName: 'Amazon SageMaker',
            ingat: '"Custom ML end-to-end — train, tune, deploy your own models"',
            gunaUntuk: 'Build, train, and deploy custom ML models with full control',
            fungsi: 'End-to-end managed ML platform: data prep (Data Wrangler, Feature Store), training (built-in algorithms, custom code in any framework), AutoML (Autopilot), HPO, model registry, and deployment (real-time, serverless, batch, async endpoints). Supports CI/CD via SageMaker Pipelines.',
            scenario: '"Build a churn prediction model from historical data using custom Python code, tune hyperparameters, and deploy to a real-time endpoint" → SageMaker. Pre-built AI services (Polly, Lex, Rekognition, Comprehend) = no training needed, call the API. SageMaker = you control the model.',
            tips: [
              'SageMaker vs pre-built AI services: SageMaker = custom model training (your data, your algorithm). Rekognition/Polly/Lex/Comprehend = pre-trained, call API directly',
              'SageMaker Autopilot = AutoML: automatically tries different algorithms and hyperparameters, picks the best model',
              '"Train a custom model on company data" → SageMaker. "Detect faces in images" → Rekognition (no training needed)',
            ],
            keywords: ['SageMaker', 'custom ML', 'training', 'AutoML', 'Autopilot', 'hyperparameter tuning', 'model deployment', 'MLOps', 'Feature Store', 'Pipelines'],
          },
        ],
      },
    ],
  },
  {
    id: 'domain4',
    badge: 'DOMAIN 4 · 20% OF EXAM',
    title: 'Design Cost-Optimized Architectures',
    subtitle: 'Pricing Models · Storage · Networking · Database',
    variant: 'd4',
    sections: [
      {
        id: 'd4-pricing',
        icon: '💰',
        title: 'EC2 Pricing Models',
        category: 'pricing',
        services: [
          {
            shortName: 'On-Demand',
            fullName: 'EC2 On-Demand Instances',
            ingat: '"Bayar ikut jam, bila-bila boleh stop"',
            gunaUntuk: 'Workload tak menentu, short-term, testing',
            fungsi: 'Menyediakan kapasiti compute tanpa komitmen jangka panjang pada kadar tetap per jam',
            scenario: 'Startup baru launch app, tak tahu lagi berapa traffic. Atau developer nak test environment kejap je — tak nak commit lama.',
            compare: {
              label: 'EC2 purchasing options — pick per workload',
              headers: ['Option', 'Discount', 'Commit', 'Best for'],
              rows: [
                ['On-Demand', 'None (most $)', 'None', 'Spiky / unknown / short-term'],
                ['Reserved Instances', 'Up to 72%', '1 or 3 yr (instance type)', 'Steady 24/7 predictable workload'],
                ['Savings Plans', 'Up to 66%', '1 or 3 yr ($/hr spend)', 'Steady but want flexibility (any type/region)'],
                ['Spot', 'Up to 90%', 'None (interruptible)', 'Fault-tolerant batch / can resume'],
              ],
              takeaway: '"Steady 24/7" → RI/Savings Plan. "Flexible across instance types" → Savings Plan. "Interruptible batch" → Spot. "Unpredictable / short-term" → On-Demand. NEVER Spot for critical stateful prod.',
            },
            keywords: ['no commitment', 'flexible', 'short-term', 'highest cost'],
          },
          {
            shortName: 'Reserved Instances',
            fullName: 'EC2 Reserved Instances (RI)',
            ingat: '"Commit 1-3 thn → diskaun sampai 72%. Standard = murah-tegar, Convertible = fleksibel-kurang"',
            gunaUntuk: 'Workload steady predictable 24/7 untuk 1-3 tahun',
            fungsi: 'Komitmen 1 atau 3 tahun pada konfigurasi instance tertentu → diskaun sampai 72% vs On-Demand. Dua kelas: Standard (diskaun besar, boleh MODIFY AZ/saiz dalam family, boleh jual di RI Marketplace) dan Convertible (diskaun kurang, boleh EXCHANGE tukar family/OS/tenancy). Scope: Regional (fleksibel AZ, no capacity reservation) atau Zonal (lock 1 AZ + capacity reservation).',
            scenario: '"Database 24/7 sepanjang tahun, instance type takkan berubah, nak diskaun maksimum" → Standard RI (3-tahun All Upfront). "Steady tapi mungkin tukar instance family tahun depan" → Convertible RI. "Perlu jaminan kapasiti dalam AZ tertentu" → Zonal RI (regional RI TIDAK reserve capacity).',
            compare: [
              {
                label: 'Standard vs Convertible RI',
                headers: ['Aspect', 'Standard RI', 'Convertible RI'],
                rows: [
                  ['Diskaun', '🟢 Sampai 72%', 'Sampai 66% (kurang sikit)'],
                  ['Tukar instance family/OS', '❌ Tak boleh', '🟢 Boleh exchange'],
                  ['Modify AZ / saiz dalam family', '✅ Boleh', '✅ Boleh'],
                  ['Jual di RI Marketplace', '🟢 Boleh', '❌ Tak boleh'],
                  ['Best bila', 'Konfigurasi takkan berubah, nak diskaun max', 'Mungkin perlu tukar family/OS kemudian'],
                ],
                takeaway: 'Pasti tak berubah + diskaun max → Standard. Nak fleksibiliti tukar family/OS → Convertible. Tapi kalau nak fleksibel SAMBIL auto-apply tanpa exchange manual → consider Savings Plans.',
              },
              {
                label: 'Payment options (sama untuk Standard & Convertible)',
                headers: ['Bayaran', 'Diskaun', 'Bila pilih'],
                rows: [
                  ['All Upfront', '🟢 Paling tinggi', 'Ada cash, nak jimat maksimum'],
                  ['Partial Upfront', 'Pertengahan', 'Imbang cash flow vs diskaun'],
                  ['No Upfront', 'Paling rendah', 'Tak nak bayar awal, masih commit 1-3 thn'],
                ],
                takeaway: 'Lagi banyak bayar awal = lagi besar diskaun. All Upfront 3-tahun Standard RI = diskaun paling besar yang ada (~72%).',
              },
            ],
            tips: [
              'Standard RI = diskaun lebih besar tapi TAK boleh tukar instance family. Convertible RI = boleh exchange family/OS/tenancy tapi diskaun kurang.',
              'Regional RI (default, disyorkan): apply ke mana-mana AZ dalam region, boleh modify, TAPI tiada capacity reservation. Zonal RI: lock satu AZ + dapat capacity reservation.',
              'Payment: All Upfront > Partial Upfront > No Upfront (ikut saiz diskaun). Term: 3 tahun > 1 tahun.',
              'RI vs Savings Plans: RI lock pada instance config (atau exchange manual untuk Convertible). Savings Plans commit $/jam, auto-apply lebih fleksibel — exam selalu pilih Savings Plans bila soalan tekankan "flexibility".',
              'RI bukan cuma EC2 — ada juga untuk RDS, Redshift, ElastiCache, OpenSearch.',
              'Billing order: RI diapply DULU, baru Savings Plans (EC2 Instance SP → Compute SP) pada usage yang tinggal.',
            ],
            docs: [
              { label: 'Reserved Instance types (Standard vs Convertible)', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/reserved-instances-types.html' },
            ],
            keywords: ['1 or 3 year', 'up to 72% discount', 'Standard RI', 'Convertible RI', 'exchange', 'modify', 'All Upfront', 'Partial Upfront', 'No Upfront', 'Regional RI', 'Zonal RI', 'capacity reservation', 'RI Marketplace'],
          },
          {
            shortName: 'Spot Instances',
            fullName: 'EC2 Spot Instances',
            ingat: '"Kapasiti EC2 lebihan, sampai 90% murah — tapi AWS boleh ambil balik dengan notis 2 minit"',
            gunaUntuk: 'Batch jobs, fault-tolerant & stateless workloads, flexible timing',
            fungsi: 'Guna kapasiti EC2 yang tidak digunakan pada harga sehingga 90% lebih murah dari On-Demand. Tukaran-nya: AWS boleh INTERRUPT (ambil balik) instance bila perlukan kapasiti semula, dengan notis 2 minit sahaja. Sebab tu sesuai untuk beban yang fault-tolerant / boleh resume, BUKAN untuk server kritikal yang stateful.',
            scenario: '"Batch processing / big data / render farm yang boleh interrupt & resume" → Spot, jimat besar. "Production database / stateful app / payment service yang TAK boleh putus" → JANGAN Spot, guna On-Demand atau RI/Savings Plans. Soalan tekan "fault-tolerant + lowest cost" hampir mesti = Spot.',
            storageDetails: 'Notis interrupt 2 minit datang melalui DUA saluran: (1) EventBridge event "EC2 Spot Instance Interruption Warning" (detail-type), dan (2) instance metadata pada instance itu sendiri. Best practice: poll metadata setiap 5 saat. Ada juga Rebalance Recommendation — signal AWAL sebelum notis 2 minit, bagi peluang pindahkan beban lebih cepat. NOTA: kalau interruption behavior = hibernate, kau dapat notis tapi BUKAN 2 minit awal (hibernate mula serta-merta).',
            detailsLabel: 'Macam mana dapat notis interrupt',
            compare: {
              label: 'Spot interruption behaviors + bila guna apa',
              headers: ['Behavior', 'Apa jadi bila interrupt', 'Syarat / nota'],
              rows: [
                ['Terminate (default)', 'Instance ditamatkan terus', 'Default. Beban stateless / boleh start fresh'],
                ['Stop', 'Instance di-stop, EBS dikekalkan', 'Request type mesti persistent (Fleet: maintain). Hanya AWS boleh restart bila kapasiti ada balik'],
                ['Hibernate', 'RAM disimpan ke EBS, resume balik', 'Dapat notis tapi TIADA 2-minit awal (hibernate mula serta-merta)'],
              ],
              takeaway: 'Default = terminate. Nak simpan EBS & sambung kerja → stop (persistent/maintain). Nak resume state RAM → hibernate. Soalan "resume work after interruption" → stop/hibernate, bukan terminate.',
            },
            mermaid: {
              label: 'Provision Spot dengan resilien (Fleet & Auto Scaling)',
              source: `flowchart TD
  A[Nak Spot tapi kurang risiko interrupt] --> B{Macam mana nak provision?}
  B -->|Satu group, banyak instance type/AZ| C[EC2 Fleet / Spot Fleet]
  B -->|Auto Scaling group| D[Mixed Instances Policy<br/>campur On-Demand + Spot]
  C --> E{Allocation strategy?}
  D --> E
  E -->|Beban high cost-of-interruption| F[capacity-optimized<br/>pool paling banyak kapasiti]
  E -->|Nak imbang kos + interruption| G[price-capacity-optimized<br/>disyorkan AWS]
  F --> H[Capacity Rebalancing<br/>ganti instance berisiko awal]
  G --> H`,
              caption: 'EC2 Fleet/Spot Fleet atau ASG Mixed Instances Policy = sebar merentas banyak instance type & AZ supaya kalau satu pool kena ambil balik, yang lain sambung. capacity-optimized = ambil dari pool paling banyak kapasiti (kurang interrupt). price-capacity-optimized = pilihan default disyorkan (imbang murah + kurang interrupt).',
            },
            tips: [
              'Notis interrupt = 2 MINIT, dihantar via EventBridge event DAN instance metadata. Poll metadata setiap ~5 saat. (Exam selalu tanya angka 2 minit ni.)',
              'Interruption behaviors: terminate (default), stop, hibernate. Stop perlu request persistent / Fleet maintain. Hibernate dapat notis tapi tak ada 2-minit awal.',
              'EC2 Fleet & Spot Fleet: minta kapasiti merentas BANYAK instance type, saiz & AZ dalam satu request → lebih tahan interrupt. Spot Fleet boleh campur Spot + On-Demand juga.',
              'Auto Scaling Mixed Instances Policy: satu ASG campur On-Demand (baseline stabil) + Spot (jimat). Letak % On-Demand sebagai baseline, selebihnya Spot.',
              'Allocation strategy capacity-optimized = ambil Spot dari pool dengan kapasiti paling banyak → kurang kemungkinan interrupt (bagus untuk beban yang mahal kalau interrupt). price-capacity-optimized = default disyorkan AWS (imbang harga + kapasiti).',
              'Capacity Rebalancing (rebalance recommendation): ASG/Fleet ganti instance yang BERISIKO TINGGI interrupt secara proaktif, sebelum notis 2 minit penuh.',
              'JANGAN guna Spot untuk: database stateful, production kritikal, beban yang tak boleh putus / tak boleh resume. Untuk itu → On-Demand / RI / Savings Plans.',
            ],
            docs: [
              { label: 'Spot Instance interruption notices (2-min)', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html' },
              { label: 'Behavior of Spot Instance interruptions', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/interruption-behavior.html' },
              { label: 'EC2 Fleet / Spot Fleet allocation strategies', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-fleet-allocation-strategy.html' },
            ],
            keywords: ['up to 90% discount', 'interruptible', '2-minute interruption notice', 'EventBridge', 'instance metadata', 'rebalance recommendation', 'terminate', 'stop', 'hibernate', 'persistent request', 'Spot Fleet', 'EC2 Fleet', 'mixed instances policy', 'capacity-optimized', 'price-capacity-optimized', 'capacity rebalancing', 'fault-tolerant', 'batch jobs'],
          },
          {
            shortName: 'Savings Plans',
            fullName: 'AWS Savings Plans (SP)',
            ingat: '"Commit $/jam, bukan instance. Compute = paling fleksibel (+Fargate/Lambda), EC2 Instance = diskaun lebih besar"',
            gunaUntuk: 'Steady compute spend tapi nak fleksibiliti tukar instance/region — auto-apply',
            fungsi: 'Komitmen pada jumlah belanja compute ($/jam) untuk 1 atau 3 tahun → diskaun auto-apply. Dua jenis: Compute Savings Plans (paling fleksibel — apply ke mana-mana instance family, saiz, OS, tenancy, region, dan TERMASUK Fargate & Lambda; sampai 66%) dan EC2 Instance Savings Plans (commit pada satu instance family dalam satu region; diskaun lebih besar sampai 72% tapi kurang fleksibel).',
            scenario: '"Nak jimat tapi mungkin tukar instance type/region/OS, dan ada beban Fargate + Lambda sekali" → Compute Savings Plans (auto-apply tanpa exchange manual). "Komited pada family tertentu (cth m5) dalam satu region, nak diskaun lebih besar dari Compute SP" → EC2 Instance Savings Plans. "Beban batch boleh interrupt" → Spot (bukan SP).',
            mermaid: {
              label: 'Pilih EC2 purchasing option (decision tree)',
              source: `flowchart TD
  A[Macam mana beban compute?] --> B{Boleh tahan interrupt?}
  B -->|Ya, fault-tolerant batch| C[Spot<br/>sampai 90% murah]
  B -->|Tak, perlu stabil| D{Predictable 1-3 tahun?}
  D -->|Tak, spiky / short-term| E[On-Demand]
  D -->|Ya| F{Perlu fleksibiliti?}
  F -->|Tukar family/region + Fargate/Lambda| G[Compute Savings Plans<br/>sampai 66%]
  F -->|Lock 1 family/region, diskaun lebih| H[EC2 Instance Savings Plans<br/>sampai 72%]
  F -->|Config tetap + capacity reservation| I[Reserved Instances]`,
              caption: 'Boleh interrupt → Spot. Tak predictable → On-Demand. Predictable + fleksibel (+Fargate/Lambda) → Compute SP. Predictable + lock family untuk diskaun max → EC2 Instance SP / Standard RI. Soalan tekan "flexibility" biasanya = Savings Plans (bukan RI).',
            },
            compare: {
              label: 'Compute SP vs EC2 Instance SP vs RI',
              headers: ['Aspect', 'Compute SP', 'EC2 Instance SP', 'Reserved Instances'],
              rows: [
                ['Diskaun', 'Sampai 66%', '🟢 Sampai 72%', 'Sampai 72%'],
                ['Komit pada', '$/jam (apa-apa compute)', '$/jam (1 family + region)', 'Instance config tertentu'],
                ['Tukar family/region', '🟢 Bebas', 'Region & family terkunci', 'Exchange (Convertible) je'],
                ['Fargate / Lambda', '🟢 Ya, termasuk', '❌ EC2 sahaja', '❌ EC2 sahaja'],
                ['Capacity reservation', '❌ Tiada', '❌ Tiada', '🟢 Zonal RI ada'],
              ],
              takeaway: 'Paling fleksibel + cover Fargate/Lambda → Compute SP. Diskaun lebih besar tapi lock family/region → EC2 Instance SP. Perlu jaminan kapasiti AZ → Zonal RI. Billing apply order: RI → EC2 Instance SP → Compute SP (highest discount dulu).',
            },
            tips: [
              'Compute Savings Plans = paling fleksibel: apa-apa instance family, saiz, OS, tenancy, region — DAN apply ke Fargate + Lambda. Sampai 66%.',
              'EC2 Instance Savings Plans = lock pada satu instance family dalam satu region (boleh tukar saiz/OS/AZ dalam family). Diskaun lebih besar (sampai 72%) tapi kurang fleksibel. EC2 sahaja.',
              'SP vs RI: dua-dua commit 1/3 tahun. SP commit $/jam (auto-apply, tak payah exchange). RI commit pada instance config. Soalan tekan "flexibility / minimal management" → Savings Plans.',
              'Spot ≠ SP: Spot untuk beban yang boleh di-interrupt (sampai 90% murah, no commitment). SP untuk beban steady yang TAK boleh interrupt.',
              'Payment: All / Partial / No Upfront — sama macam RI, lagi banyak upfront = lagi besar diskaun.',
              'Billing apply order penting: AWS apply RI dulu, lepas tu EC2 Instance SP, last sekali Compute SP (ikut highest discount).',
            ],
            docs: [
              { label: 'Compute vs EC2 Instance Savings Plans', url: 'https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-ris.html' },
            ],
            keywords: ['flexible', 'hourly commitment', 'up to 66% discount', 'Compute Savings Plans', 'EC2 Instance Savings Plans', 'Fargate', 'Lambda', 'auto-apply', 'vs Reserved Instances', 'billing apply order'],
          },
          {
            shortName: 'Compute Optimizer',
            fullName: 'AWS Compute Optimizer',
            ingat: '"AI yang cadang right-size EC2, Lambda, EBS — guna ML analyse usage"',
            gunaUntuk: 'Rightsizing recommendations for EC2, Lambda, EBS, ECS on Fargate, Auto Scaling Groups',
            fungsi: 'Compute Optimizer analyse historical utilization metrics (14 days) menggunakan ML untuk recommend optimal resource configurations. Bagi projected cost savings, performance risk, dan comparison antara current vs recommended.',
            scenario: '"EC2 instances consistently underutilized, nak reduce cost without manual analysis" → Compute Optimizer untuk get rightsizing recommendations.',
            tips: [
              'Compute Optimizer vs Trusted Advisor: Compute Optimizer = ML-based deep rightsizing untuk compute. Trusted Advisor = broader checks (cost, security, performance, service limits)',
              'Supported resources: EC2 instances, EC2 Auto Scaling Groups, EBS volumes, Lambda functions, ECS on Fargate',
              'Requires CloudWatch metrics — needs at least 14 days of usage data for recommendations',
              'Exam: "get ML-based rightsizing recommendations for EC2/Lambda" → Compute Optimizer. "General cost recommendations across many services" → Trusted Advisor',
            ],
            compare: {
              label: 'Compute Optimizer vs Trusted Advisor',
              headers: ['Aspect', 'Compute Optimizer', 'Trusted Advisor'],
              rows: [
                ['Focus', 'Deep rightsizing of compute', 'Broad account-wide checks'],
                ['Method', '🟢 ML on 14 days of metrics', 'Rule-based best-practice checks'],
                ['Covers', 'EC2, ASG, EBS, Lambda, ECS/Fargate', 'Cost, Security, Performance, Fault Tolerance, Service Limits'],
                ['Output', 'Optimal instance config + projected savings', 'Flags idle/risky resources + recommendations'],
                ['Use when', '"ML rightsizing for EC2/Lambda"', '"general best-practice/cost/security review"'],
              ],
              takeaway: '"ML-based deep rightsizing for compute" → Compute Optimizer. "Broad checks across cost/security/performance/limits" → Trusted Advisor (5 categories).',
            },
            keywords: ['rightsizing', 'ML recommendations', 'EC2 optimization', 'Lambda optimization', 'cost savings', 'underutilized', 'vs Trusted Advisor'],
          },
          {
            shortName: 'Trusted Advisor',
            fullName: 'AWS Trusted Advisor',
            ingat: '"Penasihat jimat kos AWS"',
            gunaUntuk: 'Identify idle resources, cost optimization recommendations',
            fungsi: 'Menganalisis persekitaran AWS dan memberikan cadangan untuk optimasi kos, security, dan performance',
            scenario: 'CFO tanya "mana resources kita yang membazir?" — Trusted Advisor akan highlight EC2 yang underutilized, S3 buckets tak pakai, Elastic IPs yang idle, dan bagi estimate savings.',
            tips: [
              'Lima kategori checks: Cost Optimization, Performance, Security, Fault Tolerance, Service Limits',
              'Free tier: 7 core checks. Business/Enterprise support: semua checks + API access',
              'Bukan Compute Optimizer (yang ML-based deep compute rightsizing). Trusted Advisor = broader, rule-based',
            ],
            keywords: ['cost recommendations', 'idle resources', 'rightsizing', 'underutilized', 'service limits', 'five categories'],
          },
          {
            shortName: 'AWS Budgets',
            fullName: 'AWS Budgets',
            ingat: '"Alarm sebelum spend cecah limit"',
            gunaUntuk: 'Set cost/usage thresholds and get alerted before overspending',
            fungsi: 'Buat budget untuk kos, usage, atau Reserved Instance coverage. Alert via email atau SNS bila actual atau forecast spend melebihi threshold yang ditetapkan.',
            scenario: '"Alert bila monthly EC2 cost nak cecah $1000" → AWS Budgets. Bukan Cost Explorer (yang untuk analysis/visualization, bukan alerting). Budgets = PROACTIVE ALERTS. Cost Explorer = REACTIVE ANALYSIS.',
            tips: [
              'Four budget types: Cost budget, Usage budget, Reservation budget (RI utilization/coverage), Savings Plans budget',
              'Budget Actions: auto-respond when threshold exceeded — apply IAM policy, attach SCP, or stop EC2 instances',
              'Budgets alerts: actual OR forecast. Set multiple thresholds (e.g., alert at 80%, 100%, 120%)',
              'Exam: "alert BEFORE overspending" → Budgets. "analyze WHERE money went" → Cost Explorer. "detailed line-item billing data" → Cost and Usage Report (CUR)',
              'Free tier: 2 budgets free. Additional budgets $0.02/day each',
            ],
            keywords: ['budget alerts', 'cost threshold', 'SNS notification', 'usage budget', 'forecast alert', 'before overspend', 'budget actions'],
          },
          {
            shortName: 'Cost Explorer',
            fullName: 'AWS Cost Explorer',
            ingat: '"Graf dan analisis spending AWS"',
            gunaUntuk: 'Visualise and analyse AWS costs — understand patterns, get RI/SP recommendations',
            fungsi: 'Interactive UI untuk analyse AWS spending by service, account, tag, region. Bagi RI dan Savings Plans recommendations. Boleh forecast future costs. Granular hingga hourly.',
            scenario: '"Nak tengok mana service paling banyak cost bulan lepas" → Cost Explorer. "Dapat recommendations untuk beli Reserved Instances" → Cost Explorer. Bukan Trusted Advisor (general recommendations). Bukan Budgets (alerts). Cost Explorer = VISUALIZATION & ANALYSIS.',
            tips: [
              'Forecast: predict future spend up to 12 months ahead using historical data (80% prediction interval)',
              'Granularity: monthly, daily, or hourly. Hourly only available with detailed billing enabled',
              'RI + Savings Plans recommendations: Cost Explorer recommends which RIs/SPs to buy based on usage patterns',
              'Filters: by service, linked account, tag, AZ, instance type, purchase option, etc.',
              'Cost anomaly detection: ML-powered, auto-detects unusual spending spikes and alerts you',
              'Exam: "visualize spending trends" → Cost Explorer. "alert when budget exceeded" → Budgets. "detailed CSV billing report" → Cost and Usage Report (CUR)',
            ],
            compare: {
              label: 'Cost Explorer vs Budgets vs CUR',
              headers: ['Aspect', 'Cost Explorer', 'AWS Budgets', 'Cost & Usage Report'],
              rows: [
                ['Job', 'Visualize & analyze past spend', 'Alert before/over a threshold', 'Most granular billing line items'],
                ['Direction', 'Reactive — "where did money go?"', '🟢 Proactive — "warn me at 80%"', 'Raw data for deep/custom analysis'],
                ['Output', 'Charts, trends, forecast, RI/SP recs', 'Email/SNS alerts + Budget Actions', 'CSV/Parquet to S3 (query w/ Athena)'],
                ['Granularity', 'Monthly / daily / hourly', 'Per budget threshold', 'Hourly, per-resource, per-tag'],
                ['Keyword', '"visualize / analyze trends"', '"alert before overspending"', '"detailed line-item billing data"'],
              ],
              takeaway: 'Analyze trends → Cost Explorer. Alert before overspend → Budgets (proactive). Deepest raw billing data for custom queries → Cost & Usage Report (CUR) → S3 + Athena.',
            },
            keywords: ['cost analysis', 'spending visualization', 'RI recommendations', 'usage patterns', 'rightsizing', 'forecast', 'hourly granularity', 'anomaly detection', 'vs Budgets', 'CUR'],
          },
          {
            shortName: 'Cost & Usage Report',
            fullName: 'AWS Cost and Usage Report (CUR)',
            ingat: '"Data billing PALING detail → drop ke S3 → query guna Athena"',
            gunaUntuk: 'Raw line-item billing paling granular untuk custom/deep cost analysis',
            fungsi: 'Report billing PALING terperinci yang AWS ada — setiap line item kos & usage (per jam, per resource, per tag, termasuk RI & Savings Plans utilization). Dihantar automatik ke S3 bucket kau dalam format CSV (atau Parquet untuk Athena). Lepas tu boleh query guna Amazon Athena (SQL terus atas S3), load ke Redshift, atau visualize dalam QuickSight.',
            scenario: '"Nak data billing mentah paling detail untuk buat custom report / query sendiri guna SQL" → Cost & Usage Report → S3 + Athena. Bukan Cost Explorer (itu untuk VISUALIZE dalam UI siap). Bukan Budgets (itu untuk ALERT). CUR = raw data, kau yang olah sendiri.',
            tips: [
              'Output ke S3: CSV (boleh gzip/zip) atau Parquet. Athena hanya support Parquet — pilih Parquet kalau nak query guna Athena.',
              'Query options: Amazon Athena (SQL terus atas S3, tak payah data warehouse), Amazon Redshift (load masuk), atau Amazon QuickSight (dashboard).',
              'Paling granular: hourly, per-resource, per-tag, plus Savings Plans & RI utilization/coverage. Lebih detail dari Cost Explorer.',
              'CUR boleh auto-refresh line item bila ada late-arriving data, dan support versioning fail dalam S3.',
              'Exam keyword: "detailed line-item billing data" / "raw billing data to query with SQL" → Cost & Usage Report (CUR). "visualize trends" → Cost Explorer. "alert before overspend" → Budgets.',
            ],
            compare: {
              label: 'CUR vs Cost Explorer vs Budgets',
              headers: ['Aspect', 'Cost & Usage Report', 'Cost Explorer', 'AWS Budgets'],
              rows: [
                ['Job', '🟢 Raw line items paling granular', 'Visualize & analyze spend', 'Alert before/over threshold'],
                ['Output', 'CSV/Parquet ke S3', 'Charts, trends, forecast', 'Email/SNS + Budget Actions'],
                ['Cara guna', 'Query Athena/Redshift/QuickSight', 'Interactive UI siap', 'Set threshold → tunggu alert'],
                ['Keyword', '"detailed line-item / SQL billing"', '"visualize / analyze trends"', '"alert before overspending"'],
              ],
              takeaway: 'Nak data mentah paling detail untuk olah sendiri → CUR (S3 + Athena). Nak tengok graf siap → Cost Explorer. Nak amaran sebelum lebih bajet → Budgets.',
            },
            docs: [
              { label: 'What is the AWS Cost and Usage Report', url: 'https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html' },
              { label: 'Query CUR using Amazon Athena', url: 'https://docs.aws.amazon.com/cur/latest/userguide/cur-query-athena.html' },
            ],
            keywords: ['Cost and Usage Report', 'CUR', 'line-item billing', 'most granular', 'S3 delivery', 'CSV', 'Parquet', 'Athena', 'Redshift', 'QuickSight', 'per-resource', 'hourly', 'raw billing data'],
          },
          {
            shortName: 'Cost Allocation Tags',
            fullName: 'AWS Cost Allocation Tags',
            ingat: '"Label resource → tahu duit pergi mana"',
            gunaUntuk: 'Track & group kos ikut team / projek / environment',
            fungsi: 'Tag (key-value) yang kau AKTIFKAN di Billing console supaya AWS kumpulkan kos ikut label dalam Cost Explorer, Budgets, dan Cost & Usage Report. Boleh tag ikut cost center, nama app, owner, atau environment.',
            scenario: '"Nak tahu berapa kos setiap department/projek dalam SATU account" → tag resource (cth Project=Alpha) → ACTIVATE tag → group/filter dalam Cost Explorer. Tanpa tag, semua kos bercampur jadi satu.',
            compare: {
              label: 'AWS-generated vs User-defined cost allocation tags',
              headers: ['Aspect', 'AWS-generated', 'User-defined'],
              rows: [
                ['Siapa buat', 'AWS auto-create & apply', 'Kau define & apply sendiri'],
                ['Prefix', 'aws: (cth aws:createdBy)', 'user:'],
                ['Contoh', 'createdBy, aws:cloudformation:stack-name', 'CostCenter, Project, Environment, Owner'],
                ['Kena activate?', '🟡 Ya — activate berasingan di Billing console', '🟡 Ya — activate berasingan di Billing console'],
              ],
              takeaway: 'Kedua-dua jenis MESTI di-ACTIVATE di Billing/Cost Management console dulu baru muncul dalam Cost Explorer / cost allocation report (boleh ambil masa ~24 jam). Tag = cara utama group kos ikut team/projek/environment.',
            },
            tips: [
              'Tag = key + value (cth Environment=Prod). Satu key cuma boleh ada satu value per resource',
              'Apply tag SAHAJA tak cukup — kena activate dalam Billing console, kalau tak ia tak muncul dalam report',
              'Lepas aktif: boleh filter/group dalam Cost Explorer, set Budget per tag, dan muncul dalam CUR',
              'Exam: "track cost by department/project/team dalam SATU account" → Cost Allocation Tags. "pisah kos merentas BANYAK account" → Consolidated Billing (linked accounts)',
            ],
            keywords: ['cost allocation tags', 'AWS-generated', 'user-defined', 'activate in billing', 'track cost by tag', 'cost center'],
          },
          {
            shortName: 'Consolidated Billing',
            fullName: 'AWS Organizations Consolidated Billing',
            ingat: '"Satu bil untuk semua account + diskaun dikongsi"',
            gunaUntuk: 'Gabung billing banyak account, kongsi volume/RI/SP discount',
            fungsi: 'Ciri AWS Organizations: management (payer) account bayar untuk semua member account. Usage semua account DIGABUNG → kongsi volume pricing discount, Reserved Instance discount, dan Savings Plans merentas account. Percuma.',
            scenario: '"Syarikat ada 10 AWS account, nak satu bil je + maksimumkan diskaun" → Organizations Consolidated Billing. Usage digabung sampai naik tier diskaun lebih tinggi (cth S3 tiered pricing), dan RI/Savings Plans yang tak terpakai di satu account auto-apply ke account lain.',
            compare: {
              label: 'Faedah Consolidated Billing',
              headers: ['Faedah', 'Maksudnya'],
              rows: [
                ['One bill', 'Satu bil untuk semua account (management account yang bayar)'],
                ['Combined usage', '🟢 Usage digabung → naik tier volume discount lebih cepat'],
                ['Shared RI / Savings Plans', '🟢 RI & SP yang tak terpakai di satu account auto-apply ke account lain'],
                ['No extra fee', 'Percuma — tiada caj tambahan'],
                ['Easy tracking', 'Download combined cost & usage; ada cost report per member account'],
              ],
              takeaway: 'Management account = payer. Diskaun (volume, RI, Savings Plans) DIKONGSI merentas semua member account → total lebih murah dari account berasingan. Member account keluar org → hilang akses Cost Explorer data lama (management account masih simpan).',
            },
            tips: [
              'Management (payer) account bayar semua; member account bills = informational sahaja',
              'Volume discount + RI + Savings Plans dikongsi merentas semua account dalam organization',
              'Consolidated Billing PERCUMA — ia sebahagian dari AWS Organizations',
              'Exam: "single bill + maximize discounts across many accounts" → Consolidated Billing. "restrict apa member account boleh buat" → SCPs (guardrails, BUKAN billing)',
            ],
            keywords: ['consolidated billing', 'management account', 'member accounts', 'volume discount', 'shared RI', 'shared Savings Plans', 'one bill', 'free'],
          },
        ],
      },
      {
        id: 'd4-storage',
        icon: '💾',
        title: 'Storage Cost Optimization',
        category: 'd4store',
        services: [
          {
            shortName: 'S3 Storage Tiers',
            fullName: 'Amazon S3 Storage Classes',
            ingat: '"Pilih tier ikut seberapa selalu kau access"',
            gunaUntuk: 'Kurangkan kos storage ikut frequency of access',
            fungsi: 'Menyediakan pelbagai kelas storan dengan harga berbeza berdasarkan keperluan akses data',
            storageDetails: 'S3 Standard → selalu access, harga tinggi\nS3 Standard-IA → jarang access tapi kena cepat bila diperlukan\nS3 One Zone-IA → same tapi 1 AZ je, lagi murah\nS3 Glacier Instant → archive, retrieve dalam miliseconds\nS3 Glacier Flexible → archive, retrieve dalam minit-jam\nS3 Glacier Deep Archive → paling murah, retrieve 12-48 jam',
            scenario: 'Log files yang baru = S3 Standard. Log files 30 hari lepas = S3-IA. Log files setahun lepas untuk compliance = S3 Glacier. Guna S3 Lifecycle Policy untuk auto-move between tiers.',
            tips: [
              'S3 Glacier Instant Retrieval: rarely accessed + millisecond retrieval. Medical/lab records yang perlu immediate access. Min 90-day storage',
              'S3 Glacier Deep Archive: CHEAPEST ($0.00099/GB). 12-hour retrieval. For 10-year compliance retention (genomics, legal). Min 180-day',
              'S3 One Zone-IA: SINGLE AZ only. For data yang boleh regenerated/reproduced. Cheaper than Standard-IA. Risk: AZ failure = data loss',
              'S3 Standard-IA: multi-AZ, infrequent access, ms retrieval. Min 30-day storage charge',
              'Pattern: "10-year retention, rarely accessed, petabytes" → S3 Glacier Deep Archive via lifecycle policy',
              'Pattern: "millisecond retrieval but rarely accessed" → S3 Glacier Instant Retrieval (not Flexible/Deep Archive)',
              'EFS One Zone-IA: cheapest EFS. Single AZ + infrequent access. Good when data can be regenerated',
            ],
            keywords: ['storage classes', 'lifecycle policy', 'infrequent access', 'glacier', 'Glacier Instant Retrieval', 'Glacier Deep Archive', 'One Zone-IA', 'min storage charge'],
          },
          {
            shortName: 'S3 Intelligent-Tiering',
            fullName: 'S3 Intelligent-Tiering',
            ingat: '"AWS pilihkan tier yang paling murah secara auto"',
            gunaUntuk: 'Data dengan access pattern tak menentu',
            fungsi: 'Memindahkan objek secara automatik antara access tiers berdasarkan corak penggunaan',
            scenario: 'Media company simpan assets — ada video yang viral tiba-tiba, ada yang tak pernah ditonton. Tak boleh predict mana yang akan kena access. Intelligent-Tiering auto-optimize kos tanpa perlu urus manually.',
            keywords: ['auto-tiering', 'unpredictable access', 'no retrieval fees'],
          },
        ],
      },
      {
        id: 'd4-network',
        icon: '🌐',
        title: 'Networking Cost Optimization',
        category: 'd4net',
        services: [
          {
            shortName: 'CloudFront',
            fullName: 'Amazon CloudFront',
            ingat: '"CDN yang jimatkan data transfer cost"',
            gunaUntuk: 'Reduce data transfer cost, cache content dekat user',
            fungsi: 'Mengurangkan kos data transfer dengan menyimpan cache content di edge locations',
            scenario: 'Website ada users dari US, Europe, Asia. Tanpa CloudFront, setiap request kena bayar data transfer dari origin server. Dengan CloudFront, content cached kat edge location dekat user — jimat kos transfer + lagi laju.',
            keywords: ['reduce data transfer', 'edge caching', 'CDN', 'cost saving'],
          },
          {
            shortName: 'VPC Endpoints',
            fullName: 'AWS VPC Endpoints',
            ingat: '"Jalan dalam rumah, tak payah keluar internet"',
            gunaUntuk: 'EC2 → S3/DynamoDB tanpa kena NAT Gateway fees',
            fungsi: 'Menghubungkan VPC kepada perkhidmatan AWS secara terus tanpa melalui internet awam',
            scenario: 'EC2 dalam private subnet selalu upload/download dari S3. Kalau guna NAT Gateway, kena bayar per GB. Pasang VPC Endpoint → traffic pergi terus dalam AWS network, no NAT fees, lagi jimat.',
            keywords: ['no NAT fees', 'private connection', 'S3 gateway', 'no internet'],
          },
        ],
      },
      {
        id: 'd4-database',
        icon: '🗄️',
        title: 'Database Cost Optimization',
        category: 'd4db',
        services: [
          {
            shortName: 'ElastiCache',
            fullName: 'Amazon ElastiCache',
            ingat: '"Cache depan database, kurangkan DB load"',
            gunaUntuk: 'Cache frequent queries, reduce RDS cost',
            fungsi: 'Menyediakan in-memory caching untuk mengurangkan beban dan kos pada database utama',
            scenario: 'E-commerce app — product listing query kena berjuta kali sehari. Tanpa cache, RDS kena scale up (mahal). Dengan ElastiCache (Redis), query popular disimpan dalam memory — RDS tak terlalu terbeban, kos lebih rendah.',
            compare: [
              {
                label: 'Redis vs Memcached',
                headers: ['Aspect', 'Redis', 'Memcached'],
                rows: [
                  ['Data structures', 'Rich (lists, sets, sorted sets, pub/sub)', 'Simple key-value only'],
                  ['Persistence', '✅ Snapshots / backup', '❌ None — data lost on restart'],
                  ['Replication + Multi-AZ', '✅ Yes (auto-failover)', '❌ No'],
                  ['Threading', 'Single-threaded', '🟢 Multi-threaded'],
                  ['Use case', 'Leaderboards, session store, pub/sub, HA cache', 'Simple cache, scale out horizontally'],
                ],
                takeaway: 'Perlu persistence / replication / Multi-AZ / complex data → Redis. Perlu simple multi-threaded cache, horizontal scale → Memcached. Default exam answer biasanya Redis.',
              },
              {
                label: 'Caching strategies — Lazy Loading vs Write-Through',
                headers: ['Aspect', 'Lazy Loading', 'Write-Through'],
                rows: [
                  ['Bila cache di-isi', 'Bila cache MISS (read dulu)', 'Setiap kali WRITE ke DB'],
                  ['Data dalam cache', 'Hanya yang pernah diminta', 'Semua yang pernah ditulis'],
                  ['Cache miss penalty', 'Ya — 3 trips (cache→DB→cache)', '🟢 Tiada untuk data baru ditulis'],
                  ['Risiko stale data', 'Boleh stale (fix: TTL)', '🟢 Sentiasa fresh'],
                  ['Kelemahan', 'First read lambat', 'Cache penuh data tak pernah dibaca + write latency naik'],
                ],
                takeaway: 'Lazy Loading = isi bila diminta (jimat memory, boleh stale). Write-Through = isi masa tulis (fresh, tapi boros). Pattern paling common di exam: Lazy Loading + TTL untuk imbang freshness vs saiz cache.',
              },
            ],
            tips: [
              'ElastiCache for Redis: sub-millisecond latency, key-value + data structures (lists, sets, sorted sets), persistence (snapshots), replication, Multi-AZ auto-failover',
              'ElastiCache for Memcached: multi-threaded, simple key-value only, NO persistence, NO replication — data hilang bila node restart/fail',
              'Redis vs Memcached: perlu persistence/replication/Multi-AZ/complex data structures (leaderboards, pub-sub) → Redis. Perlu simple cache, multi-threaded, horizontal scale ringkas → Memcached',
              'Session store pattern: simpan user session dalam Redis (persistence + Multi-AZ) supaya session tak hilang bila satu node fail',
              'Use cases: real-time leaderboards, session store, caching, real-time recommendation lookups',
              'Neptune = graph database (social networks, fraud detection). Redis = low-latency in-memory data store',
              'Exam: "real-time recommendations + low-latency reads AND writes at scale" → ElastiCache for Redis (not Neptune, not Aurora)',
              'Lazy Loading: load data ke cache ONLY bila ada request (cache miss → query DB → write to cache). Pro: cache tak penuh dengan data tak guna, node fail tak fatal. Con: cache miss = 3 trips (cache→DB→cache), data boleh jadi stale.',
              'Write-Through: setiap kali data ditulis ke DB, terus update cache sekali. Pro: cache data sentiasa fresh, tak ada cache miss penalty untuk written data. Con: cache penuh dengan data yang mungkin tak pernah dibaca (wasted space), write latency lebih tinggi.',
              'Exam: gabungkan lazy loading + TTL untuk imbangkan freshness vs cache size — pattern paling common',
            ],
            docs: [
              { label: 'Caching strategies (lazy loading & write-through)', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html' },
            ],
            keywords: ['Redis', 'Memcached', 'in-memory', 'reduce DB load', 'caching', 'sub-millisecond', 'leaderboards', 'session store', 'lazy loading', 'write-through', 'cache miss', 'TTL', 'multi-threaded', 'persistence', 'replication'],
          },
          {
            shortName: 'DynamoDB On-Demand',
            fullName: 'Amazon DynamoDB On-Demand',
            ingat: '"Database bayar per request, zero urus capacity"',
            gunaUntuk: 'Unpredictable traffic, serverless apps',
            fungsi: 'Menyediakan kapasiti database NoSQL yang skala secara automatik dan dikenakan caj berdasarkan permintaan sebenar',
            scenario: 'App baru yang tak tahu lagi berapa reads/writes per second. DynamoDB On-Demand auto-scale dan kau bayar per request je — tak perlu provision capacity in advance. Kalau traffic rendah, bayar rendah.',
            keywords: ['NoSQL', 'pay per request', 'serverless', 'auto-scale', 'unpredictable traffic'],
          },
        ],
      },
    ],
  },
  {
    id: 'domain-well-architected',
    badge: 'FRAMEWORK · ALL DOMAINS',
    title: 'AWS Well-Architected Framework',
    subtitle: 'SAA-C03 exam validates ability to design solutions based on the Well-Architected Framework.',
    variant: 'd1',
    sections: [
      {
        id: 'wa-pillars',
        icon: '🏛️',
        title: 'Six Pillars',
        category: 'd1iam',
        services: [
          {
            shortName: 'Operational Excellence',
            fullName: 'Well-Architected: Operational Excellence',
            ingat: '"Jalankan dan pantau systems, improve processes"',
            gunaUntuk: 'Run and monitor systems to deliver business value and continually improve processes',
            fungsi: 'Operational Excellence fokus pada automation, monitoring, dan continuous improvement. Key practices: IaC (CloudFormation), CI/CD, runbooks, post-incident reviews.',
            keywords: ['IaC', 'automation', 'runbooks', 'CI/CD', 'monitoring', 'continuous improvement'],
          },
          {
            shortName: 'Security',
            fullName: 'Well-Architected: Security',
            ingat: '"Lindungi data, systems, dan assets"',
            gunaUntuk: 'Protect information, systems, and assets via risk assessments and mitigation strategies',
            fungsi: 'Security pillar: identity and access management, detective controls, infrastructure protection, data protection, incident response. Principle of least privilege.',
            keywords: ['least privilege', 'IAM', 'encryption', 'detective controls', 'data protection', 'incident response'],
          },
          {
            shortName: 'Reliability',
            fullName: 'Well-Architected: Reliability',
            ingat: '"Recover dari failures, scale untuk demand"',
            gunaUntuk: 'Ensure workload performs correctly and consistently, including recovery from failures',
            fungsi: 'Reliability fokus pada distributed system design, recovery planning, dan scaling. Multi-AZ, backups, auto-healing, chaos engineering.',
            keywords: ['Multi-AZ', 'auto-recovery', 'RTO', 'RPO', 'disaster recovery', 'horizontal scaling', 'fault isolation'],
          },
          {
            shortName: 'Performance Efficiency',
            fullName: 'Well-Architected: Performance Efficiency',
            ingat: '"Guna resources dengan efficient, adapt bila ada perubahan"',
            gunaUntuk: 'Use computing resources efficiently to meet requirements and maintain efficiency as demand changes',
            fungsi: 'Selection of right resource types/sizes, monitoring performance, making informed decisions to maintain efficiency as business needs evolve.',
            keywords: ['right-sizing', 'serverless', 'caching', 'CDN', 'global deployment', 'benchmarking'],
          },
          {
            shortName: 'Cost Optimization',
            fullName: 'Well-Architected: Cost Optimization',
            ingat: '"Deliver value pada harga terendah"',
            gunaUntuk: 'Run systems to deliver business value at the lowest price point',
            fungsi: 'Avoid unnecessary costs, right-size resources, use appropriate pricing models (Reserved, Spot, Savings Plans), measure efficiency.',
            keywords: ['right-sizing', 'Reserved Instances', 'Spot', 'Savings Plans', 'eliminate waste', 'cost allocation tags'],
          },
          {
            shortName: 'Sustainability',
            fullName: 'Well-Architected: Sustainability',
            ingat: '"Kurangkan environmental impact — pillar ke-6 (2021)"',
            gunaUntuk: 'Minimize environmental impacts of running cloud workloads',
            fungsi: 'Sustainability pillar (ditambah 2021) fokus pada reducing carbon footprint: maximise utilisation, use efficient hardware, minimise resources provisioned, adopt serverless/managed services.',
            tips: [
              'Pillar ke-6 — ramai ingat 5 pillars je. Sustainability ditambah pada November 2021',
              'Cara reduce: use serverless (Lambda, Fargate) — no idle servers. Use auto-scaling — no over-provisioning. Choose region dengan renewable energy',
              'Serverless = sustainability win: no idle compute, AWS manages utilization',
              'Exam: "reduce environmental impact, minimize carbon footprint" → Sustainability pillar strategies',
              '6 pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability',
            ],
            keywords: ['sustainability', 'carbon footprint', 'environmental impact', '6th pillar', 'serverless', 'utilisation', 'renewable energy', '2021'],
          },
        ],
      },
    ],
  },
  {
    id: 'domain-extras',
    badge: 'BONUS · NOT IN EXAM',
    title: 'Extra Tools & Open-Source',
    subtitle: 'Bukan AWS native — tapi berguna untuk real-world. Tak keluar dalam SAA-C03.',
    variant: 'd4',
    extra: true,
    sections: [
      {
        id: 'extras-tools',
        icon: '🛠️',
        title: 'Open-Source Database Tools',
        category: 'tools',
        services: [
          {
            shortName: 'Litestream',
            fullName: 'Litestream (SQLite Streaming Replication)',
            ingat: '"SQLite backup ke S3 secara real-time — murah, mudah, auto"',
            gunaUntuk: 'Continuously replicate a SQLite database to S3 (or GCS / Azure Blob) for near-zero-cost backup and restore',
            fungsi: 'Litestream berjalan sebagai sidecar process sebelah app kau. Ia shadow-read SQLite WAL (Write-Ahead Log) dan stream setiap perubahan ke S3 secara real-time tanpa kena pause app. Bila server restart atau crash, Litestream restore snapshot + WAL terbaru dari S3 sebelum app start. Kos storage = S3 rate sahaja (~$0.023/GB). Tiada managed DB fee.',
            contohGuna: 'Deploy app di single EC2 atau fly.io dengan SQLite. Litestream stream WAL ke S3. Kalau instance crash, launch baru → Litestream restore dari S3 dalam beberapa saat → app up semula. Zero data loss.',
            scenario: 'Bukan SAA-C03 exam content. Guna dalam real-world: small SaaS, indie apps, side projects yang nak avoid RDS cost ($50–300+/month) tapi masih nak reliable backup.',
            tips: [
              'SQLite MUST be in WAL mode: PRAGMA journal_mode=WAL',
              'Litestream mesti start SEBELUM app process',
              'Config dalam litestream.yml: dbs path + S3 bucket URL',
              'Boleh guna dengan fly.io, Railway, Render, Coolify, bare EC2',
              'Max practical DB size: ~10 GB sebelum SQLite mula slow',
            ],
            docs: [
              { label: 'litestream.io', url: 'https://litestream.io' },
              { label: 'GitHub: benbjohnson/litestream', url: 'https://github.com/benbjohnson/litestream' },
            ],
            keywords: ['SQLite', 'WAL', 'S3 replication', 'sidecar', 'open-source', 'backup', 'not AWS native', 'single server', 'cheap DB'],
          },
        ],
      },
    ],
  },
]

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
    ],
  },
]
