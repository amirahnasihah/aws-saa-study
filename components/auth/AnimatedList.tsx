'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'

/**
 * MagicUI-style animated list. Streams items in newest-on-top: a running
 * counter pushes a new entry every `delay`ms and keeps a rolling window of
 * `maxVisible`. `mode="popLayout"` lets survivors spring into place the
 * instant the oldest card exits. Reduced-motion users get a static list.
 */
export function AnimatedList<T>({
  data,
  renderItem,
  delay = 1800,
  maxVisible = 5,
}: {
  data: T[]
  renderItem: (item: T, key: number) => ReactNode
  delay?: number
  maxVisible?: number
}) {
  const reduce = useReducedMotion()
  const [counters, setCounters] = useState<number[]>([])

  useEffect(() => {
    if (reduce) return
    let n = 0
    const push = () => setCounters((prev) => [n++, ...prev].slice(0, maxVisible))
    push()
    const id = setInterval(push, delay)
    return () => clearInterval(id)
  }, [reduce, delay, maxVisible])

  if (reduce) {
    return (
      <div className="flex flex-col gap-3">
        {data.slice(0, maxVisible).map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {counters.map((counter) => (
          <motion.div
            key={counter}
            layout
            initial={{ opacity: 0, y: -28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            {renderItem(data[counter % data.length], counter)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
