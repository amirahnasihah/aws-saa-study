'use client'

import { useState, useRef, useEffect, CSSProperties } from 'react'

interface Props {
  term: string
  definition: string
}

type TooltipState =
  | { visible: false }
  | { visible: true; top: number; left: number; anchor: 'left' | 'right' }

const TOOLTIP_W = 208
const MARGIN = 12

function computeState(el: HTMLSpanElement): TooltipState {
  const rect = el.getBoundingClientRect()
  const fitsRight = rect.left + TOOLTIP_W + MARGIN <= window.innerWidth
  return {
    visible: true,
    top: rect.top,
    left: fitsRight
      ? Math.max(MARGIN, rect.left)
      : Math.max(MARGIN, window.innerWidth - rect.right - TOOLTIP_W),
    anchor: fitsRight ? 'left' : 'right',
  }
}

export default function GlossaryTerm({ term, definition }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false })
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reveal = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (wrapperRef.current) setTooltip(computeState(wrapperRef.current))
  }
  const hide = () => {
    timerRef.current = setTimeout(() => setTooltip({ visible: false }), 150)
  }

  useEffect(() => {
    if (!tooltip.visible) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setTooltip({ visible: false })
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [tooltip.visible])

  const tooltipStyle: CSSProperties = tooltip.visible
    ? {
        position: 'fixed',
        top: tooltip.top - TOOLTIP_W / 2 - 10, // sit above the term
        left: tooltip.left,
        width: TOOLTIP_W,
        maxWidth: `calc(100vw - ${MARGIN * 2}px)`,
        zIndex: 9999,
      }
    : {}

  return (
    <span ref={wrapperRef} className="relative inline-block" onMouseEnter={reveal} onMouseLeave={hide}>
      <span
        className="underline decoration-dotted decoration-amber-400/50 cursor-help text-inherit"
        onClick={(e) => {
          e.stopPropagation()
          if (wrapperRef.current) {
            tooltip.visible
              ? setTooltip({ visible: false })
              : setTooltip(computeState(wrapperRef.current))
          }
        }}
      >
        {term}
      </span>

      {tooltip.visible && (
        <span
          role="tooltip"
          style={tooltipStyle}
          className="block rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5
            shadow-xl shadow-black/40 text-[0.75rem] text-slate-200 leading-relaxed"
          onMouseEnter={reveal}
          onMouseLeave={hide}
        >
          <span className="font-space-mono text-amber-400 font-bold text-[0.62rem] uppercase tracking-widest block mb-1">
            {term}
          </span>
          {definition}
        </span>
      )}
    </span>
  )
}
