import Link from 'next/link'
import { domains } from '@/data/awsServices'
import {
  categoryStyles,
  learnDomainIds,
  learnDomainSlugs,
  learnHref,
  type LearnDomainSlug,
} from '@/data/awsMeta'
import Nav from '@/components/Nav'
import LearnHashRedirect from '@/components/LearnHashRedirect'
import SiteFooter from '@/components/SiteFooter'

export const metadata = {
  title: 'AWS SAA-C03 — Deep Notes',
  description: 'Detailed explanations for every AWS service across all 4 exam domains',
}

const domainAccent: Record<LearnDomainSlug, string> = {
  d1: 'text-c3 border-c3/25 hover:border-c3/50',
  d2: 'text-c2 border-c2/25 hover:border-c2/50',
  d3: 'text-c1 border-c1/25 hover:border-c1/50',
  d4: 'text-c6 border-c6/25 hover:border-c6/50',
  extras: 'text-aws-muted border-aws-border/60 hover:border-aws-border',
}

export default function LearnPage() {
  return (
    <>
      <Nav activePage="learn" />
      <LearnHashRedirect />

      <main className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        {/* page header */}
        <div className="text-center mb-10">
          <span className="font-space-mono text-[0.65rem] uppercase tracking-[0.15em] text-aws-muted">Deep Notes</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-2 text-aws-text">
            Detailed Explanations
          </h1>
          <p className="font-space-mono text-[0.78rem] text-aws-muted max-w-lg mx-auto leading-relaxed">
            Baca, faham, ingat. Setiap service dijelaskan dengan context exam — kenapa guna, bila guna, dan exam scenario. Pilih domain untuk mula.
          </p>
        </div>

        <div className="space-y-5">
          {learnDomainSlugs.map((slug) => {
            const slugDomains = domains.filter((d) => learnDomainIds[slug].includes(d.id))
            const serviceCount = slugDomains.reduce(
              (total, d) => total + d.sections.reduce((n, s) => n + s.services.length, 0),
              0,
            )
            return (
              <div key={slug} className={`block bg-aws-card border rounded-xl p-5 transition-colors ${domainAccent[slug]}`}>
                {slugDomains.map((d) => (
                  <div key={d.id} className="mb-3 last:mb-0">
                    <Link href={`/learn/${slug}`} className="group block">
                      <span className="font-space-mono text-[0.6rem] uppercase tracking-[0.15em] opacity-80">{d.badge}</span>
                      <h2 className="text-lg font-extrabold text-aws-text mt-1 group-hover:underline underline-offset-4">
                        {d.title}
                      </h2>
                      <p className="font-space-mono text-[0.7rem] text-aws-muted mt-1 leading-relaxed">{d.subtitle}</p>
                    </Link>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {d.sections.map((section) => (
                        <Link
                          key={section.id}
                          href={learnHref(section.id)}
                          className={`font-space-mono text-[0.62rem] px-2 py-0.5 rounded-full border transition-all hover:bg-white/6 ${categoryStyles[section.category].nav}`}
                        >
                          {section.icon} {section.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="font-space-mono text-[0.6rem] text-aws-muted/70 mt-3">
                  {serviceCount} services →
                </p>
              </div>
            )
          })}
        </div>

        <SiteFooter tagline="AWS SAA-C03 · All 4 Domains · Deep Notes · Good luck! 💪" />
      </main>
    </>
  )
}
