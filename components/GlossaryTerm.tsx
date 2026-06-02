'use client'

import { useState, useRef, useEffect, useCallback, CSSProperties } from 'react'

interface Props {
  term: string
  definition: string
}

interface TooltipPos {
  top: number
  left?: number
  right?: number
}

export default function GlossaryTerm({ term, definition }: Props) {
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState<TooltipPos>({ top: 0, left: 0 })
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const TOOLTIP_W = 208
  const MARGIN = 12

  const calcPos = useCallback(() => {
    if (!wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    // fixed positioning uses viewport coords — rect.top is already viewport-relative
    const fitsRight = rect.left + TOOLTIP_W + MARGIN <= window.innerWidth
    if (fitsRight) {
      setPos({ top: rect.top, left: rect.left })
    } else {
      setPos({ top: rect.top, right: window.innerWidth - rect.right })
    }
  }, [])

  const reveal = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    calcPos()
    setShow(true)
  }
  const hide = () => {
    timerRef.current = setTimeout(() => setShow(false), 150)
  }

  useEffect(() => {
    if (!show) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setShow(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [show])

  const tooltipStyle: CSSProperties = {
    position: 'fixed',
    // sit above the term: subtract tooltip height estimate (~100px) + 6px gap
    top: pos.top - 106,
    ...(pos.left !== undefined ? { left: Math.max(MARGIN, pos.left) } : {}),
    ...(pos.right !== undefined ? { right: Math.max(MARGIN, pos.right) } : {}),
    width: TOOLTIP_W,
    maxWidth: `calc(100vw - ${MARGIN * 2}px)`,
    zIndex: 9999,
  }

  return (
    <span ref={wrapperRef} className="relative inline-block" onMouseEnter={reveal} onMouseLeave={hide}>
      <span
        className="underline decoration-dotted decoration-amber-400/50 cursor-help text-inherit"
        onClick={(e) => { e.stopPropagation(); calcPos(); setShow(s => !s) }}
      >
        {term}
      </span>

      {show && (
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
