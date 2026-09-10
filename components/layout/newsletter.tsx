'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NewsletterForm({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'done'>('idle')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!valid) {
      setStatus('error')
      return
    }
    // SUPABASE: insert into `subscribers` (email) here.
    setStatus('done')
  }

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)} noValidate>
      <div className="relative">
        <AnimatePresence mode="wait">
          {status === 'done' ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 border-b border-gold py-3"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-gold text-background">
                <Check className="size-3.5" />
              </span>
              <p className={cn('text-foreground', compact ? 'text-sm' : 'text-base')}>
                Welcome. Watch for a note from us.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 border-b border-border py-3 transition-colors focus-within:border-gold"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                placeholder="Enter your email"
                aria-label="Email address"
                aria-invalid={status === 'error'}
                className={cn(
                  'w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none',
                  compact ? 'text-sm' : 'text-base',
                )}
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="shrink-0 text-muted-foreground transition-colors hover:text-gold"
              >
                <ArrowRight className="size-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {status === 'error' && (
          <p className="mt-2 text-xs text-destructive">Please enter a valid email address.</p>
        )}
      </div>
    </form>
  )
}
