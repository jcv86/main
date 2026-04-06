import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

interface AggregatedNews {
  id: string
  title: string
  description: string
  category: string
  relevance: number
  source: string
  url: string
  timestamp: string
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const minRelevance = parseInt(searchParams.get('minRelevance') || '0')

    console.log('[v0] /api/noticias/feed called with:', { limit, category, minRelevance })

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[v0] Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Database configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Build query
    let query = supabase
      .from('a4_noticias')
      .select('id, title, content, relevance_score, category, published_at, source, url')
      .not('url', 'is', null)  // Only get articles with real URLs
      .order('relevance_score', { ascending: false })
      .order('published_at', { ascending: false })

    // Filter by category if provided
    if (category && category !== 'Todas') {
      query = query.eq('category', category)
      console.log('[v0] Filtering by category:', category)
    }

    // Filter by minimum relevance if provided
    if (minRelevance > 0) {
      query = query.gte('relevance_score', minRelevance / 100)
      console.log('[v0] Filtering by minRelevance:', minRelevance / 100)
    }

    const { data, error } = await query.limit(limit)

    console.log('[v0] Supabase query result:', { 
      dataCount: data?.length || 0, 
      error: error?.message || 'none' 
    })

    if (error) {
      console.error('[v0] Supabase query error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch news from database' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Transform database records to API format
    const noticias: AggregatedNews[] = (data || []).map((item: any) => {
      const publishedAt = new Date(item.published_at)
      const now = new Date()
      const diffMs = now.getTime() - publishedAt.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      let timestamp = 'Hace poco'
      if (diffHours < 1) {
        timestamp = 'Hace minutos'
      } else if (diffHours < 24) {
        timestamp = `Hace ${diffHours}h`
      } else if (diffDays < 7) {
        timestamp = `Hace ${diffDays}d`
      } else if (diffDays < 30) {
        timestamp = `Hace ${Math.floor(diffDays / 7)}sem`
      } else {
        timestamp = `Hace ${Math.floor(diffDays / 30)}mes`
      }

      return {
        id: item.id,
        title: item.title,
        description: item.content,
        category: item.category || 'General',
        relevance: Math.round((item.relevance_score || 0.5) * 100),
        source: item.source || 'Despega',
        url: item.url,
        timestamp
      }
    })

    console.log('[v0] Returning noticias:', noticias.length)

    return new Response(
      JSON.stringify({
        success: true,
        data: noticias,
        total: noticias.length,
        timestamp: new Date().toISOString(),
        source: 'supabase'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('[v0] News aggregation error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch news' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
