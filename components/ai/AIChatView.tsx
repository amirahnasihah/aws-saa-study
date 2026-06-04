'use client'

import { useState, useRef, useEffect } from 'react'
import { type AIProvider } from '@/hooks/useAIProvider'
import { useAIChatHistory } from '@/hooks/useAIChatHistory'
import { buildAIRequestHeaders } from '@/lib/ai/client-headers'
import { needsByokKey } from '@/lib/ai/providers'
import AISourceLinks from '@/components/ai/AISourceLinks'
import type { ChatResponse } from '@/lib/ai/types'

interface AIChatViewProps {
  provider: AIProvider
  byokKey: string | null
}

type UIState = 'idle' | 'loading' | 'error'

export default function AIChatView({ provider, byokKey }: AIChatViewProps) {
  const { messages, setMessages, clearHistory } = useAIChatHistory()
  const [input, setInput] = useState('')
  const [uiState, setUiState] = useState<UIState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, uiState])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || uiState === 'loading') return
    if (needsByokKey(provider) && !byokKey) return

    const userMsg = { role: 'user' as const, content: text }
    const historyForApi = messages.map(({ role, content }) => ({ role, content }))

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setUiState('loading')
    setErrorMsg(null)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: buildAIRequestHeaders(provider, byokKey),
        body: JSON.stringify({ message: text, history: historyForApi }),
      })

      if (!res.ok && !res.headers.get('content-type')?.includes('application/json')) {
        setErrorMsg('Request failed. Try again.')
        setUiState('error')
        return
      }

      const data = (await res.json()) as ChatResponse | { error: string }

      if ('error' in data) {
        setErrorMsg(data.error)
        setUiState('error')
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            awsDocsUrl: data.awsDocsUrl,
            awsDocsTitle: data.awsDocsTitle,
            youtubeQuery: data.youtubeQuery,
          },
        ])
        setUiState('idle')
      }
    } catch {
      setErrorMsg('Could not reach the AI service. Check your connection.')
      setUiState('error')
    }
  }

  const needsKey = needsByokKey(provider) && !byokKey

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {messages.length > 0 && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={clearHistory}
            className="font-space-mono text-[0.55rem] text-aws-muted/60 hover:text-aws-muted transition-colors"
          >
            Clear chat history
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-6 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <p className="font-space-mono text-[0.7rem] text-aws-muted/60 uppercase tracking-widest mb-2">
              AWS Study Assistant
            </p>
            <p className="font-space-mono text-[0.62rem] text-aws-muted/40">
              Ask any AWS question — services, architecture, exam topics
            </p>
            <p className="font-space-mono text-[0.58rem] text-aws-muted/30 mt-2">
              Chat is saved in this browser until you clear it
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            {msg.role === 'user' ? (
              <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-c1/10 border border-c1/20 font-space-mono text-[0.8rem] text-aws-text">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[92%] space-y-3">
                <div className="px-4 py-3 rounded-2xl bg-aws-card border border-aws-border text-[0.85rem] text-aws-text leading-[1.75]">
                  {msg.content}
                </div>
                {msg.awsDocsUrl && msg.youtubeQuery && (
                  <AISourceLinks
                    awsDocsUrl={msg.awsDocsUrl}
                    awsDocsTitle={msg.awsDocsTitle}
                    youtubeQuery={msg.youtubeQuery}
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {uiState === 'loading' && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-aws-card border border-aws-border">
              <span className="inline-block w-2.5 h-2.5 border border-c1 border-t-transparent rounded-full animate-spin" />
              <span className="font-space-mono text-[0.62rem] text-aws-muted">Thinking…</span>
            </div>
          </div>
        )}

        {uiState === 'error' && errorMsg && (
          <p className="font-space-mono text-[0.62rem] text-red-400 pl-1">{errorMsg}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {needsKey && (
        <p className="font-space-mono text-[0.62rem] text-amber-400 mb-2">
          Add your API key above to chat with {provider === 'ilmu' ? 'ILMU' : 'Claude'}.
        </p>
      )}

      <div className="flex gap-2 pt-4 border-t border-aws-border/40">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void sendMessage()
            }
          }}
          placeholder="Ask an AWS question…"
          disabled={uiState === 'loading' || needsKey}
          className="flex-1 px-4 py-2.5 rounded-xl bg-aws-card border border-aws-border text-aws-text text-[0.82rem] font-space-mono placeholder:text-aws-muted/40 focus:outline-none focus:border-c1/50 transition-colors disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => void sendMessage()}
          disabled={uiState === 'loading' || !input.trim() || needsKey}
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-c1/30 text-c1 bg-c1/8 hover:bg-c1/15 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          aria-label="Send"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 1L1 7l5 2M13 1l-4 12-3-5" />
          </svg>
        </button>
      </div>
    </div>
  )
}
