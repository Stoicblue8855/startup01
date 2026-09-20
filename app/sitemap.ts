import type { MetadataRoute } from 'next'
import { getJournalPosts } from '@/lib/content'
import { getProducts } from '@/lib/products'

const BASE_URL = 'https://www.samaychakkra.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([getProducts(), getJournalPosts()])

  const staticRoutes = [
    '',
    '/shop',
    '/about',
    '/journal',
    '/contact',
    '/faq',
    '/sustainability',
    '/careers',
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }))

  const productRoutes = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: new Date(),
  }))

  const journalRoutes = posts.map((p) => ({
    url: `${BASE_URL}/journal/${p.slug}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...productRoutes, ...journalRoutes]
}
