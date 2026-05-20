import { Handle, Position, NodeProps } from '@xyflow/react'

export type ArchColor = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'gray'

const colorMap: Record<ArchColor, { border: string; bg: string; text: string; accent: string }> = {
  c1: { border: 'border-c1/50', bg: 'bg-c1/8', text: 'text-c1', accent: 'bg-c1' },
  c2: { border: 'border-c2/50', bg: 'bg-c2/8', text: 'text-c2', accent: 'bg-c2' },
  c3: { border: 'border-c3/50', bg: 'bg-c3/8', text: 'text-c3', accent: 'bg-c3' },
  c4: { border: 'border-c4/50', bg: 'bg-c4/8', text: 'text-c4', accent: 'bg-c4' },
  c5: { border: 'border-c5/50', bg: 'bg-c5/8', text: 'text-c5', accent: 'bg-c5' },
  c6: { border: 'border-c6/50', bg: 'bg-c6/8', text: 'text-c6', accent: 'bg-c6' },
  gray: { border: 'border-white/20', bg: 'bg-white/5', text: 'text-aws-muted', accent: 'bg-white/30' },
}

export function ArchNode({ data }: NodeProps) {
  const d = data as { label: string; sub?: string; icon?: string; color: ArchColor }
  const c = colorMap[d.color] ?? colorMap.gray

  return (
    <div className={`relative min-w-[110px] max-w-[140px] rounded-xl border ${c.border} ${c.bg} px-3 py-2.5 shadow-lg`}>
      <Handle type="target" position={Position.Left} className="!bg-white/20 !border-white/30 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-white/20 !border-white/30 !w-2 !h-2" />
      <Handle type="target" position={Position.Top} className="!bg-white/20 !border-white/30 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !border-white/30 !w-2 !h-2" />

      <div className={`absolute top-0 left-0 w-[3px] h-full rounded-l-xl ${c.accent}`} />

      <div className="pl-1 text-center">
        {d.icon && <p className="text-lg mb-0.5 leading-none">{d.icon}</p>}
        <p className={`font-space-mono text-[0.65rem] font-bold leading-tight ${c.text}`}>{d.label}</p>
        {d.sub && <p className="font-space-mono text-[0.52rem] text-aws-muted mt-0.5 leading-tight">{d.sub}</p>}
      </div>
    </div>
  )
}

export function GroupNode({ data }: NodeProps) {
  const d = data as { label: string; color: ArchColor }
  const c = colorMap[d.color] ?? colorMap.gray
  return (
    <div className={`rounded-2xl border border-dashed ${c.border} bg-transparent px-3 pt-6 pb-3 min-w-[160px] min-h-[80px]`}>
      <div className="absolute top-2 left-3">
        <span className={`font-space-mono text-[0.52rem] uppercase tracking-widest ${c.text} opacity-70`}>
          {d.label}
        </span>
      </div>
    </div>
  )
}
