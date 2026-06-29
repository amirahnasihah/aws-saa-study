import { getRequestContext } from '@cloudflare/next-on-pages'
import { loadLabsFallback, mergeLabsWithDatabase } from '@/lib/labs-static-fallback'
import type { LabDBRow } from '@/lib/labs'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { env } = getRequestContext()
    const db = (env as CloudflareEnv).DB
    const { results } = await db
      .prepare('SELECT * FROM labs ORDER BY completed_on DESC, title ASC')
      .all<LabDBRow>()

    if (results.length > 0) {
      const catalog = await loadLabsFallback(request)
      return Response.json(mergeLabsWithDatabase(results, catalog), {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      })
    }
  } catch {
    // D1 unavailable — fall through to static catalog
  }

  const fallback = await loadLabsFallback(request)
  return Response.json(fallback, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  })
}
