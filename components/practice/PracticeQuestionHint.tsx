'use client'

import { useState } from 'react'
import { useAIProvider } from '@/hooks/useAIProvider'
import AIKeyModal from '@/components/AIKeyModal'
import QuestionHintPanel from '@/components/ai/QuestionHintPanel'
import { buildAIRequestHeaders } from '@/lib/ai/client-headers'
import { needsByokKey, type ByokProvider } from '@/lib/ai/providers'
import type { HintResponse } from '@/lib/ai/types'

interface PracticeQuestionHintProps {
  question: string
  domainLabel: string
  keywords: string[]
  options: Array<{ id: string; text: string }>
  reviewMode?: boolean
}

type UIState = 'idle' | 'awaiting-key' | 'loading' | 'done' | 'error'

export default function PracticeQuestionHint({
  question,
  domainLabel,
  keywords,
  options,
  reviewMode = false,
}: PracticeQuestionHintProps) {
  const { provider, key, saveKey } = useAIProvider()
  const [uiState, setUiState] = useState<UIState>('idle')
  const [hint, setHint] = useState<HintResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [modalProvider, setModalProvider] = useState<ByokProvider>('anthropic')

  const runHint = async (byokKey: string | null) => {
    setUiState('loading')
    setErrorMsg(null)

    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: buildAIRequestHeaders(provider, byokKey),
        body: JSON.stringify({
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
        setHint(data)
        setUiState('done')
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
    setUiState('loading')
    void runHint(newKey)
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
          <QuestionHintPanel hint={hint} />
          <button
            type="button"
            onClick={() => {
              setHint(null)
              setUiState('idle')
            }}
            className="mt-3 font-space-mono text-[0.55rem] text-aws-muted/60 hover:text-aws-muted transition-colors"
          >
            Hide hint
          </button>
        </div>
      )}
    </div>
  )
}
