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
            keywords: ['users', 'groups', 'roles', 'policies', 'least privilege', 'MFA'],
          },
          {
            shortName: 'STS',
            fullName: 'AWS Security Token Service',
            ingat: '"Pinjam IC sementara"',
            gunaUntuk: 'Generate temporary security credentials',
            fungsi: 'Menyediakan credentials sementara (access key, secret key, session token) untuk access AWS resources',
            contohGuna: 'Developer nak test dengan AWS account lain — AssumeRole via STS, dapat temp credentials tanpa perlu IAM user baru',
            keywords: ['temporary credentials', 'AssumeRole', 'cross-account', 'federation'],
          },
          {
            shortName: 'IAM Identity Center',
            fullName: 'AWS IAM Identity Center (SSO)',
            ingat: '"Satu login, semua AWS accounts"',
            gunaUntuk: 'Centralized SSO untuk multiple AWS accounts',
            fungsi: 'Membolehkan pengguna login sekali dan access multiple AWS accounts dan business applications',
            contohGuna: 'Staff login dengan corporate email (Microsoft AD / Okta), dapat access semua 10 AWS accounts yang dibenarkan tanpa login semula',
            keywords: ['SSO', 'single sign-on', 'multiple accounts', 'federation', 'SAML 2.0'],
          },
          {
            shortName: 'AWS Organizations',
            fullName: 'AWS Organizations + Control Tower + SCPs',
            ingat: '"HQ yang kawal semua anak syarikat"',
            gunaUntuk: 'Manage multiple AWS accounts centrally with guardrails',
            fungsi: 'Mengurus pelbagai AWS accounts dalam satu organisasi dengan Service Control Policies (SCPs) sebagai guardrails',
            contohGuna: 'Prevent semua dev accounts dari disable CloudTrail — SCP: Deny cloudtrail:StopLogging. Control Tower automate setup multi-account environment',
            keywords: ['multi-account', 'SCPs', 'guardrails', 'Control Tower', 'management account', 'OU'],
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
            ingat: '"Bodyguard EC2 — ingat siapa dia bagi masuk"',
            gunaUntuk: 'Instance-level firewall, stateful',
            fungsi: 'Mengawal inbound dan outbound traffic pada peringkat EC2 instance secara stateful — balas automatically dibenarkan',
            contohGuna: 'Web server SG: allow 443 dari 0.0.0.0/0. DB SG: allow 3306 dari Web Server SG je — bukan dari internet',
            keywords: ['stateful', 'instance-level', 'inbound rules', 'allow only', 'default deny'],
          },
          {
            shortName: 'NACLs',
            fullName: 'Network Access Control Lists',
            ingat: '"Guard kat pintu masuk subnet — check both ways"',
            gunaUntuk: 'Subnet-level firewall, stateless, boleh block IP',
            fungsi: 'Mengawal traffic masuk dan keluar subnet secara stateless — kena ada rule eksplisit untuk inbound DAN outbound',
            contohGuna: 'Block IP range 192.168.1.0/24 dari masuk subnet — tambah DENY rule dalam NACL (Security Groups tak boleh explicitly deny)',
            keywords: ['stateless', 'subnet-level', 'allow & deny', 'numbered rules', 'explicit both ways'],
          },
          {
            shortName: 'WAF',
            fullName: 'AWS Web Application Firewall',
            ingat: '"Penapis website dari serangan Layer 7"',
            gunaUntuk: 'Protect against SQL injection, XSS, rate limiting',
            fungsi: 'Menapis requests HTTP/HTTPS berbahaya sebelum sampai ke aplikasi dengan rules dan managed rule groups',
            contohGuna: 'API kena SQL injection attack — deploy WAF dengan AWS Managed Rules kat ALB atau CloudFront. Boleh rate limit 1000 req/IP per minit',
            keywords: ['Layer 7', 'SQL injection', 'XSS', 'rate limiting', 'managed rules', 'ALB', 'CloudFront'],
          },
          {
            shortName: 'AWS Shield',
            fullName: 'AWS Shield Standard & Advanced',
            ingat: '"Pelindung DDoS — Standard free, Advanced bayar"',
            gunaUntuk: 'DDoS protection Layer 3/4 (Standard) and Layer 7 (Advanced)',
            fungsi: 'Melindungi dari serangan DDoS — Standard free untuk semua, Advanced untuk protection 24/7 + DDoS Response Team',
            contohGuna: 'Website kena volumetric DDoS — Shield Standard protect automatically. Enterprise nak protection + cost protection + DRT = Shield Advanced',
            keywords: ['DDoS', 'Layer 3/4', 'Shield Standard', 'Shield Advanced', 'DRT', 'always-on'],
          },
          {
            shortName: 'Network Firewall',
            fullName: 'AWS Network Firewall',
            ingat: '"Polis traffic dalam VPC — deep inspection"',
            gunaUntuk: 'VPC-level stateful deep packet inspection, domain filtering',
            fungsi: 'Menyediakan firewall managed untuk inspect dan filter traffic dalam VPC dengan stateful rules dan intrusion prevention',
            contohGuna: 'Company policy semua outbound traffic kena inspect untuk block malicious domains — deploy Network Firewall kat centralized VPC, route semua traffic melaluinya',
            keywords: ['deep packet inspection', 'stateful', 'VPC-level', 'intrusion prevention', 'domain filtering'],
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
            keywords: ['encryption at rest', 'CMK', 'key rotation', 'SSE-KMS', 'envelope encryption', 'CloudTrail audit'],
          },
          {
            shortName: 'Secrets Manager',
            fullName: 'AWS Secrets Manager',
            ingat: '"Simpan password apps, auto-rotate"',
            gunaUntuk: 'Store dan auto-rotate credentials, API keys, DB passwords',
            fungsi: 'Menyimpan, mendapatkan semula dan memutar rahsia secara automatik tanpa perlu update aplikasi',
            contohGuna: 'Lambda function perlu DB password — jangan letak dalam env var atau code. Store dalam Secrets Manager, Lambda retrieve masa runtime. Auto-rotate setiap 30 hari',
            keywords: ['auto-rotation', 'credentials', 'API keys', 'no hardcoded secrets', 'Lambda integration'],
          },
          {
            shortName: 'S3 Object Lock',
            fullName: 'Amazon S3 Object Lock',
            ingat: '"Lock file — tak boleh delete atau ubah (WORM)"',
            gunaUntuk: 'WORM compliance, prevent deletion/modification',
            fungsi: 'Menghalang objek S3 dari dihapuskan atau diubah suai dalam tempoh tertentu untuk pematuhan kawal selia',
            contohGuna: 'Financial records kena simpan 7 tahun tak boleh diubah — enable Object Lock Compliance mode. Governance mode untuk internal policy yang admin boleh override',
            keywords: ['WORM', 'compliance', 'retention period', 'Governance mode', 'Compliance mode', 'legal hold'],
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
            fungsi: 'Menyediakan sambungan jaringan peribadi yang berdedikasi antara data center on-premises dengan AWS',
            contohGuna: 'Company transfer 100TB data sebulan dari on-prem ke AWS — Direct Connect lebih murah (no internet data transfer charges), consistent latency berbanding internet',
            keywords: ['dedicated connection', 'private', 'consistent latency', '1Gbps/10Gbps', 'no internet'],
          },
          {
            shortName: 'Site-to-Site VPN',
            fullName: 'AWS Site-to-Site VPN',
            ingat: '"Tunnel rahsia ke AWS, guna internet biasa"',
            gunaUntuk: 'Encrypted IPSec tunnel from on-premises to VPC over internet',
            fungsi: 'Mewujudkan sambungan VPN yang disulitkan antara on-premises network dengan AWS VPC menggunakan internet sedia ada',
            contohGuna: 'Small office nak access resources dalam VPC secara selamat — setup Site-to-Site VPN. Lebih murah dan cepat setup dari Direct Connect tapi latency tak konsisten',
            keywords: ['IPSec', 'encrypted', 'internet-based', 'Virtual Private Gateway', 'quick setup', 'cost-effective'],
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
            keywords: ['horizontal scaling', 'scale out/in', 'launch template', 'scaling policies', 'desired capacity', 'min/max'],
          },
          {
            shortName: 'RDS Multi-AZ',
            fullName: 'Amazon RDS Multi-AZ Deployment',
            ingat: '"Backup database sedia tunggu dalam AZ lain"',
            gunaUntuk: 'High availability for RDS — automatic failover',
            fungsi: 'Menyimpan satu salinan database standby dalam Availability Zone berbeza yang akan take over secara automatik jika primary fail',
            scenario: 'Production RDS kat AZ-1 fail — automatic failover ke standby kat AZ-2 dalam 1-2 minit. Same connection endpoint, app tak perlu tukar config. BUKAN untuk scale reads — guna Read Replicas untuk tu.',
            keywords: ['automatic failover', 'standby', 'different AZ', 'sync replication', 'same endpoint', 'HA only'],
          },
          {
            shortName: 'RDS Read Replicas',
            fullName: 'Amazon RDS Read Replicas',
            ingat: '"Photocopy database untuk baca je"',
            gunaUntuk: 'Scale read traffic, offload reporting queries from primary',
            fungsi: 'Mencipta salinan database read-only untuk mengagihkan beban queries baca dari database utama',
            scenario: 'Reporting dashboard slow down production RDS — create Read Replica, point reporting app ke replica. Primary DB hanya handle writes. Boleh create up to 15 replicas, cross-region pun boleh.',
            keywords: ['read scaling', 'async replication', 'reporting', 'cross-region', 'up to 15 replicas', 'read-only'],
          },
          {
            shortName: 'Global Accelerator',
            fullName: 'AWS Global Accelerator',
            ingat: '"Highway AWS untuk user seluruh dunia"',
            gunaUntuk: 'Route global users to nearest healthy endpoint via AWS backbone',
            fungsi: 'Menggunakan AWS global network untuk route traffic ke endpoint yang paling dekat dan sihat, bukan melalui internet awam',
            scenario: 'App dengan users dari US dan Asia — Global Accelerator route via AWS backbone (bukan public internet), lagi laju. Kalau satu region fail, auto-failover ke region lain dalam <30 saat. Beza dengan CloudFront: GA untuk TCP/UDP apps, bukan static content caching.',
            keywords: ['global routing', 'AWS backbone', 'anycast', 'static IP', 'TCP/UDP', 'failover <30s'],
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
            keywords: ['RPO: hours/days', 'RTO: hours', 'lowest cost', 'no standby infra', 'S3/Glacier backup'],
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
            keywords: ['centralized backup', 'backup plans', 'retention', 'cross-region', 'compliance', 'automated'],
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
            keywords: ['full control', 'custom OS', 'lift and shift'],
          },
          {
            shortName: 'Lambda',
            fullName: 'AWS Lambda',
            ingat: '"Jalankan code, bayar per run"',
            gunaUntuk: 'Serverless, event-driven',
            fungsi: 'Melaksanakan kod tanpa perlu mengurus server',
            contohGuna: 'Resize image bila upload ke S3, webhook handler, scheduled tasks',
            keywords: ['serverless', 'event-driven', 'no server management'],
          },
          {
            shortName: 'Elastic Beanstalk',
            fullName: 'AWS Elastic Beanstalk',
            ingat: '"Hantar code je, AWS urus selebihnya"',
            gunaUntuk: 'Deploy app tanpa urus server',
            fungsi: 'Mengurus deployment, scaling dan monitoring aplikasi secara automatik',
            contohGuna: 'Deploy Node.js / Python app tanpa urus EC2 sendiri',
            keywords: ['PaaS', 'deploy app', 'developer friendly'],
          },
          {
            shortName: 'ECS',
            fullName: 'Elastic Container Service',
            ingat: '"Docker manager"',
            gunaUntuk: 'Run containers',
            fungsi: 'Mengurus dan menjalankan Docker containers pada cluster',
            contohGuna: 'Run microservices dalam Docker, e-commerce modules',
            keywords: ['Docker', 'containers', 'microservices'],
          },
          {
            shortName: 'EKS',
            fullName: 'Elastic Kubernetes Service',
            ingat: '"Kubernetes manager"',
            gunaUntuk: 'Container orchestration guna K8s',
            fungsi: 'Mengurus Kubernetes cluster untuk container orchestration',
            contohGuna: 'Large-scale containerized apps yang guna K8s',
            keywords: ['Kubernetes', 'K8s', 'container orchestration'],
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
            shortName: 'EC2 Metadata',
            fullName: 'EC2 Instance Metadata Service (IMDS)',
            ingat: '"ID kad instance sendiri"',
            gunaUntuk: 'Get info about the running instance from within the instance',
            fungsi: 'Menyediakan data tentang instance itu sendiri — IP address, instance ID, IAM role name, security groups, hostname. Accessible dari dalam instance via http://169.254.169.254/latest/meta-data/',
            contohGuna: 'App dalam EC2 nak tau public IP dia sendiri atau nama IAM role yang attached — query Metadata endpoint tanpa perlu AWS CLI.',
            scenario: '"Script dalam EC2 nak retrieve IAM role credentials atau instance ID" → Instance Metadata. Bukan untuk run scripts. Keyword: 169.254.169.254, info about instance.',
            keywords: ['169.254.169.254', 'instance info', 'IMDSv2', 'hostname', 'IP address', 'IAM role name'],
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
            keywords: ['block storage', 'single EC2', 'persistent disk'],
          },
          {
            shortName: 'EFS',
            fullName: 'Elastic File System',
            ingat: '"Shared drive, ramai boleh access"',
            gunaUntuk: 'File storage, multi-EC2',
            fungsi: 'Menyediakan file storage yang boleh dikongsi oleh pelbagai EC2 instances serentak',
            contohGuna: 'Shared config files, media processing antara multiple EC2',
            keywords: ['shared storage', 'multiple EC2', 'NFS'],
          },
          {
            shortName: 'S3',
            fullName: 'Simple Storage Service',
            ingat: '"Infinite storage bucket"',
            gunaUntuk: 'Object storage, images, backups',
            fungsi: 'Menyimpan dan mendapatkan semula sebarang jumlah data sebagai objects',
            contohGuna: 'Store images, videos, backups, static website hosting',
            keywords: ['object storage', 'static website', 'backup', 'unlimited'],
          },
          {
            shortName: 'S3 Glacier',
            fullName: 'Amazon S3 Glacier',
            ingat: '"S3 yang sejuk beku"',
            gunaUntuk: 'Archiving, jarang access',
            fungsi: 'Menyediakan arkib data jangka panjang dengan kos yang rendah',
            contohGuna: 'Store old financial records, compliance archives, log archives',
            keywords: ['archiving', 'long-term storage', 'infrequent access', 'cold storage'],
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
            ingat: '"CDN, content laju sampai"',
            gunaUntuk: 'Deliver content laju via edge locations',
            fungsi: 'Menghantar content kepada pengguna melalui edge locations global dengan latency rendah',
            contohGuna: 'Deliver images & videos untuk global users, static website laju',
            keywords: ['CDN', 'edge location', 'low latency', 'static content'],
          },
          {
            shortName: 'ALB',
            fullName: 'Application Load Balancer',
            ingat: '"Traffic director — by path/host"',
            gunaUntuk: 'Path-based routing, single domain',
            fungsi: 'Mengagihkan traffic HTTP/HTTPS berdasarkan path atau host rules',
            contohGuna: 'myshop.com/products → service A, myshop.com/cart → service B',
            keywords: ['path-based routing', 'HTTP', 'layer 7'],
          },
          {
            shortName: 'NLB',
            fullName: 'Network Load Balancer',
            ingat: '"Traffic director — ultra laju"',
            gunaUntuk: 'TCP/UDP traffic, low latency',
            fungsi: 'Mengagihkan traffic TCP/UDP dengan latency yang sangat rendah',
            contohGuna: 'Gaming servers, IoT, VoIP yang perlukan speed tinggi',
            keywords: ['TCP', 'UDP', 'layer 4', 'static IP'],
          },
          {
            shortName: 'Route 53',
            fullName: 'Amazon Route 53',
            ingat: '"GPS untuk domain"',
            gunaUntuk: 'DNS management, domain routing',
            fungsi: 'Mengurus DNS dan mengarahkan traffic kepada endpoint yang betul',
            contohGuna: 'Point domain ke server, failover ke backup region',
            keywords: ['DNS', 'domain', 'routing policy', 'failover'],
          },
          {
            shortName: 'Route 53 Routing Policies',
            fullName: 'Amazon Route 53 — Routing Policies',
            ingat: '"Cara Route 53 decide siapa dapat traffic"',
            gunaUntuk: 'Control how DNS traffic is routed to resources',
            fungsi: 'Pelbagai routing policies untuk optimize availability, performance, failover, dan geolocation berdasarkan health checks dan rules',
            detailsLabel: 'Routing Policies',
            storageDetails: 'Simple → 1 resource, no health check, no failover\nWeighted → split traffic by % (A=70%, B=30%)\nLatency-based → route to lowest latency AWS region\nFailover → primary (active) + secondary (passive) via health check\nGeolocation → route by user\'s country/continent\nGeoproximity → route by geographic distance + bias\nMulti-Value → up to 8 healthy records, random selection',
            scenario: 'ALB (primary) unhealthy → Route 53 Failover policy auto-redirect ke S3 static error page (secondary). Health check detect ALB down, traffic pindah ke secondary automatik. BUKAN CloudFront — CF cache content tapi tak handle active-passive failover.',
            keywords: ['failover', 'active-passive', 'health check', 'weighted', 'latency-based', 'geolocation', 'simple'],
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
            keywords: ['queue', 'decouple', 'async', 'pull-based', 'visibility timeout', 'FIFO', 'DLQ', 'at-least-once'],
          },
          {
            shortName: 'SNS',
            fullName: 'Simple Notification Service',
            ingat: '"Broadcast message"',
            gunaUntuk: 'Push notification ke many subscribers',
            fungsi: 'Menghantar notifikasi kepada pelbagai subscribers secara serentak',
            contohGuna: 'Alert ramai users sekaligus, trigger multiple Lambda functions',
            keywords: ['pub/sub', 'push notification', 'fan-out', 'broadcast'],
          },
          {
            shortName: 'Kinesis',
            fullName: 'Amazon Kinesis',
            ingat: '"SQS tapi real-time streaming"',
            gunaUntuk: 'Real-time data streaming & analytics',
            fungsi: 'Memproses dan menganalisis data streaming secara real-time',
            contohGuna: 'Real-time analytics, live dashboard, clickstream data',
            keywords: ['real-time', 'streaming', 'data pipeline', 'analytics'],
          },
          {
            shortName: 'API Gateway',
            fullName: 'Amazon API Gateway',
            ingat: '"Pintu masuk untuk API"',
            gunaUntuk: 'Manage & expose REST/WebSocket APIs',
            fungsi: 'Mencipta, mengurus dan mendedahkan API pada mana-mana skala',
            contohGuna: 'Frontend → API Gateway → Lambda → DynamoDB',
            keywords: ['REST API', 'WebSocket', 'API management', 'throttling'],
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
            keywords: ['IaC', 'Infrastructure as Code', 'template', 'stack', 'rollback', 'repeatable deployment'],
          },
          {
            shortName: 'SSM',
            fullName: 'AWS Systems Manager',
            ingat: '"Remote control untuk EC2 fleet"',
            gunaUntuk: 'Manage, patch, and run commands on EC2 instances at scale',
            fungsi: 'Suite alat untuk visibility dan kawalan ke atas infrastruktur AWS. Run Command jalankan commands pada existing instances tanpa SSH. Patch Manager automate OS patching. Parameter Store simpan config/secrets.',
            contohGuna: 'Perlu patch 500 EC2 instances serentak — SSM Patch Manager buat semua tanpa perlu SSH satu-satu. Run Command untuk restart service pada semua app servers.',
            scenario: '"Manage existing instances remotely, run commands without SSH, patch fleet at scale" → SSM Run Command. Bukan User Data (User Data hanya masa launch sahaja).',
            keywords: ['Run Command', 'Patch Manager', 'Parameter Store', 'Session Manager', 'no SSH', 'fleet management'],
          },
          {
            shortName: 'AWS Config',
            fullName: 'AWS Config',
            ingat: '"Audit & track apa yang berubah"',
            gunaUntuk: 'Track configuration changes and compliance of AWS resources',
            fungsi: 'Memantau dan merekod konfigurasi AWS resources dari masa ke masa. Boleh set rules untuk enforce compliance — contoh: "semua S3 mesti ada encryption". Bukan untuk run scripts.',
            contohGuna: 'Security team nak tau siapa yang ubah Security Group semalam dan bila — AWS Config simpan history semua config changes.',
            scenario: '"Audit config changes, check compliance, who changed what and when" → AWS Config. Keyword: configuration changes, compliance, audit trail, resource history.',
            keywords: ['compliance', 'audit', 'config changes', 'config rules', 'resource history', 'drift detection'],
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
            keywords: ['no commitment', 'flexible', 'short-term', 'highest cost'],
          },
          {
            shortName: 'Reserved Instances',
            fullName: 'EC2 Reserved Instances',
            ingat: '"Bayar awal, dapat diskaun besar"',
            gunaUntuk: 'Workload steady, predictable usage, 1-3 tahun',
            fungsi: 'Menyediakan diskaun sehingga 72% berbanding On-Demand dengan komitmen 1 atau 3 tahun',
            scenario: 'E-commerce company yang dah established, database server mesti run 24/7 sepanjang tahun. Jimat besar kalau commit 1-3 tahun.',
            keywords: ['1 or 3 year', 'up to 72% discount', 'predictable', 'steady state'],
          },
          {
            shortName: 'Spot Instances',
            fullName: 'EC2 Spot Instances',
            ingat: '"Harga murah tapi boleh kena interrupt"',
            gunaUntuk: 'Batch jobs, fault-tolerant workloads, flexible timing',
            fungsi: 'Menggunakan kapasiti EC2 yang tidak digunakan pada harga sehingga 90% lebih murah',
            scenario: 'Data science team nak process big dataset — tak kisah kalau interrupted. Atau render farm untuk video yang boleh resume. JANGAN guna untuk critical production server.',
            keywords: ['up to 90% discount', 'interruptible', 'batch jobs', 'fault-tolerant'],
          },
          {
            shortName: 'Savings Plans',
            fullName: 'AWS Savings Plans',
            ingat: '"Reserved tapi lebih flexible"',
            gunaUntuk: 'Commit spend per hour, flexible instance type',
            fungsi: 'Menawarkan diskaun sehingga 66% dengan komitmen penggunaan dalam USD/jam tanpa terikat instance type',
            scenario: 'Company yang nak jimat macam Reserved tapi plan nak tukar instance type atau region dalam masa terdekat. Lebih flexible dari Reserved Instances.',
            keywords: ['flexible', 'hourly commitment', 'up to 66% discount', 'compute savings'],
          },
          {
            shortName: 'Trusted Advisor',
            fullName: 'AWS Trusted Advisor',
            ingat: '"Penasihat jimat kos AWS"',
            gunaUntuk: 'Identify idle resources, cost optimization recommendations',
            fungsi: 'Menganalisis persekitaran AWS dan memberikan cadangan untuk optimasi kos, security, dan performance',
            scenario: 'CFO tanya "mana resources kita yang membazir?" — Trusted Advisor akan highlight EC2 yang underutilized, S3 buckets tak pakai, Elastic IPs yang idle, dan bagi estimate savings.',
            keywords: ['cost recommendations', 'idle resources', 'rightsizing', 'underutilized'],
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
            keywords: ['storage classes', 'lifecycle policy', 'infrequent access', 'glacier'],
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
            keywords: ['Redis', 'Memcached', 'in-memory', 'reduce DB load', 'caching'],
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
    ],
  },
  {
    href: '#domain2',
    label: 'D2 · Resilient',
    colorClass: 'text-c2',
    items: [
      { href: '#d2-ha',     label: '⚡ HA',      className: 'text-c2 border-c2/20' },
      { href: '#d2-dr',     label: '🔄 DR',      className: 'text-c5 border-c5/20' },
      { href: '#d2-backup', label: '🗂️ Backup', className: 'text-c4 border-c4/20' },
    ],
  },
  {
    href: '#domain3',
    label: 'D3 · High-Performing',
    colorClass: 'text-c1',
    items: [
      { href: '#d3-compute',   label: '🖥️ Compute',   className: 'text-c1 border-c1/20' },
      { href: '#d3-storage',   label: '💾 Storage',    className: 'text-c2 border-c2/20' },
      { href: '#d3-network',   label: '🌐 Network',    className: 'text-c4 border-c4/20' },
      { href: '#d3-messaging', label: '📨 Messaging',  className: 'text-c3 border-c3/20' },
      { href: '#d3-infra',     label: '🏗️ Infra',     className: 'text-c5 border-c5/20' },
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
