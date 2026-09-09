import { z } from 'zod'

export const ANALYTICS_EVENTS = [
  'c1_started', 'c1_question_viewed', 'c1_response_submitted', 'c1_error_empty',
  'c1_error_save', 'c1_completed', 'a1_intro_viewed', 'a1_test_started',
  'a1_question_viewed', 'a1_response_submitted', 'a1_completed',
  'a1_resultado_viewed', 'a1_4dimensions_understood', 'a1_bridge_cta_clicked',
  'a2_intro_viewed', 'a2_dashboard_viewed', 'a2_sprint_viewed',
  'a2_checkpoint_completed', 'a2_error_goal_save', 'a3_page_viewed',
  'a3_entrevista0_started', 'a3_entrevista0_completed', 'a3_training_level_started',
  'a3_training_feedback_viewed', 'a4_page_viewed', 'a4_tab_switched',
  'a4_tool_interacted', 'a4_content_consumed', 'user_returned',
  'session_abandoned', 'error_occurred', 'cta_skipped',
] as const

export const ANALYTICS_STAGES = ['c1', 'a1', 'a2', 'a3', 'a4', 'cross'] as const

const stageForEvent = (
  event: typeof ANALYTICS_EVENTS[number],
): typeof ANALYTICS_STAGES[number] => {
  const prefix = event.slice(0, 2)
  return ANALYTICS_STAGES.includes(prefix as typeof ANALYTICS_STAGES[number])
    ? prefix as typeof ANALYTICS_STAGES[number]
    : 'cross'
}

// Deliberately excludes free-form answers/userChoice and arbitrary error messages.
const metadataSchema = z.object({
  questionIndex: z.number().int().min(0).max(500).optional(),
  duration: z.number().int().min(0).max(86_400_000).optional(),
  errorType: z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/i).optional(),
  timeOnPage: z.number().int().min(0).max(86_400_000).optional(),
  deviceType: z.enum(['mobile', 'desktop']).optional(),
  retryCount: z.number().int().min(0).max(100).optional(),
}).strict()

export const eventSchema = z.object({
  event: z.enum(ANALYTICS_EVENTS),
  stage: z.enum(ANALYTICS_STAGES),
  sessionId: z.string().min(8).max(128).regex(/^session_[a-zA-Z0-9_-]+$/),
  metadata: metadataSchema.optional(),
}).strict().refine(
  ({ event, stage }) => stageForEvent(event) === stage,
  { message: 'Event does not belong to stage', path: ['stage'] },
)
