"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import {
  FileText,
  Download,
  Share2,
  Eye,
  Settings,
  Palette,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { CVForm } from "@/components/cv-form/cv-form"
import { ModernTemplate } from "@/components/cv-templates/modern-template"
import { ClassicTemplate } from "@/components/cv-templates/classic-template"
import { CreativeTemplate } from "@/components/cv-templates/creative-template"
import { MinimalTemplate } from "@/components/cv-templates/minimal-template"
import { type CVData, getDefaultCVData, CV_TEMPLATES, calculateCompletionPercentage } from "@/lib/cv-types"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"

export default function CVBuilderPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cvData, setCVData] = useState<CVData>(getDefaultCVData())
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState("edit")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    loadCVData()
  }, [user, router])

  const loadCVData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const supabase = createClient()

      // Try to load existing CV data
      const { data: existingCV, error } = await supabase
        .from("cv_data")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error loading CV:", error)
        throw error
      }

      if (existingCV) {
        setCVData(existingCV.data as CVData)
        setSelectedTemplate(existingCV.template)
        setLastSaved(new Date(existingCV.updated_at))
      } else {
        // Create default CV data for new users
        const defaultData = getDefaultCVData()

        // Add some demo data if user email is demo
        if (user.email === "demo@dtcfinal.com") {
          defaultData.personalInfo = {
            fullName: "Juan Pérez González",
            email: "juan.perez@email.com",
            phone: "+56 9 1234 5678",
            location: "Santiago, Chile",
            jobTitle: "Desarrollador Full Stack Senior",
            linkedin: "linkedin.com/in/juanperez",
            github: "github.com/juanperez",
            website: "juanperez.dev",
            summary:
              "Desarrollador de software experimentado con 5+ años de experiencia en desarrollo full-stack en el mercado chileno, especializado en React, Node.js y tecnologías cloud. Apasionado por crear soluciones escalables y liderar equipos de desarrollo en empresas chilenas.",
          }

          defaultData.experience = [
            {
              id: "exp1",
              jobTitle: "Ingeniero de Software Senior",
              company: "NotCo",
              location: "Santiago, Chile",
              startDate: "2022-01",
              endDate: "",
              description:
                "Lidero el desarrollo de aplicaciones customer-facing que sirven a 100K+ usuarios chilenos. Implementé arquitectura de microservicios reduciendo la latencia del sistema en 40%.",
              achievements: [
                "Reducción de latencia del sistema en 40%",
                "Liderazgo de equipo de 5 desarrolladores",
                "Implementación de arquitectura de microservicios",
              ],
              technologies: ["React", "Node.js", "AWS", "PostgreSQL", "Docker"],
            },
          ]

          defaultData.education = [
            {
              id: "edu1",
              degree: "Ingeniería Civil en Computación",
              institution: "Universidad de Chile",
              location: "Santiago, Chile",
              startDate: "2016-03",
              endDate: "2020-12",
              gpa: "6.2",
              description: "Especialización en desarrollo de software y sistemas distribuidos",
            },
          ]

          defaultData.skills = [
            { id: "skill1", name: "JavaScript", level: 90, category: "Frontend", yearsOfExperience: 5 },
            { id: "skill2", name: "React", level: 85, category: "Frontend", yearsOfExperience: 4 },
            { id: "skill3", name: "Node.js", level: 80, category: "Backend", yearsOfExperience: 4 },
            { id: "skill4", name: "AWS", level: 75, category: "Cloud", yearsOfExperience: 3 },
            { id: "skill5", name: "PostgreSQL", level: 70, category: "Database", yearsOfExperience: 3 },
          ]

          defaultData.languages = [
            { id: "lang1", name: "Español", proficiency: "Nativo" },
            { id: "lang2", name: "Inglés", proficiency: "Avanzado" },
          ]
        }

        setCVData(defaultData)
      }
    } catch (error) {
      console.error("Error loading CV data:", error)
      toast.error("Error al cargar los datos del CV")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveCV = async (data: CVData) => {
    if (!user) {
      toast.error("Debes iniciar sesión para guardar tu CV")
      return
    }

    try {
      setIsSaving(true)
      const supabase = createClient()

      const cvPayload = {
        user_id: user.id,
        title: "Mi CV Profesional",
        template: selectedTemplate,
        data: data,
        is_active: true,
      }

      // Try to update existing CV first
      const { data: existingCV } = await supabase
        .from("cv_data")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single()

      let result
      if (existingCV) {
        // Update existing CV
        result = await supabase
          .from("cv_data")
          .update({
            template: selectedTemplate,
            data: data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingCV.id)
          .select()
          .single()
      } else {
        // Insert new CV
        result = await supabase.from("cv_data").insert(cvPayload).select().single()
      }

      if (result.error) {
        console.error("Supabase error:", result.error)
        throw result.error
      }

      setLastSaved(new Date())
      toast.success("CV guardado exitosamente")
    } catch (error) {
      console.error("Error saving CV:", error)
      toast.error("Error al guardar el CV: " + (error as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDataChange = (data: CVData) => {
    setCVData(data)
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    // Auto-save when template changes
    if (cvData.personalInfo.fullName) {
      handleSaveCV(cvData)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "modern":
        return <ModernTemplate data={cvData} />
      case "classic":
        return <ClassicTemplate data={cvData} />
      case "creative":
        return <CreativeTemplate data={cvData} />
      case "minimal":
        return <MinimalTemplate data={cvData} />
      default:
        return <ModernTemplate data={cvData} />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando constructor de CV...</p>
          </div>
        </div>
      </div>
    )
  }

  const completionPercentage = calculateCompletionPercentage(cvData)

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="w-8 h-8" />
              Constructor de CV
            </h1>
            <p className="text-muted-foreground">Crea tu CV profesional adaptado al mercado chileno</p>
          </div>
          <div className="flex items-center gap-4">
            {lastSaved && (
              <div className="text-sm text-muted-foreground">Guardado: {lastSaved.toLocaleTimeString()}</div>
            )}
            <Badge variant={completionPercentage >= 80 ? "default" : "secondary"}>
              {completionPercentage}% Completo
            </Badge>
          </div>
        </div>

        {completionPercentage < 50 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tu CV está incompleto. Completa al menos el 80% para obtener mejores resultados en tu búsqueda laboral.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Editar
          </TabsTrigger>
          <TabsTrigger value="template" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Plantilla
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Vista Previa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <CVForm initialData={cvData} onSave={handleSaveCV} onDataChange={handleDataChange} />
        </TabsContent>

        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle>Selecciona una Plantilla</CardTitle>
              <CardDescription>Elige el diseño que mejor represente tu perfil profesional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {CV_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleTemplateChange(template.id)}
                  >
                    <div className="aspect-[3/4] bg-gray-100 rounded mb-3 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Vista previa</span>
                    </div>
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    {selectedTemplate === template.id && (
                      <Badge className="w-full justify-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Seleccionada
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <div className="space-y-6">
            {/* Preview Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vista Previa del CV</CardTitle>
                    <CardDescription>
                      Así se verá tu CV con la plantilla {CV_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                      <Download className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartir
                    </Button>
                    <Button onClick={() => handleSaveCV(cvData)} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Guardar
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* CV Preview */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="max-w-4xl mx-auto bg-white shadow-lg">{renderTemplate()}</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
