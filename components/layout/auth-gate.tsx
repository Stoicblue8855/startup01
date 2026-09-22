'use client'

import { type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/account/auth-context'
import { LuxButton } from '@/components/brand/lux-button'

const easing = [0.22, 1, 0.36, 1] as const

/**
 * Gates every page except /account (the sign-in page itself) behind
 * authentication. /account must stay reachable or a signed-out visitor
 * could never reach the form that lets them sign in.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user, loading, configured } = useAuth()

  // The sign-in page must always be reachable, otherwise nobody could
  // ever get past this gate.
  if (pathname === '/account') return <>{children}</>

  // While Supabase isn't configured (e.g. local dev without env vars),
  // don't lock the whole site — fall through so the site stays usable.
  if (!configured) return <>{children}</>

  if (loading) {
    return (
      <div className="flex min-h-[70dvh] items-center justify-center">
        <span className="size-6 animate-spin rounded-full border-2 border-border border-t-gold" />
      </div>
    )
  }

  if (!user) {
    return <SignInRequired redirectTo={pathname} />
  }

  return <>{children}</>
}

function GateWatchMark() {
  return (
    <svg viewBox="0 0 40 40" className="size-11" fill="none" aria-hidden="true">
      {/* Crown */}
      <rect x="18.5" y="2" width="3" height="4" rx="1" fill="currentColor" />
      {/* Outer bezel */}
      <circle cx="20" cy="21" r="15.5" stroke="currentColor" strokeWidth="1.4" />
      {/* Inner dial ring */}
      <circle cx="20" cy="21" r="12.5" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        const outer = 12.5
        const inner = i % 3 === 0 ? 10 : 11.2
        const x1 = 20 + outer * Math.sin(angle)
        const y1 = 21 - outer * Math.cos(angle)
        const x2 = 20 + inner * Math.sin(angle)
        const y2 = 21 - inner * Math.cos(angle)
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={i % 3 === 0 ? 1 : 0.6}
            strokeLinecap="round"
            opacity={i % 3 === 0 ? 1 : 0.6}
          />
        )
      })}
      {/* Hour hand */}
      <path d="M20 21V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Minute hand */}
      <path d="M20 21l5.5 3.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Ticking seconds hand */}
      <line
        x1="20"
        y1="21"
        x2="20"
        y2="8.5"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        className="animate-tick-hand origin-center"
        opacity="0.85"
      />
      <circle cx="20" cy="21" r="1.3" fill="currentColor" />
    </svg>
  )
}

function SignInRequired({ redirectTo }: { redirectTo: string }) {
  const href = redirectTo && redirectTo !== '/' ? `/account?redirect=${encodeURIComponent(redirectTo)}` : '/account'

  return (
    <div className="flex min-h-[75dvh] flex-col items-center justify-center px-5 py-20 text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: easing }}
        className="relative flex size-24 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.07] text-gold shadow-[0_0_0_6px_rgba(154,100,24,0.05)]"
      >
        <GateWatchMark />
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: easing }}
        className="mt-7 font-serif text-3xl text-balance md:text-4xl"
      >
        Sign in to continue.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.32, ease: easing }}
        className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base"
      >
        SamayChakkra is by invitation to signed-in members only. Sign in with Google or email to browse the
        collection.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.46, ease: easing }}
        className="mt-8"
      >
        <LuxButton href={href}>Sign in</LuxButton>
      </motion.div>
    </div>
  )
}
