import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('[v0] Starting simple RSS feed seeding...')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Curated tech news articles manually from popular sources
const curatedArticles = [
  {
    title: 'GPT-4 Turbo Released with 128K Context Window',
    content: 'OpenAI releases GPT-4 Turbo with significantly improved context window and lower pricing',
    source: 'OpenAI Blog',
    category: 'Tecnología',
    relevance: 0.95,
    url: 'https://openai.com/blog/gpt-4-turbo-release'
  },
  {
    title: 'GitHub Copilot X: AI-Powered Pair Programming',
    content: 'New features for AI-powered code generation and collaboration in development workflows',
    source: 'GitHub Blog',
    category: 'Tecnología',
    relevance: 0.90,
    url: 'https://github.com/features/copilot/x'
  },
  {
    title: 'React 19: Major Performance Improvements',
    content: 'React framework releases version 19 with significant performance optimizations and new hooks',
    source: 'React',
    category: 'Tecnología',
    relevance: 0.85,
    url: 'https://react.dev/blog/2024/react-19'
  },
  {
    title: 'Vercel Next.js 14: Edge Computing and More',
    content: 'Next.js releases version 14 with improved edge computing and deployment features',
    source: 'Vercel',
    category: 'Tecnología',
    relevance: 0.80,
    url: 'https://vercel.com/blog/next-14'
  },
  {
    title: 'Web Assembly Gets New Capabilities',
    content: 'WebAssembly adds support for garbage collection and better JavaScript integration',
    source: 'Mozilla Developer',
    category: 'Educación',
    relevance: 0.75,
    url: 'https://developer.mozilla.org/en-US/docs/WebAssembly'
  },
  {
    title: '10 In-Demand Skills for 2026',
    content: 'Tech industry analysis shows highest demand for AI/ML, cloud, and cybersecurity skills',
    source: 'LinkedIn Learning',
    category: 'Oportunidades',
    relevance: 0.85,
    url: 'https://www.linkedin.com/learning'
  },
  {
    title: 'Remote Work Trends: Future of Global Teams',
    content: 'Analysis of how remote work is reshaping corporate culture and hiring practices globally',
    source: 'Harvard Business Review',
    category: 'Liderazgo',
    relevance: 0.80,
    url: 'https://hbr.org/'
  },
  {
    title: 'Startup Funding Surge in 2026',
    content: 'Venture capital investments exceed $100B in first quarter of 2026',
    source: 'Crunchbase',
    category: 'Oportunidades',
    relevance: 0.75,
    url: 'https://www.crunchbase.com/'
  },
  {
    title: 'Cybersecurity: New Standards for 2026',
    content: 'Industry adopts new security standards for cloud infrastructure and data protection',
    source: 'InfoQ',
    category: 'Tecnología',
    relevance: 0.78,
    url: 'https://www.infoq.com/'
  },
  {
    title: 'The Future of Artificial Intelligence',
    content: 'Experts discuss the trajectory of AI development and ethical considerations for the future',
    source: 'Wired',
    category: 'Tecnología',
    relevance: 0.82,
    url: 'https://www.wired.com/'
  }
]

async function seedArticles() {
  try {
    console.log('[v0] Inserting curated tech articles...')
    
    let inserted = 0
    for (const article of curatedArticles) {
      const { error } = await supabase
        .from('a4_noticias')
        .insert({
          title: article.title,
          content: article.content,
          source: article.source,
          category: article.category,
          relevance_score: article.relevance,
          published_at: new Date().toISOString(),
          url: article.url
        })

      if (!error) {
        inserted++
        console.log(`[v0] ✓ Inserted: ${article.title}`)
      } else {
        console.warn(`[v0] Failed to insert: ${article.title}`)
      }
    }

    console.log(`[v0] ========================================`)
    console.log(`[v0] Seeding Complete`)
    console.log(`[v0] Total articles inserted: ${inserted}/${curatedArticles.length}`)
    console.log(`[v0] ========================================`)
  } catch (error) {
    console.error('[v0] Error during seeding:', error.message)
    process.exit(1)
  }
}

seedArticles()
