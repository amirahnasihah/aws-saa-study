export const CHAT_SESSION_KEY = 'aws_study_ai_chat_history'
export const HINT_SESSION_KEY = 'aws_study_hint_cache_v2'
export const AI_SESSION_CHANGED = 'ai-session-changed'

/** Shown in native confirm() for back / in-app links (browsers block custom beforeunload text). */
export const LEAVE_CONFIRM_MESSAGE =
  'You have an active study session. Leave this page?'

const LEGACY_CHAT_LOCAL_KEY = 'aws_study_ai_chat_history'
const LEGACY_HINT_LOCAL_KEY = 'aws_study_hint_cache_v2'

function migrateFromLocalStorage(sessionKey: string, localKey: string) {
  if (typeof window === 'undefined') return
  if (sessionStorage.getItem(sessionKey)) return
  const legacy = localStorage.getItem(localKey)
  if (!legacy) return
  sessionStorage.setItem(sessionKey, legacy)
  localStorage.removeItem(localKey)
}

export function ensureAISessionMigrated() {
  migrateFromLocalStorage(CHAT_SESSION_KEY, LEGACY_CHAT_LOCAL_KEY)
  migrateFromLocalStorage(HINT_SESSION_KEY, LEGACY_HINT_LOCAL_KEY)
}

export function readSessionJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  ensureAISessionMigrated()
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function notifyAISessionChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(AI_SESSION_CHANGED))
}

export function writeSessionJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(key, JSON.stringify(value))
  notifyAISessionChanged()
}

export function removeSessionKey(key: string) {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(key)
  notifyAISessionChanged()
}

/** True when this browser session still has AI chat or generated hints. */
export function hasAISessionData(): boolean {
  if (typeof window === 'undefined') return false
  ensureAISessionMigrated()

  try {
    const chat = readSessionJson<unknown[]>(CHAT_SESSION_KEY, [])
    if (Array.isArray(chat) && chat.length > 0) return true

    const hints = readSessionJson<Record<string, unknown>>(HINT_SESSION_KEY, {})
    if (hints && typeof hints === 'object' && Object.keys(hints).length > 0) return true
  } catch {
    return false
  }

  return false
}
