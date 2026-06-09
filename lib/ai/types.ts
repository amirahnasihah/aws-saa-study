export type { InternalLink } from '@/lib/ai/internal-links'

export interface HintResponse {
  conceptName: string
  focusArea: string
  studyKeywords: string[]
  whatItsAsking: string[]
  howToTackle: string[]
  notesUrl: string
  deepNotesUrl: string
  deepNotesTitle: string
  deepNotesSection: string
  deepNotesIcon: string
  awsDocsUrl: string
  awsDocsTitle: string
  internalLinks?: import('@/lib/ai/internal-links').InternalLink[]
}

export interface ExplainResponse {
  explanation: string
  notesUrl: string
  awsDocsUrl: string
  awsDocsTitle: string
  conceptName: string
  focusArea: string
  studyKeywords: string[]
  internalLinks?: import('@/lib/ai/internal-links').InternalLink[]
}

export interface ChatResponse {
  reply: string
  awsDocsUrl: string
  awsDocsTitle: string
  youtubeQuery: string
  internalLinks?: import('@/lib/ai/internal-links').InternalLink[]
}

export interface ErrorResponse {
  error: string
}
