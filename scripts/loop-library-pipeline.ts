/**
 * One pipeline tick: discover → scrape batch → offline verify → compile library order.
 * No /labs page checks — verification reads JSON + public/labs only.
 *
 *   bun run labs:loop
 *   bun run labs:loop -- --limit 5
 *   bun run labs:loop -- --checklist-only
 */

import { existsSync, unlinkSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const ROOT = resolve('.')
const LOCK_FILE = resolve('/tmp/aws-saa-labs-scrape.lock')

const parseArgs = () => {
  const args = process.argv.slice(2)
  const get = (flag: string) => {
    const index = args.indexOf(flag)
    return index !== -1 ? args[index + 1] : undefined
  }
  return {
    limit: get('--limit') ?? '8',
    checklistOnly: args.includes('--checklist-only'),
    libraryOnly: args.includes('--library-only'),
  }
}

const run = async (command: string[]): Promise<number> => {
  console.log(`\n→ ${command.join(' ')}`)
  const proc = Bun.spawn(command, { cwd: ROOT, stdout: 'inherit', stderr: 'inherit' })
  return proc.exited
}

const isScrapeRunning = (): boolean => {
  if (existsSync(LOCK_FILE)) return true
  const out = Bun.spawnSync(['pgrep', '-f', 'scrape-(library|checklist)-labs'], { stdout: 'pipe' })
  return out.stdout.toString().trim().length > 0
}

const withScrapeLock = async (fn: () => Promise<void>): Promise<void> => {
  writeFileSync(LOCK_FILE, String(process.pid))
  try {
    await fn()
  } finally {
    if (existsSync(LOCK_FILE)) unlinkSync(LOCK_FILE)
  }
}

const main = async (): Promise<void> => {
  const args = parseArgs()

  if (isScrapeRunning()) {
    console.log('Another scrape is running — verify + compile only')
    await run(['bun', 'run', 'labs:compile'])
    const verifyCode = await run(['bun', 'run', 'labs:verify'])
    process.exit(verifyCode)
  }

  if (!existsSync(resolve('scripts/labs/library-index.json'))) {
    const code = await run(['bun', 'run', 'labs:library:discover'])
    if (code !== 0) process.exit(code)
  }

  const cdpReachable = await fetch('http://127.0.0.1:9222/json/version')
    .then((res) => res.ok)
    .catch(() => false)
  const cdp = process.env.PLAYWRIGHT_CDP_ENDPOINT
    ? []
    : cdpReachable
      ? ['--cdp-endpoint', 'chrome']
      : []
  if (!cdpReachable && !process.env.PLAYWRIGHT_CDP_ENDPOINT) {
    console.log('CDP not on :9222 — using Playwright storage state')
  }

  await withScrapeLock(async () => {
    const scrapeTarget = args.checklistOnly
      ? ['bun', 'run', 'scrape:lab:checklist', '--', '--limit', args.limit, '--no-seed', ...cdp]
      : args.libraryOnly
        ? ['bun', 'run', 'labs:library:scrape', '--', '--limit', args.limit, '--no-seed', ...cdp]
        : ['bun', 'run', 'scrape:lab:checklist', '--', '--limit', args.limit, '--no-seed', ...cdp]

    const scrapeCode = await run(scrapeTarget)
    if (scrapeCode !== 0) console.warn(`Scrape exited ${scrapeCode} — continuing verify`)

    if (!args.checklistOnly && !args.libraryOnly) {
      const libCode = await run([
        'bun', 'run', 'labs:library:scrape', '--', '--limit', args.limit, '--no-seed', ...cdp,
      ])
      if (libCode !== 0) console.warn(`Library scrape exited ${libCode}`)
    }
  })

  const compileCode = await run(['bun', 'run', 'labs:compile'])
  if (compileCode !== 0) process.exit(compileCode)

  const verifyCode = await run(['bun', 'run', 'labs:verify'])
  process.exit(verifyCode)
}

if (import.meta.main) {
  main().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
}
