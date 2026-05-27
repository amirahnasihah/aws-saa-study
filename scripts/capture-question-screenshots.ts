import { chromium, type Page } from 'playwright'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import { questionIdFromPage, screenshotFileName } from './lib/question-meta'

interface ViewportConfig {
  width: number
  height: number
}

interface CaptureConfig {
  startPage: number
  endPage: number
  urlTemplate: string
  storageStatePath?: string
  screenshotSelector?: string
  delayMs?: number
  viewport?: ViewportConfig
  outputDirs: {
    staging: string
    public: string
  }
}

const CONFIG_PATH = resolve('scripts/question-pages.local.json')
const EXAMPLE_PATH = resolve('scripts/question-pages.config.example.json')

const loadConfig = (): CaptureConfig => {
  const path = existsSync(CONFIG_PATH) ? CONFIG_PATH : EXAMPLE_PATH
  const raw = readFileSync(path, 'utf8')
  const parsed: unknown = JSON.parse(raw)
  return parsed as CaptureConfig
}

const pageUrl = (template: string, page: number): string =>
  template.replace('{page}', String(page))

const waitForPage = async (page: Page, delayMs: number): Promise<void> => {
  await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => undefined)
  await page.waitForTimeout(delayMs)
}

const capturePage = async (
  page: Page,
  config: CaptureConfig,
  pageNumber: number,
): Promise<{ page: number; staging: string; public: string }> => {
  const url = pageUrl(config.urlTemplate, pageNumber)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  await waitForPage(page, config.delayMs ?? 1500)

  const fileName = screenshotFileName(pageNumber)
  const stagingPath = join(resolve(config.outputDirs.staging), fileName)
  const publicPath = join(resolve(config.outputDirs.public), fileName)
  const target = config.screenshotSelector
    ? page.locator(config.screenshotSelector).first()
    : page

  await target.screenshot({ path: stagingPath, fullPage: true })
  await target.screenshot({ path: publicPath, fullPage: true })

  return { page: pageNumber, staging: stagingPath, public: publicPath }
}

const ensureDirs = (config: CaptureConfig): void => {
  ;[config.outputDirs.staging, config.outputDirs.public].forEach((dir) => {
    mkdirSync(resolve(dir), { recursive: true })
  })
}

const pageRange = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index)

const main = async (): Promise<void> => {
  const config = loadConfig()

  if (config.urlTemplate.includes('YOUR-PRACTICE-TEST')) {
    console.error(
      'Configure scripts/question-pages.local.json with your practice test URLs first.',
    )
    console.error(`Copy from ${EXAMPLE_PATH}`)
    process.exit(1)
  }

  ensureDirs(config)
  const viewport = config.viewport ?? { width: 1280, height: 900 }
  const storageState = config.storageStatePath && existsSync(resolve(config.storageStatePath))
    ? resolve(config.storageStatePath)
    : undefined

  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({
    viewport,
    ...(storageState ? { storageState } : {}),
  })
  const page = await context.newPage()

  const pages = pageRange(config.startPage, config.endPage)
  const results = await pages.reduce<Promise<Awaited<ReturnType<typeof capturePage>>[]>>(
    async (accPromise, pageNumber) => {
      const acc = await accPromise
      const result = await capturePage(page, config, pageNumber)
      console.log(`page ${pageNumber} -> ${questionIdFromPage(pageNumber)} (${result.public})`)
      return [...acc, result]
    },
    Promise.resolve([]),
  )

  await browser.close()
  console.log(`Captured ${results.length} screenshots (${config.startPage}-${config.endPage})`)
  console.log('Next: bun run scripts/seed-screenshot-metadata.ts')
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
