'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  AI_SESSION_CHANGED,
  CHAT_SESSION_KEY,
  readSessionJson,
  removeSessionKey,
  writeSessionJson,
} from '@/lib/ai/session-persist'

const MAX_MESSAGES = 48

export interface PersistedChatMessage {
  role: 'user' | 'assistant'
  content: string
  awsDocsUrl?: string
  awsDocsTitle?: string
  youtubeQuery?: string
}

function loadHistory(): PersistedChatMessage[] {
  const parsed = readSessionJson<PersistedChatMessage[]>(CHAT_SESSION_KEY, [])
  return Array.isArray(parsed) ? parsed.slice(-MAX_MESSAGES) : []
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => undefined
  window.addEventListener(AI_SESSION_CHANGED, onStoreChange)
  return () => window.removeEventListener(AI_SESSION_CHANGED, onStoreChange)
}

function getServerSnapshot(): PersistedChatMessage[] {
  return []
}

export function useAIChatHistory() {
  const messages = useSyncExternalStore(subscribe, loadHistory, getServerSnapshot)

  const setMessages = useCallback(
    (
      updater: PersistedChatMessage[] | ((prev: PersistedChatMessage[]) => PersistedChatMessage[])
    ) => {
      const prev = loadHistory()
      const next = (typeof updater === 'function' ? updater(prev) : updater).slice(-MAX_MESSAGES)
      if (next.length === 0) {
        removeSessionKey(CHAT_SESSION_KEY)
        return
      }
      writeSessionJson(CHAT_SESSION_KEY, next)
    },
    []
  )

  const clearHistory = useCallback(() => {
    removeSessionKey(CHAT_SESSION_KEY)
  }, [])

  return { messages, setMessages, clearHistory }
}
