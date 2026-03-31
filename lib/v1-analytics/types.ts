// V1 Observability Framework - Centralizado para todas las etapas
// Tracks drop-off points, confusion patterns, retention gaps

export type V1EventType = 
  // C1 - Intake Contextual
  | 'c1_started'
  | 'c1_question_viewed' 
  | 'c1_response_submitted'
  | 'c1_error_empty'
  | 'c1_error_save'
  | 'c1_completed'
  
  // A1 - Mapa Base
  | 'a1_intro_viewed'
  | 'a1_test_started'
  | 'a1_question_viewed'
  | 'a1_response_submitted'
  | 'a1_completed'
  | 'a1_resultado_viewed'
  | 'a1_4dimensions_understood'
  | 'a1_bridge_cta_clicked'
  
  // A2 - Misión 90 días
  | 'a2_intro_viewed'
  | 'a2_dashboard_viewed'
  | 'a2_sprint_viewed'
  | 'a2_checkpoint_completed'
  | 'a2_error_goal_save'
  
  // A3 - Entrenamiento
  | 'a3_page_viewed'
  | 'a3_entrevista0_started'
  | 'a3_entrevista0_completed'
  | 'a3_training_level_started'
  | 'a3_training_feedback_viewed'
  
  // A4 - Radar
  | 'a4_page_viewed'
  | 'a4_tab_switched'
  | 'a4_tool_interacted'
  | 'a4_content_consumed'
  
  // Cross-stage
  | 'user_returned'
  | 'session_abandoned'
  | 'error_occurred'
  | 'cta_skipped'

export interface V1AnalyticsEvent {
  event: V1EventType
  stage: 'c1' | 'a1' | 'a2' | 'a3' | 'a4' | 'cross'
  timestamp: string
  sessionId: string
  userId?: string
  metadata?: {
    questionIndex?: number
    duration?: number
    errorType?: string
    userChoice?: string
    timeOnPage?: number
    deviceType?: 'mobile' | 'desktop'
    retryCount?: number
  }
}

// Drop-off points we're observing in V1
export const V1_CRITICAL_POINTS = {
  c1: [
    'c1_error_empty', // User skips questions without answering
    'c1_error_save', // Save fails
    'c1_completed', // Baseline - should be high conversion
  ],
  a1: [
    'a1_test_started', // Do users start the test?
    'a1_response_submitted', // Can they answer questions?
    'a1_completed', // Do they finish?
    'a1_resultado_viewed', // Do they see results?
    'a1_bridge_cta_clicked', // Do they click to A2?
  ],
  a2: [
    'a2_intro_viewed', // Do they see A2 intro?
    'a2_dashboard_viewed', // Do they engage with dashboard?
    'a2_sprint_viewed', // Do they check sprints?
    'a2_checkpoint_completed', // Are they working through sprints?
  ],
  a3: [
    'a3_page_viewed',
    'a3_entrevista0_started', // Critical: Do they start Entrevista 0?
    'a3_entrevista0_completed',
    'a3_training_level_started', // Critical: Do they train?
  ],
  a4: [
    'a4_page_viewed',
    'a4_tool_interacted', // Critical: Do they explore the radar?
    'a4_content_consumed', // Are they reading/learning?
  ]
}

// Confusion patterns we want to detect
export const V1_CONFUSION_SIGNALS = {
  'c1_error_empty_multiple': 'User hitting empty validation repeatedly → UX confusion',
  'a1_long_time_no_submit': 'User reading question but not submitting → Decision paralysis or confusion',
  'a1_resultado_no_cta': 'User views results but doesn\'t click to A2 → Unclear next step',
  'a2_dashboard_no_sprint': 'User on A2 but doesn\'t explore sprints → Unclear structure',
  'a3_entrevista0_abandoned': 'User starts Entrevista 0 but abandons → Too hard or unclear',
  'a4_tab_switching_only': 'User only switches tabs but no content consumption → Overwhelm',
}

// Retention signals
export const V1_RETENTION_SIGNALS = {
  'user_returned_same_day': 'User comes back within 24h',
  'user_completed_2_stages': 'User completed at least 2 stages (C1 + A1, or A1 + A2)',
  'user_reached_a3': 'User reached A3 (critical threshold)',
  'user_reached_a4': 'User reached A4 (committed to full journey)',
  'checkpoint_completed': 'User actively working through A2 sprints',
}
