/**
 * POST /api/dtc-agentos/execute-command
 * 
 * Execute a DTC AgentOS command with full context building and persistence.
 * 
 * Request:
 * {
 *   commandId: "/dtc:c1-profile-capture",
 *   agentId: "coach",
 *   modeId: "onboarding",
 *   params: { ... },
 *   moduleId?: "module-id",
 *   dayNumber?: 5
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   commandId: "/dtc:c1-profile-capture",
 *   agentId: "coach",
 *   data: { ... },
 *   memoryUpdates: ["career_goal", "motivation"],
 *   executionTimeMs: 1234
 * }
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { executeCommand } from '@/lib/dtc-agentos/commands/execute-command'
import type { CommandId } from '@/lib/dtc-agentos/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      commandId,
      agentId,
      modeId,
      params,
      moduleId,
      dayNumber,
    } = body

    if (!commandId || !agentId || !modeId) {
      return NextResponse.json(
        {
          error: 'Missing required fields: commandId, agentId, modeId',
        },
        { status: 400 }
      )
    }

    // Execute command
    const result = await executeCommand({
      userId: user.id,
      commandId: commandId as CommandId,
      agentId,
      modeId,
      params: params || {},
      moduleId,
      dayNumber,
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Error executing command:', error)
    return NextResponse.json(
      { error: 'Failed to execute command', details: String(error) },
      { status: 500 }
    )
  }
}
