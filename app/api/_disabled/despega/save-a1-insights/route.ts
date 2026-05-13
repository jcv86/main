import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      userId: string
      discProfile: Record<string, number>
      insights: {
        fortalezasPrincipales: string
        areasDesarrollo: string
        estiloEntrevista: string
        dinamicaEquipo: string
        carreraAlign: string
        comunicacionEfectiva: string
        gestionConflicto: string
        proxiPaso: string
      }
    }

    const { userId, discProfile, insights } = body

    if (!userId || !discProfile || !insights) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createAdminClient()

    // Calculate dominant and secondary patterns
    const sortedDimensions = Object.entries(discProfile).sort((a, b) => b[1] - a[1])
    const dominantPattern = String(sortedDimensions[0]?.[0] || 'D')
    const secondaryPattern = String(sortedDimensions[1]?.[0] || 'I')

    // Prepare profile data with scores
    const profileData = {
      D: discProfile.D || 0,
      I: discProfile.I || 0,
      S: discProfile.S || 0,
      C: discProfile.C || 0,
      primary: dominantPattern,
      primaryScore: sortedDimensions[0]?.[1] || 0,
      secondary: secondaryPattern,
      secondaryScore: sortedDimensions[1]?.[1] || 0
    }

    // Upsert insights into database (update if exists, insert if new)
    const { data, error } = await supabaseAdmin
      .from('a1_profile_insights')
      .upsert(
        {
          user_id: userId,
          disc_profile: profileData,
          dominant_pattern: dominantPattern,
          secondary_pattern: secondaryPattern,
          fortalezas_principales: insights.fortalezasPrincipales,
          areas_desarrollo: insights.areasDesarrollo,
          estilo_entrevista: insights.estiloEntrevista,
          dinamica_equipo: insights.dinamicaEquipo,
          carrera_align: insights.carreraAlign,
          comunicacion_efectiva: insights.comunicacionEfectiva,
          gestion_conflicto: insights.gestionConflicto,
          proxi_paso: insights.proxiPaso,
        },
        { onConflict: 'user_id' }
      )
      .select()

    if (error) {
      console.error('[v0] Error saving insights to database:', error)
      return NextResponse.json(
        { error: 'Failed to save insights', details: error.message },
        { status: 400 }
      )
    }

    console.log('[v0] Insights saved to database successfully for user:', userId)

    return NextResponse.json({
      success: true,
      data: data[0]
    })
  } catch (error) {
    console.error('[v0] Error in save-a1-insights:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
