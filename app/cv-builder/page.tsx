"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { FileText, Eye, Lightbulb, CheckCircle } from "lucide-react"
import CVForm from "@/components/cv-form/cv-form"
import { type CVData, formatDate } from "@/lib/cv-types"
import { toast } from "sonner"
import jsPDF from "jspdf"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@supabase/supabase-js"
import { Suspense } from "react"

function CVBuilderLoading() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-full" />
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CVBuilderPage() {
  const [cvData, setCvData] = useState<Partial<CVData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [hasSupabase, setHasSupabase] = useState(false)
  const [savedCV, setSavedCV] = useState<CVData | null>(null)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClient(supabaseUrl!, supabaseKey!)

  useEffect(() => {
    // Check if Supabase is configured
    setHasSupabase(!!(supabaseUrl && supabaseKey))

    // Load saved data from localStorage
    const loadData = () => {
      try {
        const savedData = localStorage.getItem("cv-data")
        const draftData = localStorage.getItem("cv-draft")

        if (savedData) {
          setCvData(JSON.parse(savedData))
        } else if (draftData) {
          setCvData(JSON.parse(draftData))
        }
      } catch (error) {
        console.error("Error loading CV data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleSave = (data: CVData) => {
    setSavedCV(data)
    // Here you could also save to a database
    setIsLoading(true)
    try {
      // Always save to localStorage first
      localStorage.setItem("cv-data", JSON.stringify(data))
      localStorage.setItem("cv-draft", JSON.stringify(data))

      // Try to save to Supabase if available and online
      if (hasSupabase && isOnline) {
        const { error } = supabase.from("user_cvs").upsert({
          user_id: "demo-user", // Replace with actual user ID
          cv_data: data,
          updated_at: new Date().toISOString(),
        })

        if (error) throw error
        toast.success("CV guardado en la nube")
      } else {
        toast.success("CV guardado localmente")
      }

      setCvData(data)
    } catch (error) {
      console.error("Error saving CV:", error)
      toast.error("Error al guardar el CV")
    } finally {
      setIsLoading(false)
    }
  }

  const generatePDF = () => {
    if (!cvData.personalInfo?.fullName) {
      toast.error("Completa al menos la información personal para generar el PDF")
      return
    }

    try {
      const doc = new jsPDF()
      let yPosition = 20

      // Helper function to add text with word wrapping
      const addText = (text: string, x: number, y: number, maxWidth = 180) => {
        const lines = doc.splitTextToSize(text, maxWidth)
        doc.text(lines, x, y)
        return y + lines.length * 7
      }

      // Header
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      yPosition = addText(cvData.personalInfo.fullName, 20, yPosition)

      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      yPosition = addText(`${cvData.personalInfo.email} | ${cvData.personalInfo.phone}`, 20, yPosition + 5)

      if (cvData.personalInfo.city) {
        yPosition = addText(cvData.personalInfo.city, 20, yPosition + 3)
      }

      if (cvData.personalInfo.linkedin || cvData.personalInfo.github) {
        const links = [cvData.personalInfo.linkedin, cvData.personalInfo.github].filter(Boolean).join(" | ")
        yPosition = addText(links, 20, yPosition + 3)
      }

      yPosition += 10

      // Summary
      if (cvData.personalInfo.summary) {
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        yPosition = addText("RESUMEN PROFESIONAL", 20, yPosition)

        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        yPosition = addText(cvData.personalInfo.summary, 20, yPosition + 5) + 10
      }

      // Experience
      if (cvData.experience && cvData.experience.length > 0) {
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        yPosition = addText("EXPERIENCIA LABORAL", 20, yPosition)

        cvData.experience.forEach((exp) => {
          if (yPosition > 250) {
            doc.addPage()
            yPosition = 20
          }

          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          yPosition = addText(`${exp.position} - ${exp.company}`, 20, yPosition + 8)

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          const dates = `${formatDate(exp.startDate)} - ${exp.current ? "Presente" : formatDate(exp.endDate || "")}`
          yPosition = addText(dates, 20, yPosition + 3)

          if (exp.description) {
            yPosition = addText(exp.description, 20, yPosition + 3) + 5
          }
        })
        yPosition += 5
      }

      // Education
      if (cvData.education && cvData.education.length > 0) {
        if (yPosition > 200) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        yPosition = addText("EDUCACIÓN", 20, yPosition)

        cvData.education.forEach((edu) => {
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          yPosition = addText(`${edu.degree} - ${edu.institution}`, 20, yPosition + 8)

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          const dates = `${formatDate(edu.startDate)} - ${edu.current ? "Presente" : formatDate(edu.endDate || "")}`
          yPosition = addText(dates, 20, yPosition + 3)

          if (edu.field) {
            yPosition = addText(`Campo: ${edu.field}`, 20, yPosition + 3)
          }

          if (edu.description) {
            yPosition = addText(edu.description, 20, yPosition + 3) + 5
          }
        })
        yPosition += 5
      }

      // Skills
      if (cvData.skills && cvData.skills.length > 0) {
        if (yPosition > 220) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        yPosition = addText("HABILIDADES", 20, yPosition)

        const skillsByCategory = cvData.skills.reduce(
          (acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = []
            acc[skill.category].push(`${skill.name} (${skill.level})`)
            return acc
          },
          {} as Record<string, string[]>,
        )

        Object.entries(skillsByCategory).forEach(([category, skills]) => {
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          yPosition = addText(category, 20, yPosition + 8)

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          yPosition = addText(skills.join(", "), 20, yPosition + 3) + 3
        })
        yPosition += 5
      }

      // Projects
      if (cvData.projects && cvData.projects.length > 0) {
        if (yPosition > 200) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        yPosition = addText("PROYECTOS", 20, yPosition)

        cvData.projects.forEach((project) => {
          if (yPosition > 250) {
            doc.addPage()
            yPosition = 20
          }

          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          yPosition = addText(project.name, 20, yPosition + 8)

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          if (project.technologies.length > 0) {
            yPosition = addText(`Tecnologías: ${project.technologies.join(", ")}`, 20, yPosition + 3)
          }

          if (project.description) {
            yPosition = addText(project.description, 20, yPosition + 3) + 5
          }
        })
      }

      // Languages
      if (cvData.languages && cvData.languages.length > 0) {
        if (yPosition > 240) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        yPosition = addText("IDIOMAS", 20, yPosition)

        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        const languageList = cvData.languages.map((lang) => `${lang.name}: ${lang.level}`).join(", ")
        yPosition = addText(languageList, 20, yPosition + 8)
      }

      // Certifications
      if (cvData.certifications && cvData.certifications.length > 0) {
        if (yPosition > 220) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        yPosition = addText("CERTIFICACIONES", 20, yPosition)

        cvData.certifications.forEach((cert) => {
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          yPosition = addText(`${cert.name} - ${cert.issuer}`, 20, yPosition + 8)

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          yPosition = addText(`Fecha: ${formatDate(cert.date)}`, 20, yPosition + 3) + 3
        })
      }

      // Save the PDF
      const fileName = `CV_${cvData.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`
      doc.save(fileName)
      toast.success("PDF generado exitosamente")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Error al generar el PDF")
    }
  }

  const previewCV = () => {
    if (!cvData.personalInfo?.fullName) {
      toast.error("Completa al menos la información personal para ver la vista previa")
      return
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV - ${cvData.personalInfo.fullName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            color: #1e40af;
            font-size: 2.5em;
          }
          .contact-info {
            margin: 10px 0;
            color: #666;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          .item {
            margin-bottom: 20px;
          }
          .item h3 {
            margin: 0 0 5px 0;
            color: #374151;
          }
          .item-meta {
            color: #6b7280;
            font-size: 0.9em;
            margin-bottom: 8px;
          }
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          .skill-category {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
          }
          .skill-category h4 {
            margin: 0 0 10px 0;
            color: #1f2937;
          }
          .skills-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .skills-list li {
            padding: 2px 0;
            font-size: 0.9em;
          }
          .languages-list {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
          }
          .language-item {
            background: #eff6ff;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 0.9em;
          }
          @media print {
            body { padding: 0; }
            .header { page-break-after: avoid; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${cvData.personalInfo.fullName}</h1>
          <div class="contact-info">
            ${cvData.personalInfo.email} | ${cvData.personalInfo.phone}
            ${cvData.personalInfo.city ? ` | ${cvData.personalInfo.city}` : ""}
          </div>
          ${
            cvData.personalInfo.linkedin || cvData.personalInfo.github
              ? `
            <div class="contact-info">
              ${cvData.personalInfo.linkedin ? `<a href="${cvData.personalInfo.linkedin}">LinkedIn</a>` : ""}
              ${cvData.personalInfo.linkedin && cvData.personalInfo.github ? " | " : ""}
              ${cvData.personalInfo.github ? `<a href="${cvData.personalInfo.github}">GitHub</a>` : ""}
            </div>
          `
              : ""
          }
        </div>

        ${
          cvData.personalInfo.summary
            ? `
          <div class="section">
            <h2>Resumen Profesional</h2>
            <p>${cvData.personalInfo.summary}</p>
          </div>
        `
            : ""
        }

        ${
          cvData.experience && cvData.experience.length > 0
            ? `
          <div class="section">
            <h2>Experiencia Laboral</h2>
            ${cvData.experience
              .map(
                (exp) => `
              <div class="item">
                <h3>${exp.position} - ${exp.company}</h3>
                <div class="item-meta">
                  ${formatDate(exp.startDate)} - ${exp.current ? "Presente" : formatDate(exp.endDate || "")}
                </div>
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
          cvData.education && cvData.education.length > 0
            ? `
          <div class="section">
            <h2>Educación</h2>
            ${cvData.education
              .map(
                (edu) => `
              <div class="item">
                <h3>${edu.degree} - ${edu.institution}</h3>
                <div class="item-meta">
                  ${formatDate(edu.startDate)} - ${edu.current ? "Presente" : formatDate(edu.endDate || "")}
                  ${edu.field ? ` | ${edu.field}` : ""}
                </div>
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
          cvData.skills && cvData.skills.length > 0
            ? `
          <div class="section">
            <h2>Habilidades</h2>
            <div class="skills-grid">
              ${Object.entries(
                cvData.skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = []
                  acc[skill.category].push(`${skill.name} (${skill.level})`)
                  return acc
                }, {}),
              )
                .map(
                  ([category, skills]) => `
                <div class="skill-category">
                  <h4>${category}</h4>
                  <ul class="skills-list">
                    ${skills.map((skill) => `<li>${skill}</li>`).join("")}
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
          cvData.projects && cvData.projects.length > 0
            ? `
          <div class="section">
            <h2>Proyectos</h2>
            ${cvData.projects
              .map(
                (project) => `
              <div class="item">
                <h3>${project.name}</h3>
                ${
                  project.technologies.length > 0
                    ? `
                  <div class="item-meta">Tecnologías: ${project.technologies.join(", ")}</div>
                `
                    : ""
                }
                ${project.description ? `<p>${project.description}</p>` : ""}
                ${
                  project.url || project.github
                    ? `
                  <div class="item-meta">
                    ${project.url ? `<a href="${project.url}">Ver Proyecto</a>` : ""}
                    ${project.url && project.github ? " | " : ""}
                    ${project.github ? `<a href="${project.github}">GitHub</a>` : ""}
                  </div>
                `
                    : ""
                }
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }

        ${
          cvData.languages && cvData.languages.length > 0
            ? `
          <div class="section">
            <h2>Idiomas</h2>
            <div class="languages-list">
              ${cvData.languages
                .map(
                  (lang) => `
                <div class="language-item">${lang.name}: ${lang.level}</div>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        ${
          cvData.certifications && cvData.certifications.length > 0
            ? `
          <div class="section">
            <h2>Certificaciones</h2>
            ${cvData.certifications
              .map(
                (cert) => `
              <div class="item">
                <h3>${cert.name} - ${cert.issuer}</h3>
                <div class="item-meta">
                  Fecha: ${formatDate(cert.date)}
                  ${cert.expiryDate ? ` | Expira: ${formatDate(cert.expiryDate)}` : ""}
                </div>
                ${cert.url ? `<div class="item-meta"><a href="${cert.url}">Ver Certificación</a></div>` : ""}
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
      toast.success("Vista previa abierta en nueva ventana")
    } else {
      toast.error("No se pudo abrir la vista previa. Verifica que los pop-ups estén habilitados.")
    }
  }

  const clearData = () => {
    if (confirm("¿Estás seguro de que quieres borrar todos los datos del CV?")) {
      localStorage.removeItem("cv-data")
      localStorage.removeItem("cv-draft")
      window.location.reload()
    }
  }

  const tips = [
    {
      title: "Resumen Profesional",
      description:
        "Escribe un resumen de 2-3 líneas que destaque tu experiencia más relevante y objetivos profesionales.",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      title: "Experiencia Laboral",
      description:
        "Usa verbos de acción y cuantifica tus logros cuando sea posible (ej: 'Aumenté las ventas en un 25%').",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      title: "Habilidades",
      description: "Incluye tanto habilidades técnicas como blandas relevantes para el puesto que buscas.",
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      title: "Formato",
      description:
        "Mantén un diseño limpio y profesional. Usa viñetas y espacios en blanco para mejorar la legibilidad.",
      icon: <Eye className="w-4 h-4" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Constructor de CV Profesional</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crea tu currículum vitae profesional con nuestra herramienta intuitiva. Incluye todas las secciones
            importantes y genera un PDF listo para enviar.
          </p>
        </div>

        <Suspense fallback={<CVBuilderLoading />}>
          <CVForm initialData={cvData} onSave={handleSave} isLoading={isLoading} />
        </Suspense>

        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Consejos para un CV exitoso</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">📝 Contenido</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Mantén tu CV en máximo 2 páginas</li>
                <li>• Usa verbos de acción para describir logros</li>
                <li>• Incluye números y métricas cuando sea posible</li>
                <li>• Adapta tu CV para cada posición</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">🎨 Formato</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Usa un diseño limpio y profesional</li>
                <li>• Mantén consistencia en fuentes y espaciado</li>
                <li>• Revisa ortografía y gramática</li>
                <li>• Guarda en formato PDF para enviar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
