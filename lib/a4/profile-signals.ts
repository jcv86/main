/**
 * A4 Profile Signals - Intelligence from Documents
 * 
 * Profile signals are extracted from documents and used to build
 * a comprehensive understanding of the user's professional profile.
 */

import { createClient } from '@/lib/supabase/client'
import type {
  DTCProfileSignal,
  DTCSignalType,
  DTCSourceModule,
} from './types'

// ============================================
// PROFILE SIGNALS CRUD
// ============================================

/**
 * Get all active signals for a user
 */
export async function getUserSignals(
  userId: string,
  options?: {
    signalType?: DTCSignalType
    sourceModule?: DTCSourceModule
    polarity?: 'positive' | 'negative' | 'neutral'
    minConfidence?: number
    limit?: number
  }
): Promise<DTCProfileSignal[]> {
  const supabase = createClient()
  if (!supabase) return []

  let query = supabase
    .from('dtc_profile_signals')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('weight', { ascending: false })
    .order('confidence', { ascending: false })

  if (options?.signalType) {
    query = query.eq('signal_type', options.signalType)
  }
  if (options?.sourceModule) {
    query = query.eq('source_module', options.sourceModule)
  }
  if (options?.polarity) {
    query = query.eq('polarity', options.polarity)
  }
  if (options?.minConfidence) {
    query = query.gte('confidence', options.minConfidence)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[A4 Signals] Error fetching signals:', error)
    return []
  }

  return (data || []) as DTCProfileSignal[]
}

/**
 * Get signals by type (strengths, weaknesses, etc.)
 */
export async function getSignalsByType(
  userId: string,
  signalType: DTCSignalType
): Promise<DTCProfileSignal[]> {
  return getUserSignals(userId, { signalType })
}

/**
 * Get top strengths for a user
 */
export async function getTopStrengths(
  userId: string,
  limit: number = 5
): Promise<DTCProfileSignal[]> {
  return getUserSignals(userId, {
    signalType: 'strength',
    polarity: 'positive',
    limit,
  })
}

/**
 * Get weaknesses/areas for improvement
 */
export async function getWeaknesses(
  userId: string,
  limit: number = 5
): Promise<DTCProfileSignal[]> {
  const supabase = createClient()
  if (!supabase) return []

  const weaknessTypes: DTCSignalType[] = [
    'weakness',
    'cv_gap',
    'evidence_gap',
    'interview_risk',
    'missing_metric',
  ]

  const { data, error } = await supabase
    .from('dtc_profile_signals')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .in('signal_type', weaknessTypes)
    .order('weight', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[A4 Signals] Error fetching weaknesses:', error)
    return []
  }

  return (data || []) as DTCProfileSignal[]
}

/**
 * Deactivate signals from a specific document (when document is deleted/updated)
 */
export async function deactivateSignalsFromDocument(
  documentId: string
): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false

  const { error } = await supabase
    .from('dtc_profile_signals')
    .update({ is_active: false })
    .eq('source_document_id', documentId)

  if (error) {
    console.error('[A4 Signals] Error deactivating signals:', error)
    return false
  }

  return true
}

/**
 * Get signal statistics for a user
 */
export async function getSignalStats(userId: string): Promise<{
  total: number
  byType: Record<DTCSignalType, number>
  byPolarity: Record<string, number>
  avgConfidence: number
}> {
  const supabase = createClient()
  if (!supabase) {
    return {
      total: 0,
      byType: {} as Record<DTCSignalType, number>,
      byPolarity: {},
      avgConfidence: 0,
    }
  }

  const { data } = await supabase
    .from('dtc_profile_signals')
    .select('signal_type, polarity, confidence')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (!data || data.length === 0) {
    return {
      total: 0,
      byType: {} as Record<DTCSignalType, number>,
      byPolarity: {},
      avgConfidence: 0,
    }
  }

  const byType: Record<string, number> = {}
  const byPolarity: Record<string, number> = {}
  let totalConfidence = 0

  for (const signal of data) {
    byType[signal.signal_type] = (byType[signal.signal_type] || 0) + 1
    byPolarity[signal.polarity] = (byPolarity[signal.polarity] || 0) + 1
    totalConfidence += signal.confidence
  }

  return {
    total: data.length,
    byType: byType as Record<DTCSignalType, number>,
    byPolarity,
    avgConfidence: Math.round(totalConfidence / data.length),
  }
}

// ============================================
// AGGREGATED SIGNAL ANALYSIS
// ============================================

/**
 * Get career goals from signals
 */
export async function getCareerGoals(userId: string): Promise<string[]> {
  const signals = await getUserSignals(userId, { signalType: 'career_goal' })
  return [...new Set(signals.map(s => s.signal_value))]
}

/**
 * Get target roles from signals
 */
export async function getTargetRoles(userId: string): Promise<string[]> {
  const signals = await getUserSignals(userId, { signalType: 'target_role' })
  return [...new Set(signals.map(s => s.signal_value))]
}

/**
 * Get work style signals
 */
export async function getWorkStyle(userId: string): Promise<{
  styles: string[]
  communicationStyle?: string
  learningStyle?: string
}> {
  const workStyleSignals = await getUserSignals(userId, { signalType: 'work_style' })
  const communicationSignals = await getUserSignals(userId, { signalType: 'communication_style' })
  const learningSignals = await getUserSignals(userId, { signalType: 'learning_style' })

  return {
    styles: workStyleSignals.map(s => s.signal_value),
    communicationStyle: communicationSignals[0]?.signal_value,
    learningStyle: learningSignals[0]?.signal_value,
  }
}

/**
 * Get evidence quality score based on signals
 */
export async function getEvidenceQualityScore(userId: string): Promise<number> {
  const proofSignals = await getUserSignals(userId, { signalType: 'proof_of_value' })
  const gapSignals = await getSignalsByType(userId, 'evidence_gap')

  // Base score
  let score = 50

  // Add points for evidence
  score += Math.min(30, proofSignals.length * 5)

  // Subtract for gaps
  score -= Math.min(30, gapSignals.length * 10)

  // Adjust based on average confidence
  if (proofSignals.length > 0) {
    const avgConfidence = proofSignals.reduce((sum, s) => sum + s.confidence, 0) / proofSignals.length
    score += Math.round((avgConfidence - 50) / 10)
  }

  return Math.max(0, Math.min(100, score))
}

/**
 * Get interview readiness based on signals
 */
export async function getInterviewReadinessScore(userId: string): Promise<number> {
  const riskSignals = await getSignalsByType(userId, 'interview_risk')
  const confidenceSignals = await getSignalsByType(userId, 'confidence_level')
  const strengthSignals = await getTopStrengths(userId, 10)

  // Base score
  let score = 60

  // Subtract for risks
  score -= Math.min(40, riskSignals.length * 10)

  // Add for strengths
  score += Math.min(25, strengthSignals.length * 2.5)

  // Adjust for confidence
  if (confidenceSignals.length > 0) {
    const avgConfidence = confidenceSignals.reduce((sum, s) => sum + s.confidence, 0) / confidenceSignals.length
    score += Math.round((avgConfidence - 50) / 5)
  }

  return Math.max(0, Math.min(100, score))
}

/**
 * Get CV readiness based on signals
 */
export async function getCVReadinessScore(userId: string): Promise<number> {
  const cvGapSignals = await getSignalsByType(userId, 'cv_gap')
  const bulletSignals = await getUserSignals(userId, { signalType: 'proof_of_value' })

  // Base score
  let score = 50

  // Subtract for CV gaps
  score -= Math.min(40, cvGapSignals.length * 15)

  // Add for proof bullets
  score += Math.min(40, bulletSignals.length * 4)

  return Math.max(0, Math.min(100, score))
}

/**
 * Get recommended coach strategy based on signals
 */
export async function getCoachStrategy(userId: string): Promise<string> {
  const weaknesses = await getWeaknesses(userId, 3)
  const workStyle = await getWorkStyle(userId)

  // Determine strategy based on top weaknesses
  if (weaknesses.some(w => w.signal_type === 'interview_risk')) {
    return 'focus_interview_prep'
  }
  if (weaknesses.some(w => w.signal_type === 'cv_gap')) {
    return 'focus_cv_improvement'
  }
  if (weaknesses.some(w => w.signal_type === 'evidence_gap')) {
    return 'focus_evidence_building'
  }

  // Default strategy based on work style
  if (workStyle.styles.includes('structured')) {
    return 'structured_guidance'
  }
  if (workStyle.styles.includes('flexible')) {
    return 'adaptive_coaching'
  }

  return 'balanced_coaching'
}

/**
 * Get missing proof areas
 */
export async function getMissingProofAreas(userId: string): Promise<string[]> {
  const gapSignals = await getSignalsByType(userId, 'evidence_gap')
  const missingMetricSignals = await getSignalsByType(userId, 'missing_metric')

  const missing = [
    ...gapSignals.map(s => s.signal_value),
    ...missingMetricSignals.map(s => s.signal_value),
  ]

  return [...new Set(missing)]
}

/**
 * Get next best actions based on signals
 */
export async function getNextBestActions(userId: string, limit: number = 5): Promise<string[]> {
  const weaknesses = await getWeaknesses(userId, 10)
  const actions: string[] = []

  for (const weakness of weaknesses) {
    switch (weakness.signal_type) {
      case 'cv_gap':
        actions.push(`Mejorar CV: ${weakness.signal_value}`)
        break
      case 'interview_risk':
        actions.push(`Preparar respuesta para: ${weakness.signal_value}`)
        break
      case 'evidence_gap':
        actions.push(`Documentar evidencia de: ${weakness.signal_value}`)
        break
      case 'missing_metric':
        actions.push(`Agregar métrica: ${weakness.signal_value}`)
        break
      default:
        actions.push(`Trabajar en: ${weakness.signal_value}`)
    }

    if (actions.length >= limit) break
  }

  return actions
}
