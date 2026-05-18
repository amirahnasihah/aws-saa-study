'use client'

import { useBookmarksCtx } from './BookmarksContext'
import { domains, categoryStyles } from '@/data/awsServices'

interface BookmarksPanelProps {
  isOpen: boolean
  onClose: () => void
}

const allServices = domains.flatMap((d) =>
  d.sections.flatMap((s) =>
    s.services.map((svc) => ({ ...svc, category: s.category, sectionId: s.id }))
  )
)

export default function BookmarksPanel({ isOpen, onClose }: BookmarksPanelProps) {
  const { bookmarks, toggle } = useBookmarksCtx()

  if (!isOpen) return null

  const saved = allServices.filter((s) => bookmarks.has(s.shortName))

  const navigate = (sectionId: string) => {
    onClose()
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4 animate-overlay-in">
      {/* backdrop */}
      <div className="absolute inset-0 bg-aws-bg/80 backdrop-blur-md" onClick={onClose} />

      {/* panel */}
      <div className="relative w-full max-w-xl animate-modal-in">
        {/* header */}
        <div className="flex items-center justify-between bg-aws-card border border-aws-border rounded-2xl px-4 py-3 shadow-2xl ring-1 ring-amber-400/10">
          <div className="flex items-center gap-2.5">
            <svg className="text-amber-400 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-aws-text text-sm font-semibold font-syne">Bookmarks</span>
            <span className="font-space-mono text-[0.6rem] text-aws-muted border border-aws-border/60 rounded-full px-2 py-0.5">
              {saved.length} saved
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-aws-muted hover:text-aws-text transition-colors text-xs font-space-mono border border-aws-border/60 rounded px-1.5 py-0.5"
          >
            ESC
          </button>
        </div>

        {/* list */}
        <div className="mt-2 bg-aws-card border border-aws-border rounded-2xl overflow-hidden shadow-2xl max-h-[60vh] overflow-y-auto">
          {saved.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <svg className="mx-auto mb-3 text-aws-border" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-aws-muted text-sm">No bookmarks yet</p>
              <p className="font-space-mono text-[0.62rem] text-aws-muted/60 mt-1">
                Click the bookmark icon on any service card
              </p>
            </div>
          ) : (
            <div>
              {saved.map((svc, i) => {
                const styles = categoryStyles[svc.category]
                return (
                  <div
                    key={svc.shortName}
                    className="flex items-center gap-3 px-4 py-3 border-b border-aws-border/50 last:border-0 hover:bg-white/3 transition-colors animate-result-in"
                    style={{ animationDelay: `${i * 0.03}s`, animationFillMode: 'both' }}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${styles.accent}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-aws-text text-sm font-semibold">{svc.shortName}</span>
                        <span className="text-aws-muted text-[0.7rem] font-space-mono truncate">{svc.fullName}</span>
                      </div>
                      <p className="text-aws-muted/80 text-[0.7rem] leading-snug mt-0.5 line-clamp-1">{svc.gunaUntuk}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigate(svc.sectionId)}
                        className="font-space-mono text-[0.6rem] text-aws-muted hover:text-aws-text border border-aws-border/60 rounded px-2 py-0.5 transition-all hover:border-aws-border"
                      >
                        go →
                      </button>
                      <button
                        onClick={() => toggle(svc.shortName)}
                        aria-label="Remove bookmark"
                        className="text-amber-400/60 hover:text-amber-400 transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* clear all */}
              <div className="px-4 py-2 border-t border-aws-border/50 bg-white/2 flex justify-end">
                <button
                  onClick={() => saved.forEach((s) => toggle(s.shortName))}
                  className="font-space-mono text-[0.55rem] text-aws-muted/60 hover:text-aws-muted transition-colors"
                >
                  clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
