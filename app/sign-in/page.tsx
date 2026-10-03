import type { Metadata } from 'next'
import { SignInPage } from '@/components/layout/auth-gate'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams
  const target = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'
  return <SignInPage redirectTo={target} />
}
