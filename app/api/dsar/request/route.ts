import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { request_type, user_email } = body

    // Find user by email
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", user_email)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Generate verification code
    const verification_code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const verification_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create DSAR request
    const { data: dsarRequest, error: dsarError } = await supabase
      .from("dsar_requests")
      .insert({
        user_id: userData.id,
        request_type,
        verification_code,
        verification_expires_at: verification_expires_at.toISOString(),
      })
      .select()
      .single()

    if (dsarError) throw dsarError

    // Log action
    await supabase.from("dsar_audit_log").insert({
      request_id: dsarRequest.id,
      action: "request_created",
      details: { request_type, user_email },
    })

    // TODO: Send verification email with code

    return NextResponse.json({
      success: true,
      request_id: dsarRequest.id,
      message: "Solicitud creada. Se ha enviado un código de verificación a tu email.",
    })
  } catch (error) {
    console.error("Error creating DSAR request:", error)
    return NextResponse.json({ error: "Error al crear solicitud" }, { status: 500 })
  }
}
