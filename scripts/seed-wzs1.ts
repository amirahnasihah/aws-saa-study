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
    id: 'wzs1-001', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Hard',
    scenario: 'A company has deployed a custom VPC with CIDR 10.10.0.0/16. The setup includes one public subnet (10.10.1.0/24) and two private subnets: Private Subnet A (10.10.2.0/24) and Private Subnet B (10.10.3.0/24). An EC2 instance in Private Subnet A needs to connect to a MySQL-based RDS database hosted in Private Subnet B. The networking team has observed connection failures between the EC2 instance and the RDS database. Which of the following could be causing this issue? (Select TWO)',
    options: [
      { id: 'a', text: 'The route table associated with one of the private subnets has an incorrect local route restricting access within the same subnet range only.' },
      { id: 'b', text: 'The RDS security group inbound rule is misconfigured to allow traffic only from 10.10.1.0/24 instead of 10.10.2.0/24.' },
      { id: 'c', text: 'The network ACL associated with 10.10.3.0/24 is blocking inbound traffic on port 3306 from 10.10.2.0/24.' },
      { id: 'd', text: 'The security group associated with the RDS instance does not have an outbound rule to allow traffic to 10.10.2.0/24 on port 3306.' },
    ],
    correctId: 'b,c',
    explanation: 'Two valid causes: (B) The RDS security group inbound rule allows traffic only from 10.10.1.0/24 (public subnet) instead of 10.10.2.0/24 (EC2\'s subnet) — MySQL connections on port 3306 would be rejected. (C) NACLs are stateless and subnet-level; if the NACL on the RDS subnet (10.10.3.0/24) blocks inbound port 3306 from 10.10.2.0/24, the connection fails. Option D is wrong: security groups are stateful — return traffic is automatically allowed without an explicit outbound rule. Option A is wrong: VPC local routes (covering the entire VPC CIDR 10.10.0.0/16) cannot be removed or overridden, so intra-VPC routing always works.',
    reference: 'https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html',
    keywords: ['security group', 'NACL', 'stateful', 'stateless', 'RDS MySQL 3306', 'inbound rule', 'subnet CIDR', 'private subnet'],
  },
  {
    id: 'wzs1-002', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A company has set up a new Amazon VPC with a CIDR block of 10.0.0.0/16, including both public and private subnets. An Internet Gateway (IGW) has been attached to the VPC, and a custom route table for the public subnet includes a route with Destination 0.0.0.0/0 pointing to the IGW. A Linux-based EC2 instance has been launched in the public subnet with the "Auto-assign public IP" option enabled. However, when attempting to connect via SSH (port 22) from an administrator\'s local machine, the connection fails. Which of the following is the most likely reason the SSH connection is unsuccessful?',
    options: [
      { id: 'a', text: 'The instance does not have an Elastic IP address assigned.' },
      { id: 'b', text: 'The network ACL associated with the public subnet is blocking inbound SSH traffic.' },
      { id: 'c', text: 'The instance was not assigned a public IP address.' },
      { id: 'd', text: 'The instance\'s security group is blocking outbound traffic on port 80.' },
    ],
    correctId: 'b',
    explanation: '"Auto-assign public IP" is enabled, so the instance automatically receives a public IPv4 address — options A and C are wrong. The route table and IGW are configured correctly. The most likely remaining cause is the Network ACL: unlike the default NACL (which allows all traffic), a custom NACL might lack an explicit allow rule for inbound TCP port 22. Since NACLs are stateless, both inbound (port 22) and outbound (ephemeral ports) rules must explicitly allow SSH traffic. Option D is irrelevant — SSH uses inbound port 22, and blocking outbound port 80 does not affect SSH.',
    reference: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html',
    keywords: ['SSH port 22', 'NACL', 'custom NACL', 'auto-assign public IP', 'stateless', 'inbound SSH', 'network ACL'],
  },
  {
    id: 'wzs1-003', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Hard',
    scenario: 'A company has an Amazon VPC configured with a gateway VPC endpoint for Amazon S3. The endpoint is currently used to access specific S3 buckets from EC2 instances within the VPC. The operations team recently created a new S3 bucket and intends to access it via the existing VPC endpoint. However, when trying to connect to the new bucket from an EC2 instance, all requests are failing with an "Access Denied" error. As a Solutions Architect, what are the most likely reasons for this issue? (Select TWO)',
    options: [
      { id: 'a', text: 'The VPC endpoint policy restricts access to specific buckets and does not allow access to the newly created S3 bucket.' },
      { id: 'b', text: 'The IAM role or user used by the EC2 instance lacks permissions to access the new S3 bucket.' },
      { id: 'c', text: 'AWS enforces a default DENY policy that overrides any explicit ALLOW permissions applied to the IAM user or role.' },
      { id: 'd', text: 'The route table for the subnet does not have an entry pointing to the new S3 bucket\'s hostname and the VPC endpoint as the target.' },
    ],
    correctId: 'a,b',
    explanation: 'Two valid causes of "Access Denied" via a Gateway VPC endpoint: (A) VPC endpoint policies can restrict access to specific S3 bucket ARNs. If the existing policy only grants access to certain buckets and the new bucket is not listed, requests to it are denied. (B) IAM permissions are evaluated independently — the EC2 instance role may not have s3:GetObject or s3:ListBucket on the new bucket. Option C is incorrect: AWS does use implicit deny by default, but an explicit Allow in an IAM policy IS honored. Option D is incorrect: S3 Gateway endpoint route table entries cover all S3 in the region via a prefix list — there is no per-bucket routing.',
    reference: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html',
    keywords: ['VPC endpoint policy', 'S3 Gateway endpoint', 'Access Denied', 'IAM permissions', 'bucket policy', 'prefix list', 'explicit allow'],
  },
  {
    id: 'wzs1-004', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A company is opening a new corporate office and wants to establish a reliable, high-performance network connection to its AWS environment. The company hosts applications across multiple AWS VPCs in different AWS Regions. The new connection must support high bandwidth, allow communication with VPCs in multiple Regions, and reduce overall operational overhead. Which solution best meets these requirements?',
    options: [
      { id: 'a', text: 'For each AWS Region, create an AWS Direct Connect connection and set up a public virtual interface (VIF) to connect the VPC\'s virtual private gateway with the customer router.' },
      { id: 'b', text: 'Use AWS Direct Connect Gateway to connect the on-premises network to multiple VPCs across different AWS Regions.' },
      { id: 'c', text: 'Set up two AWS Direct Connect connections with private VIFs for redundancy and failover.' },
      { id: 'd', text: 'Establish a dedicated Direct Connect connection and configure a VPN over it to enable secure IPsec tunnels between the on-premises environment and AWS.' },
    ],
    correctId: 'b',
    explanation: 'AWS Direct Connect Gateway allows a single Direct Connect connection (or LAG) to be associated with multiple VPCs across multiple AWS Regions using Transit VIFs or private VIFs. This eliminates the need for per-region Direct Connect circuits, significantly reducing cost and operational overhead while enabling the required high-bandwidth, multi-VPC, multi-region connectivity. Option A requires a separate circuit per region — expensive and high overhead. Option C provides only redundancy for a single connection, not multi-region reach. Option D (VPN over Direct Connect) is for encryption, not multi-region routing.',
    reference: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways-intro.html',
    keywords: ['Direct Connect Gateway', 'multi-VPC', 'multi-region', 'high bandwidth', 'reduced overhead', 'private VIF', 'transit VIF'],
  },
  {
    id: 'wzs1-005', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'A company is deploying a fleet of Amazon EC2 Linux instances to process heavy workloads and write results to an Amazon Redshift cluster. For security and compliance, developers and administrators must access the EC2 instances only from within the organization\'s internal network. What is the most secure and appropriate solution to meet this requirement?',
    options: [
      { id: 'a', text: 'Launch EC2 instances in a public subnet with SSH key access; place the Redshift cluster in a private subnet.' },
      { id: 'b', text: 'Launch a bastion host in a public subnet for SSH access; place EC2 instances and Redshift in private subnets.' },
      { id: 'c', text: 'Establish an AWS Site-to-Site VPN from the corporate network to AWS; deploy a bastion host in a VPN-enabled subnet with access to EC2 instances and Redshift in private subnets.' },
      { id: 'd', text: 'Use AWS Site-to-Site VPN; deploy EC2 instances in the VPN-enabled subnet and Redshift in a public subnet.' },
    ],
    correctId: 'c',
    explanation: 'The requirement is that access must come ONLY from the organization\'s internal network. An AWS Site-to-Site VPN extends the corporate network into AWS over an encrypted tunnel — only users on the internal corporate network can reach resources via the VPN. Placing a bastion host in the VPN-accessible subnet (reachable only via VPN) and EC2/Redshift in private subnets ensures all access originates from the internal network. Option B uses a public bastion — anyone on the internet could attempt SSH. Option A puts EC2 in a public subnet, exposing it directly. Option D puts Redshift in a public subnet, which is insecure.',
    reference: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html',
    keywords: ['Site-to-Site VPN', 'bastion host', 'private subnet', 'internal network only', 'corporate VPN', 'Redshift private', 'secure access'],
  },
  {
    id: 'wzs1-006', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'Your company owns several EC2 Windows servers in production. In order to be compliant with recent company security policies, you need to create an EC2 Windows bastion host for users to connect to via the Remote Desktop Protocol (RDP). How would you ensure that users can perform remote administration on the Windows servers ONLY through the new bastion host?',
    options: [
      { id: 'a', text: 'Configure the security groups of the production Windows instances to allow inbound RDP traffic only from the bastion host\'s security group.' },
      { id: 'b', text: 'Modify the bastion host\'s security group to allow RDP access only from the corporate IP address range.' },
      { id: 'c', text: 'Update the Network ACL associated with the Windows instance subnets to deny all TCP traffic on ports 22 and 443.' },
      { id: 'd', text: 'Allow TCP port 3389 (RDP) in both inbound and outbound rules of the bastion host\'s Network ACL.' },
    ],
    correctId: 'a',
    explanation: 'To enforce that production Windows servers are only reachable via the bastion host, configure the production instances\' security groups to allow inbound RDP (TCP 3389) only from the bastion host\'s security group ID. This means only the bastion can initiate RDP connections to production — direct RDP from any other source is blocked. Option B controls who can reach the bastion, but does not prevent direct RDP to production instances. Option C denies ports 22 and 443 (not 3389/RDP) — irrelevant. Option D adds NACL rules for the bastion, not for the production instances.',
    reference: 'https://docs.aws.amazon.com/vpc/latest/userguide/security-groups.html',
    keywords: ['bastion host', 'RDP 3389', 'security group reference', 'Windows', 'remote administration', 'source security group', 'production access control'],
  },
  {
    id: 'wzs1-007', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Hard',
    scenario: 'You have a VPC in the us-east-1 Region with a Gateway VPC endpoint for Amazon S3. The endpoint has been associated with the main route table, which is attached to a public subnet. An EC2 instance is launched in this subnet. When the instance tries to access an S3 bucket in the same region, the request fails with a "timeout" error. Which combination of the following is the most likely reason for this failure? (Select TWO)',
    options: [
      { id: 'a', text: 'The EC2 instance\'s security group does not allow outbound traffic to the S3 service via its prefix list.' },
      { id: 'b', text: 'The main route table does not have an Internet Gateway (IGW) route for 0.0.0.0/0.' },
      { id: 'c', text: 'The subnet\'s network ACL does not allow inbound traffic for return responses from the S3 service.' },
      { id: 'd', text: 'The route table does not have a NAT gateway association for internet access.' },
      { id: 'e', text: 'The EC2 instance is missing an IAM role that allows S3 access.' },
    ],
    correctId: 'a,c',
    explanation: 'AWS documentation explicitly states two requirements for S3 Gateway endpoint access: (A) Security group rules for the EC2 instance must allow outbound traffic to Amazon S3 — you can reference the S3 managed prefix list in the outbound rule. If this is missing, requests never leave the instance (timeout). (C) Network ACLs are stateless — the NACL must explicitly allow inbound traffic for return responses from S3 (on ephemeral ports) back to the instance. If missing, responses are dropped (timeout). Options B and D are irrelevant — a Gateway endpoint routes S3 traffic directly without needing an IGW or NAT. Option E would cause "Access Denied", not a timeout.',
    reference: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html',
    keywords: ['S3 Gateway endpoint', 'timeout', 'security group outbound', 'prefix list', 'NACL stateless', 'return traffic', 'ephemeral ports'],
  },
  {
    id: 'wzs1-008', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Easy',
    scenario: 'Your company is focused on building cost-efficient network architectures on AWS. As part of this goal, you\'ve created three VPCs: VPC A, VPC B, and VPC C. VPC A is peered with VPC B, VPC B is peered with VPC C, and a NAT Gateway has been created in a public subnet of VPC B. You want the resources in VPC A and VPC C to use the NAT Gateway in VPC B to access the internet. However, only the instances in VPC B can reach the internet. What is the most likely reason for this behavior?',
    options: [
      { id: 'a', text: 'Route tables in VPC A and VPC C are not updated to route traffic to the NAT Gateway in VPC B.' },
      { id: 'b', text: 'NAT Gateways cannot be used across VPC peering connections.' },
      { id: 'c', text: 'VPC A is not directly peered with VPC C.' },
      { id: 'd', text: 'The NAT Gateway in VPC B is not deployed in a public subnet.' },
    ],
    correctId: 'b',
    explanation: 'AWS VPC peering explicitly does not support "edge to edge" routing. The AWS documentation states: "If VPC A has a NAT device that provides internet access to subnets in VPC A, resources in VPC B cannot use the NAT device in VPC A to access the internet." This is a fundamental VPC peering limitation — gateways (IGW, NAT Gateway, VPN, Direct Connect, Gateway endpoints) are not accessible across peering connections. Each VPC that requires internet access must have its own NAT Gateway. Option A is a plausible distractor, but even with correct routes, AWS will not permit this traffic pattern.',
    reference: 'https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html',
    keywords: ['NAT Gateway', 'VPC peering', 'edge to edge routing', 'non-transitive', 'peering limitation', 'internet access', 'shared NAT'],
  },
  {
    id: 'wzs1-009', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Easy',
    scenario: 'Your organization has an existing Amazon VPC configured with a CIDR block of 10.10.0.0/24, which provides 256 IP addresses. The network has 8 subnets already created using /27 subnet ranges, fully consuming all available IP addresses. You are now tasked with deploying a new application that requires a fleet of 20 EC2 instances inside the VPC. These instances must be able to communicate with each other, and no internet access is required. However, you discover that there are no remaining IP addresses available for launching new resources. What is the most appropriate and scalable solution to resolve the IP address shortage?',
    options: [
      { id: 'a', text: 'Create a new VPC, deploy the EC2 instances there, and establish VPC peering with the existing VPC.' },
      { id: 'b', text: 'Add a secondary CIDR block to the existing VPC to provide additional IP address space.' },
      { id: 'c', text: 'Modify the existing subnets to use smaller /28 ranges to free up unused IP addresses.' },
      { id: 'd', text: 'Launch EC2 instances in existing subnets and configure NACLs and security groups to enable internal communication.' },
    ],
    correctId: 'b',
    explanation: 'Adding a secondary CIDR block to the existing VPC is the least disruptive, most scalable solution. You can associate up to 5 IPv4 CIDR blocks with a VPC. A secondary CIDR (e.g., 10.10.1.0/24 or 10.1.0.0/16) provides additional IP space; you then create new subnets from it. All existing resources, peering connections, endpoints, and security groups are unaffected. Option A (new VPC + peering) adds operational complexity and peering overhead. Option C is impossible — you cannot resize existing subnets that contain resources. Option D is impossible — no IPs are available to launch instances.',
    reference: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html',
    keywords: ['secondary CIDR block', 'VPC IP exhaustion', 'add CIDR', 'expand VPC', 'non-disruptive', 'subnet creation', '/27'],
  },
  {
    id: 'wzs1-010', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'You are configuring network communication between two Amazon VPCs within the same AWS Region. VPC A has a CIDR block of 10.10.0.0/16 and a subnet with range 10.10.1.0/24. VPC B has a CIDR block of 10.0.0.0/16 and a subnet with range 10.0.1.0/28. You have successfully established a VPC peering connection between these VPCs. However, for security and segmentation reasons, your team wants to allow communication only between the two specific subnets (10.10.1.0/24 in VPC A and 10.0.1.0/28 in VPC B), not the entire VPC ranges. Which route table configuration should you apply?',
    options: [
      { id: 'a', text: 'Configure VPC B\'s route table with a route to 10.10.0.0/16 via the peering connection.' },
      { id: 'b', text: 'Configure VPC A\'s route table with a route to 10.0.0.0/16 via the peering connection.' },
      { id: 'c', text: 'Configure VPC B\'s route table with a route to 10.10.1.0/24, and VPC A\'s route table with a route to 10.0.1.0/28, both via the peering connection.' },
      { id: 'd', text: 'Configure VPC A\'s route table with a route to 10.10.1.0/24, and VPC B\'s route table with a route to 10.0.1.0/28, both via the peering connection.' },
    ],
    correctId: 'c',
    explanation: 'For subnet-level granularity over a VPC peering connection, each VPC\'s route table must point to the OTHER VPC\'s specific subnet via the peering connection: VPC B\'s route table needs destination 10.10.1.0/24 → peering (so traffic from VPC B can reach VPC A\'s subnet). VPC A\'s route table needs destination 10.0.1.0/28 → peering (so traffic from VPC A can reach VPC B\'s subnet). Using the specific subnet CIDRs (not full VPC CIDRs) ensures only those subnets can communicate — traffic to other subnets in the peer VPC has no route. Option D is wrong: VPC A\'s route table would reference 10.10.1.0/24 (its own subnet — no route needed) and VPC B would reference 10.0.1.0/28 (its own subnet — also no route needed).',
    reference: 'https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-routing.html',
    keywords: ['VPC peering', 'route table', 'subnet-level routing', 'specific CIDR', 'peering connection', 'segmentation', 'bidirectional routes'],
  },
]

const rows = questions.map((q, i) => {
  const options = escape(JSON.stringify(q.options))
  const expl = escape(JSON.stringify({ correct: q.explanation, incorrects: {} }))
  const keywords = escape(JSON.stringify(q.keywords))
  const reference = q.reference ? `'${escape(q.reference)}'` : 'NULL'
  const pageNumber = i + 1
  const screenshotUrl = `'/questions/wzs1/${escape(q.id)}.png'`
  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source, page_number, screenshot_url) VALUES ('${escape(q.id)}', '${q.domain}', '${escape(q.domainLabel)}', '${q.difficulty}', '${escape(q.scenario)}', '${options}', '${escape(q.correctId)}', '${expl}', ${reference}, '${keywords}', 'whizlab', ${pageNumber}, ${screenshotUrl});`
})

writeFileSync('scripts/wzs1.sql', rows.join('\n'))
console.log(`Generated ${rows.length} INSERT statements → scripts/wzs1.sql`)
