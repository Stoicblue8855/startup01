'use client'

import { type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
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

function SignInRequired({ redirectTo }: { redirectTo: string }) {
  const href = redirectTo && redirectTo !== '/' ? `/account?redirect=${encodeURIComponent(redirectTo)}` : '/account'

  return (
    <div className="flex min-h-[75dvh] flex-col items-center justify-center px-5 py-20 text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: easing }}
        className="flex size-16 items-center justify-center rounded-full bg-gold/10 text-gold"
      >
        <motion.span
          animate={{ rotate: [0, -6, 6, -4, 4, 0] }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
        >
          <Lock className="size-7" />
        </motion.span>
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: easing }}
        className="mt-6 font-serif text-3xl text-balance md:text-4xl"
      >
        Sign in to continue.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28, ease: easing }}
        className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base"
      >
        SamayChakkra is by invitation to signed-in members only. Sign in with Google or email to browse the
        collection.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.42, ease: easing }}
        className="mt-8"
      >
        <LuxButton href={href}>Sign in</LuxButton>
      </motion.div>
    </div>
  )
}
