'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Play, Lock, CheckCircle2, Brain, Target, Video, Lightbulb, Loader2 } from 'lucide-react'
import { InteractiveTrainingSession } from '@/components/interactive-training-session'
import { AIAssistant } from '@/components/conozcamonos/ai-assistant'

const TRAINING_MODULES = [
  {
    id: 1,
    name: 'STAR Method Mastery',
    description: 'Aprende y domina la metodología STAR (Situación, Tarea, Acción, Resultado)',
    duration: '45 min',
    lessons: [
      {
        title: 'Intro a STAR',
        description: 'Por qué STAR es efectivo en entrevistas',
        completed: true
      },
      {
        title: 'Situación y Tarea',
        description: 'Cómo plantear el contexto correctamente',
        completed: true
      },
      {
        title: 'Acción y Resultado',
        description: 'Dónde está el impacto real',
        completed: false
      },
      {
        title: 'Práctica: Tu Primer STAR',
        description: 'Construyamos juntos tu historia STAR',
        completed: false
      }
    ],
    progress: 50,
    difficulty: 'Básico',
    icon: Target,
    status: 'in-progress'
  },
  {
    id: 2,
    name: 'Behavioral Questions Deep Dive',
    description: 'Estrategias para responder preguntas de comportamiento complejo',
    duration: '60 min',
    lessons: [
      { title: 'Tipos de preguntas', description: 'Categorización y patrones', completed: false },
      { title: 'Conflictos y desacuerdos', description: 'Cómo hablar de conflictos', completed: false },
      { title: 'Fracasos y lecciones', description: 'Transformar fracasos en aprendizajes', completed: false },
      { title: 'Toma de decisiones', description: 'Demostrar pensamiento crítico', completed: false }
    ],
    progress: 0,
    difficulty: 'Intermedio',
    icon: Brain,
    status: 'locked',
    requiresCompletion: 'STAR Method Mastery'
  },
  {
    id: 3,
    name: 'Technical Communication',
    description: 'Explica conceptos técnicos a non-technical stakeholders',
    duration: '50 min',
    lessons: [
      { title: 'Simplificación', description: 'Explicar lo complejo de forma simple', completed: false },
      { title: 'Storytelling técnico', description: 'Narrativas que enganchan', completed: false },
      { title: 'Manejo de preguntas', description: 'Respuestas cuando no sabes', completed: false }
    ],
    progress: 0,
    difficulty: 'Avanzado',
    icon: BookOpen,
    status: 'locked',
    requiresCompletion: 'Behavioral Questions Deep Dive'
  }
]

export default function GuidedTrainingPage() {
  const [selectedModule, setSelectedModule] = useState<any>(null)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showVideoSession, setShowVideoSession] = useState(false)
  const [aiTip, setAiTip] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const handleStartModule = (module: any) => {
    if (module.status !== 'locked') {
      setSelectedModule(module)
      setCurrentLesson(0)
      setAiTip(null) // Reset tips when changing modules
    }
  }

  const generateAiTip = async (lessonTitle: string, lessonDescription: string) => {
    setAiLoading(true)
    try {
      const response = await fetch('/api/conozcamonos/ai-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Explícame sobre: ${lessonTitle}. Contexto: ${lessonDescription}`,
          currentResponse: ''
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate tip')
      }

      const data = await response.json()
      setAiTip(data.suggestion)
      console.log('[v0] AI tip generated for lesson:', lessonTitle)
    } catch (error) {
      console.error('[v0] Error generating AI tip:', error)
      setAiTip('No se pudo generar la sugerencia en este momento. Intenta de nuevo.')
    } finally {
      setAiLoading(false)
    }
  }

  if (selectedModule) {
    const lesson = selectedModule.lessons[currentLesson]
    const Icon = selectedModule.icon

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <Button
            variant="outline"
            onClick={() => setSelectedModule(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Módulos
          </Button>

          {/* Module Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {selectedModule.name}
              </h1>
            </div>
            <Progress value={selectedModule.progress} className="h-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Lección {currentLesson + 1} de {selectedModule.lessons.length}
            </p>
          </div>

          {/* Lesson Content */}
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {lesson.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">{lesson.description}</p>
            </div>

            {/* Coach Content Area */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-8 min-h-64 space-y-4">
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Tu Coach IA explica:
                  </p>
                  <Button
                    onClick={() => generateAiTip(lesson.title, lesson.description)}
                    disabled={aiLoading}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4" />
                        Consejo IA
                      </>
                    )}
                  </Button>
                </div>

                {aiTip ? (
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border-l-4 border-blue-600 space-y-3">
                    <p className="text-slate-900 dark:text-white">{aiTip}</p>
                  </div>
                ) : (
                  <>
                    {selectedModule.id === 1 && currentLesson === 2 && (
                      <div className="space-y-3">
                        <p>
                          La Acción es donde demuestras TU impacto personal. No lo que el equipo hizo, sino específicamente qué HICISTE TÚ.
                        </p>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border-l-4 border-blue-600">
                          <p className="font-semibold mb-2">Ejemplo BUENO:</p>
                          <p className="text-sm">
                            "YO rediseñé la arquitectura, implementé testing automático, y mentoricé a 3 developers junior"
                          </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border-l-4 border-red-600">
                          <p className="font-semibold mb-2 text-red-600">Ejemplo MALO:</p>
                          <p className="text-sm">
                            "El equipo trabajó duro y mejoramos el sistema"
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                          Usa "yo", "decidí", "implementé", "resolví" - verbos de acción clara.
                        </p>
                      </div>
                    )}

                    {currentLesson === 0 && (
                      <div className="space-y-3">
                        <p>
                          STAR es una estructura que tu entrevistador reconoce y aprecia porque:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                          <li><strong>Situación:</strong> El contexto que valida por qué actuaste</li>
                          <li><strong>Tarea:</strong> Tu responsabilidad específica</li>
                          <li><strong>Acción:</strong> LO QUE HICISTE (aquí es tu turno)</li>
                          <li><strong>Resultado:</strong> El impacto medible que dejó</li>
                        </ul>
                      </div>
                    )}

                    {!aiTip && selectedModule.id !== 1 && currentLesson !== 0 && (
                      <div className="text-slate-500 italic">
                        Haz clic en "Consejo IA" para obtener una sugerencia personalizada sobre este tema.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Practice Section */}
            {!showVideoSession ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 space-y-4">
                <p className="font-bold text-amber-900 dark:text-amber-200">
                  Practica conmigo:
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  {currentLesson === 0 && 'Piensa en un proyecto importante que lideraste. Déjame guiarte a través de STAR.'}
                  {currentLesson === 2 && 'Ahora, construyamos la sección "Acción" de tu historia. ¿Qué fue lo específico que HICISTE tú?'}
                </p>
                
                <Button
                  onClick={() => setShowVideoSession(true)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Practicar con Video
                </Button>
              </div>
            ) : (
              <div className="fixed inset-0 bg-black z-50 flex flex-col h-screen">
                <div className="flex-shrink-0 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-4">
                  <Button
                    onClick={() => setShowVideoSession(false)}
                    variant="outline"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a la Lección
                  </Button>
                </div>
                
                <div className="flex-1 overflow-hidden p-4">
                  <InteractiveTrainingSession
                    question={currentLesson === 0 
                      ? "Cuéntame sobre un proyecto importante que lideraste. Usa STAR: Situación, Tarea, Acción (qué específicamente HICISTE), Resultado."
                      : "Cuéntame la sección 'Acción' de tu historia. ¿Qué fue lo específico que TÚ hiciste? Sé detallado."}
                    guidance={currentLesson === 0 
                      ? "1. Empieza describiendo el contexto (Situación)\n2. Explica tu responsabilidad (Tarea)\n3. Detalla exactamente qué acciones tomaste (Acción - usa 'yo', 'decidí', 'implementé')\n4. Termina con el resultado medible que obtuviste\n\nRecuerda: Habla claro, mantén contacto visual con la cámara, y sé específico con números/impacto."
                      : "Enfócate en la parte Acción:\n1. Usa verbos de acción: implementé, diseñé, lideré, resolví\n2. Sé específico - no digas 'el equipo trabajó', sino 'yo investigué X, propuse Y, implementé Z'\n3. Cuantifica si es posible (líneas de código, % de mejora, tiempo ahorrado)\n4. Muestra liderazgo o iniciativa\n\nIntenta responder en 1-2 minutos."}
                    estimatedTime="2-3 minutos"
                    trainingType="guided"
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                disabled={currentLesson === 0}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <div className="flex gap-2">
                {currentLesson < selectedModule.lessons.length - 1 ? (
                  <Button
                    onClick={() => setCurrentLesson(currentLesson + 1)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Siguiente
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                ) : (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Completar Módulo
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <Link href="/despega/a3">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Entrenamiento Guiado
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Aprende junto a tu Coach IA. Módulos progresivos que te llevan de lo básico a dominar entrevistas complejas.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-6">
          {TRAINING_MODULES.map((module) => {
            const Icon = module.icon
            const isLocked = module.status === 'locked'

            return (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-400'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      <div>
                        <CardTitle className="text-xl">{module.name}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{module.difficulty}</Badge>
                      {module.status === 'in-progress' && (
                        <Badge className="bg-blue-600">En Progreso</Badge>
                      )}
                      {isLocked && <Lock className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>

                  <Progress value={module.progress} className="h-2 mb-2" />
                  <p className="text-xs text-slate-500">
                    {module.progress}% completo • {module.duration}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Lessons */}
                  <div className="space-y-2">
                    {module.lessons.map((lesson, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      >
                        {lesson.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-slate-300 rounded-full flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-slate-500">{lesson.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleStartModule(module)}
                    disabled={isLocked}
                    className={`w-full ${
                      isLocked
                        ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Requiere: {module.requiresCompletion}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {module.status === 'in-progress' ? 'Continuar' : 'Comenzar'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
