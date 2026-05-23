/**
 * API error handler utility
 * Standardized error handling for all API routes
 */

import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
  timestamp: string
}

export interface ApiError {
  code: string
  status: number
  message: string
  context?: Record<string, unknown>
}

// Common API errors
export const ApiErrors = {
  INVALID_REQUEST: {
    code: 'INVALID_REQUEST',
    status: 400,
    message: 'Invalid request parameters',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    status: 401,
    message: 'Authentication required',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    status: 403,
    message: 'Access denied',
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    status: 404,
    message: 'Resource not found',
  },
  CONFLICT: {
    code: 'CONFLICT',
    status: 409,
    message: 'Resource already exists',
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    status: 422,
    message: 'Validation failed',
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    status: 500,
    message: 'Internal server error',
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    status: 503,
    message: 'Service temporarily unavailable',
  },
}

/**
 * Send successful API response
 */
export function success<T>(data: T, status = 200): Response {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>,
    { status }
  )
}

/**
 * Send error API response
 */
export function error(err: ApiError | Error, context?: Record<string, unknown>): Response {
  let apiError: ApiError

  if (err instanceof Error) {
    // Handle standard Error objects
    apiError = {
      ...ApiErrors.INTERNAL_ERROR,
      message: err.message,
    }
    logger.error('Unhandled error', { error: err.message, stack: err.stack, ...context })
  } else {
    // Handle ApiError objects
    apiError = err
    logger.error(`API Error: ${apiError.code}`, { message: apiError.message, ...context })
  }

  return NextResponse.json(
    {
      success: false,
      error: apiError.code,
      message: apiError.message,
      timestamp: new Date().toISOString(),
    } as ApiResponse,
    { status: apiError.status }
  )
}

/**
 * Wrap async handler with error handling
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args)
    } catch (err) {
      logger.error('Request handler error', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      })

      // Check if it's a known API error
      if (err && typeof err === 'object' && 'code' in err && 'status' in err) {
        return error(err as ApiError)
      }

      // Check for specific error types
      if (err instanceof SyntaxError) {
        return error(ApiErrors.INVALID_REQUEST)
      }

      // Default to internal error
      return error(ApiErrors.INTERNAL_ERROR)
    }
  }
}

/**
 * Validate request has required fields
 */
export function validateRequired(data: unknown, fields: string[]): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, missing: fields }
  }

  for (const field of fields) {
    const value = (data as Record<string, unknown>)[field]
    if (value === undefined || value === null || value === '') {
      missing.push(field)
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * Parse and validate JSON body
 */
export async function parseJson<T>(request: Request): Promise<T> {
  try {
    return await request.json() as T
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Invalid JSON'
    throw new Error(`Failed to parse request body: ${error}`)
  }
}

/**
 * Handle Supabase errors gracefully
 */
export function handleSupabaseError(err: any, context: string): never {
  const message = err?.message || err?.toString() || 'Unknown database error'

  logger.error(`Supabase error in ${context}`, {
    message,
    code: err?.code,
    details: err?.details,
  })

  if (message.includes('JWT')) {
    throw ApiErrors.UNAUTHORIZED
  }

  if (message.includes('not found')) {
    throw ApiErrors.NOT_FOUND
  }

  throw {
    ...ApiErrors.INTERNAL_ERROR,
    message: `Database operation failed: ${message}`,
  }
}
