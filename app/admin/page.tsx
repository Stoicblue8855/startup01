import { RequireSignIn } from '@/components/layout/auth-gate'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default function AdminPage() {
  return (
    <RequireSignIn redirectTo="/admin">
      <div className="pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <AdminDashboard />
        </div>
      </div>
    </RequireSignIn>
  )
}
