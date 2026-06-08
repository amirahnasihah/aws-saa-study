import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import { labs, type Lab } from '@/data/labs'

type PageProps = {
  params: Promise<{ slug: string }>
}

function findLab(slug: string): Lab | undefined {
  return labs.find((lab) => lab.slug === slug)
}

export function generateStaticParams() {
  return labs.map((lab) => ({ slug: lab.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const lab = findLab(slug)
  if (!lab) return {}
  return {
    title: `${lab.title} — Lab Notes`,
    description: lab.summary,
  }
}

const levelColor: Record<string, string> = {
  Fundamental: 'text-c2 border-c2/25',
  Intermediate: 'text-c4 border-c4/25',
  Advanced: 'text-c6 border-c6/25',
}

function taskAnchor(index: number): string {
  return `task-${index + 1}`
}

export default async function LabDetailPage({ params }: PageProps) {
  const { slug } = await params
  const lab = findLab(slug)
  if (!lab) notFound()

  return (
    <>
      <Nav activePage="labs" />

      <main id="top" className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        <Link href="/labs" className="font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors">
          ← Back to Labs
        </Link>

        <div className="text-center mt-4 mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`font-space-mono text-[0.6rem] px-2 py-0.5 rounded border ${levelColor[lab.level] ?? 'text-aws-muted border-aws-border'}`}>
              {lab.level}
            </span>
            <span className="font-space-mono text-[0.6rem] text-aws-muted">{lab.duration}</span>
            <span className="font-space-mono text-[0.6rem] text-aws-muted">Completed {lab.completedOn}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-2 text-aws-text">
            {lab.title}
          </h1>
          <p className="font-space-mono text-[0.78rem] text-aws-muted max-w-lg mx-auto leading-relaxed">
            {lab.summary}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {lab.tasks.map((task, index) => (
              <a
                key={task.title}
                href={`#${taskAnchor(index)}`}
                className="font-space-mono text-[0.6rem] uppercase tracking-widest px-2.5 py-1 rounded-full border border-c4/30 text-c4 hover:bg-c4/10 transition-colors"
              >
                Task {index + 1}
              </a>
            ))}
            <a
              href="#takeaways"
              className="font-space-mono text-[0.6rem] uppercase tracking-widest px-2.5 py-1 rounded-full border border-c1/30 text-c1 hover:bg-c1/10 transition-colors"
            >
              What I Learned
            </a>
          </div>
        </div>

        {lab.tasks.map((task, index) => (
          <section key={task.title} className="mb-10">
            <div id={taskAnchor(index)} className="flex items-center gap-2 mb-4 pb-3 border-b border-aws-border scroll-mt-20">
              <span className="font-space-mono text-[0.6rem] px-2 py-0.5 rounded border border-c4/25 text-c4 shrink-0">
                Task {index + 1}
              </span>
              <h2 className="font-space-mono text-[0.75rem] font-extrabold uppercase tracking-[0.05em] text-c4">
                {task.title}
              </h2>
              <a href="#top" className="ml-auto font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors">
                ↑ Top
              </a>
            </div>
            <div className="bg-aws-card border border-aws-border rounded-xl p-5">
              <ol className="space-y-2.5 list-decimal list-inside">
                {task.steps.map((step) => (
                  <li key={step} className="text-[0.85rem] text-aws-text leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}

        <section className="mb-10">
          <div id="takeaways" className="flex items-center gap-2 mb-4 pb-3 border-b border-aws-border scroll-mt-20">
            <h2 className="font-space-mono text-[0.75rem] font-extrabold uppercase tracking-[0.05em] text-c1">
              What I Learned
            </h2>
            <a href="#top" className="ml-auto font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors">
              ↑ Top
            </a>
          </div>
          <div className="bg-aws-card border border-aws-border rounded-xl p-5 space-y-3">
            {lab.takeaways.map((point) => (
              <p key={point} className="text-[0.85rem] text-aws-muted leading-relaxed">
                <span className="text-c1 mr-2">→</span>
                {point}
              </p>
            ))}
          </div>
        </section>

        <Link href="/labs" className="font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors">
          ← Back to Labs
        </Link>

        <SiteFooter tagline={`AWS SAA-C03 · ${lab.title} · Personal lab notes`} />
      </main>
    </>
  )
}
