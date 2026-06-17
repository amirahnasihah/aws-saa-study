import type { Lab } from '@/lib/labs'

export type LabRowItem = {
  index: number
  title: string
  slug: string | null
  duration: string
  lab: Lab | null
  available: boolean
  source: 'course' | 'video' | 'checklist' | 'library'
  externalUrl?: string | null
  subtitle?: string
}

export const formatLabDuration = (courseDuration: string, labDuration: string): string => {
  if (courseDuration.trim()) return courseDuration
  const hhmm = labDuration.match(/^(\d{2}):(\d{2})/)
  if (!hhmm) return labDuration
  const hours = Number(hhmm[1])
  const mins = Number(hhmm[2])
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}
