/**
 * A3 Access Control System
 *
 * A3 modules become available when their A2 checkpoint day is reached and
 * remain available afterwards. Completed modules can always be replayed.
 */

import { getA2ProgressSnapshot } from '@/lib/a2/server-progress'
import {
  A3_CHECKPOINT_MAP,
  getA3ModuleById,
  getCheckpointDayForModule,
} from '@/lib/a3-checkpoint-map'

const NUMERIC_TO_SLUG: Record<string, string> = {
  'module-1': 'career-mirror',
  'module-2': 'value-mining-lab',
  'module-3': 'cv-builder-studio',
  'module-4': 'job-decoder',
  'module-5': 'answer-architecture',
  'module-6': 'coach-practice-room',
  'module-7': 'communication-gym',
  'module-8': 'first-recruiter-simulation',
  'module-9': 'risk-difficult-questions-lab',
  'module-10': 'basic-interview-mission',
}

function normalizeModuleId(id: string): string {
  return NUMERIC_TO_SLUG[id] ?? id
}

function completedModuleIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return Array.from(
    new Set(
      value
        .filter((id): id is string => typeof id === 'string')
        .map(normalizeModuleId),
    ),
  )
}

export interface A3AccessCheck {
  canAccess: boolean
  reason: string
  blockReasons: string[]
  currentDay: number
  checkpointDay?: number
  requestedModuleId: string
  day1Status: 'not_started' | 'in_progress' | 'passed' | 'needs_revision'
  day1Score?: number
}

export interface A3ModuleAccessState {
  moduleId: string
  moduleName: string
  moduleNumber: number
  checkpointDay: number
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  reason: string
  prerequisitesCompleted: boolean
  day1PresentationMet: boolean
  currentDayMet: boolean
}

/**
 * Check if the current user can access a specific A3 module.
 */
export async function checkA3ModuleAccess(
  userId: string,
  requestedModuleId: string,
  supabase: any,
): Promise<A3AccessCheck> {
  const blockReasons: string[] = []

  try {
    const normalizedRequestedId = normalizeModuleId(requestedModuleId)
    const [a2Snapshot, day1Result, a3Result] = await Promise.all([
      getA2ProgressSnapshot(userId, supabase),
      supabase
        .from('a2_day1_submissions')
        .select('analysis_score, pass_fail_status, analysis_result')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('a3_user_progress')
        .select('completed_module_ids')
        .eq('user_id', userId)
        .maybeSingle(),
    ])

    if (day1Result.error) {
      console.error('[v0] Error reading Day 1 gate:', day1Result.error)
    }
    if (a3Result.error) {
      console.error('[v0] Error reading A3 progress:', a3Result.error)
    }

    const currentDay = a2Snapshot.currentDay
    const completedA3Modules = completedModuleIds(
      a3Result.data?.completed_module_ids,
    )
    const alreadyCompleted = completedA3Modules.includes(normalizedRequestedId)
    const day1Score = Math.max(0, Number(day1Result.data?.analysis_score) || 0)

    // Legacy users with real A3 completions are grandfathered so their existing
    // progress does not become inaccessible after the new Day 1 gate was added.
    const day1Passed =
      day1Result.data?.pass_fail_status === 'pass' || completedA3Modules.length > 0

    let day1Status: A3AccessCheck['day1Status'] = 'not_started'
    if (day1Passed) day1Status = 'passed'
    else if (day1Score > 0) day1Status = 'needs_revision'

    const moduleConfig = getA3ModuleById(normalizedRequestedId)
    const checkpointDay = getCheckpointDayForModule(normalizedRequestedId)
    const currentDayMet = Boolean(checkpointDay && currentDay >= checkpointDay)
    const requiredPrevious = moduleConfig?.requiredPreviousModules || []
    const prerequisitesMet = requiredPrevious.every((moduleId) =>
      completedA3Modules.includes(normalizeModuleId(moduleId)),
    )

    if (!alreadyCompleted && !day1Passed) {
      blockReasons.push(
        'Completa y aprueba el Día 1 de Tu Ruta antes de iniciar Entrenamiento.',
      )
    }

    if (!alreadyCompleted && !currentDayMet) {
      blockReasons.push(
        checkpointDay
          ? `Este entrenamiento se habilita desde el Día ${checkpointDay}. Actualmente estás en el Día ${currentDay}.`
          : 'Este entrenamiento no tiene un checkpoint válido configurado.',
      )
    }

    if (!alreadyCompleted && !prerequisitesMet) {
      const missingModules = requiredPrevious.filter(
        (moduleId) => !completedA3Modules.includes(normalizeModuleId(moduleId)),
      )
      blockReasons.push(
        `Completa primero: ${missingModules.join(', ')}.`,
      )
    }

    const canAccess =
      alreadyCompleted || (day1Passed && currentDayMet && prerequisitesMet)

    return {
      canAccess,
      reason: alreadyCompleted
        ? 'Módulo completado disponible para repetir'
        : canAccess
          ? 'Acceso habilitado'
          : 'Acceso pendiente',
      blockReasons,
      currentDay,
      checkpointDay,
      requestedModuleId: normalizedRequestedId,
      day1Status,
      day1Score,
    }
  } catch (error) {
    console.error('[v0] Error checking A3 access:', error)
    return {
      canAccess: false,
      reason: 'Error checking access',
      blockReasons: ['No pudimos verificar las condiciones de acceso.'],
      currentDay: 1,
      requestedModuleId: normalizeModuleId(requestedModuleId),
      day1Status: 'not_started',
    }
  }
}

/**
 * Build access state for all 10 A3 modules.
 */
export async function getA3AllModulesAccessState(
  userId: string,
  supabase: any,
): Promise<A3ModuleAccessState[]> {
  try {
    const [a2Snapshot, day1Result, a3Result] = await Promise.all([
      getA2ProgressSnapshot(userId, supabase),
      supabase
        .from('a2_day1_submissions')
        .select('pass_fail_status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('a3_user_progress')
        .select('completed_module_ids')
        .eq('user_id', userId)
        .maybeSingle(),
    ])

    const completed = completedModuleIds(a3Result.data?.completed_module_ids)
    const day1Passed =
      day1Result.data?.pass_fail_status === 'pass' || completed.length > 0

    return Object.entries(A3_CHECKPOINT_MAP)
      .map(([day, checkpoint]) => {
        const checkpointDay = Number(day)
        const isCompleted = completed.includes(checkpoint.moduleId)
        const prerequisitesCompleted = checkpoint.requiredPreviousModules.every(
          (moduleId) => completed.includes(normalizeModuleId(moduleId)),
        )
        const currentDayMet = a2Snapshot.currentDay >= checkpointDay
        const available =
          isCompleted || (day1Passed && currentDayMet && prerequisitesCompleted)

        return {
          moduleId: checkpoint.moduleId,
          moduleName: checkpoint.moduleTitle,
          moduleNumber: checkpoint.moduleNumber,
          checkpointDay,
          status: isCompleted ? 'completed' : available ? 'available' : 'locked',
          reason: isCompleted
            ? 'Completado'
            : available
              ? 'Disponible'
              : `Se habilita desde el Día ${checkpointDay}`,
          prerequisitesCompleted,
          day1PresentationMet: day1Passed,
          currentDayMet,
        } satisfies A3ModuleAccessState
      })
      .sort((left, right) => left.moduleNumber - right.moduleNumber)
  } catch (error) {
    console.error('[v0] Error getting A3 modules state:', error)
    return []
  }
}

/**
 * Get a human-readable access denial reason.
 */
export function getA3AccessDenialMessage(check: A3AccessCheck): string {
  if (check.canAccess) return 'Acceso habilitado.'

  const messages = ['Este entrenamiento aún no está disponible:']
  check.blockReasons.forEach((reason, index) => {
    messages.push(`${index + 1}. ${reason}`)
  })
  return messages.join('\n')
}

/**
 * Mark an A3 module as completed without duplicating its identifier.
 */
export async function completeA3Module(
  userId: string,
  moduleId: string,
  supabase: any,
): Promise<boolean> {
  try {
    const normalizedId = normalizeModuleId(moduleId)
    const { data: progress, error: progressError } = await supabase
      .from('a3_user_progress')
      .select('completed_module_ids')
      .eq('user_id', userId)
      .maybeSingle()

    if (progressError) throw progressError

    const completedIds = completedModuleIds(progress?.completed_module_ids)
    if (!completedIds.includes(normalizedId)) completedIds.push(normalizedId)

    const { error } = progress
      ? await supabase
          .from('a3_user_progress')
          .update({
            completed_module_ids: completedIds,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
      : await supabase.from('a3_user_progress').insert({
          user_id: userId,
          completed_module_ids: completedIds,
          module_states: { [normalizedId]: 'completed' },
          total_xp: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

    if (error) throw error
    return true
  } catch (error) {
    console.error('[v0] Error completing A3 module:', error)
    return false
  }
}
