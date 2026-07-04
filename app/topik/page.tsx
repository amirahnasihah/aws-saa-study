import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import TopikSearch from '@/components/TopikSearch'
import { domains, categoryStyles, learnHref, serviceSlug } from '@/data/awsServices'

export const metadata: Metadata = {
  title: 'Topik Index — AWS SAA-C03 Study',
  description: 'Cari topik exam cepat: setiap service + keyword → card Deep Notes. Index "ada ke cover?" untuk revision.',
}

export default function TopikPage() {
  const totalServices = domains.reduce(
    (total, domain) => total + domain.sections.reduce((sum, section) => sum + section.services.length, 0),
    0,
  )

  return (
    <>
      <Nav />

      <main className="max-w-[920px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20">
        {/* header */}
        <div className="text-center mb-6">
          <span className="font-space-mono text-[0.65rem] uppercase tracking-[0.15em] text-aws-muted">Topik Index</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-2 text-aws-text">Ada ke cover? Cari sini.</h1>
          <p className="font-space-mono text-[0.78rem] text-aws-muted max-w-xl mx-auto leading-relaxed">
            Index semua topik → card Deep Notes. Taip keyword (cth: encryption, NAT, failover, lifecycle, queue scaling) dan terus klik ke card penuh.
          </p>
        </div>

        {/* cross-links */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {[
            { href: '/trigger-words', label: 'Trigger Words' },
            { href: '/glossary', label: 'Glossary' },
            { href: '/learn', label: 'Deep Notes' },
            { href: '/scenarios', label: 'Scenarios' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="font-space-mono text-[0.65rem] text-aws-muted border border-aws-border/60 rounded-full px-3 py-1 hover:border-aws-border hover:text-aws-text transition-all duration-150">
              {l.label}
            </Link>
          ))}
        </div>

        <TopikSearch />

        {/* grouped index */}
        <div className="mt-8 space-y-10">
          {domains.map((domain) => (
            <div key={domain.id}>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-aws-text flex items-center gap-2">
                  <span className="font-space-mono text-[0.6rem] px-2 py-0.5 rounded-full border border-aws-border/60 text-aws-muted">{domain.badge}</span>
                  {domain.title}
                </h2>
              </div>

              <div className="space-y-6">
                {domain.sections.map((section) => {
                  const groupId = `${domain.id}-${section.id}`
                  const groupCount = section.services.length
                  return (
                    <div key={section.id} data-topik-group data-group={groupId}>
                      <h3 data-topik-group data-group={groupId} className="text-[0.7rem] font-space-mono uppercase tracking-widest text-aws-muted mb-2">
                        {section.icon} {section.title} <span className="text-aws-border">·</span> {groupCount}
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {section.services.map((service) => {
                          const slug = serviceSlug(section.id, service.shortName)
                          const styles = categoryStyles[section.category]
                          const kws = (service.keywords ?? []).slice(0, 8).join(', ')
                          const hay = `${service.shortName} ${service.fullName} ${kws} ${section.title} ${domain.title}`.toLowerCase()
                          return (
                            <Link
                              key={`${section.id}-${service.shortName}`}
                              href={learnHref(slug)}
                              data-topik-card
                              data-group={groupId}
                              data-search={hay}
                              className="group block bg-aws-card border border-aws-border rounded-xl px-4 py-3 hover:border-aws-border/80 hover:bg-white/[0.03] transition-all duration-150"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.accent}`} />
                                <span className="text-aws-text text-sm font-semibold truncate">{service.shortName}</span>
                                <span className="text-aws-muted text-[0.62rem] font-space-mono truncate ml-auto">{service.fullName}</span>
                              </div>
                              {kws && (
                                <p className="mt-1.5 font-space-mono text-[0.58rem] text-aws-muted/70 leading-relaxed line-clamp-2">
                                  {kws}
                                </p>
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center font-space-mono text-[0.6rem] text-aws-muted/60">
          {totalServices} service cards · taip untuk filter · klik untuk ke Deep Notes
        </p>
      </main>

      <SiteFooter tagline="AWS SAA-C03 · Topik Index · Cari cepat, lulus exam 💪" />
    </>
  )
}
