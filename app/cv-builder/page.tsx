"use client"

import { useState, useEffect } from "react"
import { CVForm } from "@/components/cv-form/cv-form"
import { supabase } from "@/lib/supabase"
import { type CVData, DEFAULT_CV_DATA } from "@/lib/cv-types"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CVBuilderPage() {
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCVData()
  }, [])

  const loadCVData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Cargar desde Supabase
        const { data, error } = await supabase
          .from("cv_data")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .single()

        if (data && !error) {
          setCvData(data.content)
        } else if (error && error.code !== "PGRST116") {
          console.error("Error loading CV data:", error)
          toast.error("Error al cargar los datos del CV")
        }
      } else {
        // Modo demo - cargar desde localStorage
        const savedData = localStorage.getItem("cv-data")
        if (savedData) {
          try {
            setCvData(JSON.parse(savedData))
          } catch (error) {
            console.error("Error parsing saved CV data:", error)
            toast.error("Error al cargar los datos guardados")
          }
        }
      }
    } catch (error) {
      console.error("Error in loadCVData:", error)
      toast.error("Error al cargar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = (data: CVData) => {
    setCvData(data)
    toast.success("CV guardado exitosamente")
  }

  const handlePreview = (data: CVData) => {
    // Implementar vista previa
    console.log("Preview CV:", data)
    toast.info("Función de vista previa en desarrollo")
  }

  const handleExport = (data: CVData) => {
    // Implementar exportación a PDF
    console.log("Export CV:", data)
    toast.info("Función de exportación en desarrollo")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Constructor de CV</h1>
        <p className="text-muted-foreground">Crea un CV profesional que destaque tus habilidades y experiencia</p>
      </div>

      <CVForm initialData={cvData} onSave={handleSave} onPreview={handlePreview} onExport={handleExport} />
    </div>
  )
}
