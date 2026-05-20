import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/siteLinks'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL,                    changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/learn`,         changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/practice`,      changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/visual`,        changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/vpc`,           changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`,         changeFrequency: 'monthly', priority: 0.5 },
  ]
}
