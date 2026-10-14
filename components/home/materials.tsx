import type { Material } from '@/lib/types'
import { SectionHeading } from '@/components/common/section-heading'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { getText } from '@/lib/page-text-server'

export async function Materials({ materials }: { materials: Material[] }) {
  const t = await getText()
  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          eyebrow={t('home.materials.eyebrow')}
          title={t('home.materials.title')}
          description={t('home.materials.description')}
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((m, i) => (
            <RevealItem
              key={m.id}
              className="group relative bg-background p-8 transition-colors duration-500 hover:bg-card md:p-10"
            >
              <span className="font-serif text-sm text-gold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 font-serif text-2xl transition-colors group-hover:text-gold md:text-3xl">
                {m.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
