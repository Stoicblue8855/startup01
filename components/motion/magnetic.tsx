'use client'

import { type ReactNode, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Cursor-aware magnetic hover. The child drifts toward the pointer and springs
 * back on leave. Pointer-fine only; falls back to a plain wrapper on touch.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 })

  function handleMove(e: React.PointerEvent<HTMLSpanElement>) {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: springX, y: springY, display: 'inline-flex' }}
      className={className}
    >
      {children}
    </motion.span>
  )
}
