import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logAccessAudit, secureDeleteVideo, setVideoExpiration } from '@/lib/multimodal/encryption'
import { put } from '@vercel/blob'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * POST /api/multimodal/export-report
 * Generate PDF report with all analysis data
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    // Get session and analysis
    const { data: session } = await supabase
      .from('multimodal_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    const { data: analysis } = await supabase
      .from('multimodal_analyses')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    if (!session || !analysis) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Generate PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    // Header
    pdf.setFontSize(24)
    pdf.text('Reporte de Análisis Multimodal', pageWidth / 2, yPosition, {
      align: 'center'
    })
    yPosition += 20

    // Session Info
    pdf.setFontSize(12)
    pdf.text(`Tipo de Entrenamiento: ${session.entrenamiento_type}`, 20, yPosition)
    yPosition += 8
    pdf.text(`Fecha: ${new Date(session.created_at).toLocaleDateString('es-ES')}`, 20, yPosition)
    yPosition += 15

    // Overall Score
    pdf.setFontSize(16)
    pdf.setTextColor(0, 102, 204)
    pdf.text(`Puntuación General: ${analysis.overall_score}/100`, 20, yPosition)
    pdf.setTextColor(0, 0, 0)
    yPosition += 15

    // Visual Analysis
    pdf.setFontSize(12)
    pdf.setFont('Helvetica', 'bold')
    pdf.text('Análisis Visual', 20, yPosition)
    pdf.setFont('Helvetica', 'normal')
    yPosition += 8
    pdf.text(`Postura: ${analysis.visual_analysis.posture_quality}/100`, 30, yPosition)
    yPosition += 6
    pdf.text(`Contacto Visual: ${analysis.visual_analysis.eye_contact}/100`, 30, yPosition)
    yPosition += 12

    // Audio Analysis
    pdf.setFont('Helvetica', 'bold')
    pdf.text('Análisis de Audio', 20, yPosition)
    pdf.setFont('Helvetica', 'normal')
    yPosition += 8
    pdf.text(`Tono: ${analysis.audio_analysis.tone_quality}/100`, 30, yPosition)
    yPosition += 6
    pdf.text(`Claridad: ${analysis.audio_analysis.clarity}/100`, 30, yPosition)
    yPosition += 6
    pdf.text(`Confianza: ${analysis.audio_analysis.confidence_level}/100`, 30, yPosition)
    yPosition += 12

    // New page for detailed feedback
    pdf.addPage()
    yPosition = 20

    pdf.setFontSize(14)
    pdf.setFont('Helvetica', 'bold')
    pdf.text('Feedback Detallado', 20, yPosition)
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(11)
    yPosition += 10

    // Wrap text for feedback
    const feedback = pdf.splitTextToSize(analysis.feedback, 170)
    pdf.text(feedback, 20, yPosition)
    yPosition += feedback.length * 5 + 10

    // Recommendations
    pdf.setFontSize(12)
    pdf.setFont('Helvetica', 'bold')
    pdf.text('Recomendaciones', 20, yPosition)
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(10)
    yPosition += 8

    const recommendations = analysis.recommendations || []
    recommendations.forEach((rec: string, idx: number) => {
      const wrappedText = pdf.splitTextToSize(`${idx + 1}. ${rec}`, 165)
      pdf.text(wrappedText, 25, yPosition)
      yPosition += wrappedText.length * 4 + 2
    })

    // Convert to blob
    const pdfBlob = pdf.output('blob')

    // Upload to Blob storage
    const reportPath = `reports/${user.id}/${sessionId}/analysis-report.pdf`
    const uploadedBlob = await put(reportPath, pdfBlob, {
      access: 'public',
      addRandomSuffix: false
    })

    // Log access for audit
    await logAccessAudit(user.id, 'REPORT_GENERATED', sessionId, {
      report_url: uploadedBlob.url
    })

    return NextResponse.json({
      reportUrl: uploadedBlob.url,
      fileName: `analysis-report-${sessionId}.pdf`
    })
  } catch (error) {
    console.error('[v0] Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
