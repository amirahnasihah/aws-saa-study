'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

const KEY = 'aws-bookmarks'
const SCHEMA = 'aws_study_notes'
const TABLE = 'service_bookmarks'

function loadLocal(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function saveLocal(set: Set<string>) {
  localStorage.setItem(KEY, JSON.stringify([...set]))
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => new Set())
  const userIdRef = useRef<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const syncWithDb = async (userId: string) => {
      userIdRef.current = userId

      const { data, error } = await supabase
        .schema(SCHEMA)
        .from(TABLE)
        .select('short_name')
        .eq('user_id', userId)

      if (error) console.error('[bookmarks] failed to load from db', error)

      if (data && data.length > 0) {
        const remote = new Set(data.map((r: { short_name: string }) => r.short_name))
        const local = loadLocal()
        const merged = new Set([...remote, ...local])

        if (local.size > 0 && ![...local].every((s) => remote.has(s))) {
          const toInsert = [...local]
            .filter((s) => !remote.has(s))
            .map((short_name) => ({ user_id: userId, short_name }))
          if (toInsert.length > 0) {
            const { error: upErr } = await supabase
              .schema(SCHEMA)
              .from(TABLE)
              .upsert(toInsert, { onConflict: 'user_id,short_name' })
            if (upErr) console.error('[bookmarks] failed to sync local→db', upErr)
          }
        }

        saveLocal(merged)
        setBookmarks(merged)
      } else {
        const local = loadLocal()
        if (local.size > 0) {
          const toInsert = [...local].map((short_name) => ({ user_id: userId, short_name }))
          const { error: upErr } = await supabase
            .schema(SCHEMA)
            .from(TABLE)
            .upsert(toInsert, { onConflict: 'user_id,short_name' })
          if (upErr) console.error('[bookmarks] failed to seed db from local', upErr)
        }
        setBookmarks(local)
      }
    }

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setBookmarks(loadLocal())
        return
      }

      await syncWithDb(user.id)
    }

    init()

    // The provider lives in the root layout, which survives client-side
    // navigation — without this listener, signing in via /auth/login leaves
    // userIdRef null until a hard reload and every toggle stays local-only.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && userIdRef.current !== session.user.id) {
        syncWithDb(session.user.id)
      }
      if (event === 'SIGNED_OUT') {
        userIdRef.current = null
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const toggle = useCallback((shortName: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev)
      const removing = next.has(shortName)
      if (removing) { next.delete(shortName) } else { next.add(shortName) }
      saveLocal(next)

      if (userIdRef.current) {
        const supabase = createSupabaseBrowserClient()
        if (removing) {
          supabase
            .schema(SCHEMA)
            .from(TABLE)
            .delete()
            .eq('user_id', userIdRef.current)
            .eq('short_name', shortName)
            .then(({ error }) => {
              if (error) console.error('[bookmarks] failed to delete', error)
            })
        } else {
          supabase
            .schema(SCHEMA)
            .from(TABLE)
            .upsert(
              { user_id: userIdRef.current, short_name: shortName },
              { onConflict: 'user_id,short_name' },
            )
            .then(({ error }) => {
              if (error) console.error('[bookmarks] failed to save', error)
            })
        }
      }

      return next
    })
  }, [])

  const isBookmarked = useCallback(
    (shortName: string) => bookmarks.has(shortName),
    [bookmarks]
  )

  return { bookmarks, toggle, isBookmarked, count: bookmarks.size }
}
