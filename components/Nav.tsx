'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { navDomains } from '@/data/awsServices'
import SearchModal from './SearchModal'

interface NavProps {
  activePage?: 'cheatsheet' | 'learn' | 'practice' | 'visual' | 'vpc'
}

export default function Nav({ activePage = 'cheatsheet' }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav className="nav-scroll hidden md:flex fixed top-0 left-0 right-0 h-14 z-50 items-center gap-2 px-4 overflow-x-auto bg-aws-bg/92 backdrop-blur-md border-b border-aws-border">
        <span className="font-space-mono text-[0.7rem] font-bold text-c1 whitespace-nowrap mr-2 pr-2 border-r border-aws-border shrink-0">
          AWS SAA-C03
        </span>

        <PageLink href="/" label="Cheat Sheet" active={activePage === 'cheatsheet'} />
        <PageLink href="/learn" label="Deep Notes" active={activePage === 'learn'} />
        <PageLink href="/practice" label="Practice" active={activePage === 'practice'} />
        <PageLink href="/visual" label="Visual" active={activePage === 'visual'} />
        <PageLink href="/vpc" label="VPC Guide" active={activePage === 'vpc'} />

        <span className="text-aws-border text-sm shrink-0">·</span>

        {navDomains.map((domain, di) => (
          <div key={domain.href} className="flex items-center gap-1.5 shrink-0">
            {di > 0 && <span className="text-aws-border text-sm">·</span>}
            <a href={domain.href} className={`font-space-mono text-[0.65rem] font-bold uppercase tracking-widest whitespace-nowrap px-2 py-1 rounded-md transition-all hover:bg-white/5 hover:text-aws-text border border-transparent ${domain.colorClass}`}>
              {domain.label}
            </a>
            <span className="text-aws-border text-sm">|</span>
            {domain.items.map((item) => (
              <a key={item.href} href={item.href} className={`font-space-mono text-[0.6rem] whitespace-nowrap px-2 py-1 rounded-full transition-all hover:bg-white/6 border ${item.className}`}>
                {item.label}
              </a>
            ))}
          </div>
        ))}

        {/* search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="ml-auto shrink-0 flex items-center gap-2 font-space-mono text-[0.6rem] text-aws-muted border border-aws-border/60 rounded-lg px-3 py-1.5 hover:border-aws-border hover:text-aws-text transition-all duration-150 hover:bg-white/4 whitespace-nowrap"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="6.5" cy="6.5" r="4.5" />
            <path d="M14 14l-3-3" />
          </svg>
          Search
          <kbd className="text-[0.5rem] border border-aws-border/60 rounded px-1 py-0.5">⌘K</kbd>
        </button>
      </nav>

      {/* ── Mobile nav ── */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-4 bg-aws-bg/95 backdrop-blur-md border-b border-aws-border">
        <span className="font-space-mono text-[0.7rem] font-bold text-c1">AWS SAA-C03</span>
        <div className="flex items-center gap-1">
          {/* search icon */}
          <button onClick={() => setSearchOpen(true)} className="text-aws-muted hover:text-aws-text transition-colors p-2" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="7.5" cy="7.5" r="5.5" />
              <path d="M16 16l-3.5-3.5" />
            </svg>
          </button>

          {/* hamburger */}
          <button onClick={() => setMenuOpen(true)} className="text-aws-muted hover:text-aws-text transition-colors p-2" aria-label="Open menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect y="3" width="20" height="2" rx="1" />
              <rect y="9" width="20" height="2" rx="1" />
              <rect y="15" width="20" height="2" rx="1" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex animate-overlay-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="relative ml-auto w-72 h-full bg-aws-card border-l border-aws-border overflow-y-auto animate-modal-in">
            <div className="flex items-center justify-between px-4 py-4 border-b border-aws-border">
              <span className="font-space-mono text-[0.7rem] font-bold text-c1">Navigation</span>
              <button onClick={() => setMenuOpen(false)} className="text-aws-muted hover:text-aws-text transition-colors p-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M13 3L3 13M3 3l10 10" />
                </svg>
              </button>
            </div>
            {/* page links */}
            <div className="px-4 py-3 border-b border-aws-border/60 space-y-1">
              {[
                { href: '/',          label: 'Cheat Sheet', icon: '📋', active: activePage === 'cheatsheet' },
                { href: '/learn',     label: 'Deep Notes',  icon: '📖', active: activePage === 'learn' },
                { href: '/practice',  label: 'Practice',    icon: '✏️', active: activePage === 'practice' },
                { href: '/visual',    label: 'Visual',      icon: '🗺️', active: activePage === 'visual' },
                { href: '/vpc',       label: 'VPC Guide',   icon: '🏘️', active: activePage === 'vpc' },
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all ${
                    p.active
                      ? 'bg-white/8 text-aws-text'
                      : 'text-aws-muted hover:bg-white/4 hover:text-aws-text'
                  }`}
                >
                  <span className="text-base leading-none">{p.icon}</span>
                  <span className="font-space-mono text-[0.68rem] uppercase tracking-widest">{p.label}</span>
                  {p.active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-c1" />}
                </Link>
              ))}
            </div>

            <div className="p-4 space-y-5">
              {navDomains.map((domain) => (
                <div key={domain.href}>
                  <a href={domain.href} onClick={() => setMenuOpen(false)} className={`block font-space-mono text-[0.7rem] font-bold uppercase tracking-widest mb-2 ${domain.colorClass}`}>
                    {domain.label}
                  </a>
                  <div className="flex flex-wrap gap-2">
                    {domain.items.map((item) => (
                      <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`font-space-mono text-[0.65rem] px-2.5 py-1 rounded-full border transition-all hover:bg-white/6 ${item.className}`}>
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Search modal ── */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function PageLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`font-space-mono text-[0.6rem] uppercase tracking-widest px-2 py-1 rounded-md border transition-all whitespace-nowrap ${
        active
          ? 'text-aws-text border-aws-border bg-white/8'
          : 'text-aws-muted border-transparent hover:text-aws-text hover:bg-white/5'
      }`}
    >
      {label}
    </Link>
  )
}
