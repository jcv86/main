import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, testType, format = "csv" } = await request.json()

    // Validate inputs
    if (!userEmail || !testType || !["csv", "pdf", "json"].includes(format)) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 },
      )
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Fetch test results
    const { data: testResult, error: fetchError } = await supabase
      .from("test_results")
      .select("*")
      .eq("user_email", userEmail)
      .eq("test_type", testType)
      .order("completed_at", { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !testResult) {
      return NextResponse.json(
        { error: "Test result not found" },
        { status: 404 },
      )
    }

    let exportContent: string
    let mimeType: string

    if (format === "csv") {
      exportContent = generateCSV(testResult)
      mimeType = "text/csv"
    } else if (format === "json") {
      exportContent = JSON.stringify(testResult, null, 2)
      mimeType = "application/json"
    } else {
      // PDF format
      exportContent = generatePDF(testResult)
      mimeType = "application/pdf"
    }

    // Log export
    await supabase.from("test_export_logs").insert({
      user_email: userEmail,
      test_type: testType,
      export_format: format,
      file_size_bytes: exportContent.length,
      exported_at: new Date().toISOString(),
    })

    // Return file
    return new NextResponse(exportContent, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="test-result-${testType}-${new Date().getTime()}.${format}"`,
      },
    })
  } catch (e: any) {
    console.error("[v0] Exception in export-test-result:", e)
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 },
    )
  }
}

function generateCSV(testResult: any): string {
  const headers = ["Field", "Value"]
  const rows: string[][] = [headers]

  // Flatten the results object
  const flattenObject = (obj: any, prefix = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (value === null || value === undefined) {
        rows.push([fullKey, ""])
      } else if (typeof value === "object") {
        flattenObject(value, fullKey)
      } else {
        rows.push([fullKey, String(value)])
      }
    })
  }

  flattenObject(testResult)

  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")
}

function generatePDF(testResult: any): string {
  // Simple PDF generation - in production use a library like pdfkit or html2pdf
  const pdfHeader = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 500 >>
stream
BT
/F1 12 Tf
50 750 Td
(Test Results Report) Tj
0 -30 Td
(Test Type: ${testResult.test_type}) Tj
0 -20 Td
(User: ${testResult.user_email}) Tj
0 -20 Td
(Completed: ${testResult.completed_at}) Tj
0 -20 Td
(Duration: ${testResult.duration_minutes} minutes) Tj
0 -40 Td
(Score: ${JSON.stringify(testResult.results)}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000229 00000 n
0000000788 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
867
%%EOF`

  return pdfHeader
}
