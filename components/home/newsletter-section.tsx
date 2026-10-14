import { Reveal } from '@/components/motion/reveal'
import { NewsletterForm } from '@/components/layout/newsletter'
import { getText } from '@/lib/page-text-server'

export async function NewsletterSection() {
  const t = await getText()
  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-5 text-center md:px-10">
        <Reveal>
          <span className="text-xs uppercase tracking-luxe text-gold">{t('home.newsletter.eyebrow')}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 font-serif text-4xl leading-[1.05] text-balance md:text-5xl">
            {t('home.newsletter.title')}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {t('home.newsletter.body')}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mx-auto mt-10 max-w-md">
            <NewsletterForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
