'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'aws_study_ai_chat_history'
const MAX_MESSAGES = 48

export interface PersistedChatMessage {
  role: 'user' | 'assistant'
  content: string
  awsDocsUrl?: string
  awsDocsTitle?: string
  youtubeQuery?: string
}

function loadHistory(): PersistedChatMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PersistedChatMessage[]
    return Array.isArray(parsed) ? parsed.slice(-MAX_MESSAGES) : []
  } catch {
    return []
  }
}

function saveHistory(messages: PersistedChatMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)))
}

export function useAIChatHistory() {
  const [messages, setMessagesState] = useState<PersistedChatMessage[]>(loadHistory)

  useEffect(() => {
    saveHistory(messages)
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
    localStorage.removeItem(STORAGE_KEY)
    setMessagesState([])
  }

  return { messages, setMessages, clearHistory }
}
