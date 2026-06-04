import AWSDocsLink from '@/components/ai/AWSDocsLink'
import DeepNotesLink from '@/components/ai/DeepNotesLink'
import type { HintResponse } from '@/lib/ai/types'

interface QuestionHintPanelProps {
  hint: HintResponse
  fromCache?: boolean
}

function BulletBlock({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <ul className="space-y-1.5 list-none pl-0">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-[0.82rem] text-aws-text leading-snug">
          <span className="text-c1/70 shrink-0 mt-0.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function QuestionHintPanel({ hint, fromCache = false }: QuestionHintPanelProps) {
  return (
    <div className="space-y-3 p-3.5 rounded-xl bg-c1/5 border border-c1/15">
      {fromCache && (
        <p className="font-space-mono text-[0.52rem] uppercase tracking-widest text-aws-muted/50">
          Cached hint · no new AI call
        </p>
      )}

      <div>
        <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-c1/60 mb-1.5">
          Really asking
        </p>
        <BulletBlock items={hint.whatItsAsking} />
      </div>

      <div className="p-2.5 rounded-lg bg-aws-card/60 border border-aws-border/50">
        <p className="font-space-mono text-[0.72rem] font-bold text-c1 leading-snug">{hint.conceptName}</p>
        {hint.focusArea && (
          <p className="font-space-mono text-[0.58rem] text-aws-muted mt-0.5">{hint.focusArea}</p>
        )}
      </div>

      {hint.studyKeywords.length > 0 && (
        <div>
          <p className="font-space-mono text-[0.52rem] uppercase tracking-widest text-aws-muted/60 mb-1.5">
            Highlighted in question ↑
          </p>
          <div className="flex flex-wrap gap-1">
            {hint.studyKeywords.map((kw) => (
              <span
                key={kw}
                className="font-space-mono text-[0.55rem] px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-200/90"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {hint.howToTackle.length > 0 && (
        <div>
          <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted/60 mb-1.5">
            Tackle
          </p>
          <BulletBlock items={hint.howToTackle} />
        </div>
      )}

      <div className="space-y-2">
        <DeepNotesLink
          deepNotesUrl={hint.deepNotesUrl ?? '/learn'}
          deepNotesTitle={hint.deepNotesTitle ?? 'Deep Notes'}
          deepNotesSection={hint.deepNotesSection ?? 'All domains'}
          sectionIcon={hint.deepNotesIcon ?? '📖'}
        />
        <AWSDocsLink awsDocsUrl={hint.awsDocsUrl} awsDocsTitle={hint.awsDocsTitle} />
      </div>
    </div>
  )
}
