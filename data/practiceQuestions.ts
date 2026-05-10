export interface Option {
  id: string
  text: string
}

export interface PracticeQuestion {
  id: string
  domain: 'd1' | 'd2' | 'd3' | 'd4'
  domainLabel: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  scenario: string
  options: Option[]
  correctId: string
  explanation: {
    correct: string
    incorrects: Record<string, string>
  }
  reference?: string
  keywords: string[]
}

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'q-ec2-userdata',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Easy',
    scenario:
      'A fleet of Amazon EC2 instances running Linux will be launched in an Amazon VPC. An application development framework and some custom software must be installed on the instances. The installation will be initiated using some scripts. What feature enables a Solutions Architect to specify the scripts the software can be installed during the EC2 instance launch?',
    options: [
      { id: 'a', text: 'AWS Config' },
      { id: 'b', text: 'Instance Metadata' },
      { id: 'c', text: 'User Data' },
      { id: 'd', text: 'Run Command (SSM)' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'User Data is the correct answer. When you launch an EC2 instance, you can pass a script (shell script or cloud-init directive) as User Data. It runs automatically on first boot, perfect for installing software and configuring the instance. User Data is limited to 16KB.',
      incorrects: {
        a: 'AWS Config is incorrect. AWS Config tracks and audits configuration changes to your AWS resources. It enforces compliance rules (e.g. "all S3 must be encrypted") but does NOT run scripts on instances.',
        b: 'Instance Metadata is incorrect. The Metadata service (accessible at 169.254.169.254) provides info ABOUT the instance — hostname, IP address, IAM role, security groups. It is read-only data, not a way to run scripts.',
        d: 'Run Command (SSM) is incorrect. AWS Systems Manager Run Command is used to manage and run commands on EXISTING, already-running instances remotely without SSH. It is NOT for scripts during launch. Use User Data for launch-time configuration.',
      },
    },
    keywords: ['User Data', 'EC2 launch', 'bootstrap', 'initialization'],
  },
  {
    id: 'q-cloudfront-s3',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'As a Solutions Architect, you want to minimize the CPU utilization of EC2 instances caused by serving a high volume of requests for static content stored in an S3 bucket. How should you enhance the current architecture to overcome this problem?',
    options: [
      { id: 'a', text: 'Use Amazon API Gateway with Lambda to retrieve the static contents from S3 buckets' },
      { id: 'b', text: 'Use Amazon CloudFront with S3 bucket as the origin' },
      { id: 'c', text: 'Use a combination of Amazon CloudFront and Amazon API Gateway in addition to Lambda' },
      { id: 'd', text: 'Add more EC2 instances and use ELB to distribute the workload' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'CloudFront with S3 as origin is correct. CloudFront is a CDN that caches static content at edge locations worldwide. By placing CloudFront in front of the S3 bucket, requests are served from the nearest edge location — completely bypassing EC2. This dramatically reduces EC2 CPU utilization since EC2 no longer handles static content delivery.',
      incorrects: {
        a: 'API Gateway + Lambda is incorrect. This is unnecessarily complex and expensive for static content. Every request would invoke a Lambda function, adding latency and cost. API Gateway and Lambda are designed for dynamic request processing, not static file serving.',
        c: 'CloudFront + API Gateway + Lambda is incorrect. While CloudFront alone is correct, adding API Gateway and Lambda is over-engineered. CloudFront with S3 as origin is sufficient. The extra services add unnecessary complexity and cost.',
        d: 'Adding more EC2 instances + ELB is incorrect. This would distribute the static content load across more instances but would NOT reduce overall CPU utilization — it just spreads the same work across more servers. It is more expensive and does not address the root cause. CloudFront offloads static delivery entirely from EC2.',
      },
    },
    keywords: ['CloudFront', 'CDN', 'static content', 'S3 origin', 'edge locations'],
  },
  {
    id: 'q-rds-multiaz',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Easy',
    scenario:
      'A company is running a critical web application using Amazon RDS for MySQL. The database must remain available even if the primary database instance fails. The recovery must happen automatically with minimal downtime. Which RDS feature should the Solutions Architect enable?',
    options: [
      { id: 'a', text: 'RDS Read Replicas' },
      { id: 'b', text: 'RDS Multi-AZ Deployment' },
      { id: 'c', text: 'RDS Automated Backups' },
      { id: 'd', text: 'Amazon ElastiCache in front of RDS' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'RDS Multi-AZ is correct. Multi-AZ maintains a synchronous standby replica in a different Availability Zone. If the primary fails, RDS automatically fails over to the standby — usually within 1–2 minutes — with no manual intervention. The DNS endpoint stays the same, so applications reconnect automatically. This is designed specifically for high availability and automatic failover.',
      incorrects: {
        a: 'Read Replicas is incorrect. Read Replicas use asynchronous replication and are designed to offload read traffic — not for automatic failover. If the primary fails, a Read Replica does NOT automatically take over. Promotion to primary requires manual action.',
        c: 'Automated Backups is incorrect. Backups let you restore to a point in time, but restoration takes time and is not automatic failover. This is for disaster recovery (RPO), not high availability (RTO minimization).',
        d: 'ElastiCache is incorrect. ElastiCache is a caching layer that reduces read load on the database. It does not provide database failover or help if RDS itself goes down.',
      },
    },
    keywords: ['RDS Multi-AZ', 'automatic failover', 'high availability', 'standby replica'],
  },
  {
    id: 'q-s3-encryption',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Easy',
    scenario:
      'A company stores sensitive financial documents in Amazon S3. The security team requires that all data must be encrypted at rest and that the company must manage the encryption keys themselves to meet compliance requirements. Which S3 encryption option should the Solutions Architect choose?',
    options: [
      { id: 'a', text: 'SSE-S3 (Server-Side Encryption with S3 managed keys)' },
      { id: 'b', text: 'SSE-KMS (Server-Side Encryption with AWS KMS keys)' },
      { id: 'c', text: 'SSE-C (Server-Side Encryption with Customer-provided keys)' },
      { id: 'd', text: 'Client-Side Encryption before uploading to S3' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'SSE-KMS is correct. With SSE-KMS, S3 encrypts data using keys stored in AWS KMS. The company can create and manage their own Customer Managed Keys (CMKs) in KMS — controlling key rotation, access policies, and audit trails via CloudTrail. This meets the "manage encryption keys" compliance requirement while keeping the encryption fully managed by AWS.',
      incorrects: {
        a: 'SSE-S3 is incorrect. With SSE-S3, AWS fully manages the encryption keys. The company has NO control over the keys — they cannot rotate, audit, or restrict key usage. This fails the "company must manage keys" requirement.',
        c: 'SSE-C is incorrect. SSE-C requires the customer to provide the encryption key with EVERY request — the key is not stored by AWS. This is technically valid for key management but is operationally complex and risky if keys are lost. SSE-KMS is the standard answer for "manage your own keys" in exam scenarios.',
        d: 'Client-Side Encryption is incorrect (for this scenario). Client-side encryption works but adds application complexity and is not the standard AWS recommendation. The question asks for an S3 encryption option, not application-level encryption.',
      },
    },
    keywords: ['SSE-KMS', 'encryption at rest', 'customer managed keys', 'CMK', 'KMS'],
  },
  {
    id: 'q-sqs-vs-sns',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'A company processes orders through a web application. The order processing service must not lose any orders even if it goes down temporarily, and orders should be processed one at a time in the sequence they were received. Which AWS service should the Solutions Architect use?',
    options: [
      { id: 'a', text: 'Amazon SNS (Simple Notification Service)' },
      { id: 'b', text: 'Amazon SQS Standard Queue' },
      { id: 'c', text: 'Amazon SQS FIFO Queue' },
      { id: 'd', text: 'Amazon Kinesis Data Streams' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'SQS FIFO Queue is correct. FIFO (First-In-First-Out) queues guarantee exactly-once processing and strict ordering. Orders are processed exactly in the sequence received. If the consumer goes down, messages stay in the queue safely — no orders are lost. FIFO queues also prevent duplicate processing with deduplication IDs.',
      incorrects: {
        a: 'SNS is incorrect. SNS is a pub/sub notification service for fan-out (one message → many subscribers). It does NOT queue messages — if a subscriber is down when a message arrives, the message is lost. No ordering guarantee.',
        b: 'SQS Standard Queue is incorrect. Standard queues provide at-least-once delivery and best-effort ordering — messages may arrive out of order or be delivered more than once. For order processing where sequence matters, FIFO is required.',
        d: 'Kinesis Data Streams is incorrect. Kinesis is designed for real-time streaming of large volumes of data (clickstreams, logs, IoT). It is over-engineered for simple order processing. SQS FIFO is the correct tool for task queuing with ordering.',
      },
    },
    keywords: ['SQS FIFO', 'ordering', 'exactly-once', 'message queue', 'deduplication'],
  },
  {
    id: 'q-iam-roles',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Easy',
    scenario:
      'A developer has written an application running on an EC2 instance that needs to read objects from an S3 bucket. The security team prohibits storing AWS credentials (access keys) on EC2 instances. What is the MOST secure way to grant the EC2 instance access to S3?',
    options: [
      { id: 'a', text: 'Store the AWS access keys in environment variables on the EC2 instance' },
      { id: 'b', text: 'Attach an IAM Role with S3 read permissions to the EC2 instance' },
      { id: 'c', text: 'Create an IAM user, generate access keys, and embed them in the application code' },
      { id: 'd', text: 'Store the AWS access keys in a config file on the EC2 instance' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'IAM Role attached to EC2 is correct and the AWS best practice. An IAM Role grants temporary credentials automatically rotated by AWS. The EC2 instance fetches these credentials from the Instance Metadata Service. No keys to store, rotate, or accidentally expose. The application uses the AWS SDK/CLI which automatically picks up the role credentials.',
      incorrects: {
        a: 'Environment variables is incorrect. While better than hardcoding in source code, storing long-term access keys anywhere on the EC2 instance (env vars, files, code) violates the security team\'s policy and is risky if the instance is compromised.',
        c: 'Embedding in application code is incorrect. This is the WORST approach — hardcoded credentials get committed to source control, visible to anyone with code access, and cannot be easily rotated. Never hardcode AWS credentials.',
        d: 'Config file on EC2 is incorrect. Same problem as env vars — long-term credentials stored on the instance. If the instance is compromised, the credentials are exposed. IAM Roles provide temporary, auto-rotating credentials with no storage risk.',
      },
    },
    keywords: ['IAM Role', 'EC2 instance profile', 'temporary credentials', 'no hardcoded keys', 'least privilege'],
  },
  {
    id: 'q-route53-failover',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Medium',
    scenario:
      'A company hosts its main website in us-east-1. For disaster recovery, they have a static S3 website hosted in eu-west-1 that should only serve traffic if the primary site is unavailable. Health checks are already configured. Which Route 53 routing policy should the Solutions Architect use?',
    options: [
      { id: 'a', text: 'Weighted routing policy' },
      { id: 'b', text: 'Latency-based routing policy' },
      { id: 'c', text: 'Failover routing policy' },
      { id: 'd', text: 'Geolocation routing policy' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'Failover routing policy is correct. Route 53 Failover routing has a primary and secondary record. Health checks monitor the primary. If the primary fails its health check, Route 53 automatically routes all traffic to the secondary (S3 static site). When primary recovers, traffic returns automatically. This is exactly the active-passive DR pattern described.',
      incorrects: {
        a: 'Weighted routing is incorrect. Weighted routing splits traffic between multiple endpoints based on a percentage you define (e.g. 80/20). It always sends traffic to BOTH endpoints simultaneously — you cannot use it to only send traffic to the secondary when primary is down.',
        b: 'Latency-based routing is incorrect. Latency routing sends users to the endpoint with the lowest network latency — both endpoints are always active. This would serve BOTH regions simultaneously, not implement failover.',
        d: 'Geolocation routing is incorrect. Geolocation routing sends users to specific endpoints based on their geographic location (country/continent). Both endpoints are active simultaneously — no health-check-based failover.',
      },
    },
    keywords: ['Route 53 Failover', 'active-passive', 'health check', 'DR', 'primary secondary'],
  },
  {
    id: 'q-lambda-vs-ec2',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Easy',
    scenario:
      'A company wants to run a function that resizes images whenever a new image is uploaded to an S3 bucket. The function runs in under 30 seconds, is triggered by S3 events, and does not run continuously. Which compute option is the MOST cost-effective?',
    options: [
      { id: 'a', text: 'Launch a dedicated EC2 instance to continuously poll S3 for new images' },
      { id: 'b', text: 'Use AWS Lambda triggered by S3 event notifications' },
      { id: 'c', text: 'Use Amazon ECS with a long-running container task' },
      { id: 'd', text: 'Use AWS Elastic Beanstalk to deploy an image processing application' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Lambda with S3 event trigger is correct. Lambda is ideal here: event-driven (S3 triggers Lambda automatically on upload), runs only when needed (no idle cost), 30-second runtime fits well within Lambda\'s 15-minute limit, and you pay only per invocation. Zero cost when no images are uploaded.',
      incorrects: {
        a: 'Dedicated EC2 instance is incorrect. Running an EC2 instance 24/7 to poll S3 is wasteful and expensive. You pay for the instance even when there are no images to process. EC2 is for workloads requiring full server control, custom OS, or continuous compute.',
        c: 'ECS long-running container is incorrect. ECS is for containerized applications — microservices, web servers, long-running tasks. For a short event-triggered function, ECS adds unnecessary operational overhead (cluster management, container orchestration).',
        d: 'Elastic Beanstalk is incorrect. Beanstalk is a PaaS for deploying web applications (Node.js, Python, Java, etc.) that need to run continuously. It still provisions EC2 instances underneath, so you pay for idle time. Overkill for a simple event-triggered function.',
      },
    },
    keywords: ['Lambda', 'serverless', 'event-driven', 'S3 trigger', 'cost-effective', 'pay per use'],
  },
  {
    id: 'q-sqs-visibility-timeout',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Medium',
    scenario:
      'Several Amazon EC2 Spot instances are being used to process messages from an Amazon SQS queue and store results in an Amazon DynamoDB table. Shortly after picking up a message from the queue, AWS terminated the Spot instance. The Spot instance had not finished processing the message. What will happen to the message?',
    options: [
      { id: 'a', text: 'The message will remain in the queue and be immediately picked up by another instance' },
      { id: 'b', text: 'The message will become available for processing again after the visibility timeout expires' },
      { id: 'c', text: 'The message will be lost as it would have been deleted from the queue when processed' },
      { id: 'd', text: 'The results may be duplicated in DynamoDB as the message will likely be processed multiple times' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'The visibility timeout is the amount of time a message is invisible in the queue after a reader picks it up. When the Spot instance picked up the message, a visibility timeout clock started. Since the instance was terminated before calling DeleteMessage, the message was never deleted. Once the visibility timeout expires, SQS makes the message visible again so another consumer can pick it up. Maximum visibility timeout is 12 hours.',
      incorrects: {
        a: 'Immediately picked up is incorrect. The message is NOT immediately available — it remains invisible during the entire visibility timeout window. Only after that window expires does it reappear in the queue. There is no instant failover for in-flight SQS messages.',
        c: 'Message will be lost is incorrect. SQS messages are only deleted when the consumer explicitly calls the DeleteMessage API after successfully processing. Simply picking up (receiving) a message does NOT delete it — it only starts the visibility timeout clock.',
        d: 'Results duplicated in DynamoDB is incorrect. Since the Spot instance was terminated before finishing processing, it likely did not write final results to DynamoDB. The message should be fully processed once by the next consumer. However, if the app did partial writes before termination, idempotency logic in your application should handle deduplication.',
      },
    },
    keywords: ['SQS', 'visibility timeout', 'Spot instance', 'in-flight message', 'DeleteMessage', 'resilience'],
  },
  {
    id: 'q-sqs-standard-vs-fifo',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Easy',
    scenario:
      'A company is building an order management system. Each order must be processed exactly once and in the exact sequence it was received. Which Amazon SQS queue type should the Solutions Architect choose?',
    options: [
      { id: 'a', text: 'SQS Standard Queue' },
      { id: 'b', text: 'SQS FIFO Queue' },
      { id: 'c', text: 'SQS Standard Queue with a Dead Letter Queue (DLQ)' },
      { id: 'd', text: 'Amazon SNS with SQS Standard Queue fan-out' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'SQS FIFO (First-In-First-Out) queue guarantees exactly-once processing and strict message ordering. FIFO queues use message deduplication IDs to prevent duplicates, and message group IDs to enforce per-group ordering. This is exactly what order management requires — no order should be processed twice, and orders must follow the sequence received.',
      incorrects: {
        a: 'SQS Standard Queue is incorrect. Standard queues offer best-effort ordering (not guaranteed) and at-least-once delivery (messages may be delivered more than once). For order management where sequence and exactly-once matter, Standard Queue will cause issues.',
        c: 'Standard Queue + DLQ is incorrect. A Dead Letter Queue captures messages that failed processing repeatedly — it does not solve the ordering or exactly-once problem. DLQ is for error handling, not for ensuring FIFO delivery.',
        d: 'SNS + SQS fan-out is incorrect. This pattern distributes one message to multiple queues simultaneously — useful for parallel processing by multiple systems. It does not provide ordering guarantees and would process the same message in multiple places, not once in sequence.',
      },
    },
    keywords: ['SQS FIFO', 'exactly-once', 'ordering', 'deduplication', 'Standard vs FIFO'],
  },
  {
    id: 'q-sqs-dlq',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Easy',
    scenario:
      'A company uses SQS to process image thumbnails. Occasionally, some messages fail to process and keep reappearing in the queue, blocking other messages and causing repeated Lambda invocations. How should the Solutions Architect prevent these "poison pill" messages from disrupting the queue?',
    options: [
      { id: 'a', text: 'Increase the visibility timeout so failed messages stay hidden longer' },
      { id: 'b', text: 'Enable a Dead Letter Queue (DLQ) with a maxReceiveCount' },
      { id: 'c', text: 'Switch to SQS FIFO to prevent duplicate delivery' },
      { id: 'd', text: 'Delete the SQS queue and recreate it' },
    ],
    correctId: 'b',
    explanation:
    {
      correct:
        'A Dead Letter Queue (DLQ) with maxReceiveCount is correct. When a message fails to process and becomes visible again repeatedly, after maxReceiveCount attempts SQS automatically moves it to the DLQ. This isolates problematic "poison pill" messages from the main queue, stops the retry loop, and lets you inspect and debug the failed messages separately without disrupting normal queue processing.',
      incorrects: {
        a: 'Increasing visibility timeout is incorrect. Longer visibility timeout just delays the problem — the failed message will still reappear after the timeout and keep retrying infinitely. It does not remove the poison pill from circulation.',
        c: 'Switching to FIFO is incorrect. FIFO ensures ordering and exactly-once delivery but does NOT solve poison pill messages. A bad message in a FIFO queue would still block the message group indefinitely.',
        d: 'Deleting and recreating queue is incorrect. This would delete ALL messages in the queue, including valid unprocessed ones. It is destructive and not a proper solution for handling individual failed messages.',
      },
    },
    keywords: ['DLQ', 'Dead Letter Queue', 'maxReceiveCount', 'poison pill', 'SQS retry'],
  },
  {
    id: 'q-cicd-pipeline',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Easy',
    scenario:
      'A development team wants to automate their software release process on AWS. Every time a developer pushes code, the system should automatically compile and test the code, then deploy it to their EC2 fleet. Which combination of AWS services should the Solutions Architect recommend?',
    options: [
      { id: 'a', text: 'AWS CodeCommit + AWS CodeBuild + AWS CodeDeploy + AWS CodePipeline' },
      { id: 'b', text: 'AWS CodeCommit + AWS Lambda + Amazon S3' },
      { id: 'c', text: 'Amazon S3 + AWS CloudFormation + AWS Elastic Beanstalk' },
      { id: 'd', text: 'AWS CodeCommit + AWS Systems Manager + Amazon EC2' },
    ],
    correctId: 'a',
    explanation: {
      correct:
        'CodeCommit + CodeBuild + CodeDeploy + CodePipeline is the correct full CI/CD suite on AWS. CodeCommit stores the source code (Git). CodeBuild compiles and runs tests on every push. CodeDeploy pushes the built artifact to the EC2 fleet. CodePipeline is the orchestrator — it detects the push to CodeCommit and triggers each step in sequence automatically. Together they form a fully managed, end-to-end pipeline.',
      incorrects: {
        b: 'CodeCommit + Lambda + S3 is incorrect. While Lambda can be triggered by events and S3 can store artifacts, this is not a standard CI/CD pipeline. Lambda is not a build service, and there is no deployment orchestration here. You would have to build all the pipeline logic manually.',
        c: 'S3 + CloudFormation + Elastic Beanstalk is incorrect. CloudFormation provisions infrastructure and Beanstalk deploys applications, but there is no source control (no CodeCommit) and no build/test step. This combination cannot automatically trigger on a code push.',
        d: 'CodeCommit + SSM + EC2 is incorrect. SSM Run Command can run scripts on EC2 instances but is not a build or deployment pipeline tool. There is no build/test step, no artifact management, and no automated trigger on code push.',
      },
    },
    keywords: ['CodePipeline', 'CodeCommit', 'CodeBuild', 'CodeDeploy', 'CI/CD', 'DevOps pipeline'],
  },
  {
    id: 'q-codecommit-vs-github',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Easy',
    scenario:
      'A company wants to store their application source code in a private Git repository. The security policy requires that access to the repository must be controlled using AWS IAM and the code must never be exposed to the public internet. Which AWS service should the Solutions Architect choose?',
    options: [
      { id: 'a', text: 'Host a self-managed GitLab server on EC2' },
      { id: 'b', text: 'AWS CodeCommit' },
      { id: 'c', text: 'Amazon S3 with versioning enabled' },
      { id: 'd', text: 'GitHub with private repositories' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS CodeCommit is correct. CodeCommit is a fully managed private Git repository service that lives entirely within AWS. Access is controlled natively via IAM policies — no separate user accounts needed. It never exposes data to the public internet, integrates directly with CodePipeline/CodeBuild, and supports standard Git operations.',
      incorrects: {
        a: 'Self-managed GitLab on EC2 is incorrect. While technically possible, running GitLab on EC2 means you manage the server, patching, scaling, and backups yourself. It also does not natively integrate with IAM. For a managed solution in AWS, CodeCommit is the correct answer.',
        c: 'S3 with versioning is incorrect. S3 stores objects (files) with version history, but it is not a Git repository. It has no concept of branches, commits, pull requests, or diff tracking. You cannot run git clone or git push against S3.',
        d: 'GitHub with private repos is incorrect. GitHub is a third-party service outside AWS. Even with private repos, code leaves the AWS network. Access is managed through GitHub accounts, not IAM. This violates the "must be controlled via IAM" requirement.',
      },
    },
    keywords: ['CodeCommit', 'IAM', 'private Git', 'source control', 'AWS-native'],
  },
  {
    id: 'q-vpc-nat-gateway',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Easy',
    scenario:
      'A company runs application servers in private subnets within a VPC. The servers need to download security patches from the internet regularly. The servers must NOT be directly accessible from the internet. Which solution should a Solutions Architect implement?',
    options: [
      { id: 'a', text: 'Attach an Internet Gateway directly to the private subnet' },
      { id: 'b', text: 'Deploy a NAT Gateway in the private subnet and update route tables' },
      { id: 'c', text: 'Deploy a NAT Gateway in a public subnet and update the private subnet route tables' },
      { id: 'd', text: 'Assign Elastic IP addresses to all private subnet instances' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'NAT Gateway in a PUBLIC subnet is correct. NAT Gateway allows outbound-only internet access for private subnet instances. The key detail: NAT Gateway must be placed in a PUBLIC subnet (which has IGW access), and the private subnet route table must have 0.0.0.0/0 → NAT Gateway. Internet cannot initiate connections to private instances.',
      incorrects: {
        a: 'Internet Gateway on a private subnet is incorrect. Adding an IGW route makes the subnet PUBLIC — internet can then initiate connections in. This violates the requirement that servers must not be accessible from the internet.',
        b: 'NAT Gateway in the private subnet is incorrect. This is a common trap! The NAT Gateway itself MUST be in a PUBLIC subnet to access the internet via IGW. Placing NAT in a private subnet means it has no internet path and will not work.',
        d: 'Elastic IP on private instances is incorrect. Assigning a public/Elastic IP to instances makes them directly reachable from the internet (once an IGW route exists), violating the isolation requirement.',
      },
    },
    keywords: ['NAT Gateway', 'private subnet', 'outbound internet', 'public subnet placement', 'no inbound'],
  },
  {
    id: 'q-nacl-deny',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Medium',
    scenario:
      'A security team has detected that a specific external IP range (203.0.113.0/24) is sending malicious traffic to instances in a VPC subnet. The team needs to block all traffic from this IP range immediately. Which solution should be used?',
    options: [
      { id: 'a', text: 'Add a Deny inbound rule to the Security Group for the affected instances' },
      { id: 'b', text: 'Add a Deny inbound rule to the Network ACL for the affected subnet' },
      { id: 'c', text: 'Remove the Internet Gateway from the VPC' },
      { id: 'd', text: 'Add a Deny route in the VPC route table for the IP range' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Network ACL Deny rule is correct. NACLs support explicit DENY rules and operate at the subnet level, making them the right tool to block a specific IP range. Add a DENY inbound rule with a lower rule number than any ALLOW rules — NACL rules are processed in ascending order, first match wins.',
      incorrects: {
        a: 'Security Group Deny rule is incorrect. Security Groups support ALLOW rules only — there is no Deny option in SG. You can only remove allow rules, but you cannot explicitly block a specific IP range using SGs.',
        c: 'Removing the Internet Gateway is incorrect. This is too destructive — it would block ALL internet access for ALL resources in the VPC, including legitimate traffic. The requirement is to block a specific IP range only.',
        d: 'Route table Deny is incorrect. Route tables control where traffic is routed TO, not filtering based on source IP. Route tables do not support deny rules for specific source IPs.',
      },
    },
    keywords: ['NACL', 'deny rule', 'block IP', 'subnet-level', 'security group vs NACL'],
  },
  {
    id: 'q-vpc-peering-transitive',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Hard',
    scenario:
      'A company has three VPCs: VPC-A (10.0.0.0/16), VPC-B (172.16.0.0/16), and VPC-C (192.168.0.0/16). VPC-A is peered with VPC-B, and VPC-B is peered with VPC-C. An EC2 instance in VPC-A attempts to communicate with an EC2 instance in VPC-C. What will happen?',
    options: [
      { id: 'a', text: 'The traffic will route through VPC-B automatically' },
      { id: 'b', text: 'The communication will fail — VPC peering is not transitive' },
      { id: 'c', text: 'The traffic will route but with higher latency due to the extra hop' },
      { id: 'd', text: 'AWS will automatically create a peering connection between VPC-A and VPC-C' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Communication will fail — VPC Peering is non-transitive. Having A↔B and B↔C does NOT mean A can reach C. Each VPC peering connection is a direct 1-to-1 relationship. To allow VPC-A to communicate with VPC-C, you must create a separate, direct VPC peering connection between VPC-A and VPC-C. Alternatively, use AWS Transit Gateway which does support transitive routing.',
      incorrects: {
        a: 'Traffic routing through VPC-B is incorrect. VPC Peering does not support transitive routing. Traffic from VPC-A cannot pass through VPC-B to reach VPC-C, even though VPC-B is peered with both.',
        c: 'Higher latency routing is incorrect. There is no routing path at all — the communication simply fails. VPC Peering is non-transitive by design.',
        d: 'Auto-creating peering is incorrect. AWS does not automatically create peering connections. Each peering connection must be manually configured, requires acceptance from the target VPC owner, and routing must be explicitly configured in route tables.',
      },
    },
    keywords: ['VPC peering', 'non-transitive', 'Transit Gateway', 'cross-VPC', 'routing'],
  },
  {
    id: 'q-cidr-calculation',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Easy',
    scenario:
      'A Solutions Architect is designing a VPC subnet with CIDR block 10.0.1.0/27. How many IP addresses are available for EC2 instances to use in this subnet?',
    options: [
      { id: 'a', text: '32' },
      { id: 'b', text: '30' },
      { id: 'c', text: '27' },
      { id: 'd', text: '25' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'Answer is 27 usable IPs. Formula: 2^(32−27) = 2^5 = 32 total IPs. AWS reserves 5 IPs in every subnet: .0 (network address), .1 (VPC router), .2 (DNS server), .3 (future use), .255 (broadcast). So 32 − 5 = 27 usable IPs for EC2 instances.',
      incorrects: {
        a: '32 is incorrect. 32 is the TOTAL number of IP addresses in a /27, but AWS always reserves 5 of them. The usable count is 32 − 5 = 27.',
        b: '30 is incorrect. 30 would be the usable count for a /27 in standard networking (where only 2 are reserved for network and broadcast). However, AWS reserves 5 IPs per subnet, not 2.',
        d: '25 is incorrect. This does not correspond to the correct formula. Always use: 2^(32−prefix) − 5 = usable IPs.',
      },
    },
    keywords: ['CIDR', 'subnet calculation', '/27', '5 reserved IPs', 'usable hosts'],
  },
  {
    id: 'q-vpc-endpoint-s3',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Medium',
    scenario:
      'A company has EC2 instances in private subnets that frequently upload and download large files from Amazon S3. The current architecture uses a NAT Gateway, resulting in high data transfer costs. A Solutions Architect needs to reduce these costs while keeping the instances private. What is the most cost-effective solution?',
    options: [
      { id: 'a', text: 'Enable S3 Transfer Acceleration on the S3 bucket' },
      { id: 'b', text: 'Create an S3 Gateway VPC Endpoint and update the route table' },
      { id: 'c', text: 'Create an S3 Interface VPC Endpoint (PrivateLink)' },
      { id: 'd', text: 'Move the EC2 instances to a public subnet to access S3 directly' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'S3 Gateway VPC Endpoint is correct and most cost-effective. Gateway Endpoints for S3 and DynamoDB are FREE — there is no hourly charge and no data processing charge. Traffic routes through the AWS private network directly to S3 without going through the NAT Gateway. You simply create the endpoint and add it to the route table — EC2 instances automatically use it for S3 traffic.',
      incorrects: {
        a: 'S3 Transfer Acceleration is incorrect. Transfer Acceleration speeds up uploads to S3 from the internet using CloudFront edge locations. It costs extra money per GB and does not reduce NAT Gateway costs — it actually routes traffic over the internet, not through private AWS network.',
        c: 'Interface VPC Endpoint is incorrect as the most cost-effective option. Interface Endpoints for S3 do exist (PrivateLink) but cost money per hour + per GB processed. The Gateway Endpoint is free and achieves the same goal for S3/DynamoDB.',
        d: 'Moving to public subnet is incorrect. This exposes the EC2 instances to the internet, creating a security risk. The requirement is to keep instances private while reducing NAT costs.',
      },
    },
    reference: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html',
    keywords: ['VPC endpoint', 'Gateway endpoint', 'S3', 'free', 'NAT cost reduction', 'private subnet'],
  },
  {
    id: 'q-elb-cross-vpc',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Hard',
    scenario:
      'A company has multiple Amazon VPCs that are peered with each other within the same region. The company wants to use a single Elastic Load Balancer to route traffic to multiple EC2 instances across these peered VPCs. How can this be achieved?',
    options: [
      { id: 'a', text: 'This is possible using the Classic Load Balancer (CLB) if using Instance IDs' },
      { id: 'b', text: 'This is possible using the NLB and ALB if using IP addresses as targets' },
      { id: 'c', text: 'This is not possible — the instances that an ELB routes traffic to must be in the same VPC' },
      { id: 'd', text: 'This is not possible with ELB — you would need to use Route 53' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'NLB and ALB support IP address-based targets, which allows routing to instances in peered VPCs. With IP targets you can register: instances in a peered VPC, AWS resources addressable by IP and port, and on-premises resources linked via Direct Connect or a VPN connection. The key is using IP addresses (not instance IDs) as the target type.',
      incorrects: {
        a: 'Classic Load Balancer (CLB) is incorrect. CLB only supports instance ID-based targets and only within the same VPC. It does NOT support cross-VPC routing even with instance IDs.',
        c: 'Incorrect. ALB and NLB CAN route traffic to instances in peered VPCs — this is a supported and documented feature when IP addresses are used as the target type.',
        d: 'Route 53 is incorrect for this use case. While Route 53 handles DNS routing, the requirement is load balancing across instances. NLB and ALB with IP targets solve this directly without needing Route 53.',
      },
    },
    reference: 'https://aws.amazon.com/blogs/aws/new-application-load-balancing-via-ip-address-to-aws-on-premises-resources/',
    keywords: ['ALB', 'NLB', 'cross-VPC', 'IP target', 'peered VPC', 'load balancer', 'CLB limitation'],
  },
  {
    id: 'q-rds-cross-region',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Hard',
    scenario:
      'A large multi-national company needs a multi-region database design. The master database will be in EU (Frankfurt) and databases will be located in 4 other regions to service local read traffic. The solution must be a fully managed service including replication, cost-effective, and secure. Which AWS service delivers these requirements?',
    options: [
      { id: 'a', text: 'RDS with cross-region Read Replicas' },
      { id: 'b', text: 'ElastiCache with Redis and clustering mode enabled' },
      { id: 'c', text: 'RDS with Multi-AZ' },
      { id: 'd', text: 'EC2 instances with EBS replication' },
    ],
    correctId: 'a',
    explanation: {
      correct:
        'RDS with cross-region Read Replicas is correct. Read Replicas can be created in different AWS regions, providing: data replication across multiple regions, read scalability (local users read from nearby replica without sending all traffic to Frankfurt), and optional promotion to master for disaster recovery. RDS is fully managed including replication.',
      incorrects: {
        b: 'ElastiCache with Redis is incorrect. ElastiCache is a caching layer — it is not a relational database. It does not provide database replication or structured data availability for the scenario described. It could enhance performance but cannot replace a database.',
        c: 'RDS Multi-AZ is incorrect. Multi-AZ provides high availability within a SINGLE region by maintaining a synchronous standby in a different AZ. It does NOT replicate across multiple regions. Remember: Multi-AZ = same-region HA. Cross-Region Read Replicas = multi-region read scaling.',
        d: 'EC2 with EBS replication is incorrect. This is not a managed service — you would need to manage the database engine, replication logic, patching, backups, and scaling yourself. This violates the "fully managed service including replication" requirement.',
      },
    },
    reference: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html',
    keywords: ['RDS', 'cross-region Read Replicas', 'multi-region', 'Multi-AZ vs Read Replicas', 'managed database', 'read scaling'],
  },
  {
    id: 'q-sg-default-state',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Easy',
    scenario:
      'A Solutions Architect creates a new custom security group in a VPC with no rules added. Which statement correctly describes the default behavior of this new custom security group?',
    options: [
      { id: 'a', text: 'All inbound traffic is denied and all outbound traffic to all IP addresses is allowed' },
      { id: 'b', text: 'All inbound traffic is allowed and all outbound traffic is denied' },
      { id: 'c', text: 'There is an inbound rule allowing traffic from the Internet Gateway' },
      { id: 'd', text: 'All inbound and all outbound traffic is denied' },
    ],
    correctId: 'a',
    explanation: {
      correct:
        'A custom security group created with no rules has: no inbound rules (all inbound traffic is implicitly denied — there are zero allow rules), and one default outbound rule that allows ALL traffic to all IP addresses (0.0.0.0/0 and ::/0). This is the standard default state for any custom security group.',
      incorrects: {
        b: 'Reversed. Inbound is DENIED (not allowed) and outbound is ALLOWED (not denied). Default outbound allows all traffic.',
        c: 'Incorrect. A new custom security group has NO inbound rules at all. There is no default rule allowing traffic from an Internet Gateway. All inbound traffic is denied until you explicitly add allow rules.',
        d: 'Incorrect. Outbound is NOT denied by default. Security groups always have a default outbound rule that allows all traffic to all destinations. Only inbound is blocked by default.',
      },
    },
    reference: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html',
    keywords: ['Security Group', 'default rules', 'inbound denied', 'outbound allowed', 'custom SG', 'implicit deny'],
  },
  {
    id: 'q-redshift-encryption',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Medium',
    scenario:
      'A client has unencrypted data in an Amazon Redshift cluster and wants to encrypt the data at rest. What is the recommended approach?',
    options: [
      { id: 'a', text: 'Move the Redshift cluster from a public subnet to a private subnet' },
      { id: 'b', text: 'Enable AWS KMS encryption on the Redshift cluster' },
      { id: 'c', text: 'Use SSL/TLS connections to the cluster' },
      { id: 'd', text: 'Attach Amazon EBS volumes with encryption enabled' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS KMS is the correct answer for encrypting Redshift data AT REST. Enabling KMS encryption causes Redshift to encrypt all data blocks and system metadata using AES-256. You can use an AWS-managed key or a customer-managed key (CMK). For an existing unencrypted cluster, you can modify it to enable KMS — Redshift automatically migrates the data to a new encrypted cluster. Snapshots from an encrypted cluster are also automatically encrypted.',
      incorrects: {
        a: 'Moving to a private subnet improves network security (restricts direct internet access) but does NOT encrypt data stored on disk. Network isolation and encryption at rest are completely separate security controls.',
        c: 'SSL/TLS is incorrect for encrypting data AT REST. SSL/TLS encrypts data IN TRANSIT — data moving between the client application and the Redshift cluster over the network. The question asks about encrypting data stored on disk, which requires KMS.',
        d: 'EBS volumes is incorrect. Amazon Redshift manages its own internal storage and does NOT use Amazon EBS volumes. You cannot encrypt Redshift storage by attaching EBS volumes. Redshift encryption is configured through KMS or CloudHSM, not EBS.',
      },
    },
    reference: 'https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-db-encryption.html',
    keywords: ['Redshift', 'KMS', 'encryption at rest', 'SSL transit', 'AES-256', 'at rest vs in transit'],
  },
  {
    id: 'q-aws-batch',
    domain: 'd4',
    domainLabel: 'Cost-Optimized Architectures',
    difficulty: 'Medium',
    scenario:
      'A financial services company regularly runs analysis of daily transaction costs, execution reporting, and market performance. They currently use third-party commercial software for provisioning, managing, monitoring, and scaling a large fleet of EC2 instances for these computing jobs. The company wants to reduce costs and use AWS services. Which AWS service should replace the third-party software?',
    options: [
      { id: 'a', text: 'Amazon Lex' },
      { id: 'b', text: 'AWS Batch' },
      { id: 'c', text: 'AWS Systems Manager' },
      { id: 'd', text: 'Amazon Athena' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS Batch is the correct answer. AWS Batch eliminates the need for third-party batch processing software by managing all the infrastructure: provisioning the right type and quantity of compute resources, job queue management and scheduling, monitoring, and automatic scaling. You define the batch jobs and Batch handles the rest — no batch software or servers to install or manage.',
      incorrects: {
        a: 'Amazon Lex is incorrect. Lex is a service for building conversational interfaces (chatbots) using voice and text. It has no relevance to batch computing or managing EC2 fleets.',
        c: 'AWS Systems Manager is incorrect. SSM gives visibility and control over your existing infrastructure (patch management, Run Command, Parameter Store). It is not a batch job scheduling or EC2 fleet provisioning service.',
        d: 'Amazon Athena is incorrect. Athena is an interactive query service for analyzing data in S3 using standard SQL. It is for ad-hoc data analysis, not for managing batch computing jobs across an EC2 fleet.',
      },
    },
    reference: 'https://aws.amazon.com/batch/',
    keywords: ['AWS Batch', 'batch computing', 'managed service', 'EC2 fleet', 'job scheduling', 'replace third-party'],
  },
  {
    id: 'q-nat-gateway-private-outbound',
    domain: 'd2',
    domainLabel: 'Design Resilient Architectures',
    difficulty: 'Medium',
    scenario:
      'An application running in a private subnet of an Amazon VPC must have outbound internet access for downloading updates. The Solutions Architect does not want the application exposed to inbound connection attempts. Which steps should be taken?',
    options: [
      { id: 'a', text: 'Create a NAT gateway and attach an internet gateway to the VPC' },
      { id: 'b', text: 'Attach an internet gateway to the private subnet and create a NAT gateway' },
      { id: 'c', text: 'Create a NAT gateway but do not attach an internet gateway to the VPC' },
      { id: 'd', text: 'Attach an internet gateway to the VPC but do not create a NAT gateway' },
    ],
    correctId: 'a',
    explanation: {
      correct:
        'NAT Gateway membolehkan instances dalam private subnet buat outbound connections ke internet tanpa terdedah kepada inbound. NAT GW dicipta dalam PUBLIC subnet (bukan private) dan Internet Gateway MESTI di-attach ke VPC — tanpa IGW, tiada outbound traffic yang boleh keluar langsung walaupun NAT GW ada. Private subnet route table: 0.0.0.0/0 → nat-gateway-id. Public subnet route table: 0.0.0.0/0 → igw-id.',
      incorrects: {
        b: 'IGW di-attach ke VPC, bukan ke subnet. Salah faham ini common dalam exam — subnet tidak "attach" ke IGW, tapi subnet route table menghala traffic ke IGW yang attached ke VPC.',
        c: 'Tanpa IGW attached ke VPC, tiada outbound internet traffic yang berjaya. NAT GW bergantung kepada IGW untuk hantar traffic keluar ke internet. Kedua-duanya diperlukan.',
        d: 'Tanpa NAT Gateway, instances dalam private subnet tidak boleh reach internet langsung — tiada mekanisme untuk translate Private IP ke public address. IGW sahaja tidak cukup untuk private subnet.',
      },
    },
    reference: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html',
    keywords: ['NAT Gateway', 'private subnet', 'outbound internet', 'IGW', 'internet gateway', 'route table', 'no inbound'],
  },
  {
    id: 'q-aws-pentest-policy',
    domain: 'd1',
    domainLabel: 'Design Secure Applications and Architectures',
    difficulty: 'Easy',
    scenario:
      "The AWS Acceptable Use Policy describes permitted and prohibited behavior on AWS and includes descriptions of prohibited security violations and network abuse. According to the policy, what is AWS's position on penetration testing?",
    options: [
      { id: 'a', text: 'AWS do not allow any form of penetration testing' },
      { id: 'b', text: 'AWS allow penetration testing by customers on their own VPC resources only' },
      { id: 'c', text: 'AWS allow penetration for some resources without prior authorization' },
      { id: 'd', text: 'AWS allow penetration testing for all resources' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'AWS membenarkan customers menjalankan security assessments dan penetration tests terhadap AWS infrastructure mereka TANPA kelulusan awal untuk 8 services yang dibenarkan: EC2, RDS, CloudFront, Aurora, API Gateway, Lambda, Lightsail, dan Elastic Beanstalk. Ini bukan semua resources, dan bukan tiada langsung — 8 services spesifik sahaja yang boleh ditest tanpa prior approval.',
      incorrects: {
        a: 'Tidak tepat. AWS memang membenarkan penetration testing — hanya perlu follow guidelines dan limitasi yang ditetapkan. Mengatakan "tidak benarkan langsung" adalah salah.',
        b: 'Terlalu spesifik dan tidak tepat. AWS tidak menyatakan "VPC resources only" — ia berdasarkan senarai 8 services spesifik, bukan berdasarkan samada ia dalam VPC atau tidak.',
        d: 'Tidak tepat. AWS tidak membenarkan pentest untuk SEMUA resources. Ada services dan aktiviti tertentu yang dilarang seperti DoS/DDoS simulation, DNS zone walking, dan port flooding.',
      },
    },
    reference: 'https://aws.amazon.com/security/penetration-testing/',
    keywords: ['penetration testing', 'pentest', 'AUP', 'Acceptable Use Policy', 'security assessment', 'no prior approval', '8 services'],
  },

  // ── D1 · IAM & Identity ──────────────────────────────────────────────────
  {
    id: 'q-cognito-pools',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Medium',
    scenario:
      'A mobile app allows users to sign in with their Google or Facebook accounts. After signing in, users must be able to upload photos directly to an Amazon S3 bucket using temporary AWS credentials. Which AWS service should the Solutions Architect use?',
    options: [
      { id: 'a', text: 'Amazon Cognito User Pools only' },
      { id: 'b', text: 'Amazon Cognito Identity Pools (Federated Identities)' },
      { id: 'c', text: 'AWS IAM with cross-account roles' },
      { id: 'd', text: 'AWS STS AssumeRoleWithWebIdentity called directly from the app' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Cognito Identity Pools (Federated Identities) is correct. Identity Pools exchange a third-party token (Google, Facebook, or Cognito User Pool token) for temporary AWS credentials (via STS). The mobile app can then use those credentials to directly access AWS services like S3. This is the standard pattern for granting mobile users direct AWS access.',
      incorrects: {
        a: 'Cognito User Pools only is incorrect. User Pools handle authentication (who you are) — they issue JWTs but NOT AWS credentials. You need Identity Pools to exchange those JWTs for AWS credentials.',
        c: 'IAM cross-account roles is incorrect. Cross-account roles are for AWS account-to-account access, not for end users of a mobile app. You cannot distribute IAM credentials to millions of users.',
        d: 'Direct STS calls is incorrect. While technically possible, calling STS directly requires managing the token exchange logic yourself. Cognito Identity Pools is the managed service specifically designed to handle this — it abstracts the STS call.',
      },
    },
    keywords: ['Cognito', 'Identity Pools', 'federated identity', 'temporary credentials', 'S3 direct access'],
  },
  {
    id: 'q-ram-share',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Medium',
    scenario:
      'A company has a multi-account AWS environment managed by AWS Organizations. A central networking team owns a Transit Gateway and several shared VPC subnets that must be accessible to resources in 20 different AWS accounts. What is the most operationally efficient way to share these resources?',
    options: [
      { id: 'a', text: 'Create VPC peering connections between all 20 accounts' },
      { id: 'b', text: 'Use AWS Resource Access Manager (RAM) to share the Transit Gateway and subnets' },
      { id: 'c', text: 'Copy the Transit Gateway configuration into each of the 20 accounts' },
      { id: 'd', text: 'Use AWS Organizations Service Control Policies to allow cross-account access' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS RAM is correct. RAM lets you share AWS resources (Transit Gateways, subnets, Route 53 resolver rules, etc.) across accounts within your AWS Organization — without duplicating infrastructure. Resources are shared in place; each account uses the shared resource as if it were their own.',
      incorrects: {
        a: 'VPC peering is incorrect. VPC peering connects two VPCs and is non-transitive. Managing 20 accounts × peering connections is complex and does not scale. It also does not share the Transit Gateway itself.',
        c: 'Copying configuration is incorrect. This creates duplicated, separately managed infrastructure in each account — operationally expensive and inconsistent.',
        d: 'SCPs are incorrect. Service Control Policies set permission guardrails (what actions are DENIED) — they do not enable resource sharing.',
      },
    },
    keywords: ['RAM', 'Resource Access Manager', 'cross-account', 'Transit Gateway sharing', 'shared subnets'],
  },
  {
    id: 'q-guardduty',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Easy',
    scenario:
      'A security team needs to continuously monitor all AWS accounts for threats such as unusual API calls, compromised EC2 instances performing cryptocurrency mining, and suspicious network traffic — without installing any agents on instances. Which service should they enable?',
    options: [
      { id: 'a', text: 'Amazon Inspector' },
      { id: 'b', text: 'AWS Config' },
      { id: 'c', text: 'Amazon GuardDuty' },
      { id: 'd', text: 'AWS Security Hub' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'Amazon GuardDuty is correct. GuardDuty is a threat detection service that continuously analyzes CloudTrail logs, VPC Flow Logs, and DNS logs using ML and threat intelligence. It requires NO agents and detects threats like crypto-mining, unusual API patterns, and compromised credentials automatically.',
      incorrects: {
        a: 'Amazon Inspector is incorrect. Inspector scans for software vulnerabilities (CVEs) and misconfigurations on EC2 instances and container images. It is about vulnerability assessment, not real-time threat detection.',
        b: 'AWS Config is incorrect. Config tracks configuration changes and compliance over time. It does not detect threats or anomalous behavior.',
        d: 'Security Hub is incorrect. Security Hub aggregates findings from GuardDuty, Inspector, and other services into a single dashboard — it does not generate findings itself.',
      },
    },
    keywords: ['GuardDuty', 'threat detection', 'no agents', 'cryptocurrency mining', 'ML-based'],
  },
  {
    id: 'q-inspector',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Easy',
    scenario:
      'A company runs hundreds of EC2 instances and wants to automatically identify instances that have known software vulnerabilities (CVEs) and unintended network exposure. Which service should the Solutions Architect recommend?',
    options: [
      { id: 'a', text: 'Amazon GuardDuty' },
      { id: 'b', text: 'Amazon Inspector' },
      { id: 'c', text: 'AWS Trusted Advisor' },
      { id: 'd', text: 'AWS Systems Manager Patch Manager' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Amazon Inspector is correct. Inspector automatically scans EC2 instances and ECR container images for software vulnerabilities (CVEs) and network reachability issues. It continuously reassesses as new vulnerabilities are published and integrates with Security Hub.',
      incorrects: {
        a: 'GuardDuty is incorrect. GuardDuty detects active threats and anomalous behavior (e.g. an instance is currently being used for crypto-mining). Inspector is for finding vulnerabilities before they are exploited.',
        c: 'Trusted Advisor is incorrect. Trusted Advisor gives high-level recommendations across cost, performance, security, and fault tolerance — but does not scan for specific CVEs on instances.',
        d: 'SSM Patch Manager is incorrect. Patch Manager automates applying patches to fix vulnerabilities but does not discover or report them. Inspector discovers; Patch Manager fixes.',
      },
    },
    keywords: ['Inspector', 'CVE', 'vulnerability scanning', 'EC2', 'ECR', 'network reachability'],
  },
  {
    id: 'q-macie',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Easy',
    scenario:
      'A company stores large amounts of data in Amazon S3. The security team is concerned that some buckets may contain sensitive data such as personally identifiable information (PII) or financial records that were accidentally uploaded. Which service can automatically discover and report this sensitive data?',
    options: [
      { id: 'a', text: 'Amazon GuardDuty' },
      { id: 'b', text: 'Amazon Macie' },
      { id: 'c', text: 'AWS Config with S3 rules' },
      { id: 'd', text: 'Amazon Inspector' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Amazon Macie is correct. Macie uses machine learning to automatically discover, classify, and protect sensitive data in S3 — including PII (names, addresses, SSNs), financial data (credit cards), and credentials. It generates findings with details about where sensitive data was found.',
      incorrects: {
        a: 'GuardDuty is incorrect. GuardDuty detects security threats and anomalous activity. It does not scan S3 object contents for sensitive data.',
        c: 'AWS Config is incorrect. Config tracks S3 bucket configuration changes (e.g. whether public access is blocked) but does not analyze the content of objects for PII.',
        d: 'Amazon Inspector is incorrect. Inspector scans EC2 instances and container images for vulnerabilities — not S3 object content.',
      },
    },
    keywords: ['Macie', 'PII detection', 'sensitive data', 'S3', 'data privacy'],
  },
  {
    id: 'q-cloudtrail-vs-cloudwatch',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Easy',
    scenario:
      'A security auditor needs to determine who deleted an Amazon RDS database snapshot last Tuesday, including the IAM user\'s name, IP address, and the exact time of the action. Which service provides this information?',
    options: [
      { id: 'a', text: 'Amazon CloudWatch Logs' },
      { id: 'b', text: 'AWS CloudTrail' },
      { id: 'c', text: 'AWS Config' },
      { id: 'd', text: 'Amazon CloudWatch Events' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS CloudTrail is correct. CloudTrail records every API call made in your AWS account — including WHO made the call (IAM user/role), WHEN, from which IP address, and what the request/response was. For "who deleted X", CloudTrail is always the answer.',
      incorrects: {
        a: 'CloudWatch Logs is incorrect. CloudWatch Logs collects application and infrastructure logs (Lambda logs, EC2 OS logs, VPC Flow Logs). It does not record AWS API management actions.',
        c: 'AWS Config is incorrect. Config tracks the state of resource configurations over time and can show that a snapshot no longer exists — but it does not log who performed the deletion or their IP address.',
        d: 'CloudWatch Events (EventBridge) is incorrect. EventBridge routes events and triggers automation — it does not store a history of API calls for forensic audit.',
      },
    },
    keywords: ['CloudTrail', 'who deleted', 'API audit', 'forensics', 'IAM user activity'],
  },
  {
    id: 'q-acm-cert',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Easy',
    scenario:
      'A Solutions Architect needs to enable HTTPS for a web application served via an Application Load Balancer. The certificate must auto-renew and the solution should have the lowest operational overhead. Which approach should they use?',
    options: [
      { id: 'a', text: 'Purchase a certificate from a third-party CA, install it on each EC2 instance' },
      { id: 'b', text: 'Use AWS Certificate Manager (ACM) to provision a free certificate and attach it to the ALB' },
      { id: 'c', text: 'Use a self-signed certificate generated on the EC2 instances' },
      { id: 'd', text: 'Use AWS Certificate Manager to export the certificate and install it on the ALB' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'ACM with ALB is correct. ACM provisions free public SSL/TLS certificates that auto-renew before expiry. Attaching the cert directly to an ALB requires no instance-level configuration. This is the lowest-overhead approach.',
      incorrects: {
        a: 'Third-party CA on EC2 is incorrect. Installing certificates on EC2 instances requires manual renewal, per-instance management, and adds complexity. ALB handles TLS termination — certs belong on the load balancer, not instances.',
        c: 'Self-signed certificate is incorrect. Browsers will show security warnings for self-signed certificates, which is unacceptable for production web apps.',
        d: 'Exporting from ACM is incorrect. ACM certificates cannot be exported — this is a deliberate security design. ACM certs are used only with integrated AWS services (ALB, CloudFront, API Gateway). You cannot extract the private key.',
      },
    },
    keywords: ['ACM', 'SSL certificate', 'HTTPS', 'ALB', 'auto-renewal', 'free certificate'],
  },
  {
    id: 'q-cloudhsm-vs-kms',
    domain: 'd1',
    domainLabel: 'Secure Architectures',
    difficulty: 'Hard',
    scenario:
      'A financial services company must comply with regulations requiring FIPS 140-2 Level 3 validated hardware for cryptographic key storage. The company also requires exclusive control of the hardware — no sharing with other AWS customers. Which solution meets these requirements?',
    options: [
      { id: 'a', text: 'AWS KMS with Customer Managed Keys (CMK)' },
      { id: 'b', text: 'AWS KMS with AWS Managed Keys' },
      { id: 'c', text: 'AWS CloudHSM' },
      { id: 'd', text: 'AWS Secrets Manager with encryption enabled' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'AWS CloudHSM is correct. CloudHSM provides dedicated, single-tenant HSM hardware that only you use. It is FIPS 140-2 Level 3 validated. AWS cannot access your keys — you have full control. This is required when regulations mandate dedicated hardware and exclusive key custody.',
      incorrects: {
        a: 'KMS with CMK is incorrect. KMS uses FIPS 140-2 Level 2 hardware (not Level 3) and is multi-tenant — the underlying HSMs are shared across customers, even though your keys are logically isolated. Regulations requiring Level 3 and single-tenant hardware mandate CloudHSM.',
        b: 'KMS with AWS Managed Keys is incorrect. AWS-managed keys give you even less control — AWS rotates them automatically and you cannot export or control them. This fails both the Level 3 and exclusive control requirements.',
        d: 'Secrets Manager is incorrect. Secrets Manager stores secrets and uses KMS for encryption — it is not an HSM service and does not provide hardware-level key storage.',
      },
    },
    keywords: ['CloudHSM', 'FIPS 140-2 Level 3', 'single-tenant', 'dedicated HSM', 'KMS vs CloudHSM'],
  },

  // ── D2 · HA & Databases ──────────────────────────────────────────────────
  {
    id: 'q-aurora-ha',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Medium',
    scenario:
      'A company runs a MySQL database on Amazon RDS Multi-AZ. During a recent failover the application experienced 90 seconds of downtime. The team wants a MySQL-compatible solution that reduces failover time to under 30 seconds and provides more than one standby copy. Which service should they migrate to?',
    options: [
      { id: 'a', text: 'RDS Multi-AZ with increased instance size' },
      { id: 'b', text: 'Amazon Aurora MySQL' },
      { id: 'c', text: 'Amazon DynamoDB' },
      { id: 'd', text: 'RDS Read Replicas promoted manually on failure' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Amazon Aurora MySQL is correct. Aurora is MySQL-compatible and stores 6 copies of data across 3 Availability Zones automatically. Failover completes in under 30 seconds (vs 1–2 minutes for RDS Multi-AZ). Aurora also supports up to 15 Read Replicas with sub-10ms replica lag.',
      incorrects: {
        a: 'Larger RDS Multi-AZ instance is incorrect. Increasing instance size does not change the failover mechanism. RDS Multi-AZ failover takes 1–2 minutes regardless of instance size.',
        c: 'DynamoDB is incorrect. DynamoDB is a NoSQL key-value/document database — not a MySQL replacement. You cannot run relational SQL workloads on DynamoDB.',
        d: 'Manual Read Replica promotion is incorrect. This is a manual process that takes longer than 30 seconds and requires application-level changes. It is not automatic failover.',
      },
    },
    keywords: ['Aurora', 'MySQL compatible', 'failover 30s', '6 copies', 'high availability'],
  },
  {
    id: 'q-aurora-serverless',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Medium',
    scenario:
      'A startup is building a new SaaS application with a relational database. Traffic is expected to be very low initially with occasional unpredictable spikes. The team wants to minimize database costs during idle periods while still using a fully managed relational database. Which solution is most cost-effective?',
    options: [
      { id: 'a', text: 'Amazon RDS MySQL with the smallest available instance type' },
      { id: 'b', text: 'Amazon Aurora Serverless' },
      { id: 'c', text: 'Amazon DynamoDB On-Demand' },
      { id: 'd', text: 'Amazon RDS with Reserved Instance pricing' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Aurora Serverless is correct. It automatically scales database capacity up or down based on actual usage and can scale to near-zero when idle. You pay per ACU-second of capacity used — making it ideal for intermittent, unpredictable, or dev/test workloads.',
      incorrects: {
        a: 'RDS with smallest instance is incorrect. Even the smallest RDS instance runs 24/7 and charges per hour regardless of usage. During idle periods you still pay the full hourly rate.',
        c: 'DynamoDB On-Demand is incorrect. DynamoDB is a NoSQL database. If the application requires a relational database (SQL), DynamoDB is not a suitable replacement.',
        d: 'RDS Reserved Instance is incorrect. Reserved Instances require a 1 or 3-year commitment and charge even when idle. For a startup with unpredictable usage, this is more expensive, not less.',
      },
    },
    keywords: ['Aurora Serverless', 'scale to zero', 'intermittent', 'unpredictable traffic', 'pay per second'],
  },
  {
    id: 'q-dynamodb-dax',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Medium',
    scenario:
      'An application uses Amazon DynamoDB as its primary data store and experiences millions of read requests per second. Read latency is currently in the single-digit milliseconds but the team needs to reduce it to microseconds for frequently accessed items. Which solution achieves this with the least development effort?',
    options: [
      { id: 'a', text: 'Enable DynamoDB Auto Scaling to handle the read load' },
      { id: 'b', text: 'Add Amazon ElastiCache in front of DynamoDB' },
      { id: 'c', text: 'Enable Amazon DynamoDB Accelerator (DAX)' },
      { id: 'd', text: 'Create DynamoDB Global Tables for read distribution' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'DynamoDB Accelerator (DAX) is correct. DAX is a fully managed, in-memory cache specifically designed for DynamoDB. It reduces read latency from milliseconds to microseconds for frequently read items and is API-compatible with DynamoDB — minimal code changes required.',
      incorrects: {
        a: 'Auto Scaling is incorrect. Auto Scaling adjusts provisioned capacity to handle throughput — it does not reduce latency. Latency is already at single-digit milliseconds with DynamoDB; Auto Scaling cannot push it to microseconds.',
        b: 'ElastiCache is incorrect. While ElastiCache (Redis/Memcached) can cache DynamoDB results, it requires custom cache invalidation logic and more code changes. DAX is purpose-built for DynamoDB with a compatible API, requiring far less effort.',
        d: 'Global Tables is incorrect. Global Tables replicates DynamoDB across multiple regions for global users and disaster recovery — not for reducing read latency within a single region.',
      },
    },
    keywords: ['DynamoDB', 'DAX', 'microsecond latency', 'in-memory cache', 'read performance'],
  },
  {
    id: 'q-fsx-windows',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Medium',
    scenario:
      'A company is migrating Windows-based applications to AWS. These applications require access to a shared file system using the SMB protocol with Active Directory integration and NTFS permissions. Which storage service should be used?',
    options: [
      { id: 'a', text: 'Amazon EFS (Elastic File System)' },
      { id: 'b', text: 'Amazon FSx for Windows File Server' },
      { id: 'c', text: 'Amazon S3 with S3 File Gateway' },
      { id: 'd', text: 'Amazon EBS Multi-Attach' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Amazon FSx for Windows File Server is correct. FSx for Windows provides a fully managed Windows-native file system with SMB protocol support, Active Directory integration, NTFS permissions, and DFS namespaces — exactly what Windows applications expect.',
      incorrects: {
        a: 'Amazon EFS is incorrect. EFS uses the NFS protocol (not SMB) and is designed for Linux workloads. Windows applications that require SMB and NTFS permissions cannot use EFS natively.',
        c: 'S3 with File Gateway is incorrect. While File Gateway exposes S3 data via NFS/SMB, it does not support full NTFS semantics or native Active Directory integration required by Windows applications.',
        d: 'EBS Multi-Attach is incorrect. EBS Multi-Attach allows an EBS volume to be attached to multiple EC2 instances, but it is block storage, not a file system with SMB/NTFS support. Only Linux with cluster-aware file systems supports this.',
      },
    },
    keywords: ['FSx for Windows', 'SMB', 'NTFS', 'Active Directory', 'Windows file share'],
  },
  {
    id: 'q-datasync-vs-gateway',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Hard',
    scenario:
      'A company needs to migrate 20 TB of files from an on-premises NFS server to Amazon S3 as a one-time migration. After the migration, on-premises applications must continue to access and write files via NFS, which will be stored directly in S3. Which combination of services should the Solutions Architect recommend?',
    options: [
      { id: 'a', text: 'AWS DataSync for the migration; AWS DataSync for ongoing access' },
      { id: 'b', text: 'AWS Storage Gateway (File Gateway) for both the migration and ongoing access' },
      { id: 'c', text: 'AWS DataSync for the initial migration; AWS Storage Gateway (File Gateway) for ongoing NFS access' },
      { id: 'd', text: 'AWS Snowball for the migration; Direct Connect for ongoing access' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'DataSync + File Gateway is correct. DataSync is optimized for one-time or scheduled bulk data migrations — it handles verification, scheduling, and network optimization. After migration, File Gateway provides a local NFS mount point that stores files in S3, allowing on-premises apps to continue working without code changes.',
      incorrects: {
        a: 'DataSync for both is incorrect. DataSync is a migration tool — it transfers data from source to destination. It is not a mount point for ongoing NFS access by applications.',
        b: 'File Gateway for both is incorrect. While File Gateway can transfer data, it is not optimized for bulk migration. DataSync is significantly faster and more efficient for the initial 20 TB migration.',
        d: 'Snowball + Direct Connect is incorrect. Snowball is for very large datasets (typically >1 week via internet). 20 TB can typically be transferred via internet/DataSync. Direct Connect is for general network connectivity, not specifically for NFS file access to S3.',
      },
    },
    keywords: ['DataSync', 'Storage Gateway', 'File Gateway', 'migration vs ongoing', 'NFS', 'S3'],
  },
  {
    id: 'q-dms-migration',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Medium',
    scenario:
      'A company wants to migrate an on-premises Oracle database to Amazon Aurora PostgreSQL. The migration must have minimal downtime and the source database must remain operational during migration. Which service handles this migration?',
    options: [
      { id: 'a', text: 'AWS DataSync' },
      { id: 'b', text: 'AWS Database Migration Service (DMS) with Schema Conversion Tool (SCT)' },
      { id: 'c', text: 'AWS Application Migration Service (MGN)' },
      { id: 'd', text: 'AWS Backup with cross-engine restore' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'DMS with SCT is correct. This is a heterogeneous migration (Oracle → PostgreSQL — different engines). SCT converts the schema and stored procedures. DMS replicates data continuously (CDC) while the source stays live, enabling near-zero downtime cutover.',
      incorrects: {
        a: 'DataSync is incorrect. DataSync transfers files between storage systems — it does not understand database schemas, relationships, or CDC replication.',
        c: 'Application Migration Service is incorrect. MGN migrates entire servers/VMs (lift-and-shift) to EC2 — not individual database engines. It replicates the OS and all data, not just the database layer.',
        d: 'AWS Backup is incorrect. AWS Backup handles automated backups and restoration of AWS-native services. It cannot convert between Oracle and PostgreSQL or provide live replication.',
      },
    },
    keywords: ['DMS', 'Schema Conversion Tool', 'heterogeneous migration', 'Oracle to Aurora', 'minimal downtime'],
  },
  {
    id: 'q-snow-family',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Easy',
    scenario:
      'A media company needs to transfer 500 TB of video archives from their on-premises data center to Amazon S3. The data center has a 1 Gbps internet connection that is heavily utilized by production workloads. The transfer must not impact production traffic. Which is the most appropriate solution?',
    options: [
      { id: 'a', text: 'AWS DataSync with bandwidth throttling' },
      { id: 'b', text: 'AWS Direct Connect with a dedicated circuit' },
      { id: 'c', text: 'AWS Snowball Edge Storage Optimized' },
      { id: 'd', text: 'S3 Transfer Acceleration' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'Snowball Edge is correct. 500 TB over a 1 Gbps connection (even fully dedicated) would take approximately 46 days. Since production traffic already utilizes the connection, physical transfer via Snowball Edge is faster, avoids network impact, and is cost-effective at this scale.',
      incorrects: {
        a: 'DataSync with throttling is incorrect. Throttling would make the transfer even slower and it would still take weeks/months to transfer 500 TB. The root problem is insufficient/shared bandwidth.',
        b: 'Direct Connect is incorrect. Direct Connect provides a dedicated private connection to AWS but is complex to set up and takes weeks to provision. For a one-time large migration, Snow Family is more practical and cost-effective.',
        d: 'S3 Transfer Acceleration is incorrect. Transfer Acceleration optimizes upload speed via CloudFront edge locations but still uses the internet. With a shared 1 Gbps link and 500 TB, this does not solve the time or impact problem.',
      },
    },
    keywords: ['Snowball Edge', 'large data transfer', 'offline migration', 'physical device', '500TB'],
  },

  // ── D2 · Migration ───────────────────────────────────────────────────────
  {
    id: 'q-mgn-lift-shift',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Easy',
    scenario:
      'A company wants to migrate 50 on-premises physical servers running various Linux and Windows workloads to AWS as quickly as possible without re-architecting any applications. Which service is best suited for this migration?',
    options: [
      { id: 'a', text: 'AWS Database Migration Service (DMS)' },
      { id: 'b', text: 'AWS Application Migration Service (MGN)' },
      { id: 'c', text: 'AWS DataSync' },
      { id: 'd', text: 'AWS Elastic Beanstalk' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS Application Migration Service (MGN) is correct. MGN enables lift-and-shift (rehost) migration of physical, virtual, or cloud servers to AWS EC2 with minimal downtime. It installs a lightweight agent that continuously replicates the source server to AWS, then performs a quick cutover.',
      incorrects: {
        a: 'DMS is incorrect. DMS migrates databases specifically — not full server workloads. It handles data replication between database engines, not OS-level server migrations.',
        c: 'DataSync is incorrect. DataSync transfers files and data between storage systems. It does not migrate entire servers, operating systems, or application stacks.',
        d: 'Elastic Beanstalk is incorrect. Elastic Beanstalk deploys and manages new application code — it is not a migration tool for existing workloads and requires re-deploying applications.',
      },
    },
    keywords: ['MGN', 'Application Migration Service', 'lift-and-shift', 'rehost', 'server migration'],
  },
  {
    id: 'q-transfer-family',
    domain: 'd2',
    domainLabel: 'Resilient Architectures',
    difficulty: 'Easy',
    scenario:
      'A company receives daily files from business partners using SFTP. The operations team wants to store received files directly in Amazon S3 without changing the SFTP workflow used by partners and without managing any SFTP server infrastructure. Which solution meets these requirements?',
    options: [
      { id: 'a', text: 'Launch an EC2 instance running an open-source SFTP server and sync files to S3' },
      { id: 'b', text: 'Use AWS Transfer Family with S3 as the storage backend' },
      { id: 'c', text: 'Use AWS DataSync with SFTP as the source' },
      { id: 'd', text: 'Use Amazon Kinesis Data Firehose to receive SFTP transfers' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS Transfer Family is correct. Transfer Family provides fully managed SFTP, FTP, and FTPS endpoints that store files directly in S3 or EFS. Partners continue using SFTP — zero workflow changes — and AWS manages all server infrastructure.',
      incorrects: {
        a: 'EC2 SFTP server is incorrect. Running your own SFTP server on EC2 requires managing patches, scaling, backups, and manually syncing to S3. This violates the "no managing server infrastructure" requirement.',
        c: 'DataSync with SFTP is incorrect. DataSync can use SFTP as a source for bulk data migration, but it is a migration tool, not a managed SFTP endpoint for ongoing partner file delivery.',
        d: 'Kinesis Firehose is incorrect. Firehose ingests streaming data (logs, events, clickstreams) and loads it into S3/Redshift. It does not provide an SFTP endpoint.',
      },
    },
    keywords: ['Transfer Family', 'SFTP', 'S3 backend', 'managed FTP', 'no code changes'],
  },

  // ── D3 · Compute ─────────────────────────────────────────────────────────
  {
    id: 'q-fargate-vs-ec2',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Easy',
    scenario:
      'A development team wants to run Docker containers on AWS using Amazon ECS. They do not want to manage, patch, or scale the underlying EC2 instances. Which ECS launch type should they choose?',
    options: [
      { id: 'a', text: 'ECS with EC2 launch type and Auto Scaling Group' },
      { id: 'b', text: 'ECS with Fargate launch type' },
      { id: 'c', text: 'ECS with EC2 launch type and Spot Instances' },
      { id: 'd', text: 'Amazon EKS with self-managed node groups' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'ECS with Fargate is correct. Fargate is the serverless compute engine for ECS (and EKS). You define CPU and memory for each task and Fargate provisions and manages the infrastructure automatically — no EC2 instances to patch, scale, or maintain.',
      incorrects: {
        a: 'EC2 launch type with ASG is incorrect. While ASG automates scaling, you still need to manage the EC2 instances — patching the OS, managing capacity, choosing instance types. This does not eliminate the infrastructure management requirement.',
        c: 'EC2 with Spot Instances is incorrect. Spot reduces cost but you still manage the EC2 fleet. Spot Instances can also be interrupted, adding complexity.',
        d: 'EKS with self-managed nodes is incorrect. Self-managed node groups still require EC2 instance management. This is even more complex than ECS EC2 launch type.',
      },
    },
    keywords: ['Fargate', 'ECS', 'serverless containers', 'no EC2 management', 'launch type'],
  },
  {
    id: 'q-ecr',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Easy',
    scenario:
      'A company uses Amazon ECS to run containerized applications. The security team requires that all container images be stored in a private registry with IAM-based access control, automatic vulnerability scanning, and encryption at rest. Which service should they use?',
    options: [
      { id: 'a', text: 'Docker Hub (private repositories)' },
      { id: 'b', text: 'Amazon Elastic Container Registry (ECR)' },
      { id: 'c', text: 'Amazon S3 to store container image tar files' },
      { id: 'd', text: 'AWS CodeArtifact' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Amazon ECR is correct. ECR is a fully managed private container registry that integrates natively with IAM for access control, automatically scans images for vulnerabilities, encrypts images at rest with KMS, and integrates directly with ECS, EKS, and Fargate.',
      incorrects: {
        a: 'Docker Hub is incorrect. Docker Hub is a third-party service outside AWS. While it has private repos, it does not integrate with IAM for access control and would require separate credentials management.',
        c: 'S3 for tar files is incorrect. You could store image archives in S3, but ECS/EKS cannot pull images directly from S3. Container runtimes pull from container registries using standard OCI protocols, not S3.',
        d: 'CodeArtifact is incorrect. CodeArtifact is a managed artifact repository for software packages (npm, Maven, PyPI, etc.) — not container images.',
      },
    },
    keywords: ['ECR', 'container registry', 'private registry', 'IAM integration', 'vulnerability scanning'],
  },

  // ── D3 · Messaging ───────────────────────────────────────────────────────
  {
    id: 'q-eventbridge-schedule',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Easy',
    scenario:
      'A company wants to run a Lambda function every day at 8:00 AM UTC to generate a daily report. Which is the simplest AWS service to schedule this Lambda invocation?',
    options: [
      { id: 'a', text: 'Amazon SQS with a delay timer' },
      { id: 'b', text: 'Amazon EventBridge Scheduler with a cron expression' },
      { id: 'c', text: 'AWS Step Functions with a wait state' },
      { id: 'd', text: 'EC2 instance running a cron job that invokes Lambda via CLI' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Amazon EventBridge Scheduler is correct. EventBridge supports both cron expressions and rate expressions for scheduling. A cron(0 8 * * ? *) rule triggers the Lambda function daily at 8:00 AM UTC — fully managed, no infrastructure needed.',
      incorrects: {
        a: 'SQS with delay timer is incorrect. SQS Delay Seconds delays message visibility by up to 15 minutes — it is not a scheduling mechanism for recurring daily tasks.',
        c: 'Step Functions with wait state is incorrect. While Step Functions can wait, this would require a long-running state machine execution for a simple daily schedule. EventBridge is specifically designed for event scheduling.',
        d: 'EC2 cron job is incorrect. Running an EC2 instance 24/7 just to invoke a Lambda once a day is wasteful and over-engineered. EventBridge Scheduler is the purpose-built serverless solution.',
      },
    },
    keywords: ['EventBridge', 'cron schedule', 'scheduled Lambda', 'event-driven', 'recurring task'],
  },
  {
    id: 'q-step-functions',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'A company processes insurance claims through a multi-step workflow: validate input → run fraud detection → calculate payout → notify the customer → update the database. Each step is a Lambda function. If any step fails, the workflow must retry up to 3 times before sending to a dead-letter queue. Which service coordinates this workflow with the least custom code?',
    options: [
      { id: 'a', text: 'Amazon SQS with Lambda triggers chained together' },
      { id: 'b', text: 'AWS Step Functions' },
      { id: 'c', text: 'Amazon EventBridge with multiple rules' },
      { id: 'd', text: 'A single Lambda function that calls all other Lambdas sequentially' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS Step Functions is correct. Step Functions visually orchestrates multi-step workflows with built-in retry logic, error handling, branching, and timeout support — all defined in JSON without custom coordination code. Each Lambda is a state in the state machine.',
      incorrects: {
        a: 'SQS chained Lambdas is incorrect. You could chain Lambda functions via SQS, but you would need to write custom logic for retry counting, error tracking, and DLQ routing in each function. Step Functions handles all this declaratively.',
        c: 'Multiple EventBridge rules is incorrect. EventBridge routes events between services but does not manage workflow state, retry logic, or step sequencing. You would still need custom code to track progress.',
        d: 'Single Lambda orchestrator is incorrect. A Lambda that calls other Lambdas synchronously hits timeouts (15-minute max), makes error handling complex, and creates tight coupling. Step Functions is purpose-built for this.',
      },
    },
    keywords: ['Step Functions', 'workflow orchestration', 'retry logic', 'state machine', 'multi-step'],
  },
  {
    id: 'q-amazonmq-vs-sqs',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'A company is migrating an on-premises application to AWS. The application uses Apache ActiveMQ with AMQP and MQTT protocols and the development team wants to avoid rewriting message broker integration code. Which AWS service should they use?',
    options: [
      { id: 'a', text: 'Amazon SQS' },
      { id: 'b', text: 'Amazon SNS' },
      { id: 'c', text: 'Amazon MQ' },
      { id: 'd', text: 'Amazon Kinesis Data Streams' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'Amazon MQ is correct. Amazon MQ is a managed message broker service for Apache ActiveMQ and RabbitMQ. It supports industry-standard protocols including AMQP, MQTT, STOMP, and OpenWire — so existing applications work without code changes.',
      incorrects: {
        a: 'Amazon SQS is incorrect. SQS uses AWS-proprietary APIs. An application built for AMQP/MQTT would require significant code changes to integrate with SQS. SQS is ideal for new, cloud-native applications — not for migrating legacy message broker clients.',
        b: 'Amazon SNS is incorrect. SNS is a pub/sub notification service with AWS-proprietary APIs. It does not support AMQP, MQTT, or other standard messaging protocols.',
        d: 'Kinesis Data Streams is incorrect. Kinesis is for high-throughput real-time data streaming and uses AWS-proprietary APIs — not suitable for standard message broker protocols.',
      },
    },
    keywords: ['Amazon MQ', 'ActiveMQ', 'AMQP', 'MQTT', 'migration', 'no code changes'],
  },
  {
    id: 'q-firehose-vs-streams',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'A company collects clickstream data from their website and wants to automatically load it into Amazon S3 for later analysis. No custom consumer application should be required. The data can be buffered for up to 5 minutes before writing. Which service best fits this requirement?',
    options: [
      { id: 'a', text: 'Amazon Kinesis Data Streams with a custom consumer Lambda' },
      { id: 'b', text: 'Amazon Kinesis Data Firehose' },
      { id: 'c', text: 'Amazon SQS with Lambda polling and S3 writes' },
      { id: 'd', text: 'Amazon MSK (Managed Streaming for Kafka)' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Kinesis Data Firehose is correct. Firehose is a fully managed delivery service that automatically loads streaming data into S3, Redshift, OpenSearch, or Splunk. It buffers data and writes in batches — no consumer code required. You only configure the delivery stream.',
      incorrects: {
        a: 'Kinesis Data Streams + Lambda is incorrect. While this works, it requires writing and maintaining a consumer application. The requirement states "no custom consumer application required," which eliminates Kinesis Streams.',
        c: 'SQS + Lambda + S3 is incorrect. This requires building and managing a Lambda function to read from SQS and write to S3 — violating the no-custom-consumer requirement.',
        d: 'Amazon MSK is incorrect. MSK provides managed Kafka brokers but still requires writing producer and consumer applications. It is best for Kafka compatibility requirements, not for simple S3 data delivery.',
      },
    },
    keywords: ['Kinesis Data Firehose', 'delivery stream', 'S3 loading', 'no consumer code', 'vs Kinesis Streams'],
  },

  // ── D3 · Infra ────────────────────────────────────────────────────────────
  {
    id: 'q-cloudwatch-alarm',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Easy',
    scenario:
      'A company wants to be notified via email when the CPU utilization of any EC2 instance in an Auto Scaling Group exceeds 80% for more than 5 minutes. Which combination of services should the Solutions Architect configure?',
    options: [
      { id: 'a', text: 'AWS CloudTrail + SNS' },
      { id: 'b', text: 'Amazon CloudWatch Alarm + Amazon SNS' },
      { id: 'c', text: 'AWS Config rule + SNS' },
      { id: 'd', text: 'Amazon EventBridge + SES' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'CloudWatch Alarm + SNS is correct. CloudWatch collects EC2 CPU metrics and an Alarm can trigger when the metric exceeds a threshold for a specified period. The Alarm action sends a notification to an SNS topic, which delivers an email to subscribed addresses.',
      incorrects: {
        a: 'CloudTrail + SNS is incorrect. CloudTrail records API calls — not resource metrics like CPU utilization. It cannot alert on performance thresholds.',
        c: 'AWS Config is incorrect. Config monitors resource configuration changes (e.g. security group rule changes) — not real-time metrics like CPU utilization.',
        d: 'EventBridge + SES is incorrect. While technically possible with a custom setup, EventBridge is not the standard service for metric-based alarms. CloudWatch Alarm → SNS is the standard pattern for this use case.',
      },
    },
    keywords: ['CloudWatch', 'alarm', 'SNS', 'CPU utilization', 'EC2 monitoring'],
  },
  {
    id: 'q-xray-tracing',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'A microservices application has 8 services including API Gateway, multiple Lambda functions, and DynamoDB. Users report slow responses but the team cannot identify which component is the bottleneck. Which service should the Solutions Architect enable to visualize the request flow and latency breakdown?',
    options: [
      { id: 'a', text: 'Amazon CloudWatch detailed monitoring' },
      { id: 'b', text: 'AWS X-Ray' },
      { id: 'c', text: 'Amazon CloudWatch Container Insights' },
      { id: 'd', text: 'AWS CloudTrail with S3 analysis' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS X-Ray is correct. X-Ray traces requests end-to-end across distributed services. Its service map shows each component (API Gateway → Lambda → DynamoDB) and the time spent in each — making it easy to identify the slow component. It works natively with Lambda, API Gateway, and many AWS services.',
      incorrects: {
        a: 'CloudWatch detailed monitoring is incorrect. Detailed monitoring provides per-service metrics at 1-minute granularity but does not trace individual requests across multiple services. You would need to correlate metrics manually across 8 services.',
        c: 'Container Insights is incorrect. Container Insights provides metrics and logs for containerized applications (ECS/EKS). This application uses Lambda, not containers.',
        d: 'CloudTrail with S3 analysis is incorrect. CloudTrail records API management events for audit purposes. Analyzing latency across a microservices chain requires distributed tracing, not API audit logs.',
      },
    },
    keywords: ['X-Ray', 'distributed tracing', 'service map', 'latency', 'microservices', 'bottleneck'],
  },

  // ── D3 · Databases ────────────────────────────────────────────────────────
  {
    id: 'q-documentdb-mongodb',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Easy',
    scenario:
      'A company runs a content management system that stores data as JSON documents in MongoDB on-premises. They want to migrate to a fully managed AWS database service with minimal application code changes. Which service should they choose?',
    options: [
      { id: 'a', text: 'Amazon DynamoDB' },
      { id: 'b', text: 'Amazon DocumentDB' },
      { id: 'c', text: 'Amazon RDS for PostgreSQL with JSONB' },
      { id: 'd', text: 'Amazon Neptune' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Amazon DocumentDB is correct. DocumentDB is MongoDB-compatible, meaning existing MongoDB drivers, queries, and application code work with minimal changes. It is fully managed — AWS handles patching, backups, and scaling.',
      incorrects: {
        a: 'DynamoDB is incorrect. DynamoDB is a key-value/document store but uses AWS-proprietary APIs — not MongoDB-compatible. Migrating from MongoDB to DynamoDB requires significant application rewrites.',
        c: 'RDS PostgreSQL with JSONB is incorrect. While PostgreSQL supports JSON storage, your application is written for MongoDB APIs. Using PostgreSQL would require rewriting all data access logic.',
        d: 'Amazon Neptune is incorrect. Neptune is a graph database for highly connected relationship data. MongoDB document workloads are not graph workloads.',
      },
    },
    keywords: ['DocumentDB', 'MongoDB compatible', 'JSON documents', 'managed', 'migration'],
  },
  {
    id: 'q-neptune-graph',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'A social media company needs to find all mutual connections between two users, detect fraud rings in financial transaction networks, and make real-time product recommendations based on user behavior graphs. Which database is best suited for these use cases?',
    options: [
      { id: 'a', text: 'Amazon RDS for MySQL' },
      { id: 'b', text: 'Amazon DynamoDB' },
      { id: 'c', text: 'Amazon Neptune' },
      { id: 'd', text: 'Amazon DocumentDB' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'Amazon Neptune is correct. Neptune is a purpose-built graph database optimized for traversing relationships between data points. Use cases like "find mutual friends", "detect fraud rings", and "graph-based recommendations" require efficient graph traversal — which relational and key-value databases handle poorly at scale.',
      incorrects: {
        a: 'RDS MySQL is incorrect. Finding relationships in relational databases requires complex multi-table JOINs that become exponentially slow as the relationship depth increases. Graph databases are orders of magnitude more efficient for this.',
        b: 'DynamoDB is incorrect. DynamoDB excels at high-throughput key lookups but is not designed for graph traversals. Finding second and third-degree connections requires multiple round trips and custom application logic.',
        d: 'DocumentDB is incorrect. DocumentDB stores JSON documents (like MongoDB). While you can store relationship data in documents, it is not optimized for graph traversals.',
      },
    },
    keywords: ['Neptune', 'graph database', 'social network', 'fraud detection', 'relationships', 'recommendations'],
  },
  {
    id: 'q-keyspaces',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'A company runs an IoT platform that collects sensor telemetry data using Apache Cassandra. They want to migrate to AWS with minimal application changes while eliminating the need to manage Cassandra cluster nodes, patching, and scaling. Which service should they use?',
    options: [
      { id: 'a', text: 'Amazon DynamoDB' },
      { id: 'b', text: 'Amazon Keyspaces (for Apache Cassandra)' },
      { id: 'c', text: 'Amazon RDS for MySQL' },
      { id: 'd', text: 'Amazon ElastiCache for Redis' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Amazon Keyspaces is correct. Keyspaces is a fully managed, serverless Cassandra-compatible service. Applications use the same CQL (Cassandra Query Language) — no driver or query changes needed. AWS manages all cluster operations, scaling, and patching.',
      incorrects: {
        a: 'DynamoDB is incorrect. DynamoDB uses AWS-proprietary APIs. Migrating from Cassandra to DynamoDB requires rewriting all data access code, which violates the "minimal application changes" requirement.',
        c: 'RDS MySQL is incorrect. MySQL is a relational database — not Cassandra-compatible. This would require a complete data model redesign and application rewrite.',
        d: 'ElastiCache for Redis is incorrect. ElastiCache is an in-memory caching service for low-latency data access. It is not a persistent wide-column database and is not Cassandra-compatible.',
      },
    },
    keywords: ['Keyspaces', 'Cassandra compatible', 'CQL', 'IoT', 'managed', 'no code changes'],
  },

  // ── D3 · Analytics ────────────────────────────────────────────────────────
  {
    id: 'q-athena-s3',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Easy',
    scenario:
      'A company stores all CloudTrail logs, ALB access logs, and VPC Flow Logs in Amazon S3. The security team needs to run ad-hoc SQL queries against these logs to investigate incidents — without loading data into any database. Which service should they use?',
    options: [
      { id: 'a', text: 'Amazon Redshift' },
      { id: 'b', text: 'Amazon Athena' },
      { id: 'c', text: 'Amazon EMR with Hive' },
      { id: 'd', text: 'AWS Glue with a Spark job' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Amazon Athena is correct. Athena runs standard SQL queries directly against data in S3 — no data loading, no database setup. You pay only for the data scanned. It is ideal for ad-hoc analysis of logs stored in S3.',
      incorrects: {
        a: 'Amazon Redshift is incorrect. Redshift is a data warehouse that requires loading data into its own storage. For ad-hoc analysis of data already in S3 without loading it anywhere, Athena is the right tool.',
        c: 'EMR with Hive is incorrect. EMR is a full managed cluster platform for big data. For simple ad-hoc SQL on S3, EMR is over-engineered — it requires cluster management and is slower to start.',
        d: 'Glue with Spark job is incorrect. Glue ETL jobs transform and load data between systems. While Glue can query S3, the correct tool for interactive SQL on S3 is Athena, often paired with the Glue Data Catalog.',
      },
    },
    keywords: ['Athena', 'serverless SQL', 'S3 queries', 'ad-hoc analysis', 'no data loading', 'log analysis'],
  },
  {
    id: 'q-glue-etl',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'A data engineering team needs to extract raw CSV files from S3, transform them into Parquet format, and load the results into Amazon Redshift for analysis. They also need a metadata catalog so Athena can discover the data schema. Which service handles both the ETL transformation and metadata cataloging?',
    options: [
      { id: 'a', text: 'Amazon EMR with custom Spark scripts' },
      { id: 'b', text: 'AWS Glue' },
      { id: 'c', text: 'Amazon Kinesis Data Firehose' },
      { id: 'd', text: 'AWS Lambda with S3 event triggers' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS Glue is correct. Glue provides both a serverless ETL engine (generates PySpark/Scala code) and the Glue Data Catalog (a metadata repository compatible with Athena, EMR, and Redshift Spectrum). Glue Crawlers automatically discover and catalog schemas.',
      incorrects: {
        a: 'EMR is incorrect. EMR can run Spark ETL jobs but requires managing a cluster and does not include a built-in metadata catalog. You would need separate catalog infrastructure.',
        c: 'Kinesis Firehose is incorrect. Firehose delivers streaming data to destinations with optional Lambda transformation. It does not perform batch ETL (CSV → Parquet conversion) or maintain a data catalog.',
        d: 'Lambda is incorrect. Lambda has a 15-minute timeout and 10 GB memory limit — insufficient for large-scale CSV-to-Parquet conversion. It also has no built-in data catalog functionality.',
      },
    },
    keywords: ['Glue', 'ETL', 'data catalog', 'Parquet', 'Redshift', 'Athena', 'crawler'],
  },
  {
    id: 'q-emr-big-data',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'A genomics research company processes petabytes of DNA sequencing data using custom Apache Spark jobs with specific Python libraries. The jobs run for 4–6 hours on large clusters and require full control over cluster configuration, instance types, and Spark settings. Which service should they use?',
    options: [
      { id: 'a', text: 'AWS Glue' },
      { id: 'b', text: 'Amazon Athena' },
      { id: 'c', text: 'Amazon EMR' },
      { id: 'd', text: 'AWS Lambda with large memory allocation' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'Amazon EMR is correct. EMR gives full control over the cluster — choose instance types, number of nodes, Spark/Hadoop configuration, custom libraries, and bootstrap actions. It is designed for long-running, complex big data jobs requiring customization.',
      incorrects: {
        a: 'AWS Glue is incorrect. Glue is serverless and managed — you do not control the cluster configuration, instance types, or Spark settings. For jobs requiring full cluster control and custom configurations, EMR is appropriate.',
        b: 'Athena is incorrect. Athena runs SQL queries on S3 — it does not execute custom Spark programs or process petabyte-scale compute-intensive workloads like DNA sequencing.',
        d: 'Lambda is incorrect. Lambda has a 15-minute timeout and 10 GB memory — completely inadequate for 4–6 hour, petabyte-scale Spark jobs.',
      },
    },
    keywords: ['EMR', 'Spark', 'big data', 'cluster control', 'custom configuration', 'petabyte'],
  },
  {
    id: 'q-opensearch',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'An e-commerce platform needs to provide product search with features like full-text search, fuzzy matching for typos, faceted filtering, and relevance scoring. The product catalog has 50 million items. Which database service is best suited for this use case?',
    options: [
      { id: 'a', text: 'Amazon DynamoDB' },
      { id: 'b', text: 'Amazon RDS for PostgreSQL' },
      { id: 'c', text: 'Amazon OpenSearch Service' },
      { id: 'd', text: 'Amazon Redshift' },
    ],
    correctId: 'c',
    explanation: {
      correct:
        'Amazon OpenSearch Service is correct. OpenSearch is purpose-built for full-text search with features like inverted indexes, fuzzy matching, faceted search, relevance scoring, and auto-complete. It excels at the "search box" use case at scale.',
      incorrects: {
        a: 'DynamoDB is incorrect. DynamoDB supports exact key lookups and basic filtering but does not support full-text search, fuzzy matching, or relevance scoring natively.',
        b: 'RDS PostgreSQL is incorrect. While PostgreSQL has full-text search capabilities, they are not optimized for 50 million items with complex search features. Search queries would be slow and resource-intensive at this scale.',
        d: 'Redshift is incorrect. Redshift is an analytical data warehouse designed for complex SQL analytics on structured data — not for low-latency, real-time search queries from user-facing applications.',
      },
    },
    keywords: ['OpenSearch', 'full-text search', 'fuzzy matching', 'faceted search', 'relevance scoring', 'e-commerce'],
  },
  {
    id: 'q-msk-kafka',
    domain: 'd3',
    domainLabel: 'High-Performing Architectures',
    difficulty: 'Medium',
    scenario:
      'A company runs an Apache Kafka cluster on-premises for real-time event streaming. They want to migrate to AWS to reduce operational overhead while keeping their existing Kafka producer and consumer application code unchanged. Which service should they use?',
    options: [
      { id: 'a', text: 'Amazon Kinesis Data Streams' },
      { id: 'b', text: 'Amazon MSK (Managed Streaming for Apache Kafka)' },
      { id: 'c', text: 'Amazon SQS FIFO' },
      { id: 'd', text: 'Amazon Kinesis Data Firehose' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'Amazon MSK is correct. MSK is a fully managed Apache Kafka service. Existing Kafka producers and consumers work without code changes — they use the same Kafka APIs. AWS manages broker provisioning, patching, monitoring, and high availability.',
      incorrects: {
        a: 'Kinesis Data Streams is incorrect. Kinesis uses AWS-proprietary APIs. Migrating Kafka applications to Kinesis requires rewriting all producer and consumer code — violating the "unchanged code" requirement.',
        c: 'SQS FIFO is incorrect. SQS FIFO guarantees message ordering and exactly-once processing but uses AWS-proprietary APIs. It is not Kafka-compatible.',
        d: 'Kinesis Data Firehose is incorrect. Firehose is for loading streaming data into S3/Redshift automatically. It is not a Kafka-compatible streaming platform.',
      },
    },
    keywords: ['MSK', 'Kafka', 'managed Kafka', 'no code changes', 'migration', 'Kafka API compatible'],
  },

  // ── D4 · Cost ─────────────────────────────────────────────────────────────
  {
    id: 'q-budgets-vs-explorer',
    domain: 'd4',
    domainLabel: 'Cost-Optimized Architectures',
    difficulty: 'Easy',
    scenario:
      'A company wants to automatically receive an email alert when their monthly AWS bill is forecasted to exceed $10,000 before the end of the month. Which service should they configure?',
    options: [
      { id: 'a', text: 'AWS Cost Explorer' },
      { id: 'b', text: 'AWS Budgets' },
      { id: 'c', text: 'AWS Trusted Advisor' },
      { id: 'd', text: 'Amazon CloudWatch billing alarm' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS Budgets is correct. Budgets lets you set a monthly cost threshold and configure alerts to be sent via SNS/email when actual spend OR forecasted spend exceeds the threshold. Forecasted alerts warn you before you overspend — not after.',
      incorrects: {
        a: 'Cost Explorer is incorrect. Cost Explorer visualizes and analyzes your past and current spending — it is a reporting and analysis tool, not an alerting tool. You must proactively check it; it does not send proactive alerts.',
        c: 'Trusted Advisor is incorrect. Trusted Advisor provides cost optimization recommendations (e.g. "these EC2 instances are underutilized") but does not alert on spending thresholds.',
        d: 'CloudWatch billing alarm is incorrect. While CloudWatch can create billing alarms, they only trigger on actual spend — not forecasted spend. AWS Budgets supports both actual and forecasted thresholds.',
      },
    },
    keywords: ['AWS Budgets', 'cost alert', 'forecasted spend', 'SNS notification', 'before overspend'],
  },
  {
    id: 'q-cost-explorer-ri',
    domain: 'd4',
    domainLabel: 'Cost-Optimized Architectures',
    difficulty: 'Easy',
    scenario:
      'A company has been running AWS workloads for 6 months. The finance team wants to understand which services are driving the most costs, identify trends in spending over the past 3 months, and get recommendations on which EC2 instances to purchase as Reserved Instances to maximize savings. Which service provides all of this?',
    options: [
      { id: 'a', text: 'AWS Budgets' },
      { id: 'b', text: 'AWS Cost Explorer' },
      { id: 'c', text: 'AWS Trusted Advisor' },
      { id: 'd', text: 'Amazon CloudWatch billing metrics' },
    ],
    correctId: 'b',
    explanation: {
      correct:
        'AWS Cost Explorer is correct. Cost Explorer provides interactive cost and usage charts broken down by service, account, region, or tag. It shows historical trends and offers RI/Savings Plans purchase recommendations based on your actual usage patterns.',
      incorrects: {
        a: 'AWS Budgets is incorrect. Budgets sets spending thresholds and alerts — it is proactive alerting, not historical analysis or RI recommendations.',
        c: 'Trusted Advisor is incorrect. Trusted Advisor gives general best practice recommendations (e.g. "this EC2 is underutilized") but does not provide detailed spend breakdowns or RI purchase recommendations based on usage history.',
        d: 'CloudWatch billing metrics is incorrect. CloudWatch shows current and estimated charges but does not provide historical trend analysis, service-level breakdown, or RI recommendations.',
      },
    },
    keywords: ['Cost Explorer', 'cost analysis', 'RI recommendations', 'spending trends', 'visualization'],
  },
]
