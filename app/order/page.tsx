import type { Metadata } from 'next'
import { RequireSignIn } from '@/components/layout/auth-gate'
import { OrderFlow } from '@/components/order/order-flow'
import { getSiteSettings } from '@/lib/content'

export const revalidate = 30

export const metadata: Metadata = {
  title: 'Place your order',
  robots: { index: false, follow: false },
}

export default async function OrderPage() {
  const settings = await getSiteSettings()
  return (
    <RequireSignIn redirectTo="/order">
      <div className="pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <OrderFlow
            whatsappNumber={settings.whatsappNumber}
            acceptingOrders={settings.acceptingOrders}
            closedMessage={settings.ordersClosedMessage}
            codEnabled={settings.codEnabled}
            whatsappEnabled={settings.whatsappPaymentEnabled}
          />
        </div>
      </div>
    </RequireSignIn>
  )
}
