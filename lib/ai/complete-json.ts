import {
  inferProviderFromKey,
  isByokProvider,
  parseAIProvider,
  validateByokKey,
  type AIProvider,
  type ByokProvider,
} from '@/lib/ai/providers'
import {
  readGatewayBase,
  readGeminiApiKey,
  readGroqApiKey,
  readIlmuApiKey,
  readNvidiaApiKey,
} from '@/lib/ai/env'
import { callGroq } from '@/lib/ai/groq'
import { callGemini } from '@/lib/ai/gemini'
import { callIlmu } from '@/lib/ai/ilmu'
import { callByokMessages, callByokChatMessages } from '@/lib/ai/messages'
import { callNvidia } from '@/lib/ai/nvidia'
import { callOllamaChat } from '@/lib/ai/ollama'
import { callOpenRouter } from '@/lib/ai/openrouter'

export function resolveAiProvider(header: string | null, apiKey: string): AIProvider {
  const fromHeader = parseAIProvider(header)
  if (fromHeader) return fromHeader
  if (apiKey.trim()) return inferProviderFromKey(apiKey)
  return 'free'
}

type FreeResult = { text: string } | { error: string; status: number }

function isRateLimitedOrDown(r: FreeResult): boolean {
  return 'error' in r && (r.status === 429 || r.status === 503 || r.status === 408)
}

/** NVIDIA → ILMU → Gemini fallback chain */
async function completeFree(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens: number,
  jsonMode: boolean
): Promise<FreeResult> {
  const nvidiaKey = readNvidiaApiKey()
  if (nvidiaKey) {
    const r = await callNvidia(nvidiaKey, systemPrompt, messages, maxTokens, jsonMode)
    if (!isRateLimitedOrDown(r)) return r
  }

  const ilmuKey = readIlmuApiKey()
  if (ilmuKey) {
    const r = await callIlmu(systemPrompt, messages, ilmuKey, maxTokens)
    if (!isRateLimitedOrDown(r)) return r
  }

  const geminiKey = readGeminiApiKey()
  if (geminiKey) {
    return callGemini(systemPrompt, messages, geminiKey, maxTokens, jsonMode)
  }

  return {
    error: 'Free AI is unavailable right now. Try BYOK (OpenRouter, Ollama).',
    status: 503,
  }
}

export async function completeJson(
  provider: AIProvider,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number
): Promise<{ text: string } | { error: string; status: number }> {
  const msgs = [{ role: 'user' as const, content: userPrompt }]

  if (provider === 'free') return completeFree(systemPrompt, msgs, maxTokens, true)

  if (provider === 'groq') {
    const key = readGroqApiKey()
    if (!key) return { error: 'GROQ_API_KEY not configured.', status: 503 }
    return callGroq(systemPrompt, msgs, key, maxTokens)
  }
  if (provider === 'ilmu') {
    const key = readIlmuApiKey()
    if (!key) return { error: 'ILMU_API_KEY not configured.', status: 503 }
    return callIlmu(systemPrompt, msgs, key, maxTokens)
  }
  if (provider === 'nvidia') {
    const key = readNvidiaApiKey()
    if (!key) return { error: 'NVIDIA_API_KEY not configured.', status: 503 }
    return callNvidia(key, systemPrompt, msgs, maxTokens)
  }
  if (provider === 'gemini') {
    const key = readGeminiApiKey()
    if (!key) return { error: 'GEMINI_API_KEY not configured.', status: 503 }
    return callGemini(systemPrompt, msgs, key, maxTokens)
  }

  const byok: ByokProvider = isByokProvider(provider) ? provider : 'anthropic'
  const keyError = validateByokKey(byok, apiKey)
  if (keyError) return { error: keyError, status: 400 }

  if (byok === 'ollama') return callOllamaChat(apiKey, systemPrompt, msgs, maxTokens)
  if (byok === 'openrouter') return callOpenRouter(apiKey, systemPrompt, msgs, maxTokens)

  return callByokMessages(byok, apiKey, systemPrompt, userPrompt, maxTokens, readGatewayBase())
}

export async function completeChatMessages(
  provider: AIProvider,
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens: number
): Promise<{ text: string } | { error: string; status: number }> {
  // The chat route streams raw Markdown — never force a JSON response shape here.
  if (provider === 'free') return completeFree(systemPrompt, messages, maxTokens, false)

  if (provider === 'groq') {
    const key = readGroqApiKey()
    if (!key) return { error: 'GROQ_API_KEY not configured.', status: 503 }
    return callGroq(systemPrompt, messages, key, maxTokens, false)
  }
  if (provider === 'ilmu') {
    const key = readIlmuApiKey()
    if (!key) return { error: 'ILMU_API_KEY not configured.', status: 503 }
    return callIlmu(systemPrompt, messages, key, maxTokens)
  }
  if (provider === 'nvidia') {
    const key = readNvidiaApiKey()
    if (!key) return { error: 'NVIDIA_API_KEY not configured.', status: 503 }
    return callNvidia(key, systemPrompt, messages, maxTokens, false)
  }
  if (provider === 'gemini') {
    const key = readGeminiApiKey()
    if (!key) return { error: 'GEMINI_API_KEY not configured.', status: 503 }
    return callGemini(systemPrompt, messages, key, maxTokens, false)
  }

  const byok: ByokProvider = isByokProvider(provider) ? provider : 'anthropic'
  const keyError = validateByokKey(byok, apiKey)
  if (keyError) return { error: keyError, status: 400 }

  if (byok === 'ollama') return callOllamaChat(apiKey, systemPrompt, messages, maxTokens)
  if (byok === 'openrouter') return callOpenRouter(apiKey, systemPrompt, messages, maxTokens, false)

  return callByokChatMessages(byok, apiKey, systemPrompt, messages, maxTokens, readGatewayBase())
}
