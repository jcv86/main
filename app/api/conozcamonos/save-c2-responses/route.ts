import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { executeCommand } from '@/lib/dtc-agentos/commands/execute-command'
import { buildDtcContext } from '@/lib/dtc-agentos/context/context-builder'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      user_id: string
      responses: Record<number, any>
    }

    const { user_id, responses } = body

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Validate that A1 was completed first
    const { data: a1Data } = await supabase
      .from('a1_cerebral_assessment')
      .select('id')
      .eq('user_id', user_id)
      .limit(1)
      .single()

    if (!a1Data) {
      return NextResponse.json({ 
        error: 'A1: Despega Cerebral debe completarse antes de C2' 
      }, { status: 400 })
    }

    // Save C2 responses
    const { data, error } = await supabase
      .from('conozcamonos_2_responses')
      .upsert({
        user_id,
        responses,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('[v0] Error saving C2 responses:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[v0] C2 responses saved for user:', user_id)

    // Build context from C1 + A1 + C2 to prepare for A2
    try {
      const contextResult = await buildDtcContext({
        userId: user_id,
        command: '/dtc:c2-context-bridge',
        agent: 'coach',
        mode: 'coaching',
      })

      if (!contextResult.success) {
        console.error('[v0] Failed to build C2 context:', contextResult.error)
      } else {
        console.log('[v0] C2 context built successfully with memories:', contextResult.context?.memory?.length)
      }

      // Capture C2 context bridge results to memory
      const result = await executeCommand({
        userId: user_id,
        commandId: '/dtc:c2-context-bridge',
        agentId: 'coach',
        modeId: 'coaching',
        params: {
          formId: user_id,
          responses,
          confirmedGoal: responses[1]?.answer || responses[1] || 'Career goal confirmed',
          targetRole: responses[2]?.answer || responses[2] || 'Target role to define',
          marketRegion: responses[3]?.answer || responses[3] || 'Market region to explore',
        },
      })

      if (!result.success) {
        console.error('[v0] Failed to capture C2 memory:', result.error)
        // Don't fail the whole request if memory capture fails
      } else {
        console.log('[v0] C2 memory captured successfully:', result.memoryUpdates)
      }
    } catch (error) {
      console.error('[v0] Exception in C2 context/memory processing:', error)
      // Don't fail the whole request if context/memory processing fails
    }
  } catch (error) {
    console.error('[v0] Exception in save-c2-responses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
