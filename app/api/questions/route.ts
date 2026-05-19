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
  }
}

export async function GET() {
  try {
    const { env } = getRequestContext()
    const db = (env as CloudflareEnv).DB
    const { results } = await db.prepare('SELECT * FROM questions ORDER BY rowid').all<DBRow>()

    if (results.length > 0) {
      return Response.json(results.map(rowToQuestion), {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      })
    }
  } catch {
    // D1 unavailable — fall through to TypeScript fallback
  }

  return Response.json(practiceQuestions, {
    headers: {
      'Cache-Control': 'public, s-maxage=60',
    },
  })
}
