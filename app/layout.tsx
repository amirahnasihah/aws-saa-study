import type { Metadata } from 'next'
import { Space_Mono, Inter } from 'next/font/google'
import { BookmarksProvider } from '@/components/BookmarksContext'
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aws-messy-notes.pages.dev'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'AWS SAA-C03 — Cheat Sheet',
  description: 'Design Secure, Resilient, High-Performing & Cost-Optimized Architectures — AWS Solutions Architect Associate study reference',
  keywords: [
    'AWS', 'SAA-C03', 'Solutions Architect', 'cheat sheet', 'study guide',
    'VPC', 'EC2', 'S3', 'IAM', 'RDS', 'Lambda', 'CloudFront',
    'exam prep', 'certification', 'cloud computing',
  ],
  authors: [{ name: 'AWS Messy Notes' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'AWS SAA-C03 Cheat Sheet',
    title: 'AWS SAA-C03 — Cheat Sheet',
    description: 'Design Secure, Resilient, High-Performing & Cost-Optimized Architectures — AWS Solutions Architect Associate study reference',
  },
  twitter: {
    card: 'summary',
    title: 'AWS SAA-C03 — Cheat Sheet',
    description: 'Design Secure, Resilient, High-Performing & Cost-Optimized Architectures — AWS Solutions Architect Associate study reference',
  },
  other: {
    'color-scheme': 'dark',
    'theme-color': '#0a0e1a',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body>
        <BookmarksProvider>{children}</BookmarksProvider>
      </body>
    </html>
  )
}
