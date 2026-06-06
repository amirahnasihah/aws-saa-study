import AIUnloadGuard from '@/components/AIUnloadGuard'

export const metadata = {
  title: 'AWS SAA-C03 — Practice Questions',
  description: 'Test your knowledge with scenario-based AWS SAA-C03 practice questions across all 4 exam domains: Security, Resilient Architecture, High-Performance, and Cost-Optimized.',
}

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AIUnloadGuard />
      {children}
    </>
  )
}
