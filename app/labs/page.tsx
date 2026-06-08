import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import { labs } from '@/data/labs'

export const metadata: Metadata = {
  title: 'AWS SAA-C03 — Hands-on Labs',
  description: 'Personal notes from hands-on guided labs completed while studying for the AWS SAA-C03 exam.',
}

const levelColor: Record<string, string> = {
  Fundamental: 'text-c2 border-c2/25',
  Intermediate: 'text-c4 border-c4/25',
  Advanced: 'text-c6 border-c6/25',
}

export default function LabsPage() {
  return (
    <>
      <Nav activePage="labs" />

      <main id="top" className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        <div className="text-center mb-10">
          <span className="font-space-mono text-[0.65rem] uppercase tracking-[0.15em] text-aws-muted">Hands-on Labs</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-2 text-aws-text">
            Labs
          </h1>
          <p className="font-space-mono text-[0.78rem] text-aws-muted max-w-lg mx-auto leading-relaxed">
            Guided labs I&rsquo;ve completed while studying for SAA-C03 — the steps I took, the gotchas I hit, and what I&rsquo;d do differently next time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {labs.map((lab) => (
            <Link
              key={lab.slug}
              href={`/labs/${lab.slug}`}
              className="block bg-aws-card border border-aws-border rounded-xl p-5 hover:border-aws-text/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-space-mono text-[0.6rem] px-2 py-0.5 rounded border ${levelColor[lab.level] ?? 'text-aws-muted border-aws-border'}`}>
                  {lab.level}
                </span>
                <span className="font-space-mono text-[0.6rem] text-aws-muted">{lab.duration}</span>
                <span className="font-space-mono text-[0.6rem] text-aws-muted ml-auto">Completed {lab.completedOn}</span>
              </div>
              <h2 className="text-aws-text font-bold text-lg leading-snug mb-1">{lab.title}</h2>
              <p className="text-aws-muted text-[0.8rem] mb-3">{lab.summary}</p>
              <div className="flex flex-wrap gap-1.5">
                {lab.services.map((service) => (
                  <span key={service} className="font-space-mono text-[0.6rem] px-2 py-0.5 rounded-full border border-c1/20 text-c1">
                    {service}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <SiteFooter tagline="AWS SAA-C03 · Hands-on Labs · Personal notes from guided practice" />
      </main>
    </>
  )
}
