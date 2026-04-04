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

    // Search in books table
    let booksQuery = supabase
      .from('books')
      .select('id, title, author, description, rating, difficulty, key_topics, tags')
      .ilike('title', `%${query}%`)
      .or(`description.ilike.%${query}%`)
      .limit(8)

    // Filter by DISC profile if provided
    if (discProfile) {
      booksQuery = booksQuery.contains('tags', [discProfile.toLowerCase()])
    }

    const { data: booksData, error: booksError } = await booksQuery

    if (booksError) {
      console.error('[v0] Books search error:', booksError)
      return NextResponse.json({ error: 'Search error' }, { status: 500 })
    }

    // Also search knowledge_base for broader coverage
    let kbQuery = supabase
      .from('knowledge_base')
      .select('id, title, description, read_count')
      .ilike('title', `%${query}%`)
      .limit(4)

    const { data: kbData, error: kbError } = await kbQuery

    const allResults = [
      ...(booksData || []).map(b => ({ ...b, source: 'books' })),
      ...(kbData || []).map(k => ({ ...k, source: 'knowledge_base' })),
    ]

    return NextResponse.json({
      books: allResults,
      count: allResults.length,
      query,
    })
  } catch (error) {
    console.error('[v0] Search error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
