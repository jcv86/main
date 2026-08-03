import {
  getA3Module,
  type A3ModuleDefinition,
} from '@/lib/a3/module-catalog'

const JOB_DECODER_DELIVERABLE_KEYS = [
  'jobTitle',
  'company',
  'jobPosting',
  'mustHaveRequirements',
  'niceToHaveRequirements',
  'hiddenSignals',
  'strongMatches',
  'partialMatches',
  'gapPlan',
  'likelyQuestions',
  'applicationAdjustments',
  'priorityKeywords',
]

const ANSWER_ARCHITECTURE_DELIVERABLE_KEYS = [
  'selfIntroduction',
  'motivation',
  'strengthEvidence',
  'challengeStar',
  'whyHire',
  'timing30',
  'timing45',
  'timing60',
]

const COACH_PRACTICE_DELIVERABLE_KEYS = [
  'introOriginal',
  'introImproved',
  'introLearning',
  'motivationOriginal',
  'motivationImproved',
  'motivationLearning',
  'challengeOriginal',
  'challengeImproved',
  'challengeLearning',
]

const COMMUNICATION_GYM_DELIVERABLE_KEYS = [
  'introScript',
  'introDurationSeconds',
  'motivationScript',
  'motivationDurationSeconds',
  'pauseDurations',
  'paceAssessment',
  'clarityAssessment',
  'fillerAssessment',
  'confidenceAssessment',
  'endingAssessment',
  'improvementFocus',
  'improvedScript',
  'improvedDurationSeconds',
  'reflection',
]

export function getActiveA3Module(value: unknown): A3ModuleDefinition | null {
  const module = getA3Module(value)
  if (!module) return null

  const requiredDeliverableKeys =
    module.id === 'job-decoder'
      ? JOB_DECODER_DELIVERABLE_KEYS
      : module.id === 'answer-architecture'
        ? ANSWER_ARCHITECTURE_DELIVERABLE_KEYS
        : module.id === 'coach-practice-room'
          ? COACH_PRACTICE_DELIVERABLE_KEYS
          : module.id === 'communication-gym'
            ? COMMUNICATION_GYM_DELIVERABLE_KEYS
            : null

  if (!requiredDeliverableKeys) return module

  return {
    ...module,
    completionContract: {
      enabled: true,
      minimumResponses: 0,
      minimumResponseLength: 0,
      requiredDeliverableKeys,
      passScore: 75,
    },
  }
}
