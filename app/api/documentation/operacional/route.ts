import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "PREGUNTAS-OPERACIONALES-DTC.md")
    const content = await fs.readFile(filePath, "utf-8")

    return NextResponse.json({
      content,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Error reading operational questions:", error)
    return NextResponse.json({ error: "Failed to load operational questions", success: false }, { status: 500 })
  }
}
