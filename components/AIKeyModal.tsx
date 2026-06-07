'use client'

import { useState } from 'react'
import {
  BYOK_PROVIDER_META,
  validateByokKey,
  type ByokProvider,
} from '@/lib/ai/providers'

interface AIKeyModalProps {
  provider: ByokProvider
  onProviderChange: (provider: ByokProvider) => void
  onSave: (key: string, provider: ByokProvider) => void
  onDismiss: () => void
}

const PROVIDER_ORDER: ByokProvider[] = ['openrouter', 'ollama']

export default function AIKeyModal({
  provider,
  onProviderChange,
  onSave,
  onDismiss,
}: AIKeyModalProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const meta = BYOK_PROVIDER_META[provider]

  const handleSave = () => {
    const trimmed = input.trim()
    const validationError = validateByokKey(provider, trimmed)
    if (validationError) {
      setError(validationError)
      return
    }
    onSave(trimmed, provider)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative bg-aws-card border border-aws-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="font-space-mono text-sm font-bold text-aws-text mb-1">
          Bring your own API key
        </h2>
        <p className="font-space-mono text-[0.65rem] text-aws-muted mb-4">
          Stored only in your browser. Sent only with your AI requests.
        </p>

        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white/5 border border-aws-border/60 mb-4">
          {PROVIDER_ORDER.map((id) => {
            const item = BYOK_PROVIDER_META[id]
            const active = provider === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onProviderChange(id)
                  setError(null)
                }}
                className={`py-2 rounded-lg font-space-mono text-[0.62rem] font-bold transition-all duration-150 ${
                  active
                    ? 'bg-c1/15 border border-c1/40 text-c1'
                    : 'text-aws-muted hover:text-aws-text border border-transparent'
                }`}
              >
                {item.shortLabel}
              </button>
            )
          })}
        </div>

        <p className="font-space-mono text-[0.65rem] text-aws-muted mb-3">
          {meta.hint}{' '}
          <a
            href={meta.consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-c1 hover:underline"
          >
            {meta.consoleLabel}
          </a>
        </p>

        <input
          type="password"
          placeholder={meta.placeholder}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(null)
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="w-full bg-white/5 border border-aws-border rounded-xl px-4 py-2.5 font-space-mono text-[16px] md:text-xs text-aws-text placeholder-aws-muted/50 focus:outline-none focus:border-c1/50 mb-2"
          autoFocus
        />

        {error && (
          <p className="font-space-mono text-[0.62rem] text-red-400 mb-3">{error}</p>
        )}

        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 py-2 rounded-xl font-space-mono text-xs text-aws-muted border border-aws-border/50 hover:text-aws-text hover:bg-white/4 transition-all duration-150"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!input.trim()}
            className="flex-1 py-2 rounded-xl font-space-mono text-xs font-bold bg-c1/15 border border-c1/40 text-c1 hover:bg-c1/25 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save & use
          </button>
        </div>
      </div>
    </div>
  )
}
