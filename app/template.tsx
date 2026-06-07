import { ViewTransition } from 'react'

/**
 * Next.js App Router template — remounts on navigation (see template.js docs).
 * ViewTransition + experimental.viewTransition in next.config.ts (official guide:
 * /docs/app/guides/view-transitions).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{
        'nav-forward': 'nav-forward',
        'nav-back': 'nav-back',
        default: 'page-fade',
      }}
      exit={{
        'nav-forward': 'nav-forward',
        'nav-back': 'nav-back',
        default: 'page-fade',
      }}
      default="page-fade"
    >
      {children}
    </ViewTransition>
  )
}
