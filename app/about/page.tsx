import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import { GITHUB_URL, PORTFOLIO_URL, SITE_URL } from '@/data/siteLinks'

export const metadata: Metadata = {
  title: 'About — AWS SAA-C03 Study',
  description: 'Open-source AWS SAA-C03 study reference — source code on GitHub, built by amirahnasihah.my',
}

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
    description: 'Source code, issues & contributions — open source, star if helpful ⭐',
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
] as const

export default function AboutPage() {
  return (
    <>
      <Nav />

      <main className="max-w-[640px] mx-auto px-4 pt-[calc(3.5rem+2rem)] pb-16">
        <div className="mb-8">
          <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c1 mb-2">About</p>
          <h1 className="text-2xl font-bold text-aws-text mb-3">AWS SAA-C03 Study</h1>
          <p className="text-sm text-aws-muted leading-relaxed">
            Personal cheat sheet & study reference for the AWS Solutions Architect Associate (SAA-C03) exam.
            Manglish notes, practice questions, and architecture diagrams — free & open source.
          </p>
        </div>

        <div className="space-y-3">
          {links.map((link) => {
            const card = (
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

            const className =
              'group block rounded-xl border border-aws-border bg-aws-card/60 p-5 transition-all hover:border-c1/40 hover:bg-aws-card'

            return link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {card}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className={className}>
                {card}
              </Link>
            )
          })}
        </div>

        <SiteFooter tagline="AWS SAA-C03 · Open Source Study Reference" />
      </main>
    </>
  )
}
