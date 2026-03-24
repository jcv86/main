import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/multimodal/analytics?period=month
 * Get multimodal analysis analytics for user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const period = request.nextUrl.searchParams.get('period') || 'month'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()

    if (period === 'week') {
      startDate.setDate(now.getDate() - 7)
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1)
    } else if (period === 'all') {
      startDate = new Date(2020, 0, 1)
    }

    // Get analyses
    const { data: analyses, error } = await supabase
      .from('multimodal_analyses')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate metrics
    const metrics = {
      total_sessions: analyses.length,
      average_score: Math.round(
        analyses.reduce((sum, a) => sum + (a.overall_score || 0), 0) / analyses.length || 0
      ),
      visual_average: Math.round(
        analyses.reduce((sum, a) => sum + (a.visual_analysis?.overall_visual_score || 0), 0) / analyses.length || 0
      ),
      audio_average: Math.round(
        analyses.reduce((sum, a) => sum + (a.audio_analysis?.overall_audio_score || 0), 0) / analyses.length || 0
      ),
      coherence_average: Math.round(
        analyses.reduce((sum, a) => sum + (a.coherence_analysis?.overall_coherence_score || 0), 0) / analyses.length || 0
      ),
      by_type: groupByType(analyses),
      improvement_trend: calculateTrend(analyses),
      top_strengths: getTopStrengths(analyses),
      top_improvements: getTopImprovements(analyses)
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('[v0] Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    )
  }
}

function groupByType(analyses: any[]) {
  const grouped: Record<string, any> = {}
  analyses.forEach(a => {
    if (!grouped[a.entrenamiento_type]) {
      grouped[a.entrenamiento_type] = {
        count: 0,
        average_score: 0,
        sessions: []
      }
    }
    grouped[a.entrenamiento_type].count++
    grouped[a.entrenamiento_type].average_score += a.overall_score || 0
    grouped[a.entrenamiento_type].sessions.push(a)
  })

  Object.keys(grouped).forEach(key => {
    grouped[key].average_score = Math.round(grouped[key].average_score / grouped[key].count)
  })

  return grouped
}

function calculateTrend(analyses: any[]) {
  if (analyses.length < 2) return 0

  const recent = analyses.slice(0, Math.ceil(analyses.length / 2))
  const older = analyses.slice(Math.ceil(analyses.length / 2))

  const recentAvg = recent.reduce((sum, a) => sum + (a.overall_score || 0), 0) / recent.length
  const olderAvg = older.reduce((sum, a) => sum + (a.overall_score || 0), 0) / older.length

  return Math.round(((recentAvg - olderAvg) / olderAvg) * 100)
}

function getTopStrengths(analyses: any[]) {
  const strengths: Record<string, number> = {}

  analyses.forEach(a => {
    (a.strengths || []).forEach((strength: string) => {
      strengths[strength] = (strengths[strength] || 0) + 1
    })
  })

  return Object.entries(strengths)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([strength, count]) => ({ strength, count }))
}

function getTopImprovements(analyses: any[]) {
  const improvements: Record<string, number> = {}

  analyses.forEach(a => {
    (a.improvements || []).forEach((improvement: string) => {
      improvements[improvement] = (improvements[improvement] || 0) + 1
    })
  })

  return Object.entries(improvements)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([improvement, count]) => ({ improvement, count }))
}
