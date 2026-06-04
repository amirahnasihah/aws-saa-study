import AWSDocsLink from '@/components/ai/AWSDocsLink'
import type { HintResponse } from '@/lib/ai/types'

interface QuestionHintPanelProps {
  hint: HintResponse
}

export default function QuestionHintPanel({ hint }: QuestionHintPanelProps) {
  return (
    <div className="space-y-4 p-4 rounded-xl bg-c1/5 border border-c1/15">
      <div>
        <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-c1/60 mb-1.5">
          What this question is really asking
        </p>
        <p className="text-[0.88rem] text-aws-text leading-relaxed">{hint.whatItsAsking}</p>
      </div>

      <div className="p-3 rounded-lg bg-aws-card/60 border border-aws-border/50">
        <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-c1/60 mb-1">
          Concept
        </p>
        <p className="font-space-mono text-[0.72rem] font-bold text-c1 leading-snug mb-1">
          {hint.conceptName}
        </p>
        {hint.focusArea && (
          <p className="font-space-mono text-[0.62rem] text-aws-muted">{hint.focusArea}</p>
        )}
      </div>

      {hint.studyKeywords.length > 0 && (
        <div>
          <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted/60 mb-2">
            Keywords to spot
          </p>
          <div className="flex flex-wrap gap-1.5">
            {hint.studyKeywords.map((kw) => (
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

      <div>
        <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted/60 mb-2">
          How to tackle it
        </p>
        <p className="text-[0.85rem] text-aws-text leading-relaxed">{hint.howToTackle}</p>
      </div>

      <AWSDocsLink awsDocsUrl={hint.awsDocsUrl} awsDocsTitle={hint.awsDocsTitle} />

      <a
        href={hint.notesUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-space-mono text-[0.6rem] text-c1/80 hover:text-c1 transition-colors"
      >
        📖 Study notes on aws.amrhnshh.com →
      </a>
    </div>
  )
}
