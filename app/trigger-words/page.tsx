import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import { triggerRows, trapRows, dbDecisionTree, petaModules, type Accent } from '@/data/triggerWords'

export const metadata: Metadata = {
  title: 'Trigger Words — AWS SAA-C03 Study',
  description:
    'Keyword → service cheat sheet for the SAA-C03 exam, grouped by domain (D1–D4). Spot the trigger word, fire the answer, dodge the trap. Each row links to the full Deep Notes card.',
}

// Static class strings only (no `text-${x}`) so Tailwind JIT keeps them.
const accentText: Record<Accent, string> = {
  c1: 'text-c1', c2: 'text-c2', c3: 'text-c3', c4: 'text-c4', c5: 'text-c5', c6: 'text-c6',
}
const accentBorder: Record<Accent, string> = {
  c1: 'border-c1/30', c2: 'border-c2/30', c3: 'border-c3/30', c4: 'border-c4/30', c5: 'border-c5/30', c6: 'border-c6/30',
}
const accentBg: Record<Accent, string> = {
  c1: 'bg-c1/8', c2: 'bg-c2/8', c3: 'bg-c3/8', c4: 'bg-c4/8', c5: 'bg-c5/8', c6: 'bg-c6/8',
}

// Domain drives the colour now (rows are grouped by it), so one hue per group
// scans cleaner than a per-service rainbow. Order = exam domain order.
const domainMeta: { code: string; label: string; accent: Accent }[] = [
  { code: 'D1', label: 'Secure', accent: 'c3' },
  { code: 'D2', label: 'Resilient', accent: 'c1' },
  { code: 'D3', label: 'High-Perf', accent: 'c5' },
  { code: 'D4', label: 'Cost', accent: 'c4' },
]

const groups = domainMeta
  .map((d) => ({ ...d, rows: triggerRows.filter((r) => r.domain.startsWith(d.code)) }))
  .filter((g) => g.rows.length > 0)

export default function TriggerWordsPage() {
  return (
    <>
      <Nav activePage="triggers" />
      <main className="max-w-[820px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        {/* Hero */}
        <header className="mb-9">
          <h1 className="font-space-mono text-2xl font-bold text-aws-text mb-2 text-balance">Trigger Words</h1>
          <p className="text-aws-muted text-sm leading-relaxed max-w-[58ch]">
            90% soalan SAA-C03 berlegar pada satu <span className="text-aws-text">trigger word</span>. Nampak keyword
            → tembak service → buang perangkap. Disusun ikut domain exam (D1–D4) — tap mana-mana row untuk Deep Notes.
          </p>
          <p className="font-space-mono text-[0.55rem] text-aws-muted mt-3">
            {triggerRows.length} triggers · {groups.length} domain · 1 decision tree · {petaModules.length} corak · {trapRows.length} perangkap
          </p>
        </header>

        {/* Ledger — grouped by domain */}
        {groups.map((g) => (
          <section key={g.code} className="mb-9">
            {/* Domain header — coloured label + count + rule that fills the row */}
            <div className="flex items-baseline gap-3 mb-1">
              <h2 className={`font-space-mono text-[0.95rem] font-bold ${accentText[g.accent]}`}>
                {g.code} · {g.label}
              </h2>
              <span className="font-space-mono text-[0.55rem] text-aws-muted">{g.rows.length}</span>
              <span className="flex-1 h-px bg-aws-border/60" aria-hidden="true" />
            </div>

            {/* Rows */}
            <div>
              {g.rows.map((row) => (
                <Link
                  key={row.id}
                  href={`/learn#${row.slug}`}
                  aria-label={`${row.service} — Deep Notes`}
                  className="group block border-b border-aws-border/50 last:border-0 py-3 px-3 -mx-3 transition-colors hover:bg-white/[0.025] md:grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-6 md:items-baseline"
                >
                  {/* Keywords */}
                  <p className="mb-1.5 md:mb-0 leading-relaxed">
                    {row.keywords.map((kw, i) => (
                      <span key={kw} className="text-[0.78rem] text-aws-text/85">
                        {kw}
                        {i < row.keywords.length - 1 && <span className="text-aws-muted/40"> · </span>}
                      </span>
                    ))}
                  </p>

                  {/* Service + why */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[0.55rem] leading-none ${accentText[g.accent]}`} aria-hidden="true">●</span>
                      <span className="md:hidden text-aws-muted text-xs" aria-hidden="true">→</span>
                      <span className={`font-space-mono text-[0.82rem] font-bold ${accentText[g.accent]}`}>{row.service}</span>
                      <span className="ml-auto text-aws-muted/40 text-sm transition-all group-hover:translate-x-0.5 group-hover:text-aws-muted" aria-hidden="true">›</span>
                    </div>
                    <p className="text-[0.72rem] text-aws-muted leading-relaxed pl-[1.05rem] mt-0.5">{row.why}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Pilih Database — decision tree */}
        <section className="mb-9">
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="font-space-mono text-[0.95rem] font-bold text-aws-text">★ Pilih Database</h2>
            <span className="font-space-mono text-[0.55rem] text-aws-muted">pokok keputusan</span>
            <span className="flex-1 h-px bg-aws-border/60" aria-hidden="true" />
          </div>
          <p className="text-[0.72rem] text-aws-muted mb-3 max-w-[60ch] leading-relaxed">
            Nampak bentuk data → pilih keluarga → tembak service ikut keyword. Mula dari soalan ni:
          </p>

          {/* Root question */}
          <div className="font-space-mono text-[0.8rem] font-bold text-c5 border border-c5/30 bg-c5/8 rounded-md px-3 py-2 mb-3 inline-block">
            {dbDecisionTree.root}
          </div>

          {/* Branches */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dbDecisionTree.branches.map((b) => (
              <div key={b.cat} className={`rounded-lg border ${accentBorder[b.accent]} ${accentBg[b.accent]} p-3`}>
                <h3 className={`font-space-mono text-[0.72rem] font-bold mb-2.5 pb-2 border-b border-aws-border/60 ${accentText[b.accent]}`}>
                  {b.cat}
                </h3>
                <div className="flex flex-col gap-2.5">
                  {b.leaves.map((leaf) => (
                    <div key={leaf.svc}>
                      <span className={`font-space-mono text-[0.78rem] font-bold ${accentText[b.accent]}`}>{leaf.svc}</span>
                      <p className="text-[0.69rem] text-aws-muted leading-relaxed mt-0.5">{leaf.cond}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[0.7rem] text-aws-muted/90 mt-3 max-w-[68ch] leading-relaxed">
            <span className="text-c5 font-semibold">Discriminator:</span> &ldquo;relational + transaksi&rdquo; → RDS/Aurora ·
            &ldquo;key-value + serverless + ms&rdquo; → DynamoDB · &ldquo;graph / hubungan&rdquo; → Neptune ·
            &ldquo;warehouse / BI&rdquo; → Redshift · &ldquo;cache&rdquo; → ElastiCache (BUKAN DAX melainkan sebut DynamoDB).
          </p>
        </section>

        {/* Peta Besar — corak teras */}
        <section className="mb-9">
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="font-space-mono text-[0.95rem] font-bold text-aws-text">★ Peta Besar</h2>
            <span className="font-space-mono text-[0.55rem] text-aws-muted">{petaModules.length} corak teras</span>
            <span className="flex-1 h-px bg-aws-border/60" aria-hidden="true" />
          </div>
          <p className="text-[0.72rem] text-aws-muted mb-3 max-w-[60ch] leading-relaxed">
            Pasangan keliru yang exam ulang — kotak <span className="text-aws-text">vs</span> kotak, dengan discriminator.
            <span className="text-aws-muted/70"> (vs = pilih satu · → = aliran · ⊃ = mengandungi · + = dua-dua perlu)</span>
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {petaModules.map((m) => (
              <div key={m.num} className="rounded-lg border border-aws-border bg-aws-card/40 p-3.5">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className={`font-space-mono text-[0.7rem] font-bold ${accentText[m.accent]}`}>{m.num}</span>
                  <h3 className="font-space-mono text-[0.8rem] font-bold text-aws-text">{m.title}</h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  {m.rows.map((row) => (
                    <div key={row.left + row.right}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-space-mono text-[0.72rem] font-semibold rounded border ${accentBorder[m.accent]} ${accentBg[m.accent]} px-1.5 py-0.5 ${accentText[m.accent]}`}>
                          {row.left}
                        </span>
                        <span className="font-space-mono text-[0.66rem] text-aws-muted" aria-hidden="true">{row.rel}</span>
                        <span className="font-space-mono text-[0.72rem] font-semibold rounded border border-aws-border bg-aws-bg px-1.5 py-0.5 text-aws-text/85">
                          {row.right}
                        </span>
                      </div>
                      <p className="text-[0.69rem] text-aws-muted leading-relaxed mt-1">{row.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Traps */}
        <section>
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="font-space-mono text-[0.95rem] font-bold text-rose-400">Perangkap</h2>
            <span className="font-space-mono text-[0.55rem] text-aws-muted">{trapRows.length}</span>
            <span className="flex-1 h-px bg-rose-500/25" aria-hidden="true" />
          </div>
          <p className="text-[0.72rem] text-aws-muted mb-2 max-w-[60ch] leading-relaxed">
            Jawapan yang nampak betul tapi tak kena root cause — exam ulang perangkap yang sama.
          </p>
          <div>
            {trapRows.map((t) => (
              <div
                key={t.bait}
                className="border-b border-rose-500/15 last:border-0 py-2.5 sm:grid sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-4 sm:items-baseline"
              >
                <div className="flex items-start gap-2 mb-1 sm:mb-0">
                  <span className="text-rose-400/80 text-xs leading-none mt-0.5 shrink-0" aria-hidden="true">✕</span>
                  <span className="font-space-mono text-[0.74rem] text-rose-300/90 line-through decoration-rose-500/40 leading-snug">{t.bait}</span>
                </div>
                <p className="text-[0.74rem] text-aws-muted leading-relaxed pl-6 sm:pl-0">{t.fix}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="font-space-mono text-[0.55rem] text-aws-muted mt-8">
          Setiap row link ke penjelasan penuh di{' '}
          <Link href="/learn" className="text-c1 hover:underline">Deep Notes</Link>. Test diri di{' '}
          <Link href="/practice" className="text-c1 hover:underline">Practice</Link>.
        </p>

        <SiteFooter tagline="AWS SAA-C03 · Trigger Words · Good luck! 💪" />
      </main>
    </>
  )
}
