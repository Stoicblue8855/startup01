import type { Metadata } from 'next'
import { SectionHeading, Eyebrow } from '@/components/common/section-heading'
import { Reveal } from '@/components/motion/reveal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers on ordering, sizing, warranty, service and our policies.',
}

const faqs = [
  {
    q: 'How do I find the right case size?',
    a: 'Measure your wrist just below the bone with a soft tape or strip of paper. Most of our dress watches suit wrists 15–18cm; sport models are built for 16–20cm. Our support team is also happy to advise by phone.',
  },
  {
    q: 'Can I return or exchange a watch?',
    a: 'Yes — unworn pieces in original packaging may be returned within 14 days of delivery for a full refund, or exchanged for a different size or strap at any time within that window.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery is 3–5 business days, insured door to door. Store pickup options are shown at checkout where available.',
  },
  {
    q: 'Do you service watches you did not sell?',
    a: 'Our workshops primarily service house watches, but we do accept vintage pieces from the archive on a case-by-case basis. Contact us with photographs and a reference number if known.',
  },
  {
    q: 'How often should a watch be serviced?',
    a: 'We recommend a full service every 5–7 years for automatic movements, and sooner if you notice a loss of accuracy or moisture under the crystal.',
  },
]

export default function FaqPage() {
  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <SectionHeading
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

        <div id="warranty" className="mt-24 scroll-mt-28">
          <Eyebrow>Warranty &amp; Service</Eyebrow>
          <h2 className="mt-5 font-serif text-3xl">Two years, unconditionally.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Every watch carries a two-year international warranty against manufacturing defects, plus a
            complimentary first service. Warranty does not cover water damage from unrated exposure, accidental
            impact, or unauthorised repair. Register your piece with us to enable global service history.
          </p>
        </div>

        <div id="terms" className="mt-16 scroll-mt-28">
          <Eyebrow>Terms of Sale</Eyebrow>
          <h2 className="mt-5 font-serif text-3xl">The short version.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Prices are shown in your selected currency and include applicable duties for the country of delivery
            unless stated otherwise. Orders may be cancelled free of charge before dispatch. Full terms are provided
            at checkout and available on request.
          </p>
        </div>

        <div id="privacy" className="mt-16 scroll-mt-28">
          <Eyebrow>Privacy</Eyebrow>
          <h2 className="mt-5 font-serif text-3xl">What we keep, and why.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            We collect only what is needed to fulfil an order, maintain a warranty record, or send correspondence you
            have asked for. We do not sell personal data. You may request a copy or deletion of your data at any
            time by writing to us.
          </p>
        </div>

        <div id="accessibility" className="mt-16 scroll-mt-28">
          <Eyebrow>Accessibility</Eyebrow>
          <h2 className="mt-5 font-serif text-3xl">Built to be used by everyone.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            We aim to meet WCAG 2.1 AA standards across this site. If you encounter a barrier using a screen reader,
            keyboard navigation, or any assistive technology, please tell us — we treat these reports as priority
            fixes, not feedback for later.
          </p>
        </div>
      </div>
    </div>
  )
}
