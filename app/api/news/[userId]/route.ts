import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  urlToImage?: string
  source: {
    id: string | null
    name: string
  }
  author?: string
  publishedAt: string
  content?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'business'
    const source = searchParams.get('source') || 'newsapi'

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user DISC profile for personalization
    const { data: a1Results } = await supabase
      .from('a1_tests_results')
      .select('result, profile_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const userProfile = a1Results?.profile_type || a1Results?.result?.dominantProfile

    // Fetch news based on source
    let news: NewsArticle[] = []

    if (source === 'newsapi') {
      news = await fetchFromNewsAPI(category, userProfile)
    } else if (source === 'rss') {
      news = await fetchFromRSS(category, userProfile)
    }

    // Cache news in database
    if (news.length > 0) {
      const cachesToSave = news.slice(0, 10).map((article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urltoimage: article.urlToImage,
        author: article.author,
        publishedat: article.publishedAt,
        source_name: article.source.name,
        category,
        keywords: extractKeywords(article.title, article.description),
        content: article.content,
        is_active: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        fetched_at: new Date().toISOString(),
        relevance_score: calculateRelevance(article, userProfile)
      }))

      try {
        await supabase
          .from('despega_news_cache')
          .insert(cachesToSave)
      } catch (cacheErr) {
        console.log('[v0] News already cached:', (cacheErr as Error).message)
      }
    }

    // Log engagement
    await supabase
      .from('a4_engagement_tracking')
      .insert({
        user_id: userId,
        event_type: 'news_fetch',
        feature: 'news_feed',
        completed: true,
        created_at: new Date().toISOString()
      })

    return NextResponse.json({
      articles: news,
      userProfile,
      category,
      source,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[v0] Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

async function fetchFromNewsAPI(
  category: string,
  userProfile?: string
): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY
  if (!apiKey) {
    console.error('[v0] NewsAPI key not configured')
    return []
  }

  // Map DISC profiles to search queries
  const profileQueries: Record<string, string> = {
    D: 'leadership management decision-making',
    I: 'networking influence communication persuasion',
    S: 'collaboration teamwork support cooperation',
    C: 'analysis data precision quality accuracy'
  }

  const query = profileQueries[userProfile || 'D'] || 'business'

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&category=${category}&sortBy=publishedAt&language=en&apiKey=${apiKey}`,
      { cache: 'no-store' }
    )

    if (!response.ok) throw new Error('NewsAPI request failed')

    const data = await response.json()
    console.log(`[v0] Fetched ${data.articles.length} articles from NewsAPI`)

    return data.articles.slice(0, 20).map((article: any) => ({
      id: `newsapi-${article.url}`,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      source: article.source,
      author: article.author,
      publishedAt: article.publishedAt,
      content: article.content
    }))
  } catch (error) {
    console.error('[v0] Error fetching from NewsAPI:', error)
    return []
  }
}

async function fetchFromRSS(
  category: string,
  userProfile?: string
): Promise<NewsArticle[]> {
  // Map categories to RSS feeds
  const feedMap: Record<string, string> = {
    business: 'https://feeds.bloomberg.com/markets/news.rss',
    technology: 'https://feeds.arstechnica.com/arstechnica/index',
    science: 'https://www.sciencedaily.com/rss/all.xml',
    health: 'https://feeds.bbci.co.uk/news/health/rss.xml'
  }

  const feedUrl = feedMap[category] || feedMap.business

  try {
    const response = await fetch(feedUrl, { cache: 'no-store' })
    if (!response.ok) throw new Error('RSS feed request failed')

    const text = await response.text()
    const articles: NewsArticle[] = []

    // Simple RSS parsing (production should use xml2js or similar)
    const titleMatches = text.match(/<title>(.*?)<\/title>/g) || []
    const descMatches = text.match(/<description>(.*?)<\/description>/g) || []
    const linkMatches = text.match(/<link>(.*?)<\/link>/g) || []

    for (let i = 0; i < Math.min(20, titleMatches.length); i++) {
      articles.push({
        id: `rss-${i}`,
        title: titleMatches[i]?.replace(/<[^>]*>/g, '') || 'Article',
        description: descMatches[i]?.replace(/<[^>]*>/g, '') || '',
        url: linkMatches[i]?.replace(/<[^>]*>/g, '') || '#',
        source: { id: null, name: 'RSS Feed' },
        publishedAt: new Date().toISOString()
      })
    }

    console.log(`[v0] Fetched ${articles.length} articles from RSS`)
    return articles
  } catch (error) {
    console.error('[v0] Error fetching from RSS:', error)
    return []
  }
}

function extractKeywords(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase()
  const words = text.split(/\s+/).filter((w) => w.length > 3)
  return [...new Set(words)].slice(0, 10)
}

function calculateRelevance(article: NewsArticle, userProfile?: string): number {
  let score = 50

  // Boost by recency
  const daysOld = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
  if (daysOld < 1) score += 25
  else if (daysOld < 7) score += 15

  // Boost by profile match
  const profileKeywords: Record<string, string[]> = {
    D: ['leadership', 'decision', 'strategy', 'management'],
    I: ['network', 'influence', 'communication', 'social'],
    S: ['team', 'collaboration', 'support', 'cooperation'],
    C: ['analysis', 'data', 'precision', 'quality']
  }

  if (userProfile && profileKeywords[userProfile]) {
    const keywords = profileKeywords[userProfile]
    const titleLower = article.title.toLowerCase()
    const descLower = (article.description || '').toLowerCase()
    const matches = keywords.filter(
      (k) => titleLower.includes(k) || descLower.includes(k)
    ).length
    score += matches * 10
  }

  return Math.min(score, 100)
}
