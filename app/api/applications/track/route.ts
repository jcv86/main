import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, applicationId } = body

    if (!email || !applicationId) {
      return NextResponse.json({ error: "Email and application ID are required" }, { status: 400 })
    }

    // Use the stored function to get application details
    const { data, error } = await supabase.rpc("get_application_details", {
      search_email: email,
      search_app_id: applicationId,
    })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch application details" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Application not found. Please check your email and application ID." },
        { status: 404 },
      )
    }

    const application = data[0]

    // Define status progression
    const statusSteps = [
      "submitted",
      "under_review",
      "phone_screening",
      "technical_interview",
      "final_interview",
      "reference_check",
      "offer_extended",
      "offer_accepted",
      "hired",
    ]

    const currentStepIndex = statusSteps.indexOf(application.status)
    const progressPercentage =
      currentStepIndex >= 0 ? Math.round(((currentStepIndex + 1) / statusSteps.length) * 100) : 0

    // Get next steps based on current status
    const getNextSteps = (status: string) => {
      switch (status) {
        case "submitted":
          return ["Nuestro equipo de RH revisará tu aplicación en los próximos 2-3 días hábiles."]
        case "under_review":
          return [
            "Tu aplicación está siendo evaluada por el equipo técnico.",
            "Te contactaremos pronto para los siguientes pasos.",
          ]
        case "phone_screening":
          return [
            "Prepárate para una conversación telefónica de 30 minutos.",
            "Revisa la descripción del puesto y prepara preguntas.",
          ]
        case "technical_interview":
          return ["Prepárate para la entrevista técnica.", "Revisa conceptos relevantes para el puesto."]
        case "final_interview":
          return ["Entrevista final con el equipo directivo.", "Prepara preguntas sobre la cultura de la empresa."]
        case "reference_check":
          return ["Estamos verificando tus referencias.", "Asegúrate de que tus referencias estén disponibles."]
        case "offer_extended":
          return ["¡Felicitaciones! Te hemos enviado una oferta.", "Revisa los términos y responde cuando estés listo."]
        case "offer_accepted":
          return ["¡Bienvenido al equipo!", "Recibirás información sobre el proceso de onboarding."]
        case "hired":
          return ["¡Ya eres parte del equipo!", "Esperamos verte pronto en la oficina."]
        default:
          return ["Mantente atento a tu email para actualizaciones."]
      }
    }

    return NextResponse.json({
      application: {
        ...application,
        progressPercentage,
        nextSteps: getNextSteps(application.status),
        statusSteps,
      },
    })
  } catch (error) {
    console.error("Application tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
