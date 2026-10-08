import type { Metadata } from 'next'
import { SectionHeading, Eyebrow } from '@/components/common/section-heading'
import { Reveal } from '@/components/motion/reveal'
import { getFaqs, getPolicySections } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers on ordering, delivery, payment and our policies.',
}

export default async function FaqPage() {
  const [faqs, policies] = await Promise.all([getFaqs(), getPolicySections()])
  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <SectionHeading
          as="h1"
          eyebrow="FAQ"
          title="Answers, before you have to ask."
          description="If you don't find what you need here, our contact page reaches a person, not a queue."
        />

        <div className="mt-16 divide-y divide-border border-y border-border">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.04} as="div">
              <details className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between gap-6 font-serif text-xl leading-snug">
                  {item.q}
                  <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>

        {policies.map((p, i) => (
          <div key={p.slug} id={p.slug} className={i === 0 ? 'mt-24 scroll-mt-28' : 'mt-16 scroll-mt-28'}>
            <Eyebrow>{p.eyebrow}</Eyebrow>
            <h2 className="mt-5 font-serif text-3xl">{p.title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
