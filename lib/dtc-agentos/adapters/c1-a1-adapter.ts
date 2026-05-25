/**
 * DTC AgentOS - C1/A1 Adapter
 * 
 * Connects the DISC Assessment flow (C1) and Initial Analysis (A1)
 * to the AgentOS memory and context system.
 * 
 * C1: DISC Questionnaire capture
 * A1: DISC Profile Analysis and Insights Generation
 */

import { createClient } from '@/lib/supabase/server'
import { MemoryManager, MemoryType, MemorySource } from '../context/memory-manager'
import { DTCAgentOS } from '../index'

// ============================================================================
// TYPES
// ============================================================================

export interface DISCProfile {
  dominant: number
  influential: number
  steady: number
  conscientious: number
  primary_style: 'D' | 'I' | 'S' | 'C'
  secondary_style?: 'D' | 'I' | 'S' | 'C'
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

export class C1Adapter {
  private memoryManager: MemoryManager
  
  constructor(private userId: string) {
    this.memoryManager = new MemoryManager(userId)
  }
  
  /**
   * Process completed DISC questionnaire and extract memories
   */
  async processQuestionnaireCompletion(
    responses: Record<string, any>,
    calculatedProfile: DISCProfile
  ): Promise<void> {
    const supabase = await createClient()
    
    // Store the raw DISC scores as identity memory
    await this.memoryManager.saveMemory({
      type: MemoryType.IDENTITY,
      source: MemorySource.C1_DISC,
      key: 'disc_profile_scores',
      value: {
        D: calculatedProfile.dominant,
        I: calculatedProfile.influential,
        S: calculatedProfile.steady,
        C: calculatedProfile.conscientious,
        primary: calculatedProfile.primary_style,
        secondary: calculatedProfile.secondary_style
      },
      confidence: 1.0, // Direct measurement, highest confidence
      extractedFrom: 'C1 DISC Questionnaire'
    })
    
    // Store primary style as searchable memory
    await this.memoryManager.saveMemory({
      type: MemoryType.IDENTITY,
      source: MemorySource.C1_DISC,
      key: 'personality_primary_style',
      value: calculatedProfile.primary_style,
      confidence: 1.0,
      extractedFrom: 'C1 DISC Questionnaire'
    })
    
    // Store questionnaire completion as milestone
    await this.memoryManager.saveMemory({
      type: MemoryType.MILESTONE,
      source: MemorySource.C1_DISC,
      key: 'c1_disc_completed',
      value: {
        completed_at: new Date().toISOString(),
        questions_answered: Object.keys(responses).length,
        profile_calculated: true
      },
      confidence: 1.0,
      extractedFrom: 'C1 DISC Questionnaire'
    })
    
    // Log the command run
    await DTCAgentOS.logCommandRun({
      userId: this.userId,
      commandId: 'c1_disc_complete',
      input: { response_count: Object.keys(responses).length },
      output: { profile: calculatedProfile },
      memoriesCreated: 3
    })
  }
  
  /**
   * Get DISC style description for context building
   */
  static getStyleDescription(style: 'D' | 'I' | 'S' | 'C'): string {
    const descriptions = {
      D: 'Dominante - Directo, orientado a resultados, decisivo, competitivo',
      I: 'Influyente - Entusiasta, optimista, colaborador, expresivo',
      S: 'Estable - Paciente, confiable, orientado al equipo, buen oyente',
      C: 'Concienzudo - Analítico, preciso, sistemático, orientado a la calidad'
    }
    return descriptions[style]
  }
}

// ============================================================================
// A1 ADAPTER - DISC ANALYSIS AND INSIGHTS
// ============================================================================

export class A1Adapter {
  private memoryManager: MemoryManager
  
  constructor(private userId: string) {
    this.memoryManager = new MemoryManager(userId)
  }
  
  /**
   * Process A1 analysis results and extract memories
   */
  async processAnalysisResults(analysis: A1AnalysisResult): Promise<void> {
    // Store professional summary
    await this.memoryManager.saveMemory({
      type: MemoryType.IDENTITY,
      source: MemorySource.A1_INSIGHTS,
      key: 'professional_summary',
      value: analysis.professional_summary,
      confidence: 0.9,
      extractedFrom: 'A1 DISC Analysis'
    })
    
    // Store communication style
    await this.memoryManager.saveMemory({
      type: MemoryType.IDENTITY,
      source: MemorySource.A1_INSIGHTS,
      key: 'communication_style',
      value: analysis.communication_style,
      confidence: 0.9,
      extractedFrom: 'A1 DISC Analysis'
    })
    
    // Store each insight as a separate memory
    for (const insight of analysis.insights) {
      await this.memoryManager.saveMemory({
        type: insight.category === 'strength' ? MemoryType.STRENGTH : 
              insight.category === 'growth_area' ? MemoryType.GROWTH_AREA :
              MemoryType.INSIGHT,
        source: MemorySource.A1_INSIGHTS,
        key: `insight_${insight.category}_${insight.title.toLowerCase().replace(/\s+/g, '_')}`,
        value: {
          title: insight.title,
          description: insight.description,
          evidence: insight.evidence
        },
        confidence: 0.85,
        extractedFrom: 'A1 DISC Analysis'
      })
    }
    
    // Store work environment preferences
    await this.memoryManager.saveMemory({
      type: MemoryType.PREFERENCE,
      source: MemorySource.A1_INSIGHTS,
      key: 'work_environment_preferences',
      value: analysis.work_environment_preferences,
      confidence: 0.8,
      extractedFrom: 'A1 DISC Analysis'
    })
    
    // Store blind spots for coaching awareness
    await this.memoryManager.saveMemory({
      type: MemoryType.GROWTH_AREA,
      source: MemorySource.A1_INSIGHTS,
      key: 'potential_blind_spots',
      value: analysis.potential_blind_spots,
      confidence: 0.75,
      extractedFrom: 'A1 DISC Analysis'
    })
    
    // Store coaching recommendations for A3 modules
    await this.memoryManager.saveMemory({
      type: MemoryType.RECOMMENDATION,
      source: MemorySource.A1_INSIGHTS,
      key: 'coaching_recommendations',
      value: analysis.coaching_recommendations,
      confidence: 0.85,
      extractedFrom: 'A1 DISC Analysis'
    })
    
    // Mark A1 as complete
    await this.memoryManager.saveMemory({
      type: MemoryType.MILESTONE,
      source: MemorySource.A1_INSIGHTS,
      key: 'a1_analysis_completed',
      value: {
        completed_at: new Date().toISOString(),
        insights_generated: analysis.insights.length,
        recommendations_count: analysis.coaching_recommendations.length
      },
      confidence: 1.0,
      extractedFrom: 'A1 DISC Analysis'
    })
    
    // Log the agent run
    await DTCAgentOS.logAgentRun({
      userId: this.userId,
      agentId: 'a1_analyst',
      context: { profile: analysis.profile },
      response: { insights_count: analysis.insights.length },
      memoriesExtracted: analysis.insights.length + 5,
      tokensUsed: 0 // Will be populated by actual AI call
    })
  }
  
  /**
   * Check if A1 analysis is complete for a user
   */
  async isAnalysisComplete(): Promise<boolean> {
    const memories = await this.memoryManager.getMemoriesByType(MemoryType.MILESTONE)
    return memories.some(m => m.key === 'a1_analysis_completed')
  }
  
  /**
   * Get existing insights for context
   */
  async getExistingInsights(): Promise<DISCInsight[]> {
    const memories = await this.memoryManager.getMemoriesByType(MemoryType.INSIGHT)
    return memories
      .filter(m => m.key.startsWith('insight_'))
      .map(m => m.value as DISCInsight)
  }
}

// ============================================================================
// INTEGRATION HELPERS
// ============================================================================

/**
 * Hook to call after C1 DISC questionnaire is submitted
 */
export async function onC1Complete(
  userId: string,
  responses: Record<string, any>,
  profile: DISCProfile
): Promise<void> {
  const adapter = new C1Adapter(userId)
  await adapter.processQuestionnaireCompletion(responses, profile)
}

/**
 * Hook to call after A1 analysis is generated
 */
export async function onA1Complete(
  userId: string,
  analysis: A1AnalysisResult
): Promise<void> {
  const adapter = new A1Adapter(userId)
  await adapter.processAnalysisResults(analysis)
}

/**
 * Get DISC context for downstream agents
 */
export async function getDISCContext(userId: string): Promise<{
  profile: DISCProfile | null
  insights: DISCInsight[]
  summary: string | null
}> {
  const memoryManager = new MemoryManager(userId)
  
  const profileMemory = await memoryManager.getMemory('disc_profile_scores')
  const insightsMemories = await memoryManager.getMemoriesByType(MemoryType.INSIGHT)
  const summaryMemory = await memoryManager.getMemory('professional_summary')
  
  return {
    profile: profileMemory?.value as DISCProfile | null,
    insights: insightsMemories
      .filter(m => m.source === MemorySource.A1_INSIGHTS)
      .map(m => m.value as DISCInsight),
    summary: summaryMemory?.value as string | null
  }
}
