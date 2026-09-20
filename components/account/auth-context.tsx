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
  signInWithGoogle: (redirectPath?: string) => Promise<{ error: string | null }>
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
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (event === 'SIGNED_IN' && newSession?.user) {
        const method = newSession.user.app_metadata?.provider === 'google' ? 'google' : 'email'
        supabase
          .from('login_events')
          .insert({
            user_id: newSession.user.id,
            email: newSession.user.email,
            method,
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          })
          .then(({ error }) => {
            if (error) console.error('login_events insert failed', error)
          })
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [supabase])

  // "Live" presence heartbeat: while a user is signed in and has the site
  // open, refresh their last_seen_at every 30s. Query user_presence where
  // last_seen_at is within the last couple minutes to see who's online now.
  useEffect(() => {
    if (!supabase || !user) return
    async function beat() {
      await supabase!.from('user_presence').upsert({
        user_id: user!.id,
        email: user!.email,
        last_seen_at: new Date().toISOString(),
      })
    }
    beat()
    const interval = setInterval(beat, 30000)
    return () => clearInterval(interval)
  }, [supabase, user])

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

  async function signInWithGoogle(redirectPath?: string) {
    if (!supabase) return { error: 'Sign-in is not available right now.' }
    const destination = redirectPath && redirectPath !== '/account' ? redirectPath : '/account/dashboard'
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${destination}` },
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
