import { createClient } from "@/lib/supabase/server"

// Helper to get active cycle for current user (Issue #6: cycle isolation)
async function getActiveCycleId(pilar?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  let query = supabase
    .from("despega_cycles")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")

  if (pilar) {
    query = query.eq("pilar", pilar)
  }

  const { data } = await query.limit(1).single()
  return data?.id || null
}

export async function getDespegaUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("despega_user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return data
}

export async function getPilarProgress(pilar: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Issue #6: Filter by active cycle to ensure data isolation
  const cycle_id = await getActiveCycleId(pilar)
  if (!cycle_id) return null

  const { data } = await supabase
    .from("despega_pilar_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("pilar", pilar)
    .eq("cycle_id", cycle_id)
    .single()

  return data
}

export async function getAllPilaresProgress() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Issue #6: Filter by active cycles
  const { data: cycles } = await supabase
    .from("despega_cycles")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")

  const cycle_ids = cycles?.map(c => c.id) || []
  if (cycle_ids.length === 0) return []

  const { data } = await supabase
    .from("despega_pilar_progress")
    .select("*")
    .eq("user_id", user.id)
    .in("cycle_id", cycle_ids)

  return data || []
}

export async function getUserRankings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("despega_rankings")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return data
}

export async function getLatestA1Results() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("despega_a1_test_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return data
}

export async function getRutasByPilar(pilar: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("despega_rutas")
    .select("*")
    .eq("pilar", pilar)
    .eq("is_active", true)
    .order("order_index")

  return data || []
}

export async function getMisionesByRuta(ruta_id: string, ciclo: number) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("despega_misiones")
    .select("*")
    .eq("ruta_id", ruta_id)
    .eq("ciclo", ciclo)
    .order("dia")

  return data || []
}

export async function getUserMisionProgress(mision_id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("despega_user_misiones")
    .select("*")
    .eq("user_id", user.id)
    .eq("mision_id", mision_id)
    .single()

  return data
}

export async function getLeaderboard(limit = 100, offset = 0) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("despega_rankings")
    .select("*")
    .order("score_general", { ascending: false })
    .range(offset, offset + limit - 1)

  return data || []
}

export async function getUserRankPosition() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: userRankings } = await supabase
    .from("despega_rankings")
    .select("rank_general")
    .eq("user_id", user.id)
    .single()

  return userRankings?.rank_general || null
}

export async function getRutaProgress(ruta_id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("despega_user_ruta_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("ruta_id", ruta_id)
    .single()

  return data
}
