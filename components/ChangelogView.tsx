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
const SCROLL_ANCHOR = 112

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

const isDesktopViewport = () => window.matchMedia('(min-width: 1024px)').matches

const relativeTop = (node: HTMLElement, container: HTMLElement) =>
  node.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop

const resolveActiveDateInContainer = (
  entries: ChangeEntry[],
  refs: Record<string, HTMLElement | null>,
  container: HTMLElement,
) => {
  const anchor = container.getBoundingClientRect().top + 24

  const visible = entries.filter((entry) => {
    const node = refs[entry.date]
    return node && node.getBoundingClientRect().top <= anchor
  })

  return visible.at(-1)?.date ?? entries[0]?.date ?? ''
}

const resolveActiveDateOnPage = (
  entries: ChangeEntry[],
  refs: Record<string, HTMLElement | null>,
) => {
  const visible = entries.filter((entry) => {
    const node = refs[entry.date]
    return node && node.getBoundingClientRect().top <= SCROLL_ANCHOR
  })

  return visible.at(-1)?.date ?? entries[0]?.date ?? ''
}

const resolveScrollProgressInContainer = (
  entries: ChangeEntry[],
  refs: Record<string, HTMLElement | null>,
  container: HTMLElement,
) => {
  const first = refs[entries[0]?.date ?? '']
  const last = refs[entries.at(-1)?.date ?? '']

  if (!first || !last || entries.length < 2) return entries.length === 1 ? 1 : 0

  const start = relativeTop(first, container)
  const end = relativeTop(last, container) + last.offsetHeight
  const viewport = container.scrollTop + 32
  const span = end - start

  if (span <= 0) return 0
  return Math.min(1, Math.max(0, (viewport - start) / span))
}

const resolveScrollProgressOnPage = (
  entries: ChangeEntry[],
  refs: Record<string, HTMLElement | null>,
) => {
  const first = refs[entries[0]?.date ?? '']
  const last = refs[entries.at(-1)?.date ?? '']

  if (!first || !last || entries.length < 2) return entries.length === 1 ? 1 : 0

  const start = first.getBoundingClientRect().top + window.scrollY
  const end = last.getBoundingClientRect().bottom + window.scrollY
  const viewport = window.scrollY + SCROLL_ANCHOR
  const span = end - start

  if (span <= 0) return 0
  return Math.min(1, Math.max(0, (viewport - start) / span))
}

export default function ChangelogView() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [expandedDates, setExpandedDates] = useState<Set<string>>(
    () => new Set(changelog.slice(0, DEFAULT_EXPANDED).map((entry) => entry.date)),
  )
  const [activeDate, setActiveDate] = useState(changelog[0]?.date ?? '')
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const timelineItemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const timelineNavRef = useRef<HTMLElement | null>(null)
  const contentScrollRef = useRef<HTMLDivElement | null>(null)
  const isJumpScrolling = useRef(false)

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

  const activeIndex = useMemo(
    () => filteredEntries.findIndex((entry) => entry.date === activeDate),
    [activeDate, filteredEntries],
  )

  const typeCounts = useMemo(() => countByType(changelog), [])
  const totalChanges = useMemo(
    () => changelog.reduce((total, entry) => total + entry.changes.length, 0),
    [],
  )

  const allExpanded =
    filteredEntries.length > 0 &&
    filteredEntries.every((entry) => expandedDates.has(entry.date))

  const syncScrollState = useCallback(() => {
    if (isJumpScrolling.current) return

    const container = contentScrollRef.current
    const useContainer = isDesktopViewport() && container

    if (useContainer) {
      setActiveDate(resolveActiveDateInContainer(filteredEntries, sectionRefs.current, container))
      setScrollProgress(resolveScrollProgressInContainer(filteredEntries, sectionRefs.current, container))
      return
    }

    setActiveDate(resolveActiveDateOnPage(filteredEntries, sectionRefs.current))
    setScrollProgress(resolveScrollProgressOnPage(filteredEntries, sectionRefs.current))
  }, [filteredEntries])

  const scrollToEntry = useCallback((date: string) => {
    const node = sectionRefs.current[date]
    const container = contentScrollRef.current
    if (!node) return

    isJumpScrolling.current = true
    setActiveDate(date)

    if (isDesktopViewport() && container) {
      const top = relativeTop(node, container) - 12
      container.scrollTo({ top, behavior: 'smooth' })
    } else {
      const top = node.getBoundingClientRect().top + window.scrollY - SCROLL_ANCHOR + 8
      window.scrollTo({ top, behavior: 'smooth' })
    }

    window.setTimeout(() => {
      isJumpScrolling.current = false
    }, 700)
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
    if (filteredEntries.length === 0) return

    syncScrollState()

    const container = contentScrollRef.current
    container?.addEventListener('scroll', syncScrollState, { passive: true })
    window.addEventListener('scroll', syncScrollState, { passive: true })
    window.addEventListener('resize', syncScrollState)

    return () => {
      container?.removeEventListener('scroll', syncScrollState)
      window.removeEventListener('scroll', syncScrollState)
      window.removeEventListener('resize', syncScrollState)
    }
  }, [filteredEntries, syncScrollState])

  useEffect(() => {
    const nav = timelineNavRef.current
    const item = timelineItemRefs.current[activeDate]
    if (!nav || !item) return

    const navRect = nav.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()
    const above = itemRect.top < navRect.top + 12
    const below = itemRect.bottom > navRect.bottom - 12

    if (above || below) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeDate])

  const railProgress = filteredEntries.length <= 1
    ? 100
    : Math.max(
        0,
        Math.min(
          100,
          activeIndex >= 0
            ? (activeIndex / (filteredEntries.length - 1)) * 100
            : scrollProgress * 100,
        ),
      )

  const entryList = filteredEntries.length === 0 ? (
    <div className="rounded-xl border border-aws-border bg-aws-card/40 px-5 py-8 text-center">
      <p className="text-sm text-aws-muted">No changes match this filter.</p>
    </div>
  ) : (
    filteredEntries.map((entry, index) => {
      const isExpanded = expandedDates.has(entry.date)
      const isActive = activeDate === entry.date

      return (
        <section
          key={entry.date}
          id={`changelog-${entry.date}`}
          ref={(node) => {
            sectionRefs.current[entry.date] = node
          }}
          className={`scroll-mt-3 rounded-xl border overflow-hidden transition-[border-color,box-shadow] duration-300 ${
            isActive
              ? 'border-c1/25 bg-aws-card/50 shadow-[0_0_0_1px_rgba(0,212,255,0.06),0_8px_32px_rgba(0,212,255,0.04)]'
              : 'border-aws-border bg-aws-card/40'
          }`}
        >
          <button
            type="button"
            onClick={() => toggleEntry(entry.date)}
            aria-expanded={isExpanded ? 'true' : 'false'}
            className="w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-aws-card/60 transition-colors"
          >
            <span
              className={`font-space-mono text-[0.65rem] mt-1 shrink-0 transition-transform duration-200 ${
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
  )

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

      <div className="lg:hidden sticky top-14 z-40 -mx-4 px-4 py-3 mb-6 bg-aws-bg/88 backdrop-blur-md border-b border-aws-border/70">
        <div className="overflow-x-auto nav-scroll">
          <div className="flex gap-2 min-w-max">
            {filteredEntries.map((entry) => (
              <button
                key={entry.date}
                type="button"
                onClick={() => scrollToEntry(entry.date)}
                className={`font-space-mono text-[0.62rem] px-3 py-1.5 rounded-full border whitespace-nowrap transition-all duration-200 ${
                  activeDate === entry.date
                    ? 'border-c1/50 bg-c1/10 text-c1 shadow-[0_0_16px_rgba(0,212,255,0.12)]'
                    : 'border-aws-border text-aws-muted hover:text-aws-text hover:border-aws-text/30'
                }`}
              >
                {formatChangelogDate(entry.date)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[13.5rem_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
        <aside className="hidden lg:flex lg:flex-col self-start">
          <div className="flex flex-col w-full max-h-[calc(100vh-14rem)] rounded-xl border border-aws-border/80 bg-aws-card/35 backdrop-blur-sm overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-aws-border/60 shrink-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.18em] text-aws-muted">
                  Timeline
                </p>
                <span className="font-space-mono text-[0.55rem] text-c1/70">
                  {filteredEntries.length} releases
                </span>
              </div>
              <div className="h-1 rounded-full bg-aws-border/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-c1/70 via-c1 to-c1/80 transition-[width] duration-300 ease-out"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
            </div>

            <nav
              ref={timelineNavRef}
              aria-label="Changelog timeline"
              className="overflow-y-auto nav-scroll flex-1 px-3 py-3 min-h-0"
            >
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute left-[9px] top-3 bottom-3 w-px bg-aws-border/90"
                />
                <div
                  aria-hidden
                  className="absolute left-[9px] top-3 w-px bg-gradient-to-b from-c1 via-c1/60 to-transparent transition-[height] duration-300 ease-out"
                  style={{ height: `calc(${railProgress}% - 0.5rem)` }}
                />

                {filteredEntries.map((entry, index) => {
                  const isActive = activeDate === entry.date
                  const isPast = activeIndex >= 0 && index < activeIndex

                  return (
                    <button
                      key={entry.date}
                      ref={(node) => {
                        timelineItemRefs.current[entry.date] = node
                      }}
                      type="button"
                      onClick={() => scrollToEntry(entry.date)}
                      className={`group relative w-full text-left pl-7 pr-2 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive ? 'bg-c1/[0.07]' : 'hover:bg-aws-card/50'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute left-[5px] top-[15px] size-[9px] rounded-full border transition-all duration-200 ${
                          isActive
                            ? 'border-c1 bg-c1 shadow-[0_0_10px_rgba(0,212,255,0.55)] scale-125'
                            : isPast
                              ? 'border-c1/50 bg-c1/30'
                              : 'border-aws-border bg-aws-bg group-hover:border-aws-muted'
                        }`}
                      />

                      <p
                        className={`font-space-mono text-[0.62rem] leading-none transition-colors ${
                          isActive ? 'text-c1' : 'text-aws-text group-hover:text-aws-text'
                        }`}
                      >
                        {formatChangelogDate(entry.date)}
                      </p>
                      <p className="text-[0.64rem] text-aws-muted mt-1 leading-snug">
                        {formatRelativeDate(entry.date)}
                      </p>
                      <p className="font-space-mono text-[0.55rem] text-aws-muted/80 mt-0.5">
                        {entry.changes.length} {entry.changes.length === 1 ? 'change' : 'changes'}
                      </p>
                    </button>
                  )
                })}
              </div>
            </nav>
          </div>
        </aside>

        <div
          ref={contentScrollRef}
          className="min-w-0 nav-scroll lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:rounded-xl lg:border lg:border-aws-border/70 lg:bg-aws-card/20 lg:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
        >
          <div className="space-y-3 lg:p-3">{entryList}</div>
        </div>
      </div>

      <SiteFooter tagline="AWS SAA-C03 · Changelog" />
    </main>
  )
}
