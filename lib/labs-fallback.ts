import { labs as manualLabs } from '@/data/labs'
import { labsCatalog } from '@/data/labsCatalog'
import type { Lab, LabDBRow } from '@/lib/labs'
import { rowToLab } from '@/lib/labs'

export const allLabsFallback = (): Lab[] => {
  const bySlug = new Map<string, Lab>()
  labsCatalog.forEach((lab) => bySlug.set(lab.slug, lab))
  manualLabs.forEach((lab) => bySlug.set(lab.slug, lab))
  return [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title))
}

export const mergeLabRowWithCatalog = (row: LabDBRow, catalog?: Lab): Lab => {
  const fromDb = rowToLab(row)
  if (!catalog) return fromDb
  return {
    ...catalog,
    completedOn: fromDb.completedOn ?? catalog.completedOn,
    summary: fromDb.summary.trim() ? fromDb.summary : catalog.summary,
    takeaways: fromDb.takeaways.length ? fromDb.takeaways : catalog.takeaways,
  }
}

/** Catalog is source of truth for scraped steps; D1 overlays completion notes. */
export const mergeLabsWithDatabase = (rows: LabDBRow[]): Lab[] => {
  const catalog = allLabsFallback()
  const bySlug = new Map(catalog.map((lab) => [lab.slug, lab]))
  rows.forEach((row) => {
    const existing = bySlug.get(row.slug)
    bySlug.set(row.slug, mergeLabRowWithCatalog(row, existing))
  })
  return [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title))
}

export const findLabFallback = (slug: string): Lab | undefined =>
  allLabsFallback().find((lab) => lab.slug === slug)
