'use client'

import { type ReactNode } from 'react'
import { CartProvider } from '@/components/cart/cart-context'
import { CartDrawer, WishlistDrawer } from '@/components/cart/drawers'
import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { Preloader } from './preloader'
import { Navbar } from './navbar'
import { Footer } from './footer'

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <SmoothScroll>
        <Preloader />
        <Navbar />
        <main id="main" className="min-h-dvh">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <WishlistDrawer />
      </SmoothScroll>
    </CartProvider>
  )
}
