# AWS SAA-C03 — Study Checklist

**Exam target:** ~2026-06-28 · **Started checklist:** 2026-06-14
**Source:** [Whizlabs Video Course](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/oc) · 199 videos · 22 labs · 14 section quizzes

✅ **Done:** §1 Introduction · §2 Getting Started · §3 Compute · §4 Storage
🎯 **Remaining:** §5–§14 below (+ practice exams at the end)

### How to use this
Tick items in **Course outline** as you complete each lecture, lab, or quiz on Whizlabs. The **Must be able to answer** items (§5–§14) are the real exam test — if you can't answer one out loud without notes, rewatch. Don't move on until that section's quiz is ≥80%.

### Exam domain weights (what to protect if time runs short)
| Domain | Weight | Where it lives below |
|--------|--------|----------------------|
| 1 · Design Secure Architectures | **30%** | §5, IAM/KMS everywhere |
| 2 · Design Resilient Architectures | **26%** | §6 DB, §9 Networking, Multi-AZ |
| 3 · Design High-Performing Architectures | **24%** | §6, §9, §10, caching/scaling |
| 4 · Design Cost-Optimized Architectures | **20%** | §14, purchasing options |

Priority legend: 🔴 master fully · 🟠 important · 🟡 moderate · 🟢 know-what-it-does

---

## 1. Introduction — ✅ done · 2 lectures

### Course outline
- [x] [Welcome to the Course](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24489) (3m 57s)
- [x] [Why Cloud Computing?](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4475) (6m 44s)

---

## 2. Getting Started With AWS — ✅ done · 5 lectures

### Course outline
- [x] [Why AWS?](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4476) (3m 55s)
- [x] [Overview of the Exam](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24501) (9m 56s)
- [x] [Overview of this Course](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24509) (11m 18s)
- [x] [Setting up free-tier AWS account](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24549) (9m 54s)
- [x] [Getting Familiar with AWS Console](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=26889) (9m 25s)

---

## 3. Compute — ✅ done · 28 lectures · 4 labs

### Course outline
- [x] [Amazon EC2 Fundamentals: Instance Types](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=26890) (6m 12s)
- [x] [Amazon EC2 Fundamentals: Purchasing Options, Saving plans and Tenancy](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=26891) (9m 51s)
- [x] [Amazon EC2: Volumes and Encryption](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=25904) (5m 45s)
- [x] [Amazon EC2 - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=31290) (8m 30s)
- [x] 🧪 [Introduction to Amazon Elastic Compute Cloud (EC2)](https://business.whizlabs.com/labs/introduction-to-amazon-elastic-compute-cloud-ec2) (30m)
- [x] [Amazon EC2 instance store](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27974) (2m 33s)
- [x] [Placement Groups](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27976) (8m 29s)
- [x] [Placement Groups - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27975) (7m 57s)
- [x] [Difference between Public, Private and Elastic IP address](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=10776) (9m 58s)
- [x] [AWS ENI, ENA, and EFA](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11642) (9m 39s)
- [x] [AWS Elastic Load Balancer (ELB) - Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28472) (10m 8s)
- [x] [Cross-Zone load balancing](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28473) (3m 3s)
- [x] [ELB - Stickiness](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=10785) (10m 46s)
- [x] [Application Load Balancing](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=12797) (17m 50s)
- [x] [Application Load Balancing - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=13129) (21m 29s)
- [x] 🧪 [Creating an application load balancer from AWS CLI](https://business.whizlabs.com/labs/creating-an-application-load-balancer-from-aws-cli) (1h)
- [x] 🧪 [Creating an Application Load Balancer and Auto Scaling Group in AWS](https://business.whizlabs.com/labs/creating-an-application-load-balancer-and-auto-scaling-group-in-aws) (1h 30m)
- [x] [Network Load Balancing](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=12799) (9m 54s)
- [x] [Network Load Balancing - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=13130) (20m 12s)
- [x] 🧪 [Creating and configuring a network load balancer in AWS](https://business.whizlabs.com/labs/creating-and-configuring-a-network-load-balancer-in-aws) (1h)
- [x] [AWS Gateway Load Balancer](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27616) (9m 16s)
- [x] [AWS Gateway Load Balancer - Monitoring and Pricing](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27617) (3m 6s)
- [x] [Amazon EC2 Auto Scaling Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40366) (6m 26s)
- [x] [Amazon EC2 Auto Scaling - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40367) (6m 37s)
- [x] [ASG - Instance Termination](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4730) (2m 26s)
- [x] [ASG - Cooldown Periods](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=10789) (7m 21s)
- [x] [AWS Lambda](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27425) (10m 35s)
- [x] [AWS Lambda - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27426) (7m 49s)
- [x] [Lambda@Edge](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11537) (7m 16s)
- [x] [AWS Elastic Beanstalk](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=38126) (6m 45s)
- [x] [AWS Elastic Beanstalk - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=30054) (9m 59s)
- [x] [AWS Outposts](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24490) (7m 49s)
- [x] Compute (Quiz) (15Q) — ≥80%

---

## 4. Storage — ✅ done · 34 lectures · 1 labs

### Course outline
- [x] [Amazon Simple Storage Service Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34325) (6m 48s)
- [x] [Amazon Simple Storage Service: Versioning & Features](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34326) (3m 58s)
- [x] [Amazon S3 - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34327) (6m 43s)
- [x] [S3 ACLs and Bucket Policy](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27618) (6m 17s)
- [x] [S3 ACLs and Bucket Policy - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27619) (8m)
- [x] [S3 Object Lifecycle Management](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27621) (5m 28s)
- [x] [S3 Object Lifecycle Management - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27620) (7m 45s)
- [x] 🧪 [Creating S3 Lifecycle Policy](https://business.whizlabs.com/labs/creating-an-s3-lifecycle-policy) (30m)
- [x] [S3 Cross Region Replication](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27622) (6m 35s)
- [x] [S3 Cross Region Replication - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27623) (7m 7s)
- [x] [S3 Storage Classes](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27624) (8m 34s)
- [x] [S3 Storage Classes - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27626) (7m 3s)
- [x] [S3 Storage Classes Comparison and Pricing](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27625) (5m 12s)
- [x] [S3 Glacier Storage Classes](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27777) (9m 49s)
- [x] [S3 Glacier Storage Classes - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27776) (7m 49s)
- [x] [Amazon S3: Encryption](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28474) (5m 23s)
- [x] [Amazon S3: Encryption - How it Works?](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28475) (6m 7s)
- [x] [AWS Storage Gateway](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27978) (7m 58s)
- [x] [AWS Storage Gateway - Pricing](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27979) (4m 17s)
- [x] [AWS Storage Gateway - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27977) (5m 14s)
- [x] [S3 - CORS](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11530) (6m 46s)
- [x] [S3 - Pre-Signed URLs](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11533) (8m 10s)
- [x] [S3 - Pre-Signed URLs - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11534) (13m 7s)
- [x] [Amazon Elastic File System (Amazon EFS) Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=36584) (6m 17s)
- [x] [Amazon EFS Hands On](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=36585) (6m 58s)
- [x] [Amazon Elastic Block Storage: Fundamentals](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27417) (10m 6s)
- [x] [Amazon Elastic Block Storage: Data Protection and Access Control](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27418) (2m 15s)
- [x] [Amazon Elastic Block Storage: Multi-Attach](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27419) (3m 50s)
- [x] [Amazon Elastic Block Storage: Snapshots](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27420) (4m 4s)
- [x] [Amazon Elastic Block Storage: Snapshots - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27421) (6m 56s)
- [x] [Persistence of EBS Volumes](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27422) (6m 34s)
- [x] [Amazon EBS: Creating, Attaching and Detaching Volume](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27423) (9m 11s)
- [x] [Amazon EBS: Resizing Volumes - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=25906) (8m 42s)
- [x] [Amazon Elastic Block Storage: TroubleShooting Common Issues](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27424) (3m 14s)
- [x] [AWS Backup](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=23023) (5m 45s)
- [x] Storage (Quiz) (10Q) — ≥80%

---

## 5. Security, Identity and Compliance — 🔴 Domain 1 (30%) · 23 lectures · 2 labs

### Course outline
_Whizlabs order — labs appear where the platform places them._

- [ ] [AWS IAM: Users, Groups, Policies & MFA](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40380) (6m 54s)
- [ ] [IAM Users and IAM Groups - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28476) (6m 8s)
- [ ] [IAM Policies - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28477) (6m 29s)
- [ ] [IAM Roles - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28478) (4m 44s)
- [ ] [AWS IAM Identity Center](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27805) (7m 15s)
- [ ] [AWS IAM Identity Center - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27806) (9m 57s)
- [ ] [AWS Key Management Service Overiew](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28988) (7m 34s)
- [ ] [AWS Key Management Service: Features](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28989) (8m 31s)
- [ ] [AWS Directory Service](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11544) (11m 23s)
- [ ] [AWS Cognito](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11540) (6m 4s)
- [ ] [AWS Secrets Manager](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11545) (7m 52s)
- [ ] [AWS Secrets Manager - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11546) (12m 47s)
- [ ] [AWS WAF](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=38127) (7m)
- [ ] [AWS Shield](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=38128) (6m 48s)
- [ ] [Amazon GuardDuty](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=38129) (5m 37s)
- [ ] [Amazon GuardDuty - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11636) (6m 51s)
- [ ] 🧪 [Introduction to Amazon GuardDuty](https://business.whizlabs.com/labs/introduction-to-amazon-guardduty) (30m)
- [ ] [Amazon Inspector](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11637) (8m 5s)
- [ ] [Amazon Inspector - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11638) (18m 45s)
- [ ] [Amazon Macie](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11640) (6m 40s)
- [ ] [Amazon Macie Hands on - Create Macie job](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34328) (6m 58s)
- [ ] [Amazon Macie Hands on - Macie job run and Findings](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34329) (2m 45s)
- [ ] 🧪 [Discover sensitive data present in S3 bucket using Amazon Macie](https://business.whizlabs.com/labs/discover-sensitive-data-present-in-s3-bucket-using-amazon-macie) (1h)
- [ ] [AWS Resource Access Manager](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40212) (6m 8s)
- [ ] [AWS Certificate Manager (ACM)](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=23021) (15m 54s)
- [ ] Security, Identity, and Compliance (Quiz) (12Q) — target ≥80%

### Must be able to answer
- [ ] IAM policy evaluation: default deny, **explicit deny always wins** over allow
- [ ] IAM role vs IAM user vs resource-based policy — and cross-account access via roles
- [ ] IAM Identity Center (SSO) + permission sets — when over plain IAM users?
- [ ] KMS: customer-managed vs AWS-managed vs AWS-owned keys; **envelope encryption**; key rotation; multi-region keys
- [ ] KMS vs CloudHSM
- [ ] Directory Service: Managed Microsoft AD vs AD Connector vs Simple AD
- [ ] Cognito **user pool (authN)** vs **identity pool (authZ / temp AWS creds)**
- [ ] Secrets Manager (auto-rotation, RDS integration) vs SSM Parameter Store (free, no rotation)
- [ ] WAF (L7, on ALB/CloudFront/API GW) vs Shield Standard (free L3/4) vs Shield Advanced (paid DDoS)
- [ ] GuardDuty (threat detection from logs) vs Inspector (EC2/ECR/Lambda vuln scan) vs Macie (S3 PII)
- [ ] ACM: free public certs, auto-renew; **must be in us-east-1 for CloudFront**
- [ ] RAM — what can be shared cross-account (VPC subnets, Transit Gateway, etc.)?

---

## 6. Database — 🟠 Domains 2 & 3 · 17 lectures · 2 labs

### Course outline
_Whizlabs order — labs appear where the platform places them._

- [ ] [Amazon RDS Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40368) (8m 36s)
- [ ] [Creating an Amazon RDS Instance](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=12820) (19m 17s)
- [ ] [RDS - Multi-AZ Deployment](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4747) (2m 32s)
- [ ] [RDS - Read Replicas](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4748) (7m 2s)
- [ ] [RDS - Multi-AZ vs Read Replicas](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4749) (1m 33s)
- [ ] 🧪 [Deploying Amazon RDS Multi-AZ and Read Replica, Simulate Failover](https://business.whizlabs.com/labs/deploying-amazon-rds-multi-az-and-read-replica-simulate-failover) (1h 30m)
- [ ] [Amazon RDS Proxy](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=38135) (6m 39s)
- [ ] [RTO and RPO](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4784) (1m)
- [ ] [Amazon DynamoDB Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34330) (6m 55s)
- [ ] [Create DynamoDB Table - Hands On](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34331) (4m 33s)
- [ ] [Amazon DynamoDB Indexes (LSI & GSI)](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40369) (6m 16s)
- [ ] [Amazon DynamoDB Accelerator (DAX)](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40370) (7m 26s)
- [ ] [Amazon Aurora Serverless](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11201) (12m 55s)
- [ ] [Amazon Aurora Serverless V1 vs V2](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=38136) (5m 43s)
- [ ] [Amazon Aurora Global](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11202) (8m 28s)
- [ ] [Elasticache](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=5059) (4m 34s)
- [ ] [ElastiCache - Security](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11203) (8m 23s)
- [ ] [ElastiCache - Session Store](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11204) (7m 7s)
- [ ] 🧪 [Create Redis cluster using ElastiCache](https://business.whizlabs.com/labs/create-redis-cluster-using-elasticache) (1h)
- [ ] Database Services (Quiz) (8Q) — target ≥80%

### Must be able to answer
- [ ] **Multi-AZ (sync, HA, auto-failover, same region) vs Read Replicas (async, read scaling, cross-region)** — and when you'd use both
- [ ] RDS backups: automated vs manual snapshots; what RTO and RPO actually mean
- [ ] RDS Proxy: connection pooling, the Lambda use case, faster failover
- [ ] DynamoDB: partition-key design; on-demand vs provisioned (+ auto scaling); DynamoDB Streams
- [ ] **LSI** (same PK, alt sort, at creation, ≤10GB) vs **GSI** (different PK/sort, anytime, own capacity)
- [ ] DAX — microsecond caching for read-heavy DynamoDB
- [ ] Aurora: 6 copies / 3 AZs, up to 15 replicas; Serverless v1 vs v2; Aurora Global (cross-region <1s, DR)
- [ ] ElastiCache **Redis** (persistence, replication, Multi-AZ) vs **Memcached** (multi-threaded, no persistence)
- [ ] Caching strategies: lazy loading vs write-through; session-store pattern

---

> Exam tests these shallowly: match the service to the use case.

## 7. Machine Learning — 🟢 know-what-it-does · 6 lectures

### Course outline
_Whizlabs order — labs appear where the platform places them._

- [ ] [Amazon Polly](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24491) (5m 23s)
- [ ] [Amazon Polly - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24492) (5m 56s)
- [ ] [Amazon Translate](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24493) (7m 9s)
- [ ] [Amazon Comprehend](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24550) (10m 51s)
- [ ] [Amazon Rekognition](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24839) (11m 51s)
- [ ] [Amazon Lex](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=36586) (9m 44s)
- [ ] Machine Learning (Quiz) (3Q) — target ≥80%

### Must be able to answer
- [ ] Polly = text→speech · Translate = language translation
- [ ] Comprehend = NLP / sentiment / entities (Comprehend Medical)
- [ ] Rekognition = image/video analysis, face detection, moderation
- [ ] Lex = chatbots (ASR + NLU), powers Alexa
- [ ] (Bonus) Transcribe = speech→text · Textract = doc text extraction · SageMaker = build/train/deploy

---

> Long section. Prioritize the conceptual lectures; the demos are skimmable at 1.5×.

## 8. Management and Governance — 🟡 · 17 lectures · 4 labs

### Course outline
_Whizlabs order — labs appear where the platform places them._

- [ ] [AWS Organizations - Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=7554) (6m 56s)
- [ ] [AWS Organizations - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=7555) (7m 16s)
- [ ] [Amazon CloudWatch Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=36587) (6m 23s)
- [ ] [Amazon CloudWatch Hands On](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=36588) (5m 33s)
- [ ] 🧪 [Using CloudWatch for Resource Monitoring, Create CloudWatch Alarms and Dashboards](https://business.whizlabs.com/labs/using-cloudwatch-for-resource-monitoring-create-cloudwatch-alarms-and-dashboards) (1h 30m)
- [ ] [AWS CloudWatch Logs Agent, Unified Agent](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11199) (5m 42s)
- [ ] [AWS Config](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=7822) (6m 46s)
- [ ] 🧪 [Check Compliance status of S3 Bucket using AWS Config](https://business.whizlabs.com/labs/check-compliance-status-of-s3-bucket-using-aws-config) (1h 30m)
- [ ] [Create AWS Config and SNS Topic: Hands - on](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40371) (10m 13s)
- [ ] [AWS Config: Monitor the Compliance Status](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40372) (6m 5s)
- [ ] 🧪 [Auditing Resource Compliance with AWS config](https://business.whizlabs.com/labs/auditing-resource-compliance-with-aws-config) (45m)
- [ ] [AWS CloudTrail Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=36589) (6m 49s)
- [ ] [AWS CloudTrail Hands On](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=36590) (7m 12s)
- [ ] [AWS CloudFormation Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=5060) (7m 26s)
- [ ] [AWS CloudFormation - Creating Stack](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28479) (8m 9s)
- [ ] [AWS CloudFormation - Update and Cleanup](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28480) (8m 3s)
- [ ] 🧪 [Introduction to Amazon CloudFormation](https://business.whizlabs.com/labs/introduction-to-amazon-cloudformation) (30m)
- [ ] [AWS Compute Optimizer](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24527) (11m 32s)
- [ ] [AWS Trusted Advisor](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=5065) (8m 16s)
- [ ] [AWS Health Dashboard](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34332) (9m 48s)
- [ ] [AWS Systems Manager](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=23014) (11m 4s)
- [ ] Management and Governance (Quiz) (5Q) — target ≥80%

### Must be able to answer
- [ ] Organizations: OUs, **SCPs (set boundaries — don't grant)**, consolidated billing
- [ ] CloudWatch: standard (5min) vs detailed (1min) metrics; **EC2 memory/disk need the CloudWatch agent**; alarms, Logs Insights
- [ ] **CloudTrail (API audit) vs CloudWatch (performance) vs Config (config state + compliance)** — the classic triad
- [ ] Config rules + remediation; conformance packs
- [ ] CloudFormation: change sets, drift detection, nested stacks, **StackSets (multi-account/region)**
- [ ] Trusted Advisor 5 categories (cost, security, fault tolerance, performance, service limits)
- [ ] Systems Manager: **Session Manager (no SSH/bastion)**, Parameter Store, Patch Manager, Run Command

---

> Biggest section and very high yield. Do this thoroughly even if it means skimming §7/§10/§13.

## 9. Networking & Content Delivery — 🔴 heavily tested · 27 lectures · 5 labs

### Course outline
_Whizlabs order — labs appear where the platform places them._

- [ ] 🧪 [Build Amazon VPC with Public and Private Subnets from Scratch](https://business.whizlabs.com/labs/build-amazon-vpc-with-public-and-private-subnets-from-scratch) (30m)
- [ ] [AWS VPC Overview: Subnets & CIDR](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40373) (6m 58s)
- [ ] [AWS VPC Overview: Security Groups & Network ACLs](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40374) (5m 9s)
- [ ] [Amazon VPC - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27852) (8m 32s)
- [ ] [Amazon VPC - Route Tables Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27851) (10m 51s)
- [ ] [Amazon VPC - NAT Gateway Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=31291) (4m 31s)
- [ ] [VPC Peering and VPC Endpoints](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4743) (7m 57s)
- [ ] 🧪 [Creating AWS VPC Flow Logs and Generating Traffic](https://business.whizlabs.com/labs/creating-aws-vpc-flow-logs-and-generating-traffic) (1h)
- [ ] [NAT Gateway and NAT Instance](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=10792) (15m 2s)
- [ ] 🧪 [Creating NAT Gateways in AWS](https://business.whizlabs.com/labs/creating-nat-gateways-in-aws) (1h 30m)
- [ ] [AWS VPC - PrivateLink](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=10960) (7m 11s)
- [ ] [AWS VPC - Transit Gateway](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=10962) (4m 49s)
- [ ] [AWS VPN](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11197) (5m 48s)
- [ ] [AWS Direct Connect ](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=38131) (5m 53s)
- [ ] [AWS API Gateway](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=38132) (7m)
- [ ] 🧪 [Peer VPC with Transit Gateway and its components](https://business.whizlabs.com/labs/peer-vpc-with-transit-gateway-and-its-components) (1h 15m)
- [ ] [Amazon CloudFront and Edge locations Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=36591) (4m 9s)
- [ ] [Amazon CloudFront and Edge Locations - Working TTL and Pricing](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=36592) (4m 50s)
- [ ] [Amazon CloudFront - Distribution Creation](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27855) (12m 5s)
- [ ] [Amazon CloudFront - Caching & Geographic Restrictions](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=27856) (12m 44s)
- [ ] 🧪 [Introduction to Amazon CloudFront](https://business.whizlabs.com/labs/introduction-to-amazon-cloudfront) (1h 30m)
- [ ] [CloudFront Origin Access Control - OAC](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=38130) (6m 20s)
- [ ] [S3 Presigned Url vs CloudFront Signed Url](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=41077) (6m 3s)
- [ ] [Amazon Route 53: Registering a Domain](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=29136) (6m 30s)
- [ ] [Amazon Route 53: Create A Record](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=29137) (10m 9s)
- [ ] [Simple Routing Policy - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4763) (3m 41s)
- [ ] [Weighted Routing Policy - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4764) (5m 38s)
- [ ] [Latency Routing Policy - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4765) (7m 8s)
- [ ] [Failover Routing Policy - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4767) (9m 48s)
- [ ] [Multivalue Answer Routing Policy - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4768) (6m 31s)
- [ ] [3rd Party Domain Integration with Route 53 & Cleanup](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=29139) (5m 10s)
- [ ] [AWS Global Accelerator](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=7547) (3m 34s)
- [ ] Networking and Content Delivery (Quiz) (10Q) — target ≥80%

### Must be able to answer
- [ ] VPC CIDR sizing; public vs private subnet (= route to IGW or not); 5 reserved IPs per subnet
- [ ] **Security Groups (stateful, allow-only, instance) vs NACLs (stateless, allow+deny, subnet, ordered)**
- [ ] IGW vs **NAT Gateway** (managed, AZ-resilient, outbound for private) vs NAT Instance
- [ ] **VPC Peering** (non-transitive, no overlapping CIDR) vs **Transit Gateway** (hub, transitive)
- [ ] VPC Endpoints: **Gateway** (S3/DynamoDB, free, route table) vs **Interface/PrivateLink** (ENI, hourly)
- [ ] VPN (internet, encrypted, fast setup) vs Direct Connect (dedicated, consistent, slow provision); DX+VPN for encryption
- [ ] Route 53 policies — pick one per scenario; **alias vs CNAME** (alias for zone apex, free, AWS targets)
- [ ] CloudFront caching/TTL; **OAC** locks the S3 origin; geo restriction; signed URL/cookie
- [ ] **CloudFront signed URL vs S3 presigned URL** — when each
- [ ] **Global Accelerator** (anycast IPs, TCP/UDP, network layer) vs CloudFront (HTTP caching)
- [ ] API Gateway: REST vs HTTP vs WebSocket; throttling, caching, authorizers

---

> Skim EMR/QuickSight/OpenSearch; focus the comparisons below.

## 10. Analytics — 🟢/🟡 · 16 lectures · 2 labs

### Course outline
_Whizlabs order — labs appear where the platform places them._

- [ ] [Amazon Redshift](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=4752) (8m 52s)
- [ ] [Amazon EMR](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34333) (9m 23s)
- [ ] [Amazon EMR - Launch EMR Cluster](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34334) (11m 44s)
- [ ] [Amazon EMR - Submit Work & Validate](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34335) (12m 52s)
- [ ] [AWS Kinesis](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=12794) (9m 31s)
- [ ] 🧪 [Transfer data to S3 using Amazon Kinesis Firehose](https://business.whizlabs.com/labs/transfer-data-to-s3-using-amazon-kinesis-firehose) (1h 30m)
- [ ] [Amazon Kinesis Data streams](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=38133) (6m 57s)
- [ ] [Amazon Data Firehose](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=38134) (6m 15s)
- [ ] [AWS Glue](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11561) (9m 49s)
- [ ] [Perform ETL with AWS Glue - Create Glue Crawler](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34336) (7m 30s)
- [ ] [Run Glue Crawler & Create Glue Job](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34337) (7m 14s)
- [ ] [Validate the Output from Glue Job](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34338) (1m 59s)
- [ ] 🧪 [Perform ETL operation in Glue with S3](https://business.whizlabs.com/labs/perform-etl-operation-in-glue-with-s3) (45m)
- [ ] [Amazon QuickSight](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=28250) (8m 17s)
- [ ] [Amazon Athena](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=30055) (8m)
- [ ] [Amazon Athena - Lab Part I](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=30057) (8m 27s)
- [ ] [Amazon Athena - Lab Part II](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=30056) (5m 42s)
- [ ] [Amazon OpenSearch Service](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=23025) (7m 50s)
- [ ] Analytics (Quiz) (5Q) — target ≥80%

### Must be able to answer
- [ ] **Kinesis Data Streams** (real-time, shards, custom consumers) vs **Firehose** (near-real-time, managed delivery, no code)
- [ ] Redshift — data warehouse / OLAP / columnar; Redshift Spectrum (query S3)
- [ ] Glue — serverless ETL + Data Catalog + Crawlers
- [ ] **Athena** — serverless SQL on S3; cost = data scanned (partition + columnar to cut it)
- [ ] The serverless analytics pattern: **S3 + Glue + Athena + QuickSight**
- [ ] EMR (managed Hadoop/Spark) and OpenSearch (search/log analytics) — what each is for

---

## 11. Application Integration — 🟠 SQS/SNS tested · 10 lectures

### Course outline
_Whizlabs order — labs appear where the platform places them._

- [ ] [AWS Step Functions](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11560) (16m 36s)
- [ ] [Amazon MQ](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11549) (9m 32s)
- [ ] [Amazon SQS](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40375) (6m 53s)
- [ ] [Introduction to Simple Queuing Service (SQS) - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40376) (7m 13s)
- [ ] [Amazon SNS](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40377) (6m 29s)
- [ ] [Creating a SNS Topic and Subscribing through Email - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40378) (5m 36s)
- [ ] [AWS AppSync](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11541) (8m 5s)
- [ ] [EventBridge](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=23010) (12m 25s)
- [ ] [EventBridge - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=23011) (19m 43s)
- [ ] [AWS Amplify - Overview](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=36593) (10m 31s)
- [ ] Application Integration (Quiz) (6Q) — target ≥80%

### Must be able to answer
- [ ] SQS **Standard** (at-least-once, best-effort order) vs **FIFO** (exactly-once, ordered)
- [ ] Visibility timeout, dead-letter queue, long polling — what each solves
- [ ] **SQS vs SNS vs EventBridge** — when to reach for each
- [ ] **Fan-out pattern**: SNS → multiple SQS queues
- [ ] EventBridge: event bus, rules, cron schedules, SaaS/schema integration
- [ ] Step Functions: orchestration; Standard vs Express
- [ ] Amazon MQ — when (lift-and-shift apps using MQTT/AMQP) over SQS/SNS

---

## 12. Containers — 🟡 · 7 lectures · 2 labs

### Course outline
_Whizlabs order — labs appear where the platform places them._

- [ ] [AWS ECS](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11551) (5m 24s)
- [ ] [Amazon ECS - Creating an ECS Cluster](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34339) (8m 25s)
- [ ] [Amazon ECS - Creating Task Definitions](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34340) (9m 21s)
- [ ] [Amazon ECS - Creating Services and Tasks](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34341) (7m 11s)
- [ ] [Amazon ECS - Task Placements](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34342) (8m 25s)
- [ ] [AWS EKS](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11555) (9m 54s)
- [ ] 🧪 [Create a cluster in Amazon EKS and install kubectl](https://business.whizlabs.com/labs/create-a-cluster-in-amazon-eks-and-install-kubectl) (1h)
- [ ] [AWS ECR](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=11558) (11m 5s)
- [ ] 🧪 [Create a Docker container using Dockerfile and store the image in ECR](https://business.whizlabs.com/labs/create-a-docker-container-using-dockerfile-and-store-the-image-in-ecr) (1h)
- [ ] Containers (Quiz) (5Q) — target ≥80%

### Must be able to answer
- [ ] ECS **EC2 launch type (you manage instances) vs Fargate (serverless)**
- [ ] Task definition vs service vs task
- [ ] Task placement strategies: binpack, spread, random
- [ ] ECS task role (per-task IAM)
- [ ] EKS (managed Kubernetes) — when over ECS
- [ ] ECR — container registry; **Fargate as the serverless-container answer**

---

## 13. Migration & Transfer — 🟢 · 5 lectures

### Course outline
_Whizlabs order — labs appear where the platform places them._

- [ ] [AWS Snow Family](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=24840) (5m 10s)
- [ ] [AWS Database Migration Service](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=7826) (17m 6s)
- [ ] [AWS ​​DataSync](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=7558) (5m 47s)
- [ ] [AWS Migration Hub](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=23016) (4m 3s)
- [ ] [AWS Transfer Family](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=23019) (4m 37s)
- [ ] Migration & Transfer (Quiz) (5Q) — target ≥80%

### Must be able to answer
- [ ] Snow Family: Snowcone / Snowball Edge / Snowmobile — pick by data size; when vs network transfer
- [ ] **DMS**: homogeneous vs heterogeneous (+ Schema Conversion Tool); continuous replication
- [ ] **DataSync**: online on-prem (NFS/SMB) → S3/EFS/FSx, scheduled
- [ ] Transfer Family: SFTP/FTPS/FTP into S3/EFS
- [ ] Migration Hub — tracks migrations across tools

---

## 14. AWS Cost Management — 🟠 Domain 4 (20%) · 2 lectures · 1 reading

### Course outline
_Whizlabs order — labs appear where the platform places them._

- [ ] [AWS Cost Explorer](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=34343) (9m 20s)
- [ ] [AWS Cost Explorer - Demo](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=29306) (9m 51s)
- [ ] AWS Cost Management (Quiz) (3Q) — target ≥80%
- [ ] 📄 AWS SAA-C03 Exam-Prep Cheat Sheet

### Must be able to answer
- [ ] Cost Explorer (visualize/forecast) vs AWS Budgets (alert on cost/usage threshold)
- [ ] Cost allocation tags
- [ ] **On-Demand vs Reserved Instances vs Savings Plans vs Spot** — pick per workload
- [ ] Consolidated billing (Organizations): volume discounts, shared RIs
- [ ] Storage cost levers: S3 lifecycle, Intelligent-Tiering (cross-ref Storage)

---

## Final exam-readiness (last 3–4 days — separate from this course)

> This course has **no practice exams**. Use your own ~493-question bank here.

- [ ] Practice Exam #1 (timed, 65Q / 130min) → review every wrong + flagged answer
- [ ] Practice Exam #2 → re-watch weakest-domain lectures
- [ ] Practice Exam #3 → drill recurring miss patterns (RDS vs Aurora · gateway vs interface endpoint · SG vs NACL · S3 storage classes)
- [ ] Practice Exam #4 → **scoring ≥80% on fresh questions = ready**
- [ ] Final review: skim glossary + flagged terms only. Nothing new the night before.
- [ ] 🎯 Exam day — light AM glance at cheat sheet, sleep well, arrive early.
