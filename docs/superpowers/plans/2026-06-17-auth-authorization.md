# Auth & Authorization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gate interactive features (practice, AI, labs, scenarios, bookmarks) behind Supabase auth while keeping reference content publicly accessible.

**Architecture:** A single Next.js middleware reads the Supabase session cookie and redirects unauthenticated users to `/auth/login` for protected routes. API routes return 401 JSON instead of redirecting. The Nav component shows a dynamic sign-in/sign-out link.

**Tech Stack:** Next.js 16.2.4, `@supabase/ssr` 0.12.x, `@supabase/supabase-js` 2.108.x, edge runtime

## Global Constraints

- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (already set in `.env.local`)
- Edge runtime compatible — no Node.js-only APIs in middleware
- Follow existing code patterns: `createServerClient` from `@supabase/ssr`, cookie-based sessions
- Mobile inputs must use `text-base sm:text-[<size>]` pattern (CLAUDE.md)
- No `switch` statements — use object maps or conditionals
- No `any` type — use `unknown`

---

### Task 1: Create Supabase Middleware Client

**Files:**
- Create: `lib/supabase/middleware.ts`

**Interfaces:**
- Consumes: `@supabase/ssr` `createServerClient`, env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Produces: `createSupabaseMiddlewareClient(request: NextRequest): { supabase: SupabaseClient, response: NextResponse }` — used by Task 2's middleware

- [ ] **Step 1: Create the middleware Supabase client**

This client reads/writes cookies from the Next.js `NextRequest`/`NextResponse` objects, which is different from the server client (which uses `next/headers` cookies).

```typescript
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export function createSupabaseMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  return { supabase, response }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | grep middleware`
Expected: No errors for `lib/supabase/middleware.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/middleware.ts
git commit -m "feat: add Supabase middleware client for cookie-based auth in Next.js middleware"
```

---

### Task 2: Create Auth Middleware

**Files:**
- Create: `middleware.ts` (project root)

**Interfaces:**
- Consumes: `createSupabaseMiddlewareClient` from `lib/supabase/middleware.ts`
- Produces: Middleware that intercepts all matched requests. Protected page routes redirect to `/auth/login?next={path}`. Protected API routes return `{ error: "Unauthorized" }` with status 401.

- [ ] **Step 1: Create the middleware**

```typescript
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware'

const PROTECTED_PAGES = ['/practice', '/ai', '/labs', '/scenarios']
const PROTECTED_API = ['/api/questions', '/api/ai', '/api/labs']

function isProtectedPage(pathname: string): boolean {
  return PROTECTED_PAGES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

function isProtectedApi(pathname: string): boolean {
  return PROTECTED_API.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request)
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  if (isProtectedApi(pathname) && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (isProtectedPage(pathname) && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|xml|txt|webmanifest)$).*)',
  ],
}
```

The `matcher` excludes static assets and image files so middleware only runs on page/API routes. `getUser()` validates the session server-side (not just checking the cookie exists).

- [ ] **Step 2: Test protected page redirect (manual)**

Run: `npx next dev --port 3000`

1. Open `http://localhost:3000/practice` in an incognito window (no session)
2. Expected: Redirects to `/auth/login?next=/practice`
3. Open `http://localhost:3000/` (public route)
4. Expected: Loads normally, no redirect

- [ ] **Step 3: Test protected API returns 401 (manual)**

Run (in a separate terminal):
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/questions
```
Expected: `401`

```bash
curl -s http://localhost:3000/api/questions
```
Expected: `{"error":"Unauthorized"}`

- [ ] **Step 4: Commit**

```bash
git add middleware.ts
git commit -m "feat: add auth middleware — protect practice, AI, labs, scenarios routes"
```

---

### Task 3: Update Nav with Auth State

**Files:**
- Modify: `components/Nav.tsx`

**Interfaces:**
- Consumes: `createSupabaseBrowserClient` from `lib/supabase/browser.ts`
- Produces: Nav shows "Sign in" link when logged out, user email + "Sign out" button when logged in. The static "Login" link is replaced with dynamic auth state.

- [ ] **Step 1: Add auth state hook to Nav**

Add imports and auth state at the top of the `Nav` component:

Replace:
```typescript
export default function Nav({ activePage = 'cheatsheet' }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
```

With:
```typescript
export default function Nav({ activePage = 'cheatsheet' }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null)
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    setUserEmail(null)
    window.location.href = '/'
  }
```

Add to imports:
```typescript
import { useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
```

Update the `useState` import to include `useEffect`:
```typescript
import { useState, useEffect, type CSSProperties } from 'react'
```

- [ ] **Step 2: Replace static Login link in desktop nav**

Replace the desktop nav Login `PageLink`:
```typescript
<PageLink pathname={pathname} href="/auth/login" label="Login" active={activePage === 'auth'} />
```

With:
```typescript
{userEmail ? (
  <button
    onClick={handleSignOut}
    className="font-space-mono text-[0.6rem] uppercase tracking-widest px-2 py-1 rounded-md border border-transparent text-aws-muted hover:text-aws-text hover:bg-white/5 transition-all whitespace-nowrap"
  >
    Sign out
  </button>
) : (
  <PageLink pathname={pathname} href="/auth/login" label="Sign in" active={activePage === 'auth'} />
)}
```

- [ ] **Step 3: Replace static Login link in mobile drawer**

In the mobile drawer page links array, replace:
```typescript
{ href: '/auth/login',label: 'Login',       icon: '🔐', active: activePage === 'auth' },
```

With a conditional render. After the `.map()` closing, add the sign-out button for logged-in users. Replace the entire mobile drawer page links section (the `{[...].map(...)}` block) with:

```typescript
{[
  { href: '/',          label: 'Cheat Sheet', icon: '📋', active: activePage === 'cheatsheet' },
  { href: '/learn',     label: 'Deep Notes',  icon: '📖', active: activePage === 'learn' },
  { href: '/practice',  label: 'Practice',    icon: '✏️', active: activePage === 'practice' },
  { href: '/scenarios', label: 'Scenarios',   icon: '🏗️', active: activePage === 'scenarios' },
  { href: '/visual',    label: 'Visual',      icon: '🗺️', active: activePage === 'visual' },
  { href: '/vpc',       label: 'VPC Guide',   icon: '🏘️', active: activePage === 'vpc' },
  { href: '/labs',      label: 'Labs',        icon: '🧪', active: activePage === 'labs' },
  ...(userEmail
    ? []
    : [{ href: '/auth/login', label: 'Sign in', icon: '🔐', active: activePage === 'auth' }]),
  { href: '/ai',        label: 'Ask AI',      icon: '✦',  active: activePage === 'ai' },
].map((p) => (
  <Link
    key={p.href}
    href={p.href}
    transitionTypes={navTransitionTypes(pathname, p.href)}
    onClick={() => setMenuOpen(false)}
    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all ${
      p.active
        ? 'bg-white/8 text-aws-text'
        : 'text-aws-muted hover:bg-white/4 hover:text-aws-text'
    }`}
  >
    {p.href === '/ai' ? (
      <AskAISparkleIcon size="drawer" />
    ) : (
      <span className="text-base leading-none">{p.icon}</span>
    )}
    <span className="font-space-mono text-[0.68rem] uppercase tracking-widest">{p.label}</span>
    {p.active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-c1" />}
  </Link>
))}
{userEmail && (
  <button
    onClick={async () => { await handleSignOut(); setMenuOpen(false) }}
    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all text-aws-muted hover:bg-white/4 hover:text-aws-text"
  >
    <span className="text-base leading-none">👋</span>
    <span className="font-space-mono text-[0.68rem] uppercase tracking-widest">Sign out</span>
  </button>
)}
```

- [ ] **Step 4: Remove 'auth' from NavProps activePage**

It's no longer needed since the login link is conditionally rendered. Remove `'auth'` from the union type:

```typescript
interface NavProps {
  activePage?: 'cheatsheet' | 'learn' | 'practice' | 'scenarios' | 'visual' | 'vpc' | 'labs' | 'ai'
}
```

Also update `app/auth/login/page.tsx` to remove `activePage="auth"` from the `<Nav>` usage (just use `<Nav />`).

- [ ] **Step 5: Test manually**

1. Open `http://localhost:3000/` — verify "Sign in" link appears in nav
2. Click "Sign in" — verify login page loads
3. Log in via magic link — verify nav shows "Sign out" instead of "Sign in"
4. Click "Sign out" — verify redirects to `/` and shows "Sign in" again
5. Test mobile nav: same flow in the mobile drawer

- [ ] **Step 6: Build check**

Run: `npx next build`
Expected: Build succeeds with no errors

- [ ] **Step 7: Commit**

```bash
git add components/Nav.tsx app/auth/login/page.tsx
git commit -m "feat: show dynamic sign-in/sign-out in Nav based on auth state"
```
