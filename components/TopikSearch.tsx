'use client'

import { useState, useCallback } from 'react'

// Client-side DOM filter for the /topik index. The full service list is rendered
// server-side (keeps the 1.2 MB `domains` dataset OFF the client bundle); this
// component only toggles visibility via data attributes — no big JSON shipped.
export default function TopikSearch() {
  const [query, setQuery] = useState('')

  const apply = useCallback((q: string) => {
    const needle = q.toLowerCase().trim()
    const cards = document.querySelectorAll<HTMLElement>('[data-topik-card]')
    const groups = document.querySelectorAll<HTMLElement>('[data-topik-group]')

    if (needle.length === 0) {
      cards.forEach((c) => (c.hidden = false))
      groups.forEach((g) => (g.hidden = false))
      return
    }

    const visibleGroups = new Set<string>()
    cards.forEach((card) => {
      const hay = card.dataset.search ?? ''
      const match = hay.includes(needle)
      card.hidden = !match
      if (match && card.dataset.group) visibleGroups.add(card.dataset.group)
    })
    groups.forEach((g) => {
      g.hidden = !visibleGroups.has(g.dataset.group ?? '')
    })
  }, [])

  return (
    <div className="sticky top-[4.5rem] z-30 -mx-4 px-4 py-3 bg-aws-bg/90 backdrop-blur-md border-b border-aws-border/60">
      <div className="flex items-center gap-3 bg-aws-card border border-aws-border rounded-2xl px-4 py-2.5 max-w-xl mx-auto ring-1 ring-c1/10 focus-within:ring-c1/30">
        <svg className="shrink-0 text-aws-muted" width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="7.5" cy="7.5" r="5.5" />
          <path d="M16 16l-3.5-3.5" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); apply(e.target.value) }}
          placeholder="Cari topik / service / keyword — cth: S3, encryption, NAT, failover, lifecycle…"
          className="flex-1 bg-transparent text-aws-text placeholder:text-aws-muted text-base sm:text-sm outline-none font-syne"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); apply('') }}
            className="text-aws-muted hover:text-aws-text transition-colors text-xs"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
