import {
  inferProviderFromKey,
  isByokProvider,
  parseAIProvider,
  validateByokKey,
  type AIProvider,
  type ByokProvider,
} from '@/lib/ai/providers'
import { readGatewayBase, readGeminiApiKey, readGroqApiKey, readIlmuApiKey } from '@/lib/ai/env'
import { callGroq } from '@/lib/ai/groq'
import { callGemini } from '@/lib/ai/gemini'
import { callIlmu } from '@/lib/ai/ilmu'
import { callByokMessages, callByokChatMessages } from '@/lib/ai/messages'
import { callOllamaChat } from '@/lib/ai/ollama'
import { callOpenRouter } from '@/lib/ai/openrouter'

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
        error: 'Free AI is not configured. Use BYOK (OpenRouter, ILMU, Ollama) or set GROQ_API_KEY.',
        status: 503,
      }
    }
    return callGroq(systemPrompt, [{ role: 'user', content: userPrompt }], groqKey, maxTokens)
  }

  if (provider === 'gemini') {
    const geminiKey = readGeminiApiKey()
    if (!geminiKey) {
      return {
        error: 'Free AI is not configured. Use BYOK (OpenRouter, ILMU, Ollama) or set GEMINI_API_KEY.',
        status: 503,
      }
    }
    return callGemini(systemPrompt, [{ role: 'user', content: userPrompt }], geminiKey, maxTokens)
  }

  if (provider === 'ilmu') {
    const ilmuKey = readIlmuApiKey()
    if (!ilmuKey) {
      return {
        error: 'Free AI is not configured. Use BYOK (OpenRouter, Ollama) or set ILMU_API_KEY.',
        status: 503,
      }
    }
    return callIlmu(systemPrompt, [{ role: 'user', content: userPrompt }], ilmuKey, maxTokens)
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

  if (byok === 'openrouter') {
    return callOpenRouter(apiKey, systemPrompt, [{ role: 'user', content: userPrompt }], maxTokens)
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
        error: 'Free AI is not configured. Use BYOK (OpenRouter, ILMU, Ollama) or set GROQ_API_KEY.',
        status: 503,
      }
    }
    const groqMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
    return callGroq(systemPrompt, groqMessages, groqKey, maxTokens)
  }

  if (provider === 'gemini') {
    const geminiKey = readGeminiApiKey()
    if (!geminiKey) {
      return {
        error: 'Free AI is not configured. Use BYOK (OpenRouter, ILMU, Ollama) or set GEMINI_API_KEY.',
        status: 503,
      }
    }
    const geminiMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
    return callGemini(systemPrompt, geminiMessages, geminiKey, maxTokens)
  }

  if (provider === 'ilmu') {
    const ilmuKey = readIlmuApiKey()
    if (!ilmuKey) {
      return {
        error: 'Free AI is not configured. Use BYOK (OpenRouter, Ollama) or set ILMU_API_KEY.',
        status: 503,
      }
    }
    return callIlmu(systemPrompt, messages, ilmuKey, maxTokens)
  }

  const byok: ByokProvider = isByokProvider(provider) ? provider : 'anthropic'
  const keyError = validateByokKey(byok, apiKey)
  if (keyError) return { error: keyError, status: 400 }

  if (byok === 'ollama') {
    return callOllamaChat(apiKey, systemPrompt, messages, maxTokens)
  }

  if (byok === 'openrouter') {
    return callOpenRouter(apiKey, systemPrompt, messages, maxTokens)
  }

  return callByokChatMessages(byok, apiKey, systemPrompt, messages, maxTokens, readGatewayBase())
}
