'use client'

import { createContext, useContext } from 'react'
import { siteSettings as staticSettings } from '@/lib/content'
import type { SiteSettings } from '@/lib/types'

const SiteSettingsContext = createContext<SiteSettings | null>(null)

export function SiteSettingsProvider({ settings, children }: { settings: SiteSettings; children: React.ReactNode }) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
}

/** Site settings from the Supabase `site_settings` table (built-in copy if the database is unreachable). */
export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext) ?? staticSettings
}
