"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, Download, Palette } from "lucide-react"
import { CVForm } from "@/components/cv-form/cv-form"
import { ModernTemplate } from "@/components/cv-templates/modern-template"
import { ClassicTemplate } from "@/components/cv-templates/classic-template"
import { CreativeTemplate } from "@/components/cv-templates/creative-template"
import { MinimalTemplate } from "@/components/cv-templates/minimal-template"
import { supabase } from "@/lib/supabase"
import { type CVData, type CVTemplate, CV_TEMPLATES, getDefaultCVData } from "@/lib/cv-types"
import { toast } from "@/hooks/use-toast"

export default function CVBuilderPage() {
  const [cvData, setCvData] = useState<CVData>(getDefaultCVData())
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>(CV_TEMPLATES[0])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("form")
  const [progress, setProgress] = useState(0)

  // Load existing CV data
  useEffect(() => {
    loadCVData()
  }, [])

  // Calculate progress
  useEffect(() => {
    calculateProgress()
  }, [cvData])

  const loadCVData = async () => {
    try {
      setIsLoading(true)

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.log("No authenticated user, using default data")
        setIsLoading(false)
        return
      }

      // Load CV data from database
      const { data, error } = await supabase.from("cv_data").select("*").eq("user_id", user.id).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error loading CV data:", error)
        toast({
          title: "Error",
          description: "Failed to load CV data. Using default template.",
          variant: "destructive",
        })
      } else if (data) {
        setCvData(data.data || getDefaultCVData())
        if (data.template_id) {
          const template = CV_TEMPLATES.find((t) => t.id === data.template_id)
          if (template) {
            setSelectedTemplate(template)
          }
        }
      }
    } catch (error) {
      console.error("Error in loadCVData:", error)
      toast({
        title: "Error",
        description: "Failed to load CV data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateProgress = useCallback(() => {
    let completedSections = 0
    const totalSections = 7

    // Check personal info
    if (cvData.personal.fullName && cvData.personal.email && cvData.personal.phone) {
      completedSections++
    }

    // Check experience
    if (cvData.experience.length > 0) {
      completedSections++
    }

    // Check education
    if (cvData.education.length > 0) {
      completedSections++
    }

    // Check projects
    if (cvData.projects.length > 0) {
      completedSections++
    }

    // Check skills
    if (cvData.skills.length > 0) {
      completedSections++
    }

    // Check languages
    if (cvData.languages.length > 0) {
      completedSections++
    }

    // Check certifications
    if (cvData.certifications.length > 0) {
      completedSections++
    }

    const newProgress = Math.round((completedSections / totalSections) * 100)
    setProgress(newProgress)
  }, [cvData])

  const handleSaveCV = async () => {
    try {
      setIsSaving(true)

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your CV.",
          variant: "destructive",
        })
        return
      }

      // Save CV data
      const { error } = await supabase.from("cv_data").upsert({
        user_id: user.id,
        data: cvData,
        template_id: selectedTemplate.id,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "CV saved successfully!",
      })
    } catch (error) {
      console.error("Error saving CV:", error)
      toast({
        title: "Error",
        description: "Failed to save CV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDataChange = useCallback((newData: CVData) => {
    setCvData(newData)
  }, [])

  const renderTemplate = () => {
    const templateProps = { data: cvData, template: selectedTemplate }

    switch (selectedTemplate.id) {
      case "modern":
        return <ModernTemplate {...templateProps} />
      case "classic":
        return <ClassicTemplate {...templateProps} />
      case "creative":
        return <CreativeTemplate {...templateProps} />
      case "minimal":
        return <MinimalTemplate {...templateProps} />
      default:
        return <ModernTemplate {...templateProps} />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading CV Builder...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">CV Builder</h1>
        <p className="text-xl text-muted-foreground">Create a professional CV tailored for the Chilean job market</p>

        {/* Progress */}
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="form">Edit CV</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        {/* Form Tab */}
        <TabsContent value="form" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Edit Your CV</h2>
            <Button onClick={handleSaveCV} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save CV
                </>
              )}
            </Button>
          </div>

          <CVForm data={cvData} onChange={handleDataChange} />
        </TabsContent>

        {/* Template Tab */}
        <TabsContent value="template" className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Choose Template</h2>
            <p className="text-muted-foreground">Select a template that best represents your professional style</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CV_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate.id === template.id ? "ring-2 ring-primary shadow-lg" : ""
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div
                    className="aspect-[3/4] bg-gradient-to-br rounded-md mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <Palette className="h-8 w-8 text-white opacity-80" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button onClick={handleSaveCV} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Template Choice
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">CV Preview</h2>
              <p className="text-muted-foreground">Preview your CV with the selected template</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={handleSaveCV} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save CV
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Template Preview */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-white min-h-[800px] shadow-lg">{renderTemplate()}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Alert>
        <AlertDescription>
          <strong>Tip:</strong> Complete all sections to maximize your CV's impact. The Chilean job market values
          detailed experience descriptions and relevant skills.
        </AlertDescription>
      </Alert>
    </div>
  )
}
