export interface ExplainResponse {
  explanation: string
  notesUrl: string
  awsDocsUrl: string
  awsDocsTitle: string
  youtubeQuery: string
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
