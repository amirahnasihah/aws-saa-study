export type ByokProvider = 'anthropic' | 'ollama' | 'openrouter'

export type AIProvider = 'groq' | 'gemini' | 'ilmu' | ByokProvider

export const PROVIDER_STORAGE_KEY = 'aws_study_ai_provider'
export const KEY_STORAGE_KEY = 'aws_study_ai_key'

const ANTHROPIC_DIRECT_BASE = 'https://api.anthropic.com'

export const BYOK_PROVIDER_META: Record<
  ByokProvider,
  {
    label: string
    shortLabel: string
    placeholder: string
    consoleUrl: string
    consoleLabel: string
    model: string
    panelLabel: string
    hint: string
  }
> = {
  anthropic: {
    label: 'Claude (Anthropic)',
    shortLabel: 'Claude',
    placeholder: 'sk-ant-api03-...',
    consoleUrl: 'https://console.anthropic.com',
    consoleLabel: 'console.anthropic.com',
    model: 'claude-haiku-4-5-20251001',
    panelLabel: 'Claude AI',
    hint: 'Anthropic Claude keys start with sk-ant-. Get one at',
  },
  ollama: {
    label: 'Ollama Cloud',
    shortLabel: 'Ollama',
    placeholder: 'Paste API key from ollama.com',
    consoleUrl: 'https://ollama.com/settings/keys',
    consoleLabel: 'ollama.com/settings/keys',
    model: 'gpt-oss:120b',
    panelLabel: 'Ollama Cloud',
    hint: 'Ollama Cloud keys run models on ollama.com. Create one at',
  },
  openrouter: {
    label: 'OpenRouter',
    shortLabel: 'OpenRouter',
    placeholder: 'sk-or-v1-...',
    consoleUrl: 'https://openrouter.ai/keys',
    consoleLabel: 'openrouter.ai/keys',
    model: 'meta-llama/llama-3.3-8b-instruct:free',
    panelLabel: 'OpenRouter',
    hint: 'OpenRouter gives access to free models (Llama, Gemma, Qwen). Keys start with sk-or-. Get one at',
  },
}

const KEY_ERRORS: Record<ByokProvider, string> = {
  anthropic: "That doesn't look like a valid Anthropic key.",
  ollama: 'Enter your Ollama Cloud API key from ollama.com/settings/keys.',
  openrouter: 'OpenRouter keys start with sk-or-. Get one at openrouter.ai/keys.',
}

export function isByokProvider(value: string): value is ByokProvider {
  return value === 'anthropic' || value === 'ollama' || value === 'openrouter'
}

export function isAIProvider(value: string): value is AIProvider {
  return value === 'groq' || value === 'gemini' || value === 'ilmu' || isByokProvider(value)
}

export function parseAIProvider(header: string | null): AIProvider | null {
  if (header && isAIProvider(header)) return header
  return null
}

export function needsByokKey(provider: AIProvider): provider is ByokProvider {
  return isByokProvider(provider)
}

export function resolveByokProvider(
  provider: AIProvider,
  key: string | null
): ByokProvider {
  if (isByokProvider(provider)) return provider
  return key ? inferProviderFromKey(key) : 'anthropic'
}

export function parseByokProvider(header: string | null): ByokProvider | null {
  if (header && isByokProvider(header)) return header
  return null
}

export function validateByokKey(provider: ByokProvider, key: string): string | null {
  const trimmed = key.trim()
  if (provider === 'anthropic') {
    return trimmed.startsWith('sk-ant-') ? null : KEY_ERRORS.anthropic
  }
  if (provider === 'openrouter') {
    return trimmed.startsWith('sk-or-') ? null : KEY_ERRORS.openrouter
  }
  if (provider === 'ollama') {
    if (trimmed.length < 8) return KEY_ERRORS.ollama
    if (trimmed.startsWith('sk-ant-')) {
      return 'That is a Claude key. Switch to Claude provider or use an Ollama key from ollama.com/settings/keys.'
    }
    return null
  }
  return null
}

export function inferProviderFromKey(key: string): ByokProvider {
  const trimmed = key.trim()
  if (trimmed.startsWith('sk-ant-')) return 'anthropic'
  if (trimmed.startsWith('sk-or-')) return 'openrouter'
  return 'openrouter'
}

export function byokProviderLabel(provider: ByokProvider): string {
  return BYOK_PROVIDER_META[provider].shortLabel
}

export function byokProviderFromAI(provider: AIProvider): ByokProvider {
  if (provider === 'ollama') return 'ollama'
  if (provider === 'openrouter') return 'openrouter'
  return 'anthropic'
}

export function resolveMessagesUrl(
  provider: ByokProvider,
  gatewayBase?: string
): string {
  if (provider === 'ollama') {
    return 'https://ollama.com/api/chat'
  }
  const base = gatewayBase?.trim() || ANTHROPIC_DIRECT_BASE
  return base === ANTHROPIC_DIRECT_BASE
    ? `${ANTHROPIC_DIRECT_BASE}/v1/messages`
    : `${base.replace(/\/$/, '')}/v1/messages`
}

export function classifyProviderError(provider: ByokProvider, status: number): string {
  const consoleHint =
    provider === 'ollama'
      ? 'ollama.com/settings/keys'
      : provider === 'openrouter'
        ? 'openrouter.ai/keys'
        : 'console.anthropic.com'
  const errorByStatus: Record<number, string> = {
    401: `Your API key was rejected. Check it is active at ${consoleHint}.`,
    429: 'You have hit your API rate limit. Wait a moment and try again.',
    408: 'AI explanation timed out. Try again.',
    524: 'AI explanation timed out. Try again.',
  }
  return errorByStatus[status] ?? 'AI explanation failed. Try again.'
}
