/**
 * Batch scrape missing / no-image labs from library-index.json (179 SAA Associate).
 *
 *   bun run labs:library:audit
 *   bun run labs:library:scrape -- --missing-only --cdp-endpoint chrome
 *   bun run labs:library:scrape -- --missing-images --limit 5 --compile --cdp-endpoint chrome
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import type { Lab } from '../lib/labs'
import { labToInsertSql } from '../lib/labs'
import { sanitizeLab } from '../lib/sanitize-lab'
import {
  ensureAuth,
  labJsonHasImages,
  labNeedsImageRescrape,
  launchBrowser,
  persistLab,
  scrapeLab,
} from './scrape-course-lab'

const LABS_DIR = resolve('scripts/labs')
const LIBRARY_INDEX = join(LABS_DIR, 'library-index.json')

type ScrapeMode = 'incomplete' | 'missing-only' | 'missing-images' | 'under-scraped' | 'all'

type LibraryEntry = {
  slug: string
  title: string
  url: string
  labType: number
}

type CliArgs = {
  mode: ScrapeMode
  listOnly: boolean
  compile: boolean
  headless: boolean
  seed: boolean
  offset: number
  limit?: number
  guidedOnly: boolean
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
  const get = (flag: string) => {
    const index = args.indexOf(flag)
    return index !== -1 ? args[index + 1] : undefined
  }

  const mode: ScrapeMode = args.includes('--all')
    ? 'all'
    : args.includes('--missing-only')
      ? 'missing-only'
      : args.includes('--under-scraped')
        ? 'under-scraped'
        : args.includes('--missing-images')
          ? 'missing-images'
          : 'incomplete'

  return {
    mode,
    listOnly: args.includes('--list-only'),
    compile: args.includes('--compile'),
    headless: args.includes('--headless'),
    seed: !args.includes('--no-seed'),
    offset: parseInt(get('--offset') ?? '0', 10),
    limit: get('--limit') ? parseInt(get('--limit')!, 10) : undefined,
    guidedOnly: args.includes('--guided-only'),
    cdpEndpoint: resolveCdpEndpoint(get('--cdp-endpoint')),
  }
}

const loadLibrary = (): LibraryEntry[] => {
  if (!existsSync(LIBRARY_INDEX)) {
    throw new Error(`Missing ${LIBRARY_INDEX} — run: bun run labs:library:discover`)
  }
  const index = JSON.parse(readFileSync(LIBRARY_INDEX, 'utf8')) as { labs: LibraryEntry[] }
  return index.labs
}

const jsonPathFor = (slug: string) => join(LABS_DIR, `${slug}.json`)

const entryStatus = (entry: LibraryEntry): 'missing' | 'no-images' | 'under-scraped' | 'ready' => {
  const jsonPath = jsonPathFor(entry.slug)
  if (!existsSync(jsonPath)) return 'missing'
  if (!labJsonHasImages(entry.slug)) return 'no-images'
  if (labNeedsImageRescrape(entry.slug)) return 'under-scraped'
  return 'ready'
}

const isGuidedLibraryLab = (entry: LibraryEntry): boolean =>
  !entry.slug.includes('challenge') && !entry.title.toLowerCase().includes('challenge')

const shouldScrape = (entry: LibraryEntry, mode: ScrapeMode): boolean => {
  const status = entryStatus(entry)
  const matchers: Record<ScrapeMode, boolean> = {
    all: true,
    'missing-only': status === 'missing',
    'missing-images': status === 'no-images',
    'under-scraped': status === 'missing' || status === 'no-images' || status === 'under-scraped',
    incomplete: status !== 'ready',
  }
  return matchers[mode]
}

const runCompile = async (): Promise<void> => {
  const proc = Bun.spawn(['bun', 'run', 'labs:compile'], {
    cwd: resolve('.'),
    stdout: 'inherit',
    stderr: 'inherit',
  })
  const code = await proc.exited
  if (code !== 0) throw new Error(`labs:compile exited with code ${code}`)
}

const main = async (): Promise<void> => {
  const args = parseArgs()
  mkdirSync(LABS_DIR, { recursive: true })

  const entries = loadLibrary().filter((entry) => !args.guidedOnly || isGuidedLibraryLab(entry))
  const targets = entries
    .filter((entry) => shouldScrape(entry, args.mode))
    .slice(args.offset, args.limit ? args.offset + args.limit : undefined)

  if (args.listOnly) {
    console.log(`Would scrape ${targets.length} library lab(s) [${args.mode}, steps + images]:\n`)
    targets.forEach((entry) => {
      console.log(`  ${entry.title} (${entryStatus(entry)})`)
      console.log(`  ${entry.url}`)
    })
    return
  }

  if (targets.length === 0) {
    console.log('No library labs matched.')
    return
  }

  console.log(`Library scrape (${args.mode}, with images): ${targets.length} lab(s)`)

  const { context, close } = await launchBrowser(args.headless, args.cdpEndpoint)
  const page = await context.newPage()
  await ensureAuth(page, targets[0].url, args.headless)

  const sqlRows: string[] = []
  const failures: string[] = []
  let scraped = 0

  await targets.reduce(async (prev, entry) => {
    await prev
    try {
      const lab = await scrapeLab(page, entry.url, entry.slug, resolve(`public/labs/${entry.slug}`))
      persistLab(lab, args.seed)
      sqlRows.push(labToInsertSql(sanitizeLab(lab), { scrapedAt: new Date().toISOString().slice(0, 10) }))
      scraped += 1
      await page.waitForTimeout(1500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ ${entry.slug}: ${msg}`)
      failures.push(entry.slug)
    }
  }, Promise.resolve())

  if (sqlRows.length > 0) {
    const batchPath = join(LABS_DIR, 'library-batch-seed.sql')
    writeFileSync(batchPath, `${sqlRows.join('\n')}\n`)
    console.log(`\n✓ Batch SQL → ${batchPath} (${sqlRows.length} rows)`)
  }

  await close()
  console.log(`\nDone — scraped ${scraped}, failed ${failures.length}`)

  if (args.compile && scraped > 0) await runCompile()
}

if (import.meta.main) {
  main().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
}
