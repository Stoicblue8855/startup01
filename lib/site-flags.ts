'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from './supabase'

let cached: boolean | null = null
let pending: Promise<boolean> | null = null

function loadRequireSignin(): Promise<boolean> {
  if (cached !== null) return Promise.resolve(cached)
  if (pending) return pending
  const supabase = getSupabaseClient()
  if (!supabase) return Promise.resolve(true)
  pending = Promise.resolve(
    supabase
      .from('site_settings')
      .select('require_signin_for_prices')
      .eq('id', 1)
      .maybeSingle(),
  )
    .then(({ data, error }) => {
      if (!error && data && typeof data.require_signin_for_prices === 'boolean') {
        cached = data.require_signin_for_prices
        return cached
      }
      return true
    })
    .catch(() => true)
    .finally(() => {
      pending = null
    })
  return pending
}

/**
 * Whether visitors must sign in to see prices and add to cart. Controlled by
 * the `require_signin_for_prices` switch in the Supabase `site_settings` table.
 * Defaults to true (the safe option) until the setting has loaded.
 */
export function useRequireSigninForPrices(): boolean {
  const [value, setValue] = useState<boolean>(cached ?? true)
  useEffect(() => {
    let alive = true
    loadRequireSignin().then((v) => {
      if (alive) setValue(v)
    })
    return () => {
      alive = false
    }
  }, [])
  return value
}
