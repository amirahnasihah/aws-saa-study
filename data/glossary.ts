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
  'octet': 'Kumpulan 8 bits. IPv4 address ada 4 octets (4 × 8 = 32 bits). Nilai setiap octet = 0–255 kerana 2⁸ = 256 kemungkinan. Contoh: 192.168.100.10 → octet 1=192, octet 2=168, octet 3=100, octet 4=10',
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

  // Containers / ECS networking
  'awsvpc': 'ECS networking mode that gives each task its own ENI and private IP — enables per-task security groups and VPC Flow Logs visibility',
  'ENI': 'Elastic Network Interface — virtual network card attached to an EC2 instance or ECS task; carries a private IP, security groups, and MAC address',
  'bridge': 'Docker bridge networking mode for ECS — tasks share the EC2 host\'s network interface; does not support per-task security groups',
  'host': 'ECS networking mode where tasks share the EC2 host\'s network namespace; port conflicts possible when running multiple copies of the same task',

  // CloudHSM key terminology
  'EBK': 'Ephemeral Backup Key — AES-256 key generated inside an HSM to encrypt CloudHSM cluster backup data; exists only for the duration of the backup',
  'PBK': 'Persistent Backup Key — long-lived key stored in CloudHSM that wraps (encrypts) the EBK; encrypted backup is stored in S3 in the same region as the cluster',

  // IAM / access control
  'ABAC': 'Attribute-Based Access Control — IAM policy technique that uses resource tags (e.g. aws:ResourceTag/Environment) to grant or deny access dynamically without hard-coding ARNs',
  'NotPrincipal': 'IAM policy element that matches all principals EXCEPT those listed; used with Deny to restrict a resource to only a specified set of users/roles',

  // Web / S3
  'CORS': 'Cross-Origin Resource Sharing — browser security mechanism; an S3 CORS config specifies AllowedOrigin, AllowedMethod, and AllowedHeader to permit browser JS from a different domain to make requests',

  // Networking patterns
  'Anycast': 'IP routing method where multiple servers share the same IP addresses; network routes to the nearest one. Used by Global Accelerator — clients always reach the closest PoP automatically',
  'PoP': 'Point of Presence — AWS edge location where Global Accelerator or CloudFront receives traffic before routing it over the AWS backbone to the origin region',

  // Storage
  'DRA': 'Data Repository Association — FSx for Lustre feature linking an S3 bucket to the file system so objects are lazily imported and processed files can be exported back to S3',

  // Auto Scaling states
  'Standby state': 'ASG lifecycle state where an instance is removed from the active pool (stops receiving traffic) without being terminated — used for in-place maintenance; returns to InService when done',
  'cooldown period': 'ASG setting (default 300 s) that blocks new scaling actions after a scaling event to let the fleet stabilize before evaluating whether more scaling is needed',
  'InService': 'Normal running state for an Auto Scaling group instance — registered with the load balancer and receiving traffic',

  // VPC peering edge-to-edge routing
  'edge-to-edge routing': 'VPC peering limitation: gateways (IGW, NAT Gateway, VGW/VPN, Direct Connect, Gateway VPC endpoint) in one VPC cannot be used by resources in a peered VPC. Each VPC must have its own gateways.',
  'transitive peering': 'Attempting to route traffic through a middle VPC via two peering connections — NOT supported. If A↔B and B↔C, A cannot reach C through B. Use Transit Gateway for transitive routing.',

  // S3 versioning
  'delete marker': 'S3 versioning concept — a DELETE on a key without specifying a version ID creates a delete marker (not actual deletion); all previous versions remain and incur storage charges. To permanently remove a version, specify its version ID.',
  'noncurrent versions': 'In a versioned S3 bucket, all versions of an object that are not the current (latest) version. Lifecycle rules can expire noncurrent versions to reduce storage cost.',

  // Networking — VPC
  'secondary VPC CIDR': 'An additional IPv4 CIDR block associated with an existing VPC (up to 5 total). Used to expand IP space without recreating or migrating the VPC. New subnets are created from the secondary CIDR.',
  'SNI': 'Server Name Indication — TLS extension where the client includes the hostname in the ClientHello message. Enables a single ALB HTTPS listener to hold multiple TLS certificates and return the correct one per domain.',

  // CloudFront
  'OAC': 'Origin Access Control — CloudFront feature that restricts S3 bucket access to only the CloudFront distribution via SigV4 request signing. Supports SSE-KMS encrypted buckets (OAI does not). Bucket stays private.',
  'OAI': 'Origin Access Identity — legacy CloudFront feature to restrict S3 access; replaced by OAC. Does NOT support SSE-KMS encrypted S3 buckets.',

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
