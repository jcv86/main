import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { WhatsAppService } from "@/lib/whatsapp-service"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { activityId, userEmail, reminderTime } = await request.json()

    if (!activityId || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Obtener perfil del usuario con número de teléfono
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, phone_number")
      .eq("user_email", userEmail)
      .maybeSingle()

    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!profile.phone_number) {
      return NextResponse.json(
        {
          error: "Phone number not configured",
          message: "Por favor agrega tu número de teléfono en tu perfil",
        },
        { status: 400 },
      )
    }

    // Obtener actividad
    const { data: activity, error: activityError } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("id", activityId)
      .single()

    if (activityError || !activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    // Programar recordatorio
    const whatsappService = WhatsAppService.getInstance()
    const success = await whatsappService.sendReminder(activity, profile.phone_number)

    return NextResponse.json({
      success,
      message: success ? "Recordatorio programado" : "Error al programar recordatorio",
    })
  } catch (error) {
    console.error("[v0] Error scheduling WhatsApp reminder:", error)
    return NextResponse.json({ error: "Failed to schedule reminder" }, { status: 500 })
  }
}
