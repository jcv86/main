import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Fetch export metrics by format
    const { data, error } = await supabase
      .from("test_export_logs")
      .select("export_format")

    if (error) {
      console.error("[v0] Error fetching export metrics:", error)
      return NextResponse.json({
        metrics: {
          totalExports: 0,
          csvExports: 0,
          pdfExports: 0,
          jsonExports: 0,
        },
      })
    }

    // Count by format
    const metrics = {
      totalExports: data?.length || 0,
      csvExports: data?.filter((d) => d.export_format === "csv").length || 0,
      pdfExports: data?.filter((d) => d.export_format === "pdf").length || 0,
      jsonExports: data?.filter((d) => d.export_format === "json").length || 0,
    }

    return NextResponse.json({ metrics })
  } catch (e: any) {
    console.error("[v0] Exception in export-metrics:", e)
    return NextResponse.json(
      {
        error: e.message || "Internal server error",
        metrics: {
          totalExports: 0,
          csvExports: 0,
          pdfExports: 0,
          jsonExports: 0,
        },
      },
      { status: 500 },
    )
  }
}
