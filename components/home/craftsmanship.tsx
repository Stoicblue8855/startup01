'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Eyebrow } from '@/components/common/section-heading'
import { Reveal } from '@/components/motion/reveal'
import { LuxButton } from '@/components/brand/lux-button'

const rows = [
  {
    eyebrow: 'Craftsmanship',
    title: 'Assembled by a single pair of hands.',
    body: 'No caliber leaves the atelier having passed through more than two watchmakers. Each bridge is bevelled, each screw head polished, each balance regulated until it is not merely finished, but beautiful.',
    image: '/images/craftsmanship.png',
    alt: 'Watchmaker placing a tiny gear into an exposed mechanical watch movement with tweezers',
    href: '/about',
    cta: 'Inside the atelier',
    reverse: false,
  },
  {
    eyebrow: 'Heritage',
    title: 'A century and a half, unhurried.',
    body: 'Since 1874 we have worked from the same mountains, to the same standard, answering to no one but the movement itself. Independence is not our strategy. It is our nature.',
    image: '/images/heritage.png',
    alt: 'Luxury watch resting on aged leather and dark marble in warm light',
    href: '/about',
    cta: 'Our story',
    reverse: true,
  },
]

function Row({ row }: { row: (typeof rows)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <div
      ref={ref}
      className={`grid items-center gap-10 md:gap-16 lg:grid-cols-2 ${
        row.reverse ? 'lg:[&>*:first-child]:order-2' : ''
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary md:aspect-[5/6]">
        <motion.div style={{ y }} className="absolute inset-[-8%]">
          <Image
            src={row.image || '/placeholder.svg'}
            alt={row.alt}
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover"
          />
        </motion.div>
      </div>
      <div className="max-w-lg">
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 font-serif text-4xl leading-[1.05] text-balance md:text-5xl">
            {row.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            {row.body}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <LuxButton href={row.href} variant="outline" className="mt-8">
            {row.cta}
          </LuxButton>
        </Reveal>
      </div>
    </div>
  )
}

export function Craftsmanship() {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-24 px-5 md:gap-32 md:px-10">
        {rows.map((row) => (
          <Row key={row.title} row={row} />
        ))}
      </div>
    </section>
  )
}
