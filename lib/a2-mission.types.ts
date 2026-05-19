/**
 * A2 Daily Mission Types & Interfaces
 * Defines the structure for 90-day roadmap daily missions
 */

/**
 * 11 mission types covering all A2 daily activities
 */
export type A2MissionType =
  | "roadmap_gate"         // Day 1: Vision, milestones, roadmap creation + DTC validation
  | "mirror"               // Self-understanding, work-style reflection, blockers, strengths
  | "evidence"             // Extracting achievements, proof, stories, professional value
  | "builder"              // Creating assets: CV, answers, question lists, trackers
  | "market_intel"         // Analyzing job market, roles, companies, keywords
  | "coach_forge"          // Submitting material for coach improvement
  | "field_action"         // Real-world actions: LinkedIn, job boards, applications, follow-ups
  | "performance_drill"    // Voice, delivery, pause, simulation warm-up, pressure rehearsal
  | "a3_checkpoint"        // Planned A3 module checkpoint day
  | "debrief"              // Review results, extract lessons, adjust route
  | "milestone"            // Day 30, 60, 90 checkpoints

/**
 * Daily mission status states
 */
export type A2DayStatus = 
  | "locked"               // Cannot access yet
  | "available"            // Ready to start
  | "in_progress"          // User is working on it
  | "completed"            // Finished successfully
  | "needs_revision"       // Validation failed, needs rework

/**
 * A3 checkpoint day metadata
 * Maps A2 day to specific A3 module
 */
export interface A3Checkpoint {
  moduleNumber: number                    // 1-10
  moduleId: string                        // e.g., 'career-mirror'
  moduleTitle: string                     // Spanish title
  route: string                           // Full route path
  requiredPreviousModules: string[]       // Module IDs that must be completed first
}

/**
 * Daily unlock requirements
 */
export interface UnlockRequirements {
  requiresDay1Passed: boolean             // Must have passed Day 1 DTC validation
  requiredPreviousDay?: number            // Must complete previous day first (usually X-1)
  requiredCompletedA3Modules?: string[]   // A3 modules that must be done before
}

/**
 * DTC validation for Day 1 and checkpoint days
 */
export interface DTCValidation {
  required: boolean                       // Does this day require DTC analysis?
  passScore?: number                      // Minimum score to pass (Day 1: 75)
  criteria?: string[]                     // Scoring criteria labels
}

/**
 * Messages and results on completion
 */
export interface CompletionResult {
  onPass: string                          // Message if passed
  onFail: string                          // Message if failed
}

/**
 * Main A2 Daily Mission interface
 * Every dia-x route uses this structure
 */
export interface A2DailyMission {
  day: number                             // Day number 1-90
  slug: string                            // Route slug: 'dia-1', 'dia-2', etc.
  title: string                           // Spanish mission title
  subtitle: string                        // Short description (1-2 sentences)
  
  // Mission classification
  missionType: A2MissionType              // Type of activity
  
  // Time estimate (all days: 20-90 min range)
  estimatedMinutes: {
    min: number                           // Minimum minutes
    max: number                           // Maximum minutes
  }
  
  // Phase label for UI grouping
  phaseLabel: "Foundation" | "Role Alignment" | "Simulation & Certification" | "Master Difficult Questions & Return to Real Market" | "Final Applications & Offer Management" | "Final A3 Prep & Checkpoint" | "Final Review & Next Chapter"
  
  // A3 checkpoint metadata (only if this is a checkpoint day)
  a3Checkpoint?: A3Checkpoint
  
  // Unlock & gate logic
  unlockRequirements: UnlockRequirements
  
  // User-facing content
  userGoal: string                        // What user should accomplish
  whyItMatters: string                    // Why this step is important
  instructions: string[]                  // Step-by-step instructions
  
  // Deliverable specification
  deliverable: string                     // What user must produce/submit
  
  // Validation rules
  dtcValidation: DTCValidation
  
  // Result messages
  completionResult: CompletionResult
  
  // Notion template link (for save/sync)
  notionTemplate?: string
}

/**
 * Day 1 specific DTC scoring model
 * 4 criteria × 25 points each = 100 total
 */
export interface Day1DTCScore {
  visionClarity: number                   // 0-25: Role target, environment, outcome clarity
  milestoneQuality: number                // 0-25: Day 10, 20, 30 goals realistic & measurable
  completeness: number                    // 0-25: Job apps, networking, learning, growth covered
  realismCoherence: number                // 0-25: Overall plan coherence and feasibility
  totalScore: number                      // 0-100 (sum of above)
  passed: boolean                         // totalScore >= 75
  feedback: string                        // Detailed feedback
  strengths: string[]                     // What was done well
  improvements: string[]                  // Areas needing work
}

/**
 * Day 1 submission data
 * Saved to database for tracking and revision
 */
export interface Day1Submission {
  id: string                              // UUID
  userId: string                          // User ID
  
  // Step 1: Vision answers
  visionAnswers?: {
    role: string                          // Target role/title
    environment: string                   // Ideal work environment
    desiredOutcome: string                // What to achieve in 30 days
  }
  
  // Step 2: Coach enhancement
  coachEnhancedVision?: string             // LLM-improved version
  coachVersion?: number                   // Revision count
  
  // Step 3: Milestones
  milestones?: {
    day10: string
    day20: string
    day30: string
  }
  coachEnhancedMilestones?: {
    day10: string
    day20: string
    day30: string
  }
  
  // Step 4: Action plan
  actionPlan?: {
    applications: string[]
    networking: string[]
    learning: string[]
    personalGrowth: string[]
  }
  coachEnhancedActionPlan?: {
    applications: string[]
    networking: string[]
    learning: string[]
    personalGrowth: string[]
  }
  
  // Step 6: File upload
  uploadedFilePath?: string               // Vercel Blob path
  uploadedFileName?: string               // Original filename
  uploadedAt?: string                     // ISO timestamp
  
  // Step 7: DTC Analysis
  dtcScore?: Day1DTCScore
  
  // Tracking
  submissionCount: number                 // How many times resubmitted
  createdAt: string                       // ISO timestamp
  updatedAt: string                       // ISO timestamp
  completedAt?: string                    // When passed (if passed)
}
