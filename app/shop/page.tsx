import type { Metadata } from 'next'
import { getCollections, getProducts } from '@/lib/products'
import { SectionHeading } from '@/components/common/section-heading'
import { ShopGrid } from '@/components/shop/shop-grid'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Watches',
  description: 'Browse the full collection — dress watches, chronographs, divers and grand complications.',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>
}) {
  const { collection } = await searchParams
  const [products, collections] = await Promise.all([getProducts(), getCollections()])

  return (
    <div className="pt-28 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 pb-20 md:px-10 md:pb-28">
        <SectionHeading
          eyebrow="The Collection"
          title="Every watch we make."
          description="Six pieces, four disciplines. Each one assembled by hand and finished to a standard we do not compromise on."
        />
        <div className="mt-14">
          <ShopGrid products={products} collections={collections} initialCollection={collection} />
        </div>
      </div>
    </div>
  )
}
