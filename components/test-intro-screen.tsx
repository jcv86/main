"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, Target, Lightbulb } from "lucide-react"

interface TestIntroScreenProps {
  testName?: string
  testDescription?: string
  title?: string
  description?: string
  whatItMeasures?: string[]
  dimensions?: Array<{ name: string; description: string }>
  whyRelevant?: string
  estimatedTime?: number // in minutes
  totalQuestions?: number
  onStart: () => void
  onBack?: () => void
}

export function TestIntroScreen({
  testName = "Test",
  testDescription = "Assessment",
  title,
  description,
  whatItMeasures = [],
  dimensions = [],
  whyRelevant = "",
  estimatedTime = 10,
  totalQuestions = 50,
  onStart,
  onBack,
}: TestIntroScreenProps) {
  // Use title/description if provided, otherwise use testName/testDescription
  const displayName = title || testName
  const displayDescription = description || testDescription
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Evaluación DTC
            </Badge>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {displayName}
          </CardTitle>
          <CardDescription className="text-lg">{displayDescription}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* What it measures */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">¿Qué evalúa este test?</h3>
            </div>
            <ul className="space-y-2 ml-7">
              {whatItMeasures.map((measure, index) => (
                <li key={index} className="text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{measure}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why relevant */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">¿Por qué es relevante para ti?</h3>
            </div>
            <p className="text-muted-foreground ml-7">{whyRelevant}</p>
          </div>

          {/* Dimensions */}
          {dimensions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Dimensiones que se evalúan:</h3>
              <div className="grid gap-3 ml-7">
                {dimensions.map((dimension, index) => (
                  <div key={index} className="p-3 bg-secondary/50 rounded-lg">
                    <p className="font-medium text-sm">{dimension.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{dimension.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test info */}
          <div className="flex items-center justify-center gap-8 py-4 border-y">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">{estimatedTime} minutos</p>
                <p className="text-muted-foreground text-xs">Tiempo estimado</p>
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">{totalQuestions} preguntas</p>
                <p className="text-muted-foreground text-xs">Total de items</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button onClick={onStart} size="lg" className="w-full max-w-md text-lg">
              Comenzar Evaluación
            </Button>
            {onBack && (
              <Button onClick={onBack} variant="ghost" size="sm">
                Volver atrás
              </Button>
            )}
            <p className="text-sm text-muted-foreground text-center">Tus respuestas serán guardadas automáticamente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TestIntroScreen
