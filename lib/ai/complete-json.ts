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
import { callByokMessages } from '@/lib/ai/messages'

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
        error: 'Free AI is not configured. Use ILMU (BYOK) or set GROQ_API_KEY.',
        status: 503,
      }
    }
    return callGroq(systemPrompt, [{ role: 'user', content: userPrompt }], groqKey, maxTokens)
  }

  const byok: ByokProvider = isByokProvider(provider) ? provider : 'anthropic'
  const keyError = validateByokKey(byok, apiKey)
  if (keyError) return { error: keyError, status: 400 }

  return callByokMessages(byok, apiKey, systemPrompt, userPrompt, maxTokens, readGatewayBase())
}
