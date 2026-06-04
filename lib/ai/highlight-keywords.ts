export type TextPart = { text: string; highlight: boolean }

function escapeRegex(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function collectHighlightTerms(studyKeywords: string[], bankKeywords: string[]): string[] {
  const seen = new Set<string>()
  const merged: string[] = []
  ;[...studyKeywords, ...bankKeywords].forEach((term) => {
    const trimmed = term.trim()
    if (trimmed.length < 2) return
    const key = trimmed.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    merged.push(trimmed)
  })
  return merged.sort((a, b) => b.length - a.length)
}

export function mergeHighlightTerms(
  text: string,
  studyKeywords: string[],
  bankKeywords: string[]
): TextPart[] {
  const terms = collectHighlightTerms(studyKeywords, bankKeywords)
  if (!terms.length) return [{ text, highlight: false }]

  const pattern = new RegExp(`(${terms.map(escapeRegex).join('|')})`, 'gi')
  const segments = text.split(pattern).filter((segment) => segment.length > 0)

  return segments.map((segment) => ({
    text: segment,
    highlight: terms.some((term) => segment.toLowerCase() === term.toLowerCase()),
  }))
}
