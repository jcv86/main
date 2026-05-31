/**
 * A1 Despega Cerebral - DISC Assessment Types
 */

export interface DISCProfile {
  D: number // Dominance (0-100)
  I: number // Influence (0-100)
  S: number // Steadiness (0-100)
  C: number // Conscientiousness (0-100)
}

export interface DISCResult {
  profile: DISCProfile
  dominantType: 'D' | 'I' | 'S' | 'C'
  secondaryType?: 'D' | 'I' | 'S' | 'C'
  description: string
  strengths: string[]
  challenges: string[]
  recommendations: string[]
  timestamp: Date
}

export interface A1Assessment {
  userId: string
  responses: Record<string, number> // Question ID to answer
  result: DISCResult
  completed: boolean
  completedAt?: Date
}
