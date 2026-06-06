interface PWAIconTileProps {
  size: number
  label: string
  showMaskableGuide?: boolean
}

export default function PWAIconTile({ size, label, showMaskableGuide = false }: PWAIconTileProps) {
  const radius = size >= 96 ? Math.round(size * 0.22) : Math.round(size * 0.18)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {showMaskableGuide && (
          <div
            className="absolute inset-0 rounded-full border border-dashed border-amber-400/40 pointer-events-none"
            style={{ margin: `${size * 0.1}px` }}
            title="Android maskable safe zone (~80%)"
          />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icon.svg"
          alt="App icon preview"
          width={size}
          height={size}
          className="w-full h-full object-cover shadow-lg"
          style={{ borderRadius: radius }}
        />
      </div>
      <span className="font-space-mono text-[0.52rem] text-aws-muted text-center leading-tight">
        {size}×{size}
        <br />
        <span className="text-aws-muted/60">{label}</span>
      </span>
    </div>
  )
}
