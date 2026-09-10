'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { PressMention, Testimonial } from '@/lib/types'

export function Testimonials({
  testimonials,
  press,
}: {
  testimonials: Testimonial[]
  press: PressMention[]
}) {
  const [index, setIndex] = useState(0)
  const count = testimonials.length

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const active = testimonials[index]

  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
        <span className="text-xs uppercase tracking-luxe text-gold">In their words</span>

        <div className="relative mt-10 min-h-[220px] md:min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-serif text-2xl leading-snug text-balance md:text-4xl">
                &ldquo;{active.quote}&rdquo;
              </p>
              <footer className="mt-8">
                <p className="text-sm text-foreground">{active.author}</p>
                <p className="mt-1 text-xs uppercase tracking-wide-luxe text-muted-foreground">
                  {active.role}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2.5">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? 'w-8 bg-gold' : 'w-1.5 bg-border hover:bg-muted-foreground'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1400px] overflow-hidden px-5 md:mt-20 md:px-10">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 border-y border-border py-8">
          {press.map((p) => (
            <div key={p.id} className="text-center">
              <span className="font-serif text-lg tracking-wide-luxe text-foreground/70">
                {p.outlet}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
