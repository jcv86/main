/**
 * A4 Context Integration - A2 Day and A3 Module Context Builders
 * 
 * Provides knowledge context from A4 documents to A2 days and A3 modules.
 * This is the bridge that makes A4 the central knowledge layer.
 */

import { createClient } from '@/lib/supabase/client'
import type {
  DTCDocument,
  DTCRouteDocumentRequirement,
  A2DayKnowledgeContext,
  A3ModuleKnowledgeContext,
  CoachContext,
  LiveUserProfile,
} from './types'
import {
  getDocumentsByUser,
  getDocumentsByDay,
  getDocumentsByA3Module,
  getDocumentsByType,
  getRequiredDocumentsForDay,
  canCompleteDayDocuments,
} from './document-engine'
import { getLiveUserProfile, getLatestSnapshot } from './profile-snapshot'

// ============================================
// A2 DAY KNOWLEDGE CONTEXT
// ============================================

/**
 * Get complete knowledge context for an A2 day
 * This should be called before generating day content
 */
export async function getA2DayKnowledgeContext(
  userId: string,
  dayNumber: number
): Promise<A2DayKnowledgeContext> {
  const supabase = createClient()

  // Get required documents for this day
  const dayRequirements = await getRequiredDocumentsForDay(dayNumber)
  const requirements: DTCRouteDocumentRequirement[] = dayRequirements 
    ? dayRequirements.requiredDocuments.map(type => ({
        id: '',
        day_number: dayNumber,
        required_document_type: type as any,
        requirement_level: 'required' as const,
        min_count: 1,
        created_at: '',
      }))
    : []

  // Get previous artifacts (documents from earlier days)
  const previousArtifacts = await getPreviousArtifacts(userId, dayNumber)

  // Get user profile snapshot
  const profileSnapshot = await getLatestSnapshot(userId)

  // Get relevant context from C1, A1, C2
  const relevantContext = await getRelevantContext(userId)

  // Get previous coach feedback
  const previousFeedback = await getDocumentsByType(userId, 'coach_feedback')

  // Check for related A3 checkpoint
  const relatedA3 = getRelatedA3Module(dayNumber)

  // Calculate missing evidence
  const missingEvidence = await calculateMissingEvidence(userId, dayNumber)

  return {
    dayNumber,
    userId,
    requiredDocuments: requirements,
    previousArtifacts,
    userProfileSnapshot: profileSnapshot,
    missingEvidence,
    relevantContext,
    previousCoachFeedback: previousFeedback.slice(0, 5),
    relatedA3Checkpoint: relatedA3,
  }
}

/**
 * Get documents from previous days
 */
async function getPreviousArtifacts(
  userId: string,
  beforeDay: number
): Promise<DTCDocument[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .lt('related_day', beforeDay)
    .not('status', 'eq', 'archived')
    .order('related_day', { ascending: false })
    .limit(20)

  if (error) {
    console.error('[A4 Context] Error fetching previous artifacts:', error)
    return []
  }

  return (data || []) as DTCDocument[]
}

/**
 * Get relevant context from C1, A1, C2 modules
 */
async function getRelevantContext(userId: string): Promise<{
  c1: DTCDocument[]
  a1: DTCDocument[]
  c2: DTCDocument[]
}> {
  const [c1Docs, a1Docs, c2Docs] = await Promise.all([
    getDocumentsBySourceModule(userId, 'c1'),
    getDocumentsBySourceModule(userId, 'a1'),
    getDocumentsBySourceModule(userId, 'c2'),
  ])

  return {
    c1: c1Docs,
    a1: a1Docs,
    c2: c2Docs,
  }
}

/**
 * Get documents by source module
 */
async function getDocumentsBySourceModule(
  userId: string,
  sourceModule: string
): Promise<DTCDocument[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .eq('source_module', sourceModule)
    .not('status', 'eq', 'archived')
    .order('updated_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('[A4 Context] Error fetching module docs:', error)
    return []
  }

  return (data || []) as DTCDocument[]
}

/**
 * Map day numbers to related A3 modules
 */
function getRelatedA3Module(dayNumber: number): string | undefined {
  // Key checkpoints where A2 days connect to A3 modules
  const dayToA3Map: Record<number, string> = {
    10: 'module-1', // Checkpoint after first week+
    20: 'module-2',
    30: 'module-3',
    35: 'module-4', // Job analysis checkpoint
    45: 'module-5', // Interview prep
    50: 'module-6',
    60: 'module-7', // Mid-route
    70: 'module-8',
    80: 'module-9',
    90: 'module-10', // Final
  }

  return dayToA3Map[dayNumber]
}

/**
 * Calculate missing evidence areas for a day
 */
async function calculateMissingEvidence(
  userId: string,
  dayNumber: number
): Promise<string[]> {
  const { canComplete, missing } = await canCompleteDayDocuments(userId, dayNumber)
  
  if (canComplete) return []

  // Map document types to user-friendly descriptions
  const typeDescriptions: Record<string, string> = {
    route_contract: 'Contrato de ruta',
    identity_statement: 'Declaración de identidad',
    evidence_item: 'Evidencia profesional',
    cv_draft: 'Borrador de CV',
    star_answer: 'Respuesta STAR',
    job_analysis: 'Análisis de puesto',
    role_fit_matrix: 'Matriz de ajuste',
  }

  return missing.map(type => typeDescriptions[type] || type)
}

// ============================================
// A3 MODULE KNOWLEDGE CONTEXT
// ============================================

/**
 * Get complete knowledge context for an A3 module
 * This should be called before starting an A3 interview/training
 */
export async function getA3ModuleKnowledgeContext(
  userId: string,
  moduleId: string
): Promise<A3ModuleKnowledgeContext> {
  // Get documents by type for A3 context
  const [
    c1Docs,
    a1Docs,
    c2Docs,
    a2Docs,
    starAnswers,
    cvDrafts,
    jobAnalyses,
    previousA3,
    liveProfile,
  ] = await Promise.all([
    getDocumentsBySourceModule(userId, 'c1'),
    getDocumentsBySourceModule(userId, 'a1'),
    getDocumentsBySourceModule(userId, 'c2'),
    getRelevantA2Documents(userId, moduleId),
    getDocumentsByType(userId, 'star_answer'),
    getDocumentsByType(userId, 'cv_draft'),
    getDocumentsByType(userId, 'job_analysis'),
    getDocumentsByA3Module(userId, moduleId),
    getLiveUserProfile(userId),
  ])

  return {
    moduleId,
    userId,
    c1IdentityDocuments: c1Docs,
    a1ProfileDocuments: a1Docs,
    c2EvidenceDocuments: c2Docs,
    relevantA2Artifacts: a2Docs,
    starAnswerBank: starAnswers,
    cvDrafts,
    jobAnalyses,
    previousA3Attempts: previousA3,
    liveUserProfile: liveProfile,
  }
}

/**
 * Get relevant A2 documents for an A3 module
 */
async function getRelevantA2Documents(
  userId: string,
  moduleId: string
): Promise<DTCDocument[]> {
  const supabase = createClient()
  if (!supabase) return []

  // Get the day range that corresponds to this module
  const moduleNumber = parseInt(moduleId.replace('module-', '')) || 1
  const dayStart = (moduleNumber - 1) * 9 + 1
  const dayEnd = moduleNumber * 9

  const { data, error } = await supabase
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .eq('source_module', 'a2')
    .gte('related_day', dayStart)
    .lte('related_day', dayEnd)
    .not('status', 'eq', 'archived')
    .order('related_day', { ascending: true })

  if (error) {
    console.error('[A4 Context] Error fetching A2 docs for A3:', error)
    return []
  }

  return (data || []) as DTCDocument[]
}

// ============================================
// COACH CONTEXT
// ============================================

/**
 * Get context for AI coach interactions
 */
export async function getCoachContext(userId: string): Promise<CoachContext> {
  const [
    liveProfile,
    recentDocs,
    recentFeedback,
    coachingHistory,
  ] = await Promise.all([
    getLiveUserProfile(userId),
    getDocumentsByUser(userId, { limit: 10 }),
    getDocumentsByType(userId, 'coach_feedback'),
    getCoachingHistory(userId),
  ])

  // Determine current route day from recent documents
  const currentRouteDay = Math.max(
    ...recentDocs.map(d => d.related_day || 0),
    1
  )

  // Determine current A3 module if any
  const currentA3Module = getRelatedA3Module(currentRouteDay)

  // Calculate recommended focus areas
  const recommendedFocus = calculateRecommendedFocus(liveProfile)

  return {
    userId,
    userProfile: liveProfile,
    recentDocuments: recentDocs,
    recentFeedback: recentFeedback.slice(0, 5),
    currentRouteDay,
    currentA3Module,
    recommendedFocus,
    coachingHistory,
  }
}

/**
 * Get coaching history documents
 */
async function getCoachingHistory(userId: string): Promise<DTCDocument[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .in('type', ['coach_feedback', 'module_feedback', 'reflection'])
    .not('status', 'eq', 'archived')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('[A4 Context] Error fetching coaching history:', error)
    return []
  }

  return (data || []) as DTCDocument[]
}

/**
 * Calculate recommended focus areas based on profile
 */
function calculateRecommendedFocus(profile: LiveUserProfile | null): string[] {
  if (!profile) return ['Completar perfil inicial']

  const focus: string[] = []

  // Based on readiness scores
  if (profile.cvReadiness < 50) {
    focus.push('Mejorar CV - actualmente al ' + profile.cvReadiness + '%')
  }
  if (profile.interviewReadiness < 50) {
    focus.push('Preparación de entrevistas - al ' + profile.interviewReadiness + '%')
  }
  if (profile.evidenceQuality < 50) {
    focus.push('Fortalecer evidencia profesional')
  }

  // Based on missing proof
  if (profile.missingProof.length > 0) {
    focus.push('Documentar: ' + profile.missingProof[0])
  }

  // Based on interview risks
  if (profile.interviewRisks.length > 0) {
    focus.push('Preparar respuesta: ' + profile.interviewRisks[0])
  }

  // Default focus if all looks good
  if (focus.length === 0) {
    focus.push('Continuar con la ruta planificada')
  }

  return focus.slice(0, 5)
}

// ============================================
// CV CONTEXT
// ============================================

/**
 * Get context for CV generation/improvement
 */
export async function getCVContext(userId: string): Promise<{
  existingCVs: DTCDocument[]
  evidenceItems: DTCDocument[]
  starAnswers: DTCDocument[]
  profile: LiveUserProfile | null
  cvBullets: DTCDocument[]
}> {
  const [cvs, evidence, stars, profile, bullets] = await Promise.all([
    getDocumentsByType(userId, 'cv_draft'),
    getDocumentsByType(userId, 'evidence_item'),
    getDocumentsByType(userId, 'star_answer'),
    getLiveUserProfile(userId),
    getDocumentsByType(userId, 'cv_bullet'),
  ])

  return {
    existingCVs: cvs,
    evidenceItems: evidence,
    starAnswers: stars,
    profile,
    cvBullets: bullets,
  }
}

// ============================================
// INTERVIEW CONTEXT
// ============================================

/**
 * Get context for interview preparation
 */
export async function getInterviewContext(userId: string): Promise<{
  starAnswers: DTCDocument[]
  interviewTranscripts: DTCDocument[]
  jobAnalyses: DTCDocument[]
  profile: LiveUserProfile | null
  interviewAnswers: DTCDocument[]
  coachFeedback: DTCDocument[]
}> {
  const [stars, transcripts, jobs, profile, answers, feedback] = await Promise.all([
    getDocumentsByType(userId, 'star_answer'),
    getDocumentsByType(userId, 'interview_transcript'),
    getDocumentsByType(userId, 'job_analysis'),
    getLiveUserProfile(userId),
    getDocumentsByType(userId, 'interview_answer'),
    getDocumentsByType(userId, 'module_feedback'),
  ])

  return {
    starAnswers: stars,
    interviewTranscripts: transcripts,
    jobAnalyses: jobs,
    profile,
    interviewAnswers: answers,
    coachFeedback: feedback,
  }
}

// ============================================
// EXPORT COMBINED INDEX
// ============================================

export {
  getA2DayKnowledgeContext,
  getA3ModuleKnowledgeContext,
  getCoachContext,
  getCVContext,
  getInterviewContext,
}
