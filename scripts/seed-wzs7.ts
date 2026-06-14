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
    id: 'wzs7-001', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Easy',
    scenario: 'A Cloud Architect deployed a web application using auto-scaled Amazon EC2 instances in multiple Availability Zones (AZs) behind an Application Load Balancer. The architect also configured an Amazon RDS database instance with Multi-Availability Zone (Multi-AZ) deployment. Following a spike in requests, the primary DB instance fails due to a high load. What is the automated failover mechanism that occurs for the database?',
    options: [
      { id: 'a', text: 'The IP address of the primary DB instance is switched to the standby DB instance.' },
      { id: 'b', text: 'The RDS DB instance will automatically reboot and attempt to recover the primary instance.' },
      { id: 'c', text: 'A new DB instance will be created in a separate AZ and immediately replace the primary database.' },
      { id: 'd', text: 'The Canonical Name (CNAME) record of the primary DB instance\'s endpoint is automatically changed to point to the standby DB instance.' },
    ],
    correctId: 'd',
    explanation: 'Amazon RDS Multi-AZ failover works via DNS: the endpoint hostname for the primary DB instance is a CNAME that AWS automatically updates to point to the standby instance\'s IP address during a failover. Applications connected using the endpoint hostname (not a hardcoded IP) automatically reconnect to the promoted standby after DNS propagation (typically 60-120 seconds). Option A is wrong: IPs are not reassigned — the CNAME is updated. Option B is wrong: RDS does not just reboot the primary when a Multi-AZ failover occurs — it promotes the standby. Option C is wrong: no new DB instance is created; the pre-existing standby (which has been synchronously replicating) is promoted to primary.',
    reference: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html',
    keywords: ['RDS Multi-AZ', 'failover', 'CNAME', 'standby promotion', 'automatic failover', 'endpoint DNS', 'synchronous replication'],
  },
  {
    id: 'wzs7-002', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A company is planning to migrate an on-premises 15 TB MySQL database cluster onto AWS. Key requirements for the new cluster include: replication lag must be less than 100 milliseconds, and the data size is expected to double in the next couple of months. Which of the following would be the ideal data store that should be chosen in AWS?',
    options: [
      { id: 'a', text: 'Amazon RDS for MySQL.' },
      { id: 'b', text: 'Amazon DynamoDB.' },
      { id: 'c', text: 'AWS Redshift.' },
      { id: 'd', text: 'Amazon Aurora (MySQL-compatible edition).' },
    ],
    correctId: 'd',
    explanation: 'Amazon Aurora MySQL-compatible edition meets all requirements: Storage — Aurora automatically grows up to 128 TiB in 10 GiB increments, accommodating 15 TB current and expected doubling. Replication lag — Aurora Replicas typically maintain less than 10 ms replica lag (far below the 100 ms requirement), compared to RDS MySQL Read Replicas which can have lag in seconds or more. MySQL-compatible — supports native MySQL replication. Option A (RDS for MySQL) has a 64 TiB storage limit and higher replication lag than Aurora. Option B (DynamoDB) is a NoSQL service — not suitable for migrating a MySQL relational database. Option C (Redshift) is a data warehouse for OLAP analytics — not a transactional database replacement.',
    reference: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html',
    keywords: ['Aurora MySQL-compatible', 'replication lag', '128 TiB storage', 'sub-10ms lag', 'MySQL migration', 'auto-scaling storage', 'Aurora Replicas'],
  },
  {
    id: 'wzs7-003', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Hard',
    scenario: 'As an AWS Architect for a multinational bank with a hybrid cloud architecture, you are managing a currency exchange website that uses an Amazon RDS for MySQL instance as its production database. The company\'s business continuity plan requires maintaining a read replica of the production RDS instance in the bank\'s on-premises data center. What is the most secure and effective way to achieve this?',
    options: [
      { id: 'a', text: 'Change the RDS MySQL instance to the master node and enable replication over the public internet using a secure SSL endpoint to an on-premises server.' },
      { id: 'b', text: 'Configure the RDS MySQL instance to replicate to an Amazon EC2 instance with MySQL, and then enable replication from the EC2 instance over a secure VPN connection to the on-premises server.' },
      { id: 'c', text: 'Use native backup and restore for MySQL databases by storing full backup files on Amazon S3, and then restore the backup file onto an on-premises server periodically.' },
      { id: 'd', text: 'Establish an AWS Site-to-Site VPN or AWS Direct Connect connection between the Amazon VPC and the on-premises data center, and then configure native MySQL replication to the on-premises server.' },
    ],
    correctId: 'd',
    explanation: 'Direct Connect or Site-to-Site VPN provides a secure, private network connection between the AWS VPC and on-premises data center. Native MySQL binary log (binlog) replication over this encrypted private connection achieves near-real-time replication with minimal lag — making it the most secure and effective approach for a continuous live read replica. Option A uses the public internet — less secure, even with SSL. Option B adds an unnecessary intermediary EC2 instance, increasing complexity and potential single points of failure. Option C (periodic backup/restore) is NOT continuous replication — it provides snapshots with RPO equal to the backup interval, not a live read replica.',
    reference: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/mysql-stored-proc-replicating.html',
    keywords: ['RDS MySQL replication', 'on-premises replica', 'Direct Connect', 'Site-to-Site VPN', 'binlog replication', 'hybrid cloud', 'secure replication'],
  },
  {
    id: 'wzs7-004', domain: 'd4', domainLabel: 'Design Cost-Optimized Architectures', difficulty: 'Medium',
    scenario: 'Your team developed an online feedback application using AWS CloudFormation. The application uses an Amazon RDS database and an Amazon S3 bucket to store data. The competition has ended, and the CloudFormation stack should be terminated to save costs. Your manager requires that the RDS database be backed up and the data in the S3 bucket be retained so the data can still be used after the stack is deleted. Which configuration of the DeletionPolicy attribute in the CloudFormation template will fulfill this requirement?',
    options: [
      { id: 'a', text: 'Set the DeletionPolicy for the RDS instance to Snapshot and enable S3 bucket replication on the source bucket to maintain a copy of all S3 objects.' },
      { id: 'b', text: 'Set the DeletionPolicy to Retain on both the RDS and S3 resource types on the CloudFormation template.' },
      { id: 'c', text: 'Set the DeletionPolicy for the S3 bucket to Snapshot and the RDS database to Retain.' },
      { id: 'd', text: 'Set the DeletionPolicy on the Amazon RDS resource to Snapshot and set the Amazon S3 bucket resource to Retain.' },
    ],
    correctId: 'd',
    explanation: 'CloudFormation DeletionPolicy values per resource type: For RDS — "Snapshot" creates a final DB snapshot before the instance is deleted, preserving the data as a recoverable snapshot. For S3 — "Retain" keeps the bucket and all its objects in your account after stack deletion (S3 does NOT support "Snapshot" as a DeletionPolicy). Option B (Retain for both) works for data preservation, but wastes money on keeping a live RDS instance running instead of snapshotting it. Option C is wrong: S3 does NOT support DeletionPolicy=Snapshot. Option A is overly complex — bucket replication is unnecessary when Retain preserves the bucket directly.',
    reference: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-deletionpolicy.html',
    keywords: ['CloudFormation DeletionPolicy', 'Snapshot', 'Retain', 'RDS final snapshot', 'S3 Retain', 'stack deletion', 'data preservation'],
  },
  {
    id: 'wzs7-005', domain: 'd4', domainLabel: 'Design Cost-Optimized Architectures', difficulty: 'Medium',
    scenario: 'A startup company is developing a web application using an Amazon DynamoDB table configured with a Provisioned Throughput of 1000 Write Capacity Units (WCU) per second. They are expecting a high and unpredictable number of writes on the database during peak hours, potentially reaching 3,000 WCU per second. How could you ensure the scalability and cost-effectiveness of the application to consistently meet the peak write demands without manual intervention?',
    options: [
      { id: 'a', text: 'Add more DynamoDB tables to handle the load and implement application-level sharding.' },
      { id: 'b', text: 'Manually increase the provisioned write capacity of DynamoDB to 3,000 WCU and then manually decrease it when the peak is over.' },
      { id: 'c', text: 'Use DynamoDB Auto Scaling to automatically adjust the provisioned throughput settings based on actual traffic.' },
      { id: 'd', text: 'Configure an Application Load Balancer in front of the EC2 Auto Scaling group to buffer requests and smooth out the load.' },
    ],
    correctId: 'c',
    explanation: 'DynamoDB Auto Scaling uses AWS Application Auto Scaling to automatically increase and decrease provisioned capacity based on actual traffic patterns. You define a target utilization percentage, and Auto Scaling adjusts capacity to stay within it — scaling up before throttling occurs during peaks and scaling down during quiet periods to save costs. This is fully automated ("without manual intervention"). Option A (application sharding) adds application-level complexity and doesn\'t automatically adjust capacity. Option B (manual adjustment) requires human intervention — violating the "without manual intervention" requirement. Option D (ALB in front of EC2) is completely unrelated to DynamoDB capacity management.',
    reference: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/AutoScaling.html',
    keywords: ['DynamoDB Auto Scaling', 'provisioned throughput', 'WCU auto-adjust', 'target utilization', 'automatic scaling', 'cost-effective', 'peak traffic'],
  },
  {
    id: 'wzs7-006', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A retail application uses a PostgreSQL 9.2 database hosted on a large EC2 instance. The database is struggling with performance as demand grows, especially given that it handles significantly more read than write requests. The company wants a solution that can automatically scale to meet unpredictable read demand and ensure high availability to replace the old EC2-hosted database. Which solution best meets these requirements?',
    options: [
      { id: 'a', text: 'Use Amazon DynamoDB with a single primary node for both leader and compute functionality.' },
      { id: 'b', text: 'Use Amazon RDS for PostgreSQL in a Single-AZ configuration; adding read replicas in a separate Availability Zone.' },
      { id: 'c', text: 'Use Amazon RDS with EC2 Spot instances.' },
      { id: 'd', text: 'Use Amazon Aurora PostgreSQL-Compatible Edition with a Multi-AZ deployment and configure Aurora Auto Scaling with Aurora Replicas.' },
    ],
    correctId: 'd',
    explanation: 'Aurora PostgreSQL-Compatible Edition with Multi-AZ + Aurora Auto Scaling directly addresses both requirements: High availability — Multi-AZ provides automatic failover to a standby replica. Automatic read scaling — Aurora Auto Scaling automatically adds/removes Aurora Read Replicas based on CloudWatch metrics (e.g., CPU utilization, connections), meeting unpredictable read demand automatically. Aurora Read Replicas serve read traffic with typical lag under 10 ms. Option A (DynamoDB) is NoSQL — not suitable for replacing a PostgreSQL relational database. Option B (RDS PostgreSQL Single-AZ) lacks High Availability and doesn\'t support automatic read replica scaling. Option C (EC2 Spot instances) — RDS doesn\'t run on Spot instances; this is architecturally incorrect.',
    reference: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Integrating.AutoScaling.html',
    keywords: ['Aurora PostgreSQL', 'Aurora Auto Scaling', 'Aurora Replicas', 'Multi-AZ', 'read scaling', 'high availability', 'automatic scaling'],
  },
  {
    id: 'wzs7-007', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A company is building a two-tier web application on AWS. The application runs on an Amazon EC2 instance, which connects directly to a backend Amazon RDS database. To enhance security, the company wants to avoid hardcoding database credentials in the application and requires a solution that can automatically rotate those credentials regularly. Which solution will best fulfill these requirements with minimal operational effort?',
    options: [
      { id: 'a', text: 'Store the database credentials in AWS Systems Manager Parameter Store and configure parameter policies for automatic rotation.' },
      { id: 'b', text: 'Save the database credentials in an encrypted Amazon S3 bucket, and set up a Lambda function to rotate the credentials periodically.' },
      { id: 'c', text: 'Utilize IAM roles and policies to provide the application direct access to the database without storing credentials.' },
      { id: 'd', text: 'Use AWS Secrets Manager to securely store the database credentials and enable built-in automatic credential rotation.' },
    ],
    correctId: 'd',
    explanation: 'AWS Secrets Manager is specifically designed for this use case: it stores database credentials (and other secrets) and provides built-in, automated rotation for RDS, Aurora, Redshift, and DocumentDB passwords via a managed Lambda rotation function. No custom code needed — enable rotation, set the rotation interval, done. Option A (SSM Parameter Store with SecureString) can store credentials securely but does NOT have native automatic rotation for database passwords — you would need custom Lambda functions to rotate. Option B (S3 bucket + custom Lambda) works but requires significant custom implementation — higher operational overhead. Option C (IAM roles) works for IAM-authenticated databases (IAM auth for RDS/Aurora) but requires application changes and is not available for all database types.',
    reference: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html',
    keywords: ['Secrets Manager', 'automatic rotation', 'database credentials', 'RDS password rotation', 'no hardcoded credentials', 'built-in rotation', 'minimal effort'],
  },
  {
    id: 'wzs7-008', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Hard',
    scenario: 'A solutions architect is responsible for creating a disaster recovery plan for a company\'s e-commerce application that utilizes Amazon DynamoDB for storing customer data. The plan needs to achieve a strict Recovery Point Objective (RPO) of 20 minutes and a Recovery Time Objective (RTO) of 1 hour. What solution would best meet these recovery objectives?',
    options: [
      { id: 'a', text: 'Enable point-in-time recovery (PITR) on DynamoDB and develop a Lambda function to restore data within the required RTO.' },
      { id: 'b', text: 'Create a backup of the DynamoDB tables every 20 minutes and set up an automated restoration process to meet the RTO.' },
      { id: 'c', text: 'Use DynamoDB Streams to capture changes and store them in Amazon S3 for recovery; configuring a job to restore data every hour.' },
      { id: 'd', text: 'Implement DynamoDB Global Tables to replicate data across multiple AWS Regions, ensuring near-zero data loss and fast recovery.' },
    ],
    correctId: 'a',
    explanation: 'DynamoDB PITR (Point-in-Time Recovery) enables continuous incremental backups so you can restore to any second in the past 35 days — the RPO is effectively seconds (far better than the required 20 minutes). A Lambda function can automate the restoration process: detect failure, trigger a PITR restore to a specific timestamp, swap the table endpoint — achievable within 1 hour RTO. Option B (every-20-minute backups) meets RPO technically but requires custom backup infrastructure and adds operational overhead. Option C (DynamoDB Streams + S3) creates a change log but restoration from streaming changes is complex and slower than PITR. Option D (Global Tables) provides active-active replication with near-zero RPO but is designed for active-active multi-region architectures, not DR with specific RPO/RTO targets — much more expensive and complex than needed.',
    reference: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.html',
    keywords: ['DynamoDB PITR', 'point-in-time recovery', 'RPO 20 minutes', 'RTO 1 hour', 'continuous backups', 'Lambda restore', 'disaster recovery'],
  },
  {
    id: 'wzs7-009', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A company is migrating its Amazon RDS for MySQL instance to an Amazon Aurora PostgreSQL DB cluster. The migration is critical and must keep data synchronized between the source and target databases during the transition to ensure minimal downtime. What should the company do to achieve this?',
    options: [
      { id: 'a', text: 'Configure RDS snapshots for real-time copying.' },
      { id: 'b', text: 'Use AWS DataSync to copy data changes.' },
      { id: 'c', text: 'Use Aurora Global Database for replication.' },
      { id: 'd', text: 'Use AWS Database Migration Service (AWS DMS) with continuous replication.' },
    ],
    correctId: 'd',
    explanation: 'AWS Database Migration Service (DMS) with continuous replication (Change Data Capture — CDC) is the standard tool for live database migrations with minimal downtime. DMS: (1) performs a full load of the source database to the target; (2) then switches to CDC mode to continuously replicate ongoing changes; (3) source and target stay synchronized during the cutover window. This allows migrating from MySQL to Aurora PostgreSQL (heterogeneous migration) with minimal downtime. Option A (RDS snapshots) are point-in-time backups — not real-time continuous sync. Option B (DataSync) is for file and object storage migration (S3, EFS, FSx), not relational database replication. Option C (Aurora Global Database) is for Aurora-to-Aurora multi-region replication — it cannot replicate from RDS MySQL to Aurora PostgreSQL.',
    reference: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Task.CDC.html',
    keywords: ['AWS DMS', 'continuous replication', 'CDC change data capture', 'minimal downtime', 'heterogeneous migration', 'MySQL to Aurora PostgreSQL', 'database migration'],
  },
  {
    id: 'wzs7-010', domain: 'd4', domainLabel: 'Design Cost-Optimized Architectures', difficulty: 'Easy',
    scenario: 'A company intends to utilize an Amazon Aurora table for data storage but is focused on cost efficiency. The table will generally be inactive during the majority of mornings, while evenings can see unpredictable spikes in read-and-write traffic. What recommendation should a solutions architect provide to address these concerns?',
    options: [
      { id: 'a', text: 'Deploy a fixed-size Aurora cluster.' },
      { id: 'b', text: 'Schedule AWS Lambda for manual scaling adjustments.' },
      { id: 'c', text: 'Implement Multi-AZ for high availability.' },
      { id: 'd', text: 'Use Amazon Aurora Serverless.' },
    ],
    correctId: 'd',
    explanation: 'Amazon Aurora Serverless v2 is designed exactly for this use case: it automatically scales capacity up and down based on actual workload demand, and can pause and resume (Serverless v1) or scale to minimum capacity (v2) during inactive periods. During the inactive mornings, Aurora Serverless scales down to near-zero (or pauses), reducing costs dramatically. During evening spikes, it scales up seamlessly. Option A (fixed-size cluster) over-provisions resources during inactive periods — expensive. Option B (scheduled Lambda for scaling) requires manual time-based scheduling that cannot handle unpredictable traffic patterns. Option C (Multi-AZ) adds HA but does nothing for cost efficiency or automatic scaling.',
    reference: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html',
    keywords: ['Aurora Serverless', 'auto-scaling', 'cost efficiency', 'inactive periods', 'unpredictable traffic', 'pause resume', 'scale to zero'],
  },
]

const rows = questions.map((q, i) => {
  const options = escape(JSON.stringify(q.options))
  const expl = escape(JSON.stringify({ correct: q.explanation, incorrects: {} }))
  const keywords = escape(JSON.stringify(q.keywords))
  const reference = q.reference ? `'${escape(q.reference)}'` : 'NULL'
  const pageNumber = i + 1
  const screenshotUrl = `'/questions/wzs7/${escape(q.id)}.png'`
  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source, page_number, screenshot_url) VALUES ('${escape(q.id)}', '${q.domain}', '${escape(q.domainLabel)}', '${q.difficulty}', '${escape(q.scenario)}', '${options}', '${escape(q.correctId)}', '${expl}', ${reference}, '${keywords}', 'core', ${pageNumber}, ${screenshotUrl});`
})

writeFileSync('scripts/wzs7.sql', rows.join('\n'))
console.log(`Generated ${rows.length} INSERT statements → scripts/wzs7.sql`)
