'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, Check, Mail, Phone } from 'lucide-react'
import { LuxButton } from '@/components/brand/lux-button'
import { useAuth } from './auth-context'
import { GoogleIcon } from './google-icon'
import { OtpInput } from './otp-input'

type Step = 'method' | 'email-entry' | 'email-otp' | 'phone-entry' | 'phone-otp' | 'success'

const RESEND_SECONDS = 30

const variants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

export function AuthFlow() {
  const router = useRouter()
  const { user, configured, sendEmailOtp, verifyEmailOtp, sendPhoneOtp, verifyPhoneOtp, signInWithGoogle } = useAuth()
  const [step, setStep] = useState<Step>('method')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const otpKeyRef = useRef(0)

  // If a session already exists (e.g. returning from a Google redirect),
  // go straight to the dashboard.
  useEffect(() => {
    if (user) router.replace('/account/dashboard')
  }, [user, router])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function startCountdown() {
    setCountdown(RESEND_SECONDS)
    otpKeyRef.current += 1
  }

  useEffect(() => {
    if (step !== 'success') return
    const t = setTimeout(() => router.push('/account/dashboard'), 1200)
    return () => clearTimeout(t)
  }, [step, router])

  async function handleGoogle() {
    setError('')
    setLoading(true)
    const { error } = await signInWithGoogle()
    setLoading(false)
    if (error) setError(error)
    // On success, Supabase redirects the browser to Google — no further
    // action needed here.
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setLoading(true)
    const { error } = await sendEmailOtp(email)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setStep('email-otp')
    startCountdown()
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) {
      setError('Enter a valid phone number.')
      return
    }
    setLoading(true)
    const { error } = await sendPhoneOtp(`+91${digits}`)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setStep('phone-otp')
    startCountdown()
  }

  async function handleOtpComplete(code: string) {
    setError('')
    setLoading(true)
    const digits = phone.replace(/\D/g, '')
    const { error } =
      step === 'email-otp' ? await verifyEmailOtp(email, code) : await verifyPhoneOtp(`+91${digits}`, code)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setStep('success')
  }

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden">
      {!configured && (
        <div className="mb-6 flex items-start gap-2.5 border border-gold/40 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold" />
          Sign-in isn&rsquo;t connected yet — this will start working once Supabase is configured.
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'method' && (
          <motion.div key="method" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 border border-border bg-background py-3.5 text-sm font-medium text-foreground transition-colors hover:border-gold disabled:opacity-60"
            >
              <GoogleIcon className="size-5" />
              Continue with Google
            </button>

            <div className="my-7 flex items-center gap-4 text-xs uppercase tracking-luxe text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <button
              onClick={() => {
                setError('')
                setStep('email-entry')
              }}
              className="flex w-full items-center gap-3 border border-border bg-background px-4 py-3.5 text-left text-sm text-foreground transition-colors hover:border-gold"
            >
              <Mail className="size-[18px] text-gold" />
              Continue with email
            </button>

            <button
              onClick={() => {
                setError('')
                setStep('phone-entry')
              }}
              className="mt-3 flex w-full items-center gap-3 border border-border bg-background px-4 py-3.5 text-left text-sm text-foreground transition-colors hover:border-gold"
            >
              <Phone className="size-[18px] text-gold" />
              Continue with phone
            </button>

            {error && <p className="mt-4 text-center text-xs text-destructive">{error}</p>}

            <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
              By continuing you agree to our{' '}
              <a href="/faq#terms" className="underline underline-offset-2 hover:text-gold">
                Terms
              </a>{' '}
              and{' '}
              <a href="/faq#privacy" className="underline underline-offset-2 hover:text-gold">
                Privacy Policy
              </a>
              .
            </p>
          </motion.div>
        )}

        {step === 'email-entry' && (
          <motion.form
            key="email-entry"
            onSubmit={handleEmailSubmit}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <BackButton onClick={() => setStep('method')} />
            <h2 className="mt-5 font-serif text-2xl">What&rsquo;s your email?</h2>
            <p className="mt-2 text-sm text-muted-foreground">We&rsquo;ll send a one-time code to verify it&rsquo;s you.</p>
            <input
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="mt-6 w-full border-b border-border bg-transparent py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
            />
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
            <LuxButton type="submit" className="mt-7 w-full justify-center" disabled={loading}>
              {loading ? 'Sending…' : 'Send code'}
            </LuxButton>
          </motion.form>
        )}

        {step === 'phone-entry' && (
          <motion.form
            key="phone-entry"
            onSubmit={handlePhoneSubmit}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <BackButton onClick={() => setStep('method')} />
            <h2 className="mt-5 font-serif text-2xl">What&rsquo;s your number?</h2>
            <p className="mt-2 text-sm text-muted-foreground">We&rsquo;ll text a one-time code to verify it&rsquo;s you.</p>
            <div className="mt-6 flex items-center gap-2 border-b border-border focus-within:border-gold">
              <span className="py-3 text-muted-foreground">+91</span>
              <input
                autoFocus
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                className="w-full bg-transparent py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
            <LuxButton type="submit" className="mt-7 w-full justify-center" disabled={loading}>
              {loading ? 'Sending…' : 'Send code'}
            </LuxButton>
          </motion.form>
        )}

        {(step === 'email-otp' || step === 'phone-otp') && (
          <motion.div
            key="otp"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <BackButton onClick={() => setStep(step === 'email-otp' ? 'email-entry' : 'phone-entry')} />
            <h2 className="mt-5 font-serif text-2xl">Enter the code</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sent to {step === 'email-otp' ? email : `+91 ${phone}`}
            </p>

            <div className="mt-7">
              <OtpInput key={otpKeyRef.current} onComplete={handleOtpComplete} />
            </div>

            {error && <p className="mt-4 text-center text-xs text-destructive">{error}</p>}

            <div className="mt-6 text-center text-sm">
              {countdown > 0 ? (
                <span className="text-muted-foreground">Resend code in {countdown}s</span>
              ) : (
                <button
                  onClick={() => (step === 'email-otp' ? sendEmailOtp(email) : sendPhoneOtp(`+91${phone.replace(/\D/g, '')}`)).then(startCountdown)}
                  className="text-gold underline underline-offset-2"
                >
                  Resend code
                </button>
              )}
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center py-6 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
              className="flex size-16 items-center justify-center rounded-full bg-gold text-background"
            >
              <Check className="size-7" />
            </motion.span>
            <h2 className="mt-6 font-serif text-2xl">You&rsquo;re in.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Welcome to SamayChakkra.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          >
            <span className="size-6 animate-spin rounded-full border-2 border-border border-t-gold" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs uppercase tracking-luxe text-muted-foreground transition-colors hover:text-gold"
    >
      <ArrowLeft className="size-3.5" />
      Back
    </button>
  )
}
