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
  const [modalProvider, setModalProvider] = useState<ByokProvider>('openrouter')

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

      <div className="flex flex-col h-full">
        {/* Page header */}
        <div className="shrink-0 px-4 pt-6 pb-4 border-b border-aws-border/30">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-lg font-bold text-aws-text mb-0.5">Ask AI</h1>
            <p className="font-space-mono text-[0.65rem] text-aws-muted">
              AWS study chat and question explainer — with official docs and tutorials.
            </p>
          </div>
        </div>

        {/* Controls bar */}
        <div className="shrink-0 px-4 py-3 border-b border-aws-border/20">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            {/* Mode toggle */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-aws-card border border-aws-border">
              <button
                type="button"
                onClick={() => setMode('chat')}
                className={`px-3 py-1.5 rounded-md font-space-mono text-[0.6rem] transition-all duration-150 ${
                  mode === 'chat'
                    ? 'bg-aws-bg border border-aws-border text-aws-text'
                    : 'text-aws-muted hover:text-aws-text border border-transparent'
                }`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setMode('question')}
                className={`px-3 py-1.5 rounded-md font-space-mono text-[0.6rem] transition-all duration-150 ${
                  mode === 'question'
                    ? 'bg-aws-bg border border-aws-border text-aws-text'
                    : 'text-aws-muted hover:text-aws-text border border-transparent'
                }`}
              >
                Explain question
              </button>
            </div>

            {/* Provider toggle + remove key */}
            <div className="flex items-center gap-2 flex-wrap">
              <AIProviderToggle provider={provider} onSelect={handleProviderSelect} />
              {needsByokKey(provider) && key && (
                <button
                  type="button"
                  onClick={clearKey}
                  className="font-space-mono text-[0.53rem] text-aws-muted/50 hover:text-red-400 transition-colors"
                >
                  Remove key
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat / question area — fills remaining height */}
        <div className="flex-1 overflow-hidden px-4 py-4">
          <div className="max-w-2xl mx-auto h-full">
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
        </div>
      </div>
    </>
  )
}

export default function AIPage() {
  return (
    <div className="h-screen flex flex-col bg-aws-bg text-aws-text">
      <Nav activePage="ai" />

      {/* Content fills remaining height below nav */}
      <div className="flex-1 flex flex-col overflow-hidden mt-14">
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center">
              <span className="font-space-mono text-[0.65rem] text-aws-muted">Loading…</span>
            </div>
          }
        >
          <AIPageContent />
        </Suspense>
      </div>

      <SiteFooter tagline="AWS SAA-C03 · AI Study Assistant" />
    </div>
  )
}
