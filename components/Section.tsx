import { SectionData, categoryStyles } from '@/data/awsServices'
import Link from 'next/link'
import ServiceCard from './ServiceCard'

interface SectionProps {
  section: SectionData
}

export default function Section({ section }: SectionProps) {
  const styles = categoryStyles[section.category]

  return (
    <section id={section.id} className="mb-10">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-aws-border">
        <span className="text-xl">{section.icon}</span>
        <span className={`text-sm font-extrabold uppercase tracking-[0.05em] ${styles.title}`}>
          {section.title}
        </span>
        <Link href={`/learn#${section.id}`} className="font-space-mono text-[0.6rem] text-aws-muted hover:text-aws-text transition-colors ml-2 border border-aws-border/50 rounded-full px-2 py-0.5 hover:border-aws-border">
          Deep Notes →
        </Link>
        <a href="#top" className="ml-auto font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors">
          ↑ Top
        </a>
      </div>

      {section.services.map((service) => (
        <ServiceCard key={service.shortName} service={service} category={section.category} />
      ))}
    </section>
  )
}
