/**
 * Batch scrape Whizlabs labs from STUDY-CHECKLIST.md (22 video-course labs).
 * Downloads step screenshots into public/labs/<slug>/ and embeds paths in JSON.
 *
 * Status (import + image coverage):
 *   bun run scrape:lab:checklist -- --status
 *
 * Default — scrape incomplete labs (no JSON or JSON without step images):
 *   bun run scrape:lab:checklist:import
 *   bun run scrape:lab:checklist -- --compile --cdp-endpoint chrome
 *
 * Only labs without JSON:
 *   bun run scrape:lab:checklist -- --missing-only --cdp-endpoint chrome
 *
 * Only labs with JSON but no step images:
 *   bun run scrape:lab:checklist -- --missing-images --cdp-endpoint chrome
 *
 * Re-scrape every checklist lab (steps + images):
 *   bun run scrape:lab:checklist -- --all --cdp-endpoint chrome
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { labsChecklistOrder } from '../data/labsChecklistOrder'
import { labToInsertSql, type Lab } from '../lib/labs'
import { sanitizeLab } from '../lib/sanitize-lab'
import {
  ensureAuth,
  labJsonHasImages,
  launchBrowser,
  persistLab,
  scrapeLab,
} from './scrape-course-lab'

const LABS_DIR = resolve('scripts/labs')
const CHECKLIST_INDEX = join(LABS_DIR, 'checklist-index.json')

type ChecklistScrapeEntry = {
  index: number
  title: string
  slug: string
  url: string
  sectionId: string
  duration: string
}

type ScrapeMode = 'incomplete' | 'missing-only' | 'missing-images' | 'all'

type CliArgs = {
  status: boolean
  listOnly: boolean
  mode: ScrapeMode
  compile: boolean
  headless: boolean
  seed: boolean
  offset: number
  limit?: number
  cdpEndpoint?: string
}

const resolveCdpEndpoint = (raw?: string): string | undefined => {
  const value = raw ?? process.env.PLAYWRIGHT_CDP_ENDPOINT
  if (!value) return undefined
  if (value === 'chrome') return 'http://127.0.0.1:9222'
  return value
}

const parseArgs = (): CliArgs => {
  const args = process.argv.slice(2)
  const get = (flag: string): string | undefined => {
    const index = args.indexOf(flag)
    return index !== -1 ? args[index + 1] : undefined
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Study checklist lab scraper (STUDY-CHECKLIST.md → scripts/labs/*.json + public/labs/<slug>/)

Usage:
  bun run scrape:lab:checklist -- [options]

Options:
  --status              Show import + image status for all ${labsChecklistOrder.length} checklist labs
  --list-only           Print labs that would be scraped (no browser)
  (default)             Scrape incomplete labs: missing JSON or JSON without step images
  --missing-only        Only labs without scripts/labs/<slug>.json
  --missing-images      Only labs whose JSON has no step images
  --all                 Re-scrape every checklist lab (steps + images)
  --offset N            Start at filtered list index N (default 0)
  --limit N             Scrape at most N labs
  --compile             Run labs:compile after a successful scrape batch
  --headless            Headless browser (needs saved auth)
  --no-seed             Do not print wrangler seed hints
  --cdp-endpoint chrome Use Chrome remote debugging (chrome://inspect)
`)
    process.exit(0)
  }

  const mode: ScrapeMode = args.includes('--all')
    ? 'all'
    : args.includes('--missing-only')
      ? 'missing-only'
      : args.includes('--missing-images')
        ? 'missing-images'
        : 'incomplete'

  return {
    status: args.includes('--status'),
    listOnly: args.includes('--list-only'),
    mode,
    compile: args.includes('--compile'),
    headless: args.includes('--headless'),
    seed: !args.includes('--no-seed'),
    offset: parseInt(get('--offset') ?? '0', 10),
    limit: get('--limit') ? parseInt(get('--limit')!, 10) : undefined,
    cdpEndpoint: resolveCdpEndpoint(get('--cdp-endpoint')),
  }
}

const checklistEntries = (): ChecklistScrapeEntry[] =>
  labsChecklistOrder.flatMap((entry) => {
    if (!entry.slug || !entry.externalUrl) return []
    return [{
      index: entry.index,
      title: entry.title,
      slug: entry.slug,
      url: entry.externalUrl,
      sectionId: entry.sectionId,
      duration: entry.duration,
    }]
  })

const jsonPathFor = (slug: string) => join(LABS_DIR, `${slug}.json`)

const countStepImages = (slug: string): number => {
  const jsonPath = jsonPathFor(slug)
  if (!existsSync(jsonPath)) return 0
  const lab = JSON.parse(readFileSync(jsonPath, 'utf8')) as Lab
  return lab.tasks?.reduce(
    (sum, task) => sum + (task.steps?.reduce(
      (inner, step) => inner + (step.images?.length ?? 0),
      0,
    ) ?? 0),
    0,
  ) ?? 0
}

const entryStatus = (entry: ChecklistScrapeEntry): 'missing' | 'no-images' | 'ready' => {
  const jsonPath = jsonPathFor(entry.slug)
  if (!existsSync(jsonPath)) return 'missing'
  if (!labJsonHasImages(entry.slug)) return 'no-images'
  return 'ready'
}

const shouldScrape = (entry: ChecklistScrapeEntry, mode: ScrapeMode): boolean => {
  const status = entryStatus(entry)
  const modeMatchers: Record<ScrapeMode, boolean> = {
    all: true,
    'missing-only': status === 'missing',
    'missing-images': status === 'no-images',
    incomplete: status !== 'ready',
  }
  return modeMatchers[mode]
}

const printStatus = (entries: ChecklistScrapeEntry[]): void => {
  const counts = { missing: 0, 'no-images': 0, ready: 0 }
  entries.forEach((entry) => {
    const status = entryStatus(entry)
    counts[status] += 1
    const label = status === 'ready' ? '✓' : status === 'no-images' ? '△' : '✗'
    const images = countStepImages(entry.slug)
    const imageNote = status === 'ready' ? `${images} img` : status === 'no-images' ? '0 img' : '—'
    console.log(`${label} ${String(entry.index).padStart(2, ' ')}  [${entry.sectionId}] ${entry.title} (${imageNote})`)
    console.log(`     ${entry.slug}`)
  })
  const incomplete = counts.missing + counts['no-images']
  console.log(`\n${entries.length} checklist labs — ready: ${counts.ready}, no images: ${counts['no-images']}, missing: ${counts.missing}`)
  console.log(`Incomplete (default scrape target): ${incomplete}`)
}

const saveChecklistIndex = (entries: ChecklistScrapeEntry[]): void => {
  writeFileSync(
    CHECKLIST_INDEX,
    `${JSON.stringify({
      source: 'STUDY-CHECKLIST.md',
      generatedAt: new Date().toISOString(),
      total: entries.length,
      labs: entries.map(({ index, title, slug, url, sectionId, duration }) => ({
        index,
        title,
        slug,
        url,
        sectionId,
        duration,
      })),
    }, null, 2)}\n`,
  )
}

const runCompile = async (): Promise<void> => {
  console.log('\n→ bun run labs:compile')
  const proc = Bun.spawn(['bun', 'run', 'labs:compile'], {
    cwd: resolve('.'),
    stdout: 'inherit',
    stderr: 'inherit',
  })
  const code = await proc.exited
  if (code !== 0) {
    throw new Error(`labs:compile exited with code ${code}`)
  }
}

const main = async (): Promise<void> => {
  const args = parseArgs()
  mkdirSync(LABS_DIR, { recursive: true })

  const entries = checklistEntries()
  saveChecklistIndex(entries)

  if (args.status) {
    printStatus(entries)
    return
  }

  const targets = entries
    .filter((entry) => shouldScrape(entry, args.mode))
    .slice(args.offset, args.limit ? args.offset + args.limit : undefined)

  if (args.listOnly) {
    console.log(`Would scrape ${targets.length} checklist lab(s) [${args.mode}, steps + images]:\n`)
    targets.forEach((entry) => {
      const status = entryStatus(entry)
      console.log(`  ${entry.index}. [${entry.sectionId}] ${entry.title} (${status})`)
      console.log(`     ${entry.url}`)
    })
    return
  }

  if (targets.length === 0) {
    console.log('No checklist labs matched — nothing to scrape.')
    printStatus(entries)
    return
  }

  console.log(`Checklist scrape (${args.mode}, with images): ${targets.length} lab(s) (offset ${args.offset})`)

  const { context, close } = await launchBrowser(args.headless, args.cdpEndpoint)
  const page = await context.newPage()

  await ensureAuth(page, targets[0].url, args.headless)

  const sqlRows: string[] = []
  const failures: string[] = []
  let scraped = 0

  await targets.reduce(async (prev, entry) => {
    await prev
    try {
      const lab = await scrapeLab(
        page,
        entry.url,
        entry.slug,
        resolve(`public/labs/${entry.slug}`),
      )
      persistLab(lab, args.seed)
      const scrapedAt = new Date().toISOString().slice(0, 10)
      sqlRows.push(labToInsertSql(sanitizeLab(lab), { scrapedAt }))
      scraped += 1
      await page.waitForTimeout(1500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ ${entry.slug}: ${msg}`)
      failures.push(entry.slug)
    }
  }, Promise.resolve())

  if (sqlRows.length > 0) {
    const batchPath = join(LABS_DIR, 'checklist-batch-seed.sql')
    writeFileSync(batchPath, `${sqlRows.join('\n')}\n`)
    console.log(`\n✓ Batch SQL → ${batchPath} (${sqlRows.length} rows)`)
    console.log(`  bunx wrangler d1 execute aws-saa-questions --remote --file=${batchPath}`)
  }

  await close()

  console.log(`\nDone — scraped ${scraped}, failed ${failures.length}`)
  if (failures.length > 0) console.warn(`Failed: ${failures.join(', ')}`)

  if (args.compile && scraped > 0) {
    await runCompile()
  }
}

if (import.meta.main) {
  main().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
}
