'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import type { User } from '@supabase/supabase-js'
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
  User as UserIcon,
} from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import { useAuth } from './auth-context'
import { LuxButton } from '@/components/brand/lux-button'
import { formatPrice } from '@/lib/format'
import { getSupabaseClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type Tab = 'overview' | 'orders' | 'wishlist' | 'addresses' | 'settings'

const tabs: { id: Tab; label: string; icon: typeof UserIcon }[] = [
  { id: 'overview', label: 'Overview', icon: UserIcon },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

const statusStyles: Record<string, string> = {
  processing: 'bg-gold/10 text-gold border-gold/30',
  shipped: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  delivered: 'bg-green-600/10 text-green-700 border-green-600/30',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/30',
}

interface Profile {
  full_name: string | null
  email: string | null
  phone: string | null
}

interface OrderItem {
  id: string
  product_slug: string
  product_name: string
  image: string | null
  price: number
  quantity: number
}

interface Order {
  id: string
  order_number: string
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  currency: string
  created_at: string
  order_items: OrderItem[]
}

interface Address {
  id: string
  label: string
  line1: string
  city: string
  state: string | null
  postal_code: string | null
  country: string
  is_default: boolean
}

export function AccountDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>('overview')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const { wishlist, toggleWishlist, addToCart } = useCart()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    let active = true
    async function load() {
      const [{ data: profileData }, { data: orderData }, { data: addressData }] = await Promise.all([
        supabase!.from('profiles').select('full_name, email, phone').eq('id', user.id).maybeSingle(),
        supabase!
          .from('orders')
          .select('id, order_number, status, total, currency, created_at, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase!.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }),
      ])
      if (!active) return
      setProfile(profileData ?? { full_name: '', email: user.email ?? '', phone: user.phone ?? '' })
      setOrders((orderData as unknown as Order[]) ?? [])
      setAddresses((addressData as Address[]) ?? [])
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [supabase, user.id, user.email, user.phone])

  const displayName = profile?.full_name?.trim() || user.email?.split('@')[0] || user.phone || 'Your account'
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (loading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <span className="size-6 animate-spin rounded-full border-2 border-border border-t-gold" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 md:px-10 md:pt-32">
      {/* Header */}
      <div className="flex flex-col items-center gap-5 border-b border-border pb-10 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gold/12 font-serif text-2xl text-gold">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-2xl md:text-3xl">{displayName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{profile?.email || profile?.phone}</p>
        </div>
        <button
          onClick={() => setTab('settings')}
          className="flex items-center gap-2 self-center border border-border px-4 py-2 text-xs uppercase tracking-luxe text-muted-foreground transition-colors hover:border-gold hover:text-foreground"
        >
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
                name={displayName}
                wishlistCount={wishlist.length}
                orders={orders}
                onNavigate={setTab}
              />
            )}
            {tab === 'orders' && <OrdersTab orders={orders} />}
            {tab === 'wishlist' && (
              <WishlistTab
                items={wishlist}
                onRemove={toggleWishlist}
                onAddToCart={(item) =>
                  addToCart({ slug: item.slug, name: item.name, price: item.price, image: item.image, strap: 'Default', size: 'Standard' })
                }
              />
            )}
            {tab === 'addresses' && (
              <AddressesTab userId={user.id} addresses={addresses} setAddresses={setAddresses} supabase={supabase} />
            )}
            {tab === 'settings' && (
              <SettingsTab userId={user.id} profile={profile} setProfile={setProfile} supabase={supabase} />
            )}
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
  orders,
  onNavigate,
}: {
  name: string
  wishlistCount: number
  orders: Order[]
  onNavigate: (t: Tab) => void
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">Welcome back, {name.split(' ')[0]}.</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Orders" value={orders.length} onClick={() => onNavigate('orders')} />
        <StatCard label="Wishlist" value={wishlistCount} onClick={() => onNavigate('wishlist')} />
        <StatCard label="Member since" value={new Date().getFullYear()} />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Recent order</h2>
          {orders.length > 0 && (
            <button onClick={() => onNavigate('orders')} className="flex items-center gap-1 text-xs uppercase tracking-luxe text-gold">
              View all
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>
        <div className="mt-4">
          {orders.length > 0 ? (
            <OrderRow order={orders[0]} />
          ) : (
            <p className="border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No orders yet. Once you place one, it will appear here.
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <QuickLink icon={Package} label="View orders" onClick={() => onNavigate('orders')} />
        <QuickLink icon={MapPin} label="Manage addresses" onClick={() => onNavigate('addresses')} />
      </div>
    </div>
  )
}

function QuickLink({ icon: Icon, label, onClick }: { icon: typeof UserIcon; label: string; onClick: () => void }) {
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

function OrderRow({ order }: { order: Order }) {
  const firstItem = order.order_items?.[0]
  const extraCount = (order.order_items?.length ?? 1) - 1
  return (
    <div className="flex items-center gap-4 border border-border p-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-secondary">
        {firstItem?.image && (
          <Image src={firstItem.image} alt={firstItem.product_name} fill sizes="64px" className="object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-base">
          {firstItem?.product_name ?? 'Order'}
          {extraCount > 0 && ` + ${extraCount} more`}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          #{order.order_number} · {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {formatPrice(order.total, order.currency)}
        </p>
      </div>
      <span className={cn('shrink-0 rounded-full border px-3 py-1 text-[11px] capitalize tracking-wide', statusStyles[order.status])}>
        {order.status}
      </span>
    </div>
  )
}

function OrdersTab({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        body="When you place an order, it will show up here with its status and details."
        cta="Start shopping"
        href="/shop"
      />
    )
  }
  return (
    <div className="space-y-3">
      {orders.map((o) => (
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

function AddressesTab({
  userId,
  addresses,
  setAddresses,
  supabase,
}: {
  userId: string
  addresses: Address[]
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>
  supabase: ReturnType<typeof getSupabaseClient>
}) {
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ label: '', line1: '', city: '', state: '', postal_code: '' })

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase || !form.line1 || !form.city) return
    setSaving(true)
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        label: form.label || 'Address',
        line1: form.line1,
        city: form.city,
        state: form.state || null,
        postal_code: form.postal_code || null,
        is_default: addresses.length === 0,
      })
      .select()
      .single()
    setSaving(false)
    if (!error && data) {
      setAddresses((prev) => [...prev, data as Address])
      setForm({ label: '', line1: '', city: '', state: '', postal_code: '' })
      setAdding(false)
    }
  }

  async function handleRemove(id: string) {
    if (!supabase) return
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    await supabase.from('addresses').delete().eq('id', id)
  }

  return (
    <div>
      {addresses.length === 0 && !adding && (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          body="Add an address to make checkout faster next time."
          cta="Add an address"
          onClick={() => setAdding(true)}
        />
      )}

      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-4 border border-border p-5">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-serif text-lg">{a.label}</p>
                  {a.is_default && (
                    <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-gold">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{a.line1}</p>
                <p className="text-sm text-muted-foreground">
                  {[a.city, a.state, a.postal_code].filter(Boolean).join(', ')}
                </p>
              </div>
              <button
                onClick={() => handleRemove(a.id)}
                aria-label="Remove address"
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {adding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="mt-4 space-y-4 overflow-hidden border border-border p-5"
          >
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="Label (e.g. Home, Office)"
              className="w-full border-b border-border bg-transparent py-2 text-sm focus:border-gold focus:outline-none"
            />
            <input
              value={form.line1}
              onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
              placeholder="Address line"
              required
              className="w-full border-b border-border bg-transparent py-2 text-sm focus:border-gold focus:outline-none"
            />
            <input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="City"
              required
              className="w-full border-b border-border bg-transparent py-2 text-sm focus:border-gold focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                placeholder="State"
                className="w-full border-b border-border bg-transparent py-2 text-sm focus:border-gold focus:outline-none"
              />
              <input
                value={form.postal_code}
                onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
                placeholder="PIN code"
                className="w-full border-b border-border bg-transparent py-2 text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <LuxButton type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save address'}
              </LuxButton>
              <button type="button" onClick={() => setAdding(false)} className="text-xs uppercase tracking-luxe text-muted-foreground">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!adding && addresses.length > 0 && (
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

function SettingsTab({
  userId,
  profile,
  setProfile,
  supabase,
}: {
  userId: string
  profile: Profile | null
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>
  supabase: ReturnType<typeof getSupabaseClient>
}) {
  const { signOut } = useAuth()
  const router = useRouter()
  const [name, setName] = useState(profile?.full_name ?? '')
  const [emailField, setEmailField] = useState(profile?.email ?? '')
  const [phoneField, setPhoneField] = useState(profile?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState(true)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name, phone: phoneField, updated_at: new Date().toISOString() })
      .eq('id', userId)
    setSaving(false)
    if (!error) {
      setProfile((p) => ({ ...(p ?? { email: emailField, phone: phoneField }), full_name: name, phone: phoneField }))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  async function handleSignOut() {
    await signOut()
    router.push('/account')
  }

  return (
    <div className="max-w-lg space-y-10">
      <form onSubmit={handleSave} className="space-y-5">
        <h2 className="font-serif text-xl">Your details</h2>
        <div>
          <label className="text-xs uppercase tracking-luxe text-muted-foreground">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent py-2.5 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-luxe text-muted-foreground">Email</label>
          <input
            value={emailField}
            disabled
            className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-muted-foreground focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">Contact support to change the email on your account.</p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-luxe text-muted-foreground">Phone</label>
          <input
            value={phoneField ?? ''}
            onChange={(e) => setPhoneField(e.target.value)}
            placeholder="+91 98765 43210"
            className="mt-2 w-full border-b border-border bg-transparent py-2.5 focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 pt-1">
          <LuxButton type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </LuxButton>
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
            New releases &amp; private previews
          </span>
          <span className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', notifications ? 'bg-gold' : 'bg-border')}>
            <motion.span
              className="absolute top-0.5 size-5 rounded-full bg-background shadow"
              animate={{ left: notifications ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </span>
        </button>
      </div>

      <div className="border-t border-border pt-8">
        <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-destructive transition-opacity hover:opacity-70">
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
  onClick,
}: {
  icon: typeof UserIcon
  title: string
  body: string
  cta: string
  href?: string
  onClick?: () => void
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
      {href ? (
        <LuxButton href={href} className="mt-2">
          {cta}
        </LuxButton>
      ) : (
        <LuxButton onClick={onClick} className="mt-2">
          {cta}
        </LuxButton>
      )}
    </div>
  )
}
