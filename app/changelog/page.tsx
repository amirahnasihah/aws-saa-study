import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import ChangelogView from '@/components/ChangelogView'

export const metadata: Metadata = {
  title: 'Changelog — AWS SAA-C03 Study',
  description: 'What changed, when, and why.',
  robots: { index: false, follow: false },
}

export default function ChangelogPage() {
  return (
    <>
      <Nav />
      <ChangelogView />
    </>
  )
}
