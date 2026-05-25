/**
 * DTC AgentOS - Main Entry Point
 * 
 * Exports all registries, types, and utilities for the DTC AgentOS system.
 */

// =============================================================================
// TYPES
// =============================================================================
export type {
  // Memory types
  MemorySourceType,
  MemoryItemType,
  MemoryItem,
  CaptureMemoryPayload,
  
  // Command types
  CommandId,
  ContextKey,
  WritesTo,
  CommandConfig,
  CommandInput,
  CommandResult,
  
  // Agent types
  AgentId,
  EvaluationFocus,
  AgentUseCase,
  AgentConfig,
  
  // Mode types
  ModeId,
  ModeAction,
  ModeConfig,
  
  // Context types
  UserProfile,
  ModuleState,
  DayProgress,
  DocumentRef,
  InterviewSummary,
  UnlockState,
  DTCContext,
  
  // Evaluation types
  RubricCriterion,
  ModuleRubric,
  EvaluationScore,
  Evaluation,
  
  // Unlock types
  UnlockConditionType,
  UnlockCondition,
  UnlockRule,
  UnlockResult,
  
  // Dev mode types
  DevModeAction,
  DevModeResponse,
  
  // API types
  AgentRunLog,
  MissingContextError,
} from './types'

// =============================================================================
// REGISTRIES
// =============================================================================
export {
  dtcCommands,
  getCommand,
  getCommandsForAgent,
  getCommandsForMode,
  validateCommandExecution,
  getRequiredContext,
  getAllContext,
} from './registries/commands'

export {
  dtcAgents,
  getAgent,
  getAgentsForUseCase,
  getA3Agent,
  buildAgentPrompt,
} from './registries/agents'

export {
  dtcModes,
  getMode,
  isActionAllowed,
  getA3Mode,
  buildModeBehavior,
} from './registries/modes'

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Module IDs that use coaching mode (modules 1-6)
 */
export const COACHING_MODULES = [
  'auditoria-inicial',
  'metodo-star',
  'cv-inteligente',
  'analisis-vacante',
  'analisis-multimodal',
  'entrenamiento-guiado',
] as const

/**
 * Module IDs that use interview simulation (modules 7-10)
 */
export const INTERVIEW_MODULES = [
  'entrenamiento-estructurado',
  'simulacion-real',
  'sala-practica',
  'evaluacion-final',
] as const

/**
 * All module IDs in order
 */
export const ALL_MODULES = [
  ...COACHING_MODULES,
  ...INTERVIEW_MODULES,
] as const

/**
 * Interview levels
 */
export const INTERVIEW_LEVELS = ['basic', 'advanced', 'pro'] as const
export type InterviewLevel = typeof INTERVIEW_LEVELS[number]

/**
 * Memory types that should be captured from each stage
 */
export const STAGE_MEMORY_TYPES = {
  c1: ['career_goal', 'motivation', 'constraint', 'learning_preference'],
  a1: ['strength', 'weakness', 'communication_style', 'interview_pattern'],
  c2: ['role_target', 'market_region', 'company_preference'],
  a2: ['evidence', 'feedback_received'],
  a3: ['interview_pattern', 'feedback_received', 'achievement'],
  a4: ['star_story', 'evidence', 'achievement'],
} as const

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Determine if a module ID is a coaching module
 */
export function isCoachingModule(moduleId: string): boolean {
  return COACHING_MODULES.includes(moduleId as typeof COACHING_MODULES[number])
}

/**
 * Determine if a module ID is an interview module
 */
export function isInterviewModule(moduleId: string): boolean {
  return INTERVIEW_MODULES.includes(moduleId as typeof INTERVIEW_MODULES[number])
}

/**
 * Get module number from ID (1-10)
 */
export function getModuleNumber(moduleId: string): number {
  const index = ALL_MODULES.indexOf(moduleId as typeof ALL_MODULES[number])
  return index >= 0 ? index + 1 : -1
}

/**
 * Get module ID from number
 */
export function getModuleId(moduleNumber: number): string | null {
  if (moduleNumber < 1 || moduleNumber > ALL_MODULES.length) return null
  return ALL_MODULES[moduleNumber - 1]
}

/**
 * Check if a user is in dev mode
 */
export function isDevMode(userId?: string): boolean {
  // Dev users have specific patterns
  if (!userId) return false
  
  const devPatterns = [
    'dev-',
    'test-',
    'demo-',
    'travis',
    'ana',
    'carlos',
    'maria',
  ]
  
  const lowerUserId = userId.toLowerCase()
  return devPatterns.some(pattern => lowerUserId.includes(pattern))
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

// =============================================================================
// CONTEXT & MEMORY SYSTEM
// =============================================================================
export {
  MemoryManager,
  MemoryType,
  MemorySource,
  type UserMemory,
} from './context/memory-manager'

export {
  ContextBuilder,
} from './context/context-builder'

// =============================================================================
// EVALUATION SYSTEM
// =============================================================================
export {
  Evaluator,
  type EvaluationResult,
} from './evaluation/evaluator'

export {
  A3Rubrics,
  BEHAVIORAL_RUBRIC,
  SITUATIONAL_RUBRIC,
  TECHNICAL_RUBRIC,
  NEGOTIATION_RUBRIC,
} from './evaluation/rubrics'

// =============================================================================
// UNLOCK SYSTEM
// =============================================================================
export {
  UnlockRulesEngine,
  MODULE_UNLOCK_RULES,
  type UnlockCheckResult,
} from './unlock/rules-engine'

// =============================================================================
// FLOW ADAPTERS
// =============================================================================
export * from './adapters'

// =============================================================================
// AGENTOS CORE CLASS
// =============================================================================

import { createClient } from '@/lib/supabase/server'

/**
 * Main DTCAgentOS class for system-wide operations
 */
export class DTCAgentOS {
  /**
   * Log an agent run for analytics and debugging
   */
  static async logAgentRun(params: {
    userId: string
    agentId: string
    context: Record<string, any>
    response: Record<string, any>
    memoriesExtracted: number
    tokensUsed: number
  }): Promise<void> {
    try {
      const supabase = await createClient()
      await supabase.from('agent_runs').insert({
        user_id: params.userId,
        agent_id: params.agentId,
        context_snapshot: params.context,
        response_snapshot: params.response,
        memories_extracted: params.memoriesExtracted,
        tokens_used: params.tokensUsed,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('[DTCAgentOS] Failed to log agent run:', error)
    }
  }
  
  /**
   * Log a command run for analytics and debugging
   */
  static async logCommandRun(params: {
    userId: string
    commandId: string
    input: Record<string, any>
    output: Record<string, any>
    memoriesCreated: number
  }): Promise<void> {
    try {
      const supabase = await createClient()
      await supabase.from('command_runs').insert({
        user_id: params.userId,
        command_id: params.commandId,
        input_snapshot: params.input,
        output_snapshot: params.output,
        memories_created: params.memoriesCreated,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('[DTCAgentOS] Failed to log command run:', error)
    }
  }
  
  /**
   * Get user's current journey state
   */
  static async getJourneyState(userId: string): Promise<{
    stage: 'onboarding' | 'discovery' | 'training' | 'ready'
    completedSteps: string[]
    currentFocus: string
    nextAction: string
  }> {
    const supabase = await createClient()
    
    // Check completed milestones
    const { data: milestones } = await supabase
      .from('user_memories')
      .select('key')
      .eq('user_id', userId)
      .eq('type', 'milestone')
    
    const completedKeys = milestones?.map(m => m.key) || []
    
    // Determine stage based on completed milestones
    const hasC1 = completedKeys.includes('c1_disc_completed')
    const hasA1 = completedKeys.includes('a1_analysis_completed')
    const hasC2 = completedKeys.includes('c2_profile_completed')
    const hasA2 = completedKeys.includes('a2_analysis_completed')
    const hasA3 = completedKeys.includes('a3_training_completed')
    
    let stage: 'onboarding' | 'discovery' | 'training' | 'ready'
    let currentFocus: string
    let nextAction: string
    
    if (!hasC1) {
      stage = 'onboarding'
      currentFocus = 'Completar evaluación DISC'
      nextAction = 'Ir al cuestionario C1'
    } else if (!hasA1 || !hasC2) {
      stage = 'onboarding'
      currentFocus = 'Completar perfil profesional'
      nextAction = hasA1 ? 'Completar información profesional C2' : 'Ver resultados DISC A1'
    } else if (!hasA2) {
      stage = 'discovery'
      currentFocus = 'Análisis de preparación'
      nextAction = 'Ver análisis completo A2'
    } else if (!hasA3) {
      stage = 'training'
      currentFocus = 'Entrenamiento de módulos'
      nextAction = 'Continuar entrenamiento A3'
    } else {
      stage = 'ready'
      currentFocus = 'Preparación completa'
      nextAction = 'Generar documentos A4'
    }
    
    return {
      stage,
      completedSteps: completedKeys,
      currentFocus,
      nextAction
    }
  }
  
  /**
   * Initialize AgentOS for a new user
   */
  static async initializeUser(userId: string): Promise<void> {
    const supabase = await createClient()
    
    // Create initial user memory entry
    await supabase.from('user_memories').insert({
      user_id: userId,
      type: 'milestone',
      source: 'system',
      key: 'user_initialized',
      value: {
        initialized_at: new Date().toISOString(),
        version: '2.0'
      },
      confidence: 1.0,
      extracted_from: 'DTCAgentOS Initialization'
    })
  }
}
