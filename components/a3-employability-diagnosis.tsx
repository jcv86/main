"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"

interface EmployabilityDiagnosisProps {
  onComplete: (diagnosis: any) => void
}

export function A3EmployabilityDiagnosis({ onComplete }: EmployabilityDiagnosisProps) {
  const [stage, setStage] = useState<"questions" | "results">("questions")
  const [responses, setResponses] = useState<Record<number, number>>({})
  const [diagnosis, setDiagnosis] = useState<any>(null)

  const QUESTIONS = [
    { id: 1, text: "¿Puedo explicar claramente mi propuesta de valor en 30 segundos?", category: "profile_clarity" },
    { id: 2, text: "¿Conozco mis 3 fortalezas principales para este cargo?", category: "strengths" },
    { id: 3, text: "¿He practicado responder preguntas técnicas del rol?", category: "preparation" },
    { id: 4, text: "¿Comprendo la cultura y valores de la empresa?", category: "research" },
    { id: 5, text: "¿Tengo historias concretas para respaldar mis capacidades?", category: "storytelling" },
  ]

  const handleResponse = (questionId: number, score: number) => {
    setResponses(prev => ({ ...prev, [questionId]: score }))
  }

  const calculateDiagnosis = () => {
    const profileClarity = (responses[1] || 0) / 5 * 100
    const strengthsIdentified = (responses[2] || 0) / 5 * 100
    const prepLevel = Object.values(responses).reduce((a, b) => a + b, 0) / (Object.keys(responses).length * 5) * 100

    const mockDiagnosis = {
      profile_clarity: profileClarity,
      profile_clarity_feedback: profileClarity > 70 ? "Tienes claridad en tu propuesta de valor" : "Necesitas trabajar en tu pitch personal",
      strengths: [
        "Comunicación clara",
        "Pensamiento estratégico",
        "Capacidad de aprendizaje"
      ],
      gaps: [
        "Experiencia en metodologías ágiles",
        "Gestión de equipos remotos",
        "Análisis de datos"
      ],
      prep_level: prepLevel > 70 ? "avanzado" : prepLevel > 40 ? "intermedio" : "basico",
      prep_level_score: prepLevel,
      focus_areas: [
        "Practicar respuestas a preguntas de comportamiento",
        "Desarrollar casos de estudio reales",
        "Mock interviews con feedback profesional"
      ]
    }

    setDiagnosis(mockDiagnosis)
    setStage("results")
  }

  if (stage === "questions") {
    const allAnswered = Object.keys(responses).length === QUESTIONS.length

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            A3.1 - Diagnóstico de Empleabilidad
          </CardTitle>
          <CardDescription>
            Evaluaremos tu claridad de perfil, fortalezas reales y brechas principales para calibrar el entrenamiento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="border-l-4 border-blue/50 pl-4">
                <div className="font-medium text-sm mb-3">{q.text}</div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleResponse(q.id, score)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        responses[q.id] === score
                          ? "bg-blue text-white"
                          : "bg-muted/10 text-muted-foreground hover:bg-muted/20"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground text-center">
            1 = Completamente en desacuerdo | 5 = Completamente de acuerdo
          </div>

          <Button
            onClick={calculateDiagnosis}
            disabled={!allAnswered}
            className="w-full"
            size="lg"
          >
            Generar Diagnóstico
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green" />
          Tu Diagnóstico de Empleabilidad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Clarity */}
        <div className="bg-blue/5 p-4 rounded-[28px] border border-blue/20">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Claridad de Perfil</div>
            <Badge>{Math.round(diagnosis?.profile_clarity)}%</Badge>
          </div>
          <Progress value={diagnosis?.profile_clarity} className="mb-2" />
          <p className="text-sm text-muted">{diagnosis?.profile_clarity_feedback}</p>
        </div>

        {/* Prep Level */}
        <div className="bg-green/5 p-4 rounded-[28px] border border-green/20">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Nivel de Preparación</div>
            <Badge className="bg-green">{diagnosis?.prep_level?.toUpperCase()}</Badge>
          </div>
          <Progress value={diagnosis?.prep_level_score} className="mb-2" />
          <p className="text-xs text-muted-foreground">Puntuación: {Math.round(diagnosis?.prep_level_score)}/100</p>
        </div>

        {/* Strengths */}
        <div className="bg-amber-50 p-4 rounded-[28px] border border-amber-200">
          <div className="font-medium mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green" />
            Fortalezas Identificadas
          </div>
          <ul className="space-y-2">
            {diagnosis?.strengths?.map((strength: string, idx: number) => (
              <li key={idx} className="text-sm text-muted flex items-start gap-2">
                <span className="text-green font-bold">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps */}
        <div className="bg-red/5 p-4 rounded-[28px] border border-red/20">
          <div className="font-medium mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red" />
            Brechas Principales
          </div>
          <ul className="space-y-2">
            {diagnosis?.gaps?.map((gap: string, idx: number) => (
              <li key={idx} className="text-sm text-muted flex items-start gap-2">
                <span className="text-red font-bold">•</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>

        {/* Focus Areas */}
        <div className="bg-purple/5 p-4 rounded-[28px] border border-purple/20">
          <div className="font-medium mb-3">Áreas de Enfoque para tu Entrenamiento</div>
          <ul className="space-y-2">
            {diagnosis?.focus_areas?.map((area: string, idx: number) => (
              <li key={idx} className="text-sm text-muted flex items-start gap-2">
                <span className="text-purple font-bold">→</span>
                {area}
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={() => onComplete(diagnosis)}
          className="w-full"
          size="lg"
        >
          Comenzar Simulación de Entrevista
        </Button>
      </CardContent>
    </Card>
  )
}
