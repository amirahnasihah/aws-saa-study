/**
 * Compare library-index.json (179 SAA labs) vs scripts/labs/*.json
 *
 *   bun run labs:library:audit
 */

import { existsSync, readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import type { Lab } from '../lib/labs'

const LABS_DIR = resolve('scripts/labs')
const LIBRARY_INDEX = join(LABS_DIR, 'library-index.json')
const INDEX_FILES = new Set(['course-index.json', 'checklist-index.json', 'library-index.json'])

const labTypeLabel: Record<number, string> = {
  1: 'guided',
  2: 'challenge',
  3: 'project',
  4: 'sandbox',
}

const hasStepImages = (lab: Lab): boolean =>
  lab.tasks?.some((task) => task.steps?.some((step) => (step.images?.length ?? 0) > 0)) ?? false

const main = (): void => {
  if (!existsSync(LIBRARY_INDEX)) {
    console.error(`Missing ${LIBRARY_INDEX} — run: bun run labs:library:discover`)
    process.exit(1)
  }

  const library = JSON.parse(readFileSync(LIBRARY_INDEX, 'utf8')) as {
    total: number
    labs: Array<{ slug: string; title: string; labType: number }>
  }

  const scraped = new Map<string, Lab>()
  readdirSync(LABS_DIR)
    .filter((file) => file.endsWith('.json') && !INDEX_FILES.has(file))
    .forEach((file) => {
      const lab = JSON.parse(readFileSync(join(LABS_DIR, file), 'utf8')) as Lab
      scraped.set(lab.slug, lab)
    })

  const missing = library.labs.filter((entry) => !scraped.has(entry.slug))
  const have = library.labs.filter((entry) => scraped.has(entry.slug))
  const noImages = have.filter((entry) => !hasStepImages(scraped.get(entry.slug)!))

  const missingByType = missing.reduce<Record<string, number>>((acc, entry) => {
    const key = labTypeLabel[entry.labType] ?? String(entry.labType)
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

  console.log(`Whizlabs library (SAA Associate): ${library.total} labs`)
  console.log(`Scraped in repo: ${have.length}/${library.total}`)
  console.log(`Missing JSON: ${missing.length}`)
  console.log(`Scraped without step images: ${noImages.length}/${have.length}`)
  console.log(`Missing by type: ${JSON.stringify(missingByType)}`)

  if (missing.length > 0) {
    console.log('\nMissing (first 20):')
    missing.slice(0, 20).forEach((entry) => {
      console.log(`  ✗ [${labTypeLabel[entry.labType] ?? entry.labType}] ${entry.title}`)
      console.log(`    ${entry.slug}`)
    })
  }

  if (noImages.length > 0) {
    console.log('\nNo step images (first 15):')
    noImages.slice(0, 15).forEach((entry) => {
      console.log(`  △ ${entry.slug}`)
    })
  }
}

if (import.meta.main) {
  main()
}
