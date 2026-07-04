import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { domains } from '@/data/awsServices'
import {
  categoryStyles,
  learnDomainIds,
  learnDomainSlugs,
  type LearnDomainSlug,
} from '@/data/awsMeta'
import Nav from '@/components/Nav'
import DomainHeader from '@/components/DomainHeader'
import LearnCard from '@/components/LearnCard'
import LearnHashRedirect from '@/components/LearnHashRedirect'
import OnThisPage from '@/components/OnThisPage'
import SiteFooter from '@/components/SiteFooter'

type PageProps = {
  params: Promise<{ domain: string }>
}

const isLearnDomainSlug = (value: string): value is LearnDomainSlug =>
  (learnDomainSlugs as readonly string[]).includes(value)

const switcher: Array<{ slug: LearnDomainSlug; label: string; colorClass: string }> = [
  { slug: 'd1', label: 'D1 · Secure', colorClass: 'text-c3 border-c3/25' },
  { slug: 'd2', label: 'D2 · Resilient', colorClass: 'text-c2 border-c2/25' },
  { slug: 'd3', label: 'D3 · High-Performing', colorClass: 'text-c1 border-c1/25' },
  { slug: 'd4', label: 'D4 · Cost-Optimized', colorClass: 'text-c6 border-c6/25' },
  { slug: 'extras', label: 'Framework + Extras', colorClass: 'text-aws-muted border-aws-border' },
]

export function generateStaticParams() {
  return learnDomainSlugs.map((domain) => ({ domain }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params
  if (!isLearnDomainSlug(domain)) return {}
  const first = domains.find((d) => learnDomainIds[domain].includes(d.id))
  if (!first) return {}
  return {
    title: `${first.title} — Deep Notes`,
    description: first.subtitle,
  }
}

export default async function LearnDomainPage({ params }: PageProps) {
  const { domain } = await params
  if (!isLearnDomainSlug(domain)) notFound()

  const pageDomains = domains.filter((d) => learnDomainIds[domain].includes(d.id))
  if (pageDomains.length === 0) notFound()

  // Domain 3 is split into per-section pages — /learn/d3 is a section index.
  const isD3Index = domain === 'd3'

  return (
    <>
      <Nav activePage="learn" />
      {isD3Index && <LearnHashRedirect />}

      <main id="top" className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        {!isD3Index && <OnThisPage only={`#${pageDomains[0].id}`} />}

        {/* domain switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <Link
            href="/learn"
            className="font-space-mono text-[0.62rem] uppercase tracking-widest px-2.5 py-1 rounded-full border border-aws-border/60 text-aws-muted hover:text-aws-text hover:border-aws-border transition-colors"
          >
            ← Deep Notes
          </Link>
          {switcher.map((entry) => (
            <Link
              key={entry.slug}
              href={`/learn/${entry.slug}`}
              aria-current={entry.slug === domain ? 'page' : undefined}
              className={`font-space-mono text-[0.62rem] uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all ${entry.colorClass} ${
                entry.slug === domain ? 'bg-white/10 font-bold' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {entry.label}
            </Link>
          ))}
        </div>

        {isD3Index ? (
          <>
            <DomainHeader domain={pageDomains[0]} />
            <div className="grid gap-3 sm:grid-cols-2">
              {pageDomains[0].sections.map((section) => {
                const styles = categoryStyles[section.category]
                return (
                  <Link
                    key={section.id}
                    href={`/learn/d3/${section.id.replace(/^d3-/, '')}`}
                    className="block bg-aws-card border border-aws-border rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15"
                  >
                    <span className="text-xl">{section.icon}</span>
                    <p className={`text-sm font-extrabold uppercase tracking-[0.05em] mt-1 ${styles.title}`}>
                      {section.title}
                    </p>
                    <p className="font-space-mono text-[0.62rem] text-aws-muted mt-1.5">
                      {section.services.length} services →
                    </p>
                  </Link>
                )
              })}
            </div>
          </>
        ) : (
          pageDomains.map((d, index) => (
          <div key={d.id}>
            {index > 0 && d.extra && (
              <div className="relative my-14">
                <div className="border-t-2 border-dashed border-aws-border/60" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-aws-bg border border-aws-border/60 rounded-full">
                  <span className="text-[0.6rem] font-space-mono text-aws-muted/70 uppercase tracking-widest">not in SAA-C03 exam</span>
                </div>
              </div>
            )}

            <DomainHeader domain={d} />

            {d.sections.map((section) => {
              const styles = categoryStyles[section.category]
              return (
                <div key={section.id} id={section.id} className="mb-10 scroll-mt-20">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-aws-border">
                    <span className="text-xl">{section.icon}</span>
                    <span className={`text-sm font-extrabold uppercase tracking-[0.05em] ${styles.title}`}>
                      {section.title}
                    </span>
                    <a href="#top" className="ml-auto font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors">
                      ↑ Top
                    </a>
                  </div>

                  {section.services.map((service) => (
                    <LearnCard key={service.shortName} service={service} category={section.category} sectionId={section.id} domainId={d.id} />
                  ))}
                </div>
              )
            })}
          </div>
          ))
        )}

        <SiteFooter tagline="AWS SAA-C03 · Deep Notes · Good luck! 💪" />
      </main>
    </>
  )
}
