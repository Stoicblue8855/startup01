'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { LuxButton } from '@/components/brand/lux-button'

interface Errors {
  name?: string
  email?: string
  message?: string
}

export function ContactForm({ defaultTopic = 'General enquiry' }: { defaultTopic?: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState(defaultTopic)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): boolean {
    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Please enter a valid email address.'
    if (message.trim().length < 10) next.message = 'Tell us a little more — at least 10 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    // SUPABASE: insert into `contact_requests` (name, email, topic, message) here.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4 border border-gold p-8"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold text-background">
          <Check className="size-4" />
        </span>
        <div>
          <h3 className="font-serif text-2xl">Thank you, {name.split(' ')[0]}.</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A member of the house will reply to {email} within one business day.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Field label="Full name" error={errors.name}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          autoComplete="name"
          className="w-full border-b border-border bg-transparent py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
          placeholder="Jane Appleseed"
        />
      </Field>

      <Field label="Email address" error={errors.email}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          className="w-full border-b border-border bg-transparent py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
          placeholder="jane@example.com"
        />
      </Field>

      <Field label="Topic">
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full cursor-pointer border-b border-border bg-transparent py-3 text-foreground focus:border-gold focus:outline-none"
        >
          {['General enquiry', 'My account', 'An order', 'Warranty & service', 'Press', 'Careers'].map((t) => (
            <option key={t} className="bg-card text-foreground">
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" error={errors.message}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full resize-none border-b border-border bg-transparent py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
          placeholder="How can we help?"
        />
      </Field>

      <LuxButton type="submit">Send message</LuxButton>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide-luxe text-muted-foreground">{label}</label>
      <div className="mt-2">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
