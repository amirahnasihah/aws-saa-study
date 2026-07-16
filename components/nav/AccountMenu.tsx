'use client'

import { useRef, useState } from 'react'
import { LogOutIcon } from './icons'
import { useDismissable } from './useDismissable'

/**
 * Signed-in account control: a cyan avatar (email initial) that opens a
 * dropdown showing the full email and a Sign out action wired to the
 * caller's existing handler.
 */
export default function AccountMenu({
  email,
  onSignOut,
}: {
  email: string
  onSignOut: () => void | Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismissable(open, ref, () => setOpen(false))

  const initial = email.charAt(0).toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={email}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-c1/40 bg-c1/15 font-space-mono text-[0.75rem] font-bold text-c1 transition-all hover:bg-c1/25"
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="animate-modal-in absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 rounded-xl border border-aws-border bg-aws-card p-2 shadow-xl shadow-black/40"
        >
          <div className="px-3 py-2">
            <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-aws-muted">
              Signed in as
            </p>
            <p className="mt-0.5 truncate text-[0.8rem] text-aws-text" title={email}>
              {email}
            </p>
          </div>
          <div className="my-1 border-t border-aws-border" />
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false)
              await onSignOut()
            }}
            className="signout-item flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-aws-muted transition-all hover:bg-white/5 hover:text-aws-text"
          >
            <LogOutIcon />
            <span className="font-space-mono text-[0.62rem] uppercase tracking-widest">Sign out</span>
          </button>
        </div>
      )}
    </div>
  )
}
