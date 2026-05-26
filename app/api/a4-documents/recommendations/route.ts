import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { recommendDocuments } from '@/lib/dtc-agentos/a4-document-intelligence'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const interviewModuleId = request.nextUrl.searchParams.get('moduleId') || 'entrenamiento-estructurado'
    const scoreParam = request.nextUrl.searchParams.get('score')
    const interviewScore = scoreParam ? parseInt(scoreParam) : 70

    if (isNaN(interviewScore) || interviewScore < 0 || interviewScore > 100) {
      return NextResponse.json({ error: 'Score must be 0-100' }, { status: 400 })
    }

    const result = await recommendDocuments(user.id, interviewModuleId, interviewScore)

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
    }

    // Store recommendations in database
    const recommendationsToStore = result.recommendations.map((rec) => ({
      user_id: user.id,
      module_id: interviewModuleId,
      interview_score: interviewScore,
      recommendation_title: rec.title,
      recommendation_reason: rec.reason,
      target_module: rec.targetModule,
      priority: rec.priority,
      created_at: new Date().toISOString(),
    }))

    if (recommendationsToStore.length > 0) {
      const { error: insertError } = await supabase
        .from('document_recommendations')
        .insert(recommendationsToStore)

      if (insertError) {
        console.warn('[v0] Warning: Could not store recommendations:', insertError)
        // Don't fail - recommendations are still valid
      }
    }

    return NextResponse.json({
      success: true,
      score: interviewScore,
      recommendationCount: result.recommendations.length,
      recommendations: result.recommendations,
    })
  } catch (error) {
    console.error('[v0] Error getting recommendations:', error)
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 })
  }
}
