import { BYOK_PROVIDER_META, classifyProviderError } from '@/lib/ai/providers'

const OLLAMA_CHAT_URL = 'https://ollama.com/api/chat'

interface OllamaChatResponse {
  message?: { role?: string; content?: string }
  error?: string
}

export async function callOllamaChat(
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens: number
): Promise<{ text: string } | { error: string; status: number }> {
  const model = BYOK_PROVIDER_META.ollama.model
  const ollamaMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ]

  let res: Response
  try {
    res = await fetch(OLLAMA_CHAT_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: ollamaMessages,
        stream: false,
        options: { num_predict: maxTokens },
      }),
    })
  } catch {
    return { error: 'Ollama Cloud request timed out. Try again.', status: 503 }
  }

  if (!res.ok) {
    return { error: classifyProviderError('ollama', res.status), status: res.status }
  }

  const data = (await res.json()) as OllamaChatResponse
  if (data.error) {
    return { error: data.error, status: 502 }
  }

  const text = data.message?.content?.trim() ?? ''
  if (!text) {
    return { error: 'Ollama Cloud returned an empty response. Try again.', status: 502 }
  }

  return { text }
}
