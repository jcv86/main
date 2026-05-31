/**
 * A2 Adaptive Task Generation
 * 
 * Uses DTCContext to generate personalized A2 daily tasks based on:
 * - User's career goal (from C2)
 * - Identified strengths/weaknesses (from A1)
 * - Available time (from C1)
 * - Previous day completions
 * - A3 module progress
 * - Document evidence available
 */

import { buildDtcContext } from './dtc-agentos/context/context-builder'
import { createClient } from '@/lib/supabase/server'
import type { A2DailyTask } from './a2-daily-tasks'

export interface AdaptiveTaskParams {
  userId: string
  dayNumber: number
}

/**
 * Generate an adaptive A2 daily task using user context
 * Falls back to static tasks if context building fails
 */
export async function getAdaptiveA2Task(params: AdaptiveTaskParams): Promise<A2DailyTask | null> {
  try {
    // Build context from user's memories and progress
    const contextResult = await buildDtcContext({
      userId: params.userId,
      command: '/dtc:a2-generate-day',
      agent: 'coach',
      mode: 'coaching',
      dayNumber: params.dayNumber,
    })

    if (!contextResult.success || !contextResult.context) {
      console.log('[v0] Context building failed, will use static task')
      return null
    }

    const context = contextResult.context

    // Extract key signals from context
    const careerGoal = context.memory?.[0]?.content || 'Career advancement'
    const strengths = context.memory?.filter(m => m.memoryType === 'strength') || []
    const weaknesses = context.memory?.filter(m => m.memoryType === 'weakness') || []
    const communicationStyle = context.memory?.find(m => m.memoryType === 'communication_style')

    // Generate adaptive task based on phase and user signals
    const phase = getPhase(params.dayNumber)
    const task = generateAdaptiveTask({
      dayNumber: params.dayNumber,
      phase,
      careerGoal,
      strengths,
      weaknesses,
      communicationStyle,
      documentCount: context.documents?.length || 0,
    })

    return task
  } catch (error) {
    console.error('[v0] Error generating adaptive A2 task:', error)
    return null
  }
}

function getPhase(dayNumber: number): 'foundation' | 'acceleration' | 'mastery' {
  if (dayNumber <= 30) return 'foundation'
  if (dayNumber <= 60) return 'acceleration'
  return 'mastery'
}

interface AdaptiveTaskGenerationParams {
  dayNumber: number
  phase: 'foundation' | 'acceleration' | 'mastery'
  careerGoal: string
  strengths: any[]
  weaknesses: any[]
  communicationStyle: any
  documentCount: number
}

function generateAdaptiveTask(params: AdaptiveTaskGenerationParams): A2DailyTask {
  const { dayNumber, phase, careerGoal, strengths, weaknesses, communicationStyle, documentCount } = params

  // Foundation Phase (Days 1-30): Core preparation
  if (phase === 'foundation') {
    if (dayNumber === 1) {
      return {
        id: `adaptive-day-${dayNumber}`,
        day: dayNumber,
        type: 'planning',
        title: 'Define tu visión: ' + (careerGoal || 'Tu objetivo profesional'),
        description: `Basado en tu perfil de carrera, estructura tu objetivo profesional en 90 días. Tu meta es clara: ${careerGoal}`,
        duration: 45,
        priority: 'high',
        connectedModule: 'career-mirror',
        actions: [
          { action: 'Escribe tu visión profesional adaptada', tip: `Basada en tu fortaleza principal: ${strengths[0]?.content || 'tu potencial'}` },
          { action: 'Define 3 hitos (30/60/90 días)', tip: 'Qué necesitas lograr en cada milestone' },
          { action: 'Crea plan de acciones semanal', tip: 'Desglosaa según tu disponibilidad' }
        ],
        successCriteria: [
          '✓ Visión escrita y alineada con tu fortaleza',
          '✓ 3 hitos definidos con fechas',
          '✓ Plan semanal adaptado a tu disponibilidad'
        ],
        xpReward: 50,
        relatedRealWorldAction: 'Create personalized goal document',
        checklistItems: [
          'Personalized vision statement written',
          '30/60/90 milestones defined',
          'Weekly action plan created'
        ]
      }
    }

    // Days 2-10: Foundation building with weakness targeting
    const hasWeakness = weaknesses.length > 0
    if (dayNumber <= 10 && hasWeakness) {
      return {
        id: `adaptive-day-${dayNumber}`,
        day: dayNumber,
        type: 'learning',
        title: `Fortalece: ${weaknesses[0]?.content || 'tu área de mejora'}`,
        description: `Hemos identificado "${weaknesses[0]?.content}" como un área clave. Hoy te enfocas en esto.`,
        duration: 60,
        priority: 'high',
        connectedModule: 'comunicacion-efectiva',
        actions: [
          { action: `Estudia sobre ${weaknesses[0]?.content || 'tu área de mejora'}`, tip: 'Busca 3-5 artículos o videos relevantes' },
          { action: 'Toma notas de aprendizajes clave', tip: 'Destaca estrategias aplicables a tu contexto' },
          { action: 'Identifica 1 acción para mejorar', tip: 'Pequeño paso observable esta semana' }
        ],
        successCriteria: [
          `✓ Entendimiento de ${weaknesses[0]?.content}`,
          '✓ 3 estrategias de mejora identificadas',
          '✓ 1 acción concreta para esta semana'
        ],
        xpReward: 40,
        relatedRealWorldAction: `Master ${weaknesses[0]?.content}`,
        checklistItems: [
          'Learning resources reviewed',
          'Key insights documented',
          'Improvement plan created'
        ]
      }
    }
  }

  // Acceleration Phase (Days 31-60): Active practice
  if (phase === 'acceleration') {
    if (documentCount < 3) {
      return {
        id: `adaptive-day-${dayNumber}`,
        day: dayNumber,
        type: 'practice',
        title: 'Crea evidencia: Documento estratégico',
        description: 'Necesitas más documentos para A4. Crea uno que demuestre tu experiencia.',
        duration: 90,
        priority: 'high',
        connectedModule: 'portafolio-builder',
        actions: [
          { action: 'Identifica logro relevante a tu meta', tip: `Algo que conecte con: ${careerGoal}` },
          { action: 'Documenta el proceso y resultados', tip: 'Sé específico: números, impacto, aprendizajes' },
          { action: 'Solicita feedback en Slack', tip: 'Comparte con el coach para mejoras' }
        ],
        successCriteria: [
          '✓ Documento creado con logro relevante',
          '✓ Números y métricas incluidas',
          '✓ Feedback recibido'
        ],
        xpReward: 60,
        relatedRealWorldAction: 'Create portfolio evidence',
        checklistItems: [
          'Achievement documented',
          'Metrics quantified',
          'Feedback received'
        ]
      }
    }

    // Days 31-60: Interview prep if approaching A3
    return {
      id: `adaptive-day-${dayNumber}`,
      day: dayNumber,
      type: 'simulation',
      title: 'Práctica: Responde sobre tu fortaleza',
      description: `Prepárate para hablar sobre tu fortaleza principal: "${strengths[0]?.content || 'tu potencial'}"`,
      duration: 45,
      priority: 'medium',
      connectedModule: 'entrenamiento-estructurado',
      actions: [
        { action: `Prepara respuesta sobre ${strengths[0]?.content}`, tip: 'Usa método STAR: Situación, Tarea, Acción, Resultado' },
        { action: 'Graba tu respuesta en video', tip: '2-3 minutos, natural y confiado' },
        { action: 'Revisa y mejora tu respuesta', tip: 'Busca claridad y concisión' }
      ],
      successCriteria: [
        `✓ Respuesta estructurada sobre ${strengths[0]?.content}`,
        '✓ Video grabado sin cortes',
        '✓ Revisión completada'
      ],
      xpReward: 45,
      relatedRealWorldAction: 'Practice strength-based storytelling',
      checklistItems: [
        'STAR response prepared',
        'Video recorded',
        'Self-review completed'
      ]
    }
  }

  // Mastery Phase (Days 61-90): Polish and network
  return {
    id: `adaptive-day-${dayNumber}`,
    day: dayNumber,
    type: 'networking',
    title: 'Conecta: Expande tu red profesional',
    description: `Ya dominas lo fundamental. Ahora conecta con personas en tu sector: ${careerGoal.split(':')[0] || 'tu área'}`,
    duration: 60,
    priority: 'medium',
    connectedModule: 'networking-strategy',
    actions: [
      { action: 'Identifica 5 personas relevantes', tip: 'Busca en LinkedIn profesionales en tu sector objetivo' },
      { action: 'Personaliza 3 mensajes de conexión', tip: 'Menciona experiencia compartida, valor que ofreces' },
      { action: 'Programa 1 conversación informativa', tip: 'Aprende sobre su rol, industria, carrera' }
    ],
    successCriteria: [
      '✓ 5 perfiles relevantes identificados',
      '✓ 3 mensajes personalizados enviados',
      '✓ 1 conversación programada'
    ],
    xpReward: 50,
    relatedRealWorldAction: 'Build professional network',
    checklistItems: [
      'Target profiles identified',
      'Messages sent',
      'Meeting scheduled'
    ]
  }
}

export function shouldUseAdaptiveTask(context: any): boolean {
  // Use adaptive tasks if user has completed C1 + A1 + C2
  const hasCareerGoal = context?.memory?.some((m: any) => m.memoryType === 'career_goal')
  const hasStrengths = context?.memory?.some((m: any) => m.memoryType === 'strength')
  const hasDocuments = context?.documents && context.documents.length > 0

  return hasCareerGoal || hasStrengths || hasDocuments
}
