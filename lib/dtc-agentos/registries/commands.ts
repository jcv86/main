/**
 * DTC AgentOS - Command Registry
 * 
 * Defines all available commands in the system, their required/optional context,
 * allowed agents/modes, and what data they write.
 */

import type { CommandConfig, CommandId } from '../types'

export const dtcCommands: Record<CommandId, CommandConfig> = {
  // ==========================================================================
  // C1: Profile Capture
  // ==========================================================================
  '/dtc:c1-profile-capture': {
    id: '/dtc:c1-profile-capture',
    name: 'Profile Capture',
    description: 'Captures initial user profile from C1 onboarding responses',
    requiredContext: [],
    optionalContext: ['user_profile'],
    allowedAgents: ['coach', 'system'],
    allowedModes: ['onboarding', 'background'],
    writesTo: ['user_profile_snapshot', 'memory_items'],
    timeout: 30000,
  },

  // ==========================================================================
  // A1: Identity Audit
  // ==========================================================================
  '/dtc:a1-identity-audit': {
    id: '/dtc:a1-identity-audit',
    name: 'Identity Audit',
    description: 'Analyzes A1 test results and DISC profile to extract identity insights',
    requiredContext: ['user_profile_snapshot'],
    optionalContext: ['disc_results', 'previous_audits'],
    allowedAgents: ['coach', 'system'],
    allowedModes: ['identity-audit', 'background'],
    writesTo: ['identity_audit', 'memory_items'],
    timeout: 60000,
  },

  // ==========================================================================
  // C2: Context Bridge
  // ==========================================================================
  '/dtc:c2-context-bridge': {
    id: '/dtc:c2-context-bridge',
    name: 'Context Bridge',
    description: 'Bridges C1 profile and A1 identity to define career direction',
    requiredContext: ['user_profile_snapshot', 'identity_audit'],
    optionalContext: ['market_data'],
    allowedAgents: ['coach'],
    allowedModes: ['coaching'],
    writesTo: ['career_direction', 'memory_items'],
    timeout: 45000,
  },

  // ==========================================================================
  // A2: Day Generation
  // ==========================================================================
  '/dtc:a2-generate-day': {
    id: '/dtc:a2-generate-day',
    name: 'Generate Day',
    description: 'Generates adaptive daily tasks based on full user context',
    requiredContext: ['career_direction', 'identity_audit'],
    optionalContext: ['documents', 'previous_days', 'a3_progress'],
    allowedAgents: ['coach'],
    allowedModes: ['coaching', 'background'],
    writesTo: ['dtc_days', 'day_tasks'],
    timeout: 60000,
  },

  // ==========================================================================
  // A3: Interview Session
  // ==========================================================================
  '/dtc:a3-run-interview': {
    id: '/dtc:a3-run-interview',
    name: 'Run Interview',
    description: 'Runs an interview session with context-aware questions',
    requiredContext: ['user_profile', 'career_goal', 'identity_audit', 'module_state'],
    optionalContext: ['documents', 'previous_interviews', 'market_data'],
    allowedAgents: ['coach', 'sofia', 'elena', 'bruno'],
    allowedModes: ['coaching', 'basic-interview', 'advanced-interview', 'pro-interview'],
    writesTo: ['interview_turns', 'evaluations', 'memory_items'],
    timeout: 120000,
  },

  // ==========================================================================
  // A3: Evaluate Answer
  // ==========================================================================
  '/dtc:a3-evaluate-answer': {
    id: '/dtc:a3-evaluate-answer',
    name: 'Evaluate Answer',
    description: 'Evaluates an interview answer against module rubrics',
    requiredContext: ['interview_turn', 'module_rubric', 'user_context'],
    optionalContext: ['previous_evaluations'],
    allowedAgents: ['coach', 'sofia', 'elena', 'bruno'],
    allowedModes: ['evaluation'],
    writesTo: ['evaluations', 'memory_items', 'next_recommendation'],
    timeout: 30000,
  },

  // ==========================================================================
  // A4: Create Document
  // ==========================================================================
  '/dtc:a4-create-document': {
    id: '/dtc:a4-create-document',
    name: 'Create Document',
    description: 'Creates a new document with context from memory',
    requiredContext: ['user_profile'],
    optionalContext: ['related_day', 'related_module', 'template', 'documents'],
    allowedAgents: ['coach', 'document_reviewer'],
    allowedModes: ['document-review', 'coaching'],
    writesTo: ['dtc_documents', 'memory_items'],
    timeout: 60000,
  },

  // ==========================================================================
  // A4: Review Document
  // ==========================================================================
  '/dtc:a4-review-document': {
    id: '/dtc:a4-review-document',
    name: 'Review Document',
    description: 'Reviews and scores a document with detailed feedback',
    requiredContext: ['user_profile'],
    optionalContext: ['career_goal', 'identity_audit', 'documents'],
    allowedAgents: ['cv_analyst', 'document_reviewer', 'coach'],
    allowedModes: ['document-review'],
    writesTo: ['evaluations', 'document_insights', 'memory_items'],
    timeout: 45000,
  },

  // ==========================================================================
  // Memory: Update
  // ==========================================================================
  '/dtc:memory-update': {
    id: '/dtc:memory-update',
    name: 'Memory Update',
    description: 'Updates user memory from any source action',
    requiredContext: ['user_profile'],
    optionalContext: [],
    allowedAgents: ['system'],
    allowedModes: ['background'],
    writesTo: ['memory_items'],
    timeout: 10000,
  },

  // ==========================================================================
  // Unlock: Check
  // ==========================================================================
  '/dtc:unlock-check': {
    id: '/dtc:unlock-check',
    name: 'Check Unlock',
    description: 'Checks if a feature/module/level can be unlocked',
    requiredContext: ['user_profile'],
    optionalContext: ['documents', 'a3_progress', 'previous_interviews'],
    allowedAgents: ['system'],
    allowedModes: ['background'],
    writesTo: ['unlock_events'],
    timeout: 5000,
  },

  // ==========================================================================
  // Context: Build
  // ==========================================================================
  '/dtc:context-build': {
    id: '/dtc:context-build',
    name: 'Build Context',
    description: 'Builds full context for a command execution',
    requiredContext: ['user_profile'],
    optionalContext: [],
    allowedAgents: ['system'],
    allowedModes: ['background'],
    writesTo: [],
    timeout: 10000,
  },
}

/**
 * Get command configuration by ID
 */
export function getCommand(commandId: CommandId): CommandConfig | null {
  return dtcCommands[commandId] ?? null
}

/**
 * Get all commands allowed for a specific agent
 */
export function getCommandsForAgent(agentId: string): CommandConfig[] {
  return Object.values(dtcCommands).filter(cmd => 
    cmd.allowedAgents.includes(agentId as never)
  )
}

/**
 * Get all commands allowed in a specific mode
 */
export function getCommandsForMode(modeId: string): CommandConfig[] {
  return Object.values(dtcCommands).filter(cmd => 
    cmd.allowedModes.includes(modeId as never)
  )
}

/**
 * Validate that a command can be executed with given agent and mode
 */
export function validateCommandExecution(
  commandId: CommandId,
  agentId: string,
  modeId: string
): { valid: boolean; errors: string[] } {
  const command = getCommand(commandId)
  const errors: string[] = []

  if (!command) {
    errors.push(`Unknown command: ${commandId}`)
    return { valid: false, errors }
  }

  if (!command.allowedAgents.includes(agentId as never)) {
    errors.push(`Agent "${agentId}" is not allowed to execute "${commandId}"`)
  }

  if (!command.allowedModes.includes(modeId as never)) {
    errors.push(`Mode "${modeId}" is not allowed for "${commandId}"`)
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Get required context keys for a command
 */
export function getRequiredContext(commandId: CommandId): string[] {
  const command = getCommand(commandId)
  return command?.requiredContext ?? []
}

/**
 * Get all context keys (required + optional) for a command
 */
export function getAllContext(commandId: CommandId): string[] {
  const command = getCommand(commandId)
  if (!command) return []
  return [...command.requiredContext, ...command.optionalContext]
}
