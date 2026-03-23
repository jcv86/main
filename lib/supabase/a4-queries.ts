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

/**
 * =====================
 * GAMIFIED TESTS QUERIES
 * =====================
 */

export async function getGamifiedTests(limit = 20) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_gamified_tests')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('[v0] Error fetching gamified tests:', error)
    return []
  }
  
  return data || []
}

export async function getTestById(testId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_gamified_tests')
    .select('*')
    .eq('id', testId)
    .single()
  
  if (error) {
    console.error('[v0] Error fetching test:', error)
    return null
  }
  
  return data
}

export async function getUserTestCompletions(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_user_test_completions')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
  
  if (error) {
    console.error('[v0] Error fetching test completions:', error)
    return []
  }
  
  return data || []
}

export async function submitTestAnswers(
  userId: string,
  testId: string,
  answers: any,
  score: number
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_user_test_completions')
    .insert({
      user_id: userId,
      test_id: testId,
      answers: answers,
      score: score,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()
  
  if (error) {
    console.error('[v0] Error submitting test answers:', error)
    return null
  }
  
  return data
}

/**
 * =====================
 * NOTICIAS QUERIES (Enhanced)
 * =====================
 */

export async function getNoticiasPaginated(page = 1, limit = 10, category?: string) {
  const supabase = createClient()
  const offset = (page - 1) * limit
  
  let query = supabase
    .from('a4_noticias')
    .select('*', { count: 'exact' })
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data, count, error } = await query
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error('[v0] Error fetching paginated noticias:', error)
    return { noticias: [], total: 0 }
  }
  
  return {
    noticias: data || [],
    total: count || 0,
  }
}

export async function searchNoticias(searchQuery: string, limit = 20) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_noticias')
    .select('*')
    .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
    .order('published_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('[v0] Error searching noticias:', error)
    return []
  }
  
  return data || []
}

export async function getNoticiasByCategory() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_noticias')
    .select('category')
    .distinct()
  
  if (error) {
    console.error('[v0] Error fetching categories:', error)
    return []
  }
  
  return (data?.map((item: any) => item.category).filter(Boolean) as string[]) || []
}

/**
 * =====================
 * PERSONALIZATION QUERIES
 * =====================
 */

export async function getUserDISCProfile(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a1_disc_assessment')
    .select('disc_profile, dominant_pattern, secondary_pattern')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  if (error) {
    console.error('[v0] Error fetching DISC profile:', error)
    return null
  }
  
  return data
}

export async function getPersonalizedFeedSettings(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_personalized_feeds')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
  
  if (error) {
    console.error('[v0] Error fetching personalized feed:', error)
    return []
  }
  
  return data || []
}

/**
 * =====================
 * BIBLIOTECA QUERIES
 * =====================
 */

export async function getBibliotecaResources(limit = 20, category?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from('biblioteca')
    .select('*')
    .eq('is_verified', true)
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
    .order('relevance_score', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('[v0] Error fetching biblioteca resources:', error)
    return []
  }
  
  return data || []
}

export async function getBibliotecaCategories() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('biblioteca')
    .select('category')
    .eq('is_verified', true)
    .distinct()
  
  if (error) {
    console.error('[v0] Error fetching biblioteca categories:', error)
    return []
  }
  
  return (data?.map((item: any) => item.category).filter(Boolean) as string[]) || []
}

export async function saveResource(userId: string, resourceId: string, resourceType: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('a4_user_saved_resources')
    .insert({
      user_id: userId,
      resource_id: resourceId,
      resource_type: resourceType,
      saved_at: new Date().toISOString(),
    })
  
  if (error) {
    console.error('[v0] Error saving resource:', error)
    return false
  }
  
  return true
}

export async function getUserSavedResources(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_user_saved_resources')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })
  
  if (error) {
    console.error('[v0] Error fetching saved resources:', error)
    return []
  }
  
  return data || []
}

/**
 * =====================
 * ENGAGEMENT TRACKING (Enhanced)
 * =====================
 */

export async function trackNewsEngagement(
  userId: string,
  newsId: string,
  engagementType: 'view' | 'read' | 'save' | 'share',
  metadata?: Record<string, any>
) {
  const supabase = createClient()
  
  let pointsGanados = 0
  if (engagementType === 'read') pointsGanados = 1
  if (engagementType === 'share') pointsGanados = 2
  
  const { error } = await supabase
    .from('a4_news_engagement')
    .upsert({
      user_id: userId,
      news_id: newsId,
      leido: engagementType === 'read' || engagementType === 'view',
      guardado: engagementType === 'save',
      leido_at: engagementType === 'read' ? new Date().toISOString() : undefined,
      guardado_at: engagementType === 'save' ? new Date().toISOString() : undefined,
      puntos_ganados: pointsGanados,
    }, {
      onConflict: 'user_id,news_id'
    })
  
  if (error) {
    console.error('[v0] Error tracking news engagement:', error)
    return false
  }
  
  // Award points if earned
  if (pointsGanados > 0) {
    await awardPoints(userId, pointsGanados, 'news_engagement', newsId)
  }
  
  return true
}

/**
 * =====================
 * POINTS & BADGES (Helper)
 * =====================
 */

export async function awardPoints(
  userId: string,
  pointsAmount: number,
  reason: string,
  relatedId?: string
) {
  const supabase = createClient()
  
  // Get current balance
  const { data: currentData } = await supabase
    .from('a4_points_history')
    .select('balance_nuevo')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  const balanceAnterior = currentData?.balance_nuevo || 0
  const balanceNuevo = balanceAnterior + pointsAmount
  
  // Insert points history
  const { error } = await supabase
    .from('a4_points_history')
    .insert({
      user_id: userId,
      puntos_ganados: pointsAmount,
      balance_anterior: balanceAnterior,
      balance_nuevo: balanceNuevo,
      razon: reason,
      relacionado_a: reason,
      relacionado_id: relatedId || null,
    })
  
  if (error) {
    console.error('[v0] Error awarding points:', error)
    return false
  }

  return true
}

/**
 * =====================
 * BADGES & ACHIEVEMENTS
 * =====================
 */

export async function getUserBadges(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_user_badges')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
  
  if (error) {
    console.error('[v0] Error fetching badges:', error)
    return []
  }
  
  return data || []
}

export async function awardBadge(userId: string, badgeId: string, badgeName: string, description: string) {
  const supabase = createClient()
  
  // Check if user already has this badge
  const { data: existing } = await supabase
    .from('a4_user_badges')
    .select('id')
    .eq('user_id', userId)
    .eq('badge_id', badgeId)
    .maybeSingle()
  
  if (existing) {
    return false // Already has badge
  }
  
  const { error } = await supabase
    .from('a4_user_badges')
    .insert({
      user_id: userId,
      badge_id: badgeId,
      badge_name: badgeName,
      description: description,
      earned_at: new Date().toISOString(),
    })
  
  if (error) {
    console.error('[v0] Error awarding badge:', error)
    return false
  }
  
  return true
}

export async function getUserPoints(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_points_history')
    .select('balance_nuevo')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  if (error) {
    console.error('[v0] Error fetching points:', error)
    return 0
  }
  
  return data?.balance_nuevo || 0
}

export async function getPointsHistory(userId: string, limit = 20) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_points_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('[v0] Error fetching points history:', error)
    return []
  }
  
  return data || []
}

/**
 * =====================
 * ENGAGEMENT METRICS
 * =====================
 */

export async function getUserEngagementMetrics(userId: string) {
  const supabase = createClient()
  
  // Get articles read
  const { data: articlesRead } = await supabase
    .from('a4_news_engagement')
    .select('id')
    .eq('user_id', userId)
    .eq('leido', true)
    .count('exact')
  
  // Get articles shared
  const { data: articlesShared } = await supabase
    .from('a4_news_engagement')
    .select('id')
    .eq('user_id', userId)
    .eq('guardado', true)
    .count('exact')
  
  // Get tests completed
  const { data: testsCompleted } = await supabase
    .from('a4_user_test_completions')
    .select('score')
    .eq('user_id', userId)
  
  // Get resources saved
  const { data: resourcesSaved } = await supabase
    .from('a4_user_saved_resources')
    .select('id')
    .eq('user_id', userId)
    .count('exact')
  
  const testScores = testsCompleted?.map(t => t.score) || []
  const averageTestScore = testScores.length > 0 
    ? testScores.reduce((a, b) => a + b, 0) / testScores.length 
    : 0
  
  return {
    articles_read: articlesRead?.count || 0,
    articles_shared: articlesShared?.count || 0,
    tests_completed: testsCompleted?.length || 0,
    average_test_score: averageTestScore,
    resources_saved: resourcesSaved?.count || 0,
    reading_streak: 0, // This would be calculated from consecutive days
    social_reach: (articlesShared?.count || 0) * 5, // Estimate
    libraries_accessed: 0, // Track library visits separately
  }
}

/**
 * =====================
 * LEADERBOARD & RANKINGS
 * =====================
 */

export async function getGlobalLeaderboard(limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('a4_points_history')
    .select('user_id, balance_nuevo, created_at')
    .order('balance_nuevo', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('[v0] Error fetching leaderboard:', error)
    return []
  }
  
  return data || []
}

export async function getUserRank(userId: string) {
  const supabase = createClient()
  
  const { data: userData } = await supabase
    .from('a4_points_history')
    .select('balance_nuevo')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  if (!userData) {
    return { rank: 0, totalPlayers: 0, points: 0 }
  }
  
  const { count, error } = await supabase
    .from('a4_points_history')
    .select('id', { count: 'exact' })
    .gt('balance_nuevo', userData.balance_nuevo)
  
  if (error) {
    console.error('[v0] Error fetching rank:', error)
    return { rank: 0, totalPlayers: 0, points: userData.balance_nuevo }
  }
  
  return {
    rank: (count || 0) + 1,
    points: userData.balance_nuevo,
    totalPlayers: 0, // This would need a separate count query
  }
}
