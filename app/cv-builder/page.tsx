"use client"

import { AlertDescription } from "@/components/ui/alert"

import { Alert } from "@/components/ui/alert"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { CVForm } from "@/components/cv-form/cv-form"
import {
  type CVTemplate,
  CV_TEMPLATES,
  type CVData,
  getDefaultCVData,
  calculateCompletionPercentage,
  validateCVData,
} from "@/lib/cv-types"
import { ModernTemplate } from "@/components/cv-templates/modern-template"
import { ClassicTemplate } from "@/components/cv-templates/classic-template"
import { CreativeTemplate } from "@/components/cv-templates/creative-template"
import { MinimalTemplate } from "@/components/cv-templates/minimal-template"
import { toast } from "sonner"
import { saveUserCV, getUserCV } from "@/lib/database"

export default function CVBuilderPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cvData, setCVData] = useState<CVData>(getDefaultCVData())
  const [template, setTemplate] = useState<CVTemplate>(CV_TEMPLATES[0])
  const [completion, setCompletion] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    loadCVData()
  }, [user, router])

  useEffect(() => {
    setCompletion(calculateCompletionPercentage(cvData))
  }, [cvData])

  const loadCVData = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await getUserCV(user.id)
      if (data) {
        setCVData(data)
      }
      if (error) {
        console.error("Error loading CV data:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar tu información. Intenta nuevamente.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const saveCVData = async () => {
    setIsSaving(true)
    try {
      const { isValid, errors } = validateCVData(cvData)
      if (!isValid) {
        toast({
          title: "Error",
          description: errors.join(", "),
          variant: "destructive",
        })
        return
      }

      const { data, error } = await saveUserCV(user.id, cvData)
      if (data) {
        setCVData(data)
        toast.success("CV guardado exitosamente")
      }
      if (error) {
        console.error("Error saving CV data:", error)
        toast({
          title: "Error",
          description: "No se pudo guardar tu información. Intenta nuevamente.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const renderTemplate = () => {
    switch (template.id) {
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

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CV Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Completa los siguientes campos para crear tu CV</CardDescription>
            </CardHeader>
            <CardContent>{isLoading ? <p>Cargando...</p> : <CVForm data={cvData} onChange={setCVData} />}</CardContent>
          </Card>
        </div>

        {/* CV Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vista Previa del CV</CardTitle>
                <div className="flex items-center space-x-4">
                  <select
                    value={template.id}
                    onChange={(e) => {
                      const selected = CV_TEMPLATES.find((t) => t.id === e.target.value)
                      if (selected) setTemplate(selected)
                    }}
                    className="border rounded-md px-3 py-2"
                  >
                    {CV_TEMPLATES.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  <Button onClick={saveCVData} disabled={isSaving}>
                    {isSaving ? "Guardando..." : "Guardar CV"}
                  </Button>
                </div>
              </div>
              <CardDescription>Selecciona un estilo y guarda tu CV</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              <div className="border p-4">{renderTemplate()}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Completion and Validation */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Progreso</h2>
          <span className="text-muted-foreground">{completion}% completado</span>
        </div>
        <Progress value={completion} className="h-4" />

        {completion < 100 && (
          <div className="mt-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Completa todos los campos para obtener un CV profesional y destacar en el mercado laboral chileno
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  )
}
