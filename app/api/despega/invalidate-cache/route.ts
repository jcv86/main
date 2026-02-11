import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    // Revalidate the test-results cache tag
    revalidateTag("test-results")

    return NextResponse.json({
      success: true,
      message: "Cache invalidated",
    })
  } catch (error) {
    console.error("[v0] Error invalidating cache:", error)
    return NextResponse.json({ error: "Failed to invalidate cache" }, { status: 500 })
  }
}
