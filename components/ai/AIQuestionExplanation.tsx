import AISourceLinks from '@/components/ai/AISourceLinks'

interface AIQuestionExplanationProps {
  conceptName: string
  focusArea: string
  studyKeywords: string[]
  explanation: string
  awsDocsUrl: string
  awsDocsTitle: string
  youtubeQuery: string
}

export default function AIQuestionExplanation({
  conceptName,
  focusArea,
  studyKeywords,
  explanation,
  awsDocsUrl,
  awsDocsTitle,
  youtubeQuery,
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
        <AISourceLinks
          awsDocsUrl={awsDocsUrl}
          awsDocsTitle={awsDocsTitle}
          youtubeQuery={youtubeQuery}
        />
      </div>
    </div>
  )
}
