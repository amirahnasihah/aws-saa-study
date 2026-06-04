'use client'

import { useState } from 'react'
import { useAIProvider } from '@/hooks/useAIProvider'
import { getCachedHint, setCachedHint } from '@/hooks/useHintCache'
import AIKeyModal from '@/components/AIKeyModal'
import QuestionHintPanel from '@/components/ai/QuestionHintPanel'
import { buildAIRequestHeaders } from '@/lib/ai/client-headers'
import { needsByokKey, type ByokProvider } from '@/lib/ai/providers'
import type { HintResponse } from '@/lib/ai/types'

interface PracticeQuestionHintProps {
  questionId: string
  question: string
  domainLabel: string
  keywords: string[]
  options: Array<{ id: string; text: string }>
  reviewMode?: boolean
  onHintActive?: (active: boolean, highlightKeywords: string[]) => void
}

type UIState = 'idle' | 'awaiting-key' | 'loading' | 'done' | 'error'

function applyHint(
  data: HintResponse,
  onHintActive: PracticeQuestionHintProps['onHintActive']
) {
  onHintActive?.(true, data.studyKeywords)
}

function clearHint(onHintActive: PracticeQuestionHintProps['onHintActive']) {
  onHintActive?.(false, [])
}

export default function PracticeQuestionHint({
  questionId,
  question,
  domainLabel,
  keywords,
  options,
  reviewMode = false,
  onHintActive,
}: PracticeQuestionHintProps) {
  const { provider, key, saveKey } = useAIProvider()
  const [uiState, setUiState] = useState<UIState>('idle')
  const [hint, setHint] = useState<HintResponse | null>(null)
  const [fromCache, setFromCache] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [modalProvider, setModalProvider] = useState<ByokProvider>('anthropic')

  const showHint = (data: HintResponse, cached: boolean) => {
    setHint(data)
    setFromCache(cached)
    setUiState('done')
    applyHint(data, onHintActive)
  }

  const runHint = async (byokKey: string | null, skipCache = false) => {
    if (!skipCache) {
      const cached = getCachedHint(questionId)
      if (cached?.whatItsAsking?.length) {
        showHint(cached, true)
        return
      }
    }

    setUiState('loading')
    setErrorMsg(null)
    setFromCache(false)

    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: buildAIRequestHeaders(provider, byokKey),
        body: JSON.stringify({
          questionId,
          question,
          domainLabel,
          keywords,
          options,
          reviewMode,
        }),
      })

      if (!res.ok && !res.headers.get('content-type')?.includes('application/json')) {
        setErrorMsg('Hint failed. Try again.')
        setUiState('error')
        return
      }

      const data = (await res.json()) as HintResponse | { error: string }
      if ('error' in data) {
        setErrorMsg(data.error)
        setUiState('error')
      } else {
        setCachedHint(questionId, data)
        showHint(data, false)
      }
    } catch {
      setErrorMsg('Could not reach the AI service.')
      setUiState('error')
    }
  }

  const handleClick = () => {
    if (needsByokKey(provider) && !key) {
      setModalProvider(provider === 'ilmu' ? 'ilmu' : 'anthropic')
      setUiState('awaiting-key')
      return
    }
    void runHint(key)
  }

  const handleKeySaved = (newKey: string, keyProvider: ByokProvider) => {
    saveKey(newKey, keyProvider)
    void runHint(newKey)
  }

  const handleHide = () => {
    setHint(null)
    setFromCache(false)
    setUiState('idle')
    clearHint(onHintActive)
  }

  const handleRefresh = () => {
    void runHint(key, true)
  }

  return (
    <div className="px-5 pb-4 border-b border-aws-border/40">
      {uiState === 'awaiting-key' && (
        <AIKeyModal
          provider={modalProvider}
          onProviderChange={setModalProvider}
          onSave={handleKeySaved}
          onDismiss={() => setUiState('idle')}
        />
      )}

      {uiState !== 'done' && (
        <button
          type="button"
          onClick={handleClick}
          disabled={uiState === 'loading'}
          className="inline-flex items-center gap-1.5 font-space-mono text-[0.62rem] font-bold px-3 py-1.5 rounded-lg border border-c1/30 text-c1 bg-c1/8 hover:bg-c1/15 transition-all duration-150 disabled:opacity-50"
        >
          {uiState === 'loading' ? (
            <>
              <span className="inline-block w-2.5 h-2.5 border border-c1 border-t-transparent rounded-full animate-spin" />
              Generating hint…
            </>
          ) : (
            <>✦ Understand this question</>
          )}
        </button>
      )}

      {uiState === 'error' && errorMsg && (
        <p className="mt-2 font-space-mono text-[0.6rem] text-red-400">{errorMsg}</p>
      )}

      {uiState === 'done' && hint && (
        <div className="mt-3">
          <QuestionHintPanel hint={hint} fromCache={fromCache} />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleHide}
              className="font-space-mono text-[0.55rem] text-aws-muted/60 hover:text-aws-muted transition-colors"
            >
              Hide hint
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="font-space-mono text-[0.55rem] text-c1/60 hover:text-c1 transition-colors"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
