import {
  getHeroContent,
  getPressMentions,
  getTestimonials,
} from '@/lib/content'
import {
  getCollections,
  getMaterials,
  getProductBySlug,
  getProducts,
} from '@/lib/products'
import { Hero } from '@/components/home/hero'
import { FeaturedCollections } from '@/components/home/featured-collections'
import { SignatureSpotlight } from '@/components/home/spotlight'
import { Craftsmanship } from '@/components/home/craftsmanship'
import { BrandFilm } from '@/components/home/brand-film'
import { Materials } from '@/components/home/materials'
import { NewArrivals } from '@/components/home/new-arrivals'
import { Testimonials } from '@/components/home/testimonials'
import { NewsletterSection } from '@/components/home/newsletter-section'

// Re-fetch from Supabase at most once every 60 seconds instead of only at
// build time, so edits made in the Supabase table editor show up on the
// live site without needing a manual redeploy.
export const revalidate = 60

export default async function HomePage() {
  const [hero, collections, materials, testimonials, press, products, signature] =
    await Promise.all([
      getHeroContent(),
      getCollections(),
      getMaterials(),
      getTestimonials(),
      getPressMentions(),
      getProducts(),
      getProductBySlug('grand-tourbillon'),
    ])

  return (
    <>
      <Hero hero={hero} />
      <FeaturedCollections collections={collections} />
      {signature && <SignatureSpotlight product={signature} />}
      <Craftsmanship />
      <BrandFilm />
      <NewArrivals products={products.slice(0, 4)} />
      <Materials materials={materials} />
      <Testimonials testimonials={testimonials} press={press} />
      <NewsletterSection />
    </>
  )
}
