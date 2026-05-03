'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Play, Lock, CheckCircle2, Brain, Target, Video, Lightbulb, Loader2 } from 'lucide-react'
import { InteractiveTrainingSession } from '@/components/interactive-training-session'
import { AIAssistant } from '@/components/conozcamonos/ai-assistant'
import { ConversationalInterviewSimulator } from '@/components/conversational-interview-simulator'
import { SofiaInterviewer } from '@/components/sofia-interviewer'
import { SofiaWelcome } from '@/components/sofia-welcome'

const TRAINING_MODULES = [
  {
    id: 1,
    name: 'Dominio del Método STAR',
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
    name: 'Preguntas de Comportamiento',
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
    requiresCompletion: 'Dominio del Método STAR'
  },
  {
    id: 3,
    name: 'Comunicación Técnica',
    description: 'Explica conceptos técnicos a stakeholders no-técnicos de forma clara',
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
    requiresCompletion: 'Preguntas de Comportamiento'
  }
]

export default function GuidedTrainingPage() {
  const router = useRouter()
  const [selectedModule, setSelectedModule] = useState<any>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeModule, setWelcomeModule] = useState<any>(null)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showVideoSession, setShowVideoSession] = useState(false)
  const [aiTip, setAiTip] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [isCompletingModule, setIsCompletingModule] = useState(false)
  const [userResponses, setUserResponses] = useState<{ [lessonIndex: number]: string }>({})
  const [userXP, setUserXP] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [trainingStartTime, setTrainingStartTime] = useState<number | null>(null)
  const [elapsedMinutes, setElapsedMinutes] = useState(0)

  // Timer effect to track training duration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (selectedModule && trainingStartTime) {
      // Update immediately on mount
      const now = Date.now()
      const minutes = Math.floor((now - trainingStartTime) / 60000)
      setElapsedMinutes(Math.max(minutes, 1)) // Minimum 1 minute from start

      interval = setInterval(() => {
        const now = Date.now()
        const minutes = Math.floor((now - trainingStartTime) / 60000)
        setElapsedMinutes(Math.max(minutes, 1)) // Update every second, minimum 1 minute
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [selectedModule, trainingStartTime])

  const handleStartModule = (module: any) => {
    if (module.status !== 'locked') {
      setWelcomeModule(module)
      setShowWelcome(true)
      console.log('[v0] Showing welcome screen for module:', module.name)
    }
  }

  const handleCompleteLesson = async () => {
    const lesson = selectedModule.lessons[currentLesson]
    const response = userResponses[currentLesson]

    // Validate that user has provided a response
    if (!response || response.trim().length < 10) {
      alert('Por favor, proporciona una respuesta con al menos 10 caracteres antes de continuar.')
      return
    }

    console.log('[v0] Completing lesson:', lesson.title, 'Response length:', response.length)

    // Award XP for completing the lesson
    const xpEarned = 100
    setUserXP(prev => prev + xpEarned)
    
    // Mark lesson as completed
    if (!completedLessons.includes(currentLesson)) {
      setCompletedLessons(prev => {
        const updated = [...prev, currentLesson]
        console.log('[v0] Lessons completed:', updated.length, 'of', selectedModule.lessons.length)
        return updated
      })
    }

    // Move to next lesson
    setCurrentLesson(currentLesson + 1)
  }

  const handleContinueFromWelcome = () => {
    if (welcomeModule) {
      // Navigate to first lesson with Sofia
      router.push(`/despega/a3/entrenamiento-guiado/${welcomeModule.id}/1`)
      setShowWelcome(false)
    }
  }

  // Show welcome screen
  if (showWelcome && welcomeModule) {
    return (
      <SofiaWelcome 
        moduleId={welcomeModule.id}
        moduleName={welcomeModule.name}
        moduleLessonCount={welcomeModule.lessons.length}
        onContinue={handleContinueFromWelcome}
      />
    )
  }

  const handleLessonResponseChange = (text: string) => {
    setUserResponses(prev => ({
      ...prev,
      [currentLesson]: text
    }))
  }

  const handleCompleteModule = async () => {
    if (!selectedModule) return

    // Check if all lessons have responses (more reliable than tracking completed lessons)
    const allLessonsAnswered = selectedModule.lessons.every((_, idx) => {
      const response = userResponses[idx]
      return response && response.trim().length >= 10
    })

    if (!allLessonsAnswered) {
      const unansweredCount = selectedModule.lessons.filter((_, idx) => {
        const response = userResponses[idx]
        return !response || response.trim().length < 10
      }).length
      alert(`Por favor, completa todos los ${selectedModule.lessons.length} temas antes de terminar el módulo. (${unansweredCount} sin completar)`)
      return
    }

    setIsCompletingModule(true)
    try {
      console.log('[v0] Completing module:', selectedModule.name, 'Total responses:', Object.keys(userResponses).length)
      console.log('[v0] Elapsed time:', elapsedMinutes, 'minutes, Start time was:', trainingStartTime ? new Date(trainingStartTime).toISOString() : 'not set')
      
      // Award bonus XP for module completion
      const bonusXP = 250
      setUserXP(prev => prev + bonusXP)
      
      // Calculate actual elapsed time, with minimum of 2 minutes
      const actualElapsedMinutes = Math.max(elapsedMinutes, 2)
      
      // Save training completion to database with actual elapsed time
      const trainingSaveResponse = await fetch('/api/a3/training-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          training_id: selectedModule.id,
          module_name: selectedModule.name,
          tiempo_dedicado_minutos: actualElapsedMinutes, // Use actual elapsed time, minimum 2 minutes
          competencias_desarrolladas: [selectedModule.name],
        }),
      })

      if (!trainingSaveResponse.ok) {
        console.error('[v0] Error saving training to database:', trainingSaveResponse.status, trainingSaveResponse.statusText)
      } else {
        const responseData = await trainingSaveResponse.json()
        console.log('[v0] Training completion saved successfully:', responseData)
      }
      
      await new Promise(resolve => setTimeout(resolve, 800))

      // Save progress to database would go here
      const moduleName = selectedModule.name
      setSelectedModule(null)
      setCurrentLesson(0)
      setUserResponses({})
      setCompletedLessons([])
      
      console.log('[v0] Module completed successfully:', moduleName, 'Total XP:', userXP + bonusXP)
      alert(`¡Congratulations! You've completed the "${moduleName}" module. Great job! You earned ${bonusXP} bonus XP.`)
    } catch (error) {
      console.error('[v0] Error completing module:', error)
      alert('Error al completar el módulo. Intenta de nuevo.')
    } finally {
      setIsCompletingModule(false)
    }
  }

  const generateAiTip = async (lessonTitle: string, lessonDescription: string) => {
    setAiLoading(true)
    try {
      // Simulate AI tip generation with a delay
      console.log('[v0] Generating AI tip for lesson:', lessonTitle)
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Create a contextual tip based on the lesson
      let tip = ''
      if (lessonTitle.includes('STAR')) {
        tip = 'STAR es el framework que los entrevistadores esperan. Asegúrate de que cada parte de tu historia tenga contexto, acciones claras y resultados medibles.'
      } else if (lessonTitle.includes('Situación')) {
        tip = 'La situación debe ser específica: ¿Qué empresa? ¿Cuál era tu rol? ¿Cuál era el desafío? Esto credibiliza tu historia desde el inicio.'
      } else if (lessonTitle.includes('Acción')) {
        tip = 'La acción es donde brillas. Usa "yo", "decidí", "implementé" - verbos de acción clara. Demuestra que TÚ fuiste el protagonista.'
      } else if (lessonTitle.includes('Resultado')) {
        tip = 'Cierra con impacto medible. Números, porcentajes, tiempo ahorrado. Eso es lo que recuerdan los entrevistadores.'
      } else if (lessonTitle.includes('Comportamiento')) {
        tip = 'Las preguntas de comportamiento buscan ver cómo actúas bajo presión. Responde con madurez, muestra aprendizaje y responsabilidad.'
      } else {
        tip = 'Practica esta lección varias veces. La repetición y confianza son clave para el éxito en entrevistas.'
      }
      
      setAiTip(tip)
      console.log('[v0] AI tip generated successfully')
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
      <div className="min-h-screen bg-background pt-4">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
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
              <Icon className="w-8 h-8" style={{ color: 'rgba(170, 70, 170, 0.7)' }} />
              <h1 className="text-3xl font-bold text-muted/90 dark:text-white">
                {selectedModule.name}
              </h1>
            </div>
            <Progress value={selectedModule.progress} className="h-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }} />
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              Lección {currentLesson + 1} de {selectedModule.lessons.length}
            </p>
          </div>

          {/* Lesson Content */}
          <Card className="p-8 space-y-6">
            <div>
              {(() => {
                const lesson = selectedModule.lessons[currentLesson]
                return (
                  <>
                    <h2 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">
                      {lesson.title}
                    </h2>
                    <p className="text-white/85">{lesson.description}</p>
                  </>
                )
              })()}
            </div>

            {/* Coach Content Area */}
            <div className="bg-background">
              <div className="space-y-4 text-white/85">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-muted/90 dark:text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" style={{ color: 'rgba(170, 70, 170, 0.7)' }} />
                    Tu Coach IA explica:
                  </p>
                  <Button
                    onClick={() => {
                      const lesson = selectedModule.lessons[currentLesson]
                      generateAiTip(lesson.title, lesson.description)
                    }}
                    disabled={aiLoading}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    style={{ backgroundColor: 'rgba(80, 160, 170, 0.4)', borderRadius: '20px' }}
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4" style={{ color: 'rgba(170, 70, 170, 0.7)' }} />
                        Consejo IA
                      </>
                    )}
                  </Button>
                </div>

                {aiTip ? (
                  <div className="bg-white dark:bg-background p-4 border-l-4 space-y-3" style={{ borderColor: 'rgba(170, 70, 170, 0.7)', borderRadius: '0px' }}>
                    <p className="text-muted/90 dark:text-white">{aiTip}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* STAR Method Module Content */}
                    {selectedModule.id === 1 && currentLesson === 0 && (
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

                    {selectedModule.id === 1 && currentLesson === 1 && (
                      <div className="space-y-3">
                        <p>
                          La Situación y Tarea son el contexto que da credibilidad a tu historia.
                        </p>
                        <div className="bg-white dark:bg-background p-4 rounded border-l-4 space-y-3" style={{ borderColor: 'rgba(170, 70, 170, 0.7)' }}>
                          <p className="font-semibold mb-2">Ejemplo BUENO:</p>
                          <p className="text-sm">
                            "En mi anterior empresa, como Tech Lead de un equipo de 5 developers, nos asignaron migrar una base de datos legacy a PostgreSQL bajo presión..."
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                          Sé específico: ¿Qué empresa? ¿Cuál era tu rol? ¿Cuál era el desafío? ¿Bajo qué presión estabas?
                        </p>
                      </div>
                    )}

                    {selectedModule.id === 1 && currentLesson === 2 && (
                      <div className="space-y-3">
                        <p>
                          La Acción es donde demuestras TU impacto personal. No lo que el equipo hizo, sino específicamente qué HICISTE TÚ.
                        </p>
                        <div className="bg-white dark:bg-background p-4 rounded border-l-4 space-y-3" style={{ borderColor: 'rgba(170, 70, 170, 0.7)' }}>
                          <p className="font-semibold mb-2">Ejemplo BUENO:</p>
                          <p className="text-sm">
                            "YO rediseñé la arquitectura, implementé testing automático, y mentoricé a 3 developers junior"
                          </p>
                        </div>
                        <div className="bg-white dark:bg-background p-4 rounded border-l-4 border-red-500">
                          <p className="font-semibold mb-2" style={{ color: '#ef4444' }}>Ejemplo MALO:</p>
                          <p className="text-sm">
                            "El equipo trabajó duro y mejoramos el sistema"
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground italic">
                          Usa "yo", "decidí", "implementé", "resolví" - verbos de acción clara.
                        </p>
                      </div>
                    )}

                    {selectedModule.id === 1 && currentLesson === 3 && (
                      <div className="space-y-3">
                        <p>
                          El Resultado es el cierre que lo hace memorable. Cuantifica siempre que puedas.
                        </p>
                        <div className="bg-white dark:bg-background p-4 rounded border-l-4 space-y-3" style={{ borderColor: 'rgba(170, 70, 170, 0.7)' }}>
                          <p className="font-semibold mb-2">Ejemplo BUENO:</p>
                          <p className="text-sm">
                            "La migración se completó 2 semanas antes, con zero downtime. Redujimos queries en un 40% y el equipo ganó confianza en nuevas tecnologías."
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                          Números, porcentajes, tiempo ahorrado, mejoras medibles - eso es lo que recuerdan los entrevistadores.
                        </p>
                      </div>
                    )}

                    {/* Behavioral Questions Module */}
                    {selectedModule.id === 2 && (
                      <div className="space-y-3">
                        <p>
                          Las preguntas de comportamiento buscan entender cómo REALMENTE actúas bajo presión.
                        </p>
                        <div className="space-y-2 text-sm">
                          <p><strong>Tipos comunes:</strong></p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Conflictos: "Cuéntame de un desacuerdo con un colega"</li>
                            <li>Fracasos: "Cuéntame de algo que no salió bien"</li>
                            <li>Decisiones: "Cuéntame de una decisión difícil que tomaste"</li>
                          </ul>
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground italic">
                          Usa STAR para todas. El entrevistador quiere ver madurez, aprendizaje y responsabilidad.
                        </p>
                      </div>
                    )}

                    {/* Technical Communication Module */}
                    {selectedModule.id === 3 && (
                      <div className="space-y-3">
                        <p>
                          Poder explicar conceptos técnicos complejos a personas no-técnicas es un superpoder.
                        </p>
                        <div className="bg-white dark:bg-background p-4 rounded border-l-4 space-y-3" style={{ borderColor: 'rgba(170, 70, 170, 0.7)' }}>
                          <p className="font-semibold mb-2">Ejemplo:</p>
                          <p className="text-sm">
                            En lugar de "Implementé microservicios con Docker y Kubernetes"...
                          </p>
                          <p className="text-sm mt-2">
                            Intenta: "Dividimos el sistema en servicios independientes que pueden crecer y actualizarse por separado, como restaurantes en un mall"
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                          Usa analogías, evita jerga, explica el "por qué" y el impacto en negocio.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Your Response Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">Tu Respuesta:</h3>
                <span className="text-sm text-muted-foreground">
                  {(userResponses[currentLesson] || '').length} caracteres
                </span>
              </div>
              <textarea
                value={userResponses[currentLesson] || ''}
                onChange={(e) => handleLessonResponseChange(e.target.value)}
                placeholder="Escribe tu respuesta aquí. Mínimo 10 caracteres para continuar..."
                className="w-full bg-slate-900/50 border border-muted/30 text-white placeholder-muted-foreground p-4 rounded-lg focus:outline-none focus:border-purple/50 min-h-[120px] leading-relaxed"
              />
              <p className="text-xs text-muted-foreground">
                Responder todas las lecciones es obligatorio para completar el módulo y ganar XP.
              </p>
            </div>

            {/* Practice Section */}
            {!showVideoSession ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                {/* Sofia Preview */}
                <div>
                  <div className="rounded-xl overflow-hidden border-2 border-training/40">
                    <SofiaInterviewer 
                      state="greeting" 
                      autoPlay={true}
                      loop={true}
                    />
                  </div>
                  <p className="text-center mt-4 text-white/70 font-semibold">Sofia, tu coach de práctica IA</p>
                </div>

                {/* Call to Action */}
                <Card className="border-training/40 bg-training/5 dark:bg-training/20">
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="font-bold text-white text-lg">Practica conmigo</h3>
                    <p className="text-white/85">
                      {currentLesson === 0 && 'Piensa en un proyecto importante que lideraste. Déjame guiarte a través de STAR.'}
                      {currentLesson === 2 && 'Ahora, construyamos la sección "Acción" de tu historia. ¿Qué fue lo específico que HICISTE tú?'}
                    </p>
                    
                    <div className="space-y-3">
                      <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-training" />
                          <span>Feedback inmediato en tu respuesta</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-training" />
                          <span>Follow-ups como en entrevista real</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-training" />
                          <span>Recomendaciones de mejora al final</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button
                      onClick={() => setShowVideoSession(true)}
                      className="w-full text-white bg-training hover:bg-training/90 h-12"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Practicar con Sofia
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="fixed inset-0 bg-black z-50 flex flex-col" style={{ top: '0', left: '0', right: '0', bottom: '0' }}>
                <div className="flex-shrink-0 border-b border-muted/80 bg-background">
                  <Button
                    onClick={() => setShowVideoSession(false)}
                    variant="outline"
                    style={{ color: 'rgba(80, 160, 170, 0.8)' }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a la Lección
                  </Button>
                </div>
                
                <div className="flex-1 overflow-hidden p-4">
                  <ConversationalInterviewSimulator
                    level="basico"
                    onComplete={() => setShowVideoSession(false)}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 justify-between pt-4 border-t border-muted/20 dark:border-card">
              <Button
                onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                disabled={currentLesson === 0}
                variant="outline"
                style={{ backgroundColor: 'rgba(80, 160, 170, 0.4)', borderRadius: '20px' }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <div className="flex gap-2 items-center">
                {/* Time Spent Display */}
                <div className="px-4 py-2 rounded-full bg-slate-900/60 border border-teal/30">
                  <p className="text-sm font-bold text-white">
                    <span style={{ color: 'rgba(80, 160, 170, 0.8)' }}>⏱ {elapsedMinutes}</span> min
                  </p>
                </div>

                {/* XP Display */}
                <div className="px-4 py-2 rounded-full bg-slate-900/60 border border-purple/30">
                  <p className="text-sm font-bold text-white">
                    <span style={{ color: 'rgba(170, 70, 170, 0.8)' }}>⭐ {userXP}</span> XP
                  </p>
                </div>

                {currentLesson < selectedModule.lessons.length - 1 ? (
                  <Button
                    onClick={handleCompleteLesson}
                    className="text-white"
                    style={{ backgroundColor: 'rgba(170, 70, 170, 0.8)', borderRadius: '20px' }}
                  >
                    Siguiente
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleCompleteModule}
                    disabled={isCompletingModule}
                    className="text-white" 
                    style={{ backgroundColor: 'rgba(80, 160, 170, 0.6)', borderRadius: '20px' }}>
                    {isCompletingModule ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Completar Módulo
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
