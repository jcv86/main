"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import type { CVData } from "@/lib/cv-types"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import CVForm from "@/components/cv-form/cv-form"
import { ModernTemplate, generateModernPDF } from "@/components/cv-templates/modern-template"
import { ClassicTemplate, generateClassicPDF } from "@/components/cv-templates/classic-template"
import { CreativeTemplate, generateCreativePDF } from "@/components/cv-templates/creative-template"
import { MinimalTemplate, generateMinimalPDF } from "@/components/cv-templates/minimal-template"

const defaultCVData: CVData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
}

const templates = [
  { id: "modern", name: "Modern", component: ModernTemplate, generatePDF: generateModernPDF },
  { id: "classic", name: "Classic", component: ClassicTemplate, generatePDF: generateClassicPDF },
  { id: "creative", name: "Creative", component: CreativeTemplate, generatePDF: generateCreativePDF },
  { id: "minimal", name: "Minimal", component: MinimalTemplate, generatePDF: generateMinimalPDF },
]

export default function CVBuilder() {
  const [cvData, setCvData] = useState<CVData>(defaultCVData)
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadCVData()
  }, [])

  const loadCVData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase.from("cv_data").select("*").eq("user_id", user.id).single()

      if (data && !error) {
        setCvData({
          personalInfo: data.personal_info || defaultCVData.personalInfo,
          education: data.education || [],
          experience: data.experience || [],
          projects: data.projects || [],
          skills: data.skills || [],
        })
      }
    } catch (error) {
      console.error("Error loading CV data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveCVData = async () => {
    setIsSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase.from("cv_data").upsert({
        user_id: user.id,
        template_id: 1, // Default template ID
        personal_info: cvData.personalInfo,
        education: cvData.education,
        experience: cvData.experience,
        projects: cvData.projects,
        skills: cvData.skills,
      })

      if (error) throw error
      toast.success("CV guardado exitosamente")
    } catch (error) {
      console.error("Error saving CV:", error)
      toast.error("Error al guardar el CV")
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const exportToPDF = async () => {
    try {
      const template = templates.find((t) => t.id === selectedTemplate)
      if (!template) return

      const htmlContent = template.generatePDF(cvData)

      // Create a new window for PDF generation
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.print()
      }

      toast.success("CV exportado exitosamente")
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast.error("Error al exportar el CV")
    }
  }

  const SelectedTemplateComponent = templates.find((t) => t.id === selectedTemplate)?.component || ModernTemplate

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Cargando constructor de CV...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Constructor de CV</h1>
        <p className="text-gray-600">Crea tu CV profesional con nuestras plantillas personalizables</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Panel */}
        <div className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Plantilla</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? "default" : "outline"}
                    onClick={() => setSelectedTemplate(template.id)}
                    className="h-20"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CV Form */}
          <CVForm data={cvData} onChange={setCvData} onSave={saveCVData} />
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Vista Previa</h2>
            <div className="flex gap-2">
              <Button onClick={exportToPDF} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-gray-50 p-4">
            <div className="transform scale-50 origin-top-left" style={{ width: "200%", height: "200%" }}>
              <SelectedTemplateComponent data={cvData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
