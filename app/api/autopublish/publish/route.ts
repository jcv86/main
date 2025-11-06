import { NextResponse } from "next/server"
import { AutopublishManager } from "@/lib/autopublish-manager"

export async function POST(request: Request) {
  try {
    const { promptVersionId, approvedBy, triggeredBy } = await request.json()

    if (!promptVersionId || !approvedBy) {
      return NextResponse.json({ error: "promptVersionId and approvedBy are required" }, { status: 400 })
    }

    const result = await AutopublishManager.publishPrompt(promptVersionId, approvedBy, triggeredBy || "manual")

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
