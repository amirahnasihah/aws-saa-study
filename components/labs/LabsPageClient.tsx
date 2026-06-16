'use client'

import { useEffect, useMemo, useState } from 'react'
import SiteFooter from '@/components/SiteFooter'
import LabListRow from '@/components/labs/LabListRow'
import {
  buildLabTopicSections,
  countVisibleLabs,
  labTopics,
  labsCourseTotal,
  labsTopicTotal,
  type LabTopicId,
} from '@/lib/labs-topics'
import { labsTopicOrder } from '@/data/labsTopicOrder'
import { allLabsFallback } from '@/lib/labs-fallback'
import type { Lab } from '@/lib/labs'

const topicTabClass = (active: boolean) =>
  [
    'shrink-0 font-space-mono text-[0.62rem] sm:text-[0.65rem] px-3 py-1.5 rounded-full border transition-colors',
    active
      ? 'bg-c1/15 border-c1/40 text-c1'
      : 'border-aws-border text-aws-muted hover:text-aws-text hover:border-aws-border/80',
  ].join(' ')

export default function LabsPageClient() {
  const [labs, setLabs] = useState<Lab[]>(allLabsFallback())
  const [query, setQuery] = useState('')
  const [activeTopicId, setActiveTopicId] = useState<LabTopicId>('compute')

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
    () => buildLabTopicSections(labs, query, activeTopicId),
    [labs, query, activeTopicId],
  )

  const visibleCount = countVisibleLabs(sections)
  const courseAvailableTotal = useMemo(
    () => labsTopicOrder.filter(
      (entry) => entry.source === 'course' && entry.slug && labs.some((lab) => lab.slug === entry.slug),
    ).length,
    [labs],
  )
  const trimmedQuery = query.trim()
  const activeItems = sections[0]?.items ?? []

  const tabsWithCounts = useMemo(
    () => labTopics.map((topic) => ({
      ...topic,
      count: buildLabTopicSections(labs, query, topic.id)[0]?.items.length ?? 0,
    })).filter((t) => t.count > 0),
    [labs, query],
  )

  return (
    <main id="top" className="max-w-[920px] mx-auto px-5 sm:px-6 md:px-8 pt-20 pb-20 md:pb-16">
      <header className="mb-8">
        <p className="font-space-mono text-[0.62rem] uppercase tracking-[0.14em] text-c2 mb-2">
          AWS Solutions Architect Associate (SAA-C03)
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-aws-text">Hands-on Labs</h1>
            <p className="font-space-mono text-[0.72rem] text-aws-muted mt-1.5">
              {labsCourseTotal} course labs · {labsTopicTotal - labsCourseTotal} video labs · topic order
            </p>
          </div>
          <span className="self-start font-space-mono text-[0.62rem] text-aws-muted bg-aws-card border border-aws-border px-2.5 py-1 rounded-full">
            {courseAvailableTotal}/{labsCourseTotal} course · {visibleCount} shown
          </span>
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1 scrollbar-thin"
          role="tablist"
          aria-label="Lab topics"
        >
          {tabsWithCounts.map((topic) => (
            <button
              key={topic.id}
              type="button"
              role="tab"
              aria-selected={activeTopicId === topic.id ? true : false}
              onClick={() => setActiveTopicId(topic.id)}
              className={topicTabClass(activeTopicId === topic.id)}
            >
              {topic.label}
              <span className="ml-1.5 opacity-70">{topic.count}</span>
            </button>
          ))}
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

      {activeItems.length === 0 ? (
        <div className="rounded-xl border border-aws-border bg-aws-card/40 px-5 py-10 text-center">
          <p className="text-aws-text font-medium mb-1">
            {trimmedQuery ? `No labs match “${trimmedQuery}”` : 'No labs in this topic yet'}
          </p>
          <p className="font-space-mono text-[0.72rem] text-aws-muted">
            {trimmedQuery ? 'Try a service name like VPC, S3, or Lambda.' : 'Pick another topic tab above.'}
          </p>
        </div>
      ) : (
        <section aria-labelledby="lab-topic-list">
          <div className="flex items-center gap-3 mb-2 px-4 sm:px-5 md:px-6">
            <h2 id="lab-topic-list" className="text-[0.95rem] sm:text-base font-bold text-aws-text">
              {labTopics.find((t) => t.id === activeTopicId)?.label}
            </h2>
            <span className="font-space-mono text-[0.58rem] text-aws-muted">
              {activeItems.length}
            </span>
          </div>
          <ul className="rounded-xl border border-aws-border bg-aws-card/30 overflow-hidden">
            {activeItems.map((item) => (
              <LabListRow key={`${item.topicId}-${item.index}-${item.title}`} item={item} />
            ))}
          </ul>
        </section>
      )}

      <SiteFooter tagline="AWS SAA-C03 · Hands-on Labs · Video course topic order" />
    </main>
  )
}
