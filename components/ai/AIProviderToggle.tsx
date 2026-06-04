import { type AIProvider } from '@/hooks/useAIProvider'

interface AIProviderToggleProps {
  provider: AIProvider
  onSelect: (p: AIProvider) => void
}

const OPTIONS: Array<{ id: AIProvider; icon: string; label: string }> = [
  { id: 'groq', icon: '⚡', label: 'Groq · Free' },
  { id: 'anthropic', icon: '✦', label: 'Claude · BYOK' },
  { id: 'ilmu', icon: '🇲🇾', label: 'ILMU · BYOK' },
  { id: 'ollama', icon: '☁', label: 'Ollama · BYOK' },
]

export default function AIProviderToggle({ provider, onSelect }: AIProviderToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-aws-card border border-aws-border flex-wrap">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt.id)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-space-mono text-[0.58rem] uppercase tracking-widest transition-all duration-150 ${
            provider === opt.id
              ? 'bg-c1/15 border border-c1/25 text-c1'
              : 'text-aws-muted hover:text-aws-text border border-transparent'
          }`}
        >
          <span className="text-[0.7rem]">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  )
}
