import { createClient } from "@/lib/supabase/server"

export async function getA3Scenarios(rutaId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("despega_a3_scenarios")
    .select("*")
    .eq("is_active", true)

  if (rutaId) {
    query = query.eq("ruta_id", rutaId)
  }

  const { data } = await query

  return data || []
}

export async function getUserA3Progress() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("despega_user_a3_progress")
    .select("*")
    .eq("user_id", user.id)

  return data || []
}

export async function getA3ScenarioById(scenarioId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("despega_a3_scenarios")
    .select("*")
    .eq("id", scenarioId)
    .single()

  return data
}

export async function getA3SimulationContent(scenarioId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("despega_a3_simulation_content")
    .select("*")
    .eq("scenario_id", scenarioId)
    .order("order_index")

  return data || []
}

export async function getUserA3ScenarioProgress(scenarioId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("despega_user_a3_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("scenario_id", scenarioId)
    .single()

  return data
}

export async function getA3RutaProgress(rutaId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("despega_user_a3_progress")
    .select("*")
    .eq("user_id", user.id)
    // Filter by scenarios in this ruta
    .in("scenario_id", 
      (await supabase
        .from("despega_a3_scenarios")
        .select("id")
        .eq("ruta_id", rutaId)).data?.map(s => s.id) || []
    )

  return data || []
}
