'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAnswerBookmarks } from '@/hooks/useAnswerBookmarks'

type AnswerBookmarksCtx = ReturnType<typeof useAnswerBookmarks>

const Ctx = createContext<AnswerBookmarksCtx | null>(null)

export function AnswerBookmarksProvider({ children }: { children: ReactNode }) {
  const value = useAnswerBookmarks()
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAnswerBookmarksCtx(): AnswerBookmarksCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAnswerBookmarksCtx must be used inside AnswerBookmarksProvider')
  return ctx
}
