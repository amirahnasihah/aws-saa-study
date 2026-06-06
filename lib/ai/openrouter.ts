const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL = 'meta-llama/llama-3.3-8b-instruct:free'

interface OAIResponse {
  choices: Array<{ message: { content: string } }>
}

export async function callOpenRouter(
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens: number
): Promise<{ text: string } | { error: string; status: number }> {
  const allMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages,
  ]

  let res: Response
  try {
    res = await fetch(OPENROUTER_CHAT_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey.trim()}`,
        'http-referer': 'https://aws-saa-study.pages.dev',
        'x-title': 'AWS SAA-C03 Study',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
        messages: allMessages,
      }),
    })
  } catch {
    return { error: 'OpenRouter request timed out. Try again.', status: 503 }
  }

  if (!res.ok) {
    const errors: Record<number, string> = {
      401: 'Invalid OpenRouter key. Check it at openrouter.ai/keys.',
      402: 'OpenRouter credits exhausted. Top up at openrouter.ai.',
      429: 'OpenRouter rate limit hit. Wait a moment and try again.',
    }
    return {
      error: errors[res.status] ?? 'OpenRouter request failed. Try again.',
      status: res.status,
    }
  }

  const data = (await res.json()) as OAIResponse
  return { text: data.choices[0]?.message?.content ?? '' }
}
