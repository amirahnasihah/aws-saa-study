import { deepNotesLinkIndex } from '@/data/deepNotesLinkIndex'
import { learnHref } from '@/data/awsMeta'

export type DeepNotesMatch = {
  url: string
  serviceName: string
  sectionTitle: string
  sectionIcon: string
}

type IndexedService = {
  sectionId: string
  sectionTitle: string
  sectionIcon: string
  shortName: string
  searchBlob: string
}

const deepNotesIndex: IndexedService[] = [...deepNotesLinkIndex]

function scoreTerms(blob: string, terms: string[]): number {
  return terms.reduce((score, term) => {
    const t = term.toLowerCase().trim()
    if (t.length < 2) return score
    if (!blob.includes(t)) return score
    return score + Math.min(t.length, 24)
  }, 0)
}

export function findDeepNotesMatch(terms: string[]): DeepNotesMatch {
  const cleaned = terms
    .map((t) => t.trim())
    .filter((t) => t.length > 1)

  const best = deepNotesIndex.reduce<{ item: IndexedService; score: number } | null>(
    (current, item) => {
      const score = scoreTerms(item.searchBlob, cleaned)
      if (!current || score > current.score) return { item, score }
      return current
    },
    null
  )

  if (!best || best.score === 0) {
    return {
      url: '/learn',
      serviceName: 'Deep Notes',
      sectionTitle: 'All domains',
      sectionIcon: '📖',
    }
  }

  const { item } = best
  return {
    url: learnHref(item.sectionId),
    serviceName: item.shortName,
    sectionTitle: item.sectionTitle,
    sectionIcon: item.sectionIcon,
  }
}

export function collectDeepNotesTerms(
  bankKeywords: string[],
  studyKeywords: string[],
  conceptName: string,
  questionSnippet: string
): string[] {
  return [...bankKeywords, ...studyKeywords, conceptName, questionSnippet]
}
