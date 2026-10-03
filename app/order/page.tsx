import type { Metadata } from 'next'
import { RequireSignIn } from '@/components/layout/auth-gate'
import { OrderFlow } from '@/components/order/order-flow'

export const metadata: Metadata = {
  title: 'Place your order',
  robots: { index: false, follow: false },
}

export default function OrderPage() {
  return (
    <RequireSignIn redirectTo="/order">
      <div className="pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <OrderFlow />
        </div>
      </div>
    </RequireSignIn>
  )
}
