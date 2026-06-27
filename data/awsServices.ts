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

// One exam-style trap question: the baited stem, the wrong-but-tempting answer
// (and why it's bait), and the correct pick (with the discriminating keyword).
export interface TrapQuestion {
  soalan: string  // the question stem, phrased like the real exam
  jebakan: string // the tempting wrong answer + why it's a trap
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
            sebabApa: 'IAM wujud sebab tanpa dia, semua orang yang ada akses akaun = root (boleh buat APA SAJA — padam DB, buka bil ribu dollar). IAM bagi kau pecahkan akses ikut "least privilege" — setiap user/app dapat HANYA apa yang dia perlu. Dan Role wujud khas untuk selesaikan masalah besar: macam mana app dalam EC2/Lambda nak akses S3 tanpa kita HARDCODE access key dalam code (yang nanti bocor masuk GitHub)? Jawapan: attach Role → app dapat temp creds auto-expire, takde rahsia tersimpan.',
            sifir: [
              'Explicit DENY menang atas SEMUA — Allow + Deny pada action sama = DENIED',
              'Identity & Resource policy = boleh BAGI akses (union). SCP / Permission Boundary / Session = guardrail, hanya boleh SEKAT (intersection), tak boleh bagi',
              'EC2/Lambda akses AWS service → IAM Role, BUKAN hardcode access keys',
              'Group = bakul untuk Users, BUKAN identity — tak boleh login, tak boleh jadi Principal',
              'User/Group = permanent creds. Role = temp creds (STS, auto-expire)',
              'Default = implicit DENY. Kena ada explicit Allow baru boleh buat',
            ],
            perangkap: [
              {
                soalan: 'Sebuah application berjalan dalam EC2 perlu read/write objek dalam S3 bucket. Cara PALING SELAMAT untuk bagi akses?',
                jebakan: 'Create IAM User, generate access key + secret key, simpan dalam environment variable / config file aplikasi tu. Nampak senang sebab access key memang cara biasa app authenticate.',
                betul: 'Attach IAM Role kepada EC2 instance (instance profile). Keyword "running on EC2 / running on AWS compute" → Role, BUKAN access keys. Access key dalam code/config = long-term secret yang boleh bocor; Role bagi temp creds auto-rotate.',
              },
              {
                soalan: 'Satu SCP pada OU ada Allow untuk S3, tapi IAM policy user tu takde sebut S3 langsung. User boleh akses S3?',
                jebakan: 'Boleh — SCP dah Allow S3, jadi user dapat akses. Nampak logik sebab SCP "bagi" permission.',
                betul: 'TAK BOLEH. SCP cuma guardrail — ia SEKAT, tak pernah BAGI. User masih perlu explicit Allow dalam IAM (identity) atau resource policy. SCP Allow cuma maksud "tak disekat di peringkat OU", bukan "dibenarkan". Keyword: SCP/Boundary = had maksimum, bukan pemberi akses.',
              },
            ],
            detailsLabel: 'IAM — komponen utama',
            storageDetails: 'Principal → entiti yang hantar request (User, Role, atau AWS service). Hanya Principal boleh "buat" sesuatu\nUser → identiti KEKAL untuk 1 orang/app. Ada credentials sendiri (password + access keys long-term)\nGroup → bakul untuk kumpul Users. BUKAN identity — tak boleh login, tak boleh jadi Principal. Attach policy kat sini (best practice)\nRole → identiti SEMENTARA yang di-assume. Tiada long-term creds — dapat temp creds via STS yang auto-expire\nPolicy → JSON Allow/Deny. Identity-based (attach kat User/Group/Role) atau Resource-based (attach kat S3/SQS/KMS)\nPermission Boundary → siling MAKSIMUM permission untuk satu entity (had, bukan bagi)\nMFA → faktor kedua (app/hardware token) selain password',
            mermaid: [
              {
                label: 'Policy evaluation — request DIBENARKAN atau DITOLAK? (decision tree)',
                source: `flowchart TD
  REQ["📨 Principal hantar request"] --> CTX["Kumpul SEMUA policy berkaitan<br/>identity · resource · SCP · boundary · session"]
  CTX --> DENY{"Ada EXPLICIT DENY<br/>mana-mana policy?"}
  DENY -->|"Ya"| NO["❌ DENIED<br/>explicit deny SENTIASA menang"]
  DENY -->|"Tidak"| GUARD{"SCP · Permission Boundary ·<br/>Session policy — semua BENARKAN?"}
  GUARD -->|"Tidak (ada yg tak allow)"| NO2["❌ DENIED<br/>guardrail sekat (intersection)"]
  GUARD -->|"Ya"| ALLOW{"Ada EXPLICIT ALLOW dalam<br/>identity ATAU resource policy?"}
  ALLOW -->|"Ya"| YES["✅ ALLOWED"]
  ALLOW -->|"Tidak"| IMP["❌ DENIED<br/>implicit deny = default"]`,
                caption: 'Urutan: (1) Explicit DENY mana-mana policy → terus DENIED. (2) Guardrail (SCP/Boundary/Session) mesti BENARKAN — ini intersection, hanya boleh SEKAT. (3) Mesti ada explicit ALLOW dalam identity ATAU resource policy (union). (4) Kalau tiada allow → implicit deny. INGAT exam: explicit Deny > guardrail > explicit Allow > implicit Deny. Allow + Deny pada action sama = DENIED.',
              },
              {
                label: 'Analogi — IAM = sekuriti bangunan pejabat',
                source: `flowchart LR
  subgraph B["🏢 AWS = bangunan pejabat"]
    U["👤 User<br/>= staf tetap<br/>(kad akses sendiri)"]
    G["👥 Group<br/>= jabatan<br/>(set kebenaran pintu)"]
    R["🎫 Role<br/>= pas pelawat<br/>(pinjam, auto-luput)"]
    P["📋 Policy<br/>= senarai pintu boleh buka"]
    PB["🚧 Permission Boundary<br/>= aras tertinggi lif boleh naik"]
  end
  U --> G --> P
  R --> P
  PB -.->|"siling, tak boleh lepas"| U`,
                caption: 'User = staf tetap dengan kad akses sendiri (long-term creds). Group = jabatan — kumpul staf & bagi kebenaran pintu sekali gus (attach policy kat Group). Role = pas pelawat sementara — sesiapa boleh pinjam & auto-luput (temp creds, no hardcode). Policy = senarai pintu mana boleh buka. Permission Boundary = aras tertinggi lif dibenarkan, walau kad kata boleh ke penthouse. INGAT exam: app dalam EC2 = bagi ia "pas pelawat" (Role), JANGAN salin kad staf masuk kod (hardcode access key).',
              },
            ],
            compare: [
              {
                label: 'IAM User vs Group vs Role (jangan keliru)',
                headers: ['Aspect', 'IAM User', 'IAM Group', 'IAM Role'],
                rows: [
                  ['Apa dia', 'Identiti KEKAL untuk 1 orang/app', 'Bakul kumpul Users', 'Identiti SEMENTARA yang di-assume'],
                  ['Credentials', 'Password + access keys (long-term)', '❌ Tiada (bukan identity)', 'Temp creds via STS (auto-expire)'],
                  ['Boleh login / jadi Principal?', '🟢 Ya', '❌ Tidak', 'Di-assume, bukan login terus'],
                  ['Attach policy?', 'Boleh (tapi elak)', '🟢 Ya (cara terbaik)', '🟢 Ya'],
                  ['Guna bila', 'Manusia / app tetap', 'Urus permission ramai user sekali gus', 'EC2 · Lambda · cross-account · federation'],
                ],
                takeaway: 'Group BUKAN identity — tak boleh login, tak boleh jadi Principal, cuma alat urus permission. Role = tiada long-term creds, sentiasa pilihan untuk EC2/Lambda/cross-account/federation. Hardcode access key dalam EC2 = SALAH → guna Role.',
              },
              {
                label: 'Jenis Policy — mana boleh BAGI akses, mana cuma HAD',
                headers: ['Jenis Policy', 'Attach kat', 'Fungsi', 'Boleh GRANT?'],
                rows: [
                  ['Identity-based', 'User / Group / Role', 'Apa identiti ni boleh buat', '🟢 Ya'],
                  ['Resource-based', 'Resource (S3/SQS/KMS)', 'Siapa boleh akses resource ni', '🟢 Ya (+ cross-account tanpa assume role)'],
                  ['SCP (Organizations)', 'OU / Account', 'Siling maksimum untuk account', '❌ Tak — hanya SEKAT'],
                  ['Permission Boundary', 'User / Role', 'Siling maksimum untuk satu entity', '❌ Tak — hanya SEKAT'],
                  ['Session Policy', 'Masa AssumeRole', 'Sekat lagi permission sesi tu', '❌ Tak — hanya SEKAT'],
                ],
                takeaway: 'Identity & Resource policy = boleh BAGI akses (union — allow mana-mana satu cukup). SCP/Boundary/Session = guardrail, hanya boleh SEKAT (intersection — semua mesti allow). Resource-based policy boleh bagi cross-account access TANPA assume role. Explicit deny dalam mana-mana satu menang atas semua.',
              },
            ],
            scenario: '"App dalam EC2 perlu akses S3" → IAM Role (BUKAN hardcode access keys). "Account A akses resource Account B" → assume Role cross-account ATAU resource-based policy. "Hadkan permission MAKSIMUM developer walau admin bagi lebih" → Permissions Boundary. "Sekat semua account dalam OU dari guna region tertentu" → SCP. "Explicit Deny + Allow pada action sama" → DENIED. "User luar login Google/Facebook nak akses" → Cognito/federation (BUKAN cipta IAM user). Keywords: least privilege, temporary credentials, cross-account, explicit deny, permission boundary.',
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
            docs: [
              { label: 'IAM policy evaluation logic', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html' },
              { label: 'Security best practices in IAM', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html' },
            ],
            keywords: ['users', 'groups', 'roles', 'policies', 'least privilege', 'MFA', 'principals', 'identity federation', 'IAM Role', 'IAM User', 'IAM Group', 'identity-based policy', 'resource-based policy', 'permission boundary', 'SCP', 'explicit deny', 'implicit deny', 'policy evaluation', 'service-linked role', 'role chaining', 'session policy', 'cross-account access'],
          },
          {
            shortName: 'STS',
            fullName: 'AWS Security Token Service',
            ingat: '"Pinjam IC sementara — short-lived credentials, auto-expire"',
            gunaUntuk: 'Generate temporary security credentials',
            fungsi: 'Bagi short-lived credentials (access key + secret key + session token) yang auto-expire. Pilih API ikut SIAPA yang minta: AssumeRole (cross-account / EC2 role), AssumeRoleWithSAML (enterprise AD/SAML), AssumeRoleWithWebIdentity (Google/Facebook/Cognito/OIDC). Tak perlu cipta IAM user baru.',
            sebabApa: "Wujud sebab hardcode long-term access key dalam app/script = bom jangka — kalau bocor, penyerang boleh guna selama-lamanya sampai kau rotate manual. STS bagi credentials SEMENTARA yang auto-expire (15 min sampai 12 jam), jadi walaupun bocor, ia mati sendiri. Dan untuk cross-account access, kau tak perlu cipta IAM user di setiap account — cukup AssumeRole ke role di account lain dan dapat temp creds.",
            sifir: ["STS = TEMPORARY credentials, auto-expire (15 min → max session role)", "Cross-account / EC2 role / role chaining → AssumeRole", "Enterprise SAML/AD IdP → AssumeRoleWithSAML", "Public login Google/Facebook/Cognito (OIDC) → AssumeRoleWithWebIdentity", "Role chaining = sesi auto-cap 1 jam (DurationSeconds > 1 jam akan gagal)", "Session policy = SEKAT lagi (intersection), tak boleh TAMBAH permission lebih dari role"],
            perangkap: [{"soalan": "Mobile app perlu user login guna akaun Google, lepas tu app nak akses S3 & DynamoDB terus dari device. Macam mana bagi temp AWS credentials dengan selamat?", "jebakan": "Cipta IAM user untuk app + embed access key dalam app. Nampak senang sebab terus boleh sign API call. SALAH: access key dalam app mobile = bocor terus (boleh decompile), dan ia long-term tak expire.", "betul": "STS AssumeRoleWithWebIdentity (selalu via Cognito Identity Pool). Keyword 'login Google/Facebook + temp AWS creds untuk mobile' = web identity federation, BUKAN IAM user access key."}, {"soalan": "App dalam Account A perlu baca S3 bucket dalam Account B sekali-sekala. Cara paling selamat?", "jebakan": "Buat IAM user dalam Account B, share access key ke Account A. Nampak betul sebab terus dapat akses. SALAH: long-term key kongsi merentas account = susah audit + rotate, dan kekal hidup kalau bocor.", "betul": "Buat IAM role dalam Account B, Account A panggil STS AssumeRole ke role tu → dapat temp creds yang auto-expire. Keyword 'cross-account access' = AssumeRole."}],
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
            sebabApa: 'Wujud sebab banyak syarikat dah ada Active Directory on-prem (uruskan user Windows, Group Policy, login domain) dan bila pindah workload ke AWS, mereka tak nak buang AD tu atau cipta sistem user baru. Directory Service bagi AWS "cakap bahasa AD" — EC2 Windows boleh join domain, app boleh authenticate guna AD sedia ada. Tiga rasa: bawa AD penuh ke cloud (Managed Microsoft AD), kekalkan AD on-prem & cuma proxy (AD Connector), atau AD ringkas murah untuk workload kecil (Simple AD).',
            sifir: [
              'Full AD dalam cloud / perlu trust ke on-prem → Managed Microsoft AD',
              'AD KEKAL on-prem, AWS cuma proxy auth (data tak masuk cloud) → AD Connector',
              'Kecil + murah + basic LDAP/Kerberos, no on-prem → Simple AD',
              'User external (Google/Facebook) → Cognito, BUKAN Directory Service',
              'SSO ke banyak AWS account guna AD → IAM Identity Center + Managed Microsoft AD',
            ],
            perangkap: [
              {
                soalan: 'Syarikat ada on-prem Active Directory dan nak EC2 dalam AWS authenticate guna AD tu, TAPI dasar keselamatan TAK BENARKAN sebarang directory data disimpan/replicate dalam cloud. Pilih apa?',
                jebakan: 'AWS Managed Microsoft AD dengan two-way trust ke on-prem AD. Nampak betul sebab dia "managed AD" dan boleh trust on-prem.',
                betul: 'AD Connector. Ia cuma PROXY/redirect request authentication ke on-prem AD — tiada directory data disimpan dalam cloud. Managed Microsoft AD sebenarnya cipta directory DALAM AWS (langgar dasar "no data in cloud"). Keyword "AD stays on-prem / no directory data in cloud" → AD Connector.',
              },
            ],
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
            sebabApa: 'Wujud sebab bila syarikat ada banyak AWS account (Organizations), buat IAM user dalam SETIAP account = mimpi ngeri: 50 staff × 10 account = 500 user nak urus, 500 password, susah revoke bila staff resign. IAM Identity Center bagi satu identity (dari corporate AD/Okta/Entra) → assign sekali → staff masuk semua account yang dibenarkan dengan temporary creds. Bila staff keluar, matikan SATU identity, terus hilang akses semua account. Tujuan: central workforce access + temp creds + tak payah IAM user per-account.',
            sifir: [
              '"Workforce SSO across many accounts" → IAM Identity Center, BUKAN IAM user per account',
              'Permission Set = role template → render jadi IAM role dalam tiap assigned account',
              'Creds yang dikeluarkan TEMPORARY (auto-expire via STS), bukan long-term access key',
              'Identity source: built-in / Managed Microsoft AD / external IdP (Okta, Entra) via SAML 2.0',
              'SSO ke SaaS (Salesforce, M365) → IAM Identity Center. Public social login → Cognito',
              'IAM Identity Center = FREE (bayar Managed AD je kalau guna sebagai source)',
            ],
            perangkap: [
              {
                soalan: 'Syarikat ada 15 AWS account dalam Organizations dan nak staff guna corporate credentials sedia ada untuk akses account yang dibenarkan, dengan central management. Cara terbaik?',
                jebakan: 'Cipta IAM user dalam setiap account untuk setiap staff, kumpulkan dalam Group dan attach policy. Nampak betul sebab IAM user memang cara login standard.',
                betul: 'AWS IAM Identity Center disambung ke corporate IdP. Buat IAM user per-account = ratusan user, susah urus & revoke, dan guna long-term creds. Identity Center = satu identity, central assignment, temp creds. Keyword "many accounts + workforce + central + existing corporate credentials" → IAM Identity Center.',
              },
            ],
            detailsLabel: 'IAM Identity Center — anatomy',
            storageDetails: 'Identity source → dari mana user datang: built-in directory, AWS Managed Microsoft AD, atau external IdP (Okta, Entra ID/Azure AD) via SAML 2.0.\nPermission Set → koleksi IAM policies (macam "role template") yang define apa user boleh buat. Contoh: AdministratorAccess, ReadOnly, atau custom. Permission set ni dirender jadi IAM role dalam tiap assigned account.\nAccount assignment → map (User/Group) × (Permission Set) × (AWS Account). Ni yang tentukan siapa boleh masuk account mana dengan kebenaran apa.\nAccess portal → satu URL login; user nampak semua accounts + roles yang dia boleh masuk. Creds yang dikeluarkan TEMPORARY (auto-expire via STS).',
            compare: {
              label: 'Plain IAM Users vs IAM Identity Center (SSO)',
              headers: ['Aspect', 'Plain IAM Users', 'IAM Identity Center'],
              rows: [
                ['Credentials', 'Per-account, per-user (banyak password)', '🟢 Satu identity → semua accounts'],
                ['Skala multi-account', 'Susah — create user tiap account', '🟢 Central — assign permission set ke accounts'],
                ['Access keys', 'Long-term (kekal sampai di-rotate)', '🟢 Temporary (auto-expire via STS)'],
                ['Sumber identity', 'IAM directory sahaja', 'Built-in / Managed AD / external IdP (Okta, Entra)'],
                ['SaaS SSO (Salesforce, M365)', '❌', '🟢 Ya (SAML 2.0)'],
                ['Guna bila', '1 account, sikit user, programmatic/service', 'Banyak account (Organizations), workforce SSO'],
              ],
              takeaway: 'Satu account + service/programmatic access → IAM users/roles. Banyak AWS accounts + ramai staff + nak central SSO + temporary creds → IAM Identity Center. Exam: "centrally manage workforce access across many accounts" → IAM Identity Center, BUKAN create IAM users tiap account.',
            },
            mermaid: {
              label: 'Satu badge → banyak account (corporate access card)',
              source: `flowchart TD
  U["👤 Staff login sekali<br/>(corporate badge)"] --> P["🚪 Access Portal<br/>(satu URL)"]
  P --> PS["📋 Permission Set<br/>(role template:<br/>Admin / ReadOnly)"]
  PS --> A1["🏢 AWS Account A"]
  PS --> A2["🏢 AWS Account B"]
  PS --> A3["🏢 AWS Account C"]`,
              caption: 'Satu identity → permission set (template kebenaran) → assign ke banyak account; creds temporary, auto-expire hujung session. Lawan plain IAM users = buat kunci berasingan untuk setiap pintu setiap cawangan. INGAT exam: "workforce SSO across many accounts + temporary creds" → IAM Identity Center.',
            },
            tips: [
              'IAM Identity Center + SAML 2.0: untuk SSO dari on-premises Active Directory ke AWS + third-party SaaS (Salesforce, etc.)',
              'SAML 2.0 IAM roles alone (tanpa Identity Center) = tak ada SSO portal, tak integrate SaaS apps',
              'Web identity federation = untuk PUBLIC providers (Google, Amazon, Facebook) — bukan enterprise AD',
              'Exam: "on-premises AD + SSO to AWS + SaaS apps" → IAM Identity Center with SAML 2.0',
              'IAM Identity Center features: (1) Multi-account access — centralized access ke multiple AWS accounts dalam Organization, elak repeat config Users per account. (2) SSO ke AWS applications — satu login, tak payah ingat password berasingan. (3) SSO ke Cloud-based/SaaS apps (Salesforce, Microsoft 365) via SAML 2.0. (4) SSO ke EC2 — TAPI khusus untuk EC2 WINDOWS instances (via Fleet Manager, guna existing corporate credentials, elak share admin RDP credentials) — BUKAN Linux',
              'Permission Set = "role template" — koleksi IAM policies yang Identity Center render jadi IAM role dalam setiap assigned account. Tukar permission set sekali → apply merentas semua account. Ni beza utama dari buat IAM role manual tiap account.',
              'PRICING: IAM Identity Center PERCUMA — tiada caj untuk SSO, permission sets, atau account assignments. Bayar hanya untuk Managed Microsoft AD kalau guna sebagai identity source.',
            ],
            docs: [
              { label: 'IAM Identity Center Features', url: 'https://aws.amazon.com/iam/identity-center/features/' },
              { label: 'Permission sets', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html' },
              { label: 'Seamless SSO to EC2 Windows instances', url: 'https://aws.amazon.com/blogs/security/how-to-enable-secure-seamless-single-sign-on-to-amazon-ec2-windows-instances-with-aws-sso/' },
            ],
            keywords: ['SSO', 'single sign-on', 'multiple accounts', 'federation', 'SAML 2.0', 'Active Directory', 'SaaS integration', 'EC2 Windows', 'Fleet Manager', 'permission set', 'account assignment', 'access portal', 'temporary credentials', 'workforce identity', 'Okta', 'Entra ID', 'pricing'],
          },
          {
            shortName: 'Penetration Testing',
            fullName: 'AWS Penetration Testing Policy',
            ingat: '"Boleh test sendiri — tapi ada had"',
            gunaUntuk: 'Security assessments on your own AWS infrastructure',
            fungsi: 'AWS membenarkan pelanggan menjalankan security assessments atau penetration tests terhadap infrastruktur AWS mereka sendiri tanpa kelulusan awal untuk 8 perkhidmatan yang dibenarkan. Activities yang dilarang termasuk DoS/DDoS simulation, port flooding, dan DNS zone walking.',
            sebabApa: "Wujud sebab AWS shared responsibility — pelanggan tanggungjawab security 'IN the cloud', jadi mereka MEMANG patut boleh test app mereka sendiri. Tapi sebab infra AWS dikongsi ramai tenant, AWS tetapkan policy jelas: kau boleh pentest 8 service tertentu tanpa minta kebenaran dulu, tapi aktiviti yang boleh kacau tenant lain (DoS/DDoS, flooding) tetap dilarang walaupun atas resource sendiri.",
            sifir: ["8 service pre-authorized (NO approval): EC2, RDS, Aurora, CloudFront, API Gateway, Lambda, Lightsail, Elastic Beanstalk", "DILARANG walau atas resource sendiri: DoS/DDoS sim, port/protocol/request flooding, DNS zone walking", "Test resource SENDIRI je — bukan AWS underlying infra, bukan tenant lain", "DDoS simulation perlu engage AWS DDoS Simulation Testing program berasingan", "Trap: bukan 'kena minta approval dulu', bukan juga 'boleh test semua' — 8 service spesifik"],
            perangkap: [{"soalan": "Security team nak jalankan penetration test pada EC2 & RDS production. Apa langkah pertama yang DIPERLUKAN?", "jebakan": "Buka AWS Support case / minta kelulusan AWS dulu sebelum mula. Nampak betul sebab 'ini infra AWS, mesti kena izin'. SALAH: AWS dah PRE-AUTHORIZE 8 service ni termasuk EC2 & RDS — tak perlu approval.", "betul": "Terus pentest — EC2 & RDS antara 8 service pre-authorized. Keyword 'pentest 8 permitted services' = no prior approval needed."}, {"soalan": "Pasukan nak uji ketahanan app dengan simulate DDoS volumetrik pada ALB mereka sendiri. Boleh terus buat?", "jebakan": "Boleh, sebab ia resource sendiri dan pentest dibenarkan. Nampak betul sebab 'resource saya'. SALAH: DoS/DDoS simulation DILARANG di bawah AUP walaupun atas resource sendiri.", "betul": "Tak boleh terus — DDoS simulation prohibited; kena engage AWS DDoS Simulation Testing program. Keyword 'DDoS/flooding' = prohibited activity."}],
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
            sebabApa: 'Wujud sebab setiap app perlu sistem login (sign-up, password, MFA, "log in with Google") — kalau kau bina sendiri, banyak kerja + risiko security. Dan lepas login, app mobile selalu nak akses S3/DynamoDB terus, tapi kau TAK boleh letak AWS access key dalam app (bocor terus). Cognito selesai dua-dua: User Pool handle login & bagi JWT (siapa kau), Identity Pool tukar JWT jadi temp AWS credentials via STS (boleh buat apa) — jadi app akses AWS dengan selamat tanpa hardcode key.',
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
            sifir: [
              'User Pool = AUTHENTICATION ("siapa kau") → issue JWT',
              'Identity Pool = AUTHORIZATION ("boleh akses apa AWS") → issue temp AWS creds via STS',
              'Login social/SAML tukar jadi temp AWS creds untuk S3/DynamoDB → Identity Pool',
              'Managed user directory + sign-up + MFA + password policy → User Pool',
              'Selalu pair: User Pool authenticate → Identity Pool bagi AWS creds',
            ],
            perangkap: [
              {
                soalan: 'App mobile dah login (social). Sekarang nak akses S3 terus dengan temp AWS credentials. Komponen Cognito mana?',
                jebakan: 'User Pool — sebab dia yang handle login & user, mesti dia bagi akses. SALAH: User Pool bagi JWT je, bukan AWS credentials.',
                betul: 'Identity Pool — tukar JWT/social token jadi temp AWS credentials (STS). Keyword "temp AWS credentials untuk akses S3/DynamoDB" = Identity Pool.',
              },
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
            sebabApa: 'Wujud sebab dalam setup multi-account, banyak account selalu perlu guna infrastruktur yang SAMA — satu Transit Gateway, satu set subnet, satu Route 53 Resolver rule. Kalau setiap account buat sendiri = pendua mahal + huru-hara. RAM bagi kau cipta resource SEKALI dalam satu account, lepas tu kongsi (bukan copy) ke account lain dalam Organization. Account lain guna resource sebenar tu terus. Tujuan: hapus duplikasi infrastruktur + central management + jimat kos.',
            sifir: [
              'Kongsi resource SEBENAR cross-account tanpa pendua → RAM',
              'Cuma nak connectivity antara 2 VPC → VPC Peering, BUKAN RAM',
              'Bagi akses 1 resource (S3/SQS/KMS) ke account tertentu → resource-based policy',
              'Shareable: subnet, Transit Gateway, Route 53 Resolver rule, License Manager, prefix list',
              'RAM + Organizations = create sekali, auto-share ke semua member account',
            ],
            perangkap: [
              {
                soalan: 'Syarikat ada 12 account dan mahu semua deploy resource ke dalam set subnet/VPC yang SAMA dan dikongsi (shared VPC), urus secara central. Servis mana?',
                jebakan: 'Setup VPC Peering antara VPC tiap account supaya semua boleh capai subnet pusat. Nampak betul sebab peering "sambung" VPC.',
                betul: 'AWS RAM — kongsi subnet dari account pusat ke semua member account (shared VPC). VPC Peering cuma bagi connectivity rangkaian antara VPC berasingan, bukan benarkan account lain DEPLOY ke subnet yang sama. Keyword "share subnet / shared VPC across accounts" → RAM.',
              },
            ],
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
            sebabApa: 'Wujud sebab bila syarikat membesar, satu AWS account jadi huru-hara — dev, prod, billing semua bercampur, susah nak asingkan blast radius & kawal kos. Organizations bagi kau pisah jadi banyak account (prod terpisah dari dev) tapi urus dari SATU tempat: satu bil (consolidated billing + volume discount), dan SCP sebagai "guardrail" yang halang admin account anak buat benda bahaya (cth disable CloudTrail) walau dia admin penuh dalam account dia. Tujuan: isolation + central guardrail + jimat bil.',
            sifir: [
              'SCP = RESTRICT je, TAK PERNAH grant. Kena ada IAM Allow juga (intersection)',
              'SCP TAK apply ke management/root account — member accounts sahaja',
              'Satu bil + volume discount across accounts → Consolidated Billing (free)',
              'Auto setup landing zone / multi-account baseline → Control Tower',
              'Organizations + SCP + Consolidated Billing = FREE (bayar resource je)',
            ],
            perangkap: [
              {
                soalan: 'Syarikat nak halang SEMUA account (termasuk yang akan datang) daripada guna region selain ap-southeast-1, secara org-wide. Cara paling scalable?',
                jebakan: 'Tulis IAM policy "Deny" region lain dan attach kat setiap user dalam setiap account. Nampak betul sebab IAM kawal permission.',
                betul: 'Guna SCP pada root OU / Organizations. SCP apply automatik ke semua member account (sekarang & masa depan) tanpa sentuh IAM setiap user. IAM-per-user = tak scalable & senang terlepas. Keyword "org-wide guardrail / all accounts" → SCP.',
              },
              {
                soalan: 'Selepas attach SCP yang "Allow" S3 pada satu OU, developer dalam account tu masih tak boleh akses S3. Kenapa?',
                jebakan: 'SCP tu salah configure / belum propagate. Cuba tunggu atau re-attach. Nampak betul sebab SCP dah Allow.',
                betul: 'SCP TAK GRANT akses — ia cuma tetapkan had maksimum. Developer masih perlu explicit Allow dalam IAM policy dia. SCP Allow cuma "tak disekat di peringkat OU". Keyword: SCP = guardrail, IAM = pemberi akses sebenar.',
              },
            ],
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
              'PRICING: AWS Organizations is FREE — tiada charge untuk OUs, SCPs, atau consolidated billing. Yang kau bayar adalah resources dalam setiap account. Consolidated billing percuma dan boleh dapat volume discounts (S3, EC2 reserved, dll) kerana aggregate usage.',
              'Exam: "no charge for Organizations" → free. "consolidated billing discount" → volume pricing benefit dari aggregate usage across all member accounts.',
            ],
            keywords: ['multi-account', 'SCPs', 'guardrails', 'Control Tower', 'management account', 'OU', 'management account exemption', 'SCP cannot grant', 'S3 Block Public Access SCP', 'pricing', 'free', 'consolidated billing', 'volume discount'],
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
            sebabApa: 'Wujud sebab setiap EC2 perlu firewall sendiri di pintu instance — kalau bergantung pada NACL (subnet) je, semua instance dalam subnet sama dapat rule yang sama, tak boleh tailor per-server. SG bagi kau "web boleh kena 443, DB cuma kena 3306 dari web je". Dia STATEFUL supaya kau tak payah fikir return traffic — bagi masuk = auto bagi balik, kurang silap manusia (lupa allow ephemeral port macam NACL).',
            contohGuna: 'Web server SG: allow port 443 dari 0.0.0.0/0. DB SG: allow port 3306 dari Web-SG je — DB hanya boleh diakses dari web servers, bukan dari internet.',
            sifir: [
              'SG = STATEFUL (ingat connection, reply auto-allow). NACL = stateless',
              'SG = ALLOW only — tak boleh deny IP. Nak block IP → NACL',
              'SG level = instance/ENI. NACL level = subnet',
              'Custom SG baru: inbound KOSONG (deny all), outbound allow all',
              'SG boleh reference SG lain sebagai source — "allow FROM web-sg", bukan hardcode IP',
            ],
            perangkap: [
              {
                soalan: 'EC2 punya SG: inbound allow 443, TIADA outbound rule yang allow balik ke client. Boleh ke user dapat response web?',
                jebakan: 'Tak boleh — sebab outbound kena ada rule untuk reply keluar (cara fikir NACL/stateless).',
                betul: 'BOLEH. SG stateful — sekali inbound 443 dibenarkan, reply keluar auto dibenarkan tanpa outbound rule. (Kalau ni NACL, baru kena allow ephemeral port balik.)',
              },
              {
                soalan: 'Nak BLOCK satu IP penyerang (1.2.3.4) sahaja daripada reach EC2. Guna apa?',
                jebakan: 'Add DENY rule untuk 1.2.3.4 dalam Security Group. SALAH: SG takde konsep DENY langsung.',
                betul: 'Guna NACL — letak Deny rule untuk 1.2.3.4 (nombor rule kecil). SG allow-only, jadi tak boleh block IP tertentu.',
              },
            ],
            scenario: 'Exam: "New custom SG, no rules — what is default state?" → Inbound: NO rules = ALL DENIED. Outbound: default rule = ALL ALLOWED to 0.0.0.0/0. Jangan confuse dengan default SG (berbeza).',
            tips: [
              'Custom SG default: NO inbound rules (deny all) + 1 outbound rule (allow all to 0.0.0.0/0)',
              'Default SG vs Custom SG: Default SG ada inbound rule allow dari same SG. Custom SG starts empty.',
              'Stateful = SG ingat connections. Outbound reply auto dibenarkan — tak perlu explicit outbound rule',
              'SG = allow only. Nak deny specific IP? → Guna NACL',
              'SG boleh reference SG lain sebagai source — "allow 3306 FROM web-sg" bukan hardcode IP',
              'Analogi: SG = Pengawal pejabat 👮 (stateful — ingat muka, dah bagi masuk auto bagi keluar). Lawan NACL = Kastam 🛂 (stateless — cek pasport tiap kali)',
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
            sebabApa: 'Security Group jaga setiap instance & allow-only — tak boleh block satu IP jahat, dan tak boleh tapis di peringkat subnet. NACL wujud sebagai firewall peringkat SUBNET yang boleh DENY (block IP range) & dinilai ikut nombor. Sebab dia STATELESS (tak ingat connection), dia jadi "Kastam" yang cek tiap packet dua hala — bukan "pengawal" yang ingat muka.',
            contohGuna: 'Block IP range 192.168.1.0/24 dari masuk subnet — tambah DENY rule dalam NACL (Security Groups tak boleh explicitly deny).',
            sifir: [
              'NACL = subnet level, STATELESS, boleh ALLOW & DENY, numbered rules',
              'Stateless = return traffic TAK auto-allow → kena rule inbound DAN outbound',
              'First match menang: rule nombor kecil baca dulu, lepas match terus stop',
              'Nombor rule (100, 200…) = priority/urutan baca, BUKAN kod. Guna increment 100 supaya senang selit rule baru di tengah',
              'Return reply guna ephemeral ports 1024-65535 → kena allow outbound',
              'Block satu IP jahat → NACL (SG tak boleh deny). SG = stateful, allow-only, instance level',
            ],
            perangkap: [
              {
                soalan: 'NACL: Inbound 100 "allow all", Outbound 200 "deny SSH(22)". Statement: "effectively allows SSH connectivity" — True/False?',
                jebakan: 'TRUE — sebab inbound dah allow all, nampak macam SSH boleh masuk = OK. Itu cara fikir STATEFUL (Security Group).',
                betul: 'FALSE. NACL stateless — server reply SSH kena keluar ikut outbound, tapi outbound DENY SSH → reply tersekat, connection mati. Stateless = kena allow DUA hala.',
              },
              {
                soalan: 'Outbound NACL: rule 100 "DENY all traffic", rule 200 "ALLOW SSH". SSH reply boleh keluar?',
                jebakan: 'Boleh — sebab ada rule 200 Allow SSH. SALAH: rule 200 tak pernah dibaca.',
                betul: 'TAK boleh. First-match: rule 100 (nombor kecil) baca dulu, "DENY all" terus match & stop. Letak ALLOW di nombor lebih KECIL dari DENY kalau nak ia menang.',
              },
            ],
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
              'Analogi: NACL = Kastam 🛂 (stateless — cek pasport tiap kali lalu, cepat lupa, jaga sempadan subnet). SG = Pengawal pejabat 👮 (stateful — ingat muka, auto lepas balik, jaga pintu instance)',
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
            sebabApa: 'Wujud sebab penyerang hantar request HTTP yang nampak normal tapi ada niat jahat — SQL injection (curi DB), XSS (curi session user), atau bot spam ribuan request. Security Group/NACL tak boleh tengok ISI request HTTP (mereka Layer 3/4 je). WAF duduk depan ALB/CloudFront/API GW, baca setiap HTTP request Layer 7, dan block ikut rules (managed rule groups untuk CVE/OWASP, rate-based untuk throttle bot) SEBELUM ia sampai app.',
            contohGuna: 'API kena SQL injection attack — deploy WAF dengan AWS Managed Rules kat ALB atau CloudFront. Boleh rate limit 1000 req/IP per minit',
            sifir: [
              'WAF = Layer 7 (HTTP/S) — block SQLi, XSS, bad bots, rate limit',
              'Pasang kat: CloudFront, ALB, API Gateway, AppSync, Cognito',
              'Rate-based rule = throttle IP lebih threshold. URI-specific = throttle endpoint mahal je',
              'WAF = web exploit (L7). Shield = DDoS (L3/4). Network Firewall = traffic VPC (L3-7)',
              'Managed rule groups = auto block known exploit/CVE/OWASP Top 10',
            ],
            perangkap: [
              {
                soalan: 'API endpoint /api/report (computationally expensive) kena spam, tapi endpoint lain elok. Nak throttle yang mahal je.',
                jebakan: 'Rate-based rule biasa untuk seluruh web ACL. SALAH: itu limit SEMUA endpoint, termasuk yang ringan = pengguna sah pun kena.',
                betul: 'URI-specific rate-based rule — scope rate limit pada /api/report je. Keyword "throttle specific expensive endpoint" = URI-specific rate-based rule.',
              },
            ],
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
            sebabApa: 'Wujud sebab DDoS = penyerang banjirkan service kau dengan jutaan request/packet sampai server tumbang (pengguna sah tak boleh masuk). Kau seorang tak mampu lawan trafik berjuta — kena infrastruktur besar. Shield Standard auto-lindung semua pelanggan AWS dari DDoS L3/4 (SYN flood, UDP reflection) PERCUMA tanpa setup. Shield Advanced tambah lindungan L7 berskala besar + DDoS Response Team (DRT) + cost protection (bil tak melonjak masa diserang) untuk yang high-risk.',
            contohGuna: 'Website kena volumetric DDoS — Shield Standard protect automatically. Enterprise nak protection + cost protection + DRT = Shield Advanced',
            sifir: [
              'Shield Standard = FREE, auto, L3/4 DDoS — takyah buat apa-apa',
              'Shield Advanced = $3000/bulan: L3/4/7, DRT 24/7, cost protection, WAF percuma',
              'WAF = web exploit L7 (SQLi/XSS). Shield = DDoS. Jangan campur',
              'Keyword Shield Advanced: "DRT", "cost protection", "real-time visibility", "maximum DDoS"',
            ],
            perangkap: [
              {
                soalan: 'Website kena SQL injection + XSS. Pasang Shield untuk block?',
                jebakan: 'Shield Advanced — sebab dia maximum protection, mesti cover semua serangan. SALAH: Shield untuk DDoS, bukan web exploit macam SQLi/XSS.',
                betul: 'AWS WAF — block SQLi/XSS (Layer 7 web exploit). Shield = DDoS sahaja. Keyword "SQL injection/XSS" = WAF.',
              },
              {
                soalan: 'Filter SEMUA outbound traffic VPC ikut domain name (allow *.amazonaws.com je), IDS/IPS. WAF?',
                jebakan: 'WAF — sebab dia firewall, mesti boleh filter traffic. SALAH: WAF Layer 7 HTTP request je, bukan traffic VPC umum.',
                betul: 'AWS Network Firewall — inspect/filter semua traffic VPC (L3-7), domain filtering, Suricata IDS/IPS. Keyword "egress/domain filter VPC-wide" = Network Firewall.',
              },
            ],
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
            sebabApa: "Wujud sebab SG/NACL terlalu kasar (cuma IP & port, tak faham domain atau isi packet) dan WAF cuma jaga HTTP web app — tiada apa yang inspect SEMUA traffic masuk/keluar VPC secara mendalam. Kalau nak buat sendiri, kena urus EC2 firewall appliance (IDS/IPS) yang pening nak scale & maintain. Network Firewall = managed firewall VPC-wide guna Suricata rules, boleh filter ikut domain (allow *.amazonaws.com je) dan buat egress control tanpa urus appliance sendiri.",
            sifir: ["Network Firewall = inspect traffic VPC, Layer 3-7. WAF = HTTP web je (Layer 7)", "Dua engine: stateless (macam NACL, priority order) + stateful (Suricata rules)", "Domain/URL filtering (TLS SNI / HTTP host) → egress control", "Deploy dalam dedicated firewall subnet; route table hala traffic VPC melaluinya", "Keyword 'domain filtering / egress / IDS-IPS VPC-wide' → Network Firewall, BUKAN WAF"],
            perangkap: [{"soalan": "Compliance: SEMUA outbound traffic dari VPC kena disekat kecuali ke domain yang diluluskan (cth *.amazonaws.com). Servis mana?", "jebakan": "AWS WAF dengan rule block domain. Nampak betul sebab WAF pun boleh filter request. SALAH: WAF cuma inspect HTTP request ke CloudFront/ALB/API GW — bukan egress traffic VPC-wide.", "betul": "AWS Network Firewall dengan stateful domain-list rule. Keyword 'filter outbound VPC ikut domain / egress control' = Network Firewall."}, {"soalan": "Nak block SQL injection & XSS pada request ke aplikasi web di belakang ALB. Servis mana?", "jebakan": "Network Firewall sebab dia firewall canggih Layer 3-7. Nampak betul sebab 'firewall'. SALAH: SQLi/XSS = web app exploit Layer 7, itu kerja WAF.", "betul": "AWS WAF (Web ACL + managed rule group). Keyword 'SQLi/XSS pada HTTP/web app' = WAF, bukan Network Firewall."}],
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
            sebabApa: "Wujud sebab bila EC2 dalam private subnet tak boleh terima traffic, kau tertanya-tanya 'SG ke NACL yang block?' — tanpa log, kau buta. VPC Flow Logs rakam metadata setiap traffic (siapa→siapa, port, ACCEPT/REJECT) supaya kau boleh nampak record REJECT dan tahu apa yang sekat. Ia dikumpul DI LUAR path network jadi takde kesan latency/throughput — kau dapat visibility percuma tanpa slow down traffic.",
            sifir: ["Flow Logs = METADATA je (srcaddr, dstaddr, port, protocol, ACCEPT/REJECT) — BUKAN payload", "3 capture level: VPC (semua ENI), Subnet, single ENI", "3 destination: CloudWatch Logs, S3 (Athena), Data Firehose", "action = REJECT → cari ni bila 'traffic tak sampai, SG/NACL block?'", "Nak isi packet (payload/forensics) → Traffic Mirroring, BUKAN Flow Logs", "Dikumpul luar path network → zero impact latency/throughput"],
            perangkap: [{"soalan": "EC2 dalam private subnet tak terima traffic. Kau perlu tahu sama ada SG atau NACL yang sekat, tanpa jejas prestasi. Apa kau enable?", "jebakan": "Traffic Mirroring untuk capture packet dan lihat apa berlaku. Nampak betul sebab 'capture traffic'. SALAH: Traffic Mirroring salin full packet (mahal + overhead) — terlebih untuk sekadar tahu ACCEPT/REJECT.", "betul": "VPC Flow Logs — cari record action = REJECT. Keyword 'rule mana yang block / audit flow / tanpa overhead' = Flow Logs (metadata)."}, {"soalan": "Pasukan security nak inspect isi sebenar packet (payload) untuk IDS/IPS forensics dalam VPC. Guna apa?", "jebakan": "VPC Flow Logs, hantar ke OpenSearch untuk analisa. Nampak betul sebab Flow Logs pun untuk security analysis. SALAH: Flow Logs metadata je — takde payload, tak boleh buat deep packet inspection.", "betul": "Traffic Mirroring (copy ke monitoring appliance/NLB). Keyword 'packet content/payload/deep inspection' = Traffic Mirroring, bukan Flow Logs."}],
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
            sebabApa: 'Wujud sebab serangan jahat tersembunyi dalam jutaan baris log (CloudTrail, VPC Flow, DNS) — manusia takkan perasan EC2 tiba-tiba call ke IP crypto-mining atau API calls pelik dari negara asing. GuardDuty baca semua log tu guna ML + threat intel feeds, detect anomali, dan alert — TANPA kau install agent atau setup apa-apa. Jadi kau dapat "mata-mata" automatik yang jaga 24/7.',
            scenario: '"EC2 buat unusual API calls ke cryptocurrency mining" → GuardDuty detect and alert. Tak perlu install agents.',
            sifir: [
              'GuardDuty = DETECT threat dari LOGS (CloudTrail/VPC Flow/DNS), ML, NO agent',
              'GuardDuty = detect. Detective = investigate (forensics). Beza ni selalu kena tanya',
              'Inspector = CVE/vuln scan. Macie = PII dalam S3. GuardDuty = aktiviti jahat dari logs',
              'Security Hub = central dashboard kumpul semua finding + compliance score (bukan dia detect)',
              'Keyword GuardDuty: "unusual activity", "crypto-mining", "compromised instance", "no agent"',
            ],
            perangkap: [
              {
                soalan: 'EC2 tiba-tiba sambung ke IP crypto-mining + buat API calls luar biasa. Service mana detect?',
                jebakan: 'Inspector — sebab dia security scan untuk EC2, mesti dia jumpa. SALAH: Inspector scan CVE/vuln software, bukan aktiviti masa nyata.',
                betul: 'GuardDuty — detect aktiviti jahat (crypto-mining, unusual API) dari logs guna ML. Keyword "unusual activity/compromised" = GuardDuty.',
              },
              {
                soalan: 'GuardDuty dah flag satu finding. Sekarang nak SIASAT scope & root cause serangan, visualize relationship. Guna apa?',
                jebakan: 'GuardDuty sendiri — sebab dia yang detect, mesti dia ada detail. SALAH: GuardDuty detect je, bukan tool siasatan.',
                betul: 'Amazon Detective — behavior graph untuk investigate finding & root cause. GuardDuty = detect, Detective = investigate.',
              },
            ],
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
            sebabApa: "Wujud sebab bila GuardDuty bagi alert 'EC2 ni buat benda pelik', kau masih tertanya 'apa sebenarnya jadi, dari mana, scope dia sampai mana?' — nak sambung sendiri CloudTrail + VPC Flow Logs + finding manual = mimpi ngeri. Detective auto kumpul semua log tu dan guna ML/graph analysis untuk lukis timeline & hubungan antara resource, jadi kau boleh siasat root cause selepas insiden tanpa korek log satu-satu.",
            sifir: ["Detective = POST-INCIDENT investigation (siasat). GuardDuty = REAL-TIME detection (cari)", "Auto kumpul: CloudTrail, VPC Flow Logs, GuardDuty findings, EKS audit logs", "Guna behavior graph → visualize hubungan resource + timeline", "Keyword 'investigate finding / root cause / scope / visualize attack' → Detective", "Bukan Inspector (vuln scan), bukan Macie (PII S3), bukan GuardDuty (detect)"],
            perangkap: [{"soalan": "GuardDuty flag aktiviti mencurigakan pada EC2. Pasukan nak faham scope & root cause serangan dengan visualkan hubungan & timeline. Servis mana?", "jebakan": "GuardDuty sendiri — sebab dia yang detect, mesti boleh tunjuk butiran penuh. Nampak betul sebab 'dah ada finding'. SALAH: GuardDuty cuma detect & alert, bukan tools siasat mendalam.", "betul": "Amazon Detective — kumpul log + behavior graph untuk root cause. Keyword 'investigate / root cause / visualize / scope finding' = Detective."}],
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
            sebabApa: 'Wujud sebab software kau ada ribuan package/library — mana satu ada known vulnerability (CVE)? Tak mungkin check manual, dan CVE baru keluar setiap hari. Inspector scan EC2/ECR/Lambda secara BERTERUSAN — auto re-scan bila CVE baru keluar atau code berubah — jadi kau tahu "package X versi Y aku ada lsubang" sebelum penyerang jumpa. Beza dengan GuardDuty: Inspector cari LUBANG (potensi), GuardDuty cari PENCEROBOH (sedang berlaku).',
            scenario: '"Audit EC2 instances untuk known CVEs dan security misconfigurations" → Amazon Inspector. "Scan container image dalam ECR sebelum deploy untuk vulnerability" → Inspector ECR scanning. Bukan GuardDuty (yang untuk active threats dari logs).',
            sifir: [
              'Inspector = CVE/vulnerability scan, target EC2 + ECR images + Lambda',
              'CONTINUOUS — auto re-scan bila CVE baru atau resource berubah',
              'Inspector cari LUBANG (vuln/CVE). GuardDuty cari PENCEROBOH (aktiviti jahat)',
              'Scan ECR image SEBELUM deploy = Inspector. Keyword "CVE/patch/vulnerability" = Inspector',
              'Bukan Macie (PII S3), bukan Detective (siasat finding)',
            ],
            perangkap: [
              {
                soalan: 'Nak scan container image dalam ECR untuk known CVE sebelum deploy ke production. Guna apa?',
                jebakan: 'GuardDuty — sebab dia threat detection, mesti detect benda bahaya dalam image. SALAH: GuardDuty baca logs runtime, tak scan image untuk CVE.',
                betul: 'Amazon Inspector (ECR scanning). Keyword "CVE/vulnerability/scan image" = Inspector. GuardDuty untuk aktiviti jahat masa nyata.',
              },
            ],
            tips: [
              'Inspector = vulnerability/CVE scan (software lemah). GuardDuty = threat detection (aktiviti jahat dari logs). Beza ni THE exam trap',
              '3 target: EC2, ECR container images, Lambda functions. Aktif sekali → auto enroll semua (Lambda CODE scanning optional, enable bila-bila)',
              'EC2 scan guna SSM agent ATAU EBS snapshot (agentless/hybrid mode) — detect CVE, OS + language package vuln, dan network reachability',
              'CONTINUOUS, bukan one-off — auto re-scan bila ada CVE baru atau resource berubah, generate findings',
              'Findings boleh push ke Security Hub + EventBridge untuk automated remediation',
              'Bukan Macie (PII dalam S3). Bukan Detective (siasat finding). Inspector = "apa software aku ada known vulnerability?"',
              'Analogi: Inspector = Puspakom 🔧 — periksa "kereta" (EC2/ECR/Lambda) cari karat/defect (CVE/vulnerability) sebelum lulus jalan; continuous = auto re-check tiap kali ada recall (CVE) baru keluar.',
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
            sebabApa: 'Wujud sebab orang tersilap upload data sensitif (IC, credit card, passport, credentials) ke S3 tanpa sedar — dan kalau bucket tu public, habis bocor + langgar GDPR/PCI. Kau ada beribu bucket, mustahil check manual setiap object. Macie guna ML + pattern matching scan S3 cari PII, dan alert bila bucket jadi public atau ada data sensitif. Jadi kau jumpa kebocoran SEBELUM jadi insiden.',
            scenario: '"Audit S3 buckets untuk cari data sensitif yang ter-upload secara tak sengaja" → Amazon Macie. Keyword: PII, sensitive data, S3 data discovery.',
            sifir: [
              'Macie = cari PII/sensitive data dalam S3 SAHAJA (bukan RDS/EBS)',
              'Detect: PII (IC, passport), financial (credit card), credentials, IP',
              'Keyword Macie: "PII", "sensitive data", "GDPR", "S3 data discovery"',
              'Macie = data dalam S3. GuardDuty = threat dari logs. Inspector = CVE software',
            ],
            perangkap: [
              {
                soalan: 'Compliance nak pastikan takde credit card / IC tersilap upload ke S3 buckets syarikat. Guna apa?',
                jebakan: 'GuardDuty — sebab dia monitor S3 (S3 Protection) untuk benda mencurigakan. SALAH: GuardDuty detect AKSES jahat, bukan KANDUNGAN PII.',
                betul: 'Amazon Macie — scan KANDUNGAN object S3 cari PII/sensitive data guna ML. Keyword "PII/sensitive data dalam S3" = Macie.',
              },
            ],
            tips: [
              'Macie KHUSUS untuk S3 — bukan untuk RDS, EBS, atau services lain',
              'Detect: PII (nama, IC, passport), financial data (credit card), credentials, intellectual property',
              'Dua jenis discovery: (1) Automated sensitive data discovery — continuous sampling. (2) Sensitive data discovery jobs — targeted, scheduled',
              'Macie generate dua jenis findings: Policy findings (bucket jadi public/misconfigured) + Sensitive data findings (PII found in object)',
              'Integrate dengan EventBridge dan Security Hub untuk automated remediation workflow',
              'Exam: "detect PII or sensitive data accidentally uploaded to S3" → Amazon Macie. Bukan GuardDuty (threats), bukan Inspector (vulnerabilities)',
              'Analogi: Macie = anjing pengesan 🐕 di airport — hidu "beg" (S3 objects) cari barang sensitif (PII, passport, credit card). Tapi dia hanya kawal terminal S3 — bukan RDS/EBS.',
            ],
            keywords: ['PII detection', 'sensitive data', 'S3', 'ML-based', 'data privacy', 'GDPR', 'data discovery', 'policy findings'],
          },
          {
            shortName: 'Penetration Testing',
            fullName: 'AWS Penetration Testing Policy',
            ingat: '"AWS bagi pentest 8 services — tak perlu minta kebenaran dulu"',
            gunaUntuk: 'Understand AWS policy on security testing and acceptable use',
            fungsi: 'AWS membenarkan customers jalankan security assessments dan penetration tests terhadap AWS infrastructure mereka TANPA kelulusan awal untuk 8 services: EC2, RDS, CloudFront, Aurora, API Gateway, Lambda, Lightsail, Elastic Beanstalk. Aktiviti yang DILARANG: DoS/DDoS simulation, DNS zone walking, port/protocol/request flooding.',
            sebabApa: "Wujud sebab AWS shared responsibility — pelanggan tanggung security 'IN the cloud', jadi memang patut boleh test app sendiri. Tapi sebab infra AWS dikongsi ramai tenant, AWS tetapkan policy jelas: boleh pentest 8 service tertentu tanpa minta izin dulu, tapi aktiviti yang boleh kacau tenant lain (DoS/DDoS, flooding) tetap dilarang walaupun atas resource sendiri.",
            sifir: ["8 service pre-authorized (NO approval): EC2, RDS, Aurora, CloudFront, API Gateway, Lambda, Lightsail, Elastic Beanstalk", "DILARANG: DoS/DDoS simulation, port/protocol/request flooding, DNS zone walking", "Bukan 'kena minta approval dulu', bukan 'boleh test semua' — 8 service spesifik", "Test resource SENDIRI je, bukan AWS underlying infra / tenant lain", "AUP (Acceptable Use Policy) = dokumen tetap apa boleh/tak boleh"],
            perangkap: [{"soalan": "Apa pendirian (position) AWS terhadap penetration testing oleh pelanggan?", "jebakan": "AWS tak benarkan pentest langsung sebab infra dikongsi. Nampak masuk akal sebab 'jaga tenant lain'. SALAH: AWS memang benarkan pentest pada service tertentu.", "betul": "AWS benarkan pentest pada SETENGAH resource (8 service) TANPA kelulusan awal — bukan semua, bukan tiada. Keyword '8 permitted services / no prior authorization'."}, {"soalan": "Pasukan nak pentest API Gateway + Lambda mereka sendiri. Perlu buka support case minta izin AWS dulu?", "jebakan": "Ya, mesti minta approval AWS dulu sebab ia servis AWS. Nampak betul sebab 'cari selamat'. SALAH: API Gateway & Lambda dalam senarai 8 service pre-authorized.", "betul": "Tak perlu — terus pentest, kedua-duanya pre-authorized. Keyword '8 permitted services = no prior approval'."}],
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
            sebabApa: 'Wujud sebab encrypt data sendiri = mimpi ngeri: kau kena simpan kunci di mana? Kalau kunci bocor, habis semua data. Kalau kunci hilang, data tak boleh baca selamanya. KMS pegang kunci master dalam hardware AWS (kunci master TAK PERNAH keluar KMS), audit setiap guna dalam CloudTrail, dan buat envelope encryption (kunci data di-encrypt dengan kunci master) supaya kau encrypt data besar laju tanpa hantar semua ke KMS. Jadi kau dapat encryption tanpa pening urus kunci.',
            contohGuna: 'Encrypt S3, RDS, EBS — enable SSE-KMS. Semua penggunaan key di-audit dalam CloudTrail. KMS key rotation auto setahun sekali',
            sifir: [
              'Envelope encryption = data key encrypt data, KMS master key encrypt data key (master tak pernah keluar KMS)',
              'CMK (Customer Managed) = full control: custom policy + rotation + audit. Exam keyword "lifecycle/rotation/access control"',
              'AWS Managed key = auto, terhad 1 service, TAK boleh customize. AWS Owned = free, tak boleh audit',
              'Symmetric = encrypt+decrypt (default, AWS services). Asymmetric = digital signing / public-private',
              'Multi-Region key = same key material across regions, elak cross-region API call',
              'FIPS 140-2 Level 3 + dedicated hardware + AWS tak boleh access = CloudHSM, BUKAN KMS',
            ],
            perangkap: [
              {
                soalan: 'Perlu "comprehensive lifecycle management, key rotation, auditing & access control" untuk encryption key. Guna apa?',
                jebakan: 'AWS Managed Key — sebab dia pun auto-rotate & ada dalam account kau. SALAH: AWS Managed Key TAK boleh customize policy/rotation.',
                betul: 'Customer Managed Key (CMK). Keyword "lifecycle/custom rotation/access control" = CMK. AWS Managed key restricted, tak boleh kau kawal.',
              },
              {
                soalan: 'Regulatory wajib dedicated single-tenant hardware, FIPS 140-2 Level 3, AWS langsung tak boleh akses kunci. KMS?',
                jebakan: 'KMS dengan CMK — sebab CMK kau yang kawal penuh. SALAH: KMS multi-tenant, FIPS Level 2, AWS still urus HSM.',
                betul: 'CloudHSM — single-tenant dedicated hardware, FIPS 140-2 Level 3, AWS tak boleh access. Keyword "dedicated HW + Level 3 + exclusive control" = CloudHSM.',
              },
            ],
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
            sebabApa: 'Wujud sebab developer suka hardcode password dalam code/env var → bila code bocor (GitHub leak), password bocor. Dan tukar password manual = kena update semua app, leceh, jadi orang malas rotate. Secrets Manager simpan secret encrypted, app retrieve masa runtime (tak pernah dalam code), dan AUTO-ROTATE (Lambda tukar password di RDS + update secret serentak) tanpa downtime — jadi rotation jadi senang, orang buat betul-betul.',
            contohGuna: 'Lambda function perlu DB password — jangan letak dalam env var atau code. Store dalam Secrets Manager, Lambda retrieve masa runtime. Auto-rotate setiap 30 hari',
            sifir: [
              'Secrets Manager = AUTO-ROTATE built-in (Lambda). Parameter Store = TAKDE native rotation',
              'Auto-rotate DB credentials (RDS/Aurora/Redshift/DocumentDB) → Secrets Manager. Itu keyword pembeza',
              'DB luar/on-prem/3rd-party? Masih Secrets Manager — tulis CUSTOM Lambda rotation function',
              'Parameter Store Standard = FREE. Secrets Manager = bayar per secret + per API call',
              'Config murah / tak perlu rotate (AMI ID, license) → Parameter Store (SecureString utk encrypt)',
              'Secrets Manager always KMS-encrypted + cross-region replicate built-in',
              'PRICING: $0.40/secret/bulan + $0.05/10,000 API call (us-east-1). Free 30-hari trial. Parameter Store Standard FREE — itu sebab config biasa letak Parameter Store',
            ],
            scenario: 'Formula poket: "store password / API key / DB credentials" + "rotate automatically / rotate regularly / every N days" + "least operational overhead" → AWS Secrets Manager (configure automatic rotation). BUKAN Parameter Store (takde native rotation, kena code sendiri). Config biasa tak rahsia (AMI ID, URL, license) + kos rendah → SSM Parameter Store Standard (FREE).',
            perangkap: [
              {
                soalan: 'Nak simpan DB password dan AUTO-ROTATE setiap 30 hari tanpa ubah app. Parameter Store SecureString?',
                jebakan: 'Parameter Store SecureString — sebab dia free & encrypted dengan KMS, jimat. SALAH: Parameter Store takde native rotation.',
                betul: 'Secrets Manager — satu-satunya yang ada built-in auto-rotation (Lambda). Keyword "auto-rotate credentials" = Secrets Manager.',
              },
              {
                soalan: 'Nak simpan AMI ID, config value, license code yang jarang berubah, kos serendah mungkin. Secrets Manager?',
                jebakan: 'Secrets Manager — sebab dia memang untuk simpan benda rahsia, selamat. SALAH: bayar per secret, mahal untuk config biasa.',
                betul: 'SSM Parameter Store (Standard tier FREE). Config + tak perlu rotation → Parameter Store. Pakai SecureString kalau perlu encrypt.',
              },
              {
                soalan: 'Database on-premises (bukan RDS) perlu credentials di-rotate auto setiap 90 hari, least operational overhead. Boleh guna Secrets Manager ke?',
                jebakan: 'Tak boleh — Secrets Manager rotation untuk RDS/Aurora je, jadi pilih Parameter Store + cron sendiri. SALAH: itu lagi banyak kerja.',
                betul: 'Boleh — Secrets Manager + CUSTOM Lambda rotation function untuk database non-AWS/on-prem. Native rotation untuk RDS/Aurora/Redshift/DocumentDB; selain tu tulis Lambda. Tetap "least operational overhead" vs build sistem rotation dari kosong.',
              },
            ],
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
              { label: 'Rotate secrets (custom Lambda)', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html' },
            ],
            keywords: ['auto-rotation', 'credentials', 'API keys', 'no hardcoded secrets', 'Lambda integration', 'custom rotation', 'on-premises database', 'Parameter Store', 'SecureString', 'cross-region replication', 'KMS', 'RDS', 'Aurora', 'DocumentDB', 'pricing', 'least operational overhead'],
          },
          {
            shortName: 'S3 Object Lock',
            fullName: 'Amazon S3 Object Lock',
            ingat: '"Lock file — tak boleh delete atau ubah (WORM)"',
            gunaUntuk: 'WORM compliance, prevent deletion/modification',
            fungsi: 'Menghalang objek S3 dari dipadam atau di-overwrite untuk tempoh tetap (retention period) atau selamanya (legal hold) — WORM model untuk pematuhan kawal selia. WAJIB Versioning ON pada bucket.',
            sebabApa: "Wujud sebab regulator (SEC 17a-4, FINRA) wajibkan rekod kewangan/perubatan disimpan tak boleh diubah atau dipadam untuk bertahun — dan masalahnya admin (atau penyerang yang curi kredential admin) boleh padam objek S3 macam biasa. Object Lock kunci objek dalam model WORM (Write Once Read Many): sekali lock, tiada sesiapa — termasuk root dalam Compliance mode — boleh padam/ubah sampai retention tamat. Jadi kau penuhi audit/compliance tanpa risiko padam tak sengaja atau niat jahat.",
            sifir: ["Object Lock WAJIB Versioning ON dulu", "Compliance mode = TIADA sesiapa boleh padam (root pun tak), sampai retention tamat", "Governance mode = boleh override KALAU ada s3:BypassGovernanceRetention + header", "Legal Hold = TAKDE expiry, independent dari retention, sampai di-remove manual", "Retention boleh EXTEND, tak boleh SHORTEN dalam Compliance mode", "Keyword 'SEC 17a-4/FINRA/mutlak tak boleh ubah' = Compliance mode"],
            perangkap: [{"soalan": "Rekod kewangan kena simpan 7 tahun, mutlak tak boleh dipadam atau diubah oleh sesiapa termasuk admin/root, untuk patuhi SEC 17a-4. Setting mana?", "jebakan": "Governance mode dengan retention 7 tahun — sebab dia pun halang delete. Nampak betul sebab 'ada retention'. SALAH: Governance boleh di-override oleh user dengan s3:BypassGovernanceRetention, jadi tak mutlak.", "betul": "Compliance mode + retention 7 tahun. Keyword 'tiada sesiapa termasuk root, regulatory' = Compliance, BUKAN Governance."}, {"soalan": "Dokumen kena di-hold untuk litigation, tapi tak tahu bila siasatan habis (tiada tarikh tamat). Guna apa?", "jebakan": "Compliance mode dengan retention period panjang. Nampak betul sebab 'tak boleh padam'. SALAH: Compliance mode WAJIB ada Retain Until Date (tarikh tetap), bukan hold terbuka.", "betul": "Legal Hold — takde expiry, kekal sampai di-remove manual. Keyword 'litigation / tak tahu bila habis / no end date' = Legal Hold."}],
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
            sebabApa: "Wujud sebab arkib jangka panjang dalam Glacier pun perlu jaminan compliance — regulator nak bukti retention policy TAK BOLEH diubah oleh sesiapa, walaupun admin sendiri. Vault Access Policy biasa boleh diedit bila-bila (tak cukup untuk audit). Vault Lock Policy pula, sekali locked, jadi IMMUTABLE selamanya — enforce WORM/retention secara mutlak. Ada 24-jam in-progress window supaya kau boleh test policy dulu sebelum commit, elak tersilap kunci policy yang salah.",
            sifir: ["Vault Lock Policy = IMMUTABLE lepas locked (compliance/WORM/retention)", "Vault Access Policy = MUTABLE, untuk access control biasa (boleh edit bila-bila)", "Lock 2 langkah: initiate (in-progress, 24 jam test) → complete guna lock ID", "Tak complete dalam 24 jam → policy auto-deleted", "Compliance/retention → Vault Lock, BUKAN Vault Access", "'Legal hold' = S3 Object Lock feature, BUKAN Glacier Vault"],
            perangkap: [{"soalan": "Arkib Glacier kena ada retention policy yang TAK BOLEH diubah oleh sesiapa untuk compliance. Policy mana?", "jebakan": "Vault Access Policy dengan deny delete — sebab dia kawal access. Nampak betul sebab 'control access'. SALAH: Vault Access Policy MUTABLE, boleh diedit/buang bila-bila → tak penuhi compliance immutable.", "betul": "Vault Lock Policy — IMMUTABLE lepas locked. Keyword 'tak boleh diubah / WORM / compliance retention' = Vault Lock Policy."}, {"soalan": "Kau dah initiate Vault Lock policy tapi belum complete dalam 24 jam. Apa jadi?", "jebakan": "Policy auto-locked sebab dah initiate. Nampak betul sebab 'dah mula proses lock'. SALAH: lock cuma sah lepas langkah COMPLETE guna lock ID.", "betul": "Policy auto-DELETED — kena initiate semula. Keyword '24-hour in-progress window, complete dengan lock ID' = belum lock kalau tak complete."}],
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
            sebabApa: "Wujud sebab data warehouse simpan data sensitif berskala besar — perlu encryption at rest (disk) DAN in transit (network), dan selalunya kena share data dengan account/team lain tanpa nak buat ETL atau salin data (mahal + lambat + senang basi). Redshift selesai dua-dua: KMS encrypt data on-disk (AES-256), SSL/TLS encrypt traffic client↔cluster, dan DataShare bagi cross-account access ke data LIVE tanpa duplicate atau pipeline ETL.",
            sifir: ["KMS = encrypt DATA AT REST (disk). SSL/TLS = encrypt DATA IN TRANSIT (network)", "Redshift TIDAK guna EBS — manage storage sendiri", "DataShare = cross-account sharing, NO ETL, NO data duplication (data live)", "'Encrypt unencrypted Redshift at rest' → enable KMS", "Pindah cluster ke private subnet = network security, BUKAN encryption"],
            perangkap: [{"soalan": "Redshift cluster sedia ada tak encrypted. Audit mahu data AT REST di-encrypt. Apa kau buat?", "jebakan": "Pindahkan cluster ke private subnet supaya tak terdedah. Nampak betul sebab 'lebih selamat'. SALAH: private subnet = network isolation, bukan encryption — data on-disk masih plaintext.", "betul": "Enable encryption guna KMS (AES-256) untuk data at rest. Keyword 'encrypt at rest / data on disk' = KMS, bukan network/subnet."}, {"soalan": "Team analytics dalam account lain perlu query data dalam Redshift kau secara live, tanpa salin atau pipeline. Cara mana?", "jebakan": "Export data ke S3, copy ke account lain, COPY masuk Redshift mereka. Nampak betul sebab 'mereka dapat data'. SALAH: itu duplication + ETL, data jadi basi & mahal — bercanggah dengan 'tanpa salin/live'.", "betul": "Redshift DataShare — cross-account share data live tanpa ETL/duplication. Keyword 'share cross-account, no ETL, no copy' = DataShare."}],
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
            sebabApa: "Wujud sebab bila resource hilang atau ada perubahan mencurigakan, soalan pertama ialah 'SIAPA buat ni, bila, dari IP mana?' — tanpa log, mustahil nak siasat atau buktikan untuk audit/compliance. CloudTrail rakam SETIAP API call dalam account (user, masa, source IP, hasil) secara automatik, jadi kau ada jejak audit lengkap untuk forensics & compliance. Management event default ON dan free, jadi visibility asas dah ada tanpa setup.",
            sifir: ["CloudTrail = WHO did WHAT (API audit). CloudWatch = WHAT happening NOW (metrics)", "Management events = default ON + FREE (CreateBucket, TerminateInstances...)", "Data events = OFF by default, ada kos (S3 object-level Get/Put, Lambda invoke)", "Standard retention 90 hari; CloudTrail Lake = sampai 7 tahun + query SQL terus", "Console trail = ALL regions by default (multi-region)", "'Compliance + config over time / drift' → AWS Config, BUKAN CloudTrail"],
            perangkap: [{"soalan": "Pasukan security nak query 7 tahun aktiviti API secara SQL tanpa export ke S3/Athena. Guna apa?", "jebakan": "Standard CloudTrail trail hantar ke S3 + Athena untuk query. Nampak betul sebab 'CloudTrail simpan log'. SALAH: standard trail simpan 90 hari je dan perlu setup S3 + Athena untuk query.", "betul": "CloudTrail Lake — managed data lake, simpan sampai 7 tahun, query SQL terus dalam console. Keyword 'long-term + queryable tanpa export' = CloudTrail Lake."}, {"soalan": "Audit mahu log setiap kali objek di-download (GetObject) dari bucket S3 sensitif. CloudTrail dah ON. Cukup ke?", "jebakan": "Cukup — CloudTrail default dah log semua, termasuk akses S3. Nampak betul sebab 'CloudTrail dah enabled'. SALAH: default cuma management events; S3 object-level GetObject ialah DATA event yang OFF by default.", "betul": "Enable CloudTrail DATA events untuk bucket tu (ada kos $0.10/100K events). Keyword 'object-level / GetObject / data-plane' = data events, bukan management events."}],
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
              'PRICING: First copy of management events = FREE (all accounts). Data events (S3 object-level, Lambda invocations) = $0.10 per 100,000 events. CloudTrail Lake = $0.75/GB ingested + $0.005/GB scanned. Insight events = additional cost. Long-term: export ke S3 (bayar S3 storage sahaja, CloudTrail tak charge untuk export).',
              'Exam: "free audit trail of API calls" → CloudTrail management events (free). "log S3 object-level API calls" → data events ($0.10/100K events, not free).',
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
            sebabApa: 'ACM wujud sebab urus SSL cert secara manual = sakit kepala: beli cert, install, lepas tu LUPA renew → cert expire → website tetiba "Not Secure", customer lari. Setiap renewal kena buat manual sebelum tarikh luput. ACM bagi cert PERCUMA dan auto-renew dia sendiri (selagi DNS validation) — kau set sekali, lupakan. Tujuan utama: hilangkan risiko "cert expired" outage + jimat duit beli cert.',
            sifir: [
              'CloudFront → cert MESTI di us-east-1 (N. Virginia), walau resource kau region lain',
              'ALB / API Gateway → cert di region SAMA dengan resource tu',
              'Auto-renew HANYA untuk DNS-validated public cert. Email-validated + imported = manual renew',
              'ACM Public cert TAK BOLEH export → tak boleh install dalam EC2 sendiri',
              'Public HTTPS percuma → ACM Public. Internal/private PKI → ACM Private CA ($400/bln)',
            ],
            perangkap: [
              {
                soalan: 'Kau dah request ACM cert dan attach ke ALB elok-elok. Tapi bila nak guna cert sama untuk CloudFront distribution, cert tu tak muncul langsung dalam dropdown CloudFront. Kenapa?',
                jebakan: 'Cert tu belum fully validated / belum issued, jadi CloudFront tak nampak. Atau perlu request cert baru khas untuk CloudFront. Nampak munasabah sebab cert kena "issued" dulu.',
                betul: 'Cert berada di region yang salah. CloudFront HANYA baca ACM cert dari us-east-1 (N. Virginia), tak kira di mana resource lain berada. Request/import cert di us-east-1. Keyword: "CloudFront cert not showing in dropdown" → us-east-1.',
              },
              {
                soalan: 'Aplikasi legacy berjalan terus atas EC2 (bukan belakang ALB) perlu HTTPS. Boleh guna ACM Public cert percuma untuk install dalam EC2?',
                jebakan: 'Boleh — ACM bagi cert percuma, jadi request je dan install dalam EC2. Nampak betul sebab ACM = "free SSL cert".',
                betul: 'TAK BOLEH. ACM Public cert tak boleh di-EXPORT, jadi mustahil install terus dalam EC2. Pilihan: (1) letak EC2 belakang ALB/CloudFront dan attach ACM di situ, ATAU (2) beli cert third-party / guna ACM Private CA (yang boleh export). Keyword: "install cert on EC2 directly" → ACM Public tak boleh.',
              },
            ],
            detailsLabel: 'ACM — 3 jenis cert',
            storageDetails: 'ACM Public Certificate → cert percuma untuk public-facing HTTPS (browser-trusted). Auto-renew selagi DNS validation. Tak boleh export.\nACM Private CA (Private Certificate Authority) → private PKI untuk internal resources/IoT devices — TAK browser-trusted. Berbayar ($400/bln per CA). Boleh export private certs.\nImported Certificate → cert kau beli dari pihak ketiga (DigiCert dll), import masuk ACM untuk guna kat ALB/CloudFront. ACM TAK auto-renew imported cert — kau jaga renewal sendiri.',
            compare: {
              label: 'ACM Public vs Private CA vs Imported',
              headers: ['Aspect', 'ACM Public', 'ACM Private CA', 'Imported Cert'],
              rows: [
                ['Kos', '🟢 FREE (+ auto-renew)', '$400/bln per CA + $0.75/cert', 'Free guna — beli cert luar'],
                ['Auto-renew', '🟢 Ya (DNS validation)', '🟢 Ya (internal)', '❌ Manual — kau jaga sendiri'],
                ['Trust', 'Public CA (browser percaya)', 'Private/internal sahaja', 'Ikut issuer'],
                ['Export private key?', '❌ Tak boleh', '🟢 Boleh (private cert)', 'N/A (kau dah ada)'],
                ['Guna untuk', 'Public HTTPS (ALB/CloudFront/API GW)', 'Internal services, private PKI, IoT', 'Existing cert nak attach kat ALB/CloudFront'],
              ],
              takeaway: 'Public website HTTPS percuma → ACM Public. Internal/private PKI (no public trust) → ACM Private CA (bayar). Dah ada cert luar → import (tapi kau jaga renewal). CloudFront → cert MESTI di us-east-1.',
            },
            scenario: '"Website perlu HTTPS percuma + auto-renew" → ACM Public cert, attach ke ALB/CloudFront/API GW. "CloudFront cert tak muncul dalam dropdown" → cert bukan di us-east-1. "Internal microservices perlu mutual TLS / private trust" → ACM Private CA. "Dah beli cert dari DigiCert nak guna kat ALB" → import ke ACM. Ingat: ACM Public certs tak boleh export untuk EC2 sendiri.',
            tips: [
              'PALING PENTING (exam trap): untuk CloudFront, cert MESTI di-request/import di region us-east-1 (N. Virginia) — CloudFront global tapi hanya baca ACM dari us-east-1. Cert betul tapi di region lain → CloudFront tak nampak. Untuk ALB/API Gateway: cert di region yang SAMA dengan resource.',
              'ACM auto-renews certs HANYA bila DNS validation digunakan. Email-validated certs = kena manual re-validate semasa renewal → status "Pending Validation"',
              'Exam trap: "ACM manages renewal automatically" adalah HANYA betul untuk DNS-validated public certs. Email validation + imported certs = manual action required',
              'ACM Public vs Private: Public = browser-trusted untuk public website. Private CA = internal/private trust sahaja (private PKI, IoT device certs), no public trust',
              'ACM certs cannot be exported/installed on EC2 directly — for EC2, buy third-party cert or use ACM with ALB/CloudFront/API Gateway',
              'Analogi: ACM = pejabat pos bagi & perbaharui "pasport HTTPS" percuma — auto-renew selagi guna DNS validation, tapi pasport ni hanya boleh guna kat kaunter AWS (ALB/CloudFront/API GW), tak boleh bawa balik (export) untuk EC2 sendiri.',
              'PRICING: ACM Public certs PERCUMA termasuk auto-renew. ACM Private CA = $400/bulan per CA + $0.75/cert (first 1,000, turun lepas tu). Imported certs free guna tapi kau urus renewal sendiri.',
            ],
            docs: [
              { label: 'ACM — issuing & managing certs', url: 'https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html' },
              { label: 'CloudFront — require cert in us-east-1', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html' },
            ],
            keywords: ['SSL', 'TLS', 'HTTPS', 'free certificate', 'auto-renewal', 'ALB', 'CloudFront', 'API Gateway', 'DNS validation', 'email validation', 'pending validation', 'us-east-1', 'N. Virginia', 'ACM Private CA', 'private PKI', 'imported certificate', 'cannot export', 'pricing'],
          },
          {
            shortName: 'CloudHSM',
            fullName: 'AWS CloudHSM',
            ingat: '"KMS tapi kau fully control dedicated hardware"',
            gunaUntuk: 'FIPS 140-2 Level 3 compliance, customer-exclusive HSM hardware',
            fungsi: 'Hardware Security Module yang dedicated untuk kau sahaja — bukan shared infrastructure macam KMS. Kau control dan manage keys sendiri. AWS tak boleh access keys kau.',
            sebabApa: 'CloudHSM wujud sebab ada compliance/regulasi (bank, kerajaan, FIPS 140-2 Level 3) yang TAK BENARKAN keys dikongsi atas infrastruktur shared, dan TAK BENARKAN cloud provider ada apa-apa kemungkinan akses keys kau. KMS pun selamat, tapi ia multi-tenant + AWS yang manage HSM. CloudHSM bagi kau hardware HSM SINGLE-TENANT — kau sorang je guna, kau pegang kunci, AWS langsung tak boleh masuk. Tujuan: penuhi keperluan "customer-exclusive / dedicated hardware / FIPS Level 3".',
            sifir: [
              'CloudHSM = single-tenant dedicated hardware. KMS = multi-tenant, AWS managed',
              'FIPS 140-2 Level 3 → CloudHSM. Level 2 (default) → KMS',
              '"AWS must have NO access to keys" / "customer-exclusive control" → CloudHSM',
              'Kau urus sendiri (patching, HA, backup). KMS = AWS urus semua',
              'Oracle RDS TDE + dedicated HSM → CloudHSM (SQL Server RDS tak support langsung)',
            ],
            perangkap: [
              {
                soalan: 'Syarikat kewangan perlu encryption keys di mana AWS DIJAMIN tiada cara untuk akses key material, dengan pematuhan FIPS 140-2 Level 3 dan kawalan hardware eksklusif pelanggan. Servis mana?',
                jebakan: 'AWS KMS dengan customer managed key (CMK) + key policy ketat. Nampak betul sebab CMK = "customer managed" dan kau kawal key policy.',
                betul: 'AWS CloudHSM. Walaupun KMS CMK dipanggil "customer managed", ia masih multi-tenant dan AWS yang urus HSM (FIPS 140-2 Level 3 untuk single-tenant HSM = CloudHSM). Keyword "dedicated/single-tenant hardware", "AWS no access", "FIPS 140-2 Level 3" → CloudHSM, BUKAN KMS.',
              },
            ],
            scenario: '"Compliance requires customer-exclusive control of encryption keys with dedicated hardware" → CloudHSM. Bukan KMS (KMS = shared, AWS-managed). CloudHSM = dedicated hardware, kau control. KMS = multi-tenant, AWS managed. FIPS 140-2 Level 3 = CloudHSM. Level 2 = KMS.',
            tips: [
              'Transparent Data Encryption (TDE) support: Oracle RDS + CloudHSM = supported. SQL Server RDS + CloudHSM = NOT directly supported',
              'Single-tenant HSM requirement + TDE + RDS → use Oracle on RDS with CloudHSM integration',
              'Backup mechanism: EBK (Ephemeral Backup Key) encrypts the HSM data; PBK (Persistent Backup Key) encrypts the EBK — encrypted backup stored in S3 in the SAME region as the cluster',
              'Cross-region backup: must explicitly copy the S3 backup to another region — not automatic',
              'Analogi: CloudHSM = peti besi peribadi 🔐 — bank (AWS) bagi bilik khas dedicated, kau pegang kunci sendiri, bank pun tak boleh buka. Lawan KMS = locker awam yang bank uruskan (multi-tenant, AWS managed).',
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
            sebabApa: 'Wujud sebab traffic melalui public internet tak menentu — latency naik-turun, bandwidth tak terjamin, dan data transfer mahal bila volume besar. Untuk syarikat yang kerap pindah TB data atau jalankan app sensitif latency (trading, video), itu tak boleh pakai. DX bagi kabel fiber PRIBADI yang berdedikasi terus ke AWS (langkau internet/ISP) → latency konsisten, bandwidth terjamin, dan data transfer lebih murah pada skala. Tujuan: sambungan hybrid yang predictable & high-bandwidth.',
            sifir: [
              'DX = private dedicated fiber, BUKAN over internet. VPN = IPSec over internet',
              'DX TAK encrypted by default — perlu encrypted+private → DX + VPN (IPSec over DX)',
              'DX provisioning ambil minggu-bulan → soalan "quickly/immediately" = VPN, BUKAN DX',
              'Resilient murah: DX primary + Site-to-Site VPN backup (bukan dual-DX)',
              'Public VIF → akses S3/DynamoDB. Private VIF → akses VPC. Transit VIF → akses TGW',
              'Satu DX → banyak VPC merentas region/account → Direct Connect Gateway',
            ],
            perangkap: [
              {
                soalan: 'Syarikat perlu sambungan ke AWS dengan latency konsisten & bandwidth tinggi, dan perlu LIVE secepat mungkin (dalam beberapa hari) untuk migrasi mendesak. Pilih?',
                jebakan: 'Direct Connect — sebab ia memang untuk latency konsisten + bandwidth tinggi. Nampak betul sebab soalan sebut dua syarat tu.',
                betul: 'Site-to-Site VPN dulu (boleh siap dalam minit/jam), kemudian migrasi ke DX bila kabel fizikal siap (minggu-bulan). DX provisioning fizikal terlalu lambat untuk "secepat mungkin". Keyword "quickly / immediately / urgent" mengatasi syarat latency → VPN. Boleh sebut DX sebagai fasa kedua.',
              },
              {
                soalan: 'Pematuhan memerlukan SEMUA data antara on-prem dan AWS disulitkan dalam transit, dengan sambungan private berlatency rendah. Penyelesaian?',
                jebakan: 'Direct Connect sahaja — sebab ia private dedicated line, jadi dah selamat. Nampak betul sebab "private line = selamat".',
                betul: 'Direct Connect + Site-to-Site VPN (jalankan IPSec over DX). DX TIDAK encrypted by default — private ≠ encrypted. Untuk penuhi syarat encryption-in-transit + private low-latency, lapis VPN di atas DX. Keyword "encrypted + private/low-latency" → DX + VPN.',
              },
            ],
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
            sebabApa: 'Wujud sebab kau nak sambung SELURUH rangkaian office/data center ke VPC dengan selamat, TANPA tunggu berbulan & bayar mahal untuk Direct Connect. Site-to-Site VPN guna internet sedia ada tapi bungkus traffic dalam terowong IPSec yang disulitkan — siap dalam minit/jam. Tujuan: hybrid network yang cepat, murah & encrypted (atau jadi backup untuk DX).',
            sifir: [
              'Site-to-Site = NETWORK ke NETWORK (office/DC). Client VPN = USER (laptop) ke VPC',
              'Encrypted by default (IPSec) → bagus bila soalan nak "encrypted + cepat/murah"',
              '2 komponen: Customer Gateway (sebelah kau) + VGW/Transit Gateway (sebelah AWS)',
              'Setiap VPN connection = 2 tunnels auto untuk HA',
              'VGW = 1 VPC je. Banyak VPC / nak ECMP throughput → Transit Gateway',
              'Classic resilient combo: DX primary + Site-to-Site VPN backup',
            ],
            perangkap: [
              {
                soalan: 'Sebuah cawangan office (seluruh rangkaian, ramai pekerja) perlu akses selamat ke VPC, perlu siap cepat dan kos rendah. Penyelesaian?',
                jebakan: 'AWS Client VPN — sebab pekerja office nak akses, jadi guna Client VPN per user. Nampak betul sebab "pekerja akses".',
                betul: 'Site-to-Site VPN. Yang perlu disambung ialah SELURUH RANGKAIAN office (via Customer Gateway), bukan setiap laptop satu-satu. Client VPN untuk individual remote user (WFH/vendor). Keyword "office/branch/network connect to VPC" → Site-to-Site, bukan Client VPN.',
              },
            ],
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
            sebabApa: 'Wujud sebab pekerja WFH / vendor sementara guna laptop sendiri dari rumah perlu akses selamat ke resource dalam VPC — tapi mereka BUKAN satu rangkaian office yang tetap (jadi Site-to-Site tak sesuai). Client VPN bagi setiap user pasang software client + authenticate (AD/SAML/cert) → dapat akses peribadi yang disulitkan, dan authorization rules hadkan setiap user ke subnet tertentu sahaja. Tujuan: remote access peringkat INDIVIDU dengan least-privilege.',
            sifir: [
              'Client VPN = USER (laptop) ke VPC. Site-to-Site = NETWORK (office) ke VPC',
              'User pasang OpenVPN-compatible client; auth via AD / SAML / mutual cert',
              'Authorization rules = hadkan tiap user/group ke subnet tertentu (least privilege)',
              'Caj per endpoint-hour + per client connection-hour → jimat untuk team kecil',
              '"remote/WFH/vendor individual access" → Client VPN, bukan Site-to-Site',
            ],
            perangkap: [
              {
                soalan: 'Pasukan vendor kecil (5 orang, kerja dari lokasi masing-masing) perlu akses sementara yang dibenarkan ke subnet tertentu dalam VPC, dengan kos efektif. Servis mana?',
                jebakan: 'Site-to-Site VPN dengan Customer Gateway di lokasi vendor. Nampak betul sebab "VPN ke VPC".',
                betul: 'AWS Client VPN. Mereka individu yang bertaburan (bukan satu rangkaian office dengan router tetap), perlu auth per-user dan had ke subnet tertentu (authorization rules). Site-to-Site perlukan Customer Gateway device per-site & sambung seluruh network. Keyword "individual users / per-user auth / specific subnets / temporary" → Client VPN.',
              },
            ],
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
            sebabApa: "Wujud sebab kalau semua pelanggan AWS kongsi satu rangkaian rata, EC2 kau boleh ternampak/terhubung dengan server orang lain — bencana security. VPC bagi kau 'tanah' rangkaian peribadi terpencil dalam AWS di mana kau kawal segala-galanya: IP range (CIDR), subnet mana public/private, route table, dan gateway. Jadi DB & app server kau terlindung secara default, dan kau buka akses internet HANYA bila & di mana kau benarkan.",
            sifir: ["VPC = private network terpencil; span SATU region, subnet boleh banyak AZ", "Subnet duduk dalam SATU AZ sahaja", "Default VPC ada di setiap region (172.31.0.0/16)", "Public subnet = ada route ke IGW; Private subnet = takde route terus ke internet", "Max 5 VPC per region (soft limit, boleh request increase)"],
            perangkap: [{"soalan": "Web server kena boleh diakses dari internet, tapi database TAK boleh langsung. Macam mana susun dalam VPC?", "jebakan": "Letak web server & DB dalam dua VPC berasingan supaya DB terpencil. Nampak betul sebab 'asingkan DB'. SALAH: terlebih kompleks — dalam satu VPC pun boleh isolate guna subnet + route.", "betul": "Satu VPC: web server dalam public subnet (route ke IGW), DB dalam private subnet (takde route ke internet). Keyword 'tak boleh diakses dari internet' = private subnet."}, {"soalan": "Kau nak satu subnet bentang merentas dua AZ untuk high availability. Boleh?", "jebakan": "Boleh, buat satu subnet besar yang span 2 AZ. Nampak betul sebab 'subnet besar = lebih HA'. SALAH: subnet TERIKAT pada satu AZ sahaja.", "betul": "Tak boleh — satu subnet = satu AZ. Untuk HA, buat subnet berasingan dalam setiap AZ. Keyword 'subnet span satu AZ je'."}],
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
            sebabApa: "Wujud sebab sebelum boleh letak apa-apa dalam VPC, kau kena tetapkan berapa besar rangkaian (berapa IP) dan bahagikannya jadi subnet — silap kira, subnet jadi terlalu kecil (kehabisan IP) atau bertindih. CIDR ialah cara ringkas tulis saiz rangkaian (/16, /24) dan exam suka uji 'berapa usable IP'. AWS reserve 5 IP setiap subnet, jadi kira tepat penting supaya kau plan IP betul tanpa terkejut kehabisan alamat.",
            sifir: ["Formula: 32 − prefix = bits bebas; 2^bits = total IP; tolak 5 = usable", "AWS reserve 5 IP/subnet: .0 network, .1 router, .2 DNS, .3 future, .255 broadcast", "/24 = 251 usable, /26 = 59 usable, /27 = 27 usable (hafal 3 ni)", "AWS minimum subnet = /28 (11 usable je)", "Private ranges (RFC 1918): 10.0.0.0/8, 172.16-31.x, 192.168.0.0/16", "Nombor lepas slash = bits dikunci, BUKAN bilangan IP"],
            perangkap: [{"soalan": "Berapa usable IP address dalam subnet /27?", "jebakan": "32 — sebab 2^(32−27) = 2^5 = 32 total IP. Nampak betul sebab dah kira 2^bits. SALAH: lupa AWS reserve 5 IP setiap subnet.", "betul": "27 usable — 32 total tolak 5 reserved. Keyword 'usable = total − 5 (AWS reserved)'."}, {"soalan": "Kau nak subnet sekecil mungkin untuk segelintir host. Saiz prefix paling kecil yang AWS benarkan?", "jebakan": "/30 (4 IP) atau /32 (1 IP) sebab itu paling kecil dalam networking biasa. Nampak betul sebab 'paling kecil'. SALAH: AWS ada minimum tersendiri.", "betul": "/28 — minimum subnet AWS (16 total, 11 usable). Keyword 'AWS minimum subnet = /28'."}],
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
            sebabApa: 'Wujud sebab VPC by default TERTUTUP — takde apa boleh masuk/keluar internet. IGW = pintu pagar rasmi yang AWS urus (HA, auto-scale, free) supaya kau tak payah bina router sendiri. Sebab dia bidirectional (internet boleh initiate masuk), dia hanya patut dipakai untuk resource yang memang nak expose (web/bastion) — itu sebab ada NAT Gateway berasingan untuk yang nak keluar SAHAJA.',
            contohGuna: 'Web server EC2 dalam public subnet — route table ada 0.0.0.0/0 → igw-xxx. EC2 dapat public IP, users dari internet boleh reach web server.',
            sifir: [
              'IGW = bidirectional (in + out). NAT GW = outbound ONLY',
              'Satu VPC = satu IGW. Free, HA, auto-scale',
              'Subnet "public" = 3 syarat: IGW attach + route 0.0.0.0/0→IGW + EC2 ada public IP',
              'Takde public IP pada EC2 = walaupun route betul, tetap tak boleh keluar via IGW',
            ],
            perangkap: [
              {
                soalan: 'EC2 dalam subnet, route table ada 0.0.0.0/0 → IGW, IGW attached ke VPC. Tapi EC2 tetap tak boleh reach internet. Kenapa?',
                jebakan: 'Mesti NACL atau SG block — tukar firewall rules. Mungkin betul, tapi exam selalunya nak benda lebih asas.',
                betul: 'EC2 takde public/Elastic IP. 3 syarat public subnet: IGW + route + PUBLIC IP. Tanpa public IP, IGW takde alamat untuk reply ke instance tu.',
              },
              {
                soalan: 'Nak private subnet EC2 download patches dari internet tapi JANGAN biar internet initiate connection masuk. Route ke IGW?',
                jebakan: 'Route 0.0.0.0/0 → IGW. SALAH: IGW bidirectional, jadi internet boleh initiate masuk = subnet jadi public, instance terdedah.',
                betul: 'Route 0.0.0.0/0 → NAT Gateway (outbound only). IGW untuk yang nak expose; NAT untuk yang nak keluar je.',
              },
            ],
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
            sebabApa: 'Wujud sebab private subnet ada dilema: server (RDS, app) perlu keluar internet untuk patch/update/call API, TAPI kau tak nak internet boleh masuk balik (kalau guna IGW + public IP, instance jadi terdedah). NAT GW selesai ni — dia satu hala je (outbound), pakai Elastic IP dia sendiri jadi instance kau tak pernah dedah IP. AWS urus HA + auto-scale supaya kau tak payah maintain NAT Instance (EC2) sendiri.',
            contohGuna: 'RDS dalam private subnet perlu download security patches. Traffic: RDS → NAT GW (public subnet) → IGW → internet. Internet tak boleh initiate connection masuk ke RDS.',
            sifir: [
              'NAT GW DUDUK DALAM PUBLIC subnet (bukan private!) — trap paling kerap',
              'NAT GW = OUTBOUND only. Internet TAK boleh initiate masuk',
              'NAT GW = STATEFUL (ingat jalan balik, SNAT) + serverless/managed — auto-scale 5→100 Gbps, tak boleh SSH masuk',
              'NAT GW perlukan IGW untuk sampai internet — dia bukan ganti IGW',
              'Default exam = NAT Gateway (managed). NAT Instance hanya bila perlu SG/bastion/port-forward',
              'Multi-AZ HA = deploy 1 NAT GW per AZ; elak cross-AZ data charge',
              'Banyak traffic ke S3/DynamoDB? Gateway VPC Endpoint (FREE) lagi murah dari NAT GW per-GB',
              'IPv6 + outbound-only → Egress-Only IGW (EIGW), BUKAN NAT GW (NAT GW=IPv4; NAT64 cuma IPv6→IPv4)',
              'Had connection = 55,000 per unique destination per IP → ErrorPortAllocation. Tambah IP (max 8) / split subnet, BUKAN upgrade bandwidth',
            ],
            perangkap: [
              {
                soalan: 'Letak NAT Gateway dalam mana untuk private subnet EC2 boleh keluar internet?',
                jebakan: 'Dalam PRIVATE subnet — sebab dia "untuk" private subnet, logik kan? Itu jebakan paling popular.',
                betul: 'Dalam PUBLIC subnet. NAT GW sendiri kena boleh sampai IGW (route 0.0.0.0/0→IGW). Private subnet route 0.0.0.0/0 → nat-xxx.',
              },
              {
                soalan: 'App private subnet upload beratus GB/hari ke S3 lalu NAT Gateway. Bil membengkak. Macam mana jimat?',
                jebakan: 'Tukar ke NAT Instance kecil supaya murah. Boleh jimat sikit, tapi masih bayar per-GB + kau maintain EC2.',
                betul: 'S3 Gateway VPC Endpoint (FREE, no per-GB) — traffic terus dalam AWS network, langsung tak sentuh NAT GW. Keyword: "private subnet → S3 → reduce cost" = Gateway Endpoint.',
              },
              {
                soalan: 'Satu Public NAT GW dalam AZ-A je, tapi EC2 tersebar multi-AZ. Cross-AZ traffic naikkan kos. Paling cost-effective + kekal internet access?',
                jebakan: 'Create PRIVATE NAT Gateway (option C/D) — sebab "private" bunyi macam murah/jimat. Salah: Private NAT GW langsung TAK boleh keluar internet (no IGW route), dia untuk VPC-to-VPC / on-prem private routing je.',
                betul: 'Deploy SATU Public NAT Gateway PER AZ dalam PUBLIC subnet AZ tu sendiri. Traffic stay dalam AZ → eliminate cross-AZ data charge + kekal internet. Keyword: "cross-AZ cost" + "maintain internet access" → NAT GW per AZ (public), BUKAN private NAT GW.',
              },
              {
                soalan: 'EC2 IPv6 dalam private subnet perlu OUTBOUND internet sahaja (tak nak inbound). Guna apa?',
                jebakan: 'NAT Gateway — sebab "private subnet nak keluar internet" = reflex NAT GW. Tapi NAT GW untuk IPv4 (NAT64 dia cuma untuk IPv6→IPv4). Untuk IPv6 ke internet IPv6, NAT GW bukan jawapan.',
                betul: 'Egress-Only Internet Gateway (EIGW). IPv6 address global-routable (takde private IPv6), jadi tak perlu NAT — EIGW bagi outbound-only sambil block inbound. Keyword: "IPv6" + "outbound only" → Egress-Only IGW, BUKAN NAT GW.',
              },
              {
                soalan: 'App belakang NAT GW buat ribuan connection ke SATU endpoint (API/DB). Mula nampak ErrorPortAllocation, connection fail. Fix?',
                jebakan: 'NAT GW dah max bandwidth, scale ke yang lebih besar — tapi NAT GW auto-scale bandwidth sendiri (5→100 Gbps), ni bukan isu bandwidth.',
                betul: 'Had 55,000 simultaneous connection PER unique destination per IP. Fix: associate lebih IP pada NAT GW (sampai 8), atau sebar resource ke banyak subnet + NAT GW. Keyword: "ErrorPortAllocation" / "many connections to same destination".',
              },
            ],
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
              'IPv6 outbound-only → Egress-Only Internet Gateway (EIGW), bukan NAT GW. NAT GW IPv6 = NAT64 (IPv6→IPv4) sahaja',
              'Connection limit: 55,000 simultaneous per unique destination per IP. Hit limit → ErrorPortAllocation metric. Tambah sampai 8 IP atau split subnet',
              'Tak boleh route ke NAT GW dari VPN/Direct Connect via VGW — guna Transit Gateway (TGW) instead',
              'PRICING: NAT Gateway = $0.045/jam + $0.045/GB processed (us-east-1, no free tier). Per-AZ → darab bilangan AZ. Heavy S3/DynamoDB traffic → Gateway VPC Endpoint (FREE) jauh lebih murah',
            ],
            docs: [
              { label: 'NAT Gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html' },
              { label: 'NAT gateway basics', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html' },
            ],
            keywords: ['NAT', 'outbound only', 'private subnet', 'Elastic IP', 'paid', 'no inbound', 'bastion host', 'cross-AZ cost', 'per-AZ NAT Gateway', 'data transfer charges', 'IPv6', 'Egress-Only Internet Gateway', 'EIGW', 'NAT64', 'ErrorPortAllocation', 'connection limit', '55000 connections', 'pricing'],
          },
          {
            shortName: 'Route Tables',
            fullName: 'VPC Route Tables',
            ingat: '"Papan tanda jalan — arah ke mana traffic pergi"',
            gunaUntuk: 'Control traffic direction: public subnet → IGW, private subnet → NAT GW',
            fungsi: 'Setiap subnet mesti associate dengan satu route table. Route table ada rules yang tentukan ke mana traffic pergi. Tanpa route yang betul, internet tak boleh reach walaupun ada IGW. Main route table (default) dan custom route tables boleh ada dalam satu VPC.',
            sebabApa: "Wujud sebab dalam VPC, ada IGW atau NAT GW sahaja TAK CUKUP — traffic tak tahu nak pergi mana melainkan route table beritahu arahnya. Route table = papan tanda jalan: ia tetapkan destinasi (cth 0.0.0.0/0) pergi ke target mana (IGW untuk public, NAT GW untuk private outbound). Ini sebab punca paling biasa 'subnet takde internet walaupun ada IGW' ialah route table salah/tak associate.",
            sifir: ["Setiap subnet WAJIB associate dengan SATU route table", "Public subnet: 0.0.0.0/0 → IGW. Private outbound: 0.0.0.0/0 → NAT GW", "Local route (CIDR VPC → local) auto ada, tak boleh delete", "Satu subnet → satu route table; satu route table → boleh banyak subnet", "No internet? Check: (1) route 0.0.0.0/0 ada? (2) subnet associate betul? (3) EC2 ada public IP?"],
            perangkap: [{"soalan": "EC2 dalam public subnet ada public IP, IGW dah attach ke VPC, tapi masih tak boleh akses internet. Apa paling mungkin punca?", "jebakan": "Security Group block outbound — kena tambah outbound rule. Nampak betul sebab 'SG kawal traffic'. SALAH: SG default outbound allow-all; lagi mungkin punca lain.", "betul": "Route table subnet tiada route 0.0.0.0/0 → IGW (atau subnet associate route table salah). Keyword 'ada IGW tapi takde internet' = check route table dulu."}],
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
            sebabApa: 'Dua lapisan wujud sebab satu firewall tak cukup untuk semua keperluan. SG jaga setiap instance secara pintar (stateful — ingat siapa kau, reply auto-lepas) tapi dia ALLOW-only, tak boleh block IP penyerang tertentu. NACL jaga sempadan subnet, boleh DENY (block IP/range), tapi stateless (cek setiap packet dua hala — kena allow ephemeral port balik). Guna dua-dua = defense-in-depth: SG kawal "siapa boleh cakap dengan siapa", NACL block ancaman di sempadan.',
            sifir: [
              'SG = Stateful (reply auto-allow) + level INSTANCE. NACL = Stateless + level SUBNET',
              'SG = ALLOW only. Nak DENY/block IP tertentu → NACL',
              'NACL stateless → kena allow outbound ephemeral port (1024-65535) untuk reply',
              'SG boleh reference SG lain sebagai source. NACL = CIDR je',
              'Custom SG: inbound deny-all. Custom NACL: deny-all (kena tambah rule sendiri)',
            ],
            perangkap: [
              {
                soalan: 'Kau tambah inbound NACL rule allow SSH (port 22), tapi SSH ke EC2 masih GAGAL/timeout. SG dah allow 22. Apa puncanya?',
                jebakan: 'Inbound NACL salah priority / kena tambah lagi satu inbound rule. Nampak betul sebab fokus pada inbound (port 22).',
                betul: 'NACL stateless — reply server keluar guna ephemeral port (1024-65535), tapi outbound NACL tak allow port tu → reply tersekat, SSH gagal. Tambah outbound NACL allow 1024-65535. (Kalau ni SG je, dah jalan sebab stateful.) Keyword "inbound allowed tapi connection gagal" → outbound ephemeral NACL.',
              },
              {
                soalan: 'Perlu BLOK satu julat IP penyerang (203.0.113.0/24) daripada mencapai keseluruhan subnet. Guna apa?',
                jebakan: 'Security Group — tambah rule untuk deny IP tu. Nampak betul sebab SG = firewall instance.',
                betul: 'NACL Deny rule (nombor rule rendah menang). SG TAK BOLEH deny — ia allow-only, jadi mustahil block IP tertentu dengan SG. Keyword "block/deny specific IP range" → NACL.',
              },
            ],
            mermaid: [
              {
                label: 'Cara mudah ingat — NACL = Kastam 🛂, SG = Pengawal Pejabat 👮',
                source: `flowchart TD
  T["📦 Trafik nak masuk EC2"] --> NACL{"NACL = KASTAM 🛂<br/>jaga sempadan SUBNET"}
  NACL -->|"Stateless = cepat lupa.<br/>Cek pasport SETIAP kali lalu"| SG{"Security Group = PENGAWAL PEJABAT 👮<br/>jaga pintu INSTANCE"}
  SG -->|"Stateful = ingat muka.<br/>Dah bagi masuk = auto bagi keluar"| EC2["✅ Sampai EC2"]
  EC2 -.->|"Trafik balik (reply)"| SGB["SG: 'aku ingat kau tadi' → terus lepas ✅"]
  SGB -.->|"sampai Kastam balik"| NACLB["NACL: 'sapa kau?' → cek balik 🛂<br/>kena ADA outbound rule allow<br/>ephemeral port 1024-65535"]`,
                caption: 'Analogi yang kau sendiri jumpa: NACL = Kastam (stateless — cerewet, cepat lupa, cek pasport tiap-tiap kali kau lintas sempadan). Security Group = Pengawal pejabat (stateful — ingat muka kau, dah kenal terus lepas). INGAT exam: sebab NACL "cepat lupa", trafik BALIK (reply) pun kena ada outbound rule allow port ephemeral 1024-65535 — kalau tak, sambungan mati separuh jalan.',
              },
              {
                label: 'Kenapa SSH gagal walaupun inbound allow — perangkap stateless',
                source: `flowchart LR
  USER["💻 Kau SSH ke server"] -->|"port 22 masuk"| I1["Inbound NACL<br/>100: Allow SSH:22 ✅"]
  I1 --> SRV["🖥️ EC2 terima request ✅"]
  SRV -->|"server reply guna<br/>ephemeral port 1024-65535"| O1["Outbound NACL<br/>100: Deny all ❌"]
  O1 --> X["🚫 Reply TERSEKAT<br/>→ SSH connection GAGAL"]`,
                caption: 'Inbound benarkan SSH masuk, server pun terima — tapi bila server nak HANTAR BALIK reply (guna random high port 1024-65535), outbound NACL sekat. Sebab NACL stateless, return traffic tak auto-allow macam SG. INGAT exam: "Inbound allow tapi connection tetap gagal" → fikir outbound ephemeral ports. Kalau ini Security Group, dah jalan (stateful, reply auto-allow).',
              },
            ],
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
            sebabApa: 'Wujud sebab dua VPC by default terpencil sepenuhnya — tak boleh cakap antara satu sama lain walaupun dalam akaun sama. VPC Peering buat "jambatan" private terus antara dua VPC supaya resource boleh guna private IP tanpa lalu internet. Ringkas & murah (takde hourly fee) untuk sambungan 1-ke-1. Tapi dia NON-transitive (jambatan A-B + B-C tak buat A nampak C) — itu yang buat dia tak sesuai bila VPC dah ramai.',
            sifir: [
              '2 VPC sahaja → Peering (murah, no hourly fee, data transfer je)',
              'NON-transitive: A↔B + B↔C TAK buat A↔C. Kena peering A↔C sendiri',
              'IP CIDR WAJIB tak overlap — overlap = tak boleh peer',
              'Edge-to-edge TAK disokong: VPC B tak boleh guna NAT/IGW/VPN/DX milik VPC A',
              '3+ VPC all-to-all atau perlu connect on-prem → Transit Gateway',
            ],
            perangkap: [
              {
                soalan: 'Syarikat ada 6 VPC dan semua perlu boleh cakap antara satu sama lain (full mesh). Mereka mula buat VPC Peering. Pendekatan terbaik?',
                jebakan: 'Teruskan VPC Peering antara setiap pasangan VPC. Nampak betul sebab peering memang untuk sambung VPC dan lebih murah per-link.',
                betul: 'AWS Transit Gateway. Peering non-transitive, jadi 6 VPC full-mesh = 15 peering link (n(n-1)/2) untuk urus — tak scalable & mimpi ngeri routing. TGW = hub transitive, 6 attachment je. Keyword "3+ VPC all-to-all / mesh / banyak VPC" → Transit Gateway.',
              },
              {
                soalan: 'VPC A ada NAT Gateway. VPC B di-peer dengan A. Boleh ke instance dalam B keluar internet melalui NAT Gateway milik A?',
                jebakan: 'Boleh — dah peered, jadi B boleh guna resource A termasuk NAT Gateway. Nampak betul sebab "peered = berkongsi".',
                betul: 'TAK BOLEH. VPC Peering tak sokong edge-to-edge routing — B tak boleh guna NAT/IGW/VPN/DX milik A. VPC B kena ada NAT Gateway sendiri. Keyword "peered VPC share NAT/IGW" → tidak.',
              },
            ],
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
            sebabApa: 'Wujud sebab VPC Peering jadi mimpi ngeri bila VPC ramai — non-transitive, jadi 20 VPC full-mesh = 190 peering link untuk urus & route. TGW jadi HUB tengah: setiap VPC/VPN/Direct Connect "attach" sekali ke hub, dan hub uruskan routing transitif (A boleh capai C melalui hub tanpa link langsung). Tambah on-prem pun senang (attach VPN/DX ke hub). Tujuan: ganti peering mesh kompleks dengan satu hub yang scalable + sambung hybrid.',
            sifir: [
              'TGW = hub-and-spoke TRANSITIVE. Peering = 1-to-1 non-transitive',
              '10 VPC: TGW = 10 attachment; Peering mesh = 45 link',
              'TGW boleh attach VPN + Direct Connect → sambung on-prem ke hub (peering tak boleh)',
              'TGW ada hourly fee per attachment + data processing. Peering takde hourly fee',
              'ECMP untuk aggregate throughput VPN → TGW sahaja (VGW tak support ECMP)',
              '2 VPC je → Peering (murah). 3+ all-to-all / hybrid → TGW',
            ],
            perangkap: [
              {
                soalan: 'Perlu naikkan throughput Site-to-Site VPN melebihi had ~1.25 Gbps satu tunnel, dengan agregat beberapa tunnel. Setup mana?',
                jebakan: 'Sambung multiple VPN ke Virtual Private Gateway (VGW) dan biar ia agregat tunnel. Nampak betul sebab VGW memang endpoint VPN standard.',
                betul: 'Multiple Site-to-Site VPN ke Transit Gateway dengan ECMP enabled. VGW TIDAK menyokong ECMP, jadi tak boleh agregat tunnel. Hanya TGW boleh ECMP untuk gabungkan bandwidth beberapa tunnel. Keyword "aggregate VPN throughput / ECMP" → Transit Gateway, bukan VGW.',
              },
            ],
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
            sebabApa: 'Wujud sebab tanpa endpoint, private subnet nak cakap dengan S3/DynamoDB/SSM kena lalu NAT Gateway → IGW → internet (public path) → bayar NAT per-GB + traffic keluar internet (kurang selamat). VPC Endpoint bagi laluan PRIVATE terus ke AWS service dalam network AWS — Gateway Endpoint (S3/DynamoDB) percuma jimat NAT fees, Interface Endpoint (PrivateLink) untuk service lain. Bonus: boleh kunci S3 bucket supaya HANYA terima dari endpoint ni (compliance).',
            contohGuna: 'EC2 private subnet banyak upload ke S3. Tanpa endpoint: bayar NAT GW per GB. Dengan S3 Gateway Endpoint (free): traffic terus dalam AWS network.',
            sifir: [
              '"GD Free" → Gateway Endpoint = S3 + DynamoDB SAHAJA, percuma, guna route table',
              'Interface Endpoint = semua service lain (ECR/SSM/KMS/SQS…), ada ENI, berbayar (PrivateLink)',
              'Gateway Endpoint = in-VPC only. Interface Endpoint = boleh dari on-prem (VPN/DX) sebab ada DNS+ENI',
              'aws:sourceVpce dalam bucket policy = kunci S3 terima dari satu endpoint je',
              'Connectivity ≠ Authorization: route betul ≠ S3 terima; bucket policy boleh DENY walaupun network sampai',
            ],
            perangkap: [
              {
                soalan: 'Nak access SSM Parameter Store + ECR secara private dari private subnet. Gateway Endpoint?',
                jebakan: 'Gateway Endpoint — sebab dia free, kenapa tak guna. SALAH: Gateway Endpoint sokong S3 + DynamoDB SAHAJA.',
                betul: 'Interface Endpoint (PrivateLink). SSM, ECR, KMS, SQS dll semua Interface Endpoint. Gateway Endpoint cuma S3 & DynamoDB ("GD Free").',
              },
              {
                soalan: 'Bucket policy ada Condition aws:sourceVpce = vpce-123. EC2 reach S3 lalu NAT Gateway (network route OK). Request berjaya?',
                jebakan: 'Berjaya — sebab NAT Gateway secara teknikal boleh route sampai S3, connectivity ada.',
                betul: 'GAGAL (Access Denied). Request lalu NAT→IGW (public path), bukan via vpce-123, jadi bucket policy DENY. Connectivity (boleh sampai) ≠ Authorization (dibenarkan).',
              },
              {
                soalan: 'EC2 perlu akses Secrets Manager secara PRIVATE (tak nak lalu public internet). Security team risau Secrets Manager perlu internet. Recommend apa?',
                jebakan: 'NAT Gateway dalam public subnet (D) — atau Gateway Endpoint (C) sebab "VPC Endpoint untuk private access". SALAH dua-dua: NAT GW tetap lalu internet (tak selesai), Gateway Endpoint sokong S3/DynamoDB SAHAJA.',
                betul: 'Interface VPC Endpoint (PrivateLink) untuk Secrets Manager. Letak ENI private IP dalam subnet → traffic terus dalam network AWS, tak sentuh internet. Keyword: "access AWS service (selain S3/DynamoDB) privately / tanpa internet" → Interface Endpoint.',
              },
            ],
            scenario: '"Access S3/DynamoDB dari private subnet tanpa internet" → Gateway VPC Endpoint (free). "Access ECR, SSM, Secrets Manager, KMS atau services lain privately / tanpa internet" → Interface Endpoint (PrivateLink). Jangan terpedaya NAT Gateway — NAT GW tetap lalu public internet.',
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
            mermaid: [
              {
                label: 'Soalan exam: EC2 akses Secrets Manager tanpa internet',
                source: `flowchart TD
  subgraph VPC["☁️ VPC kau (private network)"]
    EC2["🖥️ EC2<br/>app perlu DB password"]
    ENI["🔌 Interface VPC Endpoint<br/>ENI + private IP<br/>(powered by PrivateLink)"]
  end
  SM["🔐 AWS Secrets Manager<br/>simpan DB credentials"]
  NET["🌐 Public Internet"]
  EC2 -->|"1. panggil guna private IP"| ENI
  ENI -->|"2. PrivateLink — kabel dalaman AWS<br/>(TAK keluar internet)"| SM
  SM -->|"3. pulangkan secret"| EC2
  EC2 -.->|"❌ cara lama: NAT GW lalu internet<br/>(security team tak nak)"| NET`,
                caption: 'INGAT exam: Secrets Manager API memang public endpoint, jadi tanpa endpoint EC2 kena keluar internet (lalu NAT GW/IGW). Interface VPC Endpoint letak ENI (private IP) dalam subnet kau → traffic terus ke Secrets Manager dalam network AWS, tak pernah sentuh internet. Itu jawapan A. NAT Gateway (D) tetap lalu internet = tak selesai masalah; Site-to-Site VPN (B) untuk on-prem; Gateway Endpoint (C) hanya S3/DynamoDB.',
              },
              {
                label: 'Decision: Gateway vs Interface Endpoint',
                source: `flowchart TD
  Q["Nak akses AWS service<br/>dari VPC secara PRIVATE?"] --> T{"Service apa?"}
  T -->|"S3 atau DynamoDB"| GW["✅ Gateway Endpoint<br/>FREE · guna route table"]
  T -->|"Selain tu: Secrets Manager,<br/>KMS, SSM, ECR, SQS…"| IF["✅ Interface Endpoint<br/>PrivateLink · ENI · berbayar"]
  IF --> ANS["Soalan Secrets Manager<br/>→ Interface Endpoint (jawapan A)"]`,
                caption: 'Cara cepat: hanya DUA service guna Gateway Endpoint — S3 & DynamoDB ("GD Free"). Apa-apa service lain yang nak diakses private = Interface Endpoint (PrivateLink). Secrets Manager bukan S3/DynamoDB → mesti Interface.',
              },
            ],
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
            sebabApa: 'Wujud sebab kalau kau provision server tetap (fixed), dua masalah: bila traffic spike (sale event) server tak cukup → website hang; bila traffic sepi server idle → bayar lebih sia-sia. ASG selesaikan dua-dua: auto TAMBAH instance bila beban naik (elastic, jimat masa sysadmin), auto KURANG bila sepi (jimat kos). Bonus HA: kalau instance mati / AZ jatuh, ASG auto ganti & sebar across AZ supaya min capacity sentiasa dijaga. Tujuan: elasticity + cost saving + self-healing.',
            sifir: [
              'ASG = horizontal scaling (tambah/kurang instance), BUKAN vertical (besarkan saiz)',
              'Default & paling senang → Target Tracking (kekal metric pada target, cth CPU 50%)',
              'Tahu jadual (Isnin 9am) → Scheduled. Corak berulang/cyclical → Predictive (scale awal)',
              'min = HA floor (set ≥2 across AZ), desired = sekarang, max = siling',
              'Phase out AMI lama masa scale-in → OldestLaunchTemplate termination policy',
              'ASG sendiri FREE — bayar EC2 yang dilancarkan je',
            ],
            perangkap: [
              {
                soalan: 'Aplikasi web makin perlahan bila traffic naik. Pasukan nak guna instance lebih besar (vertical) secara automatik bila CPU tinggi. Pendekatan AWS yang betul?',
                jebakan: 'Konfigur Auto Scaling untuk auto-tukar ke instance type lebih besar (scale UP) bila CPU tinggi. Nampak betul sebab "scale automatik bila CPU tinggi".',
                betul: 'ASG buat HORIZONTAL scaling — tambah lebih banyak instance (scale out), bukan besarkan instance sedia ada. Letak instance di belakang ELB + ASG dengan Target Tracking pada CPU. Vertical scaling (tukar saiz) perlukan stop/restart, bukan apa yang ASG buat. Keyword "scale automatically with load" → ASG scale out (horizontal).',
              },
              {
                soalan: 'Traffic melonjak setiap hari jam 8 malam (corak yang DIKETAHUI & berulang), dan ASG yang reaktif sentiasa lambat sikit sampai user kena lag awal-awal lonjakan. Penambahbaikan?',
                jebakan: 'Turunkan threshold Target Tracking (cth CPU 30%) supaya scale lebih awal. Nampak betul sebab "scale lebih awal".',
                betul: 'Guna Scheduled scaling (kerana masa diketahui) atau Predictive scaling (ML forecast corak berulang) untuk tambah kapasiti SEBELUM lonjakan. Target Tracking sentiasa reaktif (tunggu metric naik dulu). Keyword "known schedule / recurring pattern / scale ahead of spike" → Scheduled / Predictive.',
              },
            ],
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
            sebabApa: 'Kalau primary DB mati (AZ outage, hardware rosak, masa patching), normally app down sampai kau restore manual — boleh berjam. Multi-AZ wujud supaya ada standby IDENTICAL dalam AZ lain yang AWS auto-promote. Downtime turun dari jam → ~1-2 minit, tanpa kau buat apa-apa. Tujuan dia TAHAN bencana (HA), bukan buat laju.',
            sifir: [
              'Multi-AZ = HIGH AVAILABILITY, BUKAN read scaling',
              'Replication SYNC; standby IDLE (tak serve read langsung)',
              'Failover auto ~60-120s, endpoint SAMA (DNS flip) — app tak tukar config',
              'Same region je (across AZ). Cross-region → Read Replica / Aurora Global DB',
              '1 standby sahaja',
            ],
            perangkap: [
              {
                soalan: 'Reporting queries tengah perlahankan production RDS. Solution paling sesuai?',
                jebakan: 'Enable Multi-AZ — nampak macam "tambah satu lagi DB jadi laju". SALAH: standby Multi-AZ IDLE, tak serve read langsung.',
                betul: 'Read Replica (offload read traffic). Keyword "reporting / read queries slow down prod" → Read Replica.',
              },
              {
                soalan: 'Database kena survive AZ outage dengan downtime minimum & auto recovery. Pilih satu.',
                jebakan: 'Read Replica + promote — boleh, tapi "promote" tu MANUAL = bukan auto, RTO lama.',
                betul: 'Multi-AZ (synchronous standby, auto-failover ~1-2 min). Keyword "survive AZ outage / automatic failover" → Multi-AZ.',
              },
            ],
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
            mermaid: [
              {
                label: 'Multi-AZ vs Read Replica vs dua-dua — pilih yang mana (decision tree)',
                source: `flowchart TD
  Q["Masalah RDS apa?"] --> HA{"Nak SURVIVE outage<br/>AZ / instance?"}
  HA -->|"Ya"| MAZ["✅ Multi-AZ<br/>standby SYNC, auto-failover ~60-120s<br/>standby TAK serve reads · same region"]
  HA -->|"Tidak"| RD{"Read query<br/>bebankan primary?<br/>atau perlu read global?"}
  RD -->|"Ya"| RR["✅ Read Replica<br/>ASYNC · up to 15 · same/cross-region<br/>boleh promote → DR"]
  RD -->|"Perlu dua-dua"| COMBO["✅ Multi-AZ + Read Replica<br/>HA & offload reads serentak"]`,
                caption: 'Tiga benda beza tujuan: Multi-AZ = tahan outage (HA). Read Replica = scale read / read global. Dua-dua boleh dipakai serentak. INGAT exam: "survive AZ outage / auto-failover" → Multi-AZ. "reporting slow down production / global read access" → Read Replica. Multi-AZ = SYNC same-region, Read Replica = ASYNC boleh cross-region.',
              },
              {
                label: 'Analogi — Multi-AZ = genset standby · Read Replica = kaunter baca tambahan',
                source: `flowchart LR
  subgraph MAZ["🛡️ Multi-AZ = GENSET standby"]
    P1["Kedai (primary)"] -.->|"elektrik putus"| G["Genset auto-hidup<br/>(AZ lain) ~60-120s<br/>standby idle masa normal"]
  end
  subgraph RR["📚 Read Replica = KAUNTER baca tambahan"]
    P2["Kaunter utama<br/>baca + tulis"] --> K["Kaunter baca je<br/>(× up to 15 · boleh<br/>cawangan luar negara)"]
  end`,
                caption: 'Multi-AZ = genset standby: tunggu diam, auto-ganti bila primary mati — tujuan TAHAN bencana, bukan tambah laju (genset tak layan customer masa normal = standby idle, no reads). Read Replica = buka kaunter baca tambahan: kurangkan beban kaunter utama, boleh letak di cawangan jauh (cross-region) — tujuan SCALE baca. INGAT exam: outage → genset (Multi-AZ); reporting/global read → kaunter tambahan (Read Replica).',
              },
            ],
            tips: [
              'Automated backups: AWS backup daily (during backup window) + transaction logs — boleh restore ke ANY point-in-time dalam retention period (1-35 hari). Auto-deleted bila instance dipadam.',
              'Manual snapshots: kau trigger sendiri, bila-bila masa — KEKAL walaupun RDS instance dipadam. Guna untuk "before major upgrade" atau long-term retention.',
              'Restore dari snapshot/PITR = create instance BARU dengan endpoint BARU — bukan restore in-place',
              'Exam: "retain backup walaupun delete DB instance" → manual snapshot (automated backups deleted together with instance)',
            ],
            docs: [
              { label: 'Multi-AZ deployments for high availability', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html' },
            ],
            keywords: ['automatic failover', 'standby', 'different AZ', 'sync replication', 'same endpoint', 'HA only', 'automated backups', 'manual snapshot', 'point-in-time restore', 'retention period'],
          },
          {
            shortName: 'RDS Read Replicas',
            fullName: 'Amazon RDS Read Replicas',
            ingat: '"Photocopy database untuk baca je — boleh cross-region"',
            gunaUntuk: 'Scale read traffic, reporting queries, multi-region read access',
            fungsi: 'Mencipta salinan database read-only untuk mengagihkan beban queries baca. Async replication dari primary. Boleh cross-region — master kat Frankfurt, replicas kat US, Singapore, Tokyo untuk serve local users laju. Up to 15 read replicas. Boleh promoted to master untuk DR.',
            sebabApa: 'Satu primary DB ada had — terlalu banyak read (reporting, analytics, global users) boleh cekik dia, dan write pun jadi slow. Read Replica wujud untuk offload semua read ke salinan read-only (boleh letak region lain dekat user) supaya primary fokus pada write je. Bonus: replica boleh dipromote jadi standalone = pilihan DR.',
            sifir: [
              'Read Replica = READ SCALING (+ cross-region read), BUKAN HA',
              'Replication ASYNC (boleh lag sikit, eventual)',
              'Up to 15 per primary; boleh buat replica-of-replica',
              'Boleh PROMOTE → standalone DB (option DR)',
              'Cross-region replica = local read laju + DR region lain',
            ],
            perangkap: [
              {
                soalan: 'Nak DR untuk RDS (bukan Aurora): kalau region utama down, ada DB region lain boleh ambil alih. Guna apa?',
                jebakan: 'Multi-AZ — ramai ingat Multi-AZ = DR. SALAH: Multi-AZ same-region je, tak lindung kalau SELURUH region outage.',
                betul: 'Cross-region Read Replica, promote jadi standalone bila region utama down. (Aurora → Global Database.)',
              },
            ],
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
            sebabApa: 'Lambda / Auto Scaling boleh buka beribu connection serentak — tapi RDS ada had connection & tiap connection makan memory. Akibatnya "too many connections" error & DB pengsan. RDS Proxy wujud sebagai orang tengah yang pool & reuse connection, supaya RDS nampak bilangan kecil je walaupun beribu app instance.',
            sifir: [
              'RDS Proxy = CONNECTION POOLING, BUKAN read scaling / query speed',
              'Selesai: "too many connections", idle connections, connection exhaustion',
              'Power combo dengan Lambda (scale drastik, buka/tutup connection laju)',
              'Failover lagi laju (~66% kurang), tahan connection masa DB flip',
              'Sokong IAM auth + Secrets Manager untuk credentials',
            ],
            perangkap: [
              {
                soalan: 'Lambda app bila scale tinggi keluar error "too many connections" ke RDS. Fix?',
                jebakan: 'Tambah Read Replica — nampak macam "agih beban". SALAH: masalah ni bilangan CONNECTION, bukan read load.',
                betul: 'RDS Proxy (pool & multiplex connections). Keyword "too many connections + Lambda/RDS" → RDS Proxy.',
              },
            ],
            scenario: '"Lambda functions causing too many RDS connections" → RDS Proxy. "Idle connections from Auto Scaling EC2" → RDS Proxy. Read Replicas = read scaling. Multi-AZ = HA. RDS Proxy = connection management.',
            tips: [
              'RDS Proxy solves: "too many connections", "idle connections", "connection exhaustion"',
              'Bukan untuk slow query performance — guna Read Replicas atau upgrade instance untuk query scaling',
              'Bukan untuk read scaling — guna Read Replicas untuk distribute read load',
              'Sangat berguna dengan Lambda (yang scale drastically dan close/open connections rapidly)',
              'Supports IAM authentication + Secrets Manager integration untuk credentials',
              'Faster failover: masa RDS/Aurora failover, Proxy tahan incoming connections & route ke DB baru — kurangkan failover time sehingga ~66%, app tak nampak full disconnect',
              'Analogi: RDS Proxy = operator telefon 📞 — beratus caller (Lambda) tak terus call CEO (RDS); operator pool & sambung guna talian terhad supaya CEO tak dibanjiri "too many connections".',
            ],
            keywords: ['connection pooling', 'too many connections', 'Lambda scaling', 'idle connections', 'connection multiplexing', 'faster failover', 'IAM authentication', 'Secrets Manager'],
          },
          {
            shortName: 'Global Accelerator',
            fullName: 'AWS Global Accelerator',
            ingat: '"Highway AWS untuk user seluruh dunia"',
            gunaUntuk: 'Route global users to nearest healthy endpoint via AWS backbone',
            fungsi: 'Menggunakan AWS global network untuk route traffic ke endpoint yang paling dekat dan sihat, bukan melalui internet awam',
            sebabApa: 'Wujud sebab traffic yang melalui public internet melintasi banyak ISP/router yang slow & tak menentu — latency naik turun, kadang putus. Global Accelerator bagi user masuk AWS backbone secepat mungkin di edge terdekat, lepas tu jalan dalam "lebuhraya peribadi" AWS yang laju & stabil ke region. Lebih dari itu: dia bagi 2 STATIC anycast IP (tak berubah) supaya IoT/firewall boleh whitelist sekali, dan failover cross-region <30s tanpa tunggu DNS propagate. Tujuan: routing TCP/UDP global laju + static IP + failover pantas.',
            sifir: [
              'GA = optimize ROUTING via AWS backbone (TCP/UDP). CloudFront = CACHE content (HTTP) — beza tujuan',
              'GA bagi 2 STATIC anycast IP — tak berubah, bagus untuk whitelist & IoT hard-coded IP',
              'GA TIADA caching — proxy traffic terus ke ALB/NLB/EC2/EIP',
              'Cross-region failover GA <30s (tak tunggu DNS TTL/propagation)',
              'Non-HTTP / gaming / VoIP / IoT / perlu static IP global → GA. Web content cache → CloudFront',
            ],
            perangkap: [
              {
                soalan: 'Beribu IoT device ada IP endpoint HARD-CODED dan tak boleh update senang. Backend pindah region kadang-kadang, dan device perlu sentiasa sampai ke endpoint sihat dengan latency rendah. Servis mana?',
                jebakan: 'Route 53 dengan latency/failover routing — tukar DNS record point ke backend baru. Nampak betul sebab Route 53 memang untuk arah traffic.',
                betul: 'AWS Global Accelerator. Device yang hard-code IP tak hormat perubahan DNS (cache IP lama / tak buat DNS lookup). GA bagi 2 static IP yang KEKAL — device sentiasa hubungi IP sama, GA route ke endpoint sihat di belakang. Keyword "hard-coded/static IP + global + failover" → Global Accelerator.',
              },
              {
                soalan: 'Aplikasi web (HTTP) nak laju untuk user global dengan banyak imej/video statik. GA atau CloudFront?',
                jebakan: 'Global Accelerator — sebab dia guna AWS backbone "laju global". Nampak betul sebab GA = "global + laju".',
                betul: 'CloudFront. Untuk content HTTP yang boleh di-CACHE, CloudFront simpan salinan di edge (offload origin + laju). GA tiada caching — dia cuma optimize routing, sesuai untuk TCP/UDP / non-cacheable. Keyword "cacheable HTTP content global" → CloudFront, bukan GA.',
              },
            ],
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
            sebabApa: 'Orang nak kuasa & HA peringkat enterprise tapi tak nak urus replication/storage sendiri macam RDS biasa. Aurora wujud dengan pisahkan compute & storage — storage layer auto simpan 6 copy merentas 3 AZ, auto-grow, failover <30s. Kau dapat MySQL/PostgreSQL yang 3-5x laju & tahan lasak tanpa kerja manual.',
            sifir: [
              'Aurora = 6 copies / 3 AZ auto (2 per AZ); RDS Multi-AZ = 1 standby je',
              'Failover Aurora <30s; RDS Multi-AZ 1-2 min',
              'Semua instance SHARE satu cluster volume (bukan copy sendiri) → tambah replica laju',
              'Up to 15 Aurora Replicas (read), lag <10ms',
              'MySQL & PostgreSQL compatible; storage auto-grow → 128 TiB',
              'Global Database = 1 primary + up to 5 region; RTO <1min, RPO ~1s',
            ],
            perangkap: [
              {
                soalan: 'Perlu cross-region DR: downtime <1 min, data loss minimum, minimal manual ops. Pilih.',
                jebakan: 'RDS Multi-AZ — "kan ni HA?". SALAH: Multi-AZ same-region je, tak lindung kalau SELURUH region down.',
                betul: 'Aurora Global Database (RTO <1min, RPO ~1s, auto-promote secondary region).',
              },
              {
                soalan: 'Nak HA relational DB dengan failover lebih laju & lebih banyak salinan dari RDS Multi-AZ.',
                jebakan: 'RDS Multi-AZ — nampak cukup. Tapi soalan tekan "lebih laju + lebih banyak copy".',
                betul: 'Aurora (6 copies/3 AZ, failover <30s vs RDS Multi-AZ 1 standby/1-2 min).',
              },
            ],
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
            sebabApa: 'Workload on-off / tak menentu (dev-test office hours, app baru, traffic spiky) — kau tak nak bayar instance penuh 24/7 sedangkan DB selalu idle. Aurora Serverless wujud supaya capacity auto naik-turun ikut demand & boleh pause ke near-zero bila tiada traffic. Bayar per second, bukan per instance 24/7.',
            sifir: [
              'Aurora Serverless = auto-scale COMPUTE (ACU), bayar per second',
              'v2 = default sekarang: fine-grained 0.5 ACU, NO connection drop, boleh MIX dgn provisioned',
              'v1 = legacy: scale step-step, connection boleh DROP',
              'Min 0 ACU → auto-pause/resume (scale to ~zero bila idle)',
              'Keyword: intermittent / variable / dev-test / unpredictable',
            ],
            perangkap: [
              {
                soalan: 'Nak instant scaling tanpa putus connection, DAN mix serverless + provisioned dalam SATU cluster.',
                jebakan: 'Aurora Serverless v1 — orang main pilih "Serverless". SALAH: v1 boleh drop connection masa scale & tak boleh mix dgn provisioned.',
                betul: 'Aurora Serverless v2 (no connection drop, boleh campur dgn provisioned instances).',
              },
            ],
            scenario: '"Dev/test database hanya pakai waktu office hours", "app traffic sangat unpredictable, nak zero DB cost masa idle" → Aurora Serverless. Keywords: intermittent, variable traffic, dev/test, scale to zero.',
            compare: {
              label: 'Aurora Serverless v1 vs v2',
              headers: ['Aspect', 'Serverless v1', 'Serverless v2'],
              rows: [
                ['Scaling', 'Steps (whole capacity-unit jumps)', '🟢 Fine-grained 0.5 ACU, fractions of a second'],
                ['Connection drop masa scale', '🔴 Boleh drop', '🟢 Tak drop'],
                ['Auto-pause idle', '🟢 Ya (full pause → zero)', 'Set min 0 ACU → auto-pause (newer versions)'],
                ['Mix dgn provisioned instances', '❌ Tidak', '🟢 Ya — dalam cluster yang sama'],
                ['Global DB / Multi-AZ / Read Replica', 'Limited', '🟢 Penuh'],
                ['Guna bila', 'Legacy / simple intermittent', 'Current default — variable traffic, no connection drops'],
              ],
              takeaway: 'v2 = current default (fine-grained, no connection drops, boleh mix dgn provisioned, full features). v1 = legacy. Exam: "instant scaling tanpa drop connection" atau "mix serverless + provisioned dalam satu cluster" → Aurora Serverless v2.',
            },
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
            sebabApa: 'Bila kau perlu NoSQL yang laju KONSISTEN (single-digit ms) pada apa-apa scale tanpa urus server/sharding sendiri. Relational DB (RDS/Aurora) kena scale up & boleh jadi bottleneck untuk key-value workload besar. DynamoDB wujud serverless, auto-partition data — latency tetap stabil walau traffic meletup (Black Friday, viral game).',
            sifir: [
              'DynamoDB = NoSQL serverless, single-digit ms, any scale',
              'On-Demand = bayar per request (spiky/baru); Provisioned = RCU/WCU (stabil, murah)',
              'LSI = SAME partition key, beza sort key, MESTI masa create table, max 5, share throughput',
              'GSI = beza partition/sort key, bila-bila masa, max 20, OWN throughput',
              'Streams (INSERT/MODIFY/REMOVE) kekal 24 jam → trigger Lambda',
              'Global Tables = multi-region active-active; DAX = microsecond read',
              'Partition key high-cardinality elak hot partition',
            ],
            perangkap: [
              {
                soalan: 'App dah live & running, tetiba perlu query pattern baru (cari by attribute lain). Tambah apa?',
                jebakan: 'LSI — sebab "index". SALAH: LSI MESTI dicipta MASA create table; tak boleh tambah lepas table dah wujud.',
                betul: 'GSI (boleh dicipta bila-bila masa, own capacity, partition key boleh lain).',
              },
              {
                soalan: 'DynamoDB read perlu microsecond (bukan millisecond). Pilih cache.',
                jebakan: 'ElastiCache — cache umum. Boleh secara teori tapi kena tulis cache logic sendiri & bukan jawapan exam.',
                betul: 'DAX (drop-in, microsecond, khusus DynamoDB). Keyword "microsecond + DynamoDB" → DAX.',
              },
            ],
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
            sebabApa: 'DynamoDB sendiri dah laju (single-digit ms), tapi sesetengah read-heavy app (banyak repeat read item sama, contoh leaderboard / product hot) perlu lagi laju — MICROSECOND. DAX wujud sebagai in-memory cache depan DynamoDB, drop-in (code tak ubah), supaya read berulang tak pukul table & jimat RCU.',
            sifir: [
              'DAX = microsecond read; DynamoDB sendiri = single-digit ms',
              'DAX cache DynamoDB SAHAJA (cakap DynamoDB API je)',
              'Drop-in: guna DAX SDK, code logic tak berubah',
              'Cache READ je (GetItem/Query/Scan); write tetap terus ke DynamoDB',
              'Cache untuk RDS/Aurora/data am → ElastiCache, BUKAN DAX',
            ],
            perangkap: [
              {
                soalan: 'Read-heavy app atas RDS perlu cache laju. Pilih.',
                jebakan: 'DAX — sebab "cache AWS untuk DB". SALAH: DAX hanya cakap DynamoDB API, tak boleh cache RDS langsung.',
                betul: 'ElastiCache (Redis/Memcached) — cache untuk apa-apa termasuk RDS/Aurora.',
              },
            ],
            scenario: '"DynamoDB read latency perlu microseconds, bukan milliseconds" → DAX. "Cache untuk RDS/Aurora" → ElastiCache, BUKAN DAX (DAX khusus DynamoDB sahaja).',
            compare: {
              label: 'DAX vs ElastiCache — bila guna cache yang mana',
              headers: ['Aspect', 'DAX', 'ElastiCache'],
              rows: [
                ['Cache untuk', '🟢 DynamoDB SAHAJA', 'Apa-apa (RDS, Aurora, custom data)'],
                ['Integrasi', 'Drop-in — guna DAX SDK, code tak ubah', 'Tulis cache logic sendiri di app'],
                ['Cache apa', 'Read sahaja (GetItem/Query/Scan)', 'Apa-apa value yang kau letak'],
                ['Latency', 'Microseconds', 'Sub-millisecond (Redis/Memcached)'],
                ['Guna bila', 'Read-heavy DynamoDB perlu microsecond', 'Cache depan RDS/Aurora atau data am'],
              ],
              takeaway: 'Cache khusus DynamoDB + zero code change + microsecond → DAX. Cache untuk RDS/Aurora atau data am → ElastiCache. Exam trap: "cache untuk RDS" BUKAN DAX — DAX hanya cakap DynamoDB API.',
            },
            tips: [
              'DAX = microsecond reads. DynamoDB sendiri = single-digit millisecond reads. Beza tu yang exam test.',
              'DAX hanya untuk READS — write masih terus ke DynamoDB (write-through cache pada writes yang lalu DAX API)',
              'Drop-in compatible: guna DAX SDK client, code logic tak berubah',
              'DAX ≠ ElastiCache: DAX khusus DynamoDB API. ElastiCache untuk general-purpose caching (RDS, custom data)',
            ],
            docs: [
              { label: 'In-memory acceleration with DynamoDB Accelerator (DAX)', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html' },
            ],
            keywords: ['DynamoDB Accelerator', 'microsecond latency', 'in-memory cache', 'read caching', 'drop-in compatible', 'DAX vs ElastiCache'],
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
            sebabApa: 'Wujud sebab bencana region/data corruption MEMANG akan jadi suatu hari, dan tak semua sistem mampu (atau perlu) bayar untuk standby panas. Backup & Restore = strategi DR paling murah: simpan backup je (S3/Glacier), TIADA infra berjalan di DR region. Bila bencana, baru bina semula dari backup. Tujuan: perlindungan DR minimum untuk sistem yang downtime beberapa jam OK — bayar storage je, bukan duplicate infra.',
            sifir: [
              'RPO = data boleh hilang (berapa kerap backup). RTO = masa pulih (downtime tolerance)',
              'Backup & Restore: RPO jam-hari, RTO jam, kos PALING RENDAH, takde standby',
              'Pilot Light: DB on, app OFF. RPO minit, RTO minit-jam',
              'Warm Standby: full stack scaled-DOWN running. RPO saat-minit, RTO minit',
              'Multi-Site Active/Active: full capacity dua region live. RPO~0, RTO saat, PALING MAHAL',
              'Kiri→kanan = laju & mahal naik. Pilih ikut RTO/RPO vs bajet',
            ],
            perangkap: [
              {
                soalan: 'Aplikasi mission-critical perbanking perlu RTO beberapa saat dan RPO hampir sifar (hampir tiada data loss, hampir tiada downtime). Strategi DR mana?',
                jebakan: 'Warm Standby — full stack dah berjalan (scaled-down) di DR, jadi failover laju. Nampak betul sebab "ada infra berjalan = laju".',
                betul: 'Multi-Site Active/Active. Warm Standby masih perlu masa SCALE UP semasa failover (RTO minit, bukan saat). Untuk RTO saat + RPO~0, perlu full capacity LIVE di dua region serentak. Keyword "near-zero RPO + seconds RTO + mission-critical / zero downtime" → Multi-Site Active/Active.',
              },
              {
                soalan: 'Sistem arkib dalaman, bukan kritikal, downtime beberapa jam OK. Mahu kos DR PALING RENDAH. Pilih?',
                jebakan: 'Pilot Light — DB sentiasa replicate, jadi recovery cepat dan masih agak murah. Nampak betul sebab Pilot Light dikenali sebagai murah.',
                betul: 'Backup & Restore. Pilot Light masih jalankan core DB (kos berterusan). Untuk kos PALING RENDAH bila downtime jam OK, cukup simpan backup di S3/Glacier tanpa infra berjalan langsung. Keyword "lowest cost / downtime hours acceptable / non-critical" → Backup & Restore.',
              },
            ],
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
            perangkap: [{"soalan": "DR strategy: kos sederhana, RTO minit-jam OK, tapi tak nak bayar app compute idle 24/7. Core DB mesti sentiasa sedia. Pola mana?", "jebakan": "Warm Standby — sebab dia pun cepat recover & ada DB sedia. Nampak betul sebab 'DB sedia + cepat'. SALAH: Warm Standby app server SENTIASA ON (kecil) → bayar compute idle, lebih mahal.", "betul": "Pilot Light — DB ON (replicate), app server OFF sampai bencana. Keyword 'tak nak bayar app compute idle / DB sedia / kos sederhana' = Pilot Light."}, {"soalan": "Pilot Light setup: bila bencana berlaku, apa yang kena buat sebelum traffic boleh dilayan?", "jebakan": "Terus failover DNS sahaja sebab semua dah berjalan. Nampak betul sebab 'DB dah replicate'. SALAH: dalam Pilot Light app server MATI — kena hidupkan & scale up dulu, baru DNS.", "betul": "Hidupkan + scale up app server, kemudian point DNS ke DR. Keyword 'app OFF sampai disaster' = perlu launch app dulu (RTO minit-jam)."}],
            scenario: 'Core DB replicated ke DR region (running minimal). App servers OFF. Disaster berlaku — turn on app servers, scale up, point DNS ke DR. RPO: minutes, RTO: minutes to hours. Lebih murah dari Warm Standby.',
            sebabApa: 'Wujud sebab Backup & Restore terlalu lambat (kena bina DB dari kosong + restore = jam), tapi kau tak nak bayar full standby. Pilot Light = nyalakan "api kecil": core DB sentiasa replicate & berjalan minimal di DR, tapi app server MATI (tak bayar compute). Bila bencana, kau cuma "bakar" — hidupkan & scale app server, point DNS. Tujuan: recovery lebih laju dari backup (DB dah sedia) pada kos sederhana.',
            sifir: [
              'Pilot Light = DB ON (replicate), app server OFF sampai bencana',
              'RPO minit, RTO minit-jam. Lebih laju dari Backup&Restore, lebih murah dari Warm Standby',
              'Beza utama vs Warm Standby: Pilot Light app OFF; Warm Standby app ON (scaled-down)',
              '"DB sentiasa sedia tapi tak nak bayar app compute idle" → Pilot Light',
            ],
            keywords: ['RPO: minutes', 'RTO: minutes-hours', 'core DB running', 'app servers off', 'medium cost'],
          },
          {
            shortName: 'Warm Standby',
            fullName: 'DR Pattern: Warm Standby',
            ingat: '"Anak syarikat kecil sedia — scale up masa emergency"',
            gunaUntuk: 'Scaled-down full stack running in DR, quick scale up',
            fungsi: 'Versi scaled-down penuh dari aplikasi running di DR region. Boleh handle traffic pada kapasiti rendah, scale up bila failover diperlukan',
            perangkap: [{"soalan": "Perlu recovery laju (RTO minit), full stack dah berjalan supaya bencana cuma perlu scale up + failover, tapi tak nak bayar 2× infra penuh. Pola mana?", "jebakan": "Multi-Site Active/Active — sebab dia paling laju recover. Nampak betul sebab 'recovery laju'. SALAH: Multi-Site bayar 2× full capacity, terlebih mahal untuk keperluan ni.", "betul": "Warm Standby — full stack scaled-DOWN, sentiasa ON, scale up bila failover. Keyword 'full stack jalan kecil / scale up / tak nak 2× penuh' = Warm Standby."}, {"soalan": "Apa beza utama Warm Standby dengan Pilot Light?", "jebakan": "Warm Standby DB lebih besar, Pilot Light DB lebih kecil. Nampak betul sebab 'standby = lebih banyak'. SALAH: beza utama bukan saiz DB — ia status app server.", "betul": "Warm Standby app server ON (scaled-down, melayan traffic kecil); Pilot Light app server OFF. Keyword 'app ON vs OFF'."}],
            scenario: 'DR region running dengan 2 EC2 (vs 20 in prod). Disaster — scale up ASG, Route 53 failover ke DR. RPO: seconds/minutes, RTO: minutes. Lebih mahal dari Pilot Light tapi lagi cepat recover.',
            sebabApa: 'Wujud sebab Pilot Light masih perlu masa hidupkan & konfigur app server semasa bencana. Warm Standby = FULL stack (app + DB) dah BERJALAN di DR tapi saiz kecil (cth 2 EC2 vs 20 prod) — sentiasa hidup & boleh terima traffic sikit. Bila bencana, kau cuma SCALE UP yang sedia ada (laju) + failover DNS. Tujuan: recovery lebih laju dari Pilot Light (semua dah berjalan, cuma kena besarkan) dengan kos lebih rendah dari full active/active.',
            sifir: [
              'Warm Standby = full stack scaled-DOWN, sentiasa BERJALAN (app ON, kecil)',
              'RPO saat-minit, RTO minit. Recovery = scale up + DNS failover',
              'Beza vs Pilot Light: Warm Standby app ON (kecil); Pilot Light app OFF',
              'Beza vs Multi-Site: Warm Standby kena scale up dulu (RTO minit); Multi-Site dah full (RTO saat)',
            ],
            keywords: ['RPO: seconds/minutes', 'RTO: minutes', 'scaled-down active', 'quick scale up', 'higher cost'],
          },
          {
            shortName: 'Multi-Site Active/Active',
            fullName: 'DR Pattern: Multi-Site Active/Active',
            ingat: '"Dua HQ berjalan serentak — saling backup"',
            gunaUntuk: 'Mission-critical — full capacity in both regions simultaneously',
            fungsi: 'Kedua-dua regions running full capacity serentak dengan traffic diagihkan. Tiada downtime bila satu region fail',
            perangkap: [{"soalan": "Banking app — downtime walau beberapa minit pun tak boleh diterima, RPO near-zero, RTO saat. Pola DR mana?", "jebakan": "Warm Standby + Route 53 failover — sebab dia cepat recover. Nampak betul sebab 'cepat'. SALAH: Warm Standby masih kena SCALE UP dulu (RTO minit), bukan saat → ada downtime.", "betul": "Multi-Site Active/Active — dua region full capacity LIVE serentak, region fail terus serap traffic (RTO saat). Keyword 'zero downtime / RTO saat / mission-critical' = Multi-Site."}, {"soalan": "App dalaman, downtime sejam pun OK, nak jimat kos. Engineer cadang Multi-Site Active/Active untuk 'lebih selamat'. Sesuai?", "jebakan": "Sesuai — lebih reliable, kenapa tak. Nampak betul sebab 'paling selamat'. SALAH: Multi-Site bayar 2× infra penuh — membazir bila RTO/RPO longgar.", "betul": "Tak sesuai — guna Pilot Light atau Warm Standby yang lebih murah. Multi-Site HANYA untuk mission-critical/zero-downtime. Keyword 'RTO/RPO longgar → strategi murah'."}],
            scenario: 'Banking app yang tak boleh ada downtime — full production environment kat dua regions. Route 53 weighted routing 50/50. Satu region fail → 100% traffic ke region sihat automatik. RPO: near-zero, RTO: seconds. Paling mahal tapi paling reliable.',
            sebabApa: 'Wujud sebab ada sistem (banking, trading, kesihatan) yang downtime walau beberapa minit = bencana bes(rugi/jiwa). Semua strategi lain ada masa "recover". Multi-Site Active/Active = takde recovery langsung — DUA region jalan full capacity serentak, traffic dibahagi. Satu region mati, region lain dah pun melayan 100%, user tak perasan. Tujuan: zero-downtime, near-zero data loss untuk mission-critical — dengan harga paling mahal (bayar 2× infra penuh).',
            sifir: [
              'Multi-Site = dua region FULL capacity, LIVE serentak (Route 53 weighted/latency)',
              'RPO near-zero, RTO saat. Region fail = takde scale up, terus serap traffic',
              'PALING MAHAL (2× full infra) — guna HANYA untuk mission-critical/zero-downtime',
              'Bukan "near-zero/seconds"? Strategi lebih murah cukup (Warm Standby/Pilot Light)',
            ],
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
            sebabApa: "Dulu setiap service ada cara backup sendiri — RDS snapshot, EBS snapshot, EFS backup, DynamoDB PITR — semua manual, lain-lain tempat, susah nak prove ke auditor company comply. AWS Backup wujud sebagai satu 'control panel' tunggal: satu backup plan, satu retention policy, satu audit report untuk SEMUA service sekali gus. Pain yang ia buang: tak payah tulis script backup berasingan + senang nak buktikan compliance.",
            sifir: ["AWS Backup = CENTRALIZED backup across services (EFS, EBS, RDS, Aurora, DynamoDB, S3, FSx, EC2 AMI, Storage Gateway)", "Backup Plan = schedule + retention + cross-region copy, semua di satu tempat", "Backup Audit Manager = compliance report (prove backups ikut policy)", "EFS backup = AWS Backup (BUKAN File Gateway, BUKAN FSx Gateway)", "PERCUMA service; bayar storage backup (cth backup ke Backup Vault, Glacier-class untuk cold)"],
            perangkap: [{"soalan": "Company kena backup EFS file system ikut retention policy 90 hari + prove ke auditor. Service mana?", "jebakan": "S3 File Gateway / FSx File Gateway — nampak macam 'gateway' boleh backup file, tapi Gateway = hybrid ACCESS storage, bukan backup tool.", "betul": "AWS Backup — keyword 'centralized backup + retention + compliance report' = AWS Backup (+ Backup Audit Manager untuk audit)."}, {"soalan": "Nak satu tempat manage + audit backup untuk RDS, DynamoDB, dan EBS sekali gus. Apa pilih?", "jebakan": "Buat manual RDS automated backup + DynamoDB PITR + EBS snapshot lifecycle — boleh jadi tapi berselerak, susah audit, bukan 'centralized'.", "betul": "AWS Backup — keyword 'single place / centralized / cross-service' terus pointing ke AWS Backup."}],
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
            sebabApa: "S3 by default OVERWRITE atau DELETE terus — sekali tersilap delete atau replace file, hilang selamanya. Versioning wujud supaya setiap perubahan jadi 'version' baru, version lama masih ada untuk restore (termasuk recover dari accidental delete sebab delete cuma letak delete marker). CRR pula wujud sebab data dalam satu region je = risiko bila region down atau untuk compliance 'data mesti ada di region lain' — ia auto-copy objects ke bucket region berbeza.",
            sifir: ["Versioning = simpan SEMUA versi; delete = letak delete marker je, boleh undo", "Versioning kena ENABLE dulu BEFORE replication — CRR wajib versioning ON kat source & destination", "CRR = Cross-Region (region lain) ; SRR = Same-Region Replication (region sama, beza account/bucket)", "Replication = ASYNC + objek BARU sahaja (existing object kena S3 Batch Replication)", "MFA Delete = extra protection, kena MFA untuk delete version (lawan accidental/malicious delete)"],
            perangkap: [{"soalan": "Developer accidentally overwrite file penting dalam S3. Macam mana recover ke versi sebelum?", "jebakan": "Enable CRR — orang ingat 'replication = backup', tapi CRR cuma copy ke region lain, tak bagi balik versi LAMA dalam bucket asal.", "betul": "S3 Versioning — keyword 'restore previous version / undo overwrite' = Versioning (setiap overwrite jadi version baru)."}, {"soalan": "Compliance kata objects mesti disimpan di region kedua untuk DR. Pilih apa?", "jebakan": "S3 Versioning sahaja — versioning lindung dari delete tapi semua versi DUDUK region sama; region down = tetap hilang.", "betul": "Cross-Region Replication (CRR) — keyword 'different region / DR / data residency' = CRR (ingat: versioning kena ON dulu)."}],
            scenario: 'Developer accidentally delete important file dalam S3 — Versioning enable restore previous version. CRR auto-copy semua objects ke DR bucket kat region lain untuk disaster recovery.',
            keywords: ['versioning', 'CRR', 'accidental deletion', 'cross-region replication', 'SRR', 'point-in-time recovery'],
          },
          {
            shortName: 'EBS Snapshots',
            fullName: 'Amazon EBS Snapshots',
            ingat: '"Gambar volume pada satu masa — restore anytime"',
            gunaUntuk: 'Point-in-time backup of EBS volumes, cross-region DR',
            fungsi: 'Mencipta backup incremental EBS volume ke S3 untuk recovery atau create volumes baru dalam AZ atau region lain',
            sebabApa: "EBS volume tied ke satu AZ — kalau AZ rosak, atau OS dalam volume corrupt/kena ransomware, kau hilang data. Snapshot wujud sebagai backup point-in-time yang disimpan dalam S3 (durable, 11 nines, merentas AZ), jadi kau boleh restore volume balik atau create volume baru di AZ/region lain. Pain yang ia buang: EBS sendiri tak survive AZ failure — snapshot bagi recovery + portability.",
            sifir: ["Snapshot = INCREMENTAL (cuma block yang berubah disimpan) tapi restore = full volume", "Snapshot disimpan dalam S3 (managed, kau tak nampak bucket) — durable merentas AZ", "Copy snapshot ke region lain = cara pindah EBS data cross-region (volume sendiri AZ-locked)", "DLM (Data Lifecycle Manager) = automate snapshot schedule + retention, PERCUMA", "PRICING: snapshot $0.05/GB-month (incremental). Fast Snapshot Restore (FSR) = extra cost, no first-access latency"],
            perangkap: [{"soalan": "Nak pindah EBS volume dari us-east-1 ke eu-west-1 untuk DR. Macam mana?", "jebakan": "Detach volume, attach ke region lain — TAK BOLEH, EBS volume terkunci dalam satu AZ/region, tak boleh attach merentas region.", "betul": "Buat snapshot → COPY snapshot ke region lain → create volume baru dari snapshot. Keyword 'cross-region EBS' = copy snapshot."}, {"soalan": "Nak automate daily EBS backup + buang yang lebih 30 hari, tanpa script sendiri. Guna apa?", "jebakan": "Tulis Lambda + EventBridge cron untuk create/delete snapshot — boleh tapi extra ops, ada service siap sedia.", "betul": "Data Lifecycle Manager (DLM) — keyword 'automated EBS snapshot schedule + retention' = DLM (free)."}],
            scenario: 'EC2 kena ransomware, OS corrupted — restore EBS dari snapshot semalam. Atau copy snapshot ke region lain untuk DR, create new EC2 dari snapshot tu.',
            keywords: ['incremental backup', 'point-in-time', 'cross-AZ', 'cross-region copy', 'EC2 recovery'],
          },
          {
            shortName: 'FSx',
            fullName: 'Amazon FSx',
            ingat: '"EFS tapi untuk Windows, HPC, atau enterprise NAS"',
            gunaUntuk: 'Managed file systems: Windows SMB, HPC Lustre, NetApp ONTAP, OpenZFS',
            fungsi: 'Empat pilihan: FSx for Windows (SMB/NTFS, AD integration), FSx for Lustre (high-throughput HPC, S3 integration), FSx for NetApp ONTAP (enterprise NAS migration), FSx for OpenZFS.',
            sebabApa: "EFS cuma support NFS (Linux/POSIX) — tapi ramai enterprise guna Windows apps yang perlu SMB + Active Directory, atau HPC yang perlu throughput gila-gila, atau dah ada NetApp on-prem nak migrate. FSx wujud bagi managed file system untuk kes-kes yang EFS tak boleh handle: Windows SMB, Lustre HPC, NetApp ONTAP, OpenZFS. Pain yang ia buang: tak payah build & patch Windows file server atau Lustre cluster sendiri atas EC2.",
            sifir: ["FSx for Windows = SMB/NTFS + Active Directory (Windows file share)", "FSx for Lustre = HPC high-throughput + native S3 integration (DRA)", "FSx for NetApp ONTAP = migrate enterprise NetApp/NAS ke AWS (multi-protocol)", "FSx for OpenZFS = migrate ZFS / Linux NFS workload", "EFS = general NFS (Linux je); Windows SMB → FSx Windows, BUKAN EFS"],
            perangkap: [{"soalan": "Windows application perlu shared file storage guna SMB protocol + integrate Active Directory. Pilih apa?", "jebakan": "Amazon EFS — orang ingat 'EFS = shared file storage' jadi pilih EFS, tapi EFS NFS-only, tak support SMB/Windows.", "betul": "FSx for Windows File Server — keyword 'SMB / NTFS / Active Directory / Windows file share' = FSx Windows."}, {"soalan": "HPC workload perlu POSIX file system, throughput sangat tinggi, dan baca/tulis data terus dari S3. Pilih apa?", "jebakan": "EFS — POSIX betul, tapi EFS tak ada S3 native integration dan throughput tak setanding Lustre untuk HPC.", "betul": "FSx for Lustre — keyword 'HPC + high throughput + S3 integration (DRA)' = FSx for Lustre."}],
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
            sebabApa: "Banyak company ada apps lama on-premises yang expect local storage (NFS, SMB, iSCSI, atau tape) — tak boleh tukar code untuk cakap dengan S3 API. Storage Gateway wujud sebagai 'penterjemah' yang duduk on-prem: apps fikir depa guna disk/tape biasa, tapi belakang tabir data masuk S3/Glacier/EBS. Pain yang ia buang: extend storage ke cloud TANPA tukar aplikasi, dan ini ONGOING (bukan one-time macam DataSync).",
            sifir: ["File Gateway = NFS/SMB → S3 (file access)", "Volume Gateway = iSCSI block → backup ke EBS snapshot (Cached vs Stored mode)", "Tape Gateway = virtual tape library (VTL) → S3 Glacier (ganti physical tape)", "Storage Gateway = ONGOING hybrid access; DataSync = ONE-TIME/scheduled migration", "Volume Cached = data utama di S3, hot data cache on-prem; Stored = data utama on-prem, backup ke S3"],
            perangkap: [{"soalan": "Company nak ganti physical tape backup library dengan cloud tapi backup software lama mereka cuma tahu cakap dengan tape. Pilih apa?", "jebakan": "S3 Glacier terus — Glacier murah untuk archive, tapi backup software lama tak tahu cakap S3 API, kena tape interface.", "betul": "Tape Gateway — keyword 'replace physical tape / VTL / legacy backup software' = Tape Gateway (belakang ia simpan ke Glacier)."}, {"soalan": "On-prem apps perlu access S3 secara ONGOING melalui NFS mount tanpa tukar code. Pilih apa?", "jebakan": "AWS DataSync — DataSync pindah file ke S3, tapi ia untuk MIGRATION berjadual, bukan mount NFS ongoing untuk app.", "betul": "File Gateway (Storage Gateway) — keyword 'ongoing hybrid access / NFS-SMB mount ke S3' = File Gateway."}],
            scenario: '"On-premises apps nak access S3 via NFS" → File Gateway. "Replace physical tape library dengan cloud backup" → Tape Gateway. "Ongoing hybrid access" → Storage Gateway. Bukan DataSync (yang untuk one-time migration).',
            keywords: ['hybrid storage', 'File Gateway', 'Volume Gateway', 'Tape Gateway', 'on-premises', 'NFS', 'SMB', 'iSCSI'],
          },
          {
            shortName: 'DataSync',
            fullName: 'AWS DataSync',
            ingat: '"Pemindah data automatik dan laju — dari on-prem ke AWS atau cross-region"',
            gunaUntuk: 'One-time or recurring data migration from on-premises to S3, EFS, or FSx; also EFS cross-region replication',
            fungsi: 'Automated data transfer service yang handle scheduling, verification, dan network optimization. Boleh transfer data dari NFS, SMB, HDFS, atau S3-compatible storage ke AWS. Juga boleh replicate EFS data ANTARA regions melalui AWS private network.',
            sebabApa: "Pindah data besar dari on-prem ke AWS guna script (rsync, cp) atau tulis sendiri = lambat, tak ada verification, senang putus di tengah, dan kena manage network throttling. DataSync wujud sebagai pemindah data automatik yang handle scheduling, integrity verification (checksum), encryption, dan optimize network — laju sampai 10x rsync. Pain yang ia buang: migration/transfer data yang reliable & laju tanpa tulis tooling sendiri.",
            sifir: ["DataSync = MIGRATION/transfer (one-time atau scheduled); Storage Gateway = ongoing hybrid access", "Source: NFS, SMB, HDFS, S3-compatible, object storage → Target: S3, EFS, FSx", "Auto checksum verification + encryption in-transit (TLS)", "Boleh EFS → EFS cross-region replication melalui AWS private network (no public internet)", "Online transfer (network ada); kalau internet terlalu lambat / petabyte → Snow Family instead"],
            perangkap: [{"soalan": "Migrate 50TB dari on-prem NAS ke S3, sekali sahaja, dengan auto-verify integrity. Pilih apa?", "jebakan": "Storage Gateway File Gateway — boleh letak file ke S3, tapi ia untuk ONGOING access, bukan bulk one-time migration berjadual.", "betul": "AWS DataSync — keyword 'one-time bulk migration + verification + faster than rsync' = DataSync."}, {"soalan": "Replicate EFS data antara dua region secara selamat tanpa lalu public internet. Pilih apa?", "jebakan": "Snowball — Snow = physical device untuk migration offline, bukan replication berterusan antara region.", "betul": "AWS DataSync — keyword 'EFS cross-region + secure + no public internet' = DataSync (lalu AWS private network)."}],
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
            sebabApa: "Nak migrate database ke AWS tapi kalau matikan DB untuk copy = business down berjam-jam, dan kalau tukar engine (Oracle ke PostgreSQL) schema + stored procedure tak serasi. DMS wujud supaya source DB KEKAL running masa data dipindah (CDC keep sync sampai cutover) = near-zero downtime; SCT pula convert schema bila engine berbeza. Pain yang ia buang: migration DB tanpa matikan production + handle perbezaan engine.",
            sifir: ["DMS = database migration ONLY; source kekal running (minimal downtime)", "Homogeneous (engine sama, MySQL→RDS MySQL) = DMS sahaja", "Heterogeneous (engine beza, Oracle→Aurora PostgreSQL) = DMS + SCT (Schema Conversion Tool)", "CDC (Change Data Capture) = continuous sync source↔target sampai cutover", "DMS replication instance duduk dalam VPC; boleh on-prem→AWS, AWS→AWS, AWS→on-prem"],
            perangkap: [{"soalan": "Migrate Oracle on-prem ke Aurora PostgreSQL dengan minimal downtime. Pilih apa?", "jebakan": "DMS sahaja — DMS pindah data, tapi engine beza (Oracle→PostgreSQL) jadi schema + stored procedure kena convert dulu, DMS sorang tak buat tu.", "betul": "DMS + SCT — keyword 'different engine / heterogeneous' wajib SCT untuk convert schema, baru DMS pindah data."}, {"soalan": "Nak migrate keseluruhan server (OS + apps + DB) ke EC2 dengan minimal downtime. Pilih apa?", "jebakan": "DMS — ada perkataan 'minimal downtime' yang bait orang, tapi DMS cuma untuk DATABASE, bukan whole server.", "betul": "AWS MGN — keyword 'entire server / OS + apps / lift-and-shift ke EC2' = MGN, BUKAN DMS."}],
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
            sebabApa: "Pindah ratus TB atau petabyte data melalui internet boleh ambil berbulan-bulan dan bandwidth mahal gila — atau lokasi langsung tiada internet (kapal, ladang minyak, kawasan terpencil). Snow Family wujud sebagai peti besi fizikal: AWS hantar device, kau load + encrypt data, pos balik, AWS muat naik ke S3. Pain yang ia buang: transfer data besar bila network TAK praktikal, plus edge compute di tempat disconnected.",
            sifir: ["Snowcone = 8TB HDD / 14TB SSD, paling kecik (4.5 lbs), edge + transfer", "Snowball Edge Storage Optimized = 210TB NVMe (default jawapan 'Snowball')", "Snowball Edge Compute Optimized = 28TB, 104 vCPU, 416GB RAM (edge ML/video)", "Rule of thumb: transfer ambil >1 minggu via internet → guna Snow", "Semua encrypted KMS 256-bit + tamper-resistant; online transfer (network ada) → DataSync, BUKAN Snow"],
            perangkap: [{"soalan": "Nak transfer 80TB ke S3 tapi internet link company lambat + ambil berbulan kalau upload online. Pilih apa?", "jebakan": "AWS DataSync — DataSync laju untuk online transfer, tapi kalau network sendiri yang jadi bottleneck, online tetap berbulan.", "betul": "Snowball Edge — keyword 'limited bandwidth / would take weeks-months online / petabyte-scale offline' = Snow Family."}, {"soalan": "Perlu run ML inference di lokasi terpencil tiada internet, lepas tu hantar data balik ke AWS. Pilih apa?", "jebakan": "Snowball Edge Storage Optimized — banyak storage, tapi inference perlu compute (vCPU/RAM), Storage Optimized kurang power.", "betul": "Snowball Edge Compute Optimized — keyword 'edge ML inference / heavy compute disconnected' = Compute Optimized (104 vCPU)."}],
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
            sebabApa: "Ramai partner/customer masih hantar file guna protokol lama SFTP/FTPS/FTP/AS2, dan workflow mereka tak boleh tukar ke S3 API. Kalau host SFTP server sendiri atas EC2 = kena patch, scale, jaga HA, urus keys. Transfer Family wujud sebagai SFTP/FTPS/FTP/AS2 endpoint fully managed yang terus simpan file dalam S3/EFS. Pain yang ia buang: bagi partner guna protokol lama TANPA tukar workflow + tanpa kau manage server FTP.",
            sifir: ["Transfer Family = managed SFTP / FTPS / FTP / AS2 endpoint", "Backend = S3 atau EFS (file jadi object S3 / file EFS biasa)", "FTP plain = dalam VPC sahaja; AS2 = B2B EDI exchange", "Identity: service-managed, Active Directory, atau custom Lambda auth", "Partner pakai protokol lama, NO code change — vs DataSync (migration) / Storage Gateway (hybrid access)"],
            perangkap: [{"soalan": "Partner luar hantar file harian guna SFTP, company nak file terus masuk S3 tanpa manage server. Pilih apa?", "jebakan": "Launch EC2 + install OpenSSH SFTP server — boleh, tapi kena patch, scale, jaga HA sendiri = banyak ops overhead.", "betul": "AWS Transfer Family — keyword 'managed SFTP / partner file exchange / land in S3 / no code change' = Transfer Family."}, {"soalan": "Nak terima file dari partner via SFTP secara ONGOING. DataSync ke?", "jebakan": "AWS DataSync — DataSync ada kaitan 'transfer file', tapi ia untuk migration berjadual ke AWS, bukan endpoint SFTP untuk partner upload.", "betul": "AWS Transfer Family — keyword 'SFTP/FTP endpoint untuk users/partners' = Transfer Family, BUKAN DataSync."}],
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
            sebabApa: "Nak 'lift-and-shift' keseluruhan server (OS + apps + data) ke AWS tapi kalau snapshot manual + rebuild = downtime panjang dan senang tertinggal config. MGN wujud buat continuous block-level replication dari source server ke AWS di latar belakang — bila ready, satu klik cutover launch EC2 dari replika terkini = minimal downtime. Pain yang ia buang: migrate whole server ke EC2 tanpa rebuild manual & tanpa downtime panjang (gantikan CloudEndure).",
            sifir: ["MGN = whole SERVER (OS + apps + data) → EC2; lift-and-shift / rehost", "Continuous block-level replication + one-click cutover = minimal downtime", "Source: physical, VMware, Hyper-V, cloud instance → target EC2", "MGN = server; DMS = database; DataSync = file/object", "Application Discovery Service = PLANNING/discovery je, BUKAN migrate"],
            perangkap: [{"soalan": "Migrate 100 on-prem servers (OS + applications) ke EC2 dengan minimal downtime, lift-and-shift. Pilih apa?", "jebakan": "AWS DMS — 'minimal downtime' ada, tapi DMS cuma DATABASE; server penuh OS+apps bukan kerja DMS.", "betul": "AWS MGN — keyword 'entire server / rehost / lift-and-shift ke EC2' = MGN (continuous block replication)."}, {"soalan": "Sebelum migrate, team nak discover & map dependency aplikasi on-prem dulu. Guna apa?", "jebakan": "AWS MGN — MGN handle migration, tapi tak buat discovery/dependency mapping fasa perancangan.", "betul": "Application Discovery Service — keyword 'discover / inventory / dependency / planning' = ADS, bukan MGN."}],
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
            sebabApa: "Bila kau migrate guna banyak tool sekali gus — MGN untuk server, DMS untuk DB, DataSync untuk file — status berselerak, susah nak tahu projek dah berapa peratus siap. Migration Hub wujud sebagai 'single pane of glass' yang kumpul status dari semua tool tu ke satu dashboard, group resource ikut application. Pain yang ia buang: visibility progress migration merentas banyak tool tanpa cek satu-satu console.",
            sifir: ["Migration Hub = TRACK/visibility sahaja, ia TAK migrate apa-apa", "Aggregate status dari MGN + DMS + DataSync ke satu dashboard", "Wajib pilih HOME REGION untuk simpan data tracking (migration boleh target region lain)", "Strategy Recommendations = nasihat rehost/replatform/refactor", "Group resources jadi 'application' untuk track progress per-app"],
            perangkap: [{"soalan": "Tengah migrate 50 server (MGN) + 10 database (DMS), nak track semua progress dari SATU tempat. Pilih apa?", "jebakan": "Buka console MGN dan DMS berasingan untuk tengok status — boleh tapi berselerak, bukan single view.", "betul": "AWS Migration Hub — keyword 'single dashboard / track migrations across tools' = Migration Hub."}, {"soalan": "Pasukan kata 'guna Migration Hub untuk migrate server ke EC2'. Betul ke?", "jebakan": "Ya — nama 'Migration Hub' bunyi macam ia yang buat migration, ini perangkap utama.", "betul": "TIDAK — Migration Hub cuma TRACK; yang migrate server = MGN, migrate DB = DMS. Hub = dashboard sahaja."}],
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
            sebabApa: "Sesetengah workload TAK boleh pergi cloud — data mesti duduk on-prem atas sebab regulatory/data residency, atau perlu single-digit millisecond latency ke sistem factory/trading on-prem. Outposts wujud sebagai rack hardware AWS sebenar yang AWS hantar & pasang dalam data center kau, run EC2/RDS/EKS/S3 guna API AWS yang SAMA — data tak keluar premise. Pain yang ia buang: dapat pengalaman + API AWS sambil data & compute kekal fizikal on-prem.",
            sifir: ["Outposts = rack hardware AWS DALAM data center kau (on-prem), API AWS sama", "Run EC2, EBS, RDS, ECS, EKS, S3 on Outposts — data kekal on-prem", "Use case: data residency/compliance, ultra-low latency ke sistem on-prem, local processing", "Outposts ≠ data transfer (itu DataSync/Snow) ; ≠ hybrid storage je (itu Storage Gateway)", "Sambung ke AWS region via Direct Connect/internet untuk management plane"],
            perangkap: [{"soalan": "Regulasi kata database mesti kekal on-premises, tapi team nak guna AWS services + API yang sama. Pilih apa?", "jebakan": "AWS Storage Gateway — ia hybrid, tapi cuma untuk STORAGE access ke cloud, tak boleh run compute/RDS penuh on-prem.", "betul": "AWS Outposts — keyword 'data must stay on-prem / data residency + run AWS services locally' = Outposts."}, {"soalan": "Factory perlu compute latency single-digit ms ke peralatan on-prem, tapi nak ekosistem AWS. Pilih apa?", "jebakan": "Run kat AWS region terdekat — latency tetap ada hop ke cloud, tak cukup laju untuk control loop factory.", "betul": "AWS Outposts — keyword 'low latency to on-prem systems + local processing' = Outposts (compute duduk on-prem)."}],
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
            sebabApa: "Dulu nak run aplikasi kena beli server fizikal, tunggu berminggu, setup data center sendiri — mahal & lambat. EC2 wujud bagi kau 'sewa' virtual server dalam minit, scale up/down ikut keperluan, bayar ikut guna, dengan full control atas OS. Pain yang ia buang: tak payah beli/jaga hardware fizikal untuk dapat compute dengan kawalan penuh.",
            sifir: ["Cluster PG = low-latency/HPC (1 AZ); Partition = big data teragih (Hadoop/Kafka); Spread = critical instances (maks 7/AZ)", "On-Demand = no commit; Reserved/Savings Plan = commit 1-3yr (jimat ~72%); Spot = ~90% murah (boleh reclaim)", "Spot interruption notice = 2 minit", "Linux billing per-second (min 60s); Windows per-hour", "Dedicated Host = bayar per-host (BYOL lesen); Dedicated Instance = +region fee tapi tak dapat host visibility"],
            perangkap: [{"soalan": "HPC workload perlu node-to-node latency paling rendah + throughput paling tinggi. Placement group mana?", "jebakan": "Spread placement group — 'spread' bunyi macam bagus untuk performance, tapi spread = sebar untuk availability, bukan low latency.", "betul": "Cluster placement group — keyword 'lowest latency / highest throughput / HPC / tightly-coupled' = Cluster (1 AZ)."}, {"soalan": "Batch job boleh interrupt, nak jimat kos maksimum, tak kisah kalau instance kena ambil balik. Pilih apa?", "jebakan": "Reserved Instance — jimat tapi kena commit 1-3 tahun; untuk workload sementara/interruptible ia bukan paling murah.", "betul": "Spot Instances — keyword 'fault-tolerant / interruptible / cheapest / flexible timing' = Spot (sampai 90% off, 2-min notice)."}],
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
              'PRICING (us-east-1, t3.medium approx): On-Demand ~$0.0416/hr. Reserved (3yr All Upfront) ~72% off. Savings Plans ~66% off. Spot up to 90% off. Dedicated Instance: +$2/hr region fee. Dedicated Host: billed per-host (~$3.20/hr for t3 host). Billing: Linux/Ubuntu per-second (min 60s), Windows per-hour.',
              'Exam: "Linux per-second billing, minimum 60 seconds" → EC2. "Windows billed per-hour" → EC2 Windows. "Dedicated Host billed per physical host" → not per-instance.',
            ],
            keywords: ['full control', 'custom OS', 'lift and shift', 'placement groups', 'cluster/partition/spread', 'pricing', 'per-second billing', 'per-hour Windows', 'On-Demand cost', 'Reserved discount', 'Dedicated Host billing'],
          },
          {
            shortName: 'Lambda',
            fullName: 'AWS Lambda',
            ingat: '"Jalankan code, bayar per run"',
            gunaUntuk: 'Serverless, event-driven',
            fungsi: 'Melaksanakan kod tanpa perlu mengurus server',
            sebabApa: "Untuk kerja kecil & event-driven (resize image bila upload, handle webhook), sewa EC2 24/7 = bayar walau idle + kena patch/scale server sendiri. Lambda wujud supaya kau hantar code je, AWS run bila ada event, scale auto, dan kau bayar HANYA bila code jalan (scale to zero bila takda trafik). Pain yang ia buang: tak payah provision/patch/scale server untuk kerja pendek bersifat event-driven.",
            sifir: ["Lambda = serverless event-driven; bayar bila run je (scale to zero)", "Maks 15 minit (900s) per invocation; lebih lama → Fargate / AWS Batch / Step Functions", "Memory 128MB–10,240MB; CPU naik IKUT memory (1,769MB = 1 vCPU penuh)", "Reserved Concurrency = cap/jamin kuota (PERCUMA, masih cold start); Provisioned Concurrency = buang cold start (BAYAR)", "Default 1,000 concurrent execution/region (soft); /tmp 512MB default sampai 10GB"],
            perangkap: [{"soalan": "API latency-sensitive ada spike trafik boleh dijangka pagi setiap hari, mesti respond tanpa cold start. Pilih apa?", "jebakan": "Reserved Concurrency — bunyi macam 'reserve capacity siap sedia', tapi Reserved cuma HADKAN/jamin kuota, MASIH ada cold start.", "betul": "Provisioned Concurrency — keyword 'no cold start / pre-warmed / predictable spike' = Provisioned Concurrency."}, {"soalan": "Job pemprosesan ambil masa 30 minit setiap run. Lambda sesuai ke?", "jebakan": "Ya, tambah memory & Provisioned Concurrency — orang ingat naik resource boleh extend masa, tapi hard limit 15 min tetap kekal.", "betul": "TIDAK — Lambda hard cap 15 minit. Keyword '>15 min / long-running' → Fargate, AWS Batch, atau Step Functions."}],
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
            mermaid: {
              label: 'Cara ingat — Lambda = Food Truck 🚚, EC2 = kedai 24 jam 🏪',
              source: `flowchart TD
  REQ["Ada permintaan masuk"] --> TYPE{"Server kena sentiasa hidup?"}
  TYPE -->|"Tak — datang bila<br/>ada order je"| L["🚚 Lambda (Food Truck)<br/>hidup bila dipanggil,<br/>tutup bila siap → bayar bila guna je"]
  TYPE -->|"Ya — kena standby 24/7"| E["🏪 EC2 (Kedai 24 jam)<br/>buka walau takda pelanggan<br/>→ bayar walau idle"]
  L --> CHK{"Kerja lebih 15 minit?"}
  CHK -->|"Ya"| LONG["❌ Lambda tak boleh<br/>→ Fargate / AWS Batch"]
  CHK -->|"Tak, pendek + event-driven"| OK["✅ Lambda sesuai<br/>(scale to zero, cold start risk)"]`,
              caption: 'Analogi: Lambda = Food Truck (hidup bila ada order, tutup bila habis — kalau takda orang, kos = RM0). EC2 = kedai makan 24 jam (kena bayar sewa + gaji walaupun pukul 3 pagi takda pelanggan). INGAT exam: "pay only when running / scale to zero / event-driven" → Lambda. "lebih 15 minit" → Lambda GAGAL, guna Fargate atau AWS Batch.',
            },
            tips: [
              'Had penting: maks 15 minit (900s) per invocation. Job lebih lama → guna ECS/Fargate, AWS Batch, atau Step Functions',
              'Memory 128 MB–10,240 MB (step 1 MB). CPU naik IKUT memory — 1,769 MB = 1 vCPU penuh. Nak laju? naik memory, CPU auto naik',
              'Concurrent executions default = 1,000/region (soft). Lebih → throttle (429 TooManyRequestsException)',
              '/tmp ephemeral storage: 512 MB default, boleh naik sampai 10,240 MB (10 GB)',
              'Deployment package: 50 MB (zip, direct upload) / 250 MB (unzipped + layers), atau container image sampai 10 GB',
              'Cold start = masa init environment + load code; teruk untuk VPC/package besar. Kurangkan dengan Provisioned Concurrency',
              'PRICING: Free tier — 1M requests/mo + 400,000 GB-seconds/mo (forever). Selepas free tier: $0.20 per 1M requests + $0.0000166667 per GB-second. GB-second = memory allocated × duration. Provisioned Concurrency = $0.0000041667 per vCPU-hour + $0.000000111 per GB-hour (config + execution).',
              'Exam: "1 million free requests per month forever" → Lambda free tier. "pay per request + duration" → Lambda pricing model. "Provisioned Concurrency has hourly cost" → yes, separate from execution.',
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
            sebabApa: "Developer nak deploy app cepat tapi tak nak setup EC2 + ALB + Auto Scaling + health monitoring satu-satu secara manual. Elastic Beanstalk wujud sebagai PaaS: kau hantar code (.zip/.war), ia auto-bina & urus semua infra bawah, tapi kau MASIH boleh akses & tweak resource tu (beza dengan Lambda yang fully abstracted). Pain yang ia buang: deploy app tanpa jadi expert infra, tapi tak hilang kawalan.",
            sifir: ["Beanstalk = PaaS; hantar code, ia auto-create EC2 + ALB + ASG + health monitoring", "Beanstalk PERCUMA; bayar resource bawah (EC2, ALB) yang ia provision", "Beanstalk = opinionated deploy APP; CloudFormation = IaC general semua resource", "Beanstalk = app run atas server (kau nampak EC2); Lambda = no server, event-driven", "JANGAN keliru: EBS = Elastic Block Store (disk) ≠ Elastic Beanstalk (deploy app)"],
            perangkap: [{"soalan": "Developer nak deploy web app cepat, tak nak urus infra, TAPI masih nak boleh tweak EC2/scaling settings. Pilih apa?", "jebakan": "AWS Lambda — serverless senang, tapi Lambda fully abstracted (no server akses) + had 15 min, bukan untuk app web sentiasa run.", "betul": "Elastic Beanstalk — keyword 'deploy app fast + still control underlying EC2/scaling' = Beanstalk (PaaS)."}, {"soalan": "Soalan sebut 'EBS' untuk deploy aplikasi. Maksudnya Elastic Beanstalk?", "jebakan": "Ya, EBS = Elastic Beanstalk — singkatan menipu, kedua start 'EB'.", "betul": "TIDAK — EBS = Elastic Block Store (disk storage). Deploy app = Elastic Beanstalk (jarang disingkat EBS dalam exam)."}],
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
            ingat: '"Docker manager AWS-native — Cluster → Service → Task ikut Task Definition"',
            gunaUntuk: 'Run & orchestrate Docker containers (AWS-native, bukan Kubernetes)',
            fungsi: 'Mengurus dan menjalankan Docker containers pada cluster. Hierarki: Cluster (pool capacity) → Service (jaga desired count) → Task (satu running unit) yang dicetak dari Task Definition (blueprint JSON). Dua launch type: EC2 (kau urus instances) atau Fargate (serverless).',
            sebabApa: "Run Docker container atas EC2 sendiri = kena urus cluster, scheduling container mana pergi host mana, restart bila mati, register ke load balancer — semua manual. ECS wujud sebagai orchestrator Docker AWS-native: kau define Task Definition (resepi), ECS jaga Service supaya desired count tasks sentiasa running, restart bila fail, attach ke ALB + auto-scale. Pain yang ia buang: jalankan & jaga container berskala tanpa build orchestration sendiri (dan tak perlu belajar Kubernetes macam EKS).",
            sifir: ["Hierarki: Cluster → Service (jaga desired count) → Task (dari Task Definition blueprint JSON)", "Launch type: EC2 (kau urus host) vs Fargate (serverless, no host)", "Task Role = app dalam container call AWS API; Task Execution Role = agent pull image ECR + tulis log", "Placement: binpack = jimat kos (pack padat); spread = HA (sebar by AZ) — EC2 launch type je", "Fargate = best-effort AZ spread, no placement strategy/constraint, no instance role"],
            perangkap: [{"soalan": "Run Docker containers dengan operational overhead PALING rendah, tak nak urus/patch server. Launch type mana?", "jebakan": "EC2 launch type + Auto Scaling — boleh scale, tapi kau MASIH kena patch & manage EC2 host = ada ops overhead.", "betul": "Fargate — keyword 'least operational overhead / no servers to manage / serverless container' = Fargate."}, {"soalan": "Container ECS gagal pull image dari ECR dan tak boleh tulis log ke CloudWatch. IAM role mana kena betulkan?", "jebakan": "Task Role — orang ingat semua akses AWS guna Task Role, tapi Task Role untuk APP code (S3/DynamoDB), bukan pull image.", "betul": "Task Execution Role — keyword 'pull image from ECR / write logs to CloudWatch' = Task Execution Role (agent), bukan Task Role."}],
            contohGuna: 'Run microservices dalam Docker, e-commerce modules',
            detailsLabel: 'ECS — komponen & hierarki',
            storageDetails: 'Cluster → pool logikal capacity (EC2 instances atau Fargate) tempat tasks jalan\nTask Definition → blueprint JSON: image, vCPU, memory, ports, env vars, volumes + Task Role + Task Execution Role. BUKAN benda yang "run" — ia resepi sahaja\nTask → satu running instance dari Task Definition (boleh ada 1+ container)\nService → pastikan desired count tasks SENTIASA running (restart kalau mati), boleh attach ke ALB + auto-scaling\nTask Role → IAM role yang APP DALAM container guna untuk panggil AWS (S3, DynamoDB) — per-task IAM\nTask Execution Role → IAM role yang ECS/Fargate AGENT guna untuk pull image dari ECR + tulis log ke CloudWatch (bukan untuk app code)',
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
              {
                label: '3 IAM role dalam ECS — jangan keliru (selalu kena exam)',
                headers: ['Role', 'Siapa guna', 'Untuk apa'],
                rows: [
                  ['Task Role', '🟢 APP kau dalam container', 'Panggil AWS API: S3, DynamoDB, SQS — per-task IAM, app-level'],
                  ['Task Execution Role', 'ECS / Fargate AGENT', 'Pull image dari ECR + tulis log ke CloudWatch + amik secret. BUKAN app code'],
                  ['EC2 Instance Role', 'EC2 host (EC2 launch type)', 'Benarkan ECS agent register instance ke cluster. Hanya wujud bila EC2 launch type'],
                ],
                takeaway: '"Container/app perlu akses S3/DynamoDB" → Task Role. "Task gagal pull image dari ECR / tak boleh tulis log" → fix Task Execution Role. Fargate = TIADA instance role (no host). NOTA: EC2 launch type tiada task isolation — container boleh capai credentials task lain di host sama; nak isolation ketat → Fargate.',
              },
            ],
            mermaid: [
              {
                label: 'Anatomi ECS — Cluster → Service → Task ← Task Definition',
                source: `flowchart TD
  TaskDef["📋 Task Definition (blueprint/resepi)<br/>image · vCPU · memory · port · env<br/>+ Task Role + Task Execution Role"] -.->|"dicetak jadi"| Task1
  Cluster["🏢 Cluster — pool capacity<br/>(EC2 instances atau Fargate)"] --> Service["👨‍🍳 Service<br/>jaga desired count = N<br/>restart kalau task mati · attach ALB"]
  Service --> Task1["🍽️ Task (running)"]
  Service --> Task2["🍽️ Task (running)"]
  Task1 --> C1["📦 Container(s)"]`,
                caption: 'Cluster = bangunan, Service = ketua yang pastikan sentiasa ada N pinggan, Task = satu pinggan yang sedang dimasak, Task Definition = resepi (blueprint, bukan benda yang run). INGAT exam: "best describes a task definition" → JSON blueprint/template yang describe containers, BUKAN service/task yang running.',
              },
              {
                label: 'Analogi — ECS = restoran mamak',
                source: `flowchart LR
  TD["📋 Task Definition = MENU/resepi<br/>(roti canai: tepung, berapa keping, harga)"] --> T["🍽️ Task = pinggan roti<br/>yang sedang dihidang"]
  SVC["👨‍🍳 Service = ketua dapur<br/>'mesti ada 5 pinggan ready'<br/>(jatuh 1 → masak ganti)"] --> T
  CL["🏢 Cluster = dapur restoran<br/>(EC2 = kau sewa dapur sendiri ·<br/>Fargate = guna dapur kongsi, datang masak je)"] --> SVC`,
                caption: 'Kaitkan dengan familiar: menu = Task Definition (cuma kertas resepi), pinggan terhidang = Task, ketua dapur jaga stok = Service (desired count), dapur = Cluster. Sewa dapur sendiri = EC2 launch type; guna dapur kongsi tanpa urus = Fargate. INGAT exam: "least operational overhead / no servers" → Fargate; "kawal host (GPU/fleet murah)" → EC2.',
              },
            ],
            scenario: '"Best describes a task definition" → JSON blueprint/template yang describe containers (image, CPU, memory, ports). "Container app perlu akses S3 dengan least privilege" → Task Role (per-task IAM). "Task tak boleh pull image dari ECR" → Task Execution Role rosak. "Maintain N running copies + auto-restart" → Service. "Run container least ops, no servers" → Fargate. "Pack tasks jimat kos" → binpack; "sebar AZ untuk HA" → spread.',
            tips: [
              'Task Role vs Task Execution Role (SELALU kena exam): Task Role = IAM untuk APP DALAM container panggil AWS (S3, DynamoDB) — per-task least privilege. Task Execution Role = IAM untuk ECS/Fargate AGENT pull image dari ECR + tulis CloudWatch logs + amik Secrets Manager. Keliru dua ni = silap jawab.',
              'Task placement: binpack = jimat kos (padat), spread = HA (sebar AZ), random = rawak. Constraint: distinctInstance, memberOf',
              'Task Definition = JSON template yang describe containers untuk application (image, CPU, memory, ports, env vars, volumes)',
              'Task Definition BUKAN: IAM template, bukan service yang launch clusters, bukan program yang run — ia BLUEPRINT untuk containers',
              'ECS Launch Types: Fargate (serverless, AWS manage infrastructure) vs EC2 (kau manage EC2 cluster)',
              'Task = running instance of a Task Definition. Service = maintain desired number of running tasks',
              'Exam: "best describes a task definition" → JSON template that describes containers that form your application',
            ],
            docs: [
              { label: 'ECS task IAM role (Task Role)', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html' },
              { label: 'ECS task execution IAM role', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html' },
              { label: 'ECS task placement strategies', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html' },
            ],
            keywords: ['Docker', 'containers', 'microservices', 'task definition', 'JSON template', 'Fargate', 'EC2 launch type', 'service', 'task', 'cluster', 'Task Role', 'Task Execution Role', 'per-task IAM', 'binpack', 'spread', 'random', 'task placement', 'desired count'],
          },
          {
            shortName: 'EKS',
            fullName: 'Elastic Kubernetes Service',
            ingat: '"Kubernetes manager"',
            gunaUntuk: 'Container orchestration guna K8s',
            fungsi: 'Mengurus Kubernetes cluster untuk container orchestration',
            sebabApa: "EKS wujud sebab ramai team dah pakai Kubernetes (K8s) on-prem / multi-cloud dengan semua YAML, Helm chart & tooling sedia ada — tapi run K8s control plane sendiri (etcd, API server, scheduler) memang menyakitkan dan kena patch + HA sendiri. EKS ambil alih kepala (control plane) yang managed + HA across AZ, kau urus worker nodes/pods je, supaya skill K8s kau boleh terus pakai tanpa lock ke AWS-proprietary macam ECS. IRSA pula wujud sebab dulu pod kena simpan AWS credentials dalam image — bahaya; IRSA bagi pod assume IAM role terus, no secret tersimpan.",
            sifir: ["EKS = managed Kubernetes; ECS = AWS-proprietary orchestrator", "EKS control plane ~$0.10/jam/cluster; ECS control plane FREE", "Pilih EKS bila: dah ada K8s skill/YAML/Helm atau nak portable multi-cloud", "Pod access AWS tanpa simpan credentials = IRSA (IAM Roles for Service Accounts)", "ConfigMap = non-sensitive config je, BUKAN tempat secret", "Least ops + tak reti K8s = ECS Fargate, BUKAN EKS"],
            perangkap: [{"soalan": "Company nak run containers di AWS, team baru, tak ada pengalaman Kubernetes, nak least operational overhead. Pilih mana?", "jebakan": "EKS — sebab 'Kubernetes' bunyi macam standard industri & power, ramai ingat container = K8s.", "betul": "ECS Fargate — keyword 'no K8s knowledge + least ops'. EKS ada learning curve tinggi + bayar control plane. ECS Fargate = AWS-native, serverless, paling senang."}, {"soalan": "EKS pods perlu baca secret dari Secrets Manager tanpa hardcode credentials dalam container image. Cara terbaik?", "jebakan": "Simpan access key dalam Kubernetes ConfigMap atau dalam image — nampak macam senang, terus boleh pakai.", "betul": "IRSA (IAM Roles for Service Accounts) — pod assume IAM role via service account annotation, zero credentials tersimpan. ConfigMap BUKAN untuk secret."}],
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
            scenario: '"Dah ada Kubernetes skill/YAML/Helm, nak portable across cloud" → EKS (bukan ECS). "Just run containers, AWS-only, least learning" → ECS. "EKS pods access AWS tanpa simpan credentials" → IRSA. "K8s control plane managed tapi nak run on-prem consistent" → EKS Anywhere. NOTA: control plane EKS ada kos (~$0.10/jam/cluster); ECS control plane percuma.',
            docs: [
              { label: 'Amazon EKS — what is it', url: 'https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html' },
              { label: 'IAM Roles for Service Accounts (IRSA)', url: 'https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html' },
            ],
            keywords: ['Kubernetes', 'K8s', 'container orchestration', 'IRSA', 'IAM Roles for Service Accounts', 'pod identity', 'ECS vs EKS', 'control plane cost'],
          },
          {
            shortName: 'EKS Variants',
            fullName: 'EKS Anywhere vs EKS Distro vs ECS Anywhere',
            ingat: '"EKS Anywhere = K8s on-prem + AWS control plane. EKS Distro = pure on-prem, no AWS control plane. ECS Anywhere = ECS on-prem"',
            gunaUntuk: 'Run container workloads on-premises with varying levels of AWS integration',
            fungsi: 'AWS menyediakan pelbagai pilihan untuk run containers on-premises dengan degrees berbeza dari AWS control plane dependency.',
            sebabApa: "Variants ni wujud sebab tak semua workload boleh hidup penuh dalam cloud — ada compliance/latency/data residency yang paksa container run on-premises, tapi team tetap nak experience & consistency AWS. EKS Anywhere bagi kau run K8s on-prem tapi connect ke AWS untuk management consistency; EKS Distro pula bagi distribusi K8s yang sama macam EKS guna tapi 100% on-prem tanpa bergantung AWS control plane (elak lock-in); ECS Anywhere bawak ECS task ke server on-prem kau sendiri.",
            sifir: ["EKS Anywhere = K8s on-prem + connect AWS control plane untuk consistency", "EKS Distro = distribusi K8s sama macam EKS, run penuh on-prem, NO AWS control plane", "ECS Anywhere = run ECS task atas server on-prem kau", "Keyword 'open-source + on-prem + AWS consistency' = EKS Anywhere", "Keyword 'no AWS lock-in + on-prem K8s' = EKS Distro"],
            perangkap: [{"soalan": "Company nak run open-source Kubernetes on-premises tapi nak konsistensi & management dari AWS control plane. Pilih mana?", "jebakan": "EKS Distro — sebab 'open-source Kubernetes on-prem' padan, orang terus pilih.", "betul": "EKS Anywhere — keyword pembeza ialah 'consistency with AWS control plane'. EKS Distro JUSTRU tiada AWS control plane dependency (untuk no lock-in)."}],
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
            sebabApa: "User Data wujud sebab tak masuk akal nak SSH masuk satu-satu setiap EC2 baru untuk install software & configure — apatah lagi bila ASG auto-launch 50 instance. User Data bagi instance configure DIRI SENDIRI masa first boot (install package, pull code, set config) supaya launch boleh full automated, no manual touch.",
            sifir: ["User Data run SEKALI je — masa instance first boot", "Max size = 16KB (base64 sebelum encode)", "Run as root, guna bash script atau cloud-init", "Keyword exam: 'bootstrap / initialization script during launch' = User Data", "Metadata = info pasal instance; User Data = SCRIPT yang run — jangan keliru"],
            perangkap: [{"soalan": "ASG launch instance EC2 baru perlu auto-install Apache + download app config setiap kali scale-out, tanpa admin SSH masuk. Guna apa?", "jebakan": "EC2 Instance Metadata — sebab nama bunyi macam 'set up instance', orang campur aduk metadata dengan user data.", "betul": "EC2 User Data — keyword 'auto-install on launch / bootstrap'. Metadata cuma BACA info pasal instance (IP, instance ID, IAM role), ia tak RUN script."}],
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
            sebabApa: "Hibernation wujud sebab sesetengah app ambil masa lama untuk warm-up RAM (in-memory cache, JVM, dataset besar dalam memory) — kalau Stop biasa, RAM state hilang & kena re-initialize dari kosong setiap start (cold start lambat). Hibernation simpan seluruh isi RAM ke EBS root volume, jadi bila resume, OS & app sambung balik EXACTLY macam sebelum — no re-warm, resume laju.",
            sifir: ["Hibernation = simpan isi RAM ke EBS root volume, resume laju tanpa re-init", "EBS root volume MESTI encrypted untuk hibernation", "Bukan semua instance type support hibernation", "Stop/Start biasa = RAM HILANG; Reboot = OS restart; Hibernate = RAM KEKAL", "Keyword 'preserve in-memory state + fast recovery' = Hibernation, BUKAN AMI"],
            perangkap: [{"soalan": "App in-memory cache ambil 20 minit untuk warm-up. Nak stop instance waktu malam jimat kos, tapi pagi resume terus warm tanpa re-load. Pilih apa?", "jebakan": "Buat AMI sebelum stop, restore dari AMI pagi esok — nampak macam 'simpan state'.", "betul": "EC2 Hibernation — AMI cuma snapshot DISK, ia TAK simpan RAM/in-memory state. Hanya Hibernation preserve RAM contents (saved to encrypted EBS root)."}, {"soalan": "Memory-intensive app, nak elak long initialization time & resume dengan application state SAMA atas backup instance, on-demand. Cara paling tepat?", "jebakan": "Stop instance bila tak guna, Start balik bila perlu — nampak paling jimat kos & macam 'instance sama balik'.", "betul": "EC2 Hibernation atas backup instance, resume on-demand. Stop/Start biasa KOSONGKAN RAM → memory-intensive app kena re-initialize dari kosong = long init time. Hanya Hibernate simpan RAM state untuk resume pantas."}],
            scenario: 'Formula poket: "memory-intensive app" + "long initialization / warm-up time" + "preserve application state across restart" → EC2 Hibernation. BUKAN Stop/Start (RAM cleared, kena warm-up balik), BUKAN AMI/launch baru (disk snapshot je, cold boot, RAM kosong), BUKAN Reboot (tak simpan RAM state).',
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
            sebabApa: "IMDS wujud sebab app dalam EC2 selalu perlu tahu 'aku ni siapa' — public/private IP sendiri, instance ID, IAM role yang attached — tanpa kena hardcode atau panggil AWS API dari luar. Endpoint 169.254.169.254 bagi instance query info diri sendiri & retrieve temporary IAM credentials secara automatik. IMDSv2 wujud pula untuk patch SSRF attack (paksa guna session token, bukan simple GET) yang IMDSv1 terdedah.",
            sifir: ["Endpoint metadata = http://169.254.169.254/latest/meta-data/", "Bagi info: instance ID, IP, hostname, IAM role name, security groups", "IMDSv2 = token-based (lebih selamat, lawan SSRF); IMDSv1 = simple request", "Metadata = info pasal instance; User Data = script yang run — beza!", "IAM role credentials di-retrieve via metadata endpoint (auto-rotate)"],
            perangkap: [{"soalan": "App dalam EC2 perlu retrieve temporary IAM role credentials & instance ID dari dalam instance itu sendiri. Guna apa?", "jebakan": "EC2 User Data — sebab dua-dua duduk 'dalam EC2' & nama bunyi serupa, mudah tertukar.", "betul": "EC2 Instance Metadata (IMDS, 169.254.169.254) — ia BACA info & credentials pasal instance. User Data cuma RUN script masa boot, bukan untuk query info."}, {"soalan": "Security audit nak halang SSRF attack curi IAM credentials dari metadata endpoint. Tindakan?", "jebakan": "Block port 169.254.169.254 dengan security group — SG tak boleh control link-local address, jadi tak jalan.", "betul": "Enforce IMDSv2 (token/session-based) — keyword 'SSRF / metadata credential theft'. IMDSv2 paksa PUT token dulu, halang attack yang exploit IMDSv1."}],
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
            sebabApa: "Recycle Bin wujud sebab dulu kalau orang tersilap delete AMI atau EBS snapshot, ia terus PERMANENT hilang — tiada undo, recovery susah/mustahil. Recycle Bin jadi safety net: resource yang deleted ditahan untuk tempoh retention (1 hari sampai 1 tahun) sebelum benar-benar dipadam, jadi accidental deletion boleh di-restore.",
            sifir: ["Recycle Bin = safety net untuk AMI & EBS snapshot yang ter-delete", "Retention period: 1 hari sampai 1 tahun (set via Retention Rule)", "Lepas retention habis = permanently deleted", "Keyword 'recover accidentally deleted AMI/snapshot' = Recycle Bin", "Cover AMI + EBS snapshot je — bukan EC2 instance / EBS volume"],
            perangkap: [{"soalan": "Admin tersilap delete production AMI. Nak ada cara recover AMI/snapshot yang ter-delete dalam tempoh tertentu. Setup apa?", "jebakan": "CloudFormation StackSets — sebab 'restore/redeploy' bunyi macam boleh bring back resources.", "betul": "Recycle Bin + Retention Rule — keyword 'recover accidentally deleted AMI/snapshot'. StackSets cuma untuk deploy stack multi-account/region, ia TAK boleh recover AMI yang dah delete."}],
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
            ingat: '"Mandor batch jobs — submit kerja, AWS upah & bubar pekerja (compute) sendiri"',
            gunaUntuk: 'Run batch / long-running compute jobs at scale without managing EC2 infrastructure',
            fungsi: 'AWS Batch menguruskan semua infrastruktur untuk batch jobs: provision compute resources yang sesuai, schedule jobs dalam queues, monitor dan scale fleet secara automatik, kemudian BUBAR bila kerja habis. Tiada had masa macam Lambda — sesuai untuk job berjam-jam (rendering, genomics, ETL berat, simulation). Menggantikan third-party batch software seperti PBS, Slurm, LSF.',
            sebabApa: "AWS Batch wujud sebab kalau kau ada beribu job berat (rendering, genomics, simulation, ETL berjam-jam) yang perlu beratur ikut priority, dulu kau kena urus sendiri EC2 fleet + scheduler third-party (Slurm/LSF/PBS) — provision, scale, bubar, semua manual & menyakitkan. Batch ambil alih: kau hantar job ke queue, Batch provision compute sesuai (boleh Spot untuk jimat), run sampai habis, lepas tu BUBAR fleet auto. Tiada had masa 15 minit macam Lambda.",
            sifir: ["Batch SENDIRI percuma — bayar EC2/Fargate + EBS di bawah je", "Tiada had masa (Lambda max 15 min) — sesuai job berjam-jam", "4 komponen: Job, Job Definition, Job Queue, Compute Environment", "Compute Environment boleh guna Spot = jimat sampai 90%", "Keyword 'batch / queue of jobs / run-to-completion at scale' = AWS Batch", "Satu container long-running tanpa queue = Fargate, BUKAN Batch"],
            perangkap: [{"soalan": "Company guna Slurm untuk manage EC2 fleet jalankan ribuan genomics job berjam-jam dengan queue & priority. Nak switch ke AWS managed service, jimat guna Spot. Pilih?", "jebakan": "Lambda — sebab 'managed, no server' bunyi menarik & serverless.", "betul": "AWS Batch — keyword 'queue of jobs + run-to-completion at scale + Spot'. Lambda ada had 15 minit (job berjam-jam tak muat), dan tiada concept job queue/priority macam Batch."}, {"soalan": "Satu container processing job yang ambil 40 minit, run satu-satu bila ada request, tiada queue banyak job. Pilih?", "jebakan": "AWS Batch — sebab '40 minit > 15 minit jadi bukan Lambda, mesti Batch'.", "betul": "Fargate — keyword 'satu container, tiada queue of jobs'. Batch sesuai bila ada MANY jobs beratur + priority. Satu long-running container tanpa queue = Fargate."}],
            detailsLabel: 'AWS Batch — 4 komponen',
            storageDetails: 'Job → satu unit kerja (container/script) yang kau submit\nJob Definition → blueprint: image mana, vCPU, memory, IAM role\nJob Queue → tempat job beratur ikut priority sebelum dijalankan\nCompute Environment → EC2 atau Fargate resources yang Batch provision (boleh guna Spot untuk jimat)',
            compare: {
              label: 'Job lama / berat — Batch vs Fargate vs Lambda vs EC2',
              headers: ['Service', 'Sesuai bila', 'Had masa', 'Siapa urus compute'],
              rows: [
                ['AWS Batch', '🟢 Banyak batch job / array job berjadual, perlu queue + priority + Spot', 'Tiada had', 'AWS provision & bubar fleet auto'],
                ['ECS/EKS Fargate', 'Satu app/job container run lama atau 24/7, no queue needed', 'Tiada had', 'AWS (serverless container)'],
                ['Lambda', 'Tugas pendek event-driven', '🔴 Maks 15 minit', 'AWS (serverless function)'],
                ['EC2 (sendiri/ASG)', 'Perlu kawalan penuh OS / GPU / fleet steady murah', 'Tiada had', '🔴 Kau patch & scale sendiri'],
              ],
              takeaway: 'Exam keyword "batch processing", "queue of jobs", "run to completion at scale", "scientific/rendering/genomics" → AWS Batch (queue + auto Spot). Satu container long-running tanpa queue → Fargate. "Lebih 15 minit" je → BUKAN Lambda. Batch SENDIRI percuma — bayar hanya EC2/Fargate di bawahnya.',
            },
            mermaid: {
              label: 'Cara ingat — "Job ambil masa berapa lama?"',
              source: `flowchart TD
  Q["Ada kerja compute nak run.<br/>Berapa lama?"] --> T{"Lebih 15 minit?"}
  T -->|"Tak — tugas pendek<br/>event cetus"| L["⚡ Lambda<br/>(scale to zero)"]
  T -->|"Ya, lama / berat"| BATCH{"Banyak job beratur<br/>+ perlu priority/Spot?"}
  BATCH -->|"Ya — pukal 'batch'"| B["🧑‍🏭 AWS Batch<br/>queue + auto fleet + Spot"]
  BATCH -->|"Tak, satu app je<br/>run berterusan"| F["📦 Fargate<br/>(serverless container)"]
  BATCH -->|"Perlu kawal OS/GPU,<br/>fleet steady murah"| E["🖥️ EC2 / ASG<br/>(kau urus)"]`,
              caption: 'Analogi: AWS Batch = MANDOR projek — kau hantar senarai kerja (jobs) dalam baris (queue), mandor upah pekerja (EC2/Fargate, boleh upah pekerja kontrak murah = Spot) ikut keperluan, siap kerja terus bubar. Macam "basuh 100 helai baju": Lambda = tangan tapi kena berhenti lepas 15 min; Batch = upah ramai pekerja basuh serentak ikut baris kerja. INGAT exam: "batch", "queue of jobs", "run-to-completion at scale" → AWS Batch.',
            },
            scenario: '"Company guna third-party software (Slurm/LSF/PBS) untuk manage EC2 fleet untuk batch jobs, nak switch ke AWS managed service" → AWS Batch. "Job genomics/rendering/simulation berjam-jam, banyak job beratur" → AWS Batch. "Lebih 15 minit tapi satu container je" → Fargate (bukan Lambda).',
            tips: [
              'Batch = untuk jobs yang run sampai habis (start-to-finish) di skala besar dengan queue, BUKAN continuous web workloads (itu Fargate/EC2)',
              'AWS Batch auto-provision compute (EC2 atau Fargate) — termasuk Spot untuk jimat sampai 90%',
              'Tiada had masa 15 minit macam Lambda — sebab tu Batch/Fargate jadi jawapan untuk "long-running job"',
              'Ingat: Batch ≠ SSM (SSM = manage existing infra). Batch ≠ Athena (Athena = query S3 data). Batch ≠ Step Functions (SF = orchestrate workflow, bukan provision compute)',
              'PRICING: AWS Batch SENDIRI percuma — tiada caj tambahan. Kau bayar HANYA resources di bawahnya (EC2/Fargate + EBS). Guna Spot dalam Compute Environment untuk diskaun besar.',
            ],
            docs: [
              { label: 'What Is AWS Batch?', url: 'https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html' },
              { label: 'AWS Batch', url: 'https://aws.amazon.com/batch/' },
            ],
            keywords: ['AWS Batch', 'batch computing', 'long-running job', 'managed', 'job queue', 'job definition', 'compute environment', 'EC2 fleet', 'Fargate', 'Spot', 'run to completion', 'replace third-party', 'pricing'],
          },
          {
            shortName: 'Fargate',
            fullName: 'AWS Fargate',
            ingat: '"Serverless CONTAINER — bawak Docker image je, tak payah ada EC2"',
            gunaUntuk: 'Run container (ECS/EKS) tanpa urus EC2 langsung',
            fungsi: 'Fargate = serverless compute engine untuk CONTAINER (ECS & EKS). Kau bungkus app dalam Docker image, set CPU + memory per task, define networking + IAM — Fargate yang provision, run, patch & scale compute secara automatik. Tiada EC2 instance untuk kau urus. Tiap task ada isolation sendiri (tak kongsi kernel/CPU/memory/ENI dengan task lain). Bayar per vCPU + memory per SAAT masa task running.',
            sebabApa: "Fargate wujud sebab run container atas ECS/EKS guna EC2 bermakna kau kena urus host: patch OS, scale cluster, capacity planning, bin-packing task — semua ops yang membebankan. Fargate buang semua itu: kau bagi Docker image + set CPU/memory, AWS provision compute terpencil & scale auto. Zero server untuk diurus — kau fikir container je, bukan host.",
            sifir: ["Fargate = serverless compute untuk CONTAINER (ECS & EKS)", "Bayar per vCPU + memory per SAAT masa task running", "Tiada had masa — boleh run 24/7 (lawan Lambda max 15 min)", "Fargate Spot = diskaun besar, amaran 2 minit sebelum reclaim", "Tiap task terpencil (own kernel/CPU/memory/ENI)", "'Run container, least ops, no servers' = Fargate; 'host-level control / murah at steady scale' = EC2 launch type"],
            perangkap: [{"soalan": "Migrate Docker microservice yang run berterusan (24/7) ke AWS dengan operational overhead paling minimum, tak nak urus EC2 langsung. Pilih?", "jebakan": "Lambda — sebab 'serverless, no infra' & dua-dua 'serverless' jadi orang campur.", "betul": "ECS/EKS on Fargate — keyword 'container + run berterusan + no EC2'. Lambda = FUNCTION event-driven max 15 min, bukan untuk container long-running 24/7."}, {"soalan": "Workload steady 24/7 besar yang perlu paling murah per unit + kawalan host (GPU). Pilih?", "jebakan": "Fargate — sebab 'no server management' nampak senang & moden.", "betul": "ECS/EKS on EC2 — keyword 'cheapest at steady scale + host-level/GPU control'. Fargate lagi mahal per unit & tiada akses host; EC2 (+RI/SP) lebih murah untuk fleet steady."}],
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
            sebabApa: "ECR wujud sebab kalau kau simpan Docker image di Docker Hub (public) untuk production, ada risiko security, rate limit, dan tiada IAM control yang rapat. ECR jadi private registry dalam AWS: access ikut IAM (bukan login Docker Hub), auto-scan vulnerability, encrypt at rest dengan KMS, dan integrate native dengan ECS/EKS/Fargate supaya pull image masa launch jadi seamless & selamat.",
            sifir: ["ECR = PRIVATE container registry (lawan Docker Hub public)", "Access guna IAM, bukan login Docker Hub", "Image scanning: basic (on push) atau enhanced (Amazon Inspector) untuk CVE", "Encrypt at rest dengan KMS; ada cross-region & cross-account replication", "Lifecycle policy auto-buang image lama/untagged supaya jimat storage", "Keyword 'store container image privately untuk ECS/EKS' = ECR"],
            perangkap: [{"soalan": "Company nak simpan Docker image untuk deployment ECS/EKS secara private dengan access control IAM + auto-scan vulnerability. Pilih?", "jebakan": "Docker Hub private repo — sebab 'tempat simpan Docker image' terus terlintas Docker Hub.", "betul": "Amazon ECR — keyword 'private + IAM-controlled + vulnerability scanning + ECS/EKS native'. Docker Hub bukan AWS-IAM integrated & scanning tak native."}],
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
          {
            shortName: 'Instance Store',
            fullName: 'Amazon EC2 Instance Store',
            ingat: '"Disk sementara dalam EC2 — laju tapi data hilang bila stop"',
            gunaUntuk: 'Temporary block storage physically attached to the host server — highest IOPS, zero cost',
            fungsi: 'Instance store adalah ephemeral disk yang FIZIKAL berada pada host server EC2. Performance paling tinggi (NVMe, IOPS jutaan) sebab tak melalui network macam EBS. TAPI data HILANG bila instance stop, terminate, atau fail — ia tak persistent. Tak boleh detach, tak boleh snapshot, tak boleh recover.',
            sebabApa: "Instance Store wujud sebab EBS adalah network-attached (lalu network) jadi ada limit IOPS & latency — tak cukup laju untuk workload yang perlukan disk SUPER pantas (scratch space HPC, shuffle Spark/Hadoop, temporary cache). Instance Store ialah disk FIZIKAL pada host server, jadi IOPS jutaan tanpa overhead network. Tukarannya: ia ephemeral — data HILANG bila stop/terminate/host fail, sebab itu hanya untuk data yang boleh rebuild.",
            sifir: ["Instance Store = disk FIZIKAL pada host = jutaan IOPS (lawan EBS network-attached)", "EPHEMERAL: data HILANG bila stop/terminate/host fail; REBOOT = data KEKAL", "Percuma (dah termasuk harga instance)", "Tak boleh snapshot, tak boleh detach, tak boleh resize", "Hanya boleh tambah masa LAUNCH; cuma instance type tertentu (m5d, r5d, i3, z1d)", "Keyword 'high-IOPS temporary, data boleh hilang' = Instance Store; 'survive failure' = EBS"],
            perangkap: [{"soalan": "HPC workload perlu jutaan IOPS untuk scratch/shuffle space, data sementara boleh dibina semula kalau hilang. Pilih?", "jebakan": "EBS io2 — sebab 'IOPS tinggi' terus terfikir io2 Provisioned IOPS.", "betul": "Instance Store — keyword 'jutaan IOPS + scratch + data boleh hilang'. io2 max 64K IOPS & melalui network; Instance Store fizikal = jutaan IOPS, percuma, sesuai untuk scratch."}, {"soalan": "Database storage MESTI survive walaupun instance stop atau host fail. Pilih?", "jebakan": "Instance Store — sebab 'laju' nampak bagus untuk database.", "betul": "EBS — keyword 'survive stop/failure (persistent)'. Instance Store EPHEMERAL: stop/terminate/host fail = data hilang. Database perlu persistent = EBS."}],
            contohGuna: 'Scratch disk untuk HPC/big data processing, temporary cache, buffer, shuffle space untuk Spark/Hadoop',
            detailsLabel: 'Instance Store anatomy',
            storageDetails: 'Disk fizikal pada HOST → tak boleh detach, tak boleh pindah ke instance lain\nEphemeral → data HILANG bila instance stop/terminate/fail\nNVMe atau SSD/HDD → IOPS jauh melebihi EBS (jutaan)\nKos → PERCUMA (termasuk dengan harga instance)\nSize → tetap ikut instance type (tak boleh resize)\nBoleh ditambah HANYA masa launch — tak boleh tambah lepas running',
            compare: {
              label: 'Instance Store vs EBS — the ephemeral vs persistent trap',
              headers: ['Aspect', 'Instance Store', 'EBS'],
              rows: [
                ['Data persistence', '🔴 EPHEMERAL — hilang bila stop/terminate', '🟢 PERSISTENT — data kekal selepas stop/start'],
                ['Performance', '🟢 Jutaan IOPS (fizikal NVMe)', 'Up to 256K IOPS (io2), 16K (gp3)'],
                ['Kos', '🟢 Percuma (dalam harga instance)', 'Bayar per GB + IOPS per bulan'],
                ['Snapshot', '❌ Tak boleh snapshot', '🟢 Boleh snapshot ke S3'],
                ['Resize', '❌ Tetap ikut instance type', '🟢 Elastic Volumes (resize on the fly)'],
                ['Attach', 'Fizikal pada host — tak boleh detach', 'Network-attached — boleh detach/attach'],
                ['Multi-Attach', '❌', '🟢 io1/io2 sahaja'],
              ],
              takeaway: 'Nak performance maksimum + tak kisah data hilang (scratch, cache, temp) → Instance Store. Nak data kekal, boleh snapshot, boleh resize → EBS. Exam: "temporary high-IOPS storage, data can be lost" → Instance Store. "persistent storage survive reboot" → EBS.',
            },
            scenario: '"HPC workload perlu jutaan IOPS untuk scratch space, data boleh hilang takpe" → Instance Store. "Database storage mesti survive instance failure" → EBS (bukan Instance Store). "Cache yang boleh rebuild kalau hilang" → Instance Store.',
            tips: [
              'Instance Store = EPHEMERAL. Stop/start EC2 → data HILANG (instance mungkin pindah ke host fizikal lain). Reboot = data KEKAL (same host).',
              'Tak boleh tambah instance store volume selepas instance running — mesti pilih instance type yang ada store SAAT launch.',
              'Instance store ada HANYA pada instance types tertentu (cth m5d, r5d, i3, z1d). Bukan semua instance type ada disk fizikal.',
              'Exam: "data mesti survive even if instance fails" → JANGAN guna Instance Store → EBS.',
              'Instance Store data hilang bila: (1) instance stop/terminate, (2) instance underlying host fails, (3) instance dipindah ke host lain. Reboot = data KEKAL.',
            ],
            docs: [
              { label: 'Amazon EC2 instance store', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html' },
            ],
            keywords: ['ephemeral', 'temporary storage', 'high IOPS', 'NVMe', 'scratch disk', 'data lost on stop', 'physically attached', 'no snapshot', 'free', 'HPC', 'big data', 'shuffle space'],
          },
          {
            shortName: 'ENI/ENA/EFA',
            fullName: 'EC2 Network Interfaces — ENI · ENA · EFA',
            ingat: '"ENI = kad network biasa. ENA = driver laju. EFA = kad network untuk HPC super-laju"',
            gunaUntuk: 'Network connectivity dan performance — pilih ikut keperluan (standard vs high-throughput vs HPC)',
            fungsi: 'Tiga jenis network "kad" pada EC2: ENI (Elastic Network Interface) = kad network virtual standard, ENA (Elastic Network Adapter) = driver untuk network performance tinggi, EFA (Elastic Fabric Adapter) = kad network special untuk HPC dengan OS-bypass.',
            sebabApa: "Tiga jenis ni wujud sebab keperluan network EC2 berbeza-beza. ENI wujud supaya satu IP/security-group/MAC boleh dipindah antara instance (failover IP dalam subnet). ENA wujud sebab driver network biasa tak cukup untuk app moden yang perlu throughput tinggi (sampai 100 Gbps). EFA wujud sebab workload HPC/ML distributed (MPI) perlu latency super-rendah antara node — EFA bagi OS-bypass (app cakap terus dengan NIC, langkau OS network stack) untuk latency paling rendah.",
            sifir: ["ENI = virtual NIC, boleh detach & pindah ke EC2 lain (failover IP private)", "ENA = driver high-throughput, sampai 25 Gbps (ENAv2 sampai 100 Gbps), default most modern instances", "EFA = ENA + OS-bypass (libfabric/MPI) = latency paling rendah, HPC only, Linux only", "Keyword 'lowest latency inter-node HPC / MPI / distributed ML' = EFA", "EFA + Cluster Placement Group = combo HPC dalam same AZ", "EFA Linux sahaja (Windows tak support OS-bypass)"],
            perangkap: [{"soalan": "HPC cluster jalankan MPI distributed ML training, perlu latency paling rendah antara node yang tightly-coupled. Pilih adapter?", "jebakan": "ENA — sebab 'high performance network' nampak macam jawapan paling laju.", "betul": "EFA (Elastic Fabric Adapter) — keyword 'lowest latency + MPI + tightly-coupled HPC'. ENA laju tapi tiada OS-bypass; hanya EFA bagi OS-bypass untuk latency paling rendah inter-node."}, {"soalan": "EC2 di subnet failover — bila instance utama mati, alamat IP private mesti pindah cepat ke instance standby. Guna apa?", "jebakan": "Tukar IP guna ENA — sebab orang ingat ENA = 'network adapter' jadi boleh urus IP.", "betul": "ENI (Elastic Network Interface) — detach ENI dari instance mati, attach ke standby = IP private ikut sama. ENA cuma driver throughput, bukan untuk pindah IP."}],
            detailsLabel: 'ENI vs ENA vs EFA — anatomy',
            storageDetails: 'ENI → Virtual network card (NIC). Boleh attach ke EC2 untuk network tambahan. Boleh ada IP private, public IP, security groups, MAC address. Boleh detach dari satu EC2 → attach ke EC2 lain (failover IP). Guna untuk: management network, NAT, bastion.\nENA → Elastic Network Adapter = driver/software untuk enable network performance tinggi pada instance yang support. Up to 100 Gbps. Dua versi: ENA (standard, sampai 25 Gbps) dan ENAv2 (sampai 100 Gbps).\nEFA → Elastic Fabric Adapter = NIC special untuk HPC. Ada ENA capabilities + OS-bypass (libfabric API). Instance boleh communicate terus (bypass OS network stack) → latency rendah + throughput tinggi untuk message passing (MPI, CUDA). Hanya Linux.',
            compare: {
              label: 'ENI vs ENA vs EFA — macam mana pilih',
              headers: ['Aspect', 'ENI', 'ENA', 'EFA'],
              rows: [
                ['Apakah dia', 'Virtual NIC (network card)', 'Network driver/adapter', 'HPC network adapter + OS-bypass'],
                ['Performance', 'Standard (1–10 Gbps)', 'High (up to 25 Gbps), ENAv2 up to 100 Gbps', 'Highest (up to 100 Gbps) + lowest latency'],
                ['OS-bypass', '❌', '❌', '🟢 Ya (libfabric, MPI, CUDA direct)'],
                ['Best untuk', 'Standard networking, management, NAT, failover IP', 'High-throughput apps, most modern instance types', 'HPC, ML distributed training, tightly-coupled cluster workloads'],
                ['Platform', 'Semua instance types', 'Most modern instance types (c5, m5, r5…)', 'Hanya HPC-optimized (c5n, p4d, hpc6a…), Linux only'],
              ],
              takeaway: 'Standard networking + failover → ENI. Network performance tinggi untuk app biasa → ENA (dah default pada most modern instances). HPC + MPI + ML distributed training + lowest latency → EFA. Exam: "HPC cluster need lowest latency inter-node communication" → EFA.',
            },
            scenario: '"HPC cluster dengan MPI, perlu lowest latency inter-node" → EFA. "Failover IP — pindah ENI dari EC2 mati ke EC2 baru" → ENI. "App biasa perlukan network lebih laju dari standard" → instance dengan ENA (default on modern types).',
            tips: [
              'ENI boleh pindah antara instances — attach ENI ke EC2 baru untuk failover IP. Ini cara failover IP private dalam subnet.',
              'ENA dah default pada hampir semua instance type moden (c5, m5, r5, dll). ENAv2 (up to 100 Gbps) pada select types.',
              'EFA = ENA + OS-bypass. OS-bypass = app access network card TERUS tanpa OS overhead → latency paling rendah untuk HPC/MPI.',
              'EFA hanya Linux (Windows tak support OS-bypass). EFA hanya pada HPC-optimized instance types.',
              'Placement Group Cluster + EFA = combo untuk HPC (low latency + high throughput antara nodes dalam same AZ).',
              'Exam: "MPI / distributed ML training / lowest latency / tightly-coupled HPC inter-node" → EFA (bukan ENA, bukan ENI).',
            ],
            docs: [
              { label: 'Elastic Network Interfaces (ENI)', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html' },
              { label: 'Elastic Fabric Adapter (EFA)', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html' },
            ],
            keywords: ['ENI', 'ENA', 'EFA', 'network interface', 'virtual NIC', 'OS-bypass', 'libfabric', 'MPI', 'HPC networking', 'low latency', 'failover IP', 'detach attach', '100 Gbps', 'placement group cluster'],
          },
          {
            shortName: 'Lambda@Edge',
            fullName: 'AWS Lambda@Edge',
            ingat: '"Lambda yang jalan di CloudFront edge — code dekat dengan user, bukan di region"',
            gunaUntuk: 'Run Lambda functions AT CloudFront edge locations — customize content delivery closer to users',
            fungsi: 'Lambda@Edge jalankan Lambda function di CloudFront edge locations (600+ globally). Function execute dekat dengan user — bukan di AWS region. Empat trigger points: Viewer Request, Viewer Response, Origin Request, Origin Response. Boleh ubah request/response, custom auth, URL rewrite, A/B testing.',
            sebabApa: "Lambda@Edge wujud sebab logik customize request/response (auth, redirect, A/B test, URL rewrite, header inject) kalau buat di origin region akan tambah latency untuk user yang jauh. Lambda@Edge run code di CloudFront edge location (dekat user) supaya keputusan dibuat dekat user — laju. Ia juga benarkan logik kompleks yang panggil AWS service (DynamoDB/S3) di edge, sesuatu yang CloudFront Functions (lightweight) tak boleh buat.",
            sifir: ["Lambda@Edge = Node.js/Python di CloudFront edge; deploy di us-east-1, CloudFront auto-replicate", "4 trigger: Viewer Request, Viewer Response, Origin Request, Origin Response", "Boleh panggil AWS services (DynamoDB/S3) + ada network access", "CloudFront Functions = JS sub-ms, 2MB, NO network, NO AWS calls — lebih murah & laju untuk header/URL rewrite ringkas", "Viewer events = semua edge; Origin events = hanya bila cache MISS", "Keyword 'code at edge + call AWS service' = Lambda@Edge; 'simple header/URL rewrite' = CloudFront Functions"],
            perangkap: [{"soalan": "Nak run custom code di CloudFront edge yang perlu query DynamoDB untuk authorize setiap request. Pilih?", "jebakan": "CloudFront Functions — sebab 'code at edge' & lebih murah/laju nampak menarik.", "betul": "Lambda@Edge — keyword 'call DynamoDB / AWS service at edge'. CloudFront Functions tiada network access & tak boleh panggil AWS service; hanya Lambda@Edge boleh."}, {"soalan": "Simple rewrite header / redirect URL di edge, sub-millisecond, tiada panggilan AWS, nak paling murah. Pilih?", "jebakan": "Lambda@Edge — sebab 'run code at edge' biasa terus terfikir Lambda@Edge.", "betul": "CloudFront Functions — keyword 'simple header/URL rewrite + sub-ms + no AWS call + cheapest'. Lambda@Edge overkill & lagi mahal untuk transform ringkas."}],
            contohGuna: 'Custom auth header check di edge, A/B testing redirect, rewrite URL dari old ke new path, inject custom HTTP headers',
            detailsLabel: '4 trigger points — bila function jalan',
            storageDetails: 'Viewer Request → bila user hantar request ke CloudFront (sebelum cache check). Boleh inspect/modify request, redirect.\nViewer Response → sebelum CloudFront hantar response ke user. Boleh modify headers, inject content.\nOrigin Request → bila cache MISS, sebelum CloudFront hantar request ke origin. Boleh rewrite path, pilih origin.\nOrigin Response → selepas origin reply, sebelum cache. Boleh modify response dari origin.',
            compare: {
              label: 'Lambda@Edge vs CloudFront Functions — dua-dua "code at edge"',
              headers: ['Aspect', 'Lambda@Edge', 'CloudFront Functions'],
              rows: [
                ['Bahasa', 'Node.js, Python', 'JavaScript (lightweight)'],
                ['Runtime', 'Full Lambda runtime (Node.js/Python)', 'Ultra-lightweight JS (subset)'],
                ['Execution time', 'Up to 5 sec (viewer), 30 sec (origin)', 'Up to 1 ms (sub-millisecond)'],
                ['Memory', '128 MB – 10 GB', '2 MB only'],
                ['Boleh panggil AWS?', '🟢 Ya (S3, DynamoDB, dll)', '❌ Tak boleh (no network/file access)'],
                ['Network access', '🟢 Ya', '❌ No'],
                ['Kos', 'Bayar per request + duration', '🟢 Lebih murah — per invocation (flat)'],
                ['Best untuk', 'Complex logic, AWS API calls, heavy transform', 'Simple header manipulation, URL rewrite, auth token check'],
              ],
              takeaway: 'Simple lightweight (header rewrite, token check) → CloudFront Functions. Complex logic + panggil AWS services + Node.js/Python → Lambda@Edge. "Inspect request, call DynamoDB, return custom response at edge" → Lambda@Edge.',
            },
            mermaid: {
              label: '4 trigger points — di mana function intercept',
              source: `flowchart LR
  U["👤 User"] -->|"1. Request"| VR["🔍 Viewer Request<br/>(Lambda@Edge)"]
  VR -->|"2. Check cache"| CF["📦 CloudFront Cache"]
  CF -->|"MISS"| OR["🔄 Origin Request<br/>(Lambda@Edge)"]
  OR --> O["🏠 Origin (S3/ALB)"]
  O --> OR2["📤 Origin Response<br/>(Lambda@Edge)"]
  OR2 --> CF
  CF -->|"3. Response"| VR2["📤 Viewer Response<br/>(Lambda@Edge)"]
  VR2 -->|"4. Reply"| U`,
              caption: 'Viewer events = dekat dengan user (boleh di semua edge). Origin events = hanya di edge yang MISS cache. Empat chances untuk ubah request/response. INGAT exam: "modify HTTP headers at edge" → CloudFront Functions atau Lambda@Edge Viewer Request.',
            },
            scenario: '"Custom authentication check HTTP header bila user request CloudFront" → Lambda@Edge Viewer Request. "Simple rewrite URL from /old to /new at edge, no AWS API calls" → CloudFront Functions. "A/B test — redirect 10% users to new origin" → Lambda@Edge.',
            tips: [
              'Lambda@Edge function mesti di-deploy di us-east-1 (CloudFront manages replication to all edges).',
              'Viewer Request/Response = jalan di SEMUA edge locations (close to user). Origin Request/Response = jalan hanya di edge yang MISS cache.',
              'Lambda@Edge boleh guna IAM role → boleh panggil AWS services (DynamoDB, S3, SSM). CloudFront Functions TAK boleh.',
              'CloudFront Functions: sub-millisecond, max 1ms, no network → untuk simple header manipulation, URL rewrite, token validation.',
              'Exam: "run custom code at CloudFront edge, need to access DynamoDB" → Lambda@Edge (bukan CloudFront Functions).',
              'Lambda@Edge vs standard Lambda: standard Lambda jalan di satu region; Lambda@Edge jalan secara global di semua edge locations. Function deploy di us-east-1, CloudFront auto-replicate.',
            ],
            docs: [
              { label: 'Lambda@Edge overview', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html' },
              { label: 'CloudFront Functions vs Lambda@Edge', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html' },
            ],
            keywords: ['Lambda@Edge', 'edge computing', 'CloudFront', 'Viewer Request', 'Viewer Response', 'Origin Request', 'Origin Response', 'CloudFront Functions', 'A/B testing', 'custom auth', 'URL rewrite', 'us-east-1', 'Node.js', 'Python', 'lightweight JS'],
          },
          {
            shortName: 'EC2 Tenancy',
            fullName: 'EC2 Tenancy & Dedicated Hosts',
            ingat: '"Shared = ramai kongsi. Dedicated Instance = hardware sendiri tapi tak pilih physical. Dedicated Host = physical server sendiri, boleh lihat socket/core untuk lesen BYOL"',
            gunaUntuk: 'Pilih tahap isolation hardware — shared vs dedicated instance vs dedicated host',
            fungsi: 'Tiga tahap tenancy: (1) Shared (default) — instance jalan pada hardware shared dengan pelanggan lain. (2) Dedicated Instance — instance jalan pada hardware single-tenant (kau sahaja) tapi kau tak pilih server mana. (3) Dedicated Host — physical server penuh untuk kau, kau nampak socket/core, boleh guna untuk BYOL (bring-your-own-license) software.',
            sebabApa: "Tenancy options wujud sebab keperluan isolation & licensing berbeza. Shared (default) cukup & murah untuk kebanyakan workload. Dedicated Instance wujud bila compliance kata hardware mesti single-tenant (kau sahaja, tiada pelanggan lain kongsi). Dedicated Host wujud sebab licensing BYOL (Oracle, SQL Server, Windows) sering ikut socket/core fizikal — kau perlu NAMPAK & kawal physical server (socket, core, host ID) untuk audit license compliance, sesuatu yang shared/dedicated instance tak bagi.",
            sifir: ["Shared (default) = kongsi hardware, paling murah", "Dedicated Instance = single-tenant, AWS pilih server, +$2/jam region fee", "Dedicated Host = physical server penuh, nampak socket/core/host ID, paling mahal", "BYOL (Oracle/SQL Server) + audit socket/core = Dedicated Host", "Host Affinity = instance sentiasa pada host fizikal sama (untuk license tied to hardware)", "Dedicated Host billing per-HOST; Dedicated Instance per-instance"],
            perangkap: [{"soalan": "Company guna Oracle DB dengan BYOL license yang dikira ikut physical core/socket, perlu audit hardware untuk compliance. Pilih tenancy?", "jebakan": "Dedicated Instance — sebab 'single-tenant hardware' bunyi padan untuk license/compliance.", "betul": "Dedicated Host — keyword 'BYOL + visibility socket/core + audit hardware'. Dedicated Instance single-tenant TAPI kau tak nampak physical socket/core; hanya Dedicated Host bagi visibility untuk BYOL audit."}, {"soalan": "Policy compliance kata instance mesti pada single-tenant hardware (tiada pelanggan lain kongsi), tapi tak perlu pilih server / audit core. Pilih paling kos-efektif?", "jebakan": "Dedicated Host — sebab 'single-tenant, fully isolated' nampak paling selamat.", "betul": "Dedicated Instance — keyword 'single-tenant TAPI tak perlu audit core/pilih server'. Dedicated Host lebih mahal (per-host) & overkill bila tak perlu visibility socket/core."}],
            contohGuna: 'Oracle/SQL Server license guna BYOL — perlu nampak physical socket/core → Dedicated Host. Compliance perlu single-tenant hardware tapi tak kisah server mana → Dedicated Instance. Workload biasa → Shared (murah).',
            compare: {
              label: '3 tenancy levels — isolation vs kos',
              headers: ['Aspect', 'Shared (default)', 'Dedicated Instance', 'Dicated Host'],
              rows: [
                ['Hardware', 'Shared dengan pelanggan lain', 'Single-tenant (kau sahaja)', 'Physical server penuh untuk kau'],
                ['Boleh pilih server?', '❌', '❌ (AWS pilih)', '🟢 Ya — kau nampak socket, core, host ID'],
                ['BYOL support', '❌', '❌', '🟢 Ya — audit socket/core untuk license compliance'],
                ['Kos', '🟢 Standard On-Demand/RI/SP', '+ $2/jam region fee (per-instance)', '💰 Paling mahal — bayar per-host'],
                ['Affinity', 'N/A', 'N/A', '🟢 Boleh set host affinity (instance sentiasa pada host yang sama)'],
                ['Best untuk', 'Workload biasa, tak perlu isolation', 'Compliance perlu single-tenant, tak perlu audit', 'BYOL (Oracle, SQL Server), license compliance, audit socket/core'],
              ],
              takeaway: 'Biasa → Shared. Perlu single-tenant tapi tak perlu pilih server → Dedicated Instance. Perlu physical server + nampak socket/core + BYOL → Dedicated Host. Exam: "Oracle license BYOL, need to track physical cores" → Dedicated Host.',
            },
            scenario: '"Company guna Oracle database dengan BYOL license, perlu audit physical cores untuk compliance" → Dedicated Host. "Compliance policy: instances must be on single-tenant hardware, no sharing" → Dedicated Instance. "Just run a web server, cheapest option" → Shared (default tenancy).',
            tips: [
              'Dedicated Host: kau LIHAT physical attributes (sockets, cores, host ID) → essential untuk BYOL license audit (Oracle, SQL Server, Windows)',
              'Dedicated Instance: single-tenant tapi AWS pilih hardware mana — kau tak nampak server fizikal. Ada $2/jam per-region fee.',
              'Dedicated Host boleh set HOST AFFINITY — instance sentiasa attach ke physical host yang sama. Berguna untuk license yang tie ke hardware.',
              'Dedicated Host juga boleh guna RI/SP → lebih jimat dari On-Demand Dedicated Host.',
              'Exam keyword: "BYOL", "physical core/socket visibility", "existing license tied to physical hardware" → Dedicated Host.',
              'Dedicated Host billing: per-host, bayar kadar jam untuk setiap host. Bukan per-instance.',
            ],
            docs: [
              { label: 'Dedicated Hosts overview', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html' },
              { label: 'Dedicated Instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-instance.html' },
            ],
            keywords: ['tenancy', 'shared', 'dedicated instance', 'dedicated host', 'single-tenant', 'BYOL', 'bring your own license', 'Oracle', 'SQL Server', 'socket', 'core', 'host affinity', 'license compliance', 'physical server'],
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
            sebabApa: "EBS wujud sebab EC2 perlukan disk yang PERSISTENT — data mesti kekal walaupun instance stop/start atau pindah host. Instance Store (disk fizikal host) ephemeral & hilang bila stop, jadi tak boleh untuk OS drive / database. EBS = network-attached block storage yang persistent, boleh snapshot ke S3, boleh resize tanpa downtime (Elastic Volumes), dan boleh encrypt — supaya data EC2 selamat & kekal.",
            sifir: ["EBS = persistent block storage, attach ke 1 EC2 (kecuali Multi-Attach io1/io2)", "Persistent: data KEKAL lepas stop/start (lawan Instance Store ephemeral)", "Elastic Volumes = resize/retype/adjust IOPS TANPA detach atau downtime", "Encryption = at rest + in transit (volume <-> instance), guna KMS", "Unencrypted snapshot -> encrypted volume = BOLEH (pilih encrypt masa create)", "PRICING: sc1 paling murah $0.015/GB-mo; gp3 $0.08; io2 $0.125 + $0.065/IOPS; snapshot $0.05/GB-mo"],
            perangkap: [{"soalan": "EBS volume hampir penuh, perlu tambah saiz dengan perubahan config paling minimum & tiada downtime. Cara terbaik?", "jebakan": "Buat snapshot, create volume baru lebih besar dari snapshot, detach lama attach baru — nampak macam cara standard.", "betul": "Elastic Volumes — increase saiz EBS terus (online, no detach), lepas tu extend filesystem (growpart + resize2fs). Keyword 'minimal config change + no downtime'. Snapshot+new volume = extra steps & downtime."}, {"soalan": "Database storage perlu survive instance failure/stop. Instance Store atau EBS?", "jebakan": "Instance Store — sebab IOPS tinggi nampak bagus untuk DB.", "betul": "EBS — keyword 'survive stop/failure (persistent)'. Instance Store ephemeral; EBS persistent + boleh snapshot."}],
            contohGuna: 'OS drive untuk EC2, database storage',
            tips: [
              'Instance store vs EBS: Instance store = ephemeral (data HILANG bila stop/terminate). EBS = persistent (data kekal)',
              'Instance store volumes BOLEH ditentukan HANYA masa launch — tak boleh tambah lepas instance running',
              'EBS encryption: encrypts at rest AND in transit (between volume and instance). ALL current AND previous gen instance types supported.',
              'EBS Elastic Volumes: resize, retype, adjust IOPS/throughput TANPA detach atau downtime. Lepas resize, extend filesystem: growpart + resize2fs (Linux)',
              '"Volume running out of space, minimal config changes" → increase EBS volume size (Elastic Volumes). Bukan snapshot+new volume (extra steps).',
              'Unencrypted snapshot → encrypted volume: BOLEH. Pilih encrypt semasa create volume dari snapshot. Tak perlu enable account-level default encryption.',
              'PRICING (us-east-1): gp3 = $0.08/GB-mo (base, includes 3K IOPS + 125 MB/s). io2 = $0.125/GB-mo + $0.065/provisioned-IOPS-mo. st1 = $0.045/GB-mo. sc1 = $0.015/GB-mo. Snapshots = $0.05/GB-mo (incremental, stored in S3). Data transfer IN = free. Cross-region snapshot copy = standard data transfer rates.',
              'Exam: "cheapest EBS type" → sc1 ($0.015/GB). "default boot volume" → gp3. "mission-critical DB" → io2. "sequential log processing" → st1.',
            ],
            keywords: ['block storage', 'single EC2', 'persistent disk', 'instance store', 'ephemeral', 'Elastic Volumes', 'resize', 'encryption', 'data in transit', 'pricing', 'gp3 cost', 'io2 cost', 'st1 cost', 'sc1 cost', 'snapshot cost'],
          },
          {
            shortName: 'EBS Volume Types',
            fullName: 'Amazon EBS — Volume Types & Multi-Attach',
            ingat: '"gp3 = general best. io2 = mission-critical + Multi-Attach. st1 = sequential log. sc1 = cold"',
            gunaUntuk: 'Choose right EBS type for workload: random I/O vs sequential, IOPS vs throughput, cost vs performance',
            fungsi: 'EBS ada 4 jenis: SSD-backed (gp2, gp3, io1, io2) untuk IOPS-intensive, HDD-backed (st1, sc1) untuk throughput-intensive sequential.',
            sebabApa: "Banyak jenis EBS wujud sebab workload ada profil I/O berbeza & tak masuk akal guna satu jenis untuk semua (mahal/tak optimum). SSD (gp/io) untuk random I/O & IOPS-bound (database, boot). HDD (st1/sc1) jauh lebih murah untuk sequential throughput besar (log, big data) & cold data — kau jimat banyak bila pilih ikut corak akses sebenar.",
            sifir: ["gp3 = default SSD, 16K IOPS, 1000 MB/s, IOPS & throughput configure berasingan", "io2 = mission-critical SSD, 64K+ IOPS, 99.999% durable, support Multi-Attach", "st1 = HDD sequential (log/ETL/big data), BUKAN random I/O", "sc1 = HDD cold, kos paling rendah, infrequent access", "Multi-Attach HANYA io1/io2; gp2/gp3/st1/sc1 TAK boleh", "Tak pasti = gp3; SSD = random I/O; HDD = sequential/cold"],
            perangkap: [{"soalan": "EKS perlu shared block storage di-attach serentak ke beberapa EC2 node. Pilih EBS type?", "jebakan": "gp3 — sebab default & paling biasa, orang terus pilih gp3.", "betul": "io2 dengan Multi-Attach — keyword 'shared block storage across multiple EC2'. Hanya io1/io2 support Multi-Attach; gp3 tak boleh. (Kalau shared FILE storage, jawapan EFS.)"}, {"soalan": "Workload log processing — sequential write besar, kos rendah. Pilih EBS type?", "jebakan": "gp3 atau io2 — sebab 'performance tinggi' nampak betul.", "betul": "st1 (Throughput-Optimized HDD) — keyword 'sequential / log / big data'. gp3 & io2 dioptimum untuk RANDOM I/O dan lebih mahal; st1 murah & laju untuk sequential throughput."}],
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
            sebabApa: "EFS wujud sebab EBS hanya boleh attach ke satu EC2 (kecuali Multi-Attach io1/io2 dalam satu AZ), jadi bila banyak EC2 across AZ perlu baca/tulis FAIL yang SAMA serentak (web content, CMS, shared config), EBS tak cukup. EFS = managed NFS yang auto-scale, multi-AZ, boleh di-mount oleh ratusan EC2 sekali gus supaya semua kongsi satu file system tanpa duplicate data.",
            sifir: ["EFS = managed NFS, shared, multi-AZ, ramai EC2 mount serentak", "Performance mode: General Purpose (latency rendah, default) vs Max I/O (latency LEBIH TINGGI, untuk parallel besar)", "Throughput mode: Bursting (scale ikut saiz) / Provisioned (set MiB/s tetap) / Elastic (auto, recommended)", "Encryption in transit BUKAN default — enable masa mount: mount -o tls (TLS 1.2)", "Mount target connection timeout = check SG inbound TCP 2049 + NACL", "PRICING: Standard $0.30/GB-mo; One Zone-IA $0.016/GB-mo (cheapest); EFS lebih mahal dari S3 tapi shared"],
            perangkap: [{"soalan": "20 EC2 across multiple AZ perlu baca/tulis fail web content yang SAMA serentak. Pilih storage?", "jebakan": "EBS Multi-Attach (io2) — sebab 'attach ke banyak EC2' nampak padan.", "betul": "EFS — keyword 'shared FILE storage, multi-AZ, ramai EC2 serentak'. EBS Multi-Attach = block storage, max dalam satu AZ & io1/io2 sahaja; EFS = file system NFS multi-AZ sebenar."}, {"soalan": "EFS kecil (25 GB) tapi perlu throughput tinggi konsisten. Apa setting?", "jebakan": "Bursting Throughput — sebab ia default, orang biar je.", "betul": "Provisioned (atau Elastic) Throughput — Bursting scale ikut saiz (25 GB = ~1.25 MiB/s baseline je, tak cukup). Keyword 'small file system + high throughput' = Provisioned/Elastic."}, {"soalan": "EC2 cuba mount EFS tapi connection TIMEOUT. Punca paling mungkin?", "jebakan": "Salah DNS name file system — tapi DNS failure bagi error lain, bukan timeout.", "betul": "Security Group / NACL block TCP 2049 — keyword 'timeout'. Mount target SG mesti allow inbound TCP 2049 dari CIDR EC2; ini punca timeout, bukan DNS."}],
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
              'PRICING (us-east-1): Standard = $0.30/GB-mo. Standard-IA = $0.016/GB-mo (retrieval fee $0.01/GB). One Zone = $0.16/GB-mo. One Zone-IA = $0.016/GB-mo. Provisioned Throughput = $6.00/provisioned-MB/s-mo. Elastic Throughput = pay per throughput used. Infrequent Access (IA) lifecycle = auto-move to IA for savings.',
              'Exam: "cheapest EFS class" → One Zone-IA ($0.016/GB). "multi-AZ EFS" → Standard ($0.30/GB). "infrequently accessed EFS data" → Standard-IA or One Zone-IA. EFS is MORE expensive than S3 ($0.023/GB) but cheaper than EBS for shared multi-instance.',
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
            sebabApa: "S3 wujud sebab simpan fail kat disk EBS/server sendiri ada had saiz, kena urus capacity, kena backup manual, dan susah nak share antara banyak server. S3 buang semua sakit kepala tu — object storage tanpa had, auto-replicate across ≥3 AZ (11 nines durability) jadi kau tak payah risau data hilang, bayar ikut guna je. Inilah sebab S3 jadi 'tulang belakang' hampir semua AWS workload: data lake, backup, static site, log.",
            sifir: ["Durability 11 nines (99.999999999%) SEMUA class — beza availability je", "Max 1 object = 5TB; single PUT max 5GB; >5GB WAJIB Multipart", "Strong read-after-write consistency (sejak Dec 2020) — soalan 'eventual' = usang", "3,500 PUT + 5,500 GET per PREFIX per saat; prefix tak terhad → parallelize", "503 Slow Down = S3 tengah auto-scale, retry with exponential backoff", "Block Public Access (default ON) menang atas bucket policy/ACL"],
            perangkap: [{"soalan": "App upload laju dapat banyak HTTP 503 'Slow Down'. Apa fix paling betul?", "jebakan": "Tukar storage class atau request limit increase via support — nampak macam kena 'naikkan quota'.", "betul": "Agih object across MULTIPLE PREFIX + retry with exponential backoff. S3 auto-scale per prefix (3,500 PUT/5,500 GET tiap prefix), tiada hard limit nak naik. Keyword: 'prefix' + '503 slow down'."}, {"soalan": "Nak host static website + custom domain + HTTPS guna S3. Cukup ke S3 sahaja?", "jebakan": "Enable S3 Static Website Hosting je — nampak macam dah lengkap.", "betul": "Letak CloudFront DEPAN S3. S3 static hosting HTTP sahaja; HTTPS + custom domain (ACM cert) kena CloudFront. Keyword: 'HTTPS' + 'custom domain'."}],
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
              'PRICING (us-east-1): Storage — Standard $0.023/GB-mo, Standard-IA $0.0125/GB-mo, One Zone-IA $0.01/GB-mo, Glacier Instant $0.004/GB-mo, Glacier Flexible $0.0036/GB-mo, Deep Archive $0.00099/GB-mo. Requests — PUT/POST/LIST $0.005/1K, GET $0.0004/1K. Data transfer OUT = free to CloudFront, $0.09/GB to internet (first 100GB free/mo). Intelligent-Tiering monitoring fee = $0.0025/GB-mo (free for objects <128KB).',
              'Exam: "cheapest S3 storage" → Deep Archive ($0.00099/GB). "default S3 class" → Standard ($0.023/GB). "S3 data transfer to CloudFront" → free.',
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
            sebabApa: "Glacier wujud sebab data arkib (rekod 7-10 tahun, backup yang mungkin tak pernah dibuka) tak patut bayar harga S3 Standard yang mahal. Kau tukar 'laju retrieve' dengan 'murah simpan' — makin sanggup tunggu lama nak cairkan data, makin murah storan. Ni buang pembaziran bayar storan panas untuk data sejuk yang duduk diam je.",
            sifir: ["3 class: Instant (ms, no restore) · Flexible (min-jam) · Deep Archive (jam)", "Min duration: Instant 90 hari · Flexible 90 hari · Deep Archive 180 hari", "Deep Archive TIADA Expedited — paling laju Standard ~12 jam, Bulk ~48 jam", "Flexible restore: Expedited 1-5min · Standard 3-5jam · Bulk 5-12jam", "Glacier Instant = terus GET (macam Standard-IA), TAK perlu restore job", "Deep Archive paling murah ~$0.00099/GB-mo"],
            perangkap: [{"soalan": "Imej X-ray jarang dibuka TAPI bila doktor minta kena dapat dalam milisaat, kos rendah. Class mana?", "jebakan": "Glacier Flexible Retrieval — nampak 'jarang access = Glacier' jadi pilih Flexible.", "betul": "Glacier Instant Retrieval. Flexible kena restore job (minit-jam), tak boleh ms. Keyword: 'millisecond retrieval' + 'rarely access' → Instant."}, {"soalan": "Data compliance dalam Deep Archive, audit minta retrieve 'dalam beberapa minit'. Boleh?", "jebakan": "Pilih Expedited tier untuk Deep Archive — anggap semua Glacier ada Expedited.", "betul": "TAK BOLEH. Deep Archive tiada Expedited; paling laju Standard ~12 jam. Kalau perlu segera kena Glacier Flexible/Instant. Keyword: 'Deep Archive' + 'minutes' = trap."}],
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
          {
            shortName: 'S3 Storage Classes',
            fullName: 'S3 Storage Classes — All 7 Tiers with Pricing',
            ingat: '"7 tingkat storan — makin sejuk makin murah, makin lama nak cairkan"',
            gunaUntuk: 'Pilih S3 class ikut access pattern + retrieval speed + kos (the THE exam storage decision)',
            fungsi: 'S3 ada 7 storage classes untuk optimize kos ikut access frequency. Semua class ada 11 nines durability (99.999999999%). Beza adalah pada availability, retrieval speed, minimum duration, dan kos.',
            sebabApa: "Storage classes wujud sebab bukan semua data sama 'panas' — ada yang access tiap saat, ada yang duduk diam bertahun. Bayar harga Standard untuk semua = membazir. Class bagi kau padankan kos dengan access pattern: panas bayar mahal+laju, sejuk bayar murah+lambat. Inilah jawapan no.1 untuk soalan 'cost optimization' dalam exam.",
            sifir: ["Semua 7 class = 11 nines durability; beza availability + retrieval + min duration", "One Zone-IA = 20% lebih murah Standard-IA TAPI 1 AZ je (data hilang kalau AZ musnah)", "Standard-IA & One Zone-IA: min 30 hari + retrieval fee per GB", "Intelligent-Tiering: auto-move ikut access, monitoring fee $0.0025/GB (free objek <128KB)", "Glacier Instant = ms retrieval no restore; Flexible/Deep = kena restore job", "Cheapest = Deep Archive $0.00099/GB; default/hot = Standard $0.023/GB"],
            perangkap: [{"soalan": "Access pattern data baru TAK DIKETAHUI, nak auto-optimize kos tanpa risiko salah pilih. Class?", "jebakan": "Standard-IA — anggap 'jimat sikit' selamat, atau set Lifecycle manual.", "betul": "Intelligent-Tiering. Ia auto-pindah antara tiers ikut access sebenar, jadi tak perlu teka. Standard-IA salah kalau data sebenarnya kerap diakses (kena retrieval fee). Keyword: 'unknown/unpredictable access pattern'."}, {"soalan": "Log files re-creatable, infrequent access, nak paling murah untuk infrequent tier. Pilih mana?", "jebakan": "Standard-IA — nampak 'infrequent' terus pilih IA standard.", "betul": "One Zone-IA — 20% lebih murah, dan sebab data re-creatable, risiko AZ musnah OK. Keyword: 're-creatable' + 'infrequent' → One Zone-IA."}],
            detailsLabel: '7 Storage Classes — anatomy',
            storageDetails: 'S3 Standard → Hot data, access frequent, default untuk most workloads\nS3 Standard-IA → Infrequent access TAPI masih perlu millisecond retrieval (contohnya: disaster recovery backup)\nS3 One Zone-IA → Infrequent access, data dalam 1 AZ sahaja (20% lebih murah dari Standard-IA, risiko AZ musnah)\nS3 Intelligent-Tiering → Auto-pindah object antara tiers ikut access pattern (monitoring fee)\nS3 Glacier Instant Retrieval → Arkib, jarang access, TAPI bila perlu kena millisecond (ms retrieval, tak perlu restore)\nS3 Glacier Flexible Retrieval → Arkib, boleh tunggu minit-jam untuk restore\nS3 Glacier Deep Archive → Paling murah, arkib jangka sangat panjang (compliance 7-10 tahun), retrieve 12-48 jam',
            compare: {
              label: 'All 7 S3 Storage Classes — pricing & key facts (us-east-1)',
              headers: ['Class', 'Storage $/GB-mo', 'Retrieval', 'Min Duration', 'AZ', 'Best untuk'],
              rows: [
                ['Standard', '$0.023', 'ms (free)', 'None', 'Multi-AZ (≥3)', 'Hot data, frequent access — default'],
                ['Standard-IA', '$0.0125', 'ms (retrieval fee)', '30 hari', 'Multi-AZ (≥3)', 'Infrequent access, long-lived data'],
                ['One Zone-IA', '$0.01', 'ms (retrieval fee)', '30 hari', '1 AZ', 'Infrequent, re-creatable data — cheapest IA'],
                ['Intelligent-Tiering', '$0.023 (hot tier)', 'ms (auto-tier)', 'None', 'Multi-AZ', 'Unknown/unpredictable access pattern'],
                ['Glacier Instant', '$0.004', 'ms (no restore!)', '90 hari', 'Multi-AZ', 'Archive, rare access BUT ms needed'],
                ['Glacier Flexible', '$0.0036', 'min–jam (restore)', '90 hari', 'Multi-AZ', 'Archive, boleh tunggu untuk restore'],
                ['Deep Archive', '$0.00099', '12–48 jam (restore)', '180 hari', 'Multi-AZ', 'Compliance 7-10 thn, hampir tak pernah access'],
              ],
              takeaway: 'Hot data → Standard. Infrequent but ms retrieval → Standard-IA (multi-AZ) atau One Zone-IA (murah, 1 AZ). Unknown pattern → Intelligent-Tiering (auto-move). Archive + ms retrieval → Glacier Instant. Archive + boleh tunggu → Glacier Flexible. Cheapest long-term → Deep Archive.',
            },
            mermaid: {
              label: 'Pilih S3 Storage Class (decision tree)',
              source: `flowchart TD
  A[Data masuk S3] --> B{Access frequency?}
  B -->|Frequent / hot| C[S3 Standard<br/>$0.023/GB · ms retrieval]
  B -->|Infrequent| D{Re-creatable? <br/>Risk of AZ loss OK?}
  B -->|Unknown / unpredictable| E[Intelligent-Tiering<br/>auto-pindah ikut pattern<br/>$0.0025/GB monitoring fee]
  D -->|"Ya, 1 AZ cukup"| F[One Zone-IA<br/>$0.01/GB · 1 AZ]
  D -->|"Tak, perlu multi-AZ"| G[Standard-IA<br/>$0.0125/GB · multi-AZ]
  B -->|Archive / rarely access| H{Berapa laju nak retrieve?}
  H -->|Milliseconds, no restore| I[Glacier Instant Retrieval<br/>$0.004/GB · min 90 hari]
  H -->|Minit–jam OK| J[Glacier Flexible Retrieval<br/>$0.0036/GB · min 90 hari]
  H -->|"12–48 jam, paling murah"| K[Deep Archive<br/>$0.00099/GB · min 180 hari]`,
              caption: 'Cara ingat: makin sejuk makin murah, makin lama nak "cair". Standard = panas (mahal, laju). Deep Archive = beku (murah, retrieve 12-48 jam). IA = sejuk sikit (murah dari Standard, retrieval fee). Intelligent-Tiering = auto thermostat. INGAT exam: One Zone-IA 20% lebih murah dari Standard-IA tapi data hilang kalau AZ musnah — guna untuk re-creatable data sahaja.',
            },
            scenario: '"Medical images rarely access but need ms retrieval when doctor requests" → Glacier Instant Retrieval (bukan Flexible). "Log files 90-day retention, infrequent access, re-creatable" → One Zone-IA. "Don\'t know access pattern yet" → Intelligent-Tiering. "Compliance records 7 years, petabytes, almost never access" → Deep Archive. "Active web content" → Standard.',
            tips: [
              'Intelligent-Tiering ada monitoring fee ($0.0025/GB/mo) tapi auto-pindah antara tiers → elak tebak access pattern salah. Free untuk objects <128KB (too small to monitor).',
              'One Zone-IA = 20% lebih murah dari Standard-IA. TAPI hanya 1 AZ — kalau AZ musnah, data lenyap. Guna untuk re-creatable data atau backup yang ada copy di tempat lain.',
              'Standard-IA dan One Zone-IA ada retrieval fee ($0.01/GB) + min 30 hari storage duration. Kalau access lebih frequent dari itu, Standard lebih murah.',
              'Intelligent-Tiering = pindah ke IA automatically kalau object tak di-access selama 30 hari berturut-turut. Pindah balik ke Standard kalau di-access.',
              'Glacier Instant Retrieval = ms retrieval, TAK PERLU restore job. Sama macam GET Standard-IA. Untuk data jarang access tapi bila perlu kena segera.',
              'Min storage duration: delete sebelum tempoh minimum tetap kena bayar baki. Standard = no min. IA = 30 hari. Glacier = 90/90/180 hari.',
              'Semua class ada 11 nines durability — beza adalah pada availability (Standard 99.99%, IA 99.9%, One Zone-IA 99.5%) dan retrieval speed.',
              'Lifecycle Policy: auto-transition ikut umur — Standard → IA (30d) → Glacier Flexible (90d) → Deep Archive (365d). Letak Intelligent-Tiering kalau tak yakin pattern.',
            ],
            docs: [
              { label: 'S3 storage classes overview', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-classes.html' },
              { label: 'S3 storage class comparison', url: 'https://aws.amazon.com/s3/storage-classes/' },
            ],
            keywords: ['S3 Standard', 'Standard-IA', 'One Zone-IA', 'Intelligent-Tiering', 'Glacier Instant Retrieval', 'Glacier Flexible Retrieval', 'Deep Archive', 'pricing', 'storage class', 'retrieval fee', 'min storage duration', 'availability', '11 nines durability', 'lifecycle transition', 'auto-tiering'],
          },
          {
            shortName: 'S3 Lifecycle',
            fullName: 'S3 Lifecycle Management',
            ingat: '"Auto-pindah object ke kelas murah ikut umur — macam roti: fresh → semalam → beku"',
            gunaUntuk: 'Automatically transition objects to cheaper storage classes + expire old objects',
            fungsi: 'Lifecycle rules automatik pindah object ke storage class yang lebih murah berdasarkan umur (days sejak creation), dan boleh auto-expire (delete) object lama. Dua jenis rule: Transition (pindah ke class lain) dan Expiration (padam object). Rules boleh untuk whole bucket atau specific prefix/tags.',
            sebabApa: "Lifecycle wujud sebab kalau kena tukar storage class atau padam object lama secara manual untuk berjuta object = mustahil + mudah terlupa → bil membengkak. Lifecycle automate: kau set jadual sekali ('30 hari → IA, 90 hari → Glacier, 7 tahun → delete'), AWS pindah & padam sendiri ikut umur object. Buang kerja manual + elak bayar storan panas untuk data lama.",
            sifir: ["Lifecycle = AGE-based (umur object); Intelligent-Tiering = ACCESS-based (auto-detect)", "2 jenis rule: Transition (pindah class) + Expiration (auto-delete)", "Lifecycle BOLEH auto-delete; Intelligent-Tiering TAK boleh delete (pindah je)", "Standard → Standard-IA minimum 30 hari sebelum boleh transition", "Noncurrent version rules = clean up versi LAMA bila versioning ON", "Boleh scope rule ikut prefix / tag / object size"],
            perangkap: [{"soalan": "Nak auto-pindah log ke IA selepas 30 hari, Glacier selepas 90, dan PADAM selepas 1 tahun. Guna apa?", "jebakan": "Intelligent-Tiering — anggap ia uruskan semua auto-tiering.", "betul": "S3 Lifecycle Policy (Transition + Expiration). Intelligent-Tiering tak boleh auto-DELETE, dan ia access-based bukan age-based. Keyword: 'after X days' + 'delete' → Lifecycle."}, {"soalan": "Versioning ON, nak buang versi lama object selepas 30 hari untuk jimat kos. Rule apa?", "jebakan": "Expiration rule biasa — sangka ia padam current version sahaja.", "betul": "Noncurrent version expiration rule. Expiration biasa kena current version; untuk versi lama kena rule 'noncurrent'. Keyword: 'old/previous versions cleanup'."}],
            contohGuna: 'Log file masuk Standard → 30 hari pindah ke Standard-IA → 90 hari pindah ke Glacier Flexible → 365 hari pindah Deep Archive → 2555 hari (7 tahun) auto-delete.',
            detailsLabel: 'Lifecycle rule anatomy',
            storageDetails: 'Transition rule → "bila object umur X hari, pindah ke class Y" (cth: 30 hari → Standard-IA)\nExpiration rule → "bila object umur Z hari, delete permanently" (cth: 2555 hari → delete)\nFilter → boleh scope rule ikut prefix (folder), tags, atau object size\nCurrent versions vs Previous versions → boleh set rules berbeza untuk version aktif vs lama\nNoncurrent version expiration → auto-padam versi lama selepas X hari (clean up versioning clutter)\nNoncurrent version transition → pindah versi lama ke class murah',
            compare: {
              label: 'Lifecycle vs Intelligent-Tiering — dua cara auto-optimize kos',
              headers: ['Aspect', 'Lifecycle Rules', 'Intelligent-Tiering'],
              rows: [
                ['Cara decide', 'AGE-based (umur object, X hari selepas creation)', 'ACCESS-based (auto-detect kalau tak di-access 30 hari)'],
                ['Rule type', 'Manual: kau set transition + expiration schedule', 'Automatic: S3 auto-pindah ikut access pattern'],
                ['Boleh delete?', '🟢 Ya — expiration rule auto-padam object lama', '❌ Tidak — auto-pindah sahaja, tak auto-delete'],
                ['Granularity', 'Prefix, tag, size filter — rule per-prefix', 'Per-object automatic (semua object dalam class ni)'],
                ['Best bila', 'Access pattern DIKETAHUI (log → IA → Glacier → delete)', 'Access pattern TAK DIKETAHUI (unpredictable)'],
              ],
              takeaway: 'Tahu bila data jadi sejuk (log, backup, compliance) → Lifecycle (age-based, boleh auto-delete). Tak tahu corak access → Intelligent-Tiering (auto-detect, tapi tak auto-delete). Selalu guna dua-dua: Intelligent-Tiering untuk unknown + Lifecycle expiration untuk auto-cleanup.',
            },
            mermaid: {
              label: 'Analogi roti & beku — Lifecycle aging',
              source: `flowchart LR
  A["🍞 Fresh roti<br/>S3 Standard<br/>$0.023/GB<br/>(0–30 hari)"] -->|"30 hari"| B["🥖 Semalam<br/>Standard-IA<br/>$0.0125/GB<br/>(30–90 hari)"]
  B -->|"90 hari"| C["❄️ Sejuk beku<br/>Glacier Flexible<br/>$0.0036/GB<br/>(90–365 hari)"]
  C -->|"365 hari"| D["🧊 Deep freeze<br/>Deep Archive<br/>$0.00099/GB<br/>(365–2555 hari)"]
  D -->|"7 tahun"| E["🗑️ Tong sampah<br/>Auto-delete<br/>(expiration)"]`,
              caption: 'Analogi kilang roti: roti fresh (Standard) → selepas 30 hari jadi roti semalam (IA) → sejuk beku (Glacier) → deep freeze (Deep Archive) → tong sampah (auto-delete). Lifecycle automation = kau tetapkan jadual, AWS pindah sendiri. INGAT exam: "automatically transition S3 objects to cheaper tiers by age" → Lifecycle Rules. "auto-detect access pattern" → Intelligent-Tiering.',
            },
            scenario: '"Automatically move log files from Standard to IA after 30 days, to Glacier after 90 days, delete after 1 year" → S3 Lifecycle Policy. "Don\'t know access pattern, want S3 to auto-choose tier" → Intelligent-Tiering (bukan Lifecycle). "Clean up old versions of objects after 30 days" → Noncurrent version expiration rule.',
            tips: [
              'Lifecycle = age-based (umur object), Intelligent-Tiering = access-based (auto-detect). Pilih Lifecycle bila tahu corak access.',
              'Expiration rule = auto-DELETE object lama. Berguna untuk compliance ("retain 7 years then delete") atau cleanup storage.',
              'Noncurrent version rules: bila versioning ON, set rules untuk padam/pindah versi LAMA (previous versions) — bukan current version. Auto-cleanup versioning clutter.',
              'Min transition days: Standard → Standard-IA minimum 30 hari (AWS require at least 30 days in Standard before transitioning to IA).',
              'Lifecycle boleh combine dengan Intelligent-Tiering: Intelligent-Tiering untuk unknown pattern + Lifecycle expiration untuk auto-delete old data.',
              'Exam: "automatically move objects to Glacier after 90 days" → Lifecycle Transition Rule. "auto-delete logs after 365 days" → Lifecycle Expiration Rule. "unknown access pattern, auto-optimize" → Intelligent-Tiering.',
            ],
            docs: [
              { label: 'S3 Lifecycle configuration', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html' },
            ],
            keywords: ['lifecycle', 'transition rule', 'expiration rule', 'auto-move', 'auto-delete', 'age-based', 'storage class transition', 'noncurrent version', 'versioning cleanup', 'S3 lifecycle policy', 'cost optimization', 'prefix filter', 'tag filter'],
          },
          {
            shortName: 'S3 CORS',
            fullName: 'S3 Cross-Origin Resource Sharing (CORS)',
            ingat: '"Browser block request dari domain lain — CORS rule bagi kebenaran"',
            gunaUntuk: 'Allow web apps on one domain to access S3 resources on a different domain',
            fungsi: 'CORS (Cross-Origin Resource Sharing) adalah mechanism browser yang control sama ada web app di domain A boleh akses resources di domain B. Untuk S3, kau set CORS configuration pada bucket untuk allow specific origins, methods, dan headers.',
            sebabApa: "CORS wujud sebab BROWSER (bukan AWS) ada rules keselamatan: by default browser block JavaScript di domain A daripada fetch resource di domain B (cross-origin). Bila web app kau perlu upload/download terus ke S3 dari browser, S3 kena 'beritahu' browser ia benarkan domain kau — itulah CORS config. Tanpa ia, browser block request walaupun IAM dah bagi akses.",
            sifir: ["CORS = browser-level permission, BUKAN IAM/bucket policy", "Set per-BUCKET (PutBucketCors), bukan per-object", "Config: AllowedOrigin + AllowedMethod + AllowedHeader", "Error 'Access-Control-Allow-Origin missing' = kena set CORS rule", "CORS tak ganti bucket policy — masih perlu IAM allow access JUGA"],
            perangkap: [{"soalan": "Browser app di www.example.com tak boleh GET/PUT object dari S3 bucket di domain lain, walaupun IAM dah betul. Fix?", "jebakan": "Ubah bucket policy untuk allow domain — sangka ini masalah permission IAM.", "betul": "Configure CORS pada S3 bucket (allow origin www.example.com). Ini browser-level block, bukan IAM. Bucket policy dah betul. Keyword: 'browser' + 'cross-origin'."}],
            contohGuna: 'Web app di https://app.example.com nak upload images terus ke S3 bucket (https://cdn.example.com) dari browser — CORS rule pada S3 bucket allow origin https://app.example.com.',
            scenario: '"Browser app at www.example.com needs to GET/PUT objects in S3 bucket directly" → configure CORS on the S3 bucket to allow origin www.example.com. Bukan bucket policy (yang control IAM-level access). CORS = browser-level permission.',
            compare: {
              label: 'CORS vs Bucket Policy vs Pre-Signed URL — 3 S3 access mechanisms',
              headers: ['Mechanism', 'Layer', 'Untuk apa'],
              rows: [
                ['CORS', 'Browser security', 'Allow browser app di domain A access resources di domain B'],
                ['Bucket Policy', 'IAM / resource-level', 'Grant/deny access to principals (users, accounts, services)'],
                ['Pre-Signed URL', 'Temporary credential', 'Give time-limited access to one object guna IAM creds'],
              ],
              takeaway: 'CORS = "boleh ke browser ni akses bucket domain lain?" (browser-level). Bucket Policy = "siapa boleh akses bucket ni?" (IAM-level). Pre-Signed URL = "berapa lama URL ni sah?" (object-level). CORS tak replace bucket policy — kau masih perlu allow IAM access SELAIN dari CORS.',
            },
            tips: [
              'CORS = browser security policy, BUKAN IAM. Browser block cross-origin requests by default; CORS rule pada S3 bucket memberi kebenaran.',
              'CORS configuration adalah XML/JSON pada S3 bucket: <CORSRule> dengan <AllowedOrigin>, <AllowedMethod>, <AllowedHeader>.',
              'Error tipikal: "Access-Control-Allow-Origin" missing → browser block → kena set CORS rule pada S3 bucket tu.',
              'CORS tak replace Bucket Policy — kau masih perlu IAM/permission allow access ke bucket. CORS cuma buka browser-level block.',
              'Exam: "browser app di domain A tak boleh access S3 bucket di domain B" → configure CORS on S3 bucket (allow origin). Bukan tukar bucket policy.',
              'S3 CORS boleh set via console atau API (PutBucketCors). Set per-bucket, bukan per-object.',
            ],
            docs: [
              { label: 'S3 CORS configuration', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html' },
            ],
            keywords: ['CORS', 'cross-origin', 'browser security', 'AllowedOrigin', 'Access-Control-Allow-Origin', 'web app', 'domain', 'bucket CORS', 'XML configuration'],
          },
          {
            shortName: 'S3 Pre-Signed URL',
            fullName: 'S3 Pre-Signed URLs',
            ingat: '"URL dengan tiket sementara — siapa ada boleh access, tapi hanya untuk tempoh tertentu"',
            gunaUntuk: 'Grant temporary time-limited access to a single S3 object without sharing credentials',
            fungsi: 'Pre-signed URL adalah URL S3 yang ada signature + expiry time. Siapa punya URL tu boleh upload atau download object tersebut tanpa perlu AWS credentials. Permission ikut IAM user yang generate URL tersebut.',
            sebabApa: "Pre-Signed URL wujud sebab kau nak bagi orang luar (yang TIADA AWS account) akses upload/download SATU object sementara, tanpa kau kongsi credentials atau buat bucket jadi public. Daripada bagi orang IAM user atau buka bucket public (bahaya), kau jana URL bertarikh luput — siapa ada link boleh akses dalam tempoh tu je. Buang risiko credential leak + public bucket.",
            sifir: ["Permission ikut IAM creds yang GENERATE URL (bukan yang guna)", "Expiry: 1 saat hingga 7 hari max (default SDK = 7 hari)", "Boleh untuk GET (download) DAN PUT (upload) — bukan GET sahaja", "TAK boleh restrict by IP — itu CloudFront Signed URL je", "Guna STS temporary creds: URL expiry tak boleh lebih dari creds expiry (pendek menang)", "Skop = 1 object; expired → 403 Forbidden"],
            perangkap: [{"soalan": "Bagi customer download SATU file S3 untuk 1 jam tanpa AWS account. Guna apa?", "jebakan": "Buat bucket public / bagi IAM user — atau pilih CloudFront Signed URL.", "betul": "S3 Pre-Signed URL. Simple, free, expiry-based, 1 object. CloudFront Signed URL untuk private content at scale via CDN. Keyword: 'temporary' + 'one file' + 'no credentials'."}, {"soalan": "Nak hadkan akses private video by IP + global CDN delivery. Pre-Signed URL boleh?", "jebakan": "Pre-Signed URL dengan IP restriction — sangka boleh letak syarat IP.", "betul": "CloudFront Signed URL/Cookie. Pre-Signed URL HANYA boleh expiry time, tak boleh restrict IP/geo. Keyword: 'IP restriction' + 'CDN' → CloudFront."}],
            contohGuna: 'Generate pre-signed URL valid 1 jam → hantar ke customer → customer download file besar dari S3 terus tanpa perlu AWS account/login.',
            compare: {
              label: 'S3 Pre-Signed URL vs CloudFront Signed URL — yang mana?',
              headers: ['Aspect', 'S3 Pre-Signed URL', 'CloudFront Signed URL/Cookie'],
              rows: [
                ['Akses melalui', 'Direct ke S3 (tiada CDN)', 'Through CloudFront (edge cache, global)'],
                ['Sign guna', 'IAM credentials pemberi', 'Trusted key group (public/private key)'],
                ['Permission', 'Inherit IAM permission si-pemberi', 'Independent dari IAM'],
                ['Skop', '1 object sahaja', 'URL = 1 file; Cookie = banyak files'],
                ['Extra control', 'Expiry time sahaja', 'Restrict by IP, expiry, geo, caching'],
                ['Kos', 'Free', 'CloudFront charges'],
                ['Best untuk', 'One-off upload/download terus ke S3', 'Private content at scale via CDN (paid media)'],
              ],
              takeaway: 'One-off direct S3 access → Pre-Signed URL (simple, free, IAM creds). Private content at scale globally via CDN → CloudFront Signed URL/Cookie (IP restriction, edge cache, trusted key group). Exam: "give customer temporary access to download one file from S3" → Pre-Signed URL.',
            },
            mermaid: {
              label: 'Analogi Tiket Konsert — Pre-Signed URL',
              source: `flowchart TD
  A["🎤 App kau<br/>(punya IAM creds)"] -->|"jana tiket<br/>dengan expiry"| B["🎫 Pre-Signed URL<br/>valid 1 jam"]
  B -->|"hantar ke"| C["👥 Customer<br/>(tak ada AWS creds)"]
  C -->|"tunjuk tiket"| D["📦 S3 Bucket"]
  D -->|"check tiket sah?"| E{Valid?}
  E -->|"Ya — dalam tempoh"| F["🟢 Download/Upload"]
  E -->|"Tak — expired"| G["🔴 403 Forbidden"]`,
              caption: 'Analogi: kau (penjual tiket) jana tiket dengan tarikh luput. Customer (pembeli) tunjuk tiket dekat pintu masuk S3. Tiket sah = masuk. Tiket expired = kena tolak. Permission tiket = ikut hak kau (IAM pemberi). INGAT exam: "temporary access to ONE S3 object without credentials" → Pre-Signed URL. "private content via CDN at scale" → CloudFront Signed URL.',
            },
            scenario: '"Give temporary download access to one S3 file for 1 hour, no AWS credentials needed" → S3 Pre-Signed URL. "Serve private video globally via CDN with IP restriction" → CloudFront Signed URL. "User uploads file to S3 from browser without credentials" → Pre-Signed URL for PUT operation.',
            tips: [
              'Pre-Signed URL = IAM credentials yang GENERATE URL menentukan permission. Kalau generator ada s3:GetObject permission → URL holder boleh download.',
              'Expiry: default 7 hari (bila guna SDK), boleh set dari 1 saat hingga 7 hari maksima. Bila expired → 403 Forbidden.',
              'Pre-signed URL BOLEH guna untuk PUT juga — bukan hanya GET. Generate PUT pre-signed URL untuk allow upload tanpa credentials.',
              'Pre-signed URL TAK boleh restrict by IP — itu hanya CloudFront Signed URL. Pre-signed = expiry time sahaja.',
              'Bila guna STS temporary credentials untuk generate → URL expiry TIDAK boleh melebihi credential expiry. Yang lebih pendek menang.',
              'Exam: "give temporary access to download S3 object, no AWS account needed" → Pre-Signed URL. "private content via CDN with IP restriction" → CloudFront Signed URL.',
            ],
            docs: [
              { label: 'S3 pre-signed URLs', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html' },
            ],
            keywords: ['presigned URL', 'temporary access', 'no credentials', 'IAM credentials', 'expiry time', 'download', 'upload', 'PUT', 'GET', '403', 'one object', 'vs CloudFront signed URL'],
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
            sebabApa: 'Wujud sebab kalau user di Jepun ambil gambar dari S3 bucket di Virginia, setiap request kena pergi balik separuh dunia → lambat + origin kena hentam beribu request sama. CloudFront letak salinan content (cache) di 600+ edge location dekat user → request dijawab dari edge terdekat (laju) dan origin kau bernafas (offload). Bonus: dia jadi pintu masuk selamat — boleh kunci content (signed URL/cookie, OAC), block ikut negara, dan jadi tempat WAF/Shield jaga.',
            sifir: [
              'CDN, cache di edge → laju untuk global user + offload origin',
              'Private content VIA CloudFront → Signed URL (1 file) / Signed Cookie (banyak file)',
              'Kunci S3 bucket supaya kekal private tapi serve via CF → OAC (ganti OAI; OAC support SSE-KMS)',
              'CloudFront cert untuk HTTPS → MESTI di us-east-1',
              'Block ikut negara → Geo Restriction. Jimat kos → Price Class (100 = paling murah)',
              'Transform request di edge: ringkas/laju → CloudFront Functions; berat/panggil AWS → Lambda@Edge',
            ],
            perangkap: [
              {
                soalan: 'Aplikasi nak bagi pelanggan berbayar download SATU installer file secara selamat, expire selepas 1 jam, dan content perlu disampaikan laju ke user global. Pilih apa?',
                jebakan: 'S3 Presigned URL — sebab ia memang untuk bagi akses sementara ke satu S3 object dengan expiry. Nampak betul sebab "satu file + expiry".',
                betul: 'CloudFront Signed URL. Presigned URL pergi DIRECT ke S3 (tiada edge cache, tiada penyampaian global laju, tiada restrict IP). Keyword "laju ke global user / at scale via CDN + private" → CloudFront Signed URL. (Presigned URL betul cuma untuk one-off direct-to-S3 upload/download.)',
              },
              {
                soalan: 'Nak serve objek S3 PRIVATE melalui CloudFront, dan bucket guna SSE-KMS encryption. Bucket mesti kekal block-public-access. Setup mana?',
                jebakan: 'Guna OAI (Origin Access Identity) + bucket policy bagi akses ke OAI. Nampak betul sebab OAI memang cara klasik kunci bucket untuk CloudFront.',
                betul: 'OAC (Origin Access Control) + bucket policy ke CloudFront service principal. OAI TAK support SSE-KMS — kena OAC. Keyword "S3 origin + SSE-KMS / private bucket via CloudFront" → OAC, bukan OAI.',
              },
            ],
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
            sebabApa: 'Wujud sebab kalau kau ada banyak server web/microservice, kau tak nak user kena tahu IP setiap server, dan kau nak elak satu server mati = website down. ALB jadi "satu pintu masuk" yang sebarkan request ke server yang sihat. Lebih dari NLB: ALB faham HTTP, jadi dia boleh baca path/host/header dan hantar /cart ke service A, /video ke service B — satu LB untuk banyak microservice. Tujuan: HA + scaling + routing pintar di Layer 7.',
            sifir: [
              'ALB = Layer 7 (HTTP/HTTPS), routing by path/host/header. NLB = Layer 4 (TCP/UDP)',
              'ALB takde static IP (DNS name je). Perlu static IP → NLB',
              'Banyak domain satu ALB, cert berasingan → SNI (multi-cert pada satu listener)',
              'ALB cross-zone = SENTIASA ON & free. NLB cross-zone = OFF default (enable = caj inter-AZ)',
              'Stateful app perlu session sama → enable ALB stickiness (cookie AWSALB)',
              'ALB & NLB boleh IP targets (cross-VPC / on-prem). CLB = instance-ID + same-VPC je (legacy)',
            ],
            perangkap: [
              {
                soalan: 'Aplikasi perlu host DUA domain berbeza (shop.com & blog.com) di belakang SATU load balancer, setiap satu dengan ACM cert sendiri, tanpa gabungkan jadi satu cert. Macam mana?',
                jebakan: 'Buat DUA ALB berasingan, satu per domain dengan certnya. Atau guna satu SAN/wildcard cert yang cover dua-dua domain. Nampak betul sebab "satu cert satu listener".',
                betul: 'Satu ALB, tambah kedua-dua ACM cert pada HTTPS listener guna SNI (Server Name Indication). Client hantar hostname dalam TLS handshake → ALB pilih cert betul. Tak perlu ALB berasingan atau combined cert. Keyword "multiple domains/certs on one ALB" → SNI.',
              },
              {
                soalan: 'Beban kerja TCP gaming latency-sensitif perlu satu STATIC IP untuk whitelisting firewall pelanggan. Load balancer mana?',
                jebakan: 'ALB — sebab ia load balancer paling popular & feature-rich. Nampak betul sebab ALB selalu jadi default.',
                betul: 'NLB. ALB tiada static IP (DNS name sahaja) dan ia Layer 7 HTTP, bukan untuk raw TCP gaming. NLB = Layer 4, ultra-low latency, dan bagi Elastic/static IP per AZ. Keyword "static IP + TCP/UDP + extreme low latency" → NLB.',
              },
            ],
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
              'Stickiness (session affinity): ALB boleh bind user session ke specific target guna cookie. Duration 1s–7 days. Guna untuk: stateful app yang tak support distributed session. ALB generates cookie (AWSALB) atau app provides custom cookie. NLB juga support stickiness (TCP, 1s–7 days).',
              'Cross-Zone Load Balancing: ALB = ALWAYS ON (free, distributes traffic across all AZ targets). NLB = OFF by default (each AZ node only routes to targets dalam AZ yang sama; enable cross-zone = ada charge per-GB inter-AZ). CLB = OFF by default (enable at no charge).',
              'Exam: "ALB cross-zone" → always enabled, free. "NLB cross-zone" → disabled by default, enable = inter-AZ data transfer charge. "stickiness for stateful app" → enable ALB stickiness (cookie-based).',
              'PRICING (us-east-1): ALB = $0.0225/hour ($16.20/mo) + $0.008 per LCU-hour. NLB = $0.0225/hour + $0.006 per NLCU-hour. GWLB = $0.0135/hour + $0.0035 per GWLCU-hour. CLB = $0.025/hour + $0.008 per GB processed (legacy). LCU = Load Balancer Capacity Unit (new connections, active connections, bytes processed, rule evaluations).',
              'Exam: "ALB pricing" → hourly + per-LCU. "NLB cheaper per unit" → yes ($0.006 vs $0.008 per LCU). "CLB most expensive per GB" → $0.008/GB. GWLB paling murah per hour.',
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
            sebabApa: 'Wujud sebab ada workload yang BUKAN HTTP (game server, VoIP, IoT, database protocol) dan perlukan kelajuan ekstrem + satu static IP yang firewall pelanggan boleh whitelist. ALB tak boleh — dia HTTP-only dan takde static IP. NLB beroperasi di Layer 4 (TCP/UDP), boleh handle berjuta connection per saat dengan latency super rendah, dan bagi Elastic IP tetap. Tujuan: load balancing untuk protocol bukan-HTTP, performance ekstrem, dan static IP.',
            sifir: [
              'NLB = Layer 4 (TCP/UDP/TLS), ultra-low latency, jutaan req/s',
              'NLB = ada static / Elastic IP per AZ. ALB = takde (DNS name je)',
              'NLB preserve client IP terus. ALB guna X-Forwarded-For header',
              'NLB cross-zone OFF by default (enable = caj data inter-AZ). ALB sentiasa ON & free',
              'Bukan HTTP / perlu static IP / extreme perf → NLB. HTTP routing pintar → ALB',
            ],
            perangkap: [
              {
                soalan: 'Aplikasi backend perlu tahu alamat IP SEBENAR client untuk logging & rate-limiting, dan guna TCP. Load balancer & cara mana paling mudah?',
                jebakan: 'ALB dan baca header X-Forwarded-For untuk dapat client IP. Nampak betul sebab XFF memang cara biasa dapat client IP belakang LB.',
                betul: 'NLB — ia preserve source/client IP secara native (target nampak IP client sebenar terus), tanpa perlu parse header. Plus client guna TCP, jadi NLB (L4) lebih sesuai dari ALB (L7 HTTP). Keyword "preserve client IP + TCP" → NLB.',
              },
            ],
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
            sebabApa: 'Wujud sebab manusia ingat "myshop.com", bukan "54.x.x.x". DNS = buku telefon internet yang tukar nama → IP. Route 53 bukan sekadar buku telefon — dia GPS pintar: boleh hantar user ke region paling laju (latency), ke backup bila primary mati (failover via health check), atau ikut negara user (geolocation). Nama "53" dari port DNS (port 53). Tujuan: terjemah domain + arah traffic secara pintar berdasarkan kesihatan & lokasi.',
            sifir: [
              'APEX/root domain (example.com) → MESTI Alias record, CNAME TAK BOLEH',
              'Subdomain (www) → CNAME atau Alias dua-dua boleh',
              'Alias = AWS-only, FREE query, point ke ALB/CloudFront/S3/Route53 record',
              'Route 53 = DNS + domain registration + health check + routing policy',
              '"53" = port DNS. Routing pintar (latency/failover/geo) → guna routing policy',
            ],
            perangkap: [
              {
                soalan: 'Nak point root domain example.com terus ke sebuah ALB. Rekod DNS mana yang digunakan?',
                jebakan: 'CNAME record yang point ke DNS name ALB. Nampak betul sebab ALB bagi DNS name, dan CNAME memang untuk point nama ke nama.',
                betul: 'Alias record (type A) ke ALB. Spec DNS LARANG CNAME pada apex/root domain (example.com) — CNAME cuma boleh untuk subdomain (www). Alias = sambungan AWS yang benarkan apex point ke ALB/CloudFront/S3, dan query percuma. Keyword "root/apex domain → AWS resource" → Alias.',
              },
            ],
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
            sebabApa: 'Wujud sebab "satu nama → satu IP" tak cukup bila kau ada server di banyak region. Kau nak DNS itu sendiri buat keputusan pintar: hantar user ke region paling LAJU (latency), tukar ke backup bila primary MATI (failover), bahagi traffic 70/30 untuk A/B test (weighted), atau patuh undang-undang dengan hantar user ikut NEGARA (geolocation). Routing policy = otak Route 53 yang decide siapa dapat jawapan DNS mana. Tujuan: optimize availability, performance & compliance di lapisan DNS.',
            sifir: [
              'Latency-based = LAJU (performance). Geolocation = LOKASI user (compliance/bahasa) — JANGAN keliru',
              'A/B test / split % / gradual shift → Weighted',
              'Active-passive / DR / failover ke backup → Failover (+ health check)',
              'Return banyak IP sihat untuk client pilih (bukan LB betul) → Multivalue Answer (max 8)',
              'Geoproximity = jarak + bias (boleh "tarik" traffic ke satu region)',
              'AWS alias target → Evaluate Target Health auto. On-prem/non-alias → kena attach health check sendiri',
            ],
            perangkap: [
              {
                soalan: 'Syarikat global nak user disambung ke region AWS yang bagi response PALING PANTAS untuk mereka. Routing policy mana?',
                jebakan: 'Geolocation routing — hantar user ikut lokasi geografi mereka ke region terdekat. Nampak betul sebab "dekat = laju".',
                betul: 'Latency-based routing. Geolocation route ikut LOKASI user (untuk compliance/bahasa), bukan ikut kelajuan sebenar — region terdekat secara geografi tak semestinya latency terendah (network path berbeza). Keyword "fastest / lowest latency" → Latency-based. "by country / comply" → Geolocation.',
              },
            ],
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
            sebabApa: 'Wujud sebab kalau service A panggil service B terus (synchronous), bila B sibuk/down → A tersekat/gagal, dan bila trafik melonjak B kena hentam terus sampai pengsan. SQS letak "baris gilir" di tengah: A campak mesej masuk queue & teruskan kerja, B amik (pull) ikut kadar SENDIRI. Kalau B mati, mesej tunggu dalam queue (tak hilang) sampai B sihat balik. Tujuan: decouple service + serap lonjakan (buffer) + tahan kegagalan (retry/DLQ).',
            sifir: [
              'SQS = PULL queue, satu mesej diproses oleh SATU consumer. SNS = PUSH ke ramai',
              'Standard = at-least-once (boleh duplicate) + best-effort order. FIFO = exactly-once + strict order',
              'Order penting / no duplicate → FIFO (.fifo, 300/s atau 3000 batch)',
              'Visibility Timeout < masa proses → mesej muncul balik → DUPLICATE. Naikkan timeout',
              'Cross-account hantar ke queue → SQS queue policy (resource-based), bukan IAM je',
              'Long polling (WaitTime>0, max 20s) → kurangkan empty response & kos API',
            ],
            perangkap: [
              {
                soalan: 'Sistem pembayaran proses mesej dua kali kadang-kadang, dan susunan transaksi mesti tepat. Queue SQS sedia ada Standard. Pembetulan minimum?',
                jebakan: 'Tambah logik dedup & susun semula dalam kod aplikasi consumer. Nampak betul sebab "betulkan dalam kod".',
                betul: 'Tukar ke SQS FIFO queue — ia bagi exactly-once (deduplication) + strict ordering per MessageGroupId secara built-in, perubahan kod minimum. Standard memang at-least-once + best-effort order. Keyword "no duplicates / order preserved" → FIFO.',
              },
              {
                soalan: 'Consumer EC2 (Spot) ditamatkan separuh jalan semasa memproses mesej SQS. Adakah mesej hilang?',
                jebakan: 'Ya, hilang — sebab consumer dah amik mesej tu dari queue dan mati sebelum siap. Nampak betul sebab "dah diambil".',
                betul: 'TIDAK hilang. Mesej cuma jadi INVISIBLE semasa Visibility Timeout; sebab consumer tak panggil DeleteMessage, ia jadi VISIBLE semula lepas timeout dan consumer lain proses. Mesej hanya hilang bila DeleteMessage dipanggil selepas berjaya. Keyword "consumer dies mid-processing" → mesej selamat (visibility timeout).',
              },
            ],
            storageDetails: 'Visibility Timeout → Message invisible semasa diproses (max 12 jam). Jika consumer mati sebelum siap → message visible semula selepas timeout\nDelay Seconds → Delay sebelum message pertama kali visible dalam queue (max 15 minit)\nDead Letter Queue (DLQ) → Message yang gagal diproses N kali dihantar ke DLQ untuk debug\nMessage Retention → Default 4 hari, max 14 hari',
            detailsLabel: 'SQS Key Concepts',
            scenario: 'Spot instance terminated masa process SQS message → message TIDAK hilang. Ia akan visible semula selepas Visibility Timeout expired. Message hanya deleted bila consumer call DeleteMessage API selepas berjaya process.',
            mermaid: [
              {
                label: 'Pilih messaging service — SQS vs SNS vs EventBridge vs Amazon MQ (decision tree)',
                source: `flowchart TD
  Start["📨 Nak hantar mesej / event<br/>antara service"] --> MQ{"App LAMA dah guna<br/>ActiveMQ / RabbitMQ?<br/>(AMQP, MQTT, STOMP, JMS)"}
  MQ -->|"Ya — lift &amp; shift,<br/>tak nak ubah code"| AMQ["✅ Amazon MQ<br/>migrate broker sedia ada"]
  MQ -->|"Tidak — cloud-native"| ROUTE{"Perlu ROUTE ikut ISI event,<br/>react ke event AWS / SaaS,<br/>atau jadual cron?"}
  ROUTE -->|"Ya"| EB["✅ EventBridge<br/>content-based routing +<br/>event bus + scheduler"]
  ROUTE -->|"Tidak"| FAN{"1 mesej → RAMAI<br/>penerima serentak?"}
  FAN -->|"Ya (broadcast / fan-out)"| SNS["✅ SNS (push)<br/>SNS → banyak SQS = fan-out"]
  FAN -->|"Tidak — buffer &amp; proses<br/>ikut kadar consumer sendiri"| SQS["✅ SQS (pull queue)<br/>decouple, retry, DLQ"]`,
                caption: 'Tanya ikut urutan: (1) legacy broker? → Amazon MQ. (2) route ikut isi / event AWS / cron? → EventBridge. (3) satu-ke-ramai serentak? → SNS. (4) selainnya, buffer & pull → SQS. INGAT exam: SQS = pull & buffer · SNS = push & broadcast · EventBridge = route pintar · Amazon MQ = jambatan legacy.',
              },
              {
                label: 'Analogi — 4 cara hantar mesej di pejabat',
                source: `flowchart LR
  SQS["📮 SQS = beratur kaunter pos<br/>amik nombor, staff layan<br/>SATU-SATU ikut kadar sendiri<br/>(pull · buffer · tak hilang)"]
  SNS["📢 SNS = pembesar suara surau<br/>1 announcement → SEMUA<br/>dengar SERENTAK<br/>(push · fan-out)"]
  EB["🚦 EventBridge = operator switchboard<br/>route panggilan ikut JENIS<br/>(content-based + event AWS/SaaS/cron)"]
  MQ["🔌 Amazon MQ = adapter palam lama<br/>barang lama (ActiveMQ/RabbitMQ)<br/>masuk rumah baru tanpa tukar plug"]`,
                caption: 'Kaitkan dengan familiar: pos = beratur & pull (SQS), pembesar suara surau = broadcast serentak (SNS), switchboard = route ikut jenis (EventBridge), adapter palam = sambung legacy ke cloud (Amazon MQ). INGAT exam: "decouple/buffer" → SQS, "notify many/fan-out" → SNS, "route by content/schedule" → EventBridge, "migrate existing broker" → Amazon MQ.',
              },
            ],
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
            docs: [
              { label: 'SQS — visibility timeout', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html' },
              { label: 'SQS — short vs long polling', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html' },
              { label: 'SQS — dead-letter queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html' },
            ],
            keywords: ['queue', 'decouple', 'async', 'pull-based', 'visibility timeout', 'FIFO', 'DLQ', 'at-least-once', 'exactly-once', 'long polling', 'short polling', 'batch operations', 'duplicate messages', 'queue policy', 'cross-account SQS', 'resource-based policy', 'SNS SQS Lambda fan-out', 'SQS vs SNS vs EventBridge', 'pilih messaging service', 'pull vs push'],
          },
          {
            shortName: 'SNS',
            fullName: 'Simple Notification Service',
            ingat: '"Broadcast message ke ramai sekaligus — push, bukan pull"',
            gunaUntuk: 'Push notification ke many subscribers (fan-out)',
            fungsi: 'Pub/sub messaging service — publisher hantar message ke SNS topic, semua subscribers terima serentak. Subscribers boleh jadi SQS, Lambda, HTTP/S endpoints, email, SMS. Push-based (SNS hantar ke subscriber), bukan pull-based macam SQS.',
            sebabApa: 'Wujud sebab kadang SATU event perlu cetuskan BANYAK tindakan berasingan serentak — cth gambar di-upload perlu buat thumbnail + index metadata + arkib, semua sekali gus. Kalau publisher kena panggil setiap downstream satu-satu, dia jadi coupled & rapuh. SNS = pembesar suara: publisher campak SATU mesej ke topic, SNS PUSH salinan ke SEMUA subscriber (fan-out) serentak. Tujuan: pub/sub broadcast — satu-ke-ramai tanpa publisher kenal siapa subscriber.',
            sifir: [
              'SNS = PUSH pub/sub, satu mesej → SEMUA subscriber serentak (fan-out)',
              'Fan-out klasik: SNS → banyak SQS queue (tiap queue proses & scale sendiri)',
              'SNS→SQS perlu queue policy (resource-based) allow SNS SendMessage, kalau tak senyap gagal',
              'Message filtering (filter policy) → subscriber terima yang match je, tak filter dalam code',
              'SNS = fan-out ringkas. Route ikut ISI/peraturan/SaaS/cron → EventBridge',
              'Order + exactly-once → SNS FIFO topic + SQS FIFO queue',
            ],
            perangkap: [
              {
                soalan: 'Satu objek upload ke S3 perlu mencetuskan TIGA proses bebas (thumbnail, metadata, arkib) serentak, setiap satu proses ikut kadar sendiri & boleh retry. Seni bina mana?',
                jebakan: 'S3 event notification terus ke satu SQS queue, dan satu consumer buat ketiga-tiga tugas. Nampak betul sebab "satu queue boleh handle semua".',
                betul: 'S3 → SNS topic → fan-out ke 3 SQS queue (satu per proses). SNS broadcast event ke semua, tiap SQS bagi retry/buffer bebas & scale sendiri. (Bonus: S3 hanya boleh hantar 1 notifikasi per prefix/suffix ke 1 destinasi — SNS fan-out atasi had ni.) Keyword "one event → multiple independent processes" → SNS fan-out (+SQS).',
              },
            ],
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
            docs: [
              { label: 'SNS — fan-out to Amazon SQS queues', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html' },
              { label: 'SNS — message filtering', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html' },
            ],
            keywords: ['pub/sub', 'push notification', 'fan-out', 'broadcast', 'topic', 'subscription', 'filter policy', 'message filtering', 'SNS FIFO', 'cross-account SNS', 'S3 event notification', 'push-based'],
          },
          {
            shortName: 'Kinesis',
            fullName: 'Amazon Kinesis (Data Streams vs Firehose)',
            ingat: '"Streaming pipe — Streams = real-time + code, Firehose = auto-deliver no code"',
            gunaUntuk: 'Ingest & process real-time streaming data (logs, clickstream, IoT, metrics)',
            fungsi: 'Kinesis Data Streams (KDS): real-time, data dalam shards, custom consumers baca dengrn code (Lambda/KCL). Retention default 24 jam, boleh extend sampai 365 hari. Kinesis Data Firehose: near-real-time (buffer ~60s/MB), fully managed, ZERO code — auto-deliver ke S3, Redshift, OpenSearch, Splunk, boleh transform guna Lambda.',
            sebabApa: 'Wujud sebab data streaming (clickstream, IoT telemetry, log) datang TERUS-MENERUS & laju — SQS sesuai untuk task discrete tapi tak direka untuk replay atau ramai consumer baca aliran SAMA. Kinesis = paip streaming: tampung jutaan rekod/saat, simpan sekejap (retention) supaya BANYAK consumer boleh baca & main semula (replay). Data Streams bila kau nak proses sendiri (code, real-time, replay); Firehose bila kau cuma nak HANTAR aliran ke store (S3/Redshift) tanpa kod. Tujuan: ingest & proses data streaming berskala besar.',
            sifir: [
              'Data Streams = real-time (~200ms) + code (Lambda/KCL) + replay + ramai consumer',
              'Firehose = near-real-time (buffer ~60s) + ZERO code + auto-deliver ke S3/Redshift/OpenSearch/Splunk',
              'Firehose TIADA replay/storage (deliver lepas tu hilang). Streams retention 24j→365hari',
              'Streams: kau urus shards (1 shard = 1MB/s in, 2MB/s out). Firehose auto-scale',
              'Transform/analisa stream guna SQL/Flink → Managed Service for Apache Flink (dulu Kinesis Data Analytics)',
              'Bukan streaming (task discrete, decouple) → SQS, bukan Kinesis',
            ],
            perangkap: [
              {
                soalan: 'Pasukan cuma nak muatkan log streaming ke S3 dan Redshift untuk analisa, tanpa urus server atau tulis kod consumer. Servis mana?',
                jebakan: 'Kinesis Data Streams + Lambda consumer yang tulis ke S3/Redshift. Nampak betul sebab "Kinesis untuk streaming".',
                betul: 'Kinesis Data Firehose. Ia fully managed, ZERO code, auto-deliver terus ke S3/Redshift/OpenSearch/Splunk (boleh transform guna Lambda kalau perlu). Data Streams perlukan kau urus shards + tulis consumer. Keyword "just load/deliver streaming data, no code, no servers" → Firehose, bukan Data Streams.',
              },
              {
                soalan: 'Berbilang aplikasi berbeza perlu membaca aliran data SAMA secara real-time, dan boleh main semula (replay) data sehingga beberapa hari lalu untuk pemprosesan semula. Servis mana?',
                jebakan: 'SQS — letak mesej dalam queue dan biar setiap app baca. Nampak betul sebab SQS pun "hantar mesej antara komponen".',
                betul: 'Kinesis Data Streams. SQS: satu mesej diproses oleh SATU consumer lepas tu hilang (tiada replay, tiada banyak consumer baca rekod sama). Streams simpan rekod (retention sampai 365 hari) supaya banyak consumer baca & replay. Keyword "multiple consumers same stream + replay + real-time" → Data Streams, bukan SQS.',
              },
            ],
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
            mermaid: [
              {
                label: 'Pilih ahli keluarga Kinesis (decision tree)',
                source: `flowchart TD
  A[Data streaming masuk] --> B{Nak buat apa?}
  B -->|Custom real-time, replay, ramai consumer| C[Data Streams<br/>shards + code]
  B -->|Hantar terus ke S3/Redshift/OpenSearch, no code| D[Data Firehose<br/>fully managed]
  B -->|Transform/analisa stream guna SQL/Flink masa real-time| E[Managed Service for Apache Flink<br/>dulu: Kinesis Data Analytics]
  B -->|Stream video untuk ML/playback| F[Video Streams]`,
                caption: 'Nota: "Kinesis Data Analytics" dah ditukar nama jadi Amazon Managed Service for Apache Flink — soalan lama mungkin masih guna nama lama. 4 ahli: Data Streams (real-time + code), Firehose (auto-deliver no code), Managed Flink (proses/analisa stream), Video Streams (video).',
              },
              {
                label: 'Analogi Belt Sushi vs Hos Bomba — Streams vs Firehose',
                source: `flowchart TD
  DATA["🌊 Data streaming<br/>(clickstream · IoT · log)"] --> Q{"Nak proses sendiri ke<br/>nak hantar terus?"}
  Q -->|"proses sendiri,<br/>ramai orang ambil"| KDS["🍣 Belt Sushi = Data Streams<br/>pinggan lalu atas belt,<br/>ramai pelanggan ambil ikut suka<br/>(custom consumer + code)"]
  KDS --> KDS2["belt pusing simpan 24j–365hari<br/>→ boleh ambil balik (replay)<br/>kau atur berapa lorong (shards)"]
  Q -->|"terus pancut ke takung,<br/>takde orang pegang"| FH["🚒 Hos Bomba = Firehose<br/>air terus pancut ke kolam<br/>(S3/Redshift/OpenSearch),<br/>fully managed, ZERO code"]
  FH --> FH2["tapi tunggu tong kumpul dulu<br/>(buffer ~60s/MB) → near-real-time,<br/>auto-scale, no replay"]`,
                caption: 'Data Streams = belt sushi (kaiten): pinggan (record) lalu atas belt, RAMAI pelanggan (consumers) boleh ambil & proses ikut cara sendiri guna code, belt pusing simpan sekejap (retention 24j–365hari) jadi boleh ambil balik (replay) — kau yang atur berapa lorong belt (shards). Firehose = hos bomba: air (data) terus pancut ke kolam (S3/Redshift/OpenSearch/Splunk) automatik tanpa sesiapa pegang gelas (no code, fully managed), TAPI kena tunggu tong kumpul dulu (buffer ~60s) jadi near-real-time, dan tiada simpanan untuk replay. INGAT exam: "custom real-time + replay + ramai consumer" → Streams. "Just deliver ke store, no code" → Firehose.',
              },
            ],
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
            sebabApa: "API Gateway wujud sebab kalau setiap backend (Lambda/server) kena uruskan sendiri auth, throttling, caching, request validation, dan rate-limit = banyak code berulang + tak konsisten. API Gateway jadi 'pintu masuk' tunggal yang handle semua benda repetitif tu, backend fokus business logic je. Ia juga lindung backend dari traffic spike (429 throttle) supaya tak pengsan.",
            sifir: ["3 jenis: REST (full features) · HTTP (~70% murah, lower latency) · WebSocket (real-time 2-way)", "API keys + usage plans + WAF + request validation = REST SAHAJA", "HTTP API tambah JWT (OIDC/OAuth2) authorizer; REST guna IAM/Cognito/Lambda authorizer", "Throttling exceed → 429 Too Many Requests (lindung backend)", "Endpoint types REST: Edge-optimized (default) · Regional · Private (VPC only)", "Mapping Templates (VTL) = transform request/response tanpa ubah backend", "Caching at stage level; cache key boleh include query params"],
            perangkap: [{"soalan": "Real-time multiplayer game perlu server PUSH update ke client (two-way). API type mana?", "jebakan": "REST API dengan polling — sangka client boleh poll cepat-cepat.", "betul": "WebSocket API. REST/HTTP = request-response sahaja, server tak boleh push. Keyword: 'real-time' + 'bidirectional' + 'push' → WebSocket."}, {"soalan": "Backend upgrade tukar format response → break legacy clients. Fix tanpa ubah backend code?", "jebakan": "Tambah versioning ke backend atau ubah Lambda — sangka kena patch backend.", "betul": "Mapping Templates (VTL) di API Gateway untuk reshape response ikut format lama. Backend tak disentuh. Keyword: 'response format change' + 'without modifying backend'."}, {"soalan": "Nak serverless API proxy ke Lambda yang paling murah & latency rendah, tak perlu API keys/WAF. Pilih?", "jebakan": "REST API — anggap REST = pilihan default/lengkap.", "betul": "HTTP API (~70% lebih murah, lower latency). REST hanya bila perlu API keys/usage plans/WAF/private endpoint. Keyword: 'low-cost' + 'simple proxy' → HTTP API."}],
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
            sebabApa: "EventBridge wujud sebab nak react automatik bila SESUATU berlaku dalam AWS (EC2 stop, S3 upload, SaaS event) tanpa code 'polling' yang tunggu-tunggu. Ia event bus pintar: route event ke target betul berdasarkan ISI event (content-based filter), bukan broadcast semua macam SNS. Ganti CloudWatch Events lama, dan bagi kau decouple services + schedule cron tanpa server.",
            sifir: ["Content-based routing (filter by event field) — SNS tak boleh, broadcast je", "Sumber: 90+ AWS service + SaaS partner + custom app event", "Archive & Replay event (debug/reprocess); SNS tiada", "EventBridge Scheduler = cron/rate, timezone-aware, ganti CloudWatch Events schedule", "EventBridge Pipes = point-to-point source→target dengan filter/enrich, no Lambda glue", "Latency lebih tinggi (~0.5s) dari SNS tapi paling pintar"],
            perangkap: [{"soalan": "Nak route event ke target BERBEZA berdasarkan content/field dalam event. Guna apa?", "jebakan": "SNS dengan banyak subscriber — sangka SNS boleh pilih siapa terima.", "betul": "EventBridge (content-based routing via event pattern). SNS broadcast SAMA mesej ke semua subscriber, tak boleh filter by content. Keyword: 'route based on content' → EventBridge."}, {"soalan": "EC2 instance terminate → auto-trigger Lambda untuk cleanup. Service mana?", "jebakan": "SNS notification ke Lambda — sangka SNS yang detect state change.", "betul": "EventBridge rule (detect EC2 state change event → trigger Lambda). SNS tak detect AWS service events. Keyword: 'AWS service state change' → EventBridge."}],
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
            docs: [
              { label: 'EventBridge — what is it (event bus & rules)', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html' },
              { label: 'EventBridge Scheduler', url: 'https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html' },
            ],
            keywords: ['event bus', 'event-driven', 'cron schedule', 'rule-based routing', 'decouple', 'SaaS integration', 'CloudWatch Events', 'schema registry', 'archive replay', 'EventBridge Pipes', 'EventBridge Scheduler'],
          },
          {
            shortName: 'Step Functions',
            fullName: 'AWS Step Functions',
            ingat: '"Flowchart yang run sendiri — orchestrate multi-step workflows"',
            gunaUntuk: 'Coordinate multi-step processes with error handling, retry, and branching',
            fungsi: 'Visual workflow orchestration. Setiap step boleh timeout, retry, atau branch ikut result. Integrate dengan Lambda, ECS, Glue, DynamoDB, dan 200+ services. State machine dengan JSON definition.',
            sebabApa: "Step Functions wujud sebab chain banyak Lambda/service manual (Lambda panggil Lambda panggil Lambda) jadi mimpi ngeri bila kena handle retry, timeout, branching, dan error pada SETIAP langkah — code jadi spaghetti + susah debug. Step Functions jadi 'flowchart yang run sendiri': retry/catch/branch terbina dalam, visual console tunjuk state tiap langkah. Buang glue code rapuh + bagi resilience automatik.",
            sifir: ["Standard = max 1 tahun, exactly-once, audit penuh; Express = max 5 min, at-least-once, murah", "Non-idempotent (payment, start EMR) → Standard; high-volume idempotent (IoT/stream) → Express", "Callback (.waitForTaskToken), .sync job-run, Distributed Map, Activities → STANDARD SAHAJA", "Workflow type IMMUTABLE — tak boleh tukar Standard↔Express lepas create", "Choice=branch · Parallel=serentak · Map=loop array · Distributed Map=dataset besar", "Error handling ASL: Retry (backoff) + Catch (route ke fallback)"],
            perangkap: [{"soalan": "Workflow charge payment + start EMR cluster, kena exactly-once + audit trail penuh. Standard atau Express?", "jebakan": "Express — sebab 'laju & murah', anggap workflow pendek.", "betul": "Standard. Express = at-least-once (boleh run 2x → double charge!) + max 5 min. Non-idempotent/payment/audit → Standard. Keyword: 'payment' + 'exactly-once' + 'audit'."}, {"soalan": "Workflow kena PAUSE tunggu kelulusan manusia dulu sebelum sambung. Macam mana?", "jebakan": "Express workflow dengan wait state — sangka Express boleh tunggu callback.", "betul": "Standard + Callback pattern (.waitForTaskToken). Express TAK support .waitForTaskToken. Keyword: 'human approval' + 'wait for callback' → Standard."}],
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
            mermaid: [
              {
                label: 'Standard vs Express — pilih jenis workflow (decision tree)',
                source: `flowchart TD
  A["Nak orchestrate workflow"] --> B{"Berapa lama satu<br/>run boleh ambil?"}
  B -->|"> 5 minit / berjam / berhari<br/>(sampai 1 tahun)"| STD["🧾 STANDARD<br/>exactly-once · audit penuh<br/>max 1 tahun"]
  B -->|"≤ 5 minit, volume tinggi"| C{"Tindakan idempotent?<br/>(boleh ulang tanpa rosak)"}
  C -->|"Ya — IoT ingest, streaming,<br/>transform data"| EXP["⚡ EXPRESS<br/>at-least-once · murah · laju<br/>max 5 minit"]
  C -->|"TIDAK — bayar duit,<br/>start EMR cluster"| STD
  STD --> S2["Perlu human-approval (.waitForTaskToken),<br/>.sync job-run, Distributed Map, Activities?<br/>→ wajib STANDARD"]
  EXP --> E2["Sync Express = tunggu jawapan (API backend)<br/>Async Express = fire-and-forget (log/stream)"]`,
                caption: 'Soalan pertama exam = tempoh + idempotency. >5 min ATAU non-idempotent (payment, start cluster) → Standard (exactly-once, audit penuh). ≤5 min + idempotent + volume tinggi (IoT/streaming) → Express (at-least-once, bayar per execution). INGAT: human-approval/callback (.waitForTaskToken), .sync job-run, Distributed Map & Activities → STANDARD SAHAJA.',
              },
              {
                label: 'Analogi — Pos Berdaftar vs Blast SMS',
                source: `flowchart TD
  W["📋 Borang proses berlangkah<br/>(validate → bayar → hantar → email)"] --> Q{"Penting & kena ada resit?<br/>atau laju & banyak?"}
  Q -->|"Penting, kena jejak,<br/>jangan hantar 2 kali"| STD["📮 Pos Berdaftar = STANDARD<br/>setiap langkah ada resit (audit),<br/>exactly-once, boleh ambil masa,<br/>bayar ikut bilangan langkah"]
  Q -->|"Laju, banyak,<br/>ulang pun tak apa"| EXP["📲 Blast SMS = EXPRESS<br/>pukul rata laju & murah,<br/>kadang sampai 2 kali (at-least-once),<br/>siap dalam 5 minit"]`,
                caption: 'Standard = pos berdaftar: setiap langkah ada resit (execution history/audit), dijamin exactly-once (tak hantar 2 kali) → sesuai bayar duit, start EMR cluster, workflow berhari/berbulan. Express = blast SMS: laju + murah + volume besar, tapi boleh sampai 2 kali (at-least-once) → sesuai IoT ingest & streaming yang idempotent. INGAT exam: "non-idempotent / payment / long-running / audit trail" → Standard; "high-volume event / IoT / streaming, short" → Express.',
              },
            ],
            scenario: '"Order processing: validate → charge card → notify warehouse → send email, dengan error handling pada setiap step" → Step Functions. Bukan Lambda je (Lambda tak ada built-in retry/branching logic across services). "Payment / non-idempotent / berjam-jam / perlu audit trail penuh" → Standard. "IoT ingestion / streaming transform / high-volume, idempotent, <5 min" → Express. "Workflow kena tunggu kelulusan manusia dulu sebelum sambung" → Standard + Callback pattern (.waitForTaskToken).',
            compare: [
              {
                label: 'Standard vs Express Workflow (discriminator utama exam)',
                headers: ['Ciri', 'Standard', 'Express'],
                rows: [
                  ['Tempoh max', '🟢 1 tahun', '5 minit'],
                  ['Execution semantics', 'Exactly-once', 'Async = at-least-once · Sync = at-most-once'],
                  ['Sesuai untuk', 'Non-idempotent (bayar, start EMR), long-running, audit', 'High-volume event: IoT ingest, streaming, mobile backend (idempotent)'],
                  ['Harga', 'Per state transition', 'Per execution + tempoh + memory'],
                  ['Execution history', '🟢 Penuh (API 90 hari) + visual console', 'CloudWatch Logs sahaja'],
                  ['Callback (.waitForTaskToken) & .sync job-run', '🟢 Ya', '❌ Tidak'],
                  ['Distributed Map & Activities', '🟢 Ya', '❌ Tidak'],
                ],
                takeaway: 'Long-running / non-idempotent / perlu audit / human-approval-callback / Distributed Map → Standard. Short (<5 min) + high-volume + idempotent (IoT/streaming) → Express. Jenis workflow IMMUTABLE — tak boleh tukar lepas create.',
              },
              {
                label: 'Step Functions vs Lambda-sahaja vs SWF — bila orchestrate?',
                headers: ['Situasi', 'Pilih'],
                rows: [
                  ['Multi-step merentas banyak service, perlu retry/branch/visual', '🟢 Step Functions'],
                  ['Satu fungsi ringkas, tiada coordination antara langkah', 'Lambda sahaja'],
                  ['Perlu visual console tengok state setiap langkah', 'Step Functions (BUKAN SQS/SWF)'],
                  ['Legacy / perlu external "deciders" & "workers" sendiri', 'SWF (lama — elak untuk projek baru)'],
                ],
                takeaway: 'Step Functions = orchestrator moden (state machine + visual + built-in retry/catch). Lambda-sahaja kalau takde langkah nak coordinate. SWF legacy — Step Functions ganti dia.',
              },
            ],
            tips: [
              'Standard vs Express adalah discriminator #1: ingat tempoh (1 tahun vs 5 minit) + idempotency. Non-idempotent (charge payment, start EMR cluster) → Standard (exactly-once). High-volume idempotent (IoT, streaming) → Express (at-least-once).',
              'Workflow type IMMUTABLE — tak boleh tukar Standard↔Express selepas state machine dicipta. Kena buat state machine baru.',
              'Express ada 2 rasa: Synchronous Express = tunggu & pulang result (sesuai orchestrate API backend / API Gateway integration); Asynchronous Express = fire-and-forget (sesuai streaming/log ingestion).',
              'Service integration patterns: Request-Response (default, terus sambung), .sync (Job-run — tunggu job AWS habis, cth EMR/Glue/ECS), .waitForTaskToken (Callback — pause sampai external system/human hantar token balik). .sync & Callback → STANDARD SAHAJA, Express tak support.',
              'Error handling terbina dalam ASL: Retry (cuba semula dengan backoff), Catch (tangkap error & route ke fallback state). Sebab tu Step Functions menang vs Lambda-chaining manual untuk workflow yang perlu resilience.',
              'Choice state = branching (if/else ikut input). Parallel state = jalankan beberapa cabang serentak. Map state = ulang langkah atas array. Distributed Map = versi besar Map untuk dataset besar (Standard sahaja).',
              'Distributed Map state: parallelizes processing over large datasets (e.g. chunk a text file and process each chunk concurrently) — key for PT5 text-to-speech pipeline question. Standard sahaja.',
              '"Graphical/visual console to see each step\'s state" → Step Functions (not SQS, not SWF)',
              'SWF vs Step Functions: Step Functions is the modern replacement; SWF is legacy and lacks the visual console',
            ],
            docs: [
              { label: 'Choosing workflow type (Standard vs Express)', url: 'https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html' },
              { label: 'Service integration patterns (.sync, .waitForTaskToken)', url: 'https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html' },
            ],
            keywords: ['workflow', 'state machine', 'orchestration', 'retry logic', 'error handling', 'Lambda orchestration', 'visual workflow', 'Distributed Map', 'parallel processing', 'Standard workflow', 'Express workflow', 'exactly-once', 'at-least-once', 'idempotent', 'callback pattern', 'waitForTaskToken', 'sync integration', 'ASL', 'Amazon States Language', 'Choice state', 'Map state', 'Activities', 'SWF'],
          },
          {
            shortName: 'Amazon MQ',
            fullName: 'Amazon MQ',
            ingat: '"SQS tapi untuk apps lama yang guna ActiveMQ/RabbitMQ"',
            gunaUntuk: 'Migrate existing ActiveMQ/RabbitMQ message brokers to AWS without code changes',
            fungsi: 'Managed message broker service yang support ActiveMQ dan RabbitMQ. Guna AMQP, MQTT, STOMP, OpenWire protocols. Untuk lift-and-shift apps yang dah guna standard protocols.',
            sebabApa: "Amazon MQ wujud sebab banyak app lama (on-prem) dah guna ActiveMQ/RabbitMQ dengan protokol standard (AMQP, MQTT, STOMP, JMS). Kalau nak migrate ke AWS dan tukar ke SQS/SNS = kena rewrite code (API AWS proprietary). Amazon MQ = managed broker yang cakap protokol standard tu, jadi app lama boleh lift-and-shift tanpa ubah code. Ia 'jambatan' untuk legacy, bukan pilihan default.",
            sifir: ["Amazon MQ = MIGRATION/legacy; SQS+SNS = cloud-native app BARU", "Support protokol terbuka: AMQP, MQTT, STOMP, OpenWire, JMS, WebSocket", "2 engine: ActiveMQ (banyak protokol) · RabbitMQ (AMQP terutamanya)", "App guna MQTT/STOMP → mesti engine ActiveMQ", "Managed BROKER (instance), bukan serverless macam SQS — skala terhad ikut saiz broker", "Deployment: single-instance (dev) · active/standby multi-AZ (prod HA, guna EFS)"],
            perangkap: [{"soalan": "On-prem app guna ActiveMQ (AMQP), nak migrate ke AWS TANPA ubah code. Service mana?", "jebakan": "SQS + SNS — sangka 'messaging di AWS mesti SQS/SNS'.", "betul": "Amazon MQ. SQS/SNS guna API proprietary → kena rewrite code. MQ support protokol standard untuk lift-and-shift. Keyword: 'migrate existing' + 'AMQP/MQTT' + 'no code change'."}, {"soalan": "Bina app messaging cloud-native BARU, perlu auto-scale hampir tanpa had. Amazon MQ?", "jebakan": "Amazon MQ — sangka ia general-purpose messaging untuk semua.", "betul": "SQS + SNS. MQ = broker instance (skala terhad, mahal sikit). App baru → SQS/SNS serverless. Keyword: 'new app' + 'scale' → SQS/SNS, BUKAN MQ."}],
            detailsLabel: 'Amazon MQ — komponen utama',
            storageDetails: 'Engine → ActiveMQ atau RabbitMQ (pilih ikut protokol app sedia ada)\nProtokol terbuka → AMQP, MQTT, STOMP, OpenWire, WebSocket, JMS — sebab itu app lama boleh sambung tanpa tukar code\nBroker → instance yang AWS urus (patching, HA). Bukan serverless macam SQS\nDeployment → single-instance (dev/test) atau active/standby multi-AZ (production HA, auto-failover guna EFS)\nQueue & Topic → satu broker boleh ada queues (point-to-point) DAN topics (pub/sub) sekali',
            scenario: '"Company ada on-premises app guna ActiveMQ, nak migrate ke AWS tanpa tukar code" → Amazon MQ. App baru? → guna SQS/SNS (simpler, cheaper, cloud-native). Amazon MQ = MIGRATION/LEGACY. SQS = cloud-native new apps.',
            mermaid: {
              label: 'Analogi — Amazon MQ = adapter palam lama',
              source: `flowchart LR
  OLD["🏭 App lama on-prem<br/>guna ActiveMQ / RabbitMQ<br/>(plug 3-pin lama)"] --> MQ["🔌 Amazon MQ<br/>adapter — terima plug lama<br/>tanpa ubah perkakas"]
  MQ --> AWS["☁️ Jalan elok dalam AWS<br/>(managed broker, HA)"]
  NEW["✨ App BARU?"] -.->|"jangan guna adapter —<br/>terus pakai soket baru"| SQSSNS["✅ SQS / SNS<br/>cloud-native, murah, auto-scale"]`,
              caption: 'Kaitkan dengan familiar: app legacy = perkakas berplug lama; Amazon MQ = adapter yang biar ia masuk soket AWS tanpa beli perkakas baru. App baru tak payah adapter — terus SQS/SNS. INGAT exam: "migrate / existing broker / MQTT / AMQP / tanpa tukar code" → Amazon MQ; app baru → SQS/SNS.',
            },
            compare: [
              {
                label: 'Amazon MQ vs SQS + SNS — bila pilih yang mana',
                headers: ['Aspect', 'Amazon MQ', 'SQS + SNS'],
                rows: [
                  ['Bila guna', '🟠 Lift-and-shift app SEDIA ADA', '🟢 App cloud-native BARU'],
                  ['Protokol', 'Terbuka: AMQP, MQTT, STOMP, OpenWire, JMS', 'API AWS proprietary (SDK sahaja)'],
                  ['Bentuk', 'Managed broker (instance)', 'Fully serverless (no broker)'],
                  ['Skala', 'Terhad ikut saiz broker', '🟢 Hampir tanpa had, auto-scale'],
                  ['Kos & urus', 'Mahal sikit, kena saiz broker', '🟢 Bayar ikut guna, no infra'],
                ],
                takeaway: '"migrate", "existing ActiveMQ/RabbitMQ", "MQTT/AMQP/STOMP", "tanpa tukar code" → Amazon MQ. App baru / nak scale / serverless → SQS + SNS. MQ = jambatan untuk legacy, BUKAN pilihan default.',
              },
              {
                label: 'ActiveMQ vs RabbitMQ — engine mana untuk protokol apa',
                headers: ['Aspect', 'ActiveMQ', 'RabbitMQ'],
                rows: [
                  ['Protokol', 'AMQP, MQTT, STOMP, OpenWire, WebSocket', 'AMQP terutamanya'],
                  ['Pilih bila app guna', 'MQTT (IoT) / STOMP / OpenWire / JMS', 'AMQP standard, routing fleksibel'],
                  ['Model', 'JMS-style queues & topics', 'Exchange → binding → queue routing'],
                ],
                takeaway: 'App guna MQTT atau STOMP → mesti ActiveMQ engine. App AMQP biasa → mana-mana, RabbitMQ popular untuk routing. Exam jarang masuk dalam, tapi "MQTT" condong ke ActiveMQ.',
              },
            ],
            tips: [
              'Amazon MQ vs SQS/SNS: Amazon MQ = lift-and-shift apps yang ALREADY use AMQP/MQTT/STOMP protocols. SQS/SNS = cloud-native new applications (simpler, cheaper, scales better)',
              'Supports both ActiveMQ and RabbitMQ engines. ActiveMQ supports more protocols (AMQP, MQTT, STOMP, OpenWire, WebSocket). RabbitMQ = AMQP + JMS sahaja. App guna MQTT/STOMP → mesti ActiveMQ engine',
              'Deployment: single-instance (dev/test) or active/standby (production HA). Active/standby uses EFS for shared storage — automatic failover',
              'Exam keyword: "migrate", "existing messaging system", "MQTT", "AMQP", "without changing application code" → Amazon MQ. Jangan pilih SQS/SNS untuk migration scenarios',
            ],
            docs: [
              { label: 'Amazon MQ — what is it', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/welcome.html' },
              { label: 'Amazon MQ — broker engines & protocols', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/working-with-amazon-mq.html' },
            ],
            keywords: ['ActiveMQ', 'RabbitMQ', 'AMQP', 'MQTT', 'lift-and-shift', 'message broker', 'legacy migration', 'open protocols', 'STOMP', 'OpenWire', 'JMS', 'Amazon MQ vs SQS', 'managed broker'],
          },
          {
            shortName: 'Kinesis Data Firehose',
            fullName: 'Amazon Kinesis Data Firehose',
            ingat: '"Paip streaming data terus ke S3/Redshift — no code needed"',
            gunaUntuk: 'Capture and load streaming data to S3, Redshift, OpenSearch, Splunk automatically',
            fungsi: 'Fully managed delivery stream — tak perlu tulis consumer code. Buffer data sebelum write. Boleh transform inline dengan Lambda. Kinesis Data Streams = real-time processing (kena tulis consumer). Firehose = delivery/loading (no consumer needed).',
            sebabApa: "Firehose wujud sebab nak load streaming data terus ke destinasi (S3, Redshift, OpenSearch, Splunk) tanpa tulis consumer code sendiri — dengan Kinesis Data Streams kau kena bina + maintain consumer app. Firehose fully managed: ia buffer, optional transform inline (Lambda), dan deliver automatik. Buang kerja bina pipeline delivery — pilih bila kau cuma nak 'pipe data masuk store', bukan real-time processing.",
            sifir: ["Firehose = DELIVERY/loading (no consumer code); Data Streams = real-time PROCESSING (tulis consumer)", "Destinasi: S3, Redshift, OpenSearch, Splunk (managed delivery)", "Buffer ikut size/time sebelum write (near real-time, ada sikit delay)", "Inline transform optional guna Lambda sebelum deliver", "Fully managed, auto-scale — tiada shard nak urus macam Data Streams"],
            perangkap: [{"soalan": "Ingest clickstream data terus ke S3 untuk analytics, tak nak tulis/maintain consumer code. Service?", "jebakan": "Kinesis Data Streams — sangka semua streaming mesti Data Streams.", "betul": "Kinesis Data Firehose. Firehose auto-deliver ke S3 tanpa consumer code. Data Streams kena bina consumer sendiri. Keyword: 'load to S3' + 'no consumer code' → Firehose."}, {"soalan": "Real-time fraud detection proses event streaming dengan custom logic + low latency. Firehose?", "jebakan": "Firehose dengan Lambda transform — sangka transform = processing.", "betul": "Kinesis Data Streams. Real-time processing + custom consumer logic + sub-second → Data Streams. Firehose ada buffer delay (near real-time). Keyword: 'real-time processing' → Data Streams."}],
            scenario: '"Ingest clickstream data to S3 for analysis" → Kinesis Firehose (automatic, no consumer code). "Real-time fraud detection processing streaming events" → Kinesis Data Streams (more control, write consumer). Ingat perbezaan Streams vs Firehose!',
            keywords: ['delivery stream', 'S3 delivery', 'Redshift', 'OpenSearch', 'no consumer code', 'buffer', 'transform with Lambda'],
          },
          {
            shortName: 'AppFlow',
            fullName: 'AWS AppFlow',
            ingat: '"Penyambung SaaS → AWS, tanpa code"',
            gunaUntuk: 'Automated no-code data transfer between SaaS apps (Salesforce, ServiceNow, Slack) and AWS services',
            fungsi: 'Fully managed integration service dengan 50+ built-in SaaS connectors. Boleh transfer data bidirectionally antara SaaS platforms dan S3, Redshift, EventBridge. Support scheduling, field mapping, filtering, and data transformation.',
            sebabApa: "AppFlow wujud sebab tarik data dari SaaS apps (Salesforce, ServiceNow, Slack) ke AWS biasanya kena tulis custom integration guna API setiap SaaS — leceh + kena maintain bila API berubah. AppFlow = 50+ connector siap, no-code: kau pilih source, mapping, schedule → data mengalir ke S3/Redshift. Buang kerja bina + jaga API integration sendiri.",
            sifir: ["AppFlow = SaaS API integration (Salesforce, ServiceNow, Slack, Zendesk)", "DataSync = file/storage protocol (NFS, SMB, HDFS, S3) — BUKAN SaaS", "Glue = code-based ETL (PySpark/Python) untuk data lake — AppFlow no-code", "Bidirectional transfer + scheduling + field mapping + filter", "Destinasi AWS: S3, Redshift, EventBridge"],
            perangkap: [{"soalan": "Sync data Salesforce + ServiceNow ke S3 untuk analytics, tanpa custom development. Service?", "jebakan": "AWS Glue — sangka 'data ke S3 = ETL = Glue'.", "betul": "AppFlow. Glue = code-based ETL (tulis PySpark). AppFlow = no-code SaaS connector. Keyword: 'SaaS app' (Salesforce/ServiceNow) + 'no code' → AppFlow."}, {"soalan": "Migrate fail dari on-prem NFS share ke S3. AppFlow?", "jebakan": "AppFlow — sangka semua 'transfer ke AWS' guna AppFlow.", "betul": "DataSync. AppFlow untuk SaaS API; file protocol (NFS/SMB) → DataSync. Keyword: 'NFS/SMB file migration' → DataSync, BUKAN AppFlow."}],
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
            sebabApa: "AppSync wujud sebab app moden (mobile/web) selalu nak (1) GraphQL — satu query tarik data dari banyak source sekaligus, (2) real-time push update, dan (3) offline sync dengan auto conflict resolution. Bina semua ni sendiri atas API Gateway + WebSocket + DynamoDB = banyak kerja. AppSync managed GraphQL bagi semua tu siap — buang kerja bina resolver, subscription, dan offline sync engine.",
            sifir: ["AppSync = GraphQL + real-time subscription + offline sync; API Gateway = REST/HTTP/WebSocket", "Satu query boleh resolve dari MULTIPLE data source (DynamoDB+Lambda+Aurora) sekaligus", "Real-time = GraphQL subscription over WebSocket (push, no polling)", "Offline: AppSync + Amplify DataStore; conflict: Optimistic Concurrency / Auto Merge / Custom Lambda", "Data source: DynamoDB, Aurora, OpenSearch, Lambda, HTTP endpoint", "Server-side caching optional (kurangkan resolver execution + latency)"],
            perangkap: [{"soalan": "Mobile app perlu real-time update + offline data sync dengan automatic conflict resolution. Service?", "jebakan": "API Gateway WebSocket — sangka WebSocket = real-time = jawapan.", "betul": "AppSync. Ia ada offline sync + conflict resolution built-in (via Amplify DataStore); API Gateway tiada. Keyword: 'GraphQL' / 'offline sync' / 'conflict resolution' → AppSync."}, {"soalan": "Satu query frontend perlu aggregate data dari DynamoDB + Aurora + Lambda sekaligus. Pilih?", "jebakan": "API Gateway + banyak REST endpoint — sangka kena panggil banyak endpoint.", "betul": "AppSync GraphQL — satu query resolve dari multiple data source. REST kena banyak round-trip. Keyword: 'single query, multiple sources' → AppSync."}],
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
            sebabApa: "Amplify wujud sebab developer frontend nak deploy fullstack web/mobile app cepat (CI/CD + hosting + auth + API + storage) tanpa pasang infra sendiri (EC2, pipeline, CDN setup). Amplify = 'Vercel/Heroku-nya AWS': connect Git repo → auto build & deploy ke CDN, dan tambah backend (Cognito/AppSync/DynamoDB/S3) secara managed. Buang kerja wiring infra — fokus tulis app.",
            sifir: ["Amplify = frontend/fullstack (React, Next.js, mobile); Beanstalk = backend server app (Node/Java/Docker)", "Hosting = Git-based CI/CD (GitHub/GitLab/Bitbucket) + CloudFront CDN + HTTPS auto", "Support SSR (Next.js/Nuxt), SSG, SPA", "Backend guna Cognito (auth) + AppSync/API GW (API) + DynamoDB (data) + S3 + Lambda", "vs S3+CloudFront: Amplify include CI/CD + backend; S3+CF = static hosting je (setup pipeline sendiri)"],
            perangkap: [{"soalan": "Team nak deploy React app cepat dengan CI/CD + auth + GraphQL backend tanpa urus infra. Service?", "jebakan": "Elastic Beanstalk — sangka 'deploy app = Beanstalk'.", "betul": "Amplify. Beanstalk untuk backend server app (Node/Java/Docker), bukan frontend/fullstack JS. Keyword: 'React/Next.js' + 'CI/CD' + 'fullstack' → Amplify."}, {"soalan": "Host static website paling murah, tak perlu CI/CD atau backend. Amplify?", "jebakan": "Amplify — sangka Amplify = cara standard host web.", "betul": "S3 + CloudFront. Untuk static murah tanpa pipeline/backend, S3+CF cukup. Amplify bila perlu CI/CD + backend. Keyword: 'static website' + 'cheap' → S3+CloudFront."}],
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
            sebabApa: "CloudFormation wujud sebab buat infra manual (klik console satu-satu) = lambat, tak konsisten antara env (dev/prod), dan susah nak replicate atau rollback. CloudFormation = Infrastructure as Code: tulis template (YAML/JSON) sekali, deploy infra yang sama berulang kali, dan kalau gagal auto-rollback. Buang human error + 'works on dev tapi tak sama kat prod'. Ia FREE — bayar resource je.",
            sifir: ["CloudFormation FREE — bayar hanya resource yang dibuat (EC2/RDS/S3), stacks & StackSets percuma", "Change Set = PREVIEW perubahan sebelum apply; Drift Detection = detect perubahan manual luar CFN", "Mappings = static lookup (region→AMI); Outputs+Fn::ImportValue = cross-stack ref; Parameters = user input", "cfn-init = install packages dari metadata; cfn-signal = hantar SUCCESS/FAIL; cfn-hup = re-run bila metadata berubah", "DeletionPolicy: Retain = resource KEKAL walau stack dipadam (untuk RDS/S3)", "Nested Stacks = reusable component (VPC/security layer); StackSets = deploy multi-account/region", "Stack update gagal → auto-ROLLBACK ke state lama (default)"],
            perangkap: [{"soalan": "Satu CloudFormation template untuk banyak region, auto-pilih AMI ID betul ikut region. Guna apa?", "jebakan": "Parameters — sangka user kena input AMI ID setiap region.", "betul": "Mappings (static region→AMI lookup) atau Lambda-backed custom resource (dynamic lookup SSM). Bukan Parameters (manual). Keyword: 'region-specific AMI' → Mappings/custom resource."}, {"soalan": "Nak detect kalau ada orang ubah resource stack secara MANUAL via console. Feature?", "jebakan": "Change Set — sangka ia tunjuk perubahan yang dah berlaku.", "betul": "Drift Detection. Change Set = preview perubahan SEBELUM apply; Drift = detect perubahan manual yang dah terjadi di luar CFN. Keyword: 'manual console changes' → Drift Detection."}, {"soalan": "Padam stack tapi nak data RDS/S3 KEKAL (jangan lenyap). Macam mana?", "jebakan": "Backup manual dulu sebelum delete stack — leceh + boleh terlupa.", "betul": "Set DeletionPolicy: Retain pada resource tu. Stack dipadam, resource kekal. Keyword: 'retain data on stack deletion' → DeletionPolicy: Retain."}],
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
              'PRICING: CloudFormation is FREE — kau bayar hanya untuk AWS resources yang ia create (EC2, RDS, S3, dll). Tiada charge untuk stacks, templates, changes, drift detection, StackSets. Designer & change sets juga free.',
              'StackSets: deploy ke multiple accounts/regions sekali gus. Perlukan AWS Organizations atau self-managed permissions. Boleh auto-reconcile drift.',
              'Exam: "no additional charge for using CloudFormation" → hanya bayar resources yang dibuat. Nested stacks & StackSets percuma.',
            ],
            keywords: ['IaC', 'Infrastructure as Code', 'template', 'stack', 'rollback', 'repeatable deployment', 'Lambda-backed custom resource', 'AMI lookup', 'dynamic parameters', 'multi-region template', 'Mappings', 'Outputs', 'cross-stack reference', 'Fn::ImportValue', 'cfn-init', 'cfn-signal', 'cfn-hup', 'cfn-get-metadata', 'change set', 'drift detection', 'stack rollback', 'DeletionPolicy', 'nested stacks', 'AWS::CloudFormation::Stack', 'modular templates', 'StackSets', 'free', 'pricing', 'no additional charge'],
          },
          {
            shortName: 'SSM',
            fullName: 'AWS Systems Manager',
            ingat: '"Remote control untuk EC2 fleet"',
            gunaUntuk: 'Manage, patch, and run commands on EC2 instances at scale',
            fungsi: 'Suite alat untuk visibility dan kawalan ke atas infrastruktur AWS. Run Command jalankan commands pada existing instances tanpa SSH. Patch Manager automate OS patching. Parameter Store simpan config/secrets.',
            sebabApa: "SSM wujud sebab urus ratusan-ribuan EC2 (patch, run command, store config) secara manual via SSH = mustahil + bahaya (kena buka port 22, urus SSH keys, bastion host). SSM bagi kau control fleet at scale tanpa SSH: Run Command jalankan script serentak, Session Manager bagi shell tanpa buka port, Patch Manager auto-patch, Parameter Store simpan config/secret. Buang SSH key management + bastion + kerja manual per-instance.",
            sifir: ["Run Command = jalankan command at scale tanpa SSH (perlu SSM Agent + AmazonSSMManagedInstanceCore role)", "Session Manager = interactive shell TANPA port 22/bastion; audit ke S3/CloudWatch/CloudTrail", "Parameter Store Standard = FREE (10,000 params); Advanced = $0.05/param/mo + policies", "SecureString = encrypt value guna KMS (password/API key)", "Parameter Store = murah, NO auto-rotation; Secrets Manager = auto-rotation (~$0.40/secret/mo)", "SSM Agent pre-installed pada Amazon Linux 2 + Windows Server"],
            perangkap: [{"soalan": "Update 100 EC2 instances serentak, policy LARANG SSH/port 22. Guna apa?", "jebakan": "User Data script — sangka boleh re-run untuk update.", "betul": "SSM Run Command. User Data hanya jalan masa LAUNCH, tak boleh re-run on existing fleet. Keyword: 'existing instances' + 'no SSH' + 'at scale' → Run Command."}, {"soalan": "Simpan DB password yang kena auto-rotate setiap 30 hari. Parameter Store?", "jebakan": "Parameter Store SecureString — sangka SecureString = auto-rotate.", "betul": "Secrets Manager. Parameter Store tiada auto-rotation; Secrets Manager rotate native (RDS/Redshift/DocumentDB). Keyword: 'auto-rotate' → Secrets Manager, BUKAN Parameter Store."}, {"soalan": "Nak interactive shell access ke EC2 tanpa buka port 22 atau bastion host. Service?", "jebakan": "Run Command — sangka command execution = shell access.", "betul": "Session Manager (browser-based interactive shell, no port 22, full audit). Run Command = non-interactive script je. Keyword: 'interactive shell' + 'no port 22/bastion' → Session Manager."}],
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
              'PRICING: Free tier — 2,000 activation registrations, 1,000 managed instances. Parameter Store Standard = FREE (up to 10,000 params). Advanced params = $0.05/param/mo + parameter policies. Session Manager = included (no additional charge). Run Command = included. Patch Manager = included. Only Advanced params + OpsCenter + State Manager associations ada charge.',
              'Exam: "minimize cost for storing parameters" → Parameter Store Standard (free, up to 10,000). "advanced features (policies, expiration)" → Advanced ($0.05/param/mo). "Session Manager cost" → free (included in SSM).',
            ],
            keywords: ['Run Command', 'Patch Manager', 'Parameter Store', 'Session Manager', 'no SSH', 'fleet management', 'parallel execution', 'AmazonSSMManagedInstanceCore', 'SecureString', 'KMS', 'Standard tier', 'Advanced tier', 'bastion-free', 'Secrets Manager', 'auto-rotation', 'pricing', 'free tier', 'advanced params cost', 'session manager included'],
          },
          {
            shortName: 'AWS Config',
            fullName: 'AWS Config',
            ingat: '"Audit & track apa yang berubah"',
            gunaUntuk: 'Track configuration changes and compliance of AWS resources',
            fungsi: 'Memantau dan merekod konfigurasi AWS resources dari masa ke masa. Boleh set rules untuk enforce compliance — contoh: "semua S3 mesti ada encryption". Bukan untuk run scripts.',
            sebabApa: "Config wujud sebab tanpa dia, kau tak ada cara tahu 'apa rupa setting resource ni semalam' atau 'siapa langgar policy encryption'. Sebelum ni team kena audit manual satu-satu — tak scalable. Config auto-rekod setiap perubahan config (state over time) + boleh enforce rules (cth 'semua S3 mesti encrypted') dan auto-fix bila ada yang langgar, jadi compliance jadi automatik bukan manual.",
            sifir: ["Config = WHAT/state config resource (sekarang & dulu). CloudTrail = WHO call API bila.", "Config Rules: managed (AWS pre-built) atau custom (Lambda) — evaluate continuous/on-change.", "Auto-remediation = Config rule + SSM Automation document (auto-fix non-compliant).", "Conformance Pack = bundle rules + remediation (CIS/NIST/PCI) deploy org-wide via StackSets.", "Per-region service, bukan global; Config Aggregator = view multi-account + multi-region central.", "PRICING: $0.003/config item recorded + $0.001/rule evaluation per region (bukan free)."],
            perangkap: [{"soalan": "Company nak tahu siapa yang ubah Security Group dan bila API call dibuat untuk audit. Service mana?", "jebakan": "AWS Config — sebab Config memang track perubahan resource, nampak macam betul.", "betul": "CloudTrail — keyword 'siapa call API & bila' = WHO/API audit = CloudTrail. Config jawab 'apa state config', bukan 'siapa call API'. (Selalunya guna dua-dua sekali.)"}, {"soalan": "Pastikan SEMUA S3 buckets encrypted dan auto-fix mana-mana yang tak comply. Pilihan terbaik?", "jebakan": "Lambda function scan bucket + fix — boleh jalan tapi kau bina & maintain sendiri.", "betul": "AWS Config Rule (managed 's3-bucket-server-side-encryption-enabled') + auto-remediation via SSM Automation. Keyword 'enforce compliance + auto-fix violations' = Config rules, bukan Lambda alone, bukan CloudTrail."}],
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
              'PRICING: $0.003 per configuration item recorded per region. $0.001 per config rule evaluation per region. Conformance packs = $0.001 per rule evaluation. Bukan free — kau bayar untuk setiap config item yang direkod dan setiap rule yang di-evaluate.',
              'Exam: "Config has per-item recording cost" → $0.003/configuration item. "conformance pack cost" → $0.001 per rule evaluation.',
            ],
            keywords: ['compliance', 'audit', 'config changes', 'config rules', 'resource history', 'drift detection', 'auto-remediation', 'conformance packs', 'Config aggregator', 'SSM Automation', 'managed rules', 'custom rules', 'pricing', 'per configuration item', 'per rule evaluation'],
          },
          {
            shortName: 'CodeCommit',
            fullName: 'AWS CodeCommit',
            ingat: '"GitHub tapi dalam AWS"',
            gunaUntuk: 'Private Git repository dalam AWS ecosystem',
            fungsi: 'Managed source control service — store, version, dan collaborate on code securely dalam AWS. Integrate terus dengan IAM untuk access control, dan native dengan CodePipeline/CodeBuild.',
            sebabApa: "CodeCommit wujud sebab dulu kalau nak private Git repo dalam AWS kau kena host GitHub Enterprise/GitLab sendiri atas EC2 — kena patch, scale, backup. CodeCommit hapuskan beban tu: managed Git repo yang access control terus guna IAM (tak payah user system asing) dan plug terus ke CodePipeline/CodeBuild. (Nota: AWS dah tutup CodeCommit untuk pelanggan baru, tapi konsep masih keluar exam.)",
            sifir: ["CodeCommit = managed private Git repo dalam AWS, access guna IAM (bukan user asing).", "Native integrate dengan CodePipeline/CodeBuild/CodeDeploy — push trigger pipeline.", "Encryption: data at rest auto-encrypt (KMS), in-transit HTTPS/SSH.", "Bukan untuk store artifact besar/binary — itu kerja S3."],
            perangkap: [{"soalan": "Team nak private Git source control dalam AWS dengan access control yang integrate terus dengan IAM users/roles. Service?", "jebakan": "Host GitHub Enterprise atas EC2 — boleh, tapi kau urus server sendiri (patch/scale).", "betul": "CodeCommit — keyword 'private Git + IAM access control + fully managed' = CodeCommit, no server to manage."}],
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
            sebabApa: "Suite ni wujud sebab buat deployment manual (copy code, run test, SSH masuk server, restart) itu lambat + senang silap + tak boleh ulang konsisten. 4 Code services automate seluruh aliran build→test→deploy supaya setiap code push terus jalan pipeline yang sama tiap kali — tiada manusia tersilap langkah, deploy laju & boleh ulang.",
            sifir: ["CodeCommit = store code. CodeBuild = compile + test. CodeDeploy = deploy. CodePipeline = orchestrate semua.", "CodePipeline = ORCHESTRATOR (otak) — detect push, sambung step ikut urutan.", "CodeDeploy boleh deploy ke EC2, Lambda, ECS, on-premises.", "CodeBuild serverless build — bayar per build minute, no build server to manage.", "CodeDeploy support blue/green & canary deployment (kurangkan risiko release)."],
            perangkap: [{"soalan": "Setiap code push mesti auto-build, run test, dan deploy ke production EC2 tanpa langkah manual. Service utama yang orchestrate?", "jebakan": "CodeBuild — sebab dia yang build & test, nampak macam pusat aliran.", "betul": "CodePipeline — keyword 'orchestrate / automate end-to-end on push' = CodePipeline (orchestrator). CodeBuild hanya satu stage (build/test) dalam pipeline tu."}],
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
            sebabApa: "CloudWatch wujud sebab kau tak boleh manage benda yang kau tak nampak — tanpa dia kau takkan tahu CPU EC2 dah 95%, Lambda error, atau bila perlu scale out. Dia kumpul metrics + logs di satu tempat dan boleh trigger action (alarm → SNS / Auto Scaling) bila threshold lepas, jadi masalah dikesan & dibetulkan automatik sebelum user sedar.",
            sifir: ["CloudWatch = METRICS + LOGS + ALARMS. CloudTrail = API audit. X-Ray = trace latency.", "EC2 CPU/network/disk I/O = default metric. MEMORY & disk SPACE = kena install CloudWatch agent.", "Unified CloudWatch Agent = metrics (incl memory) + logs + traces, Linux & Windows.", "Standard monitoring = 5 min (free). Detailed = 1 min ($0.015/instance/hr).", "Logs Insights = query logs dalam CloudWatch (SQL-like). Athena = query logs dalam S3.", "PRICING free tier: 10 metrics, 10 alarms, 5GB logs, 3 dashboards/bulan."],
            perangkap: [{"soalan": "Kau perlu monitor MEMORY utilization EC2 instance dan alert bila lebih 90%. Apa kena buat?", "jebakan": "Terus buat CloudWatch alarm atas memory metric — sebab CloudWatch memang monitor EC2.", "betul": "Install/configure (unified) CloudWatch agent DULU, baru boleh alarm. Keyword: memory & disk space BUKAN default metric — default cuma CPU/network/disk I/O."}, {"soalan": "Team nak query & analyze log Lambda secara interactive guna SQL-like query. Service?", "jebakan": "Amazon Athena — sebab Athena guna SQL untuk analyze logs, nampak betul.", "betul": "CloudWatch Logs Insights — keyword 'query CloudWatch Logs interactively' = Logs Insights. Athena = untuk log yang dah dalam S3, bukan dalam CloudWatch Logs."}],
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
              'PRICING: Free tier — 10 custom metrics, 10 alarms, 5 GB log ingestion, 3 dashboards/month. Detailed monitoring (1-min) = $0.015/instance/hr. Custom metrics = $0.30/1,000 metrics/mo. Alarms = $0.10/alarm/mo. Logs ingestion = $0.50/GB. Logs archival = $0.03/GB/mo. Dashboards (3 free, then $3/dashboard/mo).',
              'Exam: "free tier includes 10 alarms" → CloudWatch. "detailed monitoring cost" → $0.015/instance/hr on top of standard (free, 5-min).',
            ],
            keywords: ['metrics', 'logs', 'alarms', 'dashboards', 'CPU monitoring', 'custom metrics', 'Log Groups', 'VPC Flow Logs', 'CloudWatch agent', 'unified agent', 'memory utilization', 'detailed monitoring', 'Logs Insights', 'query logs', 'SQL-like', 'pricing', 'free tier', 'custom metrics cost', 'log ingestion cost'],
          },
          {
            shortName: 'X-Ray',
            fullName: 'AWS X-Ray',
            ingat: '"GPS untuk trace request melalui microservices"',
            gunaUntuk: 'Distributed tracing — debug latency and errors across microservices and serverless',
            fungsi: 'X-Ray trace setiap request dari masuk (API Gateway) hingga keluar (DynamoDB), nampak berapa lama setiap component ambil masa. Service map visual tunjuk bottleneck. Works dengan Lambda, EC2, ECS, API Gateway.',
            sebabApa: "X-Ray wujud sebab bila request lalu 10+ microservices (API Gateway → Lambda → DynamoDB → SQS...), kalau lambat atau gagal kau tak tahu komponen MANA yang punca — log berselerak tiap service. X-Ray jahit semua jadi satu trace end-to-end + service map visual, jadi kau nampak terus mana bottleneck/error tanpa teka.",
            sifir: ["X-Ray = distributed tracing / service map — WHY slow & WHERE fail.", "CloudWatch = metrics/alarms. CloudTrail = WHO call API. X-Ray = trace request path.", "Works dengan Lambda, EC2, ECS, API Gateway, SQS — end-to-end.", "X-Ray Insights = auto-detect anomaly (latency/error spike) + notify via SNS/EventBridge.", "Service map = peta visual tunjuk node mana paling lambat / paling banyak error."],
            perangkap: [{"soalan": "App microservices (API Gateway → Lambda → DynamoDB) jadi lambat tapi team tak tahu komponen mana punca latency. Service untuk identify bottleneck?", "jebakan": "CloudWatch — sebab dia kumpul metrics latency tiap service, nampak boleh diagnose.", "betul": "AWS X-Ray — keyword 'distributed tracing / mana bottleneck merentas microservices' = X-Ray service map. CloudWatch bagi angka per-service, tapi tak jahit jadi satu trace end-to-end."}, {"soalan": "Message kadang tak sampai destinasi dalam sistem SQS + Lambda + API Gateway. Nak debug aliran message. Service?", "jebakan": "CloudTrail — sebab nak audit apa jadi, nampak macam jejak aktiviti.", "betul": "X-Ray — keyword 'trace message path / mana message hilang dalam distributed system' = X-Ray. CloudTrail jejak API call, bukan aliran message dalam app."}],
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
            sebabApa: "Health Dashboard wujud sebab Service Health page yang public itu cakap pasal AWS keseluruhan — tak bagitahu sama ada RESOURCE KAU sendiri yang kena. Account-level Health Dashboard bagi pandangan peribadi: event/maintenance/retirement yang betul-betul affect resource dalam akaun kau, plus boleh auto-notify via EventBridge supaya team tahu awal (cth EC2 nak retire) bukan terkejut bila benda dah mati.",
            sifir: ["Service Health Dashboard = status AWS global (public). AWS Health Dashboard = personalized, akaun kau.", "Health = REACTIVE (event/maintenance/outage affect resource kau). Trusted Advisor = PROACTIVE (cadangan cost/security/perf).", "Route Health events ke EventBridge → Lambda/SNS untuk auto-alert (cth Slack notify).", "Full Health API access perlu Business/Enterprise Support plan."],
            perangkap: [{"soalan": "Ada isu di satu region — team nak tahu adakah resource SPESIFIK syarikat mereka yang terkesan, dan nak auto-notify Slack. Penyelesaian?", "jebakan": "Pantau Service Health Dashboard (status.aws) — sebab dia tunjuk isu region, nampak relevan.", "betul": "AWS Health Dashboard (account view) + EventBridge → Lambda → Slack. Keyword 'resource SAYA terkesan / personalized event' = account Health Dashboard, bukan public Service Health page."}],
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
            sebabApa: "Kad ni wujud sebab exam SAA-C03 suka uji 'pilih database betul ikut shape data + access pattern' — bukan satu DB untuk semua. AWS galak purpose-built: tiap engine optimize untuk satu corak data (relational, key-value, document, graph, wide-column, OLAP), jadi pilih salah = lambat/mahal. Kad ni map keyword soalan terus ke engine supaya kau tak teragak-agak.",
            sifir: ["Relational + transaksi OLTP → RDS (standard) / Aurora (HA hebat, auto-scale).", "Key-value, ms latency, serverless, spiky → DynamoDB. Microsecond atas DynamoDB → +DAX.", "MongoDB → DocumentDB. Cassandra → Keyspaces. Graph/relationship/fraud → Neptune.", "Analytics/warehouse/aggregate berjuta baris (OLAP) → Redshift. Time-series/IoT → Timestream.", "Cache depan SEBARANG DB → ElastiCache (Redis/Memcached).", "Trap: OLTP (checkout/transaksi) = RDS/Aurora; OLAP (laporan/dashboard) = Redshift."],
            perangkap: [{"soalan": "App perlu cari semua mutual friends & detect fraud ring dalam data berhubung-rapat (highly connected). Database?", "jebakan": "DynamoDB — sebab dia laju & scalable, ramai default pilih untuk apa-apa NoSQL.", "betul": "Neptune — keyword 'relationship / mutual friends / fraud ring / connected data' = graph = Neptune. DynamoDB key-value, teruk untuk traverse relationship."}, {"soalan": "Aplikasi e-commerce transaksi (checkout, tolak stok, simpan order) perlukan consistency kuat & SQL. Database?", "jebakan": "Redshift — sebab dia handle data besar & SQL, nampak macam boleh.", "betul": "RDS/Aurora — keyword 'transaksi / checkout / OLTP' = relational OLTP = RDS/Aurora. Redshift = OLAP/analytics (aggregate), teruk untuk single-row insert/update."}],
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
            sebabApa: "DocumentDB wujud sebab company yang dah guna MongoDB nak pindah ke AWS tapi tak nak urus MongoDB sendiri atas EC2 (patch, scale, backup, replica). DocumentDB managed + MongoDB-compatible, jadi app sedia ada (yang cakap MongoDB API) boleh sambung tanpa tulis semula — AWS yang handle storage auto-scale, backup, HA.",
            sifir: ["DocumentDB = managed document DB, MongoDB-compatible (API/driver sama).", "Keyword exam: 'migrate MongoDB' / 'JSON documents' / 'collections' → DocumentDB.", "Storage auto-scale hingga 64TB; data simpan sebagai JSON documents.", "BUKAN DynamoDB (key-value), BUKAN Neptune (graph)."],
            perangkap: [{"soalan": "Syarikat nak migrate aplikasi MongoDB sedia ada ke AWS fully managed tanpa ubah code aplikasi. Service?", "jebakan": "DynamoDB — sebab dia NoSQL managed AWS, nampak macam pengganti semula jadi.", "betul": "DocumentDB — keyword 'MongoDB-compatible / migrate MongoDB tanpa ubah code' = DocumentDB. DynamoDB key-value, API berbeza, app MongoDB kena tulis semula."}],
            scenario: '"Migrate MongoDB to AWS managed service" → DocumentDB. NOT Neptune (graph). NOT DynamoDB (key-value). DocumentDB = DOCUMENT/MONGODB. Keywords: JSON, semi-structured data, MongoDB compatible, collections.',
            keywords: ['MongoDB compatible', 'document store', 'JSON', 'collections', 'NoSQL', 'MongoDB migration'],
          },
          {
            shortName: 'Neptune',
            fullName: 'Amazon Neptune',
            ingat: '"Database untuk connections antara data — graph"',
            gunaUntuk: 'Social networks, fraud detection, knowledge graphs, recommendation engines',
            fungsi: 'Fully managed graph database. Optimized untuk traverse relationships dalam data. Support Gremlin (property graph) dan SPARQL (RDF). Highly connected datasets.',
            sebabApa: "Neptune wujud sebab data berhubung-rapat (siapa kawan siapa, transaksi mana bersambung) kalau simpan dalam SQL kena buat banyak JOIN bersarang yang jadi sangat lambat bila relationship dalam. Graph database optimize traverse relationship — query 'cari sambungan 5 lapisan dalam' jadi laju, jadi sesuai untuk social network, fraud detection, recommendation engine.",
            sifir: ["Neptune = managed graph DB — optimize traverse RELATIONSHIP.", "Keyword: social network / fraud detection / recommendation / knowledge graph / connected data.", "Support Gremlin (property graph) + SPARQL (RDF).", "BUKAN DynamoDB (key-value), BUKAN RDS (tabular JOIN lambat untuk deep relationship)."],
            perangkap: [{"soalan": "Platform perlu detect fraud ring dengan cari pattern dalam transaksi yang saling berhubung berlapis-lapis. Database?", "jebakan": "RDS — sebab relational boleh JOIN table transaksi, nampak boleh trace hubungan.", "betul": "Neptune — keyword 'fraud ring / relationship pattern / connected transactions' = graph = Neptune. RDS JOIN berlapis-lapis jadi terlalu lambat untuk deep relationship traversal."}],
            scenario: '"Social network: cari semua mutual friends antara dua users" → Neptune (graph query efficient). "Fraud detection: cari pattern dalam linked transactions" → Neptune. Bukan DynamoDB (key-value) atau RDS (relational tabular). Keywords: graph, relationships, connected data.',
            keywords: ['graph database', 'social network', 'fraud detection', 'Gremlin', 'SPARQL', 'relationships', 'knowledge graph'],
          },
          {
            shortName: 'Keyspaces',
            fullName: 'Amazon Keyspaces',
            ingat: '"Cassandra dalam AWS — wide column, IoT, time-series"',
            gunaUntuk: 'Migrate Apache Cassandra workloads, IoT telemetry, time-series data',
            fungsi: 'Fully managed Cassandra-compatible database. Guna CQL (Cassandra Query Language) yang sama. Serverless — auto-scale, pay per request. High write throughput.',
            sebabApa: "Keyspaces wujud sebab company yang guna Apache Cassandra nak masuk AWS tapi urus cluster Cassandra sendiri itu menyakitkan (node, replication, scaling, tuning). Keyspaces serverless + Cassandra-compatible (CQL sama), jadi app Cassandra sedia ada boleh sambung tanpa ubah query, AWS auto-scale ikut traffic dan kau bayar per request.",
            sifir: ["Keyspaces = managed serverless Cassandra-compatible DB, guna CQL.", "Keyword: 'migrate Cassandra' / CQL / wide-column / high write throughput / IoT telemetry.", "Serverless — auto-scale, pay-per-request (atau provisioned).", "Wide-column model (bukan key-value DynamoDB, bukan document DocumentDB)."],
            perangkap: [{"soalan": "Pasukan nak migrate Apache Cassandra workload ke AWS fully managed tanpa urus node/cluster, kekal guna CQL. Service?", "jebakan": "DynamoDB — sebab serverless NoSQL AWS, nampak macam pengganti Cassandra.", "betul": "Amazon Keyspaces — keyword 'Cassandra / CQL / wide-column' = Keyspaces. DynamoDB tak guna CQL & bukan wide-column, app Cassandra kena tulis semula."}],
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
            sebabApa: "Redshift wujud sebab database transaksi (RDS) lemah bila kau nak aggregate berbilion baris untuk laporan/BI — query SUM/GROUP BY atas data besar jadi sangat lambat sebab data simpan ikut row. Redshift simpan data COLUMNAR + compress + agih kerja ke banyak node (MPP), jadi analytics atas data warehouse berskala petabyte jadi laju — tanpa membebankan database OLTP production.",
            sifir: ["Redshift = data warehouse OLAP (columnar + compress + MPP). RDS/Aurora = OLTP.", "Cluster = 1 Leader Node (plan/agih) + banyak Compute Node (proses) → pecah jadi Slices (unit MPP).", "RA3 + Managed Storage = compute & storage berasingan, scale independent.", "Spectrum = query S3 TERUS tanpa load. Athena = serverless ad-hoc (no cluster).", "Concurrency Scaling = auto-tambah cluster bila ramai user serentak.", "Zero-ETL (Aurora→Redshift) = analytics near-real-time tanpa bina pipeline ETL."],
            perangkap: [{"soalan": "App transaksi e-commerce (banyak insert/update order satu-satu, low latency). Database paling sesuai?", "jebakan": "Redshift — sebab dia handle data besar & SQL kompleks, nampak powerful.", "betul": "RDS/Aurora — keyword 'transaksi / single-row insert/update / OLTP' = RDS/Aurora. Redshift columnar, teruk untuk write satu-satu baris (itu OLAP, bukan OLTP)."}, {"soalan": "Analyst jarang-jarang nak run SQL ad-hoc atas log dalam S3, tak nak urus apa-apa cluster. Service?", "jebakan": "Redshift — sebab dia 'analytics + SQL', nampak macam jawapan analytics default.", "betul": "Athena — keyword 'ad-hoc / jarang / no setup / no cluster / data dalam S3' = Athena (serverless). Redshift perlu provision cluster, overkill untuk query jarang-jarang."}],
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
            ingat: '"QuickSight = panel meter kereta: sensor (data) → meter cluster (SPICE) → pemandu nampak sekali pandang. Serverless BI, drag-drop, dia visualize."',
            gunaUntuk: 'Business intelligence dashboards, data visualization, ML-powered analytics',
            fungsi: 'Serverless BI service. Connect terus ke S3, RDS, Redshift, Athena, atau sumber lain. Bina dashboard & visualisasi tanpa server. SPICE = enjin in-memory yang cache data import → query dashboard laju & berulang tanpa pukul sumber tiap kali. ML Insights bagi anomaly detection, forecasting (seasonality/trend), dan auto-narratives — tiada infrastruktur ML berasingan. Edition Enterprise tambah row-level security, akses AD/SSO, dan embedded analytics.',
            sebabApa: "QuickSight wujud sebab nak tunjuk data sebagai dashboard/carta untuk boss & business user, kalau bina sendiri kau kena setup BI server, urus scaling, dan dashboard jadi lambat bila ramai user pukul database. QuickSight serverless BI + ada SPICE (in-memory cache) supaya dashboard laju tanpa pukul sumber tiap kali, plus ML Insights bagi forecast/anomaly tanpa perlu pasukan data science.",
            sifir: ["QuickSight = serverless BI — lapisan PALING HUJUNG (visualize). Athena=query, Glue=ETL, Redshift=store.", "SPICE = in-memory cache → dashboard laju, jimat sumber (data sefresh refresh terakhir).", "Direct Query = pukul sumber live → real-time tapi bebankan sumber.", "ML Insights (forecast + anomaly + auto-narrative) = Enterprise edition.", "Row/column-level security + AD/SSO + embedded + encryption-at-rest = Enterprise edition.", "Connect terus ke S3/Athena/Redshift/RDS — tak payah load ke warehouse dulu."],
            perangkap: [{"soalan": "Executive nak dashboard dari data IoT dalam S3 dengan usage forecasting, operasi minimal, tiada data warehouse. Penyelesaian?", "jebakan": "Load ke Redshift + bina custom ML model untuk forecast — nampak 'proper' untuk analytics + ML.", "betul": "QuickSight (connect S3 direct) + ML Insights forecasting. Keyword 'dashboard + forecast + minimal ops' = QuickSight, bukan Redshift + custom ML/SageMaker."}, {"soalan": "Setiap analyst regional hanya boleh nampak baris data region mereka dalam dashboard yang sama. Apa diperlukan?", "jebakan": "QuickSight Standard edition + buat dashboard berasingan tiap region — leceh & tak scale.", "betul": "QuickSight Enterprise + row-level security. Keyword 'restrict data per user / row-level' = Enterprise edition (Standard tiada RLS)."}],
            detailsLabel: 'QuickSight — komponen utama',
            storageDetails: 'Data sources → S3, Athena, Redshift, RDS/Aurora, sumber luar (databases, SaaS); QuickSight baca TERUS, tak payah ETL dulu\nSPICE → Super-fast Parallel In-memory Calculation Engine; cache data import dalam memori untuk dashboard laju & repeatable. Alternatif: Direct Query (pukul sumber live)\nAnalysis → kanvas tempat kau bina visual (carta, jadual, peta)\nDashboard → analysis yang dah di-publish, read-only, untuk dikongsi\nML Insights → anomaly detection, forecasting, auto-narrative (built-in, no ML setup)\nEdition → Standard (asas) vs Enterprise (row-level security, AD/SSO, encryption-at-rest, embedded, fine-grained access)',
            mermaid: {
              label: 'Analogi Panel Meter Kereta — apa QuickSight buat',
              source: `flowchart LR
  SENS["🛢️ Sensor enjin & tangki<br/>(raw data: S3 · Redshift ·<br/>Athena · RDS)"] --> SPICE["⚡ Meter cluster (SPICE)<br/>baca sekali, simpan dalam memori<br/>jarum gerak laju, tak pukul enjin tiap saat"]
  SPICE --> DASH["📊 Panel pemandu (Dashboard)<br/>speedometer, fuel, RPM<br/>boss nampak sekali pandang"]
  SPICE --> ML["🚨 Lampu amaran (ML Insights)<br/>anomaly + forecast<br/>'minyak nak habis dalam 50km'"]`,
              caption: 'QuickSight = panel meter kereta. Sensor enjin/tangki (raw data dalam S3/Redshift/Athena) hantar bacaan. SPICE = meter cluster yang baca sekali & simpan dalam memori supaya jarum bergerak laju tanpa pukul enjin tiap saat (in-memory cache, dashboard berulang laju). Panel pemandu (Dashboard) tunjuk semua sekali pandang untuk "boss"/executive. Lampu amaran (ML Insights) = anomaly detection + forecasting ("usage akan naik bulan depan"). INGAT exam: "dashboard + forecasting, minimal ops" → QuickSight, BUKAN Redshift + custom ML.',
            },
            compare: [
              {
                label: 'QuickSight vs alat analytics lain — siapa buat apa',
                headers: ['Servis', 'Peranan dalam pipeline', 'Trigger exam'],
                rows: [
                  ['QuickSight', 'VISUALIZE — dashboard, carta, BI', '"executive dashboard", "visualization", "forecast trend"'],
                  ['Athena', 'QUERY — SQL ad-hoc atas S3', '"ad-hoc SQL", "query S3 no setup"'],
                  ['Glue', 'TRANSFORM — ETL + Data Catalog', '"ETL serverless", "catalog data lake"'],
                  ['Redshift', 'STORE/ANALYZE — data warehouse OLAP', '"recurring complex analytics", "data warehouse"'],
                ],
                takeaway: 'Pipeline serverless klasik: S3 (store) → Glue (catalog/ETL) → Athena (query) → QuickSight (visualize). QuickSight = lapisan PALING HUJUNG (visual). Soalan sebut "dashboard / chart / visualize / report untuk boss" → QuickSight. Sebut "SQL" → Athena. Sebut "transform" → Glue.',
              },
              {
                label: 'SPICE vs Direct Query — dua cara QuickSight baca data',
                headers: ['Aspect', 'SPICE (import)', 'Direct Query'],
                rows: [
                  ['Di mana data', 'Cache dalam memori QuickSight', 'Kekal di sumber, pukul live'],
                  ['Kelajuan dashboard', '🟢 Laju, konsisten', 'Ikut kelajuan sumber'],
                  ['Data freshness', 'Sefresh refresh terakhir (jadual)', '🟢 Real-time, sentiasa terkini'],
                  ['Beban ke sumber', '🟢 Rendah (baca sekali)', 'Tinggi (tiap query pukul sumber)'],
                  ['Guna bila', 'Dashboard kerap dibuka, data tak perlu real-time', 'Data mesti terkini detik ini'],
                ],
                takeaway: 'SPICE = laju + jimat sumber tapi data sefresh refresh terakhir. Direct Query = sentiasa terkini tapi bergantung & bebankan sumber. Soalan "dashboard laju untuk ramai user" → SPICE. "Mesti real-time" → Direct Query.',
              },
              {
                label: 'QuickSight Standard vs Enterprise edition',
                headers: ['Ciri', 'Standard', 'Enterprise'],
                rows: [
                  ['Row-level / column-level security', '🔴 Tiada', '🟢 Ada'],
                  ['Akses AD / SSO (IAM Identity Center)', '🔴 Tiada', '🟢 Ada'],
                  ['Encryption at rest (SPICE)', '🔴 Tiada', '🟢 Ada'],
                  ['Embedded analytics dalam app', 'Terhad', '🟢 Penuh'],
                  ['ML Insights', '🔴 Tiada', '🟢 Ada'],
                ],
                takeaway: 'Soalan sebut "row-level security", "restrict data per user", "Active Directory", "embed dashboard", atau "ML Insights/forecast" → mesti Enterprise edition. Standard = BI asas sahaja.',
              },
            ],
            scenario: '"Executive dashboards dari IoT data dalam S3 dengan forecasting, no data warehouse" → QuickSight + S3 direct + ML Insights. "Dashboard laju untuk ramai user, data tak perlu real-time" → SPICE. "Setiap analyst nampak hanya baris data region dia" → QuickSight Enterprise + row-level security. QuickSight BUKAN untuk ad-hoc SQL (→ Athena), BUKAN untuk ETL (→ Glue). Keywords: dashboard, forecast, trend, BI, visualization.',
            tips: [
              'QuickSight connect TERUS ke S3/Athena/Redshift/RDS — tak payah load ke Redshift dulu untuk dashboard. Lapisan paling hujung dalam pipeline analytics.',
              'SPICE = in-memory cache → dashboard laju & berulang. Direct Query = pukul sumber live (real-time tapi bebankan sumber). "Dashboard laju ramai user" → SPICE.',
              'ML Insights = built-in forecasting + anomaly detection + auto-narrative. "Usage trends + forecasting, minimal ops" → QuickSight ML Insights (Enterprise), bukan SageMaker.',
              'Row-level security, Active Directory/SSO, encryption-at-rest, embedded analytics, ML Insights = SEMUA Enterprise edition. Soalan sebut mana-mana ni → Enterprise.',
              'Exam trap: "dashboards + forecasting, minimal ops" → QuickSight (bukan Redshift + custom ML). "Visualize" / "report untuk eksekutif" = QuickSight.',
            ],
            docs: [
              { label: 'What is Amazon QuickSight', url: 'https://docs.aws.amazon.com/quicksight/latest/user/welcome.html' },
              { label: 'Importing data into SPICE', url: 'https://docs.aws.amazon.com/quicksight/latest/user/spice.html' },
            ],
            keywords: ['QuickSight', 'BI', 'dashboard', 'forecasting', 'ML Insights', 'visualization', 'S3 direct', 'SPICE', 'Direct Query', 'row-level security', 'Enterprise edition', 'embedded analytics', 'anomaly detection', 'auto-narrative', 'IoT analytics', 'Active Directory'],
          },
          {
            shortName: 'Athena',
            fullName: 'Amazon Athena',
            ingat: '"SQL terus pada S3 — serverless, bayar per TB scan"',
            gunaUntuk: 'Ad-hoc SQL analysis of data in S3 without loading to a database',
            fungsi: 'Serverless interactive query service. Point ke S3, tulis SQL, dapat results. Bayar per TB data yang di-scan. Sokong CSV, JSON, Parquet, ORC. Pair dengan Glue Data Catalog sebagai metadata store.',
            sebabApa: "Athena wujud sebab kadang kau cuma nak run SQL sekali-sekala atas data dalam S3 (cth analyze CloudTrail/ALB logs) — tak berbaloi setup & bayar Redshift cluster 24/7 untuk query jarang-jarang. Athena serverless: point ke S3, tulis SQL, bayar HANYA per TB data di-scan, tiada cluster untuk urus atau idle cost.",
            sifir: ["Athena = serverless SQL atas S3, bayar per TB DI-SCAN (bukan per query, bukan per jam).", "Kurangkan kos: Parquet/ORC (columnar) + partition (date/region) + compress + SELECT kolum.", "Pair dengan Glue Data Catalog sebagai metadata/schema store.", "Pipeline serverless: S3 → Glue (catalog/ETL) → Athena (query) → QuickSight (visualize).", "Athena vs Spectrum: dua-dua query S3; Athena no cluster, Spectrum perlu Redshift cluster."],
            perangkap: [{"soalan": "Team nak analyze CloudTrail/ALB logs dalam S3 guna SQL, hanya sekali-sekala, tak nak urus infrastruktur. Service?", "jebakan": "Redshift — sebab 'SQL analytics' nampak macam kerja data warehouse.", "betul": "Athena — keyword 'ad-hoc / sekali-sekala / serverless / query S3 directly / no setup' = Athena. Redshift perlu cluster 24/7, overkill untuk query jarang."}, {"soalan": "Kos query Athena terlalu tinggi. Cara paling berkesan kurangkan kos?", "jebakan": "Tambah lebih banyak query nodes / upgrade — silap konsep, Athena serverless tiada node.", "betul": "Convert data ke Parquet/ORC (columnar) + partition + compress. Keyword: kos Athena = jumlah data DI-SCAN, jadi kurangkan byte yang di-scan."}],
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
            sebabApa: "Glue wujud sebab data lake berselerak (S3, RDS, Redshift) — tanpa katalog pusat, Athena/EMR/Redshift tak tahu schema apa wujud, dan transform data (CSV→Parquet) secara manual perlu jaga cluster Spark sendiri. Glue selesaikan dua-dua: Crawler auto-endus schema isi Data Catalog (satu sumber kebenaran), dan ETL Job serverless transform data tanpa cluster — jadi 'gam' yang sambung data lake.",
            sifir: ["Glue = serverless ETL + Data Catalog (metadata pusat untuk Athena/EMR/Redshift Spectrum).", "Crawler = auto-endus schema dari sumber → ISI Data Catalog (boleh jadual berkala).", "Data Catalog = metadata SAHAJA (apa data wujud); data sebenar kekal di S3/RDS.", "Glue = serverless (no cluster). EMR = managed cluster, full control Spark/Hadoop.", "Lake Formation = kawalan akses (siapa) atas Glue Data Catalog (apa).", "Bayar per DPU-hour; ETL Job = serverless Spark (auto-generate code)."],
            perangkap: [{"soalan": "Perlu auto-determine schema dari data dalam S3/DynamoDB dan populate Glue Data Catalog. Komponen Glue mana?", "jebakan": "Glue Classifier — sebab dia kenal pasti format data, nampak macam dia yang tentukan schema.", "betul": "Glue Crawler — keyword 'discover schema + populate Data Catalog' = Crawler (orchestrator). Classifier cuma BANTU Crawler kenal format custom; Crawler yang panggil Classifier & isi catalog."}, {"soalan": "Pasukan nak transform raw CSV dalam S3 ke Parquet dengan kawalan PENUH atas Spark cluster & framework. Service?", "jebakan": "AWS Glue — sebab dia memang ETL Spark, nampak terus padan.", "betul": "EMR — keyword 'full control over Spark/cluster / pilih framework' = EMR. Glue serverless, Spark config diabstrak (kawalan terhad). Kalau soalan kata 'serverless ETL, no cluster' baru Glue."}],
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
                label: 'Glue terminology — Data Store vs Data Source vs Data Target vs Catalog vs Table (jangan keliru)',
                headers: ['Istilah', 'Maksud', 'Trigger exam'],
                rows: [
                  ['Data Store', 'Repository tempat data SEBENAR duduk (S3 bucket, RDS, DB). Ini yang Crawler CRAWL', '"repository for persistently storing the data", "data store yang di-crawl"'],
                  ['Data Source', 'Data Store dalam peranan INPUT kepada job/transform', '"data store used as input to a transform" → Data Source'],
                  ['Data Target', 'Data Store dalam peranan OUTPUT — tempat job TULIS hasil', '"a process/transform writes to" → Data Target'],
                  ['Data Catalog', 'Persistent metadata store (1 per account/region) — simpan SEMUA metadata dari data store yang di-crawl', '"persistent metadata store", "central metadata store"'],
                  ['Table', 'Metadata definition yang wakili data: nama column, jenis data, partition. Schema SAHAJA', '"metadata definition representing the data" → Table'],
                ],
                takeaway: 'Data Store = tempat data betul-betul duduk (yang di-CRAWL). Data Source/Target = Data Store yang SAMA, cuma beza peranan (input vs output). Data Catalog = kedai metadata pusat. Table = definisi schema dalam Catalog. PENTING: Table & Database simpan metadata SAHAJA — data sebenar kekal dalam data store asal. Ini trap terminology Glue yang exam suka uji.',
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
              'Terminology trap: Data Store = repository simpan data (yang di-CRAWL). Data Source = Data Store sebagai INPUT job. Data Target = Data Store yang job TULIS hasil. Sama benda, beza peranan',
              'Glue Table = metadata definition (column, jenis data, partition) dalam Data Catalog. PENTING: Table & Database simpan metadata SAHAJA — data sebenar kekal dalam data store asal (S3/RDS). Table ≠ data',
            ],
            docs: [
              { label: 'AWS Glue components', url: 'https://docs.aws.amazon.com/glue/latest/dg/components-key-concepts.html' },
              { label: 'Glue Crawlers', url: 'https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html' },
            ],
            keywords: ['ETL', 'data catalog', 'Spark', 'serverless', 'crawler', 'classifier', 'ETL job', 'DataBrew', 'Glue Studio', 'workflow', 'data lake', 'transform', 'Parquet', 'schema discovery', 'DynamoDB', 'schema inference', 'DPU', 'data store', 'data source', 'data target', 'Glue table', 'metadata definition', 'database'],
          },
          {
            shortName: 'Lake Formation',
            fullName: 'AWS Lake Formation',
            ingat: '"Lapisan keselamatan atas S3/Glue — row, column, cell level access"',
            gunaUntuk: 'Fine-grained access control on data lake: row-level, column-level, cell-level security',
            fungsi: 'Lake Formation duduk atas S3 + Glue Data Catalog dan enforce fine-grained permissions. Glue Data Catalog je hanya ada table/column metadata — Lake Formation enforce ACTUAL access control hingga row, column, dan cell level.',
            sebabApa: "Lake Formation wujud sebab Glue Data Catalog cuma simpan metadata (table/column wujud) — dia TAK boleh kawal siapa boleh baca baris/kolum mana. Dalam data lake dengan data sensitif, kau perlu fine-grained access (analyst region A nampak baris region A je, kolum gaji disembunyi). Lake Formation duduk atas S3+Glue dan enforce akses hingga row/column/cell level dari satu tempat.",
            sifir: ["Glue Data Catalog = metadata (apa data wujud). Lake Formation = ACCESS CONTROL (siapa boleh akses).", "Lake Formation = row-level + column-level + cell-level security (Glue sahaja tak boleh).", "Keyword: 'fine-grained access' / 'row/column/cell-level security' untuk data lake → Lake Formation.", "One-stop data lake governance: permission, secure sharing, cleansing, catalog."],
            perangkap: [{"soalan": "Data lake dalam S3 perlu analyst hanya boleh baca kolum tertentu & baris tertentu (sembunyi data sensitif). Penyelesaian?", "jebakan": "Glue Data Catalog + IAM policy atas bucket S3 — nampak boleh kawal akses.", "betul": "Lake Formation — keyword 'row/column/cell-level fine-grained access untuk data lake' = Lake Formation. Glue Catalog metadata sahaja; IAM S3 cuma object-level, bukan row/column dalam table."}],
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
            sebabApa: "EMR wujud sebab proses data berskala petabyte (log, ML, transform berat) guna satu EC2 mustahil — kau perlu cluster Spark/Hadoop, tapi setup & urus cluster Hadoop sendiri (provision, config, scale, patch) itu sangat susah. EMR managed-kan cluster big-data tu: kau pilih saiz/framework, AWS handle setup, dan boleh guna Spot + transient cluster (mati lepas job, data kekal di S3) untuk jimat besar.",
            sifir: ["EMR = managed cluster big-data (Spark/Hadoop/Hive/Presto/HBase) — kau urus cluster (BUKAN serverless).", "3 node: Master (urus), Core (task + HDFS data), Task (task sahaja).", "Spot: Task = selamat (no data). Core = berisiko (pegang HDFS). Master = jangan Spot langsung.", "EMRFS = guna S3 sebagai storage → transient cluster (mati lepas job, data kekal di S3).", "EMR vs Glue: EMR = full control framework. Glue = serverless ETL, no cluster.", "EMR vs Redshift: EMR = kod (Spark/Python) atas data mentah. Redshift = SQL atas data kemas (OLAP)."],
            perangkap: [{"soalan": "Untuk jimat kos batch big-data yang fault-tolerant atas EMR, node mana paling sesuai letak atas Spot Instances?", "jebakan": "Core nodes atas Spot — sebab core paling ramai, jimat paling banyak kalau Spot.", "betul": "Task nodes atas Spot. Keyword: Core pegang HDFS data (hilang node = hilang data, berisiko); Task compute-only → selamat & jimat atas Spot. Master tak boleh Spot."}, {"soalan": "Migrate on-prem Hadoop/Spark cluster ke AWS dengan kawalan penuh atas framework & versi. Service?", "jebakan": "AWS Glue — sebab dia ETL Spark serverless, nampak macam pengganti.", "betul": "EMR — keyword 'Hadoop/Spark cluster / full control / migrate existing cluster' = EMR. Glue serverless & Spark diabstrak (kawalan terhad), bukan untuk migrate cluster sedia ada dengan kawalan penuh."}],
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
            mermaid: [
              {
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
              {
                label: 'HDFS dalaman — NameNode vs DataNode (Stor Ikan kilang)',
                source: `flowchart TD
  FILE["📂 Fail 100 TB<br/>(1 hard disk tak muat)"] --> SPLIT["✂️ Pecah jadi Blocks<br/>~128MB sepotong"]
  SPLIT --> NN["🗂️ NameNode (Master)<br/>Kerani Kaunter — pegang BUKU REKOD (metadata):<br/>blok mana di node mana. TAK simpan data sebenar"]
  NN -->|"arah simpan"| DN1["💾 DataNode 1 (Core)<br/>Bilik Stor — simpan blok sebenar"]
  NN -->|"arah simpan"| DN2["💾 DataNode 2 (Core)<br/>Bilik Stor — simpan blok sebenar"]
  NN -->|"arah simpan"| DN3["💾 DataNode 3 (Core)<br/>Bilik Stor — simpan blok sebenar"]
  DN1 -.->|"replication ×3"| DN2
  DN2 -.->|"salinan pendua"| DN3`,
                caption: 'HDFS = "hard disk maya" merentas banyak komputer. Fail gergasi dipecah jadi Blocks (~128MB). NameNode (otak, atas Master) cuma pegang BUKU REKOD (metadata) — blok mana di node mana, dia TAK simpan data sebenar. DataNodes (atas Core nodes) yang betul-betul simpan blok. Tiap blok disalin ×3 ke node berbeza → satu node terbakar pun data selamat (fault tolerance). INGAT exam: Core node = pegang HDFS → JANGAN Spot. Dalam AWS, ramai tukar HDFS → S3 (via EMRFS): serverless, murah, tak payah jaga DataNode.',
              },
            ],
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
                label: 'Redshift vs EMR — gaya analisis (SQL vs Kod)',
                headers: ['Ciri', 'Amazon Redshift', 'Amazon EMR'],
                rows: [
                  ['Kategori', 'Data Warehouse (OLAP)', 'Big-data framework (Hadoop/Spark)'],
                  ['Jenis data', 'Berstruktur — table, columnar', 'Bebas — log, teks, video, unstructured'],
                  ['Bahasa', 'SQL sahaja (SELECT, JOIN, SUM)', 'Kod (Python, Scala, Spark, Hive)'],
                  ['Infra', 'Managed cluster / Serverless', 'EC2 cluster (Master/Core/Task)'],
                  ['Analogi', '📚 Perpustakaan tersusun — rujuk katalog, terus dapat', '🏭 Kilang kitar semula — ramai pekerja proses sampah mentah'],
                  ['Guna bila', 'Laporan BI / dashboard atas data dah kemas', 'Bersih & proses data gergasi mentah, Data Science/ML'],
                ],
                takeaway: 'Mereka TAK bergantung antara satu sama lain — dua enjin berbeza untuk gaya kerja berbeza. Data dah kemas + nak SQL → Redshift. Data mentah berterabur + perlu kod Spark/Hadoop → EMR. Boleh kolaborasi dalam satu pipeline (lihat tip), tapi EMR BUKAN buat analisis "di dalam" Redshift — itu salah faham biasa.',
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
              'Pipeline sebenar (EMR + Redshift KOLABORASI, bukan bergantung): S3 (log mentah) → EMR/Spark bersih & transform (ETL) → load ke Redshift → analyst query SQL + QuickSight dashboard. EMR = pembersih data mentah; Redshift = warehouse untuk analisis akhir. Jangan fikir "EMR analyze dalam Redshift".',
              'HDFS dalaman: NameNode (Master) = pegang metadata/buku rekod (blok mana di node mana, TAK simpan data). DataNode (Core) = simpan blok sebenar. Block ~128MB, replication ×3 → fault tolerant. Sebab tu Core node bahaya atas Spot.',
            ],
            docs: [
              { label: 'EMR cluster node types', url: 'https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-master-core-task-nodes.html' },
              { label: 'EMRFS', url: 'https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-fs.html' },
            ],
            keywords: ['Hadoop', 'Spark', 'Hive', 'Presto', 'HBase', 'big data', 'cluster', 'petabyte', 'managed', 'Spot instances', 'master node', 'core node', 'task node', 'HDFS', 'NameNode', 'DataNode', 'block', 'replication', 'EMRFS', 'ETL pipeline', 'transient cluster', 'EMR Serverless', 'EMR on EKS'],
          },
          {
            shortName: 'OpenSearch',
            fullName: 'Amazon OpenSearch Service',
            ingat: '"Enjin carian dan log analytics — Elasticsearch dalam AWS"',
            gunaUntuk: 'Full-text search, real-time log/event analytics, dashboard visualisation',
            fungsi: 'Managed OpenSearch (Elasticsearch fork) cluster. Ingestion via Amazon Data Firehose, OpenSearch Ingestion, atau Lambda. Visualise dengan OpenSearch Dashboards (Kibana). Guna untuk search yang perlu relevance ranking, fuzzy matching, atau aggregations real-time. Storage tiers (hot / UltraWarm / cold) untuk imbang kos vs kelajuan.',
            sebabApa: "Wujud sebab database biasa (RDS, DynamoDB) teruk untuk full-text search — nak cari 'kasut merah saiz 9' dengan typo + ranking + relevance, RDS LIKE '%...%' lembap dan tak boleh rank. OpenSearch index data jadi inverted index supaya search jadi laju + fuzzy + boleh aggregate log real-time, tanpa kau urus Elasticsearch cluster sendiri (AWS handle broker, patching, scaling).",
            sifir: ["OpenSearch = full-text/fuzzy SEARCH + log analytics, BUKAN exact key lookup (itu DynamoDB)", "Storage tiers: Hot (laju+mahal) > UltraWarm (S3-backed, baca lambat sikit) > Cold (arkib termurah)", "Firehose = jawapan default untuk 'stream logs ke OpenSearch tanpa code'", "3 dedicated master nodes = quorum untuk stabilkan cluster besar", "OpenSearch Dashboards = fork Kibana (soalan lama sebut 'Kibana')", "Natural-language document search = Kendra, BUKAN OpenSearch"],
            perangkap: [{"soalan": "App perlu kekalkan 2 tahun log untuk audit tapi log lama jarang dibaca — nak kurangkan kos OpenSearch. Apa pilihan?", "jebakan": "Terus delete log lama / pindah ke Glacier — nampak murah, tapi soalan kata log MASIH perlu boleh disearch untuk audit, jadi delete/Glacier hilang kebolehan query.", "betul": "Pindah ke UltraWarm (atau Cold) tier — masih dalam OpenSearch, boleh search, tapi S3-backed jadi jauh lebih murah dari Hot. Keyword: 'kekal log lama + kos rendah + masih searchable'."}, {"soalan": "Syarikat nak natural-language search atas dokumen korporat (PDF, wiki, FAQ) — pekerja tanya soalan biasa dan dapat jawapan tepat. Pilih apa?", "jebakan": "OpenSearch — nampak macam 'search engine' jadi orang pilih, tapi OpenSearch keyword/full-text, bukan faham intent/konteks soalan.", "betul": "Amazon Kendra — ML semantic search yang faham natural-language query + jawab terus dari FAQ. Keyword: 'natural language', 'understand intent', 'enterprise document'."}],
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
            sebabApa: "Wujud sebab pasukan yang dah ada Apache Kafka (on-prem atau guna Kafka API) tak nak rewrite code mereka ke Kinesis, tapi pening urus broker, ZooKeeper, patching, dan HA sendiri. MSK ambil alih kerja operasi Kafka — kau guna Producer/Consumer API yang SAMA, AWS yang jaga infra.",
            sifir: ["MSK = managed Apache Kafka; Kinesis = AWS-native proprietary (no Kafka API)", "Pilih MSK bila ada Kafka expertise / nak migrate existing Kafka; pilih Kinesis kalau nak simpler", "TIADA SSH / direct access ke broker — AWS manage infra", "Lambda + MSK perlu Event Source Mapping (ESM), tak auto-trigger", "MSK Serverless = auto-scale compute + storage, no broker capacity management", "MSK = AWS-only, BUKAN multi-cloud"],
            perangkap: [{"soalan": "Syarikat nak migrate on-prem Apache Kafka cluster ke AWS dengan minimum code change. Servis mana?", "jebakan": "Amazon Kinesis Data Streams — nampak macam 'streaming jadi pilih', tapi Kinesis bukan Kafka-compatible, jadi kena rewrite producer/consumer code = bukan minimum change.", "betul": "Amazon MSK — Kafka API compatible, code Kafka sedia ada jalan terus. Keyword: 'migrate Kafka', 'Kafka API', 'minimum code change'."}, {"soalan": "Lambda function tak trigger walaupun ada message masuk topic MSK. Kenapa?", "jebakan": "Ingat Lambda auto-poll MSK macam SNS/SQS — sebab tu orang tak setup apa-apa, sangka ia automatik.", "betul": "Kena configure Event Source Mapping (ESM) — Lambda TAK auto pick up MSK events. Keyword: 'event source mapping', 'Lambda MSK trigger'."}],
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
            sebabApa: "Wujud sebab keyword search (OpenSearch) tak faham SOALAN — kalau pekerja tanya 'berapa hari cuti tahunan saya?', keyword search cuma match perkataan, bukan beri jawapan. Kendra guna ML untuk faham intent + konteks dan pulangkan jawapan tepat dari dokumen unstructured (PDF, wiki, email) merentas pelbagai repositori, hilangkan kerja bina enjin NLP sendiri.",
            sifir: ["Kendra = ML semantic 'find the answer' search; OpenSearch = scalable keyword/full-text", "Faham natural-language query + intent, bukan sekadar match keyword", "Index unstructured: PDF, Word, PowerPoint, HTML, email, wiki", "Native handle FAQ → boleh bagi jawapan terus question-answer", "Connector ke S3, SharePoint, Confluence, database", "'enterprise document search + natural language' = Kendra"],
            perangkap: [{"soalan": "E-commerce nak product search berskala besar dengan spell-check, synonym, dan ranking untuk jutaan query/hari. Pilih apa?", "jebakan": "Kendra — nampak macam 'intelligent search jadi mesti Kendra', tapi Kendra mahal + dioptimumkan untuk 'find the answer' enterprise docs, bukan high-volume keyword product search.", "betul": "OpenSearch — scalable keyword/full-text search dengan fuzzy + relevance ranking untuk volume tinggi. Keyword: 'product search', 'high-volume', 'spell-check/synonym'."}],
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
            sebabApa: "Wujud sebab dapatkan data pihak ketiga (market data, cuaca, regulatory filing) selalunya leceh — kena urus kontrak lesen, cara delivery, dan update berkala secara manual. Data Exchange jadi marketplace: kau subscribe, data terus masuk S3 account kau, dan AWS handle licensing + subscription automatik.",
            sifir: ["Data Exchange = marketplace beli/subscribe data PIHAK KETIGA (external)", "Data dihantar terus ke S3 bucket kau", "AWS handle licensing + subscription management automatik", "Kinesis = data REAL-TIME kau sendiri; Data Exchange = data luar orang lain jual", "Contoh data: market/financial data, regulatory filing, cuaca, ekonomi"],
            perangkap: [{"soalan": "Firma analitik nak subscribe market data + economic indicator dari penyedia luar dan masukkan ke AWS untuk analisis. Servis mana?", "jebakan": "Amazon Kinesis / S3 + custom ingest — orang ingat kena bina pipeline ingest sendiri, tapi itu untuk data KAU sendiri, bukan beli data pihak ketiga berlesen.", "betul": "AWS Data Exchange — marketplace third-party data, delivery terus ke S3, licensing diuruskan. Keyword: 'third-party data', 'subscribe dataset', 'data products'."}],
            scenario: '"Company wants to subscribe to market data, economic indicators, and regulatory filings from third-party providers and deliver them to their AWS accounts for analytics" → AWS Data Exchange. Kinesis = your own real-time data. Data Exchange = external third-party data products.',
            keywords: ['Data Exchange', 'third-party data', 'data marketplace', 'data subscription', 'market data', 'financial data', 'data products', 'S3 delivery', 'licensing'],
          },
          {
            shortName: 'AWS AI/ML Services',
            fullName: 'AWS AI Services — Polly, Rekognition, Lex, Comprehend, Textract, Transcribe, Translate',
            ingat: '"Polly = cakap. Transcribe = dengar. Lex = faham + balas. Rekognition = nampak. Comprehend = baca. Textract = scan dokumen. Translate = tukar bahasa"',
            gunaUntuk: 'AI/ML services untuk audio, video, text, image analysis without training models',
            fungsi: 'AWS menyediakan pelbagai AI services ready-to-use: speech, vision, NLP, document processing.',
            sebabApa: "Wujud sebab kebanyakan syarikat tak ada data scientist atau data untuk latih model ML sendiri, tapi masih nak guna AI (transkrip suara, detect muka, analisa sentiment). AWS dah pre-train model ni dan expose sebagai API ready-to-use — kau call API terus, no training, no infra ML.",
            sifir: ["Pre-built API (Polly/Transcribe/Translate/Comprehend/Lex/Rekognition/Textract) = NO training, call terus", "Polly = Text→Speech; Transcribe = Speech→Text (jangan terbalik)", "Comprehend = NLP sentiment/entity; Translate = tukar bahasa", "Lex = chatbot (NLU+ASR, powers Alexa); Rekognition = image/video labels+faces", "Textract = OCR borang/jadual/invois dari PDF/imej", "CCTV real-time = Rekognition + Kinesis VIDEO Streams", "Latih model sendiri = SageMaker (bukan servis pre-built ni)"],
            perangkap: [{"soalan": "App perlu extract data berstruktur (nama, jumlah, tarikh) dari ribuan invois scan PDF. Servis mana?", "jebakan": "Amazon Rekognition — orang ingat 'analisa imej jadi Rekognition', tapi Rekognition untuk muka/objek/scene, bukan baca teks/borang/jadual dari dokumen.", "betul": "Amazon Textract — OCR khas untuk extract teks, forms, tables dari dokumen. Keyword: 'OCR', 'scanned PDF', 'forms/tables', 'invoice'."}, {"soalan": "Bina pipeline: terima audio meeting bahasa Jepun → simpan transkrip Inggeris → analisa sentiment. Servis mana ikut turutan?", "jebakan": "Guna satu servis je macam Comprehend untuk semua — Comprehend NLP sahaja, tak boleh transkrip audio atau translate.", "betul": "Transcribe (audio→teks) → Translate (JP→EN) → Comprehend (sentiment). Setiap langkah satu pre-built API. Keyword: 'transcribe + translate + sentiment pipeline'."}],
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
            scenario: '"Baca soalan kuiz dengan suara" → Polly. "Transkrip meeting jadi nota" → Transcribe. "Chatbot customer service / Alexa" → Lex. "Detect muka dalam CCTV real-time" → Rekognition + Kinesis Video Streams. "Extract data dari invois/borang scan" → Textract. "Analisa sentiment review pelanggan" → Comprehend. "Translate app ke banyak bahasa" → Translate. "Latih model ramalan sendiri" → SageMaker.',
            mermaid: {
              label: 'Pilih AI service — input apa → output apa (decision tree)',
              source: `flowchart TD
  Q["Input apa &rarr; nak output apa?"] --> AUDIO{"Audio / suara?"}
  AUDIO -->|"Text &rarr; suara"| POLLY["🔊 Polly<br/>(text-to-speech)"]
  AUDIO -->|"Suara &rarr; text"| TRANS["📝 Transcribe<br/>(speech-to-text)"]
  Q --> IMG{"Gambar / video?"}
  IMG -->|"Muka, objek, moderation"| REKOG["👁️ Rekognition<br/>(+ Kinesis Video utk real-time)"]
  Q --> TEXT{"Text / dokumen?"}
  TEXT -->|"Tukar bahasa"| TL["🌐 Translate"]
  TEXT -->|"Sentiment, entiti, NLP"| COMP["🧠 Comprehend<br/>(Medical utk klinikal)"]
  TEXT -->|"Scan dokumen &rarr; data (OCR)"| TX["📄 Textract"]
  Q --> CHAT{"Chatbot / dialog?"}
  CHAT -->|"Intent + conversation"| LEX["💬 Lex<br/>(powers Alexa)"]
  Q --> CUSTOM{"Nak latih model sendiri?"}
  CUSTOM -->|"Ya"| SM["⚙️ SageMaker"]`,
              caption: 'Pre-built API (no training) untuk audio/imej/text/chatbot; nak model custom → SageMaker. Pipeline klasik multilingual: Transcribe → Translate → Comprehend → Polly. INGAT exam: padankan input→output dengan keyword soalan.',
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
              'Comprehend Medical = versi khusus perubatan — extract medical entities (penyakit, ubat, dosage, PHI) dari clinical text (nota doktor, rekod pesakit), HIPAA-eligible. Soalan sebut "medical records / clinical notes / extract PHI" → Comprehend Medical, bukan Comprehend biasa.',
              'Textract = EXTRACT structured data from scanned documents. Key-value pairs from forms, data from tables, dates and amounts from invoices/contracts. Goes beyond basic OCR.',
              'Lex = CONVERSATIONAL chatbot with multi-turn dialogue, intent recognition, slot filling. Powers Amazon Alexa. Manages conversation state.',
              'Enterprise search across PDFs/Word/email with natural language? → Amazon Kendra (see Kendra card). Product search with spell-check/synonyms? → OpenSearch.',
              'Translate = neural machine translation (text → text, different language). NOT speech (combine with Transcribe/Polly for audio) dan NOT sentiment analysis (use Comprehend)',
              '"Multilingual chatbot/support ticket pipeline": Transcribe (speech→text) → Translate (translate text) → Comprehend (analyze sentiment) → Polly (text→speech in target language)',
            ],
            docs: [
              { label: 'Amazon Polly — text to speech', url: 'https://docs.aws.amazon.com/polly/latest/dg/what-is.html' },
              { label: 'Amazon Comprehend (& Comprehend Medical)', url: 'https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html' },
              { label: 'Amazon Rekognition', url: 'https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html' },
              { label: 'Amazon Lex V2', url: 'https://docs.aws.amazon.com/lexv2/latest/dg/what-is.html' },
            ],
            keywords: ['Polly', 'Transcribe', 'Lex', 'Rekognition', 'Comprehend', 'Comprehend Medical', 'Textract', 'Translate', 'Kinesis Video Streams', 'text-to-speech', 'speech-to-text', 'chatbot', 'image analysis', 'StartSpeechSynthesisTask', 'audiobook', 'OCR', 'NLP', 'sentiment analysis', 'entity recognition', 'document extraction', 'machine translation', 'PHI', 'HIPAA'],
          },
          {
            shortName: 'SageMaker',
            fullName: 'Amazon SageMaker',
            ingat: '"Custom ML end-to-end — train, tune, deploy your own models"',
            gunaUntuk: 'Build, train, and deploy custom ML models with full control',
            fungsi: 'End-to-end managed ML platform: data prep (Data Wrangler, Feature Store), training (built-in algorithms, custom code in any framework), AutoML (Autopilot), HPO, model registry, and deployment (real-time, serverless, batch, async endpoints). Supports CI/CD via SageMaker Pipelines.',
            sebabApa: "Wujud sebab bila masalah kau UNIK (ramal churn ikut data syarikat sendiri), servis AI pre-built (Rekognition, Comprehend) tak cukup — kau perlu latih model atas data sendiri. Tapi setup infra ML penuh (data prep, training cluster, tuning, deploy endpoint, MLOps) sangat leceh. SageMaker bungkus semua langkah end-to-end jadi platform managed.",
            sifir: ["SageMaker = latih/deploy MODEL CUSTOM sendiri (data kau, algorithm kau)", "Pre-built AI (Rekognition/Polly/Lex/Comprehend) = no training, call API je", "Autopilot = AutoML: auto cuba algorithm + hyperparameter, pilih terbaik", "Deploy options: real-time, serverless, batch, async endpoint", "'train custom model on company data' → SageMaker; 'detect faces' → Rekognition", "Pipelines = CI/CD untuk ML (MLOps)"],
            perangkap: [{"soalan": "Pasukan nak bina model ramalan churn guna kod Python custom, tune hyperparameter, dan deploy ke real-time endpoint. Servis mana?", "jebakan": "Amazon Comprehend / servis AI pre-built — nampak 'AI/ML jadi pilih AI service', tapi pre-built tak boleh latih model custom atas data kau atau tune hyperparameter.", "betul": "Amazon SageMaker — platform ML end-to-end untuk train custom + tune + deploy. Keyword: 'custom model', 'train your own', 'hyperparameter tuning'."}],
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
            sebabApa: "Wujud sebab kadang kau memang TAK tahu berapa lama atau berapa banyak compute kau perlu (startup baru, dev/test, beban spiky) — commit 1-3 tahun (RI/SP) jadi membazir kalau beban berubah. On-Demand bagi kau guna-bayar-ikut-jam tanpa komitmen, hilang risiko terlock pada kapasiti yang kau tak guna.",
            sifir: ["On-Demand = no commitment, paling fleksibel, paling MAHAL per jam", "Billing per-second (Linux, min 60s); per-hour (Windows)", "Guna bila: spiky / unknown / short-term / dev-test", "Steady 24/7 → RI/Savings Plans (bukan On-Demand)", "Fault-tolerant batch + termurah → Spot (bukan On-Demand)"],
            perangkap: [{"soalan": "Startup baru launch app, tak pasti traffic, nak elak terlock komitmen. Pricing model mana mula-mula?", "jebakan": "Reserved Instances 1-tahun untuk 'jimat' — nampak murah, tapi kalau traffic tak menentu / instance type berubah, RI jadi membazir sebab dah commit.", "betul": "On-Demand dulu sampai pattern stabil, baru tukar ke RI/Savings Plans. Keyword: 'unpredictable', 'short-term', 'no commitment', 'startup baru'."}],
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
            sebabApa: "Wujud sebab beban yang jalan 24/7 sepanjang tahun (cth database production) bayar harga penuh On-Demand = membazir. RI bagi kau commit 1-3 tahun pada config tertentu tukar diskaun sampai 72%, dan Zonal RI lagi bagi jaminan kapasiti dalam AZ supaya kau tak gagal launch instance bila region sibuk.",
            sifir: ["RI = commit 1/3 tahun pada instance config → diskaun sampai 72%", "Standard RI = diskaun max tapi TAK boleh tukar family (boleh modify saiz/AZ dalam family)", "Convertible RI = boleh EXCHANGE family/OS/tenancy, diskaun kurang (sampai 66%)", "Regional RI = fleksibel AZ tapi NO capacity reservation; Zonal RI = lock 1 AZ + capacity reservation", "Payment: All Upfront > Partial > No Upfront (ikut diskaun)", "Billing apply order: RI dulu, baru Savings Plans", "'flexibility' tanpa exchange manual → Savings Plans, bukan RI"],
            perangkap: [{"soalan": "Database 24/7 sepanjang tahun, instance type takkan berubah, nak diskaun MAKSIMUM. Pilih apa?", "jebakan": "Convertible RI — nampak 'lagi bagus sebab fleksibel', tapi Convertible diskaun KURANG; kalau config memang takkan berubah, fleksibiliti tu tak berguna dan kau rugi diskaun.", "betul": "Standard RI (3-tahun All Upfront) — diskaun paling besar (~72%) bila config tetap. Keyword: 'config takkan berubah', 'diskaun maksimum', '24/7'."}, {"soalan": "Perlu JAMINAN kapasiti EC2 dalam satu AZ tertentu untuk DR. RI jenis mana?", "jebakan": "Regional RI — orang sangka semua RI reserve capacity, tapi Regional RI TIDAK bagi capacity reservation (cuma billing discount fleksibel merentas AZ).", "betul": "Zonal RI — lock satu AZ DAN dapat capacity reservation. Keyword: 'capacity reservation', 'specific AZ', 'guaranteed capacity'."}],
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
            sebabApa: "Wujud sebab AWS ada kapasiti EC2 LEBIHAN yang terbiar — daripada idle, AWS jual murah (sampai 90% off). Tukarannya AWS boleh ambil balik bila perlu (notis 2 minit). Ini buang kos besar untuk beban yang fault-tolerant / boleh resume — kau bayar harga rendah sebab kau sanggup terima risiko interrupt.",
            sifir: ["Spot = sampai 90% murah, no commitment, TAPI boleh di-interrupt (notis 2 MINIT)", "Notis 2 minit datang via EventBridge event DAN instance metadata (poll ~5 saat)", "Interruption behavior: terminate (default), stop (perlu persistent/maintain), hibernate (tiada 2-min awal)", "Capacity Rebalancing = ganti instance berisiko AWAL sebelum notis 2 minit penuh", "price-capacity-optimized = strategi allocation default disyorkan AWS", "EC2 Fleet/Spot Fleet/ASG Mixed = sebar banyak type+AZ supaya tahan interrupt", "JANGAN Spot untuk: DB stateful, production kritikal, payment service"],
            perangkap: [{"soalan": "Beban batch big-data yang boleh interrupt & resume, nak kos PALING rendah. Pricing mana?", "jebakan": "Reserved Instances / Savings Plans — nampak 'jimat jadi pilih commit', tapi untuk batch fault-tolerant, Spot jauh lebih murah (90% vs 72%) dan interrupt tak jadi masalah.", "betul": "Spot Instances — 'fault-tolerant + lowest cost' hampir mesti Spot. Keyword: 'fault-tolerant', 'batch', 'can resume', 'lowest cost'."}, {"soalan": "Spot workload perlu SAMBUNG kerja (resume state) selepas di-interrupt, bukan start fresh. Interruption behavior mana?", "jebakan": "Terminate (default) — biar default, tapi terminate buang instance terus, kerja hilang, kena start dari awal.", "betul": "Stop (request persistent/Fleet maintain) untuk kekalkan EBS, atau Hibernate untuk simpan RAM. Keyword: 'resume work after interruption', 'preserve state'."}],
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
            sebabApa: "Wujud sebab RI lock kau pada instance config tertentu — kalau kau tukar family/region atau guna Fargate/Lambda, RI tak apply dan kau kena exchange manual. Savings Plans commit pada $/jam belanja compute je, jadi diskaun AUTO-apply merentas instance, region, dan termasuk Fargate + Lambda — hilang kerja urus exchange tiap kali beban berubah.",
            sifir: ["SP = commit $/jam compute (bukan instance config) → auto-apply, no exchange manual", "Compute SP = paling FLEKSIBEL (any family/region/OS + Fargate + Lambda), sampai 66%", "EC2 Instance SP = lock 1 family + 1 region, diskaun lebih besar (sampai 72%), EC2 sahaja", "SP TIADA capacity reservation (kalau perlu → Zonal RI)", "Billing apply order: RI → EC2 Instance SP → Compute SP (highest discount dulu)", "Soalan tekan 'flexibility / minimal management' → Savings Plans (bukan RI)", "Boleh interrupt batch → Spot, bukan SP"],
            perangkap: [{"soalan": "Beban compute steady tapi mungkin tukar instance type/region nanti, DAN ada Fargate + Lambda. Nak jimat + minimal management. Pilih apa?", "jebakan": "Reserved Instances — orang default ke RI untuk 'steady workload', tapi RI lock config + tak cover Fargate/Lambda + perlu exchange manual bila tukar.", "betul": "Compute Savings Plans — auto-apply merentas family/region + cover Fargate & Lambda. Keyword: 'flexibility', 'Fargate/Lambda', 'auto-apply', 'minimal management'."}, {"soalan": "Komited pada satu family (m5) dalam satu region je, nak diskaun lebih besar dari Compute SP. Pilih apa?", "jebakan": "Compute SP — sebab nama 'Savings Plans', tapi Compute SP diskaun lebih kecil (66%) sebab dia paling fleksibel.", "betul": "EC2 Instance Savings Plans — lock 1 family/region tukar diskaun lebih tinggi (sampai 72%). Keyword: 'specific family + region', 'higher discount'."}],
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
            compare: [
              {
                label: '4 EC2 pricing models — pick per workload (overview)',
                headers: ['Model', 'Komitmen', 'Diskaun', 'Boleh interrupt?', 'Guna bila'],
                rows: [
                  ['On-Demand', 'Tiada', 'Baseline (paling mahal)', 'Tak', 'Spiky / short-term / tak predictable / dev-test'],
                  ['Spot', 'Tiada', '🟢 Sampai 90%', '🔴 Ya (notis 2 min)', 'Fault-tolerant batch, stateless, masa fleksibel'],
                  ['Savings Plans', '$/jam · 1-3 thn', 'Sampai 66-72%', 'Tak', 'Steady spend + nak fleksibel (auto-apply, +Fargate/Lambda)'],
                  ['Reserved Instances', 'Instance config · 1-3 thn', 'Sampai 72%', 'Tak', 'Steady 24/7 config tetap; perlu capacity reservation (Zonal)'],
                ],
                takeaway: 'Boleh interrupt + termurah → Spot. Tak predictable → On-Demand. Steady + fleksibel → Savings Plans. Steady config tetap / perlu capacity reservation → Reserved Instances. INGAT exam: "flexibility" → Savings Plans · "capacity reservation" → Zonal RI · "fault-tolerant + cheapest" → Spot · "spiky/unpredictable" → On-Demand.',
              },
              {
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
            ],
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
            sebabApa: "Wujud sebab manusia teruk teka saiz instance yang betul — selalu over-provision 'just in case' jadi bayar lebih, atau under-provision jadi lembap. Compute Optimizer guna ML atas 14 hari metric sebenar untuk cadang config optimal + jangka penjimatan, hilang kerja analisa rightsizing manual.",
            sifir: ["Compute Optimizer = ML rightsizing untuk compute (EC2, ASG, EBS, Lambda, ECS/Fargate)", "Guna ML atas 14 hari CloudWatch metric (perlu minimum 14 hari data)", "Bagi projected savings + performance risk + current vs recommended", "PERCUMA (kau bayar CloudWatch je kalau enhanced/custom metrics)", "vs Trusted Advisor: TA = broad rule-based 5 kategori; CO = ML deep compute rightsizing", "'ML rightsizing untuk EC2/Lambda' → Compute Optimizer"],
            perangkap: [{"soalan": "EC2 instances consistently underutilized — nak ML-based rightsizing recommendation khusus untuk EC2/Lambda tanpa analisa manual. Servis mana?", "jebakan": "Trusted Advisor — ada kategori 'Cost Optimization' yang flag idle resource, jadi nampak boleh, tapi TA rule-based broad, bukan ML deep rightsizing dengan config optimal cadangan.", "betul": "AWS Compute Optimizer — ML atas 14 hari metric, cadang instance config optimal + projected savings. Keyword: 'ML rightsizing', 'optimal config', 'EC2/Lambda'."}],
            scenario: '"EC2 instances consistently underutilized, nak reduce cost without manual analysis" → Compute Optimizer untuk get rightsizing recommendations.',
            tips: [
              'Compute Optimizer vs Trusted Advisor: Compute Optimizer = ML-based deep rightsizing untuk compute. Trusted Advisor = broader checks (cost, security, performance, service limits)',
              'Supported resources: EC2 instances, EC2 Auto Scaling Groups, EBS volumes, Lambda functions, ECS on Fargate',
              'Requires CloudWatch metrics — needs at least 14 days of usage data for recommendations',
              'Exam: "get ML-based rightsizing recommendations for EC2/Lambda" → Compute Optimizer. "General cost recommendations across many services" → Trusted Advisor',
              'PRICING: Compute Optimizer is FREE — tiada charge untuk recommendations. Ia guna CloudWatch metrics sedia ada (kau hanya bayar kalau enable enhanced CloudWatch metrics/custom metrics). Opt-in per account atau org-wide via Organizations.',
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
            docs: [
              { label: 'What is AWS Compute Optimizer', url: 'https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html' },
            ],
            keywords: ['rightsizing', 'ML recommendations', 'EC2 optimization', 'Lambda optimization', 'cost savings', 'underutilized', 'vs Trusted Advisor', '14 days metrics', 'free', 'pricing'],
          },
          {
            shortName: 'Trusted Advisor',
            fullName: 'AWS Trusted Advisor',
            ingat: '"Penasihat jimat kos AWS"',
            gunaUntuk: 'Identify idle resources, cost optimization recommendations',
            fungsi: 'Menganalisis persekitaran AWS dan memberikan cadangan rule-based merentas LIMA kategori. Flag resources yang membazir, risiko security, bottleneck performance, kelemahan fault tolerance, dan service limits yang hampir penuh.',
            sebabApa: "Wujud sebab senang terlepas pandang amalan terbaik (security group terbuka, S3 public, RI tak guna, hampir cecah service limit) merentas banyak servis. Trusted Advisor scan akaun automatik ikut rule dan flag isu dalam 5 kategori, jadi kau tak payah audit manual satu-satu.",
            sifir: ["Trusted Advisor = rule-based broad checks, 5 kategori: Cost, Performance, Security, Fault Tolerance, Service Limits (ingat 'CP-SFS')", "Basic/Developer support = 7 core checks SAHAJA; full 5 kategori perlu Business/Enterprise support", "API access (automate) perlu Business/Enterprise support", "vs Compute Optimizer: TA = broad rule-based; CO = ML deep compute rightsizing", "'all Trusted Advisor checks' → perlu Business/Enterprise support", "'alert before overspend' → Budgets (bukan TA)"],
            perangkap: [{"soalan": "Syarikat nak enable SEMUA Trusted Advisor checks (5 kategori penuh + API automation) tapi guna Developer support plan. Apa masalahnya?", "jebakan": "Sangka semua check available di mana-mana plan — sebab Trusted Advisor sendiri tiada caj, orang ingat semua check percuma.", "betul": "Developer support cuma dapat 7 core checks. Full 5-category + API perlu UPGRADE ke Business/Enterprise support. Keyword: 'all checks', 'Business/Enterprise support'."}, {"soalan": "Nak broad best-practice review merentas cost, security, performance, dan service limit untuk seluruh akaun. Servis mana?", "jebakan": "Compute Optimizer — nampak 'optimization jadi pilih', tapi CO fokus compute rightsizing (EC2/Lambda/EBS) je, bukan security atau service limit.", "betul": "Trusted Advisor — broad rule-based 5-category account-wide review. Keyword: 'broad best-practice', 'security + cost + limits', 'account-wide'."}],
            scenario: 'CFO tanya "mana resources kita yang membazir?" — Trusted Advisor akan highlight EC2 yang underutilized, S3 buckets tak pakai, Elastic IPs yang idle, dan bagi estimate savings. "ML rightsizing untuk EC2/Lambda spesifik" pula → Compute Optimizer, BUKAN Trusted Advisor.',
            detailsLabel: '5 kategori checks',
            storageDetails: 'Cost Optimization → idle/underutilized resources, idle load balancers, unassociated Elastic IPs, RI/SP purchase opportunities\nPerformance → over-utilized instances, high-latency config, EBS throughput, service config yang melambatkan\nSecurity → open security groups, public S3 buckets, MFA on root, IAM key exposure, exposed access keys\nFault Tolerance → Multi-AZ, backup/snapshot coverage, ASG health, cross-AZ redundancy\nService Limits → resource usage hampir cecah service quota (cth bilangan VPC, EIP, EC2)',
            tips: [
              'Lima kategori checks: Cost Optimization, Performance, Security, Fault Tolerance, Service Limits (ingat: "CP-SFS")',
              'Tahap akses: Basic/Developer support = 7 core checks SAHAJA (mostly security + service limits). Business/Enterprise support = SEMUA checks (5 kategori penuh) + API access (boleh automate via AWS Support API)',
              'PRICING: Trusted Advisor sendiri tiada caj langsung — tapi akses penuh DIKUNCI di belakang support plan. Basic/Developer (free/$29) = 7 core checks. Full 5-category checks perlu Business ($100/bln atau 10% usage) atau Enterprise support. Exam: "all Trusted Advisor checks" → perlu Business/Enterprise support.',
              'Bukan Compute Optimizer (yang ML-based deep compute rightsizing untuk EC2/ASG/EBS/Lambda/Fargate). Trusted Advisor = broader, rule-based, 5 kategori account-wide',
              'Exam: "broad best-practice checks across cost/security/performance/limits" → Trusted Advisor. "ML rightsizing for EC2/Lambda" → Compute Optimizer. "alert before overspend" → Budgets',
            ],
            docs: [
              { label: 'AWS Trusted Advisor', url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html' },
            ],
            keywords: ['cost recommendations', 'idle resources', 'rightsizing', 'underutilized', 'service limits', 'five categories', 'Cost Optimization', 'Performance', 'Security', 'Fault Tolerance', 'rule-based', 'vs Compute Optimizer', '7 core checks', 'Business support', 'Enterprise support', 'pricing'],
          },
          {
            shortName: 'AWS Budgets',
            fullName: 'AWS Budgets',
            ingat: '"Alarm sebelum spend cecah limit"',
            gunaUntuk: 'Set cost/usage thresholds and get alerted before overspending',
            fungsi: 'Buat budget untuk kos, usage, atau Reserved Instance coverage. Alert via email atau SNS bila actual atau forecast spend melebihi threshold yang ditetapkan.',
            sebabApa: "Wujud sebab Cost Explorer cuma tunjuk duit dah pergi mana SELEPAS jadi (reactive) — kau cuma sedar over-budget bila bil dah keluar. Budgets bagi amaran PROAKTIF: set threshold, dan ia alert (atau auto-act) sebelum/sebaik kos cecah limit, jadi kau tak terkejut dengan bil besar.",
            sifir: ["Budgets = PROACTIVE alert sebelum/sebaik cecah threshold (Cost Explorer = reactive analysis)", "4 jenis: Cost, Usage, Reservation (RI coverage/util), Savings Plans budget", "Alert boleh actual ATAU forecast; boleh set banyak threshold (80%/100%/120%)", "Budget Actions: auto-respond — apply IAM policy, attach SCP, atau stop EC2", "Free tier: 2 budgets percuma, lebih $0.02/hari setiap satu", "'alert before overspend' → Budgets; 'detailed line-item billing' → CUR"],
            perangkap: [{"soalan": "Finance nak dapat email amaran SEBELUM monthly EC2 cost cecah $1000. Servis mana?", "jebakan": "Cost Explorer — orang ingat 'kos jadi Cost Explorer', tapi Cost Explorer cuma VISUALIZE/analyse past spend, tak hantar alert proaktif.", "betul": "AWS Budgets — set threshold + alert (boleh forecast) sebelum overspend. Keyword: 'alert before overspending', 'notify at threshold'."}, {"soalan": "Bila kos cecah threshold, sistem mesti AUTO stop EC2 non-prod, bukan sekadar hantar email. Apa guna?", "jebakan": "Cost Anomaly Detection — nampak macam auto-respond, tapi ia detect+alert anomali, tak ambil tindakan auto-stop.", "betul": "AWS Budgets + Budget Actions — auto apply IAM/SCP atau stop EC2 bila threshold dilanggar. Keyword: 'budget actions', 'auto-stop on threshold'."}],
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
            sebabApa: "Wujud sebab bil AWS mentah susah nak faham — kau tak nampak servis/akaun/tag mana makan duit paling banyak atau trend naik. Cost Explorer bagi UI siap dengan graf, breakdown, forecast, dan cadangan RI/SP supaya kau faham corak belanja tanpa olah data CSV sendiri.",
            sifir: ["Cost Explorer = VISUALIZE & analyse spend (reactive 'duit pergi mana?')", "Forecast sampai 12 bulan ke depan (80% prediction interval)", "Granularity: monthly/daily/hourly (hourly perlu detailed billing on)", "Bagi RI + Savings Plans purchase recommendations", "Cost Anomaly Detection: ML auto-detect spike pelik + alert", "'visualize trends' → Cost Explorer; 'alert before overspend' → Budgets; 'raw CSV/SQL' → CUR"],
            perangkap: [{"soalan": "Pasukan nak tengok graf service mana cost paling banyak 6 bulan lepas DAN dapat cadangan RI nak beli. Servis mana?", "jebakan": "Cost & Usage Report — nampak 'cost detail jadi CUR', tapi CUR raw data mentah ke S3 yang kau kena query/olah sendiri, bukan graf siap + recommendation.", "betul": "Cost Explorer — UI interaktif dengan chart, trend, forecast + RI/SP recommendation. Keyword: 'visualize trends', 'analyze spend', 'RI recommendation'."}],
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
            sebabApa: "Wujud sebab Cost Explorer (UI siap) tak cukup detail bila kau nak buat custom report atau analisa per-resource/per-tag guna SQL sendiri. CUR drop billing data PALING granular ke S3 supaya kau boleh query guna Athena, load ke Redshift, atau dashboard QuickSight — kawalan penuh atas data billing mentah.",
            sifir: ["CUR = billing data PALING granular (hourly, per-resource, per-tag, RI/SP utilization)", "Auto-deliver ke S3 bucket kau: CSV atau Parquet", "Athena hanya support Parquet — pilih Parquet kalau nak query Athena", "Query via Athena (SQL atas S3), load Redshift, atau QuickSight dashboard", "Lebih detail dari Cost Explorer (yang UI siap je)", "'detailed line-item / raw billing for SQL' → CUR; 'visualize trends' → Cost Explorer"],
            perangkap: [{"soalan": "Finance nak data billing mentah paling detail (per-resource, per-hour) untuk query custom guna SQL. Servis mana?", "jebakan": "Cost Explorer — orang ingat 'analisa cost jadi Cost Explorer', tapi Cost Explorer UI siap dengan granularity terhad, bukan raw line-item untuk SQL custom.", "betul": "Cost and Usage Report (CUR) → S3 + Athena (Parquet). Keyword: 'detailed line-item', 'raw billing data', 'query with SQL', 'most granular'."}],
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
            sebabApa: "Wujud sebab dalam SATU account, kos semua team/projek bercampur jadi satu lump — kau tak boleh tahu department mana belanja berapa. Cost Allocation Tags label resource (key-value) yang bila DIAKTIFKAN, biar AWS kumpulkan kos ikut label dalam Cost Explorer/Budgets/CUR, jadi kau boleh chargeback ikut projek/team.",
            sifir: ["Cost Allocation Tags = group kos ikut tag (team/projek/env) dalam SATU account", "Tag = key+value (cth Project=Alpha); satu key satu value per resource", "Apply tag SAHAJA tak cukup — kena ACTIVATE di Billing console (boleh ambil ~24 jam)", "Dua jenis: AWS-generated (prefix aws:) + User-defined (prefix user:) — dua-dua kena activate", "Lepas aktif: filter Cost Explorer, set Budget per tag, muncul dalam CUR", "Pisah kos merentas BANYAK account → Consolidated Billing (bukan tags)"],
            perangkap: [{"soalan": "Dah tag semua resource dengan Project=Alpha tapi tak nampak breakdown kos ikut projek dalam Cost Explorer. Kenapa?", "jebakan": "Sangka tag auto muncul dalam cost report sebaik di-apply — orang skip langkah activate sebab ingat tagging dah cukup.", "betul": "Tag kena di-ACTIVATE di Billing/Cost Management console dulu (boleh ambil ~24 jam) baru muncul. Keyword: 'activate cost allocation tag', 'tag tak muncul dalam report'."}, {"soalan": "Syarikat ada 12 AWS account berasingan, nak asingkan kos ikut account untuk chargeback. Guna apa?", "jebakan": "Cost Allocation Tags — nampak 'track cost jadi pakai tag', tapi tags untuk group dalam satu account; merentas banyak account ada cara lebih kemas.", "betul": "Consolidated Billing (Organizations linked accounts) — kos per account auto-asing dalam satu bil. Keyword: 'multiple accounts', 'per-account cost', 'consolidated billing'."}],
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
            sebabApa: "Kalau setiap AWS account bayar bil sendiri, kau rugi sebab volume discount, Reserved Instances & Savings Plans kira per-account — usage kecik tak naik tier murah. Consolidated Billing wujud supaya semua account dalam Organizations DIGABUNG jadi satu payer → usage besar terus, diskaun dikongsi, satu bil je. Lagi banyak account, lagi murah per unit.",
            sifir: ["Management (payer) account = bayar semua; member bill = informational je", "Usage SEMUA account digabung → naik volume tier diskaun lebih cepat (cth S3 tiered)", "RI + Savings Plans tak terpakai di satu account auto-apply ke account lain", "Consolidated Billing = PERCUMA (sebahagian dari AWS Organizations)", "Nak HAD apa member boleh buat = SCP (guardrail), BUKAN billing"],
            perangkap: [{"soalan": "Syarikat ada 12 AWS account, nak satu bil + maksimumkan volume/RI discount merentas semua account. Apa setup?", "jebakan": "Cost Allocation Tags — sebab nampak macam 'urus kos'. SALAH: tags cuma label kos untuk reporting dalam SATU bil, tak gabungkan usage atau kongsi diskaun.", "betul": "AWS Organizations Consolidated Billing — usage digabung, RI/Savings Plans/volume discount dikongsi merentas account. Keyword: 'single bill + maximize discounts across accounts'."}],
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
            sebabApa: "Kalau semua data duduk dalam S3 Standard, kau bayar harga penuh ($0.023/GB-mo) walaupun data dah lama tak disentuh. S3 Storage Tiers wujud sebab access pattern berubah ikut umur data — log baru kena laju, log lama jarang baca. Pilih tier murah untuk data sejuk = jimat besar (Deep Archive $0.00099/GB = ~23x lebih murah dari Standard).",
            sifir: ["Standard $0.023/GB · Standard-IA $0.0125 (min 30d) · One Zone-IA $0.01 (1 AZ)", "Glacier Instant $0.004 = ms retrieval, min 90d", "Glacier Flexible $0.0036 = retrieve 1min–12hr, min 90d", "Glacier Deep Archive $0.00099 = CHEAPEST, retrieve 12–48hr, min 180d", "IA & Glacier ada retrieval fee + minimum storage duration charge", "Auto-move antara tier = S3 Lifecycle Policy"],
            perangkap: [{"soalan": "Data jarang diakses TAPI bila perlu kena dapat dalam millisecond (medical imaging). Tier mana paling murah?", "jebakan": "Glacier Deep Archive — sebab nampak 'jarang akses + paling murah'. SALAH: Deep Archive retrieve 12–48 jam, bukan ms.", "betul": "S3 Glacier Instant Retrieval — rarely accessed + millisecond retrieval, lebih murah dari Standard-IA. Keyword: 'millisecond' + 'rarely accessed'."}, {"soalan": "Compliance simpan 10 tahun, petabytes, hampir tak pernah baca, kos paling rendah. Pilih?", "jebakan": "S3 Standard-IA — sebab 'infrequent access'. SALAH: IA masih $0.0125/GB, mahal untuk PB jangka panjang.", "betul": "S3 Glacier Deep Archive via Lifecycle Policy — $0.00099/GB, retrieve 12–48hr OK untuk archive. Keyword: '10-year retention, rarely accessed'."}],
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
            sebabApa: "Bila kau TAK BOLEH predict mana data akan dipanggil (cth video kadang viral, kadang mati), pilih tier manual jadi tekaan — silap pilih = bayar lebih atau kena retrieval fee. Intelligent-Tiering wujud supaya AWS auto-pindah objek antara access tier ikut pattern sebenar, tanpa retrieval fee. Bayar monitoring kecik ($0.0025/1K objek) tapi tak risau salah tier.",
            sifir: ["Auto-move antara tier ikut access pattern — NO retrieval fee bila tier berubah", "Caj monitoring ~$0.0025 per 1,000 objek/bulan (selain storage)", "Frequent → Infrequent (selepas 30 hari tak akses) auto", "Optional Archive Instant / Deep Archive tiers untuk objek lama", "Best bila access pattern TAK MENENTU / tak dapat ramal"],
            perangkap: [{"soalan": "Access pattern objek tak boleh diramal langsung, nak optimize kos automatik tanpa risiko retrieval fee. Pilih?", "jebakan": "Lifecycle Policy ke Standard-IA — sebab nampak 'optimize kos'. SALAH: lifecycle ikut UMUR objek (statik), bukan access sebenar; salah ramal = retrieval fee + kos lebih.", "betul": "S3 Intelligent-Tiering — auto-tier ikut access sebenar, no retrieval fee. Keyword: 'unpredictable / unknown access patterns'."}],
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
            sebabApa: "Tanpa CDN, setiap user di Asia/Europe tarik content terus dari origin (cth S3/EC2 di us-east-1) — jauh = lambat + bayar data transfer out penuh setiap kali. CloudFront wujud untuk cache content di edge location dekat user → request hit cache (tak sampai origin), latency turun & data transfer cost turun (transfer keluar dari CloudFront lebih murah dari EC2/S3 langsung).",
            sifir: ["Cache di edge location dekat user → kurang origin hit + laju", "Data transfer out via CloudFront lebih murah dari direct dari EC2/S3", "OAC (Origin Access Control) = S3 bucket private, hanya CloudFront boleh akses", "Static + dynamic content; integrate dengan WAF/Shield untuk security", "TTL kawal berapa lama objek duduk dalam cache sebelum re-fetch origin"],
            perangkap: [{"soalan": "Global users complain laju lambat + bil data transfer dari S3 tinggi. Cara murahkan + cepatkan?", "jebakan": "Replicate S3 bucket ke banyak region (CRR) — sebab nampak 'dekatkan data'. SALAH: CRR gandakan kos storan + kau kena urus routing; tak selesaikan caching/transfer.", "betul": "Letak CloudFront depan S3 — cache di edge, kurang origin fetch, transfer lebih murah. Keyword: 'global users + reduce latency + reduce data transfer cost'."}],
            scenario: 'Website ada users dari US, Europe, Asia. Tanpa CloudFront, setiap request kena bayar data transfer dari origin server. Dengan CloudFront, content cached kat edge location dekat user — jimat kos transfer + lagi laju.',
            keywords: ['reduce data transfer', 'edge caching', 'CDN', 'cost saving'],
          },
          {
            shortName: 'VPC Endpoints',
            fullName: 'AWS VPC Endpoints',
            ingat: '"Jalan dalam rumah, tak payah keluar internet"',
            gunaUntuk: 'EC2 → S3/DynamoDB tanpa kena NAT Gateway fees',
            fungsi: 'Menghubungkan VPC kepada perkhidmatan AWS secara terus tanpa melalui internet awam',
            sebabApa: "EC2 dalam private subnet yang nak cakap dengan S3/DynamoDB biasanya kena keluar ikut NAT Gateway → bayar per-hour + per-GB processed (mahal kalau pukul S3 banyak). VPC Endpoint wujud supaya traffic ke AWS service pergi terus dalam AWS network (tak keluar internet) → buang NAT cost + lagi selamat (data tak lalu public internet).",
            sifir: ["Gateway Endpoint = S3 & DynamoDB SAHAJA — PERCUMA (route table entry)", "Interface Endpoint (PrivateLink/ENI) = service lain — bayar per-hour + per-GB", "Traffic tak keluar internet → no NAT Gateway data processing fee", "Private subnet → S3/DynamoDB tanpa IGW/NAT = guna Gateway Endpoint", "Lagi selamat: data stay dalam AWS network"],
            perangkap: [{"soalan": "EC2 private subnet upload banyak ke S3, bil NAT Gateway tinggi. Cara hapuskan kos itu untuk S3 traffic?", "jebakan": "Tambah lagi NAT Gateway / besarkan instance — sebab fikir 'throughput'. SALAH: tambah NAT = tambah kos, bukan buang.", "betul": "Pasang S3 Gateway VPC Endpoint (PERCUMA) — traffic S3 tak lalu NAT lagi. Keyword: 'private subnet → S3 + remove NAT cost'."}],
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
            sebabApa: 'Pukul database berkali-kali untuk data SAMA (product listing, user session, leaderboard) mahal & lambat — DB kena scale up (mahal). ElastiCache wujud untuk simpan data panas dalam memory (sub-ms read) supaya DB tak terbeban, latency turun & kos turun. Kalau data sama diminta berjuta kali, cache je.',
            sifir: [
              'Redis = rich data + persistence + replication + Multi-AZ (default exam answer)',
              'Memcached = simple key-value, multi-threaded, NO persistence/replication',
              'Lazy Loading = isi masa cache MISS (jimat memory, boleh stale → fix TTL)',
              'Write-Through = isi masa WRITE (sentiasa fresh, tapi boros memory)',
              'Session store / leaderboard / pub-sub → Redis',
            ],
            perangkap: [
              {
                soalan: 'Perlu cache dengan persistence, replication & Multi-AZ failover (session store tak boleh hilang bila node fail). Pilih engine.',
                jebakan: 'Memcached — sebab "multi-threaded laju". SALAH: Memcached takda persistence/replication, data HILANG bila node restart/fail.',
                betul: 'ElastiCache for Redis (persistence + replication + Multi-AZ auto-failover).',
              },
            ],
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
            sebabApa: "Provisioned capacity kena tetapkan RCU/WCU awal — kalau silap ramal, traffic spike = throttle (request gagal), traffic rendah = bayar capacity idle. DynamoDB On-Demand wujud untuk app yang traffic tak menentu / baru: bayar per-request je, auto-scale serta-merta, zero urus capacity. Tak payah teka, tak kena throttle masa spike.",
            sifir: ["On-Demand = bayar per read/write request, auto-scale, zero capacity planning", "Provisioned = set RCU/WCU (boleh + auto-scaling) → lebih murah untuk traffic stabil/predictable", "On-Demand per-request lebih MAHAL/unit dari Provisioned bila traffic steady", "Spiky / unknown / new app → On-Demand; steady predictable → Provisioned", "Boleh tukar mode On-Demand ↔ Provisioned (had sekali per 24 jam)"],
            perangkap: [{"soalan": "App baru, tak tahu corak traffic, mahu elak throttle masa spike & elak bayar capacity idle. Mode mana?", "jebakan": "Provisioned + Auto Scaling — sebab nampak 'auto-scale jugak'. SALAH: auto-scaling react LAMBAT, spike tiba-tiba boleh kena throttle sebelum sempat scale.", "betul": "DynamoDB On-Demand — instant accommodate spike, bayar per request. Keyword: 'unpredictable / unknown traffic + no capacity planning'."}],
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
            sebabApa: "Pillar ini wujud sebab operasi manual + tak ada monitoring = silap manusia & susah recover; ia paksa kau automate, observe, dan improve proses berterusan supaya sistem deliver business value.",
            sifir: ["Fokus: automation + monitoring + continuous improvement", "Tools: CloudFormation (IaC), CI/CD pipeline, CloudWatch, runbooks/playbooks", "Perform operations as code; buat small reversible changes; belajar dari kegagalan (post-incident review)"],
            perangkap: [{"soalan": "Pasukan deploy manual, selalu silap, tak ada cara repeat environment. Pillar/amalan mana?", "jebakan": "Reliability — sebab 'silap = tak reliable'. SALAH: Reliability pasal recover dari failure & scaling, bukan proses deploy.", "betul": "Operational Excellence — IaC (CloudFormation) + CI/CD + runbooks untuk operasi konsisten. Keyword: 'automate operations, perform operations as code'."}],
            keywords: ['IaC', 'automation', 'runbooks', 'CI/CD', 'monitoring', 'continuous improvement'],
          },
          {
            shortName: 'Security',
            fullName: 'Well-Architected: Security',
            ingat: '"Lindungi data, systems, dan assets"',
            gunaUntuk: 'Protect information, systems, and assets via risk assessments and mitigation strategies',
            fungsi: 'Security pillar: identity and access management, detective controls, infrastructure protection, data protection, incident response. Principle of least privilege.',
            sebabApa: "Pillar ini wujud supaya data, sistem & aset dilindungi — guna least privilege, encryption, dan detective controls supaya breach dicegah & dikesan awal, bukan diharap tak jadi.",
            sifir: ["Prinsip teras: least privilege (IAM) + defense in depth", "Encryption at rest (KMS) + in transit (TLS); data classification", "Detective controls: CloudTrail, Config, GuardDuty; ada incident response plan"],
            perangkap: [{"soalan": "Nak rekod siapa buat apa dalam account untuk audit + kesan aktiviti mencurigakan. Pillar/amalan mana?", "jebakan": "Operational Excellence (CloudWatch metrics) — sebab nampak 'monitoring'. SALAH: itu operasi/prestasi, bukan audit identiti & ancaman.", "betul": "Security pillar — detective controls: CloudTrail (audit log) + GuardDuty. Keyword: 'detective controls, least privilege, protect data'."}],
            keywords: ['least privilege', 'IAM', 'encryption', 'detective controls', 'data protection', 'incident response'],
          },
          {
            shortName: 'Reliability',
            fullName: 'Well-Architected: Reliability',
            ingat: '"Recover dari failures, scale untuk demand"',
            gunaUntuk: 'Ensure workload performs correctly and consistently, including recovery from failures',
            fungsi: 'Reliability fokus pada distributed system design, recovery planning, dan scaling. Multi-AZ, backups, auto-healing, chaos engineering.',
            sebabApa: "Pillar ini wujud sebab hardware/AZ memang akan fail satu hari — Reliability paksa design yang boleh recover automatik & scale ikut demand (Multi-AZ, backup, auto-healing) supaya workload tetap jalan betul.",
            sifir: ["Fokus: recover dari failure + scale untuk demand + elak single point of failure", "Multi-AZ = survive AZ outage; backups + auto-healing (ASG health check)", "RTO = berapa lama nak recover; RPO = berapa banyak data boleh hilang (test DR)"],
            perangkap: [{"soalan": "App kena terus jalan walaupun satu Availability Zone tumbang. Pillar/strategi mana?", "jebakan": "Performance Efficiency (scaling) — sebab nampak 'scaling'. SALAH: scaling pasal efisiensi resource, bukan survive AZ failure.", "betul": "Reliability — Multi-AZ deployment + auto-recovery. Keyword: 'recover from failure, survive AZ outage, RTO/RPO'."}],
            keywords: ['Multi-AZ', 'auto-recovery', 'RTO', 'RPO', 'disaster recovery', 'horizontal scaling', 'fault isolation'],
          },
          {
            shortName: 'Performance Efficiency',
            fullName: 'Well-Architected: Performance Efficiency',
            ingat: '"Guna resources dengan efficient, adapt bila ada perubahan"',
            gunaUntuk: 'Use computing resources efficiently to meet requirements and maintain efficiency as demand changes',
            fungsi: 'Selection of right resource types/sizes, monitoring performance, making informed decisions to maintain efficiency as business needs evolve.',
            sebabApa: "Pillar ini wujud supaya kau pilih jenis & saiz resource yang betul dan terus efisien bila demand berubah — guna serverless, caching, CDN & right-sizing supaya tak over-provision atau guna resource salah jenis.",
            sifir: ["Fokus: guna resource paling efisien + adapt bila demand berubah", "Right-sizing instance, serverless (Lambda/Fargate), caching, CDN (CloudFront)", "Buat keputusan berdasarkan data: benchmark + monitor, bukan agak-agak"],
            perangkap: [{"soalan": "Static asset disajikan global lambat; nak guna resource lebih efisien & laju tanpa scale up server. Pillar/amalan?", "jebakan": "Reliability — sebab nampak 'scale'. SALAH: Reliability pasal recover/failure, bukan efisiensi penyampaian.", "betul": "Performance Efficiency — caching + CDN (CloudFront) edge delivery. Keyword: 'use resources efficiently, global deployment, caching'."}],
            keywords: ['right-sizing', 'serverless', 'caching', 'CDN', 'global deployment', 'benchmarking'],
          },
          {
            shortName: 'Cost Optimization',
            fullName: 'Well-Architected: Cost Optimization',
            ingat: '"Deliver value pada harga terendah"',
            gunaUntuk: 'Run systems to deliver business value at the lowest price point',
            fungsi: 'Avoid unnecessary costs, right-size resources, use appropriate pricing models (Reserved, Spot, Savings Plans), measure efficiency.',
            sebabApa: "Pillar ini wujud sebab senang sangat bayar lebih dalam cloud (idle resource, on-demand 24/7, over-provision) — ia paksa kau buang waste, right-size, dan guna pricing model betul (Reserved/Spot/Savings Plans) supaya deliver value pada kos terendah.",
            sifir: ["Fokus: buang kos tak perlu + right-size + pricing model betul + ukur efisiensi", "Pricing: Reserved Instances/Savings Plans (steady), Spot (fault-tolerant, up to 90% off)", "Right-size dengan Compute Optimizer; jejak kos guna Cost Allocation Tags + Cost Explorer"],
            perangkap: [{"soalan": "Workload batch boleh diganggu, jalan steady tapi mahu kos compute paling rendah. Strategi mana?", "jebakan": "On-Demand sebab 'fleksibel'. SALAH: On-Demand paling mahal untuk beban yang boleh tahan gangguan.", "betul": "Cost Optimization — Spot Instances (fault-tolerant batch, sehingga 90% off). Keyword: 'lowest cost, interruptible/fault-tolerant'."}],
            keywords: ['right-sizing', 'Reserved Instances', 'Spot', 'Savings Plans', 'eliminate waste', 'cost allocation tags'],
          },
          {
            shortName: 'Sustainability',
            fullName: 'Well-Architected: Sustainability',
            ingat: '"Kurangkan environmental impact — pillar ke-6 (2021)"',
            gunaUntuk: 'Minimize environmental impacts of running cloud workloads',
            fungsi: 'Sustainability pillar (ditambah 2021) fokus pada reducing carbon footprint: maximise utilisation, use efficient hardware, minimise resources provisioned, adopt serverless/managed services.',
            sebabApa: "Pillar ke-6 (ditambah Nov 2021) wujud sebab compute yang idle & over-provisioned bazir tenaga & tambah carbon footprint — ia galak maksimumkan utilisation, guna serverless/managed & hardware efisien untuk kurangkan impak alam sekitar.",
            sifir: ["Pillar KE-6, ditambah November 2021 (ramai ingat 5 je)", "Kurangkan: serverless (no idle compute) + auto-scaling (no over-provision)", "Pilih region guna renewable energy; maksimumkan utilisation hardware"],
            perangkap: [{"soalan": "Syarikat nak kurangkan carbon footprint workload cloud mereka. Pillar mana + strategi?", "jebakan": "Cost Optimization — sebab 'kurang resource = kurang kos jugak'. SALAH: matlamat di sini impak alam sekitar, bukan harga; itu pillar berbeza.", "betul": "Sustainability pillar — serverless + maksimumkan utilisation + region renewable. Keyword: 'minimize environmental impact, carbon footprint'."}],
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
            sebabApa: "Run SQLite atas single server senang & murah, TAPI kalau server crash, DB (satu fail) boleh hilang dan takda failover macam RDS. Litestream wujud untuk stream perubahan SQLite (WAL) ke S3 secara real-time supaya kau dapat backup near-zero-loss + restore cepat, tanpa bayar managed DB fee — cuma kos S3.",
            sifir: ["Stream SQLite WAL → S3 real-time; kos = S3 rate je (~$0.023/GB), no managed DB fee", "SQLite WAJIB WAL mode: PRAGMA journal_mode=WAL", "Litestream mesti start SEBELUM app process; restore dari S3 masa boot", "Bukan SAA-C03 content — real-world indie/SaaS untuk elak RDS cost", "Praktikal sampai ~10 GB sebelum SQLite mula slow"],
            perangkap: [{"soalan": "(Real-world, bukan exam) Single-server app guna SQLite, nak backup automatik + restore cepat tanpa bayar RDS. Apa guna?", "jebakan": "Tukar ke RDS Multi-AZ — sebab 'reliable'. Untuk side-project ia overkill + mahal ($50–300+/bulan).", "betul": "Litestream — stream WAL ke S3, restore masa crash, kos S3 sahaja. Keyword: 'SQLite continuous replication to S3, cheap backup'."}],
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
