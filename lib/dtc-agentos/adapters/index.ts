/**
 * DTC AgentOS - Adapters Index
 * 
 * Central export for all flow adapters that connect
 * existing DTC components to the AgentOS memory system.
 */

// C1/A1 - DISC Assessment Flow
export {
  C1Adapter,
  A1Adapter,
  onC1Complete,
  onA1Complete,
  getDISCContext,
  type DISCProfile,
  type DISCInsight,
  type A1AnalysisResult
} from './c1-a1-adapter'

// C2/A2 - Professional Profile Flow
export {
  C2Adapter,
  A2Adapter,
  onC2ProfileComplete,
  onC2GoalsComplete,
  onA2Complete,
  getProfessionalContext,
  type ProfessionalProfile,
  type CareerGoals,
  type A2AnalysisResult
} from './c2-a2-adapter'

// A3 - Training Modules Flow
export {
  A3Adapter,
  MODULE_AGENT_MAPPING,
  MODULE_CATEGORIES,
  onA3SessionStart,
  onA3Interaction,
  onA3ModuleComplete,
  getA3Context,
  type ModuleSession,
  type ModuleProgress,
  type A3ModuleInteraction
} from './a3-adapter'

// A4 - Document Generation Flow
export {
  A4Adapter,
  buildA4Context,
  onA4DocumentGenerated,
  checkA4Readiness,
  getFullDocumentContext,
  type DocumentType,
  type DocumentGenerationRequest,
  type GeneratedDocument,
  type DocumentInsight
} from './a4-adapter'
