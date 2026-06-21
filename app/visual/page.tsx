'use client'

import { useMemo, useState } from 'react'
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
import Link from 'next/link'
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

// Sidebar grouping. `extra` is a separate boolean on Architecture, so it gets
// collapsed into its own group key alongside the four exam domains.
type GroupKey = 'd1' | 'd2' | 'd3' | 'd4' | 'extra'
const groupOrder: GroupKey[] = ['d1', 'd2', 'd3', 'd4', 'extra']

const groupLabels: Record<GroupKey, string> = {
  d1: 'D1 · Secure',
  d2: 'D2 · Resilient',
  d3: 'D3 · High-Perf',
  d4: 'D4 · Cost-Opt',
  extra: 'Extra · Not in exam',
}

// Left-rail accent dot per group (matches the domainColors families).
const groupDot: Record<GroupKey, string> = {
  d1: 'bg-c3',
  d2: 'bg-c2',
  d3: 'bg-c1',
  d4: 'bg-c6',
  extra: 'bg-c5',
}

const groupKey = (arch: Architecture): GroupKey => (arch.extra ? 'extra' : arch.domain)

export default function VisualPage() {
  const [active, setActive] = useState<Architecture>(architectures[0])

  // Diagrams grouped by exam domain (+ extra) in fixed order, for the sidebar.
  const groups = useMemo(
    () =>
      groupOrder
        .map((g) => ({ key: g, items: architectures.filter((a) => groupKey(a) === g) }))
        .filter((g) => g.items.length > 0),
    [],
  )

  // Single source of truth for the nav — reused in desktop sidebar + mobile picker.
  const navList = (
    <nav className="space-y-4">
      {groups.map((g) => (
        <div key={g.key}>
          <p className="font-space-mono text-[0.55rem] uppercase tracking-[0.15em] text-aws-muted/50 px-2 mb-1.5">
            {groupLabels[g.key]}
          </p>
          <ul className="space-y-0.5">
            {g.items.map((a) => {
              const isActive = active.id === a.id
              return (
                <li key={a.id}>
                  <button
                    onClick={() => setActive(a)}
                    className={`group w-full text-left flex items-start gap-2 rounded-md px-2 py-1.5 transition-colors duration-150 ${
                      isActive ? 'bg-white/[0.06] text-aws-text' : 'text-aws-muted hover:bg-white/[0.03] hover:text-aws-text'
                    }`}
                  >
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-opacity ${groupDot[g.key]} ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`} />
                    <span className={`text-[0.78rem] leading-snug ${isActive ? 'font-medium' : ''}`}>{a.title}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <>
      <Nav activePage="visual" />
      <main className="max-w-[1280px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        {/* page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted">Architecture Visuals</span>
            <span className="font-space-mono text-[0.6rem] text-aws-muted/50">· {architectures.length} diagrams</span>
          </div>
          <h1 className="font-space-mono text-2xl font-bold text-aws-text mb-1">Visual Architectures</h1>
          <p className="text-aws-muted text-sm max-w-2xl">
            Common AWS architecture patterns — interactive diagrams. Pan, zoom, and click any
            node for an AI explanation of what it does and the exam traps around it.
          </p>
        </div>

        {/* mobile picker — Notion-style disclosure */}
        <details className="lg:hidden mb-5 bg-aws-card border border-aws-border rounded-xl overflow-hidden group">
          <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none select-none">
            <span className="flex items-center gap-2 min-w-0">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${groupDot[groupKey(active)]}`} />
              <span className="text-[0.85rem] text-aws-text font-medium truncate">{active.title}</span>
            </span>
            <span className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted shrink-0 group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="px-3 pb-3 pt-1 border-t border-aws-border/60 max-h-[60vh] overflow-y-auto nav-scroll">
            {navList}
          </div>
        </details>

        {/* desktop two-column: sidebar + content */}
        <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-8 lg:items-start">
          {/* sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-[5rem] lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto nav-scroll pr-1 pb-4">
            <p className="font-space-mono text-[0.55rem] uppercase tracking-[0.15em] text-aws-muted/40 px-2 mb-3">
              {architectures.length} Diagrams
            </p>
            {navList}
          </aside>

          {/* content */}
          <div className="min-w-0">
            <DiagramPanel arch={active} key={active.id} />
          </div>
        </div>

        <SiteFooter tagline="AWS SAA-C03 · Architecture Visuals · Good luck! 💪" />
      </main>
    </>
  )
}

type NodeData = { label: string; sub?: string; icon?: string; color: ArchColor }
type ExplainState = 'idle' | 'loading' | 'done' | 'error'

import type { InternalLink } from '@/lib/ai/internal-links'

interface ExplainSections {
  whatItDoes: string
  trafficFlow: string[]
  examRelevance: string
  examTraps: string[]
  awsDocs?: Array<{ url: string; title: string }>
  internalLinks?: InternalLink[]
}

type ExplainResult =
  | { sections: ExplainSections }
  | { fallbackText: string }
  | { error: string }


async function fetchArchExplanation(
  arch: Architecture,
  domain: string,
  focusNode?: string
): Promise<ExplainResult> {
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
  const data = (await res.json()) as Record<string, unknown>
  if (data.error) return { error: data.error as string }
  if (data.whatItDoes) return { sections: data as unknown as ExplainSections }
  return { fallbackText: (data.fallbackText as string) ?? '' }
}

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="font-space-mono text-[0.5rem] font-bold uppercase tracking-widest text-aws-text/70 mb-2">
      {label}
    </p>
  )
}

function NodeSidebar({
  sidebarMode,
  sidebarNode,
  sidebarState,
  sidebarResult,
  onClose,
}: {
  sidebarMode: 'none' | 'node' | 'diagram'
  sidebarNode: NodeData | null
  sidebarState: ExplainState
  sidebarResult: ExplainResult | null
  onClose: () => void
}) {
  const [sourcesOpen, setSources] = useState(true)

  if (sidebarMode === 'none') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-aws-muted/20 mb-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        <p className="font-space-mono text-[0.62rem] font-bold text-aws-muted/50">Select a Node</p>
        <p className="font-space-mono text-[0.5rem] text-aws-muted/30 mt-1 leading-relaxed">
          Click on any service in the diagram to see its explanation
        </p>
      </div>
    )
  }

  const title = sidebarMode === 'node' && sidebarNode ? sidebarNode.label : 'Architecture Overview'
  const subtitle = sidebarMode === 'node' ? (sidebarNode?.sub ?? '') : ''

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="px-4 py-3 border-b border-aws-border/60 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-c1 text-[0.8rem] leading-none shrink-0">✧</span>
          <div className="min-w-0">
            <p className="font-space-mono text-[0.65rem] font-bold text-aws-text leading-tight truncate">{title}</p>
            {subtitle && <p className="font-space-mono text-[0.48rem] text-aws-muted/60 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-aws-muted/50 hover:text-aws-text transition-colors shrink-0"
          aria-label="Close"
        >
          <svg viewBox="0 0 16 16" className="w-3 h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
            <line x1="3" y1="3" x2="13" y2="13" /><line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>
      </div>

      {/* scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {sidebarState === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-c1/25 border-t-c1 rounded-full animate-spin mb-3" />
            <p className="font-space-mono text-[0.55rem] text-aws-muted/40">Generating explanation...</p>
          </div>
        )}

        {sidebarState === 'error' && sidebarResult && 'error' in sidebarResult && (
          <div className="p-4">
            <p className="font-space-mono text-[0.62rem] text-red-400/80">{sidebarResult.error}</p>
          </div>
        )}

        {sidebarState === 'done' && sidebarResult && (() => {
          if ('fallbackText' in sidebarResult) {
            return (
              <div className="p-4 space-y-2">
                {sidebarResult.fallbackText.trim().split(/\n\n+/).map((p, i) => (
                  <p key={i} className="text-aws-muted text-[0.7rem] leading-relaxed">{p.trim()}</p>
                ))}
              </div>
            )
          }
          if (!('sections' in sidebarResult)) return null
          const { whatItDoes, trafficFlow, examRelevance, examTraps } = sidebarResult.sections
          return (
            <div className="divide-y divide-aws-border/50">
              {/* What problem */}
              <div className="p-4">
                <SectionHeader label="What problem does this solve?" />
                <p className="text-aws-muted text-[0.7rem] leading-relaxed">{whatItDoes}</p>
              </div>

              {/* Traffic flow */}
              {trafficFlow?.length > 0 && (
                <div className="p-4">
                  <SectionHeader label="How traffic flows" />
                  <ol className="space-y-2">
                    {trafficFlow.map((step: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-aws-muted text-[0.7rem]">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-c1/15 text-c1 font-space-mono text-[0.5rem] font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Exam relevance */}
              {examRelevance && (
                <div className="p-4">
                  <SectionHeader label="SAA-C03 Exam Relevance" />
                  <div className="bg-c1/8 border border-c1/20 rounded-lg px-3 py-2.5">
                    <p className="text-aws-text text-[0.7rem] leading-relaxed">{examRelevance}</p>
                  </div>
                </div>
              )}

              {/* Exam traps */}
              {examTraps?.length > 0 && (
                <div className="p-4">
                  <SectionHeader label="Common Exam Traps" />
                  <div className="space-y-1.5">
                    {examTraps.map((trap: string, i: number) => (
                      <div key={i} className="bg-amber-400/6 border border-amber-400/20 rounded-lg px-2.5 py-2">
                        <p className="text-aws-muted text-[0.68rem] leading-snug">⚠ {trap}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources */}
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => setSources((v) => !v)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-3 h-3 text-aws-muted/50">
                      <path strokeLinecap="round" d="M2 3h5a1 1 0 0 1 1 1v9a1 1 0 0 0-1-1H2V3zm12 0H9a1 1 0 0 0-1 1v9a1 1 0 0 1 1-1h5V3z" />
                    </svg>
                    <span className="font-space-mono text-[0.5rem] font-bold uppercase tracking-widest text-aws-text/70">Sources</span>
                  </div>
                  <span className="font-space-mono text-[0.48rem] bg-white/6 border border-aws-border/40 rounded px-1.5 py-0.5 text-aws-muted/60">
                    {'sections' in sidebarResult ? (sidebarResult.sections.awsDocs?.length ?? 0) + (sidebarResult.sections.internalLinks?.length ?? 0) : 0}
                  </span>
                </button>
                {sourcesOpen && (
                  <div className="mt-2 space-y-1">
                    {'sections' in sidebarResult && sidebarResult.sections.awsDocs?.map((doc, i) => (
                      <a
                        key={i}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-c1/70 hover:text-c1 transition-colors rounded-lg px-2 py-1.5 hover:bg-c1/5"
                      >
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-2.5 h-2.5 shrink-0">
                          <path strokeLinecap="round" d="M2 10 10 2m0 0H5m5 0v5" />
                        </svg>
                        <span className="font-space-mono text-[0.6rem] truncate">{doc.title}</span>
                      </a>
                    ))}
                    {'sections' in sidebarResult && sidebarResult.sections.internalLinks?.map((link) => (
                      <Link
                        key={link.url}
                        href={link.url}
                        className="flex items-center gap-1.5 text-c1/70 hover:text-c1 transition-colors rounded-lg px-2 py-1.5 hover:bg-c1/5"
                      >
                        <span className="text-[0.7rem] shrink-0">{link.icon}</span>
                        <span className="font-space-mono text-[0.6rem] truncate">{link.label} · {link.sublabel}</span>
                      </Link>
                    ))}
                    {'sections' in sidebarResult && !sidebarResult.sections.awsDocs?.length && !sidebarResult.sections.internalLinks?.length && (
                      <p className="font-space-mono text-[0.55rem] text-aws-muted/30 px-2 py-1">No docs found</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

function DiagramPanel({ arch }: { arch: Architecture }) {
  const [nodes, , onNodesChange] = useNodesState(arch.nodes)
  const [edges, , onEdgesChange] = useEdgesState(arch.edges)

  // unified sidebar state — one panel for both node and diagram explain
  const [sidebarMode, setSidebarMode] = useState<'none' | 'node' | 'diagram'>('none')
  const [sidebarNode, setSidebarNode] = useState<NodeData | null>(null)
  const [sidebarState, setSidebarState] = useState<ExplainState>('idle')
  const [sidebarResult, setSidebarResult] = useState<ExplainResult | null>(null)

  const domainLabel = domainLabels[arch.domain] ?? arch.domain

  function openSidebar(mode: 'node' | 'diagram', node: NodeData | null, focusNode?: string) {
    setSidebarMode(mode)
    setSidebarNode(node)
    setSidebarState('loading')
    setSidebarResult(null)
    fetchArchExplanation(arch, domainLabel, focusNode)
      .then((result) => {
        if ('error' in result) { setSidebarState('error') }
        else { setSidebarState('done') }
        setSidebarResult(result)
      })
      .catch(() => {
        setSidebarState('error')
        setSidebarResult({ error: 'Network error. Try again.' })
      })
  }

  function closeSidebar() {
    setSidebarMode('none'); setSidebarNode(null)
    setSidebarState('idle'); setSidebarResult(null)
  }

  function handleDiagramExplain() {
    if (sidebarMode === 'diagram') { closeSidebar(); return }
    openSidebar('diagram', null)
  }

  function handleNodeClick(_: React.MouseEvent, node: RFNode) {
    if (node.type === 'groupNode') return
    const data = node.data as NodeData
    openSidebar('node', data, data.label)
  }

  const sidebarOpen = sidebarMode !== 'none'

  const diagBtnClass = sidebarMode === 'diagram'
    ? 'text-c1 border-c1/25 bg-c1/6 hover:bg-c1/10'
    : 'text-aws-muted border-aws-border/60 hover:text-aws-text hover:border-aws-border hover:bg-white/3'

  return (
    <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden">
      {/* card header */}
      <div className="px-5 py-4 border-b border-aws-border/60">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
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
              className={`flex items-center gap-1 font-space-mono text-[0.6rem] px-2.5 py-1 rounded-lg border transition-all duration-150 ${diagBtnClass}`}
            >
              <span className="relative inline-flex items-center justify-center shrink-0 w-3 h-3">
                <span className="animate-sparkle-main text-[0.7rem] leading-none">✦</span>
                <span className="absolute top-0 right-0 animate-sparkle-a text-[0.24rem] leading-none text-c1">✦</span>
                <span className="absolute bottom-0 left-0 animate-sparkle-b text-[0.2rem] leading-none text-c1">✧</span>
                <span className="absolute bottom-0 right-0 animate-sparkle-c text-[0.2rem] leading-none text-c1">✦</span>
              </span>
              {sidebarMode === 'diagram' ? 'Close' : 'Explain diagram'}
            </button>
            <p className="font-space-mono text-[0.52rem] text-aws-muted/50">Click node to explore · Scroll to zoom</p>
          </div>
        </div>
      </div>

      {/* canvas + unified sidebar */}
      <div className="flex" style={{ height: 520 }}>
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

        {/* always-visible sidebar */}
        <div className="w-72 shrink-0 border-l border-aws-border/60">
          <NodeSidebar
            sidebarMode={sidebarMode}
            sidebarNode={sidebarNode}
            sidebarState={sidebarState}
            sidebarResult={sidebarResult}
            onClose={closeSidebar}
          />
        </div>
      </div>

      {/* legend */}
      <Legend arch={arch} />
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
