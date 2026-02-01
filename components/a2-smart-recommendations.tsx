'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, Zap, BookOpen, Users } from 'lucide-react'

interface RecommendationPath {
  id: string
  title: string
  description: string
  type: 'ruta' | 'simulacion' | 'modulo'
  duration: string
  difficulty: 'fundamental' | 'intermedio' | 'avanzado'
  relevantTo: string[] // A1 scores this addresses
  priority: number // 1-5, 5 being highest
  nextSteps: string[]
  estimatedCompletion: string
}

interface SmartRecommendationsProps {
  a1Results: any
  a3Completed?: string[]
  a4Modules?: string[]
}

export function SmartRecommendations({ 
  a1Results, 
  a3Completed = [], 
  a4Modules = [] 
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationPath[]>([])
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (!a1Results) return

    // Generate recommendations based on A1 scores
    const recs: RecommendationPath[] = []

    // Check Energía score
    if (a1Results.score_energia < 60) {
      recs.push({
        id: 'ruta-energia-power',
        title: 'Ruta: Power Morning Ritual',
        description: 'Establece un ritual matutino potente que energiza tu día completo',
        type: 'ruta',
        duration: '3 semanas',
        difficulty: 'fundamental',
        relevantTo: ['score_energia'],
        priority: 5,
        nextSteps: [
          'Completar A3: Escenario "Gestión de Energía"',
          'Leer módulo A4: "Neurociencia del Ritmo Circadiano"',
          'Ejecutar 7 días de ritual matutino'
        ],
        estimatedCompletion: '21 días'
      })
    }

    // Check Enfoque score
    if (a1Results.score_enfoque < 65) {
      recs.push({
        id: 'ruta-enfoque-deep',
        title: 'Ruta: Deep Work Mastery',
        description: 'Domina la capacidad de enfoque profundo con técnicas probadas',
        type: 'ruta',
        duration: '4 semanas',
        difficulty: 'intermedio',
        relevantTo: ['score_enfoque'],
        priority: 4,
        nextSteps: [
          'A3: Escenario "Reuniones Improductivas"',
          'A4: Módulo "Productividad Científica"',
          'Implementar bloques de 90 minutos'
        ],
        estimatedCompletion: '28 días'
      })
    }

    // Check Relaciones score
    if (a1Results.score_relaciones < 60) {
      recs.push({
        id: 'ruta-relaciones-influence',
        title: 'Ruta: Influential Leadership',
        description: 'Desarrolla relaciones que impulsan tu carrera profesional',
        type: 'ruta',
        duration: '6 semanas',
        difficulty: 'intermedio',
        relevantTo: ['score_relaciones'],
        priority: 4,
        nextSteps: [
          'A3: Escenario "Conflicto entre Colegas"',
          'A4: Módulo "Comunicación Efectiva"',
          'Contactar 3 mentores potenciales'
        ],
        estimatedCompletion: '42 días'
      })
    }

    // Check Plan Ejecutivo score
    if (a1Results.score_plan_ejecutivo < 65) {
      recs.push({
        id: 'ruta-exec-strategy',
        title: 'Ruta: Executive Planning',
        description: 'Sistema OKR para ejecutar estrategia con precisión',
        type: 'ruta',
        duration: '5 semanas',
        difficulty: 'avanzado',
        relevantTo: ['score_plan_ejecutivo'],
        priority: 5,
        nextSteps: [
          'Definir OKRs para próximo trimestre',
          'A3: Escenario "Alineación Estratégica"',
          'A4: Módulo "Ejecución Estratégica"'
        ],
        estimatedCompletion: '35 días'
      })
    }

    // Add A3 simulation recommendations
    if (!a3Completed.includes('escenario_enfoque_1')) {
      recs.push({
        id: 'a3-focus-simulation',
        title: 'A3 Simulación: Reunión Excesiva',
        description: 'Practica decisiones en contexto real de demasiadas reuniones',
        type: 'simulacion',
        duration: '30 min',
        difficulty: 'intermedio',
        relevantTo: ['score_enfoque'],
        priority: 3,
        nextSteps: [
          'Completar la simulación',
          'Revisar feedback del coach'
        ],
        estimatedCompletion: 'Hoy'
      })
    }

    // Add A4 module recommendations
    if (!a4Modules.includes('neurociencia-ritmo')) {
      recs.push({
        id: 'a4-neurosciencia',
        title: 'A4 Módulo: Neurociencia del Ritmo',
        description: 'Entiende por qué la energía fluctúa y cómo optimizarla',
        type: 'modulo',
        duration: '45 min',
        difficulty: 'fundamental',
        relevantTo: ['score_energia'],
        priority: 2,
        nextSteps: [
          'Leer caso de estudio',
          'Responder preguntas de reflexión'
        ],
        estimatedCompletion: '1 hora'
      })
    }

    // Sort by priority
    setRecommendations(recs.sort((a, b) => b.priority - a.priority))
  }, [a1Results, a3Completed, a4Modules])

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Completa A1 para recibir recomendaciones personalizadas</p>
        </CardContent>
      </Card>
    )
  }

  const typeIcons = {
    ruta: <Zap className="w-4 h-4" />,
    simulacion: <Users className="w-4 h-4" />,
    modulo: <BookOpen className="w-4 h-4" />
  }

  const typeLabels = {
    ruta: 'Ruta Temática',
    simulacion: 'Simulación',
    modulo: 'Módulo de Aprendizaje'
  }

  const difficultyColors = {
    fundamental: 'bg-green-100 text-green-800',
    intermedio: 'bg-yellow-100 text-yellow-800',
    avanzado: 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-4">
      {/* Recommendation Carousel */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tu Ruta de Desarrollo</h3>
          <div className="text-sm text-muted-foreground">
            {activeStep + 1} de {recommendations.length}
          </div>
        </div>

        {/* Main Recommendation Card */}
        {recommendations.length > 0 && (
          <Card className="mb-4 border-2 border-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {typeIcons[recommendations[activeStep].type]}
                    </div>
                    <Badge variant="outline">
                      {typeLabels[recommendations[activeStep].type]}
                    </Badge>
                    <Badge className={difficultyColors[recommendations[activeStep].difficulty]}>
                      {recommendations[activeStep].difficulty}
                    </Badge>
                  </div>
                  <h4 className="text-xl font-bold">{recommendations[activeStep].title}</h4>
                  <p className="text-muted-foreground mt-2">{recommendations[activeStep].description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-3xl font-bold text-primary">{recommendations[activeStep].priority}/5</div>
                  <p className="text-xs text-muted-foreground">prioridad</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Duración</p>
                  <p className="font-medium">{recommendations[activeStep].duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Se completa en</p>
                  <p className="font-medium">{recommendations[activeStep].estimatedCompletion}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Impacto</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                          i <= recommendations[activeStep].priority
                            ? 'bg-primary'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h5 className="font-semibold mb-2">Próximos Pasos:</h5>
                <ol className="space-y-2">
                  {recommendations[activeStep].nextSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <span className="font-semibold text-primary flex-shrink-0">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <Button className="w-full gap-2" size="lg">
                Comenzar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        {recommendations.length > 1 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
            >
              Anterior
            </Button>
            <div className="flex-1 flex gap-1">
              {recommendations.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    idx === activeStep ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-label={`Go to recommendation ${idx + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setActiveStep(Math.min(recommendations.length - 1, activeStep + 1))}
              disabled={activeStep === recommendations.length - 1}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      {/* All Recommendations List */}
      {recommendations.length > 1 && (
        <div className="mt-6 space-y-2">
          <h4 className="font-semibold">Todas las Recomendaciones</h4>
          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <Card
                key={rec.id}
                className={`cursor-pointer transition-all ${
                  idx === activeStep ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setActiveStep(idx)}
              >
                <CardContent className="py-3 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-1.5 bg-muted rounded">
                      {typeIcons[rec.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{rec.title}</p>
                      <p className="text-xs text-muted-foreground">{rec.duration} • {rec.estimatedCompletion}</p>
                    </div>
                  </div>
                  <Badge className={difficultyColors[rec.difficulty]}>
                    {rec.priority}/5
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
