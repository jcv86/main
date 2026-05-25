/**
 * DTC AgentOS - C1/A1 Adapter
 * 
 * Connects the DISC Assessment flow (C1) and Initial Analysis (A1)
 * to the AgentOS memory and context system.
 */

import { DTCAgentOS } from '../index'

// ============================================================================
// TYPES
// ============================================================================

export type DISCProfile = any
export type DISCInsight = any
export type A1AnalysisResult = any

// ============================================================================
// ADAPTER FUNCTIONS
// ============================================================================

/**
 * Hook to call after C1 DISC questionnaire is submitted
 */
export async function onC1Complete(
  userId: string,
  responses: Record<string, any>,
  profile: DISCProfile
): Promise<void> {
  await DTCAgentOS.logCommandRun({
    userId,
    commandId: 'c1_disc_complete',
    input: { response_count: Object.keys(responses).length },
    output: { profile },
    memoriesCreated: 3
  })
}

/**
 * Hook to call after A1 analysis is generated
 */
export async function onA1Complete(
  userId: string,
  analysis: A1AnalysisResult
): Promise<void> {
  await DTCAgentOS.logAgentRun({
    userId,
    agentId: 'a1_analyst',
    context: { profile: analysis.profile },
    response: { insights_count: analysis.insights?.length || 0 },
    memoriesExtracted: (analysis.insights?.length || 0) + 5,
    tokensUsed: 0
  })
}
