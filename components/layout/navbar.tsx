'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/brand/logo'
import { DrawLink } from '@/components/brand/lux-button'
import { Magnetic } from '@/components/motion/magnetic'
import { useCart } from '@/components/cart/cart-context'
import { SearchOverlay } from './search-overlay'
import { collections } from '@/lib/products'
import { useScrollLock } from '@/lib/scroll-lock'

const navLinks = [
  { label: 'Watches', href: '/shop' },
  { label: 'Heritage', href: '/about' },
  { label: 'Journal', href: '/journal' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { cartCount, wishlist, setCartOpen, setWishlistOpen } = useCart()

  useScrollLock(menuOpen)

  // The navbar persists across route changes, so without this the mobile
  // menu could stay open on top of whatever page a link navigated to.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Only the homepage has a full-bleed hero the bar floats over.
  const overHero = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const solid = scrolled || !overHero

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[70] border-b bg-background/75 backdrop-blur-md transition-all duration-500',
          solid ? 'border-border bg-background/90' : 'border-border/40',
        )}
      >
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-10">
          <div className="flex items-center gap-3">
            <button
              className="text-foreground transition-colors hover:text-gold lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <Link href="/" aria-label="Home" className="transition-opacity hover:opacity-80">
              <Logo />
            </Link>
          </div>

          <div className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <DrawLink
                key={link.href}
                href={link.href}
                active={pathname === link.href || pathname.startsWith(link.href + '/')}
              >
                {link.label}
              </DrawLink>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-5">
            <IconButton label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="size-[18px]" />
            </IconButton>
            <IconButton label="Account" href="/account">
              <User className="size-[18px]" />
            </IconButton>
            <IconButton label="Wishlist" onClick={() => setWishlistOpen(true)} badge={wishlist.length}>
              <Heart className="size-[18px]" />
            </IconButton>
            <IconButton label="Cart" onClick={() => setCartOpen(true)} badge={cartCount}>
              <ShoppingBag className="size-[18px]" />
            </IconButton>
          </div>
        </nav>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[85] bg-background lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <Logo />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="hover:text-gold">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex flex-col px-5 pt-10">
              {[...navLinks, { label: 'Contact', href: '/contact' }].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="block border-b border-border py-5 font-serif text-3xl transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                {collections.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop?collection=${c.slug}`}
                    className="text-xs uppercase tracking-wide-luxe text-muted-foreground transition-colors hover:text-gold"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function IconButton({
  children,
  label,
  onClick,
  href,
  badge,
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
  href?: string
  badge?: number
}) {
  const inner = (
    <span className="relative inline-flex text-foreground transition-colors duration-300 hover:text-gold">
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium tabular-nums text-background">
          {badge}
        </span>
      )}
    </span>
  )

  return (
    <Magnetic strength={0.4}>
      {href ? (
        <Link href={href} aria-label={label}>
          {inner}
        </Link>
      ) : (
        <button onClick={onClick} aria-label={label}>
          {inner}
        </button>
      )}
    </Magnetic>
  )
}
