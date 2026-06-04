'use client'

import { toBulletList } from '@/lib/ai/hint-bullets'
import {
  HINT_SESSION_KEY,
  readSessionJson,
  removeSessionKey,
  writeSessionJson,
} from '@/lib/ai/session-persist'
import type { HintResponse } from '@/lib/ai/types'

const MAX_ENTRIES = 120

type HintCacheStore = Record<string, HintResponse>

function readStore(): HintCacheStore {
  const parsed = readSessionJson<HintCacheStore>(HINT_SESSION_KEY, {})
  return parsed && typeof parsed === 'object' ? parsed : {}
}

function writeStore(store: HintCacheStore) {
  const keys = Object.keys(store)
  if (keys.length === 0) {
    removeSessionKey(HINT_SESSION_KEY)
    return
  }
  const trimmed =
    keys.length <= MAX_ENTRIES
      ? store
      : Object.fromEntries(keys.slice(-MAX_ENTRIES).map((key) => [key, store[key]]))
  writeSessionJson(HINT_SESSION_KEY, trimmed)
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
