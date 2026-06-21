'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import SearchModal from './SearchModal'
import BookmarksPanel from './BookmarksPanel'
import { useBookmarksCtx } from './BookmarksContext'
import { useAnswerBookmarksCtx } from './AnswerBookmarksContext'
import { useAIProvider } from '@/hooks/useAIProvider'
import AIChatView from '@/components/ai/AIChatView'

interface FloatingBarProps {
  /** Ask AI is gated to signed-in users off the dedicated /ai page. */
  showAskAI: boolean
}

function SparkleIcon() {
  return (
    <span className="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center">
      <span className="animate-sparkle-main text-[1rem] leading-none text-c1">✦</span>
      <span className="animate-sparkle-a absolute right-0 top-0 text-[0.32rem] leading-none text-c1">✦</span>
      <span className="animate-sparkle-b absolute bottom-0 left-0 text-[0.28rem] leading-none text-c1">✧</span>
    </span>
  )
}

/**
 * Single floating command bar that replaces the two corner FABs. One connected
 * pill, centered at the bottom, with three segments (Ask AI · Search ·
 * Bookmarks) divided by hairlines. `overflow-hidden` clips each segment's hover
 * tint to the pill's rounded shape.
 */
export default function FloatingBar({ showAskAI }: FloatingBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [bookmarksOpen, setBookmarksOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)

  const { count: serviceCount } = useBookmarksCtx()
  const { count: answerCount } = useAnswerBookmarksCtx()
  const count = serviceCount + answerCount

  const { provider, key } = useAIProvider()
  const pathname = usePathname()
  // Lift above the Practice action bar, which lives at the bottom on that route.
  const bottom = pathname === '/practice' ? 'bottom-24' : 'bottom-5 md:bottom-6'

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') setAiOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const segment =
    'flex items-center gap-2 px-4 py-3 transition-colors duration-150 hover:bg-white/[0.06]'
  const divider = <span aria-hidden className="h-5 w-px shrink-0 bg-aws-border/60" />

  return (
    <>
      <div className={`fixed ${bottom} left-1/2 z-[55] -translate-x-1/2`}>
        <div className="flex items-center overflow-hidden rounded-full border border-aws-border/80 bg-aws-card/95 font-space-mono text-[0.65rem] text-aws-text shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md">
          {showAskAI && (
            <>
              <button
                type="button"
                onClick={() => setAiOpen((o) => !o)}
                aria-label={aiOpen ? 'Close AI chat' : 'Open AI chat'}
                aria-expanded={aiOpen}
                className={`${segment} ${aiOpen ? 'bg-c1/10' : ''}`}
              >
                <SparkleIcon />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
              {divider}
            </>
          )}

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search services and keywords"
            className={segment}
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
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-aws-border/60 px-1.5 py-0.5 text-[0.6rem] text-aws-muted xl:inline">
              ⌘K
            </kbd>
          </button>

          {divider}

          <button
            type="button"
            onClick={() => setBookmarksOpen(true)}
            aria-label={`View bookmarks${count > 0 ? ` (${count} saved)` : ''}`}
            className={segment}
          >
            <svg
              className={count > 0 ? 'shrink-0 text-amber-400' : 'shrink-0 text-aws-muted'}
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
            {count > 0 && <span className="leading-none text-amber-400">{count}</span>}
          </button>
        </div>
      </div>

      {/* AI chat panel — centered to match the bar, full-height sheet on mobile */}
      {aiOpen && (
        <>
          <div
            className="fixed inset-0 z-[59] bg-black/40 sm:hidden"
            onClick={() => setAiOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-label="AI chat"
            className="fixed inset-x-3 bottom-3 top-20 z-[60] flex flex-col rounded-2xl border border-aws-border bg-aws-bg/98 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-md sm:inset-auto sm:bottom-24 sm:left-1/2 sm:h-[600px] sm:max-h-[78vh] sm:w-[400px] sm:-translate-x-1/2"
          >
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-aws-border/40 px-4 py-3">
              <span className="flex items-center gap-2">
                <SparkleIcon />
                <span className="font-space-mono text-[0.72rem] font-bold text-aws-text">Ask AI</span>
              </span>
              <button
                type="button"
                onClick={() => setAiOpen(false)}
                aria-label="Close AI chat"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-aws-muted/60 transition-colors hover:bg-white/6 hover:text-aws-text"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M3 3l8 8M11 3l-8 8" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 px-4 pb-4 pt-2">
              <AIChatView provider={provider} byokKey={key} />
            </div>
          </div>
        </>
      )}

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BookmarksPanel isOpen={bookmarksOpen} onClose={() => setBookmarksOpen(false)} />
    </>
  )
}
