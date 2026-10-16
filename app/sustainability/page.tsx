import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isShown } from '@/lib/show'
import { getMaterials } from '@/lib/products'
import { getText, getPageTextMap } from '@/lib/page-text-server'
import { SectionHeading, Eyebrow } from '@/components/common/section-heading'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const t = await getText()
  return { title: t('sustain.meta.title'), description: t('sustain.meta.description') }
}

export default async function SustainabilityPage() {
  if (!isShown(await getPageTextMap(), 'show.page.sustainability')) notFound()
  const materials = await getMaterials()
  const t = await getText()
  const pillars = [1, 2, 3].map((n) => ({ title: t(`sustain.pillar${n}.title`), body: t(`sustain.pillar${n}.body`) }))

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          as="h1"
          eyebrow={t('sustain.eyebrow')}
          title={t('sustain.title')}
          description={t('sustain.description')}
        />

        <RevealGroup className="mt-16 grid gap-x-10 gap-y-12 border-y border-border py-14 md:grid-cols-3">
          {pillars.map((p) => (
            <RevealItem key={p.title}>
              <h3 className="font-serif text-2xl leading-snug">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-20">
          <Reveal>
            <Eyebrow>{t('sustain.materials.eyebrow')}</Eyebrow>
            <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.05] text-balance md:text-5xl">
              {t('sustain.materials.title')}
            </h2>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((m, i) => (
              <RevealItem key={m.id} className="border-t border-border pt-6">
                <span className="text-xs uppercase tracking-wide-luxe text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-serif text-2xl">{m.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </div>
  )
}
