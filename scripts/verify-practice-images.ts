/**
 * Verify Core practice question images on disk (no HTTP / practice page).
 *
 *   bun run practice:verify
 */

import { existsSync } from 'fs'
import { join, resolve } from 'path'
import { CORE_PRACTICE_SETS, totalCoreQuestionImages } from './lib/practice-test-catalog'

const imagePath = (setId: string, index: number): string =>
  join(resolve(`public/questions/${setId}`), `${setId}-${String(index).padStart(3, '0')}.png`)

const main = (): void => {
  console.log(`Core practice images — ${totalCoreQuestionImages()} expected across ${CORE_PRACTICE_SETS.length} sets`)

  const perSet = CORE_PRACTICE_SETS.map((set) => {
    const missing = Array.from({ length: set.total }, (_, i) => i + 1).filter((n) => !existsSync(imagePath(set.setId, n)))
    return { set, missing }
  })

  perSet.forEach(({ set, missing }) => {
    const ready = set.total - missing.length
    console.log(`  ${set.setId}: ${ready}/${set.total} ready`)
    if (missing.length > 0 && missing.length <= 5) {
      missing.forEach((n) => console.log(`    ✗ ${set.setId}-${String(n).padStart(3, '0')}.png`))
    } else if (missing.length > 5) {
      console.log(`    ✗ ${missing.length} missing (e.g. ${set.setId}-${String(missing[0]).padStart(3, '0')}.png …)`)
    }
  })

  const totalMissing = perSet.reduce((sum, { missing }) => sum + missing.length, 0)
  if (totalMissing > 0) {
    console.log(`\nTotal missing: ${totalMissing}`)
    process.exit(1)
  }
  console.log('\n✓ All Core practice images present on disk')
}

if (import.meta.main) {
  main()
}
