import Link from 'next/link'

export const metadata = {
  title: 'AWS SAA-C03 — 404 Not Found',
}

const links = [
  { href: '/learn',    label: 'Learn',     desc: 'Study notes by domain' },
  { href: '/practice', label: 'Practice',  desc: 'Exam-style questions' },
  { href: '/vpc',      label: 'VPC Guide', desc: 'Deep-dive on VPC' },
  { href: '/visual',   label: 'Visuals',   desc: 'Architecture diagrams' },
]

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-c1/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-c3/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full">
        {/* status code */}
        <p className="font-space-mono text-[0.65rem] uppercase tracking-[0.2em] text-aws-muted mb-3">
          HTTP 404 · Resource Not Found
        </p>

        <div className="relative mb-6 select-none">
          <span
            className="font-space-mono font-bold text-[7rem] sm:text-[9rem] leading-none
              bg-gradient-to-br from-c1 via-c3 to-c4 bg-clip-text text-transparent"
          >
            404
          </span>
          {/* reflection */}
          <span
            aria-hidden
            className="absolute left-0 right-0 top-full font-space-mono font-bold
              text-[7rem] sm:text-[9rem] leading-none bg-gradient-to-br from-c1 via-c3 to-c4
              bg-clip-text text-transparent opacity-10 scale-y-[-1] block"
          >
            404
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-aws-text mb-2">
          Page not found
        </h1>
        <p className="text-aws-muted text-[0.85rem] leading-relaxed mb-8 max-w-xs mx-auto">
          This route doesn&apos;t exist. Maybe it was moved, deleted, or you typed the URL wrong.
        </p>

        {/* nav cards */}
        <div className="grid grid-cols-2 gap-2 mb-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group bg-aws-card border border-aws-border hover:border-c4/40
                rounded-xl px-4 py-3 text-left transition-all duration-150 hover:bg-c4/5"
            >
              <p className="font-space-mono text-[0.68rem] font-bold text-c4 group-hover:text-c4 mb-0.5">
                {l.label}
              </p>
              <p className="text-[0.72rem] text-aws-muted leading-snug">{l.desc}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 font-space-mono text-[0.7rem] uppercase
            tracking-widest text-aws-muted hover:text-aws-text transition-colors"
        >
          <span>←</span> Back to home
        </Link>
      </div>
    </main>
  )
}
