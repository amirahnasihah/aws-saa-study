import {
  inferProviderFromKey,
  isByokProvider,
  parseAIProvider,
  validateByokKey,
  type AIProvider,
  type ByokProvider,
} from '@/lib/ai/providers'
import { readGatewayBase, readGroqApiKey } from '@/lib/ai/env'
import { callGroq } from '@/lib/ai/groq'
import { callByokMessages, callByokChatMessages } from '@/lib/ai/messages'
import { callOllamaChat } from '@/lib/ai/ollama'

export function resolveAiProvider(header: string | null, apiKey: string): AIProvider {
  const fromHeader = parseAIProvider(header)
  if (fromHeader) return fromHeader
  if (apiKey.trim()) return inferProviderFromKey(apiKey)
  return 'groq'
}

export async function completeJson(
  provider: AIProvider,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number
): Promise<{ text: string } | { error: string; status: number }> {
  if (provider === 'groq') {
    const groqKey = readGroqApiKey()
    if (!groqKey) {
      return {
        error: 'Free AI is not configured. Use BYOK (Claude, ILMU, Ollama) or set GROQ_API_KEY.',
        status: 503,
      }
    }
    return callGroq(systemPrompt, [{ role: 'user', content: userPrompt }], groqKey, maxTokens)
  }

  const byok: ByokProvider = isByokProvider(provider) ? provider : 'anthropic'
  const keyError = validateByokKey(byok, apiKey)
  if (keyError) return { error: keyError, status: 400 }

  if (byok === 'ollama') {
    return callOllamaChat(
      apiKey,
      systemPrompt,
      [{ role: 'user', content: userPrompt }],
      maxTokens
    )
  }

  return callByokMessages(byok, apiKey, systemPrompt, userPrompt, maxTokens, readGatewayBase())
}

export async function completeChatMessages(
  provider: AIProvider,
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens: number
): Promise<{ text: string } | { error: string; status: number }> {
  if (provider === 'groq') {
    const groqKey = readGroqApiKey()
    if (!groqKey) {
      return {
        error: 'Free AI is not configured. Use BYOK (Claude, ILMU, Ollama) or set GROQ_API_KEY.',
        status: 503,
      }
    }
    const groqMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
    return callGroq(systemPrompt, groqMessages, groqKey, maxTokens)
  }

  const byok: ByokProvider = isByokProvider(provider) ? provider : 'anthropic'
  const keyError = validateByokKey(byok, apiKey)
  if (keyError) return { error: keyError, status: 400 }

  if (byok === 'ollama') {
    return callOllamaChat(apiKey, systemPrompt, messages, maxTokens)
  }

  return callByokChatMessages(byok, apiKey, systemPrompt, messages, maxTokens, readGatewayBase())
}
