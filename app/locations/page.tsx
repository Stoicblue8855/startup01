import type { Metadata } from 'next'
import Image from 'next/image'
import { getBoutiques } from '@/lib/content'
import { SectionHeading } from '@/components/common/section-heading'
import { BoutiqueFilter } from '@/components/boutiques/boutique-filter'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Boutiques',
  description: 'Find a boutique — New York, Geneva, Paris, Tokyo, Dubai and London.',
}

export default async function LocationsPage() {
  const boutiques = await getBoutiques()

  return (
    <div className="pt-28 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Boutiques"
          title="Come and hold time in your hands."
          description="A watch is a thing of weight and light. Visit a boutique to feel it on the wrist, and let a specialist guide you."
        />
      </div>

      <div className="relative mt-16 aspect-[16/9] w-full overflow-hidden md:mt-20">
        <Image
          src="/images/boutique.png"
          alt="Elegant luxury watch boutique interior with warm golden display lighting"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <BoutiqueFilter boutiques={boutiques} />
      </div>
    </div>
  )
}
