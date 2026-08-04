export type CareerModule =
  | "a0"
  | "a1"
  | "a2"
  | "a3"
  | "a4"
  | "profile"
  | "agent"
  | "import"
  | "system"

export type CareerTrend = "declining" | "stable" | "improving" | "unknown"
export type CareerGoalStatus = "active" | "paused" | "completed" | "archived"
export type CareerMemoryType =
  | "fact"
  | "preference"
  | "goal"
  | "constraint"
  | "pattern"
  | "decision"
  | "context"

export type SkillRelationship =
  | "supports"
  | "depends_on"
  | "transfers_to"
  | "conflicts_with"
  | "correlates_with"

export interface CareerIdentity {
  id: string
  userId: string
  version: number
  careerStage: string | null
  industry: string | null
  experienceLevel: string | null
  targetRoles: string[]
  targetCompanies: string[]
  strengths: string[]
  growthAreas: string[]
  valuesProfile: Record<string, unknown>
  motivators: string[]
  communicationProfile: Record<string, unknown>
  leadershipProfile: Record<string, unknown>
  interviewProfile: Record<string, unknown>
  learningProfile: Record<string, unknown>
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CareerGoal {
  id: string
  userId: string
  identityId: string
  title: string
  description: string | null
  status: CareerGoalStatus
  priority: 1 | 2 | 3 | 4 | 5
  targetDate: string | null
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CareerSkill {
  id: string
  userId: string
  identityId: string
  skillKey: string
  label: string
  score: number | null
  confidence: number
  trend: CareerTrend
  evidenceCount: number
  lastEvaluatedAt: string | null
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CareerSkillEdge {
  id: string
  userId: string
  sourceSkillId: string
  targetSkillId: string
  relationship: SkillRelationship
  weight: number
  metadata: Record<string, unknown>
  createdAt: string
}

export interface CareerEvidence {
  id: string
  userId: string
  identityId: string
  skillId: string | null
  sourceModule: CareerModule
  sourceType: string
  sourceRef: string | null
  assertion: string
  value: Record<string, unknown>
  confidence: number
  observedAt: string
  expiresAt: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

export interface CareerMemory {
  id: string
  userId: string
  identityId: string
  memoryType: CareerMemoryType
  key: string
  content: Record<string, unknown>
  importance: number
  confidence: number
  validFrom: string
  validUntil: string | null
  supersededBy: string | null
  sourceEvidenceId: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

export interface CareerProfileSnapshot {
  id: string
  userId: string
  identityId: string
  version: number
  snapshot: Record<string, unknown>
  reason: string
  createdAt: string
}

export interface CareerContext {
  identity: CareerIdentity
  goals: CareerGoal[]
  skills: CareerSkill[]
  skillEdges: CareerSkillEdge[]
  memories: CareerMemory[]
  recentEvidence: CareerEvidence[]
}
