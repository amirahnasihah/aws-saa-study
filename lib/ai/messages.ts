import {
  BYOK_PROVIDER_META,
  classifyProviderError,
  resolveMessagesUrl,
  type ByokProvider,
} from '@/lib/ai/providers'

export async function callByokMessages(
  provider: ByokProvider,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
  gatewayBase?: string
): Promise<{ text: string } | { error: string; status: number }> {
  const url = resolveMessagesUrl(
    provider,
    provider === 'anthropic' ? gatewayBase : undefined
  )
  const model = BYOK_PROVIDER_META[provider].model

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })
  } catch {
    return { error: 'AI request timed out. Try again.', status: 503 }
  }

  if (!res.ok) {
    return { error: classifyProviderError(provider, res.status), status: res.status }
  }

  interface AnthropicMessage {
    content: Array<{ type: string; text: string }>
  }
  const data = (await res.json()) as AnthropicMessage
  return { text: data.content.find((c) => c.type === 'text')?.text ?? '' }
}

export async function callByokChatMessages(
  provider: ByokProvider,
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens: number,
  gatewayBase?: string
): Promise<{ text: string } | { error: string; status: number }> {
  const url = resolveMessagesUrl(
    provider,
    provider === 'anthropic' ? gatewayBase : undefined
  )
  const model = BYOK_PROVIDER_META[provider].model

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    })
  } catch {
    return { error: 'AI chat timed out. Try again.', status: 503 }
  }

  if (!res.ok) {
    return { error: classifyProviderError(provider, res.status), status: res.status }
  }

  interface AnthropicMessage {
    content: Array<{ type: string; text: string }>
  }
  const data = (await res.json()) as AnthropicMessage
  return { text: data.content.find((c) => c.type === 'text')?.text ?? '' }
}
