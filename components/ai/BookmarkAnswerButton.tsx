'use client'

import { useAnswerBookmarksCtx } from '@/components/AnswerBookmarksContext'

interface BookmarkAnswerButtonProps {
  question: string
  answer: string
  awsDocsUrl?: string
  awsDocsTitle?: string
}

export default function BookmarkAnswerButton({
  question,
  answer,
  awsDocsUrl,
  awsDocsTitle,
}: BookmarkAnswerButtonProps) {
  const { toggle, isBookmarked } = useAnswerBookmarksCtx()
  const saved = isBookmarked(question, answer)

  return (
    <button
      type="button"
      onClick={() => toggle({ question, answer, awsDocsUrl, awsDocsTitle })}
      title={saved ? 'Remove bookmark' : 'Bookmark this answer'}
      aria-label={saved ? 'Remove bookmark' : 'Bookmark this answer'}
      aria-pressed={saved}
      className={`flex items-center gap-1 font-space-mono text-[0.55rem] transition-colors duration-150 ${
        saved ? 'text-amber-400' : 'text-aws-muted/40 hover:text-amber-400/70'
      }`}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  )
}
