import { ServiceCard, ColorCategory, categoryStyles } from '@/data/awsServices'
import GlossaryText from './GlossaryText'

interface LearnCardProps {
  service: ServiceCard
  category: ColorCategory
}

export default function LearnCard({ service, category }: LearnCardProps) {
  const styles = categoryStyles[category]

  return (
    <article className="relative bg-aws-card border border-aws-border rounded-xl mb-4 transition-all duration-200 hover:border-white/12">
      {/* left accent bar — rounded corners match card, no overflow-hidden needed */}
      <div className={`absolute top-0 left-0 w-[3px] h-full rounded-l-xl ${styles.accent}`} />

      <div className="px-5 py-4">
        {/* heading row */}
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <div>
            <h3 className={`font-space-mono text-base font-bold ${styles.title}`}>{service.shortName}</h3>
            <p className="font-space-mono text-[0.7rem] text-aws-muted">{service.fullName}</p>
          </div>
          <span className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[0.72rem] text-slate-300 italic min-w-0 break-words">
            {service.ingat}
          </span>
        </div>

        {/* explanation prose */}
        <div className="space-y-3">
          <div>
            <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-aws-muted mb-1">Apa Dia</p>
            <p className="text-[0.85rem] text-aws-text leading-relaxed">
              <GlossaryText text={service.fungsi} />
            </p>
          </div>

          {service.contohGuna && (
            <div>
              <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-aws-muted mb-1">Contoh Guna</p>
              <p className="text-[0.85rem] text-aws-text leading-relaxed">
                <GlossaryText text={service.contohGuna} />
              </p>
            </div>
          )}

          {service.storageDetails && (
            <div className="bg-white/3 rounded-lg px-3 py-2.5">
              <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-aws-muted mb-2">{service.detailsLabel ?? 'Storage Classes'}</p>
              <div className="space-y-1">
                {service.storageDetails.split('\n').map((line) => {
                  const [tier, ...rest] = line.split('→')
                  return (
                    <p key={line} className="text-[0.82rem] text-aws-text leading-snug">
                      <span className={`font-space-mono font-bold ${styles.title}`}>{tier.trim()}</span>
                      {rest.length > 0 && <span className="text-aws-muted"> → {rest.join('→').trim()}</span>}
                    </p>
                  )
                })}
              </div>
            </div>
          )}

          {service.scenario && (
            <div className={`rounded-lg px-3 py-2.5 border ${styles.scenario}`}>
              <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-c6/70 mb-1.5">
                💡 Exam Scenario
              </p>
              <p className="text-[0.85rem] text-aws-text leading-relaxed">
                <GlossaryText text={service.scenario} />
              </p>
            </div>
          )}

          {service.tips && service.tips.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2.5">
              <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-amber-400/70 mb-1.5">
                🧠 Cara Mudah Ingat
              </p>
              <ul className="space-y-1">
                {service.tips.map((tip) => (
                  <li key={tip} className="text-[0.82rem] text-aws-text leading-relaxed flex gap-2">
                    <span className="text-amber-400/60 shrink-0">→</span>
                    <GlossaryText text={tip} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* guna untuk */}
          <div className={`rounded-lg px-3 py-2 border border-dashed ${styles.scenario}`}>
            <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-aws-muted mb-1">Guna Bila</p>
            <p className={`text-[0.82rem] font-semibold ${styles.title}`}>{service.gunaUntuk}</p>
          </div>
        </div>

        {/* keywords */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {service.keywords.map((kw) => (
            <span key={kw} className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-space-mono border ${styles.keyword}`}>
              {kw}
            </span>
          ))}
        </div>

        {service.docs && service.docs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-aws-border/40">
            {service.docs.map((doc) => (
              <a
                key={doc.url}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-space-mono text-[0.6rem] border border-white/10 rounded-full px-2.5 py-0.5 text-aws-muted hover:text-aws-text hover:border-white/20 transition-colors"
              >
                📎 {doc.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
