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
      blurb: `${labsCourseTotal} Whizlabs course labs · exam domain order`,
    },
    checklist: {
      total: labsChecklistTotal,
      imported: checklistAvailableTotal,
      blurb: `${labsChecklistTotal} video course labs · STUDY-CHECKLIST section order`,
    },
    library: {
      total: labsLibraryTotal,
      imported: libraryAvailableTotal,
      blurb: `${labsLibraryTotal} other SAA-C03 Whizlabs library labs · not in domain or checklist`,
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
        <p className="font-space-mono text-[0.62rem] uppercase tracking-[0.14em] text-c2 mb-2">
          AWS Solutions Architect Associate (SAA-C03)
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-aws-text">Hands-on Labs</h1>
            <p className="font-space-mono text-[0.72rem] text-aws-muted mt-1.5">
              {viewMeta.blurb}
            </p>
          </div>
          <span className="self-start font-space-mono text-[0.62rem] text-aws-muted bg-aws-card border border-aws-border px-2.5 py-1 rounded-full">
            {viewMeta.imported}/{viewMeta.total} imported · {visibleCount} shown
          </span>
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
