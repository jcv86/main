import 'server-only'

import { buildA2CycleReview, type A2CycleReviewRecord } from '@/lib/a2/cycle-review'
import { computeA4EvidencePulse } from '@/lib/a4/evidence-pulse'
import type { A4Decision, A4VerifiedSignal } from '@/lib/a4/strategic-radar'
import { createAdminClient } from '@/lib/supabase/server'

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function numberValue(value: unknown): number | null {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

export async function loadA2Report(userId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('a2_user_task_completions')
    .select('day,mission_type,validation_status,validation_result,submission,completed_at')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })

  if (error) throw new Error(`No se pudo cargar el reporte A2: ${error.message}`)

  const recordsByDay = new Map<number, A2CycleReviewRecord>()
  for (const row of data ?? []) {
    const day = Number(row.day)
    if (!Number.isInteger(day) || day < 1 || day > 90 || recordsByDay.has(day)) continue
    const validation = objectValue(row.validation_result)
    const submission = objectValue(row.submission)
    recordsByDay.set(day, {
      day,
      missionType: textValue(row.mission_type) || null,
      validationStatus: textValue(row.validation_status) || 'legacy',
      score: numberValue(validation.score),
      hasEvidence: ['summary', 'evidence', 'reflection', 'metrics', 'artifactUrl'].some(
        (key) => textValue(submission[key]).trim().length > 0,
      ),
      completedAt: textValue(row.completed_at) || null,
    })
  }

  const records = [...recordsByDay.values()].sort((a, b) => a.day - b.day)
  return {
    completedDays: records.length,
    reviews: ([30, 60, 90] as const).map((horizon) => buildA2CycleReview(horizon, records)),
  }
}

export async function loadA3Report(userId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('a3_session_attempts')
    .select('module_id,module_number,status,score,feedback,session_completed_at,created_at')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`No se pudo cargar el reporte A3: ${error.message}`)

  const latestByModule = new Map<string, NonNullable<typeof data>[number]>()
  for (const session of data ?? []) {
    const moduleId = textValue(session.module_id)
    if (moduleId && !latestByModule.has(moduleId)) latestByModule.set(moduleId, session)
  }
  const modules = [...latestByModule.values()].sort(
    (a, b) => Number(a.module_number ?? 999) - Number(b.module_number ?? 999),
  )
  const scores = modules
    .map((session) => numberValue(session.score))
    .filter((score): score is number => score !== null)

  return {
    completedModules: modules.length,
    totalSessions: data?.length ?? 0,
    averageScore:
      scores.length === 0
        ? null
        : Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
    modules,
  }
}

export async function loadA4Report(userId: string) {
  const supabase = createAdminClient()
  const [signalsResult, decisionsResult, documentsResult] = await Promise.all([
    supabase
      .from('a4_verified_signals')
      .select('id,title,category,classification,summary,relevance,confidence,source_type,source_name,source_url,source_reference,source_date,status,created_at,updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('a4_decision_log')
      .select('id,signal_id,decision,rationale,expected_evidence,status,review_on,outcome,reviewed_at,created_at,updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase.from('dtc_documents').select('id').eq('user_id', userId),
  ])

  const firstError = signalsResult.error || decisionsResult.error || documentsResult.error
  if (firstError) throw new Error(`No se pudo cargar el reporte A4: ${firstError.message}`)

  const signals = (signalsResult.data ?? []) as A4VerifiedSignal[]
  const decisions = (decisionsResult.data ?? []) as A4Decision[]
  return {
    signals,
    decisions,
    documents: documentsResult.data?.length ?? 0,
    pulse: computeA4EvidencePulse(signals, decisions),
  }
}
