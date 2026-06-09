'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  AI_SESSION_CHANGED,
  CHAT_SESSION_KEY,
  ensureAISessionMigrated,
  readSessionJson,
  removeSessionKey,
  writeSessionJson,
} from '@/lib/ai/session-persist'

const MAX_MESSAGES = 48

import type { InternalLink } from '@/lib/ai/internal-links'

export interface PersistedChatMessage {
  role: 'user' | 'assistant'
  content: string
  awsDocsUrl?: string
  awsDocsTitle?: string
  youtubeQuery?: string
  internalLinks?: InternalLink[]
}

const EMPTY_HISTORY: PersistedChatMessage[] = []
let chatSnapshot: PersistedChatMessage[] = EMPTY_HISTORY
let chatSnapshotKey = '[]'

function readHistoryFromStorage(): PersistedChatMessage[] {
  ensureAISessionMigrated()
  const parsed = readSessionJson<PersistedChatMessage[]>(CHAT_SESSION_KEY, EMPTY_HISTORY)
  return Array.isArray(parsed) ? parsed.slice(-MAX_MESSAGES) : EMPTY_HISTORY
}

function syncChatSnapshot(): void {
  const next = readHistoryFromStorage()
  const nextKey = JSON.stringify(next)
  if (nextKey === chatSnapshotKey) return
  chatSnapshotKey = nextKey
  chatSnapshot = next.length === 0 ? EMPTY_HISTORY : next
}

function getChatSnapshot(): PersistedChatMessage[] {
  return chatSnapshot
}

function getChatServerSnapshot(): PersistedChatMessage[] {
  return EMPTY_HISTORY
}

function subscribeChat(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => undefined

  const onSessionChange = () => {
    syncChatSnapshot()
    onStoreChange()
  }

  syncChatSnapshot()
  window.addEventListener(AI_SESSION_CHANGED, onSessionChange)
  return () => window.removeEventListener(AI_SESSION_CHANGED, onSessionChange)
}

export function useAIChatHistory() {
  const messages = useSyncExternalStore(subscribeChat, getChatSnapshot, getChatServerSnapshot)

  const setMessages = useCallback(
    (
      updater: PersistedChatMessage[] | ((prev: PersistedChatMessage[]) => PersistedChatMessage[])
    ) => {
      const prev = chatSnapshot === EMPTY_HISTORY ? readHistoryFromStorage() : chatSnapshot
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
