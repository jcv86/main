import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Get personalized recommendations based on user's DISC profile
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const profile = searchParams.get('profile') // D, I, S, or C
    const limit = parseInt(searchParams.get('limit') || '6')

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile parameter required' },
        { status: 400 }
      )
    }

    // Map DISC profile to relevant book categories and tags
    const profileTagsMap: Record<string, string[]> = {
      D: ['liderazgo', 'éxito', 'productividad', 'objetivos', 'disciplina', 'transformación'],
      I: ['comunicación', 'relaciones', 'habilidades-blandas', 'autoayuda', 'psicología'],
      S: ['hábitos', 'concentración', 'resiliencia', 'mindfulness', 'autocuidado'],
      C: ['planificación', 'gestión-de-proyectos', 'metodología', 'estrategia', 'análisis'],
    }

    const relevantTags = profileTagsMap[profile.toUpperCase()] || []

    // Get books matching the profile
    let query = supabase
      .from('books')
      .select('*')
      .eq('is_recommended', true)

    const { data: books, error } = await query
      .order('rating', { ascending: false })
      .limit(limit * 2) // Fetch more to filter by tags

    if (error) {
      console.error('[v0] Error fetching recommendations:', error)
      return NextResponse.json([], { status: 200 })
    }

    // Filter by relevant tags
    const recommendations = (books || [])
      .filter((book: any) =>
        book.tags?.some((tag: string) => relevantTags.includes(tag.toLowerCase()))
      )
      .slice(0, limit)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('[v0] API Error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

// Create reading list
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, bookIds, description } = body

    const { data, error } = await supabase
      .from('reading_lists')
      .insert([
        {
          user_id: userId,
          name,
          book_ids: bookIds,
          description,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating reading list:', error)
      return NextResponse.json(
        { error: 'Failed to create reading list' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
