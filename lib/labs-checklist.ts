import {
  checklistSections,
  labsChecklistOrder,
  type ChecklistSectionId,
} from '@/data/labsChecklistOrder'
import { labsLinkIndex } from '@/data/labsLinkIndex'
import type { LabRowItem } from '@/lib/labs-list-item'
import type { Lab } from '@/lib/labs'

export { checklistSections, labsChecklistOrder }

// Slugs with a local lab page, from the generated slim index — checking via
// findLabFallback would pull the 2.6MB labsCatalog into the client bundle.
const catalogSlugs = new Set<string>(labsLinkIndex.map((lab) => lab.slug))

export type ChecklistLabSection = {
  sectionId: ChecklistSectionId
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
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

export const buildChecklistLabSection = (
  labs: Lab[],
  query: string,
  activeSectionId: ChecklistSectionId,
): ChecklistLabSection | null => {
  const bySlug = new Map(labs.map((lab) => [lab.slug, lab]))
  const section = checklistSections.find((entry) => entry.id === activeSectionId)

  const items = labsChecklistOrder
    .filter((entry) => entry.sectionId === activeSectionId)
    .map((entry): LabRowItem => {
      const lab = entry.slug ? bySlug.get(entry.slug) ?? null : null
      const hasLocal = Boolean(entry.slug && (lab || catalogSlugs.has(entry.slug)))
      return {
        index: entry.index,
        title: entry.title,
        slug: entry.slug,
        duration: entry.duration,
        lab,
        available: hasLocal,
        source: 'checklist',
        subtitle: !hasLocal ? 'Video course lab · not imported yet' : undefined,
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

export const countChecklistLabsWithLocalPage = (
  labs: Lab[],
): number =>
  labsChecklistOrder.filter(
    (entry) => entry.slug && (
      labs.some((lab) => lab.slug === entry.slug) || catalogSlugs.has(entry.slug)
    ),
  ).length
