'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Minus, Plus, X } from 'lucide-react'
import { type ReactNode, useEffect } from 'react'
import { useCart } from './cart-context'
import { formatPrice } from '@/lib/format'
import { LuxButton } from '@/components/brand/lux-button'

function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[81] flex h-dvh w-full max-w-md flex-col border-l border-border bg-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-serif text-xl">{title}</h2>
              <button
                onClick={onClose}
                className="text-muted-foreground transition-colors hover:text-gold"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer && <div className="border-t border-border px-6 py-6">{footer}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, updateQuantity, removeFromCart, cartTotal } = useCart()

  return (
    <Drawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      title="Your Selection"
      footer={
        lines.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="uppercase tracking-wide-luxe text-muted-foreground">Subtotal</span>
              <span className="font-serif text-lg">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Complimentary insured delivery and a five-year warranty on every piece.
            </p>
            <LuxButton
              href="/contact?intent=order"
              variant="solid"
              className="w-full"
              magnetic={false}
              onClick={() => setCartOpen(false)}
            >
              Request order
            </LuxButton>
          </div>
        ) : null
      }
    >
      {lines.length === 0 ? (
        <EmptyState
          message="Your selection is empty."
          cta={
            <LuxButton href="/shop" variant="outline" magnetic={false} onClick={() => setCartOpen(false)}>
              Browse watches
            </LuxButton>
          }
        />
      ) : (
        <ul className="space-y-6">
          {lines.map((l) => (
            <li key={`${l.slug}-${l.strap}-${l.size}`} className="flex gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden bg-secondary">
                <Image src={l.image || '/placeholder.svg'} alt={l.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-serif text-base leading-tight">{l.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {l.strap} · {l.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(l.slug, l.strap, l.size)}
                    className="text-muted-foreground transition-colors hover:text-gold"
                    aria-label={`Remove ${l.name}`}
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center border border-border">
                    <button
                      className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-gold"
                      onClick={() => updateQuantity(l.slug, l.strap, l.size, l.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">{l.quantity}</span>
                    <button
                      className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-gold"
                      onClick={() => updateQuantity(l.slug, l.strap, l.size, l.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <span className="text-sm tabular-nums">{formatPrice(l.price * l.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  )
}

export function WishlistDrawer() {
  const { wishlistOpen, setWishlistOpen, wishlist, toggleWishlist, addToCart } = useCart()

  return (
    <Drawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} title="Wishlist">
      {wishlist.length === 0 ? (
        <EmptyState
          message="Your wishlist is empty."
          cta={
            <LuxButton
              href="/shop"
              variant="outline"
              magnetic={false}
              onClick={() => setWishlistOpen(false)}
            >
              Discover watches
            </LuxButton>
          }
        />
      ) : (
        <ul className="space-y-6">
          {wishlist.map((w) => (
            <li key={w.slug} className="flex gap-4">
              <Link
                href={`/product/${w.slug}`}
                onClick={() => setWishlistOpen(false)}
                className="relative size-20 shrink-0 overflow-hidden bg-secondary"
              >
                <Image src={w.image || '/placeholder.svg'} alt={w.name} fill className="object-cover" sizes="80px" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/product/${w.slug}`}
                      onClick={() => setWishlistOpen(false)}
                      className="font-serif text-base leading-tight transition-colors hover:text-gold"
                    >
                      {w.name}
                    </Link>
                    <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                      {formatPrice(w.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleWishlist(w)}
                    className="text-gold"
                    aria-label={`Remove ${w.name} from wishlist`}
                  >
                    <Heart className="size-4 fill-current" />
                  </button>
                </div>
                <button
                  className="mt-auto self-start pt-3 text-xs uppercase tracking-wide-luxe text-foreground/80 underline-offset-4 transition-colors hover:text-gold hover:underline"
                  onClick={() => {
                    addToCart({
                      slug: w.slug,
                      name: w.name,
                      price: w.price,
                      image: w.image,
                      strap: 'Default',
                      size: 'Standard',
                    })
                    setWishlistOpen(false)
                  }}
                >
                  Add to selection
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  )
}

function EmptyState({ message, cta }: { message: string; cta: ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
      <p className="font-serif text-lg text-muted-foreground">{message}</p>
      {cta}
    </div>
  )
}
