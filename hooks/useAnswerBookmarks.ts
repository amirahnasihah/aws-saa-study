'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

const KEY = 'aws-ai-answer-bookmarks'
const SCHEMA = 'aws_study_notes'
const TABLE = 'answer_bookmarks'

export interface AnswerBookmark {
  id: string
  question: string
  answer: string
  awsDocsUrl?: string
  awsDocsTitle?: string
  savedAt: number
}

/** Stable id from question + answer so re-saving the same answer is idempotent. */
export function answerKey(question: string, answer: string): string {
  const input = `${question} ${answer}`
  const hash = [...input].reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0)
  return `a${(hash >>> 0).toString(36)}`
}

interface SupaAnswerRow {
  id: number
  question: string
  answer: string
  aws_docs_url: string | null
  aws_docs_title: string | null
  created_at: string
}

function rowToBookmark(row: SupaAnswerRow): AnswerBookmark {
  return {
    id: answerKey(row.question, row.answer),
    question: row.question,
    answer: row.answer,
    awsDocsUrl: row.aws_docs_url ?? undefined,
    awsDocsTitle: row.aws_docs_title ?? undefined,
    savedAt: new Date(row.created_at).getTime(),
  }
}

function loadLocal(): AnswerBookmark[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AnswerBookmark[]) : []
  } catch {
    return []
  }
}

function saveLocal(list: AnswerBookmark[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function useAnswerBookmarks() {
  const [answers, setAnswers] = useState<AnswerBookmark[]>(() => [])
  const userIdRef = useRef<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const syncWithDb = async (userId: string) => {
      userIdRef.current = userId

      const { data } = await supabase
        .schema(SCHEMA)
        .from(TABLE)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        const remote = (data as SupaAnswerRow[]).map(rowToBookmark)
        const local = loadLocal()
        const remoteIds = new Set(remote.map((r) => r.id))
        const localOnly = local.filter((l) => !remoteIds.has(l.id))

        if (localOnly.length > 0) {
          const toInsert = localOnly.map((l) => ({
            user_id: userId,
            question: l.question,
            answer: l.answer,
            aws_docs_url: l.awsDocsUrl ?? null,
            aws_docs_title: l.awsDocsTitle ?? null,
          }))
          await supabase.schema(SCHEMA).from(TABLE).insert(toInsert)
        }

        const merged = [...localOnly, ...remote].sort((a, b) => b.savedAt - a.savedAt)
        saveLocal(merged)
        setAnswers(merged)
      } else {
        const local = loadLocal()
        if (local.length > 0) {
          const toInsert = local.map((l) => ({
            user_id: userId,
            question: l.question,
            answer: l.answer,
            aws_docs_url: l.awsDocsUrl ?? null,
            aws_docs_title: l.awsDocsTitle ?? null,
          }))
          await supabase.schema(SCHEMA).from(TABLE).insert(toInsert)
        }
        setAnswers(local)
      }
    }

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setAnswers(loadLocal())
        return
      }

      await syncWithDb(user.id)
    }

    init()

    // The provider lives in the root layout, which survives client-side
    // navigation — without this listener, signing in via /auth/login leaves
    // userIdRef null until a hard reload and every save stays local-only.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && userIdRef.current !== session.user.id) {
        syncWithDb(session.user.id)
      }
      if (event === 'SIGNED_OUT') {
        userIdRef.current = null
      }
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = useCallback((entry: Omit<AnswerBookmark, 'id' | 'savedAt'>) => {
    const id = answerKey(entry.question, entry.answer)
    setAnswers((prev) => {
      const exists = prev.some((a) => a.id === id)
      const next = exists
        ? prev.filter((a) => a.id !== id)
        : [{ ...entry, id, savedAt: Date.now() }, ...prev]
      saveLocal(next)

      if (userIdRef.current) {
        const supabase = createSupabaseBrowserClient()
        if (exists) {
          supabase
            .schema(SCHEMA)
            .from(TABLE)
            .delete()
            .eq('user_id', userIdRef.current)
            .eq('question', entry.question)
            .eq('answer', entry.answer)
            .then()
        } else {
          supabase
            .schema(SCHEMA)
            .from(TABLE)
            .insert({
              user_id: userIdRef.current,
              question: entry.question,
              answer: entry.answer,
              aws_docs_url: entry.awsDocsUrl ?? null,
              aws_docs_title: entry.awsDocsTitle ?? null,
            })
            .then()
        }
      }

      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setAnswers((prev) => {
      const target = prev.find((a) => a.id === id)
      const next = prev.filter((a) => a.id !== id)
      saveLocal(next)

      if (userIdRef.current && target) {
        const supabase = createSupabaseBrowserClient()
        supabase
          .schema(SCHEMA)
          .from(TABLE)
          .delete()
          .eq('user_id', userIdRef.current)
          .eq('question', target.question)
          .eq('answer', target.answer)
          .then()
      }

      return next
    })
  }, [])

  const clear = useCallback(() => {
    setAnswers([])
    saveLocal([])

    if (userIdRef.current) {
      const supabase = createSupabaseBrowserClient()
      supabase
        .schema(SCHEMA)
        .from(TABLE)
        .delete()
        .eq('user_id', userIdRef.current)
        .then()
    }
  }, [])

  const isBookmarked = useCallback(
    (question: string, answer: string) => answers.some((a) => a.id === answerKey(question, answer)),
    [answers]
  )

  return { answers, toggle, remove, clear, isBookmarked, count: answers.length }
}
