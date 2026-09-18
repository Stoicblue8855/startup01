'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Check,
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Plus,
  Settings as SettingsIcon,
  ShoppingBag,
  Trash2,
  User,
} from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import { LuxButton } from '@/components/brand/lux-button'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

type Tab = 'overview' | 'orders' | 'wishlist' | 'addresses' | 'settings'

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

// Placeholder — will come from a real `orders` table once checkout is wired up.
const mockOrders = [
  {
    id: 'SC-10234',
    date: 'Sept 14, 2026',
    status: 'Processing' as const,
    slug: 'grand-tourbillon',
    name: 'Grand Tourbillon',
    image: '/images/watch-tourbillon.png',
    price: 22240000,
  },
  {
    id: 'SC-10198',
    date: 'Aug 30, 2026',
    status: 'Delivered' as const,
    slug: 'meridian-chronograph',
    name: 'Meridian Chronograph',
    image: '/images/watch-meridian.png',
    price: 1070000,
  },
]

const statusStyles: Record<string, string> = {
  Processing: 'bg-gold/10 text-gold border-gold/30',
  'In Transit': 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  Delivered: 'bg-green-600/10 text-green-700 border-green-600/30',
}

export function AccountDashboard({ name, email }: { name: string; email: string }) {
  const [tab, setTab] = useState<Tab>('overview')
  const { wishlist, toggleWishlist, addToCart } = useCart()

  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 md:px-10 md:pt-32">
      {/* Header */}
      <div className="flex flex-col items-center gap-5 border-b border-border pb-10 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gold/12 font-serif text-2xl text-gold">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-2xl md:text-3xl">{name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{email}</p>
        </div>
        <button className="flex items-center gap-2 self-center border border-border px-4 py-2 text-xs uppercase tracking-luxe text-muted-foreground transition-colors hover:border-gold hover:text-foreground">
          <Pencil className="size-3.5" />
          Edit profile
        </button>
      </div>

      {/* Tabs */}
      <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto border-b border-border pb-px">
        {tabs.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm transition-colors',
                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              {t.label}
              {t.id === 'wishlist' && wishlist.length > 0 && (
                <span className="flex size-4 items-center justify-center rounded-full bg-gold text-[10px] text-background">
                  {wishlist.length}
                </span>
              )}
              {active && (
                <motion.span
                  layoutId="account-tab-underline"
                  className="absolute inset-x-0 -bottom-px h-[2px] bg-gold"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="min-h-[50dvh] pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === 'overview' && (
              <OverviewTab
                name={name}
                wishlistCount={wishlist.length}
                ordersCount={mockOrders.length}
                onNavigate={setTab}
              />
            )}
            {tab === 'orders' && <OrdersTab />}
            {tab === 'wishlist' && (
              <WishlistTab
                items={wishlist}
                onRemove={toggleWishlist}
                onAddToCart={(item) =>
                  addToCart({ slug: item.slug, name: item.name, price: item.price, image: item.image, strap: 'Default', size: 'Standard' })
                }
              />
            )}
            {tab === 'addresses' && <AddressesTab />}
            {tab === 'settings' && <SettingsTab name={name} email={email} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function StatCard({ label, value, onClick }: { label: string; value: string | number; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-1 border border-border p-5 text-left transition-colors hover:border-gold"
    >
      <span className="font-serif text-3xl text-gold">{value}</span>
      <span className="text-xs uppercase tracking-luxe text-muted-foreground">{label}</span>
    </button>
  )
}

function OverviewTab({
  name,
  wishlistCount,
  ordersCount,
  onNavigate,
}: {
  name: string
  wishlistCount: number
  ordersCount: number
  onNavigate: (t: Tab) => void
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">Welcome back, {name.split(' ')[0]}.</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Orders" value={ordersCount} onClick={() => onNavigate('orders')} />
        <StatCard label="Wishlist" value={wishlistCount} onClick={() => onNavigate('wishlist')} />
        <StatCard label="Member since" value="2026" />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Recent order</h2>
          <button onClick={() => onNavigate('orders')} className="flex items-center gap-1 text-xs uppercase tracking-luxe text-gold">
            View all
            <ChevronRight className="size-3.5" />
          </button>
        </div>
        <div className="mt-4">
          <OrderRow order={mockOrders[0]} />
        </div>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <QuickLink icon={Package} label="Track an order" onClick={() => onNavigate('orders')} />
        <QuickLink icon={MapPin} label="Manage addresses" onClick={() => onNavigate('addresses')} />
      </div>
    </div>
  )
}

function QuickLink({ icon: Icon, label, onClick }: { icon: typeof User; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between border border-border px-5 py-4 text-sm transition-colors hover:border-gold"
    >
      <span className="flex items-center gap-3">
        <Icon className="size-4 text-gold" />
        {label}
      </span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  )
}

function OrderRow({ order }: { order: (typeof mockOrders)[number] }) {
  return (
    <Link
      href={`/product/${order.slug}`}
      className="flex items-center gap-4 border border-border p-4 transition-colors hover:border-gold"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-secondary">
        <Image src={order.image || '/placeholder.svg'} alt={order.name} fill sizes="64px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-base">{order.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          #{order.id} · {order.date}
        </p>
      </div>
      <span
        className={cn(
          'shrink-0 rounded-full border px-3 py-1 text-[11px] uppercase tracking-wide',
          statusStyles[order.status],
        )}
      >
        {order.status}
      </span>
    </Link>
  )
}

function OrdersTab() {
  if (mockOrders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        body="When you place an order, it will show up here with live tracking."
        cta="Start shopping"
        href="/shop"
      />
    )
  }
  return (
    <div className="space-y-3">
      {mockOrders.map((o) => (
        <OrderRow key={o.id} order={o} />
      ))}
    </div>
  )
}

function WishlistTab({
  items,
  onRemove,
  onAddToCart,
}: {
  items: { slug: string; name: string; price: number; image: string }[]
  onRemove: (item: { slug: string; name: string; price: number; image: string }) => void
  onAddToCart: (item: { slug: string; name: string; price: number; image: string }) => void
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        body="Tap the heart on any watch to save it here for later."
        cta="Browse the collection"
        href="/shop"
      />
    )
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.slug} className="group relative">
          <Link href={`/product/${item.slug}`} className="block">
            <div className="relative aspect-square overflow-hidden rounded-sm bg-secondary">
              <Image
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 45vw, 22vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-3 truncate text-sm">{item.name}</p>
            <p className="text-sm text-gold">{formatPrice(item.price)}</p>
          </Link>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onAddToCart(item)}
              className="flex flex-1 items-center justify-center gap-1.5 border border-border py-2 text-xs uppercase tracking-luxe transition-colors hover:border-gold"
            >
              <ShoppingBag className="size-3.5" />
              Add
            </button>
            <button
              onClick={() => onRemove(item)}
              aria-label="Remove from wishlist"
              className="flex size-9 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function AddressesTab() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      line: '14B, Sea Breeze Apartments, Carter Road, Bandra West',
      city: 'Mumbai, Maharashtra 400050',
      isDefault: true,
    },
  ])
  const [adding, setAdding] = useState(false)

  return (
    <div>
      <div className="space-y-3">
        {addresses.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-4 border border-border p-5">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-serif text-lg">{a.label}</p>
                {a.isDefault && (
                  <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-gold">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{a.line}</p>
              <p className="text-sm text-muted-foreground">{a.city}</p>
            </div>
            <button
              onClick={() => setAddresses((prev) => prev.filter((x) => x.id !== a.id))}
              aria-label="Remove address"
              className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {adding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={(e) => {
              e.preventDefault()
              setAdding(false)
            }}
            className="mt-4 space-y-4 overflow-hidden border border-border p-5"
          >
            <input placeholder="Label (e.g. Home, Office)" className="w-full border-b border-border bg-transparent py-2 text-sm focus:border-gold focus:outline-none" />
            <input placeholder="Address line" className="w-full border-b border-border bg-transparent py-2 text-sm focus:border-gold focus:outline-none" />
            <input placeholder="City, state, PIN code" className="w-full border-b border-border bg-transparent py-2 text-sm focus:border-gold focus:outline-none" />
            <div className="flex gap-3 pt-2">
              <LuxButton type="submit">Save address</LuxButton>
              <button type="button" onClick={() => setAdding(false)} className="text-xs uppercase tracking-luxe text-muted-foreground">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!adding && (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 border border-dashed border-border py-4 text-xs uppercase tracking-luxe text-muted-foreground transition-colors hover:border-gold hover:text-gold"
        >
          <Plus className="size-4" />
          Add new address
        </button>
      )}
    </div>
  )
}

function SettingsTab({ name, email }: { name: string; email: string }) {
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="max-w-lg space-y-10">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        }}
        className="space-y-5"
      >
        <h2 className="font-serif text-xl">Your details</h2>
        <div>
          <label className="text-xs uppercase tracking-luxe text-muted-foreground">Full name</label>
          <input defaultValue={name} className="mt-2 w-full border-b border-border bg-transparent py-2.5 focus:border-gold focus:outline-none" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-luxe text-muted-foreground">Email</label>
          <input defaultValue={email} className="mt-2 w-full border-b border-border bg-transparent py-2.5 focus:border-gold focus:outline-none" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-luxe text-muted-foreground">Phone</label>
          <input placeholder="+91 98765 43210" className="mt-2 w-full border-b border-border bg-transparent py-2.5 focus:border-gold focus:outline-none" />
        </div>
        <div className="flex items-center gap-3 pt-1">
          <LuxButton type="submit">Save changes</LuxButton>
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-sm text-gold"
              >
                <Check className="size-4" />
                Saved
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </form>

      <div className="border-t border-border pt-8">
        <h2 className="font-serif text-xl">Notifications</h2>
        <button
          onClick={() => setNotifications((n) => !n)}
          className="mt-4 flex w-full items-center justify-between border border-border px-5 py-4"
        >
          <span className="flex items-center gap-3 text-sm">
            <Bell className="size-4 text-gold" />
            New releases & private previews
          </span>
          <span
            className={cn(
              'relative h-6 w-11 shrink-0 rounded-full transition-colors',
              notifications ? 'bg-gold' : 'bg-border',
            )}
          >
            <motion.span
              className="absolute top-0.5 size-5 rounded-full bg-background shadow"
              animate={{ left: notifications ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </span>
        </button>
      </div>

      <div className="border-t border-border pt-8">
        <button className="flex items-center gap-2 text-sm text-destructive transition-opacity hover:opacity-70">
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
  href,
}: {
  icon: typeof User
  title: string
  body: string
  cta: string
  href: string
}) {
  return (
    <div className="flex flex-col items-center gap-4 border border-dashed border-border px-6 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-gold/10 text-gold">
        <Icon className="size-6" />
      </span>
      <div>
        <h3 className="font-serif text-xl">{title}</h3>
        <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{body}</p>
      </div>
      <LuxButton href={href} className="mt-2">
        {cta}
      </LuxButton>
    </div>
  )
}
