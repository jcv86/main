/**
 * CORRECT Learning Sequence Architecture
 * 
 * 4 MAIN PILLARS (A1-A4) with diagnostic gatekeepers (C1-C4)
 * 
 * Flow: C1 → A1 → Checkpoint → C2 → A2 → Checkpoint → C3 → A3 → Checkpoint → C4 → A4 → Checkpoint → Done
 * 
 * Hub shows progress through the 4 MAIN PILLARS (A1, A2, A3, A4)
 */

export type PillarMainId = 'a1' | 'a2' | 'a3' | 'a4'
export type DiagnosticId = 'c1' | 'c2' | 'c3' | 'c4'
export type SequenceStepId = DiagnosticId | PillarMainId

export interface SequenceStep {
  id: SequenceStepId
  type: 'diagnostic' | 'main_pillar'
  name: string
  description: string
  path: string
  xp: number
  order: number
  requiresCompletion?: SequenceStepId // Previous step that must be completed
}

export interface MainPillar {
  id: PillarMainId
  name: string
  description: string
  color: string
  xp: number
  diagnosticId: DiagnosticId
  icon: string
}

// The 4 MAIN PILLARS shown in navbar: El Ritual, Exploración, Entrenamiento, La Realidad
export const MAIN_PILLARS: MainPillar[] = [
  {
    id: 'a1',
    name: 'El Ritual',
    description: 'Estructura tus respuestas con el método STAR',
    color: 'from-blue-600 to-blue-400',
    xp: 150,
    diagnosticId: 'c1',
    icon: '🎯',
  },
  {
    id: 'a2',
    name: 'Exploración',
    description: 'Descubre oportunidades en el mercado',
    color: 'from-purple-600 to-purple-400',
    xp: 150,
    diagnosticId: 'c2',
    icon: '🔍',
  },
  {
    id: 'a3',
    name: 'Entrenamiento',
    description: 'Practica bajo presión y mejora continuamente',
    color: 'from-pink-600 to-pink-400',
    xp: 150,
    diagnosticId: 'c3',
    icon: '💪',
  },
  {
    id: 'a4',
    name: 'La Realidad',
    description: 'Enfrenta entrevistas reales y aprende',
    color: 'from-green-600 to-green-400',
    xp: 200,
    diagnosticId: 'c4',
    icon: '🚀',
  },
]

// The complete learning sequence
export const LEARNING_SEQUENCE: SequenceStep[] = [
  // PILLAR 1: El Ritual
  {
    id: 'c1',
    type: 'diagnostic',
    name: 'Conozcámonos 1',
    description: 'Diagnóstico inicial - ¿Cómo responde a situaciones?',
    path: '/despega/conozcamonos/1',
    xp: 0, // Diagnostic doesn't award XP
    order: 1,
  },
  {
    id: 'a1',
    type: 'main_pillar',
    name: 'El Ritual',
    description: 'Aprende y practica el método STAR',
    path: '/despega/el-ritual',
    xp: 150, // Total XP for completing this pillar
    order: 2,
    requiresCompletion: 'c1',
  },

  // PILLAR 2: Exploración
  {
    id: 'c2',
    type: 'diagnostic',
    name: 'Conozcámonos 2',
    description: 'Evaluación de tu perfil profesional',
    path: '/despega/conozcamonos/2',
    xp: 0,
    order: 3,
    requiresCompletion: 'a1',
  },
  {
    id: 'a2',
    type: 'main_pillar',
    name: 'Exploración',
    description: 'Explora tu mercado y posicionamiento',
    path: '/despega/exploracion',
    xp: 150,
    order: 4,
    requiresCompletion: 'c2',
  },

  // PILLAR 3: Entrenamiento
  {
    id: 'c3',
    type: 'diagnostic',
    name: 'Conozcámonos 3',
    description: 'Evaluación de habilidades de comunicación',
    path: '/despega/conozcamonos/3',
    xp: 0,
    order: 5,
    requiresCompletion: 'a2',
  },
  {
    id: 'a3',
    type: 'main_pillar',
    name: 'Entrenamiento',
    description: 'Entrena con ejercicios y simulaciones',
    path: '/despega/entrenamiento',
    xp: 150,
    order: 6,
    requiresCompletion: 'c3',
  },

  // PILLAR 4: La Realidad
  {
    id: 'c4',
    type: 'diagnostic',
    name: 'Conozcámonos 4',
    description: 'Evaluación final de preparación',
    path: '/despega/conozcamonos/4',
    xp: 0,
    order: 7,
    requiresCompletion: 'a3',
  },
  {
    id: 'a4',
    type: 'main_pillar',
    name: 'La Realidad',
    description: 'Enfrenta entrevistas reales y aprende',
    path: '/despega/la-realidad',
    xp: 200,
    order: 8,
    requiresCompletion: 'c4',
  },
]

/**
 * Helper functions
 */

export function getSequenceStep(stepId: SequenceStepId): SequenceStep {
  const step = LEARNING_SEQUENCE.find((s) => s.id === stepId)
  if (!step) throw new Error(`Step ${stepId} not found`)
  return step
}

export function getMainPillar(pillarId: PillarMainId): MainPillar {
  const pillar = MAIN_PILLARS.find((p) => p.id === pillarId)
  if (!pillar) throw new Error(`Pillar ${pillarId} not found`)
  return pillar
}

export function getNextSequenceStep(currentStepId: SequenceStepId): SequenceStep | null {
  const currentStep = getSequenceStep(currentStepId)
  const nextStep = LEARNING_SEQUENCE.find((s) => s.order === currentStep.order + 1)
  return nextStep || null
}

export function getDiagnosticForPillar(pillarId: PillarMainId): SequenceStep {
  const pillar = getMainPillar(pillarId)
  return getSequenceStep(pillar.diagnosticId)
}

export function isStepUnlocked(
  stepId: SequenceStepId,
  completedSteps: SequenceStepId[]
): boolean {
  const step = getSequenceStep(stepId)
  if (!step.requiresCompletion) return true // First step is always unlocked
  return completedSteps.includes(step.requiresCompletion)
}

export function getMainPillarProgress(
  completedSteps: SequenceStepId[]
): {
  completed: PillarMainId[]
  current: PillarMainId | null
  remaining: PillarMainId[]
  completionPercentage: number
} {
  const completedPillars = MAIN_PILLARS.filter((p) =>
    completedSteps.includes(p.id)
  ).map((p) => p.id)

  const remainingPillars = MAIN_PILLARS.filter((p) =>
    !completedSteps.includes(p.id)
  ).map((p) => p.id)

  const currentPillar =
    remainingPillars.length > 0 ? remainingPillars[0] : null

  return {
    completed: completedPillars,
    current: currentPillar,
    remaining: remainingPillars,
    completionPercentage: Math.round(
      (completedPillars.length / MAIN_PILLARS.length) * 100
    ),
  }
}

export function getTotalXpAvailable(): number {
  return LEARNING_SEQUENCE.reduce((sum, step) => sum + step.xp, 0)
}

export function getTotalXpCompleted(completedSteps: SequenceStepId[]): number {
  return LEARNING_SEQUENCE.filter((step) => completedSteps.includes(step.id)).reduce(
    (sum, step) => sum + step.xp,
    0
  )
}
