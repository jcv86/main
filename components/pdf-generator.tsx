"use client"

import { jsPDF } from "jspdf"
import type { CVData } from "@/lib/cv-types"

export function generatePDF(cvData: CVData, template = "modern") {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 20

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + lines.length * fontSize * 0.4
  }

  // Header with personal info
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text(cvData.personalInfo.fullName || "Nombre Completo", 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const contactInfo = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    cvData.personalInfo.address,
    `${cvData.personalInfo.city || ""} ${cvData.personalInfo.country || ""}`.trim(),
  ]
    .filter(Boolean)
    .join(" | ")

  if (contactInfo) {
    doc.text(contactInfo, 20, yPosition)
    yPosition += 15
  }

  // Professional Summary
  if (cvData.personalInfo.summary) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Resumen Profesional", 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    yPosition = addText(cvData.personalInfo.summary, 20, yPosition, pageWidth - 40)
    yPosition += 10
  }

  // Work Experience
  if (cvData.workExperience.length > 0) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Experiencia Laboral", 20, yPosition)
    yPosition += 8

    cvData.workExperience.forEach((exp) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(exp.jobTitle || "", 20, yPosition)
      yPosition += 6

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(exp.company || "", 20, yPosition)

      const dateRange = `${exp.startDate || ""} - ${exp.current ? "Presente" : exp.endDate || ""}`
      doc.text(dateRange, pageWidth - 60, yPosition)
      yPosition += 6

      if (exp.description) {
        yPosition = addText(exp.description, 20, yPosition, pageWidth - 40)
      }
      yPosition += 8
    })
  }

  // Education
  if (cvData.education.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Educación", 20, yPosition)
    yPosition += 8

    cvData.education.forEach((edu) => {
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(edu.degree || "", 20, yPosition)
      yPosition += 6

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(edu.institution || "", 20, yPosition)

      // Agregar tipo de institución y comuna
      if (edu.institutionType || edu.comuna) {
        yPosition += 4
        const details = [edu.institutionType, edu.comuna].filter(Boolean).join(" - ")
        doc.text(details, 20, yPosition)
      }

      if (edu.graduationDate) {
        doc.text(edu.graduationDate, pageWidth - 60, yPosition)
      }
      yPosition += 6

      yPosition += 4
    })
  }

  // Skills
  if (cvData.skills.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Habilidades", 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const skillsText = cvData.skills.map((skill) => `${skill.name || ""} (${skill.level || ""})`).join(", ")
    yPosition = addText(skillsText, 20, yPosition, pageWidth - 40)
    yPosition += 10
  }

  // Languages
  if (cvData.languages.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Idiomas", 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const languagesText = cvData.languages
      .map((lang) => `${lang.language || ""} (${lang.proficiency || ""})`)
      .join(", ")
    yPosition = addText(languagesText, 20, yPosition, pageWidth - 40)
    yPosition += 10
  }

  // References
  if (cvData.references.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Referencias", 20, yPosition)
    yPosition += 8

    cvData.references.forEach((ref) => {
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text(ref.name || "", 20, yPosition)
      yPosition += 5

      doc.setFont("helvetica", "normal")
      if (ref.title) {
        doc.text(ref.title, 20, yPosition)
        yPosition += 4
      }
      if (ref.company) {
        doc.text(ref.company, 20, yPosition)
        yPosition += 4
      }
      if (ref.email || ref.phone) {
        const contact = [ref.email, ref.phone].filter(Boolean).join(" | ")
        doc.text(contact, 20, yPosition)
        yPosition += 4
      }
      yPosition += 6
    })
  }

  return doc
}

export function downloadPDF(cvData: CVData, template = "modern", filename = "cv.pdf") {
  const doc = generatePDF(cvData, template)
  doc.save(filename)
}

export function previewPDF(cvData: CVData, template = "modern") {
  const doc = generatePDF(cvData, template)
  const pdfBlob = doc.output("blob")
  const url = URL.createObjectURL(pdfBlob)
  window.open(url, "_blank")
}
