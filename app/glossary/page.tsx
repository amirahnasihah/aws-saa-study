import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import GlossaryClient from './GlossaryClient'
import { glossary } from '@/data/glossary'

export const metadata: Metadata = {
  title: 'Glossary — AWS SAA-C03 Study',
  description: 'Searchable reference of AWS & networking terms for the SAA-C03 exam.',
}

export default function GlossaryPage() {
  const termCount = Object.keys(glossary).length
  return (
    <>
      <Nav />
      <main className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">
        <div className="mb-6">
          <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c4 mb-2">Reference</p>
          <h1 className="font-space-mono text-2xl font-bold text-aws-text mb-1">Glossary</h1>
          <p className="text-aws-muted text-sm">
            {termCount} AWS & networking terms — search or filter by category.
          </p>
        </div>
        <GlossaryClient />
        <SiteFooter tagline="AWS SAA-C03 · Glossary · Good luck! 💪" />
      </main>
    </>
  )
}
