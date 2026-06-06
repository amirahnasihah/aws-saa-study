'use client'

import { useEffect } from 'react'
import {
  AI_SESSION_CHANGED,
  hasAISessionData,
  LEAVE_CONFIRM_MESSAGE,
} from '@/lib/ai/session-persist'

function pushHistoryTrap() {
  if (!hasAISessionData()) return
  history.pushState({ aiUnloadGuard: true }, '', window.location.href)
}

function isInternalNavigationLink(anchor: HTMLAnchorElement): boolean {
  if (anchor.target === '_blank' || anchor.hasAttribute('download')) return false
  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:'))
    return false

  try {
    const dest = new URL(href, window.location.href)
    if (dest.origin !== window.location.origin) return false
    const samePath = dest.pathname === window.location.pathname
    const sameHash = dest.hash === window.location.hash
    return !(samePath && sameHash)
  } catch {
    return false
  }
}

/**
 * Native leave warnings when AI chat or hints exist in sessionStorage:
 * - beforeunload: tab/window close, refresh, external URL
 * - popstate + confirm: browser Back
 * - click capture + confirm: in-app links (Next.js <Link> etc.)
 */
export default function AIUnloadGuard() {
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasAISessionData()) return
      event.preventDefault()
      event.returnValue = ''
    }

    const onPopState = () => {
      if (!hasAISessionData()) return
      const leave = window.confirm(LEAVE_CONFIRM_MESSAGE)
      if (leave) {
        window.removeEventListener('popstate', onPopState)
        history.back()
        return
      }
      pushHistoryTrap()
    }

    const onLinkClick = (event: MouseEvent) => {
      if (!hasAISessionData()) return
      if (event.defaultPrevented) return
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return

      const anchor = (event.target as Element | null)?.closest('a')
      if (!anchor || !isInternalNavigationLink(anchor)) return

      const leave = window.confirm(LEAVE_CONFIRM_MESSAGE)
      if (!leave) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    const onSessionChanged = () => {
      if (hasAISessionData()) pushHistoryTrap()
    }

    pushHistoryTrap()

    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('popstate', onPopState)
    window.addEventListener(AI_SESSION_CHANGED, onSessionChanged)
    document.addEventListener('click', onLinkClick, true)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener(AI_SESSION_CHANGED, onSessionChanged)
      document.removeEventListener('click', onLinkClick, true)
    }
  }, [])

  return null
}
