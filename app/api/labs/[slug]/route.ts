import { getRequestContext } from '@cloudflare/next-on-pages'
import { findLabFallback, mergeLabRowWithCatalog } from '@/lib/labs-fallback'
import { shouldUseCompiledLabs, type LabDBRow } from '@/lib/labs'

export const runtime = 'edge'

type RouteContext = { params: Promise<{ slug: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params

  if (!shouldUseCompiledLabs()) {
    try {
      const { env } = getRequestContext()
      const db = (env as CloudflareEnv).DB
      const row = await db
        .prepare('SELECT * FROM labs WHERE slug = ?')
        .bind(slug)
        .first<LabDBRow>()

      if (row) {
        const catalog = findLabFallback(slug)
        return Response.json(mergeLabRowWithCatalog(row, catalog), {
          headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
        })
      }
    } catch {
      // D1 unavailable — fall through
    }
  }

  const fallback = findLabFallback(slug)
  if (!fallback) {
    return Response.json({ error: 'Lab not found' }, { status: 404 })
  }

  return Response.json(fallback, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  })
}
