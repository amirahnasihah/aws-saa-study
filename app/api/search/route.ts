import { domains, serviceSlug } from '@/data/awsServices'
import type { ColorCategory } from '@/data/awsServices'

export const runtime = 'edge'

interface SearchDoc {
  shortName: string
  fullName: string
  domainBadge: string
  domainVariant: 'd1' | 'd2' | 'd3' | 'd4'
  slug: string
  sectionTitle: string
  sectionIcon: string
  category: ColorCategory
  shortLower: string
  fullLower: string
  keywordsLower: string
  descLower: string
}

let searchIndex: SearchDoc[] = []
let indexError: string | null = null
try {
  searchIndex = domains.flatMap((domain) =>
    domain.sections.flatMap((section) =>
      section.services.map((service) => ({
        shortName: service.shortName,
        fullName: service.fullName,
        domainBadge: (domain.badge ?? '').split('·')[0].trim(),
        domainVariant: domain.variant,
        slug: serviceSlug(section.id, service.shortName),
        sectionTitle: section.title,
        sectionIcon: section.icon,
        category: section.category,
        shortLower: (service.shortName ?? '').toLowerCase(),
        fullLower: (service.fullName ?? '').toLowerCase(),
        keywordsLower: ((service.keywords ?? []).join(' ')).toLowerCase(),
        descLower: [service.fungsi ?? '', service.contohGuna ?? '', service.scenario ?? ''].join(' ').toLowerCase(),
      }))
    )
  )
} catch (e) {
  indexError = e instanceof Error ? `${e.message}\n${e.stack ?? ''}` : String(e)
}

function scoreResult(r: SearchDoc, q: string): number {
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

function json(body: unknown, init: { headers?: Record<string,string> } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
  })
}

export async function GET(request: Request) {
  try {
    if (indexError) {
      return json({ error: 'index build failed', detail: indexError }, { headers: { 'Cache-Control': 'no-store' } })
    }
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
    return json({ error: 'handler failed', detail: e instanceof Error ? `${e.message}\n${e.stack ?? ''}` : String(e) }, { headers: { 'Cache-Control': 'no-store' } })
  }
}
