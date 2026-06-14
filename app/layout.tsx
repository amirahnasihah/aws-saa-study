import type { Metadata, Viewport } from 'next'
import { Space_Mono, Inter } from 'next/font/google'
import AIUnloadGuard from '@/components/AIUnloadGuard'
import { BookmarksProvider } from '@/components/BookmarksContext'
import { AnswerBookmarksProvider } from '@/components/AnswerBookmarksContext'
import { SITE_URL } from '@/data/siteLinks'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

export const viewport: Viewport = {
  themeColor: '#0a0e1a',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'AWS SAA-C03 Study',
  description: 'Design Secure, Resilient, High-Performing & Cost-Optimized Architectures — AWS Solutions Architect Associate study reference',
  keywords: [
    'AWS', 'SAA-C03', 'Solutions Architect', 'study guide', 'exam prep',
    'VPC', 'EC2', 'S3', 'IAM', 'RDS', 'Lambda', 'CloudFront',
    'certification', 'cloud computing',
  ],
  authors: [{ name: 'AWS SAA Study' }],
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'SAA Study',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'AWS SAA Study',
    title: 'AWS SAA-C03 Study',
    description: 'Design Secure, Resilient, High-Performing & Cost-Optimized Architectures — AWS Solutions Architect Associate study reference',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, type: 'image/png', alt: 'AWS SAA-C03 Study — Solutions Architect Associate exam prep' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AWS SAA-C03 Study',
    description: 'Design Secure, Resilient, High-Performing & Cost-Optimized Architectures — AWS Solutions Architect Associate study reference',
    images: ['/twitter-image.png'],
  },
  other: {
    'color-scheme': 'dark',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${spaceMono.variable}`}>
      <body>
        <BookmarksProvider>
          <AnswerBookmarksProvider>
            <AIUnloadGuard />
            {children}
          </AnswerBookmarksProvider>
        </BookmarksProvider>
      </body>
    </html>
  )
}
