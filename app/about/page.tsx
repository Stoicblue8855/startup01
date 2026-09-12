import type { Metadata } from 'next'
import Image from 'next/image'
import { getMilestones } from '@/lib/content'
import { SectionHeading, Eyebrow } from '@/components/common/section-heading'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Heritage',
  description: 'A century and a half of independent watchmaking, from a single bench in the Jura mountains.',
}

export default async function AboutPage() {
  const milestones = await getMilestones()

  return (
    <div className="pt-28 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Heritage"
          title="A century and a half, unhurried."
          description="Since 1874 we have worked from the same mountains, to the same standard, answering to no one but the movement itself."
        />
      </div>

      <div className="relative mt-16 aspect-[16/9] w-full overflow-hidden md:mt-24">
        <Image
          src="/images/heritage.png"
          alt="Luxury watch resting on aged leather and dark marble in warm light"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <Eyebrow>The Timeline</Eyebrow>
        <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.05] text-balance md:text-5xl">
          Every decade, a decision to stay small.
        </h2>

        <RevealGroup as="ul" className="mt-16 divide-y divide-border border-y border-border">
          {milestones.map((m) => (
            <RevealItem
              as="li"
              key={m.year}
              className="grid gap-3 py-8 md:grid-cols-[160px_1fr] md:gap-10 md:py-10"
            >
              <span className="font-serif text-3xl text-gold md:text-4xl">{m.year}</span>
              <div>
                <h3 className="font-serif text-xl md:text-2xl">{m.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {m.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-24 grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <Eyebrow>Founder&rsquo;s note</Eyebrow>
            <h2 className="mt-5 font-serif text-3xl leading-[1.1] text-balance md:text-4xl">
              &ldquo;We have never confused speed with progress.&rdquo;
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base leading-relaxed text-muted-foreground">
              Every watch that leaves this atelier carries the same conviction the first one did: that a thing worth
              making is worth making slowly, by hand, by people who will still be here to stand behind it in twenty
              years. That has never been a business strategy. It is simply how we were taught, and how we intend to
              teach the next generation of watchmakers who will one day sit at these same benches.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
