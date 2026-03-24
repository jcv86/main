import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { put } from '@vercel/blob'
import jsPDF from 'jspdf'

/**
 * POST /api/multimodal/export-analytics
 * Generate comprehensive PDF analytics report
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

    const { timeRange } = await request.json()

    // Fetch analytics data
    const analyticsResponse = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/multimodal/advanced-analytics?period=${timeRange}`,
      {
        headers: {
          Cookie: request.headers.get('cookie') || ''
        }
      }
    )

    const analytics = await analyticsResponse.json()

    // Generate PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    let yPosition = 20

    // Title
    pdf.setFontSize(24)
    pdf.setTextColor(0, 51, 102)
    pdf.text('Reporte de Analytics Avanzado', pageWidth / 2, yPosition, { align: 'center' })
    pdf.setTextColor(0, 0, 0)
    yPosition += 15

    // Period
    pdf.setFontSize(11)
    pdf.text(`Período: ${timeRange} | Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, yPosition, {
      align: 'center'
    })
    yPosition += 20

    // Key Metrics Section
    pdf.setFontSize(14)
    pdf.setFont('Helvetica', 'bold')
    pdf.text('Métricas Clave', 20, yPosition)
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(11)
    yPosition += 10

    const metricsData = [
      ['Mejora Detectada', `${analytics.improvement_trend}%`],
      ['Consistency Score', `${analytics.consistency_score}%`],
      ['Área Más Fuerte', `${analytics.strongest_area} (${analytics.strongest_score}/100)`]
    ]

    metricsData.forEach(([label, value]) => {
      pdf.text(`${label}: ${value}`, 30, yPosition)
      yPosition += 7
    })

    yPosition += 10

    // Benchmark Comparison
    pdf.setFontSize(14)
    pdf.setFont('Helvetica', 'bold')
    pdf.text('Comparación con Benchmark', 20, yPosition)
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(10)
    yPosition += 10

    if (analytics.benchmark_comparison && analytics.benchmark_comparison.length > 0) {
      analytics.benchmark_comparison.slice(0, 5).forEach((item: any) => {
        pdf.text(`${item.metric}: Tu ${item.your_score}% vs Benchmark ${item.benchmark}%`, 30, yPosition)
        yPosition += 6
      })
    }

    yPosition += 10

    // Achievements
    pdf.setFontSize(14)
    pdf.setFont('Helvetica', 'bold')
    pdf.text('Logros Desbloqueados', 20, yPosition)
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(10)
    yPosition += 10

    if (analytics.achievements && analytics.achievements.length > 0) {
      analytics.achievements.forEach((achievement: any) => {
        pdf.text(`${achievement.icon} ${achievement.title} - ${achievement.description}`, 30, yPosition)
        yPosition += 7
      })
    } else {
      pdf.text('Sigue practicando para desbloquear logros', 30, yPosition)
    }

    // New page for insights
    pdf.addPage()
    yPosition = 20

    pdf.setFontSize(14)
    pdf.setFont('Helvetica', 'bold')
    pdf.text('AI-Generated Insights', 20, yPosition)
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(11)
    yPosition += 10

    if (analytics.ai_insights && analytics.ai_insights.length > 0) {
      analytics.ai_insights.forEach((insight: string, idx: number) => {
        const wrappedText = pdf.splitTextToSize(`${idx + 1}. ${insight}`, 170)
        pdf.text(wrappedText, 25, yPosition)
        yPosition += wrappedText.length * 5 + 3
      })
    }

    yPosition += 15

    // Recommendations
    pdf.setFontSize(12)
    pdf.setFont('Helvetica', 'bold')
    pdf.text('Recomendaciones para Mejorar', 20, yPosition)
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(10)
    yPosition += 10

    const recommendations = [
      'Practica enfocándote en tu área más débil con sesiones de 5-10 minutos diarios',
      'Usa el feedback en tiempo real durante tus entrenamientos',
      'Compara tu progreso con el benchmark regularmente',
      'Establece objetivos específicos basados en tus métricas',
      'Revisa reportes anteriores para identificar patrones'
    ]

    recommendations.forEach((rec, idx) => {
      const wrappedText = pdf.splitTextToSize(`${idx + 1}. ${rec}`, 165)
      pdf.text(wrappedText, 25, yPosition)
      yPosition += wrappedText.length * 4 + 2
    })

    // Convert to blob
    const pdfBlob = pdf.output('blob')

    // Upload to Blob storage
    const reportPath = `analytics-reports/${user.id}/${Date.now()}/analytics-${timeRange}.pdf`
    const uploadedBlob = await put(reportPath, pdfBlob, {
      access: 'private',
      addRandomSuffix: false
    })

    return NextResponse.json({
      reportUrl: uploadedBlob.url,
      fileName: `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.pdf`
    })
  } catch (error) {
    console.error('[v0] Analytics export error:', error)
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    )
  }
}
