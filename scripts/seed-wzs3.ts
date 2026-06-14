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
    id: 'wzs3-001', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'You have an existing Amazon EFS file system with mount targets configured in your production VPC (VPC A) in us-east-1. Your organization needs to replicate the exact production setup in a new, separate VPC (VPC B) within the same us-east-1 region, and the new EC2 instances in VPC B must access the existing EFS volume. How can you achieve this access while minimizing resource duplication?',
    options: [
      { id: 'a', text: 'Attach the new VPC (VPC B) to the existing EFS; create new mount targets for the new VPC, and mount EFS on the EC2 instances within VPC B.' },
      { id: 'b', text: 'Create a new VPC (VPC B). Establish a VPC peering connection between VPC A and VPC B. Use the instances created in VPC B to access the already existing mount targets in VPC A.' },
      { id: 'c', text: 'EFS is available for all VPCs within a region by default. Mount EFS on the new EC2 instances and configure the EFS security group to allow inbound traffic from VPC B.' },
      { id: 'd', text: 'EFS can only be used within one VPC at a time. You need to launch EC2 instances in the existing VPC (VPC A).' },
    ],
    correctId: 'a',
    explanation: 'An EFS file system can have mount targets in multiple VPCs. To access the existing EFS from VPC B, create new EFS mount targets in subnets of VPC B — this uses the same file system (no duplication), adds only lightweight mount target endpoints. EC2 instances in VPC B then mount EFS using the VPC B mount target DNS name or IP. Option B (VPC peering to VPC A mount targets) is technically possible but requires manual IP-based mounting workarounds and adds networking complexity. Option C is wrong: EFS is not available across VPCs by default. Option D is wrong: EFS supports multiple VPCs via separate mount targets.',
    reference: 'https://docs.aws.amazon.com/efs/latest/ug/mount-fs-different-vpc.html',
    keywords: ['EFS', 'mount target', 'multi-VPC', 'cross-VPC EFS', 'minimize duplication', 'same EFS file system'],
  },
  {
    id: 'wzs3-002', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Hard',
    scenario: 'A Solutions Architect has established a VPC peering connection between two VPCs located in different AWS Regions (VPC A and VPC B). An EFS file system has been created in VPC A. When attempting to mount the EFS file system onto an EC2 instance in VPC B, the connection fails with a "connection timed out" error. What are two potential causes for this connection timeout? (Select TWO)',
    options: [
      { id: 'a', text: 'AWS EFS takes up to an hour after creation to make mount targets available.' },
      { id: 'b', text: 'The Security Group on the EFS mount target does not have inbound NFS port (TCP 2049) open to the EC2 instances in VPC B.' },
      { id: 'c', text: 'The Security Group is improperly configured for the EFS mount target, preventing inbound traffic from the peered VPC.' },
      { id: 'd', text: 'EFS cannot be mounted through VPC peering, especially across different regions.' },
      { id: 'e', text: 'The VPC peering connection is not configured to support DNS resolution.' },
    ],
    correctId: 'b,c',
    explanation: 'A "connection timed out" error means TCP packets are being sent but not receiving a response — this is a network-level block, not a DNS failure. Two valid causes: (B) The EFS mount target security group must have inbound TCP 2049 (NFS) open to the CIDR range of VPC B. Without this rule, NFS connection attempts time out. (C) A general SG misconfiguration on the EFS mount target that blocks the peered VPC\'s traffic also causes timeout. Option A is wrong: EFS mount targets are available immediately after creation. Option E (DNS configuration) would cause a DNS resolution failure or "cannot resolve hostname" error — not a connection timeout. Option D is partially misleading: EFS can be accessed via cross-region VPC peering, but requires using mount target IP addresses and proper SG/route configuration.',
    reference: 'https://docs.aws.amazon.com/efs/latest/ug/mount-fs-different-vpc.html',
    keywords: ['EFS mount target', 'security group', 'NFS TCP 2049', 'connection timeout', 'VPC peering', 'cross-region EFS', 'inbound NFS'],
  },
  {
    id: 'wzs3-003', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'An organization using a newly created Amazon EFS file system with default settings must comply with regulatory policies that mandate encryption of data during transit. What is the necessary action to enable encryption for data moving between the EC2 instance and the EFS file system?',
    options: [
      { id: 'a', text: 'AWS EFS uses the NFS protocol, which encrypts the data in transit by default.' },
      { id: 'b', text: 'Edit the EFS configuration in the console to enable the "encryption during transit" setting.' },
      { id: 'c', text: 'Encryption during transit can only be enabled during EFS creation. You need to create a new encrypted EFS, copy the data, and delete the old EFS.' },
      { id: 'd', text: 'Encryption during transit can be enabled when mounting the file system using the Amazon EFS mount helper, which uses TLS version 1.2.' },
    ],
    correctId: 'd',
    explanation: 'EFS encryption in transit is NOT enabled by default and is NOT configured in the EFS console. It is enabled at mount time by using the Amazon EFS mount helper with the -o tls option: "sudo mount -t efs -o tls fs-12345678 /mnt/efs". The mount helper uses TLS 1.2 with AES-256 to encrypt all NFS traffic between the EC2 instance and the EFS mount target. This can be applied to any existing EFS file system — no recreation needed. Option A is wrong: NFS itself does not encrypt data in transit. Option B is wrong: there is no "encryption during transit" toggle in the EFS console.',
    reference: 'https://docs.aws.amazon.com/efs/latest/ug/encryption-in-transit.html',
    keywords: ['EFS encryption in transit', 'TLS 1.2', 'mount helper', 'amazon-efs-utils', '-o tls', 'NFS not encrypted by default'],
  },
  {
    id: 'wzs3-004', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A company is building a web application that serves static and dynamic content across 20 load-balanced EC2 instances. The content is stored on a shared Amazon EFS volume. A key requirement for the application is to have low latency when retrieving and serving content to web users. Which Amazon EFS performance mode is the best choice for this situation?',
    options: [
      { id: 'a', text: 'Max I/O Performance Mode' },
      { id: 'b', text: 'General Purpose Performance Mode' },
      { id: 'c', text: 'Bursting Throughput Mode' },
      { id: 'd', text: 'Provisioned Throughput Mode' },
    ],
    correctId: 'b',
    explanation: 'General Purpose performance mode provides the lowest per-operation latency and is the recommended default for all EFS file systems, including web serving and content management workloads. AWS documentation states: "Due to the higher per-operation latencies with Max I/O, we recommend using General Purpose performance mode for all file systems." Max I/O is a previous-generation mode designed for highly parallelized workloads with hundreds of concurrent connections that can tolerate higher latency — not appropriate for a 20-instance web application where low latency is the priority. Note: Bursting and Provisioned are throughput modes, not performance modes.',
    reference: 'https://docs.aws.amazon.com/efs/latest/ug/performance.html',
    keywords: ['EFS performance mode', 'General Purpose', 'Max I/O', 'low latency', 'per-operation latency', 'web serving'],
  },
  {
    id: 'wzs3-005', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A team is building a content-serving web application (total content size not exceeding 25 GB) on 5 load-balanced EC2 instances. They chose EFS for common content storage. The content is accessed very frequently by a large number of users, meaning the application will have high throughput demands relative to the file system\'s small size. Which EFS throughput mode should the architect choose to ensure that the application on the EC2 instances can transfer data to EFS without any performance bottleneck?',
    options: [
      { id: 'a', text: 'Throughput mode = Bursting, provides a consistent high throughput for smaller data sizes.' },
      { id: 'b', text: 'General Purpose Performance Mode' },
      { id: 'c', text: 'Throughput mode = Provisioned, you can configure specific throughput irrespective of EFS data size.' },
      { id: 'd', text: 'Max I/O Performance Mode' },
    ],
    correctId: 'c',
    explanation: 'Provisioned Throughput mode lets you specify the exact throughput level the file system can sustain, independent of storage size. With Bursting mode, baseline throughput is only 50 KiB/s per GiB — for a 25 GB file system that is only ~1.25 MiB/s, far too low for high-frequency access by many users. Provisioned throughput fixes this by letting you provision, say, 100–500 MiB/s regardless of the 25 GB file system size. Use Provisioned when "your application drives throughput at an average-to-peak ratio of 5% or more" or when throughput requirements exceed what the file system size can generate with Bursting. Options B and D are performance modes (not throughput modes). Option A is wrong: Bursting does NOT provide consistent high throughput for small file systems — it provides very low baseline throughput for small files.',
    reference: 'https://docs.aws.amazon.com/efs/latest/ug/performance.html',
    keywords: ['EFS Provisioned Throughput', 'Bursting Throughput', 'small file system', 'high throughput demand', 'throughput mode', '50 KiB per GiB', 'performance bottleneck'],
  },
]

const rows = questions.map((q, i) => {
  const options = escape(JSON.stringify(q.options))
  const expl = escape(JSON.stringify({ correct: q.explanation, incorrects: {} }))
  const keywords = escape(JSON.stringify(q.keywords))
  const reference = q.reference ? `'${escape(q.reference)}'` : 'NULL'
  const pageNumber = i + 1
  const screenshotUrl = `'/questions/wzs3/${escape(q.id)}.png'`
  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source, page_number, screenshot_url) VALUES ('${escape(q.id)}', '${q.domain}', '${escape(q.domainLabel)}', '${q.difficulty}', '${escape(q.scenario)}', '${options}', '${escape(q.correctId)}', '${expl}', ${reference}, '${keywords}', 'core', ${pageNumber}, ${screenshotUrl});`
})

writeFileSync('scripts/wzs3.sql', rows.join('\n'))
console.log(`Generated ${rows.length} INSERT statements → scripts/wzs3.sql`)
