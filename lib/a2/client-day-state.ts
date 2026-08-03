import type { A2MissionSubmission } from '@/lib/a2/day-submission'
import type { A2RouteAdaptation } from '@/lib/a2/route-adaptation'

export interface A2DayAccessState {
  canAccess: boolean
  blockReasons: string[]
  currentDay: number
  highestUnlockedDay: number
  activeHorizon: 30 | 60 | 90
  requiredPreviousDay: number | null
  previousCompleted: boolean
}

export interface A2DayCompletionState {
  id: string
  isCompleted: boolean
  missionType: string
  validationStatus: string
  validation: Record<string, unknown>
  submission: A2MissionSubmission
  completedAt: string | null
  updatedAt: string | null
}

export interface A2DayCheckpointState {
  moduleId: string
  moduleNumber: number
  moduleTitle: string
  route: string
  completed: boolean
  missingModules: string[]
}

export interface A2DayRouteState {
  id: string
  code: string
  name: string
  description: string | null
  source: string
}

export interface A2DayStateResponse {
  success: boolean
  day: number
  route: A2DayRouteState | null
  adaptation: A2RouteAdaptation
  access: A2DayAccessState
  completion: A2DayCompletionState | null
  checkpoint: A2DayCheckpointState | null
}

export async function fetchA2DayState(
  dayNumber: number,
): Promise<A2DayStateResponse> {
  const response = await fetch(`/api/a2/day-state/${dayNumber}`, {
    credentials: 'include',
    cache: 'no-store',
  })
  const payload = (await response.json().catch(() => ({}))) as Partial<
    A2DayStateResponse
  > & { error?: string }

  if (!response.ok) {
    const error = new Error(
      payload.error || 'No pudimos verificar el estado de este día.',
    ) as Error & { status?: number }
    error.status = response.status
    throw error
  }

  if (!payload.access || !payload.adaptation || payload.day !== dayNumber) {
    throw new Error('La respuesta del estado del día es inválida.')
  }

  return payload as A2DayStateResponse
}
