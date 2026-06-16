import { labsCourseOrder, type CourseLabEntry } from '@/data/labsCourseOrder'
import type { LabRowItem } from '@/lib/labs-list-item'
import type { Lab } from '@/lib/labs'

export type LabDomainSection = {
  category: string
  items: LabRowItem[]
}

export const labDomainCategories = [...new Set(labsCourseOrder.map((entry) => entry.category))]

const shortCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    '1. Domain 1: Design Secure Architectures': 'Domain 1 · Secure',
    '2. Domain 2: Design Resilient Architectures': 'Domain 2 · Resilient',
    '3. Domain 3: Design High-Performing Architectures': 'Domain 3 · Performance',
    '4. Domain 4: Design Cost-Optimized Architectures': 'Domain 4 · Cost',
    '5. Challenges': 'Challenges',
    '6. Projects': 'Projects',
  }
  return labels[category] ?? category
}

export const labDomainTabs = labDomainCategories.map((category) => ({
  id: category,
  label: shortCategoryLabel(category),
  count: labsCourseOrder.filter((entry) => entry.category === category).length,
}))

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

const toRowItem = (entry: CourseLabEntry, lab: Lab | null): LabRowItem => ({
  index: entry.index,
  title: entry.title,
  slug: entry.slug,
  duration: entry.duration,
  lab,
  available: Boolean(lab),
  source: 'course',
  subtitle: lab ? undefined : 'Not imported yet',
})

export const buildLabDomainSection = (
  labs: Lab[],
  query: string,
  activeCategory: string,
): LabDomainSection | null => {
  const bySlug = new Map(labs.map((lab) => [lab.slug, lab]))

  const items = labsCourseOrder
    .filter((entry) => entry.category === activeCategory)
    .map((entry) => toRowItem(entry, bySlug.get(entry.slug) ?? null))
    .filter((item) => matchesQuery(item, query))

  if (items.length === 0) return null

  return {
    category: activeCategory,
    items,
  }
}

export const countDomainLabsWithLocalPage = (labs: Lab[]): number =>
  labsCourseOrder.filter((entry) => labs.some((lab) => lab.slug === entry.slug)).length

export const countVisibleLabs = (section: LabDomainSection | null): number =>
  section?.items.length ?? 0
