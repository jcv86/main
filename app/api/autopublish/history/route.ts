import { NextResponse } from "next/server"
import { AutopublishManager } from "@/lib/autopublish-manager"

export async function GET() {
  try {
    const history = await AutopublishManager.getHistory()
    return NextResponse.json(history)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
