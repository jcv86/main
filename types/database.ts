import type { SupabaseClient } from '@supabase/supabase-js'

// Generic database type for Supabase client
export type Database = SupabaseClient['__types']
