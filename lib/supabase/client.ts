import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Return existing instance if available (singleton pattern for better persistence)
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

  // Create browser client with session persistence enabled
  supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true, // Ensure session persists across page reloads
      autoRefreshToken: true, // Auto-refresh tokens before they expire
      detectSessionInUrl: true, // Detect auth redirects
      flowType: 'pkce', // Use PKCE flow for better security
    },
  })
  
  console.log('[v0] Supabase client initialized with session persistence enabled')
  return supabaseInstance
}

