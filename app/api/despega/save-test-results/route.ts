import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      dominantProfile,
      secondaryProfile,
      scores,
      caminoPersona,
      caminoProfesional,
    } = body

    // Get Supabase credentials from env
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("[v0] Missing Supabase credentials")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Create server client with cookies
    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle error
          }
        },
      },
    })

    if (!supabase || !supabase.auth) {
      console.error("[v0] Supabase client initialization failed")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User ID:", user.id, "Email:", user.email)

    // First, ensure despega_user_profiles exists and update onboarding_cerebral_completed
    const { data: existingProfile, error: profileFetchError } = await supabase
      .from("despega_user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    console.log("[v0] Existing profile:", existingProfile, "Error:", profileFetchError)

    let profileData
    if (!existingProfile || profileFetchError) {
      // Create new profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from("despega_user_profiles")
        .insert({
          user_id: user.id,
          onboarding_cerebral_completed: true,
          onboarding_cerebral_completed_at: new Date().toISOString(),
          a1_test_completed: true,
          a1_test_completed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (createError) {
        console.error("[v0] Error creating profile:", createError)
      } else {
        profileData = newProfile
        console.log("[v0] Profile created successfully:", profileData)
      }
    } else {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from("despega_user_profiles")
        .update({
          onboarding_cerebral_completed: true,
          onboarding_cerebral_completed_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single()

      if (updateError) {
        console.error("[v0] Error updating profile:", updateError)
      } else {
        profileData = updatedProfile
        console.log("[v0] Profile updated successfully:", profileData)
      }
    }

    // Save to unified_test_results
    const { data: testData, error: testError } = await supabase
      .from("unified_test_results")
      .insert({
        user_email: user.email,
        test_type: "personality_assessment",
        test_results: {
          d_score: Math.round(scores.D),
          i_score: Math.round(scores.I),
          s_score: Math.round(scores.S),
          c_score: Math.round(scores.C),
          dominant_profile: dominantProfile,
          secondary_profile: secondaryProfile,
          camino_persona: caminoPersona,
          camino_profesional: caminoProfesional,
        },
      })
      .select()

    if (testError) {
      console.error("[v0] Error saving test results:", testError)
      return NextResponse.json(
        { error: "Failed to save test results" },
        { status: 500 }
      )
    }

    console.log("[v0] Test results saved successfully:", testData)

    // Get or create a1_progress record
    const { data: progressData, error: fetchError } = await supabase
      .from("a1_progress")
      .select("*")
      .eq("user_id", user.id)
      .single()

    console.log("[v0] Fetched progress data:", progressData, "Error:", fetchError)

    // If no progress record exists, create one. Otherwise, increment tests_completed
    const testsCompleted = (progressData?.tests_completed || 0) + 1

    const { data: updatedProgress, error: updateError } = await supabase
      .from("a1_progress")
      .upsert({
        user_id: user.id,
        tests_completed: testsCompleted,
        cerebral_completed: true,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: "user_id"
      })
      .select()

    if (updateError) {
      console.error("[v0] Error updating progress:", updateError)
    } else {
      console.log("[v0] Progress updated successfully:", updatedProgress)
    }

    // Verify the update was applied
    const { data: verifyProgress } = await supabase
      .from("a1_progress")
      .select("*")
      .eq("user_id", user.id)
      .single()

    console.log("[v0] Verified progress after update:", verifyProgress)

    // CONEXIÓN A1→A2: Generar recomendaciones personalizadas basadas en DISC
    console.log("[v0] Starting A1→A2 connection logic...")
    
    const a2Recommendations = generateA2Recommendations(dominantProfile, secondaryProfile)
    
    // Guardar recomendaciones en tabla de rutas sugeridas
    const { data: a2SuggestedRoutes, error: routesError } = await supabase
      .from('a2_suggested_routes')
      .insert({
        user_id: user.id,
        perfil_dominante: dominantProfile,
        perfil_secundario: secondaryProfile,
        rutas_recomendadas: a2Recommendations,
        disc_scores: {
          d: Math.round(scores.D),
          i: Math.round(scores.I),
          s: Math.round(scores.S),
          c: Math.round(scores.C),
        },
        creado_en: new Date().toISOString(),
      })
      .select()

    if (routesError) {
      console.warn("[v0] Error saving A2 suggestions (non-critical):", routesError)
    } else {
      console.log("[v0] A2 recommendations saved:", a2SuggestedRoutes)
    }

    return NextResponse.json({
      success: true,
      data: testData,
      progress: updatedProgress,
      a2_recommendations: a2Recommendations,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * Genera recomendaciones de rutas A2 basadas en el perfil DISC
 */
function generateA2Recommendations(
  dominant: string,
  secondary: string
): Array<{ ruta: string; enfoque: string; razon: string }> {
  const recommendations: Record<
    string,
    Array<{ ruta: string; enfoque: string; razon: string }>
  > = {
    D: [
      {
        ruta: "Liderazgo Estratégico",
        enfoque: "decisiones",
        razon:
          "Tu perfil D prospera tomando decisiones rápidas. Desarrolla estrategia a nivel ejecutivo.",
      },
      {
        ruta: "Emprendimiento",
        enfoque: "visión",
        razon: "Necesitas autonomía y resultados. Ideal para iniciar proyectos.",
      },
      {
        ruta: "Transformación Digital",
        enfoque: "impacto",
        razon: "Lidera cambios disruptivos con tu orientación hacia resultados.",
      },
    ],
    I: [
      {
        ruta: "Comunicación Efectiva",
        enfoque: "influencia",
        razon:
          "Tu energía y carisma I es tu mayor fortaleza. Domina la persuasión y presentaciones.",
      },
      {
        ruta: "Liderazgo de Equipos",
        enfoque: "motivación",
        razon: "Inspiras a otros. Desarrolla habilidades de coaching y delegación.",
      },
      {
        ruta: "Ventas y Negociación",
        enfoque: "cierre",
        razon:
          "Tu capacidad de conexión es valiosa. Convierte relaciones en resultados.",
      },
    ],
    S: [
      {
        ruta: "Gestión de Procesos",
        enfoque: "estabilidad",
        razon:
          "Tu consistencia S es perfecta para sistemas. Mejora eficiencia operativa.",
      },
      {
        ruta: "Coaching y Mentoreo",
        enfoque: "apoyo",
        razon: "Eres natural apoyando a otros. Formalizalo como experto.",
      },
      {
        ruta: "Gestión de Proyectos",
        enfoque: "continuidad",
        razon:
          "Tu confiabilidad S asegura ejecución. Domina metodologías ágiles.",
      },
    ],
    C: [
      {
        ruta: "Análisis y Estrategia",
        enfoque: "precisión",
        razon:
          "Tu pensamiento crítico C es invaluable. Especialízate en data-driven decisions.",
      },
      {
        ruta: "Calidad y Mejora Continua",
        enfoque: "excelencia",
        razon:
          "Buscas perfección. Lidera iniciativas de excelencia organizacional.",
      },
      {
        ruta: "Compliance y Riesgos",
        enfoque: "control",
        razon: "Tu atención al detalle es crítica para roles de gobernanza.",
      },
    ],
  }

  return recommendations[dominant] || recommendations.D
}

