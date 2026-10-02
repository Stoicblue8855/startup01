'use client'

import { type ReactNode, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Cormorant_Garamond } from 'next/font/google'
import { useAuth } from '@/components/account/auth-context'

const dialFont = Cormorant_Garamond({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

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

const TICKS = Array.from({ length: 60 }).map((_, i) => {
  const major = i % 5 === 0
  const a = (i * 6 * Math.PI) / 180
  const r1 = 246
  const r2 = r1 - (major ? 16 : 7)
  return {
    i,
    major,
    x1: 300 + r1 * Math.sin(a),
    y1: 300 - r1 * Math.cos(a),
    x2: 300 + r2 * Math.sin(a),
    y2: 300 - r2 * Math.cos(a),
  }
})

function SignInRequired({ redirectTo }: { redirectTo: string }) {
  const href = redirectTo && redirectTo !== '/' ? `/account?redirect=${encodeURIComponent(redirectTo)}` : '/account'
  const hourRef = useRef<SVGGElement>(null)
  const minRef = useRef<SVGGElement>(null)
  const secRef = useRef<SVGGElement>(null)

  // Real-time hands: the seconds hand ticks once per second like a quartz watch.
  useEffect(() => {
    let laps = 0
    let last = -1
    let timer: ReturnType<typeof setTimeout>
    const rot = (el: SVGGElement | null, deg: number) => {
      if (el) el.style.transform = `rotate(${deg}deg)`
    }
    const tick = () => {
      const t = new Date()
      const sec = t.getSeconds()
      if (sec < last) laps++
      last = sec
      rot(secRef.current, laps * 360 + sec * 6)
      rot(minRef.current, t.getMinutes() * 6 + sec * 0.1)
      rot(hourRef.current, (t.getHours() % 12) * 30 + t.getMinutes() * 0.5)
      timer = setTimeout(tick, 1000 - t.getMilliseconds() + 5)
    }
    tick()
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="gate-wrap">
      <main className="gate-watch" aria-labelledby="gate-title">
        <svg viewBox="0 0 600 600" aria-hidden="true">
          <rect x="272" y="2" width="56" height="18" rx="5" fill="var(--gold)" />
          <circle cx="300" cy="300" r="290" style={{ fill: 'color-mix(in oklab, var(--gold) 12%, var(--background))', stroke: 'color-mix(in oklab, var(--gold) 35%, transparent)' }} strokeWidth="2" />
          <circle cx="300" cy="300" r="268" fill="none" style={{ stroke: 'color-mix(in oklab, var(--gold) 35%, transparent)' }} strokeWidth="1.5" />
          <circle cx="300" cy="300" r="250" style={{ fill: 'var(--card)', stroke: 'color-mix(in oklab, var(--gold) 35%, transparent)' }} strokeWidth="1.5" />
          {TICKS.map((t) => (
            <line key={t.i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--gold)" strokeLinecap="round" strokeWidth={t.major ? 3 : 1.2} />
          ))}
          <path id="gate-ring" d="M88,300 a212,212 0 1,1 424,0 a212,212 0 1,1 -424,0" fill="none" />
          <text fill="var(--gold)" style={{ fontFamily: dialFont.style.fontFamily, fontWeight: 600, fontSize: 15, letterSpacing: '0.12em' }}>
            <textPath href="#gate-ring" textLength="1318" lengthAdjust="spacing">
              SamayChakkra ◆ SamayChakkra ◆ SamayChakkra ◆{' '}
            </textPath>
          </text>
          <circle cx="300" cy="300" r="190" fill="none" style={{ stroke: 'color-mix(in oklab, var(--gold) 35%, transparent)' }} strokeWidth="1" />
          <g className="gate-hand gate-hand-h" ref={hourRef}>
            <line x1="300" y1="318" x2="300" y2="160" stroke="var(--foreground)" strokeWidth="7" strokeLinecap="round" />
          </g>
          <g className="gate-hand gate-hand-m" ref={minRef}>
            <line x1="300" y1="322" x2="300" y2="104" stroke="var(--foreground)" strokeWidth="4.5" strokeLinecap="round" />
          </g>
          <g className="gate-hand gate-hand-s" ref={secRef}>
            <line x1="300" y1="334" x2="300" y2="62" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="300" cy="259" r="5" fill="var(--gold)" />
          </g>
          <circle className="gate-cap" cx="300" cy="300" r="6" fill="var(--gold)" />
        </svg>

        <div className="gate-content">
          <h1 id="gate-title" className="gate-title" style={{ fontFamily: dialFont.style.fontFamily }}>
            Sign in to continue
          </h1>
          <p className="gate-text">
            SamayChakkra is open to invited members. Sign in with Google or email to browse the collection.
          </p>
          <Link href={href} className="gate-btn">
            Sign in
          </Link>
        </div>
      </main>
    </div>
  )
}
