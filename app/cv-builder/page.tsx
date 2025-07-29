"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CVForm } from "@/components/cv-form/cv-form"
import { ModernTemplate } from "@/components/cv-templates/modern-template"
import { ClassicTemplate } from "@/components/cv-templates/classic-template"
import { CreativeTemplate } from "@/components/cv-templates/creative-template"
import { MinimalTemplate } from "@/components/cv-templates/minimal-template"
import { PDFGenerator } from "@/components/pdf-generator"
import { CVRealTimeFeedback } from "@/components/cv-real-time-feedback"
import { FileText, Download, Eye, Palette, CheckCircle, AlertCircle, Sparkles, Target, TrendingUp } from "lucide-react"
import type { CVData } from "@/lib/cv-types"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

const templates = [
  {
    id: "modern",
    name: "Moderno",
    description: "Diseño limpio y profesional para empresas tecnológicas",
    component: ModernTemplate,
    preview: "/placeholder.svg?height=300&width=200&text=Moderno",
    recommended: true,
  },
  {
    id: "classic",
    name: "Clásico",
    description: "Formato tradicional ideal para sectores conservadores",
    component: ClassicTemplate,
    preview: "/placeholder.svg?height=300&width=200&text=Clásico",
  },
  {
    id: "creative",
    name: "Creativo",
    description: "Diseño innovador para industrias creativas",
    component: CreativeTemplate,
    preview: "/placeholder.svg?height=300&width=200&text=Creativo",
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Enfoque simple y elegante",
    component: MinimalTemplate,
    preview: "/placeholder.svg?height=300&width=200&text=Minimal",
  },
]

export default function CVBuilderPage() {
  const { user } = useAuth()
  const [cvData, setCVData] = useState<CVData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      summary: "",
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  })
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  // Calcular porcentaje de completitud
  useEffect(() => {
    const calculateCompletion = () => {
      let completed = 0
      const total = 7 // Total de secciones

      // Información personal (obligatoria)
      if (cvData.personalInfo.firstName && cvData.personalInfo.lastName && cvData.personalInfo.email) {
        completed += 1
      }

      // Resumen profesional
      if (cvData.personalInfo.summary && cvData.personalInfo.summary.length >= 50) {
        completed += 1
      }

      // Experiencia laboral
      if (cvData.experiences.length > 0) {
        completed += 1
      }

      // Educación
      if (cvData.education.length > 0) {
        completed += 1
      }

      // Habilidades
      if (cvData.skills.length >= 3) {
        completed += 1
      }

      // Proyectos (opcional pero suma)
      if (cvData.projects.length > 0) {
        completed += 1
      }

      // Idiomas (opcional pero suma)
      if (cvData.languages.length > 0) {
        completed += 1
      }

      const percentage = Math.round((completed / total) * 100)
      setCompletionPercentage(percentage)
    }

    calculateCompletion()
  }, [cvData])

  // Cargar datos del CV si existen
  useEffect(() => {
    const loadCVData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("cv_data").select("*").eq("user_id", user.id).single()

        if (data && !error) {
          setCVData(data.cv_data)
          setSelectedTemplate(data.template_id || "modern")
        }
      } catch (error) {
        console.error("Error loading CV data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCVData()
  }, [user])

  // Guardar datos automáticamente
  const saveCVData = async (data: CVData) => {
    if (!user || isSaving) return

    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("cv_data").upsert({
        user_id: user.id,
        cv_data: data,
        template_id: selectedTemplate,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success("CV guardado automáticamente")
    } catch (error) {
      console.error("Error saving CV:", error)
      toast.error("Error al guardar el CV")
    } finally {
      setIsSaving(false)
    }
  }

  // Guardar cuando cambian los datos
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user && (cvData.personalInfo.firstName || cvData.personalInfo.email)) {
        saveCVData(cvData)
      }
    }, 2000) // Guardar después de 2 segundos de inactividad

    return () => clearTimeout(timeoutId)
  }, [cvData, selectedTemplate, user])

  const SelectedTemplateComponent = templates.find((t) => t.id === selectedTemplate)?.component || ModernTemplate

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando tu CV...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Constructor de CV</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Crea un currículum profesional optimizado para el mercado laboral chileno
        </p>

        {/* Progress Bar */}
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progreso del CV</span>
                <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {completionPercentage >= 70 ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    ¡Excelente! Tu CV está casi completo
                  </>
                ) : completionPercentage >= 40 ? (
                  <>
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                    Buen progreso, sigue completando secciones
                  </>
                ) : (
                  <>
                    <Target className="h-3 w-3 text-blue-500" />
                    Completa más secciones para mejorar tu CV
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="editor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Vista Previa
          </TabsTrigger>
        </TabsList>

        {/* Editor Tab */}
        <TabsContent value="editor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CVForm cvData={cvData} onDataChange={setCVData} />
            </div>
            <div className="space-y-4">
              <CVRealTimeFeedback cvData={cvData} />

              {/* Save Status */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm">
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Guardado automáticamente
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Elige tu Plantilla</h2>
            <p className="text-muted-foreground">Selecciona el diseño que mejor represente tu perfil profesional</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader className="pb-2">
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-2 overflow-hidden">
                    <img
                      src={template.preview || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.recommended && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Recomendado
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Vista Previa</h2>
              <p className="text-muted-foreground">
                Así se verá tu CV con la plantilla {templates.find((t) => t.id === selectedTemplate)?.name}
              </p>
            </div>
            <div className="flex gap-2">
              <PDFGenerator cvData={cvData} templateId={selectedTemplate}>
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Descargar PDF
                </Button>
              </PDFGenerator>
            </div>
          </div>

          <Card className="p-6">
            <div className="max-w-4xl mx-auto">
              <SelectedTemplateComponent cvData={cvData} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Próximos Pasos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild className="h-auto p-4 bg-transparent">
              <a href="/cv-ai-generator" className="flex flex-col items-center gap-2">
                <Sparkles className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Mejorar con IA</div>
                  <div className="text-xs text-muted-foreground">Optimiza tu CV automáticamente</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" asChild className="h-auto p-4 bg-transparent">
              <a href="/job-search" className="flex flex-col items-center gap-2">
                <Target className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Buscar Empleos</div>
                  <div className="text-xs text-muted-foreground">Encuentra oportunidades</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" asChild className="h-auto p-4 bg-transparent">
              <a href="/interview-simulator" className="flex flex-col items-center gap-2">
                <FileText className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Practicar Entrevistas</div>
                  <div className="text-xs text-muted-foreground">Simula entrevistas de trabajo</div>
                </div>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
