export type ByokProvider = 'anthropic' | 'ilmu' | 'ollama'

export type AIProvider = 'groq' | ByokProvider

export const PROVIDER_STORAGE_KEY = 'aws_study_ai_provider'
export const KEY_STORAGE_KEY = 'aws_study_ai_key'

const ILMU_ANTHROPIC_BASE = 'https://api.ilmu.ai/anthropic'
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
  },
  ilmu: {
    label: 'ILMU Chat',
    shortLabel: 'ILMU',
    placeholder: 'sk-...',
    consoleUrl: 'https://console.ilmu.ai/dashboard/usage',
    consoleLabel: 'console.ilmu.ai',
    model: 'nemo-super',
    panelLabel: 'ILMU AI',
  },
  ollama: {
    label: 'Ollama Cloud',
    shortLabel: 'Ollama',
    placeholder: 'Paste API key from ollama.com',
    consoleUrl: 'https://ollama.com/settings/keys',
    consoleLabel: 'ollama.com/settings/keys',
    model: 'gpt-oss:120b',
    panelLabel: 'Ollama Cloud',
  },
}

const KEY_ERRORS: Record<ByokProvider, string> = {
  anthropic: "That doesn't look like a valid Anthropic key.",
  ilmu: "That doesn't look like a valid ILMU key.",
  ollama: 'Enter your Ollama Cloud API key from ollama.com/settings/keys.',
}

export function isByokProvider(value: string): value is ByokProvider {
  return value === 'anthropic' || value === 'ilmu' || value === 'ollama'
}

export function isAIProvider(value: string): value is AIProvider {
  return value === 'groq' || isByokProvider(value)
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
  if (provider === 'ollama') {
    if (trimmed.length < 8) return KEY_ERRORS.ollama
    if (trimmed.startsWith('sk-ant-')) {
      return 'That is a Claude key. Switch to Claude provider or use an Ollama key from ollama.com/settings/keys.'
    }
    return null
  }
  if (!trimmed.startsWith('sk-')) return KEY_ERRORS.ilmu
  if (trimmed.startsWith('sk-ant-')) {
    return 'Anthropic keys use the Claude provider. Switch provider or use an ILMU key from console.ilmu.ai.'
  }
  return null
}

export function inferProviderFromKey(key: string): ByokProvider {
  return key.trim().startsWith('sk-ant-') ? 'anthropic' : 'ilmu'
}

export function byokProviderLabel(provider: ByokProvider): string {
  return BYOK_PROVIDER_META[provider].shortLabel
}

export function byokProviderFromAI(provider: AIProvider): ByokProvider {
  if (provider === 'ollama') return 'ollama'
  if (provider === 'ilmu') return 'ilmu'
  return 'anthropic'
}

export function resolveMessagesUrl(
  provider: ByokProvider,
  gatewayBase?: string
): string {
  if (provider === 'ollama') {
    return 'https://ollama.com/api/chat'
  }
  if (provider === 'ilmu') {
    return `${ILMU_ANTHROPIC_BASE}/v1/messages`
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
      : provider === 'ilmu'
        ? 'console.ilmu.ai'
        : 'console.anthropic.com'
  const errorByStatus: Record<number, string> = {
    401: `Your API key was rejected. Check it is active at ${consoleHint}.`,
    429: 'You have hit your API rate limit. Wait a moment and try again.',
    408: 'AI explanation timed out. Try again.',
    524: 'AI explanation timed out. Try again.',
  }
  return (
    errorByStatus[status] ?? 'AI explanation failed. Try again.'
  )
}
