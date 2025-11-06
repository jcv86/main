import { NextResponse } from "next/server"
import { DataRetentionManager } from "@/lib/data-retention-manager"

export async function GET() {
  try {
    const history = await DataRetentionManager.getCleanupHistory(50)
    return NextResponse.json(history)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
