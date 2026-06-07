import type { NextConfig } from 'next'

if (process.env.NODE_ENV === 'development') {
  void import('@cloudflare/next-on-pages/next-dev').then(({ setupDevPlatform }) =>
    setupDevPlatform()
  )
}

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig
