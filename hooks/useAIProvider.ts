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

const SERVER_SNAPSHOT: ProviderSnapshot = { provider: 'free', key: null }
let providerSnapshot: ProviderSnapshot = SERVER_SNAPSHOT
let providerSnapshotKey = 'free\0'

function readProviderFromStorage(): ProviderSnapshot {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT

  const storedKey = localStorage.getItem(KEY_STORAGE_KEY) ?? ''
  const storedProvider = localStorage.getItem(PROVIDER_STORAGE_KEY) ?? ''
  const provider =
    storedProvider && isAIProvider(storedProvider)
      ? storedProvider
      : storedKey
        ? inferProviderFromKey(storedKey)
        : 'free'

  if (!storedKey && provider === 'free') return SERVER_SNAPSHOT
  return { provider, key: storedKey || null }
}

function syncProviderSnapshot(): void {
  const next = readProviderFromStorage()
  const nextKey = `${next.provider}\0${next.key ?? ''}`
  if (nextKey === providerSnapshotKey) return
  providerSnapshotKey = nextKey
  providerSnapshot = next === SERVER_SNAPSHOT ? SERVER_SNAPSHOT : next
}

function getProviderSnapshot(): ProviderSnapshot {
  return providerSnapshot
}

function getProviderServerSnapshot(): ProviderSnapshot {
  return SERVER_SNAPSHOT
}

function subscribeProvider(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => undefined

  const onChange = () => {
    syncProviderSnapshot()
    onStoreChange()
  }

  syncProviderSnapshot()
  window.addEventListener(PROVIDER_CHANGED, onChange)
  return () => window.removeEventListener(PROVIDER_CHANGED, onChange)
}

function notifyProviderChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(PROVIDER_CHANGED))
}

export function useAIProvider() {
  const { provider, key } = useSyncExternalStore(
    subscribeProvider,
    getProviderSnapshot,
    getProviderServerSnapshot
  )

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
