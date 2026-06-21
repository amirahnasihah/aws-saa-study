import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import BookmarkDetailClient from '@/components/bookmarks/BookmarkDetailClient'

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Saved answer — Bookmarks',
    description: 'Saved AI answer from AWS SAA study',
  }
}

export default async function BookmarkDetailPage({ params }: PageProps) {
  const { id } = await params

  return (
    <>
      <Nav activePage="bookmarks" />
      <BookmarkDetailClient id={id} />
    </>
  )
}
