'use client'

import { useEffect, useId, useState } from 'react'

interface MermaidDiagramProps {
  source: string
}

let mermaidInitPromise: Promise<typeof import('mermaid')['default']> | null = null

// Best-effort repair for the most common Mermaid parse failure: node and edge
// labels that contain characters the parser rejects unless the label is wrapped
// in double quotes — parentheses, commas, colons, slashes, question marks,
// emoji, <br/>. We re-quote any *unquoted* label across the shapes the chat
// model emits most — edge labels (|text|), rectangles ([text]), decision
// diamonds ({text}), circles (((text))) and rounded nodes ((text)) — then
// retry once. The diamond shape in particular is what breaks AI-generated
// decision trees (e.g. B{Individual users<br/>or whole network?}). Labels that
// already contain a quote are left untouched so we never corrupt a valid one.
function repairMermaidLabels(source: string): string {
  const quote = (inner: string): string => {
    const trimmed = inner.trim()
    if (!trimmed || trimmed.includes('"')) return inner
    return `"${trimmed}"`
  }
  return source
    .replace(/\|([^|\n]+)\|/g, (_m, inner: string) => `|${quote(inner)}|`)
    .replace(/\[([^\][\n]+)\]/g, (_m, inner: string) => `[${quote(inner)}]`)
    // Circle ((text)) must run before the rounded (text) rule below so the
    // double parens match as one shape, not two nested ones.
    .replace(/\(\(([^()\n]+)\)\)/g, (_m, inner: string) => `((${quote(inner)}))`)
    .replace(/\{([^{}\n]+)\}/g, (_m, inner: string) => `{${quote(inner)}}`)
    .replace(/\(([^()\n]+)\)/g, (_m, inner: string) => `(${quote(inner)})`)
}

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
      const mermaid = await getMermaid()
      // Mermaid can return an error SVG instead of throwing on parse failures,
      // so treat that as a throw too and funnel both into the retry path.
      const tryRender = async (src: string, id: string): Promise<string> => {
        const { svg } = await mermaid.render(id, src)
        if (svg.includes('Syntax error')) throw new Error('mermaid syntax error')
        return svg
      }

      try {
        let svg: string
        try {
          svg = await tryRender(source, `mermaid-${reactId}`)
        } catch (firstError) {
          // Retry once with auto-quoted labels — the most common breakage. Skip
          // if the repair changed nothing (it would fail identically).
          const repaired = repairMermaidLabels(source)
          if (repaired === source) throw firstError
          svg = await tryRender(repaired, `mermaid-${reactId}-r`)
        }
        if (!cancelled) setRendered({ source, svg })
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
