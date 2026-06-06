'use client'

import { useState } from 'react'
import { type AIProvider } from '@/hooks/useAIProvider'
import { buildAIRequestHeaders } from '@/lib/ai/client-headers'
import { byokProviderLabel, isByokProvider, needsByokKey } from '@/lib/ai/providers'
import type { ExplainResponse } from '@/lib/ai/types'
import AIQuestionExplanation from '@/components/ai/AIQuestionExplanation'

interface AIQuestionViewProps {
  provider: AIProvider
  byokKey: string | null
  initialQuestion?: string
  initialDomain?: string
  initialKeywords?: string[]
  initialCorrectAnswer?: string
}

type UIState = 'idle' | 'loading' | 'done' | 'error'

export default function AIQuestionView({
  provider,
  byokKey,
  initialQuestion = '',
  initialDomain = '',
  initialKeywords = [],
  initialCorrectAnswer = '',
}: AIQuestionViewProps) {
  const [question, setQuestion] = useState(initialQuestion)
  const [domain, setDomain] = useState(initialDomain)
  const [correctAnswer, setCorrectAnswer] = useState(initialCorrectAnswer)
  const [uiState, setUiState] = useState<UIState>('idle')
  const [result, setResult] = useState<ExplainResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleExplain = async () => {
    if (!question.trim()) return
    if (needsByokKey(provider) && !byokKey) return

    setUiState('loading')
    setErrorMsg(null)
    setResult(null)

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: buildAIRequestHeaders(provider, byokKey),
        body: JSON.stringify({
          question,
          domainLabel: domain || 'AWS Solutions Architect',
          keywords: initialKeywords,
          correctAnswerText: correctAnswer || undefined,
        }),
      })

      if (!res.ok && !res.headers.get('content-type')?.includes('application/json')) {
        setErrorMsg('Request failed. Try again.')
        setUiState('error')
        return
      }

      const data = (await res.json()) as ExplainResponse | { error: string }
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

  const needsKey = needsByokKey(provider) && !byokKey

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted mb-2">
          Question
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Paste an AWS practice question here…"
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-aws-card border border-aws-border text-aws-text text-base sm:text-[0.85rem] leading-relaxed font-space-mono placeholder:text-aws-muted/40 focus:outline-none focus:border-c1/50 resize-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted mb-2">
            Domain (optional)
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. Resilient Architectures"
            className="w-full px-3 py-2 rounded-lg bg-aws-card border border-aws-border text-aws-text text-[0.75rem] font-space-mono placeholder:text-aws-muted/40 focus:outline-none focus:border-c1/50 transition-colors"
          />
        </div>
        <div>
          <label className="block font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted mb-2">
            Correct answer (optional)
          </label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="e.g. Use S3 with versioning…"
            className="w-full px-3 py-2 rounded-lg bg-aws-card border border-aws-border text-aws-text text-[0.75rem] font-space-mono placeholder:text-aws-muted/40 focus:outline-none focus:border-c1/50 transition-colors"
          />
        </div>
      </div>

      {needsKey && (
        <p className="font-space-mono text-[0.62rem] text-amber-400">
          Add your API key above to use{' '}
          {isByokProvider(provider) ? byokProviderLabel(provider) : 'this provider'}.
        </p>
      )}

      <button
        type="button"
        onClick={() => void handleExplain()}
        disabled={uiState === 'loading' || !question.trim() || needsKey}
        className="inline-flex items-center gap-2 font-space-mono text-[0.62rem] font-bold px-4 py-2 rounded-lg border border-c1/30 text-c1 bg-c1/8 hover:bg-c1/15 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uiState === 'loading' ? (
          <>
            <span className="inline-block w-3 h-3 border border-c1 border-t-transparent rounded-full animate-spin" />
            Analyzing…
          </>
        ) : (
          <>✦ Explain this question</>
        )}
      </button>

      {uiState === 'error' && errorMsg && (
        <p className="font-space-mono text-[0.62rem] text-red-400">{errorMsg}</p>
      )}

      {uiState === 'done' && result && (
        <div className="mt-2 pt-4 border-t border-aws-border/40">
          <AIQuestionExplanation
            conceptName={result.conceptName}
            focusArea={result.focusArea}
            studyKeywords={result.studyKeywords}
            explanation={result.explanation}
            awsDocsUrl={result.awsDocsUrl}
            awsDocsTitle={result.awsDocsTitle}
          />
        </div>
      )}
    </div>
  )
}
