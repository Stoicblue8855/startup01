import type { Product } from '@/lib/types'
import { ProductCard } from '@/components/shop/product-card'
import { SectionHeading } from '@/components/common/section-heading'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { LuxButton } from '@/components/brand/lux-button'

export function NewArrivals({ products }: { products: Product[] }) {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="The Collection" title="Pieces to be discovered." />
          <LuxButton href="/shop" variant="ghost" className="shrink-0">
            View all watches
          </LuxButton>
        </div>

        <RevealGroup className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-7">
          {products.map((p) => (
            <RevealItem key={p.id}>
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
