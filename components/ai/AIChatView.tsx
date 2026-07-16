'use client'

import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from 'react'
import { type AIProvider } from '@/hooks/useAIProvider'
import { useAIChatHistory } from '@/hooks/useAIChatHistory'
import { buildAIRequestHeaders } from '@/lib/ai/client-headers'
import { byokProviderLabel, isByokProvider, needsByokKey } from '@/lib/ai/providers'
import type { InternalLink } from '@/lib/ai/internal-links'
import AISourceLinks from '@/components/ai/AISourceLinks'
import CopyButton from '@/components/ai/CopyButton'
import BookmarkAnswerButton from '@/components/ai/BookmarkAnswerButton'
import ChatMarkdown from '@/components/ai/ChatMarkdown'
import { chatToMarkdown, downloadTextFile, exportFilenames } from '@/lib/export'

interface AIChatViewProps {
  provider: AIProvider
  byokKey: string | null
}

interface DoneMeta {
  awsDocsUrl?: string
  awsDocsTitle?: string
  youtubeQuery?: string
  internalLinks?: InternalLink[]
}

const EXAMPLE_PROMPTS = [
  'Difference between SQS and SNS?',
  'Aurora vs RDS — when to use which?',
  'How does S3 cross-region replication work?',
  'Explain EC2 placement groups',
]

// Touch detection via media query — useSyncExternalStore keeps it SSR-safe and
// effect-free (no setState-in-effect), updating if the pointer type changes.
const COARSE_QUERY = '(pointer: coarse)'
function subscribeCoarse(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined
  const mq = window.matchMedia(COARSE_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
function getCoarse(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(COARSE_QUERY).matches
}

/** Parse one SSE record ("event: x\ndata: {...}") into { event, data }. */
function parseSseEvent(raw: string): { event: string; data: unknown } | null {
  const lines = raw.split('\n')
  const dataLine = lines.find((l) => l.startsWith('data:'))
  if (!dataLine) return null
  const eventLine = lines.find((l) => l.startsWith('event:'))
  const event = eventLine ? eventLine.slice(6).trim() : 'message'
  const payload = dataLine.slice(5).trim()
  try {
    return { event, data: payload ? JSON.parse(payload) : null }
  } catch {
    return null
  }
}

export default function AIChatView({ provider, byokKey }: AIChatViewProps) {
  const { messages, setMessages, clearHistory } = useAIChatHistory()
  const [input, setInput] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [queue, setQueue] = useState<string[]>([])
  // null = not streaming; '' = awaiting first token; otherwise live answer text.
  const [streamingText, setStreamingText] = useState<string | null>(null)
  const [toolRunning, setToolRunning] = useState(false)
  const isTouch = useSyncExternalStore(subscribeCoarse, getCoarse, () => false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesRef = useRef(messages)
  const queueRef = useRef<string[]>([])
  const drainingRef = useRef(false)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText, queue])

  // Auto-grow the textarea with its content, capped at ~6 lines.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`
  }, [input])

  const busy = streamingText !== null

  const requestReply = useCallback(
    async (
      content: string,
      history: { role: string; content: string }[]
    ): Promise<{ content: string } | null> => {
      setErrorMsg(null)
      setStreamingText('')
      setToolRunning(false)

      let acc = ''
      let meta: DoneMeta = {}

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: buildAIRequestHeaders(provider, byokKey),
          body: JSON.stringify({ message: content, history }),
        })

        if (!res.ok || !res.body) {
          let msg = 'Request failed. Try again.'
          try {
            const j = (await res.json()) as { error?: string }
            if (j.error) msg = j.error
          } catch {
            // non-JSON body — keep the generic message
          }
          setErrorMsg(msg)
          setStreamingText(null)
          return null
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let streamError: string | null = null

        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          let sep = buffer.indexOf('\n\n')
          while (sep !== -1) {
            const parsed = parseSseEvent(buffer.slice(0, sep))
            buffer = buffer.slice(sep + 2)
            if (parsed?.event === 'delta') {
              acc += (parsed.data as { text?: string }).text ?? ''
              setStreamingText(acc)
              setToolRunning(false)
            } else if (parsed?.event === 'tool') {
              setToolRunning(true)
            } else if (parsed?.event === 'done') {
              meta = (parsed.data as DoneMeta) ?? {}
            } else if (parsed?.event === 'error') {
              streamError = (parsed.data as { error?: string }).error ?? 'AI chat failed.'
            }
            sep = buffer.indexOf('\n\n')
          }
        }

        if (streamError || acc === '') {
          setErrorMsg(streamError ?? 'No response. Try again.')
          setStreamingText(null)
          return null
        }

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: acc,
            awsDocsUrl: meta.awsDocsUrl,
            awsDocsTitle: meta.awsDocsTitle,
            youtubeQuery: meta.youtubeQuery,
            internalLinks: meta.internalLinks,
          },
        ])
        setStreamingText(null)
        return { content: acc }
      } catch {
        setErrorMsg('Could not reach the AI service. Check your connection.')
        setStreamingText(null)
        return null
      }
    },
    [provider, byokKey, setMessages]
  )

  // Sequential queue worker — processes one message fully (user + answer)
  // before starting the next, threading a running history for correct context.
  const drain = useCallback(async () => {
    if (drainingRef.current) return
    drainingRef.current = true

    let history = messagesRef.current.map((m) => ({ role: m.role, content: m.content }))

    while (queueRef.current.length > 0) {
      const content = queueRef.current[0]
      queueRef.current = queueRef.current.slice(1)
      setQueue((q) => q.slice(1))
      setMessages((prev) => [...prev, { role: 'user', content }])

      const answer = await requestReply(content, history)
      if (!answer) break // error — stop, leaving any remaining items queued

      history = [
        ...history,
        { role: 'user', content },
        { role: 'assistant', content: answer.content },
      ]
    }

    drainingRef.current = false
  }, [requestReply, setMessages])

  const sendMessage = useCallback(
    (text?: string) => {
      const content = (text ?? input).trim()
      if (!content) return
      if (needsByokKey(provider) && !byokKey) return
      queueRef.current = [...queueRef.current, content]
      setQueue((q) => [...q, content])
      setInput('')
      setErrorMsg(null)
      void drain()
    },
    [input, provider, byokKey, drain]
  )

  const retryLast = useCallback(() => {
    if (drainingRef.current) return
    const msgs = messagesRef.current
    const last = msgs[msgs.length - 1]
    if (!last || last.role !== 'user') return
    setErrorMsg(null)
    const history = msgs.slice(0, -1).map((m) => ({ role: m.role, content: m.content }))
    void (async () => {
      drainingRef.current = true
      const answer = await requestReply(last.content, history)
      drainingRef.current = false
      if (answer && queueRef.current.length > 0) void drain()
    })()
  }, [requestReply, drain])

  // Edit a previously-sent question: pull it back into the composer and trim the
  // conversation from that turn onward, so re-sending continues with clean
  // context (the stale answer + later turns are dropped, ChatGPT-style).
  const editMessage = useCallback(
    (index: number) => {
      if (drainingRef.current || streamingText !== null || queueRef.current.length > 0) return
      const msg = messagesRef.current[index]
      if (!msg || msg.role !== 'user') return
      setInput(msg.content)
      setMessages((prev) => prev.slice(0, index))
      setErrorMsg(null)
      requestAnimationFrame(() => {
        const el = textareaRef.current
        if (!el) return
        el.focus()
        const pos = msg.content.length
        el.setSelectionRange(pos, pos)
      })
    },
    [streamingText, setMessages]
  )

  // Insert a newline at the caret — the mobile-friendly alternative to
  // Shift+Enter (soft keyboards have no Shift, and Enter sends on desktop).
  const insertNewline = useCallback(() => {
    const el = textareaRef.current
    const start = el?.selectionStart ?? input.length
    const end = el?.selectionEnd ?? input.length
    const next = `${input.slice(0, start)}\n${input.slice(end)}`
    setInput(next)
    requestAnimationFrame(() => {
      if (!el) return
      el.focus()
      const pos = start + 1
      el.setSelectionRange(pos, pos)
    })
  }, [input])

  const needsKey = needsByokKey(provider) && !byokKey

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar — download / clear, only with history */}
      {messages.length > 0 && (
        <div className="flex items-center justify-end gap-1.5 pb-2 mb-1 border-b border-aws-border/20 shrink-0">
          <button
            type="button"
            onClick={() => downloadTextFile(exportFilenames.chat(), chatToMarkdown(messages))}
            title="Download chat as Markdown"
            aria-label="Download chat as Markdown"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-aws-border/40 text-aws-muted/40 hover:text-aws-muted hover:border-aws-border/70 transition-all duration-150"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 1.5v7M3.5 6l3 3 3-3M2 11.5h9" />
            </svg>
          </button>
          <button
            type="button"
            onClick={clearHistory}
            disabled={busy}
            title="Clear chat history"
            aria-label="Clear chat history"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-aws-border/40 text-aws-muted/40 hover:text-red-400/70 hover:border-red-400/30 transition-all duration-150 disabled:opacity-40"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M10 3.5l-.6 7.5H3.6L3 3.5" />
              <path d="M5.5 6v3M7.5 6v3" />
            </svg>
          </button>
        </div>
      )}

      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-3">
        {messages.length === 0 && streamingText === null && queue.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="text-center space-y-1.5">
              <span className="inline-flex text-c1 text-[1.4rem] leading-none animate-sparkle-main">✦</span>
              <p className="font-space-mono text-[0.7rem] font-bold text-aws-text/70">Ask AI</p>
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
                    onClick={() => sendMessage(p)}
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
                <div className="px-3.5 py-2.5 rounded-2xl rounded-tr-sm bg-c1/10 border border-c1/15 font-space-mono text-[0.78rem] text-aws-text leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </div>
                <div className="flex items-center gap-2 pr-1">
                  <CopyButton text={msg.content} label="Copy your message" />
                  {!busy && queue.length === 0 && (
                    <button
                      type="button"
                      onClick={() => editMessage(i)}
                      title="Edit & resend"
                      aria-label="Edit and resend this message"
                      className="text-aws-muted/40 hover:text-c1 transition-colors duration-150"
                    >
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13l-3 1 1-3 8.5-8.5Z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-[92%] space-y-2">
                <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-aws-card border border-aws-border/60">
                  <ChatMarkdown content={msg.content} />
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

        {/* Live streaming answer */}
        {streamingText !== null && (
          <div className="flex justify-start">
            <div className="max-w-[92%]">
              <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-aws-card border border-aws-border/60">
                {streamingText === '' ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 border border-c1/60 border-t-transparent rounded-full animate-spin" />
                    <span className="font-space-mono text-[0.6rem] text-aws-muted/60">
                      {toolRunning ? 'Fetching AWS diagram…' : 'Thinking…'}
                    </span>
                  </div>
                ) : (
                  <ChatMarkdown content={`${streamingText}▍`} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Queued messages waiting their turn */}
        {queue.map((q, i) => (
          <div key={`q-${i}`} className="flex justify-end">
            <div className="flex flex-col items-end gap-1 max-w-[78%] opacity-50">
              <div className="px-3.5 py-2.5 rounded-2xl rounded-tr-sm bg-c1/5 border border-c1/20 border-dashed font-space-mono text-[0.78rem] text-aws-text/70 leading-relaxed whitespace-pre-wrap break-words">
                {q}
              </div>
              <span className="font-space-mono text-[0.52rem] uppercase tracking-wider text-aws-muted/50 pr-1">
                queued
              </span>
            </div>
          </div>
        ))}

        {errorMsg && (
          <div className="flex items-center gap-2 pl-1">
            <p className="font-space-mono text-[0.6rem] text-red-400/80">{errorMsg}</p>
            <button
              type="button"
              onClick={retryLast}
              className="font-space-mono text-[0.6rem] text-aws-muted/60 hover:text-c1 underline transition-colors"
            >
              Retry
            </button>
          </div>
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
      <div className="shrink-0 pt-3 border-t border-aws-border/30">
        <div className="flex items-end gap-1.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // Desktop: Enter sends, Shift+Enter = newline.
              // Touch: Enter inserts a newline (use the Send button to send).
              if (e.key === 'Enter' && !e.shiftKey && !isTouch) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder={busy ? 'Queue another question…' : 'Ask an AWS question…'}
            disabled={needsKey}
            className="flex-1 min-w-0 resize-none max-h-[150px] overflow-y-auto px-4 py-2.5 rounded-xl bg-aws-card border border-aws-border/60 text-aws-text text-base sm:text-[0.8rem] font-space-mono leading-relaxed placeholder:text-[0.72rem] sm:placeholder:text-[0.8rem] placeholder:tracking-tight placeholder:text-aws-muted/35 focus:outline-none focus:border-c1/40 transition-colors disabled:opacity-50"
          />

          {/* Newline — the Enter-alternative for desktop (where Enter sends).
              Hidden on touch: the soft keyboard's Return key already inserts a
              newline there, so the button would be redundant. */}
          {!isTouch && (
            <button
              type="button"
              onClick={insertNewline}
              disabled={needsKey}
              title="Insert a new line"
              aria-label="Insert a new line"
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-aws-border/40 text-aws-muted/50 hover:text-aws-text hover:border-aws-border/70 transition-all duration-150 disabled:opacity-40 shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3v4a2 2 0 0 1-2 2H3" />
                <path d="M6 6 3 9l3 3" />
              </svg>
            </button>
          )}

          {/* Send */}
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || needsKey}
            aria-label="Send"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-c1/25 text-c1 bg-c1/8 hover:bg-c1/15 hover:border-c1/40 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 1L1 7l5 2M13 1l-4 12-3-5" />
            </svg>
          </button>
        </div>

        {/* Affordance hint — adapts to input device */}
        <p className="font-space-mono text-[0.5rem] text-aws-muted/40 mt-1.5 pl-1">
          {isTouch
            ? 'Return for a new line · Send to ask · you can queue while it answers'
            : 'Enter to send · Shift+Enter or ↵ for a new line · queue while it answers'}
        </p>
      </div>
    </div>
  )
}
