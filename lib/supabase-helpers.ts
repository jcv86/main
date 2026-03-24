/**
 * Supabase query helpers with proper typing
 */

import { SupabaseClient } from "@supabase/supabase-js"
import { SupabaseRow } from "@/lib/types/api-common"

/**
 * Execute a typed Supabase query with error handling
 */
export async function querySupabase<T extends SupabaseRow>(
  supabase: SupabaseClient,
  table: string,
  columns: string,
  filters?: Record<string, unknown>
): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    let query = supabase.from(table).select(columns)

    // Apply filters if provided
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value === null) {
          query = query.is(key, null)
        } else if (Array.isArray(value)) {
          query = query.in(key, value)
        } else if (typeof value === "object") {
          // Handle complex filters (gt, lt, eq, etc.)
          const operator = Object.keys(value)[0]
          const val = Object.values(value)[0]
          if (operator === "gt") query = query.gt(key, val)
          else if (operator === "lt") query = query.lt(key, val)
          else if (operator === "eq") query = query.eq(key, val)
          else if (operator === "neq") query = query.neq(key, val)
        } else {
          query = query.eq(key, value)
        }
      }
    }

    const { data, error } = await query

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    // Ensure data is an array
    if (!Array.isArray(data)) {
      return { data: [], error: null }
    }

    return { data: data as T[], error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}

/**
 * Execute a Supabase insert with typing
 */
export async function insertSupabase<T extends SupabaseRow>(
  supabase: SupabaseClient,
  table: string,
  data: T
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data: result as T, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}

/**
 * Execute a Supabase upsert with typing
 */
export async function upsertSupabase<T extends SupabaseRow>(
  supabase: SupabaseClient,
  table: string,
  data: T,
  conflictColumn: string
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .upsert([data], { onConflict: conflictColumn })
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data: result as T, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}
