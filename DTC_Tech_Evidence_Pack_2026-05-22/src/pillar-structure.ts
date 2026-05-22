/**
 * Pillar-based learning structure
 * Each pillar has a Conozcámonos (diagnostic) + Activities
 */

export type PillarId = 'c1' | 'c2' | 'c3' | 'c4'

export interface PillarActivity {
  id: string
  name: string
  type: 'activity' | 'assessment'
  xp: number
  path: string
}

export interface PillarStructure {
  id: PillarId
  name: string
  description: string
  conozcamosId: string // The diagnostic module ID
  conozcamosPath: string
  activities: PillarActivity[]
  totalXP: number
  unlockRequirement?: PillarId // Which pillar must be completed first
  color: string
}

export const PILLAR_SEQUENCE: PillarStructure[] = [
  {
    id: 'c1',
    name: 'Pilar 1: Autoconocimiento',
    description: 'Descubre tus fortalezas y oportunidades',
    conozcamosId: 'conozcamonos-1',
    conozcamosPath: '/despega/conozcamonos/1',
    activities: [
      {
        id: 'a1',
        name: 'Actividad 1: Mi Perfil Profesional',
        type: 'activity',
        xp: 50,
        path: '/despega/a3/actividad-1',
      },
      {
        id: 'a2',
        name: 'Actividad 2: Mis Competencias',
        type: 'activity',
        xp: 50,
        path: '/despega/a3/actividad-2',
      },
    ],
    totalXP: 150, // 50 (diagnostic) + 50 (a1) + 50 (a2)
    color: 'from-blue-600 to-blue-400',
  },
  {
    id: 'c2',
    name: 'Pilar 2: Método STAR',
    description: 'Domina la técnica de entrevista STAR',
    conozcamosId: 'conozcamonos-2',
    conozcamosPath: '/despega/conozcamonos/2',
    activities: [
      {
        id: 'a3',
        name: 'Actividad 3: Estructura STAR',
        type: 'activity',
        xp: 50,
        path: '/despega/a3/actividad-3',
      },
      {
        id: 'a4',
        name: 'Actividad 4: Práctica STAR',
        type: 'activity',
        xp: 50,
        path: '/despega/a3/actividad-4',
      },
    ],
    totalXP: 150,
    unlockRequirement: 'c1',
    color: 'from-purple-600 to-purple-400',
  },
  {
    id: 'c3',
    name: 'Pilar 3: Posicionamiento',
    description: 'Presenta tu propuesta de valor',
    conozcamosId: 'conozcamonos-3',
    conozcamosPath: '/despega/conozcamonos/3',
    activities: [
      {
        id: 'a5',
        name: 'Actividad 5: Tu Valor',
        type: 'activity',
        xp: 50,
        path: '/despega/a3/actividad-5',
      },
      {
        id: 'a6',
        name: 'Actividad 6: Elevator Pitch',
        type: 'activity',
        xp: 50,
        path: '/despega/a3/actividad-6',
      },
    ],
    totalXP: 150,
    unlockRequirement: 'c2',
    color: 'from-pink-600 to-pink-400',
  },
  {
    id: 'c4',
    name: 'Pilar 4: Simulación Real',
    description: 'Prueba en entrevistas reales',
    conozcamosId: 'conozcamonos-4',
    conozcamosPath: '/despega/conozcamonos/4',
    activities: [
      {
        id: 'a7',
        name: 'Actividad 7: Entrevista Simulada',
        type: 'assessment',
        xp: 100,
        path: '/despega/a3/actividad-7',
      },
      {
        id: 'a8',
        name: 'Actividad 8: Feedback',
        type: 'activity',
        xp: 50,
        path: '/despega/a3/actividad-8',
      },
    ],
    totalXP: 200,
    unlockRequirement: 'c3',
    color: 'from-green-600 to-green-400',
  },
]

export function getPillarById(pillarId: PillarId): PillarStructure {
  const pillar = PILLAR_SEQUENCE.find((p) => p.id === pillarId)
  if (!pillar) throw new Error(`Pillar ${pillarId} not found`)
  return pillar
}

export function getNextPillar(currentPillarId: PillarId): PillarStructure | null {
  const currentIndex = PILLAR_SEQUENCE.findIndex((p) => p.id === currentPillarId)
  if (currentIndex === -1 || currentIndex === PILLAR_SEQUENCE.length - 1) {
    return null
  }
  return PILLAR_SEQUENCE[currentIndex + 1]
}

export function isPillarUnlocked(
  pillarId: PillarId,
  completedPillars: PillarId[]
): boolean {
  const pillar = getPillarById(pillarId)
  if (!pillar.unlockRequirement) return true // First pillar is always unlocked
  return completedPillars.includes(pillar.unlockRequirement)
}

export function getPillarProgress(
  completedActivities: string[],
  pillarId: PillarId
): {
  completed: number
  total: number
  percentage: number
} {
  const pillar = getPillarById(pillarId)
  const pillarActivityIds = pillar.activities.map((a) => a.id)
  const completedInPillar = completedActivities.filter((a) =>
    pillarActivityIds.includes(a)
  )

  return {
    completed: completedInPillar.length,
    total: pillar.activities.length,
    percentage: Math.round(
      (completedInPillar.length / pillar.activities.length) * 100
    ),
  }
}
