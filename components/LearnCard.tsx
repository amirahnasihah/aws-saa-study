import { ServiceCard, CompareTable, FlowDiagram, MermaidSpec, CardImage, TrapQuestion, DiagramTone, ColorCategory, categoryStyles, domainPill, serviceSlug } from '@/data/awsServices'
import GlossaryText from './GlossaryText'
import MermaidDiagram from './ai/MermaidDiagram'

interface LearnCardProps {
  service: ServiceCard
  category: ColorCategory
  sectionId: string
  domainId: string
}

// Box border/text per tone — literal classes so Tailwind keeps them at build time.
const diagramToneClass: Record<DiagramTone, string> = {
  c1: 'border-c1/45 text-c1',
  c2: 'border-c2/45 text-c2',
  c3: 'border-c3/45 text-c3',
  c4: 'border-c4/45 text-c4',
  c5: 'border-c5/45 text-c5',
  c6: 'border-c6/45 text-c6',
}

function FlowAnatomy({ diagram }: { diagram: FlowDiagram }) {
  return (
    <div className="rounded-lg border border-aws-border/60 bg-white/[0.015] px-3 py-3">
      {diagram.label && (
        <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-aws-muted mb-2.5">
          {diagram.label}
        </p>
      )}
      <div className="flex items-stretch gap-1.5 overflow-x-auto nav-scroll pb-1">
        {diagram.steps.map((step, s) => (
          <div key={s} className="flex items-stretch gap-1.5 shrink-0">
            {s > 0 && (
              <span aria-hidden className="self-center text-aws-muted/70 text-sm shrink-0">→</span>
            )}
            <div className="flex flex-col justify-center gap-1.5">
              {step.nodes.map((node, n) => (
                <div
                  key={n}
                  className={`rounded-md border bg-aws-bg/60 px-2.5 py-1.5 text-center min-w-[84px] ${node.tone ? diagramToneClass[node.tone] : 'border-aws-border text-aws-text'}`}
                >
                  <p className="font-space-mono text-[0.66rem] font-bold leading-tight whitespace-nowrap">{node.label}</p>
                  {node.sub && <p className="text-[0.55rem] text-aws-muted leading-tight mt-0.5 whitespace-nowrap">{node.sub}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {diagram.caption && (
        <p className="text-[0.7rem] text-aws-muted leading-relaxed mt-2">
          <GlossaryText text={diagram.caption} />
        </p>
      )}
    </div>
  )
}

// Per-column tint for the compared columns (skips the attribute column).
// Cycles c2/c5/c4/c6 so 2-, 3- and 4-way comparisons stay visually distinct —
// same palette family the bespoke VPC-page tables use (c6 covers the 4th column
// so 4-way tables like the DR spectrum & EC2 purchasing options don't collide).
const compareHeadTint = ['text-c2 bg-c2/5', 'text-c5 bg-c5/5', 'text-c4 bg-c4/5', 'text-c6 bg-c6/5']
const compareCellTint = ['bg-c2/[0.03]', 'bg-c5/[0.03]', 'bg-c4/[0.03]', 'bg-c6/[0.03]']

function ComparisonTable({ compare }: { compare: CompareTable }) {
  const [attrHeader, ...valueHeaders] = compare.headers
  return (
    <div className="rounded-lg border border-aws-border/60 overflow-hidden">
      {compare.label && (
        <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-aws-muted px-3 pt-2.5 pb-1.5">
          {compare.label}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-[0.78rem] border-collapse">
          <thead>
            <tr className="border-b border-aws-border">
              <th className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted text-left p-2.5 align-bottom">
                {attrHeader}
              </th>
              {valueHeaders.map((h, i) => (
                <th
                  key={h}
                  className={`font-space-mono text-[0.55rem] uppercase tracking-widest text-left p-2.5 align-bottom ${compareHeadTint[i % compareHeadTint.length]}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compare.rows.map(([attr, ...values], r) => (
              <tr key={attr} className={`border-b border-aws-border/40 ${r % 2 !== 0 ? 'bg-white/[0.015]' : ''}`}>
                <td className="font-space-mono font-bold text-[0.62rem] text-aws-muted p-2.5 align-top whitespace-nowrap">
                  {attr}
                </td>
                {values.map((value, i) => (
                  <td key={i} className={`text-aws-text p-2.5 align-top leading-snug ${compareCellTint[i % compareCellTint.length]}`}>
                    <GlossaryText text={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {compare.takeaway && (
        <p className="text-[0.78rem] text-aws-text leading-relaxed px-3 py-2.5 bg-amber-500/5 border-t border-amber-500/15">
          <span className="text-amber-300 font-bold">Ingat: </span>
          <GlossaryText text={compare.takeaway} />
        </p>
      )}
    </div>
  )
}

// Mermaid flowchart/decision-tree — rendered client-side. Same chrome as
// FlowAnatomy (eyebrow label + caption) so the two read as one visual family.
function MermaidBlock({ spec }: { spec: MermaidSpec }) {
  return (
    <div className="rounded-lg border border-aws-border/60 bg-white/[0.015] px-3 py-3">
      {spec.label && (
        <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-aws-muted mb-2.5">
          {spec.label}
        </p>
      )}
      <MermaidDiagram source={spec.source} />
      {spec.caption && (
        <p className="text-[0.7rem] text-aws-muted leading-relaxed mt-2">
          <GlossaryText text={spec.caption} />
        </p>
      )}
    </div>
  )
}

// Static image (official AWS architecture diagram, etc.). Plain <img> so it
// works in a server component without next/image config for remote hosts.
function CardImageView({ image }: { image: CardImage }) {
  return (
    <figure className="rounded-lg border border-aws-border/60 bg-white/[0.015] px-3 py-3">
      {image.label && (
        <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-aws-muted mb-2.5">
          {image.label}
        </p>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} className="max-w-full h-auto rounded-md mx-auto" loading="lazy" />
      {image.caption && (
        <figcaption className="text-[0.7rem] text-aws-muted leading-relaxed mt-2">
          <GlossaryText text={image.caption} />
        </figcaption>
      )}
    </figure>
  )
}

// Trap-question block — baited stem, the tempting wrong answer (why it's bait),
// and the correct pick with the discriminating keyword. Trains pattern-matching
// against the exam's deliberate misdirection.
function PerangkapBlock({ traps }: { traps: TrapQuestion[] }) {
  return (
    <div className="rounded-lg px-3 py-2.5 border border-rose-400/20 bg-rose-400/[0.04]">
      <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-rose-300/80 mb-2">
        🪤 Perangkap Soalan
      </p>
      <div className="space-y-3">
        {traps.map((t) => (
          <div key={t.soalan} className="space-y-1">
            <p className="text-[0.82rem] text-aws-text leading-snug">
              <span className="text-rose-300/80 font-bold">Q: </span>
              <GlossaryText text={t.soalan} />
            </p>
            <p className="text-[0.8rem] text-aws-muted leading-snug">
              <span className="text-rose-400/70 font-bold">⚠ Umpan: </span>
              <GlossaryText text={t.umpan} />
            </p>
            <p className="text-[0.8rem] text-aws-text leading-snug">
              <span className="text-emerald-400/80 font-bold">✓ Betul: </span>
              <GlossaryText text={t.betul} />
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LearnCard({ service, category, sectionId, domainId }: LearnCardProps) {
  const styles = categoryStyles[category]
  const pill = domainPill[domainId]

  return (
    <article id={serviceSlug(sectionId, service.shortName)} className="relative bg-aws-card border border-aws-border rounded-xl mb-4 scroll-mt-20 transition-all duration-200 hover:border-white/12 target:ring-2 target:ring-c1/50">
      {/* left accent bar — rounded corners match card, no overflow-hidden needed */}
      <div className={`absolute top-0 left-0 w-[3px] h-full rounded-l-xl ${styles.accent}`} />

      <div className="px-5 py-4">
        {/* heading row */}
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <div>
            {pill && (
              <span className={`inline-block font-space-mono text-[0.55rem] uppercase tracking-[0.1em] border rounded-full px-2 py-0.5 mb-1.5 ${pill.cls}`}>
                {pill.label}
              </span>
            )}
            <h3 className={`font-space-mono text-base font-bold ${styles.title}`}>{service.shortName}</h3>
            <p className="font-space-mono text-[0.7rem] text-aws-muted">{service.fullName}</p>
          </div>
          <span className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[0.72rem] text-slate-300 italic min-w-0 break-words">
            {service.ingat}
          </span>
        </div>

        {/* explanation prose */}
        <div className="space-y-3">
          {service.sebabApa && (
            <div className="rounded-lg px-3 py-2.5 border border-sky-400/15 bg-sky-400/[0.04]">
              <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-sky-300/70 mb-1.5">🎯 Sebab Apa Wujud</p>
              <p className="text-[0.85rem] text-aws-text leading-relaxed">
                <GlossaryText text={service.sebabApa} />
              </p>
            </div>
          )}

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

          {service.diagram &&
            (Array.isArray(service.diagram) ? service.diagram : [service.diagram]).map((d, i) => (
              <FlowAnatomy key={d.label ?? i} diagram={d} />
            ))}

          {service.mermaid &&
            (Array.isArray(service.mermaid) ? service.mermaid : [service.mermaid]).map((m, i) => (
              <MermaidBlock key={m.label ?? i} spec={m} />
            ))}

          {service.image &&
            (Array.isArray(service.image) ? service.image : [service.image]).map((img, i) => (
              <CardImageView key={img.label ?? img.src ?? i} image={img} />
            ))}

          {service.compare &&
            (Array.isArray(service.compare) ? service.compare : [service.compare]).map((c, i) => (
              <ComparisonTable key={c.label ?? i} compare={c} />
            ))}

          {service.sifir && service.sifir.length > 0 && (
            <div className="rounded-lg px-3 py-2.5 border border-c2/20 bg-c2/5">
              <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-c2/80 mb-1.5">
                ⚡ Quick Sifir — hafal ni
              </p>
              <ul className="space-y-1">
                {service.sifir.map((s) => (
                  <li key={s} className="text-[0.82rem] text-aws-text leading-snug flex gap-2">
                    <span className="text-c2/60 shrink-0">▪</span>
                    <GlossaryText text={s} />
                  </li>
                ))}
              </ul>
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

          {service.perangkap && service.perangkap.length > 0 && (
            <PerangkapBlock traps={service.perangkap} />
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
            <p className={`text-[0.82rem] font-semibold ${styles.title}`}>
              <GlossaryText text={service.gunaUntuk} />
            </p>
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
