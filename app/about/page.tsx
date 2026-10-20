import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isShown } from '@/lib/show'
import Image from 'next/image'
import { getMilestones } from '@/lib/content'
import { getText, getPageTextMap } from '@/lib/page-text-server'
import { SectionHeading, Eyebrow } from '@/components/common/section-heading'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const t = await getText()
  return { alternates: { canonical: '/about' }, title: t('about.meta.title'), description: t('about.meta.description') }
}

export default async function AboutPage() {
  if (!isShown(await getPageTextMap(), 'show.page.about')) notFound()
  const milestones = await getMilestones()
  const t = await getText()

  return (
    <div className="pt-28 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          as="h1"
          eyebrow={t('about.eyebrow')}
          title={t('about.title')}
          description={t('about.description')}
        />
      </div>

      <div className="relative mt-16 aspect-[16/9] w-full overflow-hidden md:mt-24">
        <Image
          src="/images/about-banner.jpg"
          alt="A selection of SamayChakkra watches: gold oval, brown leather, green steel, turquoise leather and black steel"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <Eyebrow>{t('about.timeline.eyebrow')}</Eyebrow>
        <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.05] text-balance md:text-5xl">
          {t('about.timeline.title')}
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
            <Eyebrow>{t('about.founder.eyebrow')}</Eyebrow>
            <h2 className="mt-5 font-serif text-3xl leading-[1.1] text-balance md:text-4xl">
              {t('about.founder.quote')}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base leading-relaxed text-muted-foreground">{t('about.founder.body')}</p>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
