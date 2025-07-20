import jsPDF from "jspdf"
import type { CVData } from "@/lib/cv-types"

export function generateCreativeCV(data: CVData): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const sidebarWidth = 60
  let yPosition = 20

  // Dark sidebar
  doc.setFillColor(45, 55, 72) // Gray-800
  doc.rect(0, 0, sidebarWidth, pageHeight, "F")

  // Main content area
  doc.setFillColor(248, 250, 252) // Gray-50
  doc.rect(sidebarWidth, 0, pageWidth - sidebarWidth, pageHeight, "F")

  // Name in sidebar
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  const nameLines = doc.splitTextToSize(data.fullName, sidebarWidth - 10)
  nameLines.forEach((line: string, index: number) => {
    doc.text(line, 5, 25 + index * 8)
  })

  // Contact info in sidebar
  yPosition = 25 + nameLines.length * 8 + 15
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")

  if (data.email) {
    doc.text("EMAIL", 5, yPosition)
    yPosition += 5
    const emailLines = doc.splitTextToSize(data.email, sidebarWidth - 10)
    emailLines.forEach((line: string) => {
      doc.text(line, 5, yPosition)
      yPosition += 4
    })
    yPosition += 8
  }

  if (data.phone) {
    doc.text("PHONE", 5, yPosition)
    yPosition += 5
    doc.text(data.phone, 5, yPosition)
    yPosition += 12
  }

  if (data.location) {
    doc.text("LOCATION", 5, yPosition)
    yPosition += 5
    const locationLines = doc.splitTextToSize(data.location, sidebarWidth - 10)
    locationLines.forEach((line: string) => {
      doc.text(line, 5, yPosition)
      yPosition += 4
    })
    yPosition += 12
  }

  // Skills in sidebar
  if (data.skills.length > 0) {
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("SKILLS", 5, yPosition)
    yPosition += 10

    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")

    const skillsByCategory = data.skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = []
        acc[skill.category].push(skill.name)
        return acc
      },
      {} as Record<string, string[]>,
    )

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      if (yPosition > pageHeight - 30) return

      doc.setFont("helvetica", "bold")
      doc.text(category.toUpperCase(), 5, yPosition)
      yPosition += 6

      doc.setFont("helvetica", "normal")
      skills.forEach((skill) => {
        if (yPosition > pageHeight - 20) return
        doc.text(`• ${skill}`, 5, yPosition)
        yPosition += 4
      })
      yPosition += 6
    })
  }

  // Main content
  yPosition = 30
  doc.setTextColor(0, 0, 0)

  // Professional Summary
  if (data.summary) {
    doc.setFillColor(239, 68, 68) // Red-500
    doc.rect(sidebarWidth + 10, yPosition - 8, 100, 12, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("PROFESSIONAL SUMMARY", sidebarWidth + 15, yPosition)
    yPosition += 15

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const summaryLines = doc.splitTextToSize(data.summary, pageWidth - sidebarWidth - 30)
    doc.text(summaryLines, sidebarWidth + 15, yPosition)
    yPosition += summaryLines.length * 5 + 15
  }

  // Work Experience
  if (data.experience.length > 0) {
    doc.setFillColor(34, 197, 94) // Green-500
    doc.rect(sidebarWidth + 10, yPosition - 8, 100, 12, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("WORK EXPERIENCE", sidebarWidth + 15, yPosition)
    yPosition += 20

    doc.setTextColor(0, 0, 0)

    data.experience.forEach((exp) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage()
        doc.setFillColor(45, 55, 72)
        doc.rect(0, 0, sidebarWidth, pageHeight, "F")
        doc.setFillColor(248, 250, 252)
        doc.rect(sidebarWidth, 0, pageWidth - sidebarWidth, pageHeight, "F")
        yPosition = 30
      }

      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text(exp.title, sidebarWidth + 15, yPosition)

      doc.setFont("helvetica", "normal")
      doc.text(`${exp.company} | ${exp.location}`, sidebarWidth + 15, yPosition + 7)

      const dateRange = exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`
      doc.text(dateRange, pageWidth - 15, yPosition + 7, { align: "right" })

      yPosition += 15

      if (exp.description) {
        doc.setFontSize(9)
        const descLines = doc.splitTextToSize(exp.description, pageWidth - sidebarWidth - 30)
        doc.text(descLines, sidebarWidth + 15, yPosition)
        yPosition += descLines.length * 4 + 5
      }

      yPosition += 10
    })
  }

  return doc
}
