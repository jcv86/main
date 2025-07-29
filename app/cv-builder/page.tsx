"use client"

import { useState, useEffect } from "react"
import { CVForm } from "@/components/cv-form/cv-form"
import { type CVData, getEmptyCV, formatDate } from "@/lib/cv-types"
import { createClient } from "@supabase/supabase-js"
import { toast } from "sonner"
import jsPDF from "jspdf"

// Initialize Supabase client (will work even without env vars)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
)

export default function CVBuilderPage() {
  const [cvData, setCvData] = useState<CVData>(getEmptyCV())
  const [isLoading, setIsLoading] = useState(false)
  const [hasSupabase, setHasSupabase] = useState(false)

  useEffect(() => {
    // Check if Supabase is properly configured
    const checkSupabase = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("id").limit(1)
        setHasSupabase(!error)
      } catch {
        setHasSupabase(false)
      }
    }

    checkSupabase()
    loadCVData()
  }, [])

  const loadCVData = async () => {
    try {
      // Try to load from Supabase first
      if (hasSupabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const { data, error } = await supabase.from("cv_data").select("*").eq("user_id", user.id).single()

          if (data && !error) {
            setCvData(data.cv_data)
            return
          }
        }
      }

      // Fallback to localStorage
      const savedData = localStorage.getItem("cv-data")
      if (savedData) {
        setCvData(JSON.parse(savedData))
      }
    } catch (error) {
      console.error("Error loading CV data:", error)
      // Load from localStorage as fallback
      const savedData = localStorage.getItem("cv-data")
      if (savedData) {
        setCvData(JSON.parse(savedData))
      }
    }
  }

  const saveCVData = async (data: CVData) => {
    setIsLoading(true)
    try {
      // Always save to localStorage first
      localStorage.setItem("cv-data", JSON.stringify(data))
      setCvData(data)

      // Try to save to Supabase if available
      if (hasSupabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const { error } = await supabase.from("cv_data").upsert({
            user_id: user.id,
            cv_data: data,
            updated_at: new Date().toISOString(),
          })

          if (!error) {
            toast.success("CV guardado en la nube")
          } else {
            toast.success("CV guardado localmente")
          }
        } else {
          toast.success("CV guardado localmente")
        }
      } else {
        toast.success("CV guardado localmente")
      }
    } catch (error) {
      console.error("Error saving CV:", error)
      toast.success("CV guardado localmente")
    } finally {
      setIsLoading(false)
    }
  }

  const exportToPDF = (data: CVData) => {
    try {
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.width
      const margin = 20
      let yPosition = margin

      // Helper function to add text with word wrap
      const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
        pdf.setFontSize(fontSize)
        const lines = pdf.splitTextToSize(text, maxWidth)
        pdf.text(lines, x, y)
        return y + lines.length * fontSize * 0.4
      }

      // Header
      pdf.setFontSize(20)
      pdf.setFont("helvetica", "bold")
      pdf.text(data.personalInfo.fullName, margin, yPosition)
      yPosition += 10

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")
      pdf.text(data.personalInfo.email, margin, yPosition)
      yPosition += 6
      pdf.text(data.personalInfo.phone, margin, yPosition)
      yPosition += 6
      pdf.text(`${data.personalInfo.city}, Chile`, margin, yPosition)
      yPosition += 10

      // Summary
      if (data.personalInfo.summary) {
        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text("RESUMEN PROFESIONAL", margin, yPosition)
        yPosition += 8
        pdf.setFont("helvetica", "normal")
        yPosition = addText(data.personalInfo.summary, margin, yPosition, pageWidth - 2 * margin, 10)
        yPosition += 10
      }

      // Experience
      if (data.experience.length > 0) {
        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text("EXPERIENCIA LABORAL", margin, yPosition)
        yPosition += 8

        data.experience.forEach((exp) => {
          if (yPosition > 250) {
            pdf.addPage()
            yPosition = margin
          }

          pdf.setFontSize(12)
          pdf.setFont("helvetica", "bold")
          pdf.text(exp.position, margin, yPosition)
          yPosition += 6

          pdf.setFont("helvetica", "normal")
          pdf.text(exp.company, margin, yPosition)
          yPosition += 6

          const startDate = formatDate(exp.startDate)
          const endDate = exp.current ? "Presente" : formatDate(exp.endDate || "")
          pdf.text(`${startDate} - ${endDate}`, margin, yPosition)
          yPosition += 6

          if (exp.description) {
            yPosition = addText(exp.description, margin, yPosition, pageWidth - 2 * margin, 10)
          }
          yPosition += 8
        })
      }

      // Education
      if (data.education.length > 0) {
        if (yPosition > 200) {
          pdf.addPage()
          yPosition = margin
        }

        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text("EDUCACIÓN", margin, yPosition)
        yPosition += 8

        data.education.forEach((edu) => {
          pdf.setFontSize(12)
          pdf.setFont("helvetica", "bold")
          pdf.text(edu.degree, margin, yPosition)
          yPosition += 6

          pdf.setFont("helvetica", "normal")
          pdf.text(edu.institution, margin, yPosition)
          yPosition += 6

          const startDate = formatDate(edu.startDate)
          const endDate = edu.current ? "Presente" : formatDate(edu.endDate || "")
          pdf.text(`${startDate} - ${endDate}`, margin, yPosition)
          yPosition += 8
        })
      }

      // Skills
      if (data.skills.length > 0) {
        if (yPosition > 220) {
          pdf.addPage()
          yPosition = margin
        }

        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text("HABILIDADES", margin, yPosition)
        yPosition += 8

        const skillsByCategory = data.skills.reduce(
          (acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = []
            acc[skill.category].push(skill)
            return acc
          },
          {} as Record<string, typeof data.skills>,
        )

        Object.entries(skillsByCategory).forEach(([category, skills]) => {
          pdf.setFontSize(11)
          pdf.setFont("helvetica", "bold")
          pdf.text(category + ":", margin, yPosition)
          yPosition += 5

          pdf.setFont("helvetica", "normal")
          const skillsText = skills.map((s) => `${s.name} (${s.level})`).join(", ")
          yPosition = addText(skillsText, margin + 5, yPosition, pageWidth - 2 * margin - 5, 10)
          yPosition += 5
        })
      }

      // Projects
      if (data.projects.length > 0) {
        if (yPosition > 200) {
          pdf.addPage()
          yPosition = margin
        }

        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text("PROYECTOS", margin, yPosition)
        yPosition += 8

        data.projects.forEach((project) => {
          if (yPosition > 240) {
            pdf.addPage()
            yPosition = margin
          }

          pdf.setFontSize(12)
          pdf.setFont("helvetica", "bold")
          pdf.text(project.name, margin, yPosition)
          yPosition += 6

          pdf.setFont("helvetica", "normal")
          yPosition = addText(project.description, margin, yPosition, pageWidth - 2 * margin, 10)
          yPosition += 8
        })
      }

      // Save the PDF
      pdf.save(`CV_${data.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`)
      toast.success("PDF exportado exitosamente")
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast.error("Error al exportar PDF")
    }
  }

  const previewCV = (data: CVData) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV - ${data.personalInfo.fullName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 2.5em;
            color: #2c3e50;
          }
          .contact-info {
            margin: 10px 0;
            font-size: 1.1em;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #2c3e50;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
            margin-bottom: 15px;
            font-size: 1.5em;
          }
          .item {
            margin-bottom: 20px;
          }
          .item h3 {
            margin: 0 0 5px 0;
            color: #34495e;
          }
          .item .company {
            font-weight: bold;
            color: #7f8c8d;
          }
          .item .date {
            font-style: italic;
            color: #95a5a6;
            margin-bottom: 10px;
          }
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          .skill-category {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
          }
          .skill-category h4 {
            margin: 0 0 10px 0;
            color: #2c3e50;
          }
          .skill-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .skill-list li {
            padding: 2px 0;
            font-size: 0.9em;
          }
          @media print {
            body { padding: 0; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${data.personalInfo.fullName}</h1>
          <div class="contact-info">
            <div>${data.personalInfo.email} | ${data.personalInfo.phone}</div>
            <div>${data.personalInfo.city}, Chile</div>
            ${data.personalInfo.linkedin ? `<div><a href="${data.personalInfo.linkedin}">LinkedIn</a></div>` : ""}
            ${data.personalInfo.github ? `<div><a href="${data.personalInfo.github}">GitHub</a></div>` : ""}
          </div>
        </div>

        ${
          data.personalInfo.summary
            ? `
          <div class="section">
            <h2>Resumen Profesional</h2>
            <p>${data.personalInfo.summary}</p>
          </div>
        `
            : ""
        }

        ${
          data.experience.length > 0
            ? `
          <div class="section">
            <h2>Experiencia Laboral</h2>
            ${data.experience
              .map(
                (exp) => `
              <div class="item">
                <h3>${exp.position}</h3>
                <div class="company">${exp.company}</div>
                <div class="date">${formatDate(exp.startDate)} - ${exp.current ? "Presente" : formatDate(exp.endDate || "")}</div>
                ${exp.description ? `<p>${exp.description}</p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }

        ${
          data.education.length > 0
            ? `
          <div class="section">
            <h2>Educación</h2>
            ${data.education
              .map(
                (edu) => `
              <div class="item">
                <h3>${edu.degree}</h3>
                <div class="company">${edu.institution}</div>
                <div class="date">${formatDate(edu.startDate)} - ${edu.current ? "Presente" : formatDate(edu.endDate || "")}</div>
                ${edu.description ? `<p>${edu.description}</p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }

        ${
          data.skills.length > 0
            ? `
          <div class="section">
            <h2>Habilidades</h2>
            <div class="skills-grid">
              ${Object.entries(
                data.skills.reduce(
                  (acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = []
                    acc[skill.category].push(skill)
                    return acc
                  },
                  {} as Record<string, typeof data.skills>,
                ),
              )
                .map(
                  ([category, skills]) => `
                <div class="skill-category">
                  <h4>${category}</h4>
                  <ul class="skill-list">
                    ${skills.map((skill) => `<li>${skill.name} - ${skill.level}</li>`).join("")}
                  </ul>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        ${
          data.projects.length > 0
            ? `
          <div class="section">
            <h2>Proyectos</h2>
            ${data.projects
              .map(
                (project) => `
              <div class="item">
                <h3>${project.name}</h3>
                ${project.url ? `<div><a href="${project.url}" target="_blank">Ver Proyecto</a></div>` : ""}
                ${project.github ? `<div><a href="${project.github}" target="_blank">Ver Código</a></div>` : ""}
                <p>${project.description}</p>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }

        ${
          data.certifications.length > 0
            ? `
          <div class="section">
            <h2>Certificaciones</h2>
            ${data.certifications
              .map(
                (cert) => `
              <div class="item">
                <h3>${cert.name}</h3>
                <div class="company">${cert.issuer}</div>
                <div class="date">${formatDate(cert.date)}</div>
                ${cert.description ? `<p>${cert.description}</p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }

        ${
          data.languages.length > 0
            ? `
          <div class="section">
            <h2>Idiomas</h2>
            ${data.languages
              .map(
                (lang) => `
              <div class="item">
                <h3>${lang.name} - ${lang.level}</h3>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
      </body>
      </html>
    `

    const newWindow = window.open("", "_blank")
    if (newWindow) {
      newWindow.document.write(htmlContent)
      newWindow.document.close()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <CVForm
        initialData={cvData}
        onSave={saveCVData}
        onExportPDF={exportToPDF}
        onPreview={previewCV}
        isLoading={isLoading}
      />
    </div>
  )
}
