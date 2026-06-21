import { domains } from '@/data/awsServices'
import Nav from '@/components/Nav'
import DomainHeader from '@/components/DomainHeader'
import LearnCard from '@/components/LearnCard'
import OnThisPage from '@/components/OnThisPage'
import SiteFooter from '@/components/SiteFooter'
import { categoryStyles } from '@/data/awsServices'

export const metadata = {
  title: 'AWS SAA-C03 — Deep Notes',
  description: 'Detailed explanations for every AWS service across all 4 exam domains',
}

export default function LearnPage() {
  return (
    <>
      <Nav activePage="learn" />

      <main id="top" className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        <OnThisPage />

        {/* page header */}
        <div className="text-center mb-10">
          <span className="font-space-mono text-[0.65rem] uppercase tracking-[0.15em] text-aws-muted">Deep Notes</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-2 text-aws-text">
            Detailed Explanations
          </h1>
          <p className="font-space-mono text-[0.78rem] text-aws-muted max-w-lg mx-auto leading-relaxed">
            Baca, faham, ingat. Setiap service dijelaskan dengan context exam — kenapa guna, bila guna, dan exam scenario.
          </p>
        </div>

        {domains.map((domain, index) => (
          <div key={domain.id}>
            {index > 0 && !domain.extra && (
              <div className="relative my-12 border-t-2 border-aws-border">
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-c6 to-c5" />
              </div>
            )}

            {domain.extra && (
              <div className="relative my-14">
                <div className="border-t-2 border-dashed border-aws-border/60" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-aws-bg border border-aws-border/60 rounded-full">
                  <span className="text-[0.6rem] font-space-mono text-aws-muted/70 uppercase tracking-widest">not in SAA-C03 exam</span>
                </div>
              </div>
            )}

            <DomainHeader domain={domain} />

            {domain.sections.map((section) => {
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
                    <LearnCard key={service.shortName} service={service} category={section.category} sectionId={section.id} />
                  ))}
                </div>
              )
            })}
          </div>
        ))}

        <SiteFooter tagline="AWS SAA-C03 · All 4 Domains · Deep Notes · Good luck! 💪" />
      </main>
    </>
  )
}
