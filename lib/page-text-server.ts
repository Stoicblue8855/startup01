import { cache } from 'react'
import { getSupabaseClient } from './supabase'
import { PAGE_TEXT_DEFAULTS } from './page-text'

/** All page wording as one lookup: Supabase `page_content` rows win over the built-in defaults. */
export const getPageTextMap = cache(async (): Promise<Record<string, string>> => {
  const map: Record<string, string> = {}
  for (const [k, v] of Object.entries(PAGE_TEXT_DEFAULTS)) map[k] = v.value
  const supabase = getSupabaseClient()
  if (supabase) {
    try {
      const { data, error } = await supabase.from('page_content').select('key, value')
      if (!error && data) {
        for (const row of data as { key: string; value: string | null }[]) {
          if (row.key in map && typeof row.value === 'string' && row.value.trim() !== '') map[row.key] = row.value
        }
      }
    } catch {
      /* fall back to defaults */
    }
  }
  return map
})

export async function getText() {
  const map = await getPageTextMap()
  return (key: string): string => map[key] ?? PAGE_TEXT_DEFAULTS[key]?.value ?? ''
}
