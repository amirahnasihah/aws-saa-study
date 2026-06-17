'use client'

import { FormEvent, Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

const messageFromError = (error: string | null): string => {
  if (error === 'missing_code') return 'Sign-in link missing code. Please try again.'
  if (error === 'exchange_failed') return 'Sign-in failed. Please try again.'
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
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [status, setStatus] = useState<'idle' | 'sending' | 'verifying' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const redirectPath = searchParams.get('next')
  const safeNextPath = redirectPath && redirectPath.startsWith('/') ? redirectPath : '/'
  const initialError = useMemo(
    () => messageFromError(searchParams.get('error')),
    [searchParams],
  )

  const onSendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        setErrorMessage('Email rate limited — if you have a code, enter it below.')
        setStatus('idle')
        setStep('code')
        return
      }
      setStatus('error')
      setErrorMessage(error.message)
      return
    }

    setStatus('idle')
    setStep('code')
  }

  const onVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('verifying')
    setErrorMessage('')

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message)
      return
    }

    router.push(safeNextPath)
  }

  return (
    <>
      <Nav />
      <main className="max-w-[640px] mx-auto px-4 pt-[calc(3.5rem+2rem)] pb-16">
        <div className="rounded-2xl border border-aws-border bg-aws-card p-6 sm:p-8">
          <p className="font-space-mono text-[0.62rem] uppercase tracking-[0.2em] text-c1 mb-2">
            Passwordless sign in
          </p>
          <h1 className="text-xl sm:text-2xl font-semibold text-aws-text mb-2">
            {step === 'email' ? 'Sign In' : 'Enter Code'}
          </h1>
          <p className="text-sm text-aws-muted mb-6">
            {step === 'email'
              ? 'Enter your email and we will send a 6-digit code.'
              : `We sent a code to ${email}`}
          </p>

          {initialError && step === 'email' ? (
            <p className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {initialError}
            </p>
          ) : null}

          {step === 'email' ? (
            <form onSubmit={onSendCode} className="space-y-4">
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
                {status === 'sending' ? 'Sending...' : 'Send code'}
              </button>
            </form>
          ) : (
            <form onSubmit={onVerifyCode} className="space-y-4">
              <label htmlFor="otp" className="block text-[0.72rem] font-space-mono uppercase tracking-widest text-aws-muted">
                6-digit code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full rounded-lg border border-aws-border bg-aws-bg px-3 py-2.5 text-base sm:text-[0.8rem] font-space-mono tracking-[0.5em] text-center text-aws-text placeholder:text-aws-muted/70 outline-none focus:border-c1"
              />
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={status === 'verifying' || otp.length < 6}
                  className="inline-flex items-center justify-center rounded-lg border border-c1/40 bg-c1/10 px-4 py-2 text-[0.72rem] font-space-mono uppercase tracking-widest text-c1 hover:bg-c1/20 disabled:opacity-60"
                >
                  {status === 'verifying' ? 'Verifying...' : 'Verify'}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setOtp(''); setStatus('idle'); setErrorMessage('') }}
                  className="text-[0.72rem] font-space-mono uppercase tracking-widest text-aws-muted hover:text-aws-text transition-colors"
                >
                  Back
                </button>
              </div>
            </form>
          )}

          {status === 'error' ? (
            <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {errorMessage || 'Something went wrong. Please try again.'}
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
