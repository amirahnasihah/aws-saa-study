import { domains } from '@/data/awsServices'
import Nav from '@/components/Nav'
import DomainHeader from '@/components/DomainHeader'
import Section from '@/components/Section'
import OnThisPage from '@/components/OnThisPage'
import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'

export default function Home() {
  return (
    <>
      <Nav activePage="cheatsheet" />

      <main id="top" className="max-w-[920px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        <OnThisPage />

        {/* page hint */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <p className="text-xs font-semibold text-aws-text">Quick Reference</p>
            <p className="font-space-mono text-[0.62rem] text-aws-muted">service name · mnemonic · keywords</p>
          </div>
          <Link href="/learn" className="font-space-mono text-[0.62rem] text-aws-muted border border-aws-border/60 rounded-lg px-3 py-1.5 hover:text-aws-text hover:border-aws-border transition-all">
            Full explanations → Deep Notes
          </Link>
        </div>
        {domains.map((domain, index) => (
          <div key={domain.id}>
            {index > 0 && (
              <div className="relative my-12 border-t-2 border-aws-border">
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-c6 to-c5" />
              </div>
            )}

            <DomainHeader domain={domain} />

            {domain.sections.map((section) => (
              <Section key={section.id} section={section} />
            ))}
          </div>
        ))}

        <SiteFooter
          tagline="AWS SAA-C03 · All 4 Domains · Study Reference · Good luck! 💪"
          extra={
            <p>
              <Link href="/learn" className="text-c1 hover:text-aws-text transition-colors underline underline-offset-2">
                → Deep Notes: detailed explanations
              </Link>
            </p>
          }
        />
      </main>
    </>
  )
}
