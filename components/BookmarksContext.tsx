'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useBookmarks } from '@/hooks/useBookmarks'

type BookmarksCtx = ReturnType<typeof useBookmarks>

const Ctx = createContext<BookmarksCtx | null>(null)

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const value = useBookmarks()
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useBookmarksCtx(): BookmarksCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useBookmarksCtx must be used inside BookmarksProvider')
  return ctx
}
