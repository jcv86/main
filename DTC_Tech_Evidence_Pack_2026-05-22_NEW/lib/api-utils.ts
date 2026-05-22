import { NextResponse } from "next/server"

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message)
    this.name = "APIError"
  }
}

export function handleAPIError(error: unknown) {
  console.error("API Error:", error instanceof Error ? error.message : String(error))

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      error: "Unknown error occurred",
    },
    { status: 500 }
  )
}

export class RateLimiter {
  private store: Map<string, { count: number; resetTime: number }> = new Map()

  check(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now()
    const record = this.store.get(identifier)

    if (!record || now > record.resetTime) {
      this.store.set(identifier, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count < limit) {
      record.count++
      return true
    }

    return false
  }

  reset(identifier: string) {
    this.store.delete(identifier)
  }
}
