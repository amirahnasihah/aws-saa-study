import { searchIndex, type SearchIndexDoc } from '@/data/searchIndex'

export const runtime = 'edge'

function scoreResult(r: SearchIndexDoc, q: string): number {
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

function json(body: unknown, init: { headers?: Record<string, string> } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') ?? '').toLowerCase().trim()
    if (q.length === 0) return json([], { headers: { 'Cache-Control': 'no-store' } })

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
        category: r.category,
      }))
    return json(results, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400' } })
  } catch (e) {
    return json(
      { error: 'handler failed', detail: e instanceof Error ? `${e.message}\n${e.stack ?? ''}` : String(e) },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
