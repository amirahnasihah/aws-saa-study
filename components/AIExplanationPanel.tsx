'use client'

import { useEffect } from 'react'
import { BYOK_PROVIDER_META, type ByokProvider } from '@/lib/ai/providers'

interface AIExplanationPanelProps {
  provider: ByokProvider
  explanation: string
  notesUrl: string
  awsDocsUrl: string
  awsDocsTitle?: string
  onDismiss: () => void
  onRemoveKey: () => void
}

export default function AIExplanationPanel({
  provider,
  explanation,
  notesUrl,
  awsDocsUrl,
  awsDocsTitle,
  onDismiss,
  onRemoveKey,
}: AIExplanationPanelProps) {
  const providerMeta = BYOK_PROVIDER_META[provider]
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onDismiss])

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleRemoveKey = () => {
    onRemoveKey()
    onDismiss()
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onDismiss}
      />

      {/* drawer — slides in from the right */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-[420px] flex flex-col
          bg-[#0d1117] border-l border-aws-border shadow-2xl
          animate-[slideInRight_220ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
      >
        {/* gradient header */}
        <div className="relative flex items-center justify-between px-5 py-4
          bg-gradient-to-r from-c1/10 via-c5/8 to-transparent border-b border-aws-border/60">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg
              bg-c1/15 border border-c1/25 text-c1 text-[0.7rem]">
              ✦
            </span>
            <div>
              <p className="font-space-mono text-[0.6rem] uppercase tracking-[0.15em] text-c1/60 leading-none mb-0.5">
                {providerMeta.panelLabel}
              </p>
              <p className="font-space-mono text-[0.75rem] font-bold text-aws-text leading-none">
                Explanation
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            aria-label="Close AI explanation"
            className="flex items-center justify-center w-7 h-7 rounded-lg
              text-aws-muted hover:text-aws-text hover:bg-white/8
              font-space-mono text-sm transition-all duration-150"
          >
            ✕
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* explanation text */}
          <div>
            <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted/60 mb-3">
              Why this answer
            </p>
            <p className="text-[0.9rem] text-aws-text leading-[1.75] tracking-[0.01em]">
              {explanation}
            </p>
          </div>

          {/* divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-aws-border to-transparent" />

          {/* resource links as cards */}
          <div>
            <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted/60 mb-3">
              Read more
            </p>
            <div className="space-y-2.5">
              {/* notes card */}
              <a
                href={notesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 px-4 py-3.5 rounded-xl
                  bg-c1/5 border border-c1/15 hover:bg-c1/10 hover:border-c1/30
                  transition-all duration-150"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg
                  bg-c1/10 border border-c1/20 text-base shrink-0">
                  📖
                </span>
                <div className="min-w-0">
                  <p className="font-space-mono text-[0.65rem] font-bold text-c1 leading-none mb-1">
                    Study Notes
                  </p>
                  <p className="font-space-mono text-[0.58rem] text-aws-muted truncate">
                    aws.amrhnshh.com
                  </p>
                </div>
                <span className="ml-auto text-c1/40 group-hover:text-c1 group-hover:translate-x-0.5
                  transition-all duration-150 text-xs shrink-0">
                  →
                </span>
              </a>

              {/* AWS docs card */}
              <a
                href={awsDocsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 px-4 py-3.5 rounded-xl
                  bg-white/3 border border-aws-border/40 hover:bg-white/6 hover:border-aws-border
                  transition-all duration-150"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg
                  bg-white/6 border border-aws-border/40 text-base shrink-0">
                  📋
                </span>
                <div className="min-w-0">
                  <p className="font-space-mono text-[0.65rem] font-bold text-aws-text leading-none mb-1">
                    AWS Documentation
                  </p>
                  <p className="font-space-mono text-[0.58rem] text-aws-muted truncate">
                    {awsDocsTitle ?? 'docs.aws.amazon.com'}
                  </p>
                </div>
                <span className="ml-auto text-aws-muted/40 group-hover:text-aws-text group-hover:translate-x-0.5
                  transition-all duration-150 text-xs shrink-0">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="px-5 py-3.5 border-t border-aws-border/40 flex items-center justify-between">
          <p className="font-space-mono text-[0.55rem] text-aws-muted/40">
            Using your {providerMeta.shortLabel} key · BYOK
          </p>
          <button
            onClick={handleRemoveKey}
            className="font-space-mono text-[0.55rem] text-aws-muted/50 hover:text-red-400
              transition-colors duration-150"
          >
            Remove key
          </button>
        </div>
      </div>
    </div>
  )
}
