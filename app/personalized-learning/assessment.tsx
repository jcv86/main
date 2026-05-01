'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: '¿Cuál es tu nivel actual de conocimiento profesional?',
    options: [
      { value: 'beginner', label: 'Principiante - Estoy empezando' },
      { value: 'intermediate', label: 'Intermedio - Tengo experiencia' },
      { value: 'advanced', label: 'Avanzado - Soy experto' },
    ],
  },
  {
    id: 2,
    question: '¿Cuántos libros profesionales has completado?',
    options: [
      { value: 'beginner', label: '0-2 libros' },
      { value: 'intermediate', label: '3-10 libros' },
      { value: 'advanced', label: '+10 libros' },
    ],
  },
  {
    id: 3,
    question: '¿Cuál es tu velocidad de lectura?',
    options: [
      { value: 'beginner', label: 'Lenta - Prefiero comprender profundamente' },
      { value: 'intermediate', label: 'Media - Balance entre velocidad y comprensión' },
      { value: 'advanced', label: 'Rápida - Puedo leer y retener rápido' },
    ],
  },
  {
    id: 4,
    question: '¿Qué categorías te interesan? (Selecciona máximo 3)',
    options: [
      { value: 'development', label: 'Desarrollo Personal' },
      { value: 'business', label: 'Negocios' },
      { value: 'leadership', label: 'Liderazgo' },
      { value: 'finance', label: 'Finanzas' },
      { value: 'psychology', label: 'Psicología' },
      { value: 'innovation', label: 'Innovación' },
    ],
    multiple: true,
  },
  {
    id: 5,
    question: '¿Cuánto tiempo puedes dedicar a leer por semana?',
    options: [
      { value: 'beginner', label: 'Menos de 3 horas' },
      { value: 'intermediate', label: '3-7 horas' },
      { value: 'advanced', label: 'Más de 7 horas' },
    ],
  },
]

export function AssessmentQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, string[]>>({})
  const [completed, setCompleted] = useState(false)
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null)

  const question = ASSESSMENT_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100

  const handleSelect = (value: string) => {
    const currentResponses = responses[question.id] || []
    
    if (question.multiple) {
      if (currentResponses.includes(value)) {
        setResponses({
          ...responses,
          [question.id]: currentResponses.filter(v => v !== value),
        })
      } else if (currentResponses.length < 3) {
        setResponses({
          ...responses,
          [question.id]: [...currentResponses, value],
        })
      }
    } else {
      setResponses({
        ...responses,
        [question.id]: [value],
      })
    }
  }

  const handleNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateLevel()
    }
  }

  const calculateLevel = () => {
    const levelCounts = { beginner: 0, intermediate: 0, advanced: 0 }
    
    Object.values(responses).forEach(answerSet => {
      answerSet.forEach(answer => {
        if (answer in levelCounts) {
          levelCounts[answer as keyof typeof levelCounts]++
        }
      })
    })

    const maxLevel = Object.entries(levelCounts).sort(([,a], [,b]) => b - a)[0][0]
    setUserLevel(maxLevel as any)
    setCompleted(true)

    // Save to localStorage for now (will integrate with Supabase)
    localStorage.setItem('userLevel', maxLevel)
    localStorage.setItem('userAssessment', JSON.stringify(responses))
  }

  if (completed) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Tu Perfil de Aprendizaje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Nivel Detectado</p>
            <p className="text-3xl font-bold capitalize">
              {userLevel === 'beginner' && '🌱 Principiante'}
              {userLevel === 'intermediate' && '📈 Intermedio'}
              {userLevel === 'advanced' && ' Avanzado'}
            </p>
          </div>
          <Button onClick={() => window.location.href = '/biblioteca'} className="w-full">
            Ver Recomendaciones Personalizadas
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="space-y-4">
          <CardTitle>Personaliza tu Experiencia de Aprendizaje</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pregunta {currentQuestion + 1} de {ASSESSMENT_QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          <RadioGroup value={responses[question.id]?.[0] || ''} onValueChange={handleSelect}>
            <div className="space-y-3">
              {question.options.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        <Button 
          onClick={handleNext}
          disabled={!responses[question.id]?.length}
          className="w-full"
        >
          {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? 'Completar' : 'Siguiente'}
        </Button>
      </CardContent>
    </Card>
  )
}
