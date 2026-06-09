import type { CourseLabEntry } from '@/data/labsCourseOrder'
import type { Lab } from '@/lib/labs'

export type LabListItem = CourseLabEntry & {
  lab: Lab
}

export type LabSection = {
  category: string
  items: LabListItem[]
}

const matchesQuery = (item: LabListItem, query: string): boolean => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    item.title,
    item.category,
    item.lab.level,
    item.lab.summary,
    ...item.lab.services,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

export const buildLabSections = (
  courseOrder: CourseLabEntry[],
  labs: Lab[],
  query: string,
): LabSection[] => {
  const bySlug = new Map(labs.map((lab) => [lab.slug, lab]))
  const sectionOrder: string[] = []
  const buckets = new Map<string, LabListItem[]>()

  courseOrder.forEach((entry) => {
    const lab = bySlug.get(entry.slug)
    if (!lab) return
    const item: LabListItem = { ...entry, lab }
    if (!matchesQuery(item, query)) return
    if (!buckets.has(entry.category)) {
      buckets.set(entry.category, [])
      sectionOrder.push(entry.category)
    }
    buckets.get(entry.category)?.push(item)
  })

  const inCourse = new Set(courseOrder.map((e) => e.slug))
  const extras = labs
    .filter((lab) => !inCourse.has(lab.slug))
    .map((lab, i) => ({
      index: courseOrder.length + i + 1,
      title: lab.title,
      slug: lab.slug,
      category: 'Personal notes',
      duration: lab.duration,
      lab,
    }))
    .filter((item) => matchesQuery(item, query))

  if (extras.length > 0) {
    sectionOrder.push('Personal notes')
    buckets.set('Personal notes', extras)
  }

  return sectionOrder
    .map((category) => ({
      category,
      items: buckets.get(category) ?? [],
    }))
    .filter((section) => section.items.length > 0)
}

export const countVisibleLabs = (sections: LabSection[]): number =>
  sections.reduce((sum, section) => sum + section.items.length, 0)

export const formatLabDuration = (courseDuration: string, labDuration: string): string => {
  if (courseDuration.trim()) return courseDuration
  const hhmm = labDuration.match(/^(\d{2}):(\d{2})/)
  if (!hhmm) return labDuration
  const hours = Number(hhmm[1])
  const mins = Number(hhmm[2])
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}
