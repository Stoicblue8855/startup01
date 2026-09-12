'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { LuxButton } from '@/components/brand/lux-button'

interface Errors {
  name?: string
  email?: string
  cover?: string
}

export function ApplicationForm({ roles }: { roles: string[] }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(roles[0] ?? 'General application')
  const [cover, setCover] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): boolean {
    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Please enter a valid email address.'
    if (cover.trim().length < 20) next.cover = 'A few sentences on why you\u2019d be a good fit — at least 20 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    // SUPABASE: insert into `job_applications` (name, email, role, cover) here.
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
            Your application for {role} has been received. We reply to every candidate within two weeks.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <label className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Full name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full border-b border-border bg-transparent py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
          placeholder="Jane Appleseed"
        />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
      </div>

      <div>
        <label className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Email address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="mt-2 w-full border-b border-border bg-transparent py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
          placeholder="jane@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
      </div>

      <div>
        <label className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-2 w-full cursor-pointer border-b border-border bg-transparent py-3 text-foreground focus:border-gold focus:outline-none"
        >
          {[...roles, 'General application'].map((r) => (
            <option key={r} className="bg-card text-foreground">
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Why you?</label>
        <textarea
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          rows={5}
          className="mt-2 w-full resize-none border-b border-border bg-transparent py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
          placeholder="A few sentences is plenty."
        />
        {errors.cover && <p className="mt-1 text-xs text-destructive">{errors.cover}</p>}
      </div>

      <LuxButton type="submit">Submit application</LuxButton>
    </form>
  )
}
