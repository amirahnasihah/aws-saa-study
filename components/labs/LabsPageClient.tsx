'use client'

import { useEffect, useMemo, useState } from 'react'
import SiteFooter from '@/components/SiteFooter'
import LabListRow from '@/components/labs/LabListRow'
import { labsCourseOrder, labsCourseTotal } from '@/data/labsCourseOrder'
import { allLabsFallback } from '@/lib/labs-fallback'
import { buildLabSections, countVisibleLabs } from '@/lib/labs-course'
import type { Lab } from '@/lib/labs'

export default function LabsPageClient() {
  const [labs, setLabs] = useState<Lab[]>(allLabsFallback())
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/api/labs')
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) {
          setLabs(data as Lab[])
        }
      })
      .catch(() => setLabs(allLabsFallback()))
  }, [])

  const sections = useMemo(
    () => buildLabSections(labsCourseOrder, labs, query),
    [labs, query],
  )

  const visibleCount = countVisibleLabs(sections)
  const trimmedQuery = query.trim()

  return (
    <main id="top" className="max-w-[920px] mx-auto px-4 pt-20 pb-20 md:pb-16">
      <header className="mb-8">
        <p className="font-space-mono text-[0.62rem] uppercase tracking-[0.14em] text-c2 mb-2">
          AWS Solutions Architect Associate (SAA-C03)
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-aws-text">Hands-on Labs</h1>
            <p className="font-space-mono text-[0.72rem] text-aws-muted mt-1.5">
              {labsCourseTotal} labs · SAA-C03 exam domain order
            </p>
          </div>
          <span className="self-start font-space-mono text-[0.62rem] text-aws-muted bg-aws-card border border-aws-border px-2.5 py-1 rounded-full">
            {visibleCount} shown
          </span>
        </div>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aws-muted text-[0.85rem] pointer-events-none" aria-hidden>
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search labs by title, service, or level…"
            aria-label="Search labs"
            className="w-full bg-aws-card border border-aws-border rounded-xl pl-9 pr-10 py-3
              text-base sm:text-[0.85rem] text-aws-text placeholder:text-aws-muted/50
              focus:outline-none focus:border-c1/40 transition-colors"
          />
          {trimmedQuery ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-aws-muted hover:text-aws-text text-xs px-1"
              aria-label="Clear search"
            >
              ✕
            </button>
          ) : null}
        </div>
      </header>

      {sections.length === 0 ? (
        <div className="rounded-xl border border-aws-border bg-aws-card/40 px-5 py-10 text-center">
          <p className="text-aws-text font-medium mb-1">No labs match &ldquo;{trimmedQuery}&rdquo;</p>
          <p className="font-space-mono text-[0.72rem] text-aws-muted">Try a service name like VPC, S3, or Lambda.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <section key={section.category} aria-labelledby={`lab-section-${sectionIndex}`}>
              <div className="flex items-center gap-3 mb-1 px-1">
                <h2
                  id={`lab-section-${sectionIndex}`}
                  className="text-[0.95rem] sm:text-base font-bold text-aws-text"
                >
                  {section.category}
                </h2>
                <span className="font-space-mono text-[0.58rem] text-aws-muted">
                  {section.items.length}
                </span>
              </div>
              <ul className="rounded-xl border border-aws-border bg-aws-card/30 overflow-hidden">
                {section.items.map((item) => (
                  <LabListRow key={item.slug} item={item} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <SiteFooter tagline="AWS SAA-C03 · Hands-on Labs · Exam domain order" />
    </main>
  )
}
