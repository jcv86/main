"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Loader2, Save, Download, Palette, Menu, Eye, Edit, Smartphone, Monitor } from "lucide-react"
import { CVForm } from "@/components/cv-form/cv-form"
import { ModernTemplate } from "@/components/cv-templates/modern-template"
import { ClassicTemplate } from "@/components/cv-templates/classic-template"
import { CreativeTemplate } from "@/components/cv-templates/creative-template"
import { MinimalTemplate } from "@/components/cv-templates/minimal-template"
import { createClient } from "@/lib/supabase"
import {
  type CVData,
  type CVTemplate,
  CV_TEMPLATES,
  getDefaultCVData,
  calculateCompletionPercentage,
  validateCVData,
} from "@/lib/cv-types"
import { toast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

export default function CVBuilderPage() {
  const [cvData, setCvData] = useState<CVData>(getDefaultCVData())
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>(CV_TEMPLATES[0])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("form")
  const [progress, setProgress] = useState(0)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const isMobile = useIsMobile()

  // Load existing CV data
  useEffect(() => {
    loadCVData()
  }, [])

  // Calculate progress
  useEffect(() => {
    const newProgress = calculateCompletionPercentage(cvData)
    setProgress(newProgress)
  }, [cvData])

  const loadCVData = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

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

  const handleSaveCV = async () => {
    try {
      setIsSaving(true)
      const supabase = createClient()

      // Validate CV data
      const validation = validateCVData(cvData)
      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: `Please fix the following errors: ${validation.errors.slice(0, 3).join(", ")}${validation.errors.length > 3 ? "..." : ""}`,
          variant: "destructive",
        })
        return
      }

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

  const MobileNavigation = () => (
    <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden bg-transparent">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>CV Builder Navigation</SheetTitle>
          <SheetDescription>Navigate between different sections</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <Button
            variant={activeTab === "form" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => {
              setActiveTab("form")
              setShowMobileMenu(false)
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit CV
          </Button>
          <Button
            variant={activeTab === "template" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => {
              setActiveTab("template")
              setShowMobileMenu(false)
            }}
          >
            <Palette className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button
            variant={activeTab === "preview" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => {
              setActiveTab("preview")
              setShowMobileMenu(false)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <div className="pt-4 border-t">
            <Button onClick={handleSaveCV} disabled={isSaving} className="w-full">
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
      </SheetContent>
    </Sheet>
  )

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
    <div className="container mx-auto py-4 md:py-8 space-y-6 md:space-y-8">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden">
        <div>
          <h1 className="text-2xl font-bold">CV Builder</h1>
          <p className="text-sm text-muted-foreground">Create your professional CV</p>
        </div>
        <MobileNavigation />
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block text-center space-y-4">
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

      {/* Mobile Progress */}
      <Card className="md:hidden">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Desktop Tabs */}
        <div className="hidden md:flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit CV
            </TabsTrigger>
            <TabsTrigger value="template" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Template
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Form Tab */}
        <TabsContent value="form" className="space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">Edit Your CV</h2>
              <p className="text-sm text-muted-foreground">Fill in your information section by section</p>
            </div>
            <Button onClick={handleSaveCV} disabled={isSaving} className="w-full md:w-auto">
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

          <ScrollArea className="h-[calc(100vh-300px)] md:h-auto">
            <CVForm data={cvData} onChange={handleDataChange} />
          </ScrollArea>
        </TabsContent>

        {/* Template Tab */}
        <TabsContent value="template" className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold">Choose Template</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Select a template that best represents your professional style
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                      <Palette className="h-6 w-6 md:h-8 md:w-8 text-white opacity-80" />
                    </div>
                  </div>
                  <CardTitle className="text-base md:text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-xs md:text-sm">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge variant="secondary" className="text-xs">
                    {template.id}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button onClick={handleSaveCV} disabled={isSaving} className="w-full md:w-auto">
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">CV Preview</h2>
              <p className="text-sm text-muted-foreground">Preview your CV with the selected template</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Preview Mode Toggle */}
              <div className="flex rounded-lg border p-1">
                <Button
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                  className="flex items-center gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  <span className="hidden sm:inline">Desktop</span>
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                  className="flex items-center gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">Mobile</span>
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                </Button>
                <Button onClick={handleSaveCV} disabled={isSaving} className="flex-1 sm:flex-none">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Saving...</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Save CV</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Template Preview */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className={`bg-white shadow-lg transition-all duration-300 ${
                  previewMode === "mobile" ? "max-w-sm mx-auto scale-75 md:scale-90" : "w-full"
                }`}
                style={{
                  minHeight: previewMode === "mobile" ? "600px" : "800px",
                  transform: previewMode === "mobile" && isMobile ? "scale(0.6)" : undefined,
                  transformOrigin: "top center",
                }}
              >
                <ScrollArea className={previewMode === "mobile" ? "h-[600px]" : "h-[800px]"}>
                  {renderTemplate()}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Alert>
        <AlertDescription>
          <strong>Tip:</strong> Complete all sections to maximize your CV's impact. The Chilean job market values
          detailed experience descriptions and relevant skills. Use the mobile preview to see how your CV looks on
          different devices.
        </AlertDescription>
      </Alert>
    </div>
  )
}
