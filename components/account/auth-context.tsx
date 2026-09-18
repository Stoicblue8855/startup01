'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  configured: boolean
  sendEmailOtp: (email: string) => Promise<{ error: string | null }>
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: string | null }>
  sendPhoneOtp: (phone: string) => Promise<{ error: string | null }>
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [supabase])

  async function sendEmailOtp(email: string) {
    if (!supabase) return { error: 'Sign-in is not available right now.' }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    return { error: error?.message ?? null }
  }

  async function verifyEmailOtp(email: string, token: string) {
    if (!supabase) return { error: 'Sign-in is not available right now.' }
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    return { error: error?.message ?? null }
  }

  async function sendPhoneOtp(phone: string) {
    if (!supabase) return { error: 'Sign-in is not available right now.' }
    const { error } = await supabase.auth.signInWithOtp({ phone })
    return { error: error?.message ?? null }
  }

  async function verifyPhoneOtp(phone: string, token: string) {
    if (!supabase) return { error: 'Sign-in is not available right now.' }
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
    return { error: error?.message ?? null }
  }

  async function signInWithGoogle() {
    if (!supabase) return { error: 'Sign-in is not available right now.' }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account/dashboard` },
    })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        configured: Boolean(supabase),
        sendEmailOtp,
        verifyEmailOtp,
        sendPhoneOtp,
        verifyPhoneOtp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
