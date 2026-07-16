'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'
import BookmarkIcon from '@/components/bookmarks/BookmarkIcon'
import { useAnswerBookmarksCtx } from '@/components/AnswerBookmarksContext'

const ChatMarkdown = dynamic(() => import('@/components/ai/ChatMarkdown'), { ssr: false })

const savedDate = (ts: number) => new Date(ts).toISOString().slice(0, 10)

type BookmarkDetailClientProps = {
  id: string
}

export default function BookmarkDetailClient({ id }: BookmarkDetailClientProps) {
  const { answers, remove } = useAnswerBookmarksCtx()
  const bookmark = answers.find((a) => a.id === id)

  if (!bookmark) {
    return (
      <main className="max-w-[720px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20">
        <Link
          href="/bookmarks"
          className="font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors"
        >
          ← Back to Bookmarks
        </Link>
        <div className="mt-8 bg-aws-card border border-aws-border rounded-xl px-6 py-10 text-center">
          <p className="text-aws-muted text-sm mb-2">Bookmark not found</p>
          <p className="font-space-mono text-[0.62rem] text-aws-muted/60">
            It may have been removed, or this link is from another browser.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-[720px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-28">
      <Link
        href="/bookmarks"
        className="font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors"
      >
        ← Back to Bookmarks
      </Link>

      <article className="mt-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <BookmarkIcon size={14} filled className="text-amber-400 shrink-0" />
              <span className="font-space-mono text-[0.55rem] uppercase tracking-wider text-aws-muted/60">
                Saved AI answer
              </span>
              <span className="font-space-mono text-[0.52rem] text-aws-muted/40">{savedDate(bookmark.savedAt)}</span>
            </div>
            {bookmark.question && (
              <h1 className="text-xl sm:text-2xl font-bold text-aws-text leading-snug">
                {bookmark.question}
              </h1>
            )}
          </div>
          <button
            type="button"
            onClick={() => remove(bookmark.id)}
            aria-label="Remove bookmark"
            className="shrink-0 flex items-center gap-1.5 font-space-mono text-[0.58rem] text-amber-400/80 hover:text-amber-400 border border-amber-400/25 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-amber-400/10"
          >
            <BookmarkIcon size={12} filled />
            Remove
          </button>
        </div>

        <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden">
          <div className="px-5 py-5 text-[0.88rem] text-aws-text leading-relaxed">
            <ChatMarkdown content={bookmark.answer} />
          </div>

          {bookmark.awsDocsUrl && (
            <div className="px-5 py-3 border-t border-aws-border/50 bg-white/2">
              <a
                href={bookmark.awsDocsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-space-mono text-[0.65rem] text-c1 hover:text-c4 transition-colors"
              >
                {bookmark.awsDocsTitle || 'AWS Documentation'}
                <span aria-hidden>↗</span>
              </a>
            </div>
          )}
        </div>
      </article>

      <SiteFooter tagline="AWS SAA-C03 · Saved AI answer" />
    </main>
  )
}
