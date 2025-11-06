import { NextResponse } from "next/server"
import { AutopublishManager } from "@/lib/autopublish-manager"

export async function GET() {
  try {
    const config = await AutopublishManager.getConfig()
    return NextResponse.json(config)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const success = await AutopublishManager.updateConfig(body)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
