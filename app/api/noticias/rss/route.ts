import { NextRequest } from 'next/server'

// RSS Feed sources
const RSS_FEEDS = [
  {
    url: 'https://techcrunch.com/feed/',
    category: 'Tecnología',
    relevance: 0.85,
    name: 'TechCrunch'
  },
  {
    url: 'https://www.producthunt.com/feed',
    category: 'Oportunidades',
    relevance: 0.8,
    name: 'Product Hunt'
  },
  {
    url: 'https://dev.to/feed',
    category: 'Tecnología',
    relevance: 0.8,
    name: 'Dev.to'
  },
  {
    url: 'https://medium.com/feed/tag/career',
    category: 'Educación',
    relevance: 0.75,
    name: 'Medium - Career'
  },
  {
    url: 'https://feeds.bloomberg.com/markets/tech.rss',
    category: 'Mercado Local',
    relevance: 0.7,
    name: 'Bloomberg Tech'
  }
]

async function parseRSSFeed(feedUrl: string) {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DespegarBot/1.0)'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.warn(`[v0] Failed to fetch RSS feed: ${feedUrl}`)
      return []
    }

    const feedText = await response.text()
    const items = []

    // Parse XML using regex
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(feedText)) !== null) {
      const itemContent = match[1]

      const titleMatch = /<title[^>]*>([^<]*)<\/title>/.exec(itemContent)
      const descMatch = /<description[^>]*>([^<]*)<\/description>/.exec(itemContent)
      const linkMatch = /<link[^>]*>([^<]*)<\/link>/.exec(itemContent)
      const pubDateMatch = /<pubDate[^>]*>([^<]*)<\/pubDate>/.exec(itemContent)

      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1].trim().substring(0, 500),
          description: descMatch ? descMatch[1].trim().substring(0, 2000) : titleMatch[1].trim(),
          url: linkMatch[1].trim(),
          pubDate: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString()
        })
      }
    }

    return items.slice(0, 5) // Limit to 5 items per feed
  } catch (error) {
    console.error(`[v0] Error parsing RSS feed:`, error)
    return []
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    console.log('[v0] Fetching RSS feeds...')

    // Fetch all feeds in parallel
    const allFeeds = await Promise.all(
      RSS_FEEDS.map(async (feed) => {
        const items = await parseRSSFeed(feed.url)
        return items.map(item => ({
          id: `rss-${feed.name}-${Math.random().toString(36).substr(2, 9)}`,
          title: item.title,
          description: item.description,
          url: item.url,
          category: feed.category,
          source: feed.name,
          relevance: Math.round(feed.relevance * 100),
          timestamp: formatTimestamp(new Date(item.pubDate))
        }))
      })
    )

    // Flatten and sort by date
    const allArticles = allFeeds
      .flat()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    console.log(`[v0] Fetched ${allArticles.length} RSS articles`)

    return new Response(
      JSON.stringify({
        success: true,
        data: allArticles,
        total: allArticles.length,
        timestamp: new Date().toISOString(),
        source: 'rss'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('[v0] RSS API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch RSS feeds' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Hace minutos'
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays < 7) return `Hace ${diffDays}d`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)}sem`
  return `Hace ${Math.floor(diffDays / 30)}mes`
}
