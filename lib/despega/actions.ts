"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Helper functions for score calculation
function normalizeAnswersTo110(rawAnswers: Record<string, any[]>): Record<string, number[]> {
  const normalized: Record<string, number[]> = {}
  for (const [key, values] of Object.entries(rawAnswers)) {
    normalized[key] = values.map((val) => {
      const num = typeof val === 'number' ? val : parseInt(val) || 0
      return Math.max(1, Math.min(10, num))
    })
  }
  return normalized
}

function calculateDimensionScore(answers: number[], weights: number[] = []): number {
  if (!answers || answers.length === 0) return 0
  const totalWeight = weights && weights.length > 0 ? weights.reduce((a, b) => a + b, 0) : answers.length
  let weightedSum = 0
  answers.forEach((answer, index) => {
    const weight = weights && weights.length > 0 ? weights[index] || 1 : 1
    weightedSum += answer * weight
  })
  return Math.round(weightedSum / totalWeight)
}

function calculateOverallScore(scores: Record<string, number>): number {
  const values = Object.values(scores)
  if (values.length === 0) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return Math.round(sum / values.length)
}

export async function initializeDespegaProfile(camino_foco: "persona" | "profesional" | "ambos") {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const now = new Date()
  const { data, error } = await supabase
    .from("despega_user_profiles")
    .upsert({
      user_id: user.id,
      camino_foco,
      camino_persona_active: camino_foco === "persona" || camino_foco === "ambos",
      camino_profesional_active: camino_foco === "profesional" || camino_foco === "ambos",
      onboarding_completed: true,
      ciclo_start_date: now.toISOString().split("T")[0],
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  // Create initial cycles for each pilar (Issue #5: Initialize with timestamps)
  const pilares = ["a1_cerebral", "a2_rutas", "aterrizaje", "base"]
  const cycles: any[] = []
  
  for (const pilar of pilares) {
    const { data: cycleData, error: cycleError } = await supabase
      .from("despega_cycles")
      .insert({
        user_id: user.id,
        pilar,
        cycle_number: 1,
        status: "active",
        start_date: now.toISOString(),
        end_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .select()
      .single()

    if (cycleError) {
      console.error(`[v0] Error creating cycle for pilar ${pilar}:`, cycleError)
      continue
    }
    cycles.push(cycleData)

    // Initialize pilar progress for this cycle (Issue #5: Include timestamps)
    await supabase.from("despega_pilar_progress").upsert({
      user_id: user.id,
      pilar,
      cycle_id: cycleData.id,
      diagnostic_score: 0,
      points_accumulated: 0,
      missions_completed: 0,
      progress_pct: 0,
      is_unlocked: pilar === "a1_cerebral", // Only A1 starts unlocked
      ciclo_dia: 1,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    })
  }

  // Initialize rankings
  await supabase.from("despega_rankings").upsert({
    user_id: user.id,
    score_general: 0,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  })

  revalidatePath("/despega")
  return data
}

export async function completeMision(mision_id: string, respuesta?: any, tiempo_dedicado_minutos?: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  try {
    // Use atomic RPC for mission completion (Issue #9: Idempotent + Atomic)
    // This function handles: mission completion, progress update, scoring, all in one transaction
    const { data, error } = await supabase.rpc('complete_mission_transaction', {
      p_user_id: user.id,
      p_mision_id: mision_id,
      p_user_notes: respuesta,
      p_tiempo_dedicado_minutos: tiempo_dedicado_minutos || 0,
    })

    if (error) {
      console.error("[v0] RPC error in completeMision:", error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error("RPC returned no data")
    }

    const result = data[0]
    
    // Check if this was an idempotent call (already completed)
    if (result.idempotent_call) {
      console.log("[v0] Mission already completed (idempotent call prevented duplicate)")
      // Still return success, but indicate it was a duplicate
      return {
        success: true,
        mission_completed_id: result.mission_completed_id,
        points_earned: result.points_earned,
        idempotent_duplicate: true
      }
    }

    console.log("[v0] Mission completion recorded via atomic RPC", {
      mission_id: mision_id,
      points: result.points_earned,
      progress_updated: result.progress_updated,
      event_logged: result.event_logged
    })

    revalidatePath("/despega")
    
    return {
      success: true,
      mission_completed_id: result.mission_completed_id,
      points_earned: result.points_earned,
      idempotent_duplicate: false
    }
  } catch (error) {
    console.error("[v0] Error in completeMision:", error)
    throw error
  }
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
  camino: "persona" | "profesional",
  rawAnswers: any,
  contextData?: any
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  try {
    // Normalize all answers to 1-10 scale
    const normalizedAnswers = normalizeAnswersTo110(rawAnswers)

    const scores = {
      energia: calculateDimensionScore(normalizedAnswers.energia),
      enfoque: calculateDimensionScore(normalizedAnswers.enfoque),
      relaciones: calculateDimensionScore(normalizedAnswers.relaciones),
      plan_ejecutivo: calculateDimensionScore(normalizedAnswers.plan_ejecutivo),
    }

    const overall = calculateOverallScore(scores)

    // Issue #5 Fix: DO NOT pass timestamps from client
    // The RPC function will calculate them server-side to prevent manipulation
    const { data, error } = await supabase.rpc('insert_a1_results_transaction', {
      p_user_id: user.id,
      p_score_energia: scores.energia,
      p_score_enfoque: scores.enfoque,
      p_score_relaciones: scores.relaciones,
      p_score_plan_ejecutivo: scores.plan_ejecutivo,
      p_score_overall: overall,
      p_context_shift: contextData?.shiftWorker || false,
      p_context_care: contextData?.caregiving || false,
      p_context_neuro: contextData?.neurodiversity || false,
      p_context_text: contextData?.otherContext || null,
      p_context_consent: contextData?.consentGiven || false,
    })

    if (error) throw error

    console.log("[v0] A1 test results saved securely (server-calculated timestamps)")

    revalidatePath("/despega")
    return { success: true, data, scores, overall }
  } catch (error) {
    console.error("[v0] Error saving A1 test results:", error)
    throw error
  }
}
