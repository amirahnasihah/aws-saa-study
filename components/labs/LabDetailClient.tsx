'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'
import LabStepList from '@/components/labs/LabStepList'
import { labs as fallbackLabs } from '@/data/labs'
import type { Lab } from '@/lib/labs'

const levelColor: Record<string, string> = {
  Fundamental: 'text-c2 border-c2/25',
  Intermediate: 'text-c4 border-c4/25',
  Advanced: 'text-c6 border-c6/25',
}

type LabDetailClientProps = {
  slug: string
}

const taskAnchor = (index: number): string => `task-${index + 1}`

export default function LabDetailClient({ slug }: LabDetailClientProps) {
  const [lab, setLab] = useState<Lab | undefined>(() => fallbackLabs.find((l) => l.slug === slug))
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/labs/${slug}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true)
          return null
        }
        return r.json()
      })
      .then((data: unknown) => {
        if (data && typeof data === 'object' && 'slug' in data) {
          setLab(data as Lab)
          setNotFound(false)
        }
      })
      .catch(() => {
        const fb = fallbackLabs.find((l) => l.slug === slug)
        setLab(fb)
        setNotFound(!fb)
      })
  }, [slug])

  if (notFound || !lab) {
    return (
      <main className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20">
        <p className="text-aws-muted font-space-mono text-sm">Lab not found.</p>
        <Link href="/labs" className="font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text mt-4 inline-block">
          ← Back to Labs
        </Link>
      </main>
    )
  }

  return (
    <main id="top" className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
      <Link href="/labs" className="font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors">
        ← Back to Labs
      </Link>

      <div className="text-center mt-4 mb-10">
        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
          <span className={`font-space-mono text-[0.6rem] px-2 py-0.5 rounded border ${levelColor[lab.level] ?? 'text-aws-muted border-aws-border'}`}>
            {lab.level}
          </span>
          <span className="font-space-mono text-[0.6rem] text-aws-muted">{lab.duration}</span>
          {lab.completedOn ? (
            <span className="font-space-mono text-[0.6rem] text-aws-muted">Completed {lab.completedOn}</span>
          ) : null}
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
          {lab.takeaways.length > 0 ? (
            <a
              href="#takeaways"
              className="font-space-mono text-[0.6rem] uppercase tracking-widest px-2.5 py-1 rounded-full border border-c1/30 text-c1 hover:bg-c1/10 transition-colors"
            >
              What I Learned
            </a>
          ) : null}
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
            <LabStepList steps={task.steps} />
          </div>
        </section>
      ))}

      {lab.takeaways.length > 0 ? (
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
      ) : null}

      <Link href="/labs" className="font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors">
        ← Back to Labs
      </Link>

      <SiteFooter tagline={`AWS SAA-C03 · ${lab.title} · Personal lab notes`} />
    </main>
  )
}
