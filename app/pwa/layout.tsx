import type { Metadata, Viewport } from 'next'
import { PWA_DRAFT } from '@/data/pwaPreview'

export const metadata: Metadata = {
  title: 'PWA Preview — AWS SAA Study',
  description: 'Preview install icon and mobile appearance (draft, not in nav).',
  robots: { index: false, follow: false },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: PWA_DRAFT.shortName,
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: PWA_DRAFT.themeColor,
}

export default function PWALayout({ children }: { children: React.ReactNode }) {
  return children
}
