import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import { triggerRows, trapRows, type Accent } from '@/data/triggerWords'

export const metadata: Metadata = {
  title: 'Trigger Words — AWS SAA-C03 Study',
  description:
    'Keyword → service cheat sheet for the SAA-C03 exam. Spot the trigger word, fire the answer, dodge the trap. Each row links to the full Deep Notes card.',
}

// Static class strings only (no `text-${x}`) so Tailwind JIT keeps them.
const accentText: Record<Accent, string> = {
  c1: 'text-c1', c2: 'text-c2', c3: 'text-c3', c4: 'text-c4', c5: 'text-c5', c6: 'text-c6',
}
const accentBox: Record<Accent, string> = {
  c1: 'border-c1/30 bg-c1/10', c2: 'border-c2/30 bg-c2/10', c3: 'border-c3/30 bg-c3/10',
  c4: 'border-c4/30 bg-c4/10', c5: 'border-c5/30 bg-c5/10', c6: 'border-c6/30 bg-c6/10',
}

const steps = [
  { n: '1', label: 'Cari kata kunci', body: 'Baca soalan, kesan trigger word (kotak kelabu kiri).' },
  { n: '2', label: 'Padan jawapan', body: 'Tembak service yang dipadankan (kotak warna kanan).' },
  { n: '3', label: 'Buang perangkap', body: 'Semak senarai merah — buang jawapan yang nampak betul tapi tak kena root cause.' },
]

export default function TriggerWordsPage() {
  return (
    <>
      <Nav activePage="triggers" />
      <main className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        {/* Hero */}
        <div className="mb-6">
          <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c1 mb-2">Cheat Sheet</p>
          <h1 className="font-space-mono text-2xl font-bold text-aws-text mb-1">Trigger Words</h1>
          <p className="text-aws-muted text-sm leading-relaxed max-w-[560px]">
            90% soalan SAA-C03 berlegar pada satu <span className="text-aws-text">trigger word</span>. Nampak keyword
            → tembak service → buang perangkap. Tak payah hafal mendalam — kenal "kerja" setiap service.
          </p>
        </div>

        {/* How to use */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-aws-border bg-aws-card/60 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-space-mono text-[0.62rem] font-bold text-c1 shrink-0">{s.n}</span>
                <h2 className="text-[0.8rem] font-bold text-aws-text leading-tight">{s.label}</h2>
              </div>
              <p className="text-[0.72rem] text-aws-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Trigger → service rows */}
        <div className="mb-3 flex items-baseline justify-between">
          <p className="font-space-mono text-[0.58rem] uppercase tracking-widest text-c1">Keyword → Service</p>
          <p className="font-space-mono text-[0.55rem] text-aws-muted">{triggerRows.length} triggers</p>
        </div>
        <div className="space-y-2.5 mb-12">
          {triggerRows.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border border-aws-border bg-aws-card/60 p-4 flex flex-col md:flex-row md:items-stretch gap-3"
            >
              {/* Left — trigger keywords */}
              <div className="md:w-[46%] shrink-0 rounded-lg border border-aws-border bg-aws-bg/60 p-3">
                <p className="font-space-mono text-[0.5rem] uppercase tracking-wider text-aws-muted mb-1.5">Nampak kata kunci</p>
                <div className="flex flex-wrap gap-1.5">
                  {row.keywords.map((kw) => (
                    <span key={kw} className="rounded-full border border-aws-border bg-aws-card px-2 py-0.5 text-[0.66rem] text-aws-text/90 leading-snug">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center text-aws-muted shrink-0" aria-hidden="true">→</div>

              {/* Right — answer */}
              <div className={`flex-1 rounded-lg border p-3 ${accentBox[row.accent]}`}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`font-space-mono text-[0.85rem] font-bold ${accentText[row.accent]}`}>{row.service}</span>
                  <span className="font-space-mono text-[0.5rem] text-aws-muted border border-aws-border rounded-full px-1.5 py-0.5">{row.domain}</span>
                </div>
                <p className="text-[0.74rem] text-aws-muted leading-relaxed mb-2">{row.why}</p>
                <Link
                  href={`/learn#${row.slug}`}
                  className="font-space-mono text-[0.58rem] text-aws-muted hover:text-aws-text transition-colors border border-aws-border/60 rounded-md px-2 py-0.5 inline-block"
                >
                  Deep Notes →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Traps */}
        <div className="mb-3">
          <p className="font-space-mono text-[0.58rem] uppercase tracking-widest text-rose-400">Yang selalu jadi perangkap</p>
          <p className="text-[0.72rem] text-aws-muted mt-1">Jawapan yang nampak betul tapi tak kena root cause — exam ulang perangkap yang sama.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {trapRows.map((t) => (
            <div key={t.bait} className="rounded-xl border border-rose-500/30 bg-rose-500/[0.07] p-4">
              <div className="flex items-start gap-2 mb-1.5">
                <span className="text-rose-400 text-[0.8rem] shrink-0 leading-none mt-0.5" aria-hidden="true">✕</span>
                <p className="font-space-mono text-[0.72rem] font-bold text-rose-300 leading-snug line-through decoration-rose-500/50">{t.bait}</p>
              </div>
              <p className="text-[0.74rem] text-aws-muted leading-relaxed pl-5">{t.fix}</p>
            </div>
          ))}
        </div>

        <p className="font-space-mono text-[0.55rem] text-aws-muted mt-6">
          Setiap row link ke penjelasan penuh di{' '}
          <Link href="/learn" className="text-c1 hover:underline">Deep Notes</Link>. Test diri di{' '}
          <Link href="/practice" className="text-c1 hover:underline">Practice</Link>.
        </p>

        <SiteFooter tagline="AWS SAA-C03 · Trigger Words · Good luck! 💪" />
      </main>
    </>
  )
}
