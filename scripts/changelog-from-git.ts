import { execSync } from 'child_process'
import { readFileSync } from 'fs'

type ChangeType = 'feat' | 'fix' | 'chore' | 'refactor'

type GitCommit = {
  date: string
  subject: string
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
  { pattern: /\b(add(ed|s|ing)?|enhance(d|s|ing)?|implement(ed|s|ing)?|introduce(d|s|ing)?)\b/i, type: 'feat' },
]

const readLatestChangelogDate = (): string | null => {
  const source = readFileSync(CHANGELOG_PATH, 'utf8')
  const match = source.match(/date: '(\d{4}-\d{2}-\d{2})'/)
  return match?.[1] ?? null
}

const parseSinceArg = (): string => {
  const sinceFlag = process.argv.find((arg) => arg.startsWith('--since='))
  if (sinceFlag) return sinceFlag.replace('--since=', '')

  const latest = readLatestChangelogDate()
  if (latest) return latest

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return thirtyDaysAgo.toISOString().slice(0, 10)
}

const readGitLog = (since: string, afterLatestDate: string | null): GitCommit[] => {
  const rangeFlag = afterLatestDate
    ? `--after="${afterLatestDate} 23:59:59"`
    : `--since="${since} 00:00"`

  const output = execSync(`git log ${rangeFlag} --format='%as|%s'`, { encoding: 'utf8' }).trim()

  if (!output) return []

  return output
    .split('\n')
    .map((line) => {
      const [date, ...subjectParts] = line.split('|')
      return { date, subject: subjectParts.join('|').trim() }
    })
    .filter((commit) => commit.date && commit.subject)
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

const groupByDate = (commits: GitCommit[]): Record<string, GitCommit[]> =>
  commits.reduce<Record<string, GitCommit[]>>((groups, commit) => {
    const existing = groups[commit.date] ?? []
    return { ...groups, [commit.date]: [...existing, commit] }
  }, {})

const formatEntry = (date: string, commits: GitCommit[]): string => {
  const changes = commits.map((commit) => {
    const type = inferChangeType(commit.subject)
    const text = cleanSubject(commit.subject)
    return `      { type: '${type}', text: '${text.replace(/'/g, "\\'")}' },`
  })

  return [`  {`, `    date: '${date}',`, `    changes: [`, ...changes, `    ],`, `  },`].join('\n')
}

const since = parseSinceArg()
const latestDate = readLatestChangelogDate()
const commits = readGitLog(since, latestDate)
const grouped = groupByDate(commits)
const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

console.log(`# Changelog draft from git (${latestDate ? `after ${latestDate}` : `since ${since}`})`)
if (latestDate) {
  console.log(`# Latest entry in ${CHANGELOG_PATH}: ${latestDate}`)
  console.log('# Review, edit wording, then paste new blocks at the top of the changelog array.\n')
}

if (dates.length === 0) {
  console.log('# No commits found for that range.')
  process.exit(0)
}

dates.forEach((date) => {
  console.log(formatEntry(date, grouped[date]))
  console.log('')
})
