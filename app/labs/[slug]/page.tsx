import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import LabDetailClient from '@/components/labs/LabDetailClient'
import { labs } from '@/data/labs'

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return labs.map((lab) => ({ slug: lab.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const lab = labs.find((l) => l.slug === slug)
  if (!lab) return {}
  return {
    title: `${lab.title} — Lab Notes`,
    description: lab.summary,
  }
}

export default async function LabDetailPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <>
      <Nav activePage="labs" />
      <LabDetailClient slug={slug} />
    </>
  )
}
