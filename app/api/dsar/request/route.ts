import { type NextRequest, NextResponse } from "next/server"
import { DSARManager } from "@/lib/dsar-manager"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userEmail, requestType, requestReason } = body

    if (!userEmail || !requestType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
    const userAgent = request.headers.get("user-agent")

    const result = await DSARManager.createRequest(
      userEmail,
      requestType,
      requestReason,
      ipAddress || undefined,
      userAgent || undefined,
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      requestId: result.requestId,
      message: "DSAR request created. Please check your email for verification code.",
    })
  } catch (error: any) {
    console.error("[API] Error creating DSAR request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
