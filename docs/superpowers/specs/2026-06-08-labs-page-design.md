# Labs Page Design

## Purpose

A new `/labs` section that doubles as a personal log of hands-on guided labs
completed while studying for SAA-C03, and a lightweight replication guide —
written in your own words, with no reference to the originating platform's
branding (avoids copyright concerns; framed entirely as personal study notes).

## Routes

- `/labs` — index page listing all completed labs as cards
- `/labs/[slug]` — detail page per lab (e.g. `/labs/ec2-intro`)

## Data model

New file `data/labs.ts`, following the existing pattern of `data/scenarios.ts`
(a typed array of plain objects, no DB):

```ts
export type LabTask = {
  title: string
  steps: string[]
}

export type Lab = {
  slug: string
  title: string                // "Introduction to Amazon EC2"
  level: 'Fundamental' | 'Intermediate' | 'Advanced'
  services: string[]           // ['EC2', 'VPC', 'IAM'] — tag pills
  summary: string              // 1-2 line description for the card
  duration: string             // "00:30:00"
  completedOn: string          // "2026-06-08"
  tasks: LabTask[]             // step-by-step breakdown, your own words
  takeaways: string[]          // "what I learned" — personal-notes angle
}

export const labs: Lab[] = [ /* seeded with the EC2 lab to start */ ]
```

No platform name appears anywhere in data or copy — labs are described
generically as "guided lab" / "hands-on lab."

## Index page (`/labs`)

- Hero block matching the `/vpc` pattern: small eyebrow label, `<h1>`Labs`</h1>`,
  short description ("Hands-on labs I've completed while studying for
  SAA-C03 — steps, gotchas, and what I'd do differently next time.")
- Card grid below, one card per lab:
  - Title, level badge, service tag pills (reuse pill styling from
    `Nav`'s `navDomains` items)
  - Summary line, duration, completed date
  - Whole card links to `/labs/[slug]`
- `SiteFooter` at the bottom

## Detail page (`/labs/[slug]`)

Long single-page layout with anchor navigation, following the `/vpc`
section-anchor pattern (rather than an accordion/tabs):

- Hero: title, level badge, service pills, duration, completed date
- Anchor nav linking to each task (Task 1, Task 2, …)
- Each task rendered as a numbered section with steps as an ordered list
- Final "What I learned" section rendered from `takeaways`
- Back-to-`/labs` link
- `SiteFooter`

## Navigation & footer

- Add `'labs'` to `Nav`'s `activePage` union; add a `Labs` entry to both the
  desktop nav bar and the mobile drawer's page-link list, alongside
  Practice/Scenarios/Visual/VPC Guide
- Add a hardcoded `Labs` link to `SiteFooter` itself (next to the existing
  "Built by" line), so it's visible site-wide as requested — phrased as
  something like `Labs · hands-on practice notes`

## Initial content

Seed `data/labs.ts` with one entry: the EC2 fundamentals lab (provisioning a
VPC, launching an EC2 instance, SSH access, installing Apache, publishing a
test page), rewritten in first-person/personal-notes voice. More labs will be
added the same way as they're completed.
