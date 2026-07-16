# Navbar SaaS Redesign — Design Spec

**Date:** 2026-06-17
**Status:** Approved, ready for planning
**Component:** `components/Nav.tsx` and new `components/nav/*`

## Goal

Restructure the header navbar from a single overflowing scroll-row into a
proper SaaS three-zone top bar, declutter the AWS domain links into a
dropdown, and give the auth state (sign in / signed-in) a polished,
animated treatment.

## Problem

The current desktop nav (`components/Nav.tsx`) is one horizontal
overflow-scrolling row that mixes three unrelated concerns:

1. Internal page links (Cheat Sheet, Deep Notes, Practice, Scenarios,
   Visual, VPC, Labs, Ask AI)
2. AWS domain category jump-links (`navDomains` — Compute, Storage,
   Networking, etc.), which consume most of the horizontal space
3. Auth controls (Sign in / Sign out), jammed inline with content links

The result reads as a hobby project, not a product. Adding the new auth
controls made it more cramped.

## Design

### Zone 1 — Brand (left)

`AWS SAA-C03` wordmark, unchanged target (`/about`), unchanged styling
intent (mono, cyan `c1`, bold).

### Zone 2 — Primary nav (center-left)

The internal page links, in this order:

- Cheat Sheet (`/`) — public
- Deep Notes (`/learn`) — public
- **Browse Services ▾** — dropdown trigger (replaces the inline domain links)
- Practice (`/practice`) — protected (signed-in only)
- Scenarios (`/scenarios`) — protected
- Visual (`/visual`) — public
- VPC Guide (`/vpc`) — public
- Labs (`/labs`) — protected
- ✦ Ask AI (`/ai`) — protected (keeps existing sparkle icon link)

Auth gating logic is unchanged from today: protected links render only when
`userEmail` is truthy.

### Zone 3 — Account / actions (right)

- **Signed out:** an animated **Sign in** button (see Animation below),
  links to `/auth/login`.
- **Signed in:** an **avatar + dropdown** (see Account menu below).

### Browse Services dropdown

- Trigger: `Browse Services ▾` button in primary nav.
- On click, opens a mega-menu panel anchored below the trigger:
  - Background `aws-card`, `aws-border`, rounded, subtle shadow/backdrop.
  - Content is the **existing `navDomains` data** rendered grouped: each
    domain shows its label (in `domain.colorClass`) followed by its service
    pills (`domain.items`, using `item.className`). Same anchors as today.
- Closes on outside-click and on `Escape`.
- Accessible: trigger has `aria-expanded`, panel dismissible by keyboard.

### Animated Sign-in button

- Hand-crafted with CSS keyframes + inline SVG (no new dependency, no
  external tool). Matches the existing sparkle-animation approach in
  `app/globals.css`.
- Visual: button styled like the existing accent action
  (`border-c1/40 bg-c1/10 text-c1`, mono uppercase label), with an inline
  "enter" glyph (an arrow moving into a doorway).
- Interaction: on hover/focus the arrow slides into the doorway via a CSS
  keyframe; idle state is static.
- Respects `prefers-reduced-motion: reduce` — animation disabled, glyph
  shown in its resting state (mirrors the existing reduced-motion block in
  `globals.css`).

### Account menu (signed-in)

- **Avatar:** circular, shows the first letter of `userEmail` uppercased,
  on a cyan (`c1`) tint background, `aws-text` foreground.
- **Dropdown:** opens on click below the avatar:
  - Top: full email address, muted (`aws-muted`), not interactive.
  - Divider (`aws-border`).
  - **Sign out** item — uses the same door glyph (arrow exiting), runs the
    existing `handleSignOut` (calls `supabase.auth.signOut()`, clears state,
    redirects to `/`).
- Closes on outside-click and `Escape`. Trigger has `aria-expanded`.

### Mobile (hamburger drawer)

Keep the existing drawer mechanism; reorganize its contents top-to-bottom:

1. **Account block** at the very top:
   - Signed in: avatar + email, plus a Sign out row.
   - Signed out: the animated Sign in button (full-width).
2. **Page links** (same public/protected gating as desktop).
3. **Browse Services** as a section/heading followed by the domain groups
   (the domains already render in the drawer today — keep that, just place
   them under a clear "Browse Services" label).

### Preserved behaviors

- `viewTransitionName: 'site-header'` on both nav elements (desktop +
  mobile) — keep, so the header view-transition continues to work.
- `FloatingSearch` continues to render from `Nav` as today.
- `navTransitionTypes(pathname, href)` page-transition wiring on links.
- The `nav-scroll` hide-scrollbar utility may become unnecessary on desktop
  once the domain links move into the dropdown; keep it only if the primary
  nav can still overflow on narrow desktop widths.

## Component structure

`Nav.tsx` is ~288 lines doing too much. Split into focused units:

- `components/Nav.tsx` — orchestrator: holds auth state (`userEmail`,
  `handleSignOut`), menu open/close state coordination, renders desktop +
  mobile shells.
- `components/nav/BrowseServicesMenu.tsx` — the dropdown trigger + panel,
  consumes `navDomains`.
- `components/nav/AccountMenu.tsx` — avatar + dropdown; props: `email`,
  `onSignOut`.
- `components/nav/SignInButton.tsx` — the animated sign-in button.
- `PageLink` and `AskAINavLink` / `AskAISparkleIcon` stay in `Nav.tsx` or
  move to `components/nav/` alongside the others — implementer's call,
  keep them co-located with their only consumer.

New CSS keyframes for the sign-in/sign-out glyph live in `app/globals.css`
beside the existing sparkle keyframes, with a matching `prefers-reduced-motion`
entry.

## Design tokens (existing, reuse)

- `aws-bg #0a0e1a`, `aws-card #111827`, `aws-border #1e2d40`,
  `aws-text #e2e8f0`, `aws-muted #64748b`
- Accent `c1 #00d4ff` (cyan); domain colors `c2`–`c6` already applied via
  `domain.colorClass` / `item.className`.
- Fonts: `font-inter` (body), `font-space-mono` (labels).

## Out of scope

- No changes to auth logic, routes, middleware, or Supabase wiring.
- No changes to the search component's behavior.
- No new runtime dependencies (no Lottie, no SVGator runtime).

## Success criteria

- Desktop nav no longer horizontally overflows under normal widths; AWS
  domain links are reachable via `Browse Services` dropdown.
- Signed-out users see an animated Sign in button; signed-in users see an
  avatar that opens a dropdown with their email and a working Sign out.
- Protected links remain hidden when logged out, visible when logged in.
- Mobile drawer leads with the account block.
- Animations respect `prefers-reduced-motion`.
- Existing header view-transition and page transitions still work.
