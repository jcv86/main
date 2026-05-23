import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { recommendRouteByDISC } from '@/lib/a2/route-recommendation'
import { getDemoUserFromRequest } from '@/lib/auth/demo-user'

// GET /api/a2/route-recommendation - Get personalized route recommendation
export async function GET(request: NextRequest) {
  try {
    // Check for demo user
    const demoUser = getDemoUserFromRequest(request)
    if (demoUser) {
      // Return mock recommendation for demo
      return NextResponse.json({
        recommendedRoute: 'profesional',
        confidence: 78,
        reasoning: 'Tu perfil muestra orientación hacia liderazgo y ejecución. El camino profesional maximiza tu potencial.',
        altRoutes: [
          { route: 'hibrido', score: 65, reason: 'Enfoque integrado' },
          { route: 'persona', score: 50, reason: 'Enfoque en relaciones' }
        ],
        focusAreas: ['Liderazgo', 'Comunicación', 'Estrategia'],
        isDemo: true
      })
    }

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's A1 DISC results
    const { data: a1Results } = await supabase
      .from('a1_cerebral_results')
      .select('disc_profile')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!a1Results || !a1Results.disc_profile) {
      // No A1 results, return balanced recommendation
      return NextResponse.json({
        recommendedRoute: 'hibrido',
        confidence: 50,
        reasoning: 'Aún no has completado tu análisis DISC. Completa A1 para una recomendación personalizada.',
        altRoutes: [
          { route: 'profesional', score: 50, reason: 'Crecimiento profesional' },
          { route: 'persona', score: 50, reason: 'Crecimiento personal' }
        ],
        focusAreas: ['Autoconocimiento', 'Desarrollo de habilidades', 'Networking'],
        needsA1: true
      })
    }

    // Generate recommendation
    const recommendation = recommendRouteByDISC(a1Results.disc_profile)

    return NextResponse.json({
      ...recommendation,
      isDemo: false
    })
  } catch (error) {
    console.error('[v0] Route recommendation error:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendation' },
      { status: 500 }
    )
  }
}
