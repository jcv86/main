/**
 * Travis Dev Mode Route State Engine
 * Type system for C1→A1→C2→A2→A3→A4 connection flow
 * Enables seeded data access across all modules without requiring prerequisites
 */

// ═══════════════════════════════════════════════════════════════════════════
// ROUTE MODES
// ═══════════════════════════════════════════════════════════════════════════

export type RouteMode = 'production' | 'travis_dev' | 'qa_test' | 'demo'

export interface RouteModeConfig {
  mode: RouteMode
  allowBypassUnlock: boolean           // Travis/QA: Unlock any day
  autoSeedMissingData: boolean         // Travis: Auto-fill missing prerequisites
  showDebugPanel: boolean              // Travis: Show debug controls
  persistSeededData: boolean           // Travis: Save seeded data to DB
  allowOfflineMode: boolean            // QA: Work without DB
}

// ═══════════════════════════════════════════════════════════════════════════
// C1: Professional Identity
// ═══════════════════════════════════════════════════════════════════════════

export interface C1ProfessionalIdentity {
  userId: string
  targetRole: string                   // e.g., "Product Manager"
  targetIndustry: string               // e.g., "SaaS / Technology"
  yearsExperience: number
  keyStrengths: string[]               // e.g., "Leadership", "Data Analysis"
  uniqueValue: string                  // 1-2 sentences differentiator
  workStyle: 'collaborative' | 'independent' | 'hybrid'
  preferredEnvironment: string[]       // Remote, startup, enterprise, etc
  careerGoal: string                   // 3-5 year vision
  completedAt?: Date
}

// ═══════════════════════════════════════════════════════════════════════════
// A1: Communication Profile & Work Style Assessment
// ═══════════════════════════════════════════════════════════════════════════

export interface A1CommunicationProfile {
  userId: string
  communicationStyle: 'direct' | 'collaborative' | 'diplomatic' | 'analytical'
  responseTime: 'quick' | 'thoughtful' | 'detailed'
  preferredMedium: 'written' | 'verbal' | 'mixed'
  strengthAreas: string[]              // Communication, presentation, writing, etc
  improvementAreas: string[]
  stressResponse: string               // How you handle pressure
  motivationFactors: string[]          // What drives you
  workPreferences: Record<string, string | boolean>
  completedAt?: Date
}

// ═══════════════════════════════════════════════════════════════════════════
// C2: Evidence & Achievement Vault
// ═══════════════════════════════════════════════════════════════════════════

export interface Achievement {
  id: string
  title: string
  context: string                      // Situation
  action: string                       // What you did
  result: string                       // Outcome with metrics
  skills: string[]                     // STAR method skills
  quantifiedMetric?: string            // "30% improvement", "2M revenue"
  industry: string
  role: string
}

export interface C2EvidenceVault {
  userId: string
  achievements: Achievement[]
  caseStudies: Array<{
    id: string
    title: string
    problemStatement: string
    yourRole: string
    approach: string
    results: string
    skills: string[]
    timeframe: string
  }>
  testimonials: Array<{
    id: string
    source: string                     // Who said it
    relationship: string               // Manager, peer, client
    quote: string
    skillsHighlighted: string[]
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
  }>
  completedAt?: Date
}

// ═══════════════════════════════════════════════════════════════════════════
// A2: Day-by-Day Mission State
// ═══════════════════════════════════════════════════════════════════════════

export interface A2DayState {
  dayNumber: number
  slug: string                         // 'dia-1', 'dia-2', etc
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  completedAt?: Date
  deliverableUrl?: string              // Where user's work is stored
  validationScore?: number             // 0-100
  validationFeedback?: string
  contextFromC1?: Partial<C1ProfessionalIdentity>
  contextFromA1?: Partial<A1CommunicationProfile>
  contextFromC2?: Partial<C2EvidenceVault>
}

export interface A2RouteState {
  userId: string
  currentDay: number
  totalDaysCompleted: number
  days: Record<number, A2DayState>     // Map of day number to state
  missedDaysToday: number[]            // Days skipped (for backfill)
  xpEarned: number
  completedAt?: Date
}

// ═══════════════════════════════════════════════════════════════════════════
// A3: Checkpoint Module State
// ═══════════════════════════════════════════════════════════════════════════

export interface A3AttemptSession {
  sessionId: string
  startedAt: Date
  completedAt?: Date
  duration: number                     // seconds
  responses: Record<string, string | number | boolean>
  score?: number
  status: 'in_progress' | 'completed' | 'abandoned'
}

export interface A3ModuleState {
  moduleId: string                     // 'career-mirror', 'job-decoder'
  moduleNumber: number                 // 1-10
  dayNumber: number                    // 7, 16, 27, etc
  status: 'locked' | 'available' | 'completed'
  unlocked: boolean
  prerequisitesComplete: boolean
  attempts: A3AttemptSession[]
  lastAttemptAt?: Date
  certificationStatus: 'not_certified' | 'in_progress' | 'certified'
  certifiedAt?: Date                   // When certification was earned
  reportUrl?: string                   // Where validation report saved
}

export interface A3RouteState {
  userId: string
  modules: Record<string, A3ModuleState>  // 10 modules
  completedModuleCount: number
  totalXp: number
  certificationDate?: Date
  completedAt?: Date
}

// ═══════════════════════════════════════════════════════════════════════════
// A4: (Minimal stub for future expansion)
// ═══════════════════════════════════════════════════════════════════════════

export interface A4RouteState {
  userId: string
  nextSteps: string[]
  opportunitiesIdentified: number
  applicationsSubmitted: number
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPLETE USER ROUTE STATE
// ═══════════════════════════════════════════════════════════════════════════

export interface UserRouteState {
  userId: string
  mode: RouteMode
  status: 'incomplete' | 'in_progress' | 'completed'
  lastUpdated: Date
  createdAt: Date
  
  // The 5 interconnected systems
  c1?: C1ProfessionalIdentity
  a1?: A1CommunicationProfile
  c2?: C2EvidenceVault
  a2?: A2RouteState
  a3?: A3RouteState
  a4?: A4RouteState
  
  // Metadata
  dataQuality: {
    c1Complete: boolean
    a1Complete: boolean
    c2Complete: boolean
    a2Complete: boolean
    a3Complete: boolean
  }
  
  // Seeded flag (Travis mode)
  seededDataUsed: boolean
  seededAt?: Date
  seededBy?: string                    // 'travis_mode' | 'qa_test'
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT RETRIEVAL TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface RouteContext {
  fullState: UserRouteState
  c1Context: C1ProfessionalIdentity | null
  a1Context: A1CommunicationProfile | null
  c2Context: C2EvidenceVault | null
  a2Context: A2RouteState | null
  a3Context: A3RouteState | null
  missingData: string[]                // List of missing sections
  canAccess: (dayNumber: number) => boolean
  canAccessModule: (moduleId: string) => boolean
}

export interface A2DayContext {
  day: A2DayState
  mission: any                         // A2DailyMission from config
  c1: Partial<C1ProfessionalIdentity> | null
  a1: Partial<A1CommunicationProfile> | null
  c2: Partial<C2EvidenceVault> | null
  isUnlocked: boolean
  isDev: boolean                       // True if in dev mode (travis_dev/qa_test)
  lockReason?: string                  // Why locked if applicable
}

export interface A3ModuleContext {
  module: A3ModuleState
  checkpoint: any                      // A3Checkpoint from map
  c1: Partial<C1ProfessionalIdentity> | null
  a1: Partial<A1CommunicationProfile> | null
  a2: Partial<A2RouteState> | null
  isUnlocked: boolean
  isDev: boolean                       // True if in dev mode
  lockReason?: string
  previousModules: A3ModuleState[]
}
