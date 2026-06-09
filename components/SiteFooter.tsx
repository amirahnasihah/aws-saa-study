import type { ReactNode } from 'react'
import Link from 'next/link'
import { PORTFOLIO_URL } from '@/data/siteLinks'

type SiteFooterProps = {
  tagline: string
  extra?: ReactNode
}

export default function SiteFooter({ tagline, extra }: SiteFooterProps) {
  return (
    <footer className="text-center font-space-mono text-[0.65rem] text-aws-muted mt-6 pt-6 border-t border-aws-border space-y-2">
      <p>{tagline}</p>
      {extra}
      <p>
        <Link href="/labs" className="text-c1 hover:text-aws-text transition-colors underline underline-offset-2">
          Labs
        </Link>
        {' '}· hands-on practice notes
      </p>
      <p>
        Built by{' '}
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-c1 hover:text-aws-text transition-colors underline underline-offset-2"
        >
          amirahnasihah.my
        </a>
      </p>
    </footer>
  )
}
