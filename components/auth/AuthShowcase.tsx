'use client'

import { motion } from 'motion/react'
import AuroraBackground from './AuroraBackground'
import { AnimatedList } from './AnimatedList'
import StudyNoteCard from './StudyNoteCard'
import { studyNotes } from './studyNotes'

/**
 * Right pane of the split auth screen: aurora backdrop with a continuously
 * streaming list of AWS SAA-C03 study notes. Decorative — hidden on mobile
 * by the shell, so it stays purely visual.
 */
export default function AuthShowcase() {
  return (
    <div className="relative flex h-full min-h-screen flex-col justify-center overflow-hidden p-12 xl:p-16">
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <p className="font-space-mono text-[0.62rem] uppercase tracking-[0.2em] text-c1">
          Study companion
        </p>
        <h2 className="mt-3 text-2xl font-semibold leading-tight text-aws-text xl:text-3xl">
          Pick up right where
          <br />
          you left off.
        </h2>
        <p className="mt-3 text-sm text-aws-muted">
          Quick hits from your AWS Solutions Architect notes.
        </p>

        {/* mask fades the oldest card into the aurora as it streams out */}
        <div className="mt-8 [mask-image:linear-gradient(to_bottom,black_72%,transparent)]">
          <AnimatedList
            data={studyNotes}
            renderItem={(note, key) => <StudyNoteCard key={key} {...note} />}
            delay={2000}
            maxVisible={5}
          />
        </div>
      </motion.div>
    </div>
  )
}
