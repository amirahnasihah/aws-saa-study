/** Remove markdown code fences that some models wrap JSON in. */
function stripFences(text: string): string {
  return text.replace(/```(?:json)?/gi, '')
}

function tryParse<T>(text: string): T | null {
  try {
    return JSON.parse(text.trim()) as T
  } catch {
    return null
  }
}

/**
 * Repair JSON truncated mid-stream (e.g. when the model hits the token limit):
 * close an unterminated string, drop a dangling comma or half-written key,
 * then append closers for any still-open objects/arrays.
 */
function repairTruncatedJson(input: string): string {
  const closers: string[] = []
  let inString = false
  let escaped = false
  let result = ''

  for (const ch of input) {
    result += ch
    if (inString) {
      if (escaped) escaped = false
      else if (ch === '\\') escaped = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') inString = true
    else if (ch === '{') closers.unshift('}')
    else if (ch === '[') closers.unshift(']')
    else if (ch === '}' || ch === ']') closers.shift()
  }

  if (inString) result += '"'
  // Drop a trailing comma or a dangling "key"/"key": that has no value yet.
  result = result
    .replace(/,\s*$/, '')
    .replace(/,\s*"(?:[^"\\]|\\.)*"\s*:?\s*$/, '')

  return result + closers.join('')
}

/**
 * Parse JSON out of a model response that may be wrapped in code fences,
 * surrounded by prose, or truncated. Returns null only when no JSON object
 * can be recovered, so callers can treat the text as plain prose.
 */
export function parseAIJson<T>(text: string): T | null {
  const stripped = stripFences(text)
  const start = stripped.indexOf('{')
  if (start === -1) return null

  const end = stripped.lastIndexOf('}')
  const body = end > start ? stripped.slice(start, end + 1) : stripped.slice(start)

  return tryParse<T>(body) ?? tryParse<T>(repairTruncatedJson(stripped.slice(start)))
}

/**
 * Last-resort recovery: pull a single string field out of raw model text when
 * full JSON parsing fails, so a raw `{"reply":...}` blob never reaches the UI.
 * Returns null when the field is absent (text is plain prose, show it as-is).
 */
export function salvageText(raw: string, key: string): string | null {
  const match = stripFences(raw).match(
    new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"?`)
  )
  if (!match) return null
  const value = (tryParse<string>(`"${match[1]}"`) ?? match[1].replace(/\\(.)/g, '$1')).trim()
  return value.length > 0 ? value : null
}
