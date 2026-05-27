'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SiteFooter from '@/components/SiteFooter'
import {
  type ChangeEntry,
  type ChangeType,
  changeTypes,
  changelog,
  formatChangelogDate,
  formatRelativeDate,
  typeFilterActive,
  typeFilterColor,
  typeColor,
  typeLabel,
} from '@/data/changelog'

type FilterType = ChangeType | 'all'

const DEFAULT_EXPANDED = 2

const filterOptions: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  ...changeTypes.map((type) => ({ id: type, label: typeLabel[type] })),
]

const countByType = (entries: ChangeEntry[]) =>
  changeTypes.reduce<Record<ChangeType, number>>(
    (counts, type) => ({
      ...counts,
      [type]: entries.reduce(
        (total, entry) => total + entry.changes.filter((change) => change.type === type).length,
        0,
      ),
    }),
    { feat: 0, fix: 0, chore: 0, refactor: 0 },
  )

export default function ChangelogView() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [expandedDates, setExpandedDates] = useState<Set<string>>(
    () => new Set(changelog.slice(0, DEFAULT_EXPANDED).map((entry) => entry.date)),
  )
  const [activeDate, setActiveDate] = useState(changelog[0]?.date ?? '')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const filteredEntries = useMemo(
    () =>
      changelog
        .map((entry) => ({
          ...entry,
          changes:
            activeFilter === 'all'
              ? entry.changes
              : entry.changes.filter((change) => change.type === activeFilter),
        }))
        .filter((entry) => entry.changes.length > 0),
    [activeFilter],
  )

  const typeCounts = useMemo(() => countByType(changelog), [])
  const totalChanges = useMemo(
    () => changelog.reduce((total, entry) => total + entry.changes.length, 0),
    [],
  )

  const allExpanded =
    filteredEntries.length > 0 &&
    filteredEntries.every((entry) => expandedDates.has(entry.date))

  const scrollToEntry = useCallback((date: string) => {
    sectionRefs.current[date]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveDate(date)
  }, [])

  const toggleEntry = useCallback((date: string) => {
    setExpandedDates((current) => {
      const next = new Set(current)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    setExpandedDates(
      allExpanded
        ? new Set<string>()
        : new Set(filteredEntries.map((entry) => entry.date)),
    )
  }, [allExpanded, filteredEntries])

  useEffect(() => {
    const visibleDates = filteredEntries.map((entry) => entry.date)
    if (visibleDates.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const topEntry = visible[0]
        if (topEntry?.target.id) {
          setActiveDate(topEntry.target.id.replace('changelog-', ''))
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    visibleDates.forEach((date) => {
      const node = sectionRefs.current[date]
      if (node) observer.observe(node)
    })

    return () => observer.disconnect()
  }, [filteredEntries])

  return (
    <main className="max-w-5xl mx-auto px-4 pt-[calc(3.5rem+2rem)] pb-16">
      <div className="mb-8">
        <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c1 mb-2">
          Changelog
        </p>
        <h1 className="text-2xl font-bold text-aws-text mb-3">What&apos;s changed</h1>
        <p className="text-sm text-aws-muted leading-relaxed max-w-2xl">
          A running log of notable updates to this study site. Jump to a date, filter by type, or
          expand only what you need.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {filterOptions.map((option) => {
          const count =
            option.id === 'all'
              ? totalChanges
              : typeCounts[option.id as ChangeType]

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveFilter(option.id)}
              className={`font-space-mono text-[0.62rem] px-2.5 py-1 rounded-full border transition-colors ${
                activeFilter === option.id
                  ? typeFilterActive[option.id]
                  : typeFilterColor[option.id]
              }`}
            >
              {option.label}
              <span className="ml-1 opacity-60">{count}</span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={toggleAll}
          className="ml-auto font-space-mono text-[0.62rem] text-aws-muted hover:text-aws-text transition-colors"
        >
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto nav-scroll">
        <div className="flex gap-2 min-w-max pb-1">
          {filteredEntries.map((entry) => (
            <button
              key={entry.date}
              type="button"
              onClick={() => scrollToEntry(entry.date)}
              className={`font-space-mono text-[0.62rem] px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                activeDate === entry.date
                  ? 'border-c1/50 bg-c1/10 text-c1'
                  : 'border-aws-border text-aws-muted hover:text-aws-text hover:border-aws-text/30'
              }`}
            >
              {formatChangelogDate(entry.date)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[11rem_minmax(0,1fr)] gap-8 lg:gap-12">
        <aside className="hidden lg:block">
          <nav className="sticky top-[calc(3.5rem+1.5rem)] space-y-1">
            <p className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted mb-3">
              Timeline
            </p>
            {filteredEntries.map((entry) => (
              <button
                key={entry.date}
                type="button"
                onClick={() => scrollToEntry(entry.date)}
                className={`group w-full text-left rounded-lg px-2.5 py-2 transition-colors border-l-2 ${
                  activeDate === entry.date
                    ? 'border-c1 bg-c1/5'
                    : 'border-transparent hover:border-aws-border hover:bg-aws-card/40'
                }`}
              >
                <p
                  className={`font-space-mono text-[0.62rem] ${
                    activeDate === entry.date ? 'text-c1' : 'text-aws-text'
                  }`}
                >
                  {formatChangelogDate(entry.date)}
                </p>
                <p className="text-[0.65rem] text-aws-muted mt-0.5">
                  {formatRelativeDate(entry.date)} · {entry.changes.length}{' '}
                  {entry.changes.length === 1 ? 'change' : 'changes'}
                </p>
              </button>
            ))}
          </nav>
        </aside>

        <div className="space-y-3 min-w-0">
          {filteredEntries.length === 0 ? (
            <div className="rounded-xl border border-aws-border bg-aws-card/40 px-5 py-8 text-center">
              <p className="text-sm text-aws-muted">No changes match this filter.</p>
            </div>
          ) : (
            filteredEntries.map((entry, index) => {
              const isExpanded = expandedDates.has(entry.date)

              return (
                <section
                  key={entry.date}
                  id={`changelog-${entry.date}`}
                  ref={(node) => {
                    sectionRefs.current[entry.date] = node
                  }}
                  className="scroll-mt-[calc(3.5rem+1rem)] rounded-xl border border-aws-border bg-aws-card/40 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleEntry(entry.date)}
                    aria-expanded={isExpanded}
                    className="w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-aws-card/60 transition-colors"
                  >
                    <span
                      className={`font-space-mono text-[0.65rem] mt-1 shrink-0 transition-transform ${
                        isExpanded ? 'rotate-90 text-c1' : 'text-aws-muted'
                      }`}
                      aria-hidden
                    >
                      ▶
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h2 className="font-space-mono text-sm text-aws-text">
                          {formatChangelogDate(entry.date)}
                        </h2>
                        <span className="font-space-mono text-[0.58rem] text-aws-muted">
                          {formatRelativeDate(entry.date)}
                        </span>
                        {index === 0 && (
                          <span className="font-space-mono text-[0.58rem] uppercase tracking-wider text-c1/80 border border-c1/20 rounded-full px-2 py-0.5">
                            Latest
                          </span>
                        )}
                      </div>
                      {!isExpanded && (
                        <p className="text-sm text-aws-muted mt-1.5 truncate">
                          {entry.changes.map((change) => change.text).join(' · ')}
                        </p>
                      )}
                    </div>

                    <span className="font-space-mono text-[0.58rem] text-aws-muted shrink-0 mt-0.5">
                      {entry.changes.length}
                    </span>
                  </button>

                  {isExpanded && (
                    <ul className="px-4 pb-4 pt-0 space-y-2 border-t border-aws-border/60 mx-4 mb-4">
                      {entry.changes.map((change, changeIndex) => (
                        <li key={changeIndex} className="flex items-start gap-2 text-sm pt-2 first:pt-3">
                          <span
                            className={`font-space-mono text-[0.6rem] mt-[3px] shrink-0 ${typeColor[change.type]}`}
                          >
                            {typeLabel[change.type]}
                          </span>
                          <span className="text-aws-text leading-relaxed">{change.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )
            })
          )}
        </div>
      </div>

      <SiteFooter tagline="AWS SAA-C03 · Changelog" />
    </main>
  )
}
