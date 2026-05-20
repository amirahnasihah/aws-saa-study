import { writeFileSync } from 'fs'

const escape = (s: string) => s.replace(/'/g, "''")

const newTerms: { term: string; definition: string; category: string }[] = [
  // DR Strategies
  { term: 'Backup and Restore', category: 'architecture', definition: 'DR strategy with highest RTO/RPO and lowest cost. Data backed up to DR region; entire infrastructure must be redeployed during disaster. Best for non-critical workloads or data protection only.' },
  { term: 'Pilot Light', category: 'architecture', definition: 'DR strategy: core data continuously replicated to DR region, minimal infrastructure pre-provisioned (switched off). Scale up only when disaster strikes. Lower RTO than Backup & Restore, higher than Warm Standby.' },
  { term: 'Warm Standby', category: 'architecture', definition: 'DR strategy: scaled-down but fully functional copy of production running in DR region at all times. Scale up to full capacity during failover. Faster RTO than Pilot Light, costs more.' },
  { term: 'Active/Active', category: 'architecture', definition: 'Multi-Site DR strategy: full production workload running in multiple AWS Regions simultaneously. Traffic load-balanced across regions. Lowest RTO/RPO (near zero), highest cost. Also called Hot Standby.' },
  { term: 'IaC', category: 'architecture', definition: 'Infrastructure as Code — managing and provisioning infrastructure through machine-readable configuration files (e.g. CloudFormation, Terraform) instead of manual processes. Enables repeatable, version-controlled deployments.' },
  { term: 'Blue/Green deployment', category: 'architecture', definition: 'Deployment strategy with two identical environments (Blue = current, Green = new). Traffic switched from Blue to Green after testing. Instant rollback by switching back. Zero downtime deployments.' },
  { term: 'Canary deployment', category: 'architecture', definition: 'Gradual traffic shift to a new version — e.g. 5% of users get v2, 95% get v1. Monitor for errors, then increase percentage. Reduces blast radius of bad deployments.' },
  { term: 'Fan-out', category: 'architecture', definition: 'Pattern where one SNS topic delivers messages to multiple SQS queues simultaneously. Decouples producers from consumers. E.g. one S3 upload event triggers 3 different Lambda functions via SNS→SQS.' },
  { term: 'Event-driven', category: 'architecture', definition: 'Architecture pattern where services communicate by producing and consuming events, not direct calls. Services are loosely coupled. E.g. S3 upload → EventBridge → Lambda → SQS → EC2.' },
  { term: 'Idempotency', category: 'architecture', definition: 'Property where an operation produces the same result regardless of how many times it is called. Critical for distributed systems — if a Lambda is retried, it should not double-process an order.' },
  { term: 'Elasticity', category: 'architecture', definition: 'Ability to automatically scale resources UP during peak demand and scale DOWN when demand drops. Distinct from scalability (which just means ability to scale up). Elasticity = auto up + auto down.' },
  { term: 'Fault tolerance', category: 'architecture', definition: 'Ability of a system to continue operating correctly despite the failure of one or more components. Achieved through redundancy (Multi-AZ, Multi-Region), circuit breakers, and graceful degradation.' },
  { term: 'Shared Responsibility Model', category: 'architecture', definition: 'AWS is responsible for security OF the cloud (physical infra, hardware, hypervisor). Customer is responsible for security IN the cloud (data, OS patches, IAM config, application security, encryption).' },
  { term: 'Serverless', category: 'architecture', definition: 'No servers to manage — AWS handles provisioning, scaling, patching. Pay only for what you use. Examples: Lambda (compute), Fargate (containers), DynamoDB (database), Aurora Serverless (DB), S3 (storage).' },
  { term: 'Microservices', category: 'architecture', definition: 'Architecture where an application is broken into small, independent services each with a single responsibility. Services communicate via APIs or events. Each can be deployed, scaled, and updated independently.' },
  { term: 'Containerization', category: 'architecture', definition: 'Packaging an application and all its dependencies into a portable container image. Containers run consistently across environments. Docker is the standard format; ECS and EKS orchestrate containers on AWS.' },

  // Lambda
  { term: 'Cold start', category: 'compute', definition: 'Latency when Lambda creates a new execution environment from scratch (download code, initialize runtime). Adds 100ms–1s+ delay. Mitigated by Provisioned Concurrency (pre-warmed environments) or keeping functions warm.' },
  { term: 'Provisioned Concurrency', category: 'compute', definition: 'Lambda feature that pre-initializes a specified number of execution environments, eliminating cold starts. Pay extra for pre-warmed capacity. Use for latency-sensitive production workloads.' },
  { term: 'Reserved Concurrency', category: 'compute', definition: 'Sets the maximum concurrent executions for a specific Lambda function (throttles above this limit). Also guarantees that capacity is reserved — other functions cannot use it. Setting to 0 = disable function.' },
  { term: 'Lambda Layer', category: 'compute', definition: 'A .zip archive containing libraries, runtime, or other dependencies shared across multiple Lambda functions. Reduces deployment package size. Up to 5 layers per function.' },
  { term: 'Fargate', category: 'compute', definition: 'Serverless compute engine for containers — runs ECS tasks or EKS pods without managing EC2 instances. AWS manages the underlying infrastructure. Pay per vCPU and memory used by each task.' },
  { term: 'Instance store', category: 'compute', definition: 'Ephemeral block storage physically attached to the EC2 host. Data is LOST when the instance stops, terminates, or the underlying host fails. High I/O performance but no persistence. NOT for databases or important data.' },
  { term: 'EC2 Placement Group', category: 'compute', definition: 'Controls how EC2 instances are placed on physical hardware. Cluster = same rack, low latency HPC. Spread = different racks, max resilience. Partition = groups on separate partitions for large distributed apps.' },
  { term: 'Spot interruption', category: 'compute', definition: 'AWS can reclaim Spot Instances with 2-minute warning when capacity is needed. Applications must handle interruption gracefully. Use Spot for fault-tolerant, stateless, or checkpointable workloads.' },

  // IAM
  { term: 'ARN', category: 'services', definition: 'Amazon Resource Name — unique identifier for every AWS resource. Format: arn:partition:service:region:account-id:resource. Example: arn:aws:s3:::my-bucket. Used in IAM policies to specify exact resources.' },
  { term: 'Principal', category: 'services', definition: 'Entity that can make requests to AWS: IAM user, IAM role, AWS service (e.g. Lambda), federated user, or AWS account. Specified in resource-based policies to define WHO can access the resource.' },
  { term: 'Identity-based policy', category: 'services', definition: 'IAM policy attached to an IAM identity (user, group, role). Defines what actions that identity can perform on which resources. Most common policy type. Can be AWS managed, customer managed, or inline.' },
  { term: 'Resource-based policy', category: 'services', definition: 'IAM policy attached to a resource (S3 bucket, SQS queue, KMS key, Lambda). Defines who can access the resource and what they can do. Enables cross-account access without requiring role assumption.' },
  { term: 'Permissions boundary', category: 'services', definition: 'IAM managed policy that sets the MAXIMUM permissions an IAM entity (user or role) can have. Even if identity-based policies grant more, the boundary caps it. Does not grant permissions by itself.' },
  { term: 'Managed policy', category: 'services', definition: 'Standalone IAM policy that can be attached to multiple users, groups, or roles. AWS managed = created by AWS (e.g. AdministratorAccess). Customer managed = created by you. Easier to reuse and update than inline.' },
  { term: 'Inline policy', category: 'services', definition: 'IAM policy embedded directly into one specific user, group, or role. Not reusable. Deleted when the entity is deleted. Use sparingly — managed policies are preferred for maintainability.' },
  { term: 'Trust policy', category: 'services', definition: 'Resource-based policy on an IAM role that defines which principals (services, accounts, users) can ASSUME the role. Every role has exactly one trust policy. Example: allow EC2 service to assume the role.' },
  { term: 'OU', category: 'services', definition: 'Organizational Unit — a container for AWS accounts within AWS Organizations. SCPs can be applied to OUs to restrict all accounts within. OUs can be nested. Management account is at the root.' },
  { term: 'Permission denied', category: 'services', definition: 'When IAM evaluation results in Deny. Explicit Deny always overrides Allow. A missing Allow = implicit Deny. Order: explicit Deny → SCP limit → permissions boundary → resource policy → identity policy.' },

  // Networking
  { term: 'ENI', category: 'networking', definition: 'Elastic Network Interface — virtual network card that can be attached to EC2 instances. Each has private IP, optionally public IP, MAC address, security groups. Multiple ENIs per instance for multi-subnet or failover.' },
  { term: 'PrivateLink', category: 'networking', definition: 'AWS technology powering Interface VPC Endpoints. Creates private connectivity to AWS services or third-party services via ENIs in your VPC. Traffic never leaves AWS network. Used by all Interface endpoints.' },
  { term: 'Anycast', category: 'networking', definition: 'Routing method where the same IP address is announced from multiple locations simultaneously. Client traffic automatically routed to the nearest location. Used by AWS Global Accelerator — traffic goes to nearest AWS edge.' },
  { term: 'Egress', category: 'networking', definition: 'Traffic flowing OUT of your network or VPC to the internet or another network. Egress charges apply when data leaves AWS. NAT Gateway, Internet Gateway, and Direct Connect all handle egress traffic.' },
  { term: 'Ingress', category: 'networking', definition: 'Traffic flowing INTO your network or VPC from the internet or another network. Security groups and NACLs control ingress. No AWS charge for ingress data transfer.' },
  { term: 'FQDN', category: 'networking', definition: 'Fully Qualified Domain Name — complete domain name specifying exact location in DNS hierarchy. Example: my-alb-1234567890.us-east-1.elb.amazonaws.com. Alias records in Route 53 can point to FQDNs.' },
  { term: 'Latency', category: 'networking', definition: 'Time delay between a request being sent and the response being received. Affected by geographic distance, network congestion, processing time. Reduce with: CloudFront, Global Accelerator, multi-region deployments.' },
  { term: 'Throughput', category: 'networking', definition: 'Amount of data transferred per unit of time (MB/s, Gbps) or records processed per second. Higher throughput = more capacity. EBS st1 optimized for throughput; EBS io2 optimized for IOPS (random I/O).' },

  // S3
  { term: 'Pre-signed URL', category: 'storage', definition: 'Time-limited URL that grants temporary access to a private S3 object without requiring AWS credentials. Generated using AWS SDK with an expiry time (max 7 days). Used to share private files securely with external users.' },
  { term: 'S3 Versioning', category: 'storage', definition: 'S3 feature that preserves every version of an object. When an object is overwritten or deleted, the previous version is retained. Enables recovery from accidental deletes or overwrites. Required for S3 Object Lock.' },
  { term: 'S3 Lifecycle Policy', category: 'storage', definition: 'Automated rules to transition S3 objects between storage classes or expire (delete) them after a defined period. Example: transition to Glacier after 30 days, delete after 1 year. Reduces storage costs automatically.' },
  { term: 'S3 Transfer Acceleration', category: 'storage', definition: 'Speeds up S3 uploads by routing traffic through CloudFront edge locations instead of directly to S3. Data enters AWS network at the nearest edge point. Useful for large file uploads from distant locations.' },
  { term: 'SRR', category: 'storage', definition: 'Same-Region Replication — automatically copies S3 objects between buckets in the SAME region. Use for: compliance (separate account copy), log aggregation, live replicas for test environments.' },
  { term: 'EBS Snapshot', category: 'storage', definition: 'Point-in-time backup of an EBS volume stored in S3 (managed by AWS). Incremental — only changed blocks since last snapshot are saved. Can be used to create new volumes or copy to other regions.' },

  // Database
  { term: 'DAX', category: 'database', definition: 'DynamoDB Accelerator — fully managed in-memory cache for DynamoDB. Microsecond read latency (vs millisecond for DynamoDB). Drop-in compatible, no application code changes. Only for READ caching.' },
  { term: 'TTL', category: 'database', definition: 'Time To Live — DynamoDB feature that auto-deletes items after a specified timestamp. No extra cost. Items expired within ~48 hours. Useful for session data, temp records, log expiry. Does NOT consume write capacity.' },
  { term: 'DLQ', category: 'database', definition: 'Dead Letter Queue — SQS queue that receives messages which failed processing after the maximum number of retries (maxReceiveCount). Used for debugging, manual reprocessing, alerting. Prevents poison-pill messages blocking the queue.' },
  { term: 'FIFO Queue', category: 'database', definition: 'First-In-First-Out SQS queue. Guarantees: (1) exact ordering of messages, (2) exactly-once processing. Max 300 transactions/second (3,000 with batching). Use when order matters (e.g. financial transactions, sequential steps).' },
  { term: 'NLB', category: 'networking', definition: 'Network Load Balancer — Layer 4 (TCP/UDP) load balancer. Handles millions of requests per second with ultra-low latency. Has static IP per AZ. Use for: non-HTTP traffic, static IP requirement, extreme performance needs.' },
  { term: 'CLB', category: 'networking', definition: 'Classic Load Balancer — legacy (Layer 4 + Layer 7). Use ALB or NLB instead for new deployments. Still used for EC2-Classic or very old apps.' },
  { term: 'Target Group', category: 'networking', definition: 'ALB/NLB routing destination — a group of registered targets (EC2 instances, IPs, Lambda functions, other ALBs). Health checks run against each target. Listener rules route traffic to specific target groups by path/host/header.' },
]

const rows = newTerms.map(({ term, definition, category }) =>
  `INSERT OR IGNORE INTO glossary (term, definition, category) VALUES ('${escape(term)}', '${escape(definition)}', '${category}');`
)

writeFileSync('scripts/glossary-batch2.sql', rows.join('\n'))
console.log(`Generated ${rows.length} glossary terms → scripts/glossary-batch2.sql`)
