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
    id: 'wzs2-001', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A development team is designing a highly available, multi-tiered application using Amazon EC2 instances. The web-tier instances are stateless, but a separate processing-tier requires data that must be accessible even after the instance is temporarily stopped for maintenance. Furthermore, the architects want to ensure that if they need to scale the processing tier, the block storage configuration process remains simple and predictable at launch time. Which two statements correctly describe the characteristics of Amazon EC2 instance store and Amazon EBS volumes relevant to this design? (Select TWO)',
    options: [
      { id: 'a', text: 'Instance store-backed EC2 instances will persist storage across instance stop, terminate, and failures.' },
      { id: 'b', text: 'EBS-backed EC2 instances can persist storage across instance stop and start.' },
      { id: 'c', text: 'Instance store backed EC2 instances will persist storage only during instance stop and start.' },
      { id: 'd', text: 'You can specify the instance store volumes for your instance only when you launch it.' },
      { id: 'e', text: 'All available EC2 instance types support both instance store and EBS volumes.' },
    ],
    correctId: 'b,d',
    explanation: 'Two correct statements: (B) EBS volumes are network-attached persistent block storage — data survives instance stop/start and persists until the volume is explicitly deleted. This makes EBS ideal for the processing tier that must retain data across maintenance stops. (D) Instance store volumes are physically attached to the host and can only be specified at launch time — you cannot add them after an instance is running. Option A is wrong: instance store data is lost on stop, terminate, or hardware failure. Option C is wrong: instance store does NOT persist across stop (data is erased). Option E is wrong: many modern instance types (t2, t3, m5, etc.) are EBS-only.',
    reference: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html',
    keywords: ['instance store', 'EBS', 'persistent storage', 'ephemeral', 'launch time only', 'EBS-backed', 'instance store-backed'],
  },
  {
    id: 'wzs2-002', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A Solutions Architect is reviewing a proposal for a new application that will use Amazon EBS volumes for persistent storage on EC2 instances. The security requirements mandate that all data at rest in transit between the instance and the volume must be encrypted. Which of the following statements is NOT true with respect to Amazon EBS volume encryption?',
    options: [
      { id: 'a', text: 'Encrypts data at rest inside the volume.' },
      { id: 'b', text: 'Encrypts all data moving between the volume and the instance.' },
      { id: 'c', text: 'Encrypts all snapshots created from the volume.' },
      { id: 'd', text: 'Encrypted EBS volumes are not supported on all current generation instance types.' },
    ],
    correctId: 'd',
    explanation: 'Option D is NOT true. AWS documentation explicitly states: "Amazon EBS encryption is available on all current generation and previous generation instance types." EBS encryption is universally supported — there is no current generation instance type that cannot use encrypted volumes. The three TRUE statements are: (A) EBS encryption encrypts data at rest inside the volume using AES-256. (B) All data in transit between the volume and the EC2 instance is also encrypted. (C) Snapshots created from an encrypted volume are automatically encrypted.',
    reference: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption-requirements.html',
    keywords: ['EBS encryption', 'data at rest', 'data in transit', 'encrypted snapshots', 'all instance types', 'AES-256'],
  },
  {
    id: 'wzs2-003', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Hard',
    scenario: 'A company is implementing a data retention policy that requires all production data to be encrypted. They have an existing, unencrypted EBS snapshot from which they need to restore a new volume for a development environment. Encryption is not enabled by default on the account. Which of the following statements is FALSE regarding the encryption of the new EBS volume and its future snapshots?',
    options: [
      { id: 'a', text: 'You can create encrypted volumes or snapshots from unencrypted volumes or snapshots.' },
      { id: 'b', text: 'If the source snapshot is encrypted, or if the account is enabled for encryption by default, then the snapshot copy is automatically encrypted.' },
      { id: 'c', text: 'Without enabling encryption by default, a volume restored from an unencrypted snapshot is unencrypted by default.' },
      { id: 'd', text: 'Without enabling encryption by default, a volume restored from an unencrypted snapshot remains unencrypted and cannot be encrypted.' },
    ],
    correctId: 'd',
    explanation: 'Option D is FALSE. You CAN encrypt a volume when restoring from an unencrypted snapshot — simply check "Encrypt this volume" (and optionally specify a KMS key) when creating the volume from the snapshot. You do not need account-level default encryption enabled. The three TRUE statements: (A) You can explicitly create an encrypted copy of an unencrypted snapshot using "Copy Snapshot" with encryption enabled. (B) If the source is already encrypted or account default encryption is on, copies are auto-encrypted. (C) Without default encryption, a restore from an unencrypted snapshot produces an unencrypted volume by default — you must opt in.',
    reference: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html',
    keywords: ['EBS encryption', 'unencrypted snapshot', 'restore encrypted volume', 'encryption by default', 'opt-in encryption', 'snapshot copy'],
  },
  {
    id: 'wzs2-004', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A company is running a Linux-based EC2 instance for log processing, requiring high throughput. They initially provisioned a Throughput Optimized HDD (st1) EBS volume with a size of 500 GB. After a month, the log files increased significantly, and the volume is running out of space. The company needs to mitigate this situation with minimal configuration changes to the application. Which approach is the best way to resolve the storage capacity issue?',
    options: [
      { id: 'a', text: 'Add a new EBS volume, mount it on the EC2 instance, and configure the application to write logs to the new mount point.' },
      { id: 'b', text: 'Increase the size of the existing EBS volume.' },
      { id: 'c', text: 'EBS volume size cannot be changed. Build purging logic for the old log files.' },
      { id: 'd', text: 'Snapshot the existing EBS volume, detach the current volume, create a new volume from the snapshot with a bigger size, and attach it to the EC2 instance.' },
    ],
    correctId: 'b',
    explanation: 'Amazon EBS Elastic Volumes lets you increase the size of an EBS volume (including st1) while it is attached to a running EC2 instance — no downtime, no detach required. After the resize completes (state moves to "optimizing"), you extend the filesystem on the OS (e.g., growpart + resize2fs for Linux) with no application changes needed. Option C is wrong: EBS volume size CAN be increased online. Option D describes the old manual approach (snapshot → new volume → reattach) — more steps and unnecessary with Elastic Volumes. Option A requires application reconfiguration for the new mount point.',
    reference: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html',
    keywords: ['EBS Elastic Volumes', 'resize online', 'increase volume size', 'no downtime', 'st1', 'growpart', 'resize2fs', 'minimal changes'],
  },
  {
    id: 'wzs2-005', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Easy',
    scenario: 'A medical research company is conducting advanced drug discovery for cancer treatment. As part of their workflow, their Linux-based systems are storing critical research files on an Amazon EFS (Elastic File System), which serves as a shared file system for the research team. These files are extremely important and must be retained securely for at least six months. The team wants a solution that: backs up the Amazon EFS file system, simplifies backup management (creation, retention, restore, and deletion), and provides centralized backup monitoring and reporting for auditing purposes. As a Solutions Architect, which approach should you recommend to meet these requirements?',
    options: [
      { id: 'a', text: 'Use Amazon S3 File Gateway to back up the Amazon EFS file system.' },
      { id: 'b', text: 'Use AWS Backup to back up the Amazon EFS file systems.' },
      { id: 'c', text: 'Amazon FSx File Gateway to back up the Amazon EFS file systems.' },
      { id: 'd', text: 'Use Amazon S3 Transfer Acceleration to copy EFS data to an S3 bucket, then enable cross-region replication.' },
    ],
    correctId: 'b',
    explanation: 'AWS Backup is a fully managed, centralized backup service with native Amazon EFS support. It satisfies all three requirements: (1) backs up EFS file systems automatically via backup plans; (2) simplifies management with policy-based scheduling, configurable retention periods, and one-click restore; (3) provides centralized monitoring and compliance reporting via the AWS Backup console and AWS Backup Audit Manager. Option A (S3 File Gateway) bridges on-premises NFS/SMB to S3 — not for EFS backups. Option C (FSx File Gateway) is for Windows file server workloads. Option D (S3 Transfer Acceleration) is for fast S3 uploads from distant clients, not for EFS backup automation.',
    reference: 'https://docs.aws.amazon.com/efs/latest/ug/awsbackup.html',
    keywords: ['AWS Backup', 'EFS backup', 'centralized backup', 'retention policy', 'backup plan', 'audit reporting', 'restore', 'Backup Audit Manager'],
  },
]

const rows = questions.map((q, i) => {
  const options = escape(JSON.stringify(q.options))
  const expl = escape(JSON.stringify({ correct: q.explanation, incorrects: {} }))
  const keywords = escape(JSON.stringify(q.keywords))
  const reference = q.reference ? `'${escape(q.reference)}'` : 'NULL'
  const pageNumber = i + 1
  const screenshotUrl = `'/questions/wzs2/${escape(q.id)}.png'`
  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source, page_number, screenshot_url) VALUES ('${escape(q.id)}', '${q.domain}', '${escape(q.domainLabel)}', '${q.difficulty}', '${escape(q.scenario)}', '${options}', '${escape(q.correctId)}', '${expl}', ${reference}, '${keywords}', 'whizlab', ${pageNumber}, ${screenshotUrl});`
})

writeFileSync('scripts/wzs2.sql', rows.join('\n'))
console.log(`Generated ${rows.length} INSERT statements → scripts/wzs2.sql`)
