import type { Metadata } from 'next'
import { AccountDashboard } from '@/components/account/dashboard'

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your orders, wishlist, addresses and account settings.',
}

export default function DashboardPage() {
  // Placeholder identity until real auth is wired up.
  return <AccountDashboard name="Mayur Patil" email="mayur@samaychakkra.com" />
}
