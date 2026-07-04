'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { learnHref } from '@/data/awsMeta'

// Legacy deep links point at /learn#anchor from when Deep Notes was a single
// page. Forward them to the per-domain route that renders that anchor now.
export default function LearnHashRedirect() {
  const router = useRouter()

  useEffect(() => {
    const anchor = window.location.hash.replace(/^#/, '')
    if (!anchor) return
    const href = learnHref(anchor)
    if (href !== '/learn') router.replace(href)
  }, [router])

  return null
}
