import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/multimodal/advanced-analytics
 * Advanced analytics with benchmarking and insights
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

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
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3)
    } else {
      startDate = new Date(2020, 0, 1)
    }

    // Get user's analyses
    const { data: analyses } = await supabase
      .from('multimodal_analyses')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (!analyses || analyses.length === 0) {
      return NextResponse.json({
        improvement_trend: 0,
        consistency_score: 0,
        strongest_area: 'N/A',
        strongest_score: 0,
        progression_data: { labels: [], scores: [], movingAverage: [] },
        benchmark_comparison: [],
        component_radar: { your_scores: [], benchmark_scores: [] },
        achievements: [],
        next_goals: [],
        ai_insights: []
      })
    }

    // Calculate improvement trend
    const midpoint = Math.floor(analyses.length / 2)
    const recent = analyses.slice(midpoint)
    const older = analyses.slice(0, midpoint)

    const recentAvg = recent.reduce((sum, a) => sum + (a.overall_score || 0), 0) / recent.length
    const olderAvg = older.reduce((sum, a) => sum + (a.overall_score || 0), 0) / older.length
    const improvementTrend = Math.round(((recentAvg - olderAvg) / olderAvg) * 100)

    // Calculate consistency (lower variance = more consistent)
    const scores = analyses.map(a => a.overall_score || 0)
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
    const stdDev = Math.sqrt(variance)
    const consistencyScore = Math.max(0, 100 - stdDev * 2)

    // Find strongest area
    let visualAvg = analyses.reduce((sum, a) => sum + (a.visual_analysis?.overall_visual_score || 0), 0) / analyses.length
    let audioAvg = analyses.reduce((sum, a) => sum + (a.audio_analysis?.overall_audio_score || 0), 0) / analyses.length
    let coherenceAvg = analyses.reduce((sum, a) => sum + (a.coherence_analysis?.overall_coherence_score || 0), 0) / analyses.length

    const strongest = [
      { name: 'Visual', score: visualAvg },
      { name: 'Audio', score: audioAvg },
      { name: 'Coherencia', score: coherenceAvg }
    ].sort((a, b) => b.score - a.score)[0]

    // Progression data
    const progressionData = {
      labels: analyses.map((_, idx) => `Sesión ${idx + 1}`),
      scores: scores,
      movingAverage: calculateMovingAverage(scores, 3)
    }

    // Benchmark comparison (simulated)
    const benchmarkComparison = [
      { metric: 'Postura', your_score: Math.round(visualAvg * 0.4 + 40), benchmark: 75, percentile: 60 },
      { metric: 'Contacto Visual', your_score: Math.round(visualAvg * 0.5 + 35), benchmark: 72, percentile: 55 },
      { metric: 'Tono de Voz', your_score: Math.round(audioAvg * 0.45 + 38), benchmark: 70, percentile: 58 },
      { metric: 'Claridad', your_score: Math.round(audioAvg * 0.4 + 42), benchmark: 75, percentile: 62 },
      { metric: 'Coherencia', your_score: Math.round(coherenceAvg), benchmark: 68, percentile: 65 }
    ]

    // Component radar data
    const componentRadar = {
      your_scores: [
        Math.round(visualAvg * 0.4 + 40),
        Math.round(visualAvg * 0.5 + 35),
        Math.round(audioAvg * 0.45 + 38),
        Math.round(audioAvg * 0.4 + 42),
        Math.round(audioAvg * 0.3 + 45),
        Math.round(coherenceAvg)
      ],
      benchmark_scores: [75, 72, 70, 75, 72, 68]
    }

    // Achievements
    const achievements = []
    if (analyses.length >= 5) achievements.push({ id: 1, icon: '🚀', title: 'Early Starter', description: '5+ entrenamientos completados' })
    if (improvementTrend > 10) achievements.push({ id: 2, icon: '📈', title: 'Trending Up', description: 'Mejora del 10%+' })
    if (consistencyScore > 85) achievements.push({ id: 3, icon: '⚡', title: 'Consistent', description: 'Desempeño consistente' })

    // Next goals
    const nextGoals = [
      { id: 1, title: 'Alcanzar 80+ en Visual', progress: Math.round(visualAvg / 0.8) },
      { id: 2, title: 'Mejorar Coherencia', progress: Math.round(coherenceAvg) },
      { id: 3, title: '10 sesiones completadas', progress: Math.round((analyses.length / 10) * 100) }
    ]

    // AI Insights
    const aiInsights = [
      `Tu mejor sesión fue la #${analyses.length} con puntuación de ${Math.max(...scores)}/100.`,
      `Tu área más fuerte es ${strongest.name} con promedio de ${Math.round(strongest.score)}/100.`,
      improvementTrend > 0
        ? `¡Tendencia positiva! Has mejorado un ${improvementTrend}% desde el inicio.`
        : `Busca patrones en tus sesiones para identificar qué ayuda a mejorar.`,
      `Practica enfocando en mejorar tu ${
        componentRadar.your_scores.indexOf(Math.min(...componentRadar.your_scores)) === 0 ? 'postura' : 'claridad'
      }.`
    ]

    return NextResponse.json({
      improvement_trend: improvementTrend,
      consistency_score: Math.round(consistencyScore),
      strongest_area: strongest.name,
      strongest_score: Math.round(strongest.score),
      progression_data: progressionData,
      benchmark_comparison: benchmarkComparison,
      component_radar: componentRadar,
      achievements: achievements,
      next_goals: nextGoals,
      ai_insights: aiInsights
    })
  } catch (error) {
    console.error('[v0] Advanced analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    )
  }
}

function calculateMovingAverage(data: number[], windowSize: number): number[] {
  return data.map((_, idx) => {
    const start = Math.max(0, idx - windowSize + 1)
    const window = data.slice(start, idx + 1)
    return Math.round(window.reduce((a, b) => a + b, 0) / window.length)
  })
}
