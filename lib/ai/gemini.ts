const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
const GEMINI_MODEL = 'gemini-2.5-flash'

export function classifyGeminiError(status: number): string {
  const errorByStatus: Record<number, string> = {
    401: 'Free AI service authentication failed. Try again later.',
    429: 'Daily free limit reached. Switch to BYOK (OpenRouter, ILMU, Ollama) or come back tomorrow.',
    503: 'Free AI is temporarily unavailable. Switch to BYOK or try again.',
  }
  return errorByStatus[status] ?? 'Free AI request failed. Try again.'
}

interface GeminiMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function callGemini(
  systemPrompt: string,
  messages: GeminiMessage[],
  geminiApiKey: string,
  maxTokens: number
): Promise<{ text: string } | { error: string; status: number }> {
  let res: Response
  try {
    res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${geminiApiKey}`,
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    })
  } catch {
    return { error: 'Free AI is temporarily unavailable. Try again.', status: 503 }
  }

  if (!res.ok) {
    return { error: classifyGeminiError(res.status), status: res.status }
  }

  interface GeminiResponse {
    choices: Array<{ message: { content: string } }>
  }
  const data = (await res.json()) as GeminiResponse
  return { text: data.choices[0]?.message?.content ?? '' }
}
