import { createClient } from '@/lib/supabase/client'

export interface RadarNews {
  id: string
  titulo: string
  excerpt: string
  source: string
  published_at: string
  categoria: string
  relevance_score: number
  delta_estrategico: string
  capa_2_delta: string
  capa_3_nivel_energia: string
  capa_4_descuento_mercado: string
  capa_5_tension_narrativa: string
  capa_6_ritmo_narrativo: string
  capa_7_impacto_plazo: string
  weak_signals?: string[]
}

export async function getRadarNews(limit: number = 10): Promise<RadarNews[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('a4_noticias')
      .select('*')
      .order('relevance_score', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('[v0] Error fetching radar news:', error)
    return []
  }
}

export async function getRadarNewsByCategory(
  categoria: string,
  limit: number = 10
): Promise<RadarNews[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('a4_noticias')
      .select('*')
      .eq('categoria', categoria)
      .order('relevance_score', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('[v0] Error fetching category news:', error)
    return []
  }
}

export async function trackNewsEngagement(
  userId: string,
  newsId: string,
  engagementType: 'read' | 'save' | 'share'
): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('a4_news_engagement')
      .insert([
        {
          user_id: userId,
          news_id: newsId,
          engagement_type: engagementType,
          created_at: new Date().toISOString(),
        },
      ])

    if (error) throw error

    // Award points for read
    if (engagementType === 'read') {
      await awardPoints(userId, 1, 'news_read', newsId)
    }

    return true
  } catch (error) {
    console.error('[v0] Error tracking engagement:', error)
    return false
  }
}

async function awardPoints(
  userId: string,
  points: number,
  reason: string,
  relatedId?: string
): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('a4_points_history')
      .insert([
        {
          user_id: userId,
          points,
          reason,
          related_id: relatedId,
          created_at: new Date().toISOString(),
        },
      ])

    if (error) throw error
    return true
  } catch (error) {
    console.error('[v0] Error awarding points:', error)
    return false
  }
}

export async function searchRadarNews(query: string, limit: number = 10): Promise<RadarNews[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('a4_noticias')
      .select('*')
      .or(`titulo.ilike.%${query}%,excerpt.ilike.%${query}%,delta_estrategico.ilike.%${query}%`)
      .order('relevance_score', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('[v0] Error searching news:', error)
    return []
  }
}
