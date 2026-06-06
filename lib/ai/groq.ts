const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

export function classifyGroqError(status: number): string {
  const errorByStatus: Record<number, string> = {
    401: 'Free AI service authentication failed. Try again later.',
    429: 'Daily free limit reached. Switch to BYOK (Claude, ILMU, Ollama) or come back tomorrow.',
    503: 'Free AI is temporarily unavailable. Switch to BYOK or try again.',
  }
  return errorByStatus[status] ?? 'Free AI request failed. Try again.'
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function callGroq(
  systemPrompt: string,
  messages: GroqMessage[],
  groqApiKey: string,
  maxTokens: number
): Promise<{ text: string } | { error: string; status: number }> {
  let res: Response
  try {
    res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    })
  } catch {
    return { error: 'Free AI is temporarily unavailable. Try again.', status: 503 }
  }

  if (!res.ok) {
    return { error: classifyGroqError(res.status), status: res.status }
  }

  interface GroqResponse {
    choices: Array<{ message: { content: string } }>
  }
  const data = (await res.json()) as GroqResponse
  return { text: data.choices[0]?.message?.content ?? '' }
}
