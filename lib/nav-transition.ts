/** Primary nav order (left → right) for directional view transitions. */
export const PRIMARY_NAV_PATHS = [
  '/',
  '/learn',
  '/practice',
  '/scenarios',
  '/visual',
  '/vpc',
  '/ai',
] as const

const normalizePath = (path: string): string => {
  const base = path.split('?')[0]?.split('#')[0] ?? '/'
  if (base === '/') return '/'
  return base.replace(/\/$/, '') || '/'
}

/** Maps nav clicks to Next.js Link `transitionTypes` (see view-transitions guide). */
export function navTransitionTypes(fromPath: string, toHref: string): string[] {
  const from = normalizePath(fromPath)
  const to = normalizePath(toHref)
  const fromIdx = PRIMARY_NAV_PATHS.indexOf(from as (typeof PRIMARY_NAV_PATHS)[number])
  const toIdx = PRIMARY_NAV_PATHS.indexOf(to as (typeof PRIMARY_NAV_PATHS)[number])

  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) {
    return ['nav-forward']
  }

  return [toIdx > fromIdx ? 'nav-forward' : 'nav-back']
}
