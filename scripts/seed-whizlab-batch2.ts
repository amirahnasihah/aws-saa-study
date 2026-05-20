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
  explanation: { correct: string; incorrects: Record<string, string> }
  reference?: string
  keywords: string[]
}

const questions: Q[] = [
  {
    id: 'wz-011', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A company uses AWS Organizations to manage multiple AWS accounts. Some member accounts have provisioned Internet Gateways and NAT Gateways. The security team wants to enforce a policy that prevents creation of new Internet Gateways or VPC peering connections in any member account. The policy should be applied organization-wide but must not impact existing internet access. Which Service Control Policy (SCP) effect will best fulfill this requirement?',
    options: [
      { id: 'a', text: 'Deny creating new Internet Gateways and VPC peering connections for all accounts, including the management account' },
      { id: 'b', text: 'Deny creating new Internet Gateways and VPC peering connections for all member accounts only' },
      { id: 'c', text: 'Deny all internet access for all accounts in the organization' },
      { id: 'd', text: 'Deny access to existing Internet Gateways and VPCs for member accounts only' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'SCPs do not apply to the management (root) account by default. The correct SCP targets only member accounts, denying the creation of NEW Internet Gateways and VPC peering connections without affecting existing resources. This preserves existing internet access while enforcing the new restriction.',
      incorrects: { a: 'SCPs cannot restrict the management account — it is always exempt from SCPs. This option is incorrect.', c: 'Denying all internet access would break existing NAT Gateways and internet-facing resources — violates the requirement to not impact existing access.', d: 'Denying access to existing IGWs would break current internet connectivity, which the requirement explicitly prohibits.' },
    },
    reference: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html',
    keywords: ['SCP', 'AWS Organizations', 'Internet Gateway', 'VPC peering', 'member accounts', 'management account exempt'],
  },
  {
    id: 'wz-012', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A financial application runs an Amazon EC2 instance. During scheduled maintenance, the primary EC2 instance will be temporarily unavailable. The IT team wants to bring up a backup EC2 instance quickly and with the same application state, avoiding long initialization times associated with memory-intensive applications. What is the most effective way to ensure fast recovery during maintenance?',
    options: [
      { id: 'a', text: 'Create an AMI of the pre-configured EC2 backup instance and launch from it when needed' },
      { id: 'b', text: 'Use EC2 hibernation on a backup instance after setting up the application and resume it on demand' },
      { id: 'c', text: 'Stop the pre-configured backup EC2 instance and start it when needed' },
      { id: 'd', text: 'Store RAM data in an attached EBS volume and reboot the instance during failover' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'EC2 Hibernation saves the entire RAM state to the encrypted EBS root volume. When resumed, the OS and application are exactly as they were — no re-initialization. This is ideal for memory-intensive applications where warm-up time is significant.',
      incorrects: { a: 'Launching from an AMI creates a fresh instance — the application must initialize from scratch, causing the long initialization times the team wants to avoid.', c: 'Stopping and starting loses the RAM state — the application must re-initialize completely, same as launching from AMI.', d: 'Manually storing RAM to EBS and rebooting is not a standard feature — rebooting restarts the OS and clears memory state.' },
    },
    reference: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html',
    keywords: ['EC2 Hibernation', 'RAM state', 'EBS root', 'fast resume', 'memory-intensive', 'in-memory state'],
  },
  {
    id: 'wz-013', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Hard',
    scenario: 'A startup has configured hybrid connectivity using AWS Site-to-Site VPN to connect its on-premises data center with AWS. During peak hours, users experience significant slowness and reduced throughput. What is the most effective solution to increase VPN throughput?',
    options: [
      { id: 'a', text: 'Establish multiple VPN connections to an ECMP-enabled Transit Gateway and enable dynamic routing' },
      { id: 'b', text: 'Establish multiple VPN connections to an ECMP-enabled Virtual Private Gateway and enable route propagation' },
      { id: 'c', text: 'Establish multiple VPN connections to multiple Transit Gateways and enable dynamic routing' },
      { id: 'd', text: 'Establish multiple VPN connections to multiple Virtual Private Gateways and enable route propagation' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'ECMP (Equal Cost Multi-Path routing) is only supported with Transit Gateway for Site-to-Site VPN, NOT with Virtual Private Gateway. By connecting multiple VPN tunnels to an ECMP-enabled TGW, traffic is distributed across all tunnels, aggregating throughput beyond the single 1.25 Gbps limit per tunnel.',
      incorrects: { b: 'Virtual Private Gateway does NOT support ECMP for VPN connections. Multiple connections to a VGW do not aggregate bandwidth.', c: 'Using multiple Transit Gateways adds complexity and cost without benefit — ECMP works within a single TGW.', d: 'VGW does not support ECMP, so multiple connections to multiple VGWs do not solve the throughput problem.' },
    },
    reference: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-ecmp.html',
    keywords: ['ECMP', 'Transit Gateway', 'VPN throughput', 'Site-to-Site VPN', 'multiple tunnels', 'aggregate bandwidth'],
  },
  {
    id: 'wz-014', domain: 'd4', domainLabel: 'Design Cost-Optimized Architectures', difficulty: 'Medium',
    scenario: 'A startup uses a single Public NAT Gateway in one Availability Zone. EC2 instances in multiple AZs route through this NAT Gateway, increasing cross-AZ data transfer costs. What is the most cost-effective solution to reduce cross-AZ charges while maintaining reliable internet access?',
    options: [
      { id: 'a', text: 'Create a separate Public NAT Gateway in a public subnet in the AZ hosting the high-traffic instances' },
      { id: 'b', text: 'Create a Public NAT Gateway in a private subnet in the AZ hosting the high-traffic instances' },
      { id: 'c', text: 'Create a Private NAT Gateway in a private subnet in the AZ hosting the high-traffic instances' },
      { id: 'd', text: 'Create a Private NAT Gateway in a public subnet in the AZ hosting the high-traffic instances' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'Cross-AZ data transfer incurs charges. Deploying a Public NAT Gateway in each AZ (in the public subnet of that AZ) ensures EC2 instances use the local NAT Gateway, eliminating cross-AZ transfer fees. Public NAT Gateway must be in a PUBLIC subnet.',
      incorrects: { b: 'NAT Gateway must reside in a PUBLIC subnet to route internet traffic — a Public NAT Gateway in a private subnet cannot route to the internet.', c: 'A Private NAT Gateway routes to other private networks, not the internet — it cannot provide internet access.', d: 'Private NAT Gateway in a public subnet is not the correct use case for reducing cross-AZ internet traffic costs.' },
    },
    reference: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html',
    keywords: ['NAT Gateway', 'cross-AZ cost', 'per-AZ NAT Gateway', 'data transfer charges', 'public subnet'],
  },
  {
    id: 'wz-015', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A company runs an EC2 instance in a VPC that retrieves database credentials from AWS Secrets Manager. The security team is concerned that Secrets Manager requires internet access, introducing a security risk. What should you recommend to ensure the EC2 instance can access Secrets Manager securely without sending traffic over the public internet?',
    options: [
      { id: 'a', text: 'Create an Interface VPC Endpoint for Secrets Manager to route traffic privately within the AWS network' },
      { id: 'b', text: 'Access Secrets Manager through a Site-to-Site VPN connection from the VPC' },
      { id: 'c', text: 'Create a Gateway VPC Endpoint for Secrets Manager to allow private access from the VPC' },
      { id: 'd', text: 'Route access to Secrets Manager through a NAT Gateway deployed in a public subnet' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'Secrets Manager uses an Interface VPC Endpoint (powered by AWS PrivateLink). This creates a private endpoint in your VPC, routing all Secrets Manager traffic within the AWS network — no internet required. Interface endpoints are used for most AWS services except S3 and DynamoDB.',
      incorrects: { b: 'Site-to-Site VPN is for connecting on-premises networks to AWS — not for routing VPC traffic to AWS services privately.', c: 'Gateway VPC Endpoints only exist for S3 and DynamoDB, NOT for Secrets Manager. This is a common exam trap.', d: 'Routing through NAT Gateway still sends traffic over the public internet (NAT Gateway has a public IP) — this does not solve the security concern.' },
    },
    reference: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/vpc-endpoint-overview.html',
    keywords: ['VPC Endpoint Interface', 'Secrets Manager', 'PrivateLink', 'no internet', 'Gateway vs Interface endpoint'],
  },
  {
    id: 'wz-016', domain: 'd4', domainLabel: 'Design Cost-Optimized Architectures', difficulty: 'Medium',
    scenario: 'A government organization uses AWS Organizations. Each member account has its own NAT Gateway. The finance team wants a combined view of NAT Gateway costs across the organization, including breakdowns per account. What is the best approach?',
    options: [
      { id: 'a', text: 'Assign cost allocation tags to NAT Gateways from each member account and view costs using the member billing dashboard' },
      { id: 'b', text: 'Assign cost allocation tags to NAT Gateways from the management account and track usage using consolidated billing' },
      { id: 'c', text: 'Assign cost allocation tags to NAT Gateways from each member account and view costs using the management account billing console' },
      { id: 'd', text: 'Assign cost allocation tags to NAT Gateways using the management account, and analyze member account usage from CloudTrail logs' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'Cost allocation tags must be applied within each member account (where the NAT Gateways reside). The consolidated billing view in the management account then shows costs broken down by account and by tag across the entire organization — giving the finance team the combined view they need.',
      incorrects: { a: 'Member billing dashboards only show individual account costs — not a combined organizational view.', b: 'The management account cannot directly assign tags to resources in member accounts.', d: 'CloudTrail logs API calls, not billing/cost data. This approach would not provide cost breakdowns.' },
    },
    reference: 'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html',
    keywords: ['cost allocation tags', 'consolidated billing', 'AWS Organizations', 'NAT Gateway', 'management account'],
  },
  {
    id: 'wz-017', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Easy',
    scenario: 'A developer created an AWS Lambda function triggered by Amazon Kinesis Data Stream. The function is expected to log output to Amazon CloudWatch but no logs are appearing. What is the most likely reason?',
    options: [
      { id: 'a', text: 'Lambda functions triggered by Kinesis do not support CloudWatch Logs' },
      { id: 'b', text: 'The Lambda execution role does not have permissions to write to CloudWatch Logs' },
      { id: 'c', text: 'Lambda logs are written to AWS CloudTrail, not CloudWatch' },
      { id: 'd', text: 'Active tracing is not enabled on the Lambda function' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'Lambda requires the execution role to have the logs:CreateLogGroup, logs:CreateLogStream, and logs:PutLogEvents permissions to write to CloudWatch Logs. Without these IAM permissions, the function runs but cannot write logs — resulting in no log entries in CloudWatch.',
      incorrects: { a: 'Lambda with Kinesis trigger fully supports CloudWatch Logs — this is a standard integration.', c: 'Lambda logs go to CloudWatch Logs, not CloudTrail. CloudTrail records API calls, not application logs.', d: 'Active tracing enables X-Ray distributed tracing — it is separate from CloudWatch Logs and not required for basic logging.' },
    },
    reference: 'https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html',
    keywords: ['Lambda', 'CloudWatch Logs', 'execution role', 'IAM permissions', 'Kinesis trigger', 'missing logs'],
  },
  {
    id: 'wz-018', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A pharmaceutical company stores sensitive formulation documents as archives in Amazon S3 Glacier Vault. The security team must ensure no user can delete the archival records indefinitely while still allowing deletion of temporary documents. Which combination of actions should be taken? (Select TWO)',
    options: [
      { id: 'a', text: 'Use a vault access policy to match the retention tag and deny deletion of formulation documents' },
      { id: 'b', text: 'Use a vault lock policy to match the retention tag and deny deletion of formulation documents' },
      { id: 'c', text: 'Set a legal hold on the formulation document archives in the vault' },
      { id: 'd', text: 'Set a retention period for the formulation document archives in the vault' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'Use Vault Lock Policy (B) to deny deletion — it is IMMUTABLE once locked and enforces compliance controls permanently. Set a Retention Period (D) to define how long archives are protected. Together these ensure formulation documents cannot be deleted during the retention window.',
      incorrects: { a: 'Vault Access Policy is MUTABLE — it can be changed or removed, so it does not provide true compliance-grade protection against deletion.', c: '"Set a legal hold" is an S3 Object Lock feature (for S3 standard buckets), NOT a Glacier Vault feature.' },
    },
    reference: 'https://docs.aws.amazon.com/amazonglacier/latest/dev/vault-lock.html',
    keywords: ['S3 Glacier', 'Vault Lock Policy', 'Vault Access Policy', 'retention period', 'WORM', 'immutable', 'compliance'],
  },
  {
    id: 'wz-019', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'During a security audit, some Amazon S3 buckets in various accounts were found to be configured for public access. The security team wants a centrally managed solution that prevents any account in the organization from creating publicly accessible S3 buckets while allowing internal use. What is the most scalable solution?',
    options: [
      { id: 'a', text: 'Enable Amazon S3 Block Public Access in the organization\'s Service Control Policies (SCPs) to prevent changes to public access settings' },
      { id: 'b', text: 'Enable Amazon S3 Block Public Access at the object level and use SCPs to prevent changes' },
      { id: 'c', text: 'Use S3 Access Control Lists (ACLs) and configure SCPs to block public permissions' },
      { id: 'd', text: 'Use S3 bucket policies to deny public access and enforce policy restrictions via SCP' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'The most scalable approach is to enforce S3 Block Public Access (BPA) settings via SCP. The SCP prevents member accounts from disabling or modifying BPA settings, ensuring no account can create publicly accessible buckets. This scales automatically to all current and future member accounts.',
      incorrects: { b: 'Block Public Access is a bucket/account-level setting, not object-level. Object-level ACLs are not the right tool here.', c: 'ACLs are being deprecated by AWS and managing them per-bucket does not scale. SCPs cannot enforce ACL settings directly.', d: 'Bucket policies per bucket require significant manual effort and do not prevent new buckets from being created with public access.' },
    },
    reference: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html',
    keywords: ['S3 Block Public Access', 'SCP', 'AWS Organizations', 'prevent public access', 'org-wide policy'],
  },
  {
    id: 'wz-020', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Hard',
    scenario: 'An EFS file system is in VPC A (eu-west-2). It must be accessed from an EC2 instance in VPC B (eu-west-1) and from an on-premises data center connected to VPC B via Direct Connect. The solution must minimize latency and avoid public internet exposure. Which solution best meets these requirements?',
    options: [
      { id: 'a', text: 'Set up an AWS Managed VPN from the on-premises network to VPC A and route EC2 traffic through Direct Connect' },
      { id: 'b', text: 'Use AWS PrivateLink between VPC A and VPC B and access EFS through the endpoint' },
      { id: 'c', text: 'Set up inter-region VPC peering between VPC A and VPC B, and access EFS through the peering link and Direct Connect' },
      { id: 'd', text: 'Use VPC peering between VPC A and VPC B, and route traffic from the on-premises network to EFS via VPC B' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'Inter-region VPC peering connects VPC A (eu-west-2) and VPC B (eu-west-1) privately. EC2 in VPC B accesses EFS in VPC A through the peering link. On-premises accesses EFS via Direct Connect → VPC B → peering link → VPC A. All traffic stays on the AWS private network — no public internet exposure.',
      incorrects: { a: 'AWS Managed VPN uses the internet, introducing latency and public internet exposure — violates the requirement.', b: 'PrivateLink (Interface Endpoints) is for exposing services, not for EFS cross-VPC/cross-region access. EFS requires NFS mount, which goes through VPC peering.', d: 'Same concept as C but uses "VPC peering" without specifying inter-region — the key detail is that the peering must be inter-region since the VPCs are in different regions.' },
    },
    reference: 'https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html',
    keywords: ['inter-region VPC peering', 'EFS cross-region', 'Direct Connect', 'no public internet', 'multi-region access'],
  },
]

const batch2: Q[] = [
  {
    id: 'wz-021', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A multinational e-commerce company stores encrypted data across multiple AWS Regions. They notice increased latency when data is accessed outside the region where the KMS key was created. What is the best solution to reduce latency while ensuring secure, region-specific encryption?',
    options: [
      { id: 'a', text: 'Store all encrypted data in a single AWS Region to simplify key management' },
      { id: 'b', text: 'Use multi-Region KMS keys and replicate them across the Regions where the data is accessed' },
      { id: 'c', text: 'Disable encryption temporarily to avoid delays during access' },
      { id: 'd', text: 'Use standard single-Region KMS keys and assume they are globally available' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'Multi-Region KMS keys are replicated across specified regions with the same key material. Each region has its own key replica that can be used for decryption locally — eliminating cross-region API calls to KMS, which is the source of the latency. Data encrypted in one region can be decrypted in another using the replicated key.',
      incorrects: { a: 'Centralizing data in one region increases latency for users in other regions and creates a single point of failure — opposite of the goal.', c: 'Disabling encryption violates security requirements and is never an acceptable solution for sensitive data.', d: 'Single-Region KMS keys are region-specific — they are NOT globally available. Cross-region decryption requires cross-region API calls, causing the latency.' },
    },
    reference: 'https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html',
    keywords: ['KMS', 'multi-region keys', 'encryption latency', 'cross-region', 'key replication'],
  },
  {
    id: 'wz-022', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Easy',
    scenario: 'A mobile learning app developer wants quiz questions and answers to be read aloud in a natural-sounding voice for visually impaired users. All quiz content is available as plain text. Which AWS service should the developer use?',
    options: [
      { id: 'a', text: 'Use Amazon Rekognition to convert quiz text into spoken audio' },
      { id: 'b', text: 'Use Amazon Textract to analyze and voice-enable the text content' },
      { id: 'c', text: 'Use Amazon Comprehend to extract key phrases and convert to speech' },
      { id: 'd', text: 'Use Amazon Polly to convert quiz text into spoken audio' },
    ],
    correctId: 'd',
    explanation: {
      correct: 'Amazon Polly is the AWS Text-to-Speech (TTS) service. It converts plain text into natural-sounding speech audio in multiple languages and voices. It is purpose-built for exactly this use case.',
      incorrects: { a: 'Rekognition is for image and video analysis (faces, objects, labels) — it has nothing to do with text-to-speech conversion.', b: 'Textract is an OCR service that extracts text from documents/images — it does not convert text to speech.', c: 'Comprehend is an NLP service for analyzing text (sentiment, entities, key phrases) — it does not produce audio output.' },
    },
    reference: 'https://docs.aws.amazon.com/polly/latest/dg/what-is.html',
    keywords: ['Amazon Polly', 'text-to-speech', 'TTS', 'accessibility', 'natural voice', 'audio'],
  },
  {
    id: 'wz-023', domain: 'd4', domainLabel: 'Design Cost-Optimized Architectures', difficulty: 'Medium',
    scenario: 'A fast-growing e-commerce platform on EC2 with RDS MySQL observes slower query performance, frequent "too many connections" errors, and many open but idle database connections. What is the most efficient and cost-effective solution?',
    options: [
      { id: 'a', text: 'Use Amazon RDS Proxy with the MySQL DB instance' },
      { id: 'b', text: 'Provision more CPU and memory for the RDS instance' },
      { id: 'c', text: 'Enable Multi-AZ deployment for the RDS instance' },
      { id: 'd', text: 'Create Read Replicas to distribute the load' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'RDS Proxy sits between the application and RDS, pooling and sharing database connections. It addresses "too many connections" and idle connection problems by multiplexing many application connections into fewer actual database connections. It is specifically designed for this connection management problem.',
      incorrects: { b: 'More CPU/memory increases cost and does not solve connection exhaustion — the problem is too many open connections, not insufficient compute.', c: 'Multi-AZ provides high availability with automatic failover — it does not help with connection pooling or idle connections.', d: 'Read Replicas distribute READ traffic but do not solve the connection pooling problem. The issue is connection management, not read vs write load.' },
    },
    reference: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html',
    keywords: ['RDS Proxy', 'connection pooling', 'too many connections', 'idle connections', 'MySQL', 'Auto Scaling'],
  },
  {
    id: 'wz-024', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'An IT company uses Amazon SQS to decouple web servers from backend servers. Developers observe that application servers are not processing some messages. The team needs to trace the message path end-to-end and identify errors or bottlenecks. Which AWS service is best suited?',
    options: [
      { id: 'a', text: 'Amazon CloudTrail' },
      { id: 'b', text: 'Amazon Inspector' },
      { id: 'c', text: 'Amazon CloudWatch' },
      { id: 'd', text: 'AWS X-Ray' },
    ],
    correctId: 'd',
    explanation: {
      correct: 'AWS X-Ray provides distributed tracing across microservices and serverless architectures. It traces request/message paths end-to-end through SQS, Lambda, and other services — showing exactly where messages are failing, delayed, or lost. It provides a service map of the entire flow.',
      incorrects: { a: 'CloudTrail records API calls for audit purposes — it does not trace message flows or show bottlenecks in application logic.', b: 'Inspector scans EC2 instances for software vulnerabilities — it has nothing to do with message tracing or distributed system debugging.', c: 'CloudWatch provides metrics and logs, but does not provide end-to-end distributed tracing of message flows through SQS and other services.' },
    },
    reference: 'https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html',
    keywords: ['X-Ray', 'distributed tracing', 'SQS', 'message tracing', 'bottleneck', 'end-to-end trace'],
  },
  {
    id: 'wz-025', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A gaming company uses CloudFormation and wants EC2 instances to be launched from region-specific AMIs predefined by the organization. Which CloudFormation feature should be used to implement this requirement?',
    options: [
      { id: 'a', text: 'CloudFormation Outputs' },
      { id: 'b', text: 'CloudFormation Mappings' },
      { id: 'c', text: 'CloudFormation Parameters' },
      { id: 'd', text: 'CloudFormation Conditions' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'CloudFormation Mappings provide a static lookup table within the template. You can define a region-to-AMI ID mapping (e.g., us-east-1 → ami-xxx, eu-west-1 → ami-yyy) and use FindInMap to automatically select the correct AMI for the deployment region. No user input is required.',
      incorrects: { a: 'Outputs export values from a stack for cross-stack reference — not for looking up values within the same template.', c: 'Parameters accept user input at stack launch time — they require someone to manually provide the AMI ID, which is not "predefined by the organization."', d: 'Conditions control whether resources are created based on parameter values — not for static data lookups like AMI IDs.' },
    },
    reference: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html',
    keywords: ['CloudFormation Mappings', 'region-specific AMI', 'FindInMap', 'static lookup', 'predefined values'],
  },
  {
    id: 'wz-026', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A company is building a computer vision solution where CCTV cameras continuously stream video to AWS. The system must process video in near real-time to detect whether employees are wearing face masks. Which combination of services is BEST suited?',
    options: [
      { id: 'a', text: 'Use Amazon Rekognition with Kinesis Video Streams' },
      { id: 'b', text: 'Use Amazon Rekognition with Kinesis Data Streams' },
      { id: 'c', text: 'Use Amazon Textract with Kinesis Data Firehose' },
      { id: 'd', text: 'Use Amazon Comprehend with Kinesis Video Streams' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'Amazon Rekognition Video works natively with Kinesis Video Streams for real-time video analysis. Kinesis Video Streams is specifically designed for ingesting video/audio media streams. Rekognition analyzes the video frames for face detection and custom labels (mask/no-mask) in near real-time.',
      incorrects: { b: 'Kinesis Data Streams handles structured data records (text, JSON) — it cannot ingest raw video streams. Video requires Kinesis Video Streams.', c: 'Textract is for OCR on documents — it cannot process video or perform face/object detection.', d: 'Comprehend is an NLP service for text analysis — it cannot process video or perform image recognition.' },
    },
    reference: 'https://docs.aws.amazon.com/rekognition/latest/dg/streaming-video.html',
    keywords: ['Rekognition', 'Kinesis Video Streams', 'real-time video', 'face detection', 'computer vision', 'CCTV'],
  },
  {
    id: 'wz-027', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A financial firm runs a containerized application on ECS. It uploads files asynchronously to a document management system. During marketing campaigns, traffic increases 600%. Upload operations occasionally fail, causing data loss. How should the system be redesigned to handle burst traffic and ensure resilience?',
    options: [
      { id: 'a', text: 'Use Amazon S3 for temporary file storage and Amazon SQS to queue upload requests' },
      { id: 'b', text: 'Use Amazon RDS to store files temporarily and Amazon SNS for upload notifications' },
      { id: 'c', text: 'Use Amazon DynamoDB to store file metadata and AWS Lambda to process uploads' },
      { id: 'd', text: 'Use Amazon EFS for temporary storage and Amazon MQ for messaging' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'S3 stores files durably as they arrive (preventing data loss on failure), while SQS queues the upload requests for asynchronous processing. SQS buffers the burst traffic and decouples the ingest from processing — ECS workers consume from the queue at their own pace. This is the classic resilient burst-handling pattern.',
      incorrects: { b: 'RDS is not designed for file storage (binary blobs). SNS pushes notifications but does not buffer or queue requests for retry — data loss can still occur.', c: 'DynamoDB stores metadata, not files. Lambda alone does not buffer or handle 600% traffic spikes without SQS in front to decouple.', d: 'EFS works for file storage but Amazon MQ (ActiveMQ/RabbitMQ) adds unnecessary complexity. SQS is simpler and more cloud-native for this pattern.' },
    },
    reference: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html',
    keywords: ['S3', 'SQS', 'ECS', 'burst traffic', 'decoupling', 'resilience', 'file upload', 'queue'],
  },
  {
    id: 'wz-028', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A web application uses an ALB with HTTPS enabled via ACM. The certificate was validated via email and the status is "Pending Validation." Your manager asks you to ensure the certificate does not expire. What is the most likely cause and how should you resolve it?',
    options: [
      { id: 'a', text: 'The certificate is nearing expiration and needs manual email validation before ACM can renew it' },
      { id: 'b', text: 'The certificate has expired and cannot be renewed; request a new certificate' },
      { id: 'c', text: 'ACM will automatically renew the certificate shortly; no action required' },
      { id: 'd', text: 'The certificate has expired; contact AWS Support to renew it manually' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'ACM automatically renews certificates ONLY when DNS validation is used. Email-validated certificates require manual re-validation during renewal — ACM sends a new validation email and waits for approval. The "Pending Validation" status indicates action is required. The solution is to complete the email validation or switch to DNS validation for future automatic renewal.',
      incorrects: { b: 'The certificate is not necessarily expired — "Pending Validation" means renewal is in progress but waiting for manual action, not that it has expired.', c: 'ACM does NOT automatically renew email-validated certificates — this is only true for DNS-validated certificates.', d: 'AWS Support does not manually renew certificates. The customer must complete the email validation process.' },
    },
    reference: 'https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html',
    keywords: ['ACM', 'DNS validation', 'email validation', 'auto-renewal', 'Pending Validation', 'certificate renewal'],
  },
  {
    id: 'wz-029', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A restaurant management company uses Lambda and SNS to coordinate order processing. The architecture has grown complex. The team wants to orchestrate all steps in a visual way, track each step status, and avoid custom logic for tracking failures. Which AWS service best meets these requirements?',
    options: [
      { id: 'a', text: 'AWS Batch' },
      { id: 'b', text: 'AWS Step Functions' },
      { id: 'c', text: 'Amazon SQS' },
      { id: 'd', text: 'AWS Glue' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'AWS Step Functions provides visual workflow orchestration with a state machine that coordinates Lambda functions and other services. It handles state tracking, error handling, retries, and branching built-in — eliminating custom tracking logic. The visual console shows each step status in real-time.',
      incorrects: { a: 'AWS Batch is for batch computing jobs (HPC, data processing) — not for orchestrating multi-step application workflows with visual monitoring.', c: 'SQS queues messages but has no orchestration, visual workflow, or built-in step tracking.', d: 'AWS Glue is an ETL service for data pipelines — not for orchestrating application business logic workflows.' },
    },
    reference: 'https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html',
    keywords: ['Step Functions', 'workflow orchestration', 'state machine', 'visual workflow', 'error handling', 'step tracking'],
  },
  {
    id: 'wz-030', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'An e-commerce website uses EC2 behind an ALB. The domain is myshoppingweb.com. The client requires customers to access the site via both myshoppingweb.com (apex domain) and www.myshoppingweb.com. You manage DNS using Route 53. Which configuration should you set up?',
    options: [
      { id: 'a', text: 'Create a CNAME record for myshoppingweb.com pointing to the ALB and an Alias record for www.myshoppingweb.com' },
      { id: 'b', text: 'Create a CNAME record for myshoppingweb.com and a CNAME record for www.myshoppingweb.com' },
      { id: 'c', text: 'Create an Alias record for myshoppingweb.com and a CNAME record for www.myshoppingweb.com' },
      { id: 'd', text: 'Create an A record for myshoppingweb.com and an AAAA record for www.myshoppingweb.com' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'DNS specification prohibits using a CNAME record for an apex/root domain (e.g. myshoppingweb.com) because other records (like SOA, NS) must coexist at the apex. Route 53 Alias records solve this — they can point an apex domain to an ALB. For the www subdomain, a CNAME record works fine.',
      incorrects: { a: 'You CANNOT use a CNAME for the apex domain — this violates DNS specification and Route 53 will not allow it.', b: 'Same issue — CNAME for apex domain is not allowed by DNS specification.', d: 'A records point to IP addresses, not to an ALB DNS name. ALB IPs change, so pointing directly to an IP is not reliable or recommended.' },
    },
    reference: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html',
    keywords: ['Route 53', 'Alias record', 'CNAME', 'apex domain', 'root domain', 'ALB', 'DNS'],
  },
]

const batch3: Q[] = [
  {
    id: 'wz-031', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A company has a centralized data lake account. Applications in other accounts send messages to an SQS queue in this account. What is the most efficient and scalable way to allow other AWS accounts to send messages to this centralized SQS queue?',
    options: [
      { id: 'a', text: 'Use an IAM policy in the Analytics Account to grant SendMessage permissions to other accounts' },
      { id: 'b', text: 'Use an SQS queue policy to grant SendMessage permissions to other accounts' },
      { id: 'c', text: 'Use an IAM role in the Analytics Account and let other accounts assume it to send messages' },
      { id: 'd', text: 'Both B and C are valid and equally efficient solutions' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'SQS uses resource-based policies (queue policies) for cross-account access. Adding a queue policy that grants sqs:SendMessage to the principal of the other accounts is the most direct and scalable approach — no role assumption required by the sending accounts.',
      incorrects: { a: 'An IAM policy in the Analytics Account alone cannot grant cross-account access. The queue policy (resource-based policy) must explicitly allow the external account principal.', c: 'Having each external account assume an IAM role adds complexity — they need to call STS AssumeRole first. Queue policy is simpler and more direct.', d: 'While C could work technically, it is not as efficient as B. Queue policy is the simpler and preferred approach for cross-account SQS.' },
    },
    reference: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-security-best-practices.html',
    keywords: ['SQS queue policy', 'cross-account', 'resource-based policy', 'SendMessage', 'centralized queue'],
  },
  {
    id: 'wz-032', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Hard',
    scenario: 'An organization has an Account Creation microservice that orchestrates downstream APIs to open accounts. Some calls are asynchronous. Occasionally, an async call fails (e.g., customer profile not created), resulting in inconsistent state — account opened but data missing. How can you improve the system to maximize durability and ensure consistent flows?',
    options: [
      { id: 'a', text: 'Implement asynchronous steps as synchronous and wrap them in a distributed transaction' },
      { id: 'b', text: 'Handle exceptions and implement a retry mechanism to ensure API success' },
      { id: 'c', text: 'Handle asynchronous failures with Amazon SNS notifications to alert support staff' },
      { id: 'd', text: 'Use Amazon SQS and AWS Lambda to implement an event-driven architecture' },
    ],
    correctId: 'd',
    explanation: {
      correct: 'SQS + Lambda event-driven architecture provides durability through message persistence (SQS retains messages if processing fails), retry mechanisms (visibility timeout + DLQ), and decoupling. Each async step becomes an event-driven Lambda triggered by SQS — if it fails, the message reappears for retry, ensuring eventual consistency.',
      incorrects: { a: 'Converting async to sync reduces scalability and distributed transactions across microservices are complex, fragile, and anti-pattern in microservices architecture.', b: 'Retry logic at the API call level still does not guarantee durability if the process crashes mid-flow — the state is lost.', c: 'SNS notifications alert humans but do not fix the inconsistency automatically — it requires manual intervention and does not maximize durability.' },
    },
    reference: 'https://docs.aws.amazon.com/sqs/latest/dg/welcome.html',
    keywords: ['SQS', 'Lambda', 'event-driven', 'microservices', 'durability', 'async', 'retry', 'DLQ'],
  },
  {
    id: 'wz-033', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'An organization is migrating Employee Self-Service applications from on-premises to AWS. It has millions of users in on-premises Active Directory. The goal is to allow users to log in once and access AWS-hosted applications and third-party SaaS apps like Salesforce without a second login. What is the best solution?',
    options: [
      { id: 'a', text: 'Define users in IAM and ask them to log in separately to AWS-hosted applications' },
      { id: 'b', text: 'Use web identity federation with providers like Amazon or Facebook' },
      { id: 'c', text: 'Use SAML 2.0 federation and let users assume roles to access AWS' },
      { id: 'd', text: 'Use AWS IAM Identity Center with SAML 2.0 to federate from the on-prem directory' },
    ],
    correctId: 'd',
    explanation: {
      correct: 'AWS IAM Identity Center (formerly AWS SSO) provides a unified SSO portal that integrates with on-premises Active Directory via SAML 2.0. Users log in once through the portal and get single-click access to AWS accounts AND third-party SaaS applications (like Salesforce) — exactly what the scenario requires.',
      incorrects: { a: 'Defining users in IAM requires separate credentials management and does not provide SSO or integration with on-premises AD.', b: 'Web identity federation is for consumer-facing apps using public identity providers (Google, Amazon, Facebook) — not for enterprise Active Directory SSO.', c: 'SAML 2.0 federation with IAM roles alone gives AWS access but does not provide an SSO portal or SaaS application integration.' },
    },
    reference: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html',
    keywords: ['IAM Identity Center', 'SAML 2.0', 'SSO', 'Active Directory', 'federation', 'SaaS integration'],
  },
  {
    id: 'wz-034', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'An organization is implementing a cloud-native microservices banking application using Amazon EKS. The application handles sensitive financial data and requires secure, high-performance shared storage accessible by multiple EC2 nodes. Which storage solution best meets these requirements?',
    options: [
      { id: 'a', text: 'General Purpose SSD-backed EBS volumes with Multi-Attach and encryption at rest' },
      { id: 'b', text: 'EBS-Optimized instances with SSD-backed EBS volumes and Multi-Attach enabled' },
      { id: 'c', text: 'Provisioned IOPS SSD EBS volumes with Multi-Attach and encryption at rest' },
      { id: 'd', text: 'Throughput-optimized HDD volumes with Multi-Attach and encryption at rest' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'For mission-critical banking applications requiring high, consistent IOPS, Provisioned IOPS SSD (io1/io2) is the correct choice. Crucially, Multi-Attach (shared access across multiple EC2 nodes) is ONLY supported on io1 and io2 volumes — not on gp2, gp3, or HDD types. Encryption at rest adds the required security layer.',
      incorrects: { a: 'General Purpose SSD (gp2/gp3) does NOT support Multi-Attach — this option is technically impossible.', b: 'EBS-Optimized is an EC2 instance feature, not a volume type. gp2/gp3 still do not support Multi-Attach.', d: 'Throughput-Optimized HDD (st1) is for sequential workloads (log processing, big data) — not for high-performance random I/O banking applications. st1 also does NOT support Multi-Attach.' },
    },
    reference: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes-multi.html',
    keywords: ['EBS Multi-Attach', 'io2', 'Provisioned IOPS', 'EKS', 'shared storage', 'encryption at rest'],
  },
  {
    id: 'wz-035', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A retail analytics company runs Kubernetes applications on Amazon EKS. They want each pod to retrieve sensitive configuration data without embedding credentials in the container image or storing them in plaintext.',
    options: [
      { id: 'a', text: 'Store secrets in environment variables inside the container image' },
      { id: 'b', text: 'Store secrets in Kubernetes ConfigMaps and mount them as volumes' },
      { id: 'c', text: 'Store secrets in AWS Secrets Manager and expose them via Kubernetes Secrets' },
      { id: 'd', text: 'Use Kubernetes Secrets and integrate with AWS IAM Roles for Service Accounts (IRSA)' },
    ],
    correctId: 'd',
    explanation: {
      correct: 'IRSA (IAM Roles for Service Accounts) allows individual pods to assume specific IAM roles via service account annotation. Pods can access AWS Secrets Manager directly using the assigned role — no credentials are stored in the image, environment variables, or plaintext. This is the AWS-native best practice for EKS secret management.',
      incorrects: { a: 'Environment variables in the container image embed credentials — this is the exact anti-pattern the question wants to avoid.', b: 'ConfigMaps are for non-sensitive configuration data — they are stored in plaintext in etcd. Using them for secrets is a security anti-pattern.', c: 'Secrets Manager integration is good, but without IRSA to provide the IAM credentials for Secrets Manager access, pods still need credentials stored somewhere.' },
    },
    reference: 'https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html',
    keywords: ['IRSA', 'IAM Roles for Service Accounts', 'EKS', 'Secrets Manager', 'no credentials', 'pod identity'],
  },
  {
    id: 'wz-036', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A retail company is migrating a legacy monolithic application to AWS using microservices containers. Services should run without managing servers, scale independently, and integrate easily with Secrets Manager and CloudWatch.',
    options: [
      { id: 'a', text: 'Deploy the application on Amazon EC2 Auto Scaling groups with an ELB' },
      { id: 'b', text: 'Containerize the services and deploy them on Amazon ECS using the Fargate launch type' },
      { id: 'c', text: 'Use AWS Lambda functions for each service and trigger them using API Gateway' },
      { id: 'd', text: 'Deploy containers on Amazon EKS with self-managed EC2 worker nodes' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'ECS with Fargate is serverless container orchestration — no EC2 instances to manage. Each service scales independently via ECS Service Auto Scaling. Fargate natively integrates with Secrets Manager (for credentials) and CloudWatch (for logs and metrics). It is the cleanest serverless container solution.',
      incorrects: { a: 'EC2 Auto Scaling groups require managing the underlying EC2 instances — contradicts the "without managing servers" requirement.', c: 'Lambda is not containerized by default (though Lambda supports container images). Lambda has execution time limits (15 min) that may not suit all microservices.', d: 'EKS with self-managed EC2 nodes requires managing the Kubernetes worker node infrastructure — not serverless.' },
    },
    reference: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html',
    keywords: ['ECS Fargate', 'serverless containers', 'microservices', 'no server management', 'independent scaling'],
  },
  {
    id: 'wz-037', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'The CEO wants to capture all user activity on AWS resources for long-term audits. The compliance team needs the ability to query activity logs for specific events across accounts and regions without exporting them to external tools. What is the best approach?',
    options: [
      { id: 'a', text: 'Use Amazon CloudTrail with an S3 bucket and enable log file validation' },
      { id: 'b', text: 'Use Amazon CloudWatch Logs with metric filters and alarms' },
      { id: 'c', text: 'Use AWS Config with AWS Config Recorder for resource tracking' },
      { id: 'd', text: 'Use CloudTrail Lake for advanced querying and long-term retention' },
    ],
    correctId: 'd',
    explanation: {
      correct: 'CloudTrail Lake is a managed data lake for CloudTrail events that allows SQL-based querying directly in the AWS console — no Athena setup or S3 export needed. It supports retention up to 7 years and provides multi-account, multi-region querying in one place.',
      incorrects: { a: 'Standard CloudTrail with S3 requires Athena to query logs — an additional service to set up and manage. This violates the "without exporting to external tools" requirement.', b: 'CloudWatch Logs captures application logs and metrics — it does not provide a comprehensive audit trail of all API activity across accounts.', c: 'AWS Config tracks resource configuration changes but does not capture all API activity or user actions. It is for configuration compliance, not activity auditing.' },
    },
    reference: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html',
    keywords: ['CloudTrail Lake', 'activity logs', 'SQL query', 'long-term retention', 'cross-account', 'no external tools'],
  },
  {
    id: 'wz-038', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Easy',
    scenario: 'A team runs a web application on EC2 behind an ALB and wants to track metrics such as number of incoming requests, latency, and HTTP response codes to proactively monitor and create alarms.',
    options: [
      { id: 'a', text: 'Install CloudWatch Agent on EC2 to collect ALB metrics' },
      { id: 'b', text: 'Enable access logging on the ALB and analyze logs using Athena' },
      { id: 'c', text: 'View ALB metrics in Amazon CloudWatch and create custom alarms' },
      { id: 'd', text: 'Use AWS X-Ray to trace individual HTTP requests across the ALB' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'ALB automatically publishes metrics to CloudWatch (RequestCount, TargetResponseTime, HTTPCode_Target_4XX_Count, etc.) without any additional configuration. You can view these in CloudWatch Metrics and create CloudWatch Alarms on any metric to be notified when thresholds are crossed.',
      incorrects: { a: 'CloudWatch Agent collects OS-level metrics from EC2 (CPU, memory, disk) — ALB metrics are published directly to CloudWatch by the ALB itself, no agent needed.', b: 'ALB access logging to S3 + Athena is for detailed log analysis (individual requests) — not for real-time metrics and alarms.', d: 'X-Ray provides distributed tracing for debugging — it is not designed for metrics dashboards or threshold alarms.' },
    },
    reference: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-cloudwatch-metrics.html',
    keywords: ['ALB', 'CloudWatch metrics', 'alarms', 'RequestCount', 'latency', 'HTTP codes'],
  },
  {
    id: 'wz-039', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'During a compliance review, issues identified include: all S3 buckets were publicly accessible, and many EC2 instances were over-utilized. The organization wants to understand, manage, and remediate these issues across its AWS services. Which two AWS services can help address these problems? (Select TWO)',
    options: [
      { id: 'a', text: 'AWS GuardDuty' },
      { id: 'b', text: 'AWS Systems Manager' },
      { id: 'c', text: 'AWS Shield' },
      { id: 'd', text: 'AWS Security Hub' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'GuardDuty (A) detects threats including publicly accessible S3 buckets and suspicious activity. Security Hub (D) aggregates security findings from multiple AWS services, provides compliance checks (including S3 public access findings), and gives a unified view to manage and remediate security issues across the organization.',
      incorrects: { b: 'Systems Manager helps with EC2 management (patching, commands) but does not detect or report on S3 public access or security compliance issues.', c: 'Shield protects against DDoS attacks — it does not detect S3 misconfigurations or resource over-utilization.' },
    },
    reference: 'https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html',
    keywords: ['GuardDuty', 'Security Hub', 'S3 public access', 'compliance', 'security findings', 'remediation'],
  },
  {
    id: 'wz-040', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Easy',
    scenario: 'A marketing team generates large CSV files daily stored in Amazon S3. Analysts want to query specific columns from these CSV files without downloading them locally using standard SQL syntax.',
    options: [
      { id: 'a', text: 'Use AWS Glue and build an ETL pipeline into Redshift' },
      { id: 'b', text: 'Use Amazon Athena to query data directly from S3' },
      { id: 'c', text: 'Use Amazon EMR with Hive for SQL queries' },
      { id: 'd', text: 'Load data into Amazon RDS and connect using BI tools' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'Amazon Athena is a serverless interactive query service that queries data directly in S3 using standard SQL — no ETL, no loading, no database setup. Pay only for data scanned. Perfect for ad-hoc CSV analysis.',
      incorrects: { a: 'Glue ETL + Redshift requires building a pipeline, provisioning Redshift, and loading data — significant setup and cost for simple ad-hoc queries.', c: 'EMR with Hive is powerful but requires cluster setup and management — overly complex for simple CSV analytics.', d: 'Loading into RDS requires data transfer and a running database instance — higher cost and effort than needed for this use case.' },
    },
    reference: 'https://docs.aws.amazon.com/athena/latest/ug/what-is.html',
    keywords: ['Athena', 'S3', 'SQL', 'serverless query', 'CSV', 'no ETL', 'ad-hoc query'],
  },
]

const batch4: Q[] = [
  {
    id: 'wz-041', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A gaming company uses CloudFormation with three stacks: Security Stack (security groups), Network Stack (VPC/subnets), and Application Stack (compute). They need the Security Group from the Security Stack to be automatically referenced by the other stacks. Which CloudFormation feature enables cross-stack references?',
    options: [
      { id: 'a', text: 'CloudFormation Outputs' },
      { id: 'b', text: 'CloudFormation Mappings' },
      { id: 'c', text: 'CloudFormation Parameters' },
      { id: 'd', text: 'CloudFormation Conditions' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'CloudFormation Outputs allow a stack to export values (like a Security Group ID) that other stacks can import using Fn::ImportValue. The Security Stack exports the SG ID, and the Network/Application Stacks import it — enabling cross-stack references without hardcoding resource IDs.',
      incorrects: { b: 'Mappings are for static lookup tables within a single template (e.g., region-to-AMI) — they cannot share values across stacks.', c: 'Parameters accept user input at deployment time — they require manual entry, not automatic cross-stack reference.', d: 'Conditions control conditional resource creation within a single template — they do not enable cross-stack value sharing.' },
    },
    reference: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html',
    keywords: ['CloudFormation Outputs', 'cross-stack reference', 'Fn::ImportValue', 'Export', 'stack dependency'],
  },
  {
    id: 'wz-042', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A retail company expects a surge in write operations due to a flagship product launch. The current RDS instance is nearing its IOPS limit. Vertical scaling is not preferred due to budget constraints. Which architectural change should a Solutions Architect recommend?',
    options: [
      { id: 'a', text: 'Vertically scale RDS by increasing the instance size and switch to Provisioned IOPS storage' },
      { id: 'b', text: 'Migrate the relational data to Amazon DynamoDB tables' },
      { id: 'c', text: 'Implement Amazon SQS in front of RDS to buffer and decouple write-intensive operations' },
      { id: 'd', text: 'Use Amazon MQ to collect user input and write asynchronously to RDS' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'SQS decouples the application from RDS for write operations. Instead of writing directly to RDS (which is hitting IOPS limits), the application puts write requests into SQS. A consumer (Lambda or EC2) reads from SQS and writes to RDS at a controlled rate — smoothing out the burst and preventing IOPS exhaustion without vertical scaling.',
      incorrects: { a: 'Vertical scaling with Provisioned IOPS violates the budget constraint stated in the question.', b: 'Migrating relational data to DynamoDB is a major architectural change that may not preserve relational integrity or query capabilities — not appropriate without more context.', d: 'Amazon MQ (ActiveMQ/RabbitMQ) is for legacy messaging protocol migration — SQS is simpler, cloud-native, and more appropriate for this buffering pattern.' },
    },
    reference: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dg.html',
    keywords: ['SQS', 'RDS', 'write buffering', 'IOPS', 'decouple', 'burst traffic', 'no vertical scaling'],
  },
  {
    id: 'wz-043', domain: 'd4', domainLabel: 'Design Cost-Optimized Architectures', difficulty: 'Medium',
    scenario: 'A healthcare organization must store patient lab records long-term. The records will rarely be accessed but must be retrievable immediately (within milliseconds) when needed. The organization needs a durable, secure, and cost-effective storage class for up to five years. Which S3 storage class best meets these requirements?',
    options: [
      { id: 'a', text: 'Amazon S3 Standard' },
      { id: 'b', text: 'Amazon S3 Standard-Infrequent Access (S3 Standard-IA)' },
      { id: 'c', text: 'Amazon S3 Glacier Instant Retrieval' },
      { id: 'd', text: 'Amazon S3 One Zone-Infrequent Access' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'S3 Glacier Instant Retrieval is designed for rarely accessed data that requires millisecond retrieval when needed. It offers the lowest cost for long-term infrequent storage while maintaining the same millisecond latency as S3 Standard — perfect for medical records that are rarely accessed but must be immediately available.',
      incorrects: { a: 'S3 Standard is for frequently accessed data — it is more expensive and not optimized for rarely accessed long-term storage.', b: 'S3 Standard-IA also provides millisecond retrieval and multi-AZ durability, but Glacier Instant Retrieval is cheaper for data accessed truly rarely (quarterly or less).', d: 'S3 One Zone-IA stores data in a single AZ — if that AZ fails, data is lost. Not suitable for critical healthcare records requiring high durability.' },
    },
    reference: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html',
    keywords: ['S3 Glacier Instant Retrieval', 'millisecond retrieval', 'rarely accessed', 'long-term storage', 'healthcare', 'durable'],
  },
  {
    id: 'wz-044', domain: 'd4', domainLabel: 'Design Cost-Optimized Architectures', difficulty: 'Medium',
    scenario: 'A municipality hosts a citizen engagement app on EC2. The backend database remains on-premises due to regulatory compliance and cannot be migrated to AWS. The organization wants to extend on-premises databases into AWS for seamless AWS integration while maintaining low latency and a consistent hybrid experience. Which AWS service would you recommend?',
    options: [
      { id: 'a', text: 'AWS Outposts' },
      { id: 'b', text: 'Use AWS Snowball Edge to copy the data and upload to AWS' },
      { id: 'c', text: 'AWS DataSync' },
      { id: 'd', text: 'AWS Storage Gateway' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'AWS Outposts brings AWS infrastructure (including RDS, EC2, ECS) physically into the on-premises data center. The database stays on-premises (on Outposts hardware) while using AWS APIs — providing seamless AWS integration, low latency to local applications, and compliance with data residency requirements.',
      incorrects: { b: 'Snowball Edge is for one-time or periodic physical data migration — not for extending AWS services to on-premises or maintaining a live hybrid experience.', c: 'DataSync is for transferring files/objects between on-premises and AWS — not for extending AWS database services on-premises.', d: 'Storage Gateway provides hybrid storage (file, volume, tape) — it does not extend database services like RDS to on-premises.' },
    },
    reference: 'https://docs.aws.amazon.com/outposts/latest/userguide/what-is-outposts.html',
    keywords: ['AWS Outposts', 'on-premises AWS', 'data residency', 'compliance', 'hybrid', 'extend AWS services'],
  },
  {
    id: 'wz-045', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Hard',
    scenario: 'A pharmaceutical research company needs to build a secure, scalable centralized data lake on AWS. Data must be cleansed before landing (remove duplicates/anomalies), and the solution must enforce fine-grained access controls down to the row, column, and cell levels. Which AWS service best satisfies these requirements?',
    options: [
      { id: 'a', text: 'Amazon Redshift Spectrum' },
      { id: 'b', text: 'Amazon Redshift' },
      { id: 'c', text: 'AWS Glue Data Catalog' },
      { id: 'd', text: 'AWS Lake Formation' },
    ],
    correctId: 'd',
    explanation: {
      correct: 'AWS Lake Formation provides a complete data lake governance solution: data ingestion/cleansing via Glue ETL, centralized cataloging, and most importantly fine-grained access control at the row, column, and cell level — beyond what Glue Data Catalog alone can enforce.',
      incorrects: { a: 'Redshift Spectrum queries external S3 data but does not provide fine-grained row/column/cell access control or data cleansing capabilities.', b: 'Redshift is a data warehouse for structured analytics — it is not a data lake solution with fine-grained cell-level access control.', c: 'Glue Data Catalog provides metadata management and table-level/column discovery, but does not enforce row-level, column-level, or cell-level access control — that requires Lake Formation.' },
    },
    reference: 'https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html',
    keywords: ['Lake Formation', 'fine-grained access', 'row-level security', 'column-level', 'cell-level', 'data lake', 'Glue Data Catalog'],
  },
  {
    id: 'wz-046', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Easy',
    scenario: 'A media company plans to deploy a relational database on AWS. The database must automatically scale compute capacity in response to unpredictable application traffic without requiring manual provisioning or management. Which Amazon RDS option meets these requirements?',
    options: [
      { id: 'a', text: 'Amazon Aurora' },
      { id: 'b', text: 'Amazon RDS for MySQL' },
      { id: 'c', text: 'Amazon Aurora Serverless' },
      { id: 'd', text: 'Amazon RDS for PostgreSQL' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'Aurora Serverless v2 automatically scales compute capacity in Aurora Capacity Units (ACUs) up and down in response to actual usage — no manual provisioning, no capacity planning. It can scale to near-zero during idle periods, making it cost-effective for unpredictable traffic.',
      incorrects: { a: 'Standard Aurora provides HA and Read Replicas but requires you to manually choose and provision the instance size — it does not auto-scale the primary write capacity.', b: 'RDS for MySQL requires manual instance sizing and scaling — not automatic.', d: 'RDS for PostgreSQL also requires manual scaling — not serverless.' },
    },
    reference: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html',
    keywords: ['Aurora Serverless', 'auto-scale', 'unpredictable traffic', 'no provisioning', 'ACU', 'serverless database'],
  },
  {
    id: 'wz-047', domain: 'd4', domainLabel: 'Design Cost-Optimized Architectures', difficulty: 'Medium',
    scenario: 'A news broadcasting company needs a low-cost, high-throughput file storage solution for data accessed by multiple EC2 instances within a single region. The data supports local advertising campaigns in one Availability Zone, is rarely accessed unless recovery is needed, and can be easily regenerated if lost. Which EFS storage class is most suitable?',
    options: [
      { id: 'a', text: 'EFS Standard' },
      { id: 'b', text: 'EFS One Zone' },
      { id: 'c', text: 'EFS Standard-Infrequent Access (IA)' },
      { id: 'd', text: 'EFS One Zone-Infrequent Access (IA)' },
    ],
    correctId: 'd',
    explanation: {
      correct: 'EFS One Zone-IA is the lowest-cost EFS storage class, combining single-AZ storage (cheaper than multi-AZ) with infrequent access pricing. Since the data is in one AZ, rarely accessed, and can be regenerated if lost (single AZ risk acceptable), this is the most cost-effective choice.',
      incorrects: { a: 'EFS Standard is multi-AZ and for frequently accessed data — significantly more expensive than needed for this use case.', b: 'EFS One Zone stores data in a single AZ but is optimized for frequently accessed data — EFS One Zone-IA adds the infrequent access pricing tier for additional savings.', c: 'EFS Standard-IA is multi-AZ infrequent access — more expensive than EFS One Zone-IA since multi-AZ redundancy is not needed (data can be regenerated).' },
    },
    reference: 'https://docs.aws.amazon.com/efs/latest/ug/storage-classes.html',
    keywords: ['EFS One Zone-IA', 'EFS storage classes', 'infrequent access', 'single AZ', 'low cost', 'regenerable data'],
  },
  {
    id: 'wz-048', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A global media company uses Amazon Redshift for growing structured and semi-structured data. As data volumes increase, the company experiences performance issues due to network bandwidth and CPU processing limits. Which feature should you recommend to improve Redshift query performance while minimizing operational overhead and cost?',
    options: [
      { id: 'a', text: 'Use Amazon S3 Transfer Acceleration to move data to S3 and query via Redshift Spectrum' },
      { id: 'b', text: 'Use Amazon Redshift Spectrum to enhance query performance' },
      { id: 'c', text: 'Use AQUA (Advanced Query Accelerator) for Amazon Redshift' },
      { id: 'd', text: 'Enable caching using Amazon ElastiCache Memcached' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'AQUA (Advanced Query Accelerator) is a distributed cache that moves computation closer to storage, offloading data-intensive query processing from the Redshift compute nodes. This directly addresses CPU and network bottlenecks. It is available on ra3 instances at no extra charge — minimizing both overhead and cost.',
      incorrects: { a: 'S3 Transfer Acceleration speeds up data uploads to S3, not Redshift query performance.', b: 'Redshift Spectrum queries data in external S3 — it adds another network hop and does not resolve the CPU/bandwidth bottlenecks on the existing Redshift cluster.', d: 'ElastiCache caches application query results but is external to Redshift and cannot cache the analytical query processing that causes the CPU bottleneck.' },
    },
    reference: 'https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-aqua.html',
    keywords: ['AQUA', 'Redshift', 'query performance', 'CPU offload', 'ra3 instances', 'distributed cache'],
  },
  {
    id: 'wz-049', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A financial analytics firm needs to deploy containerized workloads across its on-premises data centers while maintaining consistency with the AWS cloud control plane. The firm also wants the flexibility to use open-source Kubernetes in its hybrid architecture without being locked into AWS-managed infrastructure. Which service will help meet these requirements?',
    options: [
      { id: 'a', text: 'Amazon ECS Anywhere' },
      { id: 'b', text: 'Amazon EKS Anywhere' },
      { id: 'c', text: 'Amazon EKS Distro' },
      { id: 'd', text: 'Amazon EKS' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'EKS Anywhere enables you to deploy and manage Kubernetes clusters on-premises using open-source tools (based on EKS Distro) while maintaining management consistency with the AWS control plane. It uses open-source Kubernetes, satisfying both the "open-source" and "AWS control plane consistency" requirements.',
      incorrects: { a: 'ECS Anywhere runs ECS tasks on-premises — the question specifically asks for Kubernetes, not ECS.', c: 'EKS Distro is the open-source Kubernetes distribution used by EKS. It runs fully on-premises with NO AWS control plane — contradicts the "consistency with AWS cloud control plane" requirement.', d: 'Amazon EKS runs only in AWS regions — it does not support on-premises deployment.' },
    },
    reference: 'https://docs.aws.amazon.com/eks/latest/userguide/eks-anywhere.html',
    keywords: ['EKS Anywhere', 'on-premises Kubernetes', 'open-source K8s', 'hybrid', 'AWS control plane', 'EKS Distro'],
  },
  {
    id: 'wz-050', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'An organization operates hundreds of EC2 instances across multiple AWS accounts and regions using custom AMIs. They are concerned about accidental deletions of AMIs used for production workloads and need a way to quickly recover them without extensive manual effort. Which solution best addresses this requirement?',
    options: [
      { id: 'a', text: 'Use Recycle Bin' },
      { id: 'b', text: 'Use CloudFormation StackSets' },
      { id: 'c', text: 'Use Elastic Beanstalk' },
      { id: 'd', text: 'Take snapshots of EBS volumes and use them to recreate AMIs' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'AWS Recycle Bin retains deleted AMIs and EBS snapshots for a defined retention period (1 day to 1 year). Accidentally deleted AMIs can be recovered instantly from Recycle Bin without manual effort — just restore and the AMI is back with its original ID.',
      incorrects: { b: 'CloudFormation StackSets manages multi-account/region infrastructure deployments — it cannot recover deleted AMIs.', c: 'Elastic Beanstalk manages application deployment environments — unrelated to AMI recovery.', d: 'Recreating AMIs from EBS snapshots requires significant manual effort (create snapshot, register as AMI, reconfigure) — violates the "without extensive manual effort" requirement.' },
    },
    reference: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recycle-bin.html',
    keywords: ['Recycle Bin', 'AMI recovery', 'accidental deletion', 'EBS snapshot recovery', 'retention period'],
  },
]

const batch5: Q[] = [
  {
    id: 'wz-051', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'An organization runs 100+ EC2 instances in a production VPC. A new security vulnerability requires immediately updating all instances with the latest software packages. SSH access has been explicitly disabled. What is the most efficient and secure way to update all 100 EC2 instances in parallel?',
    options: [
      { id: 'a', text: 'Use AWS Config to push the required package update to all EC2 instances at once' },
      { id: 'b', text: 'Request the IAM role for AWS Systems Manager (SSM) to be attached to EC2 instances, and use Systems Manager Run Command' },
      { id: 'c', text: 'Use AWS Systems Manager Session Manager to manually connect to each instance via browser-based SSH' },
      { id: 'd', text: 'Ask a DevSecOps engineer to share SSH credentials so you can manually access and update the instances' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'SSM Run Command executes commands on EC2 instances at scale without requiring SSH access. You specify a command document (e.g., yum update -y) and target all instances — SSM Agent on each instance executes in parallel. Requires: SSM Agent installed + AmazonSSMManagedInstanceCore policy on the instance IAM role.',
      incorrects: { a: 'AWS Config is for recording resource configuration changes and checking compliance rules — it cannot execute software updates on EC2 instances.', c: 'Session Manager provides interactive shell access (one instance at a time) — manually connecting to 100 instances individually is not efficient.', d: 'Sharing SSH credentials violates security best practices and is explicitly against the requirement since SSH is disabled.' },
    },
    reference: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html',
    keywords: ['SSM Run Command', 'no SSH', 'parallel execution', 'AmazonSSMManagedInstanceCore', 'patch at scale'],
  },
  {
    id: 'wz-052', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Hard',
    scenario: 'A startup needs two EBS volumes: one for a PostgreSQL database requiring consistent latency under high random I/O load, and one for overnight log processing with large sequential writes at low cost. Which EBS volume configuration is correct?',
    options: [
      { id: 'a', text: 'Use a gp3 volume for the database and an st1 volume for logs' },
      { id: 'b', text: 'Use a gp2 volume for the database and sc1 for logs' },
      { id: 'c', text: 'Use an io2 volume for the database and gp3 for logs' },
      { id: 'd', text: 'Use an io1 volume for the database and st1 for logs' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'gp3 provides consistent, independently configurable IOPS (up to 16,000) and throughput — ideal for the PostgreSQL database under high load at lower cost than io2. st1 (Throughput Optimized HDD) is designed for large sequential write workloads like log processing and offers high throughput at low cost.',
      incorrects: { b: 'gp2 uses burst IOPS which can be inconsistent under sustained load — not suitable for "consistent latency." sc1 is the coldest HDD for infrequently accessed data, not optimized for sequential write throughput.', c: 'io2 would work for the database but is more expensive than needed when gp3 suffices. gp3 for logs is not optimal — st1 is cheaper and better suited for sequential log writes.', d: 'io1 works but is older and more expensive than gp3 for this use case. st1 is correct for logs — this option wastes money on the database volume.' },
    },
    reference: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html',
    keywords: ['EBS gp3', 'EBS st1', 'EBS io2', 'random IOPS', 'sequential throughput', 'log processing', 'database storage'],
  },
  {
    id: 'wz-053', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A document management provider transmits highly classified files between AWS services. The files must be digitally signed to verify authenticity and ensure they have not been tampered with. Only the sending application should be permitted to digitally sign. Which AWS KMS key type should be used?',
    options: [
      { id: 'a', text: 'Asymmetric KMS Keys' },
      { id: 'b', text: 'AWS CloudHSM' },
      { id: 'c', text: 'Symmetric KMS Keys' },
      { id: 'd', text: 'Customer managed keys' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'Asymmetric KMS keys consist of a public/private key pair. The sending application uses the private key (which never leaves KMS) to digitally sign documents. Recipients verify the signature using the public key. Since only the sender can access the private key via KMS, only the sender can sign — satisfying the requirement.',
      incorrects: { b: 'CloudHSM provides dedicated hardware for key management but is not the specific key type for digital signing. The question asks for KMS key type.', c: 'Symmetric KMS keys use a single key for both encrypt and decrypt — they cannot create asymmetric digital signatures where only one party can sign.', d: 'Customer managed key is a key ownership/management concept, not a key type. The key type (symmetric vs asymmetric) determines signing capability.' },
    },
    reference: 'https://docs.aws.amazon.com/kms/latest/developerguide/symmetric-asymmetric.html',
    keywords: ['KMS', 'asymmetric keys', 'digital signing', 'public private key', 'private key signs', 'public key verifies'],
  },
  {
    id: 'wz-054', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A pharmaceutical company is building a financial analytics platform where data flows through S3, Lambda, and DynamoDB. The company wants a 256-bit encryption key that never leaves AWS KMS unencrypted and can be used for both encryption and decryption. They do not want to manage or own the key. Which KMS key type should be used?',
    options: [
      { id: 'a', text: 'Asymmetric KMS Keys' },
      { id: 'b', text: 'AWS CloudHSM' },
      { id: 'c', text: 'Symmetric KMS Keys' },
      { id: 'd', text: 'Customer managed key' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'Symmetric KMS keys use a single 256-bit key for both encryption and decryption, and the key never leaves AWS KMS unencrypted. AWS managed symmetric keys (not customer managed) are managed entirely by AWS — the customer does not need to manage rotation, policies, or key material. All AWS services (S3, Lambda, DynamoDB) use symmetric KMS keys for encryption.',
      incorrects: { a: 'Asymmetric keys use public/private key pairs for signing or asymmetric encryption — not for transparent encrypt+decrypt used by AWS services.', b: 'CloudHSM requires the customer to manage the HSM hardware and key material — contradicts "do not want to manage or own the key."', d: 'Customer managed keys give the customer control over key policies and rotation — contradicts "do not want to manage or own the key." AWS managed symmetric key is the right choice.' },
    },
    reference: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html',
    keywords: ['KMS', 'symmetric keys', '256-bit', 'AWS managed key', 'encrypt decrypt', 'no key management', 'S3 Lambda DynamoDB'],
  },
  {
    id: 'wz-055', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Easy',
    scenario: 'A company is deploying a customer support chatbot on AWS. The chatbot must handle natural language queries, maintain context across conversation turns, and integrate with backend systems through AWS Lambda. Which AWS service should be used?',
    options: [
      { id: 'a', text: 'Amazon Polly' },
      { id: 'b', text: 'Amazon Comprehend' },
      { id: 'c', text: 'Amazon Lex' },
      { id: 'd', text: 'Amazon Transcribe' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'Amazon Lex is the conversational AI service for building chatbots. It handles NLU (Natural Language Understanding), maintains context across conversation turns, and integrates natively with AWS Lambda for backend fulfillment. Lex is the same technology that powers Amazon Alexa.',
      incorrects: { a: 'Polly converts text to speech (TTS) — it produces audio output. It cannot understand or respond to natural language queries.', b: 'Comprehend analyzes text for sentiment, entities, and key phrases — it does not build conversational interfaces or maintain dialogue context.', d: 'Transcribe converts speech to text (STT) — it does not understand intent or maintain conversation context.' },
    },
    reference: 'https://docs.aws.amazon.com/lex/latest/dg/what-is.html',
    keywords: ['Amazon Lex', 'chatbot', 'NLU', 'conversational AI', 'context', 'Lambda integration', 'Alexa technology'],
  },
  {
    id: 'wz-056', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Hard',
    scenario: 'A private bank is deploying Amazon RDS for core banking. A third-party vendor will manage the database. The security team requires all sensitive data to be encrypted at rest using a cryptographic key stored in a single-tenant hardware security module. The solution must not require application-level changes. Which database configuration meets these requirements?',
    options: [
      { id: 'a', text: 'Deploy Oracle on Amazon RDS with Transparent Data Encryption enabled; use AWS CloudHSM to store all keys' },
      { id: 'b', text: 'Deploy MariaDB on Amazon RDS with Transparent Data Encryption enabled; use AWS CloudHSM to store all keys' },
      { id: 'c', text: 'Deploy Microsoft SQL Server on Amazon RDS with Transparent Data Encryption enabled; use AWS KMS to store all keys' },
      { id: 'd', text: 'Deploy PostgreSQL on Amazon RDS with Transparent Data Encryption enabled; use AWS KMS to store all keys' },
    ],
    correctId: 'a',
    explanation: {
      correct: 'Transparent Data Encryption (TDE) with CloudHSM integration on RDS is ONLY supported for Oracle on RDS (not MySQL, MariaDB, PostgreSQL, or SQL Server on RDS). CloudHSM provides single-tenant dedicated hardware for key storage. TDE encrypts at the storage layer — no application changes required.',
      incorrects: { b: 'MariaDB on RDS does not support TDE with CloudHSM integration — MariaDB uses AWS KMS for encryption.', c: 'SQL Server TDE with CloudHSM is NOT supported on Amazon RDS. Also, KMS is multi-tenant — not single-tenant hardware.', d: 'PostgreSQL on RDS uses AWS KMS for encryption (not TDE), and KMS is multi-tenant — not a dedicated single-tenant HSM.' },
    },
    reference: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Oracle.Concepts.overview.html',
    keywords: ['RDS Oracle', 'TDE', 'CloudHSM', 'single-tenant HSM', 'Transparent Data Encryption', 'no app changes'],
  },
  {
    id: 'wz-057', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A critical web application is deployed on EC2 behind an ELB. The security team wants maximum protection from DDoS attacks and the ability to implement custom mitigations. The operations team requires near real-time visibility into potential complex attacks. Which solution meets these requirements?',
    options: [
      { id: 'a', text: 'Enable Amazon GuardDuty and use Amazon Detective for visibility into complex attacks' },
      { id: 'b', text: 'Enable AWS Shield Advanced on the ELB and configure AWS WAF with custom rules' },
      { id: 'c', text: 'Use AWS Shield Standard and configure AWS WAF with custom rules' },
      { id: 'd', text: 'Use Amazon Inspector for DDoS detection and Amazon Detective for investigation' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'Shield Advanced provides maximum DDoS protection with: DDoS Response Team (DRT), real-time metrics and attack reports, WAF integration for Layer 7, cost protection during attacks. WAF custom rules enable targeted mitigations. Together they satisfy all three requirements: maximum protection, custom mitigation, real-time visibility.',
      incorrects: { a: 'GuardDuty detects threats via log analysis — it does not protect against DDoS attacks or provide custom mitigation rules. Detective investigates security events post-fact.', c: 'Shield Standard is free but provides only basic Layer 3/4 protection — no custom mitigations, no real-time visibility dashboard, no DRT access.', d: 'Inspector scans for software vulnerabilities on EC2 — it has no DDoS detection capability. Detective investigates post-fact security events.' },
    },
    reference: 'https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html',
    keywords: ['Shield Advanced', 'WAF', 'DDoS protection', 'custom mitigation', 'real-time visibility', 'DRT', 'ELB'],
  },
  {
    id: 'wz-058', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A startup uses CloudFormation templates to deploy software on EC2 instances. The development team wants to read metadata from the CloudFormation template to automate the installation of software packages when an instance launches. Which helper script should be used?',
    options: [
      { id: 'a', text: 'Use cfn-hup helper script to read template metadata and install the packages' },
      { id: 'b', text: 'Use cfn-signal helper script to read template metadata and install the packages' },
      { id: 'c', text: 'Use cfn-get-metadata helper script to read template metadata and install the packages' },
      { id: 'd', text: 'Use cfn-init helper script to read template metadata and install the packages' },
    ],
    correctId: 'd',
    explanation: {
      correct: 'cfn-init reads the AWS::CloudFormation::Init metadata section of the CloudFormation template and uses it to install packages, create files, start services, and run commands on EC2 instance launch. It is the primary bootstrap script for software installation via CloudFormation.',
      incorrects: { a: 'cfn-hup is a daemon that detects changes in stack metadata and re-runs cfn-init when the stack is updated — it is for updates, not initial installation.', b: 'cfn-signal sends a SUCCESS or FAILURE signal back to CloudFormation (for WaitCondition/CreationPolicy) — it does not read metadata or install packages.', c: 'cfn-get-metadata retrieves and displays metadata values — it does not install packages or configure the instance.' },
    },
    reference: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-helper-scripts-reference.html',
    keywords: ['cfn-init', 'cfn-signal', 'cfn-hup', 'cfn-get-metadata', 'CloudFormation helper scripts', 'bootstrap', 'package installation'],
  },
  {
    id: 'wz-059', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A web application on EC2 in VPC A needs to connect to AWS KMS for encryption. The connection should flow over the AWS network, not the internet. The solution must restrict access to KMS keys only to specific resources. Which solution best meets these requirements?',
    options: [
      { id: 'a', text: 'Deploy a proxy on an EC2 instance to access AWS KMS over the internet and control access via proxy policies' },
      { id: 'b', text: 'Attach a NAT Gateway to VPC A to route traffic to AWS KMS and use Network ACLs to restrict access' },
      { id: 'c', text: 'Create a VPC endpoint for KMS and use a key policy with "aws:SourceVpc" to restrict access' },
      { id: 'd', text: 'Create a VPC endpoint for KMS and use a key policy with "aws:SourceVpce" to restrict access' },
    ],
    correctId: 'd',
    explanation: {
      correct: 'A VPC Interface Endpoint for KMS routes KMS traffic through the AWS private network. Using the condition key "aws:SourceVpce" (endpoint ID) in the KMS key policy restricts access to requests coming only from that specific VPC endpoint — providing both private routing and least-privilege access control.',
      incorrects: { a: 'A proxy over the internet sends KMS traffic over the public internet — violates the private network requirement.', b: 'NAT Gateway routes to the public internet — KMS traffic would traverse the internet. Network ACLs cannot restrict KMS key access specifically.', c: '"aws:SourceVpc" (VPC ID) is less specific than "aws:SourceVpce" (endpoint ID). Using SourceVpc allows any request from within the VPC, while SourceVpce restricts to specific endpoint — more precise for least privilege.' },
    },
    reference: 'https://docs.aws.amazon.com/kms/latest/developerguide/kms-vpc-endpoint.html',
    keywords: ['VPC Endpoint', 'KMS', 'aws:SourceVpce', 'aws:SourceVpc', 'key policy', 'private network', 'least privilege'],
  },
  {
    id: 'wz-060', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A software development company wants to migrate a legacy CRM system from on-premises servers to the cloud with minimal disruption and downtime. Which AWS service would be most suitable?',
    options: [
      { id: 'a', text: 'Deploy AWS DataSync to migrate applications from on-premises servers to Amazon EC2' },
      { id: 'b', text: 'Implement AWS Database Migration Service to migrate applications from on-premises servers to Amazon EC2' },
      { id: 'c', text: 'Use AWS Application Discovery Service to automate the migration process' },
      { id: 'd', text: 'Utilize AWS Application Migration Service (AWS MGN) to automate the migration, ensuring minimal downtime' },
    ],
    correctId: 'd',
    explanation: {
      correct: 'AWS Application Migration Service (MGN) performs continuous block-level replication of servers from on-premises to AWS. When ready to cut over, MGN launches EC2 instances from the latest replication — minimal downtime (minutes). It is the primary lift-and-shift server migration service, replacing CloudEndure Migration.',
      incorrects: { a: 'DataSync migrates files and objects (NFS, SMB, S3) — not servers or applications. It cannot migrate an entire CRM application.', b: 'DMS is specifically for database migration — it does not migrate the full application stack or server OS/software.', c: 'Application Discovery Service identifies on-premises servers and creates an inventory for planning — it does not perform the actual migration.' },
    },
    reference: 'https://docs.aws.amazon.com/mgn/latest/ug/what-is-application-migration-service.html',
    keywords: ['AWS MGN', 'Application Migration Service', 'lift-and-shift', 'server migration', 'minimal downtime', 'block replication'],
  },
  {
    id: 'wz-063', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A genomics research group wants to store petabytes of DNA sequencing data in the cloud. The data will be used occasionally for research queries but must be retained for 10 years due to compliance. The solution must be cost-effective while ensuring durability and infrequent retrieval.',
    options: [
      { id: 'a', text: 'Store the data in Amazon S3 Standard with replication to another region' },
      { id: 'b', text: 'Use Amazon S3 Glacier Deep Archive with lifecycle transitions from S3 Standard' },
      { id: 'c', text: 'Store the data in Amazon EBS with scheduled snapshots' },
      { id: 'd', text: 'Use Amazon FSx for Lustre with S3 integration for archival' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'S3 Glacier Deep Archive is the lowest-cost AWS storage option ($0.00099/GB/month) with 12-hour retrieval. For petabyte-scale data retained 10 years with infrequent access, lifecycle policies automatically transition data from S3 Standard to Glacier Deep Archive — providing both compliance retention and maximum cost efficiency.',
      incorrects: { a: 'S3 Standard is for frequently accessed data — significantly more expensive for petabytes stored 10 years and rarely accessed.', c: 'EBS is block storage attached to EC2 instances — it is not designed for petabyte-scale archival and is expensive for this purpose.', d: 'FSx for Lustre is a high-performance parallel file system for compute-intensive HPC workloads — not for long-term cold archival storage.' },
    },
    reference: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/glacier-storage-classes.html',
    keywords: ['S3 Glacier Deep Archive', '10-year retention', 'petabyte', 'lifecycle policy', 'lowest cost', 'compliance'],
  },
  {
    id: 'wz-064', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'An e-commerce company is building a recommendation engine that must deliver personalized product suggestions in real time. The solution must respond to high-velocity user interactions and provide low-latency read and write performance at scale.',
    options: [
      { id: 'a', text: 'Use Amazon Redshift for analytics and batch recommendations' },
      { id: 'b', text: 'Use Amazon Aurora with read replicas and stored procedures' },
      { id: 'c', text: 'Use Amazon ElastiCache for Redis as a low-latency key-value store' },
      { id: 'd', text: 'Use Amazon Neptune for graph-based recommendations' },
    ],
    correctId: 'c',
    explanation: {
      correct: 'ElastiCache for Redis provides sub-millisecond latency for both reads and writes at scale. Its data structures (sorted sets, lists, hashes) are ideal for real-time recommendation engines — storing and retrieving user preference scores, product rankings, and personalized feeds in microseconds.',
      incorrects: { a: 'Redshift is designed for batch analytical queries on large datasets — it has second/minute-level latency, not sub-millisecond for real-time recommendations.', b: 'Aurora provides millisecond reads with read replicas, but not sub-millisecond writes at high velocity — relational databases have higher write latency than Redis.', d: 'Neptune is a graph database optimized for complex relationship queries (social graphs, fraud detection) — while useful for certain recommendation types, it does not match Redis for high-velocity, low-latency read/write performance.' },
    },
    reference: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html',
    keywords: ['ElastiCache Redis', 'sub-millisecond', 'real-time', 'recommendation engine', 'low-latency read write', 'high velocity'],
  },
  {
    id: 'wz-065', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A wildlife conservation organization wants to analyze camera trap images stored in S3 to monitor animal species. They want to automate image recognition without building and training a custom model from scratch.',
    options: [
      { id: 'a', text: 'Use Amazon Rekognition Custom Labels to train a model with labelled animal images in S3' },
      { id: 'b', text: 'Use Rekognition\'s general Object and Scene Detection for automatic species identification' },
      { id: 'c', text: 'Use Rekognition\'s Facial Analysis to detect animals via facial features' },
      { id: 'd', text: 'Copy images to Amazon SageMaker and build a custom deep learning model' },
    ],
    correctId: 'b',
    explanation: {
      correct: 'Rekognition\'s general Object and Scene Detection automatically identifies thousands of objects and scenes (including animals, wildlife) without any custom training. It works out of the box on S3 images — no model training required, exactly matching the "without building and training a custom model" requirement.',
      incorrects: { a: 'Rekognition Custom Labels requires labelling training images and training a custom model — contradicts the "without building and training a custom model" requirement.', c: 'Facial Analysis is specifically for human faces — it does not identify animal species.', d: 'Building a custom deep learning model in SageMaker requires significant ML expertise, labelled data, and training time — directly contradicts the "without training a custom model" requirement.' },
    },
    reference: 'https://docs.aws.amazon.com/rekognition/latest/dg/labels.html',
    keywords: ['Rekognition', 'Object Detection', 'Scene Detection', 'no custom model', 'image recognition', 'S3 images', 'wildlife'],
  },
]

const allQuestions = [...questions, ...batch2, ...batch3, ...batch4, ...batch5]

const rows = allQuestions.map((q) => {
  const options = escape(JSON.stringify(q.options))
  const explanation = escape(JSON.stringify(q.explanation))
  const keywords = escape(JSON.stringify(q.keywords))
  const reference = q.reference ? `'${escape(q.reference)}'` : 'NULL'
  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source) VALUES ('${escape(q.id)}', '${q.domain}', '${escape(q.domainLabel)}', '${q.difficulty}', '${escape(q.scenario)}', '${options}', '${escape(q.correctId)}', '${explanation}', ${reference}, '${keywords}', 'whizlab');`
})

writeFileSync('scripts/whizlab-batch2.sql', rows.join('\n'))
console.log(`Generated ${rows.length} INSERT statements → scripts/whizlab-batch2.sql`)
