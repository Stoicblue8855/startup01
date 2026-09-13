'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import type { HeroSection } from '@/lib/types'
import { LuxButton } from '@/components/brand/lux-button'
import { Float } from '@/components/motion/float'

const easing = [0.22, 1, 0.36, 1] as const

export function Hero({ hero }: { hero: HeroSection }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const words = hero.headline.split(' ')

  return (
    <section ref={ref} className="relative h-dvh w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {hero.video ? (
          <video
            className="size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={hero.poster}
          >
            <source src={hero.video} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={hero.poster || '/placeholder.svg'}
            alt={hero.posterAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--background)_0%,var(--background)_32%,transparent_65%)]" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-[5] hidden md:block" aria-hidden="true">
        <Float distance={20} duration={7} delay={0} className="absolute left-[14%] top-[24%] size-2 rounded-full bg-gold/50" />
        <Float distance={24} duration={8} delay={1} className="absolute right-[18%] top-[32%] size-2.5 rounded-full bg-gold/40" />
      </div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-24 md:px-10 md:pb-32"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easing }}
          className="inline-flex items-center gap-3 text-xs uppercase tracking-luxe text-gold"
        >
          <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
          {hero.eyebrow}
        </motion.span>

        <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.98] text-balance md:text-7xl lg:text-8xl">
          {words.map((word, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.35 + i * 0.08, ease: easing }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: easing }}
          className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {hero.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: easing }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <LuxButton href={hero.ctaHref} variant="solid">
            {hero.ctaLabel}
          </LuxButton>
          <LuxButton href={hero.secondaryCtaHref} variant="outline">
            {hero.secondaryCtaLabel}
          </LuxButton>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] uppercase tracking-luxe">Scroll</span>
          <ArrowDown className="size-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
