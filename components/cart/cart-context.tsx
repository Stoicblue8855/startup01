'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export interface CartLine {
  slug: string
  name: string
  price: number
  image: string
  strap: string
  size: string
  quantity: number
}

export interface WishlistItem {
  slug: string
  name: string
  price: number
  image: string
}

interface CartState {
  lines: CartLine[]
  wishlist: WishlistItem[]
  cartOpen: boolean
  wishlistOpen: boolean
  addToCart: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void
  removeFromCart: (slug: string, strap: string, size: string) => void
  updateQuantity: (slug: string, strap: string, size: string, quantity: number) => void
  toggleWishlist: (item: WishlistItem) => void
  isWishlisted: (slug: string) => boolean
  setCartOpen: (open: boolean) => void
  setWishlistOpen: (open: boolean) => void
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartState | null>(null)

const lineKey = (slug: string, strap: string, size: string) => `${slug}::${strap}::${size}`

/**
 * In-memory cart + wishlist, persisted to localStorage for the current session.
 * This is a deliberate placeholder for a future Supabase `carts` table — swap
 * the persistence layer without changing the consuming components.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const c = localStorage.getItem('brand-cart')
      const w = localStorage.getItem('brand-wishlist')
      if (c) setLines(JSON.parse(c))
      if (w) setWishlist(JSON.parse(w))
    } catch {
      /* ignore malformed storage */
    } finally {
      setHydrated(true)
    }
  }, [])

  // Skip writing back to storage until after the initial read above completes,
  // so we never briefly overwrite a returning visitor's saved cart with [].
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('brand-cart', JSON.stringify(lines))
  }, [lines, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('brand-wishlist', JSON.stringify(wishlist))
  }, [wishlist, hydrated])

  const addToCart = useCallback<CartState['addToCart']>((line, quantity = 1) => {
    setLines((prev) => {
      const key = lineKey(line.slug, line.strap, line.size)
      const existing = prev.find((l) => lineKey(l.slug, l.strap, l.size) === key)
      if (existing) {
        return prev.map((l) =>
          lineKey(l.slug, l.strap, l.size) === key
            ? { ...l, quantity: l.quantity + quantity }
            : l,
        )
      }
      return [...prev, { ...line, quantity }]
    })
    setCartOpen(true)
  }, [])

  const removeFromCart = useCallback<CartState['removeFromCart']>((slug, strap, size) => {
    setLines((prev) =>
      prev.filter((l) => lineKey(l.slug, l.strap, l.size) !== lineKey(slug, strap, size)),
    )
  }, [])

  const updateQuantity = useCallback<CartState['updateQuantity']>(
    (slug, strap, size, quantity) => {
      setLines((prev) =>
        prev
          .map((l) =>
            lineKey(l.slug, l.strap, l.size) === lineKey(slug, strap, size)
              ? { ...l, quantity: Math.max(0, quantity) }
              : l,
          )
          .filter((l) => l.quantity > 0),
      )
    },
    [],
  )

  const toggleWishlist = useCallback<CartState['toggleWishlist']>((item) => {
    setWishlist((prev) =>
      prev.some((w) => w.slug === item.slug)
        ? prev.filter((w) => w.slug !== item.slug)
        : [...prev, item],
    )
  }, [])

  const isWishlisted = useCallback(
    (slug: string) => wishlist.some((w) => w.slug === slug),
    [wishlist],
  )

  const cartCount = useMemo(() => lines.reduce((n, l) => n + l.quantity, 0), [lines])
  const cartTotal = useMemo(
    () => lines.reduce((n, l) => n + l.price * l.quantity, 0),
    [lines],
  )

  const value: CartState = {
    lines,
    wishlist,
    cartOpen,
    wishlistOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    isWishlisted,
    setCartOpen,
    setWishlistOpen,
    cartCount,
    cartTotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
