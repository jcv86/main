import { NextResponse } from "next/server"
import { DataRetentionManager } from "@/lib/data-retention-manager"

export async function GET() {
  try {
    const policies = await DataRetentionManager.getPoliciesNeedingCleanup()
    return NextResponse.json(policies)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
