/**
 * Auth + menu glyphs. The `signin-arrow` / `signout-arrow` groups are the
 * animation targets — globals.css nudges them through the doorway on hover.
 */

type IconProps = { className?: string }

const svgBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function LogInIcon({ className = '' }: IconProps) {
  return (
    <svg width="14" height="14" {...svgBase} className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <g className="signin-arrow">
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </g>
    </svg>
  )
}

export function LogOutIcon({ className = '' }: IconProps) {
  return (
    <svg width="14" height="14" {...svgBase} className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <g className="signout-arrow">
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </g>
    </svg>
  )
}

export function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      {...svgBase}
      className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
