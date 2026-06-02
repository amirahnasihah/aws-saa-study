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
    id: 'wzs5-001', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Hard',
    scenario: 'A team has configured an AWS Lambda function to be triggered by Amazon S3 notifications when large files (1 GB – 3 GB) are uploaded to an Amazon S3 bucket. The function is intended to read the entire file and calculate its hash checksum. The Lambda function is configured to run inside a private Amazon VPC subnet. The operation consistently fails with a "request timed out" error when attempting to reach Amazon S3. What is the most likely cause of the "request timed out" error in this scenario?',
    options: [
      { id: 'a', text: 'The Lambda function is configured with minimal memory (128 MB).' },
      { id: 'b', text: 'The private Amazon VPC subnet\'s route table lacks a NAT Gateway or an Amazon S3 VPC Endpoint to allow private access to the Amazon S3 service endpoint.' },
      { id: 'c', text: 'The Amazon S3 bucket name has not been set up as an environment variable in the Lambda function.' },
      { id: 'd', text: 'The Lambda function is created in a different AWS Region than the Amazon S3 bucket.' },
    ],
    correctId: 'b',
    explanation: 'When a Lambda function runs inside a private VPC subnet, it loses its default internet connectivity. To reach Amazon S3, it needs either: (B1) A NAT Gateway in the VPC to allow outbound internet traffic so the function can reach the public S3 endpoint, or (B2) An S3 Gateway VPC Endpoint (or Interface Endpoint) that routes S3 traffic privately without going through the internet. Without one of these, S3 API calls fail with a "connection timed out" error — the TCP connection never completes because there\'s no route to S3. Option A (128 MB memory) could cause OOM errors but not timeouts for network connectivity. Option C (missing env variable) would cause an SDK configuration error or wrong bucket name error, not a network timeout. Option D (different region) would work — S3 is accessible cross-region, but you\'d use the correct regional endpoint.',
    reference: 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html',
    keywords: ['Lambda VPC', 'private subnet', 'NAT Gateway', 'S3 VPC endpoint', 'request timed out', 'no internet access', 'private VPC connectivity'],
  },
  {
    id: 'wzs5-002', domain: 'd1', domainLabel: 'Design Secure Architectures', difficulty: 'Medium',
    scenario: 'According to the AWS Shared Responsibility Model for serverless services, which of the following are the customer\'s responsibility when using AWS Lambda? (Select TWO)',
    options: [
      { id: 'a', text: 'Applying security patches to the underlying compute environment and operating system.' },
      { id: 'b', text: 'Monitoring and logging the health of the Lambda execution environment.' },
      { id: 'c', text: 'The Lambda function code, including its application logic and security of third-party dependencies.' },
      { id: 'd', text: 'Installing required third-party libraries in the underlying compute instances for Lambda execution.' },
      { id: 'e', text: 'Providing AWS Lambda with the necessary AWS Identity and Access Management (IAM) execution role and permissions to access other AWS resources.' },
    ],
    correctId: 'c,e',
    explanation: 'AWS Shared Responsibility for Lambda: AWS manages — underlying compute infrastructure, OS patching (A), runtime execution environment health, hardware/software for the execution environment (B is partially AWS). Customer manages — (C) function code AND the security of third-party libraries/dependencies you include in your deployment package (supply chain risk is customer responsibility); (E) the IAM execution role and permissions that define what AWS services Lambda can access — you must create the role and grant appropriate permissions. Option A (OS patching) is AWS responsibility in serverless. Option B (execution environment health) is largely AWS responsibility. Option D (installing libraries in underlying compute) is wrong framing — customers install libraries in the Lambda deployment package, not in underlying compute instances which are AWS-managed.',
    reference: 'https://docs.aws.amazon.com/lambda/latest/dg/lambda-security.html',
    keywords: ['Lambda shared responsibility', 'function code security', 'IAM execution role', 'third-party dependencies', 'customer responsibility', 'AWS responsibility', 'serverless security'],
  },
  {
    id: 'wzs5-003', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'Which of the following is NOT a practical or recommended use case for using AWS Lambda due to its service limitations?',
    options: [
      { id: 'a', text: 'Periodically check log files for errors in Amazon CloudWatch Logs and send out notifications through Amazon SNS.' },
      { id: 'b', text: 'Schedule a job via Amazon EventBridge to invoke a Lambda function and generate AWS resource usage reports based on specific tags.' },
      { id: 'c', text: 'Implement a highly scalable web backend layer that is fronted by Amazon API Gateway and persists data into Amazon Relational Database Service (Amazon RDS) or Amazon DynamoDB.' },
      { id: 'd', text: 'Download Amazon S3 bucket objects of size varying between 512 MB – 12 GB to the Lambda ephemeral disk (/tmp), read and analyze them for keywords, and add the keywords to the metadata of the file object.' },
    ],
    correctId: 'd',
    explanation: 'Option D exceeds Lambda\'s hard service limits: Lambda\'s /tmp ephemeral storage maximum is 10,240 MB (10 GB) — files up to 12 GB would exceed this limit. Additionally, Lambda\'s maximum execution timeout is 15 minutes — downloading and processing a 12 GB file within 15 minutes may be impossible depending on network speed. This makes D impractical. Options A, B, C are all valid Lambda use cases: (A) scheduled CloudWatch log checking + SNS notifications — fits well within Lambda limits; (B) scheduled EventBridge jobs for reporting — standard Lambda pattern; (C) API Gateway + Lambda + RDS/DynamoDB is a canonical serverless web architecture.',
    reference: 'https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html',
    keywords: ['Lambda limitations', 'ephemeral storage /tmp', '10 GB limit', '15 minute timeout', 'NOT recommended', 'file size limit', 'Lambda quotas'],
  },
  {
    id: 'wzs5-004', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Hard',
    scenario: 'Which of the following are correctly formatted Amazon Resource Names (ARNs) for an AWS Lambda function named helloworld? (Select THREE)',
    options: [
      { id: 'a', text: 'arn:aws:lambda:aws-region:acct-id:function:helloworld:$LATEST' },
      { id: 'b', text: 'arn:aws:lambda:aws-region:acct-id:function:helloworld' },
      { id: 'c', text: 'arn:aws:lambda:aws-region:acct-id:function:helloworld/$LATEST' },
      { id: 'd', text: 'arn:aws:lambda:aws-region:acct-id:function:helloworld:PROD' },
      { id: 'e', text: 'arn:aws:lambda:aws-region:acct-id:function:helloworld:1' },
    ],
    correctId: 'a,b,d',
    explanation: 'Lambda ARN formats use colons (:) as delimiters throughout. Three valid formats: (A) Qualified ARN with $LATEST version qualifier: arn:aws:lambda:region:account:function:name:$LATEST — valid, points to unpublished latest code. (B) Unqualified ARN (no version/alias): arn:aws:lambda:region:account:function:name — valid, always invokes $LATEST. (D) Qualified ARN with alias: arn:aws:lambda:region:account:function:name:PROD — valid, PROD is an alias pointing to a published version. INVALID: (C) uses a forward slash before $LATEST — Lambda ARNs NEVER use slashes in the qualifier portion; the colon separator is mandatory. (E) arn:...helloworld:1 uses version number 1 as a qualifier — while technically valid per AWS ARN spec, the typical exam answer for "correctly formatted ARNs" focuses on $LATEST, unqualified, and aliases (A, B, D).',
    reference: 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html',
    keywords: ['Lambda ARN format', 'qualified ARN', 'unqualified ARN', '$LATEST', 'alias', 'version qualifier', 'ARN format colon'],
  },
]

const rows = questions.map((q, i) => {
  const options = escape(JSON.stringify(q.options))
  const expl = escape(JSON.stringify({ correct: q.explanation, incorrects: {} }))
  const keywords = escape(JSON.stringify(q.keywords))
  const reference = q.reference ? `'${escape(q.reference)}'` : 'NULL'
  const pageNumber = i + 1
  const screenshotUrl = `'/questions/wzs5/${escape(q.id)}.png'`
  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source, page_number, screenshot_url) VALUES ('${escape(q.id)}', '${q.domain}', '${escape(q.domainLabel)}', '${q.difficulty}', '${escape(q.scenario)}', '${options}', '${escape(q.correctId)}', '${expl}', ${reference}, '${keywords}', 'whizlab', ${pageNumber}, ${screenshotUrl});`
})

writeFileSync('scripts/wzs5.sql', rows.join('\n'))
console.log(`Generated ${rows.length} INSERT statements → scripts/wzs5.sql`)
