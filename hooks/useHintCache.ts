'use client'

import { toBulletList } from '@/lib/ai/hint-bullets'
import type { HintResponse } from '@/lib/ai/types'

const STORAGE_KEY = 'aws_study_hint_cache_v2'
const MAX_ENTRIES = 120

type HintCacheStore = Record<string, HintResponse>

function readStore(): HintCacheStore {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as HintCacheStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store: HintCacheStore) {
  const keys = Object.keys(store)
  const trimmed =
    keys.length <= MAX_ENTRIES
      ? store
      : Object.fromEntries(keys.slice(-MAX_ENTRIES).map((key) => [key, store[key]]))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

function normalizeCachedHint(raw: HintResponse): HintResponse | null {
  const whatItsAsking = Array.isArray(raw.whatItsAsking)
    ? raw.whatItsAsking
    : toBulletList(raw.whatItsAsking as unknown, 2)
  const howToTackle = Array.isArray(raw.howToTackle)
    ? raw.howToTackle
    : toBulletList(raw.howToTackle as unknown, 3)
  if (!whatItsAsking.length) return null
  return {
    ...raw,
    whatItsAsking,
    howToTackle,
    deepNotesUrl: raw.deepNotesUrl ?? '/learn',
    deepNotesTitle: raw.deepNotesTitle ?? 'Deep Notes',
    deepNotesSection: raw.deepNotesSection ?? 'All domains',
    deepNotesIcon: raw.deepNotesIcon ?? '📖',
  }
}

export function getCachedHint(questionId: string): HintResponse | null {
  const raw = readStore()[questionId]
  if (!raw) return null
  return normalizeCachedHint(raw)
}

export function setCachedHint(questionId: string, hint: HintResponse) {
  const store = readStore()
  store[questionId] = hint
  writeStore(store)
}

export function clearCachedHint(questionId: string) {
  const store = readStore()
  delete store[questionId]
  writeStore(store)
}
