import AIUnloadGuard from '@/components/AIUnloadGuard'

export default function AILayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AIUnloadGuard />
      {children}
    </>
  )
}
