/**
 * Extract 🧪 labs from STUDY-CHECKLIST.md → data/labsChecklistOrder.ts
 *
 * Usage: bun run scripts/generate-labs-checklist.ts
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

type CourseLabEntry = {
  title: string
  slug: string
}

type ChecklistSectionId =
  | 'compute'
  | 'storage'
  | 'security'
  | 'database'
  | 'management'
  | 'networking'
  | 'analytics'
  | 'containers'

type ChecklistLabEntry = {
  index: number
  title: string
  slug: string | null
  duration: string
  sectionId: ChecklistSectionId
  externalUrl: string | null
}

const CHECKLIST = resolve('STUDY-CHECKLIST.md')
const COURSE_INDEX = resolve('scripts/labs/course-index.json')
const OUT = resolve('data/labsChecklistOrder.ts')

const checklistSections: Array<{ id: ChecklistSectionId; label: string; sectionNum: number }> = [
  { id: 'compute', label: 'Compute', sectionNum: 3 },
  { id: 'storage', label: 'Storage', sectionNum: 4 },
  { id: 'security', label: 'Security, Identity & Compliance', sectionNum: 5 },
  { id: 'database', label: 'Database', sectionNum: 6 },
  { id: 'management', label: 'Management & Governance', sectionNum: 8 },
  { id: 'networking', label: 'Networking & Content Delivery', sectionNum: 9 },
  { id: 'analytics', label: 'Analytics', sectionNum: 10 },
  { id: 'containers', label: 'Containers', sectionNum: 12 },
]

const sectionNumToId = new Map(
  checklistSections.map((section) => [section.sectionNum, section.id]),
)

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const labUrl = (slug: string) => `https://business.whizlabs.com/labs/${slug}`

const courseIndex = JSON.parse(readFileSync(COURSE_INDEX, 'utf8')) as {
  labs: CourseLabEntry[]
}

const titleToSlug = new Map(
  courseIndex.labs.map((lab) => [normalize(lab.title), lab.slug]),
)

/** Video-course labs whose checklist titles differ from the 110-lab catalog */
const checklistLabOverrides = new Map<string, { slug: string }>([
  ['Creating an application load balancer from AWS CLI', { slug: 'creating-an-application-load-balancer-from-aws-cli' }],
  ['Creating an Application Load Balancer and Auto Scaling Group in AWS', { slug: 'creating-an-application-load-balancer-and-auto-scaling-group-in-aws' }],
  ['Creating and configuring a network load balancer in AWS', { slug: 'creating-and-configuring-a-network-load-balancer-in-aws' }],
  ['Creating S3 Lifecycle Policy', { slug: 'creating-an-s3-lifecycle-policy' }],
  ['Using CloudWatch for Resource Monitoring, Create CloudWatch Alarms and Dashboards', { slug: 'using-cloudwatch-for-resource-monitoring-create-cloudwatch-alarms-and-dashboards' }],
  ['Check Compliance status of S3 Bucket using AWS Config', { slug: 'check-compliance-status-of-s3-bucket-using-aws-config' }],
  ['Creating AWS VPC Flow Logs and Generating Traffic', { slug: 'creating-aws-vpc-flow-logs-and-generating-traffic' }],
  ['Perform ETL operation in Glue with S3', { slug: 'perform-etl-operation-in-glue-with-s3' }],
  ['Create a Docker container using Dockerfile and store the image in ECR', { slug: 'create-a-docker-container-using-dockerfile-and-store-the-image-in-ecr' }],
])

const INDEX_FILES = new Set(['course-index.json', 'checklist-index.json'])

const scrapedLabsByTitle = new Map<string, { slug: string }>()
readdirSync(resolve('scripts/labs'))
  .filter((file) => file.endsWith('.json') && !INDEX_FILES.has(file))
  .forEach((file) => {
    const lab = JSON.parse(readFileSync(join(resolve('scripts/labs'), file), 'utf8')) as {
      title: string
      slug: string
    }
    scrapedLabsByTitle.set(normalize(lab.title), { slug: lab.slug })
  })

const slugFromWhizlabsUrl = (url: string): string | null => {
  const match = url.match(/whizlabs\.com\/labs\/([^/?#]+)/)
  return match?.[1] ?? null
}

const resolveLabSlug = (title: string, slugFromUrl: string | null): string | null =>
  slugFromUrl
  ?? checklistLabOverrides.get(title)?.slug
  ?? scrapedLabsByTitle.get(normalize(title))?.slug
  ?? titleToSlug.get(normalize(title))
  ?? null

const markdown = readFileSync(CHECKLIST, 'utf8')
const lines = markdown.split('\n')

let currentSectionNum: number | null = null
const entries: ChecklistLabEntry[] = []

const sectionHeader = /^## (\d+)\.\s+/
const labPrefix = /^- \[[ x]\] 🧪 /

lines.forEach((line) => {
  const headerMatch = line.match(sectionHeader)
  if (headerMatch) {
    currentSectionNum = Number(headerMatch[1])
    return
  }

  if (!labPrefix.test(line) || currentSectionNum === null) return

  const sectionId = sectionNumToId.get(currentSectionNum)
  if (!sectionId) return

  const raw = line.replace(labPrefix, '').trim()
  const linked = /^\[(.+?)\]\((.+?)\)(?: \((.+?)\))?$/.exec(raw)
  const plain = linked ? null : /^(.+) \(([^)]+)\)$/.exec(raw)

  const title = (linked?.[1] ?? plain?.[1] ?? raw).trim()
  const linkedUrl = linked?.[2] ?? null
  const duration = (linked?.[3] ?? plain?.[2] ?? '').trim()

  const externalUrl = linkedUrl?.includes('whizlabs.com/labs/')
    ? linkedUrl
    : null
  const slugFromUrl = externalUrl ? slugFromWhizlabsUrl(externalUrl) : null
  const slug = resolveLabSlug(title, slugFromUrl)
  const resolvedExternalUrl = externalUrl ?? (slug ? labUrl(slug) : null)

  entries.push({
    index: entries.length + 1,
    title,
    slug,
    duration,
    sectionId,
    externalUrl: resolvedExternalUrl,
  })
})

const body = `// Auto-generated by scripts/generate-labs-checklist.ts — do not edit
export type ChecklistSectionId =
  | 'compute'
  | 'storage'
  | 'security'
  | 'database'
  | 'management'
  | 'networking'
  | 'analytics'
  | 'containers'

export type ChecklistLabEntry = {
  index: number
  title: string
  slug: string | null
  duration: string
  sectionId: ChecklistSectionId
  externalUrl: string | null
}

export const checklistSections: Array<{ id: ChecklistSectionId; label: string }> = ${JSON.stringify(
  checklistSections.map(({ id, label }) => ({ id, label })),
  null,
  2,
)}

/** Labs embedded in the video course outline (STUDY-CHECKLIST.md) */
export const labsChecklistTotal = ${entries.length}

export const labsChecklistOrder: ChecklistLabEntry[] = ${JSON.stringify(entries, null, 2)}
`

writeFileSync(OUT, body)
console.log(`Generated ${entries.length} checklist labs → ${OUT}`)
console.log(
  'Per section:',
  checklistSections
    .map((section) => {
      const count = entries.filter((entry) => entry.sectionId === section.id).length
      return count > 0 ? `${section.id}: ${count}` : null
    })
    .filter(Boolean)
    .join(', '),
)
