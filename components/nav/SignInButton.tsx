'use client'

import Link from 'next/link'
import { LogInIcon } from './icons'

/**
 * Accent-styled sign-in action. The `signin-btn` class is the hover/focus
 * anchor for the door-enter keyframe in globals.css; `fullWidth` is used in
 * the mobile drawer's account block.
 */
export default function SignInButton({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <Link
      href="/auth/login"
      className={`signin-btn inline-flex items-center gap-2 rounded-lg border border-c1/40 bg-c1/10 font-space-mono uppercase tracking-widest text-c1 transition-all hover:bg-c1/20 ${
        fullWidth
          ? 'w-full justify-center px-4 py-2.5 text-[0.68rem]'
          : 'px-3 py-1.5 text-[0.6rem]'
      }`}
    >
      <LogInIcon />
      Sign in
    </Link>
  )
}
