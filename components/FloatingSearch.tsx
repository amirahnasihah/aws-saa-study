'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import SearchModal from './SearchModal'
import BookmarksPanel from './BookmarksPanel'
import { useBookmarksCtx } from './BookmarksContext'
import { useAnswerBookmarksCtx } from './AnswerBookmarksContext'

const fabShellClass =
  'rounded-full border border-aws-border/80 bg-aws-card/95 font-space-mono text-[0.65rem] text-aws-text shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-150'

export default function FloatingSearch() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [bookmarksOpen, setBookmarksOpen] = useState(false)
  const { count: serviceCount } = useBookmarksCtx()
  const { count: answerCount } = useAnswerBookmarksCtx()
  const count = serviceCount + answerCount
  const pathname = usePathname()
  const fabBottomClass =
    pathname === '/practice' ? 'bottom-24' : 'bottom-5 md:bottom-6'

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <div
        className={`fixed ${fabBottomClass} right-4 md:right-6 z-[55] flex items-center gap-2`}
      >
        <button
          type="button"
          onClick={() => setBookmarksOpen(true)}
          aria-label="View bookmarks"
          className={`${fabShellClass} flex items-center gap-2 p-3 hover:border-amber-400/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.55)] hover:ring-1 hover:ring-amber-400/20`}
        >
          <svg
            className={count > 0 ? 'text-amber-400 shrink-0' : 'text-aws-muted shrink-0'}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={count > 0 ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {count > 0 && (
            <span className="text-amber-400 font-space-mono text-[0.6rem] leading-none">{count}</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search services and keywords"
          className={`${fabShellClass} flex items-center gap-2 p-3 lg:px-4 lg:py-3 hover:border-c1/40 hover:bg-aws-card hover:shadow-[0_8px_40px_rgba(0,0,0,0.55)] hover:ring-1 hover:ring-c1/20`}
        >
          <svg
            className="shrink-0 text-c1"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <circle cx="7.5" cy="7.5" r="5.5" />
            <path d="M16 16l-3.5-3.5" />
          </svg>
          <span className="hidden lg:inline">Search</span>
          <kbd className="hidden xl:inline text-[0.65rem] text-aws-muted border border-aws-border/60 rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </button>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BookmarksPanel isOpen={bookmarksOpen} onClose={() => setBookmarksOpen(false)} />
    </>
  )
}
