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

const matchSetId = (rows: DiscoveredRow[]): DiscoveredRow[] => {
  const ptCatalog = CORE_PRACTICE_SETS.filter((s) => s.kind === 'pt')
  const sectionCatalog = CORE_PRACTICE_SETS.filter((s) => s.kind === 'section')

  const ptRows = rows.filter((r) => r.kind === 'pt')
  const sectionRows = rows.filter((r) => r.kind === 'section')

  const ptByCount = new Map(ptCatalog.map((s) => [s.total, s.setId]))
  const sectionByCount = new Map(sectionCatalog.map((s) => [s.total, s.setId]))

  return rows.map((row) => {
    if (row.kind === 'pt') {
      const idx = ptRows.indexOf(row)
      const byOrder = ptCatalog[idx]?.setId ?? null
      const byCount = ptByCount.get(row.questionCount) ?? null
      return { ...row, setId: byOrder ?? byCount }
    }
    if (row.kind === 'section') {
      const idx = sectionRows.indexOf(row)
      const byOrder = sectionCatalog[idx]?.setId ?? null
      const byCount = sectionByCount.get(row.questionCount) ?? null
      return { ...row, setId: byOrder ?? byCount }
    }
    return row
  })
}

const main = async (): Promise<void> => {
  const args = parseArgs()
  const { context, close } = await launchBrowser(args.headless, args.cdpEndpoint)
  const page = await context.newPage()

  await ensureAuth(page, COURSE_URL, args.headless)

  await page.goto(COURSE_URL, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.waitForTimeout(4_000)

  const practiceTab = page.locator('button:has-text("Practice Test"), [role="tab"]:has-text("Practice Test")').first()
  if (await practiceTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await practiceTab.click()
    await page.waitForTimeout(2_000)
  }

  const rows = await page.evaluate((): Array<{ title: string; questionCount: number; href: string | null }> => {
    const result: Array<{ title: string; questionCount: number; href: string | null }> = []
    const trs = Array.from(document.querySelectorAll('table tbody tr, [class*="quiz"] tr, [class*="practice"] tr'))
    trs.forEach((tr) => {
      const text = (tr.textContent ?? '').replace(/\s+/g, ' ').trim()
      if (!text) return
      const qMatch = text.match(/(\d+)\s*Questions?/i)
      const questionCount = qMatch ? Number(qMatch[1]) : 0
      const link = tr.querySelector('a[href*="/quiz/"], button[data-href*="/quiz/"]') as HTMLAnchorElement | null
      const href = link?.getAttribute('href') ?? link?.getAttribute('data-href') ?? null
      const titleCell = tr.querySelector('td:first-child, [class*="title"]')?.textContent?.trim() ?? text.slice(0, 80)
      if (questionCount > 0) {
        result.push({ title: titleCell, questionCount, href })
      }
    })

    if (result.length === 0) {
      document.querySelectorAll('a[href*="/quiz/"]').forEach((a) => {
        const href = a.getAttribute('href')
        const block = a.closest('tr, li, [class*="card"], [class*="row"]')
        const text = (block?.textContent ?? a.textContent ?? '').replace(/\s+/g, ' ').trim()
        const qMatch = text.match(/(\d+)\s*Questions?/i)
        const questionCount = qMatch ? Number(qMatch[1]) : 0
        if (href && questionCount > 0) {
          result.push({ title: text.slice(0, 100), questionCount, href })
        }
      })
    }

    return result
  })

  const discovered: DiscoveredRow[] = rows.map((row, index) => {
    const quizMatch = row.href?.match(/\/quiz\/(\d+)/)
    const quizId = quizMatch?.[1] ?? null
    const examUrl = quizId
      ? `https://business.whizlabs.com/learn/course/${COURSE_SLUG}/${COURSE_ID}/quiz/${quizId}/exam/start`
      : null
    const kind = inferKind(row.title)
    return {
      index: index + 1,
      title: row.title,
      questionCount: row.questionCount,
      quizId,
      examUrl,
      kind,
      setId: null,
    }
  })

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
