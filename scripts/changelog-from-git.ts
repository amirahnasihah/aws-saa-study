import { execSync } from 'child_process'
import { readFileSync } from 'fs'

type ChangeType = 'feat' | 'fix' | 'chore' | 'refactor'

type GitCommit = {
  date: string
  subject: string
}

type ChangelogIndex = {
  latestDate: string | null
  documentedDates: Set<string>
  allTexts: string[]
}

const CHANGELOG_PATH = 'data/changelog.ts'

const prefixTypeMap: Record<string, ChangeType> = {
  feat: 'feat',
  feature: 'feat',
  add: 'feat',
  fix: 'fix',
  bugfix: 'fix',
  chore: 'chore',
  refactor: 'refactor',
  ref: 'refactor',
}

const keywordTypeRules: { pattern: RegExp; type: ChangeType }[] = [
  { pattern: /\bfix(ed|es|ing)?\b/i, type: 'fix' },
  { pattern: /\brefactor(ed|ing|s)?\b/i, type: 'refactor' },
  { pattern: /\b(chore|ci|dependabot|lockfile|gitignore)\b/i, type: 'chore' },
  {
    pattern: /\b(add(ed|s|ing)?|enhance(d|s|ing)?|implement(ed|s|ing)?|introduce(d|s|ing)?|update(d|s|ing)?)\b/i,
    type: 'feat',
  },
]

const skipSubject = (subject: string) => {
  const lower = subject.toLowerCase()
  return (
    lower.startsWith('merge pull request') ||
    lower.startsWith('merge branch') ||
    /^initial commit for the issue/.test(lower)
  )
}

const readChangelogIndex = (): ChangelogIndex => {
  const source = readFileSync(CHANGELOG_PATH, 'utf8')
  const latestDate = source.match(/date: '(\d{4}-\d{2}-\d{2})'/)?.[1] ?? null
  const allTexts = [...source.matchAll(/text: '((?:\\'|[^'])*)'/g)].map((match) =>
    match[1].replace(/\\'/g, "'"),
  )
  const documentedDates = new Set(
    [...source.matchAll(/date: '(\d{4}-\d{2}-\d{2})'/g)].map((match) => match[1]),
  )

  return { latestDate, documentedDates, allTexts }
}

const parseSinceArg = (latestDate: string | null): string => {
  const sinceFlag = process.argv.find((arg) => arg.startsWith('--since='))
  if (sinceFlag) return sinceFlag.replace('--since=', '')

  if (latestDate) return latestDate

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return thirtyDaysAgo.toISOString().slice(0, 10)
}

const includeAllDates = () => process.argv.includes('--all')

const readGitLog = (since: string): GitCommit[] => {
  const output = execSync(`git log --since="${since} 00:00" --format='%as|%s'`, {
    encoding: 'utf8',
  }).trim()

  if (!output) return []

  return output
    .split('\n')
    .map((line) => {
      const [date, ...subjectParts] = line.split('|')
      return { date, subject: subjectParts.join('|').trim() }
    })
    .filter((commit) => commit.date && commit.subject && !skipSubject(commit.subject))
}

const inferChangeType = (subject: string): ChangeType => {
  const conventional = subject.match(/^(\w+)(?:\([^)]+\))?!?:\s*/i)
  if (conventional) {
    const key = conventional[1].toLowerCase()
    const mapped = prefixTypeMap[key]
    if (mapped) return mapped
  }

  const matchedRule = keywordTypeRules.find((rule) => rule.pattern.test(subject))
  return matchedRule?.type ?? 'chore'
}

const cleanSubject = (subject: string): string => {
  const stripped = subject
    .replace(/^(\w+)(?:\([^)]+\))?!?:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!stripped) return subject.trim()
  return stripped.charAt(0).toUpperCase() + stripped.slice(1)
}

const tokens = (text: string) =>
  text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 4)

const overlapsDocumented = (subject: string, documented: string[]) => {
  const cleaned = cleanSubject(subject).toLowerCase()
  const snippet = cleaned.slice(0, 40)

  const directMatch = documented.some((text) => {
    const doc = text.toLowerCase()
    return doc.includes(snippet) || cleaned.includes(doc.slice(0, 40))
  })
  if (directMatch) return true

  const subjectTokens = new Set(tokens(cleaned))
  return documented.some((text) => {
    const shared = tokens(text).filter((word) => subjectTokens.has(word))
    return shared.length >= 3
  })
}

const groupByDate = (commits: GitCommit[]): Record<string, GitCommit[]> =>
  commits.reduce<Record<string, GitCommit[]>>((groups, commit) => {
    const existing = groups[commit.date] ?? []
    return { ...groups, [commit.date]: [...existing, commit] }
  }, {})

const formatChangeLine = (commit: GitCommit) => {
  const type = inferChangeType(commit.subject)
  const text = cleanSubject(commit.subject).replace(/'/g, "\\'")
  return `      { type: '${type}', text: '${text}' },`
}

const formatNewEntry = (date: string, commits: GitCommit[]): string =>
  [`  {`, `    id: '${date}',`, `    date: '${date}',`, `    changes: [`, ...commits.map(formatChangeLine), `    ],`, `  },`].join(
    '\n',
  )

const index = readChangelogIndex()
const since = parseSinceArg(index.latestDate)
const showAllDates = includeAllDates()
const allCommits = readGitLog(since)
const undocumented = allCommits.filter(
  (commit) => !overlapsDocumented(commit.subject, index.allTexts),
)
const grouped = groupByDate(undocumented)
const dates = Object.keys(grouped)
  .filter((date) => showAllDates || !index.documentedDates.has(date) || date === index.latestDate)
  .sort((a, b) => b.localeCompare(a))

console.log(`# Changelog draft from git (since ${since})`)
if (index.latestDate) {
  console.log(`# Latest entry in ${CHANGELOG_PATH}: ${index.latestDate}`)
}
console.log('# Review, edit wording, then merge into data/changelog.ts')
console.log('# Flags: --since=YYYY-MM-DD  --all (include dates already in changelog)\n')

if (dates.length === 0) {
  console.log('# Nothing new to add — documented dates are up to date for this range.')
  process.exit(0)
}

dates.forEach((date) => {
  if (index.latestDate && date === index.latestDate) {
    console.log(`# Append to existing ${date} entry:`)
    grouped[date].forEach((commit) => console.log(formatChangeLine(commit)))
    console.log('')
    return
  }

  console.log(formatNewEntry(date, grouped[date]))
  console.log('')
})
