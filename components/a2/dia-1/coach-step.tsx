'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface Dia1CoachStepProps {
  visionAnswers: {
    role: string
    environment: string
    result: string
  }
  coachVersion: string
  onUpdate: (version: string) => void
  onNext: () => void
  onPrevious: () => void
}

// Mock coach enhancement
const enhanceVision = async (answers: any): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return `Quiero avanzar hacia un rol de ${answers.role} en una empresa o entorno donde prevalezca ${answers.environment}. Mi objetivo principal es lograr ${answers.result}. Estoy comprometido con desarrollar las competencias necesarias y construir una estrategia clara para alcanzar esta visión en los próximos 30 días.`
}

export default function Dia1CoachStep({
  visionAnswers,
  coachVersion,
  onUpdate,
  onNext,
  onPrevious,
}: Dia1CoachStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [enhanced, setEnhanced] = useState(coachVersion)
  const [editMode, setEditMode] = useState(false)

  const handleEnhance = async () => {
    setIsLoading(true)
    const result = await enhanceVision(visionAnswers)
    setEnhanced(result)
    onUpdate(result)
    setIsLoading(false)
  }

  const handleAccept = () => {
    onUpdate(enhanced)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Paso 2: Mejora tu visión con el coach</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Ahora el coach revisará tus respuestas y las convertirá en una visión profesional más clara y realista.
        </p>
        <div className="text-xs font-medium text-muted-foreground">⏱️ Tiempo estimado: 10–15 min</div>
      </div>

      {/* Original Answers Summary */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <h3 className="font-semibold text-sm mb-3 text-foreground">Tus respuestas iniciales</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Rol:</span>
            <p className="text-foreground mt-1">{visionAnswers.role}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Entorno:</span>
            <p className="text-foreground mt-1">{visionAnswers.environment}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Resultado:</span>
            <p className="text-foreground mt-1">{visionAnswers.result}</p>
          </div>
        </div>
      </div>

      {/* Coach Enhancement Section */}
      <div className="space-y-3">
        {!enhanced && (
          <Button
            onClick={handleEnhance}
            disabled={isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? 'El coach está mejorando tu visión...' : 'Mejorar con el coach'}
          </Button>
        )}

        {enhanced && (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Versión mejorada</h3>
              {editMode ? (
                <textarea
                  value={enhanced}
                  onChange={(e) => setEnhanced(e.target.value)}
                  className="w-full h-32 p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-sm text-foreground leading-relaxed">{enhanced}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditMode(!editMode)}
                  className="flex-1"
                >
                  {editMode ? 'Listo' : 'Editar manualmente'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEnhance}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Otra versión
                </Button>
              </div>
              <Button
                onClick={handleAccept}
                size="lg"
                className="w-full"
              >
                Aceptar versión
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          Anterior
        </Button>
      </div>
    </div>
  )
}
