export const glossary: Record<string, string> = {
  // Batch schedulers
  'PBS': 'Portable Batch System — traditional on-premises HPC job scheduler software',
  'Slurm': 'Simple Linux Utility for Resource Management — popular HPC cluster job scheduler',
  'LSF': 'IBM Load Sharing Facility — enterprise batch workload scheduler used on-premises',

  // AWS Services / short-forms
  'SSM': 'AWS Systems Manager — manage EC2 instances remotely without SSH; run commands, patch, configure',
  'Athena': 'Amazon Athena — serverless SQL query service that reads data directly from S3, no database needed',
  'IMDSv2': 'Instance Metadata Service v2 — more secure way to query EC2 metadata; requires a session token before fetching data',
  'IMDS': 'Instance Metadata Service — endpoint at 169.254.169.254 that provides info about the running EC2 instance',
  'STS': 'AWS Security Token Service — issues temporary credentials (access key + secret + session token)',
  'CRR': 'Cross-Region Replication — automatically copies S3 objects to a bucket in another AWS region',
  'IAM': 'Identity and Access Management — controls who (users, roles, services) can do what in AWS via policies',
  'AMI': 'Amazon Machine Image — a snapshot template (OS + software) used to launch EC2 instances',
  'EC2': 'Elastic Compute Cloud — virtual servers you rent in AWS; you choose the CPU, RAM, and OS',
  'ALB': 'Application Load Balancer — Layer 7 load balancer; routes HTTP/HTTPS by path, host header, or query string',
  'CloudFront': 'AWS Content Delivery Network — caches content at 400+ edge locations worldwide to reduce latency for users',
  'CDN': 'Content Delivery Network — a network of edge servers that cache and serve content close to users to cut latency',
  'RDS': 'Relational Database Service — managed SQL databases (MySQL, PostgreSQL, etc.) with automated backups and patching',
  'SSO': 'Single Sign-On — log in once to access multiple AWS accounts or applications without re-entering credentials',

  // Compute
  'EC2 fleet': 'A group of EC2 instances managed together, typically mixing On-Demand and Spot types',
  'Fleet': 'A group of EC2 instances managed together to meet a target capacity or cost, often mixing On-Demand and Spot',
  'Spot Instances': 'Spare EC2 capacity at up to 90% discount — AWS can reclaim them with a 2-minute interruption notice',
  'Reserved Instances': '1- or 3-year commitment to EC2 usage in exchange for up to 72% discount vs On-Demand pricing',
  'Savings Plans': 'Flexible commitment to a consistent usage amount ($/hr) for 1-3 years; applies across EC2, Lambda, Fargate',
  'Spot': 'EC2 Spot Instances — spare AWS capacity at up to 90% discount; can be interrupted with 2-min notice',
  'On-Demand': 'EC2 On-Demand — pay per second/hour with no commitment; always available, never interrupted',

  // Networking
  'SSL/TLS': 'Protocols that encrypt data travelling over a network (in transit)',
  'non-transitive': 'Routing only works directly — VPC Peering: if A peers B and B peers C, A still cannot reach C without its own peering',
  'transitive': 'Routing through a middle point — if A connects to hub and B connects to hub, A can reach B indirectly',
  'Transit Gateway': 'Central hub that connects multiple VPCs and on-premises networks with transitive routing (A↔hub↔B)',
  'VPC Peering': 'Direct private network link between two VPCs so they communicate as if on the same network; non-transitive',
  'VPC Endpoint': 'Private connection from your VPC to AWS services (e.g. S3) without going through the public internet',
  'VPC': 'Virtual Private Cloud — your own isolated network in AWS where you launch and control resources',
  'Internet Gateway': 'Allows resources in a public subnet to send and receive traffic to/from the internet',
  'IGW': 'Internet Gateway — VPC component that allows public subnet resources to reach the internet',
  'NAT Gateway': 'Network Address Translation Gateway — lets private subnet instances initiate outbound internet traffic without being publicly reachable',
  'BGP': 'Border Gateway Protocol — dynamic routing protocol that exchanges routes between networks; used in Direct Connect and VPN',
  'IPSec': 'Internet Protocol Security — encryption suite used to secure VPN tunnels over the public internet',
  'CIDR': 'Classless Inter-Domain Routing — defines an IP address range. /16 = 65 536 IPs, /24 = 256 IPs',
  'subnet': 'A subdivision of a VPC. Public subnet has a route to an Internet Gateway; private subnet has no direct internet access',
  'inbound': 'Traffic flowing INTO your resource (e.g. an HTTP request arriving at your web server)',
  'outbound': 'Traffic flowing OUT FROM your resource (e.g. your server connecting to a database)',
  'deep packet inspection': 'Inspects the full content of network packets — not just headers — to detect malware, intrusions, or policy violations',
  'intrusion prevention': 'Actively blocks detected attack patterns in network traffic in real-time before they reach the target',
  'domain filtering': 'Allows or blocks traffic based on hostnames/domains (e.g. block *.malicious.com) rather than raw IP addresses',

  // Security
  'AES-256': 'Advanced Encryption Standard 256-bit — industry-standard symmetric encryption algorithm',
  'SSL': 'Secure Sockets Layer — older protocol for encrypting data in transit (now replaced by TLS)',
  'TLS': 'Transport Layer Security — modern encryption protocol for data in transit; successor to SSL',
  'NACL': 'Network Access Control List — subnet-level firewall; stateless, evaluates every packet, supports both allow and deny rules',
  'DDoS': 'Distributed Denial of Service — overwhelming a service with traffic from thousands of sources to make it unavailable',
  'SQL injection': 'Attack where malicious SQL code is slipped into input fields to manipulate or dump a database',
  'XSS': 'Cross-Site Scripting — attacker injects scripts into web pages to steal cookies or hijack user sessions',
  'WAF': 'Web Application Firewall — filters HTTP/HTTPS requests at Layer 7 to block SQL injection, XSS, bots, and rate-limit abuse',
  'DRT': 'DDoS Response Team — AWS experts available 24/7 to help Shield Advanced customers during active attacks',
  'Layer 7': 'Application layer in the OSI model — understands HTTP, HTTPS, DNS. WAF and ALB operate here',
  'Layer 3': 'Network layer in the OSI model — handles IP routing. Shield Standard protects here against volumetric floods',
  'Layer 4': 'Transport layer in the OSI model — handles TCP/UDP ports. Shield protects SYN floods and UDP reflection attacks',

  // Encryption / Data
  'KMS': 'AWS Key Management Service — create, store, and manage encryption keys; used for data at rest encryption',
  'SSE-KMS': 'Server-Side Encryption with KMS — objects/data are encrypted at rest automatically using keys in AWS KMS',
  'CMK': 'Customer Managed Key — a KMS key you create and control (rotation, policies, auditing), vs AWS-managed keys',
  'WORM': 'Write Once Read Many — data can be written exactly once and never modified or deleted after',
  'envelope encryption': 'Data encrypted with a data key; the data key is encrypted by a KMS master key. Only the encrypted data key is stored alongside data',
  'Compliance mode': 'S3 Object Lock mode where NO user — not even root — can shorten or delete the retention period',
  'Governance mode': 'S3 Object Lock mode where users with special IAM permissions can override retention, unlike Compliance mode',
  'legal hold': 'An S3 Object Lock flag that blocks deletion indefinitely with no fixed expiry — removed only when explicitly released',
  'retention period': 'The fixed time window during which an S3 object cannot be deleted or overwritten (used with Object Lock)',

  // Database / HA
  'Multi-AZ': 'Multi-Availability Zone — synchronous standby replica in a different AZ; automatic failover for high availability',
  'Read Replica': 'Asynchronous read-only copy of a database — offloads read queries; can exist in a different region',
  'Availability Zone': 'Isolated data centre cluster within an AWS Region. Each Region has 3+ AZs for redundancy',
  'RPO': 'Recovery Point Objective — maximum acceptable data loss in time. RPO = 1 hour means you can afford to lose 1 hour of data',
  'RTO': 'Recovery Time Objective — maximum acceptable downtime. RTO = 4 hours means systems must be back up within 4 hours',

  // Storage
  'EBS': 'Elastic Block Store — persistent block storage (like a virtual hard drive) attached to one EC2 instance',
  'EFS': 'Elastic File System — managed NFS file system that can be shared across multiple EC2 instances simultaneously',
  'IOPS': 'Input/Output Operations Per Second — measures storage throughput. Higher IOPS = faster reads/writes (important for databases)',

  // Architecture patterns
  'stateful': 'Remembers connection state — allowed return traffic is automatically permitted without an explicit rule (like Security Groups)',
  'stateless': 'Does not track connections — every packet is evaluated independently against rules, both directions need rules (like NACLs)',

  // Security concepts & policy
  'bastion host': 'EC2 in a public subnet used as the only SSH/RDP entry point into private subnet instances — connect to bastion first, then hop to private instances',
  'jump host': 'Another name for a bastion host — a hardened EC2 in a public subnet that you jump through to reach private subnet instances',
  'Elastic IP': 'Static public IPv4 address allocated to your AWS account — stays fixed until released, survives instance stop/start; NAT Gateway requires one',
  'penetration testing': 'Authorised simulated attack to find vulnerabilities — AWS allows pentest on 8 services (EC2, RDS, CloudFront, Aurora, API GW, Lambda, Lightsail, Elastic Beanstalk) without prior approval',
  'AUP': 'AWS Acceptable Use Policy — defines what is permitted and prohibited on AWS infrastructure, including security testing rules',
}
