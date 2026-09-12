import type { Metadata } from 'next'
import { getMaterials } from '@/lib/products'
import { SectionHeading, Eyebrow } from '@/components/common/section-heading'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Sustainability',
  description: 'Materials chosen to last a century, sourced with the same discipline as our craft.',
}

const pillars = [
  {
    title: 'Responsibly sourced metals',
    body: 'All gold and platinum used in our ateliers is certified through the Responsible Jewellery Council chain of custody, tracing each ounce back to its mine.',
  },
  {
    title: 'A watch built to be repaired',
    body: 'Every caliber is designed to be serviced, not replaced. Spare parts for house movements remain in production for a minimum of thirty years.',
  },
  {
    title: 'Packaging that decomposes',
    body: 'Our boxes are FSC-certified wood and undyed cotton — no plastic film, no laminated foam, nothing that outlives the watch inside it.',
  },
]

export default async function SustainabilityPage() {
  const materials = await getMaterials()

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Sustainability"
          title="Only what endures."
          description="A watch designed to be inherited is, by its nature, a sustainable object. We take the rest of the process just as seriously."
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
            <Eyebrow>Materials</Eyebrow>
            <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.05] text-balance md:text-5xl">
              Chosen for a hundred years, not for this season.
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
