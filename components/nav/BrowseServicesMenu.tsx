'use client'

import { useRef, useState } from 'react'
import { navDomains } from '@/data/awsServices'
import { ChevronDown } from './icons'
import { useDismissable } from './useDismissable'

/**
 * Collapses the AWS domain jump-links into a single mega-menu, freeing the
 * primary nav from horizontal overflow. Renders the existing `navDomains`
 * data unchanged — same anchors, same per-domain colours.
 */
export default function BrowseServicesMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismissable(open, ref, () => setOpen(false))

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-md border px-2 py-1 font-space-mono text-[0.6rem] uppercase tracking-widest transition-all ${
          open
            ? 'border-aws-border bg-white/8 text-aws-text'
            : 'border-transparent text-aws-muted hover:bg-white/5 hover:text-aws-text'
        }`}
      >
        Services
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="animate-modal-in absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(92vw,720px)] rounded-2xl border border-aws-border bg-aws-card p-4 shadow-xl shadow-black/40">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
            {navDomains.map((domain) => (
              <div key={domain.href}>
                <a
                  href={domain.href}
                  onClick={() => setOpen(false)}
                  className={`mb-2 block font-space-mono text-[0.62rem] font-bold uppercase tracking-widest ${domain.colorClass}`}
                >
                  {domain.label}
                </a>
                <div className="flex flex-wrap gap-1.5">
                  {domain.items.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-full border px-2 py-1 font-space-mono text-[0.6rem] transition-all hover:bg-white/6 ${item.className}`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
