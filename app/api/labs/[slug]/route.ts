import { getRequestContext } from '@cloudflare/next-on-pages'
import { labs } from '@/data/labs'
import { rowToLab, type LabDBRow } from '@/lib/labs'

export const runtime = 'edge'

type RouteContext = { params: Promise<{ slug: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params

  try {
    const { env } = getRequestContext()
    const db = (env as CloudflareEnv).DB
    const row = await db
      .prepare('SELECT * FROM labs WHERE slug = ?')
      .bind(slug)
      .first<LabDBRow>()

    if (row) {
      return Response.json(rowToLab(row), {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      })
    }
  } catch {
    // D1 unavailable — fall through
  }

  const fallback = labs.find((lab) => lab.slug === slug)
  if (!fallback) {
    return Response.json({ error: 'Lab not found' }, { status: 404 })
  }

  return Response.json(fallback, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  })
}
