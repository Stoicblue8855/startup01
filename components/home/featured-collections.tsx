'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Collection } from '@/lib/types'
import { Eyebrow } from '@/components/common/section-heading'
import { Reveal } from '@/components/motion/reveal'

export function FeaturedCollections({ collections }: { collections: Collection[] }) {
  const scroller = useRef<HTMLDivElement>(null)

  function scroll(dir: 1 | -1) {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.6), behavior: 'smooth' })
  }

  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal>
              <Eyebrow>The Collections</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.05] text-balance md:text-5xl">
                Four disciplines, one obsession.
              </h2>
            </Reveal>
          </div>
          <div className="hidden shrink-0 gap-3 md:flex">
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous collections"
              className="flex size-11 items-center justify-center border border-border text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Next collections"
              className="flex size-11 items-center justify-center border border-border text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 md:mt-16 md:gap-7 md:px-10"
      >
        {collections.map((c, i) => (
          <Reveal
            key={c.slug}
            delay={i * 0.05}
            className="w-[78vw] shrink-0 snap-start sm:w-[52vw] lg:w-[32vw]"
          >
            <Link href={`/shop?collection=${c.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <Image
                  src={c.image || '/placeholder.svg'}
                  alt={c.imageAlt}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 52vw, 32vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="text-xs uppercase tracking-wide-luxe text-gold">{c.tagline}</p>
                  <h3 className="mt-2 font-serif text-3xl">{c.name}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-wide-luxe text-foreground">
                    Discover
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
