import { sanitizeLab } from '@/lib/sanitize-lab'

export type LabLevel = 'Fundamental' | 'Intermediate' | 'Advanced'

export type LabStepContent = {
  text: string
  images?: string[]
}

export type LabTask = {
  title: string
  steps: LabStepContent[]
}

export type Lab = {
  slug: string
  title: string
  level: LabLevel
  services: string[]
  summary: string
  duration: string
  completedOn?: string
  tasks: LabTask[]
  takeaways: string[]
  source?: string
  sourceUrl?: string
}

export const shouldUseCompiledLabs = () =>
  process.env.NODE_ENV === 'development' || process.env.USE_COMPILED_LABS === '1'

export interface LabDBRow {
  slug: string
  title: string
  level: string
  services: string
  summary: string
  duration: string
  completed_on: string | null
  tasks: string
  takeaways: string
  source: string
  source_url: string | null
  scraped_at: string | null
}

const parseJson = <T>(raw: string, fallback: T): T => {
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

const normalizeStep = (step: unknown): LabStepContent => {
  if (typeof step === 'string') return { text: step }
  if (step && typeof step === 'object' && 'text' in step && typeof (step as LabStepContent).text === 'string') {
    const s = step as LabStepContent
    return { text: s.text, images: s.images?.filter(Boolean) }
  }
  return { text: String(step) }
}

const normalizeTask = (task: unknown): LabTask => {
  if (!task || typeof task !== 'object') return { title: 'Task', steps: [] }
  const t = task as { title?: string; steps?: unknown[] }
  return {
    title: t.title ?? 'Task',
    steps: (t.steps ?? []).map(normalizeStep),
  }
}

const rowToLabRaw = (row: LabDBRow): Lab => ({
  slug: row.slug,
  title: row.title,
  level: (row.level as LabLevel) || 'Fundamental',
  services: parseJson<string[]>(row.services, []),
  summary: row.summary,
  duration: row.duration,
  completedOn: row.completed_on ?? undefined,
  tasks: parseJson<unknown[]>(row.tasks, []).map(normalizeTask),
  takeaways: parseJson<string[]>(row.takeaways, []),
  source: row.source === 'whizlabs' ? 'course' : row.source,
  sourceUrl: undefined,
})

export const rowToLab = (row: LabDBRow): Lab => sanitizeLab(rowToLabRaw(row))

export const labToInsertSql = (lab: Lab, extra?: { sourceUrl?: string; scrapedAt?: string }): string => {
  const esc = (s: string): string => s.replace(/'/g, "''")
  const tasks = JSON.stringify(lab.tasks)
  const services = JSON.stringify(lab.services)
  const takeaways = JSON.stringify(lab.takeaways)
  const completed = lab.completedOn ? `'${esc(lab.completedOn)}'` : 'NULL'
  const sourceUrl = extra?.sourceUrl ?? lab.sourceUrl
  const sourceUrlSql = sourceUrl ? `'${esc(sourceUrl)}'` : 'NULL'
  const scrapedAt = extra?.scrapedAt ? `'${esc(extra.scrapedAt)}'` : 'NULL'

  return `INSERT OR REPLACE INTO labs (slug, title, level, services, summary, duration, completed_on, tasks, takeaways, source, source_url, scraped_at) VALUES ('${esc(lab.slug)}', '${esc(lab.title)}', '${esc(lab.level)}', '${esc(services)}', '${esc(lab.summary)}', '${esc(lab.duration)}', ${completed}, '${esc(tasks)}', '${esc(takeaways)}', '${esc(lab.source ?? 'manual')}', ${sourceUrlSql}, ${scrapedAt});`
}

export const slugFromLabUrl = (url: string): string => {
  const path = new URL(url).pathname.replace(/\/$/, '')
  const segment = path.split('/').pop() ?? 'lab'
  return segment
}

/** @deprecated use slugFromLabUrl */
export const slugFromWhizlabsUrl = slugFromLabUrl
