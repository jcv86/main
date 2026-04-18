"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Question {
  id: string
  title: string
  question: string
  context?: string
  linked_axis?: string
  icon?: string
}

interface SuggestedQuestionsProps {
  contextType: "dashboard" | "dtc" | "metas" | "simulaciones" | "coach" | "reports"
  performanceData?: any
  coachingMemory?: any
  onSelectQuestion?: (question: Question) => void
  title?: string
  description?: string
  maxQuestions?: number
  className?: string
}

export function SuggestedQuestions({
  contextType,
  performanceData,
  coachingMemory,
  onSelectQuestion,
  title = "Preguntas Sugeridas",
  description = "Reflexiona sobre estos puntos",
  maxQuestions = 4,
  className = "",
}: SuggestedQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateSuggestions = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/generate-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contextType,
            performanceData,
            coachingMemory,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate suggestions")
        }

        const data = await response.json()
        setQuestions((data.suggestions || []).slice(0, maxQuestions))
        setError(null)
      } catch (err) {
        console.error("[v0] Error generating suggestions:", err)
        setError("No pudimos generar sugerencias en este momento")
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    generateSuggestions()
  }, [contextType, performanceData, coachingMemory, maxQuestions])

  if (loading) {
    return (
      <Card className={`border border-border/50 ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Generando preguntas...</span>
          </div>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`border border-border/50 ${className}`}>
        <CardHeader>
          <CardTitle className="text-sm text-destructive">{error}</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (!questions || questions.length === 0) {
    return null
  }

  return (
    <Card className={`border border-border/50 bg-background/50 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-lg">💡</span>
          {title}
        </CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className={`grid gap-2 ${maxQuestions === 4 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
          {questions.map((q) => (
            <Button
              key={q.id}
              variant="outline"
              className="h-auto justify-start p-3 text-left hover:bg-purple/10 border-border/50 bg-transparent"
              onClick={() => onSelectQuestion?.(q)}
            >
              <div className="flex flex-col gap-1">
                {q.icon && <span className="text-lg">{q.icon}</span>}
                <span className="font-medium text-sm line-clamp-2">{q.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-2">{q.question}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
