/**
 * A3 Interview Engine
 * 
 * Context-aware interview question generation and evaluation
 * Maps modules to agents and levels, uses memory for personalization
 */

import { buildDtcContext } from './context/context-builder'
import type { DTCContext } from './types'

/**
 * Module to Agent mapping
 * Determines which agent conducts the interview for each module
 */
export const MODULE_AGENT_MAP = {
  // Modules 1-6: Coach-led training (1-on-1 coaching)
  'auditoria-inicial': { agent: 'coach', mode: 'coaching' },
  'metodo-star': { agent: 'coach', mode: 'coaching' },
  'cv-inteligente': { agent: 'coach', mode: 'coaching' },
  'analisis-vacante': { agent: 'coach', mode: 'coaching' },
  'analisis-multimodal': { agent: 'coach', mode: 'coaching' },
  'entrenamiento-guiado': { agent: 'coach', mode: 'coaching' },

  // Modules 7-10: Interview simulations by difficulty level
  'entrenamiento-estructurado': {
    basic: { agent: 'sofia', mode: 'basic-interview' },
    advanced: { agent: 'elena', mode: 'advanced-interview' },
    pro: { agent: 'bruno', mode: 'pro-interview' },
  },
  'simulacion-real': {
    basic: { agent: 'sofia', mode: 'basic-interview' },
    advanced: { agent: 'elena', mode: 'advanced-interview' },
    pro: { agent: 'bruno', mode: 'pro-interview' },
  },
  'sala-practica': {
    basic: { agent: 'sofia', mode: 'basic-interview' },
    advanced: { agent: 'elena', mode: 'advanced-interview' },
    pro: { agent: 'bruno', mode: 'pro-interview' },
  },
  'evaluacion-final': {
    basic: { agent: 'sofia', mode: 'basic-interview' },
    advanced: { agent: 'elena', mode: 'advanced-interview' },
    pro: { agent: 'bruno', mode: 'pro-interview' },
  },
}

/**
 * Interview level configuration
 */
export interface InterviewLevel {
  level: 'basic' | 'advanced' | 'pro'
  difficulty: number // 1-10
  expectedDuration: number // minutes
  scoringScale: number // 100, 200, etc
  questionCount: number
  focusAreas: string[]
}

export const INTERVIEW_LEVELS: Record<string, InterviewLevel> = {
  basic: {
    level: 'basic',
    difficulty: 3,
    expectedDuration: 45,
    scoringScale: 100,
    questionCount: 3,
    focusAreas: ['storytelling', 'clarity', 'confidence'],
  },
  advanced: {
    level: 'advanced',
    difficulty: 6,
    expectedDuration: 60,
    scoringScale: 100,
    questionCount: 5,
    focusAreas: ['depth', 'impact', 'strategic-thinking', 'leadership'],
  },
  pro: {
    level: 'pro',
    difficulty: 9,
    expectedDuration: 90,
    scoringScale: 100,
    questionCount: 7,
    focusAreas: ['strategic-vision', 'executive-presence', 'business-acumen', 'leadership-style'],
  },
}

/**
 * Get agent configuration for a module and level
 */
export function getAgentForModule(
  moduleId: string,
  level?: 'basic' | 'advanced' | 'pro'
): string {
  const config = MODULE_AGENT_MAP[moduleId as keyof typeof MODULE_AGENT_MAP]
  if (!config) return 'coach'

  if (typeof config === 'string') return config
  if (level && typeof config === 'object' && config[level]) {
    return config[level].agent
  }
  return 'coach'
}

/**
 * Get mode configuration for a module and level
 */
export function getModeForModule(
  moduleId: string,
  level?: 'basic' | 'advanced' | 'pro'
): string {
  const config = MODULE_AGENT_MAP[moduleId as keyof typeof MODULE_AGENT_MAP]
  if (!config) return 'coaching'

  if (typeof config === 'string') return 'coaching'
  if (level && typeof config === 'object' && config[level]) {
    return config[level].mode
  }
  return 'coaching'
}

/**
 * Build context-aware prompt for interview questions
 */
export function buildInterviewPrompt(context: DTCContext, moduleId: string, level: string): string {
  const careerGoal =
    context.memory?.find((m) => m.memoryType === 'career_goal')?.content ||
    'professional advancement'
  const weaknesses = context.memory?.filter((m) => m.memoryType === 'weakness') || []
  const communicationStyle =
    context.memory?.find((m) => m.memoryType === 'communication_style')?.content ||
    'clear and structured'

  const targetWeakness = weaknesses[0]?.content || 'area of improvement'

  // Build Spanish prompt with personalization
  const prompt = `You are ${getAgentForModule(moduleId, level as any)}, conducting a ${level} interview for module: ${moduleId}.

User's Career Goal: ${careerGoal}
Identified Development Area: ${targetWeakness}
Communication Style: ${communicationStyle}

Generate contextual interview questions that:
1. Directly address their stated career goal
2. Help them practice communication in their identified weakness area
3. Are appropriate for their ${level} interview level
4. Use the STAR method when applicable (Situation, Task, Action, Result)

Make questions specific, not generic. Reference their actual goals and challenges.
`

  return prompt
}

/**
 * Generate context-aware interview questions
 */
export async function generateContextAwareQuestions(
  userId: string,
  moduleId: string,
  level: 'basic' | 'advanced' | 'pro' = 'basic'
): Promise<{ success: boolean; questions: string[]; context: DTCContext | null; error?: string }> {
  try {
    // Build rich context from user's journey
    const context = await buildDtcContext({
      userId,
      command: '/dtc:a3-run-interview',
      agent: getAgentForModule(moduleId, level) as any,
      mode: getModeForModule(moduleId, level) as any,
      moduleId,
    })

    if (!context.success) {
      console.log('[v0] Context building failed for interview, using generic questions')
      return {
        success: false,
        questions: [],
        context: null,
        error: 'Context building failed',
      }
    }

    // Extract questions from context or generate them
    // For now, return a template showing how questions would be personalized
    const levelConfig = INTERVIEW_LEVELS[level]
    const questions: string[] = []

    // Build personalized questions based on level
    if (level === 'basic') {
      questions.push(
        `Cuéntame una situación donde demostraste tu capacidad para ${
          context.context?.memory?.[0]?.content || 'lograr un objetivo'
        }. ¿Cuál fue el resultado?`
      )
      questions.push(
        `¿Cómo describirías tu estilo de comunicación? Dame un ejemplo reciente.`
      )
      questions.push(
        `¿Qué representa para ti el rol que buscas: ${context.context?.memory?.find((m: any) => m.memoryType === 'career_goal')?.content || 'tu objetivo profesional'}?`
      )
    } else if (level === 'advanced') {
      const weakness = context.context?.memory?.find((m: any) => m.memoryType === 'weakness')?.content
      questions.push(
        `En tu objetivo de ${context.context?.memory?.find((m: any) => m.memoryType === 'career_goal')?.content}, ¿cuál es el mayor reto que ves? ¿Cómo lo abordarías?`
      )
      questions.push(
        `Identificamos que necesitas mejorar ${weakness}. Cuéntame cómo has trabajado en esto.`
      )
      questions.push(
        `¿Qué aprendizaje importante tuviste en tu rol anterior que quieres traer a ${context.context?.memory?.find((m: any) => m.memoryType === 'career_goal')?.content}?`
      )
      questions.push(
        `Describe un momento donde lideraste bajo presión. ¿Qué salió bien y qué mejorarías?`
      )
      questions.push(
        `¿Cómo mides el éxito en tu carrera profesional?`
      )
    } else if (level === 'pro') {
      questions.push(
        `Visión estratégica: Si llegaras a tu objetivo de ${context.context?.memory?.find((m: any) => m.memoryType === 'career_goal')?.content}, ¿cómo transformarías tu industria o empresa?`
      )
      questions.push(
        `Cuéntame sobre una decisión compleja que tomaste. ¿Cómo influenció a tu equipo y organización?`
      )
      questions.push(
        `¿Cómo ves la evolución del mercado en tu sector? ¿Cómo te posicionas?`
      )
      questions.push(
        `Desarrolla una estrategia para ${context.context?.memory?.find((m: any) => m.memoryType === 'career_goal')?.content} en los próximos 2 años.`
      )
      questions.push(
        `¿Cuál es tu estilo de liderazgo? Dame 3 ejemplos concretos que lo demuestren.`
      )
      questions.push(
        `¿Cómo manejas el fracaso? Cuéntame una experiencia transformadora.`
      )
      questions.push(
        `¿Qué legado profesional quieres dejar?`
      )
    }

    return {
      success: true,
      questions: questions.slice(0, levelConfig.questionCount),
      context: context.context,
    }
  } catch (error) {
    console.error('[v0] Error generating interview questions:', error)
    return {
      success: false,
      questions: [],
      context: null,
      error: String(error),
    }
  }
}

/**
 * Interview session configuration
 */
export interface InterviewSession {
  sessionId: string
  userId: string
  moduleId: string
  level: 'basic' | 'advanced' | 'pro'
  questions: string[]
  currentQuestionIndex: number
  answers: Map<number, string>
  startedAt: Date
  completedAt?: Date
  scores: Map<number, number>
  totalScore?: number
  context: DTCContext | null
}

/**
 * Create a new interview session
 */
export async function createInterviewSession(
  userId: string,
  moduleId: string,
  level: 'basic' | 'advanced' | 'pro' = 'basic'
): Promise<{ success: boolean; session: InterviewSession | null; error?: string }> {
  try {
    const questionsResult = await generateContextAwareQuestions(userId, moduleId, level)

    if (!questionsResult.success) {
      return {
        success: false,
        session: null,
        error: questionsResult.error,
      }
    }

    const session: InterviewSession = {
      sessionId: `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      userId,
      moduleId,
      level,
      questions: questionsResult.questions,
      currentQuestionIndex: 0,
      answers: new Map(),
      startedAt: new Date(),
      scores: new Map(),
      context: questionsResult.context,
    }

    return {
      success: true,
      session,
    }
  } catch (error) {
    console.error('[v0] Error creating interview session:', error)
    return {
      success: false,
      session: null,
      error: String(error),
    }
  }
}

/**
 * Get next question in interview session
 */
export function getNextQuestion(session: InterviewSession): { success: boolean; question?: string; index: number; total: number } {
  if (session.currentQuestionIndex >= session.questions.length) {
    return {
      success: false,
      index: session.currentQuestionIndex,
      total: session.questions.length,
    }
  }

  return {
    success: true,
    question: session.questions[session.currentQuestionIndex],
    index: session.currentQuestionIndex,
    total: session.questions.length,
  }
}

/**
 * Record answer in session
 */
export function recordAnswer(session: InterviewSession, questionIndex: number, answer: string): boolean {
  if (questionIndex < 0 || questionIndex >= session.questions.length) {
    return false
  }

  session.answers.set(questionIndex, answer)
  return true
}

/**
 * Move to next question
 */
export function moveToNextQuestion(session: InterviewSession): boolean {
  if (session.currentQuestionIndex < session.questions.length - 1) {
    session.currentQuestionIndex++
    return true
  }
  return false
}

export default {
  MODULE_AGENT_MAP,
  INTERVIEW_LEVELS,
  getAgentForModule,
  getModeForModule,
  buildInterviewPrompt,
  generateContextAwareQuestions,
  createInterviewSession,
  getNextQuestion,
  recordAnswer,
  moveToNextQuestion,
}
