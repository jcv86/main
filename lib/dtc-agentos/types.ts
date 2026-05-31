/**
 * DTC AgentOS - Core Type Definitions
 * 
 * This file defines all TypeScript interfaces for the AgentOS system,
 * including Commands, Agents, Modes, Memory, and Context.
 */

// =============================================================================
// MEMORY TYPES
// =============================================================================

export type MemorySourceType = 'c1' | 'a1' | 'c2' | 'a2' | 'a3' | 'a4' | 'coaching' | 'system'

export type MemoryItemType = 
  | 'career_goal'
  | 'role_target'
  | 'skill'
  | 'strength'
  | 'weakness'
  | 'achievement'
  | 'challenge'
  | 'communication_style'
  | 'interview_pattern'
  | 'learning_preference'
  | 'constraint'
  | 'motivation'
  | 'company_preference'
  | 'market_region'
  | 'evidence'
  | 'star_story'
  | 'feedback_received'

export interface MemoryItem {
  id: string
  userId: string
  sourceType: MemorySourceType
  sourceId?: string
  memoryType: MemoryItemType
  title?: string
  content: string
  confidence: number // 0-1
  importance: number // 0-1
  validFrom: Date
  validUntil?: Date | null
  metadata?: Record<string, unknown>
  createdAt: Date
}

export interface CaptureMemoryPayload {
  userId: string
  sourceType: MemorySourceType
  sourceId?: string
  memoryType: MemoryItemType
  title?: string
  content: string
  confidence?: number
  importance?: number
  metadata?: Record<string, unknown>
}

// =============================================================================
// COMMAND TYPES
// =============================================================================

export type CommandId = 
  | '/dtc:c1-profile-capture'
  | '/dtc:a1-identity-audit'
  | '/dtc:c2-context-bridge'
  | '/dtc:a2-generate-day'
  | '/dtc:a3-run-interview'
  | '/dtc:a3-evaluate-answer'
  | '/dtc:a4-create-document'
  | '/dtc:a4-review-document'
  | '/dtc:memory-update'
  | '/dtc:unlock-check'
  | '/dtc:context-build'

export type ContextKey = 
  | 'user_profile'
  | 'user_profile_snapshot'
  | 'identity_audit'
  | 'career_direction'
  | 'disc_results'
  | 'module_state'
  | 'documents'
  | 'previous_interviews'
  | 'previous_audits'
  | 'previous_days'
  | 'a3_progress'
  | 'interview_turn'
  | 'module_rubric'
  | 'user_context'
  | 'previous_evaluations'
  | 'market_data'
  | 'career_goal'
  | 'template'
  | 'related_day'
  | 'related_module'

export type WritesTo = 
  | 'user_profile_snapshot'
  | 'memory_items'
  | 'identity_audit'
  | 'career_direction'
  | 'dtc_days'
  | 'day_tasks'
  | 'interview_turns'
  | 'evaluations'
  | 'dtc_documents'
  | 'next_recommendation'
  | 'document_insights'
  | 'agent_runs'
  | 'unlock_events'

export interface CommandConfig {
  id: CommandId
  name: string
  description: string
  requiredContext: ContextKey[]
  optionalContext: ContextKey[]
  allowedAgents: AgentId[]
  allowedModes: ModeId[]
  writesTo: WritesTo[]
  timeout?: number // ms
}

// =============================================================================
// AGENT TYPES
// =============================================================================

export type AgentId = 
  | 'coach'
  | 'sofia'
  | 'elena'
  | 'bruno'
  | 'cv_analyst'
  | 'document_reviewer'
  | 'system'

export type EvaluationFocus = 
  | 'clarity'
  | 'growth_mindset'
  | 'action_oriented'
  | 'structure'
  | 'authenticity'
  | 'communication'
  | 'depth'
  | 'evidence'
  | 'strategic_thinking'
  | 'executive_presence'
  | 'measurable_impact'
  | 'pressure_handling'
  | 'ats_compatibility'
  | 'impact_statements'
  | 'market_fit'
  | 'coherence'
  | 'evidence_quality'
  | 'goal_alignment'

export type AgentUseCase = 
  | 'modules_1_6'
  | 'modules_7_10_basic'
  | 'modules_7_10_advanced'
  | 'modules_7_10_pro'
  | 'a2_guidance'
  | 'correction'
  | 'onboarding'
  | 'cv_review'
  | 'document_analysis'
  | 'a4_documents'
  | 'star_stories'
  | 'evidence_review'

export interface AgentConfig {
  id: AgentId
  name: string
  role: string
  tone: string
  useCases: AgentUseCase[]
  systemPrompt: string
  evaluationFocus: EvaluationFocus[]
  avatar?: string
  color?: string
}

// =============================================================================
// MODE TYPES
// =============================================================================

export type ModeId = 
  | 'onboarding'
  | 'identity-audit'
  | 'coaching'
  | 'basic-interview'
  | 'advanced-interview'
  | 'pro-interview'
  | 'document-review'
  | 'evaluation'
  | 'background'
  | 'dev'

export type ModeAction = 
  | 'ask_question'
  | 'capture_response'
  | 'validate_input'
  | 'ask_reflection'
  | 'analyze_response'
  | 'synthesize_patterns'
  | 'explain_concept'
  | 'ask_practice'
  | 'give_feedback'
  | 'follow_up'
  | 'evaluate'
  | 'encourage'
  | 'challenge'
  | 'request_evidence'
  | 'ask_executive'
  | 'stress_test'
  | 'demand_metrics'
  | 'analyze_document'
  | 'suggest_improvements'
  | 'score'
  | 'score_response'
  | 'identify_strengths'
  | 'identify_improvements'
  | 'inspect'
  | 'warn_missing'
  | 'seed_demo_data'

export interface ModeConfig {
  id: ModeId
  name: string
  behavior: string
  allowedActions: ModeAction[]
}

// =============================================================================
// CONTEXT TYPES
// =============================================================================

export interface UserProfile {
  id: string
  email?: string
  name?: string
  currentStage?: string
  currentDay?: number
  readinessScore?: number
  createdAt: Date
}

export interface ModuleState {
  moduleId: string
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed'
  currentLevel?: 'basic' | 'advanced' | 'pro'
  progress: number // 0-100
  attempts: number
  bestScore?: number
  lastAttemptAt?: Date
}

export interface DayProgress {
  dayNumber: number
  status: 'locked' | 'active' | 'completed'
  tasksCompleted: number
  totalTasks: number
  reflection?: string
  evidence?: string[]
}

export interface DocumentRef {
  id: string
  type: string
  title: string
  status: 'draft' | 'review' | 'final'
  score?: number
  createdAt: Date
}

export interface InterviewSummary {
  id: string
  moduleId: string
  agentId: AgentId
  level: 'basic' | 'advanced' | 'pro'
  score: number
  completedAt: Date
  patternObserved?: string
}

export interface UnlockState {
  modules: Record<string, boolean>
  levels: Record<string, 'basic' | 'advanced' | 'pro'>
  features: Record<string, boolean>
}

export interface DTCContext {
  user: UserProfile
  memory: MemoryItem[]
  agent: AgentConfig
  mode: ModeConfig
  module?: ModuleState | null
  day?: DayProgress | null
  documents: DocumentRef[]
  unlocks: UnlockState
  previousInterviews: InterviewSummary[]
  isDevMode: boolean
  timestamp: Date
}

// =============================================================================
// EVALUATION TYPES
// =============================================================================

export interface RubricCriterion {
  id: string
  name: string
  description: string
  weight: number // 0-1, should sum to 1 across all criteria
  scoringGuide: {
    1: string
    2: string
    3: string
    4: string
    5: string
  }
}

export interface ModuleRubric {
  moduleId: string
  criteria: RubricCriterion[]
  passingScore: number
  levelThresholds: {
    basic: number
    advanced: number
    pro: number
  }
}

export interface EvaluationScore {
  criterionId: string
  score: number // 1-5
  feedback: string
}

export interface Evaluation {
  id: string
  userId: string
  moduleId: string
  agentId: AgentId
  questionId: string
  question: string
  answer: string
  scores: EvaluationScore[]
  totalScore: number // Weighted average
  overallFeedback: string
  strengths: string[]
  improvements: string[]
  patternObserved?: string
  nextRecommendation?: string
  confidence: number
  createdAt: Date
}

// =============================================================================
// UNLOCK TYPES
// =============================================================================

export type UnlockConditionType = 
  | 'module_complete'
  | 'day_reached'
  | 'memory_exists'
  | 'score_threshold'
  | 'document_count'
  | 'document_score'
  | 'evidence_count'
  | 'basic_interview_complete'
  | 'advanced_interview_complete'
  | 'time_elapsed'

export interface UnlockCondition {
  type: UnlockConditionType
  moduleId?: string
  module?: string
  day?: number
  memoryType?: MemoryItemType
  score?: number
  docType?: string
  minScore?: number
  min?: number
  hours?: number
}

export interface UnlockRule {
  key: string
  name: string
  conditions: UnlockCondition[]
  allRequired: boolean
}

export interface UnlockResult {
  key: string
  unlocked: boolean
  missing: string[]
  progress?: number // 0-100 progress toward unlock
}

// =============================================================================
// COMMAND EXECUTION TYPES
// =============================================================================

export interface CommandInput {
  userId: string
  command: CommandId
  agent?: AgentId
  mode?: ModeId
  moduleId?: string
  dayNumber?: number
  payload?: Record<string, unknown>
}

export interface CommandResult<T = unknown> {
  success: boolean
  command: CommandId
  data?: T
  error?: string
  memoriesWritten?: MemoryItem[]
  agentRunId?: string
  duration?: number
}

// =============================================================================
// DEV MODE TYPES
// =============================================================================

export type DevModeAction = 
  | 'inspect'
  | 'seed'
  | 'simulate'

export interface DevModeResponse {
  status: 'ok' | 'missing_context' | 'seeded' | 'simulated'
  missing?: string[]
  availableActions?: {
    action: string
    description: string
    blocks?: string[]
    warning?: string
  }[]
  seededData?: Record<string, unknown>
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface AgentRunLog {
  id: string
  userId: string
  command: CommandId
  agent: AgentId
  mode: ModeId
  inputContext: Record<string, unknown>
  outputData: Record<string, unknown>
  tokensUsed?: number
  durationMs: number
  success: boolean
  errorMessage?: string
  createdAt: Date
}

export interface MissingContextError {
  code: 'MISSING_CONTEXT'
  missingKeys: ContextKey[]
  command: CommandId
  suggestions: string[]
}
