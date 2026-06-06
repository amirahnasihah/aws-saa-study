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
  { id: 'nvidia', icon: '⬡', label: 'NVIDIA' },
  { id: 'openrouter', icon: '⇄', label: 'OpenRouter' },
  { id: 'ollama', icon: '☁', label: 'Ollama' },
]

export default function AIProviderToggle({ provider, onSelect }: AIProviderToggleProps) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {FREE.map((opt) => {
        const active = provider === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md font-space-mono text-[0.58rem] transition-all duration-150 whitespace-nowrap ${
              active
                ? 'text-c4 bg-c4/10 border border-c4/20'
                : 'text-aws-muted hover:text-aws-text border border-transparent hover:bg-white/4'
            }`}
          >
            <span className="text-[0.65rem] leading-none">{opt.icon}</span>
            {opt.label}
            <span className={`text-[0.44rem] font-bold tracking-wide uppercase ${active ? 'text-c4/60' : 'text-aws-muted/30'}`}>
              free
            </span>
          </button>
        )
      })}

      <span className="w-px h-3.5 bg-aws-border/50 mx-1 shrink-0" />

      {BYOK.map((opt) => {
        const active = provider === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md font-space-mono text-[0.58rem] transition-all duration-150 whitespace-nowrap ${
              active
                ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
                : 'text-aws-muted hover:text-aws-text border border-transparent hover:bg-white/4'
            }`}
          >
            <span className="text-[0.65rem] leading-none">{opt.icon}</span>
            {opt.label}
            <span className={`text-[0.44rem] font-bold tracking-wide uppercase ${active ? 'text-amber-400/50' : 'text-aws-muted/30'}`}>
              key
            </span>
          </button>
        )
      })}
    </div>
  )
}
