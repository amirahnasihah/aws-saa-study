const BULLET_SPLIT = /\n+|(?:\d+\.\s)|(?:[-•]\s)/

export function toBulletList(value: unknown, maxItems: number): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, maxItems)
  }
  if (typeof value !== 'string' || !value.trim()) return []

  const fromLines = value
    .split(BULLET_SPLIT)
    .map((line) => line.trim().replace(/^[-•]\s*/, ''))
    .filter((line) => line.length > 4)

  if (fromLines.length > 1) return fromLines.slice(0, maxItems)

  const sentences = value
    .split(/\.\s+/)
    .map((s) => s.trim().replace(/\.$/, ''))
    .filter((s) => s.length > 4)

  return sentences.slice(0, maxItems)
}
