/**
 * Scrape Core practice test question images (no vendor branding in filenames).
 * Crops to the question panel; saves to public/questions/{setId}/.
 *
 *   bun run practice:discover -- --cdp-endpoint chrome
 *   bun run practice:images -- --cdp-endpoint chrome
 *   bun run practice:images -- --set wz4 --cdp-endpoint chrome
 *   bun run practice:images -- --missing-only --limit 2 --cdp-endpoint chrome
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import type { Page } from 'playwright'
import {
  CORE_PRACTICE_SETS,
  COURSE_ID,
  COURSE_SLUG,
  screenshotPublicPath,
  type PracticeTestSet,
} from './lib/practice-test-catalog'
import {
  clickFirstVisible,
  downloadInlineDiagrams,
  NEXT_BTN,
  questionPanelLocator,
  RESUME_BTN,
  START_BTN,
  waitForQuestion,
} from './lib/quiz-page'
import { launchBrowser, ensureAuth } from './scrape-course-lab'

const INDEX_PATH = resolve('scripts/practice-tests-index.json')

type IndexFile = {
  tests: Array<{
    setId: string | null
    examUrl: string | null
    questionCount: number
    title: string
  }>
}

type CliArgs = {
  setId?: string
  missingOnly: boolean
  limit?: number
  headless: boolean
  cdpEndpoint?: string
}

const parseArgs = (): CliArgs => {
  const args = process.argv.slice(2)
  const get = (flag: string) => {
    const i = args.indexOf(flag)
    return i !== -1 ? args[i + 1] : undefined
  }
  const raw = get('--cdp-endpoint') ?? process.env.PLAYWRIGHT_CDP_ENDPOINT
  const cdpEndpoint = raw === 'chrome' ? 'http://127.0.0.1:9222' : raw
  return {
    setId: get('--set'),
    missingOnly: args.includes('--missing-only'),
    limit: get('--limit') ? Number(get('--limit')) : undefined,
    headless: args.includes('--headless'),
    cdpEndpoint,
  }
}

const imagePath = (setId: string, index: number): string =>
  join(resolve(`public/questions/${setId}`), `${setId}-${String(index).padStart(3, '0')}.png`)

const hasImage = (setId: string, index: number): boolean =>
  existsSync(imagePath(setId, index))

const resolveExamUrl = (set: PracticeTestSet): string | null => {
  if (!existsSync(INDEX_PATH)) return null
  const index = JSON.parse(readFileSync(INDEX_PATH, 'utf8')) as IndexFile
  const row = index.tests.find((t) => t.setId === set.setId)
  return row?.examUrl ?? null
}

const enterExam = async (page: Page): Promise<void> => {
  if (await clickFirstVisible(page, RESUME_BTN)) return
  await clickFirstVisible(page, START_BTN)
}

const captureQuestionImage = async (
  page: Page,
  setId: string,
  index: number,
  outputDir: string,
): Promise<void> => {
  await waitForQuestion(page)
  const fileName = `${setId}-${String(index).padStart(3, '0')}.png`
  const outPath = join(outputDir, fileName)
  const panel = questionPanelLocator(page)
  const panelVisible = await panel.isVisible({ timeout: 2000 }).catch(() => false)

  if (panelVisible) {
    await panel.screenshot({ path: outPath })
  } else {
    await page.screenshot({ path: outPath, fullPage: false })
  }

  const diagrams = await downloadInlineDiagrams(page, outputDir, `${setId}-${String(index).padStart(3, '0')}`)
  if (diagrams > 0) {
    console.log(`    + ${diagrams} inline diagram(s)`)
  }
}

const scrapeSet = async (
  page: Page,
  set: PracticeTestSet,
  examUrl: string,
  missingOnly: boolean,
): Promise<{ saved: number; skipped: number }> => {
  const outputDir = resolve(`public/questions/${set.setId}`)
  mkdirSync(outputDir, { recursive: true })

  console.log(`\n[${set.setId}] ${set.title} (${set.total} questions)`)
  console.log(`  ${examUrl}`)

  await page.goto(examUrl, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.waitForTimeout(2_000)
  await enterExam(page)
  await waitForQuestion(page)

  const stats = await Array.from({ length: set.total }).reduce(
    async (prev, _, i) => {
      const acc = await prev
      const qNum = i + 1
      if (missingOnly && hasImage(set.setId, qNum)) {
        if (qNum < set.total) await clickFirstVisible(page, NEXT_BTN)
        return { ...acc, skipped: acc.skipped + 1 }
      }

      console.log(`  Q${qNum}/${set.total}`)
      await captureQuestionImage(page, set.setId, qNum, outputDir)
      acc.saved += 1

      if (qNum < set.total) {
        const moved = await clickFirstVisible(page, NEXT_BTN)
        if (!moved) {
          console.warn(`    ⚠ Could not advance past Q${qNum}`)
          return acc
        }
      }
      return acc
    },
    Promise.resolve({ saved: 0, skipped: 0 }),
  )

  return stats
}

const main = async (): Promise<void> => {
  const args = parseArgs()

  let sets = CORE_PRACTICE_SETS
  if (args.setId) {
    sets = sets.filter((s) => s.setId === args.setId)
    if (sets.length === 0) {
      console.error(`Unknown set ${args.setId}. Known: ${CORE_PRACTICE_SETS.map((s) => s.setId).join(', ')}`)
      process.exit(1)
    }
  }

  if (!existsSync(INDEX_PATH)) {
    console.error(`Missing ${INDEX_PATH} — run: bun run practice:discover -- --cdp-endpoint chrome`)
    process.exit(1)
  }

  const index = JSON.parse(readFileSync(INDEX_PATH, 'utf8')) as IndexFile
  const withUrls = sets
    .map((set) => ({ set, examUrl: resolveExamUrl(set) }))
    .filter((entry): entry is { set: PracticeTestSet; examUrl: string } => Boolean(entry.examUrl))

  if (withUrls.length === 0) {
    console.error('No exam URLs mapped. Re-run practice:discover while logged in.')
    process.exit(1)
  }

  const targets = args.limit ? withUrls.slice(0, args.limit) : withUrls
  console.log(`Core practice image scrape — ${targets.length} set(s), missingOnly=${args.missingOnly}`)

  const { context, close } = await launchBrowser(args.headless, args.cdpEndpoint)
  const page = await context.newPage()
  const bootstrapUrl = `https://business.whizlabs.com/learn/course/${COURSE_SLUG}/${COURSE_ID}`
  await ensureAuth(page, bootstrapUrl, args.headless)

  const summary = await targets.reduce(
    async (prev, { set, examUrl }) => {
      const acc = await prev
      try {
        const result = await scrapeSet(page, set, examUrl, args.missingOnly)
        return {
          saved: acc.saved + result.saved,
          skipped: acc.skipped + result.skipped,
          failed: acc.failed,
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`  ✗ ${set.setId}: ${msg}`)
        return { ...acc, failed: acc.failed + 1 }
      }
    },
    Promise.resolve({ saved: 0, skipped: 0, failed: 0 }),
  )

  await close()

  const updates = targets.flatMap(({ set }) =>
    Array.from({ length: set.total }, (_, i) => {
      const n = i + 1
      const path = screenshotPublicPath(set.setId, n)
      return `UPDATE questions SET screenshot_url = '${path}' WHERE id = '${set.setId}-${String(n).padStart(3, '0')}';`
    }),
  )
  const sqlPath = resolve('scripts/practice-images-metadata.sql')
  writeFileSync(sqlPath, `${updates.join('\n')}\n`)
  console.log(`\n✓ Saved ${summary.saved} images, skipped ${summary.skipped}, failed sets ${summary.failed}`)
  console.log(`✓ SQL metadata → ${sqlPath}`)
}

if (import.meta.main) {
  main().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
}
