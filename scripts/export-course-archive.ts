/**
 * Export local topic archive from existing video-index.json (no browser).
 *
 *   bun run course:archive
 *   bun run course:archive -- --out-dir ~/Documents/aws-saa-course
 */

import { resolve } from 'path'
import { DEFAULT_ARCHIVE_DIR, exportCourseArchive } from './lib/course-archive'
import { readFileSync } from 'fs'

const INDEX_PATH = resolve('scripts/course/video-index.json')

const parseOutDir = (): string => {
  const args = process.argv.slice(2)
  const flagIndex = args.indexOf('--out-dir')
  const raw = flagIndex !== -1 ? args[flagIndex + 1] : process.env.COURSE_ARCHIVE_DIR
  const value = raw ?? DEFAULT_ARCHIVE_DIR
  return value.replace(/^~(?=\/|$)/, process.env.HOME ?? '')
}

const main = (): void => {
  const outDir = parseOutDir()
  const mirrorLabs = !process.argv.includes('--no-mirror-labs')
  const index = JSON.parse(readFileSync(INDEX_PATH, 'utf8'))
  exportCourseArchive(index, outDir, { mirrorLabs })
  console.log(`\n✓ Course archive ready at ${outDir}`)
}

main()
