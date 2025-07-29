"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { FileText, Download, Eye, Save, Palette, User, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { CVForm } from "@/components/cv-form/cv-form"
import { ModernTemplate } from "@/components/cv-templates/modern-template"
import { ClassicTemplate } from "@/components/cv-templates/classic-template"
import { CreativeTemplate } from "@/components/cv-templates/creative-template"
import { MinimalTemplate } from "@/components/cv-templates/minimal-template"
import type { CVData, CVTemplate } from "@/lib/cv-types"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

const templates: { id: CVTemplate; name: string; description: string }[] = [
  { id: "modern", name: "Moderno", description: "Diseño limpio y contemporáneo" },
  { id: "classic", name: "Clásico", description: "Formato tradicional y profesional" },
  { id: "creative", name: "Creativo", description: "Diseño innovador con colores" },
  { id: "minimal", name: "Minimalista", description: "Estilo simple y elegante" },
]

const initialCVData: CVData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
  },
  projects: [],
  certifications: [],
}

// Demo mode - works without Supabase credentials
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase client (only if credentials are available)
const supabase = DEMO_MODE
  ? null
  : createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function CVBuilderPage() {
  const [cvData, setCVData] = useState<CVData>(initialCVData)
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>("modern")
  const [activeTab, setActiveTab] = useState("form")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [progress, setProgress] = useState(0)
  const { user } = useAuth()
  const router = useRouter()
  const [initialData, setInitialData] = useState<Partial<CVData> | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      if (DEMO_MODE) {
        // Load from localStorage in demo mode
        const savedData = localStorage.getItem("cv-data")
        if (savedData) {
          setInitialData(JSON.parse(savedData))
        }
      } else {
        // Load from Supabase
        const {
          data: { user },
        } = await supabase!.auth.getUser()
        if (user) {
          const { data, error } = await supabase!.from("cv_data").select("*").eq("user_id", user.id).single()

          if (error && error.code !== "PGRST116") {
            console.error("Error loading CV data:", error)
            toast.error("Error al cargar los datos del CV")
          } else if (data) {
            setInitialData(data.data)
          }
        }
      }
    } catch (error) {
      console.error("Error loading initial data:", error)
      toast.error("Error al cargar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDataChange = (newData: CVData) => {
    setCVData(newData)
  }

  const handleExportPDF = () => {
    toast.success("Exportando CV a PDF...")
    // PDF export logic would go here
  }

  const renderTemplate = () => {
    const props = { data: cvData }

    switch (selectedTemplate) {
      case "modern":
        return <ModernTemplate {...props} />
      case "classic":
        return <ClassicTemplate {...props} />
      case "creative":
        return <CreativeTemplate {...props} />
      case "minimal":
        return <MinimalTemplate {...props} />
      default:
        return <ModernTemplate {...props} />
    }
  }

  const getCompletionFeedback = () => {
    if (progress < 30) {
      return {
        icon: AlertCircle,
        message: "Completa la información básica para comenzar",
        color: "text-red-500",
      }
    } else if (progress < 70) {
      return {
        icon: Clock,
        message: "Buen progreso, agrega más secciones",
        color: "text-yellow-500",
      }
    } else {
      return {
        icon: CheckCircle,
        message: "¡Excelente! Tu CV está casi completo",
        color: "text-green-500",
      }
    }
  }

  const feedback = getCompletionFeedback()

  const handleSave = async (data: CVData) => {
    try {
      if (DEMO_MODE) {
        // Save to localStorage in demo mode
        localStorage.setItem("cv-data", JSON.stringify(data))
        toast.success("CV guardado localmente (modo demo)")
        return
      }

      const {
        data: { user },
      } = await supabase!.auth.getUser()
      if (!user) {
        toast.error("Debes iniciar sesión para guardar")
        return
      }

      const { error } = await supabase!.from("cv_data").upsert({
        user_id: user.id,
        data: data,
        template: selectedTemplate,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }

      setLastSaved(new Date())
      toast.success("CV guardado exitosamente")
    } catch (error) {
      console.error("Error saving CV:", error)
      toast.error("Error al guardar el CV")
    }
  }

  const handlePreview = (data: CVData) => {
    // Open preview in new tab/window
    const previewData = encodeURIComponent(JSON.stringify(data))
    router.push(`/cv-preview?data=${previewData}`)
  }

  const handleExport = (data: CVData) => {
    // Export as PDF
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF()

      // Add content to PDF
      doc.setFontSize(20)
      doc.text(`${data.personalInfo.firstName} ${data.personalInfo.lastName}`, 20, 30)

      doc.setFontSize(12)
      doc.text(`Email: ${data.personalInfo.email}`, 20, 50)
      doc.text(`Teléfono: ${data.personalInfo.phone}`, 20, 60)
      doc.text(`Ciudad: ${data.personalInfo.city}`, 20, 70)

      if (data.personalInfo.summary) {
        doc.text("Resumen Profesional:", 20, 90)
        const splitSummary = doc.splitTextToSize(data.personalInfo.summary, 170)
        doc.text(splitSummary, 20, 100)
      }

      // Add work experience
      if (data.experience.length > 0) {
        let yPosition = 130
        doc.setFontSize(16)
        doc.text("Experiencia Laboral", 20, yPosition)
        yPosition += 10

        data.experience.forEach((exp) => {
          doc.setFontSize(12)
          doc.text(`${exp.position} - ${exp.company}`, 20, yPosition)
          yPosition += 10
          doc.text(`${exp.startDate} - ${exp.current ? "Presente" : exp.endDate}`, 20, yPosition)
          yPosition += 10
          const splitDesc = doc.splitTextToSize(exp.description, 170)
          doc.text(splitDesc, 20, yPosition)
          yPosition += splitDesc.length * 5 + 10
        })
      }

      // Save the PDF
      doc.save(`CV_${data.personalInfo.firstName}_${data.personalInfo.lastName}.pdf`)
      toast.success("CV exportado como PDF")
    })
  }

  useEffect(() => {
    const autoSave = async () => {
      if (!user || !cvData.personalInfo.fullName) return

      setIsSaving(true)
      try {
        if (DEMO_MODE) {
          // Save to localStorage in demo mode
          localStorage.setItem("cv-data", JSON.stringify(cvData))
          toast.success("CV guardado localmente (modo demo)")
          return
        }

        const { error } = await supabase!.from("cv_data").upsert({
          user_id: user.id,
          data: cvData,
          template: selectedTemplate,
          updated_at: new Date().toISOString(),
        })

        if (error) throw error

        setLastSaved(new Date())
        toast.success("CV guardado automáticamente")
      } catch (error) {
        console.error("Error saving CV:", error)
        toast.error("Error al guardar el CV")
      } finally {
        setIsSaving(false)
      }
    }

    const timer = setTimeout(autoSave, 2000)
    return () => clearTimeout(timer)
  }, [cvData, selectedTemplate, user])

  useEffect(() => {
    const calculateProgress = () => {
      let completed = 0
      const total = 7

      if (cvData.personalInfo.fullName && cvData.personalInfo.email) completed++
      if (cvData.personalInfo.summary) completed++
      if (cvData.experience.length > 0) completed++
      if (cvData.education.length > 0) completed++
      if (cvData.skills.technical.length > 0 || cvData.skills.soft.length > 0) completed++
      if (cvData.projects.length > 0) completed++
      if (cvData.certifications.length > 0) completed++

      setProgress((completed / total) * 100)
    }

    calculateProgress()
  }, [cvData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Cargando constructor de CV...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Constructor de CV
          </h1>
          <p className="text-muted-foreground">Crea tu currículum profesional con nuestras plantillas optimizadas</p>
        </div>

        <div className="flex items-center space-x-2">
          {lastSaved && (
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Save className="h-4 w-4" />
              <span>Guardado {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
          {isSaving && (
            <Badge variant="secondary" className="animate-pulse">
              Guardando...
            </Badge>
          )}
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <feedback.icon className={`h-5 w-5 ${feedback.color}`} />
                <span className="font-medium">Progreso del CV</span>
              </div>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className={`text-sm ${feedback.color}`}>{feedback.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Información</span>
          </TabsTrigger>
          <TabsTrigger value="template" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Plantilla</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Vista Previa</span>
          </TabsTrigger>
        </TabsList>

        {/* Form Tab */}
        <TabsContent value="form" className="space-y-6">
          <CVForm
            data={cvData}
            onChange={handleDataChange}
            onSave={handleSave}
            onPreview={handlePreview}
            onExport={handleExport}
          />
        </TabsContent>

        {/* Template Selection Tab */}
        <TabsContent value="template" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Selecciona una Plantilla</span>
              </CardTitle>
              <CardDescription>Elige el diseño que mejor represente tu perfil profesional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id ? "ring-2 ring-blue-500 shadow-md" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      {selectedTemplate === template.id && <Badge className="mt-2">Seleccionada</Badge>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Vista Previa</h2>
            <div className="flex items-center space-x-2">
              <Select value={selectedTemplate} onValueChange={(value: CVTemplate) => setSelectedTemplate(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => handleExport(cvData)} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Exportar PDF</span>
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="max-w-4xl mx-auto bg-white shadow-lg">{renderTemplate()}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
