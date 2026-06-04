'use client'

import { useState } from 'react'
import { useAIKey } from '@/hooks/useAIKey'
import AIKeyModal from '@/components/AIKeyModal'
import AIExplanationPanel from '@/components/AIExplanationPanel'

interface AskAIButtonProps {
  questionId: string
  question: string
  userAnswerId: string
  userAnswerText: string
  correctAnswerId: string
  correctAnswerText: string
  domainLabel: string
  keywords: string[]
}

type UIState = 'idle' | 'awaiting-key' | 'loading' | 'done' | 'error'

interface AIResult {
  explanation: string
  notesUrl: string
  awsDocsUrl: string
}

export default function AskAIButton({
  questionId,
  question,
  userAnswerId,
  userAnswerText,
  correctAnswerId,
  correctAnswerText,
  domainLabel,
  keywords,
}: AskAIButtonProps) {
  const { key, saveKey } = useAIKey()
  const [uiState, setUiState] = useState<UIState>('idle')
  const [result, setResult] = useState<AIResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fireRequest = async (apiKey: string) => {
    setUiState('loading')
    setErrorMsg(null)
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          questionId,
          question,
          userAnswerId,
          userAnswerText,
          correctAnswerId,
          correctAnswerText,
          domainLabel,
          keywords,
        }),
      })
      const data = (await res.json()) as AIResult | { error: string }
      if ('error' in data) {
        setErrorMsg(data.error)
        setUiState('error')
      } else {
        setResult(data)
        setUiState('done')
      }
    } catch {
      setErrorMsg('Could not reach the AI service. Check your connection.')
      setUiState('error')
    }
  }

  const handleClick = () => {
    if (!key) {
      setUiState('awaiting-key')
    } else {
      void fireRequest(key)
    }
  }

  const handleKeySaved = (newKey: string) => {
    saveKey(newKey)
    setUiState('loading')
    void fireRequest(newKey)
  }

  if (uiState === 'done' && result) {
    return (
      <AIExplanationPanel
        explanation={result.explanation}
        notesUrl={result.notesUrl}
        awsDocsUrl={result.awsDocsUrl}
        onDismiss={() => { setUiState('idle'); setResult(null) }}
      />
    )
  }

  return (
    <>
      {uiState === 'awaiting-key' && (
        <AIKeyModal
          onSave={handleKeySaved}
          onDismiss={() => setUiState('idle')}
        />
      )}

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleClick}
          disabled={uiState === 'loading'}
          className="inline-flex items-center gap-1.5 font-space-mono text-[0.62rem] font-bold px-3 py-1.5 rounded-lg border border-c1/30 text-c1 bg-c1/8 hover:bg-c1/15 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uiState === 'loading' ? (
            <>
              <span className="inline-block w-2.5 h-2.5 border border-c1 border-t-transparent rounded-full animate-spin" />
              Asking AI...
            </>
          ) : (
            <>✦ Ask AI</>
          )}
        </button>

        {uiState === 'error' && errorMsg && (
          <p className="font-space-mono text-[0.6rem] text-red-400">{errorMsg}</p>
        )}
      </div>
    </>
  )
}
