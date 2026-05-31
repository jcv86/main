/**
 * DTC AgentOS - Mode Registry
 * 
 * Defines all behavioral modes in the system that control
 * how agents interact with users.
 */

import type { ModeConfig, ModeId } from '../types'

export const dtcModes: Record<ModeId, ModeConfig> = {
  // ==========================================================================
  // ONBOARDING - Initial user setup
  // ==========================================================================
  onboarding: {
    id: 'onboarding',
    name: 'Onboarding',
    behavior: `Guide through initial setup with care and patience.
- Ask ONE question at a time
- Capture key profile data progressively
- Validate inputs before moving forward
- Never overwhelm with too much information
- Celebrate small completions`,
    allowedActions: ['ask_question', 'capture_response', 'validate_input'],
  },

  // ==========================================================================
  // IDENTITY-AUDIT - Deep exploration
  // ==========================================================================
  'identity-audit': {
    id: 'identity-audit',
    name: 'Identity Audit',
    behavior: `Deep exploration of professional identity and patterns.
- Ask reflective questions that provoke insight
- Discover patterns without judgment
- Synthesize findings into actionable insights
- Connect past experiences to future potential
- Avoid leading questions - let user discover`,
    allowedActions: ['ask_reflection', 'analyze_response', 'synthesize_patterns'],
  },

  // ==========================================================================
  // COACHING - Teaching and guiding
  // ==========================================================================
  coaching: {
    id: 'coaching',
    name: 'Coaching',
    behavior: `Teach and guide with structured methodology.
- Explain concepts clearly before practicing
- Ask ONE practice question at a time
- Give specific, actionable feedback
- Build on what user already knows
- Avoid overwhelming with too much content`,
    allowedActions: ['explain_concept', 'ask_practice', 'give_feedback'],
  },

  // ==========================================================================
  // BASIC-INTERVIEW - Entry level practice
  // ==========================================================================
  'basic-interview': {
    id: 'basic-interview',
    name: 'Basic Interview',
    behavior: `Friendly interview practice that builds confidence.
- Simple, clear questions
- Gentle follow-ups if response incomplete
- Constructive evaluation focused on growth
- Encourage attempts even if imperfect
- Celebrate progress and good structure`,
    allowedActions: ['ask_question', 'follow_up', 'evaluate', 'encourage'],
  },

  // ==========================================================================
  // ADVANCED-INTERVIEW - Mid-senior level
  // ==========================================================================
  'advanced-interview': {
    id: 'advanced-interview',
    name: 'Advanced Interview',
    behavior: `Deeper probing for mid-senior candidates.
- Challenge vague or generic responses
- Detect contradictions and probe them
- Require concrete evidence and examples
- Evaluate depth of experience
- Give direct but fair feedback`,
    allowedActions: ['ask_question', 'challenge', 'request_evidence', 'evaluate'],
  },

  // ==========================================================================
  // PRO-INTERVIEW - Executive level pressure
  // ==========================================================================
  'pro-interview': {
    id: 'pro-interview',
    name: 'Pro Interview',
    behavior: `Executive-level pressure and standards.
- Expect concise, impactful answers
- Demand quantifiable metrics
- Test under pressure with challenging questions
- No tolerance for fluff or vagueness
- Brutally honest but useful feedback`,
    allowedActions: ['ask_executive', 'stress_test', 'demand_metrics', 'evaluate'],
  },

  // ==========================================================================
  // DOCUMENT-REVIEW - Analyzing written materials
  // ==========================================================================
  'document-review': {
    id: 'document-review',
    name: 'Document Review',
    behavior: `Thorough analysis of professional documents.
- Analyze structure and organization
- Assess clarity and readability
- Check evidence quality and specificity
- Evaluate market fit and relevance
- Provide prioritized improvement suggestions`,
    allowedActions: ['analyze_document', 'suggest_improvements', 'score'],
  },

  // ==========================================================================
  // EVALUATION - Scoring and feedback
  // ==========================================================================
  evaluation: {
    id: 'evaluation',
    name: 'Evaluation',
    behavior: `Structured scoring and detailed feedback.
- Score against defined criteria
- Identify specific strengths
- Pinpoint areas for improvement
- Provide actionable recommendations
- Be fair and consistent`,
    allowedActions: ['score_response', 'identify_strengths', 'identify_improvements'],
  },

  // ==========================================================================
  // BACKGROUND - System operations
  // ==========================================================================
  background: {
    id: 'background',
    name: 'Background',
    behavior: `Silent background operations.
- No user-facing interaction
- Process data and update state
- Log operations for debugging
- Handle errors gracefully`,
    allowedActions: [],
  },

  // ==========================================================================
  // DEV - Development mode
  // ==========================================================================
  dev: {
    id: 'dev',
    name: 'Development',
    behavior: `Development and testing mode.
- Show missing context clearly
- Allow seed data generation
- Never fake production progress
- Enable inspection of any state
- Warn about missing dependencies`,
    allowedActions: ['inspect', 'warn_missing', 'seed_demo_data'],
  },
}

/**
 * Get mode configuration by ID
 */
export function getMode(modeId: ModeId): ModeConfig | null {
  return dtcModes[modeId] ?? null
}

/**
 * Check if an action is allowed in a mode
 */
export function isActionAllowed(modeId: ModeId, action: string): boolean {
  const mode = getMode(modeId)
  if (!mode) return false
  return mode.allowedActions.includes(action as never)
}

/**
 * Get the appropriate mode for A3 modules based on module and level
 */
export function getA3Mode(
  moduleId: string,
  level: 'basic' | 'advanced' | 'pro'
): ModeConfig {
  // Modules 1-6 use coaching mode
  const coachingModules = [
    'auditoria-inicial',
    'metodo-star',
    'cv-inteligente',
    'analisis-vacante',
    'analisis-multimodal',
    'entrenamiento-guiado',
  ]

  if (coachingModules.includes(moduleId)) {
    return dtcModes.coaching
  }

  // Modules 7-10 use interview modes based on level
  switch (level) {
    case 'basic':
      return dtcModes['basic-interview']
    case 'advanced':
      return dtcModes['advanced-interview']
    case 'pro':
      return dtcModes['pro-interview']
    default:
      return dtcModes['basic-interview']
  }
}

/**
 * Build mode behavior instructions for AI prompt
 */
export function buildModeBehavior(mode: ModeConfig): string {
  return `MODO: ${mode.name}

COMPORTAMIENTO ESPERADO:
${mode.behavior}

ACCIONES PERMITIDAS:
${mode.allowedActions.length > 0 
    ? mode.allowedActions.map(a => `- ${a}`).join('\n')
    : '- Solo operaciones de sistema'
}`
}
