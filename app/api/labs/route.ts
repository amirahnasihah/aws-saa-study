import { getRequestContext } from '@cloudflare/next-on-pages'
import { labs } from '@/data/labs'
import { rowToLab, type LabDBRow } from '@/lib/labs'

export const runtime = 'edge'

export async function GET() {
  try {
    const { env } = getRequestContext()
    const db = (env as CloudflareEnv).DB
    const { results } = await db
      .prepare('SELECT * FROM labs ORDER BY completed_on DESC, title ASC')
      .all<LabDBRow>()

    if (results.length > 0) {
      return Response.json(results.map(rowToLab), {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      })
    }
  } catch {
    // D1 unavailable — fall through
  }

  return Response.json(labs, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  })
}
