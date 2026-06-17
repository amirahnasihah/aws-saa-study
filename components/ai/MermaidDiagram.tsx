'use client'

import { useEffect, useId, useState } from 'react'

interface MermaidDiagramProps {
  source: string
}

let mermaidInitPromise: Promise<typeof import('mermaid')['default']> | null = null

function getMermaid() {
  if (!mermaidInitPromise) {
    mermaidInitPromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          background: '#111827',
          primaryColor: '#1e2d40',
          primaryTextColor: '#e2e8f0',
          primaryBorderColor: '#00d4ff',
          lineColor: '#64748b',
          secondaryColor: '#111827',
          tertiaryColor: '#111827',
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '12px',
        },
      })
      return mermaid
    })
  }
  return mermaidInitPromise
}

export default function MermaidDiagram({ source }: MermaidDiagramProps) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, '')
  // Track which source produced each result so we never synchronously reset
  // state in the effect body (which triggers cascading renders).
  const [rendered, setRendered] = useState<{ source: string; svg: string } | null>(null)
  const [failedSource, setFailedSource] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const mermaid = await getMermaid()
        const { svg } = await mermaid.render(`mermaid-${reactId}`, source)
        if (!cancelled) {
          // Mermaid can return an error SVG instead of throwing on parse failures.
          if (svg.includes('Syntax error')) setFailedSource(source)
          else setRendered({ source, svg })
        }
      } catch {
        if (!cancelled) setFailedSource(source)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [reactId, source])

  const isFailed = failedSource === source
  const isLoading = !isFailed && rendered?.source !== source

  if (isFailed) {
    return (
      <div className="mb-2 space-y-1.5 last:mb-0">
        <pre className="overflow-x-auto rounded-xl bg-aws-card border border-aws-border/60 p-3 font-space-mono text-[0.7rem] leading-relaxed">
          <code>{source}</code>
        </pre>
        <p className="font-space-mono text-xs text-amber-400/70">
          Couldn&apos;t render diagram.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mb-2 rounded-xl bg-aws-card border border-aws-border/60 p-3 font-space-mono text-[0.6rem] text-aws-muted/60 last:mb-0">
        Rendering diagram…
      </div>
    )
  }

  return (
    <div
      className="mb-2 overflow-x-auto rounded-xl bg-aws-card border border-aws-border/60 p-3 last:mb-0"
      dangerouslySetInnerHTML={{ __html: rendered!.svg }}
    />
  )
}
