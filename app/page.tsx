import type { Metadata } from 'next'
import {
  getHeroContent,
  getPressMentions,
  getTestimonials,
} from '@/lib/content'
import {
  getCollections,
  getMaterials,
  getFeaturedProducts,
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

import { getPageTextMap } from '@/lib/page-text-server'
import { isShown } from '@/lib/show'

// Re-fetch from Supabase at most once every 60 seconds instead of only at
// build time, so edits made in the Supabase table editor show up on the
// live site without needing a manual redeploy.
export const revalidate = 60

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const [hero, collections, materials, testimonials, press, products, featured, text] =
    await Promise.all([
      getHeroContent(),
      getCollections(),
      getMaterials(),
      getTestimonials(),
      getPressMentions(),
      getProducts(),
      getFeaturedProducts(),
      getPageTextMap(),
    ])

  // The big spotlight shows the first "featured" watch; new arrivals show watches marked "is_new".
  const signature = featured[0]
  const newArrivals = [...products.filter((p) => p.new), ...products.filter((p) => !p.new)].slice(0, 4)

  return (
    <>
      <Hero hero={hero} />
      <FeaturedCollections collections={collections} />
      {signature && <SignatureSpotlight product={signature} />}
      {isShown(text, 'show.home.craftsmanship') && <Craftsmanship />}
      {isShown(text, 'show.home.brand_film') && <BrandFilm />}
      <NewArrivals products={newArrivals} />
      {isShown(text, 'show.home.materials') && <Materials materials={materials} />}
      {isShown(text, 'show.home.testimonials') && <Testimonials testimonials={testimonials} press={press} />}
      <NewsletterSection />
    </>
  )
}
