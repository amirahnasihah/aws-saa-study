import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import BookmarksPageClient from '@/components/bookmarks/BookmarksPageClient'

export const metadata: Metadata = {
  title: 'Bookmarks — AWS SAA-C03 Study',
  description: 'Your saved AWS services and AI answers — synced when signed in.',
}

export default function BookmarksPage() {
  return (
    <>
      <Nav activePage="bookmarks" />
      <BookmarksPageClient />
    </>
  )
}
