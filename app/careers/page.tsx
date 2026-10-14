import type { Metadata } from 'next'
import { SectionHeading, Eyebrow } from '@/components/common/section-heading'
import { Reveal } from '@/components/motion/reveal'
import { getJobOpenings } from '@/lib/content'
import { getText } from '@/lib/page-text-server'
import { ApplicationForm } from '@/components/careers/application-form'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const t = await getText()
  return { title: 'Careers', description: t('careers.meta.description') }
}

export default async function CareersPage() {
  const openings = await getJobOpenings()
  const t = await getText()
  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          as="h1"
          eyebrow="Careers"
          title={t('careers.title')}
          description={t('careers.description')}
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <Eyebrow>{t('careers.roles.eyebrow')}</Eyebrow>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {openings.map((o) => (
                <li key={o.role} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-5">
                  <span className="font-serif text-lg">{o.role}</span>
                  <span className="text-xs uppercase tracking-wide-luxe text-muted-foreground">
                    {o.location}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {t('careers.note')}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ApplicationForm roles={openings.map((o) => o.role)} />
          </Reveal>
        </div>
      </div>
    </div>
  )
}
