/**
 * Supabase client — ready for when the content moves out of the static data
 * layer and into a live database.
 *
 * The rest of the app never imports this file directly. Instead, every screen
 * reads its content through the async getter functions in `lib/content.ts` and
 * `lib/products.ts`. Each of those functions has a clearly marked
 * `// SUPABASE:` comment showing exactly what query to run once the tables
 * exist. That keeps the UI untouched during the migration.
 *
 * To go live:
 *   1. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to env.
 *   2. Create the tables described in `lib/types.ts`.
 *   3. Replace the static return values in the getters with the Supabase
 *      queries noted alongside them.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Lazily created singleton. Returns null until env vars are configured so the
 * static data layer can keep serving content in the meantime.
 */
let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (!url || !anonKey) return null
  if (!client) client = createClient(url, anonKey)
  return client
}

export const isSupabaseConfigured = Boolean(url && anonKey)
