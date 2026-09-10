import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { SiteShell } from '@/components/layout/site-shell'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: '[BRAND NAME] — Time, made to be inherited.',
    template: '%s · [BRAND NAME]',
  },
  description:
    'For a century and a half, [BRAND NAME] has built luxury watches meant to outlast their owners. Precision without compromise. Beauty without noise.',
  generator: 'v0.app',
  keywords: ['luxury watches', 'haute horlogerie', 'automatic watch', 'tourbillon', 'chronograph', '[BRAND NAME]'],
  openGraph: {
    title: '[BRAND NAME] — Time, made to be inherited.',
    description: 'Luxury watches, built to outlast their owners.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#231f1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} bg-background`}>
      <body className="antialiased">
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
