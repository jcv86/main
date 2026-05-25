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
// C1 ADAPTER - DISC QUESTIONNAIRE COMPLETION
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

// ============================================================================
// A1 ADAPTER - DISC ANALYSIS AND INSIGHTS
// ============================================================================

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

export interface DISCInsight {
  category: 'strength' | 'challenge' | 'communication' | 'work_style' | 'growth_area'
  title: string
  description: string
  evidence?: string
}

export interface A1AnalysisResult {
  profile: DISCProfile
  insights: DISCInsight[]
  professional_summary: string
  communication_style: string
  work_environment_preferences: string[]
  potential_blind_spots: string[]
  coaching_recommendations: string[]
}

// ============================================================================
// C1 ADAPTER - DISC QUESTIONNAIRE COMPLETION
// ============================================================================

/**
 * Hook to call after C1 DISC questionnaire is submitted
 */
export async function onC1Complete(
  userId: string,
  responses: Record<string, any>,
  profile: DISCProfile
): Promise<void> {
  const memories: CaptureMemoryPayload[] = [
    {
      type: 'identity',
      source: 'c1',
      key: 'disc_profile_scores',
      value: {
        D: profile.dominant,
        I: profile.influential,
        S: profile.steady,
        C: profile.conscientious,
        primary: profile.primary_style,
        secondary: profile.secondary_style
      },
      confidence: 1.0,
      extractedFrom: 'C1 DISC Questionnaire'
    },
    {
      type: 'communication_style',
      source: 'c1',
      key: 'disc_primary_style',
      value: profile.primary_style,
      confidence: 1.0,
      extractedFrom: 'C1 DISC Questionnaire'
    },
    {
      type: 'milestone',
      source: 'c1',
      key: 'c1_disc_completed',
      value: {
        completed_at: new Date().toISOString(),
        questions_answered: Object.keys(responses).length
      },
      confidence: 1.0,
      extractedFrom: 'C1 DISC Questionnaire'
    }
  ]
  
  await captureMemories(userId, memories)
  
  await DTCAgentOS.logCommandRun({
    userId,
    commandId: 'c1_disc_complete',
    input: { response_count: Object.keys(responses).length },
    output: { profile },
    memoriesCreated: 3
  })
}

// ============================================================================
// A1 ADAPTER - DISC ANALYSIS AND INSIGHTS
// ============================================================================

/**
 * Hook to call after A1 analysis is generated
 */
export async function onA1Complete(
  userId: string,
  analysis: A1AnalysisResult
): Promise<void> {
  const memories: CaptureMemoryPayload[] = [
    {
      type: 'identity',
      source: 'a1',
      key: 'professional_summary',
      value: analysis.professional_summary,
      confidence: 0.9,
      extractedFrom: 'A1 DISC Analysis'
    },
    {
      type: 'communication_style',
      source: 'a1',
      key: 'communication_style_detail',
      value: analysis.communication_style,
      confidence: 0.9,
      extractedFrom: 'A1 DISC Analysis'
    },
    {
      type: 'preference',
      source: 'a1',
      key: 'work_environment_preferences',
      value: analysis.work_environment_preferences,
      confidence: 0.8,
      extractedFrom: 'A1 DISC Analysis'
    },
    {
      type: 'weakness',
      source: 'a1',
      key: 'potential_blind_spots',
      value: analysis.potential_blind_spots,
      confidence: 0.75,
      extractedFrom: 'A1 DISC Analysis'
    },
    {
      type: 'recommendation',
      source: 'a1',
      key: 'coaching_recommendations',
      value: analysis.coaching_recommendations,
      confidence: 0.85,
      extractedFrom: 'A1 DISC Analysis'
    },
    {
      type: 'milestone',
      source: 'a1',
      key: 'a1_analysis_completed',
      value: {
        completed_at: new Date().toISOString(),
        insights_generated: analysis.insights.length
      },
      confidence: 1.0,
      extractedFrom: 'A1 DISC Analysis'
    }
  ]
  
  // Add individual insights
  for (const insight of analysis.insights) {
    memories.push({
      type: insight.category === 'strength' ? 'strength' : 'growth_area',
      source: 'a1',
      key: `insight_${insight.category}_${insight.title.toLowerCase().replace(/\s+/g, '_')}`,
      value: {
        title: insight.title,
        description: insight.description,
        evidence: insight.evidence
      },
      confidence: 0.85,
      extractedFrom: 'A1 DISC Analysis'
    } as CaptureMemoryPayload)
  }
  
  await captureMemories(userId, memories)
  
  await DTCAgentOS.logAgentRun({
    userId,
    agentId: 'a1_analyst',
    context: { profile: analysis.profile },
    response: { insights_count: analysis.insights.length },
    memoriesExtracted: memories.length,
    tokensUsed: 0
  })
}
