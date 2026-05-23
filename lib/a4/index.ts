/**
 * A4 DTC Documents - Main Index
 * 
 * Central export point for all A4 document system functionality.
 * Import from '@/lib/a4' to use any A4 function.
 */

// Core Types
export type {
  DTCDocument,
  DTCDocumentType,
  DTCDocumentStatus,
  DTCDocumentSource,
  DTCSourceModule,
  DTCDocumentVersion,
  DTCDocumentBlock,
  DTCDocumentRelation,
  DTCBlockType,
  DTCRelationType,
  DTCRequirementLevel,
  DTCRouteDocumentRequirement,
  DTCDocumentAIExtraction,
  DTCExtractionType,
  DTCProfileSignal,
  DTCSignalType,
  DTCUserProfileSnapshot,
  DTCAnalysisJob,
  DTCJobType,
  DTCJobStatus,
  DayDocumentSet,
  LiveUserProfile,
  A2DayKnowledgeContext,
  A3ModuleKnowledgeContext,
  CoachContext,
  CreateDocumentPayload,
  UpdateDocumentPayload,
} from './types'

// Document Engine - CRUD operations
export {
  createDocument,
  updateDocument,
  getDocument,
  getDocumentsByUser,
  getDocumentsByDay,
  getDocumentsByA3Module,
  getDocumentsByType,
  archiveDocument,
  createDocumentVersion,
  getDocumentVersions,
  relateDocuments,
  getRelatedDocuments,
  getRequiredDocumentsForDay,
  canCompleteDayDocuments,
  ensureDocumentsForDay,
  getDocumentStats,
} from './document-engine'

// Document Intelligence - AI analysis pipeline
export {
  processDocumentIntelligence,
  analyzeDocument,
  extractProfileSignals,
  saveProfileSignals,
  createAnalysisJob,
  updateAnalysisJobStatus,
} from './document-intelligence'

// Profile Signals - User intelligence
export {
  getUserSignals,
  getSignalsByType,
  getTopStrengths,
  getWeaknesses,
  deactivateSignalsFromDocument,
  getSignalStats,
  getCareerGoals,
  getTargetRoles,
  getWorkStyle,
  getEvidenceQualityScore,
  getInterviewReadinessScore,
  getCVReadinessScore,
  getCoachStrategy,
  getMissingProofAreas,
  getNextBestActions,
} from './profile-signals'

// Profile Snapshots - Point-in-time intelligence
export {
  getLiveUserProfile,
  createProfileSnapshot,
  getLatestSnapshot,
  getSnapshotByDay,
  getUserSnapshots,
  calculateSnapshotProgress,
  getUserProgressOverTime,
  shouldCreateSnapshot,
  rebuildUserProfileSnapshot,
} from './profile-snapshot'

// Context Integration - A2/A3 bridges
export {
  getA2DayKnowledgeContext,
  getA3ModuleKnowledgeContext,
  getCoachContext,
  getCVContext,
  getInterviewContext,
} from './context-integration'

// Travis Seed - Development mode
export {
  seedTravisDocuments,
  seedTravisDocumentsUntilDay,
  seedTravisA3Context,
  clearSeededDocuments,
  isTravisMode,
} from './travis-seed'
