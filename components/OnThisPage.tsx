'use client'

import { useEffect, useState } from 'react'
import { navDomains } from '@/data/awsServices'

const stripHash = (href: string): string => href.replace(/^#/, '')

// Section ids in document order — drives the scrollspy. Mirrors the ids rendered
// by `Section` / `DomainHeader`, so this component is correct on any page that
// renders `domains` (Cheat Sheet and Deep Notes today).
const sectionIds: string[] = navDomains.flatMap((domain) =>
  domain.items.map((item) => stripHash(item.href))
)

function scrollToSection(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

export default function OnThisPage() {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    // Track which sections sit inside the upper viewport band; the topmost of
    // those (in document order) is the "current" section.
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        const top = sectionIds.find((id) => visible.has(id))
        if (top) setActiveId(top)
      },
      { rootMargin: '-12% 0px -78% 0px', threshold: 0 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="On this page"
      className="sticky top-14 z-30 -mx-4 mb-6 border-b border-aws-border/60 bg-aws-bg/85 backdrop-blur-md"
    >
      <div className="nav-scroll flex items-center gap-1.5 overflow-x-auto px-4 py-2.5">
        {navDomains.map((domain, index) => (
          <div key={domain.href} className="flex items-center gap-1.5">
            {index > 0 && (
              <span aria-hidden className="mx-1 h-4 w-px shrink-0 bg-aws-border/60" />
            )}
            <button
              type="button"
              onClick={() => scrollToSection(stripHash(domain.href))}
              className={`shrink-0 whitespace-nowrap font-space-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] transition-opacity hover:opacity-75 ${domain.colorClass}`}
            >
              {domain.label}
            </button>
            {domain.items.map((item) => {
              const id = stripHash(item.href)
              const active = id === activeId
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  aria-current={active ? 'location' : undefined}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 font-space-mono text-[0.6rem] transition-all ${item.className} ${
                    active ? 'bg-white/10 font-semibold' : 'hover:bg-white/6'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </nav>
  )
}
