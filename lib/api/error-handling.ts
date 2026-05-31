// Global error handling utilities for API routes
import { NextResponse } from 'next/server'
import type { PostgrestError } from '@supabase/supabase-js'

export interface ApiErrorResponse {
  error: string
  code?: string
  details?: string
}

/**
 * Handle different types of errors and return consistent response
 */
export function handleApiError(error: unknown, context?: string): NextResponse<ApiErrorResponse> {
  console.error(`[v0] API Error${context ? ` (${context})` : ''}:`, error)

  if (error instanceof Error) {
    const message = error.message || 'Unknown error'

    // Supabase/PostgreSQL errors
    if ('code' in error && 'message' in error) {
      const pgError = error as PostgrestError
      const status = mapPostgresErrorToStatus(pgError.code)

      return NextResponse.json(
        {
          error: message,
          code: pgError.code,
          details: pgError.details
        },
        { status }
      )
    }

    // Auth errors
    if (message.includes('auth') || message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validation errors
    if (message.includes('validation') || message.includes('required')) {
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }

    // Default 500
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }

  // Unknown error
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
}

/**
 * Map PostgreSQL error codes to HTTP status codes
 */
function mapPostgresErrorToStatus(code: string): number {
  const mapping: Record<string, number> = {
    '23505': 409, // Unique violation
    '23503': 409, // Foreign key violation
    '23502': 400, // Not null violation
    '23514': 400, // Check violation
    '42P01': 400, // Undefined table
    '42883': 400, // Undefined function
    'PGRST301': 401, // JWT invalid
    'PGRST302': 401, // JWT expired
    'PGRST305': 403, // RLS policy violation
  }

  return mapping[code] || 500
}

/**
 * Wrap async route handler with error handling
 */
export function withErrorHandling(
  handler: (request: Request) => Promise<NextResponse<any>>
) {
  return async (request: Request) => {
    try {
      return await handler(request)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

/**
 * Retry logic for transient errors
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      console.log(`[v0] Retry ${i + 1}/${maxRetries} after error:`, lastError.message)
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)))
      }
    }
  }

  throw lastError
}
