'use client'

import { useState, useMemo } from 'react'
import { glossary, glossaryCategories } from '@/data/glossary'

const ALL = 'All'
const categories = [ALL, ...Object.keys(glossaryCategories)]

// reverse-lookup: term → category
const termCategory = Object.fromEntries(
  Object.entries(glossaryCategories).flatMap(([cat, terms]) =>
    terms.map((t) => [t, cat])
  )
)

export default function GlossarySection() {
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState(ALL)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return Object.entries(glossary).filter(([term, def]) => {
      const matchesCat = activeCat === ALL || termCategory[term] === activeCat
      const matchesQuery = !q || term.toLowerCase().includes(q) || def.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [query, activeCat])

  return (
    <section className="mt-10">
      {/* header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c4 mb-1">Reference</p>
          <h2 className="text-lg font-bold text-aws-text">Glossary</h2>
        </div>
        <span className="font-space-mono text-[0.6rem] text-aws-muted bg-aws-card border border-aws-border px-2 py-1 rounded-full">
          {filtered.length} / {Object.keys(glossary).length} terms
        </span>
      </div>

      {/* search */}
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-aws-muted text-[0.8rem] pointer-events-none">⌕</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms or definitions…"
          className="w-full bg-aws-card border border-aws-border rounded-xl pl-8 pr-4 py-2.5
            text-base sm:text-[0.82rem] text-aws-text placeholder:text-aws-muted/50
            focus:outline-none focus:border-c4/50 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-aws-muted hover:text-aws-text text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* category pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`font-space-mono text-[0.58rem] uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all duration-100 ${
              activeCat === cat
                ? 'bg-c4/15 border-c4/40 text-c4'
                : 'bg-transparent border-aws-border/60 text-aws-muted hover:border-aws-border hover:text-aws-text'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* terms grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-aws-muted text-sm py-10">No terms match &ldquo;{query}&rdquo;</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map(([term, def]) => (
            <div
              key={term}
              className="bg-aws-card border border-aws-border/70 rounded-xl px-4 py-3
                hover:border-c4/30 transition-colors duration-150 group"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-space-mono text-[0.68rem] font-bold text-c4 leading-tight">
                  {term}
                </span>
                {termCategory[term] && (
                  <span className="font-space-mono text-[0.52rem] text-aws-muted/60 uppercase tracking-wider shrink-0 mt-0.5">
                    {termCategory[term]}
                  </span>
                )}
              </div>
              <p className="text-[0.73rem] text-aws-muted leading-relaxed">{def}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
