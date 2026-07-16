// Server-side search — uses the BUILD-GENERATED compact index (data/searchIndex.ts,
// ~195 KB) instead of importing the full awsServices `domains` (1.2 MB). Keeps the
// Cloudflare Worker bundle small (free-tier 3 MiB limit). Index is rebuilt by
// scripts/generate-ai-link-indexes.ts (runs in pages:build) whenever cards change.

import { searchIndex } from '@/data/searchIndex'
import type { ColorCategory } from '@/data/awsServices'

export const runtime = 'edge'

function scoreResult(r: (typeof searchIndex)[number], q: string): number {
  if (r.shortLower === q) return 1000
  if (r.shortLower.startsWith(q)) return 900
  if (r.shortLower.includes(q)) return 800
  if (r.fullLower === q) return 700
  if (r.fullLower.startsWith(q)) return 600
  if (r.fullLower.includes(q)) return 500
  if (r.keywordsLower.includes(q)) return 300
  if (r.descLower.includes(q)) return 100
  return -1
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? '').toLowerCase().trim()

  if (q.length === 0) {
    return Response.json([], { headers: { 'Cache-Control': 'no-store' } })
  }

  const results = searchIndex
    .map((r) => ({ r, score: scoreResult(r, q) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score || a.r.shortName.length - b.r.shortName.length)
    .slice(0, 8)
    .map(({ r }) => ({
      shortName: r.shortName,
      fullName: r.fullName,
      domainBadge: r.domainBadge,
      domainVariant: r.domainVariant,
      slug: r.slug,
      sectionTitle: r.sectionTitle,
      sectionIcon: r.sectionIcon,
      category: r.category as ColorCategory,
    }))

  return Response.json(results, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400' },
  })
}
