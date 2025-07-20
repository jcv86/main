import jsPDF from "jspdf"
import type { CVData } from "@/lib/cv-types"

export function generateModernCV(data: CVData): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 20

  // Header with blue background
  doc.setFillColor(59, 130, 246) // Blue-500
  doc.rect(0, 0, pageWidth, 60, "F")

  // Name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text(data.fullName, 20, 30)

  // Contact info
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const contactInfo = [data.email, data.phone, data.location].filter(Boolean).join(" • ")
  doc.text(contactInfo, 20, 45)

  // Professional links
  if (data.linkedin || data.github || data.website) {
    const links = [data.linkedin, data.github, data.website].filter(Boolean).join(" • ")
    doc.text(links, 20, 52)
  }

  yPosition = 80
  doc.setTextColor(0, 0, 0)

  // Professional Summary
  if (data.summary) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Professional Summary", 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 40)
    doc.text(summaryLines, 20, yPosition)
    yPosition += summaryLines.length * 5 + 10
  }

  // Work Experience
  if (data.experience.length > 0) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Work Experience", 20, yPosition)
    yPosition += 15

    data.experience.forEach((exp) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(exp.title, 20, yPosition)

      doc.setFont("helvetica", "normal")
      doc.text(`${exp.company} | ${exp.location}`, 20, yPosition + 7)

      const dateRange = exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`
      doc.text(dateRange, pageWidth - 20, yPosition + 7, { align: "right" })

      yPosition += 15

      if (exp.description) {
        doc.setFontSize(10)
        const descLines = doc.splitTextToSize(exp.description, pageWidth - 40)
        doc.text(descLines, 20, yPosition)
        yPosition += descLines.length * 5 + 5
      }

      if (exp.achievements.length > 0) {
        exp.achievements.forEach((achievement) => {
          const achievementLines = doc.splitTextToSize(`• ${achievement}`, pageWidth - 50)
          doc.text(achievementLines, 30, yPosition)
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
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Education", 20, yPosition)
    yPosition += 15

    data.education.forEach((edu) => {
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(edu.degree, 20, yPosition)

      doc.setFont("helvetica", "normal")
      doc.text(`${edu.school} | ${edu.location}`, 20, yPosition + 7)

      const dateRange = `${edu.startDate} - ${edu.endDate}`
      doc.text(dateRange, pageWidth - 20, yPosition + 7, { align: "right" })

      yPosition += 20
    })
  }

  // Skills
  if (data.skills.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Skills", 20, yPosition)
    yPosition += 15

    const skillsByCategory = data.skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = []
        acc[skill.category].push(skill.name)
        return acc
      },
      {} as Record<string, string[]>,
    )

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text(category.charAt(0).toUpperCase() + category.slice(1), 20, yPosition)
      yPosition += 7

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const skillsText = skills.join(", ")
      const skillsLines = doc.splitTextToSize(skillsText, pageWidth - 40)
      doc.text(skillsLines, 20, yPosition)
      yPosition += skillsLines.length * 5 + 8
    })
  }

  return doc
}
