import { NextResponse } from "next/server"
import { DataRetentionManager } from "@/lib/data-retention-manager"

export async function GET() {
  try {
    const summary = await DataRetentionManager.getRetentionSummary()
    return NextResponse.json(summary)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
