'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAIProvider } from '@/hooks/useAIProvider'
import AIChatView from '@/components/ai/AIChatView'

const fabShellClass =
  'rounded-full border border-aws-border/80 bg-aws-card/95 font-space-mono text-[0.65rem] text-aws-text shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-150'

function SparkleIcon() {
  return (
    <span className="relative inline-flex items-center justify-center shrink-0 w-[18px] h-[18px]">
      <span className="animate-sparkle-main text-[1rem] leading-none text-c1">✦</span>
      <span className="absolute top-0 right-0 animate-sparkle-a text-[0.32rem] leading-none text-c1">✦</span>
      <span className="absolute bottom-0 left-0 animate-sparkle-b text-[0.28rem] leading-none text-c1">✧</span>
    </span>
  )
}

export default function FloatingAIChat() {
  const [open, setOpen] = useState(false)
  const { provider, key } = useAIProvider()
  const pathname = usePathname()
  // Mirror FloatingSearch: lift above the Practice action bar.
  const fabBottomClass = pathname === '/practice' ? 'bottom-24' : 'bottom-5 md:bottom-6'

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <>
      {/* FAB — bottom-left so it never overlaps the search/bookmarks cluster */}
      <div className={`fixed ${fabBottomClass} left-4 md:left-6 z-[55]`}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close AI chat' : 'Open AI chat'}
          aria-expanded={open}
          className={`${fabShellClass} flex items-center gap-2 p-3 lg:px-4 lg:py-3 hover:border-c1/40 hover:bg-aws-card hover:shadow-[0_8px_40px_rgba(0,0,0,0.55)] hover:ring-1 hover:ring-c1/20`}
        >
          <SparkleIcon />
          <span className="hidden lg:inline">Ask AI</span>
        </button>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[59] bg-black/40 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="AI chat"
          className="fixed z-[60] flex flex-col bg-aws-bg/98 backdrop-blur-md border border-aws-border rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.55)]
            inset-x-3 bottom-3 top-20
            sm:inset-auto sm:left-6 sm:bottom-24 sm:w-[400px] sm:h-[600px] sm:max-h-[78vh]"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-aws-border/40 shrink-0">
            <span className="flex items-center gap-2">
              <SparkleIcon />
              <span className="font-space-mono text-[0.72rem] font-bold text-aws-text">Ask AI</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close AI chat"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-aws-muted/60 hover:text-aws-text hover:bg-white/6 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M3 3l8 8M11 3l-8 8" />
              </svg>
            </button>
          </div>

          <div className="flex-1 min-h-0 px-4 pb-4 pt-2">
            <AIChatView provider={provider} byokKey={key} />
          </div>
        </div>
      )}
    </>
  )
}
