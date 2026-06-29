import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import { registerSteps, delivery, deliveryAccent, duringTesting, studyChecklist, checklistStatus } from '@/data/exam'
import { domains as deepNoteDomains, serviceSlug } from '@/data/awsServices'

export const metadata: Metadata = {
  title: 'Exam Guide — AWS SAA-C03 Study',
  description:
    'Full AWS SAA-C03 exam guide — passing score, format, and the four domains (Secure, Resilient, High-Performing, Cost-Optimized) with weight breakdowns and topic coverage.',
}

// Accent tokens map 1:1 to the about-page exam card: D1→c3, D2→c4, D3→c2, D4→c5.
// Literal Tailwind class strings only (no dynamic `text-${x}`) so JIT keeps them.
type Domain = {
  id: 'D1' | 'D2' | 'D3' | 'D4'
  weight: number
  title: string
  accent: 'c3' | 'c4' | 'c2' | 'c5'
  blurb: string
  topics: string[]
  competencies: string[]
}

const domains: Domain[] = [
  {
    id: 'D1', weight: 30, title: 'Design Secure Architectures', accent: 'c3',
    blurb: 'Identity, network, and data security — the largest domain. Prove you can lock down who can do what, where traffic can go, and how data stays protected in transit and at rest.',
    topics: ['IAM & Identity', 'Network Security', 'Data Protection', 'Encryption', 'VPC'],
    competencies: [
      'Apply least-privilege IAM policies, roles, and permission boundaries',
      'Design secure VPC topologies — subnets, NACLs, security groups, flow logs',
      'Encrypt data at rest (KMS, EBS/S3/RDS encryption) and in transit (TLS, mTLS)',
      'Secure secrets with Secrets Manager vs Parameter Store vs KMS',
    ],
  },
  {
    id: 'D2', weight: 26, title: 'Design Resilient Architectures', accent: 'c4',
    blurb: 'High availability, disaster recovery, and decoupling. Show you can keep a workload running through failure — AZ loss, component failure, traffic spikes — and recover within RTO/RPO.',
    topics: ['High Availability', 'Disaster Recovery', 'Auto Scaling', 'Loose Coupling', 'Multi-AZ'],
    competencies: [
      'Multi-AZ and multi-region patterns for compute, storage, and databases',
      'DR strategies (backup → pilot light → warm standby → multi-site) vs RTO/RPO',
      'Auto Scaling groups, target tracking, and cooldown behavior',
      'Decouple with SQS, SNS, EventBridge, and Step Functions to absorb load',
    ],
  },
  {
    id: 'D3', weight: 24, title: 'Design High-Performing Architectures', accent: 'c2',
    blurb: 'Pick the right compute, storage, database, and networking service for the workload. The exam rewards knowing the performance shape of each service — IOPS, throughput, latency, scale limits.',
    topics: ['Compute', 'Storage', 'Databases', 'Networking', 'Serverless', 'Analytics'],
    competencies: [
      'Match compute to workload (EC2 vs Lambda vs Fargate vs Batch) by scaling and cost',
      'Select storage by access pattern (S3 tiers, EBS types, EFS, FSx, Instance Store)',
      'Choose databases (RDS/Aurora/DynamoDB/ElastiCache/Redshift) by consistency and scale',
      'Edge and networking perf — CloudFront, Global Accelerator, Direct Connect, VPC endpoints',
    ],
  },
  {
    id: 'D4', weight: 20, title: 'Design Cost-Optimized Architectures', accent: 'c5',
    blurb: 'Right-size, reserve, and monitor. The smallest domain but the most directly testable — pricing models, storage tiers, and cost tools all have crisp right-answer shapes.',
    topics: ['Pricing Models', 'Storage Tiers', 'Compute Options', 'Database Cost', 'Cost Tools'],
    competencies: [
      'Compare On-Demand, Reserved, Savings Plans, Spot, and capacity reservations',
      'Use S3 and EBS lifecycle/tiers to drop storage spend without breaking access patterns',
      'Right-size compute and choose managed services to cut operational + infra cost',
      'Track and forecast with Cost Explorer, Budgets, Compute Optimizer, and TCW',
    ],
  },
]

const quickFacts = [
  { label: 'Passing score', value: '720 / 1000' },
  { label: 'Questions', value: '65 (50 scored + 15 unscored)' },
  { label: 'Time', value: '~130 minutes' },
  { label: 'Cost', value: '$150 USD (50% off if certified)' },
  { label: 'Delivery', value: 'Pearson VUE center or OnVUE online' },
  { label: 'Languages', value: 'EN, JA, KO, ZH-CN, ES, PT-BR, FR, IT' },
] as const

// Deep-note domain `variant` (d1–d4) → the same accent token the exam card uses,
// so the service index colours line up with the domain-weighting bars above.
const variantAccent: Record<'d1' | 'd2' | 'd3' | 'd4', Domain['accent']> = { d1: 'c3', d2: 'c4', d3: 'c2', d4: 'c5' }

const accentText: Record<Domain['accent'], string> = { c3: 'text-c3', c4: 'text-c4', c2: 'text-c2', c5: 'text-c5' }
const accentBar: Record<Domain['accent'], string> = { c3: 'bg-c3', c4: 'bg-c4', c2: 'bg-c2', c5: 'bg-c5' }
const accentPill: Record<Domain['accent'], string> = {
  c3: 'bg-c3/10 text-c3 border-c3/20',
  c4: 'bg-c4/10 text-c4 border-c4/20',
  c2: 'bg-c2/10 text-c2 border-c2/20',
  c5: 'bg-c5/10 text-c5 border-c5/20',
}

export default function ExamGuidePage() {
  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-4 pt-[calc(3.5rem+2rem)] pb-16">
        {/* Hero */}
        <div className="mb-8">
          <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c1 mb-2">Exam Guide</p>
          <h1 className="text-2xl font-bold text-aws-text mb-2">AWS SAA-C03</h1>
          <p className="text-sm text-aws-muted leading-relaxed max-w-[520px]">
            Solutions Architect Associate — the full breakdown: format, passing score, the four
            domains you&apos;ll be tested on, plus how to register and the exam-day rules.
          </p>
        </div>

        {/* Quick facts */}
        <div className="rounded-xl border border-aws-border bg-aws-card/60 p-5 mb-8">
          <p className="font-space-mono text-[0.58rem] uppercase tracking-widest text-c1 mb-3">At a glance</p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {quickFacts.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-3 border-b border-aws-border/60 pb-2 sm:border-b-0 sm:pb-0">
                <dt className="font-space-mono text-[0.6rem] text-aws-muted shrink-0">{f.label}</dt>
                <dd className="text-[0.75rem] text-aws-text font-medium text-right">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Domain weight bars */}
        <div className="mb-10">
          <p className="font-space-mono text-[0.58rem] uppercase tracking-widest text-c1 mb-3">Domain weighting</p>
          <div className="space-y-2.5">
            {domains.map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <span className={`font-space-mono text-[0.62rem] font-bold ${accentText[d.accent]} w-6 shrink-0`}>{d.id}</span>
                <div className="flex-1 h-2 rounded-full bg-aws-border/40 overflow-hidden">
                  <div className={`h-full rounded-full ${accentBar[d.accent]}`} style={{ width: `${(d.weight / 30) * 100}%` }} />
                </div>
                <span className="font-space-mono text-[0.58rem] text-aws-muted w-9 text-right shrink-0">{d.weight}%</span>
              </div>
            ))}
          </div>
          <p className="font-space-mono text-[0.53rem] text-aws-muted mt-2">Bars scaled to D1 (30%) as the longest — relative weight, not question count.</p>
        </div>

        {/* Domains — detailed */}
        <div className="space-y-5">
          {domains.map((d) => (
            <div key={d.id} className="rounded-xl border border-aws-border bg-aws-card/60 p-5">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-aws-border">
                <span className={`font-space-mono text-[0.7rem] font-bold ${accentText[d.accent]}`}>{d.id}</span>
                <span className={`font-space-mono text-[0.58rem] ${accentText[d.accent]}`}>{d.weight}%</span>
                <span className="w-px h-3 bg-aws-border shrink-0" />
                <h2 className="text-sm font-bold text-aws-text leading-tight">{d.title}</h2>
              </div>
              <p className="text-[0.8rem] text-aws-muted leading-relaxed mb-3">{d.blurb}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {d.topics.map((p) => (
                  <span key={p} className={`font-space-mono text-[0.53rem] border rounded-full px-1.5 py-0.5 ${accentPill[d.accent]}`}>{p}</span>
                ))}
              </div>
              <ul className="space-y-1.5">
                {d.competencies.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <span className={`font-space-mono text-[0.6rem] ${accentText[d.accent]} shrink-0 mt-1`}>▸</span>
                    <span className="text-[0.78rem] text-aws-muted leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Scoring note */}
        <div className="mt-8 rounded-xl border border-aws-border bg-aws-card/60 p-5">
          <p className="font-space-mono text-[0.58rem] uppercase tracking-widest text-c1 mb-2">Scoring</p>
          <ul className="space-y-2 text-[0.8rem] text-aws-muted leading-relaxed">
            <li className="flex items-start gap-2"><span className="font-space-mono text-[0.6rem] text-c1 shrink-0 mt-1">▸</span>15 of the 65 questions are unscored (pilot items) — you won&apos;t know which, so answer every one.</li>
            <li className="flex items-start gap-2"><span className="font-space-mono text-[0.6rem] text-c1 shrink-0 mt-1">▸</span>No penalty for wrong answers — blanks are scored as wrong, so never leave a question empty.</li>
            <li className="flex items-start gap-2"><span className="font-space-mono text-[0.6rem] text-c1 shrink-0 mt-1">▸</span>Results are scaled to 100–1000; 720 is the pass line across all forms.</li>
          </ul>
        </div>

        {/* Exam day & registration */}
        <section className="mt-12 space-y-8">

          {/* Register */}
          <div>
            <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c1 mb-2">
              Getting started
            </p>
            <h2 className="text-xl font-bold text-aws-text mb-1">Register & schedule</h2>
            <p className="text-sm text-aws-muted leading-relaxed max-w-[520px] mb-5">
              Five steps from sign-in to a booked seat. The whole flow runs through AWS
              Certification → Pearson VUE.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {registerSteps.map((step) => (
                <div
                  key={step.n}
                  className="rounded-xl border border-aws-border bg-aws-card/60 p-4 flex items-start gap-3"
                >
                  <span className="font-space-mono text-[0.62rem] font-bold text-c1 shrink-0 mt-0.5">
                    {step.n}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-aws-text mb-1">{step.title}</h3>
                    <p className="text-[0.8rem] text-aws-muted leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery: on-site vs online */}
          <div>
            <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c1 mb-2">
              Delivery
            </p>
            <h2 className="text-xl font-bold text-aws-text mb-1">On-site or online?</h2>
            <p className="text-sm text-aws-muted leading-relaxed max-w-[520px] mb-5">
              Two ways to sit the exam — pick what fits your setup. The rules differ on ID,
              breaks, and what you can do mid-exam.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {delivery.map((opt) => {
                const accent = deliveryAccent[opt.mode]
                return (
                  <div
                    key={opt.mode}
                    className="rounded-xl border border-aws-border bg-aws-card/60 p-5"
                  >
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-aws-border">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${accent.dot}`} />
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-aws-text leading-tight">{opt.label}</h3>
                        <p className={`font-space-mono text-[0.55rem] ${accent.text}`}>{opt.sub}</p>
                      </div>
                      <span
                        className={`ml-auto font-space-mono text-[0.53rem] border rounded-full px-2 py-0.5 ${accent.pill}`}
                      >
                        {opt.mode === 'center' ? 'in person' : 'remote'}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {opt.points.map((point) => (
                        <li key={point} className="flex items-start gap-2">
                          <span className={`font-space-mono text-[0.6rem] ${accent.text} shrink-0 mt-1`}>
                            ▸
                          </span>
                          <span className="text-[0.8rem] text-aws-muted leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>

          {/* During testing */}
          <div>
            <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c1 mb-2">
              During testing
            </p>
            <h2 className="text-xl font-bold text-aws-text mb-1">Exam-day rules</h2>
            <p className="text-sm text-aws-muted leading-relaxed max-w-[520px] mb-5">
              Applies to both delivery modes. Know these before you walk in (or log in).
            </p>
            <div className="rounded-xl border border-aws-border bg-aws-card/60 p-5">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {duringTesting.map((rule, i) => (
                  <li key={rule} className="flex items-start gap-3">
                    <span className="font-space-mono text-[0.6rem] font-bold text-c1 shrink-0 mt-0.5 w-5 text-right">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[0.8rem] text-aws-muted leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Policy links */}
          <div className="flex flex-col gap-1.5 font-space-mono text-[0.6rem] text-aws-muted">
            <p>
              Full rules:{' '}
              <a
                href="https://aws.amazon.com/certification/policies/during-testing/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-c1 hover:underline"
              >
                aws.amazon.com/certification/policies/during-testing ↗
              </a>
            </p>
            <p>
              Online (OnVUE) setup & rules:{' '}
              <a
                href="https://www.pearsonvue.com/us/en/aws/onvue.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-c1 hover:underline"
              >
                pearsonvue.com/aws/onvue ↗
              </a>
            </p>
          </div>
        </section>

        {/* Cross-links */}
        <div className="mt-8 flex flex-wrap gap-3 font-space-mono text-[0.65rem]">
          <a href="https://aws.amazon.com/certification/certified-solutions-architect-associate/" target="_blank" rel="noopener noreferrer" className="text-c1 hover:underline underline-offset-2">Official AWS exam page ↗</a>
        </div>

        {/* Study readiness checklist */}
        <section className="mt-12">
          <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c1 mb-2">
            Study checklist
          </p>
          <h2 className="text-xl font-bold text-aws-text mb-1">Are you ready?</h2>
          <p className="text-sm text-aws-muted leading-relaxed max-w-[520px] mb-4">
            The 14 course sections and, for each, the questions you must be able to answer
            out loud without notes. If one trips you up, rewatch that lecture before moving on.
          </p>

          {/* Status legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
            {(Object.keys(checklistStatus) as Array<keyof typeof checklistStatus>).map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5 font-space-mono text-[0.55rem] text-aws-muted">
                <span className={`w-2 h-2 rounded-full shrink-0 ${checklistStatus[k].dot}`} />
                {checklistStatus[k].label}
              </span>
            ))}
          </div>

          <div className="space-y-3">
            {studyChecklist.map((s) => {
              const st = checklistStatus[s.status]
              return (
                <div key={s.n} className="rounded-xl border border-aws-border bg-aws-card/60 p-5">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-aws-border">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                    <span className={`font-space-mono text-[0.62rem] font-bold ${st.text}`}>
                      §{s.n}
                    </span>
                    <h3 className="text-sm font-bold text-aws-text leading-tight min-w-0">{s.title}</h3>
                    <span
                      className={`ml-auto font-space-mono text-[0.5rem] border rounded-full px-2 py-0.5 shrink-0 ${st.pill}`}
                    >
                      {st.label}
                    </span>
                  </div>
                  <p className="font-space-mono text-[0.55rem] text-aws-muted mb-3">{s.meta}</p>
                  <ul className="space-y-1.5">
                    {s.mustAnswer.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className={`font-space-mono text-[0.6rem] ${st.text} shrink-0 mt-1`}>▸</span>
                        <span className="text-[0.78rem] text-aws-muted leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <p className="font-space-mono text-[0.53rem] text-aws-muted mt-3">
            Don&apos;t move on from a §5–§14 section until its quiz is ≥80%. Sources:{' '}
            <Link href="/glossary" className="text-c1 hover:underline">glossary</Link> ·{' '}
            <Link href="/practice" className="text-c1 hover:underline">practice</Link>.
          </p>
        </section>

        {/* Service index — every service by domain → section (table of contents) */}
        <section className="mt-12">
          <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c1 mb-2">
            Service index
          </p>
          <h2 className="text-xl font-bold text-aws-text mb-1">Every service, by domain</h2>
          <p className="text-sm text-aws-muted leading-relaxed max-w-[520px] mb-5">
            The full map: the four exam domains → their sections → every AWS service in
            Deep Notes. Tap any service to jump straight to its card.
          </p>

          <div className="space-y-4">
            {deepNoteDomains
              .filter((d) => d.badge.includes('OF EXAM'))
              .map((d) => {
                const accent = variantAccent[d.variant]
                const weight = d.badge.match(/(\d+)%/)?.[1]
                const total = d.sections.reduce((n, s) => n + s.services.length, 0)
                return (
                  <div key={d.id} className="rounded-xl border border-aws-border bg-aws-card/60 p-5">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-aws-border">
                      <span className={`font-space-mono text-[0.7rem] font-bold ${accentText[accent]}`}>
                        {d.variant.toUpperCase()}
                      </span>
                      {weight && (
                        <span className={`font-space-mono text-[0.58rem] ${accentText[accent]}`}>{weight}%</span>
                      )}
                      <span className="w-px h-3 bg-aws-border shrink-0" />
                      <h3 className="text-sm font-bold text-aws-text leading-tight min-w-0">{d.title}</h3>
                      <span className="ml-auto font-space-mono text-[0.5rem] text-aws-muted shrink-0">
                        {total} services
                      </span>
                    </div>
                    <div className="space-y-3">
                      {d.sections.map((s) => (
                        <div key={s.id}>
                          <p className="font-space-mono text-[0.58rem] text-aws-muted mb-1.5 flex items-center gap-1.5">
                            <span aria-hidden>{s.icon}</span>
                            <span className="uppercase tracking-wide">{s.title}</span>
                            <span className="text-aws-muted/50">· {s.services.length}</span>
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5">
                            {s.services.map((svc) => (
                              <Link
                                key={svc.shortName}
                                href={`/learn#${serviceSlug(s.id, svc.shortName)}`}
                                className="group block rounded-lg -mx-2 px-2 py-1 hover:bg-white/5 transition-colors"
                              >
                                <span className="flex items-baseline gap-1.5">
                                  <span className={`font-space-mono text-[0.6rem] font-bold shrink-0 ${accentText[accent]} group-hover:underline`}>
                                    {svc.shortName}
                                  </span>
                                  <span className="text-[0.58rem] text-aws-muted/60 truncate">{svc.fullName}</span>
                                </span>
                                <span className="block text-[0.65rem] text-aws-muted leading-snug mt-0.5">
                                  {svc.gunaUntuk}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>

          <p className="font-space-mono text-[0.53rem] text-aws-muted mt-3">
            Generated from the Deep Notes catalog — every card is linked. Browse the full set at{' '}
            <Link href="/learn" className="text-c1 hover:underline">Deep Notes</Link>.
          </p>
        </section>

        <SiteFooter tagline="AWS SAA-C03 · Open Source Study Reference" />
      </main>
    </>
  )
}
