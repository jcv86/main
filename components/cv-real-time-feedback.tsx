"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Info, Lightbulb, TrendingUp, Target, Zap, RefreshCw } from "lucide-react"
import type { CVData } from "@/lib/cv-types"

interface FeedbackItem {
  id: string
  type: "error" | "warning" | "suggestion" | "success"
  priority: "high" | "medium" | "low"
  section: string
  message: string
  suggestion?: string
  impact: number
}

interface CVRealTimeFeedbackProps {
  cvData: CVData
  targetRole?: string
  onApplySuggestion?: (suggestion: any) => void
}

export function CVRealTimeFeedback({ cvData, targetRole, onApplySuggestion }: CVRealTimeFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [overallScore, setOverallScore] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    analyzeCVData()
  }, [cvData, targetRole])

  const analyzeCVData = async () => {
    setIsAnalyzing(true)

    // Simulate real-time analysis
    setTimeout(() => {
      const newFeedback = generateFeedback(cvData, targetRole)
      setFeedback(newFeedback)
      setOverallScore(calculateOverallScore(newFeedback))
      setIsAnalyzing(false)
    }, 1000)
  }

  const generateFeedback = (data: CVData, role?: string): FeedbackItem[] => {
    const feedback: FeedbackItem[] = []

    // Personal Info Analysis
    if (!data.personalInfo.summary || data.personalInfo.summary.length < 50) {
      feedback.push({
        id: "summary-missing",
        type: "error",
        priority: "high",
        section: "Información Personal",
        message: "Falta resumen profesional o es muy corto",
        suggestion: "Agrega un resumen de 2-3 líneas que destaque tu experiencia y objetivos",
        impact: 20,
      })
    }

    if (!data.personalInfo.phone || !data.personalInfo.email) {
      feedback.push({
        id: "contact-incomplete",
        type: "warning",
        priority: "high",
        section: "Información Personal",
        message: "Información de contacto incompleta",
        suggestion: "Asegúrate de incluir teléfono y email actualizados",
        impact: 15,
      })
    }

    // Experience Analysis
    if (!data.experience || data.experience.length === 0) {
      feedback.push({
        id: "experience-missing",
        type: "error",
        priority: "high",
        section: "Experiencia",
        message: "No hay experiencia laboral registrada",
        suggestion: "Agrega al menos una experiencia laboral relevante",
        impact: 30,
      })
    } else {
      // Check for quantified achievements
      const hasQuantifiedAchievements = data.experience.some((exp) =>
        exp.achievements?.some(
          (achievement) => /\d+/.test(achievement), // Contains numbers
        ),
      )

      if (!hasQuantifiedAchievements) {
        feedback.push({
          id: "achievements-not-quantified",
          type: "suggestion",
          priority: "medium",
          section: "Experiencia",
          message: "Los logros no están cuantificados",
          suggestion: "Agrega números, porcentajes o métricas a tus logros (ej: 'Aumenté ventas en 25%')",
          impact: 15,
        })
      }

      // Check for recent experience
      const hasRecentExperience = data.experience.some((exp) => {
        const endDate = exp.endDate || new Date().toISOString()
        const yearsDiff = (new Date().getTime() - new Date(endDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
        return yearsDiff < 2
      })

      if (!hasRecentExperience) {
        feedback.push({
          id: "experience-outdated",
          type: "warning",
          priority: "medium",
          section: "Experiencia",
          message: "La experiencia más reciente es de hace más de 2 años",
          suggestion: "Considera agregar experiencia más reciente o explicar el gap laboral",
          impact: 10,
        })
      }
    }

    // Skills Analysis
    if (!data.skills || data.skills.length < 5) {
      feedback.push({
        id: "skills-insufficient",
        type: "warning",
        priority: "medium",
        section: "Habilidades",
        message: "Pocas habilidades registradas",
        suggestion: "Agrega al menos 8-10 habilidades relevantes para tu área",
        impact: 12,
      })
    }

    // Role-specific feedback
    if (role) {
      const roleKeywords = getRoleKeywords(role)
      const cvText = JSON.stringify(data).toLowerCase()
      const missingKeywords = roleKeywords.filter((keyword) => !cvText.includes(keyword.toLowerCase()))

      if (missingKeywords.length > 0) {
        feedback.push({
          id: "role-keywords-missing",
          type: "suggestion",
          priority: "high",
          section: "Optimización",
          message: `Faltan palabras clave para ${role}`,
          suggestion: `Considera incluir: ${missingKeywords.slice(0, 3).join(", ")}`,
          impact: 18,
        })
      }
    }

    // Education Analysis
    if (!data.education || data.education.length === 0) {
      feedback.push({
        id: "education-missing",
        type: "warning",
        priority: "low",
        section: "Educación",
        message: "No hay información educativa",
        suggestion: "Agrega tu formación académica más relevante",
        impact: 8,
      })
    }

    // Languages Analysis
    if (!data.languages || data.languages.length < 2) {
      feedback.push({
        id: "languages-limited",
        type: "suggestion",
        priority: "low",
        section: "Idiomas",
        message: "Pocos idiomas registrados",
        suggestion: "En el mercado chileno, el inglés es muy valorado. Considera agregarlo si lo manejas",
        impact: 5,
      })
    }

    // Projects Analysis
    if (!data.projects || data.projects.length === 0) {
      feedback.push({
        id: "projects-missing",
        type: "suggestion",
        priority: "medium",
        section: "Proyectos",
        message: "No hay proyectos registrados",
        suggestion: "Agrega 2-3 proyectos relevantes que demuestren tus habilidades",
        impact: 10,
      })
    }

    // Positive feedback
    if (data.personalInfo.summary && data.personalInfo.summary.length > 100) {
      feedback.push({
        id: "summary-good",
        type: "success",
        priority: "low",
        section: "Información Personal",
        message: "Excelente resumen profesional",
        impact: 0,
      })
    }

    if (data.skills && data.skills.length >= 8) {
      feedback.push({
        id: "skills-good",
        type: "success",
        priority: "low",
        section: "Habilidades",
        message: "Buena variedad de habilidades",
        impact: 0,
      })
    }

    return feedback
  }

  const getRoleKeywords = (role: string): string[] => {
    const keywordMap: { [key: string]: string[] } = {
      desarrollador: ["javascript", "react", "node.js", "git", "api", "database"],
      "product manager": ["roadmap", "stakeholders", "metrics", "user research", "agile"],
      diseñador: ["figma", "sketch", "user experience", "prototyping", "design systems"],
      "data scientist": ["python", "machine learning", "sql", "statistics", "visualization"],
      marketing: ["digital marketing", "analytics", "campaigns", "social media", "seo"],
    }

    const lowerRole = role.toLowerCase()
    for (const [key, keywords] of Object.entries(keywordMap)) {
      if (lowerRole.includes(key)) {
        return keywords
      }
    }
    return []
  }

  const calculateOverallScore = (feedbackItems: FeedbackItem[]): number => {
    const totalImpact = feedbackItems
      .filter((item) => item.type !== "success")
      .reduce((sum, item) => sum + item.impact, 0)

    return Math.max(0, 100 - totalImpact)
  }

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "suggestion":
        return <Lightbulb className="w-4 h-4 text-blue-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      case "suggestion":
        return "default"
      case "success":
        return "default"
      default:
        return "outline"
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const groupedFeedback = feedback.reduce(
    (groups, item) => {
      const section = item.section
      if (!groups[section]) {
        groups[section] = []
      }
      groups[section].push(item)
      return groups
    },
    {} as { [key: string]: FeedbackItem[] },
  )

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Puntuación General
              </CardTitle>
              <CardDescription>Análisis en tiempo real de tu CV</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={analyzeCVData} disabled={isAnalyzing}>
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={overallScore} className="h-3" />
              </div>
              <div className="text-2xl font-bold">{overallScore}/100</div>
            </div>
            <div className="flex gap-2">
              <Badge variant={overallScore >= 80 ? "default" : overallScore >= 60 ? "secondary" : "destructive"}>
                {overallScore >= 80 ? "Excelente" : overallScore >= 60 ? "Bueno" : "Necesita Mejoras"}
              </Badge>
              {targetRole && (
                <Badge variant="outline">
                  <Target className="w-3 h-3 mr-1" />
                  {targetRole}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback by Section */}
      {Object.entries(groupedFeedback).map(([section, items]) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle className="text-lg">{section}</CardTitle>
            <CardDescription>
              {items.length} {items.length === 1 ? "sugerencia" : "sugerencias"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item) => (
                <Alert key={item.id} variant={getFeedbackColor(item.type) as any}>
                  <div className="flex items-start gap-3">
                    {getFeedbackIcon(item.type)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.message}</p>
                        <Badge variant={getPriorityBadgeColor(item.priority) as any} className="text-xs">
                          {item.priority}
                        </Badge>
                      </div>
                      {item.suggestion && <AlertDescription className="text-sm">{item.suggestion}</AlertDescription>}
                      {item.suggestion && onApplySuggestion && (
                        <Button variant="outline" size="sm" onClick={() => onApplySuggestion(item)} className="mt-2">
                          <Zap className="w-3 h-3 mr-1" />
                          Aplicar Sugerencia
                        </Button>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estadísticas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Errores críticos:</span>
              <span className="font-medium text-red-600">{feedback.filter((f) => f.type === "error").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Advertencias:</span>
              <span className="font-medium text-yellow-600">{feedback.filter((f) => f.type === "warning").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sugerencias:</span>
              <span className="font-medium text-blue-600">
                {feedback.filter((f) => f.type === "suggestion").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fortalezas:</span>
              <span className="font-medium text-green-600">{feedback.filter((f) => f.type === "success").length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
