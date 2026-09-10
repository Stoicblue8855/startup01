import Image from 'next/image'
import type { Boutique } from '@/lib/types'
import { Eyebrow } from '@/components/common/section-heading'
import { Reveal } from '@/components/motion/reveal'
import { LuxButton } from '@/components/brand/lux-button'

export function BoutiquesPreview({ boutiques }: { boutiques: Boutique[] }) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2">
        <div className="relative min-h-[360px] overflow-hidden lg:min-h-[560px]">
          <Image
            src="/images/boutique.png"
            alt="Elegant luxury watch boutique interior with warm golden display lighting"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent lg:bg-gradient-to-r" />
        </div>

        <div className="flex flex-col justify-center px-5 py-16 md:px-14 md:py-20">
          <Reveal>
            <Eyebrow>Boutiques</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 max-w-md font-serif text-4xl leading-[1.05] text-balance md:text-5xl">
              Come and hold time in your hands.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              A watch is a thing of weight and light. Visit one of our boutiques to feel it on the wrist, and let a specialist guide you.
            </p>
          </Reveal>

          <ul className="mt-10 grid max-w-md grid-cols-2 gap-x-8 gap-y-5">
            {boutiques.slice(0, 6).map((b, i) => (
              <Reveal as="li" key={b.id} delay={0.1 + i * 0.04}>
                <p className="font-serif text-lg">{b.city}</p>
                <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">
                  {b.country}
                </p>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <LuxButton href="/locations" variant="outline" className="mt-12 self-start">
              Find a boutique
            </LuxButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
