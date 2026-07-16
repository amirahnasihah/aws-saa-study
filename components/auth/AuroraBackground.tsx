'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * Full-bleed animated aurora using the project's accent tokens
 * (c1 cyan, c3 purple, c6 pink). Three blurred radial blobs drift on
 * independent loops; `useReducedMotion` freezes them for users who opt out.
 */
export default function AuroraBackground() {
  const reduce = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-aws-bg">
      <motion.div
        className="absolute -top-1/3 left-1/4 h-[60vh] w-[60vh] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.35), transparent 70%)' }}
        animate={reduce ? undefined : { x: [0, 60, -30, 0], y: [0, 40, 20, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/4 right-1/5 h-[55vh] w-[55vh] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.32), transparent 70%)' }}
        animate={reduce ? undefined : { x: [0, -50, 30, 0], y: [0, 30, -40, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[45vh] w-[45vh] rounded-full blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.22), transparent 70%)' }}
        animate={reduce ? undefined : { x: [0, 40, -40, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* fine grid + vignette for depth */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(226,232,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,1) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(10,14,26,0.9))]" />
    </div>
  )
}
