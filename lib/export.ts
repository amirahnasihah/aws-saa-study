import type { PersistedChatMessage } from '@/hooks/useAIChatHistory'
import type { AnswerBookmark } from '@/hooks/useAnswerBookmarks'

/** YYYY-MM-DD for filenames. */
function dateStamp(ts: number = Date.now()): string {
  return new Date(ts).toISOString().slice(0, 10)
}

/** Human-readable timestamp, e.g. "2026-06-14 20:45". */
function readableStamp(ts: number = Date.now()): string {
  return new Date(ts).toISOString().slice(0, 16).replace('T', ' ')
}

function sourceLine(url?: string, title?: string): string {
  if (!url) return ''
  return `\n\n**Source:** [${title || url}](${url})`
}

/** Triggers a client-side download of `content` as a file. */
export function downloadTextFile(filename: string, content: string, mime = 'text/markdown'): void {
  if (typeof window === 'undefined') return
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Render an AI chat transcript as Markdown. */
export function chatToMarkdown(messages: PersistedChatMessage[]): string {
  const header = `# AWS SAA Study — AI Chat\n\n_Exported ${readableStamp()}_\n`

  const body = messages
    .map((m) => {
      const speaker = m.role === 'user' ? '## 🙋 You' : '## 🤖 AI'
      const source = m.role === 'assistant' ? sourceLine(m.awsDocsUrl, m.awsDocsTitle) : ''
      return `${speaker}\n\n${m.content}${source}`
    })
    .join('\n\n---\n\n')

  return `${header}\n${body}\n`
}

/** Render saved AI answers as Markdown. */
export function answerBookmarksToMarkdown(answers: AnswerBookmark[]): string {
  return answers
    .map((a) => {
      const q = a.question ? `### Q: ${a.question}\n\n` : '### Saved answer\n\n'
      return `${q}${a.answer}${sourceLine(a.awsDocsUrl, a.awsDocsTitle)}\n\n_Saved ${readableStamp(a.savedAt)}_`
    })
    .join('\n\n---\n\n')
}

export interface ExportableService {
  shortName: string
  fullName: string
  gunaUntuk: string
}

/** Render bookmarked services + saved AI answers into one Markdown document. */
export function bookmarksToMarkdown(
  services: ExportableService[],
  answers: AnswerBookmark[]
): string {
  const header = `# AWS SAA Study — Bookmarks\n\n_Exported ${readableStamp()}_\n`

  const serviceSection =
    services.length === 0
      ? ''
      : `\n## Services (${services.length})\n\n` +
        services
          .map((s) => `- **${s.shortName}** — ${s.fullName}\n  ${s.gunaUntuk}`)
          .join('\n')

  const answerSection =
    answers.length === 0
      ? ''
      : `\n\n## AI Answers (${answers.length})\n\n${answerBookmarksToMarkdown(answers)}`

  return `${header}${serviceSection}${answerSection}\n`
}

export const exportFilenames = {
  chat: () => `aws-chat-${dateStamp()}.md`,
  bookmarks: () => `aws-bookmarks-${dateStamp()}.md`,
}
