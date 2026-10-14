import type { Metadata } from 'next'
import { getCollections, getProducts } from '@/lib/products'
import { SectionHeading } from '@/components/common/section-heading'
import { ShopGrid } from '@/components/shop/shop-grid'
import { getText } from '@/lib/page-text-server'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const t = await getText()
  return { title: 'Watches', description: t('shop.meta.description') }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>
}) {
  const { collection } = await searchParams
  const t = await getText()
  const [products, collections] = await Promise.all([getProducts(), getCollections()])

  return (
    <div className="pt-28 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 pb-20 md:px-10 md:pb-28">
        <SectionHeading
          as="h1"
          eyebrow={t('shop.eyebrow')}
          title={t('shop.title')}
          description={t('shop.description')}
        />
        <div className="mt-14">
          <ShopGrid products={products} collections={collections} initialCollection={collection} />
        </div>
      </div>
    </div>
  )
}
