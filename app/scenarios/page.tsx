'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import {
  scenarios,
  Scenario,
  FlowNode,
  domainLabel,
  domainColor,
  nodeColorMap,
} from '@/data/scenarios'

type Tab = 'anatomy' | 'traps' | 'tips'

export default function DiagramsPage() {
  const [active, setActive] = useState<Scenario>(scenarios[0])
  const [tab, setTab] = useState<Tab>('anatomy')

  return (
    <>
      <Nav activePage="scenarios" />
      <main className="max-w-[1100px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        {/* header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted">Scenario Patterns</span>
          </div>
          <h1 className="font-space-mono text-2xl font-bold text-aws-text mb-1">Architecture Diagrams</h1>
          <p className="text-aws-muted text-sm max-w-2xl">
            Common AWS architecture patterns with anatomy breakdowns, exam traps, and official docs.
            Study the <em className="not-italic text-aws-text/80">why</em> behind each component — not just the diagram.
          </p>
        </div>

        {/* scenario selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActive(s); setTab('anatomy') }}
              className={`font-space-mono text-[0.65rem] px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                active.id === s.id
                  ? domainColor[s.domain]
                  : 'text-aws-muted border-aws-border/60 hover:border-aws-border hover:text-aws-text'
              }`}
            >
              {s.title}
            </button>
          ))}
          <span className="self-center font-space-mono text-[0.58rem] text-aws-muted/50 ml-1">· more coming soon</span>
        </div>

        {/* main card */}
        <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden">
          {/* card header */}
          <div className="px-5 py-4 border-b border-aws-border/60">
            <div className="flex items-start gap-3 flex-wrap">
              <span className={`font-space-mono text-[0.6rem] px-2 py-0.5 rounded border shrink-0 mt-0.5 ${domainColor[active.domain]}`}>
                {domainLabel[active.domain]}
              </span>
              <div>
                <h2 className="text-aws-text font-bold text-lg leading-snug">{active.title}</h2>
                <p className="text-aws-muted text-[0.8rem] mt-0.5">{active.subtitle}</p>
              </div>
            </div>
          </div>

          {/* flow diagram */}
          <div className="px-5 py-6 border-b border-aws-border/60 bg-white/1">
            <FlowDiagram nodes={active.flow} />
          </div>

          {/* overview */}
          <div className="px-5 py-4 border-b border-aws-border/60">
            <p className="text-aws-muted text-sm leading-relaxed">{active.overview}</p>
          </div>

          {/* tabs */}
          <div className="flex gap-0 border-b border-aws-border/60">
            {([
              { key: 'anatomy', label: 'Anatomy' },
              { key: 'traps',   label: `Exam Traps (${active.nuances.length})` },
              { key: 'tips',    label: 'Tips & Tricks' },
            ] as { key: Tab; label: string }[]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`font-space-mono text-[0.6rem] uppercase tracking-widest px-5 py-3 border-b-2 transition-all ${
                  tab === t.key
                    ? 'border-c1 text-c1'
                    : 'border-transparent text-aws-muted hover:text-aws-text'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div className="px-5 py-5">
            {tab === 'anatomy' && (
              <div className="space-y-5">
                {active.anatomy.map((item) => (
                  <div key={item.component} className="border border-aws-border/50 rounded-lg overflow-hidden">
                    <div className="px-4 py-2.5 bg-white/3 border-b border-aws-border/40 flex items-baseline gap-3 flex-wrap">
                      <span className="font-bold text-aws-text text-[0.85rem]">{item.component}</span>
                      <span className="font-space-mono text-[0.62rem] text-aws-muted">{item.role}</span>
                    </div>
                    <ul className="px-4 py-3 space-y-1.5">
                      {item.notes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2 text-[0.82rem] text-aws-muted">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-aws-border shrink-0" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {tab === 'traps' && (
              <div className="space-y-4">
                <p className="font-space-mono text-[0.62rem] text-aws-muted/60 uppercase tracking-widest mb-4">
                  Common wrong answers in exam questions for this pattern
                </p>
                {active.nuances.map((n, i) => (
                  <div key={i} className="border border-aws-border/50 rounded-lg overflow-hidden">
                    <div className="px-4 py-2.5 bg-c2/5 border-b border-c2/15 flex items-start gap-2">
                      <span className="font-space-mono text-[0.6rem] text-c2/80 uppercase tracking-widest shrink-0 mt-0.5">Trap</span>
                      <span className="text-[0.82rem] text-c2/80">{n.trap}</span>
                    </div>
                    <div className="px-4 py-2.5 flex items-start gap-2">
                      <span className="font-space-mono text-[0.6rem] text-c4 uppercase tracking-widest shrink-0 mt-0.5">Correct</span>
                      <span className="text-[0.82rem] text-aws-muted">{n.correct}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'tips' && (
              <ul className="space-y-2.5">
                {active.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.82rem] text-aws-muted">
                    <span className="font-space-mono text-c5 text-[0.65rem] shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* sources */}
          <div className="px-5 py-4 border-t border-aws-border/60 bg-white/1">
            <p className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted/50 mb-2">Official Docs</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {active.sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-space-mono text-[0.65rem] text-c1/70 hover:text-c1 transition-colors underline underline-offset-2"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <SiteFooter tagline="AWS SAA-C03 · Scenario Patterns · Study the why, not just the diagram" />
      </main>
    </>
  )
}

function FlowDiagram({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex items-center gap-0 min-w-max mx-auto w-fit">
        {nodes.map((node, i) => {
          const colors = nodeColorMap[node.color]
          return (
            <div key={node.id} className="flex items-center gap-0">
              {/* node box */}
              <div className={`relative flex flex-col items-center justify-center px-4 py-3 rounded-xl border ${colors.border} ${colors.bg} min-w-[110px] text-center`}>
                {node.optional && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-space-mono text-[0.48rem] uppercase tracking-widest text-aws-muted/60 bg-aws-card px-1.5 rounded border border-aws-border/40">
                    optional
                  </span>
                )}
                <span className={`font-space-mono text-[0.7rem] font-bold ${colors.text} leading-tight`}>
                  {node.label}
                </span>
                {node.sublabel && (
                  <span className="font-space-mono text-[0.55rem] text-aws-muted mt-1 leading-tight max-w-[120px]">
                    {node.sublabel}
                  </span>
                )}
              </div>

              {/* arrow between nodes */}
              {i < nodes.length - 1 && (
                <div className="flex items-center mx-1 shrink-0">
                  <div className="w-6 h-px bg-aws-border/60" />
                  <svg width="6" height="10" viewBox="0 0 6 10" className="text-aws-border/60 -ml-px">
                    <path d="M0 0L6 5L0 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
