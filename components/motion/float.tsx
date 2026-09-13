'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Continuous, gentle vertical float — layers on top of any scroll/hover
 * transforms already applied to a parent, since it only animates its own
 * `y` and rotation. Respects prefers-reduced-motion via Framer's defaults.
 */
export function Float({
  children,
  className,
  distance = 14,
  duration = 5,
  delay = 0,
  rotate = 0,
}: {
  children?: ReactNode
  className?: string
  distance?: number
  duration?: number
  delay?: number
  rotate?: number
}) {
  return (
    <motion.div
      className={cn(className)}
      style={{ willChange: 'transform' }}
      animate={{
        y: [0, -distance, 0],
        rotate: rotate ? [0, rotate, 0] : undefined,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}
