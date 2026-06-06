import { type AIProvider } from '@/hooks/useAIProvider'

interface AIProviderToggleProps {
  provider: AIProvider
  onSelect: (p: AIProvider) => void
}

const FREE: Array<{ id: AIProvider; icon: string; label: string }> = [
  { id: 'ilmu', icon: '🇲🇾', label: 'ILMU' },
  { id: 'gemini', icon: '✦', label: 'Gemini' },
]

const BYOK: Array<{ id: AIProvider; icon: string; label: string }> = [
  { id: 'openrouter', icon: '⇄', label: 'OpenRouter' },
  { id: 'ollama', icon: '☁', label: 'Ollama' },
]

function ProviderBtn({
  opt,
  active,
  onSelect,
  badge,
}: {
  opt: { id: AIProvider; icon: string; label: string }
  active: boolean
  onSelect: (p: AIProvider) => void
  badge?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(opt.id)}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-space-mono text-[0.58rem] transition-all duration-150 whitespace-nowrap ${
        active
          ? 'bg-c1/15 border border-c1/25 text-c1'
          : 'text-aws-muted hover:text-aws-text border border-transparent'
      }`}
    >
      <span className="text-[0.65rem]">{opt.icon}</span>
      {opt.label}
      {badge && (
        <span className={`text-[0.48rem] uppercase tracking-wide font-bold ml-0.5 ${active ? 'text-c1/70' : 'text-aws-muted/60'}`}>
          {badge}
        </span>
      )}
    </button>
  )
}

export default function AIProviderToggle({ provider, onSelect }: AIProviderToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-aws-card border border-aws-border flex-wrap">
      {FREE.map((opt) => (
        <ProviderBtn key={opt.id} opt={opt} active={provider === opt.id} onSelect={onSelect} badge="free" />
      ))}
      <span className="w-px h-4 bg-aws-border/60 mx-0.5" />
      {BYOK.map((opt) => (
        <ProviderBtn key={opt.id} opt={opt} active={provider === opt.id} onSelect={onSelect} badge="byok" />
      ))}
    </div>
  )
}
