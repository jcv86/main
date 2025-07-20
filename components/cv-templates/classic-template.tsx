import jsPDF from "jspdf"
import type { CVData } from "@/lib/cv-types"

export function generateClassicCV(data: CVData): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 30

  // Header - Centered
  doc.setFontSize(20)
  doc.setFont("times", "bold")
  doc.text(data.fullName, pageWidth / 2, yPosition, { align: "center" })
  yPosition += 15

  // Contact info - Centered
  doc.setFontSize(10)
  doc.setFont("times", "normal")
  const contactInfo = [data.email, data.phone, data.location].filter(Boolean).join(" | ")
  doc.text(contactInfo, pageWidth / 2, yPosition, { align: "center" })
  yPosition += 10

  // Professional links - Centered
  if (data.linkedin || data.github || data.website) {
    const links = [data.linkedin, data.github, data.website].filter(Boolean).join(" | ")
    doc.text(links, pageWidth / 2, yPosition, { align: "center" })
    yPosition += 15
  } else {
    yPosition += 10
  }

  // Horizontal line
  doc.setLineWidth(0.5)
  doc.line(20, yPosition, pageWidth - 20, yPosition)
  yPosition += 15

  // Professional Summary
  if (data.summary) {
    doc.setFontSize(14)
    doc.setFont("times", "bold")
    doc.text("PROFESSIONAL SUMMARY", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 10

    doc.setFontSize(11)
    doc.setFont("times", "normal")
    const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 60)
    summaryLines.forEach((line: string) => {
      doc.text(line, pageWidth / 2, yPosition, { align: "center" })
      yPosition += 6
    })
    yPosition += 10
  }

  // Work Experience
  if (data.experience.length > 0) {
    doc.setFontSize(14)
    doc.setFont("times", "bold")
    doc.text("PROFESSIONAL EXPERIENCE", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 15

    data.experience.forEach((exp) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage()
        yPosition = 30
      }

      doc.setFontSize(12)
      doc.setFont("times", "bold")
      doc.text(exp.title, 30, yPosition)

      doc.setFont("times", "italic")
      doc.text(`${exp.company}, ${exp.location}`, 30, yPosition + 8)

      const dateRange = exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`
      doc.text(dateRange, pageWidth - 30, yPosition + 8, { align: "right" })

      yPosition += 18

      if (exp.description) {
        doc.setFontSize(10)
        doc.setFont("times", "normal")
        const descLines = doc.splitTextToSize(exp.description, pageWidth - 60)
        doc.text(descLines, 30, yPosition)
        yPosition += descLines.length * 5 + 5
      }

      if (exp.achievements.length > 0) {
        exp.achievements.forEach((achievement) => {
          const achievementLines = doc.splitTextToSize(`• ${achievement}`, pageWidth - 70)
          doc.text(achievementLines, 40, yPosition)
          yPosition += achievementLines.length * 5
        })
      }

      yPosition += 10
    })
  }

  // Education
  if (data.education.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = 30
    }

    doc.setFontSize(14)
    doc.setFont("times", "bold")
    doc.text("EDUCATION", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 15

    data.education.forEach((edu) => {
      doc.setFontSize(12)
      doc.setFont("times", "bold")
      doc.text(edu.degree, 30, yPosition)

      doc.setFont("times", "italic")
      doc.text(`${edu.school}, ${edu.location}`, 30, yPosition + 8)

      const dateRange = `${edu.startDate} - ${edu.endDate}`
      doc.text(dateRange, pageWidth - 30, yPosition + 8, { align: "right" })

      yPosition += 20
    })
  }

  return doc
}
