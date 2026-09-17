'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function OtpInput({
  length = 6,
  onComplete,
}: {
  length?: number
  onComplete: (code: string) => void
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function updateAt(i: number, digit: string) {
    const next = [...values]
    next[i] = digit
    setValues(next)
    if (next.every((d) => d !== '')) onComplete(next.join(''))
  }

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    updateAt(i, digit)
    if (digit && i < length - 1) refs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!text) return
    e.preventDefault()
    const next = Array(length).fill('')
    for (let i = 0; i < text.length; i++) next[i] = text[i]
    setValues(next)
    const lastIndex = Math.min(text.length, length) - 1
    refs.current[lastIndex]?.focus()
    if (text.length === length) onComplete(text)
  }

  return (
    <div className="flex justify-center gap-2.5 sm:gap-3">
      {values.map((v, i) => (
        <motion.input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          className={cn(
            'size-11 rounded-sm border text-center font-serif text-xl text-foreground outline-none transition-colors sm:size-12',
            v ? 'border-gold bg-gold/5' : 'border-border bg-transparent',
            'focus:border-gold',
          )}
        />
      ))}
    </div>
  )
}
