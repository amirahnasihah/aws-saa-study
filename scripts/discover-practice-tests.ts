/**
 * Discover practice / section test URLs from the SAA course Practice Test tab.
 *
 *   bun run practice:discover
 *   bun run practice:discover -- --cdp-endpoint chrome
 *
 * Writes scripts/practice-tests-index.json (quizId + url + mapped setId).
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import {
  CORE_PRACTICE_SETS,
  COURSE_ID,
  COURSE_SLUG,
  type PracticeTestKind,
} from './lib/practice-test-catalog'
import { launchBrowser, ensureAuth } from './scrape-course-lab'

const OUT = resolve('scripts/practice-tests-index.json')
const COURSE_URL = `https://business.whizlabs.com/learn/course/${COURSE_SLUG}/${COURSE_ID}`

type DiscoveredRow = {
  index: number
  title: string
  questionCount: number
  quizId: string | null
  examUrl: string | null
  kind: PracticeTestKind | 'unknown'
  setId: string | null
}

const parseArgs = () => {
  const args = process.argv.slice(2)
  const get = (flag: string) => {
    const i = args.indexOf(flag)
    return i !== -1 ? args[i + 1] : undefined
  }
  const raw = get('--cdp-endpoint') ?? process.env.PLAYWRIGHT_CDP_ENDPOINT
  const cdpEndpoint = raw === 'chrome' ? 'http://127.0.0.1:9222' : raw
  return { headless: args.includes('--headless'), cdpEndpoint }
}

const inferKind = (title: string): PracticeTestKind | 'unknown' => {
  const t = title.toLowerCase()
  if (t.includes('final test')) return 'final'
  if (t.includes('practice test')) return 'pt'
  if (t.includes('section') || /^\d+\./.test(title.trim())) return 'section'
  return 'unknown'
}

const practiceTestNumber = (title: string): number | null => {
  const match = title.match(/practice test\s*(\d+)/i)
  return match ? Number(match[1]) : null
}

const matchSetId = (rows: DiscoveredRow[]): DiscoveredRow[] => {
  const ptCatalog = CORE_PRACTICE_SETS.filter((s) => s.kind === 'pt')
  const sectionCatalog = CORE_PRACTICE_SETS.filter((s) => s.kind === 'section')
  const ptByNumber = new Map(
    ptCatalog.map((s) => [Number(s.setId.replace('wz', '')), s.setId]),
  )
  const sectionByTitle = new Map(sectionCatalog.map((s) => [s.title.toLowerCase(), s.setId]))

  const sectionRows = rows.filter((r) => r.kind === 'section')

  return rows.map((row) => {
    if (row.kind === 'pt') {
      const num = practiceTestNumber(row.title)
      if (num && num >= 2 && num <= 6) {
        return { ...row, setId: ptByNumber.get(num) ?? null }
      }
      return { ...row, setId: null }
    }
    if (row.kind === 'section') {
      const byTitle = sectionByTitle.get(row.title.toLowerCase()) ?? null
      const idx = sectionRows.indexOf(row)
      const byOrder = sectionCatalog[idx]?.setId ?? null
      return { ...row, setId: byTitle ?? byOrder }
    }
    return row
  })
}

type PracticeApiRow = {
  section_heading?: string | null
  quiz_id?: number | null
  quiz_name?: string | null
  questions_count?: number | null
}

const capturePracticeTests = async (
  page: Awaited<ReturnType<Awaited<ReturnType<typeof launchBrowser>>['context']['newPage']>>,
): Promise<DiscoveredRow[]> => {
  let apiRows: PracticeApiRow[] = []

  page.on('response', async (response) => {
    if (!response.url().includes('getpraticetestinfo') || apiRows.length > 0) return
    try {
      const payload = (await response.json()) as { data?: PracticeApiRow[] }
      apiRows = payload.data ?? []
    } catch {
      // ignore parse errors
    }
  })

  await page.goto(COURSE_URL, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.waitForTimeout(6_000)

  if (apiRows.length === 0) {
    throw new Error('Could not capture getpraticetestinfo — sign in and retry')
  }

  let section = ''
  const discovered: DiscoveredRow[] = []

  apiRows.forEach((row) => {
    if (row.section_heading) section = row.section_heading
    if (!row.quiz_id || !row.quiz_name) return

    const quizId = String(row.quiz_id)
    const questionCount = Number(row.questions_count ?? 0)
    const title = row.quiz_name
    const examUrl = `https://business.whizlabs.com/learn/course/${COURSE_SLUG}/${COURSE_ID}/quiz/${quizId}/exam/start`
    const kindFromSection = section.toLowerCase().includes('section')
      ? 'section'
      : section.toLowerCase().includes('final')
        ? 'final'
        : section.toLowerCase().includes('practice')
          ? 'pt'
          : inferKind(title)

    discovered.push({
      index: discovered.length + 1,
      title,
      questionCount,
      quizId,
      examUrl,
      kind: kindFromSection,
      setId: null,
    })
  })

  return discovered
}

const main = async (): Promise<void> => {
  const args = parseArgs()
  const { context, close } = await launchBrowser(args.headless, args.cdpEndpoint)
  const page = await context.newPage()

  await ensureAuth(page, COURSE_URL, args.headless)
  const discovered = await capturePracticeTests(page)

  const matched = matchSetId(discovered)
  const payload = {
    courseUrl: COURSE_URL,
    discoveredAt: new Date().toISOString(),
    total: matched.length,
    mapped: matched.filter((r) => r.setId).length,
    tests: matched,
  }

  mkdirSync(resolve('scripts'), { recursive: true })
  writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`)
  console.log(`Wrote ${matched.length} tests (${payload.mapped} mapped to setId) → ${OUT}`)
  matched.filter((r) => r.setId).forEach((r) => {
    console.log(`  ${r.setId} ← ${r.title.slice(0, 50)} (${r.questionCount}q)`)
  })

  await close()
}

if (import.meta.main) {
  main().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
}
