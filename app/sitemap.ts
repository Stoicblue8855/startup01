import type { MetadataRoute } from 'next'
import { getJournalPosts } from '@/lib/content'
import { getProducts } from '@/lib/products'
import { getPageTextMap } from '@/lib/page-text-server'
import { isShown, PATH_SWITCH } from '@/lib/show'

const BASE_URL = 'https://www.samaychakkra.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, allPosts, textMap] = await Promise.all([getProducts(), getJournalPosts(), getPageTextMap()])
  const posts = isShown(textMap, 'show.page.journal') ? allPosts : []

  const staticRoutes = [
    '',
    '/shop',
    '/about',
    '/journal',
    '/contact',
    '/faq',
    '/sustainability',
    '/careers',
  ]
    .filter((path) => !PATH_SWITCH[path] || isShown(textMap, PATH_SWITCH[path]))
    .map((path) => ({
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
