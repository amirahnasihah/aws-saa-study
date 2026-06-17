# Auth & Authorization Design

## Purpose

Add a lightweight auth layer so interactive features (practice, AI, labs, scenarios, bookmarks) require login, while reference content stays publicly accessible. Single user (the owner), no roles or permissions system.

## Route Classification

### Public (no auth required)

| Route | Page |
|-------|------|
| `/` | Cheat Sheet |
| `/learn` | Deep Notes |
| `/glossary` | Glossary |
| `/visual` | Visual |
| `/vpc` | VPC Guide |
| `/about` | About |
| `/changelog` | Changelog |
| `/auth/login` | Login page |
| `/auth/callback` | Auth callback |
| `/pwa` | PWA manifest |

### Protected (auth required)

| Route | Page |
|-------|------|
| `/practice` | Practice quizzes |
| `/ai` | AI Chat |
| `/labs` | Labs (index + detail) |
| `/labs/[slug]` | Lab detail |
| `/scenarios` | Scenarios |
| Bookmarks panel | Save/view bookmarks |

### API Routes

| Route | Auth? | Reason |
|-------|-------|--------|
| `/api/questions` | Yes | Serves quiz data for practice |
| `/api/ai/*` | Yes | AI explain/chat/hint endpoints |
| `/api/labs/*` | Yes | Lab content |

## Auth Flow

- **Provider**: Supabase Auth with magic link (OTP via email)
- **Session**: Cookie-based via `@supabase/ssr` (already configured)
- **Login page**: `/auth/login` (already built)
- **Callback**: `/auth/callback` exchanges code for session (already built)

## Implementation Approach: Next.js Middleware

A single `middleware.ts` at the project root:

1. Check if the request path matches a protected route
2. If protected: read the Supabase session from cookies
3. If no valid session: redirect to `/auth/login?next={original_path}`
4. If valid session: continue
5. Public routes: pass through without any check

**Protected route matching**: Use a prefix list (`/practice`, `/ai`, `/labs`, `/scenarios`, `/api/questions`, `/api/ai`, `/api/labs`). Everything else is public by default.

**API routes**: Return 401 JSON response instead of redirecting to login.

## Supabase Client Updates

The existing `lib/supabase/server.ts` and `lib/supabase/browser.ts` are already configured. The middleware needs its own client variant that can read/write cookies from the `NextRequest`/`NextResponse` objects.

Add `lib/supabase/middleware.ts` — a thin wrapper using `createServerClient` with request/response cookie adapters.

## UI Changes

### Nav Component

- Add a small auth indicator (login/logout link) to the Nav bar
- When logged in: show email or avatar + logout button
- When not logged in: show "Sign in" link
- Keep it minimal — a text link in the nav, not a full user menu

### Protected Page Behavior

- Middleware handles the redirect, so protected pages don't need auth checks in their own code
- Bookmarks hooks (`useBookmarks`, `useAnswerBookmarks`) will be refactored separately to use Supabase instead of localStorage — that's a follow-up task, not part of this auth PR

### Login Page Redirect

Already handles `?next=` param to redirect back after login. No changes needed.

## What This Does NOT Include

- No roles or permissions — single user
- No sign-up restrictions — magic link only, you control who gets links
- No admin panel
- No bookmark migration to Supabase (separate task)
- No middleware for static assets or `_next` paths

## File Changes Summary

| File | Change |
|------|--------|
| `middleware.ts` (new) | Route protection logic |
| `lib/supabase/middleware.ts` (new) | Middleware Supabase client |
| `components/Nav.tsx` | Add auth indicator (sign in / sign out) |
| `app/auth/login/page.tsx` | No changes needed |
| `app/auth/callback/route.ts` | No changes needed |
