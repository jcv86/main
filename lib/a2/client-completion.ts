'use client'

export interface A2DayCompletionPayload {
  success?: boolean
  progression?: {
    day?: number
    alreadyCompleted?: boolean
    nextDay?: number
    currentDay?: number
    highestUnlockedDay?: number
    completedDays?: number[]
    progressPercentage?: number
  }
  validation?: {
    errors?: string[]
    score?: number
    passScore?: number
  } | null
  a3_unlocks?: Array<{
    day: number
    moduleId: string
    moduleTitle: string
    route: string
  }>
  error?: string
}

export interface A2DayCompletionResult {
  payload: A2DayCompletionPayload
  nextDay: number | null
  nextPath: string
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

async function readPayload(response: Response): Promise<A2DayCompletionPayload> {
  try {
    return (await response.json()) as A2DayCompletionPayload
  } catch {
    return {}
  }
}

function completionErrorMessage(payload: A2DayCompletionPayload): string {
  const firstCriterion = Array.isArray(payload.validation?.errors)
    ? payload.validation?.errors.find(
        (error): error is string => typeof error === 'string' && error.trim().length > 0,
      )
    : null

  return firstCriterion
    ? `${payload.error || 'El entregable necesita ajustes.'} ${firstCriterion}`
    : payload.error || 'No pudimos completar el día.'
}

/**
 * Completes an A2 day through the single authoritative server endpoint.
 * The caller never decides whether the user is real or demo; the signed
 * request cookies are resolved on the server.
 */
export async function completeA2Day(
  dayNumber: number,
  submission?: unknown,
): Promise<A2DayCompletionResult> {
  const response = await fetch('/api/a2/complete-day', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      dayNumber,
      submission: asObject(submission),
    }),
  })

  const payload = await readPayload(response)
  if (!response.ok) {
    throw new Error(completionErrorMessage(payload))
  }

  const candidate = Number(payload.progression?.nextDay)
  const nextDay =
    Number.isInteger(candidate) && candidate >= 1 && candidate <= 90
      ? candidate
      : null

  return {
    payload,
    nextDay,
    nextPath:
      nextDay && nextDay > dayNumber
        ? `/despega/a2/dia-${nextDay}`
        : '/despega/a2',
  }
}
