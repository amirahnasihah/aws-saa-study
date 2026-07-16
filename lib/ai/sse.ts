// Shared Server-Sent-Events consumers for provider response streams. Both the
// free chain (NVIDIA/Gemini = OpenAI shape, ILMU = Anthropic shape) and the
// chat route parse the same two wire formats, so the line-reading and the
// two delta shapes live here once. Each consumer emits text as it arrives via
// `onText` and resolves to the full accumulated string; a mid-stream read error
// is swallowed so the caller keeps whatever was already emitted (never falls
// through to a second provider that would re-emit from the top).

async function readSseLines(
  body: ReadableStream<Uint8Array>,
  onData: (payload: string) => void
): Promise<void> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  // A byte stream that must feed a mutable line buffer — a read loop is the
  // right tool (cannot await inside forEach), matching consumeAnthropicStream.
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      let sep = buffer.indexOf('\n\n')
      while (sep !== -1) {
        const rawEvent = buffer.slice(0, sep)
        buffer = buffer.slice(sep + 2)
        const dataLine = rawEvent.split('\n').find((line) => line.startsWith('data:'))
        if (dataLine) onData(dataLine.slice(5).trim())
        sep = buffer.indexOf('\n\n')
      }
    }
  } catch {
    // Network cut mid-stream — stop; caller keeps the text emitted so far.
  }
}

/** OpenAI chat/completions stream: `data: {choices:[{delta:{content}}]}`, `data: [DONE]`. */
export async function streamOpenAiContent(
  body: ReadableStream<Uint8Array>,
  onText: (text: string) => void
): Promise<string> {
  let full = ''
  await readSseLines(body, (payload) => {
    if (!payload || payload === '[DONE]') return
    try {
      const json = JSON.parse(payload) as {
        choices?: Array<{ delta?: { content?: string } }>
      }
      const text = json.choices?.[0]?.delta?.content ?? ''
      if (text) {
        full += text
        onText(text)
      }
    } catch {
      // keepalive comment or a partial line spanning chunks — ignore
    }
  })
  return full
}

/** Anthropic messages stream (text only, no tools): `content_block_delta` → `text_delta`. */
export async function streamAnthropicContent(
  body: ReadableStream<Uint8Array>,
  onText: (text: string) => void
): Promise<string> {
  let full = ''
  await readSseLines(body, (payload) => {
    if (!payload) return
    try {
      const evt = JSON.parse(payload) as {
        type?: string
        delta?: { type?: string; text?: string }
      }
      if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
        const text = evt.delta.text ?? ''
        if (text) {
          full += text
          onText(text)
        }
      }
    } catch {
      // ignore a malformed event line
    }
  })
  return full
}
