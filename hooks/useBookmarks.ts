'use client'

import { useState, useCallback } from 'react'

const KEY = 'aws-bookmarks'

function load(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function save(set: Set<string>) {
  localStorage.setItem(KEY, JSON.stringify([...set]))
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(load)

  const toggle = useCallback((shortName: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev)
      next.has(shortName) ? next.delete(shortName) : next.add(shortName)
      save(next)
      return next
    })
  }, [])

  const isBookmarked = useCallback(
    (shortName: string) => bookmarks.has(shortName),
    [bookmarks]
  )

  return { bookmarks, toggle, isBookmarked, count: bookmarks.size }
}
