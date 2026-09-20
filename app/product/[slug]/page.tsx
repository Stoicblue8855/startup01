import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getProducts, getRelatedProducts } from '@/lib/products'
import { ProductDetail } from '@/components/shop/product-detail'
import { ProductCard } from '@/components/shop/product-card'
import { SectionHeading } from '@/components/common/section-heading'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'

export const revalidate = 60

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Watch not found' }
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} · SamayChakkra`,
      description: product.shortDescription,
      images: [{ url: product.image, width: 1200, height: 1200, alt: product.imageAlt }],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(slug)

  return (
    <div className="pt-28 md:pt-36">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: `https://www.samaychakkra.com${product.image}`,
            description: product.shortDescription,
            sku: product.reference,
            brand: { '@type': 'Brand', name: 'SamayChakkra' },
            offers: {
              '@type': 'Offer',
              priceCurrency: product.currency,
              price: product.price,
              availability: 'https://schema.org/InStock',
            },
          }).replace(/</g, '\\u003c'),
        }}
      />
      <div className="mx-auto max-w-[1400px] px-5 pb-20 md:px-10 md:pb-28">
        <ProductDetail product={product} />
      </div>

      {related.length > 0 && (
        <div className="border-t border-border py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <SectionHeading eyebrow="You may also like" title="More from the house." />
            <RevealGroup className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-7">
              {related.map((p) => (
                <RevealItem key={p.id}>
                  <ProductCard product={p} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      )}
    </div>
  )
}
