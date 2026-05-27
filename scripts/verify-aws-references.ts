import { readFileSync, writeFileSync } from 'fs'

interface ReferenceRecord {
  id: string
  reference: string
  source: string
}

const extractReferences = (content: string, source: string): ReferenceRecord[] =>
  [...content.matchAll(/id: '([^']+)'[\s\S]*?reference: '(https:\/\/docs\.aws\.amazon\.com[^']+)'/g)]
    .map((match) => ({
      id: match[1],
      reference: match[2],
      source,
    }))

const practiceSource = readFileSync('data/practiceQuestions.ts', 'utf8')
const whizlabSource = readFileSync('scripts/seed-whizlab-batch2.ts', 'utf8')

const allReferences = [
  ...extractReferences(practiceSource, 'practiceQuestions.ts'),
  ...extractReferences(whizlabSource, 'seed-whizlab-batch2.ts'),
]

const uniqueByUrl = new Map<string, ReferenceRecord[]>()
allReferences.forEach((record) => {
  const existing = uniqueByUrl.get(record.reference) ?? []
  uniqueByUrl.set(record.reference, [...existing, record])
})

const checkReference = async (url: string): Promise<{ ok: boolean; status: number }> => {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    if (response.status >= 400) {
      const getResponse = await fetch(url, { method: 'GET', redirect: 'follow' })
      return { ok: getResponse.status < 400, status: getResponse.status }
    }
    return { ok: true, status: response.status }
  } catch {
    return { ok: false, status: 0 }
  }
}

const main = async (): Promise<void> => {
  const urls = [...uniqueByUrl.keys()]
  const results = await urls.reduce<
    Promise<Array<{ url: string; ok: boolean; status: number; ids: string[] }>>
  >(async (accPromise, url) => {
    const acc = await accPromise
    const check = await checkReference(url)
    const ids = (uniqueByUrl.get(url) ?? []).map((record) => record.id)
    const statusLabel = check.ok ? 'OK' : 'FAIL'
    console.log(`${statusLabel} ${check.status} ${url} (${ids.join(', ')})`)
    return [...acc, { url, ok: check.ok, status: check.status, ids }]
  }, Promise.resolve([]))

  const failed = results.filter((result) => !result.ok)
  const report = {
    checkedAt: new Date().toISOString(),
    totalUrls: results.length,
    totalQuestionRefs: allReferences.length,
    failedCount: failed.length,
    failed,
    passed: results.filter((result) => result.ok),
  }

  writeFileSync('scripts/aws-reference-report.json', JSON.stringify(report, null, 2))
  console.log(`Checked ${results.length} unique AWS docs URLs (${allReferences.length} question refs)`)
  console.log(`Failed: ${failed.length} -> scripts/aws-reference-report.json`)

  if (failed.length > 0) process.exitCode = 1
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
