import Link from 'next/link'
import type { LabListItem } from '@/lib/labs-course'
import { formatLabDuration } from '@/lib/labs-course'

const levelStyles: Record<string, string> = {
  Fundamental: 'text-c2',
  Intermediate: 'text-c4',
  Advanced: 'text-c6',
}

type LabListRowProps = {
  item: LabListItem
}

export default function LabListRow({ item }: LabListRowProps) {
  const duration = formatLabDuration(item.duration, item.lab.duration)
  const levelClass = levelStyles[item.lab.level] ?? 'text-aws-muted'

  return (
    <li className="group border-b border-aws-border/80 last:border-b-0">
      <Link
        href={`/labs/${item.slug}`}
        className="flex items-center gap-3 sm:gap-4 py-3.5 sm:py-4 px-4 sm:px-5 md:px-6
          hover:bg-aws-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c1/40 transition-colors"
      >
        <span className="flex shrink-0 w-7 h-7 items-center justify-center rounded-md bg-aws-card border border-aws-border font-space-mono text-[0.62rem] text-aws-muted">
          {item.index}
        </span>

        <span className="flex-1 min-w-0 text-[0.9rem] sm:text-[0.95rem] font-medium text-aws-text group-hover:text-c1 transition-colors leading-snug">
          {item.title}
        </span>

        <span className="hidden md:inline font-space-mono text-[0.68rem] text-aws-muted shrink-0 tabular-nums">
          {duration}
        </span>

        <span className={`font-space-mono text-[0.58rem] sm:text-[0.62rem] uppercase tracking-wider shrink-0 ml-1 ${levelClass}`}>
          {item.lab.level}
        </span>

        <span
          className="shrink-0 w-8 h-8 ml-1 sm:ml-2 rounded-full bg-c3/15 border border-c3/30 flex items-center justify-center
            text-c3 group-hover:bg-c3 group-hover:text-aws-bg transition-colors"
          aria-hidden
        >
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" className="ml-0.5">
            <path d="M0 0v12l10-6L0 0z" />
          </svg>
        </span>
      </Link>
    </li>
  )
}
