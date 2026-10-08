'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronDown, MessageCircle, Phone, RefreshCw } from 'lucide-react'
import { useAuth } from '@/components/account/auth-context'
import { Eyebrow } from '@/components/common/section-heading'
import { getSupabaseClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

type Status = 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

const STATUSES: { value: Status; label: string }[] = [
  { value: 'processing', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusStyles: Record<Status, string> = {
  processing: 'bg-gold/10 text-gold border-gold/30',
  confirmed: 'bg-gold/10 text-gold border-gold/30',
  shipped: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  delivered: 'bg-green-600/10 text-green-700 border-green-600/30',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/30',
}

const label = (s: string) => STATUSES.find((x) => x.value === s)?.label ?? s

interface OrderItem {
  id: string
  product_name: string
  image: string | null
  price: number
  quantity: number
  strap: string | null
  size: string | null
}

interface OrderAdmin {
  payment_received: boolean
  admin_notes: string | null
}

interface Order {
  id: string
  order_number: string
  status: Status
  total: number
  currency: string
  created_at: string
  customer_name: string | null
  phone: string | null
  email: string | null
  address_line: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  payment_method: 'whatsapp_online' | 'cod' | null
  notes: string | null
  order_items: OrderItem[]
  order_admin: OrderAdmin | OrderAdmin[] | null
}

interface Message {
  id: string
  name: string
  email: string
  topic: string | null
  message: string
  status: string
  created_at: string
}

interface Application {
  id: string
  name: string
  email: string
  role: string | null
  cover: string
  status: string
  created_at: string
}

type Tab = 'orders' | 'messages' | 'applications'

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

const digits = (v: string | null) => (v ?? '').replace(/[^0-9]/g, '')
const waNumber = (v: string | null) => {
  const d = digits(v)
  return d.length === 10 ? `91${d}` : d
}

function oneAdmin(o: Order): OrderAdmin {
  const a = Array.isArray(o.order_admin) ? o.order_admin[0] : o.order_admin
  return a ?? { payment_received: false, admin_notes: null }
}

const pill =
  'rounded-full border px-3 py-1 text-[11px] tracking-wide transition-colors'

export function AdminDashboard() {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [tab, setTab] = useState<Tab>('orders')

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (loading) return
    if (!supabase || !user) {
      setIsAdmin(false)
      return
    }
    let alive = true
    Promise.resolve(supabase.rpc('is_admin')).then(({ data, error }) => {
      if (alive) setIsAdmin(!error && data === true)
    })
    return () => {
      alive = false
    }
  }, [user, loading])

  if (isAdmin === null) {
    return (
      <div className="flex min-h-[40dvh] items-center justify-center">
        <span className="size-6 animate-spin rounded-full border-2 border-border border-t-gold" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <h1 className="font-serif text-3xl">This page is private.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This page is only for the SamayChakkra team. Please sign in with the owner account.
        </p>
      </div>
    )
  }

  return (
    <div>
      <Eyebrow>Admin</Eyebrow>
      <h1 className="mt-5 font-serif text-4xl leading-[1.05] md:text-5xl">Orders &amp; enquiries.</h1>
      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ['orders', 'Orders'],
            ['messages', 'Messages'],
            ['applications', 'Applications'],
          ] as [Tab, string][]
        ).map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              pill,
              'px-4 py-2 text-xs uppercase tracking-wide-luxe',
              tab === id ? 'border-gold bg-gold/10 text-gold' : 'border-border text-muted-foreground hover:border-gold/60',
            )}
          >
            {text}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {tab === 'orders' && <OrdersTab />}
        {tab === 'messages' && <MessagesTab />}
        {tab === 'applications' && <ApplicationsTab />}
      </div>
    </div>
  )
}

/* ------------------------------- Orders ------------------------------- */

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = getSupabaseClient()
    if (!supabase) return
    setLoadingData(true)
    setError('')
    const { data, error: err } = await supabase
      .from('orders')
      .select('*, order_items(*), order_admin(*)')
      .order('created_at', { ascending: false })
    setLoadingData(false)
    if (err) {
      setError('Could not load orders: ' + err.message)
      return
    }
    setOrders((data ?? []) as Order[])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length }
    orders.forEach((o) => {
      c[o.status] = (c[o.status] ?? 0) + 1
    })
    return c
  }, [orders])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false
      if (!q) return true
      return [o.order_number, o.customer_name, o.phone, o.email, o.city]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    })
  }, [orders, filter, query])

  function patchLocal(id: string, patch: Partial<Order>) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {([{ value: 'all', label: 'All' }, ...STATUSES] as { value: 'all' | Status; label: string }[]).map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              pill,
              filter === f.value ? 'border-gold bg-gold/10 text-gold' : 'border-border text-muted-foreground hover:border-gold/60',
            )}
          >
            {f.label} ({counts[f.value] ?? 0})
          </button>
        ))}
        <button
          type="button"
          onClick={load}
          className={cn(pill, 'ml-auto inline-flex items-center gap-2 border-border text-muted-foreground hover:border-gold/60')}
        >
          <RefreshCw className={cn('size-3', loadingData && 'animate-spin')} /> Refresh
        </button>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search order, name, phone or city"
        className="mt-5 w-full border-b border-border bg-transparent py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
      />

      {error && (
        <p role="alert" className="mt-5 border border-destructive/40 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {!loadingData && !error && shown.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">No orders to show.</p>
      )}

      <ul className="mt-6 divide-y divide-border border-y border-border">
        {shown.map((o) => (
          <OrderRow
            key={o.id}
            order={o}
            expanded={open === o.id}
            onToggle={() => setOpen(open === o.id ? null : o.id)}
            onChange={(patch) => patchLocal(o.id, patch)}
          />
        ))}
      </ul>
    </div>
  )
}

function OrderRow({
  order,
  expanded,
  onToggle,
  onChange,
}: {
  order: Order
  expanded: boolean
  onToggle: () => void
  onChange: (patch: Partial<Order>) => void
}) {
  const admin = oneAdmin(order)
  const [notes, setNotes] = useState(admin.admin_notes ?? '')
  const [paid, setPaid] = useState(admin.payment_received)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function setStatus(status: Status) {
    const supabase = getSupabaseClient()
    if (!supabase) return
    setBusy(true)
    setMsg('')
    const { error } = await supabase.from('orders').update({ status }).eq('id', order.id)
    setBusy(false)
    if (error) {
      setMsg('Could not change status: ' + error.message)
      return
    }
    onChange({ status })
    setMsg('Status updated.')
  }

  async function saveAdmin(nextPaid = paid) {
    const supabase = getSupabaseClient()
    if (!supabase) return
    setBusy(true)
    setMsg('')
    const { error } = await supabase.from('order_admin').upsert({
      order_id: order.id,
      payment_received: nextPaid,
      admin_notes: notes.trim() || null,
      updated_at: new Date().toISOString(),
    })
    setBusy(false)
    if (error) {
      setMsg('Could not save: ' + error.message)
      return
    }
    onChange({ order_admin: { payment_received: nextPaid, admin_notes: notes.trim() || null } })
    setMsg('Saved.')
  }

  const wa = waNumber(order.phone)
  const hello = `Hello ${order.customer_name ?? ''}, this is SamayChakkra regarding your order ${order.order_number}.`

  return (
    <li className="py-5">
      <button type="button" onClick={onToggle} className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 text-left">
        <div>
          <p className="font-serif text-lg">{order.order_number}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {fmtDate(order.created_at)} &middot; {order.customer_name || 'Customer'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {order.payment_method === 'cod' ? 'Cash on delivery' : order.payment_method === 'whatsapp_online' ? 'Online via WhatsApp' : ''}
            {admin.payment_received ? ' · Paid' : ''}
          </span>
          <span className="font-serif text-base">{formatPrice(Number(order.total), order.currency)}</span>
          <span className={cn('rounded-full border px-3 py-1 text-[11px] tracking-wide', statusStyles[order.status])}>
            {label(order.status)}
          </span>
          <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
        </div>
      </button>

      {expanded && (
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="space-y-5 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Customer</p>
              <p className="mt-2 font-medium">{order.customer_name}</p>
              {order.phone && (
                <p className="mt-1">
                  <a href={`tel:${order.phone}`} className="inline-flex items-center gap-2 hover:text-gold">
                    <Phone className="size-3.5" /> {order.phone}
                  </a>
                </p>
              )}
              {order.email && <p className="mt-1 text-muted-foreground">{order.email}</p>}
              {wa && (
                <a
                  href={`https://wa.me/${wa}?text=${encodeURIComponent(hello)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-gold underline-offset-4 hover:underline"
                >
                  <MessageCircle className="size-4" /> Message on WhatsApp
                </a>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Delivery address</p>
              <p className="mt-2 leading-relaxed">
                {order.address_line}
                <br />
                {[order.city, order.state].filter(Boolean).join(', ')} {order.postal_code}
              </p>
            </div>
            {order.notes && (
              <div>
                <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Customer notes</p>
                <p className="mt-2 leading-relaxed">{order.notes}</p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Items</p>
              <ul className="mt-3 space-y-3">
                {order.order_items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between gap-4">
                    <span>
                      {it.product_name}
                      <span className="block text-xs text-muted-foreground">
                        {[it.strap, it.size].filter(Boolean).join(' · ')} · Qty {it.quantity}
                      </span>
                    </span>
                    <span>{formatPrice(Number(it.price) * it.quantity, order.currency)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Delivery charges are added separately.</p>
            </div>
          </div>

          <div className="space-y-5 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Status</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    disabled={busy}
                    onClick={() => setStatus(s.value)}
                    className={cn(
                      pill,
                      'disabled:opacity-50',
                      order.status === s.value ? statusStyles[s.value] : 'border-border text-muted-foreground hover:border-gold/60',
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={paid}
                disabled={busy}
                onChange={(e) => {
                  setPaid(e.target.checked)
                  saveAdmin(e.target.checked)
                }}
                className="size-4 accent-[var(--gold)]"
              />
              <span>Payment received</span>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Private notes (customers never see these)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="mt-2 w-full resize-none border border-border bg-transparent p-3 text-foreground focus:border-gold focus:outline-none"
                placeholder="Tracking number, courier, delivery charge, anything you want to remember"
              />
            </label>
            <button
              type="button"
              disabled={busy}
              onClick={() => saveAdmin()}
              className="border border-gold px-5 py-2 text-xs uppercase tracking-wide-luxe text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
            >
              Save notes
            </button>
            {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
          </div>
        </div>
      )}
    </li>
  )
}

/* --------------------------- Messages & applications --------------------------- */

function useRows<T extends { id: string; status: string }>(table: string) {
  const [rows, setRows] = useState<T[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const supabase = getSupabaseClient()
    if (!supabase) return
    setLoadingData(true)
    setError('')
    const { data, error: err } = await supabase.from(table).select('*').order('created_at', { ascending: false })
    setLoadingData(false)
    if (err) {
      setError('Could not load: ' + err.message)
      return
    }
    setRows((data ?? []) as T[])
  }, [table])

  useEffect(() => {
    load()
  }, [load])

  async function toggle(id: string, status: string) {
    const supabase = getSupabaseClient()
    if (!supabase) return
    const next = status === 'new' ? 'done' : 'new'
    const { error: err } = await supabase.from(table).update({ status: next }).eq('id', id)
    if (err) {
      setError('Could not update: ' + err.message)
      return
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)))
  }

  return { rows, loadingData, error, toggle, load }
}

function MessagesTab() {
  const { rows, loadingData, error, toggle } = useRows<Message>('contact_messages')
  return (
    <InboxList
      loadingData={loadingData}
      error={error}
      empty="No messages yet."
      items={rows.map((m) => ({
        id: m.id,
        status: m.status,
        title: m.name,
        sub: `${m.topic ?? 'General enquiry'} · ${m.email} · ${fmtDate(m.created_at)}`,
        body: m.message,
        email: m.email,
      }))}
      onToggle={toggle}
    />
  )
}

function ApplicationsTab() {
  const { rows, loadingData, error, toggle } = useRows<Application>('job_applications')
  return (
    <InboxList
      loadingData={loadingData}
      error={error}
      empty="No applications yet."
      items={rows.map((a) => ({
        id: a.id,
        status: a.status,
        title: a.name,
        sub: `${a.role ?? 'General application'} · ${a.email} · ${fmtDate(a.created_at)}`,
        body: a.cover,
        email: a.email,
      }))}
      onToggle={toggle}
    />
  )
}

function InboxList({
  items,
  loadingData,
  error,
  empty,
  onToggle,
}: {
  items: { id: string; status: string; title: string; sub: string; body: string; email: string }[]
  loadingData: boolean
  error: string
  empty: string
  onToggle: (id: string, status: string) => void
}) {
  return (
    <div>
      {error && (
        <p role="alert" className="border border-destructive/40 p-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {!loadingData && !error && items.length === 0 && <p className="text-sm text-muted-foreground">{empty}</p>}
      <ul className="divide-y divide-border border-y border-border">
        {items.map((m) => (
          <li key={m.id} className="py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-serif text-lg">{m.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.sub}</p>
              </div>
              <button
                type="button"
                onClick={() => onToggle(m.id, m.status)}
                className={cn(
                  pill,
                  m.status === 'new' ? 'border-gold bg-gold/10 text-gold' : 'border-border text-muted-foreground hover:border-gold/60',
                )}
              >
                {m.status === 'new' ? 'New — mark as done' : 'Done — mark as new'}
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{m.body}</p>
            <a href={`mailto:${m.email}`} className="mt-3 inline-block text-sm text-gold underline-offset-4 hover:underline">
              Reply by email
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
