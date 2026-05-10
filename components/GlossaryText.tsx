import GlossaryTerm from './GlossaryTerm'
import { glossary } from '@/data/glossary'

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// build once — longer terms first so "SSL/TLS" matches before "SSL"
const terms = Object.keys(glossary).sort((a, b) => b.length - a.length)
const pattern = new RegExp(`(${terms.map(escapeRegex).join('|')})`, 'gi')
const lowerMap: Record<string, string> = Object.fromEntries(
  Object.entries(glossary).map(([k, v]) => [k.toLowerCase(), v])
)

interface Props {
  text: string
  className?: string
}

export default function GlossaryText({ text, className }: Props) {
  const parts = text.split(pattern)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const def = lowerMap[part.toLowerCase()]
        return def
          ? <GlossaryTerm key={i} term={part} definition={def} />
          : <span key={i}>{part}</span>
      })}
    </span>
  )
}
