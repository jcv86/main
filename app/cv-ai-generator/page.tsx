"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  Sparkles,
  FileText,
  Target,
  Zap,
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Share2,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface GenerationResult {
  id: string
  generatedContent: any
  qualityScore: number
  feedback: any[]
}

interface GenerationHistory {
  id: string
  generation_type: string
  quality_score: number
  created_at: string
  generated_content: any
}

export default function CVAIGeneratorPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("complete")
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null)
  const [generationHistory, setGenerationHistory] = useState<GenerationHistory[]>([])

  // Form states
  const [completeFormData, setCompleteFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "Santiago, Chile",
    targetRole: "",
    industry: "",
    experience: "",
    education: "",
    skills: "",
  })

  const [sectionFormData, setSectionFormData] = useState({
    section: "summary",
    context: "",
    currentContent: "",
  })

  const [optimizeFormData, setOptimizeFormData] = useState({
    cvData: "",
    targetRole: "",
    jobDescription: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    loadGenerationHistory()
  }, [user, router])

  const loadGenerationHistory = async () => {
    try {
      const response = await fetch("/api/cv-ai-generator")
      if (response.ok) {
        const result = await response.json()
        setGenerationHistory(result.data || [])
      }
    } catch (error) {
      console.error("Error loading generation history:", error)
    }
  }

  const handleCompleteGeneration = async () => {
    if (!completeFormData.fullName || !completeFormData.targetRole) {
      toast.error("Por favor completa los campos requeridos")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/cv-ai-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationType: "complete",
          inputData: completeFormData,
          templateId: "modern",
        }),
      })

      if (!response.ok) {
        throw new Error("Error en la generación")
      }

      const result = await response.json()
      setGenerationResult(result.data)
      toast.success("CV generado exitosamente")
      loadGenerationHistory()
    } catch (error) {
      console.error("Error generating CV:", error)
      toast.error("Error al generar el CV")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSectionGeneration = async () => {
    if (!sectionFormData.context) {
      toast.error("Por favor proporciona contexto para la sección")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/cv-ai-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationType: "section",
          inputData: {
            section: sectionFormData.section,
            context: { industry: sectionFormData.context },
            content: sectionFormData.currentContent,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Error en la generación")
      }

      const result = await response.json()
      setGenerationResult(result.data)
      toast.success("Sección generada exitosamente")
      loadGenerationHistory()
    } catch (error) {
      console.error("Error generating section:", error)
      toast.error("Error al generar la sección")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptimization = async () => {
    if (!optimizeFormData.cvData || !optimizeFormData.targetRole) {
      toast.error("Por favor completa los campos requeridos")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/cv-ai-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationType: "optimize",
          inputData: {
            cvData: JSON.parse(optimizeFormData.cvData),
            targetRole: optimizeFormData.targetRole,
            jobDescription: optimizeFormData.jobDescription,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Error en la optimización")
      }

      const result = await response.json()
      setGenerationResult(result.data)
      toast.success("CV optimizado exitosamente")
      loadGenerationHistory()
    } catch (error) {
      console.error("Error optimizing CV:", error)
      toast.error("Error al optimizar el CV")
    } finally {
      setIsLoading(false)
    }
  }

  const renderGenerationResult = () => {
    if (!generationResult) return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Generación Completada
              </CardTitle>
              <CardDescription>Puntuación de calidad: {generationResult.qualityScore}/100</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Progress value={generationResult.qualityScore} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Puntuación de calidad: {generationResult.qualityScore}/100
              </p>
            </div>

            {generationResult.feedback && generationResult.feedback.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Sugerencias de Mejora:</h4>
                <div className="space-y-2">
                  {generationResult.feedback.map((item: any, index: number) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{item.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Contenido Generado:</h4>
              <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96">
                {JSON.stringify(generationResult.generatedContent, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-500" />
          Generador de CV con IA
        </h1>
        <p className="text-muted-foreground">
          Utiliza inteligencia artificial para crear y optimizar tu CV profesional
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="complete" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                CV Completo
              </TabsTrigger>
              <TabsTrigger value="section" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Por Sección
              </TabsTrigger>
              <TabsTrigger value="optimize" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Optimizar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="complete">
              <Card>
                <CardHeader>
                  <CardTitle>Generar CV Completo</CardTitle>
                  <CardDescription>
                    Proporciona información básica y la IA creará un CV completo profesional
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Nombre Completo *</Label>
                      <Input
                        id="fullName"
                        value={completeFormData.fullName}
                        onChange={(e) => setCompleteFormData({ ...completeFormData, fullName: e.target.value })}
                        placeholder="Juan Pérez González"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={completeFormData.email}
                        onChange={(e) => setCompleteFormData({ ...completeFormData, email: e.target.value })}
                        placeholder="juan@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={completeFormData.phone}
                        onChange={(e) => setCompleteFormData({ ...completeFormData, phone: e.target.value })}
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        value={completeFormData.location}
                        onChange={(e) => setCompleteFormData({ ...completeFormData, location: e.target.value })}
                        placeholder="Santiago, Chile"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetRole">Cargo Objetivo *</Label>
                      <Input
                        id="targetRole"
                        value={completeFormData.targetRole}
                        onChange={(e) => setCompleteFormData({ ...completeFormData, targetRole: e.target.value })}
                        placeholder="Desarrollador Full Stack Senior"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industria</Label>
                      <Select
                        value={completeFormData.industry}
                        onValueChange={(value) => setCompleteFormData({ ...completeFormData, industry: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona industria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tecnologia">Tecnología</SelectItem>
                          <SelectItem value="finanzas">Finanzas</SelectItem>
                          <SelectItem value="salud">Salud</SelectItem>
                          <SelectItem value="educacion">Educación</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="consultoria">Consultoría</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="experience">Experiencia Previa</Label>
                    <Textarea
                      id="experience"
                      value={completeFormData.experience}
                      onChange={(e) => setCompleteFormData({ ...completeFormData, experience: e.target.value })}
                      placeholder="Describe brevemente tu experiencia laboral..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="education">Educación</Label>
                    <Input
                      id="education"
                      value={completeFormData.education}
                      onChange={(e) => setCompleteFormData({ ...completeFormData, education: e.target.value })}
                      placeholder="Ingeniería Civil en Computación, Universidad de Chile"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills">Habilidades (separadas por comas)</Label>
                    <Textarea
                      id="skills"
                      value={completeFormData.skills}
                      onChange={(e) => setCompleteFormData({ ...completeFormData, skills: e.target.value })}
                      placeholder="JavaScript, React, Node.js, Python, AWS..."
                      rows={2}
                    />
                  </div>

                  <Button onClick={handleCompleteGeneration} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generando CV...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Generar CV Completo
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="section">
              <Card>
                <CardHeader>
                  <CardTitle>Generar Sección Específica</CardTitle>
                  <CardDescription>Mejora o crea una sección específica de tu CV</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="section">Sección a Generar</Label>
                    <Select
                      value={sectionFormData.section}
                      onValueChange={(value) => setSectionFormData({ ...sectionFormData, section: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Resumen Profesional</SelectItem>
                        <SelectItem value="experience">Experiencia Laboral</SelectItem>
                        <SelectItem value="skills">Habilidades</SelectItem>
                        <SelectItem value="projects">Proyectos</SelectItem>
                        <SelectItem value="achievements">Logros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="context">Contexto/Información</Label>
                    <Textarea
                      id="context"
                      value={sectionFormData.context}
                      onChange={(e) => setSectionFormData({ ...sectionFormData, context: e.target.value })}
                      placeholder="Proporciona contexto sobre tu experiencia, industria, o rol objetivo..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentContent">Contenido Actual (opcional)</Label>
                    <Textarea
                      id="currentContent"
                      value={sectionFormData.currentContent}
                      onChange={(e) => setSectionFormData({ ...sectionFormData, currentContent: e.target.value })}
                      placeholder="Si tienes contenido existente, pégalo aquí para mejorarlo..."
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleSectionGeneration} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generando Sección...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Generar Sección
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimize">
              <Card>
                <CardHeader>
                  <CardTitle>Optimizar CV Existente</CardTitle>
                  <CardDescription>Mejora tu CV actual para un puesto específico</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cvData">Datos del CV (JSON)</Label>
                    <Textarea
                      id="cvData"
                      value={optimizeFormData.cvData}
                      onChange={(e) => setOptimizeFormData({ ...optimizeFormData, cvData: e.target.value })}
                      placeholder='{"personalInfo": {"fullName": "..."}, "experience": [...], ...}'
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetRole">Cargo Objetivo</Label>
                    <Input
                      id="targetRole"
                      value={optimizeFormData.targetRole}
                      onChange={(e) => setOptimizeFormData({ ...optimizeFormData, targetRole: e.target.value })}
                      placeholder="Desarrollador Full Stack Senior"
                    />
                  </div>

                  <div>
                    <Label htmlFor="jobDescription">Descripción del Puesto (opcional)</Label>
                    <Textarea
                      id="jobDescription"
                      value={optimizeFormData.jobDescription}
                      onChange={(e) => setOptimizeFormData({ ...optimizeFormData, jobDescription: e.target.value })}
                      placeholder="Pega aquí la descripción del puesto para optimizar mejor tu CV..."
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleOptimization} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Optimizando CV...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Optimizar CV
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {renderGenerationResult()}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historial de Generaciones</CardTitle>
            </CardHeader>
            <CardContent>
              {generationHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay generaciones previas</p>
              ) : (
                <div className="space-y-3">
                  {generationHistory.slice(0, 5).map((generation) => (
                    <div key={generation.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{generation.generation_type}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(generation.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={generation.quality_score} className="flex-1" />
                        <span className="text-xs">{generation.quality_score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consejos de IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <p>Usa palabras clave específicas del puesto objetivo</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <p>Cuantifica tus logros con números y porcentajes</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <p>Adapta tu CV para cada aplicación</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <p>Mantén un formato limpio y profesional</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
