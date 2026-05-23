/**
 * A4 DTC Documents - Knowledge Layer Types
 * 
 * A4 is the central DTC memory layer that connects C1, A1, C2, A2, and A3.
 * Documents stored here are analyzed by AI and used to update user profiles,
 * route state, coach behavior, A2 missions, and A3 interviews.
 */

// Document Types - All document categories in DTC
export type DTCDocumentType =
  | "route_contract"
  | "identity_statement"
  | "psychological_profile"
  | "work_style_profile"
  | "evidence_item"
  | "evidence_vault_summary"
  | "cv_draft"
  | "cv_bullet"
  | "executive_summary"
  | "linkedin_profile"
  | "star_answer"
  | "job_analysis"
  | "company_research"
  | "role_fit_matrix"
  | "application_tracker"
  | "interview_answer"
  | "interview_transcript"
  | "coach_feedback"
  | "module_feedback"
  | "reflection"
  | "daily_mission"
  | "portfolio_asset"
  | "final_deliverable"
  | "uploaded_file"
  | "ai_profile_analysis"
  | "profile_snapshot"

// Document Status - Lifecycle states
export type DTCDocumentStatus =
  | "draft"
  | "in_review"
  | "needs_revision"
  | "ready"
  | "approved"
  | "completed"
  | "final"
  | "archived"

// Document Source - Origin of document
export type DTCDocumentSource =
  | "user_created"
  | "ai_generated"
  | "travis_seed"
  | "uploaded"
  | "system_generated"

// Source Module - Which module created the document
export type DTCSourceModule =
  | "c1"
  | "a1"
  | "c2"
  | "a2"
  | "a3"
  | "a4"
  | "coach"
  | "system"

// Block Types for structured documents
export type DTCBlockType =
  | "paragraph"
  | "bullet_list"
  | "question_answer"
  | "star_answer"
  | "metric"
  | "evidence"
  | "coach_note"
  | "interview_question"
  | "transcript_line"

// Relation Types between documents
export type DTCRelationType =
  | "supports"
  | "contradicts"
  | "improves"
  | "derived_from"
  | "used_in"
  | "belongs_to_day"
  | "belongs_to_module"
  | "updates_profile"
  | "evidence_for"
  | "answer_for"
  | "cv_source"

// Requirement Level for day/module documents
export type DTCRequirementLevel =
  | "required"
  | "optional"
  | "generated"
  | "recommended"

// Signal Types for profile intelligence
export type DTCSignalType =
  | "strength"
  | "weakness"
  | "career_goal"
  | "target_role"
  | "proof_of_value"
  | "communication_style"
  | "leadership_signal"
  | "technical_depth"
  | "business_impact"
  | "interview_risk"
  | "missing_metric"
  | "confidence_level"
  | "cv_gap"
  | "evidence_gap"
  | "motivation_pattern"
  | "work_style"
  | "learning_style"
  | "coach_strategy"

// Extraction Types for AI analysis
export type DTCExtractionType =
  | "profile_signals"
  | "strengths"
  | "weaknesses"
  | "evidence_metrics"
  | "interview_risks"
  | "cv_bullets"
  | "star_structure"
  | "role_fit"
  | "communication_pattern"
  | "missing_proof"
  | "next_actions"

// Analysis Job Types
export type DTCJobType =
  | "analyze_document"
  | "extract_profile_signals"
  | "update_user_profile"
  | "generate_coach_feedback"
  | "build_a2_context"
  | "build_a3_context"
  | "score_interview_answer"

// Job Status
export type DTCJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"

// ============================================
// CORE INTERFACES
// ============================================

// Main Document Interface
export interface DTCDocument {
  id: string
  user_id: string
  title: string
  type: DTCDocumentType
  status: DTCDocumentStatus
  content: string
  plain_text?: string
  ai_summary?: string
  source_module: DTCSourceModule
  related_day?: number
  related_a3_module?: string
  source: DTCDocumentSource
  visibility: "private" | "coach" | "public"
  coach_feedback?: string
  tags?: string[]
  version: number
  parent_document_id?: string
  created_at: string
  updated_at: string
}

// Document Version for history tracking
export interface DTCDocumentVersion {
  id: string
  document_id: string
  version_number: number
  content: string
  plain_text?: string
  change_reason?: string
  created_by: string
  created_at: string
}

// Document Block for structured content
export interface DTCDocumentBlock {
  id: string
  document_id: string
  block_type: DTCBlockType
  title?: string
  content: string
  order_index: number
  metadata?: Record<string, any>
}

// Document Relations (many-to-many)
export interface DTCDocumentRelation {
  id: string
  source_document_id: string
  target_document_id: string
  relation_type: DTCRelationType
  strength: number // 0-100
  created_at: string
}

// Route Document Requirements
export interface DTCRouteDocumentRequirement {
  id: string
  route_type?: string
  day_number?: number
  a3_module_id?: string
  required_document_type: DTCDocumentType
  requirement_level: DTCRequirementLevel
  min_count: number
  completion_rule?: string
  created_at: string
}

// AI Extraction Results
export interface DTCDocumentAIExtraction {
  id: string
  document_id: string
  user_id: string
  extraction_type: DTCExtractionType
  extracted_json: Record<string, any>
  confidence: number // 0-100
  model_used: string
  created_at: string
}

// Profile Signals from documents
export interface DTCProfileSignal {
  id: string
  user_id: string
  source_document_id: string
  source_module: DTCSourceModule
  signal_type: DTCSignalType
  signal_value: string
  confidence: number // 0-100
  weight: number // 0-10
  polarity: "positive" | "negative" | "neutral"
  created_at: string
}

// User Profile Snapshot
export interface DTCUserProfileSnapshot {
  id: string
  user_id: string
  route_day: number
  snapshot_json: Record<string, any>
  profile_summary: string
  strengths_summary: string
  weaknesses_summary: string
  evidence_summary: string
  interview_readiness_score: number // 0-100
  cv_readiness_score: number // 0-100
  application_readiness_score: number // 0-100
  created_at: string
}

// Analysis Jobs Queue
export interface DTCAnalysisJob {
  id: string
  user_id: string
  document_id?: string
  job_type: DTCJobType
  status: DTCJobStatus
  input_payload: Record<string, any>
  output_payload?: Record<string, any>
  error?: string
  created_at: string
  completed_at?: string
}

// ============================================
// DAY DOCUMENT SET
// ============================================

// Documents required for a specific day
export interface DayDocumentSet {
  dayNumber: number
  title: string
  requiredDocuments: DTCDocumentType[]
  optionalDocuments: DTCDocumentType[]
  generatedDocuments: DTCDocumentType[]
}

// ============================================
// LIVE USER PROFILE
// ============================================

// Combined profile from all sources
export interface LiveUserProfile {
  userId: string
  targetRole?: string
  professionalIdentity?: string
  communicationStyle?: string
  workStyle?: string
  strengths: string[]
  weaknesses: string[]
  evidenceQuality: number // 0-100
  missingProof: string[]
  interviewRisks: string[]
  cvReadiness: number // 0-100
  interviewReadiness: number // 0-100
  applicationReadiness: number // 0-100
  recommendedCoachStrategy?: string
  currentRouteFocus?: string
  nextBestActions: string[]
  lastUpdated: string
}

// ============================================
// CONTEXT BUILDERS
// ============================================

// A2 Day Knowledge Context
export interface A2DayKnowledgeContext {
  dayNumber: number
  userId: string
  requiredDocuments: DTCRouteDocumentRequirement[]
  previousArtifacts: DTCDocument[]
  userProfileSnapshot: DTCUserProfileSnapshot | null
  missingEvidence: string[]
  relevantContext: {
    c1: DTCDocument[]
    a1: DTCDocument[]
    c2: DTCDocument[]
  }
  previousCoachFeedback: DTCDocument[]
  relatedA3Checkpoint?: string
}

// A3 Module Knowledge Context
export interface A3ModuleKnowledgeContext {
  moduleId: string
  userId: string
  c1IdentityDocuments: DTCDocument[]
  a1ProfileDocuments: DTCDocument[]
  c2EvidenceDocuments: DTCDocument[]
  relevantA2Artifacts: DTCDocument[]
  starAnswerBank: DTCDocument[]
  cvDrafts: DTCDocument[]
  jobAnalyses: DTCDocument[]
  previousA3Attempts: DTCDocument[]
  liveUserProfile: LiveUserProfile | null
}

// Coach Context
export interface CoachContext {
  userId: string
  userProfile: LiveUserProfile | null
  recentDocuments: DTCDocument[]
  recentFeedback: DTCDocument[]
  currentRouteDay: number
  currentA3Module?: string
  recommendedFocus: string[]
  coachingHistory: DTCDocument[]
}

// ============================================
// CREATE/UPDATE PAYLOADS
// ============================================

export interface CreateDocumentPayload {
  user_id: string
  title: string
  type: DTCDocumentType
  content: string
  source_module: DTCSourceModule
  related_day?: number
  related_a3_module?: string
  source?: DTCDocumentSource
  tags?: string[]
}

export interface UpdateDocumentPayload {
  title?: string
  content?: string
  status?: DTCDocumentStatus
  ai_summary?: string
  coach_feedback?: string
  tags?: string[]
}
