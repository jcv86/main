import { NextResponse } from "next/server"
import { DataRetentionManager } from "@/lib/data-retention-manager"

export async function POST(request: Request) {
  try {
    const { policyId, dryRun } = await request.json()

    if (!policyId) {
      return NextResponse.json({ error: "Policy ID is required" }, { status: 400 })
    }

    const result = await DataRetentionManager.executeCleanup(policyId, dryRun)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
