'use client'

import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

/**
 * Next.js remounts `template.tsx` on every navigation, so this plays a fresh
 * entrance animation on each route change — a smooth cross-page transition.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[95] origin-top bg-background"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: 'top' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  )
}
