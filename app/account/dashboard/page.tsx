'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/account/auth-context'
import { AccountDashboard } from '@/components/account/dashboard'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/account')
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-[70dvh] items-center justify-center">
        <span className="size-6 animate-spin rounded-full border-2 border-border border-t-gold" />
      </div>
    )
  }

  return <AccountDashboard user={user} />
}
