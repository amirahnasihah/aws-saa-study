'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { categoryStyles, type ColorCategory } from '@/data/awsServices'

// Search now runs server-side via /api/search so the full awsServices `domains`
// dataset (1.2 MB) is NOT shipped to the client bundle. The modal only renders the
// small JSON results the edge route returns.
interface SearchResult {
  shortName: string
  fullName: string
  domainBadge: string
  domainVariant: 'd1' | 'd2' | 'd3' | 'd4'
  slug: string
  sectionTitle: string
  sectionIcon: string
  category: ColorCategory
}

const domainColors: Record<string, string> = {
  d1: 'text-c3',
  d2: 'text-c2',
  d3: 'text-c1',
  d4: 'text-c6',
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Debounced server search — only fires after the user stops typing for ~120ms,
  // and aborts in-flight requests when the query changes (AbortController).
  useEffect(() => {
    const q = query.toLowerCase().trim()
    if (q.length === 0) {
      setResults([])
      setActive(0)
      return
    }
    const controller = new AbortController()
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : []))
        .then((data: unknown) => {
          setResults(Array.isArray(data) ? (data as SearchResult[]) : [])
          setActive(0)
        })
        .catch(() => {
          // aborted or network error — leave current results untouched
        })
    }, 120)
    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [query])

  const navigate = useCallback((result: SearchResult) => {
    onClose()
    setQuery('')

    // Per-service anchors only exist on the cheatsheet (/) and Deep Notes (/learn).
    // From any other page, route to Deep Notes so the anchor actually resolves.
    if (pathname !== '/' && pathname !== '/learn') {
      router.push(`/learn#${result.slug}`)
      return
    }

    setTimeout(() => {
      const el = document.getElementById(result.slug)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }, [onClose, pathname, router])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
        setQuery('')
        setActive(0)
      }, 50)
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') { onClose(); setQuery('') }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
      if (e.key === 'Enter' && results[active]) navigate(results[active])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, results, active, navigate, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4 animate-overlay-in">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-aws-bg/80 backdrop-blur-md"
        onClick={() => { onClose(); setQuery('') }}
      />

      {/* modal */}
      <div className="relative w-full max-w-xl animate-modal-in">
        {/* search input */}
        <div className="flex items-center gap-3 bg-aws-card border border-aws-border rounded-2xl px-4 py-3 shadow-2xl ring-1 ring-c1/10 focus-within:ring-c1/30 focus-within:border-c1/40 transition-all duration-200">
          <svg className="shrink-0 text-aws-muted" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="7.5" cy="7.5" r="5.5" />
            <path d="M16 16l-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, keywords..."
            className="flex-1 bg-transparent text-aws-text placeholder:text-aws-muted text-base md:text-sm outline-none font-syne"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-aws-muted hover:text-aws-text transition-colors text-xs">
              ✕
            </button>
          )}
          <kbd className="hidden sm:flex font-space-mono text-[0.55rem] text-aws-muted border border-aws-border rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* results */}
        {query.trim().length > 0 && (
          <div ref={listRef} className="mt-2 bg-aws-card border border-aws-border rounded-2xl overflow-hidden shadow-2xl">
            {results.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-aws-muted text-sm">No results for <span className="text-aws-text">&ldquo;{query}&rdquo;</span></p>
                <p className="font-space-mono text-[0.65rem] text-aws-muted/60 mt-1">Try: IAM, Lambda, S3, DynamoDB...</p>
              </div>
            ) : (
              <div>
                {results.map((result, i) => {
                  const styles = categoryStyles[result.category]
                  const isActive = i === active
                  return (
                    <button
                      key={`${result.shortName}-${i}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => navigate(result)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-100 border-b border-aws-border/50 last:border-0 animate-result-in ${
                        isActive ? 'bg-white/6' : 'hover:bg-white/3'
                      }`}
                      style={{ animationDelay: `${i * 0.03}s`, animationFillMode: 'both' }}
                    >
                      {/* accent dot */}
                      <div className={`w-2 h-2 rounded-full shrink-0 ${styles.accent}`} />

                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-aws-text text-sm font-semibold">{result.shortName}</span>
                          <span className="text-aws-muted text-[0.7rem] font-space-mono truncate">{result.fullName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`font-space-mono text-[0.58rem] uppercase tracking-widest ${domainColors[result.domainVariant]}`}>
                            {result.domainBadge}
                          </span>
                          <span className="text-aws-border text-[0.6rem]">·</span>
                          <span className="text-aws-muted text-[0.65rem]">{result.sectionIcon} {result.sectionTitle}</span>
                        </div>
                      </div>

                      {/* arrow indicator */}
                      <span className={`text-aws-muted text-xs transition-all duration-100 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'}`}>
                        →
                      </span>
                    </button>
                  )
                })}

                {/* footer hint */}
                <div className="px-4 py-2 flex gap-4 border-t border-aws-border/50 bg-white/2">
                  <span className="font-space-mono text-[0.55rem] text-aws-muted/60">↑↓ navigate</span>
                  <span className="font-space-mono text-[0.55rem] text-aws-muted/60">↵ go to section</span>
                  <span className="font-space-mono text-[0.55rem] text-aws-muted/60">esc close</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* empty state hint */}
        {query.trim().length === 0 && (
          <div className="mt-3 flex flex-wrap gap-2 justify-center animate-modal-in">
            {['IAM', 'Lambda', 'S3', 'RDS', 'WAF', 'Auto Scaling', 'CloudFront', 'KMS'].map((hint) => (
              <button
                key={hint}
                onClick={() => setQuery(hint)}
                className="font-space-mono text-[0.62rem] text-aws-muted border border-aws-border/60 rounded-full px-3 py-1 hover:border-aws-border hover:text-aws-text transition-all duration-150"
              >
                {hint}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
