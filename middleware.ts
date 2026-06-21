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

function hasSupabaseSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some(({ name }) => name.startsWith('sb-'))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/auth/')) {
    return NextResponse.next()
  }

  const needsAuthCheck =
    isProtectedPage(pathname) ||
    isProtectedApi(pathname) ||
    hasSupabaseSessionCookie(request)

  if (!needsAuthCheck) {
    return NextResponse.next()
  }

  const { supabase, response } = createSupabaseMiddlewareClient(request)
  const { data: { user } } = await supabase.auth.getUser()

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
