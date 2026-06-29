import { getRequestContext } from '@cloudflare/next-on-pages'
import { findLabFromStatic, mergeLabRowWithCatalog } from '@/lib/labs-static-fallback'
import type { LabDBRow } from '@/lib/labs'

export const runtime = 'edge'

type RouteContext = { params: Promise<{ slug: string }> }

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params

  try {
    const { env } = getRequestContext()
    const db = (env as CloudflareEnv).DB
    const row = await db
      .prepare('SELECT * FROM labs WHERE slug = ?')
      .bind(slug)
      .first<LabDBRow>()

    if (row) {
      const catalog = await findLabFromStatic(request, slug)
      return Response.json(mergeLabRowWithCatalog(row, catalog), {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      })
    }
  } catch {
    // D1 unavailable — fall through
  }

  const fallback = await findLabFromStatic(request, slug)
  if (!fallback) {
    return Response.json({ error: 'Lab not found' }, { status: 404 })
  }

  return Response.json(fallback, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  })
}
