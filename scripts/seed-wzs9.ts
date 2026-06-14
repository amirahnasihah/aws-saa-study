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
    id: 'wzs9-001', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A financial institution is planning to migrate its Apache Kafka-based data processing system to AWS, considering Amazon Managed Streaming for Apache Kafka (Amazon MSK). Which of the following statements accurately describes a key feature or capability of Amazon MSK that would be relevant to their migration?',
    options: [
      { id: 'a', text: 'Amazon MSK supports multi-cloud deployment, enabling Kafka clusters across AWS regions and other cloud providers.' },
      { id: 'b', text: 'Amazon MSK provides direct SSH access to the underlying Kafka infrastructure for custom configuration changes.' },
      { id: 'c', text: 'Amazon MSK integrates seamlessly with AWS Lambda for serverless processing without requiring a separate event source mapping.' },
      { id: 'd', text: 'Amazon MSK offers automatic scaling of Kafka brokers and storage, allowing the cluster to dynamically adjust its capacity based on traffic and workload demands.' },
    ],
    correctId: 'd',
    explanation: 'Amazon MSK (Managed Streaming for Apache Kafka) offers MSK Auto Scaling (via MSK Managed Scaling) that automatically expands Kafka broker storage based on a specified storage utilization threshold, and MSK Serverless automatically provisions and scales compute and storage without managing broker capacity. This allows the cluster to dynamically adjust to traffic demands. Option A is wrong: MSK is AWS-only — it does NOT support multi-cloud deployment across other cloud providers. Option B is wrong: MSK is a managed service — AWS manages the underlying Kafka infrastructure and does NOT provide SSH access to brokers. Option C is wrong: Lambda integration with MSK DOES require configuring an Event Source Mapping (ESM) to connect the two services.',
    reference: 'https://docs.aws.amazon.com/msk/latest/developerguide/msk-autoexpand.html',
    keywords: ['Amazon MSK', 'managed Kafka', 'automatic storage scaling', 'MSK Serverless', 'no SSH access', 'event source mapping', 'Kafka migration'],
  },
  {
    id: 'wzs9-002', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Easy',
    scenario: 'A retail e-commerce platform aims to enhance its product search functionality to provide users with more relevant search results and suggestions. They want to implement features such as spell-checking, synonym support, and full-text search capabilities. Which AWS service would you recommend to implement these search enhancements?',
    options: [
      { id: 'a', text: 'Amazon QuickSight.' },
      { id: 'b', text: 'AWS Step Functions.' },
      { id: 'c', text: 'AWS Glue.' },
      { id: 'd', text: 'Amazon OpenSearch Service.' },
    ],
    correctId: 'd',
    explanation: 'Amazon OpenSearch Service (formerly Amazon Elasticsearch Service) is purpose-built for full-text search use cases. It natively supports: full-text search with relevance scoring, spell-checking and fuzzy matching (handles typos), synonym support via synonym token filters, auto-complete/suggestions, and faceted search. It is the go-to AWS service for building product search, log analytics, and e-commerce search experiences. Option A (QuickSight) is a BI/data visualization service — not a search engine. Option B (Step Functions) is a workflow orchestration service. Option C (AWS Glue) is a data integration/ETL service for data catalogs and pipelines.',
    reference: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html',
    keywords: ['Amazon OpenSearch Service', 'full-text search', 'spell-checking', 'synonym support', 'fuzzy matching', 'e-commerce search', 'search engine'],
  },
  {
    id: 'wzs9-003', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A large e-commerce company wants to gain real-time insights into customer feedback data from various sources (surveys, social media, reviews). They aim to process, analyze, and visualize this data to identify trends and understand customer sentiment. Which combination of AWS services would be most suitable for processing, analyzing, and visualizing real-time customer feedback data in this scenario?',
    options: [
      { id: 'a', text: 'Amazon Kinesis and Amazon Redshift.' },
      { id: 'b', text: 'AWS Data Pipeline and Amazon Athena.' },
      { id: 'c', text: 'AWS Glue and Amazon OpenSearch Service.' },
      { id: 'd', text: 'Amazon MSK and Amazon QuickSight.' },
    ],
    correctId: 'a',
    explanation: 'Amazon Kinesis (Data Streams or Firehose) + Amazon Redshift is the canonical AWS combination for real-time data ingestion + analytics + visualization: Kinesis captures and processes real-time streaming data from multiple sources (surveys, social media, review APIs) at scale. Amazon Redshift provides a massively parallel data warehouse for complex analytical queries on the collected feedback data. Amazon QuickSight connects to Redshift for visualization (the two are tightly integrated). Option B (Data Pipeline + Athena) — Data Pipeline is for batch data movement (not real-time); Athena queries S3 data. Option C (Glue + OpenSearch) — Glue is for ETL batch processing; OpenSearch is for search, not analytical dashboards. Option D (MSK + QuickSight) — QuickSight does not directly connect to MSK; MSK lacks the analytical query layer that Redshift provides.',
    reference: 'https://docs.aws.amazon.com/streams/latest/dev/introduction.html',
    keywords: ['Amazon Kinesis', 'Amazon Redshift', 'real-time streaming', 'data analytics', 'customer feedback', 'QuickSight visualization', 'streaming analytics'],
  },
  {
    id: 'wzs9-004', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Easy',
    scenario: 'A large financial services company wants to obtain third-party datasets (market data, economic indicators, regulatory filings) and manage subscriptions, licensing, and secure delivery of those datasets into its own AWS accounts for downstream analytics. Which one AWS service is the most suitable to acquire and manage access to these external data products?',
    options: [
      { id: 'a', text: 'AWS Data Exchange.' },
      { id: 'b', text: 'Amazon Kinesis.' },
      { id: 'c', text: 'AWS Data Pipeline.' },
      { id: 'd', text: 'Amazon EMR.' },
    ],
    correctId: 'a',
    explanation: 'AWS Data Exchange is the purpose-built AWS marketplace service for subscribing to, accessing, and managing third-party data products. Data providers publish data sets (market data, financial data, regulatory filings, etc.), and subscribers can browse, subscribe, and have data delivered directly to their S3 buckets for downstream analytics. It handles licensing, subscription management, and secure data delivery automatically. Option B (Kinesis) is for real-time streaming data ingestion — not for marketplace data subscription management. Option C (Data Pipeline) is for orchestrating ETL data movement between AWS services. Option D (EMR) is a managed Hadoop/Spark cluster for big data processing.',
    reference: 'https://docs.aws.amazon.com/data-exchange/latest/userguide/what-is.html',
    keywords: ['AWS Data Exchange', 'third-party data', 'data marketplace', 'data subscription', 'market data', 'data products', 'secure data delivery'],
  },
  {
    id: 'wzs9-005', domain: 'd3', domainLabel: 'Design High-Performing Architectures', difficulty: 'Medium',
    scenario: 'A financial services company wants to build a real-time data streaming platform to process and analyze market data, customer transactions, and risk assessments. They need a highly scalable and reliable solution that can handle high-throughput data streams and integrate with various downstream systems. Which AWS service is best suited for building a real-time data streaming platform for the financial services company?',
    options: [
      { id: 'a', text: 'Amazon Kinesis Data Streams.' },
      { id: 'b', text: 'AWS Data Pipeline.' },
      { id: 'c', text: 'Amazon Redshift.' },
      { id: 'd', text: 'Amazon Managed Streaming for Apache Kafka (Amazon MSK).' },
    ],
    correctId: 'a',
    explanation: 'Amazon Kinesis Data Streams is AWS\'s purpose-built, fully managed real-time data streaming service. It handles high-throughput data ingestion (practically unlimited with on-demand mode), provides sub-second latency, retains data for up to 365 days, and integrates natively with Lambda, Firehose, Analytics, S3, Redshift, and many downstream systems. For AWS-native real-time streaming with maximum downstream integrations and minimum operational overhead, Kinesis Data Streams is the standard answer. Option B (Data Pipeline) is for scheduled batch data movement, not real-time streaming. Option C (Redshift) is a data warehouse for analytical queries — not a streaming platform. Option D (MSK) is also a valid real-time streaming solution (managed Kafka), but Kinesis Data Streams is the primary AWS-native answer when no Kafka expertise requirement is mentioned.',
    reference: 'https://docs.aws.amazon.com/streams/latest/dev/introduction.html',
    keywords: ['Amazon Kinesis Data Streams', 'real-time streaming', 'high-throughput', 'financial data', 'market data', 'streaming platform', 'downstream integrations'],
  },
]

const rows = questions.map((q, i) => {
  const options = escape(JSON.stringify(q.options))
  const expl = escape(JSON.stringify({ correct: q.explanation, incorrects: {} }))
  const keywords = escape(JSON.stringify(q.keywords))
  const reference = q.reference ? `'${escape(q.reference)}'` : 'NULL'
  const pageNumber = i + 1
  const screenshotUrl = `'/questions/wzs9/${escape(q.id)}.png'`
  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source, page_number, screenshot_url) VALUES ('${escape(q.id)}', '${q.domain}', '${escape(q.domainLabel)}', '${q.difficulty}', '${escape(q.scenario)}', '${options}', '${escape(q.correctId)}', '${expl}', ${reference}, '${keywords}', 'core', ${pageNumber}, ${screenshotUrl});`
})

writeFileSync('scripts/wzs9.sql', rows.join('\n'))
console.log(`Generated ${rows.length} INSERT statements → scripts/wzs9.sql`)
