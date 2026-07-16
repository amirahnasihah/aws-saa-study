import type { Lab, LabDBRow } from '@/lib/labs'
import { rowToLab } from '@/lib/labs'

let labsCache: Lab[] | null = null

export const loadLabsFallback = async (request: Request): Promise<Lab[]> => {
  if (labsCache) return labsCache
  const res = await fetch(new URL('/data/labs-fallback.json', request.url))
  if (!res.ok) throw new Error(`labs fallback unavailable (${res.status})`)
  labsCache = (await res.json()) as Lab[]
  return labsCache
}

export const findLabFromStatic = async (request: Request, slug: string): Promise<Lab | undefined> => {
  const labs = await loadLabsFallback(request)
  return labs.find((lab) => lab.slug === slug)
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
export const mergeLabsWithDatabase = (rows: LabDBRow[], catalog: Lab[]): Lab[] => {
  const bySlug = new Map(catalog.map((lab) => [lab.slug, lab]))
  rows.forEach((row) => {
    const existing = bySlug.get(row.slug)
    bySlug.set(row.slug, mergeLabRowWithCatalog(row, existing))
  })
  return [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title))
}
