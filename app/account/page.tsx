import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Logo } from '@/components/brand/logo'
import { AuthFlow } from '@/components/account/auth-flow'
import { Reveal } from '@/components/motion/reveal'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your SamayChakkra account.',
}

export default function AccountPage() {
  return (
    <div className="flex min-h-[90dvh] flex-col items-center justify-center px-5 pb-16 pt-28 md:pt-32">
      <Reveal className="mb-10 flex flex-col items-center text-center">
        <Logo />
        <h1 className="mt-6 font-serif text-3xl text-balance md:text-4xl">Welcome back.</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Sign in to track orders, save favourites and hear from the atelier first.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="w-full">
        <Suspense fallback={<div className="mx-auto h-[420px] w-full max-w-sm" />}>
          <AuthFlow />
        </Suspense>
      </Reveal>
    </div>
  )
}
