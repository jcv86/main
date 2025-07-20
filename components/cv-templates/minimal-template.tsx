import jsPDF from "jspdf"
import type { CVData } from "@/lib/cv-types"

export function generateMinimalCV(data: CVData): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 40

  // Name - Large and minimal
  doc.setFontSize(28)
  doc.setFont("helvetica", "normal")
  doc.text(data.fullName, 30, yPosition)
  yPosition += 20

  // Contact info - Single line
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const contactInfo = [data.email, data.phone, data.location].filter(Boolean).join("  •  ")
  doc.text(contactInfo, 30, yPosition)
  yPosition += 25

  // Professional Summary
  if (data.summary) {
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 60)
    doc.text(summaryLines, 30, yPosition)
    yPosition += summaryLines.length * 6 + 25
  }

  // Work Experience
  if (data.experience.length > 0) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.text("Experience", 30, yPosition)
    yPosition += 15

    data.experience.forEach((exp, index) => {
      if (yPosition > pageHeight - 60) {
        doc.addPage()
        yPosition = 40
      }

      // Company and dates on same line
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text(exp.company, 30, yPosition)

      const dateRange = exp.current ? `${exp.startDate} – Present` : `${exp.startDate} – ${exp.endDate}`
      doc.text(dateRange, pageWidth - 30, yPosition, { align: "right" })
      yPosition += 8

      // Job title
      doc.setFont("helvetica", "normal")
      doc.text(exp.title, 30, yPosition)
      yPosition += 12

      if (exp.description) {
        doc.setFontSize(10)
        const descLines = doc.splitTextToSize(exp.description, pageWidth - 60)
        doc.text(descLines, 30, yPosition)
        yPosition += descLines.length * 5 + 8
      }

      if (exp.achievements.length > 0) {
        exp.achievements.forEach((achievement) => {
          const achievementLines = doc.splitTextToSize(`• ${achievement}`, pageWidth - 70)
          doc.text(achievementLines, 35, yPosition)
          yPosition += achievementLines.length * 5
        })
      }

      yPosition += 15
    })
  }

  // Education
  if (data.education.length > 0) {
    if (yPosition > pageHeight - 80) {
      doc.addPage()
      yPosition = 40
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.text("Education", 30, yPosition)
    yPosition += 15

    data.education.forEach((edu) => {
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text(edu.school, 30, yPosition)

      const dateRange = `${edu.startDate} – ${edu.endDate}`
      doc.text(dateRange, pageWidth - 30, yPosition, { align: "right" })
      yPosition += 8

      doc.setFont("helvetica", "normal")
      doc.text(edu.degree, 30, yPosition)
      yPosition += 20
    })
  }

  // Skills - Simple list
  if (data.skills.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = 40
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.text("Skills", 30, yPosition)
    yPosition += 15

    doc.setFontSize(10)
    const allSkills = data.skills.map((skill) => skill.name).join(", ")
    const skillsLines = doc.splitTextToSize(allSkills, pageWidth - 60)
    doc.text(skillsLines, 30, yPosition)
  }

  return doc
}
