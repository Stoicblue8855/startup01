'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { HeroSection } from '@/lib/types'
import { LuxButton } from '@/components/brand/lux-button'
import { Float } from '@/components/motion/float'

const easing = [0.22, 1, 0.36, 1] as const

/**
 * Split hero: copy sits on a clean, flat panel (guaranteed contrast,
 * matches the rest of the site) and the photo lives in its own frame.
 * No text-over-image overlay tricks — this is the reliable pattern.
 */
export function Hero({ hero }: { hero: HeroSection }) {
  const imgRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ['start start', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const words = hero.headline.split(' ')

  return (
    <section className="relative w-full overflow-hidden bg-background pt-24 md:pt-28">
      <div className="mx-auto grid max-w-[1500px] items-center gap-10 px-5 py-10 md:grid-cols-2 md:gap-16 md:px-10 md:py-16 lg:py-20">
        {/* Copy panel — flat background, guaranteed legible */}
        <div className="order-2 md:order-1">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: easing }}
            className="inline-flex w-fit items-center gap-3 text-xs uppercase tracking-luxe text-gold"
          >
            <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
            {hero.eyebrow}
          </motion.span>

          <h1 className="mt-5 max-w-xl font-serif text-4xl leading-[1.08] text-balance text-foreground md:text-6xl lg:text-[4.25rem]">
            {words.map((word, i) => (
              <span key={i} className="mr-[0.28em] inline-block overflow-hidden align-bottom">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 + i * 0.07, ease: easing }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: easing }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: easing }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <LuxButton href={hero.ctaHref} variant="solid">
              {hero.ctaLabel}
            </LuxButton>
            <LuxButton href={hero.secondaryCtaHref} variant="outline">
              {hero.secondaryCtaLabel}
            </LuxButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-10 flex items-center gap-6 border-t border-border pt-6 text-xs uppercase tracking-luxe text-muted-foreground"
          >
            <span>Est. 1874</span>
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <span>Hand-finished automatic movements</span>
          </motion.div>
        </div>

        {/* Image panel — fully visible, its own frame */}
        <motion.div
          ref={imgRef}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: easing }}
          className="relative order-1 aspect-square overflow-hidden rounded-sm bg-secondary md:order-2 md:aspect-[4/5]"
        >
          <motion.div style={{ scale }} className="absolute inset-0">
            {hero.video ? (
              <video className="size-full object-cover" autoPlay muted loop playsInline poster={hero.poster}>
                <source src={hero.video} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={hero.poster || '/placeholder.svg'}
                alt={hero.posterAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </motion.div>

          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Float distance={14} duration={7} className="absolute left-[10%] top-[16%] size-2 rounded-full bg-gold/50" />
            <Float distance={18} duration={8} delay={1} className="absolute right-[12%] top-[24%] size-2.5 rounded-full bg-gold/40" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
