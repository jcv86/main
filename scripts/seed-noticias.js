import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const newsApiKey = process.env.NEWS_API_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Missing Supabase environment variables')
  process.exit(1)
}

if (!newsApiKey) {
  console.warn('[v0] NEWS_API_KEY not set - will use fallback curated news')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Fallback curated news for development (high relevance for career/labor market)
const CURATED_NEWS = [
  {
    title: 'IA Generativa Transforma Roles de Trabajo en 2026',
    content: 'Análisis de cómo empresas redefinen puestos alrededor de herramientas IA. 73% de empresas han adoptado alguna forma de IA en 2026. Los roles más adaptables experimentan mayor demanda.',
    category: 'Tecnología',
    relevance_score: 0.98,
    source: 'McKinsey',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Mercado Laboral Chileno: Demanda de Talento Digital',
    content: 'LinkedIn reporta crecimiento 45% en búsquedas de perfiles con skills digitales en Chile 2026. Salarios 30-40% más altos para roles con experiencia en IA.',
    category: 'Mercado Local',
    relevance_score: 0.96,
    source: 'LinkedIn',
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Liderazgo en Era de IA: Empatía + Datos',
    content: 'Ejecutivos exitosos combinan inteligencia emocional con análisis de datos. Habilidades blandas valen 2x en mercado actual según Harvard Business Review.',
    category: 'Liderazgo',
    relevance_score: 0.92,
    source: 'Harvard Business Review',
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Certificaciones que Importan: AI Literacy',
    content: 'Estudio Global Skills Report 2026: certificaciones AI/Data tienen ROI 5x superior a MBAs. Tiempo medio de obtención: 6 meses con dedicación a tiempo parcial.',
    category: 'Educación',
    relevance_score: 0.88,
    source: 'Coursera',
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Startups Chilenas: Acceso Global a Talento',
    content: 'Plataformas como Platanus y Endeavor conectan talento chileno con oportunidades globales. Nuevas carreras emergen en economía digital.',
    category: 'Oportunidades',
    relevance_score: 0.84,
    source: 'Fundación Chile',
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Automatización: Oportunidad para Reinvención Profesional',
    content: 'Análisis: roles automáticos vs roles augmentados. Ganadores: los que trabajan CON IA. Perdedores: los que compiten con IA. Importancia de reskilling.',
    category: 'Tecnología',
    relevance_score: 0.90,
    source: 'Forbes',
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Tendencia: Work from Anywhere se Consolida',
    content: 'Remote work flexible es ahora estándar en empresas tech. Oportunidades para trabajadores de cualquier ubicación en Chile.',
    category: 'Tendencias',
    relevance_score: 0.85,
    source: 'TechCrunch',
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Metodologías Ágiles: Requisito Mínimo 2026',
    content: 'Empresas requieren certificaciones Scrum o Kanban. Desarrollo profesional acelerado con metodologías modernas.',
    category: 'Educación',
    relevance_score: 0.82,
    source: 'PMI',
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
]

async function fetchFromNewsAPI() {
  if (!newsApiKey) {
    console.log('[v0] No NEWS_API_KEY provided - using curated news only')
    return []
  }

  try {
    console.log('[v0] Fetching from NewsAPI...')
    const queries = [
      'artificial intelligence jobs careers',
      'career development 2026',
      'labor market trends',
      'professional development skills',
      'remote work opportunities'
    ]

    let allNews = []

    for (const query of queries) {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=3`
      
      console.log(`[v0] Fetching for query: "${query}"`)
      
      try {
        const response = await fetch(url, {
          headers: { 'X-Api-Key': newsApiKey }
        })

        if (!response.ok) {
          console.warn(`[v0] NewsAPI returned ${response.status}`)
          continue
        }

        const data = await response.json()
        if (!data.articles) {
          console.warn(`[v0] No articles found for query: "${query}"`)
          continue
        }

        allNews.push(...data.articles.map((article, idx) => ({
          title: article.title || 'Untitled',
          content: article.description || article.content || article.title || '',
          category: 'Tecnología', // Default category
          relevance_score: 0.75, // Default relevance
          source: article.source?.name || 'NewsAPI',
          published_at: new Date(article.publishedAt || Date.now()).toISOString()
        })))
      } catch (err) {
        console.warn(`[v0] Error fetching query "${query}":`, err.message)
      }
    }

    console.log(`[v0] Fetched ${allNews.length} articles from NewsAPI`)
    return allNews
  } catch (error) {
    console.error('[v0] NewsAPI fetch error:', error.message)
    return []
  }
}

async function seedNoticias() {
  console.log('[v0] Starting noticias seeding...')
  
  // Fetch from NewsAPI first
  let newsApiArticles = await fetchFromNewsAPI()
  
  // Combine with curated news (curated first for priority)
  const noticias = [...CURATED_NEWS, ...newsApiArticles]
  
  // Remove duplicates based on title
  const seen = new Set()
  const unique = noticias.filter(n => {
    if (seen.has(n.title.toLowerCase())) return false
    seen.add(n.title.toLowerCase())
    return true
  })

  console.log(`[v0] Total unique articles: ${unique.length}`)
  console.log(`[v0] Inserting into Supabase...`)

  // Insert into Supabase
  const { data, error } = await supabase
    .from('a4_noticias')
    .insert(unique)
    .select()

  if (error) {
    console.error('[v0] Supabase insert error:', error)
    process.exit(1)
  }

  console.log(`[v0] Successfully inserted ${data.length} noticias`)
  console.log('[v0] Seeding complete!')
  process.exit(0)
}

seedNoticias()
