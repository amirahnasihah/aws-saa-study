import { writeFileSync, readFileSync } from 'fs'
import { parsePageNumber, screenshotPathForQuestion } from './lib/question-meta'

const escape = (value: string): string => value.replace(/'/g, "''")

const extractQuestionIds = (content: string): string[] =>
  [...content.matchAll(/id: 'wz-\d{1,3}'/g)]
    .map((match) => match[0].replace("id: '", '').replace("'", ''))

const batchSource = readFileSync('scripts/seed-batch2.ts', 'utf8')
const ids = extractQuestionIds(batchSource)

const updates = ids.flatMap((id) => {
  const pageNumber = parsePageNumber(id)
  const screenshotUrl = screenshotPathForQuestion(id)
  if (!pageNumber || !screenshotUrl) return []

  return [
    `UPDATE questions SET page_number = ${pageNumber}, screenshot_url = '${escape(screenshotUrl)}' WHERE id = '${escape(id)}';`,
  ]
})

writeFileSync('scripts/screenshot-metadata.sql', updates.join('\n'))
console.log(`Generated ${updates.length} UPDATE rows -> scripts/screenshot-metadata.sql`)
