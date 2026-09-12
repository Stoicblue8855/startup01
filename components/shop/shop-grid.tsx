'use client'

import { useMemo, useState } from 'react'
import type { Collection, Product } from '@/lib/types'
import { ProductCard } from '@/components/shop/product-card'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name'

export function ShopGrid({
  products,
  collections,
  initialCollection,
}: {
  products: Product[]
  collections: Collection[]
  initialCollection?: string
}) {
  const [collection, setCollection] = useState<string>(initialCollection ?? 'all')
  const [gender, setGender] = useState<'all' | Product['gender']>('all')
  const [sort, setSort] = useState<Sort>('featured')

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (collection === 'all' || p.collectionSlug === collection) &&
        (gender === 'all' || p.gender === gender),
    )
    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'name':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
    }
    return list
  }, [products, collection, gender, sort])

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={collection === 'all'} onClick={() => setCollection('all')}>
            All
          </FilterChip>
          {collections.map((c) => (
            <FilterChip key={c.slug} active={collection === c.slug} onClick={() => setCollection(c.slug)}>
              {c.name}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as typeof gender)}
            className="cursor-pointer border border-border bg-transparent px-3 py-2 text-xs uppercase tracking-wide-luxe text-muted-foreground transition-colors hover:border-gold hover:text-foreground focus:outline-none"
          >
            <option value="all" className="bg-card text-foreground">
              All wearers
            </option>
            <option value="men" className="bg-card text-foreground">
              Men
            </option>
            <option value="women" className="bg-card text-foreground">
              Women
            </option>
            <option value="unisex" className="bg-card text-foreground">
              Unisex
            </option>
          </select>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="cursor-pointer border border-border bg-transparent px-3 py-2 text-xs uppercase tracking-wide-luxe text-muted-foreground transition-colors hover:border-gold hover:text-foreground focus:outline-none"
          >
            <option value="featured" className="bg-card text-foreground">
              Featured
            </option>
            <option value="price-asc" className="bg-card text-foreground">
              Price: Low to high
            </option>
            <option value="price-desc" className="bg-card text-foreground">
              Price: High to low
            </option>
            <option value="name" className="bg-card text-foreground">
              Name
            </option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-muted-foreground">
          No pieces match those filters yet.
        </p>
      ) : (
        <RevealGroup className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-7 lg:grid-cols-4">
          {filtered.map((p) => (
            <RevealItem key={p.id}>
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'border px-4 py-2 text-xs uppercase tracking-wide-luxe transition-colors',
        active
          ? 'border-gold bg-gold text-background'
          : 'border-border text-muted-foreground hover:border-gold hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}
