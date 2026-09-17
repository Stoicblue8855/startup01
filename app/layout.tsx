import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { SiteShell } from '@/components/layout/site-shell'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://samaychakkra.com'),
  title: {
    default: 'SamayChakkra — Time, made to be inherited.',
    template: '%s · SamayChakkra',
  },
  description:
    'SamayChakkra crafts luxury automatic watches, chronographs and grand complications — precision without compromise, beauty without noise.',
  generator: 'v0.app',
  keywords: [
    'SamayChakkra',
    'luxury watches',
    'luxury watches India',
    'haute horlogerie',
    'automatic watch',
    'tourbillon',
    'chronograph',
    'skeleton watch',
  ],
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
    title: 'SamayChakkra — Time, made to be inherited.',
    description: 'Luxury automatic watches, chronographs and grand complications, built to outlast their owners.',
    type: 'website',
    siteName: 'SamayChakkra',
    locale: 'en_IN',
    url: '/',
    images: [{ url: '/images/hero-watch.png', width: 1200, height: 1200, alt: 'SamayChakkra automatic watch' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SamayChakkra — Time, made to be inherited.',
    description: 'Luxury automatic watches, chronographs and grand complications, built to outlast their owners.',
    images: ['/images/hero-watch.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6f1e6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
              description:
                'SamayChakkra crafts luxury automatic watches, chronographs and grand complications.',
              url: 'https://samaychakkra.com',
              image: 'https://samaychakkra.com/images/hero-watch.png',
              priceRange: '₹₹₹₹',
            }),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-gold focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <SiteShell>{children}</SiteShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
