import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import { GITHUB_URL, PORTFOLIO_URL, SITE_URL } from '@/data/siteLinks'
import { glossary } from '@/data/glossary'

export const metadata: Metadata = {
  title: 'About — AWS SAA-C03 Study',
  description: 'Open-source AWS SAA-C03 study reference — source code on GitHub, built by amirahnasihah.my',
}

const termCount = Object.keys(glossary).length

const links = [
  {
    href: PORTFOLIO_URL,
    label: 'Portfolio',
    description: 'More projects & work by the person who built this site',
    host: 'amirahnasihah.my',
    icon: '→',
    external: true,
  },
  {
    href: GITHUB_URL,
    label: 'GitHub Repository',
    description: 'Source code, issues & contributions — open source, star if helpful',
    host: 'github.com/amirahnasihah/aws-saa-study',
    icon: '★',
    external: true,
  },
  {
    href: '/changelog',
    label: 'Changelog',
    description: 'What changed, when, and why — a running log of site updates',
    host: `${SITE_URL.replace(/^https?:\/\//, '')}/changelog`,
    icon: '◷',
    external: false,
  },
  {
    href: '/glossary',
    label: 'Glossary',
    description: `${termCount} AWS & networking terms — searchable reference with category filters`,
    host: `${SITE_URL.replace(/^https?:\/\//, '')}/glossary`,
    icon: '§',
    external: false,
  },
] as const

const cardClass =
  'group block rounded-xl border border-aws-border bg-aws-card/60 p-5 transition-all hover:border-c1/40 hover:bg-aws-card'

export default function AboutPage() {
  return (
    <>
      <Nav />

      <main className="max-w-4xl mx-auto px-4 pt-[calc(3.5rem+2rem)] pb-16">
        {/* Hero */}
        <div className="mb-8">
          <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c1 mb-2">About</p>
          <h1 className="text-2xl font-bold text-aws-text mb-3">AWS SAA-C03 Study</h1>
          <p className="text-sm text-aws-muted leading-relaxed max-w-[480px]">
            Personal cheat sheet & study reference for the AWS Solutions Architect Associate exam.
            Manglish notes, practice questions, architecture diagrams — free & open source.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_304px] gap-5 items-start">

          {/* Left: link cards */}
          <div className="space-y-3">
            {links.map((link) => {
              const inner = (
                <div className="flex items-start gap-4">
                  <span className="font-space-mono text-lg text-c1 shrink-0 mt-0.5">{link.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h2 className="font-semibold text-aws-text group-hover:text-c1 transition-colors">
                        {link.label}
                      </h2>
                      <span className="font-space-mono text-[0.6rem] text-aws-muted shrink-0">
                        {link.external ? '↗' : '→'}
                      </span>
                    </div>
                    <p className="text-sm text-aws-muted mb-2">{link.description}</p>
                    <p className="font-space-mono text-[0.62rem] text-c1/80 truncate">{link.host}</p>
                  </div>
                </div>
              )

              return link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {inner}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className={cardClass}>
                  {inner}
                </Link>
              )
            })}
          </div>

          {/* Right: exam overview card — sticky on desktop */}
          <div className="lg:sticky lg:top-[5.5rem]">
            <div className="rounded-xl border border-aws-border bg-aws-card/60 p-4">

              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-space-mono text-[0.58rem] uppercase tracking-widest text-c1 mb-0.5">
                    Exam Guide
                  </p>
                  <h2 className="text-sm font-bold text-aws-text leading-tight">AWS SAA-C03</h2>
                  <p className="text-[0.65rem] text-aws-muted">Solutions Architect Associate</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="font-space-mono text-sm font-bold text-c5 leading-none">
                    720<span className="text-aws-muted text-[0.55rem] font-normal">/1000</span>
                  </p>
                  <p className="font-space-mono text-[0.53rem] text-aws-muted mt-0.5">to pass</p>
                </div>
              </div>

              {/* Exam meta pills */}
              <div className="flex flex-wrap gap-1 mb-4 pb-4 border-b border-aws-border">
                {['65 questions', '50 scored + 15 unscored', '~130 min'].map((m) => (
                  <span
                    key={m}
                    className="font-space-mono text-[0.53rem] text-aws-muted border border-aws-border rounded px-1.5 py-0.5"
                  >
                    {m}
                  </span>
                ))}
              </div>

              {/* Domains */}
              <div className="space-y-3.5">

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="font-space-mono text-[0.62rem] font-bold text-c3">D1</span>
                    <span className="font-space-mono text-[0.53rem] text-aws-muted">30%</span>
                    <span className="w-px h-3 bg-aws-border shrink-0" />
                    <span className="text-[0.65rem] text-aws-text font-medium leading-tight">
                      Design Secure Architectures
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {['IAM & Identity', 'Network Security', 'Data Protection', 'Encryption', 'VPC'].map((p) => (
                      <span key={p} className="font-space-mono text-[0.53rem] bg-c3/10 text-c3 border border-c3/20 rounded-full px-1.5 py-0.5">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="font-space-mono text-[0.62rem] font-bold text-c4">D2</span>
                    <span className="font-space-mono text-[0.53rem] text-aws-muted">26%</span>
                    <span className="w-px h-3 bg-aws-border shrink-0" />
                    <span className="text-[0.65rem] text-aws-text font-medium leading-tight">
                      Design Resilient Architectures
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {['High Availability', 'Disaster Recovery', 'Auto Scaling', 'Loose Coupling', 'Multi-AZ'].map((p) => (
                      <span key={p} className="font-space-mono text-[0.53rem] bg-c4/10 text-c4 border border-c4/20 rounded-full px-1.5 py-0.5">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="font-space-mono text-[0.62rem] font-bold text-c2">D3</span>
                    <span className="font-space-mono text-[0.53rem] text-aws-muted">24%</span>
                    <span className="w-px h-3 bg-aws-border shrink-0" />
                    <span className="text-[0.65rem] text-aws-text font-medium leading-tight">
                      Design High-Performing Architectures
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {['Compute', 'Storage', 'Databases', 'Networking', 'Serverless', 'Analytics'].map((p) => (
                      <span key={p} className="font-space-mono text-[0.53rem] bg-c2/10 text-c2 border border-c2/20 rounded-full px-1.5 py-0.5">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="font-space-mono text-[0.62rem] font-bold text-c5">D4</span>
                    <span className="font-space-mono text-[0.53rem] text-aws-muted">20%</span>
                    <span className="w-px h-3 bg-aws-border shrink-0" />
                    <span className="text-[0.65rem] text-aws-text font-medium leading-tight">
                      Design Cost-Optimized Architectures
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {['Pricing Models', 'Storage Tiers', 'Compute Options', 'Database Cost', 'Cost Tools'].map((p) => (
                      <span key={p} className="font-space-mono text-[0.53rem] bg-c5/10 text-c5 border border-c5/20 rounded-full px-1.5 py-0.5">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            <Link href="/pwa" className="tfont-space-mono text-[0.65rem] text-aws-muted">PWA preview</Link>
          </div>

        </div>

        <SiteFooter tagline="AWS SAA-C03 · Open Source Study Reference" />
      </main>
    </>
  )
}
