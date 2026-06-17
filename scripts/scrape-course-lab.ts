/**
 * Hands-on lab scraper — Lab Steps tab + images → D1 SQL
 *
 * Single lab:
 *   bun run scrape:lab -- --url "<lab-url>"
 *
 * List all labs from course page (saves manifest):
 *   bun run scrape:lab -- --course "<course-url>" --list-only
 *
 * Batch scrape from manifest:
 *   bun run scrape:lab -- --batch [--offset 0] [--limit 5] [--skip-existing]
 *
 * Re-scrape labs that have steps but no step images yet:
 *   bun run scrape:lab -- --batch --missing-images [--offset 0] [--limit 10]
 *
 * Auth (pick one):
 *   --cdp-endpoint chrome     Use your open Chrome (enable chrome://inspect/#remote-debugging)
 *   --cdp-endpoint http://127.0.0.1:9222
 *   (default)                 Playwright profile + scripts/.playwright-storage-state.json
 */

import { chromium, type BrowserContext, type Page, type Locator } from 'playwright'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { labToInsertSql, slugFromLabUrl, type Lab, type LabTask } from '../lib/labs'
import { sanitizeLab } from '../lib/sanitize-lab'

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
  discoveredAt: string
  total: number
  labs: Array<Omit<CourseLabEntry, 'url'>>
}

const labUrlForEntry = (entry: { slug: string; url?: string }): string => {
  const base = process.env.LAB_BASE_URL?.replace(/\/$/, '')
  if (base) return `${base}/labs/${entry.slug}`
  if (entry.url) return entry.url
  throw new Error(`Missing lab URL for ${entry.slug}. Set LAB_BASE_URL or re-discover with --course.`)
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
  missingImages: boolean
  cdpEndpoint?: string
}

const resolveCdpEndpoint = (raw?: string): string | undefined => {
  const value = raw ?? process.env.PLAYWRIGHT_CDP_ENDPOINT
  if (!value) return undefined
  if (value === 'chrome') return 'http://127.0.0.1:9222'
  return value
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
  [--offset N] [--limit N] [--skip-existing] [--missing-images] [--headless] [--no-seed] [--slug <id>]
  [--cdp-endpoint chrome|http://127.0.0.1:9222]`)
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
    missingImages: args.includes('--missing-images'),
    cdpEndpoint: resolveCdpEndpoint(get('--cdp-endpoint')),
  }
}

const waitForLogin = async (page: Page, returnUrl: string): Promise<void> => {
  console.log('\n⚠  Not logged in — sign in in the browser window (waiting up to 3 min)…')
  const deadline = Date.now() + 180_000
  while (Date.now() < deadline) {
    await page.waitForTimeout(2000)
    if (!isOnLoginPage(page.url())) return
  }
  console.log('  Still on login — press Enter after signing in.')
  await new Promise<void>((res) => { process.stdin.once('data', () => res()) })
  await page.goto(returnUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 })
}

const isOnLoginPage = (url: string): boolean =>
  url.includes('/login') || url.includes('/signin')

export const ensureAuth = async (page: Page, targetUrl: string, headless: boolean): Promise<void> => {
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  if (!isOnLoginPage(page.url())) return
  if (headless) {
    console.error('✗ Not logged in. Run without --headless first to log in.')
    process.exit(1)
  }
  await waitForLogin(page, targetUrl)
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

const openLabsTab = async (page: Page): Promise<void> => {
  const labsTab = page.getByText('Labs', { exact: false }).filter({ hasText: /\d+\s*Labs/i })
  if (await labsTab.first().isVisible({ timeout: 8000 }).catch(() => false)) {
    await labsTab.first().click()
    await page.waitForTimeout(2500)
    return
  }
  const fallback = page.locator('[role="tab"]:has-text("Labs"), button:has-text("Labs")').first()
  if (await fallback.isVisible({ timeout: 3000 }).catch(() => false)) {
    await fallback.click()
    await page.waitForTimeout(2500)
  }
}

const expandCourseSections = async (page: Page): Promise<void> => {
  const collapsed = page.locator('.MuiAccordionSummary-root[aria-expanded="false"]')
  const count = await collapsed.count().catch(() => 0)
  await Array.from({ length: count }, (_, i) => i).reduce(
    (chain, i) => chain.then(async () => {
      const btn = collapsed.nth(i)
      if (await btn.isVisible({ timeout: 300 }).catch(() => false)) {
        await btn.click({ timeout: 1000 }).catch(() => undefined)
        await page.waitForTimeout(250)
      }
    }),
    Promise.resolve(),
  )
}

type BoxItemMeta = { title: string; duration: string; category: string }

const readBoxItemMeta = async (item: Locator): Promise<BoxItemMeta> =>
  item.evaluate((el) => {
    const textOf = (node: Element) => (node as HTMLElement).innerText ?? node.textContent ?? ''
    const head = el.querySelector('.box-head') as HTMLElement | null
    const headText = head ? textOf(head) : textOf(el)
    const lines = headText.split('\n').map((l) => l.trim()).filter(Boolean)
    const title = lines.find((l) => l.length > 5 && !/^Attempts$/i.test(l) && !/^Start$/i.test(l) && !/^\d/.test(l)) ?? 'Lab'
    const duration = lines.find((l) => /\d+\s*m|\d+h|:\d+:\d+/i.test(l)) ?? ''

    let category = 'Uncategorized'
    let node: Element | null = el
    while (node) {
      const summary = node.querySelector?.('.MuiAccordionSummary-root') as HTMLElement | null
        ?? node.previousElementSibling?.querySelector?.('.MuiAccordionSummary-root') as HTMLElement | null
      const summaryText = summary?.innerText?.split('\n')[0]?.trim()
      if (summaryText && summaryText.length > 3 && summaryText.length < 140) {
        category = summaryText
        break
      }
      const accordion = node.closest('.MuiAccordion-root')
      if (accordion) {
        const accSummary = accordion.querySelector('.MuiAccordionSummary-root') as HTMLElement | null
        const t = accSummary?.innerText?.split('\n')[0]?.trim()
        if (t && t.length > 3) {
          category = t
          break
        }
      }
      node = node.parentElement
    }

    return { title, duration, category }
  })

const discoverCourseLabs = async (page: Page, courseUrl: string): Promise<CourseLabEntry[]> => {
  console.log(`\nDiscovering labs on course page…`)
  await page.goto(courseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  await page.waitForSelector('button', { timeout: 25_000 }).catch(() => undefined)
  await page.waitForTimeout(2000)

  await openLabsTab(page)
  await expandCourseSections(page)
  await scrollPage(page)
  await expandCourseSections(page)
  await scrollPage(page)

  const items = page.locator('.box-item')
  const count = await items.count()
  console.log(`  Found ${count} lab rows`)

  if (count === 0) {
    writeFileSync(join(LABS_DIR, 'debug-course.html'), await page.content())
    throw new Error('No .box-item labs found — debug saved to scripts/labs/debug-course.html')
  }

  const seen = new Set<string>()
  const labs: CourseLabEntry[] = []

  await Array.from({ length: count }, (_, i) => i).reduce(
    (chain, i) => chain.then(async () => {
      const item = items.nth(i)
      const meta = await readBoxItemMeta(item)
      const startBtn = item.locator('button.perpul, button:has-text("Start")').first()

      if (!await startBtn.isVisible({ timeout: 1000 }).catch(() => false)) return

      const popupPromise = page.context().waitForEvent('page', { timeout: 15_000 })
      await startBtn.click()
      const popup = await popupPromise.catch(() => null)

      if (!popup) {
        console.warn(`  ⚠ No popup for: ${meta.title}`)
        return
      }

      await popup.waitForLoadState('domcontentloaded', { timeout: 20_000 }).catch(() => undefined)
      const href = popup.url().split('?')[0]
      await popup.close().catch(() => undefined)

      if (!href.includes('/labs/') || seen.has(href)) return
      seen.add(href)

      labs.push({
        index: labs.length + 1,
        title: meta.title,
        slug: slugFromLabUrl(href),
        url: href,
        category: meta.category,
        duration: meta.duration,
      })

      if (labs.length % 10 === 0) console.log(`  … ${labs.length} labs mapped`)
    }),
    Promise.resolve(),
  )

  return labs
}

const loadCourseIndex = (): CourseIndex => {
  if (!existsSync(COURSE_INDEX_PATH)) {
    console.error(`✗ Missing ${COURSE_INDEX_PATH} — run with --course … --list-only first`)
    process.exit(1)
  }
  return JSON.parse(readFileSync(COURSE_INDEX_PATH, 'utf8')) as CourseIndex
}

const saveCourseIndex = (labs: CourseLabEntry[]): void => {
  mkdirSync(LABS_DIR, { recursive: true })
  const index: CourseIndex = {
    discoveredAt: new Date().toISOString(),
    total: labs.length,
    labs: labs.map(({ index, title, slug, category, duration }) => ({
      index,
      title,
      slug,
      category,
      duration,
    })),
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

const clickStepsTab = async (page: Page): Promise<void> => {
  const tabSelectors = [
    'button:has-text("Lab Steps")',
    '[role="tab"]:has-text("Lab Steps")',
    'button:has-text("Challenge Steps")',
    '[role="tab"]:has-text("Challenge Steps")',
    'a:has-text("Lab Steps")',
    'a:has-text("Challenge Steps")',
    '.tabs-head [role="tab"]:nth-child(2)',
    '.MuiTabs-root [role="tab"]:nth-child(2)',
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

  if (!found) throw new Error('Could not find Lab Steps / Challenge Steps tab')
}

const looksLikeStepsPanel = (text: string): boolean =>
  /Task\s*\d+|Challenge Steps|Sign in to AWS|Cloud Challenge/i.test(text) && text.length > 80

const findStepsPanel = async (page: Page): Promise<Locator> => {
  const panelSelectors = [
    '.description-section',
    '.tab-content',
    '[class*="tabs-labs"] .tab-content',
    '[role="tabpanel"]',
    '.tab-pane.active',
  ]

  const matched = await panelSelectors.reduce<Promise<Locator | null>>(async (prev, sel) => {
    const existing = await prev
    if (existing) return existing
    const panels = page.locator(sel)
    const count = await panels.count().catch(() => 0)
    const found = await Array.from({ length: count }, (_, i) => i).reduce<Promise<Locator | null>>(
      async (innerPrev, i) => {
        const hit = await innerPrev
        if (hit) return hit
        const panel = panels.nth(i)
        if (!await panel.isVisible({ timeout: 1500 }).catch(() => false)) return null
        const text = await tryText(panel)
        return looksLikeStepsPanel(text) ? panel : null
      },
      Promise.resolve(null),
    )
    return found
  }, Promise.resolve(null))

  if (matched) return matched
  throw new Error('Steps panel not found — expected .tab-content with tasks or challenge sections')
}

type RawStep = { text: string; imageUrls: string[] }
type RawBlock = { heading: string; steps: RawStep[] }

const extractBlocks = async (panel: Locator): Promise<RawBlock[]> =>
  panel.evaluate((root) => {
    const blocks: Array<{ heading: string; steps: RawStep[] }> = []
    const taskRe = /^Task\s*\d+\s*:/i

    const parseStepsFromHtml = (html: string): RawStep[] => {
      const wrap = document.createElement('div')
      wrap.innerHTML = html
      const fromBlocks = [...wrap.querySelectorAll('p, li')]
        .map((el) => {
          const text = (el as HTMLElement).innerText?.trim().replace(/\u00a0/g, ' ') ?? ''
          const imageUrls = [...el.querySelectorAll('img')]
            .map((img) => img.getAttribute('src'))
            .filter((src): src is string => Boolean(src))
          return { text, imageUrls }
        })
        .filter((step) => step.text.length > 0 || step.imageUrls.length > 0)

      if (fromBlocks.length > 0) return fromBlocks

      const imageUrls = [...wrap.querySelectorAll('img')]
        .map((img) => img.getAttribute('src'))
        .filter((src): src is string => Boolean(src))
      const text = (wrap as HTMLElement).innerText?.trim().replace(/\u00a0/g, ' ') ?? ''
      const lines = text
        .split(/\n+/)
        .map((line) => line.replace(/^\d+[\).\s]+/, '').trim())
        .filter(Boolean)

      if (lines.length === 0 && imageUrls.length === 0) return []

      return lines.length
        ? lines.map((line, index) => ({
            text: line,
            imageUrls: index === lines.length - 1 ? imageUrls : [],
          }))
        : [{ text: 'Steps', imageUrls }]
    }

    const taskHeadings = [...root.querySelectorAll('h2, h3, h4')].filter((el) =>
      taskRe.test((el as HTMLElement).innerText?.trim().replace(/\u00a0/g, ' ') ?? ''),
    )

    if (taskHeadings.length > 0) {
      taskHeadings.forEach((h, i) => {
        const heading = (h as HTMLElement).innerText?.trim().replace(/\s+/g, ' ') || `Task ${i + 1}`
        const htmlParts: string[] = []
        let el: Element | null = h.nextElementSibling

        while (el) {
          const tag = el.tagName.toLowerCase()
          const t = (el as HTMLElement).innerText?.trim().replace(/\u00a0/g, ' ') ?? ''
          if (['h2', 'h3', 'h4'].includes(tag) && taskRe.test(t)) break
          htmlParts.push(el.outerHTML)
          el = el.nextElementSibling
        }

        blocks.push({
          heading,
          steps: parseStepsFromHtml(htmlParts.join('\n')),
        })
      })
      return blocks
    }

    const challengeBoxes = root.querySelectorAll('.description-section .box, .tab-content .box')
    if (challengeBoxes.length > 0) {
      challengeBoxes.forEach((box, i) => {
        const titleEl = box.querySelector('.descri-block > strong, strong') as HTMLElement | null
        const heading = titleEl?.innerText?.trim().replace(/\s+/g, ' ')
          || `Challenge section ${i + 1}`
        blocks.push({
          heading,
          steps: parseStepsFromHtml(box.innerHTML),
        })
      })
      if (blocks.length) return blocks
    }

    const text = (root as HTMLElement).innerText?.trim() ?? ''
    if (text) {
      blocks.push({
        heading: 'Steps',
        steps: parseStepsFromHtml(root.innerHTML),
      })
    }
    return blocks
  })

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
  const title = await tryText(page.locator('h1').first()) || 'Hands-on Lab'
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

export const scrapeLab = async (page: Page, url: string, slug: string, imageDir: string): Promise<Lab> => {
  console.log(`\n[${slug}] ${url}`)
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 })
  await page.waitForSelector('h1, [class*="lab"]', { timeout: 20_000 }).catch(() => undefined)
  await page
    .locator('[role="tab"]:has-text("Lab Steps"), button:has-text("Lab Steps")')
    .first()
    .waitFor({ state: 'visible', timeout: 30_000 })
    .catch(() => undefined)
  await page.waitForTimeout(1500)

  const meta = await scrapeMetadata(page)
  console.log(`  ${meta.title}`)

  await clickStepsTab(page)
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
    const steps = await block.steps.reduce<Promise<LabTask['steps']>>(async (prev, rawStep) => {
      const acc = await prev
      const text = rawStep.text.replace(/^\d+[\).\s]+/, '').trim()
      if (!text && rawStep.imageUrls.length === 0) return acc

      const localImages: string[] = []
      await rawStep.imageUrls.reduce(async (imagePrev, src) => {
        await imagePrev
        const imgUrl = absolutizeUrl(src, url)
        imgCounter += 1
        const ext = imgUrl.match(/\.(png|jpe?g|gif|webp)(\?|$)/i)?.[1]?.toLowerCase() ?? 'png'
        const filename = `step-${String(imgCounter).padStart(2, '0')}.${ext}`
        const dest = join(imageDir, filename)
        if (await downloadImage(page, imgUrl, dest)) {
          localImages.push(`/labs/${slug}/${filename}`)
        }
      }, Promise.resolve())

      acc.push({
        text: text || block.heading,
        images: localImages.length ? localImages : undefined,
      })
      return acc
    }, Promise.resolve([]))

    const dedupedSteps = steps.filter((step, index, arr) => index === 0 || step.text !== arr[index - 1]?.text)
    if (dedupedSteps.length === 0) continue
    tasks.push({ title: block.heading, steps: dedupedSteps })
  }

  const imageCount = tasks.reduce(
    (sum, task) => sum + task.steps.reduce((inner, step) => inner + (step.images?.length ?? 0), 0),
    0,
  )
  console.log(`  ${tasks.length} tasks · ${imageCount} images`)

  return {
    slug,
    title: meta.title,
    level: meta.level,
    services: meta.services,
    summary: '',
    duration: meta.duration,
    tasks,
    takeaways: [],
    source: 'course',
  }
}

export const labJsonHasImages = (slug: string): boolean => {
  const jsonPath = join(LABS_DIR, `${slug}.json`)
  if (!existsSync(jsonPath)) return false
  const lab = JSON.parse(readFileSync(jsonPath, 'utf8')) as Lab
  return lab.tasks?.some((task) =>
    task.steps?.some((step) => (step.images?.length ?? 0) > 0),
  ) ?? false
}

export const persistLab = (lab: Lab, seed: boolean): void => {
  const clean = sanitizeLab(lab)
  const imageDir = resolve(`public/labs/${clean.slug}`)
  const jsonPath = join(LABS_DIR, `${clean.slug}.json`)
  const sqlPath = join(LABS_DIR, `${clean.slug}.sql`)
  mkdirSync(imageDir, { recursive: true })
  mkdirSync(LABS_DIR, { recursive: true })

  writeFileSync(jsonPath, JSON.stringify(clean, null, 2))
  const scrapedAt = new Date().toISOString().slice(0, 10)
  const sql = labToInsertSql(clean, { scrapedAt })
  writeFileSync(sqlPath, `${sql}\n`)
  console.log(`  ✓ ${clean.tasks.length} tasks → ${jsonPath}`)

  if (seed) {
    console.log(`  seed: bunx wrangler d1 execute aws-saa-questions --remote --file=${sqlPath}`)
  }
}

export const launchBrowser = async (
  headless: boolean,
  cdpEndpoint?: string,
): Promise<{ context: BrowserContext; close: () => Promise<void> }> => {
  if (cdpEndpoint) {
    console.log(`  CDP: ${cdpEndpoint} (using your Chrome session)`)
    const browser = await chromium.connectOverCDP(cdpEndpoint)
    const context = browser.contexts()[0] ?? await browser.newContext({ viewport: { width: 1280, height: 900 } })
    return {
      context,
      close: async () => { await browser.close() },
    }
  }

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

  const { context, close } = await launchBrowser(args.headless, args.cdpEndpoint)
  const page = await context.newPage()

  if (args.course) {
    await ensureAuth(page, args.course, args.headless)
    await context.storageState({ path: STORAGE_STATE })
    const labs = await discoverCourseLabs(page, args.course)
    saveCourseIndex(labs)

    labs.slice(0, 15).forEach((l) => console.log(`  ${l.index}. [${l.category}] ${l.title}`))
    if (labs.length > 15) console.log(`  … and ${labs.length - 15} more`)

    if (args.listOnly) {
      await close()
      return
    }
  }

  const entries: CourseIndex['labs'] = args.batch || args.course
    ? loadCourseIndex().labs
    : []

  if (args.url) {
    const slug = args.slug ?? slugFromLabUrl(args.url)
    await ensureAuth(page, args.url, args.headless)
    await context.storageState({ path: STORAGE_STATE })
    const lab = await scrapeLab(page, args.url, slug, resolve(`public/labs/${slug}`))
    persistLab(lab, args.seed)
    await close()
    return
  }

  const slice = entries.slice(args.offset, args.limit ? args.offset + args.limit : undefined)
  const modeLabel = args.missingImages ? 'missing-images' : 'batch'
  console.log(`\n${modeLabel}: ${slice.length} labs (offset ${args.offset})`)

  if (slice.length === 0) {
    await close()
    return
  }

  await ensureAuth(page, labUrlForEntry(slice[0]), args.headless)
  await context.storageState({ path: STORAGE_STATE })

  const sqlRows: string[] = []
  const failures: string[] = []

  await slice.reduce(async (prev, entry) => {
    await prev
    const jsonPath = join(LABS_DIR, `${entry.slug}.json`)
    if (args.missingImages && labJsonHasImages(entry.slug)) {
      console.log(`\n[skip has images] ${entry.slug}`)
      return
    }
    if (args.skipExisting && existsSync(jsonPath) && !args.missingImages) {
      console.log(`\n[skip] ${entry.slug}`)
      return
    }

    try {
      const url = labUrlForEntry(entry)
      const lab = await scrapeLab(page, url, entry.slug, resolve(`public/labs/${entry.slug}`))
      persistLab(lab, false)
      const scrapedAt = new Date().toISOString().slice(0, 10)
      sqlRows.push(labToInsertSql(sanitizeLab(lab), { scrapedAt }))
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

if (import.meta.main) {
  main().catch((err: unknown) => { console.error(err); process.exit(1) })
}
