'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Zap, Trophy, BookOpen, Lightbulb } from 'lucide-react'

/**
 * Learning Flow Onboarding
 * Guides new users through all 4 BetterMe flows in a cohesive journey
 */
export default function LearningFlowOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false])

  const steps = [
    {
      title: 'Evalúate',
      description: 'Descubre tu nivel actual de conocimiento',
      icon: Zap,
      action: 'Iniciar Evaluación',
      path: '/personalized-learning',
      color: 'from-blue/50 to-blue',
    },
    {
      title: 'Aprende',
      description: '120+ libros profesionales seleccionados para ti',
      icon: BookOpen,
      action: 'Explorar Biblioteca',
      path: '/biblioteca',
      color: 'from-purple/50 to-pink-500',
    },
    {
      title: 'Gana Puntos',
      description: 'Obtén badges, streaks y sube en el ranking',
      icon: Trophy,
      action: 'Ver Ranking',
      path: '/leaderboard',
      color: 'from-yellow/50 to-orange/50',
    },
    {
      title: 'Progresa',
      description: 'Visualiza tu crecimiento y logros',
      icon: Lightbulb,
      action: 'Ver Dashboard',
      path: '/dashboard',
      color: 'from-green/50 to-green',
    },
  ]

  const handleStepComplete = (index: number) => {
    const newCompleted = [...completed]
    newCompleted[index] = true
    setCompleted(newCompleted)
    
    setTimeout(() => {
      if (index < steps.length - 1) {
        setCurrentStep(index + 1)
      }
    }, 500)
  }

  const allCompleted = completed.every(c => c)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-muted rounded-full">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">Tu Ruta de Aprendizaje Personalizada</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Bienvenido a Despega Tu Carrera</h1>
          <p className="text-lg text-muted-foreground">
            Una experiencia de aprendizaje gamificada, personalizada y basada en IA
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex gap-2 mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-all ${
                  completed[index] ? 'bg-green/50' : index === currentStep ? 'bg-blue/50' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = index === currentStep
            const isCompleted = completed[index]

            return (
              <Card
                key={index}
                className={`transition-all ${
                  isActive ? 'ring-2 ring-blue-500' : ''
                } ${isCompleted ? 'opacity-75' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? 'bg-green/50' : isActive ? 'bg-blue/50' : 'bg-muted'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      ) : (
                        <StepIcon className="h-6 w-6 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        {isCompleted && <CheckCircle2 className="h-4 w-4 text-green" />}
                      </div>
                      <p className="text-muted-foreground mb-4">{step.description}</p>

                      {isActive && (
                        <Button
                          onClick={() => {
                            handleStepComplete(index)
                            router.push(step.path)
                          }}
                          className="w-full sm:w-auto"
                        >
                          {step.action}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}

                      {!isActive && isCompleted && (
                        <p className="text-sm text-green font-medium">✓ Completado</p>
                      )}

                      {!isActive && !isCompleted && (
                        <Button
                          onClick={() => setCurrentStep(index)}
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          Ir a este paso
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Completion Message */}
        {allCompleted && (
          <Card className="mt-8 border-green/20 bg-green/5 dark:bg-green-950">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    ¡Ruta de aprendizaje completada!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-200">
                    Ahora tienes acceso a tu experiencia personalizada completa. Continúa en tu dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Overview */}
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">¿Qué obtienes?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green" />
                  Evaluación personalizada de tu nivel
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green" />
                  Recomendaciones inteligentes de libros
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green" />
                  Sistema de gamificación completo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green" />
                  Seguimiento visual de progreso
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sistema de Recompensas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Gana puntos por cada libro completado
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue/50" />
                  Mantén rachas de lecturas diarias
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green" />
                  Desbloquea badges por logros
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple/50" />
                  Compite en el ranking global
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
