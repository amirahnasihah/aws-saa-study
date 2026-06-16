/**
 * Video course scraper — course-section API → video-index.json
 *
 *   bun run scrape:videos
 *   bun run scrape:videos -- --course "<video-tab-url>" [--from-raw scripts/course/video-raw.json]
 *
 * Auth: same as scrape:lab (--cdp-endpoint chrome | scripts/.playwright-storage-state.json)
 *
 * Env:
 *   COURSE_VIDEO_URL — base video tab URL (no query string); used to build per-lecture links
 */

import { chromium, type BrowserContext, type Page } from 'playwright'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

type CourseItem = {
  order_by: number
  video_name?: string | null
  lab_name?: string | null
  quiz_name?: string | null
  reading_material_name?: string | null
  section_heading?: string | null
  time_hour?: number | null
  time_minute?: number | null
  time_second?: number | null
  id?: number | null
  layout_id?: number | null
  video_code?: string | null
  video_status?: string | null
}

export type VideoIndexEntry = {
  index: number
  title: string
  section: string
  orderBy: number
  duration: string | null
  videoId: number | null
  layoutId: number | null
  vimeoId: string | null
  url: string
  status: string | null
}

type VideoIndex = {
  discoveredAt: string
  courseUrl: string
  total: number
  videos: VideoIndexEntry[]
}

type CliArgs = {
  courseUrl: string
  fromRaw?: string
  headless: boolean
  cdpEndpoint?: string
  markdown: boolean
}

const STORAGE_STATE = resolve('scripts/.playwright-storage-state.json')
const COURSE_DIR = resolve('scripts/course')
const INDEX_PATH = resolve('scripts/course/video-index.json')
const RAW_PATH = resolve('scripts/course/video-raw.json')

const resolveCdpEndpoint = (raw?: string): string | undefined => {
  const value = raw ?? process.env.PLAYWRIGHT_CDP_ENDPOINT
  if (!value) return undefined
  if (value === 'chrome') return 'http://127.0.0.1:9222'
  return value
}

const parseArgs = (): CliArgs => {
  const args = process.argv.slice(2)
  const get = (flag: string): string | undefined => {
    const i = args.indexOf(flag)
    return i !== -1 ? args[i + 1] : undefined
  }

  const courseUrl =
    get('--course') ??
    process.env.COURSE_VIDEO_URL ??
    'https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video'

  return {
    courseUrl: courseUrl.split('?')[0] ?? courseUrl,
    fromRaw: get('--from-raw'),
    headless: args.includes('--headless'),
    cdpEndpoint: resolveCdpEndpoint(get('--cdp-endpoint')),
    markdown: args.includes('--markdown'),
  }
}

const formatDuration = (item: CourseItem): string | null => {
  const parts: string[] = []
  if (item.time_hour) parts.push(`${item.time_hour}h`)
  if (item.time_minute) parts.push(`${item.time_minute}m`)
  if (item.time_second) parts.push(`${item.time_second}s`)
  const value = parts.join(' ').replace(/^0h /, '')
  return value || null
}

const isSectionHeader = (item: CourseItem): boolean =>
  Boolean(
    item.section_heading &&
      !item.video_name &&
      !item.lab_name &&
      !item.quiz_name &&
      !item.reading_material_name,
  )

const videoUrl = (courseUrl: string, layoutId: number | null | undefined): string => {
  if (!layoutId) return courseUrl
  return `${courseUrl}?layoutId=${layoutId}`
}

const buildIndex = (items: CourseItem[], courseUrl: string): VideoIndex => {
  let section = 'Uncategorized'
  let videoCount = 0

  const videos = items.reduce<VideoIndexEntry[]>((acc, item) => {
    if (isSectionHeader(item) && item.section_heading) {
      section = item.section_heading
      return acc
    }
    if (!item.video_name) return acc

    videoCount += 1
    acc.push({
      index: videoCount,
      title: item.video_name,
      section,
      orderBy: item.order_by,
      duration: formatDuration(item),
      videoId: item.id ?? null,
      layoutId: item.layout_id ?? null,
      vimeoId: item.video_code ?? null,
      url: videoUrl(courseUrl, item.layout_id),
      status: item.video_status ?? null,
    })
    return acc
  }, [])

  return {
    discoveredAt: new Date().toISOString(),
    courseUrl,
    total: videos.length,
    videos,
  }
}

const writeMarkdown = (index: VideoIndex, path: string): void => {
  const lines = [
    `# Video course index (${index.total} lectures)`,
    '',
    `Course: ${index.courseUrl}`,
    `Discovered: ${index.discoveredAt}`,
    '',
  ]

  let currentSection = ''
  index.videos.forEach((video) => {
    if (video.section !== currentSection) {
      currentSection = video.section
      lines.push(`## ${currentSection}`, '')
    }
    const duration = video.duration ? ` (${video.duration})` : ''
    lines.push(`${video.index}. [${video.title}](${video.url})${duration}`)
  })

  writeFileSync(path, `${lines.join('\n')}\n`)
}

const fetchCourseItems = async (page: Page, courseUrl: string): Promise<CourseItem[]> => {
  const responsePromise = page.waitForResponse(
    (res) =>
      res.url().includes('online-courses/course-section') &&
      (res.headers()['content-type'] ?? '').includes('json'),
    { timeout: 90_000 },
  )

  await page.goto(courseUrl, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  const response = await responsePromise
  const payload = JSON.parse(await response.text()) as { data?: CourseItem[] }
  return payload.data ?? []
}

const launchBrowser = async (
  headless: boolean,
  cdpEndpoint?: string,
): Promise<{ context: BrowserContext; close: () => Promise<void> }> => {
  if (cdpEndpoint) {
    console.log(`  CDP: ${cdpEndpoint}`)
    const browser = await chromium.connectOverCDP(cdpEndpoint)
    const context =
      browser.contexts()[0] ??
      (await browser.newContext({ viewport: { width: 1280, height: 900 } }))
    return { context, close: async () => { await browser.close() } }
  }

  const storageState = existsSync(STORAGE_STATE) ? STORAGE_STATE : undefined
  const browser = await chromium.launch({ headless: args.headless })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    ...(storageState ? { storageState } : {}),
  })
  return { context, close: async () => { await browser.close() } }
}

const loadFromRaw = (path: string): CourseItem[] => {
  const payload = JSON.parse(readFileSync(path, 'utf8')) as { data?: CourseItem[] }
  return payload.data ?? []
}

const main = async (): Promise<void> => {
  const args = parseArgs()
  mkdirSync(COURSE_DIR, { recursive: true })

  const items = args.fromRaw
    ? loadFromRaw(resolve(args.fromRaw))
    : await (async () => {
        const { context, close } = await launchBrowser(args.headless, args.cdpEndpoint)
        const page = await context.newPage()
        console.log(`Fetching course outline from ${args.courseUrl}…`)
        const fetched = await fetchCourseItems(page, args.courseUrl)
        writeFileSync(RAW_PATH, JSON.stringify({ data: fetched }, null, 2))
        await context.storageState({ path: STORAGE_STATE })
        await close()
        console.log(`  Raw API dump → ${RAW_PATH} (${fetched.length} rows)`)
        return fetched
      })()

  const index = buildIndex(items, args.courseUrl)
  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2))

  if (args.markdown) {
    writeMarkdown(index, resolve('scripts/course/video-index.md'))
    console.log(`  Markdown → scripts/course/video-index.md`)
  }

  console.log(`\n✓ ${index.total} videos → ${INDEX_PATH}`)
  index.videos.slice(0, 8).forEach((v) => {
    console.log(`  ${v.index}. [${v.section}] ${v.title}`)
    console.log(`      ${v.url}`)
  })
  if (index.total > 8) console.log(`  … and ${index.total - 8} more`)
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
