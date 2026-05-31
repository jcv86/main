/**
 * GET /api/dtc-agentos/context
 * 
 * Get the full context for a user for inspection or debugging.
 * Includes user profile, memories, unlock state, progress, etc.
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { buildDtcContext } from '@/lib/dtc-agentos/context/context-builder'
import type { CommandId, AgentId, ModeId } from '@/lib/dtc-agentos/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const commandId = (searchParams.get('command') || '/dtc:context-build') as CommandId
    const agentId = (searchParams.get('agent') || 'coach') as AgentId
    const modeId = (searchParams.get('mode') || 'coaching') as ModeId
    const moduleId = searchParams.get('moduleId') || undefined
    const dayNumber = searchParams.get('day') ? parseInt(searchParams.get('day')!) : undefined

    // Build context
    const result = await buildDtcContext({
      userId: user.id,
      command: commandId,
      agent: agentId,
      mode: modeId,
      moduleId,
      dayNumber,
    })

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        missingContext: result.missingContext,
      }, { status: 400 })
    }

    const context = result.context!

    return NextResponse.json({
      success: true,
      userId: user.id,
      command: commandId,
      agent: agentId,
      mode: modeId,
      context: {
        user: context.user,
        memory: context.memory?.slice(0, 5), // Show first 5 memories
        agent: context.agent?.name,
        mode: context.mode?.id,
        module: context.module ? { id: context.module.moduleId } : null,
        day: context.day ? { number: context.day.dayNumber } : null,
        hasDocuments: !!context.documents && context.documents.length > 0,
        hasUnlocks: !!context.unlocks && Object.keys(context.unlocks).length > 0,
      },
    })
  } catch (error) {
    console.error('[v0] Error building context:', error)
    return NextResponse.json(
      { error: 'Failed to build context', details: String(error) },
      { status: 500 }
    )
  }
}
