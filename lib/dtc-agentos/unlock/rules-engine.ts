/**
 * DTC AgentOS - Unlock Rules Engine
 * 
 * Smart unlock conditions based on real progress, not just time.
 * Evaluates multiple conditions to determine module/level/feature access.
 */

import { createClient } from '@/lib/supabase/server'
import type {
  UnlockCondition,
  UnlockConditionType,
  UnlockRule,
  UnlockResult,
  MemoryItemType,
} from '../types'
import { getUserMemory } from '../context/memory-manager'
import { getAverageScore } from '../evaluation/evaluator'
import { ALL_MODULES, isDevMode } from '../index'

// =============================================================================
// UNLOCK RULES DEFINITIONS
// =============================================================================

export const UNLOCK_RULES: Record<string, UnlockRule> = {
  // =========================================================================
  // MODULE UNLOCKS
  // =========================================================================
  
  // Module 2: Método STAR - requires completing auditoría inicial
  'metodo-star': {
    key: 'metodo-star',
    name: 'Método STAR',
    conditions: [
      { type: 'module_complete', moduleId: 'auditoria-inicial' },
    ],
    allRequired: true,
  },

  // Module 3: CV Inteligente - requires STAR + day 5
  'cv-inteligente': {
    key: 'cv-inteligente',
    name: 'CV Inteligente',
    conditions: [
      { type: 'module_complete', moduleId: 'metodo-star' },
      { type: 'day_reached', day: 5 },
      { type: 'memory_exists', memoryType: 'career_goal' },
    ],
    allRequired: true,
  },

  // Module 4: Análisis de Vacante - requires CV draft
  'analisis-vacante': {
    key: 'analisis-vacante',
    name: 'Análisis de Vacante',
    conditions: [
      { type: 'module_complete', moduleId: 'cv-inteligente' },
      { type: 'document_count', docType: 'cv', min: 1 },
    ],
    allRequired: true,
  },

  // Module 5: Análisis Multimodal - requires vacancy analysis
  'analisis-multimodal': {
    key: 'analisis-multimodal',
    name: 'Análisis Multimodal',
    conditions: [
      { type: 'module_complete', moduleId: 'analisis-vacante' },
      { type: 'day_reached', day: 10 },
    ],
    allRequired: true,
  },

  // Module 6: Entrenamiento Guiado - requires multimodal + documents
  'entrenamiento-guiado': {
    key: 'entrenamiento-guiado',
    name: 'Entrenamiento Guiado',
    conditions: [
      { type: 'module_complete', moduleId: 'analisis-multimodal' },
      { type: 'document_count', docType: 'star_answer', min: 2 },
    ],
    allRequired: true,
  },

  // Module 7: Entrenamiento Estructurado - requires guided training + documents
  'entrenamiento-estructurado': {
    key: 'entrenamiento-estructurado',
    name: 'Entrenamiento Estructurado',
    conditions: [
      { type: 'module_complete', moduleId: 'entrenamiento-guiado' },
      { type: 'day_reached', day: 15 },
      { type: 'document_count', docType: 'star_answer', min: 3 },
    ],
    allRequired: true,
  },

  // Module 8: Simulación Real - requires structured training with good score
  'simulacion-real': {
    key: 'simulacion-real',
    name: 'Simulación Real',
    conditions: [
      { type: 'module_complete', moduleId: 'entrenamiento-estructurado' },
      { type: 'score_threshold', module: 'entrenamiento-estructurado', score: 65 },
    ],
    allRequired: true,
  },

  // Module 9: Sala de Práctica - requires real simulation
  'sala-practica': {
    key: 'sala-practica',
    name: 'Sala de Práctica',
    conditions: [
      { type: 'module_complete', moduleId: 'simulacion-real' },
      { type: 'score_threshold', module: 'simulacion-real', score: 70 },
    ],
    allRequired: true,
  },

  // Module 10: Evaluación Final - requires practice room with good score
  'evaluacion-final': {
    key: 'evaluacion-final',
    name: 'Evaluación Final',
    conditions: [
      { type: 'module_complete', moduleId: 'sala-practica' },
      { type: 'score_threshold', module: 'sala-practica', score: 72 },
      { type: 'day_reached', day: 25 },
      { type: 'document_count', docType: 'cv', min: 1 },
      { type: 'document_count', docType: 'star_answer', min: 5 },
    ],
    allRequired: true,
  },

  // =========================================================================
  // INTERVIEW LEVEL UNLOCKS
  // =========================================================================

  // Advanced Interview Access - requires basic completion with good scores
  'advanced-interview-access': {
    key: 'advanced-interview-access',
    name: 'Acceso a Entrevistas Avanzadas',
    conditions: [
      { type: 'basic_interview_complete' },
      { type: 'score_threshold', module: 'entrenamiento-estructurado', score: 75 },
      { type: 'document_count', docType: 'star_answer', min: 4 },
    ],
    allRequired: true,
  },

  // Pro Interview Access - requires advanced completion with high scores
  'pro-interview-access': {
    key: 'pro-interview-access',
    name: 'Acceso a Entrevistas Pro',
    conditions: [
      { type: 'advanced_interview_complete' },
      { type: 'score_threshold', module: 'simulacion-real', score: 82 },
      { type: 'document_score', docType: 'cv', minScore: 80 },
      { type: 'evidence_count', min: 5 },
    ],
    allRequired: true,
  },

  // =========================================================================
  // FEATURE UNLOCKS
  // =========================================================================

  // CV Builder feature
  'cv-builder-feature': {
    key: 'cv-builder-feature',
    name: 'Constructor de CV',
    conditions: [
      { type: 'module_complete', moduleId: 'cv-inteligente' },
    ],
    allRequired: true,
  },

  // Document Review feature
  'document-review-feature': {
    key: 'document-review-feature',
    name: 'Revisión de Documentos',
    conditions: [
      { type: 'module_complete', moduleId: 'metodo-star' },
      { type: 'memory_exists', memoryType: 'career_goal' },
    ],
    allRequired: true,
  },

  // Interview Simulation feature
  'interview-simulation-feature': {
    key: 'interview-simulation-feature',
    name: 'Simulación de Entrevistas',
    conditions: [
      { type: 'module_complete', moduleId: 'entrenamiento-guiado' },
    ],
    allRequired: true,
  },
}

// =============================================================================
// UNLOCK EVALUATION
// =============================================================================

/**
 * Check if a specific unlock key can be unlocked for a user
 */
export async function checkUnlock(
  userId: string,
  unlockKey: string
): Promise<UnlockResult> {
  // Dev mode: everything is unlocked
  if (isDevMode(userId)) {
    return {
      key: unlockKey,
      unlocked: true,
      missing: [],
      progress: 100,
    }
  }

  const rule = UNLOCK_RULES[unlockKey]
  if (!rule) {
    // Unknown key - default to locked
    return {
      key: unlockKey,
      unlocked: false,
      missing: ['Requisito desconocido'],
      progress: 0,
    }
  }

  // Evaluate all conditions
  const results = await Promise.all(
    rule.conditions.map(c => evaluateCondition(userId, c))
  )

  // Find missing conditions
  const missing: string[] = []
  for (let i = 0; i < rule.conditions.length; i++) {
    if (!results[i]) {
      missing.push(describeCondition(rule.conditions[i]))
    }
  }

  // Calculate progress
  const metCount = results.filter(r => r).length
  const progress = Math.round((metCount / rule.conditions.length) * 100)

  // Determine if unlocked
  const unlocked = rule.allRequired
    ? results.every(r => r)
    : results.some(r => r)

  return {
    key: unlockKey,
    unlocked,
    missing,
    progress,
  }
}

/**
 * Check all module unlocks for a user
 */
export async function checkAllModuleUnlocks(
  userId: string
): Promise<Record<string, UnlockResult>> {
  const results: Record<string, UnlockResult> = {}

  // First module is always unlocked
  results['auditoria-inicial'] = {
    key: 'auditoria-inicial',
    unlocked: true,
    missing: [],
    progress: 100,
  }

  // Check remaining modules
  for (const moduleId of ALL_MODULES.slice(1)) {
    results[moduleId] = await checkUnlock(userId, moduleId)
  }

  return results
}

/**
 * Check interview level unlocks for a user
 */
export async function checkInterviewLevelUnlocks(
  userId: string
): Promise<{
  basic: boolean
  advanced: boolean
  pro: boolean
}> {
  // Basic is always available once interview modules are reached
  const [advancedResult, proResult] = await Promise.all([
    checkUnlock(userId, 'advanced-interview-access'),
    checkUnlock(userId, 'pro-interview-access'),
  ])

  return {
    basic: true, // Always available in interview modules
    advanced: advancedResult.unlocked,
    pro: proResult.unlocked,
  }
}

/**
 * Get the next unlock milestone for a user
 */
export async function getNextMilestone(
  userId: string
): Promise<{
  unlockKey: string
  name: string
  missing: string[]
  progress: number
} | null> {
  // Find the first locked module
  for (const moduleId of ALL_MODULES.slice(1)) {
    const result = await checkUnlock(userId, moduleId)
    if (!result.unlocked) {
      const rule = UNLOCK_RULES[moduleId]
      return {
        unlockKey: moduleId,
        name: rule?.name || moduleId,
        missing: result.missing,
        progress: result.progress,
      }
    }
  }

  // All modules unlocked - check interview levels
  const advancedResult = await checkUnlock(userId, 'advanced-interview-access')
  if (!advancedResult.unlocked) {
    return {
      unlockKey: 'advanced-interview-access',
      name: 'Entrevistas Avanzadas',
      missing: advancedResult.missing,
      progress: advancedResult.progress,
    }
  }

  const proResult = await checkUnlock(userId, 'pro-interview-access')
  if (!proResult.unlocked) {
    return {
      unlockKey: 'pro-interview-access',
      name: 'Entrevistas Pro',
      missing: proResult.missing,
      progress: proResult.progress,
    }
  }

  // Everything unlocked!
  return null
}

// =============================================================================
// CONDITION EVALUATION
// =============================================================================

/**
 * Evaluate a single unlock condition
 */
async function evaluateCondition(
  userId: string,
  condition: UnlockCondition
): Promise<boolean> {
  const supabase = await createClient()

  switch (condition.type) {
    case 'module_complete': {
      const { data } = await supabase
        .from('a3_user_progress')
        .select('status')
        .eq('user_id', userId)
        .eq('module_id', condition.moduleId)
        .single()
      
      return data?.status === 'completed'
    }

    case 'day_reached': {
      const { data } = await supabase
        .from('despega_user_profiles')
        .select('current_day')
        .eq('user_id', userId)
        .single()
      
      return (data?.current_day || 0) >= (condition.day || 0)
    }

    case 'memory_exists': {
      const memories = await getUserMemory(userId, [condition.memoryType as MemoryItemType])
      return memories.length > 0
    }

    case 'score_threshold': {
      const avgScore = await getAverageScore(userId, condition.module!)
      return avgScore !== null && avgScore >= (condition.score || 0)
    }

    case 'document_count': {
      const { count } = await supabase
        .from('dtc_documents')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('document_type', condition.docType)
      
      return (count || 0) >= (condition.min || 0)
    }

    case 'document_score': {
      const { data } = await supabase
        .from('dtc_documents')
        .select('ai_score')
        .eq('user_id', userId)
        .eq('document_type', condition.docType)
        .order('ai_score', { ascending: false })
        .limit(1)
        .single()
      
      return (data?.ai_score || 0) >= (condition.minScore || 0)
    }

    case 'evidence_count': {
      const memories = await getUserMemory(userId, ['evidence', 'star_story', 'achievement'])
      return memories.length >= (condition.min || 0)
    }

    case 'basic_interview_complete': {
      // Check if any basic level interview module is completed
      const { data } = await supabase
        .from('a3_user_progress')
        .select('status')
        .eq('user_id', userId)
        .in('module_id', ['entrenamiento-estructurado', 'simulacion-real', 'sala-practica'])
        .eq('current_level', 'basic')
        .eq('status', 'completed')
      
      return (data?.length || 0) > 0
    }

    case 'advanced_interview_complete': {
      // Check if any advanced level interview module is completed
      const { data } = await supabase
        .from('a3_user_progress')
        .select('status')
        .eq('user_id', userId)
        .in('module_id', ['entrenamiento-estructurado', 'simulacion-real', 'sala-practica'])
        .eq('current_level', 'advanced')
        .eq('status', 'completed')
      
      return (data?.length || 0) > 0
    }

    case 'time_elapsed': {
      // Check if enough time has passed since account creation
      const { data } = await supabase
        .from('users')
        .select('created_at')
        .eq('id', userId)
        .single()
      
      if (!data?.created_at) return false
      
      const createdAt = new Date(data.created_at)
      const hoursElapsed = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60)
      return hoursElapsed >= (condition.hours || 0)
    }

    default:
      console.warn(`[UnlockEngine] Unknown condition type: ${condition.type}`)
      return false
  }
}

/**
 * Describe a condition in human-readable Spanish
 */
function describeCondition(condition: UnlockCondition): string {
  switch (condition.type) {
    case 'module_complete':
      return `Completar módulo: ${formatModuleName(condition.moduleId!)}`
    
    case 'day_reached':
      return `Alcanzar día ${condition.day}`
    
    case 'memory_exists':
      return `Definir ${formatMemoryType(condition.memoryType!)}`
    
    case 'score_threshold':
      return `Obtener ${condition.score}+ en ${formatModuleName(condition.module!)}`
    
    case 'document_count':
      return `Crear ${condition.min} ${formatDocType(condition.docType!)}`
    
    case 'document_score':
      return `${formatDocType(condition.docType!)} con score ${condition.minScore}+`
    
    case 'evidence_count':
      return `Documentar ${condition.min} evidencias`
    
    case 'basic_interview_complete':
      return 'Completar una entrevista básica'
    
    case 'advanced_interview_complete':
      return 'Completar una entrevista avanzada'
    
    case 'time_elapsed':
      return `Han pasado ${condition.hours} horas`
    
    default:
      return 'Requisito desconocido'
  }
}

// =============================================================================
// FORMATTING HELPERS
// =============================================================================

function formatModuleName(moduleId: string): string {
  const names: Record<string, string> = {
    'auditoria-inicial': 'Auditoría Inicial',
    'metodo-star': 'Método STAR',
    'cv-inteligente': 'CV Inteligente',
    'analisis-vacante': 'Análisis de Vacante',
    'analisis-multimodal': 'Análisis Multimodal',
    'entrenamiento-guiado': 'Entrenamiento Guiado',
    'entrenamiento-estructurado': 'Entrenamiento Estructurado',
    'simulacion-real': 'Simulación Real',
    'sala-practica': 'Sala de Práctica',
    'evaluacion-final': 'Evaluación Final',
  }
  return names[moduleId] || moduleId
}

function formatMemoryType(memoryType: string): string {
  const names: Record<string, string> = {
    career_goal: 'objetivo profesional',
    role_target: 'rol objetivo',
    strength: 'fortalezas',
    weakness: 'áreas de mejora',
    evidence: 'evidencias',
    star_story: 'historias STAR',
  }
  return names[memoryType] || memoryType
}

function formatDocType(docType: string): string {
  const names: Record<string, string> = {
    cv: 'CV',
    star_answer: 'respuestas STAR',
    elevator_pitch: 'elevator pitch',
    achievement: 'logros',
  }
  return names[docType] || docType
}

// =============================================================================
// UNLOCK EVENT LOGGING
// =============================================================================

/**
 * Log an unlock event when a user unlocks something
 */
export async function logUnlockEvent(
  userId: string,
  unlockKey: string,
  unlockType: 'module' | 'level' | 'feature'
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('unlock_events')
    .insert({
      user_id: userId,
      unlock_key: unlockKey,
      unlock_type: unlockType,
      unlocked_at: new Date().toISOString(),
    })

  if (error) {
    console.error('[UnlockEngine] Error logging unlock event:', error)
  }
}

/**
 * Check if a user has ever unlocked something (for analytics)
 */
export async function hasEverUnlocked(
  userId: string,
  unlockKey: string
): Promise<boolean> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('unlock_events')
    .select('id')
    .eq('user_id', userId)
    .eq('unlock_key', unlockKey)
    .limit(1)
    .single()

  return !!data
}
