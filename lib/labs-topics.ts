import {
  labTopics,
  labsCourseTotal,
  labsTopicOrder,
  labsTopicTotal,
  type LabTopicId,
  type TopicLabEntry,
} from '@/data/labsTopicOrder'
import type { Lab } from '@/lib/labs'

export { labTopics, labsCourseTotal, labsTopicTotal, type LabTopicId, type TopicLabEntry }

export type LabListItem = TopicLabEntry & {
  lab: Lab | null
  available: boolean
}

export type LabTopicSection = {
  topicId: LabTopicId
  label: string
  items: LabListItem[]
}

const matchesQuery = (item: LabListItem, query: string): boolean => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    item.title,
    item.topicId,
    item.lab?.level ?? '',
    item.lab?.summary ?? '',
    ...(item.lab?.services ?? []),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

const stubLab = (entry: TopicLabEntry): Lab => ({
  slug: entry.slug ?? `video-${entry.index}`,
  title: entry.title,
  level: 'Fundamental',
  services: ['AWS'],
  summary: '',
  duration: '00:30:00',
  tasks: [],
  takeaways: [],
  source: 'video',
})

export const buildLabTopicSections = (
  labs: Lab[],
  query: string,
  activeTopicId: LabTopicId | 'all',
): LabTopicSection[] => {
  const bySlug = new Map(labs.map((lab) => [lab.slug, lab]))

  const items = labsTopicOrder
    .map((entry): LabListItem => {
      const lab = entry.slug ? bySlug.get(entry.slug) ?? null : null
      return {
        ...entry,
        lab: lab ?? (entry.source === 'video' ? stubLab(entry) : null),
        available: Boolean(entry.slug && lab),
      }
    })
    .filter((item) => matchesQuery(item, query))
    .filter((item) => activeTopicId === 'all' || item.topicId === activeTopicId)

  const topicIds = activeTopicId === 'all'
    ? labTopics.map((t) => t.id)
    : [activeTopicId]

  return topicIds
    .map((topicId) => {
      const meta = labTopics.find((t) => t.id === topicId)
      return {
        topicId,
        label: meta?.label ?? topicId,
        items: items.filter((item) => item.topicId === topicId),
      }
    })
    .filter((section) => section.items.length > 0)
}

export const countVisibleCourseLabs = (sections: LabTopicSection[]): number =>
  sections.reduce(
    (sum, section) => sum + section.items.filter((item) => item.source === 'course' && item.available).length,
    0,
  )

export const countVisibleLabs = (sections: LabTopicSection[]): number =>
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
