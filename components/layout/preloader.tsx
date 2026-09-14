'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { siteSettings } from '@/lib/content'

/**
 * Branded preloader: a clock face draws in, hour/minute hands set
 * themselves, and a seconds hand visibly ticks (stepped, not a smooth
 * sweep) for the duration of the load — then the curtain lifts.
 * Shows once per session.
 */
export function Preloader() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const seen = sessionStorage.getItem('brand-preloader-seen')
    if (seen) return
    setVisible(true)
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('brand-preloader-seen', '1')
      document.body.style.overflow = ''
    }, 2600)
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <svg viewBox="0 0 40 40" className="size-16 text-gold" fill="none" aria-hidden="true">
            <motion.circle
              cx="20"
              cy="21"
              r="13.5"
              stroke="currentColor"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
            {/* Hour hand — settles into place */}
            <motion.path
              d="M20 21V14.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9, ease: 'easeInOut' }}
            />
            {/* Minute hand — settles into place */}
            <motion.path
              d="M20 21l4.2 2.4"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2, ease: 'easeInOut' }}
            />
            {/* Seconds hand — ticks continuously, stepped not smooth */}
            <motion.line
              x1="20"
              y1="21"
              x2="20"
              y2="9.5"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeLinecap="round"
              className="animate-tick-hand origin-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 0.4, delay: 1.5 }}
            />
            <circle cx="20" cy="21" r="1.2" fill="currentColor" />
          </svg>
          <motion.span
            className="mt-6 font-sans text-lg font-semibold tracking-tight text-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {siteSettings.brandName}
          </motion.span>
          <motion.div
            className="mt-5 h-px bg-gold"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 1.6, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
