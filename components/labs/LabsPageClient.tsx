'use client'

import { useEffect, useMemo, useState } from 'react'
import SiteFooter from '@/components/SiteFooter'
import LabListRow from '@/components/labs/LabListRow'
import {
  buildChecklistLabSection,
  checklistSections,
  countChecklistLabsWithLocalPage,
} from '@/lib/labs-checklist'
import { labsChecklistTotal } from '@/data/labsChecklistOrder'
import {
  buildLabDomainSection,
  countDomainLabsWithLocalPage,
  labDomainTabs,
} from '@/lib/labs-course'
import { labsCourseTotal } from '@/data/labsCourseOrder'
import {
  buildLibraryLabSection,
  countLibraryLabsWithLocalPage,
  librarySections,
} from '@/lib/labs-library'
import { labsLibraryTotal } from '@/data/labsLibraryOrder'
import { allLabsFallback } from '@/lib/labs-fallback'
import type { ChecklistSectionId } from '@/data/labsChecklistOrder'
import type { LibrarySectionId } from '@/data/labsLibraryOrder'
import type { Lab } from '@/lib/labs'

type LabsView = 'domain' | 'checklist' | 'library'

const tabClass = (active: boolean) =>
  [
    'shrink-0 font-space-mono text-[0.62rem] sm:text-[0.65rem] px-3 py-1.5 rounded-full border transition-colors',
    active
      ? 'bg-c1/15 border-c1/40 text-c1'
      : 'border-aws-border text-aws-muted hover:text-aws-text hover:border-aws-border/80',
  ].join(' ')

const viewToggleClass = (active: boolean) =>
  [
    'font-space-mono text-[0.68rem] sm:text-[0.72rem] px-3.5 py-2 rounded-lg border transition-colors',
    active
      ? 'bg-aws-card border-c1/40 text-c1'
      : 'border-aws-border text-aws-muted hover:text-aws-text',
  ].join(' ')

export default function LabsPageClient() {
  const [labs, setLabs] = useState<Lab[]>(allLabsFallback())
  const [query, setQuery] = useState('')
  const [view, setView] = useState<LabsView>('domain')
  const [activeDomainCategory, setActiveDomainCategory] = useState(labDomainTabs[0]?.id ?? '')
  const [activeChecklistSection, setActiveChecklistSection] = useState<ChecklistSectionId>('compute')
  const [activeLibrarySection, setActiveLibrarySection] = useState<LibrarySectionId>('guided')

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

  const domainSection = useMemo(
    () => buildLabDomainSection(labs, query, activeDomainCategory),
    [labs, query, activeDomainCategory],
  )

  const checklistSection = useMemo(
    () => buildChecklistLabSection(labs, query, activeChecklistSection),
    [labs, query, activeChecklistSection],
  )

  const librarySection = useMemo(
    () => buildLibraryLabSection(labs, query, activeLibrarySection),
    [labs, query, activeLibrarySection],
  )

  const domainAvailableTotal = useMemo(() => countDomainLabsWithLocalPage(labs), [labs])
  const checklistAvailableTotal = useMemo(() => countChecklistLabsWithLocalPage(labs), [labs])
  const libraryAvailableTotal = useMemo(() => countLibraryLabsWithLocalPage(labs), [labs])
  const trimmedQuery = query.trim()

  const domainTabsWithCounts = useMemo(
    () => labDomainTabs.map((tab) => ({
      ...tab,
      count: buildLabDomainSection(labs, query, tab.id)?.items.length ?? 0,
    })).filter((tab) => tab.count > 0),
    [labs, query],
  )

  const checklistTabsWithCounts = useMemo(
    () => checklistSections.map((section) => ({
      ...section,
      count: buildChecklistLabSection(labs, query, section.id)?.items.length ?? 0,
    })).filter((section) => section.count > 0),
    [labs, query],
  )

  const libraryTabsWithCounts = useMemo(
    () => librarySections.map((section) => ({
      ...section,
      count: buildLibraryLabSection(labs, query, section.id)?.items.length ?? 0,
    })).filter((section) => section.count > 0),
    [labs, query],
  )

  const allDomainSearchResults = useMemo(() => {
    if (!trimmedQuery) return null
    return labDomainTabs.flatMap((tab) => buildLabDomainSection(labs, query, tab.id)?.items ?? [])
  }, [labs, query, trimmedQuery])

  const allChecklistSearchResults = useMemo(() => {
    if (!trimmedQuery) return null
    return checklistSections.flatMap((section) => buildChecklistLabSection(labs, query, section.id)?.items ?? [])
  }, [labs, query, trimmedQuery])

  const allLibrarySearchResults = useMemo(() => {
    if (!trimmedQuery) return null
    return librarySections.flatMap((section) => buildLibraryLabSection(labs, query, section.id)?.items ?? [])
  }, [labs, query, trimmedQuery])

  const activeSection = view === 'domain'
    ? domainSection
    : view === 'checklist'
      ? checklistSection
      : librarySection

  const activeItems = trimmedQuery
    ? (view === 'domain'
      ? allDomainSearchResults
      : view === 'checklist'
        ? allChecklistSearchResults
        : allLibrarySearchResults) ?? []
    : activeSection?.items ?? []

  const visibleCount = activeItems.length

  const sectionTitle = trimmedQuery
    ? 'Search results'
    : view === 'domain'
      ? labDomainTabs.find((tab) => tab.id === activeDomainCategory)?.label ?? 'Domain'
      : view === 'checklist'
        ? checklistSections.find((section) => section.id === activeChecklistSection)?.label ?? 'Checklist'
        : librarySections.find((section) => section.id === activeLibrarySection)?.label ?? 'Library'

  const subTabs = view === 'domain'
    ? domainTabsWithCounts
    : view === 'checklist'
      ? checklistTabsWithCounts
      : libraryTabsWithCounts

  const viewMeta = {
    domain: {
      total: labsCourseTotal,
      imported: domainAvailableTotal,
      blurb: `${labsCourseTotal} Core course labs · exam domain order`,
    },
    checklist: {
      total: labsChecklistTotal,
      imported: checklistAvailableTotal,
      blurb: `${labsChecklistTotal} video course labs · STUDY-CHECKLIST section order`,
    },
    library: {
      total: labsLibraryTotal,
      imported: libraryAvailableTotal,
      blurb: `${labsLibraryTotal} other SAA-C03 library labs · not in domain or checklist`,
    },
  }[view]

  const subTabAriaLabel = view === 'domain'
    ? 'Exam domains'
    : view === 'checklist'
      ? 'Checklist sections'
      : 'Library lab types'

  return (
    <main id="top" className="max-w-[920px] mx-auto px-5 sm:px-6 md:px-8 pt-20 pb-20 md:pb-16">
      <header className="mb-8">
        {/* eyebrow + external "more labs" link */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="font-space-mono text-[0.62rem] uppercase tracking-[0.14em] text-c2">
            AWS Solutions Architect Associate (SAA-C03)
          </p>
          <a
            href="https://cloud.amrhnshh.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-space-mono text-[0.58rem] text-aws-muted hover:text-c1 transition-colors"
          >
            <span className="uppercase tracking-[0.12em]">more labs</span>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className="text-c1/70 group-hover:text-c1 transition-colors" aria-hidden>
              <path d="M3 1h6v6M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        {/* title + live metrics panel */}
        <div className="relative rounded-2xl border border-aws-border bg-gradient-to-br from-aws-card/90 to-aws-bg/30 px-5 py-5 sm:px-6 sm:py-6 mb-6 overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-12 h-44 w-44 rounded-full bg-c1/10 blur-3xl" aria-hidden />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-[1.95rem] font-extrabold text-aws-text leading-tight">
                Hands-on Labs
              </h1>
              <p className="font-space-mono text-[0.72rem] text-aws-muted mt-2 max-w-md">
                {viewMeta.blurb}
              </p>
            </div>
            <div className="flex items-stretch gap-2 shrink-0">
              <MetricTile
                label="Imported"
                value={`${viewMeta.imported}/${viewMeta.total}`}
                tone="c1"
              />
              <MetricTile
                label="Shown"
                value={visibleCount}
                tone="c4"
              />
            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-2 mb-5"
          role="tablist"
          aria-label="Labs list view"
        >
          <button
            type="button"
            role="tab"
            aria-selected={view === 'domain'}
            onClick={() => setView('domain')}
            className={viewToggleClass(view === 'domain')}
          >
            Domain based ({labsCourseTotal})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'checklist'}
            onClick={() => setView('checklist')}
            className={viewToggleClass(view === 'checklist')}
          >
            Study checklist ({labsChecklistTotal})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'library'}
            onClick={() => setView('library')}
            className={viewToggleClass(view === 'library')}
          >
            Other SAA-C03 ({labsLibraryTotal})
          </button>
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1 scrollbar-thin"
          role="tablist"
          aria-label={subTabAriaLabel}
        >
          {subTabs.map((tab) => {
            const active = view === 'domain'
              ? activeDomainCategory === tab.id
              : view === 'checklist'
                ? activeChecklistSection === tab.id
                : activeLibrarySection === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  if (view === 'domain') {
                    setActiveDomainCategory(tab.id)
                    return
                  }
                  if (view === 'checklist') {
                    setActiveChecklistSection(tab.id as ChecklistSectionId)
                    return
                  }
                  setActiveLibrarySection(tab.id as LibrarySectionId)
                }}
                className={tabClass(active)}
              >
                {tab.label}
                <span className="ml-1.5 opacity-70">{tab.count}</span>
              </button>
            )
          })}
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
            {trimmedQuery ? `No labs match “${trimmedQuery}”` : 'No labs in this section yet'}
          </p>
          <p className="font-space-mono text-[0.72rem] text-aws-muted">
            {trimmedQuery ? 'Try a service name like VPC, S3, or Lambda.' : 'Pick another tab above.'}
          </p>
        </div>
      ) : (
        <section aria-labelledby="lab-list-heading">
          <div className="flex items-center gap-3 mb-2 px-4 sm:px-5 md:px-6">
            <h2 id="lab-list-heading" className="text-[0.95rem] sm:text-base font-bold text-aws-text">
              {sectionTitle}
            </h2>
            <span className="font-space-mono text-[0.58rem] text-aws-muted">
              {activeItems.length}
            </span>
          </div>
          <ul className="rounded-xl border border-aws-border bg-aws-card/30 overflow-hidden">
            {activeItems.map((item) => (
              <LabListRow key={`${view}-${item.index}-${item.title}`} item={item} />
            ))}
          </ul>
        </section>
      )}

      <SiteFooter tagline="AWS SAA-C03 · Hands-on Labs · Domain catalog + study checklist + library" />
    </main>
  )
}

function MetricTile({
  label,
  value,
  tone,
}: {
  label: string
  value: string | number
  tone: 'c1' | 'c4'
}) {
  const valueColor = tone === 'c1' ? 'text-c1' : 'text-c4'
  const dotColor = tone === 'c1' ? 'bg-c1' : 'bg-c4'
  return (
    <div className="flex flex-col items-end justify-center rounded-xl border border-aws-border bg-aws-bg/50 px-3.5 py-2 min-w-[5.5rem]">
      <span className={`font-space-mono text-[0.95rem] font-bold tabular-nums leading-none ${valueColor}`}>
        {value}
      </span>
      <span className="mt-1 flex items-center gap-1 font-space-mono text-[0.5rem] uppercase tracking-[0.14em] text-aws-muted">
        <span className={`h-1 w-1 rounded-full ${dotColor}`} aria-hidden />
        {label}
      </span>
    </div>
  )
}
