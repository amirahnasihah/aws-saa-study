'use client'

import Link from 'next/link'
import { useBookmarksCtx } from './BookmarksContext'
import { useAnswerBookmarksCtx } from './AnswerBookmarksContext'
import BookmarkIcon from '@/components/bookmarks/BookmarkIcon'
import { domains, categoryStyles } from '@/data/awsServices'
import { bookmarksToMarkdown, downloadTextFile, exportFilenames } from '@/lib/export'

interface BookmarksPanelProps {
  isOpen: boolean
  onClose: () => void
}

const allServices = domains.flatMap((d) =>
  d.sections.flatMap((s) =>
    s.services.map((svc) => ({ ...svc, category: s.category, sectionId: s.id }))
  )
)

const savedDate = (ts: number) => new Date(ts).toISOString().slice(0, 10)

export default function BookmarksPanel({ isOpen, onClose }: BookmarksPanelProps) {
  const { bookmarks, toggle } = useBookmarksCtx()
  const { answers, remove: removeAnswer, clear: clearAnswers } = useAnswerBookmarksCtx()

  if (!isOpen) return null

  const saved = allServices.filter((s) => bookmarks.has(s.shortName))
  const total = saved.length + answers.length
  const isEmpty = total === 0

  const navigate = (sectionId: string) => {
    onClose()
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }

  const handleDownload = () =>
    downloadTextFile(exportFilenames.bookmarks(), bookmarksToMarkdown(saved, answers))

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4 animate-overlay-in">
      {/* backdrop */}
      <div className="absolute inset-0 bg-aws-bg/80 backdrop-blur-md" onClick={onClose} />

      {/* panel */}
      <div className="relative w-full max-w-xl animate-modal-in">
        {/* header */}
        <div className="flex items-center justify-between bg-aws-card border border-aws-border rounded-2xl px-4 py-3 shadow-2xl ring-1 ring-amber-400/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <BookmarkIcon size={16} filled className="text-amber-400 shrink-0" />
            <Link
              href="/bookmarks"
              onClick={onClose}
              className="text-aws-text text-sm font-semibold font-syne hover:text-c1 transition-colors truncate"
            >
              Bookmarks
            </Link>
            <span className="font-space-mono text-[0.6rem] text-aws-muted border border-aws-border/60 rounded-full px-2 py-0.5 shrink-0">
              {total} saved
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isEmpty && (
              <Link
                href="/bookmarks"
                onClick={onClose}
                className="font-space-mono text-[0.55rem] text-aws-muted hover:text-aws-text transition-colors hidden sm:inline"
              >
                view all →
              </Link>
            )}
            {!isEmpty && (
              <button
                type="button"
                onClick={handleDownload}
                title="Download bookmarks as Markdown"
                aria-label="Download bookmarks as Markdown"
                className="flex items-center gap-1 text-aws-muted hover:text-aws-text transition-colors text-[0.6rem] font-space-mono border border-aws-border/60 rounded px-2 py-0.5 hover:border-aws-border"
              >
                <svg width="11" height="11" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6.5 1.5v7M3.5 6l3 3 3-3M2 11.5h9" />
                </svg>
                .md
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-aws-muted hover:text-aws-text transition-colors text-xs font-space-mono border border-aws-border/60 rounded px-1.5 py-0.5"
            >
              ESC
            </button>
          </div>
        </div>

        {/* list */}
        <div className="mt-2 bg-aws-card border border-aws-border rounded-2xl overflow-hidden shadow-2xl max-h-[60vh] overflow-y-auto">
          {isEmpty ? (
            <div className="px-5 py-10 text-center">
              <svg className="mx-auto mb-3 text-aws-border" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-aws-muted text-sm">No bookmarks yet</p>
              <p className="font-space-mono text-[0.62rem] text-aws-muted/60 mt-1">
                Bookmark a service card, or save an AI answer
              </p>
            </div>
          ) : (
            <div>
              {/* Services */}
              {saved.length > 0 && (
                <>
                  <div className="px-4 py-1.5 bg-white/2 border-b border-aws-border/50">
                    <span className="font-space-mono text-[0.55rem] uppercase tracking-wider text-aws-muted/60">
                      Services ({saved.length})
                    </span>
                  </div>
                  {saved.map((svc, i) => {
                    const styles = categoryStyles[svc.category]
                    return (
                      <div
                        key={svc.shortName}
                        className="flex items-center gap-3 px-4 py-3 border-b border-aws-border/50 hover:bg-white/3 transition-colors animate-result-in"
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
                </>
              )}

              {/* AI Answers */}
              {answers.length > 0 && (
                <>
                  <div className="px-4 py-1.5 bg-white/2 border-b border-aws-border/50">
                    <span className="font-space-mono text-[0.55rem] uppercase tracking-wider text-aws-muted/60">
                      AI Answers ({answers.length})
                    </span>
                  </div>
                  {answers.map((a, i) => (
                    <Link
                      key={a.id}
                      href={`/bookmarks?id=${encodeURIComponent(a.id)}`}
                      onClick={onClose}
                      className="flex items-start gap-3 px-4 py-3 border-b border-aws-border/50 hover:bg-white/3 transition-colors animate-result-in group"
                      style={{ animationDelay: `${i * 0.03}s`, animationFillMode: 'both' }}
                    >
                      <div className="flex-1 min-w-0">
                        {a.question && (
                          <p className="text-aws-text text-[0.74rem] font-semibold line-clamp-1 group-hover:text-c1 transition-colors">
                            {a.question}
                          </p>
                        )}
                        <p className="text-aws-muted/80 text-[0.7rem] leading-snug mt-0.5 line-clamp-2">{a.answer}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {a.awsDocsUrl && (
                            <span className="font-space-mono text-[0.55rem] text-c1/70 truncate">
                              {a.awsDocsTitle || 'AWS Docs'}
                            </span>
                          )}
                          <span className="font-space-mono text-[0.52rem] text-aws-muted/40">{savedDate(a.savedAt)}</span>
                          <span className="font-space-mono text-[0.5rem] text-aws-muted/40 group-hover:text-c1/60 transition-colors">
                            view →
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          removeAnswer(a.id)
                        }}
                        aria-label="Remove saved answer"
                        className="text-amber-400/60 hover:text-amber-400 transition-colors shrink-0 mt-0.5"
                      >
                        <BookmarkIcon size={13} filled />
                      </button>
                    </Link>
                  ))}
                </>
              )}

              {/* clear all */}
              <div className="px-4 py-2 border-t border-aws-border/50 bg-white/2 flex justify-end">
                <button
                  onClick={() => {
                    saved.forEach((s) => toggle(s.shortName))
                    clearAnswers()
                  }}
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
