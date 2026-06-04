export interface HintResponse {
  conceptName: string
  focusArea: string
  studyKeywords: string[]
  whatItsAsking: string[]
  howToTackle: string[]
  notesUrl: string
  awsDocsUrl: string
  awsDocsTitle: string
}

export interface ExplainResponse {
  explanation: string
  notesUrl: string
  awsDocsUrl: string
  awsDocsTitle: string
  conceptName: string
  focusArea: string
  studyKeywords: string[]
}

export interface ChatResponse {
  reply: string
  awsDocsUrl: string
  awsDocsTitle: string
  youtubeQuery: string
}

export interface ErrorResponse {
  error: string
}
