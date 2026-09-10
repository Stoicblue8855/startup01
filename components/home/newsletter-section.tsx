import { Reveal } from '@/components/motion/reveal'
import { NewsletterForm } from '@/components/layout/newsletter'

export function NewsletterSection() {
  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-5 text-center md:px-10">
        <Reveal>
          <span className="text-xs uppercase tracking-luxe text-gold">The Correspondence</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 font-serif text-4xl leading-[1.05] text-balance md:text-5xl">
            An invitation, rarely extended.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Private previews, new releases and quiet stories from the atelier. We write seldom, and only when it matters.
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
