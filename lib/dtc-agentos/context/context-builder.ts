/**
 * DTC AgentOS - Context Builder
 * 
 * Assembles the full context needed for any AI command execution.
 * Fetches user profile, memories, module state, documents, and unlock status.
 */

import { createClient } from '@/lib/supabase/server'
import type {
  DTCContext,
  UserProfile,
  ModuleState,
  DayProgress,
  DocumentRef,
  InterviewSummary,
  UnlockState,
  CommandId,
  AgentId,
  ModeId,
} from '../types'
import { getCommand, validateCommandExecution } from '../registries/commands'
import { getAgent } from '../registries/agents'
import { getMode } from '../registries/modes'
import { getUserMemory, getContextualMemories, formatMemoriesForContext } from './memory-manager'
import { isDevMode, ALL_MODULES } from '../index'

// =============================================================================
// MAIN CONTEXT BUILDER
// =============================================================================

export interface BuildContextParams {
  userId: string
  command: CommandId
  agent: AgentId
  mode: ModeId
  moduleId?: string
  dayNumber?: number
}

export interface BuildContextResult {
  success: boolean
  context?: DTCContext
  error?: string
  missingContext?: string[]
}

/**
 * Build the complete DTC context for a command execution
 */
export async function buildDtcContext(
  params: BuildContextParams
): Promise<BuildContextResult> {
  const { userId, command, agent, mode, moduleId, dayNumber } = params

  // Validate command/agent/mode combination
  const validation = validateCommandExecution(command, agent, mode)
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join(', '),
    }
  }

  // Get command configuration
  const commandConfig = getCommand(command)
  if (!commandConfig) {
    return {
      success: false,
      error: `Unknown command: ${command}`,
    }
  }

  // Get agent and mode configurations
  const agentConfig = getAgent(agent)
  const modeConfig = getMode(mode)

  if (!agentConfig || !modeConfig) {
    return {
      success: false,
      error: `Invalid agent or mode: ${agent}, ${mode}`,
    }
  }

  try {
    // Fetch all context components in parallel
    const [
      user,
      memory,
      moduleState,
      dayProgress,
      documents,
      unlocks,
      previousInterviews,
    ] = await Promise.all([
      fetchUserProfile(userId),
      getContextualMemories(userId, command),
      moduleId ? fetchModuleState(userId, moduleId) : Promise.resolve(null),
      dayNumber ? fetchDayProgress(userId, dayNumber) : Promise.resolve(null),
      fetchRelevantDocuments(userId, command),
      fetchUnlockState(userId),
      fetchRecentInterviews(userId, 3),
    ])

    // Check for missing required context
    const missingContext = checkRequiredContext(
      commandConfig.requiredContext,
      { user, memory, moduleState, dayProgress, documents }
    )

    if (missingContext.length > 0 && !isDevMode(userId)) {
      return {
        success: false,
        error: 'Missing required context',
        missingContext,
      }
    }

    // Build the full context
    const context: DTCContext = {
      user: user!,
      memory,
      agent: agentConfig,
      mode: modeConfig,
      module: moduleState,
      day: dayProgress,
      documents,
      unlocks,
      previousInterviews,
      isDevMode: isDevMode(userId),
      timestamp: new Date(),
    }

    return {
      success: true,
      context,
    }
  } catch (error) {
    console.error('[ContextBuilder] Error building context:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error building context',
    }
  }
}

// =============================================================================
// CONTEXT FETCHERS
// =============================================================================

/**
 * Fetch user profile from database
 */
async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient()

  // First try despega_user_profiles
  const { data: profile, error: profileError } = await supabase
    .from('despega_user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (profile && !profileError) {
    return {
      id: userId,
      email: profile.email,
      name: profile.nombre_completo || profile.name,
      currentStage: profile.current_stage,
      currentDay: profile.current_day,
      readinessScore: profile.readiness_score,
      createdAt: new Date(profile.created_at),
    }
  }

  // Fallback to users table
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (user && !userError) {
    return {
      id: userId,
      email: user.email,
      name: user.full_name || user.name,
      createdAt: new Date(user.created_at),
    }
  }

  console.error('[ContextBuilder] Could not fetch user profile:', profileError || userError)
  return null
}

/**
 * Fetch module state for a specific module
 */
async function fetchModuleState(
  userId: string,
  moduleId: string
): Promise<ModuleState | null> {
  const supabase = await createClient()

  // Check a3_user_progress for module state
  const { data: progress, error } = await supabase
    .from('a3_user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .single()

  if (progress && !error) {
    return {
      moduleId,
      status: progress.status || 'locked',
      currentLevel: progress.current_level || 'basic',
      progress: progress.progress_percent || 0,
      attempts: progress.attempts || 0,
      bestScore: progress.best_score,
      lastAttemptAt: progress.last_attempt_at ? new Date(progress.last_attempt_at) : undefined,
    }
  }

  // If no progress record, module is locked
  return {
    moduleId,
    status: 'locked',
    progress: 0,
    attempts: 0,
  }
}

/**
 * Fetch day progress for a specific day
 */
async function fetchDayProgress(
  userId: string,
  dayNumber: number
): Promise<DayProgress | null> {
  const supabase = await createClient()

  const { data: day, error } = await supabase
    .from('dtc_days')
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .single()

  if (day && !error) {
    // Get tasks for this day
    const { data: tasks } = await supabase
      .from('dtc_day_tasks')
      .select('*')
      .eq('day_id', day.id)

    const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0

    return {
      dayNumber,
      status: day.status || 'locked',
      tasksCompleted: completedTasks,
      totalTasks: tasks?.length || 0,
      reflection: day.reflection,
      evidence: day.evidence,
    }
  }

  return null
}

/**
 * Fetch relevant documents for a command
 */
async function fetchRelevantDocuments(
  userId: string,
  command: CommandId
): Promise<DocumentRef[]> {
  const supabase = await createClient()

  // Different document queries based on command
  let query = supabase
    .from('dtc_documents')
    .select('id, document_type, title, status, ai_score, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  // Filter by relevant document types for certain commands
  if (command === '/dtc:a3-run-interview') {
    query = query.in('document_type', ['cv', 'star_answer', 'elevator_pitch', 'achievement'])
  } else if (command === '/dtc:a4-create-document' || command === '/dtc:a4-review-document') {
    // Get all recent documents for context
    query = query.limit(5)
  }

  const { data: docs, error } = await query

  if (error) {
    console.error('[ContextBuilder] Error fetching documents:', error)
    return []
  }

  return (docs || []).map(doc => ({
    id: doc.id,
    type: doc.document_type,
    title: doc.title,
    status: doc.status || 'draft',
    score: doc.ai_score,
    createdAt: new Date(doc.created_at),
  }))
}

/**
 * Fetch unlock state for all modules and features
 */
async function fetchUnlockState(userId: string): Promise<UnlockState> {
  const supabase = await createClient()

  // Get all module progress
  const { data: progress } = await supabase
    .from('a3_user_progress')
    .select('module_id, status, current_level')
    .eq('user_id', userId)

  const modules: Record<string, boolean> = {}
  const levels: Record<string, 'basic' | 'advanced' | 'pro'> = {}

  // Initialize all modules as locked
  for (const moduleId of ALL_MODULES) {
    modules[moduleId] = false
    levels[moduleId] = 'basic'
  }

  // First module is always unlocked
  modules[ALL_MODULES[0]] = true

  // Update based on progress
  if (progress) {
    for (const p of progress) {
      modules[p.module_id] = p.status !== 'locked'
      levels[p.module_id] = p.current_level || 'basic'
    }
  }

  // Features unlock logic
  const features: Record<string, boolean> = {
    advanced_interview: false,
    pro_interview: false,
    cv_builder: modules['cv-inteligente'],
    document_review: modules['cv-inteligente'],
  }

  // Check if advanced/pro interviews are unlocked
  // (based on completing basic level with good scores)
  const interviewModules = ['entrenamiento-estructurado', 'simulacion-real']
  for (const modId of interviewModules) {
    if (levels[modId] === 'advanced' || levels[modId] === 'pro') {
      features.advanced_interview = true
    }
    if (levels[modId] === 'pro') {
      features.pro_interview = true
    }
  }

  return { modules, levels, features }
}

/**
 * Fetch recent interview summaries
 */
async function fetchRecentInterviews(
  userId: string,
  limit: number
): Promise<InterviewSummary[]> {
  const supabase = await createClient()

  const { data: sessions, error } = await supabase
    .from('a3_session_attempts')
    .select('id, module_id, agent_id, level, score, completed_at, pattern_observed')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(limit)

  if (error || !sessions) {
    return []
  }

  return sessions.map(s => ({
    id: s.id,
    moduleId: s.module_id,
    agentId: s.agent_id || 'coach',
    level: s.level || 'basic',
    score: s.score || 0,
    completedAt: new Date(s.completed_at),
    patternObserved: s.pattern_observed,
  }))
}

// =============================================================================
// CONTEXT VALIDATION
// =============================================================================

/**
 * Check which required context items are missing
 */
function checkRequiredContext(
  required: string[],
  context: {
    user: UserProfile | null
    memory: unknown[]
    moduleState: ModuleState | null
    dayProgress: DayProgress | null
    documents: DocumentRef[]
  }
): string[] {
  const missing: string[] = []

  for (const key of required) {
    switch (key) {
      case 'user_profile':
      case 'user_profile_snapshot':
        if (!context.user) missing.push(key)
        break
      case 'identity_audit':
        // Check if we have A1 memories
        // This is a simplified check - in production, check for specific memory types
        break
      case 'career_direction':
      case 'career_goal':
        // Check if we have career goal in memory
        break
      case 'module_state':
        if (!context.moduleState) missing.push(key)
        break
      case 'documents':
        // Documents are optional for most commands
        break
      default:
        // Unknown context key - log but don't fail
        console.warn(`[ContextBuilder] Unknown context key: ${key}`)
    }
  }

  return missing
}

// =============================================================================
// CONTEXT FORMATTING
// =============================================================================

/**
 * Format full context as a string for AI prompts
 */
export function formatContextForPrompt(context: DTCContext): string {
  const sections: string[] = []

  // User info
  if (context.user) {
    sections.push(`USUARIO: ${context.user.name || 'Usuario'}
ID: ${context.user.id}
Día actual: ${context.user.currentDay || 1}
Score de preparación: ${context.user.readinessScore || 0}/100`)
  }

  // Memory (most important)
  if (context.memory.length > 0) {
    sections.push(`MEMORIA DEL USUARIO:\n${formatMemoriesForContext(context.memory)}`)
  }

  // Current module
  if (context.module) {
    sections.push(`MÓDULO ACTUAL: ${context.module.moduleId}
Estado: ${context.module.status}
Progreso: ${context.module.progress}%
Nivel: ${context.module.currentLevel || 'básico'}
Intentos: ${context.module.attempts}
Mejor score: ${context.module.bestScore || 'N/A'}`)
  }

  // Current day
  if (context.day) {
    sections.push(`DÍA ACTUAL: ${context.day.dayNumber}
Tareas completadas: ${context.day.tasksCompleted}/${context.day.totalTasks}`)
  }

  // Recent documents
  if (context.documents.length > 0) {
    const docList = context.documents
      .slice(0, 5)
      .map(d => `- ${d.title} (${d.type}, ${d.status})`)
      .join('\n')
    sections.push(`DOCUMENTOS RECIENTES:\n${docList}`)
  }

  // Previous interviews
  if (context.previousInterviews.length > 0) {
    const interviewList = context.previousInterviews
      .map(i => `- ${i.moduleId} con ${i.agentId}: ${i.score}/100`)
      .join('\n')
    sections.push(`ENTREVISTAS PREVIAS:\n${interviewList}`)
  }

  // Dev mode warning
  if (context.isDevMode) {
    sections.push(`⚠️ MODO DESARROLLO: Este usuario está en modo de prueba.`)
  }

  return sections.join('\n\n---\n\n')
}

/**
 * Get a summary of context for logging
 */
export function summarizeContext(context: DTCContext): Record<string, unknown> {
  return {
    userId: context.user?.id,
    userName: context.user?.name,
    agent: context.agent.id,
    mode: context.mode.id,
    memoryCount: context.memory.length,
    moduleId: context.module?.moduleId,
    moduleStatus: context.module?.status,
    documentsCount: context.documents.length,
    previousInterviewsCount: context.previousInterviews.length,
    isDevMode: context.isDevMode,
    timestamp: context.timestamp.toISOString(),
  }
}
