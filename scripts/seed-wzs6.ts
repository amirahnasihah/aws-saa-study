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
    id: 'wzs6-001', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A company uses Amazon SQS as its enterprise message queuing platform. Hundreds of consumer applications poll the queues very frequently (every few seconds) to process messages as soon as they are written, resulting in high SQS API call costs. The management requires reducing these costs without significantly increasing the time taken to process the messages. As a Solutions Architect, how would you reduce the number of SQS API calls and lower the cost in this scenario? (Select TWO)',
    options: [
      { id: 'a', text: 'Increase the delay between ReceiveMessage calls to 60 seconds to reduce the number of API calls made.' },
      { id: 'b', text: 'Use Amazon SQS Long Polling by setting the ReceiveMessageWaitTimeSeconds to a value greater than zero (up to 20 seconds).' },
      { id: 'c', text: 'Use Amazon SQS Short Polling to ensure the fastest possible message retrieval.' },
      { id: 'd', text: 'Configure the client applications to perform batch operations for receiving and deleting messages.' },
      { id: 'e', text: 'Transition the queue to a FIFO queue to prevent empty responses.' },
    ],
    correctId: 'b,d',
    explanation: 'Two ways to reduce SQS API call costs: (B) Long Polling — setting ReceiveMessageWaitTimeSeconds > 0 (up to 20 seconds) makes the ReceiveMessage API call wait until a message is available or the wait time expires. This eliminates empty responses and drastically reduces API call count compared to short polling every few seconds. (D) Batch operations — ReceiveMessage can retrieve up to 10 messages per call, and DeleteMessageBatch can delete up to 10 messages per call. Batching reduces the number of API calls proportionally to batch size. Option A (60 second delay) would significantly increase processing time — violating the requirement. Option C (short polling) is what causes the high API call costs — it returns immediately even if no messages. Option E (FIFO queue) provides ordering/deduplication but does not reduce API call costs.',
    reference: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html',
    keywords: ['SQS Long Polling', 'ReceiveMessageWaitTimeSeconds', 'batch operations', 'reduce API calls', 'SQS costs', 'short polling', 'empty responses'],
  },
  {
    id: 'wzs6-002', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'An application running on multiple Amazon EC2 instances retrieves messages from an Amazon SQS queue, processes them, writes the results to an Amazon DynamoDB table, and then deletes the messages. However, duplicate records are consistently appearing in the DynamoDB table, which is occurring because a message is retrieved by a second consumer before the first one completes and deletes it. What is the best action a Solutions Architect should take to prevent this issue?',
    options: [
      { id: 'a', text: 'Create a new queue using the CreateQueue API to ensure clean processing of messages.' },
      { id: 'b', text: 'Adjust the ReceiveMessage call to set an appropriate wait time (long polling) for message retrieval.' },
      { id: 'c', text: 'Use the AddPermission API to restrict access to a single consumer.' },
      { id: 'd', text: 'Increase the Visibility Timeout for the SQS queue using the SetQueueAttributes API or extend it per message using the ChangeMessageVisibility API.' },
    ],
    correctId: 'd',
    explanation: 'The problem is the Visibility Timeout — the period during which SQS hides a message from other consumers after it\'s retrieved. If processing takes longer than the timeout, the message becomes visible again and is picked up by another consumer, causing duplicate processing. Fix: Increase the Visibility Timeout to exceed the maximum expected processing time. If processing time is unpredictable, use ChangeMessageVisibility to extend the timeout per message mid-processing. Option A (new queue) doesn\'t solve duplicate processing. Option B (long polling) reduces empty responses but doesn\'t prevent duplicates. Option C (restrict to single consumer) would eliminate horizontal scaling benefits and is operationally impractical.',
    reference: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html',
    keywords: ['SQS Visibility Timeout', 'duplicate messages', 'ChangeMessageVisibility', 'SetQueueAttributes', 'message processing time', 'concurrent consumers'],
  },
  {
    id: 'wzs6-003', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A company\'s data ingestion workflow uses an Amazon SNS topic to notify a subscribed AWS Lambda function about new data deliveries. The workflow occasionally fails due to transient network connectivity problems between SNS and Lambda, requiring manual intervention to re-run the Lambda function to ingest the data. What action should a Solutions Architect take to ensure all data is reliably ingested in the future, even with transient failures, and without manual intervention?',
    options: [
      { id: 'a', text: 'Increase the memory and timeout settings for the Lambda function.' },
      { id: 'b', text: 'Use AWS Step Functions for orchestration.' },
      { id: 'c', text: 'Establish Amazon CloudWatch alarms for monitoring and triggering a re-run.' },
      { id: 'd', text: 'Implement an Amazon SQS queue between the Amazon SNS topic and the AWS Lambda function.' },
    ],
    correctId: 'd',
    explanation: 'Adding an SQS queue between SNS and Lambda creates a durable buffer (fan-out pattern: SNS → SQS → Lambda). When Lambda is temporarily unavailable due to transient network issues, messages wait safely in SQS rather than being lost. SQS automatically retries Lambda invocations — if Lambda fails, SQS makes the message visible again for retry (based on visibility timeout and redrive policy). This eliminates the need for manual intervention. Option A (memory/timeout) doesn\'t solve network connectivity failures between SNS and Lambda. Option B (Step Functions) adds orchestration complexity but doesn\'t inherently solve message delivery reliability. Option C (CloudWatch alarms) provides alerting for re-triggering, but still requires some form of intervention.',
    reference: 'https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html',
    keywords: ['SNS SQS Lambda fan-out', 'SQS buffer', 'reliable ingestion', 'transient failure', 'dead letter queue', 'retry mechanism', 'decoupled architecture'],
  },
  {
    id: 'wzs6-004', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A media company is transitioning its data management application to AWS. The company wants to adopt a highly distributed, event-driven architecture that primarily uses serverless components and minimizes operational overhead while executing its different workflow steps. Which solution will best meet these requirements?',
    options: [
      { id: 'a', text: 'Use Amazon EC2 instances to host the application, and deploy custom scripts to manage the event-driven components.' },
      { id: 'b', text: 'Implement Amazon Simple Queue Service (SQS) with AWS Lambda for the event-driven workflow, and use Amazon SNS to notify other components.' },
      { id: 'c', text: 'Set up AWS Elastic Beanstalk for managing the application and use Amazon Relational Database Service (RDS) to store data.' },
      { id: 'd', text: 'Deploy an AWS Step Functions workflow with AWS Lambda functions for orchestration, and use Amazon S3 to store data.' },
    ],
    correctId: 'd',
    explanation: 'AWS Step Functions + Lambda + S3 is the ideal fully serverless, event-driven, low-operational-overhead architecture for multi-step workflows. Step Functions provides visual workflow orchestration with built-in error handling, retries, branching, and parallel execution for workflow steps — exactly matching "executing its different workflow steps." Lambda provides serverless compute. S3 provides serverless storage. No servers to manage, no infrastructure to provision. Options A and C use EC2/Elastic Beanstalk which require managing server infrastructure — violating the serverless/low-overhead requirement. Option B (SQS + Lambda + SNS) is serverless but lacks Step Functions\' native workflow orchestration capabilities — better for simple message processing than multi-step workflows.',
    reference: 'https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html',
    keywords: ['Step Functions', 'Lambda orchestration', 'serverless workflow', 'event-driven', 'minimal operational overhead', 'workflow steps', 'distributed architecture'],
  },
  {
    id: 'wzs6-005', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A solutions architect is tasked with designing the cloud infrastructure for an e-commerce application hosted on AWS. The application needs to execute processes in parallel, dynamically scaling the number of application nodes based on the volume of jobs to be processed. Since the processing application is stateless, it is crucial to ensure that the architecture is loosely coupled and that job items are stored durably. What design should the solutions architect implement?',
    options: [
      { id: 'a', text: 'Use Amazon EC2 instances with Elastic Load Balancing and Amazon RDS for state management.' },
      { id: 'b', text: 'Deploy Amazon ECS with AWS Fargate and Amazon DynamoDB for job item storage.' },
      { id: 'c', text: 'Utilize AWS Batch to manage job queues and store job data in Amazon ElastiCache.' },
      { id: 'd', text: 'Implement AWS Lambda functions triggered by SQS, storing job items in Amazon S3.' },
    ],
    correctId: 'd',
    explanation: 'Lambda + SQS + S3 satisfies all requirements: Stateless parallel processing — Lambda scales automatically and each invocation is stateless. Loosely coupled — SQS decouples the job producers from processors; Lambda polls SQS independently. Durable job item storage — SQS provides durable queuing (messages persist until deleted); S3 provides durable object storage for results. Dynamic scaling — Lambda scales automatically based on SQS queue depth. Option A (EC2 + RDS) is not serverless and not dynamically scaling. Option B (ECS Fargate + DynamoDB) is also valid but more complex — Fargate requires cluster management. Option C (AWS Batch + ElastiCache) — ElastiCache is NOT durable (in-memory cache), violating the durability requirement.',
    reference: 'https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html',
    keywords: ['Lambda SQS trigger', 'parallel processing', 'stateless', 'loosely coupled', 'durable storage', 'S3', 'auto scaling', 'job processing'],
  },
  {
    id: 'wzs6-006', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A company generates real-time event data from its internal systems and needs a solution on AWS to process this data while ensuring the order of events is strictly maintained for all consumers. The company wants to minimize both operational overhead and the associated costs. Which solution should a solutions architect recommend to meet these requirements?',
    options: [
      { id: 'a', text: 'Use Amazon Kinesis Data Streams with AWS Lambda.' },
      { id: 'b', text: 'Use AWS EventBridge with AWS Lambda.' },
      { id: 'c', text: 'Use AWS IoT Core with AWS Lambda.' },
      { id: 'd', text: 'Use Amazon SQS FIFO queues with AWS Lambda.' },
    ],
    correctId: 'd',
    explanation: 'SQS FIFO (First-In-First-Out) queues guarantee strict message ordering and exactly-once processing for all consumers. Messages within the same MessageGroupId are processed strictly in the order they are sent. Lambda natively integrates with SQS FIFO as an event source. This is the lowest-overhead, cost-effective solution for strict ordering requirements. Option A (Kinesis Data Streams) maintains order per shard, but multiple consumers reading from the same shard see messages in order — however managing shards adds operational overhead. Option B (EventBridge) does NOT guarantee strict ordering across all consumers. Option C (IoT Core) is designed for IoT device connectivity, not general event ordering use cases.',
    reference: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html',
    keywords: ['SQS FIFO', 'strict ordering', 'exactly-once processing', 'MessageGroupId', 'Lambda SQS FIFO', 'event ordering', 'real-time events'],
  },
  {
    id: 'wzs6-007', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Hard',
    scenario: 'A company has an image-processing web application. When a new image is uploaded to an Amazon S3 bucket, S3 triggers an event notification to an Amazon Simple Queue Service (SQS) standard queue. An AWS Lambda function is configured to poll this queue, process the image, and email the results. Users report receiving multiple emails per image, indicating the Lambda function is triggered more than once due to the inherent at-least-once delivery of the SQS standard queue. What action should the solutions architect take to prevent duplicate Lambda invocations with minimal operational overhead?',
    options: [
      { id: 'a', text: 'Switch the SQS standard queue to an SQS FIFO queue.' },
      { id: 'b', text: 'Configure a delay on the Lambda function to reduce duplicate invocations.' },
      { id: 'c', text: 'Enable Lambda function idempotency by using a deduplication mechanism within the function code.' },
      { id: 'd', text: 'Adjust the SQS queue\'s default visibility timeout to zero seconds.' },
    ],
    correctId: 'a',
    explanation: 'SQS FIFO queues provide exactly-once message processing with built-in deduplication. Content-based deduplication (or MessageDeduplicationId) ensures that duplicate messages are discarded within a 5-minute deduplication interval. Switching from SQS Standard (at-least-once delivery) to SQS FIFO (exactly-once delivery) directly solves the duplicate Lambda invocation problem with minimal operational overhead — just change the queue type. Option B (Lambda delay) does not eliminate duplicates — it just delays them. Option C (idempotency in code) can work but requires writing and maintaining deduplication logic (higher overhead). Option D (visibility timeout=0) would make messages immediately visible to other consumers, making duplicates WORSE not better.',
    reference: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html',
    keywords: ['SQS FIFO', 'exactly-once processing', 'deduplication', 'at-least-once delivery', 'duplicate Lambda invocations', 'content-based deduplication', 'standard to FIFO'],
  },
]

const rows = questions.map((q, i) => {
  const options = escape(JSON.stringify(q.options))
  const expl = escape(JSON.stringify({ correct: q.explanation, incorrects: {} }))
  const keywords = escape(JSON.stringify(q.keywords))
  const reference = q.reference ? `'${escape(q.reference)}'` : 'NULL'
  const pageNumber = i + 1
  const screenshotUrl = `'/questions/wzs6/${escape(q.id)}.png'`
  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source, page_number, screenshot_url) VALUES ('${escape(q.id)}', '${q.domain}', '${escape(q.domainLabel)}', '${q.difficulty}', '${escape(q.scenario)}', '${options}', '${escape(q.correctId)}', '${expl}', ${reference}, '${keywords}', 'whizlab', ${pageNumber}, ${screenshotUrl});`
})

writeFileSync('scripts/wzs6.sql', rows.join('\n'))
console.log(`Generated ${rows.length} INSERT statements → scripts/wzs6.sql`)
