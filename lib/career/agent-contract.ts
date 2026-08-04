import type {
  CareerContext,
  CareerEvidence,
  CareerGoal,
  CareerIdentity,
  CareerMemory,
  CareerSkill,
  CareerSkillEdge,
  CareerModule,
  CareerMemoryType,
  CareerTrend,
  SkillRelationship,
} from "@/lib/career/types"

export interface AgentActor {
  agentId: string
  agentVersion: string
  module: CareerModule
  correlationId: string
}

export interface EvidenceInput {
  skillId?: string | null
  sourceModule: CareerModule
  sourceType: string
  sourceRef?: string | null
  assertion: string
  value?: Record<string, unknown>
  confidence: number
  observedAt?: string
  expiresAt?: string | null
  metadata?: Record<string, unknown>
}

export interface MemoryInput {
  memoryType: CareerMemoryType
  key: string
  content: Record<string, unknown>
  importance: number
  confidence: number
  sourceEvidenceId?: string | null
  validFrom?: string
  validUntil?: string | null
  metadata?: Record<string, unknown>
}

export interface SkillUpsertInput {
  skillKey: string
  label: string
  score?: number | null
  confidence: number
  trend?: CareerTrend
  metadata?: Record<string, unknown>
}

export interface SkillEdgeInput {
  sourceSkillId: string
  targetSkillId: string
  relationship: SkillRelationship
  weight?: number
  metadata?: Record<string, unknown>
}

export interface GoalInput {
  title: string
  description?: string | null
  priority?: 1 | 2 | 3 | 4 | 5
  targetDate?: string | null
  metadata?: Record<string, unknown>
}

export interface CareerIdentityPatch {
  careerStage?: string | null
  industry?: string | null
  experienceLevel?: string | null
  targetRoles?: string[]
  targetCompanies?: string[]
  strengths?: string[]
  growthAreas?: string[]
  valuesProfile?: Record<string, unknown>
  motivators?: string[]
  communicationProfile?: Record<string, unknown>
  leadershipProfile?: Record<string, unknown>
  interviewProfile?: Record<string, unknown>
  learningProfile?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export interface CareerReadPort {
  getContext(userId: string): Promise<CareerContext>
  getIdentity(userId: string): Promise<CareerIdentity | null>
  listGoals(userId: string): Promise<CareerGoal[]>
  listSkills(userId: string): Promise<CareerSkill[]>
  listSkillEdges(userId: string): Promise<CareerSkillEdge[]>
  listEvidence(userId: string, limit?: number): Promise<CareerEvidence[]>
  listMemories(userId: string, keys?: string[]): Promise<CareerMemory[]>
}

export interface CareerWritePort {
  ensureIdentity(userId: string, actor: AgentActor): Promise<CareerIdentity>
  patchIdentity(userId: string, patch: CareerIdentityPatch, actor: AgentActor): Promise<CareerIdentity>
  createGoal(userId: string, input: GoalInput, actor: AgentActor): Promise<CareerGoal>
  upsertSkill(userId: string, input: SkillUpsertInput, actor: AgentActor): Promise<CareerSkill>
  connectSkills(userId: string, input: SkillEdgeInput, actor: AgentActor): Promise<CareerSkillEdge>
  createEvidence(userId: string, input: EvidenceInput, actor: AgentActor): Promise<CareerEvidence>
  createMemory(userId: string, input: MemoryInput, actor: AgentActor): Promise<CareerMemory>
  supersedeMemory(userId: string, memoryId: string, replacement: MemoryInput, actor: AgentActor): Promise<CareerMemory>
  snapshotIdentity(userId: string, reason: string, actor: AgentActor): Promise<string>
}

export interface CareerService extends CareerReadPort, CareerWritePort {}

export function assertConfidence(value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError("confidence must be a finite number between 0 and 100")
  }
}

export function assertWeight(value: number): void {
  if (!Number.isFinite(value) || value < -1 || value > 1) {
    throw new RangeError("weight must be a finite number between -1 and 1")
  }
}
