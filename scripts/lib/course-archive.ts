import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { join, resolve } from 'path'
import { labsTopicOrder, type LabTopicId } from '../../data/labsTopicOrder'
export type VideoIndexEntry = {
  index: number
  title: string
  section: string
  orderBy: number
  duration: string | null
  videoId: number | null
  layoutId: number | null
  vimeoId: string | null
  url: string
  status: string | null
}

export const DEFAULT_ARCHIVE_DIR = join(homedir(), 'Documents', 'aws-saa-course')

const VIDEO_SECTION_FOLDERS: Array<{ section: string; folder: string }> = [
  { section: 'Introduction', folder: '01-introduction' },
  { section: 'Getting Started With AWS', folder: '02-getting-started-with-aws' },
  { section: 'Compute', folder: '03-compute' },
  { section: 'Storage', folder: '04-storage' },
  { section: 'Securtity, Identity and Compliance', folder: '05-security-identity-and-compliance' },
  { section: 'Security, Identity and Compliance', folder: '05-security-identity-and-compliance' },
  { section: 'Database', folder: '06-database' },
  { section: 'Machine Learning', folder: '07-machine-learning' },
  { section: 'Management and Governance', folder: '08-management-and-governance' },
  { section: 'Networking & Content Delivery', folder: '09-networking-and-content-delivery' },
  { section: 'Analytics', folder: '10-analytics' },
  { section: 'Application Integration', folder: '11-application-integration' },
  { section: 'Containers', folder: '12-containers' },
  { section: 'Migration & Transfer', folder: '13-migration-and-transfer' },
  { section: 'AWS Cost Management', folder: '14-aws-cost-management' },
]

const TOPIC_ID_FOLDERS: Record<LabTopicId, string> = {
  compute: '03-compute',
  storage: '04-storage',
  security: '05-security-identity-and-compliance',
  database: '06-database',
  management: '08-management-and-governance',
  networking: '09-networking-and-content-delivery',
  analytics: '10-analytics',
  integration: '11-application-integration',
  containers: '12-containers',
  challenges: '15-challenges',
  projects: '16-projects',
}

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const sectionFolder = (section: string, order: number): string => {
  const known = VIDEO_SECTION_FOLDERS.find((row) => row.section === section)?.folder
  if (known) return known
  const prefix = String(order).padStart(2, '0')
  return `${prefix}-${slugify(section)}`
}

const sectionOrderFromVideos = (videos: VideoIndexEntry[]): Map<string, string> => {
  const seen = new Map<string, string>()
  let order = 1
  videos.forEach((video) => {
    if (seen.has(video.section)) return
    seen.set(video.section, sectionFolder(video.section, order))
    order += 1
  })
  return seen
}

const writeTopicReadme = (folderPath: string, section: string, videos: VideoIndexEntry[]): void => {
  const lines = [
    `# ${section}`,
    '',
    `${videos.length} lecture(s)`,
    '',
    ...videos.map((video) => {
      const duration = video.duration ? ` (${video.duration})` : ''
      return `${video.index}. [${video.title}](${video.url})${duration}`
    }),
    '',
  ]
  writeFileSync(join(folderPath, 'README.md'), `${lines.join('\n')}\n`)
}

export type VideoArchiveIndex = {
  discoveredAt: string
  courseUrl: string
  total: number
  videos: VideoIndexEntry[]
}

export const exportVideoArchive = (index: VideoArchiveIndex, outDir: string): void => {
  const root = resolve(outDir)
  mkdirSync(root, { recursive: true })

  const sectionFolders = sectionOrderFromVideos(index.videos)
  const bySection = new Map<string, VideoIndexEntry[]>()

  index.videos.forEach((video) => {
    const bucket = bySection.get(video.section) ?? []
    bucket.push(video)
    bySection.set(video.section, bucket)
  })

  const sectionsManifest = [...bySection.entries()].map(([section, videos]) => ({
    section,
    folder: sectionFolders.get(section) ?? slugify(section),
    videoCount: videos.length,
  }))

  writeFileSync(
    join(root, 'course-manifest.json'),
    `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      courseUrl: index.courseUrl,
      discoveredAt: index.discoveredAt,
      totalVideos: index.total,
      sections: sectionsManifest,
    }, null, 2)}\n`,
  )

  bySection.forEach((videos, section) => {
    const folderName = sectionFolders.get(section) ?? slugify(section)
    const topicDir = join(root, folderName)
    const videosDir = join(topicDir, 'videos')
    mkdirSync(videosDir, { recursive: true })

    writeFileSync(
      join(topicDir, 'index.json'),
      `${JSON.stringify({ section, folder: folderName, videos }, null, 2)}\n`,
    )
    writeTopicReadme(topicDir, section, videos)

    videos.forEach((video) => {
      const fileName = `${String(video.index).padStart(3, '0')}-${slugify(video.title)}.json`
      writeFileSync(join(videosDir, fileName), `${JSON.stringify(video, null, 2)}\n`)
    })
  })

  writeFileSync(join(root, 'video-index.json'), `${JSON.stringify(index, null, 2)}\n`)
  console.log(`  Video archive → ${root} (${index.total} videos, ${sectionsManifest.length} topic folders)`)
}

const copyDir = (source: string, dest: string): void => {
  if (!existsSync(source)) return
  mkdirSync(dest, { recursive: true })
  cpSync(source, dest, { recursive: true })
}

export const mirrorLabsArchive = (outDir: string): { mirrored: number; skipped: number } => {
  const root = resolve(outDir)
  const labsJsonDir = resolve('scripts/labs')
  const labsPublicDir = resolve('public/labs')
  let mirrored = 0
  let skipped = 0

  const manifest: Array<{
    slug: string
    title: string
    topicId: LabTopicId
    folder: string
    hasJson: boolean
    imageCount: number
  }> = []

  labsTopicOrder.forEach((entry) => {
    if (!entry.slug) {
      skipped += 1
      return
    }

    const topicFolder = TOPIC_ID_FOLDERS[entry.topicId]
    const labDir = join(root, topicFolder, 'labs', entry.slug)
    const jsonSource = join(labsJsonDir, `${entry.slug}.json`)
    const imagesSource = join(labsPublicDir, entry.slug)

    if (!existsSync(jsonSource)) {
      skipped += 1
      return
    }

    mkdirSync(labDir, { recursive: true })
    cpSync(jsonSource, join(labDir, 'lab.json'))
    copyDir(imagesSource, join(labDir, 'images'))

    const imageCount = existsSync(imagesSource)
      ? readdirSync(imagesSource).filter((name) => /\.(png|jpe?g|gif|webp)$/i.test(name)).length
      : 0

    manifest.push({
      slug: entry.slug,
      title: entry.title,
      topicId: entry.topicId,
      folder: topicFolder,
      hasJson: true,
      imageCount,
    })
    mirrored += 1
  })

  writeFileSync(join(root, 'labs-manifest.json'), `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    mirrored,
    skipped,
    labs: manifest,
  }, null, 2)}\n`)

  console.log(`  Labs mirrored → ${root} (${mirrored} labs, ${skipped} skipped)`)
  return { mirrored, skipped }
}

export const exportCourseArchive = (
  index: VideoArchiveIndex,
  outDir: string,
  options: { mirrorLabs: boolean },
): void => {
  exportVideoArchive(index, outDir)
  if (options.mirrorLabs) {
    mirrorLabsArchive(outDir)
  }
}
