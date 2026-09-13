import type { Collection, Material, Product } from './types'
import { getSupabaseClient } from './supabase'

/**
 * All product & collection content lives here as typed, exported arrays.
 * UI components never touch these constants directly — they call the async
 * getters below, each of which is annotated with the Supabase query that will
 * replace the static return value.
 */

const DETAIL_MOVEMENT = {
  src: '/images/craftsmanship.png',
  alt: 'Exposed mechanical watch movement with gold gears being assembled by hand',
}
const DETAIL_CASEBACK = {
  src: '/images/journal-2.png',
  alt: 'Sapphire crystal case back revealing an engraved gold rotor',
}

export const collections: Collection[] = [
  {
    id: 'col-heritage',
    slug: 'heritage',
    name: 'Héritage',
    tagline: 'Timeless dress watches',
    description:
      'The founding line. Restrained proportions, hand-finished dials and a silhouette unchanged in spirit since the first workshop opened its doors.',
    image: '/images/collection-heritage.png',
    imageAlt: 'Gold luxury dress watch worn on the wrist with a tailored dark suit',
  },
  {
    id: 'col-meridian',
    slug: 'meridian',
    name: 'Meridian',
    tagline: 'Instruments for motion',
    description:
      'Built for pressure. Chronographs and divers engineered to the tolerances of the sea, the track and everywhere the day takes you.',
    image: '/images/collection-sport.png',
    imageAlt: 'Steel sports chronograph watch on a wrist against a moody dark background',
  },
  {
    id: 'col-noir',
    slug: 'noir',
    name: 'Noir',
    tagline: 'Contemporary darkness',
    description:
      'Black ceramic, shadowed dials and a single stroke of warm metal. The most modern expression of the house.',
    image: '/images/watch-noir.png',
    imageAlt: 'Black ceramic luxury watch with matte dial and rose gold accents',
  },
  {
    id: 'col-atelier',
    slug: 'atelier',
    name: 'Atelier',
    tagline: 'Haute horlogerie',
    description:
      'Our rarest complications. Each piece is signed, numbered and assembled by a single master over many months.',
    image: '/images/collection-atelier.png',
    imageAlt: 'Intricate skeleton tourbillon watch movement with exposed gears',
  },
]

export const products: Product[] = [
  {
    id: 'prd-celestial',
    slug: 'celestial-automatic',
    name: 'Celestial Automatic',
    collectionSlug: 'heritage',
    reference: 'HÉR-1815',
    price: 18500,
    currency: 'USD',
    gender: 'men',
    material: 'Gold',
    shortDescription: 'A guilloché night sky, cast in solid gold.',
    description:
      'The Celestial is the truest statement of the house. A hand-engraved blue guilloché dial sits beneath a domed sapphire crystal, framed in solid gold and paced by an in-house automatic caliber. It is a watch made to be inherited.',
    image: '/images/watch-celestial.png',
    imageAlt: 'Luxury gold dress watch with deep blue guilloche dial on a dark background',
    hoverImage: '/images/collection-heritage.png',
    gallery: [
      { src: '/images/watch-celestial.png', alt: 'Celestial Automatic front view with blue guilloche dial' },
      DETAIL_MOVEMENT,
      DETAIL_CASEBACK,
    ],
    straps: [
      { id: 'alligator-black', name: 'Black alligator' },
      { id: 'alligator-navy', name: 'Navy alligator' },
    ],
    sizes: ['39mm', '41mm'],
    specs: [
      { label: 'Movement', value: 'Caliber 1815, automatic' },
      { label: 'Power reserve', value: '72 hours' },
      { label: 'Case size', value: '39mm' },
      { label: 'Case material', value: '18k solid gold' },
      { label: 'Water resistance', value: '50m' },
      { label: 'Crystal', value: 'Domed sapphire, anti-reflective' },
    ],
    featured: true,
    new: false,
  },
  {
    id: 'prd-meridian',
    slug: 'meridian-chronograph',
    name: 'Meridian Chronograph',
    collectionSlug: 'meridian',
    reference: 'MER-4400',
    price: 12900,
    currency: 'USD',
    gender: 'men',
    material: 'Steel',
    shortDescription: 'A racing chronograph measured in tenths.',
    description:
      'Precision under pressure. The Meridian Chronograph pairs a column-wheel movement with a brushed steel case and a silver dial legible at a glance. Engineered for those who count the seconds.',
    image: '/images/watch-meridian.png',
    imageAlt: 'Stainless steel luxury sports chronograph watch with silver dial and steel bracelet',
    hoverImage: '/images/collection-sport.png',
    gallery: [
      { src: '/images/watch-meridian.png', alt: 'Meridian Chronograph front view with silver dial' },
      DETAIL_MOVEMENT,
      DETAIL_CASEBACK,
    ],
    straps: [
      { id: 'steel-bracelet', name: 'Steel bracelet' },
      { id: 'rubber-black', name: 'Black rubber' },
    ],
    sizes: ['41mm', '43mm'],
    specs: [
      { label: 'Movement', value: 'Caliber 4400, automatic chronograph' },
      { label: 'Power reserve', value: '65 hours' },
      { label: 'Case size', value: '41mm' },
      { label: 'Case material', value: 'Brushed stainless steel' },
      { label: 'Water resistance', value: '100m' },
      { label: 'Crystal', value: 'Sapphire, anti-reflective' },
    ],
    featured: true,
    new: true,
  },
  {
    id: 'prd-marine',
    slug: 'marine-diver',
    name: 'Marine Diver',
    collectionSlug: 'meridian',
    reference: 'MER-3000',
    price: 9800,
    currency: 'USD',
    gender: 'unisex',
    material: 'Steel',
    shortDescription: 'Certified to three hundred metres.',
    description:
      'A tool watch in the purest sense. The Marine Diver carries a unidirectional bezel, a deep teal dial and luminescent markers built to hold their glow through the longest descent.',
    image: '/images/watch-marine.png',
    imageAlt: 'Luxury dive watch with deep teal green dial, steel case and rotating bezel',
    hoverImage: '/images/collection-sport.png',
    gallery: [
      { src: '/images/watch-marine.png', alt: 'Marine Diver front view with teal dial' },
      DETAIL_MOVEMENT,
      DETAIL_CASEBACK,
    ],
    straps: [
      { id: 'steel-bracelet', name: 'Steel bracelet' },
      { id: 'rubber-teal', name: 'Teal rubber' },
    ],
    sizes: ['42mm'],
    specs: [
      { label: 'Movement', value: 'Caliber 3000, automatic' },
      { label: 'Power reserve', value: '70 hours' },
      { label: 'Case size', value: '42mm' },
      { label: 'Case material', value: 'Stainless steel' },
      { label: 'Water resistance', value: '300m' },
      { label: 'Crystal', value: 'Sapphire, anti-reflective' },
    ],
    featured: false,
    new: false,
  },
  {
    id: 'prd-noir',
    slug: 'noir-ceramic',
    name: 'Noir Ceramic',
    collectionSlug: 'noir',
    reference: 'NOI-2200',
    price: 15400,
    currency: 'USD',
    gender: 'unisex',
    material: 'Ceramic',
    shortDescription: 'Matte black, lit by a single stroke of rose gold.',
    description:
      'Scratch-resistant black ceramic meets a shadowed dial and a lone rose gold seconds hand. The Noir Ceramic is the house at its most contemporary — quiet, dark and exact.',
    image: '/images/watch-noir.png',
    imageAlt: 'Black ceramic luxury watch with matte black dial and rose gold accents',
    hoverImage: '/images/collection-atelier.png',
    gallery: [
      { src: '/images/watch-noir.png', alt: 'Noir Ceramic front view with matte black dial' },
      DETAIL_MOVEMENT,
      DETAIL_CASEBACK,
    ],
    straps: [
      { id: 'rubber-black', name: 'Black rubber' },
      { id: 'ceramic-bracelet', name: 'Ceramic bracelet' },
    ],
    sizes: ['40mm', '42mm'],
    specs: [
      { label: 'Movement', value: 'Caliber 2200, automatic' },
      { label: 'Power reserve', value: '68 hours' },
      { label: 'Case size', value: '40mm' },
      { label: 'Case material', value: 'Black ceramic' },
      { label: 'Water resistance', value: '100m' },
      { label: 'Crystal', value: 'Sapphire, anti-reflective' },
    ],
    featured: true,
    new: true,
  },
  {
    id: 'prd-aurelia',
    slug: 'aurelia',
    name: 'Aurelia',
    collectionSlug: 'heritage',
    reference: 'HÉR-0900',
    price: 21200,
    currency: 'USD',
    gender: 'women',
    material: 'Rose gold',
    shortDescription: 'Mother-of-pearl and rose gold, in perfect proportion.',
    description:
      'The Aurelia is light made mechanical. A mother-of-pearl dial glows beneath diamond hour markers, cased in warm rose gold and finished by hand to a mirror polish.',
    image: '/images/watch-aurelia.png',
    imageAlt: 'Rose gold ladies luxury watch with mother of pearl dial and diamond hour markers',
    hoverImage: '/images/collection-heritage.png',
    gallery: [
      { src: '/images/watch-aurelia.png', alt: 'Aurelia front view with mother of pearl dial' },
      DETAIL_MOVEMENT,
      DETAIL_CASEBACK,
    ],
    straps: [
      { id: 'leather-taupe', name: 'Taupe leather' },
      { id: 'gold-bracelet', name: 'Rose gold bracelet' },
    ],
    sizes: ['33mm', '36mm'],
    specs: [
      { label: 'Movement', value: 'Caliber 0900, automatic' },
      { label: 'Power reserve', value: '60 hours' },
      { label: 'Case size', value: '33mm' },
      { label: 'Case material', value: '18k rose gold' },
      { label: 'Water resistance', value: '30m' },
      { label: 'Crystal', value: 'Sapphire, anti-reflective' },
    ],
    featured: false,
    new: false,
  },
  {
    id: 'prd-tourbillon',
    slug: 'grand-tourbillon',
    name: 'Grand Tourbillon',
    collectionSlug: 'atelier',
    reference: 'ATL-0001',
    price: 268000,
    currency: 'USD',
    gender: 'men',
    material: 'Platinum',
    shortDescription: 'A flying tourbillon, signed and numbered.',
    description:
      'The summit of the house. A flying tourbillon turns beneath an openworked platinum architecture, each bridge beveled and polished by a single master over eleven months. Fewer than twelve leave the atelier each year.',
    image: '/images/watch-tourbillon.png',
    imageAlt: 'Skeleton tourbillon luxury watch with exposed mechanical movement in a platinum case',
    hoverImage: '/images/collection-atelier.png',
    gallery: [
      { src: '/images/watch-tourbillon.png', alt: 'Grand Tourbillon front view with openworked dial' },
      DETAIL_MOVEMENT,
    ],
    straps: [{ id: 'alligator-black', name: 'Black alligator' }],
    sizes: ['42mm'],
    specs: [
      { label: 'Movement', value: 'Caliber 0001, manual flying tourbillon' },
      { label: 'Power reserve', value: '100 hours' },
      { label: 'Case size', value: '42mm' },
      { label: 'Case material', value: '950 platinum' },
      { label: 'Water resistance', value: '30m' },
      { label: 'Crystal', value: 'Double-domed sapphire' },
    ],
    featured: true,
    new: false,
  },
]

export const materials: Material[] = [
  { id: 'mat-steel', name: 'Steel', description: 'Surgical-grade 904L, brushed and polished by hand.' },
  { id: 'mat-gold', name: 'Gold', description: 'Foundry-cast 18k, warmed to the house tone.' },
  { id: 'mat-ceramic', name: 'Ceramic', description: 'High-density zirconium oxide, scratch-defiant.' },
  { id: 'mat-sapphire', name: 'Sapphire crystal', description: 'Double anti-reflective, grown in our own kilns.' },
  { id: 'mat-platinum', name: 'Platinum', description: '950 purity, the rarest metal in the collection.' },
  { id: 'mat-titanium', name: 'Titanium', description: 'Grade 5, engineered for lightness under load.' },
]

/* ----------------------------- Getter functions ----------------------------- */
/* Each mirrors a future Supabase query. Swap the body, keep the signature. */

function mapProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    collectionSlug: row.collection_slug,
    reference: row.reference,
    price: Number(row.price),
    currency: row.currency,
    gender: row.gender,
    material: row.material,
    shortDescription: row.short_description,
    description: row.description,
    image: row.image,
    imageAlt: row.image_alt,
    hoverImage: row.hover_image,
    gallery: row.gallery ?? [],
    straps: row.straps ?? [],
    sizes: row.sizes ?? [],
    specs: row.specs ?? [],
    featured: row.featured,
    new: row.is_new,
  }
}

function mapCollection(row: any): Collection {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    image: row.image,
    imageAlt: row.image_alt,
  }
}

export async function getCollections(): Promise<Collection[]> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('collections').select('*')
    if (data) return data.map(mapCollection)
  }
  return collections
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('collections').select('*').eq('slug', slug).single()
    if (data) return mapCollection(data)
  }
  return collections.find((c) => c.slug === slug)
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('products').select('*')
    if (data) return data.map(mapProduct)
  }
  return products
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('products').select('*').eq('featured', true)
    if (data) return data.map(mapProduct)
  }
  return products.filter((p) => p.featured)
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('products').select('*').eq('slug', slug).single()
    if (data) return mapProduct(data)
  }
  return products.find((p) => p.slug === slug)
}

export async function getProductsByCollection(slug: string): Promise<Product[]> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('products').select('*').eq('collection_slug', slug)
    if (data) return data.map(mapProduct)
  }
  return products.filter((p) => p.collectionSlug === slug)
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  const all = await getProducts()
  const current = all.find((p) => p.slug === slug)
  if (!current) return all.slice(0, 4)
  return all
    .filter((p) => p.slug !== slug && p.collectionSlug === current.collectionSlug)
    .concat(all.filter((p) => p.slug !== slug && p.collectionSlug !== current.collectionSlug))
    .slice(0, 4)
}

export async function getMaterials(): Promise<Material[]> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('materials').select('*')
    if (data) return data as Material[]
  }
  return materials
}
