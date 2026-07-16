import { streamAnthropicContent } from '@/lib/ai/sse'

const ILMU_URL = 'https://api.ilmu.ai/anthropic/v1/messages'
const ILMU_MODEL = 'ilmu-nemo-nano'

export function classifyIlmuError(status: number): string {
  const errorByStatus: Record<number, string> = {
    401: 'Free AI service authentication failed. Try again later.',
    429: 'Daily free limit reached. Switch to BYOK (OpenRouter, Ollama) or come back tomorrow.',
    503: 'Free AI is temporarily unavailable. Switch to BYOK or try again.',
  }
  return errorByStatus[status] ?? 'Free AI request failed. Try again.'
}

interface IlmuMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function callIlmu(
  systemPrompt: string,
  messages: IlmuMessage[],
  ilmuApiKey: string,
  maxTokens: number
): Promise<{ text: string } | { error: string; status: number }> {
  let res: Response
  try {
    res = await fetch(ILMU_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ilmuApiKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ILMU_MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    })
  } catch {
    return { error: 'Free AI is temporarily unavailable. Try again.', status: 503 }
  }

  if (!res.ok) {
    return { error: classifyIlmuError(res.status), status: res.status }
  }

  interface IlmuResponse {
    content: Array<{ type: string; text: string }>
  }
  const data = (await res.json()) as IlmuResponse
  return { text: data.content.find((c) => c.type === 'text')?.text ?? '' }
}

/** Streaming variant: emits each token via `onText` as it arrives. */
export async function streamIlmu(
  systemPrompt: string,
  messages: IlmuMessage[],
  ilmuApiKey: string,
  maxTokens: number,
  onText: (text: string) => void
): Promise<{ text: string } | { error: string; status: number }> {
  let res: Response
  try {
    res = await fetch(ILMU_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ilmuApiKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ILMU_MODEL,
        max_tokens: maxTokens,
        stream: true,
        system: systemPrompt,
        messages,
      }),
    })
  } catch {
    return { error: 'Free AI is temporarily unavailable. Try again.', status: 503 }
  }

  if (!res.ok || !res.body) {
    return { error: classifyIlmuError(res.status), status: res.status }
  }

  const text = await streamAnthropicContent(res.body, onText)
  return { text }
}
