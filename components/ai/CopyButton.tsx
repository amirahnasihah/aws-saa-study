'use client'

import { useState } from 'react'

interface CopyButtonProps {
  text: string
  label?: string
}

type CopyState = 'idle' | 'copied' | 'error'

export default function CopyButton({ text, label = 'Copy message' }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>('idle')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('error')
    }
    window.setTimeout(() => setState('idle'), 1500)
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      title={state === 'copied' ? 'Copied!' : state === 'error' ? 'Copy failed' : label}
      aria-label={label}
      className="flex items-center gap-1 font-space-mono text-[0.55rem] text-aws-muted/40 hover:text-aws-muted transition-colors duration-150"
    >
      {state === 'copied' ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6.5L5 9l4.5-5.5" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="3.5" width="6" height="6" rx="1" />
          <path d="M2.5 8V2.5a1 1 0 011-1H8" />
        </svg>
      )}
      <span>{state === 'copied' ? 'Copied' : state === 'error' ? 'Failed' : 'Copy'}</span>
    </button>
  )
}
