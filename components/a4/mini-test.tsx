"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Award } from "lucide-react"

interface MiniTestProps {
  question: string
  options: string[]
  context: string
  points: number
  difficulty: "fácil" | "medio" | "difícil"
  isLoading?: boolean
  onAnswerSelect?: (optionIndex: number) => void
}

export function MiniTest({ 
  question = "¿Cuál es el principal efecto de una suba de desempleo en el mercado laboral?",
  options = [
    "Aumentan los salarios de entrada",
    "Disminuye la competencia por puestos",
    "Se endurrecen los requisitos de selección",
    "Las empresas contratan más gerentes"
  ],
  context = "Noticia: 'Desempleo sube a 8.2%, principalmente en roles junior'",
  points = 50,
  difficulty = "medio",
  isLoading = false,
  onAnswerSelect
}: MiniTestProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "fácil":
        return "bg-green-500/10 text-green-700"
      case "medio":
        return "bg-amber-500/10 text-amber-700"
      case "difícil":
        return "bg-red-500/10 text-red-700"
    }
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-500" />
            <CardTitle className="text-xl">Mini Prueba: Entrenamiento Cognitivo</CardTitle>
          </div>
          <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
            <Zap className="w-3 h-3 mr-1" />
            +{points} pts
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Aplica tu comprensión a situaciones reales
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Context */}
            <div className="mb-6 p-3 rounded-[28px] bg-slate-500/5 border border-slate-500/10">
              <p className="text-xs text-muted-foreground">Contexto:</p>
              <p className="text-sm font-medium text-foreground">{context}</p>
            </div>

            {/* Question */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-semibold leading-relaxed pr-4">
                  {question}
                </h4>
                <Badge className={getDifficultyColor(difficulty)} variant="outline">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-6">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => onAnswerSelect?.(idx)}
                  className="w-full p-3 text-left text-sm rounded-[28px] border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors group text-foreground hover:text-primary font-medium"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border-2 border-border group-hover:border-primary flex items-center justify-center bg-background/50 group-hover:bg-primary/10">
                      <span className="text-xs">{String.fromCharCode(65 + idx)}</span>
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={() => {
                  // Submit logic
                }}
              >
                <Award className="w-4 h-4 mr-2" />
                Responder
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
              >
                Saltar
              </Button>
            </div>

            {/* Hint */}
            <p className="text-xs text-muted-foreground mt-4 text-center">
              💡 Piensa en cómo cambios en oferta/demanda afectan negociación salarial
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
