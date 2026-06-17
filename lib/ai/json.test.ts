import { describe, expect, test } from 'bun:test'
import { parseAIJson, salvageText } from './json'

describe('parseAIJson', () => {
  test('parses plain JSON', () => {
    expect(parseAIJson<{ reply: string }>('{"reply":"hi"}')).toEqual({ reply: 'hi' })
  })

  test('strips a fence wrapping the whole response', () => {
    const text = '```json\n{"reply":"hi"}\n```'
    expect(parseAIJson<{ reply: string }>(text)).toEqual({ reply: 'hi' })
  })

  test('preserves a fenced mermaid block inside a reply value', () => {
    const text =
      '{"reply":"Here is a diagram:\\n```mermaid\\ngraph TD\\nA-->B\\n```","youtubeQuery":"x"}'
    const parsed = parseAIJson<{ reply: string; youtubeQuery: string }>(text)
    expect(parsed?.reply).toContain('```mermaid')
    expect(parsed?.reply).toContain('A-->B')
    expect(parsed?.youtubeQuery).toBe('x')
  })

  test('repairs truncated JSON', () => {
    const text = '{"reply":"partial tex'
    const parsed = parseAIJson<{ reply: string }>(text)
    expect(parsed?.reply).toBe('partial tex')
  })
})

describe('salvageText', () => {
  test('extracts a string field from malformed JSON', () => {
    const text = '{"reply":"fallback value", "extra": '
    expect(salvageText(text, 'reply')).toBe('fallback value')
  })
})
