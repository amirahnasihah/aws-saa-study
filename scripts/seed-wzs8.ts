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
    id: 'wzs8-001', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Easy',
    scenario: 'A customer service team at a large e-commerce company wants to automate analyzing customer support tickets to identify common issues, sentiments, and potential solutions. Which AWS service can be used to automatically extract insights from customer support tickets, such as sentiment analysis, topic modeling, and entity recognition?',
    options: [
      { id: 'a', text: 'Amazon Lex.' },
      { id: 'b', text: 'Amazon Textract.' },
      { id: 'c', text: 'Amazon SageMaker.' },
      { id: 'd', text: 'Amazon Comprehend.' },
    ],
    correctId: 'd',
    explanation: 'Amazon Comprehend is AWS\'s fully managed Natural Language Processing (NLP) service. It automatically extracts insights from text including: sentiment analysis (positive/negative/neutral/mixed), entity recognition (people, places, organizations, dates), key phrase extraction, topic modeling (topic grouping across document collections), and language detection. It requires no ML expertise. Option A (Amazon Lex) is a conversational AI service for building chatbots — not for document analysis. Option B (Amazon Textract) extracts text and structured data from scanned documents (OCR-based) — not NLP analysis. Option C (Amazon SageMaker) is a full ML platform for building/training/deploying custom models — overkill when Comprehend provides this capability out of the box.',
    reference: 'https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html',
    keywords: ['Amazon Comprehend', 'NLP', 'sentiment analysis', 'entity recognition', 'topic modeling', 'key phrase extraction', 'text analysis', 'managed NLP'],
  },
  {
    id: 'wzs8-002', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Easy',
    scenario: 'A retail company wants to build a chatbot that can handle customer inquiries about its products. The chatbot should be able to: understand natural language, engage in text-based conversations, and respond appropriately based on the user\'s input. The company prefers a managed AWS service that makes it easy to develop, deploy, and scale this conversational interface. Which AWS service best meets these requirements?',
    options: [
      { id: 'a', text: 'Amazon Rekognition.' },
      { id: 'b', text: 'Amazon Comprehend.' },
      { id: 'c', text: 'Amazon Polly.' },
      { id: 'd', text: 'Amazon Lex.' },
    ],
    correctId: 'd',
    explanation: 'Amazon Lex is the fully managed conversational AI service for building chatbots and voice/text interfaces. It provides: Natural Language Understanding (NLU) to understand user intent, Automatic Speech Recognition (ASR) for voice, multi-turn conversation management, and integrations with Lambda for business logic. Amazon Lex powers Amazon Alexa — designed precisely for conversational interfaces. Option A (Rekognition) is for image and video analysis (facial recognition, object detection) — not chatbots. Option B (Comprehend) is for text analysis/NLP insights — not conversational state management. Option C (Polly) is text-to-speech synthesis — converts text to audio, not a conversational AI.',
    reference: 'https://docs.aws.amazon.com/lex/latest/dg/what-is.html',
    keywords: ['Amazon Lex', 'chatbot', 'conversational AI', 'NLU', 'natural language understanding', 'intent recognition', 'managed chatbot', 'text conversation'],
  },
  {
    id: 'wzs8-003', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Easy',
    scenario: 'A company wants to automate its document processing workflow. They have a large volume of scanned documents, including invoices, contracts, and reports. The company aims to extract key information from these documents, including dates, amounts, and specific clauses. Which of the following AWS services can be used to automate the extraction of key information from scanned documents?',
    options: [
      { id: 'a', text: 'Amazon Polly.' },
      { id: 'b', text: 'Amazon Rekognition.' },
      { id: 'c', text: 'Amazon SageMaker.' },
      { id: 'd', text: 'Amazon Textract.' },
    ],
    correctId: 'd',
    explanation: 'Amazon Textract is the AWS service specifically designed to automatically extract text, handwriting, and structured data from scanned documents and images. Beyond basic OCR, Textract can identify and extract data from forms (key-value pairs), tables, and specific document structures — making it ideal for extracting dates, amounts, and clauses from invoices, contracts, and reports. Option A (Polly) is text-to-speech — converts text to audio, not document processing. Option B (Rekognition) analyzes images and videos for objects, faces, and labels — not for structured data extraction from documents. Option C (SageMaker) is a full ML platform — you could train a custom document extraction model but Textract provides this capability out-of-the-box.',
    reference: 'https://docs.aws.amazon.com/textract/latest/dg/what-is.html',
    keywords: ['Amazon Textract', 'document extraction', 'OCR', 'scanned documents', 'key-value pairs', 'forms tables', 'invoice processing', 'structured data extraction'],
  },
  {
    id: 'wzs8-004', domain: 'd2', domainLabel: 'Design Resilient Architectures', difficulty: 'Medium',
    scenario: 'A large enterprise with a diverse knowledge base, including internal documents, FAQs, and external resources, wants to improve its search capabilities to provide accurate and relevant information to its employees. Which of the following AWS services can be used to create a search solution that can index and search across various data sources, including unstructured content like PDFs, Word documents, and emails?',
    options: [
      { id: 'a', text: 'Amazon OpenSearch Service.' },
      { id: 'b', text: 'Amazon Comprehend.' },
      { id: 'c', text: 'Amazon Lex.' },
      { id: 'd', text: 'Amazon Kendra.' },
    ],
    correctId: 'd',
    explanation: 'Amazon Kendra is the intelligent enterprise search service powered by machine learning. It is specifically designed for enterprise search across diverse document repositories: it natively connects to data sources (S3, SharePoint, Confluence, Salesforce, databases, etc.), indexes PDFs, Word documents, HTML, emails, and more, and uses ML-based semantic search to understand natural language queries and return highly relevant results. It handles FAQs, documents, and structured data in a unified search index. Option A (OpenSearch Service) is a powerful full-text search engine but requires significant setup and query expertise — it is keyword-based by default. Kendra\'s ML-powered relevance is superior for enterprise "find the answer" search. Option B (Comprehend) is for NLP text analysis, not search indexing. Option C (Lex) is for conversational chatbots, not document search.',
    reference: 'https://docs.aws.amazon.com/kendra/latest/dg/what-is-kendra.html',
    keywords: ['Amazon Kendra', 'enterprise search', 'ML-powered search', 'unstructured documents', 'PDF Word email', 'semantic search', 'knowledge base', 'intelligent search'],
  },
]

const rows = questions.map((q, i) => {
  const options = escape(JSON.stringify(q.options))
  const expl = escape(JSON.stringify({ correct: q.explanation, incorrects: {} }))
  const keywords = escape(JSON.stringify(q.keywords))
  const reference = q.reference ? `'${escape(q.reference)}'` : 'NULL'
  const pageNumber = i + 1
  const screenshotUrl = `'/questions/wzs8/${escape(q.id)}.png'`
  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source, page_number, screenshot_url) VALUES ('${escape(q.id)}', '${q.domain}', '${escape(q.domainLabel)}', '${q.difficulty}', '${escape(q.scenario)}', '${options}', '${escape(q.correctId)}', '${expl}', ${reference}, '${keywords}', 'core', ${pageNumber}, ${screenshotUrl});`
})

writeFileSync('scripts/wzs8.sql', rows.join('\n'))
console.log(`Generated ${rows.length} INSERT statements → scripts/wzs8.sql`)
