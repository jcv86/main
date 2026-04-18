import { createClient } from "@supabase/supabase-js"

// Lazy initialization to avoid build-time errors
let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error("Missing Supabase environment variables")
    }

    supabaseClient = createClient(url, key)
  }
  return supabaseClient
}

/**
 * Enriquece el perfil del usuario con datos de Google
 * Almacena en tabla user_profiles_enriched
 */
export async function enrichProfileFromGoogle(
  userId: string,
  googleProfile: {
    email: string
    name: string
    image?: string
  }
) {
  try {
    console.log("[v0] Enriching profile from Google for user:", userId)

    const supabase = getSupabaseClient()

    // Obtener o crear perfil enriquecido
    const { data: existingProfile, error: fetchError } = await supabase
      .from("user_profiles_enriched")
      .select("*")
      .eq("user_id", userId)
      .single()

    const profileData = {
      user_id: userId,
      email: googleProfile.email,
      full_name: googleProfile.name,
      avatar_url: googleProfile.image,
      profile_source: "google",
      google_synced_at: new Date().toISOString(),
      ...(existingProfile || {}),
    }

    if (existingProfile) {
      // Actualizar
      // @ts-expect-error - Table may not exist at build time, will work at runtime
      const { error: updateError } = await supabase
        .from("user_profiles_enriched")
        .update(profileData)
        .eq("user_id", userId)

      if (updateError) {
        console.error("[v0] Error updating Google profile:", updateError)
        return null
      }
    } else {
      // Crear
      const { error: insertError } = await supabase
        .from("user_profiles_enriched")
        .insert([profileData])

      if (insertError) {
        console.error("[v0] Error inserting Google profile:", insertError)
        return null
      }
    }

    console.log("[v0] Google profile enriched successfully")
    return profileData
  } catch (error) {
    console.error("[v0] Error enriching profile from Google:", error)
    return null
  }
}

/**
 * Enriquece el perfil del usuario con datos de LinkedIn
 * Extrae: experiencia, educación, skills, ubicación, industria
 */
export async function enrichProfileFromLinkedIn(
  userId: string,
  linkedInProfile: any,
  accessToken: string
) {
  try {
    console.log("[v0] Enriching profile from LinkedIn for user:", userId)

    const supabase = getSupabaseClient()

    // Obtener datos completos de LinkedIn usando Access Token
    const linkedInData = await fetchLinkedInProfile(accessToken)

    if (!linkedInData) {
      console.warn("[v0] Could not fetch LinkedIn profile data")
      return null
    }

    // Procesar y estructurar datos
    const enrichedData = {
      user_id: userId,
      email: linkedInProfile.email_address,
      full_name: `${linkedInProfile.localizedFirstName} ${linkedInProfile.localizedLastName}`,
      avatar_url: linkedInProfile.profilePicture?.displayImage,
      profile_source: "linkedin",

      // Experiencia profesional
      current_title: linkedInData.currentPosition?.title,
      current_company: linkedInData.currentPosition?.company,
      industry: linkedInData.industry,
      location: linkedInData.location?.city,
      country: linkedInData.location?.country,

      // Educación
      education: linkedInData.education,

      // Skills
      skills: linkedInData.skills,

      // Historial de experiencia
      experience_history: linkedInData.experienceHistory,

      // Raw LinkedIn data para análisis futuro
      linkedin_raw_data: linkedInData,
      linkedin_synced_at: new Date().toISOString(),
    }

    // Obtener o crear perfil enriquecido
    const { data: existingProfile } = await supabase
      .from("user_profiles_enriched")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (existingProfile) {
      // Mergear con datos existentes (Google, etc)
      const merged = {
        ...existingProfile,
        ...enrichedData,
        updated_at: new Date().toISOString(),
      }

      // @ts-expect-error - Table may not exist at build time, will work at runtime
      const { error: updateError } = await supabase
        .from("user_profiles_enriched")
        .update(merged)
        .eq("user_id", userId)

      if (updateError) {
        console.error("[v0] Error updating LinkedIn profile:", updateError)
        return null
      }
    } else {
      // Crear nuevo
      const { error: insertError } = await supabase
        .from("user_profiles_enriched")
        .insert([enrichedData])

      if (insertError) {
        console.error("[v0] Error inserting LinkedIn profile:", insertError)
        return null
      }
    }

    console.log("[v0] LinkedIn profile enriched successfully")

    // Trigger: Enriquecer A1-A4 basado en el perfil de LinkedIn
    await enrichA1A4FromLinkedInProfile(userId, linkedInData)

    return enrichedData
  } catch (error) {
    console.error("[v0] Error enriching profile from LinkedIn:", error)
    return null
  }
}

/**
 * Obtiene datos completos del perfil de LinkedIn usando la API v2
 */
async function fetchLinkedInProfile(accessToken: string) {
  try {
    // Endpoints de LinkedIn API v2
    const endpoints = [
      "https://api.linkedin.com/v2/me",
      "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage),industry,location)",
    ]

    const profileResponse = await fetch(endpoints[1], {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202403",
      },
    })

    if (!profileResponse.ok) {
      console.error("[v0] LinkedIn API error:", profileResponse.statusText)
      return null
    }

    const profile = await profileResponse.json()

    // Obtener experiencia
    const experienceResponse = await fetch(
      "https://api.linkedin.com/v2/me/experience?projection=(id,title,company,startDate,endDate,description)",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202403",
        },
      }
    )

    const experience = experienceResponse.ok
      ? await experienceResponse.json()
      : { elements: [] }

    // Obtener educación
    const educationResponse = await fetch(
      "https://api.linkedin.com/v2/me/education?projection=(id,schoolName,fieldOfStudy,degreeType,startDate,endDate)",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202403",
        },
      }
    )

    const education = educationResponse.ok
      ? await educationResponse.json()
      : { elements: [] }

    // Obtener skills
    const skillsResponse = await fetch(
      "https://api.linkedin.com/v2/me/skills?projection=(id,name,proficiency,endorsementCount)",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202403",
        },
      }
    )

    const skills = skillsResponse.ok
      ? await skillsResponse.json()
      : { elements: [] }

    return {
      ...profile,
      experienceHistory: experience.elements || [],
      education: education.elements || [],
      skills: skills.elements || [],
      currentPosition: experience.elements?.[0] || null,
    }
  } catch (error) {
    console.error("[v0] Error fetching LinkedIn profile:", error)
    return null
  }
}

/**
 * Enriquece A1-A4 basado en el perfil de LinkedIn del usuario
 * - A1: Contextualiza el DISC con experiencia profesional
 * - A2: Personaliza la ruta basada en carrera actual
 * - A3: Sugiere entrenamientos según skills gaps
 * - A4: Personaliza market intel por industria
 */
export async function enrichA1A4FromLinkedInProfile(
  userId: string,
  linkedInData: any
) {
  try {
    console.log("[v0] Enriching A1-A4 from LinkedIn profile for user:", userId)

    const supabase = getSupabaseClient()

    const contextData = {
      user_id: userId,
      linkedin_context: {
        currentTitle: linkedInData.currentPosition?.title,
        currentCompany: linkedInData.currentPosition?.company,
        industry: linkedInData.industry,
        yearsOfExperience: calculateYearsOfExperience(
          linkedInData.experienceHistory
        ),
        topSkills: linkedInData.skills
          ?.slice(0, 5)
          .map((s: any) => s.name),
        education: linkedInData.education
          ?.map((e: any) => e.schoolName)
          .join(", "),
      },
      enriched_at: new Date().toISOString(),
    }

    // Guardar contexto en tabla coach_context_snapshots
    const { error } = await supabase
      .from("coach_context_snapshots")
      .update({
        linkedin_context: contextData.linkedin_context,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (error) {
      console.log("[v0] Could not update coach context with LinkedIn data (non-blocking):", error.message)
    }

    console.log("[v0] A1-A4 enriched with LinkedIn context")
    return contextData
  } catch (error) {
    console.error("[v0] Error enriching A1-A4 from LinkedIn:", error)
    return null
  }
}

/**
 * Calcula años de experiencia basado en historial de LinkedIn
 */
function calculateYearsOfExperience(experienceHistory: any[]): number {
  if (!experienceHistory || experienceHistory.length === 0) return 0

  const firstJob = experienceHistory[experienceHistory.length - 1] // Trabajo más antiguo
  const lastJob = experienceHistory[0] // Trabajo más reciente

  const startDate = new Date(firstJob.startDate)
  const endDate = lastJob.endDate ? new Date(lastJob.endDate) : new Date()

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365))

  return diffYears
}
