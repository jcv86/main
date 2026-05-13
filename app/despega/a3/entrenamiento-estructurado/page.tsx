'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react'
import { ModuleCompletionScreen } from '@/components/module-completion-screen'
import { AnswerInputWithCoach } from '@/components/answer-input-with-coach'

const STRUCTURED_LESSONS = [
  {
    id: 1,
    title: 'Gestión de Conflicto en Equipo',
    difficulty: 'Intermedio',
    competencies: ['Comunicación', 'Liderazgo', 'Resolución de Conflictos'],
    starTemplate: 'Required',
    questions: [
      'Cuéntame sobre un conflicto que tuviste con un colega. ¿Cómo lo resolviste?',
      'Describe un momento donde no estuviste de acuerdo con tu manager. ¿Cómo manejaste la situación?'
    ]
  },
  {
    id: 2,
    title: 'Liderazgo bajo Presión',
    difficulty: 'Avanzado',
    competencies: ['Decisión Rápida', 'Calma', 'Liderazgo'],
    starTemplate: 'Required',
    questions: [
      'Describe un momento de crisis en tu trabajo. ¿Qué hiciste?',
      'Cuéntame sobre un deadline imposible que enfrentaste. ¿Cómo lo manejaste?'
    ]
  },
  {
    id: 3,
    title: 'Iniciativa y Innovación',
    difficulty: 'Intermedio',
    competencies: ['Iniciativa', 'Innovación', 'Proactividad'],
    starTemplate: 'Required',
    questions: [
      'Cuéntame sobre un proyecto donde tomaste la iniciativa sin que te lo pidieran',
      'Describe la mejora más significativa que implementaste en tu rol anterior'
    ]
  },
  {
    id: 4,
    title: 'Fracaso y Aprendizaje',
    difficulty: 'Crítico',
    competencies: ['Humildad', 'Resiliencia', 'Aprendizaje'],
    starTemplate: 'Required',
    questions: [
      'Cuéntame sobre un fracaso importante en tu carrera. ¿Qué aprendiste?',
      'Describe un proyecto donde no cumpliste con las expectativas. ¿Qué pasó después?'
    ]
  },
  {
    id: 5,
    title: 'Trabajo en Equipo Multidisciplinario',
    difficulty: 'Intermedio',
    competencies: ['Colaboración', 'Comunicación Interfuncional'],
    starTemplate: 'Required',
    questions: [
      'Cuéntame sobre un proyecto donde trabajaste con personas de diferentes departamentos',
      'Describe cómo lidiaste con diferentes perspectivas en un equipo multifuncional'
    ]
  }
]

export default function EntrenamientoEstructuradoPage() {
  const [selectedLesson, setSelectedLesson] = useState<typeof STRUCTURED_LESSONS[0] | null>(null)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [responses, setResponses] = useState<Record<number, string[]>>({})
  const [showScore, setShowScore] = useState(false)
  const [lessonScore, setLessonScore] = useState(0)
  const [coachTip, setCoachTip] = useState<string>('')
  const [showCoachTip, setShowCoachTip] = useState(false)

  const startLesson = (lesson: typeof STRUCTURED_LESSONS[0]) => {
    setSelectedLesson(lesson)
    setCurrentQuestionIdx(0)
    setShowScore(false)
    setResponses({ [lesson.id]: [] })
  }

  const completeLesson = () => {
    const score = Math.floor(Math.random() * 25) + 75 // 75-100 score
    setLessonScore(score)
    setShowScore(true)
  }

  const resetLesson = () => {
    setSelectedLesson(null)
    setCurrentQuestionIdx(0)
    setShowScore(false)
    setResponses({})
    setShowCoachTip(false)
  }

  const handleCoachTip = (tip: string) => {
    setCoachTip(tip)
    setShowCoachTip(true)
  }

  const nextQuestion = () => {
    if (selectedLesson && currentQuestionIdx < selectedLesson.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
      setShowCoachTip(false)
    } else {
      completeLesson()
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1)
      setShowCoachTip(false)
    }
  }

  if (isCompleted) {
    return <ModuleCompletionScreen moduleId="entrenamiento-estructurado" moduleName="Entrenamiento Estructurado" xpEarned={120} />
  }

  if (selectedLesson && !showScore) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="border-b border-[rgb(80,160,170)]/20 bg-black/50">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <Button
              onClick={resetLesson}
              variant="ghost"
              className="text-[rgb(80,160,170)] hover:text-[rgba(80,160,170,0.8)] mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Lecciones
            </Button>
            <div>
              <h1 className="text-2xl font-bold mb-2">{selectedLesson.title}</h1>
              <div className="flex gap-2 flex-wrap">
                {selectedLesson.competencies.map((comp, idx) => (
                  <Badge key={idx} className="bg-[rgb(80,160,170)]/20 text-[rgb(80,160,170)]">{comp}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Question Section with Answer Input */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Pregunta {currentQuestionIdx + 1} de {selectedLesson.questions.length}</h2>
              <div className="w-32 h-2 bg-black border border-[rgb(80,160,170)]/20 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[rgb(80,160,170)] to-[rgb(80,160,170)]/60 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIdx + 1) / selectedLesson.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Display question and STAR guideline */}
            <Card className="rounded-[2px] bg-black border-[rgb(80,160,170)]/30 mb-6">
              <CardContent className="pt-6">
                <p className="text-lg mb-4">{selectedLesson.questions[currentQuestionIdx]}</p>
                
                <div className="bg-[rgb(80,160,170)]/10 border border-[rgb(80,160,170)]/20 rounded p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-4 h-4 text-[rgb(80,160,170)] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[rgb(80,160,170)] mb-1">Recuerda:</p>
                      <p className="text-xs text-[rgb(80,160,170)]/70">Situación → Tarea → Acción → Resultado</p>
                    </div>
                  </div>
                </div>

                {/* Answer Input Component */}
                <AnswerInputWithCoach
                  question={selectedLesson.questions[currentQuestionIdx]}
                  referenceLabel="Contexto/Empresa"
                  answerPlaceholder="Describe tu respuesta en detalle..."
                  answer={responses[selectedLesson.id]?.[currentQuestionIdx] || ''}
                  onAnswerChange={(ans) => {
                    setResponses({
                      ...responses,
                      [selectedLesson.id]: [
                        ...(responses[selectedLesson.id] || []),
                        ans
                      ].slice(-selectedLesson.questions.length)
                    })
                  }}
                  onCoachTip={handleCoachTip}
                />

                {/* Evaluation Criteria */}
                <div className="space-y-3 mt-6">
                  <div className="p-3 bg-[rgb(80,160,170)]/10 border border-[rgb(80,160,170)]/20 rounded text-sm">
                    <p className="text-[rgb(80,160,170)] font-semibold mb-1">Criterios de Evaluación:</p>
                    <ul className="space-y-1 text-[rgb(80,160,170)]/70 text-xs">
                      <li>✓ Estructura clara (STAR)</li>
                      <li>✓ Relevancia al rol que persigues</li>
                      <li>✓ Resultados medibles</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            <Button
              onClick={previousQuestion}
              variant="outline"
              disabled={currentQuestionIdx === 0}
              className="border-[rgb(80,160,170)]/30 text-[rgb(80,160,170)]"
            >
              Anterior
            </Button>
            
            <Button
              onClick={nextQuestion}
              className="rounded-full bg-[rgb(80,160,170)] hover:bg-[rgba(80,160,170,0.9)] flex-1 text-white font-semibold"
            >
              {currentQuestionIdx < selectedLesson.questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Lección'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showScore) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <Card className="rounded-[2px] bg-black border-[rgb(80,160,170)]/30 w-full max-w-md">
          <CardContent className="pt-12 text-center pb-12">
            <div className="mb-6">
              <CheckCircle2 className="w-16 h-16 text-[rgb(80,160,170)] mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Lección Completada</h2>
              <p className="text-white/60">Excelente trabajo en {selectedLesson?.title}</p>
            </div>

            <div className="bg-[rgb(80,160,170)]/10 border border-[rgb(80,160,170)]/30 rounded-lg p-6 mb-6">
              <p className="text-white/60 text-sm mb-2">Puntuación Obtenida</p>
              <p className="text-5xl font-bold text-[rgb(80,160,170)]">{lessonScore}/100</p>
            </div>

            <div className="space-y-3 mb-8 text-left">
              {selectedLesson?.competencies.map((comp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[rgb(80,160,170)]" />
                  <p className="text-white/70 text-sm">{comp}: Evaluado</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => window.location.href = '/despega/a3'}
                className="w-full rounded-full bg-[rgb(80,160,170)] hover:bg-[rgba(80,160,170,0.9)] text-white font-semibold"
              >
                Ir al Dashboard
              </Button>
              <Button
                onClick={() => window.location.href = '/despega/a3/entrenamiento-desafiante'}
                className="w-full rounded-full bg-[rgb(80,160,170)]/60 hover:bg-[rgba(80,160,170,0.7)] text-white font-semibold"
              >
                Siguiente Práctica
              </Button>
              <Button
                variant="outline"
                className="w-full border-[rgb(80,160,170)]/30 text-[rgb(80,160,170)]"
              >
                Ver Retroalimentación Detallada
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[rgb(80,160,170)]/20 bg-black/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link href="/despega/a3" className="flex items-center gap-2 text-[rgb(80,160,170)] hover:text-[rgba(80,160,170,0.8)] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver a Camino de Aprendizaje
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[rgb(80,160,170)]/20 flex items-center justify-center border border-[rgb(80,160,170)]/30">
              <BookOpen className="w-6 h-6 text-[rgb(80,160,170)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Entrenamiento Estructurado</h1>
              <p className="text-white/60 mt-1">Practica preguntas específicas con estructura STAR y feedback inmediato</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold mb-6">Selecciona una Lección</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {STRUCTURED_LESSONS.map((lesson) => (
            <Card
              key={lesson.id}
              className="bg-black border-[rgb(80,160,170)]/30 hover:border-[rgb(80,160,170)]/60 transition-colors cursor-pointer"
              onClick={() => startLesson(lesson)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <Badge className={
                    lesson.difficulty === 'Crítico' ? 'bg-red-500/20 text-red-300' :
                    lesson.difficulty === 'Avanzado' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }>
                    {lesson.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-white/60 font-semibold mb-2">Competencias a Desarrollar:</p>
                  <div className="flex gap-1 flex-wrap">
                    {lesson.competencies.map((comp, idx) => (
                      <Badge key={idx} className="bg-[rgb(80,160,170)]/10 text-[rgb(80,160,170)] text-xs">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <CheckCircle2 className="w-4 h-4 text-[rgb(80,160,170)]" />
                  {lesson.questions.length} preguntas
                </div>
                <Button className="w-full rounded-full bg-[rgb(80,160,170)] hover:bg-[rgba(80,160,170,0.9)] text-white font-semibold mt-4">
                  Iniciar Lección
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-12 p-6 bg-[rgb(80,160,170)]/10 border border-[rgb(80,160,170)]/20 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[rgb(80,160,170)] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-[rgb(80,160,170)] mb-2">Recuerda:</h3>
              <ul className="space-y-1 text-[rgb(80,160,170)]/70 text-sm">
                <li>• Graba tus respuestas completas (60-90 segundos cada una)</li>
                <li>• Usa ejemplos reales de tu experiencia</li>
                <li>• Enfócate en el impacto y resultados medibles</li>
                <li>• Revisa el feedback después de cada lección</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

