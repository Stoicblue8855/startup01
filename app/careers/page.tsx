import type { Metadata } from 'next'
import { SectionHeading, Eyebrow } from '@/components/common/section-heading'
import { Reveal } from '@/components/motion/reveal'
import { ApplicationForm } from '@/components/careers/application-form'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the atelier — open roles in watchmaking, retail and design.',
}

const openings = [
  { role: 'Watchmaker, Complications', location: 'Atelier · On-site' },
  { role: 'Boutique Specialist', location: 'New York · On-site' },
  { role: 'Case & Bracelet Polisher', location: 'Atelier · On-site' },
  { role: 'Product Photographer', location: 'Remote · Contract' },
]

export default function CareersPage() {
  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Careers"
          title="Join the atelier."
          description="We hire slowly and keep people for decades. If that sounds like the wrong incentive, this may not be the place for you."
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <Eyebrow>Open roles</Eyebrow>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {openings.map((o) => (
                <li key={o.role} className="flex items-center justify-between gap-4 py-5">
                  <span className="font-serif text-lg">{o.role}</span>
                  <span className="shrink-0 text-xs uppercase tracking-wide-luxe text-muted-foreground">
                    {o.location}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Don&rsquo;t see the right role? Apply anyway — the form is the same either way.
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
