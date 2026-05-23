/**
 * A4 Profile Snapshot - Point-in-time Profile Intelligence
 * 
 * Creates comprehensive profile snapshots that combine all signals
 * to provide a complete view of the user at a specific point in their route.
 */

import { createClient } from '@/lib/supabase/client'
import type {
  DTCUserProfileSnapshot,
  LiveUserProfile,
} from './types'
import {
  getTopStrengths,
  getWeaknesses,
  getCareerGoals,
  getTargetRoles,
  getWorkStyle,
  getEvidenceQualityScore,
  getInterviewReadinessScore,
  getCVReadinessScore,
  getCoachStrategy,
  getMissingProofAreas,
  getNextBestActions,
} from './profile-signals'
import { getDocumentsByUser, getDocumentsByType } from './document-engine'

// ============================================
// LIVE USER PROFILE
// ============================================

/**
 * Get the complete live user profile combining all sources
 * This is the main function that A2, A3, and coach should use
 */
export async function getLiveUserProfile(userId: string): Promise<LiveUserProfile | null> {
  try {
    // Get all signals and computed scores
    const [
      strengths,
      weaknesses,
      careerGoals,
      targetRoles,
      workStyle,
      evidenceQuality,
      interviewReadiness,
      cvReadiness,
      coachStrategy,
      missingProof,
      nextActions,
    ] = await Promise.all([
      getTopStrengths(userId, 10),
      getWeaknesses(userId, 10),
      getCareerGoals(userId),
      getTargetRoles(userId),
      getWorkStyle(userId),
      getEvidenceQualityScore(userId),
      getInterviewReadinessScore(userId),
      getCVReadinessScore(userId),
      getCoachStrategy(userId),
      getMissingProofAreas(userId),
      getNextBestActions(userId, 5),
    ])

    // Get identity documents for professional identity
    const identityDocs = await getDocumentsByType(userId, 'identity_statement')
    const professionalIdentity = identityDocs[0]?.ai_summary || identityDocs[0]?.content?.substring(0, 200)

    // Calculate application readiness
    const applicationReadiness = Math.round(
      (evidenceQuality + interviewReadiness + cvReadiness) / 3
    )

    // Get current route focus from recent documents
    const recentDocs = await getDocumentsByUser(userId, { limit: 5 })
    const currentRouteFocus = determineRouteFocus(recentDocs)

    // Get interview risks
    const interviewRisks = weaknesses
      .filter(w => w.signal_type === 'interview_risk')
      .map(w => w.signal_value)

    return {
      userId,
      targetRole: targetRoles[0] || undefined,
      professionalIdentity: professionalIdentity || undefined,
      communicationStyle: workStyle.communicationStyle,
      workStyle: workStyle.styles.join(', ') || undefined,
      strengths: strengths.map(s => s.signal_value),
      weaknesses: weaknesses.map(w => w.signal_value),
      evidenceQuality,
      missingProof,
      interviewRisks,
      cvReadiness,
      interviewReadiness,
      applicationReadiness,
      recommendedCoachStrategy: coachStrategy,
      currentRouteFocus,
      nextBestActions: nextActions,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[A4 Snapshot] Error building live profile:', error)
    return null
  }
}

/**
 * Determine current route focus based on recent documents
 */
function determineRouteFocus(docs: { type: string; related_day?: number }[]): string {
  if (docs.length === 0) return 'getting_started'

  const recentTypes = docs.map(d => d.type)
  const maxDay = Math.max(...docs.map(d => d.related_day || 0))

  // Determine focus based on document types
  if (recentTypes.includes('cv_draft') || recentTypes.includes('cv_bullet')) {
    return 'cv_development'
  }
  if (recentTypes.includes('interview_answer') || recentTypes.includes('star_answer')) {
    return 'interview_preparation'
  }
  if (recentTypes.includes('job_analysis') || recentTypes.includes('company_research')) {
    return 'job_targeting'
  }
  if (recentTypes.includes('evidence_item')) {
    return 'evidence_building'
  }

  // Default based on day
  if (maxDay < 10) return 'identity_foundation'
  if (maxDay < 30) return 'evidence_building'
  if (maxDay < 60) return 'application_preparation'
  return 'final_execution'
}

// ============================================
// PROFILE SNAPSHOTS
// ============================================

/**
 * Create a new profile snapshot for a specific route day
 */
export async function createProfileSnapshot(
  userId: string,
  routeDay: number
): Promise<DTCUserProfileSnapshot | null> {
  const supabase = createClient()
  if (!supabase) return null

  // Get live profile
  const liveProfile = await getLiveUserProfile(userId)
  if (!liveProfile) return null

  // Build snapshot
  const snapshotData = {
    user_id: userId,
    route_day: routeDay,
    snapshot_json: liveProfile,
    profile_summary: buildProfileSummary(liveProfile),
    strengths_summary: liveProfile.strengths.slice(0, 5).join(', '),
    weaknesses_summary: liveProfile.weaknesses.slice(0, 5).join(', '),
    evidence_summary: `Calidad de evidencia: ${liveProfile.evidenceQuality}%. Áreas faltantes: ${liveProfile.missingProof.length}`,
    interview_readiness_score: liveProfile.interviewReadiness,
    cv_readiness_score: liveProfile.cvReadiness,
    application_readiness_score: liveProfile.applicationReadiness,
  }

  const { data, error } = await supabase
    .from('dtc_user_profile_snapshots')
    .insert(snapshotData)
    .select()
    .single()

  if (error) {
    console.error('[A4 Snapshot] Error creating snapshot:', error)
    return null
  }

  return data as DTCUserProfileSnapshot
}

/**
 * Build a text summary of the profile
 */
function buildProfileSummary(profile: LiveUserProfile): string {
  const parts: string[] = []

  if (profile.targetRole) {
    parts.push(`Objetivo: ${profile.targetRole}`)
  }

  if (profile.professionalIdentity) {
    parts.push(`Identidad: ${profile.professionalIdentity.substring(0, 100)}...`)
  }

  parts.push(`Fortalezas: ${profile.strengths.length} identificadas`)
  parts.push(`Preparación: CV ${profile.cvReadiness}%, Entrevista ${profile.interviewReadiness}%`)

  if (profile.currentRouteFocus) {
    parts.push(`Foco actual: ${profile.currentRouteFocus}`)
  }

  return parts.join('. ')
}

/**
 * Get the latest profile snapshot for a user
 */
export async function getLatestSnapshot(
  userId: string
): Promise<DTCUserProfileSnapshot | null> {
  const supabase = createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('dtc_user_profile_snapshots')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    // No snapshot found is not an error
    if (error.code === 'PGRST116') return null
    console.error('[A4 Snapshot] Error fetching snapshot:', error)
    return null
  }

  return data as DTCUserProfileSnapshot
}

/**
 * Get snapshot for a specific route day
 */
export async function getSnapshotByDay(
  userId: string,
  routeDay: number
): Promise<DTCUserProfileSnapshot | null> {
  const supabase = createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('dtc_user_profile_snapshots')
    .select('*')
    .eq('user_id', userId)
    .eq('route_day', routeDay)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('[A4 Snapshot] Error fetching snapshot:', error)
    return null
  }

  return data as DTCUserProfileSnapshot
}

/**
 * Get all snapshots for a user (for progress tracking)
 */
export async function getUserSnapshots(
  userId: string
): Promise<DTCUserProfileSnapshot[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('dtc_user_profile_snapshots')
    .select('*')
    .eq('user_id', userId)
    .order('route_day', { ascending: true })

  if (error) {
    console.error('[A4 Snapshot] Error fetching snapshots:', error)
    return []
  }

  return (data || []) as DTCUserProfileSnapshot[]
}

/**
 * Calculate progress between two snapshots
 */
export function calculateSnapshotProgress(
  earlier: DTCUserProfileSnapshot,
  later: DTCUserProfileSnapshot
): {
  cvReadinessChange: number
  interviewReadinessChange: number
  applicationReadinessChange: number
  daysElapsed: number
} {
  return {
    cvReadinessChange: later.cv_readiness_score - earlier.cv_readiness_score,
    interviewReadinessChange: later.interview_readiness_score - earlier.interview_readiness_score,
    applicationReadinessChange: later.application_readiness_score - earlier.application_readiness_score,
    daysElapsed: later.route_day - earlier.route_day,
  }
}

/**
 * Get user progress over time
 */
export async function getUserProgressOverTime(userId: string): Promise<{
  snapshots: DTCUserProfileSnapshot[]
  overallProgress: {
    cvReadinessChange: number
    interviewReadinessChange: number
    applicationReadinessChange: number
    totalDays: number
  } | null
}> {
  const snapshots = await getUserSnapshots(userId)

  if (snapshots.length < 2) {
    return {
      snapshots,
      overallProgress: null,
    }
  }

  const first = snapshots[0]
  const last = snapshots[snapshots.length - 1]

  return {
    snapshots,
    overallProgress: calculateSnapshotProgress(first, last),
  }
}

// ============================================
// AUTOMATIC SNAPSHOT TRIGGERS
// ============================================

/**
 * Check if a new snapshot should be created
 * Called periodically or after significant document updates
 */
export async function shouldCreateSnapshot(
  userId: string,
  currentDay: number
): Promise<boolean> {
  const latestSnapshot = await getLatestSnapshot(userId)

  // No snapshot exists - create one
  if (!latestSnapshot) return true

  // Create snapshot every 5 days at minimum
  if (currentDay - latestSnapshot.route_day >= 5) return true

  // Create at key milestones
  const milestones = [1, 10, 20, 30, 45, 60, 75, 90]
  if (milestones.includes(currentDay) && latestSnapshot.route_day !== currentDay) {
    return true
  }

  return false
}

/**
 * Rebuild user profile snapshot (used after significant changes)
 */
export async function rebuildUserProfileSnapshot(
  userId: string,
  currentDay: number
): Promise<DTCUserProfileSnapshot | null> {
  const shouldCreate = await shouldCreateSnapshot(userId, currentDay)

  if (shouldCreate) {
    return await createProfileSnapshot(userId, currentDay)
  }

  return await getLatestSnapshot(userId)
}
