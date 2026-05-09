import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Return existing instance if available (singleton pattern)
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      `[Supabase] Credentials not found. App will work in limited mode.\n` +
      `- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'set' : 'missing'}\n` +
      `- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? 'set' : 'missing'}`
    )
    return null as any
  }

  supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey)
  return supabaseInstance
}
