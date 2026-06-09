import Link from 'next/link'
import AWSDocsLink from '@/components/ai/AWSDocsLink'
import type { InternalLink } from '@/lib/ai/internal-links'

interface AIQuestionExplanationProps {
  conceptName: string
  focusArea: string
  studyKeywords: string[]
  explanation: string
  awsDocsUrl: string
  awsDocsTitle: string
  internalLinks?: InternalLink[]
}

export default function AIQuestionExplanation({
  conceptName,
  focusArea,
  studyKeywords,
  explanation,
  awsDocsUrl,
  awsDocsTitle,
  internalLinks,
}: AIQuestionExplanationProps) {
  return (
    <div className="space-y-5">
      {(conceptName || focusArea) && (
        <div className="p-4 rounded-xl bg-c1/5 border border-c1/15">
          <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-c1/60 mb-1.5">
            What&apos;s being tested
          </p>
          {conceptName && (
            <p className="font-space-mono text-[0.75rem] font-bold text-c1 leading-snug mb-2">
              {conceptName}
            </p>
          )}
          {focusArea && (
            <p className="font-space-mono text-[0.62rem] text-aws-muted">{focusArea}</p>
          )}
        </div>
      )}

      {studyKeywords.length > 0 && (
        <div>
          <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted/60 mb-2">
            Study keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {studyKeywords.map((kw) => (
              <span
                key={kw}
                className="font-space-mono text-[0.58rem] px-2.5 py-1 rounded-full bg-aws-card border border-aws-border text-aws-muted"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-aws-border to-transparent" />

      <div>
        <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted/60 mb-3">
          Why this answer
        </p>
        <p className="text-[0.9rem] text-aws-text leading-[1.75] tracking-[0.01em]">
          {explanation}
        </p>
      </div>

      <div>
        <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted/60 mb-3">
          Learn more
        </p>
        <div className="space-y-2">
          <AWSDocsLink awsDocsUrl={awsDocsUrl} awsDocsTitle={awsDocsTitle} />
          {internalLinks?.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className="group flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-c1/5 border border-c1/15 hover:bg-c1/10 hover:border-c1/30 transition-all duration-150"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-c1/10 border border-c1/20 text-base shrink-0">
                {link.icon}
              </span>
              <div className="min-w-0">
                <p className="font-space-mono text-[0.65rem] font-bold text-c1 leading-none mb-1">
                  {link.label}
                </p>
                <p className="font-space-mono text-[0.58rem] text-aws-muted truncate">
                  {link.sublabel}
                </p>
              </div>
              <span className="ml-auto text-c1/40 group-hover:text-c1 group-hover:translate-x-0.5 transition-all duration-150 text-xs shrink-0">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
