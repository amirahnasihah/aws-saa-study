'use client'

import { ServiceCardSummary, ColorCategory, categoryStyles, domainPill, serviceSlug } from '@/data/awsMeta'
import Link from 'next/link'
import { useBookmarksCtx } from './BookmarksContext'

interface ServiceCardProps {
  service: ServiceCardSummary
  category: ColorCategory
  sectionId: string
  domainId: string
}

export default function ServiceCard({ service, category, sectionId, domainId }: ServiceCardProps) {
  const styles = categoryStyles[category]
  const pill = domainPill[domainId]
  const { isBookmarked, toggle } = useBookmarksCtx()
  const bookmarked = isBookmarked(service.shortName)

  return (
    <div id={serviceSlug(sectionId, service.shortName)} className="relative overflow-hidden bg-aws-card border border-aws-border rounded-xl px-5 py-4 mb-2.5 scroll-mt-20 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15 group target:ring-2 target:ring-c1/50">
      {/* left accent bar */}
      <div className={`absolute top-0 left-0 w-[3px] h-full ${styles.accent}`} />

      {/* top row: name + mnemonic + bookmark */}
      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
        <div>
          {pill && (
            <span className={`inline-block font-space-mono text-[0.55rem] uppercase tracking-[0.1em] border rounded-full px-2 py-0.5 mb-1 ${pill.cls}`}>
              {pill.label}
            </span>
          )}
          <div>
            <span className={`font-space-mono text-[1rem] font-bold ${styles.title}`}>{service.shortName}</span>
            <span className="font-space-mono text-[0.68rem] text-aws-muted ml-2">{service.fullName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[0.72rem] text-aws-muted italic">{service.ingat}</span>
          <button
            type="button"
            onClick={() => toggle(service.shortName)}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this service'}
            className={`transition-all duration-150 hover:scale-110 ${bookmarked ? 'text-amber-400' : 'text-aws-border hover:text-aws-muted'}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* one-liner purpose */}
      <p className="text-[0.82rem] text-aws-text/80 mb-3 leading-snug">{service.gunaUntuk}</p>

      {/* storage tiers summary — show first 3 lines only */}
      {service.storageDetails && (
        <div className="mb-3 space-y-0.5">
          {service.storageDetails.split('\n').slice(0, 3).map((line) => {
            const [tier, ...rest] = line.split('→')
            return (
              <p key={line} className="text-[0.75rem] leading-snug">
                <span className={`font-space-mono font-bold ${styles.title}`}>{tier.trim()}</span>
                {rest.length > 0 && <span className="text-aws-muted"> → {rest.join('→').trim()}</span>}
              </p>
            )
          })}
          {service.storageDetails.split('\n').length > 3 && (
            <Link href="/learn" className="font-space-mono text-[0.62rem] text-aws-muted hover:text-aws-text transition-colors">
              +{service.storageDetails.split('\n').length - 3} more → Deep Notes
            </Link>
          )}
        </div>
      )}

      {/* keywords */}
      <div className="flex flex-wrap gap-1.5">
        {service.keywords.map((kw) => (
          <span key={kw} className={`rounded-full px-2.5 py-0.5 text-[0.63rem] font-space-mono border ${styles.keyword}`}>
            {kw}
          </span>
        ))}
      </div>
    </div>
  )
}
