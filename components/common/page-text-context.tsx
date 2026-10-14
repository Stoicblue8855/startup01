'use client'

import { createContext, useContext } from 'react'
import { PAGE_TEXT_DEFAULTS } from '@/lib/page-text'

const PageTextContext = createContext<Record<string, string> | null>(null)

export function PageTextProvider({ map, children }: { map: Record<string, string>; children: React.ReactNode }) {
  return <PageTextContext.Provider value={map}>{children}</PageTextContext.Provider>
}

/** Returns a function that looks up editable wording by key (see lib/page-text.ts). */
export function useT() {
  const map = useContext(PageTextContext)
  return (key: string): string => map?.[key] ?? PAGE_TEXT_DEFAULTS[key]?.value ?? ''
}
