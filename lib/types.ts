/**
 * Domain types for [BRAND NAME].
 *
 * These interfaces intentionally mirror the shape of the future Supabase
 * tables (see column names in comments) so the static data layer can later be
 * swapped for live queries without touching any UI components.
 */

/** table: collections */
export interface Collection {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  image: string
  imageAlt: string
}

export type Gender = 'men' | 'women' | 'unisex'

export interface ProductSpec {
  label: string
  value: string
}

export interface StrapOption {
  id: string
  name: string
}

/** table: products */
export interface Product {
  id: string
  slug: string
  name: string
  collectionSlug: string | null
  reference: string
  price: number
  currency: string
  gender: Gender
  material: string
  shortDescription: string
  description: string
  image: string
  imageAlt: string
  hoverImage: string
  gallery: { src: string; alt: string }[]
  straps: StrapOption[]
  sizes: string[]
  specs: ProductSpec[]
  featured: boolean
  new: boolean
}

/** table: hero_sections */
export interface HeroSection {
  id: string
  eyebrow: string
  headline: string
  subheadline: string
  ctaLabel: string
  ctaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  video: string
  poster: string
  posterAlt: string
}

/** table: testimonials */
export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  kind: 'testimonial' | 'press'
  source?: string
}

/** table: press_mentions */
export interface PressMention {
  id: string
  outlet: string
  quote: string
}

/** table: boutiques */
export interface Boutique {
  id: string
  city: string
  country: string
  region: string
  address: string
  phone: string
  hours: string
  lat: number
  lng: number
}

/** table: journal_posts */
export interface JournalPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
  imageAlt: string
  body: string[]
}

/** table: pages (generic editorial pages: about, sustainability, careers, etc.) */
export interface Milestone {
  year: string
  title: string
  description: string
}

export interface Material {
  id: string
  name: string
  description: string
}

/** table: site_settings */
export interface SiteSettings {
  brandName: string
  tagline: string
  email: string
  phone: string
  socials: { label: string; href: string }[]
  currencies: string[]
  languages: string[]
  footer: {
    heading: string
    links: { label: string; href: string }[]
  }[]
}
