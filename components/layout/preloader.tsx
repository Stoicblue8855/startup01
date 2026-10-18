'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { siteSettings } from '@/lib/content'
import { useScrollLock } from '@/lib/scroll-lock'

const MIN_MS = 1700 // long enough for the logo to draw in
const MAX_MS = 4000 // never keep a visitor waiting longer than this

/**
 * Branded loader: the SamayChakkra logo draws itself in (watch face, crown,
 * hands, then the name) while the page loads, then the curtain lifts.
 * It is part of the first page the server sends, so there is no flash of
 * the site before it, and it leaves as soon as the page has finished loading
 * (but never before the logo has finished drawing, and never after MAX_MS).
 */
export function Preloader() {
  const [visible, setVisible] = useState(true)

  useScrollLock(visible)

  useEffect(() => {
    const start = performance.now()
    let done = false
    const finish = () => {
      if (done) return
      done = true
      setVisible(false)
    }
    const whenLoaded = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start))
      window.setTimeout(finish, wait)
    }
    if (document.readyState === 'complete') whenLoaded()
    else window.addEventListener('load', whenLoaded, { once: true })
    const hardStop = window.setTimeout(finish, MAX_MS)
    return () => {
      window.removeEventListener('load', whenLoaded)
      window.clearTimeout(hardStop)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader-failsafe fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading SamayChakkra"
        >
          <svg viewBox="0 0 40 40" className="size-20 text-gold" fill="none" stroke="currentColor" aria-hidden="true">
            {/* Watch face draws in (plain CSS, so it starts before any script has loaded) */}
            <circle className="pl-draw" pathLength={1} cx="20" cy="21" r="13.5" strokeWidth="1.25" style={{ ['--d' as string]: '0.9s' }} />
            {/* Crown */}
            <path className="pl-draw" pathLength={1} d="M20 4.5v4M17 4.5h6" strokeWidth="1.25" strokeLinecap="round" style={{ ['--d' as string]: '0.4s', ['--delay' as string]: '0.7s' }} />
            {/* Hour and minute hands set themselves */}
            <path className="pl-draw" pathLength={1} d="M20 21V13.5M20 21l5 3" strokeWidth="1.25" strokeLinecap="round" style={{ ['--d' as string]: '0.5s', ['--delay' as string]: '0.9s' }} />
            {/* Seconds hand ticks, stepped like a real watch */}
            <g className="pl-fade" style={{ ['--delay' as string]: '1.2s' }}>
              <line
                x1="20"
                y1="21"
                x2="20"
                y2="9.5"
                strokeWidth="0.6"
                strokeLinecap="round"
                className="animate-tick-hand origin-center"
              />
            </g>
            <circle className="pl-fade" cx="20" cy="21" r="1.4" fill="currentColor" stroke="none" style={{ ['--delay' as string]: '0.9s' }} />
          </svg>
          <span
            className="pl-rise mt-6 font-sans text-2xl font-semibold tracking-tight text-foreground"
            style={{ ['--delay' as string]: '1s' }}
          >
            {siteSettings.brandName}
          </span>
          <div className="pl-line mt-5 h-px bg-gold" style={{ ['--delay' as string]: '1.1s' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
