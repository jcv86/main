import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generate } from '@react-pdf/renderer'
import PDFDocument from '../../components/PDFDocument'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'pdf'

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`[v0] Generating ${format} report for user ${userId}`)

    // Fetch all user data
    const [a1Results, a2Progress, a3Progress, a4Score, missionsData] = await Promise.all([
      supabase
        .from('a1_tests_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1),
      supabase
        .from('a2_user_route_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('a3_progreso_entrevistas')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('a4_strategic_score')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('despega_user_misiones')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
    ])

    const reportData = {
      userId,
      generatedAt: new Date().toISOString(),
      a1: a1Results.data?.[0] || null,
      a2: a2Progress.data || null,
      a3: a3Progress.data || null,
      a4: a4Score.data || null,
      missionsCompleted: missionsData.data?.length || 0
    }

    // Log export
    await supabase
      .from('test_export_logs')
      .insert({
        user_email: user.email,
        test_type: 'ciclo_completo',
        export_format: format,
        exported_at: new Date().toISOString(),
        download_count: 0
      })

    if (format === 'json') {
      return NextResponse.json(reportData)
    }

    // Generate PDF (using html2canvas + jsPDF via server-side rendering)
    const pdfBuffer = await generatePDFReport(reportData)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="despega-ciclo-${userId}-${Date.now()}.pdf"`
      }
    })
  } catch (error) {
    console.error('[v0] Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

async function generatePDFReport(data: any): Promise<Buffer> {
  // Using a simple HTML-based approach with jsPDF
  // This is a placeholder - in production, use html2pdf or similar
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
        .section { margin-top: 30px; }
        .metric { display: flex; justify-content: space-between; padding: 10px; background: #f3f4f6; margin: 5px 0; }
        .score { font-size: 24px; font-weight: bold; color: #3b82f6; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Reporte Ciclo Despega</h1>
        <p>Generado: ${new Date(data.generatedAt).toLocaleDateString()}</p>
      </div>
      
      <div class="section">
        <h2>Resumen del Ciclo</h2>
        <div class="metric">
          <span>Misiones Completadas:</span>
          <span class="score">${data.missionsCompleted}</span>
        </div>
        ${data.a1 ? `<div class="metric">
          <span>Perfil DISC:</span>
          <span class="score">${data.a1.profile_type}</span>
        </div>` : ''}
        ${data.a2 ? `<div class="metric">
          <span>Progreso Ruta:</span>
          <span class="score">${data.a2.porcentaje_completado}%</span>
        </div>` : ''}
        ${data.a4 ? `<div class="metric">
          <span>Score Estratégico:</span>
          <span class="score">${Math.round(data.a4.score)}</span>
        </div>` : ''}
      </div>
      
      <div class="section">
        <p style="color: #666; font-size: 12px;">
          Este reporte fue generado automáticamente por Despega.
        </p>
      </div>
    </body>
    </html>
  `

  // In production, convert HTML to PDF using a library like jsPDF
  // For now, return a simple implementation
  return Buffer.from('PDF generation requires additional setup')
}
