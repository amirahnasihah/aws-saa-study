'use client'

import { mergeHighlightTerms } from '@/lib/ai/highlight-keywords'

interface KeywordHighlightedTextProps {
  text: string
  studyKeywords: string[]
  bankKeywords?: string[]
  className?: string
}

export default function KeywordHighlightedText({
  text,
  studyKeywords,
  bankKeywords = [],
  className = '',
}: KeywordHighlightedTextProps) {
  const parts = mergeHighlightTerms(text, studyKeywords, bankKeywords)

  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark
            key={i}
            className="rounded px-0.5 bg-amber-400/25 text-amber-100 border-b border-amber-400/40 font-medium not-italic"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  )
}
