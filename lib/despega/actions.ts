"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function initializeDespegaProfile(camino_foco: "persona" | "profesional" | "ambos") {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("despega_user_profiles")
    .upsert({
      user_id: user.id,
      camino_foco,
      camino_persona_active: camino_foco === "persona" || camino_foco === "ambos",
      camino_profesional_active: camino_foco === "profesional" || camino_foco === "ambos",
      onboarding_completed: true,
      ciclo_start_date: new Date().toISOString().split("T")[0],
    })
    .select()
    .single()

  if (error) throw error

  // Initialize pilar progress for both paths
  const pilares = ["a1_cerebral", "a2_rutas", "aterrizaje", "base"]
  
  for (const pilar of pilares) {
    await supabase.from("despega_pilar_progress").upsert({
      user_id: user.id,
      pilar,
      progreso: 0,
      score: 0,
      ciclo_actual: 30,
      ciclo_dia: 1,
      is_unlocked: pilar === "a1_cerebral", // Only A1 starts unlocked
    })
  }

  // Initialize rankings
  await supabase.from("despega_rankings").upsert({
    user_id: user.id,
    score_general: 0,
  })

  revalidatePath("/despega")
  return data
}

export async function completeMision(mision_id: string, respuesta?: any, tiempo_dedicado_minutos?: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // Get mision details
  const { data: mision } = await supabase
    .from("despega_misiones")
    .select("*, ruta:despega_rutas(pilar)")
    .eq("id", mision_id)
    .single()

  if (!mision) throw new Error("Mision not found")

  // Record mision completion
  const { data: userMision, error: misionError } = await supabase
    .from("despega_user_misiones")
    .upsert({
      user_id: user.id,
      mision_id,
      completed: true,
      completed_at: new Date().toISOString(),
      puntos_earned: mision.puntos,
      respuesta,
      tiempo_dedicado_minutos,
    })
    .select()
    .single()

  if (misionError) throw misionError

  // Update pilar progress
  const pilar = mision.ruta.pilar
  const { data: currentProgress } = await supabase
    .from("despega_pilar_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("pilar", pilar)
    .single()

  if (currentProgress) {
    const newScore = (currentProgress.score || 0) + mision.puntos
    const newProgreso = Math.min(currentProgress.progreso + 2, 100)

    await supabase
      .from("despega_pilar_progress")
      .update({
        score: newScore,
        progreso: newProgreso,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("pilar", pilar)
  }

  // Update rankings
  const { data: currentRanking } = await supabase
    .from("despega_rankings")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (currentRanking) {
    const scoreFieldMap: Record<string, string> = {
      "a1_cerebral": "score_a1_cerebral",
      "a2_rutas": "score_a2_rutas",
      "aterrizaje": "score_aterrizaje",
      "base": "score_base",
    }

    const scoreField = scoreFieldMap[pilar]
    const currentPilarScore = currentRanking[scoreField] || 0

    await supabase
      .from("despega_rankings")
      .update({
        [scoreField]: currentPilarScore + mision.puntos,
        score_general: (currentRanking.score_general || 0) + mision.puntos,
        total_misiones_completadas: (currentRanking.total_misiones_completadas || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
  }

  revalidatePath("/despega")
  return userMision
}

export async function updatePilarProgress(pilar: string, ciclo_actual: number, ciclo_dia: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("despega_pilar_progress")
    .update({
      ciclo_actual,
      ciclo_dia,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("pilar", pilar)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/despega")
  return data
}

export async function saveA1TestResults(
  respuestas: any,
  resultados: any,
  diagnostico: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("despega_a1_test_results")
    .insert({
      user_id: user.id,
      respuestas,
      resultados,
      diagnostico,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  // Mark A1 test as completed
  await supabase
    .from("despega_user_profiles")
    .update({
      a1_test_completed: true,
      a1_test_completed_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)

  revalidatePath("/despega")
  return data
}
