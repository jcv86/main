/**
 * Common type definitions for API routes
 */

// Generic Supabase query result types
export type SupabaseRow = Record<string, unknown>

export type SupabaseQueryResult<T extends SupabaseRow = SupabaseRow> = {
  data: T[] | null
  error: Error | null
}

// OpenAI response types
export interface OpenAIMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
  error?: {
    message: string
  }
}

// Common API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// NextResponse helpers
export interface JsonResponseOptions {
  status?: number
  headers?: Record<string, string>
}

// User context types
export type UserContext = {
  id: string
  email: string
  profile?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

// Callback parameter types with common patterns
export type MapCallback<T, R> = (item: T, index: number, array: T[]) => R
export type ReduceCallback<T, R> = (accumulator: R, item: T, index: number, array: T[]) => R
export type FilterCallback<T> = (item: T, index: number, array: T[]) => boolean
