import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import LabsPageClient from '@/components/labs/LabsPageClient'

export const metadata: Metadata = {
  title: 'AWS SAA-C03 — Hands-on Labs',
  description: 'Personal notes from hands-on guided labs completed while studying for the AWS SAA-C03 exam.',
}

export default function LabsPage() {
  return (
    <>
      <Nav activePage="labs" />
      <LabsPageClient />
    </>
  )
}
