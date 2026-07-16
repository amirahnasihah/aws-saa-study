import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { domains } from '@/data/awsServices'
import { categoryStyles, isLearnD3SectionSlug, learnD3SectionSlugs } from '@/data/awsMeta'
import Nav from '@/components/Nav'
import LearnCard from '@/components/LearnCard'
import SiteFooter from '@/components/SiteFooter'

type PageProps = {
  params: Promise<{ domain: string; section: string }>
}

export function generateStaticParams() {
  return learnD3SectionSlugs.map((section) => ({ domain: 'd3', section }))
}

const findSection = (sectionSlug: string) =>
  domains
    .find((d) => d.id === 'domain3')
    ?.sections.find((s) => s.id === `d3-${sectionSlug}`)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain, section } = await params
  if (domain !== 'd3' || !isLearnD3SectionSlug(section)) return {}
  const data = findSection(section)
  if (!data) return {}
  return {
    title: `${data.title} — D3 Deep Notes`,
    description: `Domain 3 · High-Performing Architectures — ${data.title} services explained for SAA-C03`,
  }
}

export default async function LearnD3SectionPage({ params }: PageProps) {
  const { domain, section } = await params
  if (domain !== 'd3' || !isLearnD3SectionSlug(section)) notFound()

  const domain3 = domains.find((d) => d.id === 'domain3')
  const data = findSection(section)
  if (!domain3 || !data) notFound()

  const styles = categoryStyles[data.category]

  return (
    <>
      <Nav activePage="learn" />

      <main id="top" className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        {/* section switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <Link
            href="/learn/d3"
            className="font-space-mono text-[0.62rem] uppercase tracking-widest px-2.5 py-1 rounded-full border border-aws-border/60 text-aws-muted hover:text-aws-text hover:border-aws-border transition-colors"
          >
            ← D3 · High-Performing
          </Link>
          {domain3.sections.map((s) => {
            const current = s.id === data.id
            return (
              <Link
                key={s.id}
                href={`/learn/d3/${s.id.replace(/^d3-/, '')}`}
                aria-current={current ? 'page' : undefined}
                className={`font-space-mono text-[0.62rem] px-2.5 py-1 rounded-full border transition-all ${categoryStyles[s.category].nav} ${
                  current ? 'bg-white/10 font-bold' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {s.icon} {s.title}
              </Link>
            )
          })}
        </div>

        <div id={data.id} className="mb-10 scroll-mt-20">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-aws-border">
            <span className="text-xl">{data.icon}</span>
            <span className={`text-sm font-extrabold uppercase tracking-[0.05em] ${styles.title}`}>
              {data.title}
            </span>
            <a href="#top" className="ml-auto font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors">
              ↑ Top
            </a>
          </div>

          {data.services.map((service) => (
            <LearnCard key={service.shortName} service={service} category={data.category} sectionId={data.id} domainId={domain3.id} />
          ))}
        </div>

        <SiteFooter tagline="AWS SAA-C03 · Deep Notes · Good luck! 💪" />
      </main>
    </>
  )
}
