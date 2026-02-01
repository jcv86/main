import { createClient } from "@/lib/supabase/server"

export async function getA4MarketIntel(tipo?: string, categoria?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("despega_a4_market_intel")
    .select("*")
    .eq("es_active", true)
    .order("publicado_en", { ascending: false })

  if (tipo) {
    query = query.eq("tipo", tipo)
  }

  if (categoria) {
    query = query.eq("categoria", categoria)
  }

  const { data } = await query

  return data || []
}

export async function getA4NewsFeed() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("despega_a4_news_feed")
    .select("*")
    .eq("es_active", true)
    .order("publicado_en", { ascending: false })
    .limit(50)

  return data || []
}

export async function getA4Modules() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("despega_a4_modules")
    .select("*")
    .eq("es_active", true)
    .order("orden")

  return data || []
}

export async function getA4Resources(type?: string, categoria?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("despega_a4_resources")
    .select("*")

  if (type) {
    query = query.eq("tipo", type)
  }

  if (categoria) {
    query = query.eq("categoria", categoria)
  }

  const { data } = await query.order("calificacion", { ascending: false })

  return data || []
}

export async function getUserA4Progress() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("despega_user_a4_progress")
    .select("*")
    .eq("user_id", user.id)

  return data || []
}

export async function getUserSavedResources() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("despega_user_a4_saved_resources")
    .select("*, despega_a4_resources(*)")
    .eq("user_id", user.id)

  return data || []
}

export async function getA4MarketIntelByType(tipo: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("despega_a4_market_intel")
    .select("*")
    .eq("tipo", tipo)
    .eq("es_active", true)
    .order("publicado_en", { ascending: false })
    .limit(10)

  return data || []
}

export async function getA4ModuleById(moduleId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("despega_a4_modules")
    .select("*")
    .eq("id", moduleId)
    .single()

  return data
}
