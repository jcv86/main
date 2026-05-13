// V1 Analytics API Route - Centralizado para recolectar eventos
// POST /api/v1-analytics con evento

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { V1AnalyticsEvent } from '@/lib/v1-analytics/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
})

export async function POST(request: NextRequest) {
  try {
    const event: V1AnalyticsEvent = await request.json()

    // Store in Supabase - v1_analytics table
    const { error } = await supabaseAdmin
      .from('v1_analytics')
      .insert({
        event_type: event.event,
        stage: event.stage,
        timestamp: event.timestamp,
        session_id: event.sessionId,
        user_id: event.userId,
        metadata: event.metadata,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('[v0] Analytics storage error:', error)
      // Don't fail the request - analytics is non-blocking
      return NextResponse.json({ success: false, error: error.message }, { status: 200 })
    }

    console.log('[v0] Analytics event stored:', event.event)
    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('[v0] Analytics endpoint error:', error)
    return NextResponse.json({ success: false }, { status: 200 })
  }
}

// GET /api/v1-analytics - Fetch analytics dashboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stage = searchParams.get('stage') // 'c1', 'a1', 'a2', 'a3', 'a4'
    const days = parseInt(searchParams.get('days') || '7')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    let query = supabaseAdmin
      .from('v1_analytics')
      .select('*')
      .gte('created_at', startDate.toISOString())

    if (stage) {
      query = query.eq('stage', stage)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] Analytics query error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Calculate funnel metrics
    const metrics = calculateFunnelMetrics(data || [])

    return NextResponse.json({ data, metrics }, { status: 200 })

  } catch (error) {
    console.error('[v0] Analytics GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

function calculateFunnelMetrics(events: any[]) {
  const byStage = {
    c1: events.filter(e => e.stage === 'c1').length,
    a1: events.filter(e => e.stage === 'a1').length,
    a2: events.filter(e => e.stage === 'a2').length,
    a3: events.filter(e => e.stage === 'a3').length,
    a4: events.filter(e => e.stage === 'a4').length,
  }

  const completionRate = {
    c1_completed: events.filter(e => e.event_type === 'c1_completed').length,
    a1_completed: events.filter(e => e.event_type === 'a1_completed').length,
    a2_completed: events.filter(e => e.event_type === 'a2_checkpoint_completed').length,
    a3_completed: events.filter(e => e.event_type === 'a3_entrevista0_completed').length,
    a4_interacted: events.filter(e => e.event_type === 'a4_tool_interacted').length,
  }

  const dropOffPoints = {
    c1_to_a1: byStage.c1 > 0 ? ((byStage.a1 / byStage.c1) * 100).toFixed(2) + '%' : 'N/A',
    a1_to_a2: byStage.a1 > 0 ? ((byStage.a2 / byStage.a1) * 100).toFixed(2) + '%' : 'N/A',
    a2_to_a3: byStage.a2 > 0 ? ((byStage.a3 / byStage.a2) * 100).toFixed(2) + '%' : 'N/A',
    a3_to_a4: byStage.a3 > 0 ? ((byStage.a4 / byStage.a3) * 100).toFixed(2) + '%' : 'N/A',
  }

  const errors = events.filter(e => e.event_type.includes('error')).length
  const sessions = new Set(events.map(e => e.session_id)).size

  return {
    byStage,
    completionRate,
    dropOffPoints,
    totalErrors: errors,
    uniqueSessions: sessions,
    conversionC1toA1: byStage.c1 > 0 ? (byStage.a1 / byStage.c1).toFixed(3) : 0,
    conversionA1toA2: byStage.a1 > 0 ? (byStage.a2 / byStage.a1).toFixed(3) : 0,
  }
}
