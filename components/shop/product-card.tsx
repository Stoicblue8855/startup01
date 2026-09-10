'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/cart/cart-context'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart()
  const wishlisted = isWishlisted(product.slug)

  return (
    <motion.article
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.imageAlt}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
            <motion.div
              variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={product.hoverImage || product.image || '/placeholder.svg'}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          {product.new && (
            <span className="absolute left-4 top-4 bg-gold px-2.5 py-1 text-[10px] uppercase tracking-wide-luxe text-background">
              New
            </span>
          )}

          <motion.div
            variants={{ rest: { opacity: 0, y: 12 }, hover: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4 }}
            className="absolute inset-x-4 bottom-4"
          >
            <span
              onClick={(e) => {
                e.preventDefault()
                addToCart({
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  strap: product.straps[0]?.name ?? 'Default',
                  size: product.sizes[0] ?? 'Standard',
                })
              }}
              className="flex w-full items-center justify-center bg-background/90 py-3 text-xs uppercase tracking-wide-luxe text-foreground backdrop-blur transition-colors hover:bg-gold hover:text-background"
            >
              Quick add
            </span>
          </motion.div>
        </div>
      </Link>

      <button
        onClick={() =>
          toggleWishlist({
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
          })
        }
        aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wishlisted}
        className="absolute right-4 top-4 z-10 text-foreground/80 transition-colors hover:text-gold"
      >
        <Heart className={cn('size-5', wishlisted && 'fill-gold text-gold')} />
      </button>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif text-lg leading-tight transition-colors group-hover:text-gold">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs uppercase tracking-wide-luxe text-muted-foreground">
            {product.material}
          </p>
        </div>
        <span className="shrink-0 pt-1 text-sm tabular-nums text-muted-foreground">
          {formatPrice(product.price, product.currency)}
        </span>
      </div>
    </motion.article>
  )
}
