'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  type ByokProvider,
  type AIProvider,
  inferProviderFromKey,
  isAIProvider,
  KEY_STORAGE_KEY,
  PROVIDER_STORAGE_KEY,
} from '@/lib/ai/providers'

export type { AIProvider, ByokProvider } from '@/lib/ai/providers'

const PROVIDER_CHANGED = 'ai-provider-changed'

interface ProviderSnapshot {
  provider: AIProvider
  key: string | null
}

function readSnapshot(): ProviderSnapshot {
  if (typeof window === 'undefined') {
    return { provider: 'free', key: null }
  }
  const storedKey = localStorage.getItem(KEY_STORAGE_KEY)
  const storedProvider = localStorage.getItem(PROVIDER_STORAGE_KEY)
  const provider =
    storedProvider && isAIProvider(storedProvider)
      ? storedProvider
      : storedKey
        ? inferProviderFromKey(storedKey)
        : 'free'
  return { provider, key: storedKey }
}

function getServerSnapshot(): ProviderSnapshot {
  return { provider: 'free', key: null }
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => undefined
  window.addEventListener(PROVIDER_CHANGED, onStoreChange)
  return () => window.removeEventListener(PROVIDER_CHANGED, onStoreChange)
}

function notifyProviderChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(PROVIDER_CHANGED))
}

export function useAIProvider() {
  const { provider, key } = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot)

  const setProvider = useCallback((next: AIProvider) => {
    localStorage.setItem(PROVIDER_STORAGE_KEY, next)
    notifyProviderChanged()
  }, [])

  const saveKey = useCallback((k: string, keyProvider?: ByokProvider) => {
    const resolved = keyProvider ?? inferProviderFromKey(k)
    localStorage.setItem(KEY_STORAGE_KEY, k)
    localStorage.setItem(PROVIDER_STORAGE_KEY, resolved)
    notifyProviderChanged()
  }, [])

  const clearKey = useCallback(() => {
    localStorage.removeItem(KEY_STORAGE_KEY)
    notifyProviderChanged()
  }, [])

  return { provider, setProvider, key, saveKey, clearKey }
}
