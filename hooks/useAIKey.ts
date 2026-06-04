'use client'

import { useAIProvider } from '@/hooks/useAIProvider'

/** @deprecated Prefer useAIProvider — re-exported for existing imports */
export function useAIKey() {
  const { key, saveKey, clearKey } = useAIProvider()
  return { key, saveKey, clearKey }
}
