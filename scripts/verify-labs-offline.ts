/**
 * Verify scraped labs from disk only — no /labs page fetches, no dev server.
 *
 * Usage: bun run labs:verify
 */

import { existsSync, readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { labsChecklistOrder } from '../data/labsChecklistOrder'
import { labsCourseOrder } from '../data/labsCourseOrder'
import { labsLibraryOrder } from '../data/labsLibraryOrder'
import type { Lab } from '../lib/labs'

const LABS_DIR = resolve('scripts/labs')
const PUBLIC_LABS = resolve('public/labs')
const CHECKLIST_MD = resolve('STUDY-CHECKLIST.md')
const INDEX_FILES = new Set(['course-index.json', 'checklist-index.json', 'library-index.json'])

type LabStatus = 'ready' | 'no-images' | 'missing'

type VerifyRow = {
  slug: string
  title: string
  status: LabStatus
  stepImages: number
  missingFiles: number
}

const loadLabJson = (slug: string): Lab | null => {
  const path = join(LABS_DIR, `${slug}.json`)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8')) as Lab
}

const countStepImages = (lab: Lab): number =>
  lab.tasks?.reduce(
    (sum, task) => sum + (task.steps?.reduce(
      (inner, step) => inner + (step.images?.length ?? 0),
      0,
    ) ?? 0),
    0,
  ) ?? 0

const resolveImagePath = (imagePath: string): string => {
  const trimmed = imagePath.replace(/^\//, '')
  if (trimmed.startsWith('labs/')) return resolve('public', trimmed)
  return resolve(trimmed)
}

const missingImageFiles = (lab: Lab): number => {
  const paths = lab.tasks?.flatMap((task) =>
    task.steps?.flatMap((step) => step.images ?? []) ?? [],
  ) ?? []
  return paths.filter((imagePath) => !existsSync(resolveImagePath(imagePath))).length
}

const verifyList = (
  entries: Array<{ slug: string; title: string }>,
): { rows: VerifyRow[]; counts: Record<LabStatus, number> } => {
  const counts: Record<LabStatus, number> = { ready: 0, 'no-images': 0, missing: 0 }
  const rows = entries.map((entry) => {
    const lab = loadLabJson(entry.slug)
    if (!lab) {
      counts.missing += 1
      return { slug: entry.slug, title: entry.title, status: 'missing' as const, stepImages: 0, missingFiles: 0 }
    }
    const stepImages = countStepImages(lab)
    const missingFiles = missingImageFiles(lab)
    const status: LabStatus = stepImages > 0 && missingFiles === 0 ? 'ready' : stepImages === 0 ? 'no-images' : 'no-images'
    if (status === 'ready') counts.ready += 1
    else counts['no-images'] += 1
    return { slug: entry.slug, title: entry.title, status, stepImages, missingFiles }
  })
  return { rows, counts }
}

const printSection = (label: string, entries: Array<{ slug: string; title: string }>): number => {
  const { rows, counts } = verifyList(entries)
  const incomplete = counts.missing + counts['no-images']
  console.log(`\n${label}: ${entries.length} listed · ready ${counts.ready} · no images ${counts['no-images']} · missing ${counts.missing}`)
  if (incomplete > 0) {
    rows.filter((row) => row.status !== 'ready').slice(0, 8).forEach((row) => {
      console.log(`  ${row.status === 'missing' ? '✗' : '△'} ${row.slug}${row.missingFiles > 0 ? ` (${row.missingFiles} broken image paths)` : ''}`)
    })
    if (incomplete > 8) console.log(`  … and ${incomplete - 8} more incomplete`)
  }
  return incomplete
}

const checklistMarkdownLabs = (): number => {
  const md = readFileSync(CHECKLIST_MD, 'utf8')
  const count = (md.match(/^- \[[ x]\] 🧪 /gm) ?? []).length
  console.log(`\nSTUDY-CHECKLIST.md: ${count} 🧪 lab lines`)
  return count
}

const main = (): void => {
  console.log('Offline lab verification (JSON + public/labs files only)')

  const scrapedCount = readdirSync(LABS_DIR)
    .filter((file) => file.endsWith('.json') && !INDEX_FILES.has(file)).length
  console.log(`Scraped JSON files: ${scrapedCount}`)

  checklistMarkdownLabs()

  const domainIncomplete = printSection('Domain catalog', labsCourseOrder)
  const checklistIncomplete = printSection('Study checklist', labsChecklistOrder.filter((e) => e.slug).map((e) => ({
    slug: e.slug!,
    title: e.title,
  })))
  const libraryIncomplete = printSection('SAA library (other)', labsLibraryOrder)

  const totalIncomplete = domainIncomplete + checklistIncomplete + libraryIncomplete
  console.log(`\nTotal incomplete across lists: ${totalIncomplete}`)

  if (totalIncomplete > 0) process.exit(1)
  console.log('\n✓ All listed labs ready (JSON + step images on disk)')
}

if (import.meta.main) {
  main()
}
