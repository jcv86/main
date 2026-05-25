/**
 * DTC AgentOS - A3 Adapter
 * 
 * Connects the 10-module training system to AgentOS with proper agent routing:
 * - Modules 1-6: Coach agent
 * - Modules 7-8: Sofia (Junior level)
 * - Module 9: Elena (Mid level)
 * - Module 10: Bruno (Senior level)
 * 
 * Each module interaction extracts memories for downstream use.
 */

import { createClient } from '@/lib/supabase/server'
import { MemoryManager, MemoryType, MemorySource } from '../context/memory-manager'
import { ContextBuilder } from '../context/context-builder'
import { AgentRegistry, type AgentDefinition } from '../registries/agents'
import { Evaluator, type EvaluationResult } from '../evaluation/evaluator'
import { DTCAgentOS } from '../index'

// ============================================================================
// MODULE-AGENT ROUTING
// ============================================================================

export const MODULE_AGENT_MAPPING: Record<number, string> = {
  1: 'coach',      // Autoconocimiento
  2: 'coach',      // Propuesta de Valor
  3: 'coach',      // Narrativa Profesional
  4: 'coach',      // Comunicación Estratégica
  5: 'coach',      // Presencia Ejecutiva
  6: 'coach',      // Networking
  7: 'sofia',      // Preguntas Conductuales (Junior)
  8: 'sofia',      // Preguntas Situacionales (Junior)
  9: 'elena',      // Entrevistas Técnicas (Mid)
  10: 'bruno'      // Negociación (Senior)
}

export const MODULE_CATEGORIES: Record<number, string> = {
  1: 'foundation',
  2: 'foundation',
  3: 'communication',
  4: 'communication',
  5: 'presence',
  6: 'networking',
  7: 'interview_prep',
  8: 'interview_prep',
  9: 'technical',
  10: 'negotiation'
}

// ============================================================================
// TYPES
// ============================================================================

export interface ModuleSession {
  moduleId: number
  sessionId: string
  startedAt: Date
  messages: {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    evaluation?: EvaluationResult
  }[]
  xpEarned: number
  isComplete: boolean
}

export interface ModuleProgress {
  moduleId: number
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  sessionsCount: number
  totalXp: number
  lastSessionAt?: Date
  bestEvaluation?: EvaluationResult
  memoriesExtracted: number
}

export interface A3ModuleInteraction {
  moduleId: number
  sessionId: string
  userMessage: string
  agentResponse: string
  evaluation?: EvaluationResult
  memoriesExtracted: string[]
}

// ============================================================================
// A3 ADAPTER
// ============================================================================

export class A3Adapter {
  private memoryManager: MemoryManager
  private contextBuilder: ContextBuilder
  private evaluator: Evaluator
  
  constructor(private userId: string) {
    this.memoryManager = new MemoryManager(userId)
    this.contextBuilder = new ContextBuilder(userId)
    this.evaluator = new Evaluator()
  }
  
  /**
   * Get the appropriate agent for a module
   */
  getAgentForModule(moduleId: number): AgentDefinition {
    const agentId = MODULE_AGENT_MAPPING[moduleId] || 'coach'
    const agent = AgentRegistry.get(agentId)
    if (!agent) {
      throw new Error(`Agent not found for module ${moduleId}`)
    }
    return agent
  }
  
  /**
   * Build context for a module session
   */
  async buildModuleContext(moduleId: number): Promise<string> {
    const agent = this.getAgentForModule(moduleId)
    const category = MODULE_CATEGORIES[moduleId]
    
    // Get base context from context builder
    const baseContext = await this.contextBuilder.build(agent)
    
    // Add module-specific context
    const moduleContext = await this.getModuleSpecificContext(moduleId)
    
    // Get previous session context if exists
    const sessionHistory = await this.getRecentSessionContext(moduleId)
    
    return `${baseContext}

## Contexto del Módulo ${moduleId}
${moduleContext}

## Historial Reciente
${sessionHistory}
`
  }
  
  /**
   * Get module-specific context based on category
   */
  private async getModuleSpecificContext(moduleId: number): Promise<string> {
    const category = MODULE_CATEGORIES[moduleId]
    const memories = await this.memoryManager.getAllMemories()
    
    const contextParts: string[] = []
    
    switch (category) {
      case 'foundation':
        // For foundation modules, focus on identity and goals
        const identityMemories = memories.filter(m => m.type === MemoryType.IDENTITY)
        const goalMemories = memories.filter(m => m.type === MemoryType.GOAL)
        
        if (identityMemories.length > 0) {
          contextParts.push('**Identidad del Usuario:**')
          identityMemories.slice(0, 5).forEach(m => {
            contextParts.push(`- ${m.key}: ${JSON.stringify(m.value)}`)
          })
        }
        
        if (goalMemories.length > 0) {
          contextParts.push('\n**Objetivos:**')
          goalMemories.slice(0, 3).forEach(m => {
            contextParts.push(`- ${m.key}: ${JSON.stringify(m.value)}`)
          })
        }
        break
        
      case 'communication':
        // For communication modules, include strengths and communication style
        const commStyle = await this.memoryManager.getMemory('communication_style')
        const strengthMemories = memories.filter(m => m.type === MemoryType.STRENGTH)
        
        if (commStyle) {
          contextParts.push(`**Estilo de Comunicación:** ${commStyle.value}`)
        }
        
        if (strengthMemories.length > 0) {
          contextParts.push('\n**Fortalezas Identificadas:**')
          strengthMemories.slice(0, 5).forEach(m => {
            contextParts.push(`- ${m.value.area || m.key}`)
          })
        }
        break
        
      case 'interview_prep':
        // For interview prep, include all relevant context
        const targetRoles = await this.memoryManager.getMemory('target_roles')
        const skills = await this.memoryManager.getMemory('declared_skills')
        const achievements = memories.filter(m => m.type === MemoryType.ACHIEVEMENT)
        
        if (targetRoles) {
          contextParts.push(`**Roles Objetivo:** ${(targetRoles.value as string[]).join(', ')}`)
        }
        
        if (skills) {
          contextParts.push(`\n**Habilidades:** ${(skills.value as string[]).join(', ')}`)
        }
        
        if (achievements.length > 0) {
          contextParts.push('\n**Logros para Usar en Respuestas:**')
          achievements.slice(0, 5).forEach(m => {
            contextParts.push(`- ${m.value}`)
          })
        }
        break
        
      case 'technical':
        // For technical interviews, include skills and experience
        const techSkills = await this.memoryManager.getMemory('declared_skills')
        const experience = await this.memoryManager.getMemory('years_experience')
        const industry = await this.memoryManager.getMemory('industry')
        
        if (techSkills) {
          contextParts.push(`**Habilidades Técnicas:** ${(techSkills.value as string[]).join(', ')}`)
        }
        if (experience) {
          contextParts.push(`**Años de Experiencia:** ${experience.value}`)
        }
        if (industry) {
          contextParts.push(`**Industria:** ${industry.value}`)
        }
        break
        
      case 'negotiation':
        // For negotiation, include salary expectations and market data
        const salary = await this.memoryManager.getMemory('salary_expectations')
        const readiness = await this.memoryManager.getMemory('readiness_score')
        
        if (salary) {
          contextParts.push(`**Expectativas Salariales:** ${JSON.stringify(salary.value)}`)
        }
        if (readiness) {
          contextParts.push(`**Puntuación de Preparación:** ${readiness.value.score}/100`)
        }
        break
    }
    
    return contextParts.join('\n') || 'Sin contexto específico disponible.'
  }
  
  /**
   * Get recent session context for continuity
   */
  private async getRecentSessionContext(moduleId: number): Promise<string> {
    const supabase = await createClient()
    
    // Get recent sessions for this module
    const { data: sessions } = await supabase
      .from('a3_coaching_sessions')
      .select('*')
      .eq('user_id', this.userId)
      .eq('module_id', moduleId)
      .order('created_at', { ascending: false })
      .limit(3)
    
    if (!sessions?.length) {
      return 'Primera sesión en este módulo.'
    }
    
    const contextParts: string[] = ['**Sesiones Anteriores:**']
    
    for (const session of sessions) {
      const date = new Date(session.created_at).toLocaleDateString('es-ES')
      contextParts.push(`- ${date}: ${session.xp_earned || 0} XP ganados`)
      
      // Extract key learning from session if available
      if (session.ai_feedback) {
        const feedback = typeof session.ai_feedback === 'string' 
          ? session.ai_feedback 
          : JSON.stringify(session.ai_feedback)
        contextParts.push(`  Feedback: ${feedback.slice(0, 100)}...`)
      }
    }
    
    return contextParts.join('\n')
  }
  
  /**
   * Process a module interaction and extract memories
   */
  async processInteraction(interaction: A3ModuleInteraction): Promise<{
    memoriesCreated: number
    xpAwarded: number
  }> {
    const moduleId = interaction.moduleId
    const category = MODULE_CATEGORIES[moduleId]
    const agentId = MODULE_AGENT_MAPPING[moduleId]
    
    let memoriesCreated = 0
    
    // Extract memories based on evaluation
    if (interaction.evaluation) {
      // Store evaluation result
      await this.memoryManager.saveMemory({
        type: MemoryType.METRIC,
        source: MemorySource.A3_TRAINING,
        key: `module_${moduleId}_evaluation_${interaction.sessionId}`,
        value: {
          moduleId,
          sessionId: interaction.sessionId,
          scores: interaction.evaluation.scores,
          overallScore: interaction.evaluation.overallScore,
          level: interaction.evaluation.level,
          timestamp: new Date().toISOString()
        },
        confidence: 0.9,
        extractedFrom: `A3 Module ${moduleId} - ${agentId}`
      })
      memoriesCreated++
      
      // Extract specific insights from high-scoring responses
      if (interaction.evaluation.overallScore >= 70) {
        // This is a good response - extract what made it good
        await this.memoryManager.saveMemory({
          type: MemoryType.SKILL,
          source: MemorySource.A3_TRAINING,
          key: `demonstrated_skill_${category}_${Date.now()}`,
          value: {
            category,
            moduleId,
            demonstration: interaction.userMessage.slice(0, 500),
            score: interaction.evaluation.overallScore
          },
          confidence: interaction.evaluation.overallScore / 100,
          extractedFrom: `A3 Module ${moduleId} Evaluation`
        })
        memoriesCreated++
      }
      
      // Extract growth areas from low-scoring responses
      if (interaction.evaluation.overallScore < 50) {
        const lowestDimension = Object.entries(interaction.evaluation.scores)
          .sort((a, b) => a[1] - b[1])[0]
        
        await this.memoryManager.saveMemory({
          type: MemoryType.GROWTH_AREA,
          source: MemorySource.A3_TRAINING,
          key: `training_gap_${category}_${lowestDimension[0]}`,
          value: {
            dimension: lowestDimension[0],
            score: lowestDimension[1],
            moduleId,
            feedback: interaction.evaluation.feedback
          },
          confidence: 0.8,
          extractedFrom: `A3 Module ${moduleId} Evaluation`
        })
        memoriesCreated++
      }
    }
    
    // Extract any STAR stories mentioned
    const starPattern = /situaci[oó]n|tarea|acci[oó]n|resultado/gi
    if (starPattern.test(interaction.userMessage)) {
      await this.memoryManager.saveMemory({
        type: MemoryType.STORY,
        source: MemorySource.A3_TRAINING,
        key: `star_story_${moduleId}_${Date.now()}`,
        value: {
          content: interaction.userMessage,
          moduleId,
          category,
          extractedAt: new Date().toISOString()
        },
        confidence: 0.7,
        extractedFrom: `A3 Module ${moduleId} User Response`
      })
      memoriesCreated++
    }
    
    // Calculate XP based on evaluation
    let xpAwarded = 10 // Base XP for participation
    if (interaction.evaluation) {
      const score = interaction.evaluation.overallScore
      if (score >= 90) xpAwarded = 50
      else if (score >= 80) xpAwarded = 40
      else if (score >= 70) xpAwarded = 30
      else if (score >= 60) xpAwarded = 20
      else if (score >= 50) xpAwarded = 15
    }
    
    // Log agent run
    await DTCAgentOS.logAgentRun({
      userId: this.userId,
      agentId,
      context: { moduleId, category },
      response: { 
        evaluation: interaction.evaluation?.overallScore,
        xpAwarded 
      },
      memoriesExtracted: memoriesCreated,
      tokensUsed: 0
    })
    
    return { memoriesCreated, xpAwarded }
  }
  
  /**
   * Check if a module is unlocked for the user
   */
  async isModuleUnlocked(moduleId: number): Promise<boolean> {
    // Module 1 is always unlocked
    if (moduleId === 1) return true
    
    // Check prerequisites
    const previousModule = moduleId - 1
    const progress = await this.getModuleProgress(previousModule)
    
    // Previous module must be completed
    if (progress.status !== 'completed') return false
    
    // Check for minimum score requirement for advanced modules
    if (moduleId >= 7) {
      // Interview modules require completing modules 1-6
      for (let i = 1; i <= 6; i++) {
        const prereqProgress = await this.getModuleProgress(i)
        if (prereqProgress.status !== 'completed') return false
      }
    }
    
    return true
  }
  
  /**
   * Get progress for a specific module
   */
  async getModuleProgress(moduleId: number): Promise<ModuleProgress> {
    const supabase = await createClient()
    
    const { data: progress } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', this.userId)
      .eq('module_id', moduleId)
      .single()
    
    if (!progress) {
      const isUnlocked = await this.isModuleUnlocked(moduleId)
      return {
        moduleId,
        status: isUnlocked ? 'available' : 'locked',
        sessionsCount: 0,
        totalXp: 0,
        memoriesExtracted: 0
      }
    }
    
    // Count memories extracted for this module
    const memories = await this.memoryManager.getMemoriesBySource(MemorySource.A3_TRAINING)
    const moduleMemories = memories.filter(m => 
      m.key.includes(`module_${moduleId}`) || 
      m.value?.moduleId === moduleId
    )
    
    return {
      moduleId,
      status: progress.status || 'available',
      sessionsCount: progress.sessions_count || 0,
      totalXp: progress.total_xp || 0,
      lastSessionAt: progress.last_session_at ? new Date(progress.last_session_at) : undefined,
      memoriesExtracted: moduleMemories.length
    }
  }
  
  /**
   * Mark a module as completed
   */
  async completeModule(moduleId: number, finalXp: number): Promise<void> {
    const supabase = await createClient()
    
    await supabase
      .from('user_module_progress')
      .upsert({
        user_id: this.userId,
        module_id: moduleId,
        status: 'completed',
        total_xp: finalXp,
        completed_at: new Date().toISOString()
      })
    
    // Store completion milestone
    await this.memoryManager.saveMemory({
      type: MemoryType.MILESTONE,
      source: MemorySource.A3_TRAINING,
      key: `module_${moduleId}_completed`,
      value: {
        moduleId,
        completedAt: new Date().toISOString(),
        totalXp: finalXp,
        agent: MODULE_AGENT_MAPPING[moduleId]
      },
      confidence: 1.0,
      extractedFrom: `A3 Module ${moduleId} Completion`
    })
    
    // Check if all modules are complete for A3 milestone
    const allComplete = await this.checkAllModulesComplete()
    if (allComplete) {
      await this.memoryManager.saveMemory({
        type: MemoryType.MILESTONE,
        source: MemorySource.A3_TRAINING,
        key: 'a3_training_completed',
        value: {
          completedAt: new Date().toISOString(),
          totalModules: 10
        },
        confidence: 1.0,
        extractedFrom: 'A3 Training Program'
      })
    }
  }
  
  /**
   * Check if all 10 modules are complete
   */
  private async checkAllModulesComplete(): Promise<boolean> {
    for (let i = 1; i <= 10; i++) {
      const progress = await this.getModuleProgress(i)
      if (progress.status !== 'completed') return false
    }
    return true
  }
}

// ============================================================================
// INTEGRATION HELPERS
// ============================================================================

/**
 * Hook to call when starting a module session
 */
export async function onA3SessionStart(
  userId: string,
  moduleId: number
): Promise<{ context: string; agent: AgentDefinition }> {
  const adapter = new A3Adapter(userId)
  const context = await adapter.buildModuleContext(moduleId)
  const agent = adapter.getAgentForModule(moduleId)
  return { context, agent }
}

/**
 * Hook to call after each interaction in a module
 */
export async function onA3Interaction(
  userId: string,
  interaction: A3ModuleInteraction
): Promise<{ memoriesCreated: number; xpAwarded: number }> {
  const adapter = new A3Adapter(userId)
  return adapter.processInteraction(interaction)
}

/**
 * Hook to call when completing a module
 */
export async function onA3ModuleComplete(
  userId: string,
  moduleId: number,
  totalXp: number
): Promise<void> {
  const adapter = new A3Adapter(userId)
  await adapter.completeModule(moduleId, totalXp)
}

/**
 * Get training context for A4 document generation
 */
export async function getA3Context(userId: string): Promise<{
  completedModules: number[]
  totalXp: number
  skills: string[]
  stories: string[]
  evaluationSummary: Record<string, number>
}> {
  const adapter = new A3Adapter(userId)
  const memoryManager = new MemoryManager(userId)
  
  const completedModules: number[] = []
  let totalXp = 0
  
  for (let i = 1; i <= 10; i++) {
    const progress = await adapter.getModuleProgress(i)
    if (progress.status === 'completed') {
      completedModules.push(i)
      totalXp += progress.totalXp
    }
  }
  
  // Get demonstrated skills
  const skillMemories = await memoryManager.getMemoriesByType(MemoryType.SKILL)
  const skills = skillMemories
    .filter(m => m.source === MemorySource.A3_TRAINING)
    .map(m => m.value.category || m.key)
    .filter((v, i, a) => a.indexOf(v) === i) // Unique
  
  // Get STAR stories
  const storyMemories = await memoryManager.getMemoriesByType(MemoryType.STORY)
  const stories = storyMemories
    .filter(m => m.source === MemorySource.A3_TRAINING)
    .map(m => m.value.content)
  
  // Build evaluation summary by category
  const evaluationSummary: Record<string, number> = {}
  const metricMemories = await memoryManager.getMemoriesByType(MemoryType.METRIC)
  const evaluations = metricMemories.filter(m => 
    m.source === MemorySource.A3_TRAINING && 
    m.key.includes('evaluation')
  )
  
  for (const evaluation of evaluations) {
    const moduleId = evaluation.value.moduleId
    const category = MODULE_CATEGORIES[moduleId]
    const score = evaluation.value.overallScore
    
    if (!evaluationSummary[category]) {
      evaluationSummary[category] = score
    } else {
      evaluationSummary[category] = (evaluationSummary[category] + score) / 2
    }
  }
  
  return {
    completedModules,
    totalXp,
    skills,
    stories,
    evaluationSummary
  }
}
