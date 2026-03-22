import { createClient } from '@/lib/supabase/client'

export interface A4NewsItem {
  id: string
  title: string
  content: string
  category: string
  relevance_score: number
  source: string
  published_at: string
  created_at: string
}

export interface A4UserRadar {
  id: string
  user_id: string
  overall_radar_level: number
  context_understanding_score: number
  strategic_reading_score: number
  consistency_score: number
  criterion_score: number
  progress_history: any
  created_at: string
  updated_at: string
}

export interface A4EngagementEvent {
  id: string
  user_id: string
  event_type: string
  feature: string
  duration_seconds?: number
  completed: boolean
  metadata?: any
  created_at: string
}

export interface A4PersonalizedFeed {
  id: string
  user_id: string
  news_category: string
  keywords: string[]
  active: boolean
  starts_at: string
  ends_at?: string
  created_at: string
}

/**
 * Fetch news articles for A4 Radar
 */
export async function getA4News(limit = 20) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_noticias')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('[v0] Error fetching A4 news:', error)
    return []
  }
  
  return data || []
}

/**
 * Fetch news by category
 */
export async function getA4NewsByCategory(category: string, limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_noticias')
    .select('*')
    .eq('category', category)
    .order('published_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('[v0] Error fetching news by category:', error)
    return []
  }
  
  return data || []
}

/**
 * Get user's radar profile
 */
export async function getUserA4Radar(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_despega_radar')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  
  if (error && error.code !== 'PGRST116') {
    console.error('[v0] Error fetching user radar:', error)
    return null
  }
  
  return data || null
}

/**
 * Get user's personalized feeds
 */
export async function getUserPersonalizedFeeds(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_personalized_feeds')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
  
  if (error) {
    console.error('[v0] Error fetching personalized feeds:', error)
    return []
  }
  
  return data || []
}

/**
 * Track engagement event
 */
export async function trackA4Engagement(
  userId: string,
  eventType: string,
  feature: string,
  data?: {
    completed?: boolean
    duration_seconds?: number
    metadata?: any
  }
) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('a4_engagement_tracking')
    .insert({
      user_id: userId,
      event_type: eventType,
      feature: feature,
      completed: data?.completed || false,
      duration_seconds: data?.duration_seconds,
      metadata: data?.metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  
  if (error) {
    console.error('[v0] Error tracking engagement:', error)
    return false
  }
  
  return true
}

/**
 * Get user's saved news
 */
export async function getUserSavedNews(userId: string, limit = 20) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_news_engagement')
    .select(`
      news_id,
      guardado_at,
      leido_at,
      a4_noticias!inner (*)
    `)
    .eq('user_id', userId)
    .eq('guardado', true)
    .order('guardado_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('[v0] Error fetching saved news:', error)
    return []
  }
  
  return data || []
}

/**
 * Mark news as read
 */
export async function markNewsAsRead(userId: string, newsId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('a4_news_engagement')
    .upsert({
      user_id: userId,
      news_id: newsId,
      leido: true,
      leido_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,news_id'
    })
  
  if (error) {
    console.error('[v0] Error marking news as read:', error)
    return false
  }
  
  return true
}

/**
 * Save/bookmark news
 */
export async function toggleSaveNews(userId: string, newsId: string, save: boolean) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('a4_news_engagement')
    .upsert({
      user_id: userId,
      news_id: newsId,
      guardado: save,
      guardado_at: save ? new Date().toISOString() : null,
    }, {
      onConflict: 'user_id,news_id'
    })
  
  if (error) {
    console.error('[v0] Error saving news:', error)
    return false
  }
  
  return true
}

/**
 * Get user's badges
 */
export async function getUserA4Badges(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_user_badges')
    .select('*')
    .eq('user_id', userId)
    .order('desbloqueado_at', { ascending: false })
  
  if (error) {
    console.error('[v0] Error fetching badges:', error)
    return []
  }
  
  return data || []
}

/**
 * Get user's points
 */
export async function getUserA4Points(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_points_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)
  
  if (error) {
    console.error('[v0] Error fetching points:', error)
    return []
  }
  
  return data || []
}

/**
 * Get total user points
 */
export async function getUserTotalPoints(userId: string): Promise<number> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_points_history')
    .select('balance_nuevo')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  if (error) {
    console.error('[v0] Error getting total points:', error)
    return 0
  }
  
  return data?.balance_nuevo || 0
}

/**
 * Get weak signals
 */
export async function getWeakSignals(userId: string, limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_signal_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('[v0] Error fetching weak signals:', error)
    return []
  }
  
  return data || []
}

/**
 * Get module progress
 */
export async function getUserModuleProgress(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_module_progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  if (error) {
    console.error('[v0] Error fetching module progress:', error)
    return []
  }
  
  return data || []
}
