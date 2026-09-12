import {
  getBoutiques,
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

// Re-fetch from Supabase at most once every 60 seconds instead of only at
// build time, so edits made in the Supabase table editor show up on the
// live site without needing a manual redeploy.
export const revalidate = 60

import { BoutiquesPreview } from '@/components/home/boutiques-preview'
import { NewsletterSection } from '@/components/home/newsletter-section'

export default async function HomePage() {
  const [hero, collections, materials, boutiques, testimonials, press, products, signature] =
    await Promise.all([
      getHeroContent(),
      getCollections(),
      getMaterials(),
      getBoutiques(),
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
      <BrandFilm
        poster="/images/brand-film.png"
        posterAlt="Master watchmaker's atelier at night with a single illuminated luxury watch"
        videoSrc="" /* SUPABASE: brand film MP4 URL from Supabase Storage */
      />
      <NewArrivals products={products.slice(0, 4)} />
      <Materials materials={materials} />
      <Testimonials testimonials={testimonials} press={press} />
      <BoutiquesPreview boutiques={boutiques} />
      <NewsletterSection />
    </>
  )
}
