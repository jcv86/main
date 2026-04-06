import Parser from 'rss-parser'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const parser = new Parser()

console.log('[v0] Starting enhanced RSS feed seeding...')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// RSS feeds with categorization and relevance scoring
const RSS_FEEDS = [
  {
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    name: 'Ars Technica',
    category: 'Tecnología',
    relevance: 0.85
  },
  {
    url: 'https://www.sitepoint.com/feed/',
    name: 'SitePoint',
    category: 'Educación',
    relevance: 0.80
  },
  {
    url: 'https://feeds.hashicorp.com/hashicorp/blog',
    name: 'HashiCorp Blog',
    category: 'Tecnología',
    relevance: 0.75
  },
  {
    url: 'https://blog.jetbrains.com/feed/',
    name: 'JetBrains Blog',
    category: 'Educación',
    relevance: 0.70
  },
  {
    url: 'https://www.smashingmagazine.com/feed/',
    name: 'Smashing Magazine',
    category: 'Educación',
    relevance: 0.75
  },
  {
    url: 'https://css-tricks.com/feed/',
    name: 'CSS-Tricks',
    category: 'Educación',
    relevance: 0.70
  },
  {
    url: 'https://feeds.bloomberg.com/careers/news.rss',
    name: 'Bloomberg Careers',
    category: 'Mercado Local',
    relevance: 0.80
  },
  {
    url: 'https://www.hackernews.com/rss',
    name: 'Hacker News',
    category: 'Tecnología',
    relevance: 0.85
  },
  {
    url: 'https://feeds2.segments.ai/latest.xml',
    name: 'AI News',
    category: 'Tecnología',
    relevance: 0.90
  }
]

async function fetchAndInsertFeed(feedConfig: typeof RSS_FEEDS[0]) {
  try {
    console.log(`[v0] Fetching ${feedConfig.name}...`)
    const feed = await parser.parseURL(feedConfig.url)
    
    if (!feed.items || feed.items.length === 0) {
      console.log(`[v0] No items found in ${feedConfig.name}`)
      return 0
    }

    console.log(`[v0] Found ${feed.items.length} items in ${feedConfig.name}`)

    let insertedCount = 0
    
    for (const item of feed.items.slice(0, 15)) {
      if (!item.title || !item.link) continue

      const articleData = {
        title: item.title,
        content: item.contentSnippet || item.content || item.summary || item.title,
        category: feedConfig.category,
        relevance_score: feedConfig.relevance,
        source: feedConfig.name,
        url: item.link,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
      }

      const { error } = await supabase
        .from('a4_noticias')
        .insert([articleData])

      if (!error) {
        insertedCount++
      } else if (error?.code === '23505') {
        // Duplicate - skip silently
      } else {
        console.error(`[v0] Error inserting article from ${feedConfig.name}:`, error?.message)
      }
    }

    console.log(`[v0] Inserted ${insertedCount} articles from ${feedConfig.name}`)
    return insertedCount

  } catch (error: any) {
    console.error(`[v0] Error parsing RSS feed ${feedConfig.url}:`, error?.message || error)
    return 0
  }
}

async function main() {
  let totalInserted = 0

  for (const feedConfig of RSS_FEEDS) {
    const count = await fetchAndInsertFeed(feedConfig)
    totalInserted += count
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log(`[v0] Enhanced RSS Seeding complete! Total articles inserted: ${totalInserted}`)
}

main().catch(console.error)
