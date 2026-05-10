import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"


export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    // Extract query parameters for advanced filtering
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const rating = searchParams.get('rating')
    const tags = searchParams.get('tags')?.split(',')
    
    console.log("[v0] Fetching books with filters:", { category, difficulty, search, limit, rating, tags })

    // Start with books from new books table
    let query = supabase
      .from("books")
      .select("*")

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (difficulty && difficulty !== 'all') {
      query = query.eq('difficulty', difficulty)
    }

    if (rating) {
      query = query.gte('rating', parseFloat(rating))
    }

    // Execute query
    const { data: books, error: booksError } = await query
      .order("rating", { ascending: false })
      .limit(limit)

    if (booksError) {
      console.error("[v0] Error fetching books:", booksError)
      // Return empty array instead of error
      return NextResponse.json([])
    }

    // Client-side filtering for search and tags
    let results = books || []

    if (search) {
      results = results.filter((book: any) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.description?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (tags && tags.length > 0) {
      results = results.filter((book: any) =>
        book.tags?.some((tag: string) => tags.includes(tag))
      )
    }

    console.log(`[v0] Returned ${results.length} books matching filters`)
    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { title, category, description, author, tags, rating, pages, published_year, difficulty, reading_time, key_topics, is_recommended } = body

    const { data, error } = await supabase
      .from("books")
      .insert([
        {
          title,
          category,
          description,
          author,
          tags,
          rating,
          pages,
          published_year,
          difficulty,
          reading_time,
          key_topics,
          is_recommended,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating book:", error)
      return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
