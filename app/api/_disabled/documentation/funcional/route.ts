import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    console.log("[v0] Loading functional documentation...")
    const filePath = path.join(process.cwd(), "DOCUMENTACION-FUNCIONAL-DTC.md")
    const content = await fs.readFile(filePath, "utf-8")
    console.log("[v0] Functional documentation loaded successfully")

    return NextResponse.json({
      content,
      lastUpdated: new Date().toISOString(),
      version: "1.0",
      type: "funcional",
    })
  } catch (error) {
    console.error("[v0] Error reading functional documentation:", error)
    return NextResponse.json({ error: "Failed to load functional documentation" }, { status: 500 })
  }
}
