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
]
