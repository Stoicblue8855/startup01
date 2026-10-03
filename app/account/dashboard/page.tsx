'use client'

import { useAuth } from '@/components/account/auth-context'
import { AccountDashboard } from '@/components/account/dashboard'
import { RequireSignIn } from '@/components/layout/auth-gate'

export default function DashboardPage() {
  return (
    <RequireSignIn redirectTo="/account/dashboard">
      <DashboardContent />
    </RequireSignIn>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  if (!user) return null
  return <AccountDashboard user={user} />
}
