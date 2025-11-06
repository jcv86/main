import { NextResponse } from "next/server"
import { AutopublishManager } from "@/lib/autopublish-manager"

export async function GET() {
  try {
    const candidates = await AutopublishManager.getCandidates()
    return NextResponse.json(candidates)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
