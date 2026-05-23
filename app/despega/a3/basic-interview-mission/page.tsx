'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, ArrowLeft, CheckCircle2, Trophy, Clock, Star, Play, Mic, User, MessageSquare, Award, Sparkles } from 'lucide-react'

const MODULE_XP = 220

// Simulación de entrevista completa questions
const INTERVIEW_SECTIONS = [
  {
    id: 'opening',
    title: 'Apertura y Rapport',
    description: 'La entrevista comienza con preguntas de calentamiento',
    questions: [
      {
        id: 'intro',
        question: '¡Hola! Gracias por venir hoy. ¿Cómo estás?',
        tip: 'Sé cálido y profesional. Esto establece el tono de la entrevista.',
        type: 'warmup'
      },
      {
        id: 'tell-me',
        question: '¡Perfecto! Comencemos. ¿Puedes contarme un poco sobre ti?',
        tip: 'Usa tu introducción de 30 segundos del Espejo de Carrera. Enfócate en el resumen profesional.',
        type: 'standard',
        timeTarget: 60
      }
    ]
  },
  {
    id: 'background',
    title: 'Antecedentes y Experiencia',
    description: 'Preguntas sobre tu trayectoria profesional',
    questions: [
      {
        id: 'cv-walk',
        question: 'Cuéntame tu CV. ¿Cuál ha sido tu trayectoria profesional hasta ahora?',
        tip: 'Cronológico pero breve. Destaca transiciones relevantes y crecimiento.',
        type: 'standard',
        timeTarget: 90
      },
      {
        id: 'current-role',
        question: '¿Cuáles son tus principales responsabilidades en tu rol actual (o más reciente)?',
        tip: 'Enfócate en logros, no solo tareas. Usa tus historias del Laboratorio de Minería de Valor.',
        type: 'standard',
        timeTarget: 60
      }
    ]
  },
  {
    id: 'motivation',
    title: 'Motivación e Idoneidad',
    description: 'Entender por qué quieres esta oportunidad',
    questions: [
      {
        id: 'why-role',
        question: '¿Por qué te interesa este puesto?',
        tip: 'Conecta tus objetivos con el rol. Demuestra que investigaste. Sé genuino.',
        type: 'standard',
        timeTarget: 60
      },
      {
        id: 'why-leave',
        question: '¿Qué te motivó a buscar una nueva oportunidad?',
        tip: 'Mantén una actitud positiva. Enfócate en crecimiento y nuevos desafíos, no en problemas.',
        type: 'standard',
        timeTarget: 45
      }
    ]
  },
  {
    id: 'behavioral',
    title: 'Preguntas Conductuales',
    description: 'Historias que demuestran tus habilidades',
    questions: [
      {
        id: 'achievement',
        question: 'Cuéntame sobre un logro del que estés particularmente orgulloso.',
        tip: 'Usa estructura STAR/CAR. Incluye métricas específicas si es posible.',
        type: 'behavioral',
        timeTarget: 90
      },
      {
        id: 'challenge',
        question: 'Describe una situación desafiante en el trabajo y cómo la manejaste.',
        tip: 'Muestra resolución de problemas. Enfócate en TUS acciones y en el resultado.',
        type: 'behavioral',
        timeTarget: 90
      },
      {
        id: 'teamwork',
        question: 'Dame un ejemplo de cómo has trabajado efectivamente en un equipo.',
        tip: 'Equilibra mostrar tu contribución mientras respetas el equipo.',
        type: 'behavioral',
        timeTarget: 75
      }
    ]
  },
  {
    id: 'difficult',
    title: 'Pregunta Difícil',
    description: 'Una pregunta desafiante para probar tu preparación',
    questions: [
      {
        id: 'weakness',
        question: '¿Cuál dirías que es tu área de mayor mejora?',
        tip: 'Sé honesto pero estratégico. Muestra autoconocimiento y mejora activa.',
        type: 'difficult',
        timeTarget: 60
      }
    ]
  },
  {
    id: 'closing',
    title: 'Cierre',
    description: 'Tu oportunidad de hacer preguntas y dejar una última impresión',
    questions: [
      {
        id: 'your-questions',
        question: '¿Tienes alguna pregunta para mí sobre el puesto o la empresa?',
        tip: 'Siempre ten 2-3 preguntas reflexivas preparadas. Nunca digas "no tengo preguntas".',
        type: 'closing',
        timeTarget: 60
      }
    ]
  }
]

// Criterios de evaluación de desempeño
const EVALUATION_CRITERIA = [
  { id: 'clarity', name: 'Claridad de Respuesta', description: '¿Fueron tus respuestas claras y fáciles de seguir?' },
  { id: 'structure', name: 'Estructura', description: '¿Usaste marcos de trabajo (STAR/CAR) efectivamente?' },
  { id: 'relevance', name: 'Relevancia', description: '¿Conectaron tus respuestas con el puesto?' },
  { id: 'confidence', name: 'Confianza', description: '¿Proyectaste confianza sin arrogancia?' },
  { id: 'authenticity', name: 'Autenticidad', description: '¿Fueron tus respuestas genuinas y creíbles?' }
]

export default function BasicInterviewMissionModule() {
  const router = useRouter()
  const [missionComenzared, setMissionComenzared] = useState(false)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{[key: string]: string}>({})
  const [selfRatings, setSelfRatings] = useState<{[key: string]: number}>({})
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const currentSection = INTERVIEW_SECTIONS[currentSectionIndex]
  const currentQuestion = currentSection?.questions[currentQuestionIndex]
  const totalQuestions = INTERVIEW_SECTIONS.reduce((sum, s) => sum + s.questions.length, 0)
  const answeredQuestions = Object.keys(answers).length

  const progress = interviewComplete ? 100 : Math.round((answeredQuestions / totalQuestions) * 80)

  const handleSiguienteQuestion = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentSectionIndex < INTERVIEW_SECTIONS.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
      setCurrentQuestionIndex(0)
    } else {
      setInterviewComplete(true)
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/a3/save-module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          moduleId: 'basic-interview-mission', 
          status: 'completed',
          xpEarned: MODULE_XP
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=basic-interview-mission&final=true')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=basic-interview-mission&final=true')
    }
  }

  const calculateOverallScore = () => {
    const ratings = Object.values(selfRatings)
    if (ratings.length === 0) return 0
    return Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 20)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/despega/a3">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to A3
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-[rgba(170,70,170,0.3)] to-[rgba(80,160,170,0.3)] text-white border-0">
              Final Mission
            </Badge>
            <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border-[rgba(170,70,170,0.3)]">
              {MODULE_XP} XP
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(170,70,170,0.3)] to-[rgba(80,160,170,0.3)] flex items-center justify-center">
            <Trophy className="w-7 h-7 text-[rgb(200,130,200)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Misión de Entrevista Básica</h1>
            <p className="text-white/60">Complete full interview simulation • Final challenge</p>
          </div>
        </div>

        {/* Progreso */}
        <Card className="rounded-[2px] bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progreso de la Misión</span>
            <span className="text-[rgb(170,70,170)]">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[rgb(170,70,170)] to-[rgb(80,160,170)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>

        {/* Pre-Mission State */}
        {!missionComenzared && !interviewComplete && (
          <div className="space-y-6">
            {/* Mission Briefing */}
            <Card className="rounded-[2px] bg-gradient-to-br from-[rgba(170,70,170,0.15)] to-[rgba(80,160,170,0.15)] border-[rgba(170,70,170,0.3)] p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[rgba(170,70,170,0.2)] flex items-center justify-center">
                  <Star className="w-6 h-6 text-[rgb(200,130,200)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Mission Briefing</h3>
                  <p className="text-white/70 text-sm">
                    This is your final challenge in the Basic Level Ruta de Entrenamiento. You will complete a 
                    full simulated interview with a virtual recruiter. Use everything you&apos;ve learned 
                    in the previous 9 modules.
                  </p>
                </div>
              </div>
            </Card>

            {/* Interview Details */}
            <Card className="rounded-[2px] bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <User className="w-5 h-5 text-[rgb(80,160,170)] mx-auto mb-1" />
                  <p className="text-xs text-white/40">Interviewer</p>
                  <p className="text-sm font-medium">HR Recruiter</p>
                </div>
                <div>
                  <MessageSquare className="w-5 h-5 text-[rgb(80,160,170)] mx-auto mb-1" />
                  <p className="text-xs text-white/40">Questions</p>
                  <p className="text-sm font-medium">{totalQuestions} Total</p>
                </div>
                <div>
                  <Clock className="w-5 h-5 text-[rgb(80,160,170)] mx-auto mb-1" />
                  <p className="text-xs text-white/40">Duration</p>
                  <p className="text-sm font-medium">15-25 min</p>
                </div>
                <div>
                  <Award className="w-5 h-5 text-[rgb(80,160,170)] mx-auto mb-1" />
                  <p className="text-xs text-white/40">Reward</p>
                  <p className="text-sm font-medium">{MODULE_XP} XP</p>
                </div>
              </div>
            </Card>

            {/* Interview Structure Preview */}
            <Card className="rounded-[2px] bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-4">
              <h4 className="font-semibold mb-3">Interview Structure</h4>
              <div className="space-y-2">
                {INTERVIEW_SECTIONS.map((section, i) => (
                  <div key={section.id} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-[rgba(170,70,170,0.2)] flex items-center justify-center text-xs text-[rgb(200,130,200)]">
                      {i + 1}
                    </div>
                    <span className="text-white/80">{section.title}</span>
                    <span className="text-white/40 text-xs">({section.questions.length} questions)</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tips */}
            <Card className="rounded-[2px] bg-[rgba(80,160,170,0.1)] border-[rgba(80,160,170,0.3)] p-4">
              <h4 className="font-semibold text-[rgb(80,160,170)] mb-2">Tips for Success</h4>
              <ul className="space-y-1 text-sm text-white/70">
                <li>• Take your time to think before answering</li>
                <li>• Use the STAR/Marco CARs from Arquitectura de Respuestas</li>
                <li>• Draw from your Laboratorio de Minería de Valor achievements</li>
                <li>• Remember your safe answer strategies for difficult questions</li>
                <li>• Be authentic and professional throughout</li>
              </ul>
            </Card>

            <Button 
              onClick={() => setMissionComenzared(true)}
              className="rounded-[20px] w-full bg-gradient-to-r from-[rgb(170,70,170)] to-[rgb(80,160,170)] hover:opacity-90"
            >
              <Play className="w-4 h-4 mr-2" /> Comenzar Interview Simulation
            </Button>
          </div>
        )}

        {/* Active Interview */}
        {missionComenzared && !interviewComplete && currentQuestion && (
          <div className="space-y-6">
            {/* Section Header */}
            <Card className="rounded-[2px] bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[rgb(200,130,200)] uppercase">Section {currentSectionIndex + 1} of {INTERVIEW_SECTIONS.length}</p>
                  <h3 className="font-semibold">{currentSection.title}</h3>
                  <p className="text-sm text-white/60">{currentSection.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">Question</p>
                  <p className="text-lg font-semibold text-[rgb(170,70,170)]">
                    {currentQuestionIndex + 1}/{currentSection.questions.length}
                  </p>
                </div>
              </div>
            </Card>

            {/* Question Card */}
            <Card className="rounded-[2px] bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/20 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[rgba(80,160,170,0.2)] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-[rgb(80,160,170)]" />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Interviewer asks:</p>
                  <p className="text-lg text-white">&quot;{currentQuestion.question}&quot;</p>
                </div>
              </div>

              {currentQuestion.tip && (
                <div className="bg-[rgba(80,160,170,0.1)] p-3 rounded mb-4">
                  <p className="text-xs text-[rgb(80,160,170)]">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Tip: {currentQuestion.tip}
                  </p>
                </div>
              )}

              {currentQuestion.timeTarget && (
                <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
                  <Clock className="w-4 h-4" />
                  Target answer length: ~{currentQuestion.timeTarget} seconds
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[rgb(170,70,170)]" />
                  <label className="text-sm font-medium">Your Answer:</label>
                </div>
                <Textarea
                  placeholder="Type your answer as if speaking to the interviewer..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                  className="bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/20 min-h-[150px] text-white"
                />
                <p className="text-xs text-white/40">
                  {(answers[currentQuestion.id]?.length || 0)} characters
                </p>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex gap-3">
              {(currentSectionIndex > 0 || currentQuestionIndex > 0) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex(currentQuestionIndex - 1)
                    } else if (currentSectionIndex > 0) {
                      setCurrentSectionIndex(currentSectionIndex - 1)
                      setCurrentQuestionIndex(INTERVIEW_SECTIONS[currentSectionIndex - 1].questions.length - 1)
                    }
                  }}
                  className="border-[rgb(80,160,170)]/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
                </Button>
              )}
              <Button
                onClick={handleSiguienteQuestion}
                disabled={!answers[currentQuestion.id] || answers[currentQuestion.id].length < 20}
                className="rounded-[20px] flex-1 bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]"
              >
                {currentSectionIndex === INTERVIEW_SECTIONS.length - 1 && 
                 currentQuestionIndex === currentSection.questions.length - 1 
                  ? 'Complete Interview' 
                  : 'Siguiente Question'
                }
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Interview Complete - Self Evaluation */}
        {interviewComplete && !showReport && (
          <div className="space-y-6">
            <Card className="rounded-[2px] bg-gradient-to-br from-[rgba(170,70,170,0.2)] to-[rgba(80,160,170,0.2)] border-[rgba(170,70,170,0.4)] p-6 text-center">
              <CheckCircle2 className="w-16 h-16 text-[rgb(200,130,200)] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Interview Complete!</h3>
              <p className="text-white/70">
                Great job completing the full interview simulation. Now rate your own performance 
                to generate your readiness report.
              </p>
            </Card>

            <Card className="rounded-[2px] bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-4">
              <h4 className="font-semibold mb-4">Self-Evaluation</h4>
              <p className="text-sm text-white/60 mb-4">
                Rate yourself honestly on each criterion (1 = needs work, 5 = excellent)
              </p>

              <div className="space-y-4">
                {EVALUATION_CRITERIA.map((criterion) => (
                  <div key={criterion.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{criterion.name}</span>
                      <span className="text-[rgb(170,70,170)]">{selfRatings[criterion.id] || '-'}/5</span>
                    </div>
                    <p className="text-xs text-white/50">{criterion.description}</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setSelfRatings({...selfRatings, [criterion.id]: rating})}
                          className={`w-10 h-10 rounded transition-all ${
                            selfRatings[criterion.id] === rating
                              ? 'bg-[rgb(170,70,170)] text-white'
                              : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Button
              onClick={() => setShowReport(true)}
              disabled={Object.keys(selfRatings).length < EVALUATION_CRITERIA.length}
              className="rounded-[20px] w-full bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]"
            >
              Generate Readiness Report <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Final Report */}
        {showReport && (
          <div className="space-y-6">
            <Card className="rounded-[2px] bg-gradient-to-br from-[rgba(170,70,170,0.2)] to-[rgba(80,160,170,0.2)] border-[rgba(170,70,170,0.4)] p-8 text-center">
              <div className="relative inline-block mb-4">
                <Trophy className="w-20 h-20 text-[rgb(200,130,200)]" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[rgb(170,70,170)] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Basic Level Complete!</h2>
              <p className="text-white/70 mb-6">
                Congratulations! You&apos;ve completed the entire A3 Basic Level Ruta de Entrenamiento.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-3xl font-bold text-[rgb(170,70,170)]">1,340</p>
                  <p className="text-xs text-white/50">XP Total Ganados</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-3xl font-bold text-[rgb(200,130,200)]">10/10</p>
                  <p className="text-xs text-white/50">Modules Complete</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-3xl font-bold text-[rgb(80,160,170)]">{calculateOverallScore()}%</p>
                  <p className="text-xs text-white/50">Self-Assessment</p>
                </div>
              </div>

              {/* Readiness Statement */}
              <Card className="rounded-[2px] bg-white/10 border-[rgb(80,160,170)]/20 p-4 mb-6 text-left">
                <h4 className="font-semibold text-[rgb(200,130,200)] mb-2">Your Readiness Level</h4>
                <p className="text-sm text-white/80">
                  {calculateOverallScore() >= 80 
                    ? 'Estás bien preparado para entrevistas básicas con reclutadores y RRHH. Tienes fundamentos sólidos en autopresentación, respuestas estructuradas y manejo de preguntas difíciles.'
                    : calculateOverallScore() >= 60
                    ? 'Tienes buenos fundamentos para entrevistas básicas. Considera revisar módulos donde obtuviste puntuaciones más bajas y practica más antes de entrevistas reales.'
                    : 'Has completado el entrenamiento pero podrías beneficiarte de práctica adicional. Enfócate en las áreas que calificaste más bajo y considera repetir algunos módulos.'
                  }
                </p>
              </Card>

              {/* What's Siguiente */}
              <Card className="rounded-[2px] bg-[rgba(80,160,170,0.1)] border-[rgba(80,160,170,0.3)] p-4 text-left">
                <h4 className="font-semibold text-[rgb(80,160,170)] mb-2">What&apos;s Siguiente?</h4>
                <ul className="text-sm text-white/70 space-y-1">
                  <li>• Apply to entry-level positions with confidence</li>
                  <li>• Practice with real interviews (each one makes you better)</li>
                  <li>• When ready, unlock Intermediate Level (A3-Intermediate) for technical interviews</li>
                  <li>• Keep your Espejo de Carrera and Answer Bank updated</li>
                </ul>
              </Card>
            </Card>

            <Button 
              onClick={handleComplete}
              className="rounded-[20px] w-full bg-gradient-to-r from-[rgb(170,70,170)] to-[rgb(80,160,170)] hover:opacity-90 text-lg py-6"
            >
              <Award className="w-5 h-5 mr-2" />
              Complete Basic Level & Earn {MODULE_XP} XP
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
