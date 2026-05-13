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

    // Use RPC call or manual filtering - Get all books first, then filter
    const { data: allBooks, error: booksError } = await supabase
      .from('books')
      .select('id, title, author, description, rating, difficulty, key_topics, tags')
      .order('rating', { ascending: false })
      .limit(limit * 2)

    if (booksError) {
      console.error('[v0] Error fetching books:', booksError)
      return NextResponse.json({ error: 'Error fetching recommendations' }, { status: 500 })
    }

    // Filter books by matching keywords in key_topics or tags
    const filteredBooks = (allBooks || [])
      .filter(book => {
        const topicsStr = JSON.stringify(book.key_topics || []).toLowerCase()
        const tagsStr = JSON.stringify(book.tags || []).toLowerCase()
        const combinedText = `${topicsStr} ${tagsStr}`
        
        // Check if any profile keyword matches
        return profile.keywords.some(keyword => 
          combinedText.includes(keyword.toLowerCase())
        )
      })
      .slice(0, limit)

    // Add reasoning for each recommendation
    const recommendations = (filteredBooks || []).map((book, idx) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      rating: book.rating,
      reason: `${idx === 0 ? 'Top recomendación' : 'Altamente recomendado'} para tu perfil ${discProfile}`,
    }))

    console.log('[v0] Recommendations found:', recommendations.length)

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
