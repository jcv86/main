/**
 * DTC AgentOS - C2/A2 Adapter
 * 
 * Connects the Professional Profile flow (C2) and Preparedness Analysis (A2)
 * to the AgentOS memory and context system.
 */

import { DTCAgentOS } from '../index'

// ============================================================================
// TYPES
// ============================================================================

export type ProfessionalProfile = any
export type CareerGoals = any
export type A2AnalysisResult = any

// ============================================================================
// C2 ADAPTER - PROFESSIONAL PROFILE COMPLETION
// ============================================================================

/**
 * Hook to call after C2 Professional Profile is submitted
 */
export async function onC2ProfileComplete(
  userId: string,
  profile: ProfessionalProfile
): Promise<void> {
  await DTCAgentOS.logCommandRun({
    userId,
    commandId: 'c2_profile_complete',
    input: { profile_type: 'professional' },
    output: { profile },
    memoriesCreated: 1
  })
}

/**
 * Hook to call after C2 Career Goals are submitted
 */
export async function onC2GoalsComplete(
  userId: string,
  goals: CareerGoals
): Promise<void> {
  await DTCAgentOS.logCommandRun({
    userId,
    commandId: 'c2_goals_complete',
    input: { goals_type: 'career' },
    output: { goals },
    memoriesCreated: 1
  })
}

// ============================================================================
// A2 ADAPTER - PREPAREDNESS ANALYSIS
// ============================================================================

/**
 * Hook to call after A2 preparedness analysis is generated
 */
export async function onA2Complete(
  userId: string,
  analysis: A2AnalysisResult
): Promise<void> {
  const readinessScore = analysis.readinessScore || analysis.readiness_score || 0
  
  await DTCAgentOS.logAgentRun({
    userId,
    agentId: 'a2_analyst',
    context: { profile: analysis.profile, goals: analysis.goals },
    response: { readiness_score: readinessScore },
    memoriesExtracted: 1,
    tokensUsed: 0
  })
}
