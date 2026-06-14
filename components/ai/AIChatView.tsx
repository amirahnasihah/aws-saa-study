'use client'

import { useState, useRef, useEffect } from 'react'
import { type AIProvider } from '@/hooks/useAIProvider'
import { useAIChatHistory } from '@/hooks/useAIChatHistory'
import { buildAIRequestHeaders } from '@/lib/ai/client-headers'
import { byokProviderLabel, isByokProvider, needsByokKey } from '@/lib/ai/providers'
import AISourceLinks from '@/components/ai/AISourceLinks'
import CopyButton from '@/components/ai/CopyButton'
import BookmarkAnswerButton from '@/components/ai/BookmarkAnswerButton'
import { chatToMarkdown, downloadTextFile, exportFilenames } from '@/lib/export'
import type { ChatResponse } from '@/lib/ai/types'

interface AIChatViewProps {
  provider: AIProvider
  byokKey: string | null
}

type UIState = 'idle' | 'loading' | 'error'

const EXAMPLE_PROMPTS = [
  'Difference between SQS and SNS?',
  'Aurora vs RDS — when to use which?',
  'How does S3 cross-region replication work?',
  'Explain EC2 placement groups',
]

export default function AIChatView({ provider, byokKey }: AIChatViewProps) {
  const { messages, setMessages, clearHistory } = useAIChatHistory()
  const [input, setInput] = useState('')
  const [uiState, setUiState] = useState<UIState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, uiState])

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || uiState === 'loading') return
    if (needsByokKey(provider) && !byokKey) return

    const userMsg = { role: 'user' as const, content }
    const historyForApi = messages.map(({ role, content: c }) => ({ role, content: c }))

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setUiState('loading')
    setErrorMsg(null)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: buildAIRequestHeaders(provider, byokKey),
        body: JSON.stringify({ message: content, history: historyForApi }),
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
            internalLinks: data.internalLinks,
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
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="text-center space-y-1">
              <p className="font-space-mono text-[0.7rem] font-bold text-aws-text/60">
                Ask AI
              </p>
              <p className="font-space-mono text-[0.58rem] text-aws-muted/50">
                AWS services, architecture patterns, exam topics
              </p>
            </div>

            {!needsKey && (
              <div className="flex flex-wrap gap-1.5 justify-center max-w-sm">
                {EXAMPLE_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => void sendMessage(p)}
                    className="font-space-mono text-[0.56rem] text-aws-muted border border-aws-border/60 rounded-full px-3 py-1.5 hover:border-c1/40 hover:text-aws-text hover:bg-c1/5 transition-all duration-150"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {needsKey && (
              <p className="font-space-mono text-[0.58rem] text-amber-400/70 text-center max-w-xs">
                Add your API key to start chatting with{' '}
                {isByokProvider(provider) ? byokProviderLabel(provider) : 'this provider'}.
              </p>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            {msg.role === 'user' ? (
              <div className="flex flex-col items-end gap-1 max-w-[78%]">
                <div className="px-3.5 py-2.5 rounded-2xl rounded-tr-sm bg-c1/10 border border-c1/15 font-space-mono text-[0.78rem] text-aws-text leading-relaxed">
                  {msg.content}
                </div>
                <div className="pr-1">
                  <CopyButton text={msg.content} label="Copy your message" />
                </div>
              </div>
            ) : (
              <div className="max-w-[92%] space-y-2">
                <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-aws-card border border-aws-border/60 text-[0.82rem] text-aws-text leading-[1.8]">
                  {msg.content}
                </div>
                {msg.awsDocsUrl && msg.youtubeQuery && (
                  <AISourceLinks
                    awsDocsUrl={msg.awsDocsUrl}
                    awsDocsTitle={msg.awsDocsTitle}
                    youtubeQuery={msg.youtubeQuery}
                    internalLinks={msg.internalLinks}
                  />
                )}
                <div className="flex items-center gap-3 pl-1">
                  <CopyButton text={msg.content} label="Copy AI response" />
                  <BookmarkAnswerButton
                    question={messages[i - 1]?.role === 'user' ? messages[i - 1].content : ''}
                    answer={msg.content}
                    awsDocsUrl={msg.awsDocsUrl}
                    awsDocsTitle={msg.awsDocsTitle}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {uiState === 'loading' && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-aws-card border border-aws-border/60">
              <span className="inline-block w-2.5 h-2.5 border border-c1/60 border-t-transparent rounded-full animate-spin" />
              <span className="font-space-mono text-[0.6rem] text-aws-muted/60">Thinking…</span>
            </div>
          </div>
        )}

        {uiState === 'error' && errorMsg && (
          <p className="font-space-mono text-[0.6rem] text-red-400/80 pl-1">{errorMsg}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* BYOK key warning — above input when messages exist */}
      {needsKey && messages.length > 0 && (
        <p className="font-space-mono text-[0.58rem] text-amber-400/70 mb-2 shrink-0">
          Add your API key to continue chatting with{' '}
          {isByokProvider(provider) ? byokProviderLabel(provider) : 'this provider'}.
        </p>
      )}

      {/* Input row */}
      <div className="flex gap-1.5 pt-3 border-t border-aws-border/30 shrink-0">
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
          className="flex-1 px-4 py-2.5 rounded-xl bg-aws-card border border-aws-border/60 text-aws-text text-base sm:text-[0.8rem] font-space-mono placeholder:text-[0.7rem] sm:placeholder:text-[0.8rem] placeholder:tracking-tight placeholder:text-aws-muted/35 focus:outline-none focus:border-c1/40 transition-colors disabled:opacity-50"
        />

        {/* Download chat as Markdown, only when there are messages */}
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => downloadTextFile(exportFilenames.chat(), chatToMarkdown(messages))}
            title="Download chat as Markdown"
            aria-label="Download chat as Markdown"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-aws-border/40 text-aws-muted/35 hover:text-aws-muted hover:border-aws-border/70 transition-all duration-150 shrink-0"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 1.5v7M3.5 6l3 3 3-3M2 11.5h9" />
            </svg>
          </button>
        )}

        {/* Clear history — trash icon, only when there are messages */}
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            title="Clear chat history"
            aria-label="Clear chat history"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-aws-border/40 text-aws-muted/35 hover:text-aws-muted hover:border-aws-border/70 transition-all duration-150 shrink-0"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M10 3.5l-.6 7.5H3.6L3 3.5" />
              <path d="M5.5 6v3M7.5 6v3" />
            </svg>
          </button>
        )}

        {/* Send */}
        <button
          type="button"
          onClick={() => void sendMessage()}
          disabled={uiState === 'loading' || !input.trim() || needsKey}
          aria-label="Send"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-c1/25 text-c1 bg-c1/8 hover:bg-c1/15 hover:border-c1/40 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 1L1 7l5 2M13 1l-4 12-3-5" />
          </svg>
        </button>
      </div>
    </div>
  )
}
