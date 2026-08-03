export const JOB_DECODER_DRAFT_KEY = 'dtc:a3:job-decoder:draft:v1'

export interface A3CvContext {
  targetRole: string
  targetKeywords: string[]
  skills: string[]
  achievements: string[]
  available: boolean
}

export interface JobDecoderContext {
  cvBuilder?: A3CvContext | null
}

export interface JobDecoderDraft {
  jobTitle: string
  company: string
  jobPosting: string
  mustHaveRequirements: string
  niceToHaveRequirements: string
  hiddenSignals: string
  strongMatches: string
  partialMatches: string
  gapPlan: string
  likelyQuestions: string
  applicationAdjustments: string
  priorityKeywords: string
}

export const EMPTY_JOB_DECODER_DRAFT: JobDecoderDraft = {
  jobTitle: '',
  company: '',
  jobPosting: '',
  mustHaveRequirements: '',
  niceToHaveRequirements: '',
  hiddenSignals: '',
  strongMatches: '',
  partialMatches: '',
  gapPlan: '',
  likelyQuestions: '',
  applicationAdjustments: '',
  priorityKeywords: '',
}

export function splitDecoderLines(value: unknown): string[] {
  if (typeof value !== 'string') return []
  return value
    .split(/\r?\n|;/)
    .map((item) => item.trim().replace(/^[-•*]\s*/, ''))
    .filter(Boolean)
}

export function splitDecoderKeywords(value: unknown): string[] {
  if (typeof value !== 'string') return []
  return value
    .split(/,|\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function normalizeDecoderText(value: string): string {
  return value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function extractCvContext(value: unknown): A3CvContext {
  const deliverable =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  const text = (key: string) =>
    typeof deliverable[key] === 'string' ? String(deliverable[key]).trim() : ''

  const targetRole = text('targetRole')
  const targetKeywords = splitDecoderKeywords(text('targetKeywords'))
  const skills = splitDecoderKeywords(text('skills'))
  const achievements = [text('achievement1'), text('achievement2'), text('achievement3')].filter(
    Boolean,
  )

  return {
    targetRole,
    targetKeywords,
    skills,
    achievements,
    available:
      targetRole.length > 0 ||
      targetKeywords.length > 0 ||
      skills.length > 0 ||
      achievements.length > 0,
  }
}

export function countCvOfferOverlap(
  offerItems: string[],
  context: A3CvContext | null | undefined,
): number {
  if (!context?.available) return 0

  const cvItems = [
    context.targetRole,
    ...context.targetKeywords,
    ...context.skills,
    ...context.achievements,
  ]
    .map(normalizeDecoderText)
    .filter((item) => item.length >= 3)

  const normalizedOffer = offerItems
    .map(normalizeDecoderText)
    .filter((item) => item.length >= 3)

  return normalizedOffer.filter((offerItem) =>
    cvItems.some(
      (cvItem) => cvItem.includes(offerItem) || offerItem.includes(cvItem),
    ),
  ).length
}
