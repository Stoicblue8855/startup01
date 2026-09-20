'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/cart/cart-context'
import { LuxButton } from '@/components/brand/lux-button'
import { Reveal } from '@/components/motion/reveal'

export function ProductDetail({ product }: { product: Product }) {
  const images = product.gallery.length > 0 ? product.gallery : [{ src: product.image, alt: product.imageAlt }]
  const [activeImage, setActiveImage] = useState(0)
  const [strap, setStrap] = useState(product.straps[0]?.name ?? 'Default')
  const [size, setSize] = useState(product.sizes[0] ?? 'Standard')
  const [added, setAdded] = useState(false)

  const { addToCart, toggleWishlist, isWishlisted } = useCart()
  const wishlisted = isWishlisted(product.slug)

  function handleAddToCart() {
    addToCart({ slug: product.slug, name: product.name, price: product.price, image: product.image, strap, size })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={images[activeImage]?.src || '/placeholder.svg'}
            alt={images[activeImage]?.alt || product.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button
                key={img.src + i}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  'relative aspect-square overflow-hidden bg-secondary transition-opacity',
                  i === activeImage ? 'opacity-100 ring-1 ring-gold' : 'opacity-60 hover:opacity-100',
                )}
              >
                <Image src={img.src || '/placeholder.svg'} alt={img.alt} fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <Reveal>
          <p className="text-xs uppercase tracking-wide-luxe text-gold">{product.reference}</p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-balance md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl tabular-nums text-foreground">{formatPrice(product.price, product.currency)}</p>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">{product.description}</p>
        </Reveal>

        {product.straps.length > 0 && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Strap</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.straps.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStrap(s.name)}
                  className={cn(
                    'border px-4 py-2 text-xs uppercase tracking-wide-luxe transition-colors',
                    strap === s.name
                      ? 'border-gold bg-gold text-background'
                      : 'border-border text-muted-foreground hover:border-gold hover:text-foreground',
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Case size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    'border px-4 py-2 text-xs uppercase tracking-wide-luxe transition-colors',
                    size === s
                      ? 'border-gold bg-gold text-background'
                      : 'border-border text-muted-foreground hover:border-gold hover:text-foreground',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center gap-3">
          <LuxButton onClick={handleAddToCart} className="flex-1 sm:flex-none">
            {added ? 'Added' : 'Add to cart'}
          </LuxButton>
          <button
            onClick={() =>
              toggleWishlist({ slug: product.slug, name: product.name, price: product.price, image: product.image })
            }
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wishlisted}
            className="flex size-[52px] shrink-0 items-center justify-center border border-border text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            <Heart className={cn('size-5', wishlisted && 'fill-gold text-gold')} />
          </button>
        </div>

        <details className="group mt-10 border-t border-border pt-6">
          <summary className="flex cursor-pointer items-center justify-between text-xs uppercase tracking-wide-luxe text-foreground">
            Specifications
            <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
          </summary>
          <dl className="mt-5 space-y-3">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex justify-between gap-6 border-b border-border pb-3 text-sm">
                <dt className="text-muted-foreground">{spec.label}</dt>
                <dd className="text-right text-foreground">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </details>

        <details className="group mt-4 border-t border-border pt-6">
          <summary className="flex cursor-pointer items-center justify-between text-xs uppercase tracking-wide-luxe text-foreground">
            Delivery &amp; warranty
            <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Every piece ships insured, in atelier packaging, with a two-year international warranty and complimentary
            first service. Delivery typically takes 3–5 business days.
          </p>
        </details>
      </div>
    </div>
  )
}
