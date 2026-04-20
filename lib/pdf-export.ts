import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PDFReportOptions {
  userName: string
  profile: string
  completedTasks: number
  totalTasks: number
  badges: Array<{ title: string; icon: string }>
  recommendations: string[]
}

export async function exportProgressToPDF(
  options: PDFReportOptions,
  elementId?: string
) {
  const {
    userName,
    profile,
    completedTasks,
    totalTasks,
    badges,
    recommendations
  } = options

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin

  let yPosition = margin

  // Header
  pdf.setFillColor(59, 130, 246) // blue-500
  pdf.rect(0, 0, pageWidth, 40, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont(undefined, 'bold')
  pdf.text('A2: Reporte de Progreso', margin, yPosition + 12)

  pdf.setFontSize(10)
  pdf.setFont(undefined, 'normal')
  pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, margin, yPosition + 20)

  yPosition = 50

  // User Info
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(12)
  pdf.setFont(undefined, 'bold')
  pdf.text('Información del Usuario', margin, yPosition)

  yPosition += 8
  pdf.setFontSize(10)
  pdf.setFont(undefined, 'normal')
  pdf.text(`Usuario: ${userName}`, margin, yPosition)
  yPosition += 6
  pdf.text(`Perfil: ${profile}`, margin, yPosition)

  yPosition += 12

  // Progress Summary
  pdf.setFontSize(12)
  pdf.setFont(undefined, 'bold')
  pdf.text('Resumen de Progreso', margin, yPosition)

  yPosition += 8
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  pdf.setFontSize(10)
  pdf.setFont(undefined, 'normal')
  pdf.text(`Tareas Completadas: ${completedTasks} de ${totalTasks}`, margin, yPosition)
  yPosition += 6
  pdf.text(`Porcentaje: ${Math.round(completionPercentage)}%`, margin, yPosition)

  // Progress bar
  yPosition += 8
  const barWidth = contentWidth - 20
  const barHeight = 3
  pdf.setDrawColor(200, 200, 200)
  pdf.rect(margin, yPosition, barWidth, barHeight)

  pdf.setFillColor(59, 130, 246)
  const filledWidth = (completionPercentage / 100) * barWidth
  pdf.rect(margin, yPosition, filledWidth, barHeight, 'F')

  yPosition += 12

  // Badges Section
  if (badges.length > 0) {
    pdf.setFontSize(12)
    pdf.setFont(undefined, 'bold')
    pdf.text('Logros Desbloqueados', margin, yPosition)

    yPosition += 8
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'normal')

    badges.forEach((badge, idx) => {
      pdf.text(`${badge.icon} ${badge.title}`, margin + 5, yPosition)
      yPosition += 6
      if (idx % 3 === 2 && idx < badges.length - 1) {
        yPosition += 2
      }
    })

    yPosition += 6
  }

  // Recommendations Section
  if (recommendations.length > 0) {
    if (yPosition > pageHeight - 60) {
      pdf.addPage()
      yPosition = margin
    }

    pdf.setFontSize(12)
    pdf.setFont(undefined, 'bold')
    pdf.text('Recomendaciones Personalizadas', margin, yPosition)

    yPosition += 8
    pdf.setFontSize(9)
    pdf.setFont(undefined, 'normal')

    recommendations.forEach((rec, idx) => {
      const wrappedText = pdf.splitTextToSize(rec, contentWidth - 10)
      pdf.text(wrappedText, margin + 5, yPosition)
      yPosition += wrappedText.length * 5 + 3

      if (yPosition > pageHeight - 20) {
        pdf.addPage()
        yPosition = margin
      }
    })
  }

  // Footer
  pdf.setFontSize(8)
  pdf.setTextColor(150, 150, 150)
  const pageCount = pdf.internal.pages.length - 1
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Download PDF
  const fileName = `A2-Progreso-${userName}-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}

export async function captureElementToPDF(elementId: string, fileName: string) {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('[v0] Element not found for PDF capture:', elementId)
      return
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#000000',
      logging: false
    })

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 10

    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - 20

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - 20
    }

    pdf.save(fileName)
  } catch (error) {
    console.error('[v0] Error capturing element to PDF:', error)
    throw error
  }
}
