"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Save, Eye, Palette, Settings, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"
import { CVForm } from "@/components/cv-form/cv-form"
import { ModernTemplate } from "@/components/cv-templates/modern-template"
import { ClassicTemplate } from "@/components/cv-templates/classic-template"
import { CreativeTemplate } from "@/components/cv-templates/creative-template"
import { MinimalTemplate } from "@/components/cv-templates/minimal-template"
import type { CVData, CVTemplate } from "@/lib/cv-types"
import { getTemplateId, getTemplateFromId } from "@/lib/cv-types"

const TEMPLATE_OPTIONS = [
  {
    id: "modern" as CVTemplate,
    name: "Moderno",
    description: "Diseño profesional con gradientes azules",
    preview: "/cv-previews/modern.png",
    component: ModernTemplate,
  },
  {
    id: "classic" as CVTemplate,
    name: "Clásico",
    description: "Diseño tradicional y elegante",
    preview: "/cv-previews/classic.png",
    component: ClassicTemplate,
  },
  {
    id: "creative" as CVTemplate,
    name: "Creativo",
    description: "Diseño vibrante y colorido",
    preview: "/cv-previews/creative.png",
    component: CreativeTemplate,
  },
  {
    id: "minimal" as CVTemplate,
    name: "Minimalista",
    description: "Diseño limpio y minimalista",
    preview: "/cv-previews/minimal.png",
    component: MinimalTemplate,
  },
]

export default function CVBuilderPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>("modern")
  const [cvData, setCVData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    languages: [],
    certifications: [],
  })
  const [cvTitle, setCVTitle] = useState("Mi CV Profesional")
  const [currentCVId, setCurrentCVId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    loadUserCV()
  }, [user, router])

  const loadUserCV = async () => {
    try {
      setIsLoading(true)

      // First check if user is authenticated
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !currentUser) {
        console.error("Authentication error:", authError)
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("cv_data")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("is_active", true)
        .maybeSingle()

      if (error && error.code !== "PGRST116") {
        console.error("Database error:", error)
        throw error
      }

      if (data) {
        setCVData({
          personalInfo: data.personal_info || {
            fullName: "",
            email: "",
            phone: "",
            location: "",
          },
          education: data.education || [],
          experience: data.experience || [],
          projects: data.projects || [],
          skills: data.skills || [],
          languages: data.languages || [],
          certifications: data.certifications || [],
        })
        setCVTitle(data.title || "Mi CV Profesional")
        setSelectedTemplate(getTemplateFromId(data.template_id || 1))
        setCurrentCVId(data.id)
      } else {
        // Load demo data for new users
        loadDemoData()
      }
    } catch (error) {
      console.error("Error loading CV:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar tu CV. Se cargaron datos de ejemplo.",
        variant: "destructive",
      })
      loadDemoData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadDemoData = () => {
    setCVData({
      personalInfo: {
        fullName: "Juan Pérez González",
        email: "juan.perez@email.com",
        phone: "+56 9 1234 5678",
        location: "Santiago, Chile",
        jobTitle: "Desarrollador Full Stack Senior",
        summary:
          "Desarrollador de software experimentado con 5+ años de experiencia en desarrollo full-stack en el mercado chileno, especializado en React, Node.js y tecnologías cloud.",
        linkedin: "linkedin.com/in/juanperez",
        github: "github.com/juanperez",
        website: "juanperez.dev",
      },
      education: [
        {
          id: "1",
          degree: "Ingeniería Civil en Computación",
          institution: "Universidad de Chile",
          location: "Santiago, Chile",
          startDate: "2016-03",
          endDate: "2020-12",
          gpa: "6.2",
          description: "Especialización en desarrollo de software y sistemas distribuidos.",
        },
      ],
      experience: [
        {
          id: "1",
          jobTitle: "Ingeniero de Software Senior",
          company: "NotCo",
          location: "Santiago, Chile",
          startDate: "2022-01",
          endDate: "",
          description: "Lidero el desarrollo de aplicaciones customer-facing que sirven a 100K+ usuarios chilenos.",
          achievements: ["Reducción de latencia del sistema en 40%", "Liderazgo de equipo de 5 desarrolladores"],
          technologies: ["React", "Node.js", "AWS", "Docker"],
        },
      ],
      projects: [
        {
          id: "1",
          name: "E-commerce Platform Chile",
          description: "Plataforma de e-commerce completa adaptada al mercado chileno.",
          technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
          url: "https://ecommerce-chile.com",
          role: "Full Stack Developer",
        },
      ],
      skills: [
        { id: "1", name: "JavaScript", level: 90, category: "Frontend" },
        { id: "2", name: "React", level: 88, category: "Frontend" },
        { id: "3", name: "Node.js", level: 82, category: "Backend" },
        { id: "4", name: "AWS", level: 78, category: "Cloud" },
      ],
      languages: [
        { id: "1", name: "Español", proficiency: "Nativo" },
        { id: "2", name: "Inglés", proficiency: "Avanzado" },
      ],
      certifications: [
        {
          id: "1",
          name: "AWS Solutions Architect Associate",
          issuer: "Amazon Web Services",
          issueDate: "2023-06",
          credentialId: "AWS-SAA-2023-001",
        },
      ],
    })
  }

  const handleSaveCV = async (data: CVData) => {
    if (!user) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para guardar tu CV.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Verify authentication before saving
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !currentUser) {
        throw new Error("Usuario no autenticado")
      }

      const templateId = getTemplateId(selectedTemplate)

      const cvDataToSave = {
        user_id: currentUser.id,
        title: cvTitle,
        template_id: templateId,
        personal_info: data.personalInfo,
        education: data.education,
        experience: data.experience,
        projects: data.projects,
        skills: data.skills,
        languages: data.languages,
        certifications: data.certifications,
        is_active: true,
      }

      if (currentCVId) {
        // Update existing CV
        const { error } = await supabase
          .from("cv_data")
          .update({
            ...cvDataToSave,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentCVId)
          .eq("user_id", currentUser.id) // Extra security check

        if (error) {
          console.error("Update error:", error)
          throw error
        }
      } else {
        // Create new CV
        const { data: newCV, error } = await supabase.from("cv_data").insert(cvDataToSave).select().single()

        if (error) {
          console.error("Insert error:", error)
          throw error
        }

        setCurrentCVId(newCV.id)
      }

      toast({
        title: "CV guardado",
        description: "Tu CV ha sido guardado exitosamente.",
      })
    } catch (error) {
      console.error("Error saving CV:", error)
      toast({
        title: "Error",
        description: `No se pudo guardar el CV: ${error instanceof Error ? error.message : "Error desconocido"}`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      // Simple print functionality
      window.print()

      toast({
        title: "PDF preparado",
        description: "Usa Ctrl+P o Cmd+P para imprimir tu CV como PDF.",
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Error",
        description: "No se pudo preparar el PDF. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const renderTemplate = () => {
    const TemplateComponent = TEMPLATE_OPTIONS.find((t) => t.id === selectedTemplate)?.component || ModernTemplate
    return <TemplateComponent data={cvData} className="transform scale-75 origin-top" />
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando tu CV...</p>
          </div>
        </div>
      </div>
    )
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b p-4">
          <div className="container mx-auto flex items-center justify-between">
            <Button variant="outline" onClick={() => setPreviewMode(false)} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al Editor
            </Button>
            <div className="flex items-center gap-2">
              <Button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-2">
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Imprimir PDF
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto p-6 flex justify-center">
          <div className="bg-white shadow-2xl">{renderTemplate()}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FileText className="w-8 h-8" />
                Constructor de CV
              </h1>
              <p className="text-muted-foreground">Crea tu CV profesional personalizado</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setPreviewMode(true)} className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Vista Previa
            </Button>
            <Button onClick={() => handleSaveCV(cvData)} disabled={isSaving} className="flex items-center gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar CV
            </Button>
          </div>
        </div>

        {/* CV Title and Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración del CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cvTitle">Título del CV</Label>
                <Input
                  id="cvTitle"
                  value={cvTitle}
                  onChange={(e) => setCVTitle(e.target.value)}
                  placeholder="Mi CV Profesional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Plantilla</Label>
                <Select value={selectedTemplate} onValueChange={(value: CVTemplate) => setSelectedTemplate(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_OPTIONS.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Panel */}
        <div className="space-y-6">
          <CVForm initialData={cvData} onSave={handleSaveCV} onDataChange={setCVData} />
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Vista Previa - {TEMPLATE_OPTIONS.find((t) => t.id === selectedTemplate)?.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {selectedTemplate}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2"
                  >
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="transform scale-50 origin-top-left" style={{ width: "200%", height: "200%" }}>
                  {renderTemplate()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Cambiar Plantilla
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {TEMPLATE_OPTIONS.map((template) => (
                  <div
                    key={template.id}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                      selectedTemplate === template.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="aspect-[3/4] bg-gray-100 rounded mb-2 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-sm">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
