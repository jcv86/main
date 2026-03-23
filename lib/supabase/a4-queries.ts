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
