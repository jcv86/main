// Day 1 - Contract Route Types
export interface RouteGate {
  identity: string
  evidence: string
  material: string
}

export interface RouteScores {
  clarity: number
  logic: number
  realism: number
  actionability: number
}

export interface Day1RouteSubmission {
  dayNumber: 1
  change30Days: string
  targetRole: string
  mainBlocker: string
  hypothesis: string
  gates: RouteGate
  roadmap: string
  scores: RouteScores
  totalScore: number
  passStatus: 'pass' | 'fail'
  completedAt: string
}

// Day 2 - Evidence Vault Types
export interface EvidenceFragment {
  id: string
  rawText: string
  type: 'achievement' | 'responsibility' | 'recognition' | 'number' | 'other'
  categories: string[]
  potentialCV: string
  potentialSTAR?: {
    situation: string
    task: string
    action: string
    result: string
  }
  potentialSkills: string[]
}

export interface EvidenceVault {
  vaultType: 'notion' | 'drive' | 'local' | 'dtc' | 'cloud'
  vaultLink: string
  fragments: EvidenceFragment[]
  goldPieces: EvidenceFragment[]
}

export interface Day2EvidenceSubmission {
  dayNumber: 2
  vaultData: EvidenceVault
  completedAt: string
}

// A2 Day Submission Union
export type A2DaySubmission = Day1RouteSubmission | Day2EvidenceSubmission

// Progress Tracking
export interface A2UserProgress {
  userId: string
  currentDay: number
  completedDays: number[]
  a1ProfileId?: string
  a3ModulesUnlocked: number[]
  xpTotal: number
  submissions: Record<number, A2DaySubmission>
  createdAt: string
  updatedAt: string
}
