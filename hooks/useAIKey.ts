'use client'

import { useState } from 'react'

const STORAGE_KEY = 'aws_study_ai_key'

export function useAIKey() {
  const [key, setKeyState] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  )

  const saveKey = (k: string) => {
    localStorage.setItem(STORAGE_KEY, k)
    setKeyState(k)
  }

  const clearKey = () => {
    localStorage.removeItem(STORAGE_KEY)
    setKeyState(null)
  }

  return { key, saveKey, clearKey }
}
