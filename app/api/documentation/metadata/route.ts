import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const filePath = join(process.cwd(), "DOCUMENTACION-COMPLETA-DTC.md")
    const content = await readFile(filePath, "utf-8")

    const lines = content.split("\n")
    const sections = lines.filter((line) => line.startsWith("## ")).map((line) => line.replace("## ", "").trim())

    const metadata = {
      version: "2025.1.1.04-SUPREMO",
      lastUpdated: new Date().toISOString(),
      totalLines: lines.length,
      totalSections: sections.length,
      sections,
      wordCount: content.split(/\s+/).length,
      characterCount: content.length,
    }

    return NextResponse.json(metadata)
  } catch (error) {
    console.error("Error reading documentation metadata:", error)
    return NextResponse.json({ error: "Documentation file not found" }, { status: 404 })
  }
}
