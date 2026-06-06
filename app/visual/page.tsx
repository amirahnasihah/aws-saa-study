'use client'

import { useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import { architectures, Architecture } from '@/data/architectures'
import { ArchNode, GroupNode, ArchColor } from '@/components/visual/ArchNode'

const nodeTypes = {
  archNode: ArchNode,
  groupNode: GroupNode,
}

const domainColors: Record<string, string> = {
  d1: 'text-c3 border-c3/30 bg-c3/8',
  d2: 'text-c2 border-c2/30 bg-c2/8',
  d3: 'text-c1 border-c1/30 bg-c1/8',
  d4: 'text-c6 border-c6/30 bg-c6/8',
}

const domainLabels: Record<string, string> = {
  d1: 'D1 · Secure',
  d2: 'D2 · Resilient',
  d3: 'D3 · High-Perf',
  d4: 'D4 · Cost-Opt',
}

export default function VisualPage() {
  const [active, setActive] = useState<Architecture>(architectures[0])

  return (
    <>
      <Nav activePage="visual" />
      <main className="max-w-[1100px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        {/* header */}
        <div className="mb-6">
          <h1 className="font-space-mono text-2xl font-bold text-aws-text mb-1">Visual Architectures</h1>
          <p className="text-aws-muted text-sm">Common AWS architecture patterns — interactive diagrams. Pan, zoom, explore.</p>
        </div>

        {/* diagram selector */}
        <div className="flex flex-wrap gap-2 mb-5 items-center">
          {architectures.map((arch, i) => {
            const prevIsAws = i > 0 && !architectures[i - 1].extra
            const isFirstExtra = arch.extra && prevIsAws
            return (
              <div key={arch.id} className="flex items-center gap-2">
                {isFirstExtra && (
                  <div className="flex items-center gap-2 mr-1">
                    <div className="w-px h-5 bg-aws-border/60" />
                    <span className="font-space-mono text-[0.55rem] text-aws-muted/50 uppercase tracking-widest whitespace-nowrap">extra · not in exam</span>
                    <div className="w-px h-5 bg-aws-border/60" />
                  </div>
                )}
                <button
                  onClick={() => setActive(arch)}
                  className={`font-space-mono text-[0.65rem] px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                    active.id === arch.id
                      ? arch.extra
                        ? 'text-c5 border-c5/30 bg-c5/8'
                        : domainColors[arch.domain]
                      : 'text-aws-muted border-aws-border/60 bg-transparent hover:border-aws-border hover:text-aws-text'
                  }`}
                >
                  {arch.title}
                </button>
              </div>
            )
          })}
        </div>

        {/* diagram */}
        <DiagramPanel arch={active} key={active.id} />

        <SiteFooter tagline="AWS SAA-C03 · Architecture Visuals · Good luck! 💪" />
      </main>
    </>
  )
}

function DiagramPanel({ arch }: { arch: Architecture }) {
  const [nodes, , onNodesChange] = useNodesState(arch.nodes)
  const [edges, , onEdgesChange] = useEdgesState(arch.edges)
  const [explainState, setExplainState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [explanation, setExplanation] = useState('')
  const [explainError, setExplainError] = useState('')

  async function handleExplain() {
    if (explainState === 'done') {
      setExplainState('idle')
      setExplanation('')
      setExplainError('')
      return
    }
    setExplainError('')
    setExplainState('loading')
    const nodeLabels = [...new Set(arch.nodes.map((n) => (n.data as { label: string }).label))]
    try {
      const res = await fetch('/api/ai/explain-arch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: arch.title,
          description: arch.description,
          domain: domainLabels[arch.domain] ?? arch.domain,
          tags: arch.tags,
          nodeLabels,
        }),
      })
      const data = (await res.json()) as { text?: string; error?: string }
      if (data.error) {
        setExplainState('error')
        setExplainError(data.error)
      } else {
        setExplainState('done')
        setExplanation(data.text ?? '')
      }
    } catch {
      setExplainState('error')
      setExplainError('Network error. Check your connection and try again.')
    }
  }

  const btnLabel =
    explainState === 'loading' ? 'Explaining...' :
    explainState === 'done' ? 'Close' :
    explainState === 'error' ? 'Retry' : 'Explain'

  const btnClass =
    explainState === 'done'
      ? 'text-c1 border-c1/25 bg-c1/6 hover:bg-c1/10'
      : explainState === 'error'
        ? 'text-red-400 border-red-400/20 bg-red-400/6 hover:bg-red-400/10'
        : explainState === 'loading'
          ? 'text-aws-muted border-aws-border/60 opacity-60 cursor-not-allowed'
          : 'text-aws-muted border-aws-border/60 hover:text-aws-text hover:border-aws-border hover:bg-white/3'

  return (
    <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden">
      {/* card header */}
      <div className="px-5 py-4 border-b border-aws-border/60">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {arch.extra ? (
                <span className="font-space-mono text-[0.6rem] px-2 py-0.5 rounded border text-c5 border-c5/30 bg-c5/8">
                  Extra · Not AWS
                </span>
              ) : (
                <span className={`font-space-mono text-[0.6rem] px-2 py-0.5 rounded border ${domainColors[arch.domain]}`}>
                  {domainLabels[arch.domain]}
                </span>
              )}
              {arch.tags.map((t) => (
                <span key={t} className="font-space-mono text-[0.58rem] text-aws-muted border border-aws-border/50 rounded px-1.5 py-0.5">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="text-aws-text font-bold text-base">{arch.title}</h2>
            <p className="text-aws-muted text-[0.8rem] mt-0.5 max-w-[600px]">{arch.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExplain}
              disabled={explainState === 'loading'}
              className={`font-space-mono text-[0.6rem] px-2.5 py-1 rounded-lg border transition-all duration-150 ${btnClass}`}
            >
              ✦ {btnLabel}
            </button>
            <p className="font-space-mono text-[0.52rem] text-aws-muted/50">Scroll to zoom · Drag to pan</p>
          </div>
        </div>
      </div>

      {/* react flow canvas */}
      <div style={{ height: 460 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          style={{ background: 'transparent' }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgba(255,255,255,0.04)"
          />
          <Controls
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
            }}
          />
          <MiniMap
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
            }}
            nodeColor="rgba(255,255,255,0.15)"
            maskColor="rgba(0,0,0,0.5)"
          />
        </ReactFlow>
      </div>

      {/* legend */}
      <Legend arch={arch} />

      {/* AI explanation panel */}
      {explainState !== 'idle' && (
        <div className="border-t border-aws-border/60 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-space-mono text-[0.52rem] uppercase tracking-widest text-aws-muted/50">
              AI Explanation
            </span>
            <span className="font-space-mono text-[0.48rem] text-aws-muted/35">
              Auto · ILMU / NVIDIA / Gemini
            </span>
          </div>

          {explainState === 'loading' && (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-white/6 rounded-md w-full" />
              <div className="h-3 bg-white/6 rounded-md w-11/12" />
              <div className="h-3 bg-white/6 rounded-md w-4/5" />
              <div className="h-3 bg-white/6 rounded-md w-full mt-3" />
              <div className="h-3 bg-white/6 rounded-md w-10/12" />
              <div className="h-3 bg-white/6 rounded-md w-5/6" />
              <div className="h-3 bg-white/6 rounded-md w-3/4 mt-3" />
              <div className="h-3 bg-white/6 rounded-md w-full" />
              <div className="h-3 bg-white/6 rounded-md w-9/12" />
            </div>
          )}

          {explainState === 'done' && (
            <div className="space-y-3">
              {explanation
                .trim()
                .split(/\n\n+/)
                .map((para, i) => (
                  <p key={i} className="text-aws-text text-sm leading-relaxed max-w-prose">
                    {para.trim()}
                  </p>
                ))}
            </div>
          )}

          {explainState === 'error' && (
            <p className="font-space-mono text-[0.65rem] text-red-400/80">{explainError}</p>
          )}
        </div>
      )}
    </div>
  )
}

function Legend({ arch }: { arch: Architecture }) {
  const uniqueNodes = arch.nodes.reduce<Array<{ label: string; color: ArchColor }>>((acc, n) => {
    const d = n.data as { label: string; color: ArchColor }
    if (!acc.find((x) => x.label === d.label)) acc.push({ label: d.label, color: d.color })
    return acc
  }, [])

  return (
    <div className="px-5 py-3 border-t border-aws-border/60 bg-white/1">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted/60">Nodes</span>
        {uniqueNodes.map((n) => (
          <span key={n.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-sm shrink-0 ${nodeColorDot(n.color as string)}`} />
            <span className="font-space-mono text-[0.58rem] text-aws-muted">{n.label}</span>
          </span>
        ))}
        <span className="ml-auto flex items-center gap-3 font-space-mono text-[0.58rem] text-aws-muted/60">
          <span className="flex items-center gap-1">
            <span className="w-5 border-t border-white/20 inline-block" />
            data flow
          </span>
          <span className="flex items-center gap-1">
            <span className="w-5 border-t border-dashed border-white/20 inline-block" />
            standby / sync
          </span>
        </span>
      </div>
    </div>
  )
}

function nodeColorDot(color: string): string {
  const map: Record<string, string> = {
    c1: 'bg-c1',
    c2: 'bg-c2',
    c3: 'bg-c3',
    c4: 'bg-c4',
    c5: 'bg-c5',
    c6: 'bg-c6',
    gray: 'bg-white/30',
  }
  return map[color] ?? 'bg-white/30'
}
