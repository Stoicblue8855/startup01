'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Banknote, Check, Info } from 'lucide-react'
import { useAuth } from '@/components/account/auth-context'
import { useCart } from '@/components/cart/cart-context'
import { Price } from '@/components/common/price'
import { Eyebrow } from '@/components/common/section-heading'
import { LuxButton } from '@/components/brand/lux-button'
import { PaymentLogos } from '@/components/order/payment-logos'
import { getSupabaseClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/format'
import { INDIAN_STATES, whatsappLink } from '@/lib/order'
import { cn } from '@/lib/utils'

type Payment = 'whatsapp_online' | 'cod'

interface Placed {
  orderNumber: string
  total: number
  currency: string
  payment: Payment
  whatsappUrl: string
}

const inputClass =
  'w-full border-b border-border bg-transparent py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none'

export interface OrderFlowProps {
  whatsappNumber?: string
  acceptingOrders?: boolean
  closedMessage?: string
  codEnabled?: boolean
  whatsappEnabled?: boolean
}

export function OrderFlow({
  whatsappNumber,
  acceptingOrders = true,
  closedMessage = 'We are not taking new orders right now. Please check back soon or message us on WhatsApp.',
  codEnabled = true,
  whatsappEnabled = true,
}: OrderFlowProps) {
  const { user } = useAuth()
  const { lines, cartTotal, clearCart } = useCart()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postal, setPostal] = useState('')
  const [notes, setNotes] = useState('')
  const [payment, setPayment] = useState<Payment | ''>(
    codEnabled && !whatsappEnabled ? 'cod' : whatsappEnabled && !codEnabled ? 'whatsapp_online' : '',
  )
  const [accepted, setAccepted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [placed, setPlaced] = useState<Placed | null>(null)

  // Pre-fill name and phone from the customer's profile when we have them.
  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase || !user) return
    let cancelled = false
    supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return
        setName((v) => v || data.full_name || '')
        setPhone((v) => v || data.phone || '')
      })
    return () => {
      cancelled = true
    }
  }, [user])

  // After placing an order: show the confirmation from the top, and for
  // WhatsApp (online payment) orders send the customer to the chat.
  useEffect(() => {
    if (!placed) return
    window.scrollTo({ top: 0 })
    if (placed.payment !== 'whatsapp_online') return
    const t = setTimeout(() => {
      window.location.href = placed.whatsappUrl
    }, 4000)
    return () => clearTimeout(t)
  }, [placed])

  const itemCount = useMemo(() => lines.reduce((n, l) => n + l.quantity, 0), [lines])

  function validate() {
    const next: Record<string, string> = {}
    if (name.trim().length < 2) next.name = 'Please enter your full name.'
    if (!/^(\+?91)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ''))) next.phone = 'Please enter a valid 10-digit mobile number.'
    if (address.trim().length < 5) next.address = 'Please enter your full delivery address.'
    if (city.trim().length < 2) next.city = 'Please enter your city.'
    if (!state) next.state = 'Please choose your state.'
    if (!/^[1-9]\d{5}$/.test(postal.trim())) next.postal = 'Please enter a valid 6-digit PIN code.'
    if (!payment) next.payment = 'Please choose how you would like to pay.'
    if (!accepted) next.accepted = 'Please accept the no warranty and no returns terms to continue.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!validate() || !payment) return
    const supabase = getSupabaseClient()
    if (!supabase) {
      setFormError('Ordering is not available right now. Please contact us on WhatsApp.')
      return
    }
    setSubmitting(true)
    const { data, error } = await supabase.rpc('place_order', {
      p_name: name.trim(),
      p_phone: phone.trim(),
      p_address: address.trim(),
      p_city: city.trim(),
      p_state: state,
      p_postal: postal.trim(),
      p_payment: payment,
      p_notes: notes.trim(),
      p_items: lines.map((l) => ({ slug: l.slug, quantity: l.quantity, strap: l.strap, size: l.size })),
    })
    setSubmitting(false)

    const row = Array.isArray(data) ? data[0] : data
    if (error || !row) {
      setFormError(error?.message || 'We could not place your order. Please try again.')
      return
    }

    const total = Number(row.total)
    const currency = row.currency || 'INR'
    const itemsText = lines
      .map((l, i) => `${i + 1}. ${l.name} (${l.strap}, ${l.size}) x ${l.quantity}`)
      .join('\n')
    const message =
      `Hello SamayChakkra! I have placed order ${row.order_number}.\n\n` +
      `Items:\n${itemsText}\n\n` +
      `Total: ${formatPrice(total, currency)} (delivery charges extra)\n` +
      `Payment: ${payment === 'whatsapp_online' ? 'Online payment via WhatsApp' : 'Cash on delivery'}\n\n` +
      `Name: ${name.trim()}\nPhone: ${phone.trim()}\n` +
      `Address: ${address.trim()}, ${city.trim()}, ${state} - ${postal.trim()}` +
      (notes.trim() ? `\nNotes: ${notes.trim()}` : '') +
      (payment === 'whatsapp_online' ? '\n\nPlease share the payment details.' : '\n\nPlease confirm my order.')

    setPlaced({
      orderNumber: row.order_number,
      total,
      currency,
      payment,
      whatsappUrl: whatsappLink(message, whatsappNumber),
    })
    clearCart()
  }

  if (placed) {
    const online = placed.payment === 'whatsapp_online'
    return (
      <div className="mx-auto max-w-xl border border-gold p-8 text-center md:p-12">
        <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-gold text-background">
          <Check className="size-5" />
        </span>
        <h1 className="mt-6 font-serif text-3xl">Your order is placed.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Order number <span className="font-medium text-foreground">{placed.orderNumber}</span> &middot; Total{' '}
          <span className="font-medium text-foreground">{formatPrice(placed.total, placed.currency)}</span>
          <span className="block">Delivery charges will be added at the end of your order booking.</span>
        </p>
        {online ? (
          <>
            <div className="mt-6">
              <PaymentLogos />
            </div>
            <p className="mt-2 text-sm text-foreground">
              Taking you to WhatsApp to complete your payment with our team&hellip;
            </p>
          </>
        ) : (
          <p className="mt-6 text-sm text-foreground">
            Our team will contact you to confirm your order. You will pay in cash when it is delivered.
          </p>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LuxButton href={placed.whatsappUrl} magnetic={false}>
            {online ? 'Open WhatsApp now' : 'Chat with us on WhatsApp'}
          </LuxButton>
          <LuxButton href="/account/dashboard" variant="outline" magnetic={false}>
            View my orders
          </LuxButton>
        </div>
      </div>
    )
  }

  if (!acceptingOrders || (!codEnabled && !whatsappEnabled)) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <h1 className="font-serif text-3xl">Orders are paused.</h1>
        <p className="mt-3 text-sm text-muted-foreground">{closedMessage}</p>
        <div className="mt-8">
          <LuxButton href={whatsappLink('Hello SamayChakkra!', whatsappNumber)} variant="outline" magnetic={false}>
            Chat with us on WhatsApp
          </LuxButton>
        </div>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <h1 className="font-serif text-3xl">Your selection is empty.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Add a watch to your cart to place an order.</p>
        <div className="mt-8">
          <LuxButton href="/shop" variant="outline" magnetic={false}>
            Browse watches
          </LuxButton>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <div>
        <Eyebrow>Place your order</Eyebrow>
        <h1 className="mt-5 font-serif text-4xl leading-[1.05] md:text-5xl">Delivery details.</h1>

        <div className="mt-10 space-y-6">
          <Field label="Full name" error={errors.name}>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </Field>
          <Field label="Mobile number" error={errors.phone}>
            <input
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="10-digit mobile number"
            />
          </Field>
          <Field label="Full address" error={errors.address}>
            <textarea
              className={cn(inputClass, 'min-h-[72px] resize-none')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
              placeholder="House / flat no., building, street, area"
            />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="City" error={errors.city}>
              <input className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
            </Field>
            <Field label="PIN code" error={errors.postal}>
              <input
                className={inputClass}
                value={postal}
                onChange={(e) => setPostal(e.target.value)}
                inputMode="numeric"
                maxLength={6}
                autoComplete="postal-code"
              />
            </Field>
          </div>
          <Field label="State" error={errors.state}>
            <select className={cn(inputClass, 'bg-background')} value={state} onChange={(e) => setState(e.target.value)} autoComplete="address-level1">
              <option value="">Select your state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Notes (optional)">
            <input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Landmark, preferred call time, anything we should know" />
          </Field>
        </div>

        <fieldset className="mt-10">
          <legend className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Payment</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {whatsappEnabled && (
            <label
              className={cn(
                'cursor-pointer border p-4 transition-colors',
                payment === 'whatsapp_online' ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/60',
              )}
            >
              <input type="radio" name="payment" className="sr-only" checked={payment === 'whatsapp_online'} onChange={() => setPayment('whatsapp_online')} />
              <PaymentLogos />
              <span className="block text-center font-medium">Pay online on WhatsApp</span>
              <span className="mt-1 block text-center text-xs text-muted-foreground">
                We will take you to our WhatsApp chat to complete your payment with our team.
              </span>
            </label>
            )}
            {codEnabled && (
            <label
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center border p-4 text-center transition-colors',
                payment === 'cod' ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/60',
              )}
            >
              <input type="radio" name="payment" className="sr-only" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
              <Banknote className="size-9 text-gold" strokeWidth={1.5} />
              <span className="mt-3 block font-medium">Cash on delivery</span>
              <span className="mt-1 block text-xs text-muted-foreground">Pay in cash when your watch arrives.</span>
            </label>
            )}
          </div>
          {errors.payment && <p className="mt-2 text-xs text-destructive">{errors.payment}</p>}
        </fieldset>
      </div>

      <aside className="lg:pt-16">
        <div className="border border-border p-6 md:p-8">
          <h2 className="font-serif text-2xl">Your selection</h2>
          <ul className="mt-6 space-y-5">
            {lines.map((l) => (
              <li key={`${l.slug}-${l.strap}-${l.size}`} className="flex gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden bg-secondary">
                  <Image src={l.image || '/placeholder.svg'} alt={l.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1">
                  <p className="font-serif text-base leading-tight">{l.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {l.strap} &middot; {l.size} &middot; Qty {l.quantity}
                  </p>
                </div>
                <Price value={l.price * l.quantity} className="text-sm" />
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-baseline justify-between border-t border-border pt-5">
            <span className="text-xs uppercase tracking-wide-luxe text-muted-foreground">
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
            <Price value={cartTotal} className="font-serif text-xl" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Delivery charges are calculated by distance and added at the end of your order booking.
          </p>

          <div className="mt-6 flex gap-3 border border-gold bg-gold/5 p-4 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-gold" />
            <p className="leading-relaxed">
              <span className="font-medium">No warranty. No returns.</span> All sales are final. Please check your
              selection carefully before placing your order.
            </p>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 size-4 accent-[var(--gold)]"
            />
            <span>I understand and accept that there is no warranty and no returns on my order.</span>
          </label>
          {errors.accepted && <p className="mt-2 text-xs text-destructive">{errors.accepted}</p>}

          {formError && (
            <p role="alert" className="mt-5 border border-destructive/40 p-3 text-sm text-destructive">
              {formError}
            </p>
          )}

          <LuxButton type="submit" className="mt-6 w-full" magnetic={false} disabled={submitting}>
            {submitting ? 'Placing your order…' : 'Place order'}
          </LuxButton>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Need help? <Link href="/contact" className="text-gold underline-offset-4 hover:underline">Contact our team</Link> &mdash; available 24/7.
          </p>
        </div>
      </aside>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide-luxe text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  )
}
