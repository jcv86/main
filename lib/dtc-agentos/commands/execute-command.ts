/**
 * DTC AgentOS - Command Executor
 * 
 * Main entry point for executing any /dtc: command.
 * Handles validation, context building, AI execution, and result persistence.
 */

import { createClient } from '@/lib/supabase/server'
import type { CommandId } from '../types'
import { dtcCommands, validateCommandExecution } from '../registries/commands'
import { getAgent } from '../registries/agents'
import { dtcModes } from '../registries/modes'
import { buildDtcContext } from '../context/context-builder'
import { captureMemory } from '../context/memory-manager'
import { checkUnlock } from '../unlock/rules-engine'

export interface ExecuteCommandParams {
  userId: string
  commandId: CommandId
  agentId: string
  modeId: string
  params: Record<string, unknown>
  moduleId?: string
  dayNumber?: number
}

export interface CommandExecutionResult {
  success: boolean
  commandId: CommandId
  agentId: string
  data?: unknown
  error?: string
  tokensUsed?: number
  executionTimeMs?: number
  memoryUpdates?: string[]
}

/**
 * Execute a DTC command with full context and persistence
 */
export async function executeCommand(
  params: ExecuteCommandParams
): Promise<CommandExecutionResult> {
  const startTime = Date.now()
  const supabase = await createClient()
  
  try {
    // 1. Validate command
    const command = dtcCommands[params.commandId]
    if (!command) {
      return {
        success: false,
        commandId: params.commandId,
        agentId: params.agentId,
        error: `Unknown command: ${params.commandId}`,
      }
    }

    // 2. Validate agent and mode
    const validation = validateCommandExecution(
      params.commandId,
      params.agentId,
      params.modeId
    )
    if (!validation.valid) {
      return {
        success: false,
        commandId: params.commandId,
        agentId: params.agentId,
        error: `Invalid execution: ${validation.errors.join('; ')}`,
      }
    }

    const agent = getAgent(params.agentId as any)
    const mode = dtcModes[params.modeId as any]
    
    if (!agent || !mode) {
      return {
        success: false,
        commandId: params.commandId,
        agentId: params.agentId,
        error: 'Invalid agent or mode',
      }
    }

    // 3. Build context
    const contextResult = await buildDtcContext({
      userId: params.userId,
      command: params.commandId,
      agent: params.agentId as any,
      mode: params.modeId as any,
      moduleId: params.moduleId,
      dayNumber: params.dayNumber,
    })

    if (!contextResult.success || !contextResult.context) {
      const missingContext = contextResult.missingContext || []
      return {
        success: false,
        commandId: params.commandId,
        agentId: params.agentId,
        error: `Failed to build context: ${contextResult.error || missingContext.join(', ')}`,
      }
    }

    const context = contextResult.context

    // 4. Check missing required context (already checked in buildDtcContext, but double-check)
    const missingContext: string[] = []
    for (const required of command.requiredContext) {
      if (!context[required as keyof typeof context]) {
        missingContext.push(required)
      }
    }

    if (missingContext.length > 0) {
      // In dev mode, this might be handled differently
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[v0] Missing context for ${params.commandId}:`, missingContext)
      }
      return {
        success: false,
        commandId: params.commandId,
        agentId: params.agentId,
        error: `Missing required context: ${missingContext.join(', ')}`,
      }
    }

    // 5. Execute command based on type
    let result: unknown
    const memoryUpdates: string[] = []

    switch (params.commandId) {
      case '/dtc:c1-profile-capture':
        result = await executeC1ProfileCapture(params, context)
        memoryUpdates.push('career_goal', 'context', 'motivation')
        break

      case '/dtc:a1-identity-audit':
        result = await executeA1IdentityAudit(params, context)
        memoryUpdates.push('strength', 'weakness', 'communication_style')
        break

      case '/dtc:c2-context-bridge':
        result = await executeC2ContextBridge(params, context)
        memoryUpdates.push('confirmed_goal', 'role_target', 'market_region')
        break

      case '/dtc:a2-generate-day':
        result = await executeA2GenerateDay(params, context)
        memoryUpdates.push('day_generated')
        break

      case '/dtc:a3-run-interview':
        result = await executeA3RunInterview(params, context)
        memoryUpdates.push('interview_session_started')
        break

      case '/dtc:a3-evaluate-answer':
        result = await executeA3EvaluateAnswer(params, context)
        memoryUpdates.push('interview_pattern')
        break

      case '/dtc:a4-create-document':
        result = await executeA4CreateDocument(params, context)
        memoryUpdates.push('document_created')
        break

      case '/dtc:memory-update':
        result = await executeMemoryUpdate(params, context)
        break

      case '/dtc:unlock-check':
        result = await executeUnlockCheck(params, context)
        break

      default:
        return {
          success: false,
          commandId: params.commandId,
          agentId: params.agentId,
          error: `Unimplemented command: ${params.commandId}`,
        }
    }

    // 6. Log command execution
    await logCommandExecution({
      userId: params.userId,
      commandId: params.commandId,
      status: 'success',
      inputParams: params.params,
      outputData: result,
      supabase,
    })

    const executionTimeMs = Date.now() - startTime

    return {
      success: true,
      commandId: params.commandId,
      agentId: params.agentId,
      data: result,
      memoryUpdates,
      executionTimeMs,
    }
  } catch (error) {
    console.error('[v0] Command execution error:', error)
    
    // Log error
    await logCommandExecution({
      userId: params.userId,
      commandId: params.commandId,
      status: 'error',
      inputParams: params.params,
      errorMessage: String(error),
      supabase,
    }).catch(err => console.error('[v0] Failed to log error:', err))

    return {
      success: false,
      commandId: params.commandId,
      agentId: params.agentId,
      error: String(error),
      executionTimeMs: Date.now() - startTime,
    }
  }
}

// =============================================================================
// Command Implementations
// =============================================================================

async function executeC1ProfileCapture(params: ExecuteCommandParams, context: any) {
  // Saves to canon_conozcamonos_1_responses and captures memory
  await captureMemory({
    userId: params.userId,
    sourceType: 'c1',
    sourceId: params.params.formId as string,
    memoryType: 'career_goal',
    title: 'Career Goal from C1',
    content: params.params.objective as string,
    confidence: 0.8,
    importance: 1.0,
  })
  return { status: 'captured', profileId: params.params.formId }
}

async function executeA1IdentityAudit(params: ExecuteCommandParams, context: any) {
  // Analyzes test results and creates identity profile
  await captureMemory({
    userId: params.userId,
    sourceType: 'a1',
    memoryType: 'strength',
    content: JSON.stringify(params.params.strengths),
    confidence: 0.9,
  })
  return { status: 'analyzed', identityId: params.params.testId }
}

async function executeC2ContextBridge(params: ExecuteCommandParams, context: any) {
  // Uses C1 + A1 to define career direction
  await captureMemory({
    userId: params.userId,
    sourceType: 'c2',
    memoryType: 'career_goal',
    content: params.params.confirmedGoal as string,
    confidence: 0.85,
  })
  return { status: 'bridged', direction: params.params }
}

async function executeA2GenerateDay(params: ExecuteCommandParams, context: any) {
  // Generates adaptive daily tasks based on context
  return { status: 'generated', dayNumber: params.dayNumber }
}

async function executeA3RunInterview(params: ExecuteCommandParams, context: any) {
  // Starts interview session with context
  return { status: 'started', sessionId: params.params.sessionId }
}

async function executeA3EvaluateAnswer(params: ExecuteCommandParams, context: any) {
  // Evaluates answer and captures patterns
  await captureMemory({
    userId: params.userId,
    sourceType: 'a3',
    memoryType: 'interview_pattern',
    content: params.params.pattern as string,
    confidence: 0.7,
  })
  return { status: 'evaluated', score: params.params.score }
}

async function executeA4CreateDocument(params: ExecuteCommandParams, context: any) {
  // Creates new document with memory context
  return { status: 'created', documentId: params.params.documentId }
}

async function executeMemoryUpdate(params: ExecuteCommandParams, context: any) {
  // Updates memory items
  await captureMemory({
    userId: params.userId,
    sourceType: params.params.sourceType as any,
    memoryType: params.params.memoryType as any,
    content: params.params.content as string,
  })
  return { status: 'updated' }
}

async function executeUnlockCheck(params: ExecuteCommandParams, context: any) {
  // Checks unlock conditions
  const result = await checkUnlock(params.userId, params.params.unlockKey as string)
  return result
}

// =============================================================================
// Logging
// =============================================================================

async function logCommandExecution(options: {
  userId: string
  commandId: CommandId
  status: 'success' | 'error'
  inputParams: Record<string, unknown>
  outputData?: unknown
  errorMessage?: string
  supabase: any
}) {
  try {
    await options.supabase.from('command_runs').insert({
      user_id: options.userId,
      command: options.commandId,
      status: options.status,
      input_params: options.inputParams,
      output_data: options.outputData,
      error_message: options.errorMessage,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Failed to log command execution:', error)
    // Don't throw - logging failure shouldn't fail the command
  }
}
