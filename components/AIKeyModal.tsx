'use client'

import { useState } from 'react'

interface AIKeyModalProps {
  onSave: (key: string) => void
  onDismiss: () => void
}

export default function AIKeyModal({ onSave, onDismiss }: AIKeyModalProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    const trimmed = input.trim()
    if (!trimmed.startsWith('sk-ant-')) {
      setError("That doesn't look like a valid Anthropic key.")
      return
    }
    onSave(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative bg-aws-card border border-aws-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="font-space-mono text-sm font-bold text-aws-text mb-1">
          Enter your Anthropic API key
        </h2>
        <p className="font-space-mono text-[0.65rem] text-aws-muted mb-4">
          Stored only in your browser. Never sent to our servers beyond your AI request.
          Get one at{' '}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-c1 hover:underline"
          >
            console.anthropic.com
          </a>
        </p>

        <input
          type="password"
          placeholder="sk-ant-api03-..."
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null) }}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="w-full bg-white/5 border border-aws-border rounded-xl px-4 py-2.5 font-space-mono text-xs text-aws-text placeholder-aws-muted/50 focus:outline-none focus:border-c1/50 mb-2"
          autoFocus
        />

        {error && (
          <p className="font-space-mono text-[0.62rem] text-red-400 mb-3">{error}</p>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={onDismiss}
            className="flex-1 py-2 rounded-xl font-space-mono text-xs text-aws-muted border border-aws-border/50 hover:text-aws-text hover:bg-white/4 transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!input.trim()}
            className="flex-1 py-2 rounded-xl font-space-mono text-xs font-bold bg-c1/15 border border-c1/40 text-c1 hover:bg-c1/25 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  )
}
