'use client'

import { useState, useEffect, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navDomains } from '@/data/awsServices'
import { navTransitionTypes } from '@/lib/nav-transition'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import FloatingSearch from './FloatingSearch'
import AccountMenu from './nav/AccountMenu'
import BrowseServicesMenu from './nav/BrowseServicesMenu'
import SignInButton from './nav/SignInButton'
import { LogOutIcon } from './nav/icons'

interface NavProps {
  activePage?: 'cheatsheet' | 'learn' | 'practice' | 'scenarios' | 'visual' | 'vpc' | 'labs' | 'ai'
}

const siteHeaderTransition: CSSProperties = { viewTransitionName: 'site-header' }

export default function Nav({ activePage = 'cheatsheet' }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null)
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    setUserEmail(null)
    window.location.href = '/'
  }

  return (
    <>
      {/* ── Desktop nav: brand · primary nav · account ── */}
      <nav
        style={siteHeaderTransition}
        className="hidden md:flex fixed top-0 left-0 right-0 h-14 z-50 items-center gap-1 px-4 bg-aws-bg/92 backdrop-blur-md border-b border-aws-border"
      >
        {/* Zone 1 — brand */}
        <Link
          href="/about"
          className="font-space-mono text-[0.7rem] font-bold text-c1 whitespace-nowrap mr-2 pr-3 border-r border-aws-border shrink-0 hover:text-aws-text transition-colors"
        >
          AWS SAA-C03
        </Link>

        {/* Zone 2 — primary nav */}
        <div className="flex items-center gap-1 min-w-0">
          <PageLink pathname={pathname} href="/" label="Cheat Sheet" active={activePage === 'cheatsheet'} />
          <PageLink pathname={pathname} href="/learn" label="Deep Notes" active={activePage === 'learn'} />
          <BrowseServicesMenu />
          {userEmail && <PageLink pathname={pathname} href="/practice" label="Practice" active={activePage === 'practice'} />}
          {userEmail && <PageLink pathname={pathname} href="/scenarios" label="Scenarios" active={activePage === 'scenarios'} />}
          <PageLink pathname={pathname} href="/visual" label="Visual" active={activePage === 'visual'} />
          <PageLink pathname={pathname} href="/vpc" label="VPC Guide" active={activePage === 'vpc'} />
          {userEmail && <PageLink pathname={pathname} href="/labs" label="Labs" active={activePage === 'labs'} />}
          {userEmail && <AskAINavLink pathname={pathname} active={activePage === 'ai'} variant="icon" />}
        </div>

        {/* Zone 3 — account */}
        <div className="ml-auto flex items-center pl-2 shrink-0">
          {userEmail ? (
            <AccountMenu email={userEmail} onSignOut={handleSignOut} />
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>

      {/* ── Mobile nav ── */}
      <nav
        style={siteHeaderTransition}
        className="md:hidden fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-4 bg-aws-bg/95 backdrop-blur-md border-b border-aws-border"
      >
        <Link href="/about" className="font-space-mono text-[0.7rem] font-bold text-c1 hover:text-aws-text transition-colors">
          AWS SAA-C03
        </Link>
        <div className="flex items-center gap-1">
          {userEmail && <AskAINavLink pathname={pathname} active={activePage === 'ai'} variant="pill" />}
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
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="text-aws-muted hover:text-aws-text transition-colors p-1"
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M13 3L3 13M3 3l10 10" />
                </svg>
              </button>
            </div>

            {/* account block */}
            <div className="px-4 py-4 border-b border-aws-border/60">
              {userEmail ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-c1/40 bg-c1/15 font-space-mono text-[0.8rem] font-bold text-c1">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted">Signed in</p>
                    <p className="truncate text-[0.8rem] text-aws-text" title={userEmail}>{userEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => { await handleSignOut(); setMenuOpen(false) }}
                    className="signout-item ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-aws-border text-aws-muted transition-all hover:bg-white/5 hover:text-aws-text"
                    aria-label="Sign out"
                    title="Sign out"
                  >
                    <LogOutIcon />
                  </button>
                </div>
              ) : (
                <SignInButton fullWidth />
              )}
            </div>

            {/* page links */}
            <div className="px-4 py-3 border-b border-aws-border/60 space-y-1">
              {[
                { href: '/',          label: 'Cheat Sheet', icon: '📋', active: activePage === 'cheatsheet' },
                { href: '/learn',     label: 'Deep Notes',  icon: '📖', active: activePage === 'learn' },
                ...(userEmail
                  ? [
                      { href: '/practice',  label: 'Practice',    icon: '✏️', active: activePage === 'practice' },
                      { href: '/scenarios', label: 'Scenarios',   icon: '🏗️', active: activePage === 'scenarios' },
                    ]
                  : []),
                { href: '/visual',    label: 'Visual',      icon: '🗺️', active: activePage === 'visual' },
                { href: '/vpc',       label: 'VPC Guide',   icon: '🏘️', active: activePage === 'vpc' },
                ...(userEmail
                  ? [{ href: '/labs', label: 'Labs', icon: '🧪', active: activePage === 'labs' }]
                  : []),
                ...(userEmail
                  ? [{ href: '/ai', label: 'Ask AI', icon: '✦', active: activePage === 'ai' }]
                  : []),
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  transitionTypes={navTransitionTypes(pathname, p.href)}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all ${
                    p.active
                      ? 'bg-white/8 text-aws-text'
                      : 'text-aws-muted hover:bg-white/4 hover:text-aws-text'
                  }`}
                >
                  {p.href === '/ai' ? (
                    <AskAISparkleIcon size="drawer" />
                  ) : (
                    <span className="text-base leading-none">{p.icon}</span>
                  )}
                  <span className="font-space-mono text-[0.68rem] uppercase tracking-widest">{p.label}</span>
                  {p.active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-c1" />}
                </Link>
              ))}
            </div>

            {/* browse services */}
            <div className="p-4 space-y-5">
              <p className="font-space-mono text-[0.6rem] uppercase tracking-[0.2em] text-aws-muted">
                Browse Services
              </p>
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

      <FloatingSearch />
    </>
  )
}

function AskAISparkleIcon({ size }: { size: 'icon' | 'pill' | 'drawer' }) {
  const box =
    size === 'icon' ? 'w-4 h-4' : size === 'pill' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  const main =
    size === 'icon' ? 'text-[1rem]' : size === 'pill' ? 'text-[0.85rem]' : 'text-[0.9rem]'

  return (
    <span className={`relative inline-flex items-center justify-center shrink-0 ${box}`}>
      <span className={`animate-sparkle-main ${main} leading-none`}>✦</span>
      <span className="absolute top-0 right-0 animate-sparkle-a text-[0.32rem] leading-none text-c1">✦</span>
      <span className="absolute bottom-0 left-0 animate-sparkle-b text-[0.28rem] leading-none text-c1">✧</span>
      <span className="absolute bottom-0 right-0 animate-sparkle-c text-[0.28rem] leading-none text-c1">✦</span>
    </span>
  )
}

function AskAINavLink({
  pathname,
  active,
  variant,
}: {
  pathname: string
  active: boolean
  variant: 'icon' | 'pill'
}) {
  const shared = active
    ? 'text-c1 border-c1/30 bg-c1/8'
    : 'text-aws-muted border-aws-border/60 hover:text-c1 hover:bg-c1/5'

  if (variant === 'icon') {
    return (
      <Link
        href="/ai"
        transitionTypes={navTransitionTypes(pathname, '/ai')}
        className={`relative inline-flex items-center justify-center w-8 h-8 rounded-md border transition-all shrink-0 ${shared}`}
        title="Ask AI"
        aria-label="Ask AI"
      >
        <AskAISparkleIcon size="icon" />
      </Link>
    )
  }

  return (
    <Link
      href="/ai"
      transitionTypes={navTransitionTypes(pathname, '/ai')}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${shared}`}
      aria-label="Ask AI"
    >
      <AskAISparkleIcon size="pill" />
      <span className="font-space-mono text-[0.58rem] uppercase tracking-widest whitespace-nowrap">
        Ask AI
      </span>
      {!active && <span className="w-1.5 h-1.5 rounded-full bg-c1 shrink-0" />}
    </Link>
  )
}

function PageLink({
  pathname,
  href,
  label,
  active,
}: {
  pathname: string
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      transitionTypes={navTransitionTypes(pathname, href)}
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
