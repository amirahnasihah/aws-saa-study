'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import AuroraBackground from './AuroraBackground'

/**
 * Reusable chromeless auth screen: animated aurora background + a glassy,
 * centered card. Any auth route (login, verify, error) can drop its form in
 * here and inherit the look. Title/subtitle are props so a single screen can
 * change them across steps without remounting the shell.
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-16">
      <AuroraBackground />

      <Link
        href="/"
        className="absolute top-5 left-5 z-10 font-space-mono text-[0.7rem] font-bold text-c1 transition-colors hover:text-aws-text"
      >
        AWS SAA-C03
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="rounded-2xl border border-white/10 bg-aws-card/70 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
          {eyebrow && (
            <p className="mb-2 font-space-mono text-[0.62rem] uppercase tracking-[0.2em] text-c1">
              {eyebrow}
            </p>
          )}
          <h1 className="mb-2 text-xl font-semibold text-aws-text sm:text-2xl">{title}</h1>
          {subtitle && <p className="mb-6 text-sm text-aws-muted">{subtitle}</p>}
          {children}
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </motion.div>
    </div>
  )
}
