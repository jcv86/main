import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// RSS Feed sources - curated for career development
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
  },
  {
    url: 'https://feeds.reuters.com/technology',
    category: 'Tecnología',
    relevance: 0.75,
    name: 'Reuters Technology'
  }
]

async function parseRSSFeed(feedUrl) {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DespegarBot/1.0)'
      }
    })

    if (!response.ok) {
      console.warn(`[v0] Failed to fetch RSS feed: ${feedUrl} - Status: ${response.status}`)
      return []
    }

    const feedText = await response.text()

    // Parse XML using regex (simple RSS parsing)
    const items = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(feedText)) !== null) {
      const itemContent = match[1]

      // Extract fields using regex
      const titleMatch = /<title[^>]*>([^<]*)<\/title>/.exec(itemContent)
      const descMatch = /<description[^>]*>([^<]*)<\/description>/.exec(itemContent)
      const linkMatch = /<link[^>]*>([^<]*)<\/link>/.exec(itemContent)
      const pubDateMatch = /<pubDate[^>]*>([^<]*)<\/pubDate>/.exec(itemContent)
      const creatorMatch = /<creator[^>]*>([^<]*)<\/creator>/.exec(itemContent)

      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1].trim(),
          description: descMatch ? descMatch[1].trim() : titleMatch[1].trim(),
          url: linkMatch[1].trim(),
          pubDate: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
          source: creatorMatch ? creatorMatch[1].trim() : 'RSS Feed'
        })
      }
    }

    return items
  } catch (error) {
    console.error(`[v0] Error parsing RSS feed ${feedUrl}:`, error.message)
    return []
  }
}

async function seedRSSFeeds() {
  console.log('[v0] Starting RSS feed seeding...')
  let totalInserted = 0

  for (const feed of RSS_FEEDS) {
    console.log(`[v0] Parsing ${feed.name}...`)
    const items = await parseRSSFeed(feed.url)

    if (items.length === 0) {
      console.warn(`[v0] No items found in ${feed.name}`)
      continue
    }

    console.log(`[v0] Found ${items.length} items in ${feed.name}`)

    // Process items in batches
    for (let i = 0; i < items.length; i += 10) {
      const batch = items.slice(i, i + 10)
      const articlesToInsert = batch.map(item => ({
        title: item.title.substring(0, 500),
        content: item.description.substring(0, 2000),
        url: item.url,
        category: feed.category,
        source: feed.name,
        relevance_score: feed.relevance,
        published_at: item.pubDate
      }))

      try {
        const { data, error } = await supabase
          .from('a4_noticias')
          .insert(articlesToInsert)
          .select()

        if (error) {
          console.error(`[v0] Error inserting batch in ${feed.name}:`, error.message)
        } else {
          totalInserted += data?.length || 0
          console.log(`[v0] Inserted ${data?.length || 0} articles from ${feed.name}`)
        }
      } catch (err) {
        console.error(`[v0] Batch insert error for ${feed.name}:`, err.message)
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  console.log(`[v0] RSS Seeding complete! Total articles inserted: ${totalInserted}`)
}

seedRSSFeeds().catch(error => {
  console.error('[v0] Fatal error during RSS seeding:', error)
  process.exit(1)
})
