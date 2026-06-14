/**
 * Strip vendor branding from lab JSON/SQL and course index.
 * Usage: bun run scripts/sanitize-labs-data.ts
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { labToInsertSql, type Lab } from '../lib/labs'
import { sanitizeLab } from '../lib/sanitize-lab'

const LABS_DIR = resolve('scripts/labs')
const COURSE_INDEX = join(LABS_DIR, 'course-index.json')

const files = readdirSync(LABS_DIR).filter((f) => f.endsWith('.json') && f !== 'course-index.json')

files.forEach((file) => {
  const path = join(LABS_DIR, file)
  const raw = JSON.parse(readFileSync(path, 'utf8')) as Lab
  const clean = sanitizeLab(raw)
  writeFileSync(path, `${JSON.stringify(clean, null, 2)}\n`)
  writeFileSync(path.replace(/\.json$/, '.sql'), `${labToInsertSql(clean, { scrapedAt: new Date().toISOString() })}\n`)
})

const courseRaw = readFileSync(COURSE_INDEX, 'utf8')
const courseIndex = JSON.parse(courseRaw) as {
  courseUrl?: string
  discoveredAt: string
  total: number
  labs: Array<{
    index: number
    title: string
    slug: string
    url?: string
    category: string
    duration: string
  }>
}

const cleanedCourse = {
  discoveredAt: courseIndex.discoveredAt,
  total: courseIndex.total,
  labs: courseIndex.labs.map(({ index, title, slug, category, duration }) => ({
    index,
    title,
    slug,
    category,
    duration,
  })),
}

writeFileSync(COURSE_INDEX, `${JSON.stringify(cleanedCourse, null, 2)}\n`)

console.log(`Sanitized ${files.length} lab JSON/SQL files and course-index.json`)
