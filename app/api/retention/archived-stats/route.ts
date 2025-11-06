import { NextResponse } from "next/server"
import { DataRetentionManager } from "@/lib/data-retention-manager"

export async function GET() {
  try {
    const stats = await DataRetentionManager.getArchivedDataStats()
    return NextResponse.json(stats)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
