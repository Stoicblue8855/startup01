import { getSiteSettings } from '@/lib/content'
import { SiteSettingsProvider } from '@/components/common/site-settings-context'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { SiteShell } from '@/components/layout/site-shell'
import { PageTextProvider } from '@/components/common/page-text-context'
import { getPageTextMap } from '@/lib/page-text-server'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageTextMap()
  return {
  metadataBase: new URL('https://www.samaychakkra.com'),
  title: {
    default: t['seo.title'],
    template: '%s · SamayChakkra',
  },
  description: t['seo.description'],
  generator: 'v0.app',
  keywords: t['seo.keywords']
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    title: t['seo.title'],
    description: t['seo.share_description'],
    type: 'website',
    siteName: 'SamayChakkra',
    locale: 'en_IN',
    url: '/',
    images: [{ url: '/images/hero-watch-citizen.png', width: 643, height: 1113, alt: 'Citizen steel watch with a green gear-style dial' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: t['seo.title'],
    description: t['seo.share_description'],
    images: ['/images/hero-watch-citizen.png'],
  },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6f1e6',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [pageText, siteSettings] = await Promise.all([getPageTextMap(), getSiteSettings()])
  return (
    <html lang="en" className={`${inter.variable} bg-background overflow-x-hidden`}>
      <body className="overflow-x-hidden antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'JewelryStore',
              name: 'SamayChakkra',
              description: pageText['seo.business_description'],
              url: 'https://www.samaychakkra.com',
              image: 'https://www.samaychakkra.com/images/hero-watch-citizen.png',
              priceRange: '₹₹₹₹',
            }).replace(/</g, '\\u003c'),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-gold focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <PageTextProvider map={pageText}>
          <SiteSettingsProvider settings={siteSettings}>
            <SiteShell>{children}</SiteShell>
          </SiteSettingsProvider>
        </PageTextProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
