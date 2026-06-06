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
        {/* Single compact toolbar — mode + provider in one row */}
        <div className="shrink-0 border-b border-aws-border/20">
          <div className="max-w-2xl mx-auto px-4 h-11 flex items-center gap-2 overflow-x-auto nav-scroll">
            {/* Mode tabs — underline indicator */}
            <div className="flex items-center shrink-0">
              {(['chat', 'question'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`relative px-3 h-11 font-space-mono text-[0.6rem] transition-colors whitespace-nowrap ${
                    mode === m ? 'text-aws-text' : 'text-aws-muted hover:text-aws-text'
                  }`}
                >
                  {m === 'chat' ? 'Chat' : 'Explain'}
                  {mode === m && (
                    <span className="absolute bottom-0 left-2 right-2 h-px bg-c1 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <span className="w-px h-4 bg-aws-border/50 mx-1 shrink-0" />

            {/* Provider toggle */}
            <AIProviderToggle provider={provider} onSelect={handleProviderSelect} />

            {/* Remove key — only when BYOK active with saved key */}
            {needsByokKey(provider) && key && (
              <button
                type="button"
                onClick={clearKey}
                title="Remove saved API key"
                className="ml-1 shrink-0 font-space-mono text-[0.52rem] text-aws-muted/40 hover:text-red-400/80 transition-colors"
              >
                ✕ key
              </button>
            )}
          </div>
        </div>

        {/* Chat / question area */}
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
