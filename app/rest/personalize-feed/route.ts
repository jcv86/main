import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * POST /api/despega/personalize-a4-feed
 * Personaliza el feed de noticias de A4 basado en el tema actual de entrenamientos
 * Se llama cuando A3 está activo para mostrar noticias relevantes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, training_tema, training_id } = body

    if (!user_id || !training_tema) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, training_tema' },
        { status: 400 }
      )
    }

    // Get Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[v0] Missing Supabase credentials')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle error
          }
        },
      },
    })

    console.log(`[v0] Personalizing A4 feed for user ${user_id} with tema: ${training_tema}`)

    // Create personalized feed entry
    const { data: feedEntry, error: feedError } = await supabase
      .from('a4_personalized_feeds')
      .insert({
        user_id,
        training_id,
        tema_actual: training_tema,
        keywords: generateKeywords(training_tema),
        preferencias: {
          idioma: 'es',
          tono: 'profesional',
          relevancia_minima: 0.7,
        },
        activo: true,
        creado_en: new Date().toISOString(),
      })
      .select()
      .single()

    if (feedError || !feedEntry) {
      console.error('[v0] Error creating personalized feed:', feedError)
      return NextResponse.json(
        { error: 'Error creating personalized feed' },
        { status: 500 }
      )
    }

    console.log(`[v0] Created personalized A4 feed for user ${user_id}`)

    return NextResponse.json({
      success: true,
      feed_id: feedEntry.id,
      tema: training_tema,
      keywords: generateKeywords(training_tema),
    })
  } catch (error) {
    console.error('[v0] Error in personalize-a4-feed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Genera keywords relevantes basadas en el tema
 */
function generateKeywords(tema: string): string[] {
  const keywordMap: Record<string, string[]> = {
    liderazgo: ['liderazgo', 'management', 'dirección', 'equipos', 'decisiones'],
    emprendimiento: [
      'startup',
      'negocio',
      'inversión',
      'emprendedor',
      'financiamiento',
    ],
    'transformación digital': [
      'tecnología',
      'digitalización',
      'innovación',
      'ai',
      'automatización',
    ],
    'comunicación efectiva': [
      'comunicación',
      'presentación',
      'oratoria',
      'influencia',
      'persuasión',
    ],
    'gestión de tiempo': [
      'productividad',
      'eficiencia',
      'organización',
      'prioridades',
      'enfoque',
    ],
  }

  return (
    keywordMap[tema.toLowerCase()] || [
      tema.toLowerCase(),
      'mercado',
      'tendencias',
    ]
  )
}
