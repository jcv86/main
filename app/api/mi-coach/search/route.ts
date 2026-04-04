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

    // Use AI to expand query with related concepts
    let expandedQueries = [query.toLowerCase()]
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: `Eres un experto en educación y desarrollo profesional. El usuario está buscando: "${query}"

Genera 2-3 conceptos relacionados o sinónimos relevantes para mejorar la búsqueda.
Responde SOLO en español con conceptos separados por comas, sin numeración.

Responde en JSON con formato: {"concepts": ["concepto1", "concepto2", "concepto3"]}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices?.[0]?.message?.content
        if (content) {
          try {
            const parsed = JSON.parse(content)
            if (parsed.concepts && Array.isArray(parsed.concepts)) {
              expandedQueries = [
                query.toLowerCase(),
                ...parsed.concepts.map((c: string) => c.toLowerCase())
              ]
              console.log('[v0] Expanded queries:', expandedQueries)
            }
          } catch (e) {
            console.log('[v0] Failed to parse AI response:', e)
          }
        }
      }
    } catch (aiError) {
      console.log('[v0] AI expansion skipped, using basic search')
      // Continue with basic search if AI fails
    }

    // Search in books table - get more results, then filter client-side
    const { data: booksData, error: booksError } = await supabase
      .from('books')
      .select('id, title, author, description, rating, difficulty, key_topics, tags, cover_url, published_year')
      .limit(50)

    if (booksError) {
      console.error('[v0] Books search error:', booksError)
      return NextResponse.json({ error: 'Search error' }, { status: 500 })
    }

    console.log('[v0] Raw books found:', (booksData || []).length)

    // Filter client-side: search in title, description, tags, and key_topics using expanded queries
    let filteredBooks = (booksData || []).filter(book => {
      const title = (book.title || '').toLowerCase()
      const description = (book.description || '').toLowerCase()
      const tags = JSON.stringify((book.tags || [])).toLowerCase()
      const topics = JSON.stringify((book.key_topics || [])).toLowerCase()
      
      // Check if any expanded query matches any field
      return expandedQueries.some(q => 
        title.includes(q) ||
        description.includes(q) ||
        tags.includes(q) ||
        topics.includes(q)
      )
    })

    console.log('[v0] Filtered by query:', filteredBooks.length)

    // Further filter by DISC profile if provided
    if (discProfile) {
      const profileLower = discProfile.toLowerCase()
      filteredBooks = filteredBooks.filter(book => {
        const tags = JSON.stringify((book.tags || [])).toLowerCase()
        const topics = JSON.stringify((book.key_topics || [])).toLowerCase()
        return tags.includes(profileLower) || topics.includes(profileLower)
      })
    }

    console.log('[v0] Filtered books found:', filteredBooks.length)

    // Add reference links to books
    const booksWithLinks = filteredBooks.map(book => {
      const referenceLinks = []
      
      // Generate external reference links (Amazon, Goodreads, etc.)
      if (book.title && book.author) {
        referenceLinks.push({
          title: 'Amazon',
          url: `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}+${encodeURIComponent(book.author)}`,
          type: 'amazon'
        })
        
        referenceLinks.push({
          title: 'Goodreads',
          url: `https://www.goodreads.com/search?q=${encodeURIComponent(book.title)}+${encodeURIComponent(book.author)}`,
          type: 'goodreads'
        })
      }
      
      return {
        ...book,
        referenceLinks
      }
    })

    // Also search knowledge_base for broader coverage
    const { data: kbData, error: kbError } = await supabase
      .from('knowledge_base')
      .select('id, title, description, read_count')
      .limit(4)

    const kbFiltered = (kbData || []).filter(kb => {
      const title = (kb.title || '').toLowerCase()
      const description = (kb.description || '').toLowerCase()
      return expandedQueries.some(q => 
        title.includes(q) || description.includes(q)
      )
    })

    const allResults = [
      ...(booksWithLinks).map(b => ({ ...b, source: 'books' })),
      ...(kbFiltered).map(k => ({ ...k, source: 'knowledge_base' })),
    ]

    console.log('[v0] Total results:', allResults.length)

    return NextResponse.json({
      books: allResults.slice(0, 8),
      count: allResults.length,
      query,
      expandedQueries,
    })
  } catch (error) {
    console.error('[v0] Search error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
