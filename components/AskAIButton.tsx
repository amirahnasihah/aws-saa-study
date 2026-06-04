'use client'

import { useState } from 'react'
import { useAIProvider } from '@/hooks/useAIProvider'
import AIKeyModal from '@/components/AIKeyModal'
import AIExplanationPanel from '@/components/AIExplanationPanel'
import { resolveByokProvider, type ByokProvider } from '@/lib/ai/providers'

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
  awsDocsTitle?: string
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
  const { provider: storedProvider, setProvider, key, saveKey, clearKey } = useAIProvider()
  const provider = resolveByokProvider(storedProvider, key)
  const [uiState, setUiState] = useState<UIState>('idle')
  const [result, setResult] = useState<AIResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fireRequest = async (apiKey: string, aiProvider: ByokProvider) => {
    setUiState('loading')
    setErrorMsg(null)
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'x-ai-provider': aiProvider,
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
      if (!res.ok && !res.headers.get('content-type')?.includes('application/json')) {
        setErrorMsg('AI explanation failed. Try again.')
        setUiState('error')
        return
      }
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
      void fireRequest(key, provider)
    }
  }

  const handleKeySaved = (newKey: string, keyProvider: ByokProvider) => {
    saveKey(newKey, keyProvider)
    setUiState('loading')
    void fireRequest(newKey, keyProvider)
  }

  if (uiState === 'done' && result) {
    return (
      <AIExplanationPanel
        provider={provider}
        explanation={result.explanation}
        notesUrl={result.notesUrl}
        awsDocsUrl={result.awsDocsUrl}
        awsDocsTitle={result.awsDocsTitle}
        onDismiss={() => {
          setUiState('idle')
          setResult(null)
        }}
        onRemoveKey={clearKey}
      />
    )
  }

  return (
    <>
      {uiState === 'awaiting-key' && (
        <AIKeyModal
          provider={provider}
          onProviderChange={setProvider}
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
