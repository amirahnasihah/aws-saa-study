'use client'

import { useEffect, useState } from 'react'
import {
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

export function useAIChatHistory() {
  // SSR-safe empty initial state; sessionStorage is restored after mount.
  const [messages, setMessagesState] = useState<PersistedChatMessage[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMessagesState(loadHistory())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    if (messages.length === 0) {
      removeSessionKey(CHAT_SESSION_KEY)
      return
    }
    writeSessionJson(CHAT_SESSION_KEY, messages.slice(-MAX_MESSAGES))
  }, [messages, ready])

  const setMessages = (
    updater: PersistedChatMessage[] | ((prev: PersistedChatMessage[]) => PersistedChatMessage[])
  ) => {
    setMessagesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return next.slice(-MAX_MESSAGES)
    })
  }

  const clearHistory = () => {
    removeSessionKey(CHAT_SESSION_KEY)
    setMessagesState([])
  }

  return { messages, setMessages, clearHistory }
}
