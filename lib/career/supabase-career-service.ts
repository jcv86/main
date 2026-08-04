import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { CareerContext, CareerIdentity } from "@/lib/career/types"
import type { AgentActor, CareerIdentityPatch } from "@/lib/career/agent-contract"

const IDENTITY_SELECT = "*"

function toIdentity(row: Record<string, any>): CareerIdentity {
  return {
    id: row.id,
    userId: row.user_id,
    version: row.version,
    careerStage: row.career_stage,
    industry: row.industry,
    experienceLevel: row.experience_level,
    targetRoles: row.target_roles ?? [],
    targetCompanies: row.target_companies ?? [],
    strengths: row.strengths ?? [],
    growthAreas: row.growth_areas ?? [],
    valuesProfile: row.values_profile ?? {},
    motivators: row.motivators ?? [],
    communicationProfile: row.communication_profile ?? {},
    leadershipProfile: row.leadership_profile ?? {},
    interviewProfile: row.interview_profile ?? {},
    learningProfile: row.learning_profile ?? {},
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toDbPatch(patch: CareerIdentityPatch): Record<string, unknown> {
  return {
    ...(patch.careerStage !== undefined && { career_stage: patch.careerStage }),
    ...(patch.industry !== undefined && { industry: patch.industry }),
    ...(patch.experienceLevel !== undefined && { experience_level: patch.experienceLevel }),
    ...(patch.targetRoles !== undefined && { target_roles: patch.targetRoles }),
    ...(patch.targetCompanies !== undefined && { target_companies: patch.targetCompanies }),
    ...(patch.strengths !== undefined && { strengths: patch.strengths }),
    ...(patch.growthAreas !== undefined && { growth_areas: patch.growthAreas }),
    ...(patch.valuesProfile !== undefined && { values_profile: patch.valuesProfile }),
    ...(patch.motivators !== undefined && { motivators: patch.motivators }),
    ...(patch.communicationProfile !== undefined && { communication_profile: patch.communicationProfile }),
    ...(patch.leadershipProfile !== undefined && { leadership_profile: patch.leadershipProfile }),
    ...(patch.interviewProfile !== undefined && { interview_profile: patch.interviewProfile }),
    ...(patch.learningProfile !== undefined && { learning_profile: patch.learningProfile }),
    ...(patch.metadata !== undefined && { metadata: patch.metadata }),
  }
}

export class CareerAccessError extends Error {
  constructor(message = "Career service access denied") {
    super(message)
    this.name = "CareerAccessError"
  }
}

export class SupabaseCareerService {
  constructor(private readonly supabase: SupabaseClient) {}

  private async assertAuthenticatedUser(userId: string): Promise<void> {
    const { data, error } = await this.supabase.auth.getUser()
    if (error || !data.user || data.user.id !== userId) {
      throw new CareerAccessError()
    }
  }

  private validateActor(actor: AgentActor): void {
    if (!actor.agentId || !actor.agentVersion || !actor.correlationId) {
      throw new TypeError("Agent actor metadata is incomplete")
    }
  }

  async getIdentity(userId: string): Promise<CareerIdentity | null> {
    await this.assertAuthenticatedUser(userId)
    const { data, error } = await this.supabase
      .from("career_identities")
      .select(IDENTITY_SELECT)
      .eq("user_id", userId)
      .maybeSingle()

    if (error) throw error
    return data ? toIdentity(data) : null
  }

  async ensureIdentity(userId: string, actor: AgentActor): Promise<CareerIdentity> {
    await this.assertAuthenticatedUser(userId)
    this.validateActor(actor)

    const existing = await this.getIdentity(userId)
    if (existing) return existing

    const { data, error } = await this.supabase
      .from("career_identities")
      .insert({
        user_id: userId,
        metadata: {
          createdBy: actor.agentId,
          agentVersion: actor.agentVersion,
          module: actor.module,
          correlationId: actor.correlationId,
        },
      })
      .select(IDENTITY_SELECT)
      .single()

    if (error) throw error
    return toIdentity(data)
  }

  async patchIdentity(
    userId: string,
    patch: CareerIdentityPatch,
    actor: AgentActor,
  ): Promise<CareerIdentity> {
    await this.assertAuthenticatedUser(userId)
    this.validateActor(actor)
    await this.ensureIdentity(userId, actor)

    const dbPatch = toDbPatch(patch)
    const { data, error } = await this.supabase
      .from("career_identities")
      .update(dbPatch)
      .eq("user_id", userId)
      .select(IDENTITY_SELECT)
      .single()

    if (error) throw error
    return toIdentity(data)
  }

  async getContext(userId: string): Promise<CareerContext> {
    await this.assertAuthenticatedUser(userId)
    const identity = await this.getIdentity(userId)
    if (!identity) {
      throw new Error("Career Identity has not been initialized")
    }

    const [goals, skills, skillEdges, memories, recentEvidence] = await Promise.all([
      this.supabase.from("career_goals").select("*").eq("user_id", userId).neq("status", "archived"),
      this.supabase.from("career_skills").select("*").eq("user_id", userId),
      this.supabase.from("career_skill_edges").select("*").eq("user_id", userId),
      this.supabase
        .from("career_memories")
        .select("*")
        .eq("user_id", userId)
        .is("superseded_by", null)
        .order("importance", { ascending: false }),
      this.supabase
        .from("career_evidence")
        .select("*")
        .eq("user_id", userId)
        .order("observed_at", { ascending: false })
        .limit(100),
    ])

    for (const result of [goals, skills, skillEdges, memories, recentEvidence]) {
      if (result.error) throw result.error
    }

    return {
      identity,
      goals: (goals.data ?? []).map((row: any) => ({
        id: row.id, userId: row.user_id, identityId: row.identity_id, title: row.title,
        description: row.description, status: row.status, priority: row.priority,
        targetDate: row.target_date, metadata: row.metadata ?? {}, createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      skills: (skills.data ?? []).map((row: any) => ({
        id: row.id, userId: row.user_id, identityId: row.identity_id, skillKey: row.skill_key,
        label: row.label, score: row.score == null ? null : Number(row.score),
        confidence: Number(row.confidence), trend: row.trend, evidenceCount: row.evidence_count,
        lastEvaluatedAt: row.last_evaluated_at, metadata: row.metadata ?? {},
        createdAt: row.created_at, updatedAt: row.updated_at,
      })),
      skillEdges: (skillEdges.data ?? []).map((row: any) => ({
        id: row.id, userId: row.user_id, sourceSkillId: row.source_skill_id,
        targetSkillId: row.target_skill_id, relationship: row.relationship,
        weight: Number(row.weight), metadata: row.metadata ?? {}, createdAt: row.created_at,
      })),
      memories: (memories.data ?? []).map((row: any) => ({
        id: row.id, userId: row.user_id, identityId: row.identity_id, memoryType: row.memory_type,
        key: row.key, content: row.content, importance: Number(row.importance),
        confidence: Number(row.confidence), validFrom: row.valid_from, validUntil: row.valid_until,
        supersededBy: row.superseded_by, sourceEvidenceId: row.source_evidence_id,
        metadata: row.metadata ?? {}, createdAt: row.created_at,
      })),
      recentEvidence: (recentEvidence.data ?? []).map((row: any) => ({
        id: row.id, userId: row.user_id, identityId: row.identity_id, skillId: row.skill_id,
        sourceModule: row.source_module, sourceType: row.source_type, sourceRef: row.source_ref,
        assertion: row.assertion, value: row.value ?? {}, confidence: Number(row.confidence),
        observedAt: row.observed_at, expiresAt: row.expires_at, metadata: row.metadata ?? {},
        createdAt: row.created_at,
      })),
    }
  }
}
