'use client'

import { FormEvent, Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Nav from '@/components/Nav'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

const messageFromError = (error: string | null): string => {
  if (error === 'missing_code') return 'Sign-in link missing code. Please request a new magic link.'
  if (error === 'exchange_failed') return 'Sign-in link expired or invalid. Please request a new magic link.'
  return ''
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const redirectPath = searchParams.get('next')
  const safeNextPath = redirectPath && redirectPath.startsWith('/') ? redirectPath : '/'
  const initialError = useMemo(
    () => messageFromError(searchParams.get('error')),
    [searchParams],
  )

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    const supabase = createSupabaseBrowserClient()
    const redirectUrl = new URL('/auth/callback', window.location.origin)
    redirectUrl.searchParams.set('next', safeNextPath)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl.toString(),
      },
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message)
      return
    }

    setStatus('sent')
  }

  return (
    <>
      <Nav />
      <main className="max-w-[640px] mx-auto px-4 pt-[calc(3.5rem+2rem)] pb-16">
        <div className="rounded-2xl border border-aws-border bg-aws-card p-6 sm:p-8">
          <p className="font-space-mono text-[0.62rem] uppercase tracking-[0.2em] text-c1 mb-2">
            Passwordless sign in
          </p>
          <h1 className="text-xl sm:text-2xl font-semibold text-aws-text mb-2">Magic Link Login</h1>
          <p className="text-sm text-aws-muted mb-6">
            Enter your email and we will send a secure sign-in link.
          </p>

          {initialError ? (
            <p className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {initialError}
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <label htmlFor="email" className="block text-[0.72rem] font-space-mono uppercase tracking-widest text-aws-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-aws-border bg-aws-bg px-3 py-2.5 text-base sm:text-[0.8rem] text-aws-text placeholder:text-aws-muted/70 outline-none focus:border-c1"
            />

            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center justify-center rounded-lg border border-c1/40 bg-c1/10 px-4 py-2 text-[0.72rem] font-space-mono uppercase tracking-widest text-c1 hover:bg-c1/20 disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending...' : 'Send magic link'}
            </button>
          </form>

          {status === 'sent' ? (
            <p className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              Magic link sent. Check your inbox (and spam) to continue.
            </p>
          ) : null}

          {status === 'error' ? (
            <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {errorMessage || 'Could not send magic link. Please try again.'}
            </p>
          ) : null}

          <p className="mt-6 text-xs text-aws-muted">
            Need to go back?{' '}
            <Link href="/" className="text-c1 hover:text-aws-text underline underline-offset-2">
              Return to home
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
