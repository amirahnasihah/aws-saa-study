'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import AIKeyModal from '@/components/AIKeyModal'
import AIProviderToggle from '@/components/ai/AIProviderToggle'
import AIChatView from '@/components/ai/AIChatView'
import AIQuestionView from '@/components/ai/AIQuestionView'
import { useAIProvider, type AIProvider } from '@/hooks/useAIProvider'
import { needsByokKey, type ByokProvider } from '@/lib/ai/providers'

type Mode = 'chat' | 'question'

function AIPageContent() {
  const searchParams = useSearchParams()
  const { provider, setProvider, key, saveKey, clearKey } = useAIProvider()
  const [mode, setMode] = useState<Mode>(() =>
    searchParams.get('mode') === 'question' ? 'question' : 'chat'
  )
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [modalProvider, setModalProvider] = useState<ByokProvider>('anthropic')

  const initialQuestion = searchParams.get('question') ?? ''
  const initialDomain = searchParams.get('domain') ?? ''
  const initialKeywords = searchParams.get('keywords')?.split(',').filter(Boolean) ?? []
  const initialCorrectAnswer = searchParams.get('correctAnswer') ?? ''

  const handleProviderSelect = (p: AIProvider) => {
    if (needsByokKey(p) && !key) {
      setModalProvider(p)
      setShowKeyModal(true)
      return
    }
    setProvider(p)
  }

  const handleKeySaved = (k: string, keyProvider: ByokProvider) => {
    saveKey(k, keyProvider)
    setProvider(keyProvider)
    setShowKeyModal(false)
  }

  return (
    <>
      {showKeyModal && (
        <AIKeyModal
          provider={modalProvider}
          onProviderChange={setModalProvider}
          onSave={handleKeySaved}
          onDismiss={() => setShowKeyModal(false)}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c1/60">
              ✦ AI Study Assistant
            </span>
          </div>
          <h1 className="font-space-mono text-xl font-bold text-aws-text mb-1">Ask AI</h1>
          <p className="font-space-mono text-[0.7rem] text-aws-muted">
            Free-form AWS chat or question explainer — with official docs and tutorials.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-aws-card border border-aws-border">
            <button
              type="button"
              onClick={() => setMode('chat')}
              className={`px-3 py-1.5 rounded-md font-space-mono text-[0.6rem] uppercase tracking-widest transition-all duration-150 ${
                mode === 'chat'
                  ? 'bg-aws-bg border border-aws-border text-aws-text'
                  : 'text-aws-muted hover:text-aws-text border border-transparent'
              }`}
            >
              💬 Chat
            </button>
            <button
              type="button"
              onClick={() => setMode('question')}
              className={`px-3 py-1.5 rounded-md font-space-mono text-[0.6rem] uppercase tracking-widest transition-all duration-150 ${
                mode === 'question'
                  ? 'bg-aws-bg border border-aws-border text-aws-text'
                  : 'text-aws-muted hover:text-aws-text border border-transparent'
              }`}
            >
              ✦ Explain question
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <AIProviderToggle provider={provider} onSelect={handleProviderSelect} />
            {needsByokKey(provider) && key && (
              <button
                type="button"
                onClick={clearKey}
                className="font-space-mono text-[0.55rem] text-aws-muted/50 hover:text-red-400 transition-colors"
              >
                Remove key
              </button>
            )}
          </div>
        </div>

        {mode === 'chat' ? (
          <AIChatView provider={provider} byokKey={key} />
        ) : (
          <AIQuestionView
            provider={provider}
            byokKey={key}
            initialQuestion={initialQuestion}
            initialDomain={initialDomain}
            initialKeywords={initialKeywords}
            initialCorrectAnswer={initialCorrectAnswer}
          />
        )}
      </div>
    </>
  )
}

export default function AIPage() {
  return (
    <>
      <Nav activePage="practice" />
      <main className="min-h-screen bg-aws-bg text-aws-text">
        <Suspense
          fallback={
            <div className="pt-24 text-center font-space-mono text-[0.7rem] text-aws-muted">
              Loading…
            </div>
          }
        >
          <AIPageContent />
        </Suspense>
      </main>
      <SiteFooter tagline="AWS SAA-C03 · AI Study Assistant · Docs + tutorials on every answer" />
    </>
  )
}
