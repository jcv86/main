import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const NEWSAPI_KEY = process.env.NEWSAPI_KEY
const NEWSAPI_URL = 'https://newsapi.org/v2/everything'

// Mapeo de temas a keywords de noticias
const themeKeywordMap: Record<string, string[]> = {
  liderazgo: ['liderazgo', 'leadership', 'CEO', 'management', 'estrategia'],
  comunicacion: ['comunicación', 'presentaciones', 'storytelling', 'influencia', 'equipo'],
  emprendimiento: ['startup', 'emprendedor', 'innovación', 'negocios', 'inversión'],
  'transformacion-digital': ['inteligencia artificial', 'automatización', 'tecnología', 'digital', 'datos'],
  gestion: ['gestión', 'procesos', 'calidad', 'mejora continua', 'operaciones'],
  'desarrollo-personal': ['productividad', 'crecimiento', 'habilidades', 'bienestar', 'coaching'],
  ventas: ['ventas', 'comercial', 'clientes', 'ingresos', 'business development'],
  default: ['negocios', 'carrera', 'mercado laboral'],
}

// Tags por perfil DISC para scoring
const discTagMap: Record<string, string[]> = {
  D: ['decisión', 'liderazgo', 'resultados', 'estrategia', 'competencia', 'éxito'],
  I: ['comunicación', 'equipo', 'influencia', 'relaciones', 'colaboración', 'conexión'],
  S: ['estabilidad', 'proceso', 'calidad', 'consistencia', 'apoyo', 'confianza'],
  C: ['análisis', 'datos', 'precisión', 'sistema', 'excelencia', 'mejora'],
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, training_tema, training_id } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user profile (DISC)
    const { data: profile } = await supabase
      .from('despega_user_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single()

    const discProfile = profile?.perfil_dominante || 'D'
    const keywords = themeKeywordMap[training_tema] || themeKeywordMap.default
    const discTags = discTagMap[discProfile as keyof typeof discTagMap] || discTagMap.D

    console.log(`[v0] Personalizing A4 feed for user ${user_id}`, {
      theme: training_tema,
      disc: discProfile,
      keywords_count: keywords.length,
      tags_count: discTags.length,
    })

    // Fetch personalized news from top keywords
    const newsResults = await Promise.all(
      keywords.slice(0, 3).map((keyword) =>
        fetch(
          `${NEWSAPI_URL}?q=${encodeURIComponent(keyword)}&language=es&sortBy=publishedAt&pageSize=3`,
          { headers: { Authorization: `Bearer ${NEWSAPI_KEY}` } }
        )
          .then((r) => r.json())
          .then((data) => data.articles || [])
          .catch(() => [])
      )
    )

    const allArticles = newsResults.flat()

    // Score articles by tag relevance and DISC match
    const scoredArticles = allArticles
      .slice(0, 5)
      .map((article: any) => {
        const title = (article.title || '').toLowerCase()
        const description = (article.description || '').toLowerCase()
        const content = (article.content || '').toLowerCase()
        const fullText = `${title} ${description} ${content}`

        let relevanceScore = 0

        // Score by DISC tags (more important)
        discTags.forEach((tag) => {
          if (fullText.includes(tag.toLowerCase())) {
            relevanceScore += 15
          }
        })

        // Score by theme keywords (medium importance)
        keywords.forEach((keyword) => {
          if (fullText.includes(keyword.toLowerCase())) {
            relevanceScore += 8
          }
        })

        return {
          source_id: article.source?.id || 'unknown',
          source_name: article.source?.name || 'Unknown Source',
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.urlToImage,
          published_at: article.publishedAt,
          relevance_score: relevanceScore,
          content: article.content,
        }
      })
      .filter((a) => a.relevance_score > 0)
      .sort((a, b) => b.relevance_score - a.relevance_score)

    // Save personalized feed record
    if (training_id) {
      const { error: feedError } = await supabase.from('a4_personalized_feeds').insert({
        user_id,
        training_module_id: training_id,
        keywords: keywords,
        disc_profile: discProfile,
        disc_tags: discTags,
        active: true,
      })

      if (feedError) {
        console.warn('[v0] Error saving personalized feed record:', feedError)
      }
    }

    console.log(
      `[v0] A4 feed personalized: ${scoredArticles.length} articles scored for ${discProfile} profile`
    )

    return NextResponse.json({
      success: true,
      theme: training_tema,
      disc_profile: discProfile,
      articles_count: scoredArticles.length,
      articles: scoredArticles,
      keywords,
      disc_tags: discTags,
    })
  } catch (error) {
    console.error('[v0] Error personalizing A4 feed:', error)
    return NextResponse.json(
      { error: 'Failed to personalize feed' },
      { status: 500 }
    )
  }
}
