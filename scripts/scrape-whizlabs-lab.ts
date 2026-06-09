/**
 * Whizlabs lab scraper — Lab Steps tab + images → D1 SQL
 *
 * Single lab:
 *   bun run scrape:lab -- --url "https://business.whizlabs.com/labs/introduction-to-aws-identity-access-management-iam"
 *
 * List all labs from course page (saves manifest):
 *   bun run scrape:lab -- --course "https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/pt" --list-only
 *
 * Batch scrape from manifest:
 *   bun run scrape:lab -- --batch [--offset 0] [--limit 5] [--skip-existing]
 *
 * First run: omit --headless, log in when prompted. Auth → scripts/.playwright-storage-state.json
 */

import { chromium, type BrowserContext, type Page, type Locator } from 'playwright'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { labToInsertSql, slugFromWhizlabsUrl, type Lab, type LabTask } from '../lib/labs'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CourseLabEntry = {
  index: number
  title: string
  slug: string
  url: string
  category: string
  duration: string
}

type CourseIndex = {
  courseUrl: string
  discoveredAt: string
  total: number
  labs: CourseLabEntry[]
}

interface CliArgs {
  url?: string
  course?: string
  slug?: string
  headless: boolean
  seed: boolean
  listOnly: boolean
  batch: boolean
  offset: number
  limit?: number
  skipExisting: boolean
}

const COURSE_INDEX_PATH = resolve('scripts/labs/course-index.json')
const STORAGE_STATE = resolve('scripts/.playwright-storage-state.json')
const LABS_DIR = resolve('scripts/labs')

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const parseArgs = (): CliArgs => {
  const args = process.argv.slice(2)
  const get = (flag: string): string | undefined => {
    const i = args.indexOf(flag)
    return i !== -1 ? args[i + 1] : undefined
  }
  const url = get('--url')
  const course = get('--course')
  const batch = args.includes('--batch')

  if (!url && !course && !batch) {
    console.error(`Usage:
  --url <lab-url>              Scrape one lab
  --course <course-url>        Discover labs (+ --list-only to skip scrape)
  --batch                      Scrape from ${COURSE_INDEX_PATH}
  [--offset N] [--limit N] [--skip-existing] [--headless] [--no-seed] [--slug <id>]`)
    process.exit(1)
  }

  return {
    url,
    course,
    slug: get('--slug'),
    headless: args.includes('--headless'),
    seed: !args.includes('--no-seed'),
    listOnly: args.includes('--list-only'),
    batch,
    offset: parseInt(get('--offset') ?? '0', 10),
    limit: get('--limit') ? parseInt(get('--limit')!, 10) : undefined,
    skipExisting: args.includes('--skip-existing'),
  }
}

const waitForLogin = async (): Promise<void> => {
  console.log('\n⚠  Not logged in — log in the browser window, then press Enter here.')
  await new Promise<void>((res) => { process.stdin.once('data', () => res()) })
}

const isOnLoginPage = (url: string): boolean =>
  url.includes('/login') || url.includes('/signin') || url === 'https://business.whizlabs.com/'

const ensureAuth = async (page: Page, targetUrl: string, headless: boolean): Promise<void> => {
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  if (!isOnLoginPage(page.url())) return
  if (headless) {
    console.error('✗ Not logged in. Run without --headless first to log in.')
    process.exit(1)
  }
  await waitForLogin()
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 })
}

// ---------------------------------------------------------------------------
// Course discovery
// ---------------------------------------------------------------------------

const scrollPage = async (page: Page): Promise<void> => {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let total = 0
      const step = 600
      const timer = setInterval(() => {
        window.scrollBy(0, step)
        total += step
        if (total >= document.body.scrollHeight) {
          clearInterval(timer)
          window.scrollTo(0, 0)
          resolve()
        }
      }, 120)
    })
  })
  await page.waitForTimeout(800)
}

const expandCourseSections = async (page: Page): Promise<void> => {
  const toggles = page.locator(
    '[class*="accordion"] button, [class*="collapse"] button, [aria-expanded="false"], button[class*="expand"], [class*="chapter"] button',
  )
  const count = await toggles.count().catch(() => 0)
  const max = Math.min(count, 40)
  await Array.from({ length: max }, (_, i) => i).reduce(
    (chain, i) => chain.then(async () => {
      const btn = toggles.nth(i)
      if (await btn.isVisible({ timeout: 300 }).catch(() => false)) {
        await btn.click({ timeout: 1000 }).catch(() => undefined)
        await page.waitForTimeout(200)
      }
    }),
    Promise.resolve(),
  )
}

const discoverCourseLabs = async (page: Page, courseUrl: string): Promise<CourseLabEntry[]> => {
  console.log(`\nDiscovering labs on course page…`)
  await page.goto(courseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  await page.waitForSelector('a, button', { timeout: 25_000 }).catch(() => undefined)
  await page.waitForTimeout(2000)

  await expandCourseSections(page)
  await scrollPage(page)
  await expandCourseSections(page)
  await scrollPage(page)

  const raw = await page.evaluate(() => {
    type RawEntry = { title: string; href: string; category: string; duration: string }
    const entries: RawEntry[] = []
    const seen = new Set<string>()

    const categoryFromEl = (el: Element | null): string => {
      let node: Element | null = el
      while (node) {
        const heading = node.querySelector?.('h2, h3, h4, [class*="chapter-title"], [class*="section-title"]')
        if (heading) {
          const t = (heading as HTMLElement).innerText?.trim()
          if (t && t.length > 3 && t.length < 120) return t
        }
        const cls = (node as HTMLElement).className?.toString() ?? ''
        if (/chapter|section|domain|module/i.test(cls)) {
          const t = (node as HTMLElement).innerText?.split('\n')[0]?.trim()
          if (t && t.length > 3 && t.length < 120) return t
        }
        node = node.parentElement
      }
      return 'Uncategorized'
    }

    document.querySelectorAll('a[href*="/labs/"]').forEach((a) => {
      const href = (a as HTMLAnchorElement).href
      if (!href || seen.has(href)) return
      if (href.includes('/labs/library')) return
      seen.add(href)

      const row = a.closest('li, tr, [class*="lab"], [class*="row"], div') ?? a.parentElement
      const rowText = (row as HTMLElement | null)?.innerText ?? a.innerText
      const lines = rowText.split('\n').map((l) => l.trim()).filter(Boolean)
      const title = lines.find((l) => l.length > 8 && !/^\d+[hm\s]/i.test(l) && l !== 'Start') ?? a.innerText.trim()
      const duration = lines.find((l) => /\d+\s*m|\d+:\d+:\d+|hours?/i.test(l)) ?? ''

      entries.push({
        title: title || href.split('/').pop() ?? 'Lab',
        href,
        category: categoryFromEl(row ?? a),
        duration,
      })
    })

    return entries
  })

  return raw.map((entry, i) => ({
    index: i + 1,
    title: entry.title,
    slug: slugFromWhizlabsUrl(entry.href),
    url: entry.href.split('?')[0],
    category: entry.category,
    duration: entry.duration,
  }))
}

const loadCourseIndex = (): CourseIndex => {
  if (!existsSync(COURSE_INDEX_PATH)) {
    console.error(`✗ Missing ${COURSE_INDEX_PATH} — run with --course … --list-only first`)
    process.exit(1)
  }
  return JSON.parse(readFileSync(COURSE_INDEX_PATH, 'utf8')) as CourseIndex
}

const saveCourseIndex = (courseUrl: string, labs: CourseLabEntry[]): void => {
  mkdirSync(LABS_DIR, { recursive: true })
  const index: CourseIndex = {
    courseUrl,
    discoveredAt: new Date().toISOString(),
    total: labs.length,
    labs,
  }
  writeFileSync(COURSE_INDEX_PATH, JSON.stringify(index, null, 2))
  console.log(`\n✓ Course index → ${COURSE_INDEX_PATH} (${labs.length} labs)`)
}

// ---------------------------------------------------------------------------
// Extraction
// ---------------------------------------------------------------------------

const tryText = async (locator: Locator): Promise<string> => {
  const t = await locator.innerText().catch(() => '')
  return t.trim()
}

const clickLabStepsTab = async (page: Page): Promise<void> => {
  const tabSelectors = [
    'button:has-text("Lab Steps")',
    '[role="tab"]:has-text("Lab Steps")',
    'a:has-text("Lab Steps")',
    'li:has-text("Lab Steps")',
    '.nav-tabs >> text=Lab Steps',
  ]

  const found = await tabSelectors.reduce<Promise<boolean>>(async (prev, sel) => {
    if (await prev) return true
    const tab = page.locator(sel).first()
    if (await tab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await tab.click()
      await page.waitForTimeout(1200)
      return true
    }
    return false
  }, Promise.resolve(false))

  if (!found) throw new Error('Could not find "Lab Steps" tab')
}

const findStepsPanel = async (page: Page): Promise<Locator> => {
  const panelSelectors = [
    '[role="tabpanel"]',
    '.tab-pane.active',
    '[class*="tab-content"] [class*="active"]',
    '#lab-steps',
    '[class*="lab-steps"]',
    '[class*="LabSteps"]',
  ]

  const matched = await panelSelectors.reduce<Promise<Locator | null>>(async (prev, sel) => {
    const existing = await prev
    if (existing) return existing
    const panel = page.locator(sel).first()
    if (await panel.isVisible({ timeout: 1500 }).catch(() => false)) {
      const text = await tryText(panel)
      if (text.length > 40) return panel
    }
    return null
  }, Promise.resolve(null))

  return matched ?? page.locator('main, [class*="lab-detail"], body').first()
}

type RawBlock = { heading: string; html: string; text: string }

const extractBlocks = async (panel: Locator): Promise<RawBlock[]> =>
  panel.evaluate((root) => {
    const blocks: RawBlock[] = []
    const headings = root.querySelectorAll('h2, h3, h4, .step-title, [class*="step-title"], [class*="task-title"]')

    if (headings.length === 0) {
      const text = (root as HTMLElement).innerText?.trim() ?? ''
      if (text) blocks.push({ heading: 'Lab Steps', html: root.innerHTML, text })
      return blocks
    }

    headings.forEach((h, i) => {
      const heading = (h as HTMLElement).innerText?.trim() || `Step ${i + 1}`
      const parts: string[] = []
      const htmlParts: string[] = []
      let el: Element | null = h.nextElementSibling

      while (el) {
        const tag = el.tagName.toLowerCase()
        if (['h2', 'h3', 'h4'].includes(tag)) break
        const t = (el as HTMLElement).innerText?.trim()
        if (t) parts.push(t)
        htmlParts.push(el.outerHTML)
        el = el.nextElementSibling
      }

      if (parts.length === 0) {
        const t = (h as HTMLElement).innerText?.trim()
        if (t) parts.push(t)
      }

      blocks.push({
        heading,
        html: htmlParts.join('\n') || h.outerHTML,
        text: parts.join('\n\n'),
      })
    })

    return blocks
  })

const extractImagesFromHtml = (html: string): string[] => {
  const urls: string[] = []
  const re = /<img[^>]+src=["']([^"']+)["']/gi
  let m = re.exec(html)
  while (m) {
    urls.push(m[1])
    m = re.exec(html)
  }
  return [...new Set(urls)]
}

const absolutizeUrl = (src: string, base: string): string => {
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  if (src.startsWith('//')) return `https:${src}`
  try {
    return new URL(src, base).href
  } catch {
    return src
  }
}

const downloadImage = async (page: Page, url: string, destPath: string): Promise<boolean> => {
  try {
    const res = await page.request.get(url)
    if (!res.ok()) return false
    writeFileSync(destPath, await res.body())
    return true
  } catch {
    return false
  }
}

const scrapeMetadata = async (page: Page): Promise<{
  title: string
  level: Lab['level']
  duration: string
  services: string[]
}> => {
  const title = await tryText(page.locator('h1').first()) || 'Whizlabs Lab'
  const bodyText = await tryText(page.locator('body'))
  const levelMatch = bodyText.match(/\b(Fundamental|Intermediate|Advanced)\b/i)
  const level = (levelMatch?.[1] ?? 'Fundamental') as Lab['level']
  const durationMatch = bodyText.match(/Lab Duration:\s*([0-9:]+)/i)
    ?? bodyText.match(/Duration[^0-9]*([0-9]{2}:[0-9]{2}:[0-9]{2})/i)
  const duration = durationMatch?.[1] ?? '00:30:00'
  const tagTexts = await page.locator('[class*="tag"], [class*="chip"], [class*="badge"]').allInnerTexts().catch(() => [] as string[])
  const services = tagTexts.map((t) => t.trim()).filter((t) => t.length > 1 && t.length < 40).slice(0, 8)
  return { title, level, duration, services: services.length ? services : ['AWS'] }
}

const scrapeLab = async (page: Page, url: string, slug: string, imageDir: string): Promise<Lab> => {
  console.log(`\n[${slug}] ${url}`)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  await page.waitForSelector('h1, [class*="lab"]', { timeout: 20_000 }).catch(() => undefined)
  await page.waitForTimeout(1500)

  const meta = await scrapeMetadata(page)
  console.log(`  ${meta.title}`)

  await clickLabStepsTab(page)
  const panel = await findStepsPanel(page)
  const blocks = await extractBlocks(panel)

  if (blocks.length === 0) {
    const debugPath = join(imageDir, 'debug-steps.html')
    const debugHtml = await panel.innerHTML().catch(async () => page.content())
    writeFileSync(debugPath, debugHtml)
    throw new Error(`No steps — debug: ${debugPath}`)
  }

  let imgCounter = 0
  const tasks: LabTask[] = []

  for (const block of blocks) {
    const imageUrls = extractImagesFromHtml(block.html).map((src) => absolutizeUrl(src, url))
    const localImages: string[] = []

    await imageUrls.reduce(async (prev, imgUrl) => {
      await prev
      imgCounter += 1
      const ext = imgUrl.match(/\.(png|jpe?g|gif|webp)(\?|$)/i)?.[1]?.toLowerCase() ?? 'png'
      const filename = `step-${String(imgCounter).padStart(2, '0')}.${ext}`
      const dest = join(imageDir, filename)
      if (await downloadImage(page, imgUrl, dest)) {
        localImages.push(`/labs/${slug}/${filename}`)
      }
    }, Promise.resolve())

    const lines = block.text
      .split(/\n+/)
      .map((l) => l.replace(/^\d+[\).\s]+/, '').trim())
      .filter(Boolean)

    if (lines.length === 0 && localImages.length === 0) continue

    const steps = lines.length
      ? lines.map((text, i) => ({
          text,
          images: i === lines.length - 1 && localImages.length ? localImages : undefined,
        }))
      : [{ text: block.heading, images: localImages.length ? localImages : undefined }]

    tasks.push({ title: block.heading, steps })
  }

  return {
    slug,
    title: meta.title,
    level: meta.level,
    services: meta.services,
    summary: '',
    duration: meta.duration,
    tasks,
    takeaways: [],
    source: 'whizlabs',
    sourceUrl: url,
  }
}

const persistLab = (lab: Lab, url: string, seed: boolean): void => {
  const imageDir = resolve(`public/labs/${lab.slug}`)
  const jsonPath = join(LABS_DIR, `${lab.slug}.json`)
  const sqlPath = join(LABS_DIR, `${lab.slug}.sql`)
  mkdirSync(imageDir, { recursive: true })
  mkdirSync(LABS_DIR, { recursive: true })

  writeFileSync(jsonPath, JSON.stringify(lab, null, 2))
  const scrapedAt = new Date().toISOString().slice(0, 10)
  const sql = labToInsertSql(lab, { sourceUrl: url, scrapedAt })
  writeFileSync(sqlPath, `${sql}\n`)
  console.log(`  ✓ ${lab.tasks.length} tasks → ${jsonPath}`)

  if (seed) {
    console.log(`  seed: bunx wrangler d1 execute aws-saa-questions --remote --file=${sqlPath}`)
  }
}

const launchBrowser = async (headless: boolean): Promise<{ context: BrowserContext; close: () => Promise<void> }> => {
  const storageState = existsSync(STORAGE_STATE) ? STORAGE_STATE : undefined
  const browser = await chromium.launch({ headless })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    ...(storageState ? { storageState } : {}),
  })
  return {
    context,
    close: async () => { await browser.close() },
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const main = async (): Promise<void> => {
  const args = parseArgs()
  mkdirSync(LABS_DIR, { recursive: true })

  const { context, close } = await launchBrowser(args.headless)
  const page = await context.newPage()

  const defaultCourse = 'https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/pt'

  if (args.course) {
    await ensureAuth(page, args.course, args.headless)
    await context.storageState({ path: STORAGE_STATE })
    const labs = await discoverCourseLabs(page, args.course)
    saveCourseIndex(args.course, labs)

    labs.slice(0, 15).forEach((l) => console.log(`  ${l.index}. [${l.category}] ${l.title}`))
    if (labs.length > 15) console.log(`  … and ${labs.length - 15} more`)

    if (args.listOnly) {
      await close()
      return
    }
  }

  const entries: CourseLabEntry[] = args.batch || args.course
    ? loadCourseIndex().labs
    : []

  if (args.url) {
    const slug = args.slug ?? slugFromWhizlabsUrl(args.url)
    await ensureAuth(page, args.url, args.headless)
    await context.storageState({ path: STORAGE_STATE })
    const lab = await scrapeLab(page, args.url, slug, resolve(`public/labs/${slug}`))
    persistLab(lab, args.url, args.seed)
    await close()
    return
  }

  const slice = entries.slice(args.offset, args.limit ? args.offset + args.limit : undefined)
  console.log(`\nBatch: ${slice.length} labs (offset ${args.offset})`)

  if (slice.length === 0) {
    await close()
    return
  }

  await ensureAuth(page, slice[0].url, args.headless)
  await context.storageState({ path: STORAGE_STATE })

  const sqlRows: string[] = []
  const failures: string[] = []

  await slice.reduce(async (prev, entry) => {
    await prev
    const jsonPath = join(LABS_DIR, `${entry.slug}.json`)
    if (args.skipExisting && existsSync(jsonPath)) {
      console.log(`\n[skip] ${entry.slug}`)
      return
    }

    try {
      const lab = await scrapeLab(page, entry.url, entry.slug, resolve(`public/labs/${entry.slug}`))
      persistLab(lab, entry.url, false)
      const scrapedAt = new Date().toISOString().slice(0, 10)
      sqlRows.push(labToInsertSql(lab, { sourceUrl: entry.url, scrapedAt }))
      await page.waitForTimeout(1500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ ${entry.slug}: ${msg}`)
      failures.push(entry.slug)
    }
  }, Promise.resolve())

  if (sqlRows.length) {
    const batchPath = join(LABS_DIR, 'batch-seed.sql')
    writeFileSync(batchPath, `${sqlRows.join('\n')}\n`)
    console.log(`\n✓ Batch SQL → ${batchPath} (${sqlRows.length} rows)`)
    console.log(`  bunx wrangler d1 execute aws-saa-questions --remote --file=${batchPath}`)
  }

  if (failures.length) console.warn(`\n⚠ Failed: ${failures.join(', ')}`)

  await close()
}

main().catch((err: unknown) => { console.error(err); process.exit(1) })
