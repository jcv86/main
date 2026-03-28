/**
 * Global type augmentations and declarations
 * Imported automatically by TypeScript
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY?: string
      SUPABASE_URL?: string
      SUPABASE_ANON_KEY?: string
      SUPABASE_SERVICE_ROLE_KEY?: string
      DATABASE_URL?: string
      NEXT_PUBLIC_SUPABASE_URL?: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
    }
  }

  // Extend Array to support better typed callbacks
  interface Array<T> {
    /**
     * Typed map with explicit parameter types
     */
    map<U>(
      callback: (value: T, index: number, array: T[]) => U,
      thisArg?: unknown
    ): U[]

    /**
     * Typed reduce with explicit parameter types
     */
    reduce<U>(
      callback: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
      initialValue: U
    ): U
  }
}

// Export common API response types
export type ApiSuccessResponse<T = unknown> = {
  success: true
  data?: T
  message?: string
}

export type ApiErrorResponse = {
  success: false
  error: string
  message?: string
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

// Supabase related types
export type SupabaseRow = Record<string, unknown>

export type SupabaseQueryResult<T extends SupabaseRow = SupabaseRow> = {
  data: T[] | T | null
  error: { message: string } | null
}

// Generic callback types with proper inference
export type MapCallback<T, R = void> = (item: T, index: number, array: T[]) => R
export type ReduceCallback<T, R> = (accumulator: R, item: T, index: number, array: T[]) => R
export type FilterCallback<T> = (item: T, index: number, array: T[]) => boolean
export type ForEachCallback<T> = (item: T, index: number, array: T[]) => void

export {}
