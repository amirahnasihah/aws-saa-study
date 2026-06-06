export function parseAIJson<T>(text: string): T | null {
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  try {
    return JSON.parse(clean) as T
  } catch {
    return null
  }
}
