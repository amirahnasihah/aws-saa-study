'use client'

import { useState } from 'react'
import {
  type ByokProvider,
  type AIProvider,
  inferProviderFromKey,
  isAIProvider,
  isByokProvider,
  KEY_STORAGE_KEY,
  PROVIDER_STORAGE_KEY,
} from '@/lib/ai/providers'

export type { AIProvider, ByokProvider } from '@/lib/ai/providers'

export function useAIProvider() {
  const [provider, setProviderState] = useState<AIProvider>(() => {
    if (typeof window === 'undefined') return 'groq'
    const stored = localStorage.getItem(PROVIDER_STORAGE_KEY)
    if (stored && isAIProvider(stored)) return stored
    const key = localStorage.getItem(KEY_STORAGE_KEY)
    if (key) return inferProviderFromKey(key)
    return 'groq'
  })

  const [key, setKeyState] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(KEY_STORAGE_KEY) : null
  )

  const setProvider = (next: AIProvider) => {
    localStorage.setItem(PROVIDER_STORAGE_KEY, next)
    setProviderState(next)
  }

  const saveKey = (k: string, keyProvider?: ByokProvider) => {
    const resolved = keyProvider ?? inferProviderFromKey(k)
    localStorage.setItem(KEY_STORAGE_KEY, k)
    localStorage.setItem(PROVIDER_STORAGE_KEY, resolved)
    setKeyState(k)
    setProviderState(resolved)
  }

  const clearKey = () => {
    localStorage.removeItem(KEY_STORAGE_KEY)
    setKeyState(null)
  }

  return { provider, setProvider, key, saveKey, clearKey }
}
