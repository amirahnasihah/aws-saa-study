/**
 * Discover SAA-C03 labs from Whizlabs library API (179 with Associate cert filter).
 *
 *   bun run labs:library:discover
 *   bun run labs:library:discover -- --cdp-endpoint chrome
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { launchBrowser, ensureAuth } from './scrape-course-lab'

const LABS_DIR = resolve('scripts/labs')
const LIBRARY_INDEX = join(LABS_DIR, 'library-index.json')
const LIBRARY_URL = 'https://business.whizlabs.com/labs/library'

/** AWS Certified Solutions Architect - Associate */
const SAA_CERT_ID = 3

type WhizlabsTask = {
  task_name: string
  task_slug: string
  lab_type: number
  task_duration: number
  task_level: number
  task_certifications?: number[]
  featured_image: string | null
}

type LibraryLabEntry = {
  index: number
  title: string
  slug: string
  labType: number
  durationSeconds: number
  level: number
  featuredImage: string | null
  url: string
}

const parseArgs = () => {
  const args = process.argv.slice(2)
  const get = (flag: string) => {
    const index = args.indexOf(flag)
    return index !== -1 ? args[index + 1] : undefined
  }
  const raw = get('--cdp-endpoint') ?? process.env.PLAYWRIGHT_CDP_ENDPOINT
  const cdpEndpoint = raw === 'chrome' ? 'http://127.0.0.1:9222' : raw
  return {
    headless: args.includes('--headless'),
    cdpEndpoint,
  }
}

const captureTasksList = async (
  page: Awaited<ReturnType<Awaited<ReturnType<typeof launchBrowser>>['context']['newPage']>>,
): Promise<WhizlabsTask[]> => {
  let payload: { data?: { tasks?: WhizlabsTask[] } } | null = null

  page.on('response', async (response) => {
    if (!response.url().includes('play-get-tasks-list') || payload) return
    try {
      payload = (await response.json()) as { data?: { tasks?: WhizlabsTask[] } }
    } catch {
      // ignore parse errors
    }
  })

  await page.goto(LIBRARY_URL, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.waitForTimeout(6_000)

  if (!payload?.data?.tasks?.length) {
    throw new Error('Could not capture play-get-tasks-list — sign in and retry with --cdp-endpoint chrome')
  }

  return payload.data.tasks
}

const main = async (): Promise<void> => {
  const args = parseArgs()
  mkdirSync(LABS_DIR, { recursive: true })

  const { context, close } = await launchBrowser(args.headless, args.cdpEndpoint)
  const page = await context.newPage()
  await ensureAuth(page, LIBRARY_URL, args.headless)

  const tasks = await captureTasksList(page)
  await close()

  const filtered = tasks.filter((task) => (task.task_certifications ?? []).includes(SAA_CERT_ID))
  const labs: LibraryLabEntry[] = filtered.map((task, index) => ({
    index: index + 1,
    title: task.task_name,
    slug: task.task_slug,
    labType: task.lab_type,
    durationSeconds: task.task_duration,
    level: task.task_level,
    featuredImage: task.featured_image,
    url: `https://business.whizlabs.com/labs/${task.task_slug}`,
  }))

  writeFileSync(
    LIBRARY_INDEX,
    `${JSON.stringify({
      source: LIBRARY_URL,
      filters: {
        certification: 'AWS Certified Solutions Architect - Associate',
        certificationId: SAA_CERT_ID,
      },
      discoveredAt: new Date().toISOString(),
      total: labs.length,
      labs,
    }, null, 2)}\n`,
  )

  console.log(`✓ Library index → ${LIBRARY_INDEX} (${labs.length} SAA Associate labs)`)
}

if (import.meta.main) {
  main().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
}
