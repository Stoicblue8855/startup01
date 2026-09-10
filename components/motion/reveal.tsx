'use client'

import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

const easing = [0.22, 1, 0.36, 1] as const

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
  none: {},
}

/** Scroll-triggered fade + slide + subtle scale reveal for a single block. */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.9,
  once = true,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  direction?: Direction
  delay?: number
  duration?: number
  once?: boolean
  as?: 'div' | 'section' | 'span' | 'li' | 'article' | 'header' | 'footer'
}) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, scale: 0.98, ...offset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      transition={{ duration, delay, ease: easing }}
    >
      {children}
    </MotionTag>
  )
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: easing } },
}

/** Staggered container for grids/lists. Wrap children in <RevealItem>. */
export function RevealGroup({
  children,
  className,
  once = true,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  once?: boolean
  as?: 'div' | 'ul' | 'section'
}) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-8% 0px -8% 0px' }}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const MotionTag = motion[as]
  return (
    <MotionTag variants={itemVariants} className={cn(className)}>
      {children}
    </MotionTag>
  )
}
