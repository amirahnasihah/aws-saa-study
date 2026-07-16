import { streamOpenAiContent } from '@/lib/ai/sse'

const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const NVIDIA_MODEL = 'meta/llama-3.3-70b-instruct'

interface OAIResponse {
  choices: Array<{ message: { content: string } }>
}

function classifyNvidiaError(status: number): string {
  const errors: Record<number, string> = {
    401: 'Invalid NVIDIA API key. Check it at build.nvidia.com.',
    429: 'NVIDIA rate limit hit (40 RPM on free tier). Wait a moment and try again.',
  }
  return errors[status] ?? 'NVIDIA NIM request failed. Try again.'
}

/** Streaming variant: emits each token via `onText` as it arrives. */
export async function streamNvidia(
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens: number,
  onText: (text: string) => void
): Promise<{ text: string } | { error: string; status: number }> {
  let res: Response
  try {
    res = await fetch(NVIDIA_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        max_tokens: maxTokens,
        stream: true,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    })
  } catch {
    return { error: 'NVIDIA NIM request timed out. Try again.', status: 503 }
  }

  if (!res.ok || !res.body) {
    return { error: classifyNvidiaError(res.status), status: res.status }
  }

  const text = await streamOpenAiContent(res.body, onText)
  return { text }
}

export async function callNvidia(
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens: number,
  jsonMode = true
): Promise<{ text: string } | { error: string; status: number }> {
  let res: Response
  try {
    res = await fetch(NVIDIA_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        max_tokens: maxTokens,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    })
  } catch {
    return { error: 'NVIDIA NIM request timed out. Try again.', status: 503 }
  }

  if (!res.ok) {
    return { error: classifyNvidiaError(res.status), status: res.status }
  }

  const data = (await res.json()) as OAIResponse
  return { text: data.choices[0]?.message?.content ?? '' }
}
