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
  type Node as RFNode,
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

type NodeData = { label: string; sub?: string; icon?: string; color: ArchColor }
type ExplainState = 'idle' | 'loading' | 'done' | 'error'

async function fetchArchExplanation(
  arch: Architecture,
  domain: string,
  focusNode?: string
): Promise<{ text?: string; error?: string }> {
  const nodeLabels = [...new Set(arch.nodes.map((n) => (n.data as NodeData).label))]
  const res = await fetch('/api/ai/explain-arch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: arch.title,
      description: arch.description,
      domain,
      tags: arch.tags,
      nodeLabels,
      ...(focusNode ? { focusNode } : {}),
    }),
  })
  return (await res.json()) as { text?: string; error?: string }
}

function ExplainPanelContent({ state, text, error }: { state: ExplainState; text: string; error: string }) {
  if (state === 'loading') {
    return (
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
    )
  }
  if (state === 'done') {
    return (
      <div className="space-y-3">
        {text.trim().split(/\n\n+/).map((para, i) => (
          <p key={i} className="text-aws-text text-sm leading-relaxed">
            {para.trim()}
          </p>
        ))}
      </div>
    )
  }
  if (state === 'error') {
    return <p className="font-space-mono text-[0.65rem] text-red-400/80">{error}</p>
  }
  return null
}

function DiagramPanel({ arch }: { arch: Architecture }) {
  const [nodes, , onNodesChange] = useNodesState(arch.nodes)
  const [edges, , onEdgesChange] = useEdgesState(arch.edges)

  // whole-diagram explain (inline below legend)
  const [diagState, setDiagState] = useState<ExplainState>('idle')
  const [diagText, setDiagText] = useState('')
  const [diagError, setDiagError] = useState('')

  // per-node sidebar
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)
  const [nodeState, setNodeState] = useState<ExplainState>('idle')
  const [nodeText, setNodeText] = useState('')
  const [nodeError, setNodeError] = useState('')

  const domainLabel = domainLabels[arch.domain] ?? arch.domain

  async function handleDiagramExplain() {
    if (diagState === 'done') {
      setDiagState('idle'); setDiagText(''); setDiagError(''); return
    }
    // close node sidebar
    setSelectedNode(null); setNodeState('idle'); setNodeText(''); setNodeError('')
    setDiagError(''); setDiagState('loading')
    try {
      const data = await fetchArchExplanation(arch, domainLabel)
      if (data.error) { setDiagState('error'); setDiagError(data.error) }
      else { setDiagState('done'); setDiagText(data.text ?? '') }
    } catch {
      setDiagState('error'); setDiagError('Network error. Try again.')
    }
  }

  function handleNodeClick(_: React.MouseEvent, node: RFNode) {
    if (node.type === 'groupNode') return
    const data = node.data as NodeData
    // close diagram panel
    setDiagState('idle'); setDiagText(''); setDiagError('')
    setSelectedNode(data)
    setNodeState('loading'); setNodeText(''); setNodeError('')
    fetchArchExplanation(arch, domainLabel, data.label).then((result) => {
      if (result.error) { setNodeState('error'); setNodeError(result.error) }
      else { setNodeState('done'); setNodeText(result.text ?? '') }
    }).catch(() => {
      setNodeState('error'); setNodeError('Network error. Try again.')
    })
  }

  function closeNodeSidebar() {
    setSelectedNode(null); setNodeState('idle'); setNodeText(''); setNodeError('')
  }

  const diagBtnLabel =
    diagState === 'loading' ? 'Explaining...' :
    diagState === 'done' ? 'Close overview' :
    diagState === 'error' ? 'Retry' : 'Explain diagram'

  const diagBtnClass =
    diagState === 'done'
      ? 'text-c1 border-c1/25 bg-c1/6 hover:bg-c1/10'
      : diagState === 'error'
        ? 'text-red-400 border-red-400/20 bg-red-400/6'
        : diagState === 'loading'
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
              onClick={handleDiagramExplain}
              disabled={diagState === 'loading'}
              className={`flex items-center gap-1 font-space-mono text-[0.6rem] px-2.5 py-1 rounded-lg border transition-all duration-150 ${diagBtnClass}`}
            >
              <span className="relative inline-flex items-center justify-center shrink-0 w-3 h-3">
                <span className="animate-sparkle-main text-[0.7rem] leading-none">✦</span>
                <span className="absolute top-0 right-0 animate-sparkle-a text-[0.24rem] leading-none text-c1">✦</span>
                <span className="absolute bottom-0 left-0 animate-sparkle-b text-[0.2rem] leading-none text-c1">✧</span>
                <span className="absolute bottom-0 right-0 animate-sparkle-c text-[0.2rem] leading-none text-c1">✦</span>
              </span>
              {diagBtnLabel}
            </button>
            <p className="font-space-mono text-[0.52rem] text-aws-muted/50">Click node to explore · Scroll to zoom</p>
          </div>
        </div>
      </div>

      {/* canvas + node sidebar */}
      <div className="flex" style={{ height: 460 }}>
        <div className="flex-1 min-w-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
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

        {/* node explanation sidebar */}
        {selectedNode && (
          <div className="w-72 shrink-0 border-l border-aws-border/60 overflow-y-auto">
            <div className="p-4">
              {/* sidebar header */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-c1 text-[0.75rem] leading-none shrink-0">✧</span>
                  <div className="min-w-0">
                    <p className="font-space-mono text-[0.68rem] font-bold text-aws-text leading-tight truncate">
                      {selectedNode.label}
                    </p>
                    {selectedNode.sub && (
                      <p className="font-space-mono text-[0.5rem] text-aws-muted mt-0.5">{selectedNode.sub}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeNodeSidebar}
                  className="text-aws-muted/60 hover:text-aws-text transition-colors shrink-0 mt-0.5"
                  aria-label="Close"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                    <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="font-space-mono text-[0.48rem] uppercase tracking-widest text-aws-muted/40 mb-3">
                Auto · ILMU / NVIDIA / Gemini
              </div>

              <ExplainPanelContent state={nodeState} text={nodeText} error={nodeError} />
            </div>
          </div>
        )}
      </div>

      {/* legend */}
      <Legend arch={arch} />

      {/* whole-diagram explanation panel */}
      {diagState !== 'idle' && (
        <div className="border-t border-aws-border/60 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-space-mono text-[0.52rem] uppercase tracking-widest text-aws-muted/50">
              Architecture Overview
            </span>
            <span className="font-space-mono text-[0.48rem] text-aws-muted/35">
              Auto · ILMU / NVIDIA / Gemini
            </span>
          </div>
          <ExplainPanelContent state={diagState} text={diagText} error={diagError} />
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
