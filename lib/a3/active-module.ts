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

export function getActiveA3Module(value: unknown): A3ModuleDefinition | null {
  const module = getA3Module(value)
  if (!module || module.id !== 'job-decoder') return module

  return {
    ...module,
    completionContract: {
      enabled: true,
      minimumResponses: 0,
      minimumResponseLength: 0,
      requiredDeliverableKeys: JOB_DECODER_DELIVERABLE_KEYS,
      passScore: 75,
    },
  }
}
