'use client'

import { useBookmarksCtx } from './BookmarksContext'

/**
 * Standalone bookmark toggle so server components (LearnCard) can offer the
 * same save affordance as ServiceCard without going client themselves.
 */
export default function BookmarkStar({ shortName }: { shortName: string }) {
  const { isBookmarked, toggle } = useBookmarksCtx()
  const bookmarked = isBookmarked(shortName)

  return (
    <button
      type="button"
      onClick={() => toggle(shortName)}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this service'}
      className={`shrink-0 transition-all duration-150 hover:scale-110 ${bookmarked ? 'text-amber-400' : 'text-aws-border hover:text-aws-muted'}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
}
