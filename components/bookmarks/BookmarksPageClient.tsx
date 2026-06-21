'use client'

import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'
import BookmarkIcon from '@/components/bookmarks/BookmarkIcon'
import { useBookmarksCtx } from '@/components/BookmarksContext'
import { useAnswerBookmarksCtx } from '@/components/AnswerBookmarksContext'
import { domains, categoryStyles } from '@/data/awsServices'
import { bookmarksToMarkdown, downloadTextFile, exportFilenames } from '@/lib/export'

const allServices = domains.flatMap((d) =>
  d.sections.flatMap((s) =>
    s.services.map((svc) => ({ ...svc, category: s.category, sectionId: s.id }))
  )
)

const savedDate = (ts: number) => new Date(ts).toISOString().slice(0, 10)

export default function BookmarksPageClient() {
  const { bookmarks, toggle } = useBookmarksCtx()
  const { answers, remove: removeAnswer, clear: clearAnswers } = useAnswerBookmarksCtx()

  const saved = allServices.filter((s) => bookmarks.has(s.shortName))
  const total = saved.length + answers.length
  const isEmpty = total === 0

  const handleDownload = () =>
    downloadTextFile(exportFilenames.bookmarks(), bookmarksToMarkdown(saved, answers))

  const handleClearAll = () => {
    saved.forEach((s) => toggle(s.shortName))
    clearAnswers()
  }

  return (
    <main className="max-w-[720px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-28">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <BookmarkIcon size={18} filled className="text-amber-400 shrink-0" />
            <h1 className="font-space-mono text-2xl font-bold text-aws-text">Bookmarks</h1>
            {!isEmpty && (
              <span className="font-space-mono text-[0.6rem] text-aws-muted border border-aws-border/60 rounded-full px-2 py-0.5">
                {total} saved
              </span>
            )}
          </div>
          <p className="font-space-mono text-[0.72rem] text-aws-muted leading-relaxed">
            Saved services and AI answers — synced when signed in, kept in this browser when signed out.
          </p>
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={handleDownload}
            title="Download bookmarks as Markdown"
            aria-label="Download bookmarks as Markdown"
            className="shrink-0 flex items-center gap-1 text-aws-muted hover:text-aws-text transition-colors text-[0.62rem] font-space-mono border border-aws-border/60 rounded-lg px-2.5 py-1.5 hover:border-aws-border"
          >
            <svg width="11" height="11" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6.5 1.5v7M3.5 6l3 3 3-3M2 11.5h9" />
            </svg>
            .md
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="bg-aws-card border border-aws-border rounded-xl px-6 py-14 text-center">
          <BookmarkIcon size={28} className="mx-auto mb-3 text-aws-border" />
          <p className="text-aws-muted text-sm mb-1">No bookmarks yet</p>
          <p className="font-space-mono text-[0.62rem] text-aws-muted/60">
            Bookmark a service on the Cheat Sheet, or save an AI answer from Ask AI
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Link
              href="/"
              className="font-space-mono text-[0.65rem] px-3 py-1.5 rounded-lg border border-aws-border/60 text-aws-muted hover:text-aws-text transition-colors"
            >
              Cheat Sheet →
            </Link>
            <Link
              href="/ai"
              className="font-space-mono text-[0.65rem] px-3 py-1.5 rounded-lg border border-c1/30 text-c1 hover:bg-c1/10 transition-colors"
            >
              Ask AI →
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden shadow-lg ring-1 ring-amber-400/5">
          {saved.length > 0 && (
            <section>
              <div className="px-4 py-2 bg-white/2 border-b border-aws-border/50">
                <span className="font-space-mono text-[0.55rem] uppercase tracking-wider text-aws-muted/60">
                  Services ({saved.length})
                </span>
              </div>
              {saved.map((svc) => {
                const styles = categoryStyles[svc.category]
                return (
                  <div
                    key={svc.shortName}
                    className="flex items-center gap-3 px-4 py-3 border-b border-aws-border/50 hover:bg-white/3 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${styles.accent}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-aws-text text-sm font-semibold">{svc.shortName}</span>
                        <span className="text-aws-muted text-[0.7rem] font-space-mono truncate">{svc.fullName}</span>
                      </div>
                      <p className="text-aws-muted/80 text-[0.7rem] leading-snug mt-0.5 line-clamp-2">{svc.gunaUntuk}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/#${svc.sectionId}`}
                        className="font-space-mono text-[0.6rem] text-aws-muted hover:text-aws-text border border-aws-border/60 rounded px-2 py-0.5 transition-all hover:border-aws-border"
                      >
                        go →
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggle(svc.shortName)}
                        aria-label="Remove bookmark"
                        className="text-amber-400/60 hover:text-amber-400 transition-colors"
                      >
                        <BookmarkIcon size={13} filled />
                      </button>
                    </div>
                  </div>
                )
              })}
            </section>
          )}

          {answers.length > 0 && (
            <section>
              <div className="px-4 py-2 bg-white/2 border-b border-aws-border/50">
                <span className="font-space-mono text-[0.55rem] uppercase tracking-wider text-aws-muted/60">
                  AI Answers ({answers.length})
                </span>
              </div>
              {answers.map((a) => (
                <Link
                  key={a.id}
                  href={`/bookmarks/${a.id}`}
                  className="flex items-start gap-3 px-4 py-3 border-b border-aws-border/50 hover:bg-white/3 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    {a.question && (
                      <p className="text-aws-text text-[0.8rem] font-semibold line-clamp-2 group-hover:text-c1 transition-colors">
                        {a.question}
                      </p>
                    )}
                    <p className="text-aws-muted/80 text-[0.72rem] leading-snug mt-0.5 line-clamp-2">{a.answer}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {a.awsDocsUrl && (
                        <span className="font-space-mono text-[0.55rem] text-c1/70 truncate">
                          {a.awsDocsTitle || 'AWS Docs'}
                        </span>
                      )}
                      <span className="font-space-mono text-[0.52rem] text-aws-muted/40">{savedDate(a.savedAt)}</span>
                      <span className="font-space-mono text-[0.52rem] text-aws-muted/50 group-hover:text-c1/70 transition-colors">
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
            </section>
          )}

          <div className="px-4 py-2 border-t border-aws-border/50 bg-white/2 flex justify-end">
            <button
              type="button"
              onClick={handleClearAll}
              className="font-space-mono text-[0.55rem] text-aws-muted/60 hover:text-aws-muted transition-colors"
            >
              clear all
            </button>
          </div>
        </div>
      )}

      <SiteFooter tagline="AWS SAA-C03 · Your saved study notes · Bookmark what matters" />
    </main>
  )
}
