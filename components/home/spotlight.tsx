'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { LuxButton } from '@/components/brand/lux-button'
import { Float } from '@/components/motion/float'

/** Scroll-driven flagship feature. The watch scales and drifts as it enters. */
export function SignatureSpotlight({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1.1])
  const imageY = useTransform(scrollYProgress, [0, 1], ['12%', '-12%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['40%', '-40%'])
  const bgWordX = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section ref={ref} className="relative flex min-h-dvh items-center overflow-hidden py-24">
      <motion.span
        style={{ x: bgWordX }}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[24vw] leading-none text-foreground/[0.03]"
      >
        Signature
      </motion.span>

      <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 md:px-10 lg:grid-cols-2">
        <motion.div style={{ scale, y: imageY }} className="relative mx-auto aspect-square w-full max-w-xl">
          <Float distance={16} duration={6} className="relative size-full">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-contain"
            />
          </Float>
        </motion.div>

        <motion.div style={{ y: textY }} className="relative">
          <span className="inline-flex items-center gap-3 text-xs uppercase tracking-luxe text-gold">
            <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
            Signature model · {product.reference}
          </span>
          <h2 className="mt-6 font-serif text-5xl leading-[0.98] text-balance md:text-6xl lg:text-7xl">
            {product.name}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            {product.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
            {product.specs.slice(0, 3).map((s) => (
              <div key={s.label}>
                <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">{s.label}</p>
                <p className="mt-1 font-serif text-lg">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <LuxButton href={`/product/${product.slug}`} variant="solid">
              Discover the piece
            </LuxButton>
            <span className="font-serif text-xl">{formatPrice(product.price, product.currency)}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
