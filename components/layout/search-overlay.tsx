'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { products } from '@/lib/products'
import { formatPrice } from '@/lib/format'
import { useScrollLock } from '@/lib/scroll-lock'

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')

  useScrollLock(open)

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products.slice(0, 4)
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        (p.collectionSlug ?? '').toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-background/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mx-auto flex h-full max-w-3xl flex-col px-6 pt-28 pb-10">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-luxe text-muted-foreground">Search</span>
              <button
                onClick={onClose}
                className="text-muted-foreground transition-colors hover:text-gold"
                aria-label="Close search"
              >
                <X className="size-6" />
              </button>
            </div>
            <div className="mt-8 flex items-center gap-4 border-b border-border pb-4">
              <Search className="size-6 text-gold" />
              {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search watches, collections, references…"
                className="w-full bg-transparent font-serif text-2xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none md:text-3xl"
                aria-label="Search watches"
              />
            </div>
            <div className="mt-8 flex-1 overflow-y-auto">
              <p className="mb-4 text-xs uppercase tracking-wide-luxe text-muted-foreground">
                {query.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Suggestions'}
              </p>
              <ul className="divide-y divide-border">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={onClose}
                      className="group flex items-center gap-5 py-4"
                    >
                      <div className="relative size-16 shrink-0 overflow-hidden bg-secondary">
                        <Image src={p.image || '/placeholder.svg'} alt={p.imageAlt} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-lg transition-colors group-hover:text-gold">{p.name}</p>
                        <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">
                          {p.material}
                        </p>
                      </div>
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {formatPrice(p.price, p.currency)}
                      </span>
                    </Link>
                  </li>
                ))}
                {query.trim() && results.length === 0 && (
                  <li className="py-10 text-center font-serif text-lg text-muted-foreground">
                    No pieces match &ldquo;{query}&rdquo;.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
