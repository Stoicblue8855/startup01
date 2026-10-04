'use client'

import { useAuth } from '@/components/account/auth-context'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/format'

/**
 * Shows a price to signed-in customers only. Everyone else (and anyone while
 * the sign-in state is still loading) sees a blurred placeholder, never the
 * real amount.
 */
export function Price({
  value,
  currency,
  className,
}: {
  value: number
  currency?: string
  className?: string
}) {
  const { user, configured } = useAuth()

  if (!configured || user) {
    return <span className={className}>{formatPrice(value, currency)}</span>
  }

  return (
    <span
      className={cn('select-none blur-[6px]', className)}
      role="img"
      aria-label="Sign in to view price"
      title="Sign in to view price"
    >
      {formatPrice(8888, currency)}
    </span>
  )
}
