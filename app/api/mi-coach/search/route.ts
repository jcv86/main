import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query') || ''
    const discProfile = searchParams.get('discProfile')

    console.log('[v0] Book search:', { query, discProfile })

    if (!query.trim()) {
      return NextResponse.json({ books: [], message: 'Ingresa una búsqueda' })
    }

    // Search in books table - get more results, then filter client-side
    const { data: booksData, error: booksError } = await supabase
      .from('books')
      .select('id, title, author, description, rating, difficulty, key_topics, tags')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20)

    if (booksError) {
      console.error('[v0] Books search error:', booksError)
      return NextResponse.json({ error: 'Search error' }, { status: 500 })
    }

    console.log('[v0] Raw books found:', (booksData || []).length)

    // Filter by DISC profile client-side if provided
    let filteredBooks = booksData || []
    if (discProfile) {
      const profileLower = discProfile.toLowerCase()
      filteredBooks = filteredBooks.filter(book => {
        const tags = JSON.stringify((book.tags || [])).toLowerCase()
        const topics = JSON.stringify((book.key_topics || [])).toLowerCase()
        return tags.includes(profileLower) || topics.includes(profileLower)
      })
    }

    console.log('[v0] Filtered books found:', filteredBooks.length)

    // Also search knowledge_base for broader coverage
    const { data: kbData, error: kbError } = await supabase
      .from('knowledge_base')
      .select('id, title, description, read_count')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(4)

    const allResults = [
      ...(filteredBooks).map(b => ({ ...b, source: 'books' })),
      ...(kbData || []).map(k => ({ ...k, source: 'knowledge_base' })),
    ]

    console.log('[v0] Total results:', allResults.length)

    return NextResponse.json({
      books: allResults.slice(0, 8),
      count: allResults.length,
      query,
    })
  } catch (error) {
    console.error('[v0] Search error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
