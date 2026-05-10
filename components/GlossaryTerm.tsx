'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  term: string
  definition: string
}

export default function GlossaryTerm({ term, definition }: Props) {
  const [show, setShow] = useState(false)
  const [side, setSide] = useState<'left' | 'right'>('left')
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reveal = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (wrapperRef.current) {
      const { left } = wrapperRef.current.getBoundingClientRect()
      setSide(left > window.innerWidth / 2 ? 'right' : 'left')
    }
    setShow(true)
  }
  const hide = () => {
    timerRef.current = setTimeout(() => setShow(false), 150)
  }

  // close on tap/click outside
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

  return (
    <span ref={wrapperRef} className="relative inline-block" onMouseEnter={reveal} onMouseLeave={hide}>
      <span
        className="underline decoration-dotted decoration-amber-400/50 cursor-help text-inherit"
        onClick={(e) => { e.stopPropagation(); setShow(s => !s) }}
      >
        {term}
      </span>

      {show && (
        <span
          role="tooltip"
          className={`absolute bottom-full mb-1.5 z-50 block
            w-52 max-w-[min(208px,calc(100vw-1.5rem))] rounded-xl
            border border-slate-700 bg-slate-900 px-3 py-2.5
            shadow-xl shadow-black/40 text-[0.75rem] text-slate-200 leading-relaxed
            ${side === 'left' ? 'left-0' : 'right-0'}`}
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
