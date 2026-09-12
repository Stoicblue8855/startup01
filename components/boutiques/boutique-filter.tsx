'use client'

import { useMemo, useState } from 'react'
import { MapPin, Phone } from 'lucide-react'
import type { Boutique } from '@/lib/types'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

export function BoutiqueFilter({ boutiques }: { boutiques: Boutique[] }) {
  const [region, setRegion] = useState<string>('all')

  const regions = useMemo(() => ['all', ...Array.from(new Set(boutiques.map((b) => b.region)))], [boutiques])
  const filtered = useMemo(
    () => (region === 'all' ? boutiques : boutiques.filter((b) => b.region === region)),
    [boutiques, region],
  )

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={cn(
              'border px-4 py-2 text-xs uppercase tracking-wide-luxe transition-colors',
              region === r
                ? 'border-gold bg-gold text-background'
                : 'border-border text-muted-foreground hover:border-gold hover:text-foreground',
            )}
          >
            {r === 'all' ? 'All regions' : r}
          </button>
        ))}
      </div>

      <RevealGroup className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <RevealItem key={b.id} className="border-t border-border pt-6">
            <h3 className="font-serif text-2xl">{b.city}</h3>
            <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">{b.country}</p>
            <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              {b.address}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 shrink-0 text-gold" />
              {b.phone}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{b.hours}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}
