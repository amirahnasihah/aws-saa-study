import { DomainData } from '@/data/awsServices'

interface DomainHeaderProps {
  domain: DomainData
}

const variantStyles = {
  d1: {
    wrapper: 'bg-gradient-to-br from-c3/8 to-c6/8 border-c3/15',
    badge: 'bg-gradient-to-br from-c3 to-c6 text-white',
    heading: 'from-white/90 to-c3',
  },
  d2: {
    wrapper: 'bg-gradient-to-br from-c2/8 to-c5/8 border-c2/15',
    badge: 'bg-gradient-to-br from-c2 to-c5 text-black',
    heading: 'from-white/90 to-c2',
  },
  d3: {
    wrapper: 'bg-gradient-to-br from-c1/8 to-c3/8 border-c1/15',
    badge: 'bg-gradient-to-br from-c1 to-c3 text-black',
    heading: 'from-white/90 to-c1',
  },
  d4: {
    wrapper: 'bg-gradient-to-br from-c6/8 to-c5/8 border-c6/15',
    badge: 'bg-gradient-to-br from-c6 to-c5 text-black',
    heading: 'from-white/90 to-c6',
  },
}

export default function DomainHeader({ domain }: DomainHeaderProps) {
  const styles = variantStyles[domain.variant]

  return (
    <div id={domain.id} className={`text-center mb-8 px-4 py-8 rounded-2xl border ${styles.wrapper}`}>
      <span className={`inline-block font-space-mono text-[0.65rem] px-4 py-1 rounded-full tracking-[0.15em] mb-3 ${styles.badge}`}>
        {domain.badge}
      </span>
      <h2
        className={`text-3xl sm:text-4xl font-extrabold leading-tight bg-gradient-to-br ${styles.heading} bg-clip-text text-transparent`}
      >
        {domain.title}
      </h2>
      <p className="font-space-mono text-[0.8rem] text-aws-muted mt-2">{domain.subtitle}</p>
    </div>
  )
}
