import { getRequestContext } from '@cloudflare/next-on-pages'
import { allLabsFallback } from '@/lib/labs-fallback'
import { rowToLab, type LabDBRow } from '@/lib/labs'

export const runtime = 'edge'

const useCompiledLabs = () =>
  process.env.NODE_ENV === 'development' || process.env.USE_COMPILED_LABS === '1'

export async function GET() {
  if (!useCompiledLabs()) {
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
  }

  const fallback = allLabsFallback()
  return Response.json(fallback, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  })
}
