import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const rawNext = requestUrl.searchParams.get('next')
  const nextPath = rawNext && rawNext.startsWith('/') ? rawNext : '/'

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=missing_code', requestUrl.origin))
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const redirectUrl = new URL('/auth/login', requestUrl.origin)
    redirectUrl.searchParams.set('error', 'exchange_failed')
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin))
}
