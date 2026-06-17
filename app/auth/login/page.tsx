'use client'

import { FormEvent, Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import AuthShell from '@/components/auth/AuthShell'
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

  const verifyCode = async (code: string) => {
    setStatus('verifying')
    setErrorMessage('')

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message)
      return
    }

    router.push(safeNextPath)
  }

  const onVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await verifyCode(otp)
  }

  const onOtpChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6)
    setOtp(digits)
    if (digits.length === 6) verifyCode(digits)
  }

  return (
    <AuthShell
      eyebrow="Passwordless sign in"
      title={step === 'email' ? 'Sign In' : 'Enter Code'}
      subtitle={
        step === 'email'
          ? 'Enter your email and we will send a 6-digit code.'
          : `We sent a code to ${email}`
      }
      footer={
        <p className="text-xs text-aws-muted">
          Need to go back?{' '}
          <Link href="/" className="text-c1 underline underline-offset-2 hover:text-aws-text">
            Return to home
          </Link>
        </p>
      }
    >
      {initialError && step === 'email' ? (
        <p className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {initialError}
        </p>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        {step === 'email' ? (
          <motion.form
            key="email"
            onSubmit={onSendCode}
            className="space-y-4"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <label htmlFor="email" className="block font-space-mono text-[0.72rem] uppercase tracking-widest text-aws-muted">
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
              className="w-full rounded-lg border border-aws-border bg-aws-bg/60 px-3 py-2.5 text-base text-aws-text outline-none transition-colors placeholder:text-aws-muted/70 focus:border-c1 sm:text-[0.8rem]"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="signin-btn inline-flex items-center justify-center rounded-lg border border-c1/40 bg-c1/10 px-4 py-2 font-space-mono text-[0.72rem] uppercase tracking-widest text-c1 transition-all hover:bg-c1/20 disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending...' : 'Send code'}
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="code"
            onSubmit={onVerifyCode}
            className="space-y-4"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <label htmlFor="otp" className="block font-space-mono text-[0.72rem] uppercase tracking-widest text-aws-muted">
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
              onChange={(event) => onOtpChange(event.target.value)}
              placeholder="000000"
              className="w-full rounded-lg border border-aws-border bg-aws-bg/60 px-3 py-2.5 text-center font-space-mono text-base tracking-[0.5em] text-aws-text outline-none transition-colors placeholder:text-aws-muted/70 focus:border-c1 sm:text-[0.8rem]"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={status === 'verifying' || otp.length < 6}
                className="inline-flex items-center justify-center rounded-lg border border-c1/40 bg-c1/10 px-4 py-2 font-space-mono text-[0.72rem] uppercase tracking-widest text-c1 transition-all hover:bg-c1/20 disabled:opacity-60"
              >
                {status === 'verifying' ? 'Verifying...' : 'Verify'}
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setOtp(''); setStatus('idle'); setErrorMessage('') }}
                className="font-space-mono text-[0.72rem] uppercase tracking-widest text-aws-muted transition-colors hover:text-aws-text"
              >
                Back
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {status === 'error' ? (
        <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {errorMessage || 'Something went wrong. Please try again.'}
        </p>
      ) : null}
    </AuthShell>
  )
}
