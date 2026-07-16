import {
  labsLibraryOrder,
  librarySections,
  type LibrarySectionId,
} from '@/data/labsLibraryOrder'
import { labsLinkIndex } from '@/data/labsLinkIndex'
import type { LabRowItem } from '@/lib/labs-list-item'
import type { Lab } from '@/lib/labs'

export { labsLibraryOrder, librarySections, type LibrarySectionId }

// Slugs with a local lab page, from the generated slim index — checking via
// findLabFallback would pull the 2.6MB labsCatalog into the client bundle.
const catalogSlugs = new Set<string>(labsLinkIndex.map((lab) => lab.slug))

export type LibraryLabSection = {
  sectionId: LibrarySectionId
  label: string
  items: LabRowItem[]
}

const matchesQuery = (item: LabRowItem, query: string): boolean => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    item.title,
    item.lab?.level ?? '',
    item.lab?.summary ?? '',
    ...(item.lab?.services ?? []),
    item.subtitle ?? '',
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

export const buildLibraryLabSection = (
  labs: Lab[],
  query: string,
  activeSectionId: LibrarySectionId,
): LibraryLabSection | null => {
  const bySlug = new Map(labs.map((lab) => [lab.slug, lab]))
  const section = librarySections.find((entry) => entry.id === activeSectionId)

  const items = labsLibraryOrder
    .filter((entry) => entry.sectionId === activeSectionId)
    .map((entry): LabRowItem => {
      const lab = bySlug.get(entry.slug) ?? null
      const hasLocal = Boolean(lab || catalogSlugs.has(entry.slug))
      return {
        index: entry.index,
        title: entry.title,
        slug: entry.slug,
        duration: entry.duration,
        lab,
        available: hasLocal,
        source: 'library',
        subtitle: !hasLocal
          ? 'Not imported yet'
          : !lab?.tasks?.some((task) => task.steps?.some((step) => (step.images?.length ?? 0) > 0))
            ? 'Imported · text-only steps'
            : undefined,
      }
    })
    .filter((item) => matchesQuery(item, query))

  if (items.length === 0) return null

  return {
    sectionId: activeSectionId,
    label: section?.label ?? activeSectionId,
    items,
  }
}

export const countLibraryLabsWithLocalPage = (labs: Lab[]): number =>
  labsLibraryOrder.filter((entry) =>
    labs.some((lab) => lab.slug === entry.slug) || catalogSlugs.has(entry.slug),
  ).length
