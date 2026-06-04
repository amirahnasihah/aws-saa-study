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
  const [messages, setMessagesState] = useState<PersistedChatMessage[]>(loadHistory)

  useEffect(() => {
    if (messages.length === 0) {
      removeSessionKey(CHAT_SESSION_KEY)
      return
    }
    writeSessionJson(CHAT_SESSION_KEY, messages.slice(-MAX_MESSAGES))
  }, [messages])

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
