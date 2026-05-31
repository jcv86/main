/**
 * DTC AgentOS - A3 Adapter
 * 
 * Connects the Training Modules flow (A3) with Coach/Sofia/Elena/Bruno agents
 * to the AgentOS memory and evaluation system.
 */

import { DTCAgentOS } from '../index'

// ============================================================================
// TYPES
// ============================================================================

export type ModuleSession = any
export type A3ModuleInteraction = any

// Module to agent mapping
export const MODULE_AGENT_MAPPING: Record<number, string> = {
  1: 'coach',
  2: 'coach',
  3: 'coach',
  4: 'coach',
  5: 'coach',
  6: 'coach',
  7: 'sofia',
  8: 'sofia',
  9: 'elena',
  10: 'bruno'
}

// ============================================================================
// A3 ADAPTER - TRAINING MODULES
// ============================================================================

/**
 * Hook to call when user starts an A3 module session
 */
export async function onA3SessionStart(
  userId: string,
  moduleId: number,
  sessionId: string
): Promise<void> {
  const agentId = MODULE_AGENT_MAPPING[moduleId] || 'coach'
  console.log(`[A3] Session started - Module ${moduleId}, Agent: ${agentId}`)
}

/**
 * Hook to call when user completes an A3 module interaction
 */
export async function onA3Interaction(
  userId: string,
  moduleId: number,
  sessionId: string,
  interaction: A3ModuleInteraction
): Promise<void> {
  const agentId = MODULE_AGENT_MAPPING[moduleId] || 'coach'
  
  await DTCAgentOS.logAgentRun({
    userId,
    agentId,
    context: { moduleId, sessionId },
    response: { interaction_recorded: true },
    memoriesExtracted: 1,
    tokensUsed: 0
  })
}

/**
 * Hook to call when user completes an A3 module
 */
export async function onA3ModuleComplete(
  userId: string,
  moduleId: number,
  sessionId: string,
  results: any
): Promise<void> {
  const agentId = MODULE_AGENT_MAPPING[moduleId] || 'coach'
  
  await DTCAgentOS.logAgentRun({
    userId,
    agentId,
    context: { moduleId },
    response: { module_complete: true },
    memoriesExtracted: 2,
    tokensUsed: 0
  })
}
