'use client'

import { useState, useEffect } from 'react'
import {
  type ByokProvider,
  type AIProvider,
  inferProviderFromKey,
  isAIProvider,
  KEY_STORAGE_KEY,
  PROVIDER_STORAGE_KEY,
} from '@/lib/ai/providers'

export type { AIProvider, ByokProvider } from '@/lib/ai/providers'

export function useAIProvider() {
  // Start from SSR-safe defaults so server and client initial renders match.
  // localStorage is applied after mount via useEffect.
  const [provider, setProviderState] = useState<AIProvider>('gemini')
  const [key, setKeyState] = useState<string | null>(null)

  useEffect(() => {
    const storedKey = localStorage.getItem(KEY_STORAGE_KEY)
    const storedProvider = localStorage.getItem(PROVIDER_STORAGE_KEY)
    if (storedKey) setKeyState(storedKey)
    if (storedProvider && isAIProvider(storedProvider)) {
      setProviderState(storedProvider)
    } else if (storedKey) {
      setProviderState(inferProviderFromKey(storedKey))
    }
  }, [])

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
