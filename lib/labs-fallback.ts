import { labs as manualLabs } from '@/data/labs'
import { labsCatalog } from '@/data/labsCatalog'
import type { Lab } from '@/lib/labs'

export const allLabsFallback = (): Lab[] => {
  const bySlug = new Map<string, Lab>()
  labsCatalog.forEach((lab) => bySlug.set(lab.slug, lab))
  manualLabs.forEach((lab) => bySlug.set(lab.slug, lab))
  return [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title))
}

export const findLabFallback = (slug: string): Lab | undefined =>
  allLabsFallback().find((lab) => lab.slug === slug)
