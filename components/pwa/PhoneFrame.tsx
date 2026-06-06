import type { ReactNode } from 'react'

interface PhoneFrameProps {
  label: string
  platform: 'ios' | 'android'
  children: ReactNode
}

export default function PhoneFrame({ label, platform, children }: PhoneFrameProps) {
  const isIos = platform === 'ios'

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted">
        {label}
      </span>
      <div
        className={`relative w-[280px] rounded-[2.25rem] border-[3px] bg-black shadow-2xl overflow-hidden ${
          isIos ? 'border-zinc-700' : 'border-zinc-600'
        }`}
      >
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-black ${
            isIos ? 'w-28 h-7 rounded-b-2xl' : 'w-20 h-5 rounded-b-xl mt-1'
          }`}
        />
        <div className="pt-8 min-h-[520px] bg-gradient-to-b from-zinc-900 to-zinc-950">
          {children}
        </div>
        {isIos && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/30" />
        )}
      </div>
    </div>
  )
}
