'use client'

import { useMemo, useState } from 'react'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import {
  scenarios,
  Scenario,
  FlowStep,
  CompareTable,
  domainLabel,
  domainColor,
  nodeColorMap,
} from '@/data/scenarios'

type Tab = 'anatomy' | 'compare' | 'traps' | 'tips'

// Per-column tint for compared columns (skips the attribute column).
// Cycles c2/c5/c4/c6 so 2-, 3- and 4-way tables stay visually distinct —
// same palette family the Deep Notes tables use.
const compareHeadTint = ['text-c2 bg-c2/5', 'text-c5 bg-c5/5', 'text-c4 bg-c4/5', 'text-c6 bg-c6/5']
const compareCellTint = ['bg-c2/[0.03]', 'bg-c5/[0.03]', 'bg-c4/[0.03]', 'bg-c6/[0.03]']

const domainOrder: Scenario['domain'][] = ['d1', 'd2', 'd3', 'd4', 'extra']

// Small left-rail accent dot per domain (matches the domainColor families).
const domainDot: Record<Scenario['domain'], string> = {
  d1: 'bg-c3',
  d2: 'bg-c2',
  d3: 'bg-c1',
  d4: 'bg-c6',
  extra: 'bg-c5',
}

export default function ScenariosPage() {
  const [activeId, setActiveId] = useState<string>(scenarios[0].id)
  const [tab, setTab] = useState<Tab>('anatomy')

  const active = scenarios.find((s) => s.id === activeId) ?? scenarios[0]

  // Scenarios grouped by domain, in fixed exam order, for the sidebar.
  const groups = useMemo(
    () =>
      domainOrder
        .map((d) => ({ domain: d, items: scenarios.filter((s) => s.domain === d) }))
        .filter((g) => g.items.length > 0),
    [],
  )

  const select = (s: Scenario) => {
    setActiveId(s.id)
    setTab('anatomy')
  }

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: 'anatomy', label: 'Anatomy', show: true },
    { key: 'compare', label: `Compare${active.compare ? ` (${active.compare.length})` : ''}`, show: !!active.compare?.length },
    { key: 'traps', label: `Exam Traps (${active.nuances.length})`, show: true },
    { key: 'tips', label: 'Tips & Tricks', show: true },
  ]
  const activeTab = tabs.find((t) => t.key === tab)?.show ? tab : 'anatomy'

  // The grouped, selectable nav list — reused in the desktop sidebar and the
  // mobile disclosure so there is a single source of truth.
  const navList = (
    <nav className="space-y-4">
      {groups.map((g) => (
        <div key={g.domain}>
          <p className="font-space-mono text-[0.55rem] uppercase tracking-[0.15em] text-aws-muted/50 px-2 mb-1.5">
            {domainLabel[g.domain]}
          </p>
          <ul className="space-y-0.5">
            {g.items.map((s) => {
              const isActive = active.id === s.id
              return (
                <li key={s.id}>
                  <button
                    onClick={() => select(s)}
                    className={`group w-full text-left flex items-start gap-2 rounded-md px-2 py-1.5 transition-colors duration-150 ${
                      isActive ? 'bg-white/[0.06] text-aws-text' : 'text-aws-muted hover:bg-white/[0.03] hover:text-aws-text'
                    }`}
                  >
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-opacity ${domainDot[s.domain]} ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`} />
                    <span className={`text-[0.78rem] leading-snug ${isActive ? 'font-medium' : ''}`}>{s.title}</span>
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
      <Nav activePage="scenarios" />
      <main className="max-w-[1280px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        {/* page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted">Scenario Patterns</span>
            <span className="font-space-mono text-[0.6rem] text-aws-muted/50">· {scenarios.length} patterns</span>
          </div>
          <h1 className="font-space-mono text-2xl font-bold text-aws-text mb-1">Architecture Scenarios</h1>
          <p className="text-aws-muted text-sm max-w-2xl">
            High-yield SAA-C03 patterns with flow anatomy, comparison tables, exam traps, and
            mnemonics (<em className="not-italic text-aws-text/80">cara mudah ingat</em>). Study the{' '}
            <em className="not-italic text-aws-text/80">why</em> behind each component — not just the diagram.
          </p>
        </div>

        {/* mobile picker — Notion-style disclosure */}
        <details className="lg:hidden mb-5 bg-aws-card border border-aws-border rounded-xl overflow-hidden group">
          <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none select-none">
            <span className="flex items-center gap-2 min-w-0">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${domainDot[active.domain]}`} />
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
              {scenarios.length} Scenarios
            </p>
            {navList}
          </aside>

          {/* content */}
          <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden min-w-0">
          {/* card header */}
          <div className="px-5 py-4 border-b border-aws-border/60">
            <div className="flex items-start gap-3 flex-wrap">
              <span className={`font-space-mono text-[0.6rem] px-2 py-0.5 rounded border shrink-0 mt-0.5 ${domainColor[active.domain]}`}>
                {domainLabel[active.domain]}
              </span>
              <div className="min-w-0">
                <h2 className="text-aws-text font-bold text-lg leading-snug">{active.title}</h2>
                <p className="text-aws-muted text-[0.8rem] mt-0.5">{active.subtitle}</p>
              </div>
            </div>
            {/* tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {active.tags.map((t) => (
                <span key={t} className="font-space-mono text-[0.58rem] text-aws-muted/70 border border-aws-border/50 rounded-full px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* flow diagram */}
          <div className="px-5 py-6 border-b border-aws-border/60 bg-white/[0.01]">
            <FlowDiagram steps={active.flow} />
          </div>

          {/* overview */}
          <div className="px-5 py-4 border-b border-aws-border/60">
            <p className="text-aws-muted text-sm leading-relaxed">{active.overview}</p>
          </div>

          {/* mnemonic — cara mudah ingat */}
          {active.mnemonic && active.mnemonic.length > 0 && (
            <div className="px-5 py-4 border-b border-aws-border/60 bg-amber-500/[0.04]">
              <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-amber-400/70 mb-2">
                🧠 Cara Mudah Ingat
              </p>
              <ul className="space-y-1.5">
                {active.mnemonic.map((m, i) => (
                  <li key={i} className="text-[0.82rem] text-aws-text leading-relaxed flex gap-2">
                    <span className="text-amber-400/60 shrink-0">→</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* tabs */}
          <div className="flex gap-0 border-b border-aws-border/60 overflow-x-auto nav-scroll">
            {tabs.filter((t) => t.show).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`font-space-mono text-[0.6rem] uppercase tracking-widest px-5 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === t.key
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
            {activeTab === 'anatomy' && (
              <div className="space-y-5">
                {active.anatomy.map((item) => (
                  <div key={item.component} className="border border-aws-border/50 rounded-lg overflow-hidden">
                    <div className="px-4 py-2.5 bg-white/[0.03] border-b border-aws-border/40 flex items-baseline gap-3 flex-wrap">
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

            {activeTab === 'compare' && active.compare && (
              <div className="space-y-5">
                {active.compare.map((c, i) => (
                  <ComparisonTable key={c.label ?? i} compare={c} />
                ))}
              </div>
            )}

            {activeTab === 'traps' && (
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

            {activeTab === 'tips' && (
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
          <div className="px-5 py-4 border-t border-aws-border/60 bg-white/[0.01]">
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
          {/* content card end */}
          </div>
        </div>
        {/* grid end */}

        <SiteFooter tagline="AWS SAA-C03 · Scenario Patterns · Study the why, not just the diagram" />
      </main>
    </>
  )
}

// Renders left→right flow. A step with >1 node shows them stacked (parallel /
// fan-out / HA pair). Horizontal scroll on small screens.
function FlowDiagram({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="overflow-x-auto nav-scroll pb-1">
      <div className="flex items-stretch gap-0 min-w-max mx-auto w-fit">
        {steps.map((step, i) => (
          <div key={i} className="flex items-stretch gap-0">
            {/* stacked nodes for this step */}
            <div className="flex flex-col justify-center gap-1.5">
              {step.nodes.map((node, n) => {
                const colors = nodeColorMap[node.color]
                return (
                  <div
                    key={n}
                    className={`relative flex flex-col items-center justify-center px-4 py-3 rounded-xl border ${colors.border} ${colors.bg} min-w-[120px] text-center`}
                  >
                    {node.optional && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-space-mono text-[0.48rem] uppercase tracking-widest text-aws-muted/60 bg-aws-card px-1.5 rounded border border-aws-border/40">
                        optional
                      </span>
                    )}
                    <span className={`font-space-mono text-[0.7rem] font-bold ${colors.text} leading-tight`}>
                      {node.label}
                    </span>
                    {node.sublabel && (
                      <span className="font-space-mono text-[0.55rem] text-aws-muted mt-1 leading-tight max-w-[140px]">
                        {node.sublabel}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* arrow between steps */}
            {i < steps.length - 1 && (
              <div className="flex items-center mx-1.5 shrink-0">
                <div className="w-6 h-px bg-aws-border/60" />
                <svg width="6" height="10" viewBox="0 0 6 10" className="text-aws-border/60 -ml-px">
                  <path d="M0 0L6 5L0 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ComparisonTable({ compare }: { compare: CompareTable }) {
  const [attrHeader, ...valueHeaders] = compare.headers
  return (
    <div className="rounded-lg border border-aws-border/60 overflow-hidden">
      {compare.label && (
        <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-aws-muted px-3 pt-2.5 pb-1.5">
          {compare.label}
        </p>
      )}
      <div className="overflow-x-auto nav-scroll">
        <table className="w-full text-[0.78rem] border-collapse">
          <thead>
            <tr className="border-b border-aws-border">
              <th className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted text-left p-2.5 align-bottom">
                {attrHeader}
              </th>
              {valueHeaders.map((h, i) => (
                <th
                  key={h}
                  className={`font-space-mono text-[0.55rem] uppercase tracking-widest text-left p-2.5 align-bottom ${compareHeadTint[i % compareHeadTint.length]}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compare.rows.map(([attr, ...values], r) => (
              <tr key={attr} className={`border-b border-aws-border/40 ${r % 2 !== 0 ? 'bg-white/[0.015]' : ''}`}>
                <td className="font-space-mono font-bold text-[0.62rem] text-aws-muted p-2.5 align-top whitespace-nowrap">
                  {attr}
                </td>
                {values.map((value, i) => (
                  <td key={i} className={`text-aws-text p-2.5 align-top leading-snug ${compareCellTint[i % compareCellTint.length]}`}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {compare.takeaway && (
        <p className="text-[0.78rem] text-aws-text leading-relaxed px-3 py-2.5 bg-amber-500/5 border-t border-amber-500/15">
          <span className="text-amber-300 font-bold">Ingat: </span>
          {compare.takeaway}
        </p>
      )}
    </div>
  )
}
