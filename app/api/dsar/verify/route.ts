import { type NextRequest, NextResponse } from "next/server"
import { DSARManager } from "@/lib/dsar-manager"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestId, verificationCode } = body

    if (!requestId || !verificationCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await DSARManager.verifyRequest(requestId, verificationCode)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Request verified successfully. An admin will process your request within 72 hours.",
    })
  } catch (error: any) {
    console.error("[API] Error verifying DSAR request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
