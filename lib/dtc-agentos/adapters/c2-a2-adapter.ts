/**
 * DTC AgentOS - C2/A2 Adapter
 * 
 * Connects the Professional Profile capture (C2) and Portal Analysis (A2)
 * to the AgentOS memory and context system.
 * 
 * C2: Professional information capture (experience, goals, skills)
 * A2: Comprehensive professional analysis and readiness assessment
 */

import { createClient } from '@/lib/supabase/server'
import { MemoryManager, MemoryType, MemorySource } from '../context/memory-manager'
import { DTCAgentOS } from '../index'

// ============================================================================
// TYPES
// ============================================================================

export interface ProfessionalProfile {
  current_role?: string
  years_experience?: number
  industry?: string
  target_roles?: string[]
  skills?: string[]
  achievements?: string[]
  education?: {
    degree: string
    institution: string
    year?: number
  }[]
  certifications?: string[]
  languages?: { language: string; level: string }[]
}

export interface CareerGoals {
  short_term: string[] // 0-6 months
  medium_term: string[] // 6-18 months
  long_term: string[] // 18+ months
  salary_expectations?: {
    current?: number
    target?: number
    currency?: string
  }
  preferred_industries?: string[]
  location_preferences?: string[]
  work_style?: 'remote' | 'hybrid' | 'onsite' | 'flexible'
}

export interface A2AnalysisResult {
  readiness_score: number // 0-100
  readiness_level: 'not_ready' | 'developing' | 'ready' | 'highly_ready'
  strengths_identified: {
    area: string
    evidence: string
    confidence: number
  }[]
  gaps_identified: {
    area: string
    impact: 'high' | 'medium' | 'low'
    recommendation: string
  }[]
  market_alignment: {
    role_fit: number // 0-100
    skill_match: number // 0-100
    experience_match: number // 0-100
  }
  personalized_roadmap: {
    phase: string
    focus_areas: string[]
    recommended_modules: string[]
    estimated_duration: string
  }[]
  interview_readiness: {
    technical: number
    behavioral: number
    communication: number
    overall: number
  }
}

// ============================================================================
// C2 ADAPTER - PROFESSIONAL PROFILE CAPTURE
// ============================================================================

export class C2Adapter {
  private memoryManager: MemoryManager
  
  constructor(private userId: string) {
    this.memoryManager = new MemoryManager(userId)
  }
  
  /**
   * Process professional profile submission
   */
  async processProfileSubmission(profile: ProfessionalProfile): Promise<void> {
    // Store current role
    if (profile.current_role) {
      await this.memoryManager.saveMemory({
        type: MemoryType.IDENTITY,
        source: MemorySource.C2_PROFILE,
        key: 'current_role',
        value: profile.current_role,
        confidence: 1.0,
        extractedFrom: 'C2 Professional Profile'
      })
    }
    
    // Store years of experience
    if (profile.years_experience !== undefined) {
      await this.memoryManager.saveMemory({
        type: MemoryType.IDENTITY,
        source: MemorySource.C2_PROFILE,
        key: 'years_experience',
        value: profile.years_experience,
        confidence: 1.0,
        extractedFrom: 'C2 Professional Profile'
      })
    }
    
    // Store industry
    if (profile.industry) {
      await this.memoryManager.saveMemory({
        type: MemoryType.IDENTITY,
        source: MemorySource.C2_PROFILE,
        key: 'industry',
        value: profile.industry,
        confidence: 1.0,
        extractedFrom: 'C2 Professional Profile'
      })
    }
    
    // Store target roles as goals
    if (profile.target_roles?.length) {
      await this.memoryManager.saveMemory({
        type: MemoryType.GOAL,
        source: MemorySource.C2_PROFILE,
        key: 'target_roles',
        value: profile.target_roles,
        confidence: 1.0,
        extractedFrom: 'C2 Professional Profile'
      })
    }
    
    // Store skills
    if (profile.skills?.length) {
      await this.memoryManager.saveMemory({
        type: MemoryType.SKILL,
        source: MemorySource.C2_PROFILE,
        key: 'declared_skills',
        value: profile.skills,
        confidence: 0.9, // Self-reported
        extractedFrom: 'C2 Professional Profile'
      })
    }
    
    // Store achievements as evidence
    if (profile.achievements?.length) {
      for (let i = 0; i < profile.achievements.length; i++) {
        await this.memoryManager.saveMemory({
          type: MemoryType.ACHIEVEMENT,
          source: MemorySource.C2_PROFILE,
          key: `achievement_${i + 1}`,
          value: profile.achievements[i],
          confidence: 0.95,
          extractedFrom: 'C2 Professional Profile'
        })
      }
    }
    
    // Store education
    if (profile.education?.length) {
      await this.memoryManager.saveMemory({
        type: MemoryType.IDENTITY,
        source: MemorySource.C2_PROFILE,
        key: 'education_history',
        value: profile.education,
        confidence: 1.0,
        extractedFrom: 'C2 Professional Profile'
      })
    }
    
    // Store certifications
    if (profile.certifications?.length) {
      await this.memoryManager.saveMemory({
        type: MemoryType.SKILL,
        source: MemorySource.C2_PROFILE,
        key: 'certifications',
        value: profile.certifications,
        confidence: 1.0,
        extractedFrom: 'C2 Professional Profile'
      })
    }
    
    // Store languages
    if (profile.languages?.length) {
      await this.memoryManager.saveMemory({
        type: MemoryType.SKILL,
        source: MemorySource.C2_PROFILE,
        key: 'languages',
        value: profile.languages,
        confidence: 0.9,
        extractedFrom: 'C2 Professional Profile'
      })
    }
    
    // Mark C2 as complete
    await this.memoryManager.saveMemory({
      type: MemoryType.MILESTONE,
      source: MemorySource.C2_PROFILE,
      key: 'c2_profile_completed',
      value: {
        completed_at: new Date().toISOString(),
        fields_provided: Object.keys(profile).filter(k => profile[k as keyof ProfessionalProfile])
      },
      confidence: 1.0,
      extractedFrom: 'C2 Professional Profile'
    })
    
    // Log command run
    await DTCAgentOS.logCommandRun({
      userId: this.userId,
      commandId: 'c2_profile_complete',
      input: { fields_count: Object.keys(profile).length },
      output: { profile_saved: true },
      memoriesCreated: Object.keys(profile).filter(k => profile[k as keyof ProfessionalProfile]).length + 1
    })
  }
  
  /**
   * Process career goals submission
   */
  async processCareerGoals(goals: CareerGoals): Promise<void> {
    // Store short-term goals
    if (goals.short_term?.length) {
      await this.memoryManager.saveMemory({
        type: MemoryType.GOAL,
        source: MemorySource.C2_PROFILE,
        key: 'goals_short_term',
        value: goals.short_term,
        confidence: 1.0,
        extractedFrom: 'C2 Career Goals'
      })
    }
    
    // Store medium-term goals
    if (goals.medium_term?.length) {
      await this.memoryManager.saveMemory({
        type: MemoryType.GOAL,
        source: MemorySource.C2_PROFILE,
        key: 'goals_medium_term',
        value: goals.medium_term,
        confidence: 1.0,
        extractedFrom: 'C2 Career Goals'
      })
    }
    
    // Store long-term goals
    if (goals.long_term?.length) {
      await this.memoryManager.saveMemory({
        type: MemoryType.GOAL,
        source: MemorySource.C2_PROFILE,
        key: 'goals_long_term',
        value: goals.long_term,
        confidence: 1.0,
        extractedFrom: 'C2 Career Goals'
      })
    }
    
    // Store salary expectations
    if (goals.salary_expectations) {
      await this.memoryManager.saveMemory({
        type: MemoryType.PREFERENCE,
        source: MemorySource.C2_PROFILE,
        key: 'salary_expectations',
        value: goals.salary_expectations,
        confidence: 1.0,
        extractedFrom: 'C2 Career Goals'
      })
    }
    
    // Store work style preference
    if (goals.work_style) {
      await this.memoryManager.saveMemory({
        type: MemoryType.PREFERENCE,
        source: MemorySource.C2_PROFILE,
        key: 'work_style_preference',
        value: goals.work_style,
        confidence: 1.0,
        extractedFrom: 'C2 Career Goals'
      })
    }
    
    // Store location preferences
    if (goals.location_preferences?.length) {
      await this.memoryManager.saveMemory({
        type: MemoryType.PREFERENCE,
        source: MemorySource.C2_PROFILE,
        key: 'location_preferences',
        value: goals.location_preferences,
        confidence: 1.0,
        extractedFrom: 'C2 Career Goals'
      })
    }
  }
}

// ============================================================================
// A2 ADAPTER - PROFESSIONAL ANALYSIS
// ============================================================================

export class A2Adapter {
  private memoryManager: MemoryManager
  
  constructor(private userId: string) {
    this.memoryManager = new MemoryManager(userId)
  }
  
  /**
   * Process A2 analysis results
   */
  async processAnalysisResults(analysis: A2AnalysisResult): Promise<void> {
    // Store readiness score
    await this.memoryManager.saveMemory({
      type: MemoryType.METRIC,
      source: MemorySource.A2_ANALYSIS,
      key: 'readiness_score',
      value: {
        score: analysis.readiness_score,
        level: analysis.readiness_level,
        calculated_at: new Date().toISOString()
      },
      confidence: 0.9,
      extractedFrom: 'A2 Professional Analysis'
    })
    
    // Store identified strengths
    for (const strength of analysis.strengths_identified) {
      await this.memoryManager.saveMemory({
        type: MemoryType.STRENGTH,
        source: MemorySource.A2_ANALYSIS,
        key: `strength_${strength.area.toLowerCase().replace(/\s+/g, '_')}`,
        value: {
          area: strength.area,
          evidence: strength.evidence
        },
        confidence: strength.confidence,
        extractedFrom: 'A2 Professional Analysis'
      })
    }
    
    // Store identified gaps
    for (const gap of analysis.gaps_identified) {
      await this.memoryManager.saveMemory({
        type: MemoryType.GROWTH_AREA,
        source: MemorySource.A2_ANALYSIS,
        key: `gap_${gap.area.toLowerCase().replace(/\s+/g, '_')}`,
        value: {
          area: gap.area,
          impact: gap.impact,
          recommendation: gap.recommendation
        },
        confidence: 0.85,
        extractedFrom: 'A2 Professional Analysis'
      })
    }
    
    // Store market alignment scores
    await this.memoryManager.saveMemory({
      type: MemoryType.METRIC,
      source: MemorySource.A2_ANALYSIS,
      key: 'market_alignment',
      value: analysis.market_alignment,
      confidence: 0.8,
      extractedFrom: 'A2 Professional Analysis'
    })
    
    // Store interview readiness breakdown
    await this.memoryManager.saveMemory({
      type: MemoryType.METRIC,
      source: MemorySource.A2_ANALYSIS,
      key: 'interview_readiness',
      value: analysis.interview_readiness,
      confidence: 0.85,
      extractedFrom: 'A2 Professional Analysis'
    })
    
    // Store personalized roadmap
    await this.memoryManager.saveMemory({
      type: MemoryType.RECOMMENDATION,
      source: MemorySource.A2_ANALYSIS,
      key: 'personalized_roadmap',
      value: analysis.personalized_roadmap,
      confidence: 0.9,
      extractedFrom: 'A2 Professional Analysis'
    })
    
    // Store recommended modules for A3
    const allRecommendedModules = analysis.personalized_roadmap
      .flatMap(phase => phase.recommended_modules)
      .filter((v, i, a) => a.indexOf(v) === i) // Unique
    
    await this.memoryManager.saveMemory({
      type: MemoryType.RECOMMENDATION,
      source: MemorySource.A2_ANALYSIS,
      key: 'recommended_a3_modules',
      value: allRecommendedModules,
      confidence: 0.9,
      extractedFrom: 'A2 Professional Analysis'
    })
    
    // Mark A2 as complete
    await this.memoryManager.saveMemory({
      type: MemoryType.MILESTONE,
      source: MemorySource.A2_ANALYSIS,
      key: 'a2_analysis_completed',
      value: {
        completed_at: new Date().toISOString(),
        readiness_score: analysis.readiness_score,
        strengths_count: analysis.strengths_identified.length,
        gaps_count: analysis.gaps_identified.length
      },
      confidence: 1.0,
      extractedFrom: 'A2 Professional Analysis'
    })
    
    // Log agent run
    await DTCAgentOS.logAgentRun({
      userId: this.userId,
      agentId: 'a2_analyst',
      context: { readiness_level: analysis.readiness_level },
      response: { 
        score: analysis.readiness_score,
        strengths: analysis.strengths_identified.length,
        gaps: analysis.gaps_identified.length
      },
      memoriesExtracted: analysis.strengths_identified.length + analysis.gaps_identified.length + 6,
      tokensUsed: 0
    })
  }
  
  /**
   * Get current readiness score
   */
  async getReadinessScore(): Promise<number | null> {
    const memory = await this.memoryManager.getMemory('readiness_score')
    return memory?.value?.score ?? null
  }
  
  /**
   * Get recommended modules for A3
   */
  async getRecommendedModules(): Promise<string[]> {
    const memory = await this.memoryManager.getMemory('recommended_a3_modules')
    return (memory?.value as string[]) ?? []
  }
}

// ============================================================================
// INTEGRATION HELPERS
// ============================================================================

/**
 * Hook to call after C2 professional profile is submitted
 */
export async function onC2ProfileComplete(
  userId: string,
  profile: ProfessionalProfile
): Promise<void> {
  const adapter = new C2Adapter(userId)
  await adapter.processProfileSubmission(profile)
}

/**
 * Hook to call after C2 career goals are submitted
 */
export async function onC2GoalsComplete(
  userId: string,
  goals: CareerGoals
): Promise<void> {
  const adapter = new C2Adapter(userId)
  await adapter.processCareerGoals(goals)
}

/**
 * Hook to call after A2 analysis is generated
 */
export async function onA2Complete(
  userId: string,
  analysis: A2AnalysisResult
): Promise<void> {
  const adapter = new A2Adapter(userId)
  await adapter.processAnalysisResults(analysis)
}

/**
 * Get professional context for downstream agents
 */
export async function getProfessionalContext(userId: string): Promise<{
  profile: Partial<ProfessionalProfile>
  readinessScore: number | null
  strengths: string[]
  gaps: string[]
  recommendedModules: string[]
}> {
  const memoryManager = new MemoryManager(userId)
  
  const roleMemory = await memoryManager.getMemory('current_role')
  const experienceMemory = await memoryManager.getMemory('years_experience')
  const industryMemory = await memoryManager.getMemory('industry')
  const targetRolesMemory = await memoryManager.getMemory('target_roles')
  const skillsMemory = await memoryManager.getMemory('declared_skills')
  const readinessMemory = await memoryManager.getMemory('readiness_score')
  
  const strengthMemories = await memoryManager.getMemoriesByType(MemoryType.STRENGTH)
  const gapMemories = await memoryManager.getMemoriesByType(MemoryType.GROWTH_AREA)
  const modulesMemory = await memoryManager.getMemory('recommended_a3_modules')
  
  return {
    profile: {
      current_role: roleMemory?.value as string,
      years_experience: experienceMemory?.value as number,
      industry: industryMemory?.value as string,
      target_roles: targetRolesMemory?.value as string[],
      skills: skillsMemory?.value as string[]
    },
    readinessScore: readinessMemory?.value?.score ?? null,
    strengths: strengthMemories
      .filter(m => m.source === MemorySource.A2_ANALYSIS)
      .map(m => m.value.area),
    gaps: gapMemories
      .filter(m => m.source === MemorySource.A2_ANALYSIS)
      .map(m => m.value.area),
    recommendedModules: (modulesMemory?.value as string[]) ?? []
  }
}
