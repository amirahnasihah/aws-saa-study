import { getRequestContext } from '@cloudflare/next-on-pages'
import { practiceQuestions } from '@/data/practiceQuestions'
import type { PracticeQuestion } from '@/data/practiceQuestions'

export const runtime = 'edge'

interface DBRow {
  id: string
  domain: 'd1' | 'd2' | 'd3' | 'd4'
  domain_label: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  scenario: string
  options: string
  correct_id: string
  explanation: string
  reference: string | null
  keywords: string
  source: string
  page_number: number | null
  screenshot_url: string | null
}

function rowToQuestion(row: DBRow): PracticeQuestion {
  return {
    id: row.id,
    domain: row.domain,
    domainLabel: row.domain_label,
    difficulty: row.difficulty,
    scenario: row.scenario,
    options: JSON.parse(row.options) as PracticeQuestion['options'],
    correctId: row.correct_id,
    explanation: JSON.parse(row.explanation) as PracticeQuestion['explanation'],
    reference: row.reference ?? undefined,
    keywords: JSON.parse(row.keywords) as string[],
    source: row.source as PracticeQuestion['source'],
    pageNumber: row.page_number ?? undefined,
    screenshotUrl: row.screenshot_url ?? undefined,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source')
  const domain = searchParams.get('domain')
  const difficulty = searchParams.get('difficulty')

  try {
    const { env } = getRequestContext()
    const db = (env as CloudflareEnv).DB

    const conditions: string[] = []
    const params: string[] = []
    if (source)     { conditions.push('source = ?');     params.push(source) }
    if (domain)     { conditions.push('domain = ?');     params.push(domain) }
    if (difficulty) { conditions.push('difficulty = ?'); params.push(difficulty) }

    const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''
    const sql = `SELECT * FROM questions${where} ORDER BY rowid`

    const stmt = params.length ? db.prepare(sql).bind(...params) : db.prepare(sql)
    const { results } = await stmt.all<DBRow>()

    if (results.length > 0) {
      return Response.json(results.map(rowToQuestion), {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      })
    }
  } catch {
    // D1 unavailable — fall through to TypeScript fallback
  }

  let fallback = [...practiceQuestions]
  if (source)     fallback = fallback.filter(q => q.source === source)
  if (domain)     fallback = fallback.filter(q => q.domain === domain)
  if (difficulty) fallback = fallback.filter(q => q.difficulty === difficulty)

  return Response.json(fallback.length ? fallback : practiceQuestions, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  })
}
