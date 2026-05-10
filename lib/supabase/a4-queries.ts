import { createClient } from "@/lib/supabase/client"

/**
 * =====================
 * RADAR ESTRATÉGICO QUERIES
 * =====================
 */

export async function getRadarTesisDelDia() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("a4_noticias")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("[v0] Error fetching radar tesis:", error)
    return null
  }

  return data
}

export async function getRadarNoticias(limit = 5) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("a4_noticias")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching radar noticias:", error)
    return []
  }

  return data || []
}

/**
 * =====================
 * WEAK SIGNALS QUERIES
 * =====================
 */

export async function getWeakSignals(userId: string, limit = 10) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("a4_signal_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching weak signals:", error)
    return []
  }

  return data || []
}

/**
 * =====================
 * NEWS QUERIES
 * =====================
 */

export async function getNoticiasPaginated(page = 1, pageSize = 10) {
  const supabase = createClient()

  const offset = (page - 1) * pageSize

  const { data, error, count } = await supabase
    .from("a4_noticias")
    .select("*", { count: "exact" })
    .order("published_at", { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) {
    console.error("[v0] Error fetching paginated noticias:", error)
    return { items: [], total: 0 }
  }

  return {
    items: data || [],
    total: count || 0,
  }
}

export async function getNoticiasByCategory(category: string, limit = 10) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("a4_noticias")
    .select("*")
    .eq("category", category)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching noticias by category:", error)
    return []
  }

  return data || []
}

export async function searchNoticias(query: string, limit = 10) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("a4_noticias")
    .select("*")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error searching noticias:", error)
    return []
  }

  return data || []
}

export async function markNewsAsRead(userId: string, newsId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("a4_user_interactions").insert({
    user_id: userId,
    news_id: newsId,
    interaction_type: "read",
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("[v0] Error marking news as read:", error)
    return false
  }

  return true
}

export async function toggleSaveNews(userId: string, newsId: string, saved: boolean) {
  const supabase = createClient()

  if (saved) {
    const { error } = await supabase.from("a4_saved_news").insert({
      user_id: userId,
      news_id: newsId,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Error saving news:", error)
      return false
    }
  } else {
    const { error } = await supabase
      .from("a4_saved_news")
      .delete()
      .eq("user_id", userId)
      .eq("news_id", newsId)

    if (error) {
      console.error("[v0] Error unsaving news:", error)
      return false
    }
  }

  return true
}

export async function trackA4Engagement(userId: string, eventType: string, metadata?: Record<string, any>) {
  const supabase = createClient()

  const { error } = await supabase.from("a4_engagement_tracking").insert({
    user_id: userId,
    event_type: eventType,
    metadata,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("[v0] Error tracking engagement:", error)
    return false
  }

  return true
}

/**
 * =====================
 * BIBLIOTECA QUERIES
 * =====================
 */

export async function getBibliotecaCategories() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("a4_biblioteca_categories")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching biblioteca categories:", error)
    return []
  }

  return data?.map((cat: any) => cat.name) || []
}

export async function getBibliotecaResources(category?: string, search?: string, limit = 100) {
  const supabase = createClient()

  let query = supabase.from("biblioteca").select("*")

  if (category && category !== 'Todas') {
    query = query.eq("categoria", category)
  }

  if (search) {
    query = query.or(`titulo.ilike.%${search}%,autor.ilike.%${search}%,descripcion.ilike.%${search}%`)
  }

  const { data, error } = await query.order("rating", { ascending: false }).limit(limit)

  if (error) {
    console.error("[v0] Error fetching biblioteca resources:", error)
    return []
  }

  return data || []
}

export async function getUserSavedResources(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("a4_user_saved_resources")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching user saved resources:", error)
    return []
  }

  return data || []
}

export async function saveResource(userId: string, resourceId: string, resourceData?: any) {
  const supabase = createClient()

  const { error } = await supabase.from("a4_user_saved_resources").insert({
    user_id: userId,
    resource_id: resourceId,
    resource_data: resourceData,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("[v0] Error saving resource:", error)
    return false
  }

  return true
}

/**
 * =====================
 * GAMIFIED TESTS QUERIES
 * =====================
 */

export async function getGamifiedTests(userId: string, limit = 10) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("a4_gamified_tests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching gamified tests:", error)
    return []
  }

  return data || []
}

/**
 * =====================
 * GENERAL QUERIES
 * =====================
 */

export async function getUserA4Data(userId: string) {
  const supabase = createClient()

  const { data: user, error: userError } = await supabase
    .from("a4_user_state")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (userError) {
    console.error("[v0] Error fetching user A4 data:", userError)
    return null
  }

  return user
}

export async function updateUserA4State(userId: string, updates: Record<string, any>) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("a4_user_state")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .maybeSingle()

  if (error) {
    console.error("[v0] Error updating user A4 state:", error)
    return null
  }

  return data
}

export async function getA4Dashboard(userId: string) {
  const supabase = createClient()

  const [userState, signals, news] = await Promise.all([
    getUserA4Data(userId),
    getWeakSignals(userId, 5),
    getRadarNoticias(3),
  ])

  return {
    userState,
    signals,
    news,
  }
}
