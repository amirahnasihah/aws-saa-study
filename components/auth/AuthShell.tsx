'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import AuthShowcase from './AuthShowcase'

/**
 * Split-screen auth layout. Left: the form (children) on a clean dark pane —
 * the conventional sign-in side. Right: the animated study-notes showcase,
 * hidden below `lg` so mobile users get just the form. Title/subtitle are
 * props so one screen can change them across steps without remounting.
 */
export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left — form */}
      <div className="relative flex min-h-screen items-center justify-center px-5 py-16">
        <Link
          href="/"
          className="absolute left-5 top-5 font-space-mono text-[0.7rem] font-bold text-c1 transition-colors hover:text-aws-text"
        >
          AWS SAA-C03
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[380px]"
        >
          {eyebrow && (
            <p className="mb-2 font-space-mono text-[0.62rem] uppercase tracking-[0.2em] text-c1">
              {eyebrow}
            </p>
          )}
          <h1 className="mb-2 text-2xl font-semibold text-aws-text">{title}</h1>
          {subtitle && <p className="mb-6 text-sm text-aws-muted">{subtitle}</p>}
          {children}
          {footer && <div className="mt-6">{footer}</div>}
        </motion.div>
      </div>

      {/* Right — animated showcase (decorative, desktop only) */}
      <div className="relative hidden overflow-hidden border-l border-white/5 lg:block">
        <AuthShowcase />
      </div>
    </div>
  )
}
