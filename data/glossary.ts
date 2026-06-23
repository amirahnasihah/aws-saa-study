export const glossaryCategories: Record<string, string[]> = {
  'AWS Services':       ['SSM','Athena','STS','CRR','IAM','AMI','EC2','ALB','CloudFront','CDN','RDS','SSO','KMS','SSE-KMS','CMK','AWS Backup','AWS DMS','Secrets Manager','AWS DataSync','AWS Transfer Family','AWS Migration Hub','AWS Snow Family'],
  'Compute':            ['EC2 fleet','Fleet','Spot Instances','Reserved Instances','Savings Plans','Spot','On-Demand','instance store','EBS-backed','instance store-backed','Elastic Volumes','EBS snapshot','IMDSv2','IMDS','Cold start','Provisioned Concurrency','Reserved Concurrency','Lambda Layer','Fargate','EC2 Placement Group','Spot interruption','Standby state','cooldown period','InService'],
  'Networking':         ['SSL/TLS','non-transitive','transitive','Transit Gateway','VPC Peering','VPC Endpoint','VPC','Internet Gateway','IGW','NAT Gateway','BGP','IPSec','CIDR','octet','subnet','inbound','outbound','deep packet inspection','intrusion prevention','domain filtering','Anycast','PoP','secondary VPC CIDR','SNI','VPC Link','edge-to-edge routing','transitive peering','PrivateLink','Egress','Ingress','FQDN','Latency','Throughput'],
  'Security':           ['AES-256','SSL','TLS','NACL','DDoS','SQL injection','XSS','WAF','DRT','Layer 7','Layer 3','Layer 4','ABAC','NotPrincipal','CORS','bastion host','jump host','penetration testing','AUP'],
  'Security Services':  ['Amazon GuardDuty','Amazon Inspector','Amazon Macie','AWS Shield','Amazon Cognito','AWS Directory Service','ACM','AWS RAM','CloudHSM'],
  'Storage':            ['EBS','EFS','EFS General Purpose','EFS Max I/O','EFS Bursting Throughput','EFS Provisioned Throughput','EFS Elastic Throughput','EFS mount helper','IOPS','Elastic Volumes','EBS snapshot','WORM','DRA'],
  'Encryption':         ['envelope encryption','Compliance mode','Governance mode','legal hold','retention period','EBK','PBK'],
  'Database & HA':      ['Multi-AZ','Read Replica','Availability Zone','RPO','RTO','RDS Multi-AZ','Aurora Serverless','Aurora Replicas','DynamoDB PITR','DynamoDB Auto Scaling','CloudFormation DeletionPolicy','RDS Proxy','Partition Key','Sort Key','Item Collection','GSI','LSI','Memcached','Lazy Loading','Write-Through'],
  'Containers':         ['awsvpc','ENI','bridge','host'],
  'Messaging':          ['SQS Long Polling','SQS Short Polling','Visibility Timeout','SQS FIFO','Dead Letter Queue','SNS fan-out','SNS Message Filtering','SNS FIFO Topic','Step Functions','Step Functions Standard','Step Functions Express','EventBridge Schema Registry','EventBridge Pipes','EventBridge Scheduler','Amazon MQ','AWS AppSync','AWS Amplify','GraphQL','API Gateway throttling','API caching','Lambda authorizer','Usage Plan'],
  'CloudFront':         ['OAC','OAI'],
  'ML / AI':            ['Amazon Comprehend','Amazon Lex','Amazon Textract','Amazon Kendra','Amazon Rekognition','Amazon Polly','Amazon Translate','Amazon Transcribe','Amazon Bedrock','Amazon SageMaker'],
  'Analytics':          ['Amazon Redshift','Redshift Spectrum','Amazon Athena','Amazon EMR','AWS Glue','Glue Data Catalog','Glue Crawler','Amazon QuickSight','SPICE','Amazon Kinesis Data Streams','Amazon Data Firehose','Managed Service for Apache Flink','Amazon OpenSearch Service','Amazon MSK','AWS Data Exchange','Data Lake','OLAP','OLTP','MPP','columnar','Parquet'],
  'Management & Gov':   ['AWS Organizations','SCP','Amazon CloudWatch','AWS CloudTrail','AWS Config','AWS CloudFormation','StackSets','AWS Trusted Advisor','AWS Compute Optimizer','AWS Control Tower','AWS Health Dashboard'],
  'Cost Management':    ['AWS Cost Explorer','AWS Budgets','Cost and Usage Report','Cost Allocation Tags'],
  'Architecture':       ['stateful','stateless','Elastic IP','Backup and Restore','Pilot Light','Warm Standby','Active/Active','IaC','Blue/Green deployment','Canary deployment','Fan-out','Event-driven','Idempotency','Elasticity','Fault tolerance','Shared Responsibility Model','Serverless','Microservices','Containerization'],
  'IAM & Policies':     ['ARN','Principal','Identity-based policy','Resource-based policy','Permissions boundary','Managed policy','Inline policy','Trust policy','OU (Organizational Unit)','Permission denied','ABAC','NotPrincipal'],
  'Load Balancers':     ['ALB','NLB','CLB','Target Group'],
  'S3 Features':        ['Pre-signed URL','S3 Versioning','S3 Lifecycle Policy','S3 Transfer Acceleration','SRR','delete marker','noncurrent versions','CORS'],
  'HPC / Batch':        ['PBS','Slurm','LSF'],
}

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
  'Reserved Instances': '1- or 3-year commitment to a specific EC2 instance config. Standard RIs: up to 72% off On-Demand. Convertible RIs: up to 66% off (can change instance family/OS). All Upfront gives max discount.',
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

  // Security services (threat detection, identity, certs)
  'Amazon GuardDuty': 'Intelligent THREAT DETECTION — continuously analyzes CloudTrail, VPC Flow Logs, and DNS logs with ML to flag anomalies (crypto-mining, compromised instances, recon). Log-based detection, agentless. NOT a vuln scanner (Inspector) or PII finder (Macie).',
  'Amazon Inspector': 'Automated VULNERABILITY SCANNING for EC2, ECR container images, and Lambda — checks against CVEs and network exposure. Software/CVE focus. NOT log-based threat detection (GuardDuty).',
  'Amazon Macie': 'Uses ML to discover and classify SENSITIVE DATA (PII, credentials) in S3 buckets. Data-privacy focus, S3-specific. NOT threat detection (GuardDuty) or vuln scanning (Inspector).',
  'VPC Flow Logs': 'Captures METADATA about IP traffic to/from network interfaces (srcaddr, dstaddr, ports, protocol, bytes, ACCEPT/REJECT) — NOT packet payload. Enable at VPC, subnet, or ENI level; send to CloudWatch Logs, S3, or Data Firehose. Use to troubleshoot SG/NACL (look for REJECT), security analysis, and as a source for GuardDuty/Detective. For actual packet content use Traffic Mirroring.',
  'AWS Shield': 'Managed DDoS protection. Shield Standard = free, automatic, Layer 3/4 (volumetric). Shield Advanced = paid, adds Layer 7 protection, DRT access, and cost-protection for scaling during an attack.',
  'Amazon Cognito': 'Authentication for web/mobile apps. User Pools = sign-up/sign-in directory (who you are, authN). Identity Pools = exchange that identity for temporary AWS credentials (what you can access, authZ). Supports social/SAML federation.',
  'AWS Directory Service': 'Managed Microsoft Active Directory in AWS. Managed Microsoft AD = full AD in cloud. AD Connector = proxy to on-prem AD (data stays on-prem). Simple AD = lightweight Samba-based, standalone.',
  'ACM': 'AWS Certificate Manager — provision, manage, and auto-renew free public SSL/TLS certificates for ELB, CloudFront, and API Gateway. For CloudFront the cert MUST be in us-east-1. Cannot export public certs.',
  'AWS RAM': 'Resource Access Manager — securely SHARE resources across accounts without duplicating them (e.g. VPC subnets, Transit Gateway, Route 53 Resolver rules, License Manager configs). Often paired with Organizations.',
  'CloudHSM': 'Dedicated, single-tenant hardware security module — you have FULL control of keys (FIPS 140-2 Level 3). Use when compliance forbids shared/multi-tenant KMS. KMS is easier and multi-tenant; CloudHSM is for strict custody requirements.',

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
  'EFS General Purpose': 'EFS performance mode with the LOWEST per-operation latency. Recommended for all workloads including web serving, CMS, and data sharing. AWS explicitly recommends General Purpose over Max I/O for all file systems.',
  'EFS Max I/O': 'Previous-generation EFS performance mode with HIGHER per-operation latency but higher aggregate throughput. For massively parallel HPC workloads with hundreds/thousands of concurrent connections. NOT recommended when low latency is required.',
  'EFS Bursting Throughput': 'EFS throughput mode that scales with storage size: baseline 50 KiB/s per GiB stored. A 25 GB file system gets only ~1.25 MiB/s baseline — insufficient for high-throughput workloads. Burst credits allow temporary higher throughput.',
  'EFS Provisioned Throughput': 'EFS throughput mode where you specify the exact throughput (in MiB/s) regardless of file system size. Use when throughput requirements exceed what Bursting provides for your storage size.',
  'EFS Elastic Throughput': 'Recommended EFS throughput mode that automatically scales throughput up and down based on workload. Pay per use. No need to provision or manage throughput limits.',
  'EFS mount helper': 'amazon-efs-utils tool that simplifies EFS mounting. Supports -o tls flag to enable encryption in transit via TLS 1.2 + AES-256. Usage: sudo mount -t efs -o tls fs-xxxx /mnt/efs',
  'IOPS': 'Input/Output Operations Per Second — measures storage throughput. Higher IOPS = faster reads/writes (important for databases)',
  'instance store': 'Ephemeral, physically attached storage on the EC2 host. Data is LOST on instance stop, terminate, or hardware failure. Can only be configured at launch time. Faster than EBS (local NVMe) but non-persistent.',
  'EBS-backed': 'EC2 instance whose root volume is an EBS volume — data persists across stop/start, survives instance termination (if DeleteOnTermination=false)',
  'instance store-backed': 'EC2 instance whose root volume is an instance store — data is lost on stop or termination. Rare in modern workloads.',
  'Elastic Volumes': 'EBS feature allowing you to increase volume size, change volume type, or adjust IOPS/throughput on a live, attached volume — no downtime, no detach required. After resize, extend the OS filesystem (growpart + resize2fs on Linux).',
  'EBS snapshot': 'Point-in-time backup of an EBS volume stored in S3. Incremental — only changed blocks are saved after the first snapshot. Used to create new volumes or copy data across regions.',
  'AWS Backup': 'Centralized managed backup service supporting EFS, EBS, RDS, DynamoDB, S3, FSx, EC2 AMIs, and more. Provides policy-based scheduling, retention rules, cross-region/cross-account copies, restore, and compliance reporting via Backup Audit Manager.',

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
  'ASG Lifecycle Hook': 'Auto Scaling mechanism that pauses an instance in a wait state during a transition so custom actions can run before it proceeds. Two wait states: Pending:Wait (before InService — bootstrap, install, register) and Terminating:Wait (before termination — drain connections, flush logs, cleanup). Actions run via EventBridge+Lambda, SSM Run Command, or local scripts; you call CompleteLifecycleAction (or wait out the default 1-hour timeout) to continue. Distinct from a lifecycle state.',
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

  // API Gateway
  'VPC Link': 'API Gateway feature that creates a private connection between API Gateway and a Network Load Balancer (NLB) inside a VPC. Enables private integration: API Gateway → VPC Link → NLB → backend (EC2, ECS, or on-premises via Direct Connect). No public internet traffic.',
  'API Gateway throttling': 'API Gateway rate limiting: steady-state rate (requests/sec) + burst rate (spike capacity). Protects backend from overload. Configured per stage or per method. Returns HTTP 429 Too Many Requests when exceeded.',
  'API caching': 'API Gateway can cache endpoint responses for a configurable TTL (300s default). Reduces backend calls for repeated identical requests. Cache capacity: 0.5 GB–237 GB. Supports encryption at rest.',
  'Lambda authorizer': 'Custom API Gateway access control via a Lambda function. Two types: TOKEN (bearer token like JWT/OAuth) and REQUEST (uses request params like headers/query strings). Returns IAM policy allowing/denying access.',
  'Usage Plan': 'API Gateway feature to control access via API keys: sets throttling limits (rate/burst) and quota (max requests/day/week/month) per API key. Used to monetize or tier API access.',

  // App Integration / Messaging
  'SQS Long Polling': 'SQS ReceiveMessage waits up to 20 seconds for a message before returning. Reduces API calls and cost vs short polling (which returns immediately even if queue empty). Set ReceiveMessageWaitTimeSeconds > 0.',
  'SQS Short Polling': 'Default SQS behavior — ReceiveMessage returns immediately even if no messages are available. Results in many empty responses and high API call costs for frequently polled queues.',
  'Visibility Timeout': 'Period during which SQS hides a retrieved message from other consumers (default 30s, max 12 hours). Must exceed processing time to prevent duplicate processing. Extend per-message with ChangeMessageVisibility.',
  'SQS FIFO': 'SQS First-In-First-Out queue: guarantees strict message ordering within a MessageGroupId and exactly-once processing (5-min deduplication window). Max 3000 TPS with batching. Use for ordered, deduplicated processing.',
  'Dead Letter Queue': 'SQS/SNS queue for messages that fail processing after max receive count. Used for debugging and isolating problematic messages. Configure via RedrivePolicy on the source queue.',
  'SNS fan-out': 'Pattern where one SNS topic fans out to multiple SQS queues, Lambda functions, or HTTP endpoints simultaneously. Enables parallel processing of the same message by multiple subscribers.',
  'Step Functions': 'AWS serverless workflow orchestration service. Coordinates Lambda functions, ECS tasks, and other services in multi-step workflows with built-in error handling, retries, branching, and parallel execution. Two types: Standard (exactly-once, up to 1 year) and Express (at-least-once, up to 5 min).',

  // Database
  'RDS Multi-AZ': 'High availability feature: synchronous standby replica in a different AZ. Failover is automatic — the endpoint CNAME is updated to point to the standby. Standby is NOT accessible for reads.',
  'Aurora Serverless': 'Aurora capacity mode that automatically scales compute up/down based on demand and can pause when idle. Ideal for intermittent, unpredictable, or infrequent workloads. v2 scales in fine-grained ACU increments.',
  'DynamoDB PITR': 'DynamoDB Point-in-Time Recovery: enables continuous incremental backups. Restore to any second in the last 35 days. No performance impact. Provides RPO near-zero. Different from on-demand backups.',
  'DynamoDB Auto Scaling': 'Automatically adjusts DynamoDB provisioned read/write capacity units based on actual traffic using AWS Application Auto Scaling. Set target utilization % and min/max capacity bounds.',
  'AWS DMS': 'AWS Database Migration Service: migrates databases to AWS with minimal downtime. Supports homogeneous (MySQL→MySQL) and heterogeneous (Oracle→Aurora) migrations. CDC (Change Data Capture) mode keeps source and target synchronized during cutover.',
  'AWS DataSync': 'Automated data transfer service for migrating data between on-premises (NFS/SMB/HDFS) and AWS (S3/EFS/FSx). Also handles EFS-to-EFS cross-region replication over AWS private network. Includes scheduling, verification, and network optimization. NOT for ongoing hybrid access (use Storage Gateway) or database migration (use DMS).',
  'AWS Transfer Family': 'Fully managed SFTP, FTPS, FTP, and AS2 endpoints that store files directly into S3 or EFS. Lets partners/users transfer files using legacy protocols without code changes. NOT for bulk data migration (use DataSync) or hybrid storage (use Storage Gateway).',
  'AWS Migration Hub': 'Central dashboard to track application migrations across multiple AWS tools (DMS, MGN, DataSync). Does NOT perform migrations itself — only tracks progress. Requires a home region for storing tracking data. Includes Strategy Recommendations and Orchestrator.',
  'AWS Snow Family': 'Physical devices for offline data transfer and edge computing: Snowcone (8-14TB, portable), Snowball Edge Storage Optimized (210TB), Snowball Edge Compute Optimized (28TB, 104 vCPUs). Data encrypted with KMS. Rule of thumb: if internet transfer takes >1 week, consider Snow Family.',
  'CloudFormation DeletionPolicy': 'Attribute on a CloudFormation resource that controls what happens when the resource is deleted: Delete (default), Retain (keep resource), Snapshot (create final snapshot — supported by RDS, EBS, ElastiCache, not S3).',
  'Secrets Manager': 'AWS service for storing and automatically rotating secrets (database passwords, API keys). Built-in rotation for RDS/Aurora/Redshift/DocumentDB via managed Lambda rotation function. Charged per secret per month.',
  'Aurora Replicas': 'Read-only replicas within an Aurora cluster. Serve read traffic with typically <10ms lag. Can be scaled automatically with Aurora Auto Scaling based on CPU/connections. Up to 15 replicas per cluster.',
  'RDS Proxy': 'Fully managed connection pooler that sits between an application and RDS/Aurora. Multiplexes many app-side connections into a smaller pool of DB connections — fixes "too many connections" from Lambda or Auto Scaling fleets, and speeds up failover.',
  'Partition Key': "DynamoDB's hash key (also called the 'hash attribute') — determines which physical partition an item is stored in. High-cardinality values spread traffic evenly and avoid a 'hot partition'.",
  'Sort Key': "DynamoDB's range key (also called the 'range attribute') — the second part of a composite primary key. Items with the same partition key are stored together, sorted by this value, enabling efficient range queries.",
  'Item Collection': 'All items in a DynamoDB table (or table + its LSIs) that share the same partition key value. Stored together, sorted by sort key. The 10GB-per-partition-key-value limit for LSIs applies to the whole item collection.',
  'GSI': 'Global Secondary Index — DynamoDB index with a partition/sort key DIFFERENT from the base table. Can be added or removed at any time and has its own provisioned throughput.',
  'LSI': 'Local Secondary Index — DynamoDB index with the SAME partition key as the base table but a different sort key. Must be defined at table creation; limited to 10GB per partition key value.',
  'Memcached': 'ElastiCache engine option: multi-threaded, simple key-value cache with NO persistence and NO replication. Data is lost if a node restarts. Use for simple, horizontally-scaled caching where durability does not matter.',
  'Lazy Loading': 'Caching strategy: data is loaded into the cache only on a cache miss (app queries cache → miss → queries DB → writes result back to cache). Avoids filling the cache with unused data, but a cache miss costs 3 round trips and data can go stale.',
  'Write-Through': 'Caching strategy: every write to the database is also written to the cache immediately. Cache data stays fresh and there is no cache-miss penalty for written data, but the cache can fill with rarely-read data and writes get slower.',

  // ML / AI services
  'Amazon Comprehend': 'AWS managed NLP service: sentiment analysis, entity recognition, key phrase extraction, topic modeling, language detection. No ML expertise needed. Analyzes text from support tickets, social media, documents.',
  'Amazon Lex': 'Conversational AI service for building chatbots and voice interfaces. Provides NLU (Natural Language Understanding) + ASR (speech recognition). Powers Amazon Alexa. Manages multi-turn conversation state.',
  'Amazon Textract': 'Extracts text and structured data from scanned documents (PDF, images). Goes beyond OCR: extracts key-value pairs from forms and data from tables. Used for invoice/contract/report processing.',
  'Amazon Kendra': 'Intelligent enterprise search service powered by ML. Indexes and searches across diverse data sources (S3, SharePoint, databases) including unstructured documents (PDF, Word, email). Natural language query understanding.',
  'Amazon Rekognition': 'Image and video analysis service. Detects objects, scenes, faces, text, and explicit content. Facial recognition and comparison. NOT for document text extraction (use Textract) or NLP (use Comprehend).',
  'Amazon Polly': 'Text-to-speech service: converts written text to lifelike audio. Supports multiple voices and languages. NOT for chatbots (use Lex) or text analysis (use Comprehend).',
  'Amazon Translate': 'Neural machine translation service: converts text between languages (e.g. English ↔ Japanese). Real-time and batch. NOT speech (pair with Transcribe for audio→text→translate) or sentiment (use Comprehend).',
  'Amazon Transcribe': 'Automatic speech recognition (ASR): converts audio/video speech to text. Speaker identification, custom vocabulary, call-centre analytics. NOT text-to-speech (use Polly) or translation (use Translate).',
  'Amazon Bedrock': 'Fully managed service for building generative AI apps using foundation models (FMs) from Amazon and third parties (Anthropic, Meta, etc.) via a single API. Supports fine-tuning and RAG (Knowledge Bases) without managing infrastructure. NOT for training models from scratch (use SageMaker).',
  'Amazon SageMaker': 'End-to-end managed platform to build, train, and deploy CUSTOM ML models (your data, your algorithm/framework) — includes data prep, training, hyperparameter tuning, and real-time/batch/serverless deployment endpoints. Different from pre-built AI services (Polly, Rekognition, Comprehend) which need no training, and from Bedrock (foundation models via API, not training from scratch).',

  // Analytics
  'Amazon MSK': 'Managed Streaming for Apache Kafka — fully managed Kafka cluster on AWS. Handles broker provisioning, patching, storage scaling. NO SSH to brokers. Lambda integration requires Event Source Mapping. MSK Serverless auto-scales capacity.',
  'Amazon OpenSearch Service': 'Managed Elasticsearch/OpenSearch cluster. Full-text search with relevance scoring, spell-checking, synonym support, fuzzy matching. Used for e-commerce product search, log analytics, application monitoring.',
  'AWS Data Exchange': 'AWS marketplace for subscribing to and accessing third-party data products (market data, financial data, regulatory filings). Data delivered directly to your S3 bucket. Handles licensing and subscription management.',
  'Amazon Kinesis Data Streams': 'Real-time data streaming service. Captures GB/s of data with sub-second latency. Retains data 1–365 days. Integrates with Lambda, Firehose, Analytics. Use for real-time dashboards, ML, and event-driven architectures.',
  'AWS Glue': 'Serverless ETL (Extract, Transform, Load) service. Crawls data sources to build a metadata catalog, runs Spark-based transformation jobs, and orchestrates data pipelines. NOT a streaming or search service.',
  'Amazon Redshift': 'Petabyte-scale data warehouse for OLAP analytics. Columnar storage + compression + Massively Parallel Processing (MPP) make large aggregate/join queries fast. NOT for transactions (OLTP → RDS/Aurora). Variants: RA3 (compute/storage separate), Redshift Serverless (no cluster to manage).',
  'Redshift Spectrum': 'Redshift feature that queries data directly in S3 without loading it into the cluster. Lets a single SQL query join warehouse tables with data-lake files in S3. Contrast with Athena, which is standalone/serverless and needs no Redshift cluster.',
  'Amazon EMR': 'Elastic MapReduce — managed cluster platform for big-data frameworks (Spark, Hadoop, Hive, Presto, HBase). You control cluster size and instance types. Master/core/task node roles; task nodes commonly run on Spot to cut cost. Use for custom big-data processing vs serverless ETL (Glue).',
  'Amazon QuickSight': 'Serverless business-intelligence (BI) service for dashboards and visualizations. Connects directly to S3, Athena, Redshift, RDS. SPICE in-memory engine for fast queries; ML Insights adds anomaly detection and forecasting without separate ML infrastructure.',
  'Amazon Data Firehose': 'Formerly Kinesis Data Firehose. Fully managed, near-real-time delivery of streaming data to S3, Redshift, OpenSearch, or Splunk. No code, no servers, auto-scaling; optional Lambda transform and format conversion (e.g. JSON → Parquet). Buffers by size/time (min ~60s) — not sub-second.',
  'Managed Service for Apache Flink': 'Formerly Kinesis Data Analytics. Processes and analyzes streaming data in real time using SQL or Apache Flink (e.g. windowed aggregations, filtering, enrichment) before delivery downstream.',
  'Glue Data Catalog': 'Central metadata store (databases, tables, schemas) for data assets across S3, RDS, Redshift. Shared by Athena, Redshift Spectrum, and EMR. Stores WHAT data exists and its schema — not the data itself, and not access control (→ Lake Formation).',
  'Glue Crawler': 'Glue component that connects to a data source (e.g. S3, DynamoDB), infers the schema, and populates the Glue Data Catalog with table metadata. Classifiers help it recognize custom formats. Exam trigger: "determine schema and populate the Data Catalog" → Crawler.',
  'SPICE': 'Super-fast Parallel In-memory Calculation Engine — QuickSight’s in-memory store that caches imported data for fast, repeatable dashboard queries without re-hitting the source.',
  'OLAP': 'Online Analytical Processing — read-heavy analytical workloads: aggregates, joins, and reporting over large datasets (e.g. Redshift). Optimized by columnar storage. Contrast with OLTP.',
  'OLTP': 'Online Transaction Processing — many small, fast reads/writes of individual rows (e.g. RDS/Aurora, DynamoDB). Row-oriented. Exam trap: a "transactional application" should NOT be answered with Redshift (that is OLAP).',
  'MPP': 'Massively Parallel Processing — splits a query across many compute nodes that work in parallel, then combines results. Why Redshift handles huge aggregate/join queries quickly.',
  'columnar': 'Storage layout that keeps each column together instead of each row. Analytics queries that scan a few columns over many rows read far less data and compress better — used by Redshift and file formats like Parquet/ORC.',
  'Parquet': 'Open columnar file format common in data lakes. Reduces the data Athena/Redshift Spectrum scan (lower cost) and improves query speed vs row formats like CSV/JSON. Converting raw data to Parquet is a frequent Glue ETL step.',
  'Data Lake': 'Centralized repository (typically S3) storing raw structured and unstructured data at any scale. Queried in place by Athena, Redshift Spectrum, and EMR; cataloged by Glue; access governed by Lake Formation. Contrast with a data warehouse (structured, pre-modeled).',

  // Management & Governance
  'AWS Organizations': 'Centrally manage multiple AWS accounts: consolidated billing, volume discounts, and grouping accounts into Organizational Units (OUs). Apply SCPs to set permission guardrails across accounts.',
  'SCP': 'Service Control Policy — Organizations guardrail that sets the MAXIMUM permissions for accounts/OUs. Does NOT grant access — it only limits what IAM can allow. An explicit deny in an SCP overrides any IAM allow.',
  'Amazon CloudWatch': 'Monitoring for metrics, logs, alarms, and dashboards. Standard metrics every 5 min; detailed monitoring 1 min. EC2 memory & disk are NOT default — they need the CloudWatch agent. Answers "is it performing?".',
  'AWS CloudTrail': 'Audit log of every API call (who did what, when, from where) across the account. Management + data events; can log to S3 / an org trail. Answers "who did this?". NOT performance (CloudWatch) or config state (Config).',
  'AWS Config': 'Records resource configuration history and evaluates it against rules for compliance (e.g. "all EBS volumes must be encrypted"), with optional auto-remediation. Answers "is it compliant / what changed?".',
  'AWS CloudFormation': 'Infrastructure as Code via declarative templates (YAML/JSON). Provisions resources as a Stack. Change sets preview edits; drift detection finds manual changes; StackSets deploy across accounts/regions.',
  'StackSets': 'CloudFormation feature to deploy the same stack across MULTIPLE accounts and regions from one operation. Common with Organizations to roll out baseline guardrails fleet-wide.',
  'AWS Trusted Advisor': 'Account-level checks across 5 pillars: cost optimization, security, fault tolerance, performance, and service limits. Full checks require Business/Enterprise Support.',
  'AWS Compute Optimizer': 'Uses ML on CloudWatch metrics to recommend right-sizing for EC2, ASG, EBS, and Lambda — reduces over-provisioning. Recommendation engine, NOT an enforcement tool.',
  'AWS Control Tower': 'Sets up and governs a secure multi-account AWS environment (landing zone) using Organizations + guardrails + SSO. Higher-level automation on top of Organizations.',
  'AWS Health Dashboard': "Personalized view of AWS operational issues, scheduled changes, and maintenance events affecting YOUR account's resources — different from the public Service Health Dashboard. Integrates with EventBridge for automated alerting. Full API access needs Business/Enterprise Support.",
  'CloudWatch Logs Insights': 'Interactive query language for CloudWatch Logs — SQL-like syntax to search, filter, aggregate, and visualize log data across multiple Log Groups. Runs in the console without external tools. Use for: "count errors by Lambda function in last 1 hour". Athena is for S3 data; Logs Insights is for CloudWatch log data.',
  'conformance pack': 'A collection of Config rules and remediation actions packaged as a single YAML template — deployable across an entire AWS Organization via StackSets. Used for compliance frameworks (CIS AWS Foundations, NIST, PCI DSS). One pack replaces dozens of manually configured individual rules.',
  'nested stacks': 'CloudFormation stacks that are referenced and created by a parent stack using the AWS::CloudFormation::Stack resource type. Enables modular, reusable templates — e.g. one VPC stack referenced by multiple app stacks. Each nested stack has its own lifecycle (update/rollback) but is orchestrated by the parent.',
  'Parameter Store': 'AWS Systems Manager feature for centralized, hierarchical storage of configuration data and secrets. Standard tier: free, up to 10,000 params, no expiration. Advanced tier: parameter policies (auto-expiry, change notifications), higher limits. SecureString type = KMS-encrypted at rest. No auto-rotation — use Secrets Manager when rotation is needed.',
  'Session Manager': 'AWS Systems Manager feature providing a browser-based interactive shell to EC2 instances (and on-premises servers) without opening port 22, managing SSH keys, or running a bastion host. All session activity is logged to S3 / CloudWatch Logs and the session-start event appears in CloudTrail. Requires SSM Agent + AmazonSSMManagedInstanceCore policy on the instance.',

  // Cost Management
  'AWS Cost Explorer': 'Visualize, understand, and FORECAST AWS spend over time with filters by service/tag/account. Analysis & forecasting tool — NOT alerting (use Budgets).',
  'AWS Budgets': 'Set custom cost/usage thresholds and get ALERTED (or trigger actions) when forecast or actual spend exceeds them. Proactive alerting — NOT historical analysis (use Cost Explorer).',
  'Cost and Usage Report': 'CUR — the most detailed, line-item billing data AWS produces, delivered to S3 for deep analysis (e.g. via Athena/QuickSight). Granular raw data, not a dashboard.',
  'Cost Allocation Tags': 'Tags (user-defined or AWS-generated) activated in the billing console so costs can be grouped and reported by project, team, or environment.',

  // Security concepts & policy
  'bastion host': 'EC2 in a public subnet used as the only SSH/RDP entry point into private subnet instances — connect to bastion first, then hop to private instances',
  'jump host': 'Another name for a bastion host — a hardened EC2 in a public subnet that you jump through to reach private subnet instances',
  'Elastic IP': 'Static public IPv4 address allocated to your AWS account — stays fixed until released, survives instance stop/start; NAT Gateway requires one',
  'penetration testing': 'Authorised simulated attack to find vulnerabilities — AWS allows pentest on 8 services (EC2, RDS, CloudFront, Aurora, API GW, Lambda, Lightsail, Elastic Beanstalk) without prior approval',
  'AUP': 'AWS Acceptable Use Policy — defines what is permitted and prohibited on AWS infrastructure, including security testing rules',

  // Disaster Recovery strategies
  'Backup and Restore': 'DR strategy with highest RTO/RPO and lowest cost. Data backed up to DR region; entire infrastructure must be redeployed during disaster. Best for non-critical workloads or data protection only.',
  'Pilot Light': 'DR strategy: core data continuously replicated to DR region, minimal infrastructure pre-provisioned (switched off). Scale up only when disaster strikes. Lower RTO than Backup & Restore, higher than Warm Standby.',
  'Warm Standby': 'DR strategy: scaled-down but fully functional copy of production running in DR region at all times. Scale up to full capacity during failover. Faster RTO than Pilot Light, costs more.',
  'Active/Active': 'Multi-Site DR strategy: full production workload running in multiple AWS Regions simultaneously. Traffic load-balanced across regions. Lowest RTO/RPO (near zero), highest cost. Also called Hot Standby.',

  // Architecture patterns (batch2)
  'IaC': 'Infrastructure as Code — managing and provisioning infrastructure through machine-readable configuration files (e.g. CloudFormation, Terraform) instead of manual processes. Enables repeatable, version-controlled deployments.',
  'Blue/Green deployment': 'Deployment strategy with two identical environments (Blue = current, Green = new). Traffic switched from Blue to Green after testing. Instant rollback by switching back. Zero downtime deployments.',
  'Canary deployment': 'Gradual traffic shift to a new version — e.g. 5% of users get v2, 95% get v1. Monitor for errors, then increase percentage. Reduces blast radius of bad deployments.',
  'Fan-out': 'Pattern where one SNS topic delivers messages to multiple SQS queues simultaneously. Decouples producers from consumers. E.g. one S3 upload event triggers 3 different Lambda functions via SNS→SQS.',
  'Event-driven': 'Architecture pattern where services communicate by producing and consuming events, not direct calls. Services are loosely coupled. E.g. S3 upload → EventBridge → Lambda → SQS → EC2.',
  'Idempotency': 'Property where an operation produces the same result regardless of how many times it is called. Critical for distributed systems — if a Lambda is retried, it should not double-process an order.',
  'Elasticity': 'Ability to automatically scale resources UP during peak demand and scale DOWN when demand drops. Distinct from scalability (which just means ability to scale up). Elasticity = auto up + auto down.',
  'Fault tolerance': 'Ability of a system to continue operating correctly despite the failure of one or more components. Achieved through redundancy (Multi-AZ, Multi-Region), circuit breakers, and graceful degradation.',
  'Shared Responsibility Model': 'AWS is responsible for security OF the cloud (physical infra, hardware, hypervisor). Customer is responsible for security IN the cloud (data, OS patches, IAM config, application security, encryption).',
  'Serverless': 'No servers to manage — AWS handles provisioning, scaling, patching. Pay only for what you use. Examples: Lambda (compute), Fargate (containers), DynamoDB (database), Aurora Serverless (DB), S3 (storage).',
  'Microservices': 'Architecture where an application is broken into small, independent services each with a single responsibility. Services communicate via APIs or events. Each can be deployed, scaled, and updated independently.',
  'Containerization': 'Packaging an application and all its dependencies into a portable container image. Containers run consistently across environments. Docker is the standard format; ECS and EKS orchestrate containers on AWS.',

  // Lambda / Compute (batch2)
  'Cold start': 'Latency when Lambda creates a new execution environment from scratch (download code, initialize runtime). Adds 100ms–1s+ delay. Mitigated by Provisioned Concurrency (pre-warmed environments) or keeping functions warm.',
  'Provisioned Concurrency': 'Lambda feature that pre-initializes a specified number of execution environments, eliminating cold starts. Pay extra for pre-warmed capacity. Use for latency-sensitive production workloads.',
  'Reserved Concurrency': 'Sets the maximum concurrent executions for a specific Lambda function (throttles above this limit). Also guarantees that capacity is reserved — other functions cannot use it. Setting to 0 = disable function.',
  'Lambda Layer': 'A .zip archive containing libraries, runtime, or other dependencies shared across multiple Lambda functions. Reduces deployment package size. Up to 5 layers per function.',
  'Fargate': 'Serverless compute engine for containers — runs ECS tasks or EKS pods without managing EC2 instances. AWS manages the underlying infrastructure. Pay per vCPU and memory used by each task.',
  'EC2 Placement Group': 'Controls how EC2 instances are placed on physical hardware. Cluster = same rack, low latency HPC. Spread = different racks, max resilience. Partition = groups on separate partitions for large distributed apps.',
  'Spot interruption': 'AWS can reclaim Spot Instances with 2-minute warning when capacity is needed. Applications must handle interruption gracefully. Use Spot for fault-tolerant, stateless, or checkpointable workloads.',

  // IAM (batch2)
  'ARN': 'Amazon Resource Name — unique identifier for every AWS resource. Format: arn:partition:service:region:account-id:resource. Example: arn:aws:s3:::my-bucket. Used in IAM policies to specify exact resources.',
  'Principal': 'Entity that can make requests to AWS: IAM user, IAM role, AWS service (e.g. Lambda), federated user, or AWS account. Specified in resource-based policies to define WHO can access the resource.',
  'Identity-based policy': 'IAM policy attached to an IAM identity (user, group, role). Defines what actions that identity can perform on which resources. Most common policy type. Can be AWS managed, customer managed, or inline.',
  'Resource-based policy': 'IAM policy attached to a resource (S3 bucket, SQS queue, KMS key, Lambda). Defines who can access the resource and what they can do. Enables cross-account access without requiring role assumption.',
  'Permissions boundary': 'IAM managed policy that sets the MAXIMUM permissions an IAM entity (user or role) can have. Even if identity-based policies grant more, the boundary caps it. Does not grant permissions by itself.',
  'Managed policy': 'Standalone IAM policy that can be attached to multiple users, groups, or roles. AWS managed = created by AWS (e.g. AdministratorAccess). Customer managed = created by you. Easier to reuse and update than inline.',
  'Inline policy': 'IAM policy embedded directly into one specific user, group, or role. Not reusable. Deleted when the entity is deleted. Use sparingly — managed policies are preferred for maintainability.',
  'Trust policy': 'Resource-based policy on an IAM role that defines which principals (services, accounts, users) can ASSUME the role. Every role has exactly one trust policy. Example: allow EC2 service to assume the role.',
  'OU (Organizational Unit)': 'Organizational Unit — a container for AWS accounts within AWS Organizations. SCPs can be applied to OUs to restrict all accounts within. OUs can be nested. Management account is at the root.',
  'Permission denied': 'When IAM evaluation results in Deny. Explicit Deny always overrides Allow. A missing Allow = implicit Deny. Order: explicit Deny → SCP limit → permissions boundary → resource policy → identity policy.',

  // Networking (batch2)
  'PrivateLink': 'AWS technology powering Interface VPC Endpoints. Creates private connectivity to AWS services or third-party services via ENIs in your VPC. Traffic never leaves AWS network. Used by all Interface endpoints.',
  'Egress': 'Traffic flowing OUT of your network or VPC to the internet or another network. Egress charges apply when data leaves AWS. NAT Gateway, Internet Gateway, and Direct Connect all handle egress traffic.',
  'Ingress': 'Traffic flowing INTO your network or VPC from the internet or another network. Security groups and NACLs control ingress. No AWS charge for ingress data transfer.',
  'FQDN': 'Fully Qualified Domain Name — complete domain name specifying exact location in DNS hierarchy. Example: my-alb-1234567890.us-east-1.elb.amazonaws.com. Alias records in Route 53 can point to FQDNs.',
  'Latency': 'Time delay between a request being sent and the response being received. Affected by geographic distance, network congestion, processing time. Reduce with: CloudFront, Global Accelerator, multi-region deployments.',
  'Throughput': 'Amount of data transferred per unit of time (MB/s, Gbps) or records processed per second. Higher throughput = more capacity. EBS st1 optimized for throughput; EBS io2 optimized for IOPS (random I/O).',
  'NLB': 'Network Load Balancer — Layer 4 (TCP/UDP) load balancer. Handles millions of requests per second with ultra-low latency. Has static IP per AZ. Use for: non-HTTP traffic, static IP requirement, extreme performance needs.',
  'CLB': 'Classic Load Balancer — legacy (Layer 4 + Layer 7). Use ALB or NLB instead for new deployments. Still used for EC2-Classic or very old apps.',
  'Target Group': 'ALB/NLB routing destination — a group of registered targets (EC2 instances, IPs, Lambda functions, other ALBs). Health checks run against each target. Listener rules route traffic to specific target groups by path/host/header.',

  // Storage (batch2)
  'Pre-signed URL': 'Time-limited URL that grants temporary access to a private S3 object without requiring AWS credentials. Generated using AWS SDK with an expiry time (max 7 days). Used to share private files securely with external users.',
  'S3 Versioning': 'S3 feature that preserves every version of an object. When an object is overwritten or deleted, the previous version is retained. Enables recovery from accidental deletes or overwrites. Required for S3 Object Lock.',
  'S3 Lifecycle Policy': 'Automated rules to transition S3 objects between storage classes or expire (delete) them after a defined period. Example: transition to Glacier after 30 days, delete after 1 year. Reduces storage costs automatically.',
  'S3 Transfer Acceleration': 'Speeds up S3 uploads by routing traffic through CloudFront edge locations instead of directly to S3. Data enters AWS network at the nearest edge point. Useful for large file uploads from distant locations.',
  'SRR': 'Same-Region Replication — automatically copies S3 objects between buckets in the SAME region. Use for: compliance (separate account copy), log aggregation, live replicas for test environments.',

  // Database (batch2)
  'DAX': 'DynamoDB Accelerator — fully managed in-memory cache for DynamoDB. Microsecond read latency (vs millisecond for DynamoDB). Drop-in compatible, no application code changes. Only for READ caching.',
  'TTL': 'Time To Live — DynamoDB feature that auto-deletes items after a specified timestamp. No extra cost. Items expired within ~48 hours. Useful for session data, temp records, log expiry. Does NOT consume write capacity.',
  'DLQ': 'Dead Letter Queue — SQS queue that receives messages which failed processing after the maximum number of retries (maxReceiveCount). Used for debugging, manual reprocessing, alerting. Prevents poison-pill messages blocking the queue.',
  'FIFO Queue': 'First-In-First-Out SQS queue. Guarantees: (1) exact ordering of messages, (2) exactly-once processing. Max 300 transactions/second (3,000 with batching). Use when order matters (e.g. financial transactions, sequential steps).',

  // Application Integration (batch3)
  'Amazon MQ': 'Managed message broker for ActiveMQ and RabbitMQ. Supports AMQP, MQTT, STOMP, OpenWire protocols. Use for lift-and-shift migration of existing on-premises messaging apps to AWS without code changes. New cloud-native apps should use SQS/SNS instead.',
  'SNS Message Filtering': 'SNS subscription filter policy (JSON) that lets subscribers receive only messages matching specific attribute criteria. Without filtering, all subscribers get all messages. Reduces unnecessary processing and costs.',
  'SNS FIFO Topic': 'SNS topic with strict message ordering and exactly-once delivery. Pairs with SQS FIFO queues for ordered fan-out. Max 300 publishes/sec (3,000 with batching). Use when downstream processing requires message order.',
  'EventBridge Schema Registry': 'EventBridge feature that auto-discovers and stores event schemas from your event bus. Generates code bindings (Java, Python, TypeScript) from schemas. Speeds up development by providing typed event structures.',
  'EventBridge Pipes': 'Point-to-point integration connecting a source (SQS, Kinesis, DynamoDB Streams) directly to a target with optional filtering, enrichment, and transformation. Simpler alternative to writing Lambda glue code for source-to-target integrations.',
  'EventBridge Scheduler': 'Serverless scheduler for one-time or recurring tasks (cron/rate expressions). Replaces CloudWatch Events scheduled rules. Supports timezone-aware scheduling, flexible time windows, and 14,000+ targets.',
  'Step Functions Standard': 'Step Functions workflow type: exactly-once execution, up to 1 year duration, full execution history. Use for long-running, auditable workflows (e.g. order processing, ETL pipelines). Higher cost per state transition.',
  'Step Functions Express': 'Step Functions workflow type: up to 5 minutes duration. Two sub-types: Asynchronous Express (at-least-once, fire-and-forget) and Synchronous Express (at-most-once, wait for result). Use for high-volume, short-duration workflows (e.g. IoT data processing, streaming transforms). Lower cost, priced per execution.',
  'AWS AppSync': 'Fully managed GraphQL API service with real-time subscriptions (WebSocket), offline data sync with conflict resolution, and resolvers for DynamoDB, Lambda, Aurora, OpenSearch, HTTP. Use for mobile/web apps needing real-time updates or offline capability.',
  'AWS Amplify': 'Platform for building fullstack web/mobile apps. Amplify Hosting = Git-based CI/CD + CDN (SSR/SSG/SPA). Backend powered by Cognito (auth), AppSync (API), DynamoDB (data), S3 (storage). Like Heroku/Vercel for AWS.',
  'GraphQL': 'API query language that lets clients request exactly the data they need in a single query. Unlike REST (multiple endpoints, fixed response shape), GraphQL uses one endpoint with flexible queries. AWS AppSync is the managed GraphQL service.',
}
