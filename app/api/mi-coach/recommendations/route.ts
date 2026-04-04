import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const discProfile = searchParams.get('profile') || 'D'
    const limit = parseInt(searchParams.get('limit') || '6')

    console.log('[v0] Getting recommendations for profile:', discProfile)

    // Map DISC profiles to relevant categories and topics
    const profileMap: Record<string, { categories: string[], keywords: string[] }> = {
      D: {
        categories: ['liderazgo', 'estrategia', 'decisiones', 'productividad'],
        keywords: ['liderazgo', 'decisión', 'velocidad', 'resultados'],
      },
      I: {
        categories: ['comunicación', 'influencia', 'ventas', 'liderazgo'],
        keywords: ['comunicación', 'influencia', 'persuasión', 'motivación'],
      },
      S: {
        categories: ['colaboración', 'equipos', 'empatía', 'relaciones'],
        keywords: ['colaboración', 'empatía', 'relaciones', 'estabilidad'],
      },
      C: {
        categories: ['análisis', 'calidad', 'planificación', 'excelencia'],
        keywords: ['análisis', 'calidad', 'precisión', 'planificación'],
      },
    }

    const profile = profileMap[discProfile] || profileMap['D']

    // Get recommended books based on profile
    const { data: books, error } = await supabase
      .from('books')
      .select('id, title, author, description, rating, difficulty, key_topics, tags')
      .or(
        `key_topics.cs.${JSON.stringify(profile.keywords)},tags.cs.${JSON.stringify(profile.keywords)}`
      )
      .order('rating', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[v0] Recommendations error:', error)
      return NextResponse.json({ error: 'Error fetching recommendations' }, { status: 500 })
    }

    // Add reasoning for each recommendation
    const recommendations = (books || []).map((book, idx) => ({
      ...book,
      reason: `${idx === 0 ? 'Top recomendación' : 'Altamente recomendado'} para tu perfil ${discProfile}`,
    }))

    return NextResponse.json({
      recommendations,
      profile: discProfile,
      count: recommendations.length,
    })
  } catch (error) {
    console.error('[v0] Recommendations error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
