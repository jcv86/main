'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, Zap, CheckCircle2, Phone } from 'lucide-react'
import { ASection, ASectionPart } from '@/components/a-section-layout'

interface CallEntrenaQuestion {
  id: string
  question: string
  scenario: string
  forProfile: string[]
}

const CALL_ENTRENA_QUESTIONS: CallEntrenaQuestion[] = [
  {
    id: 'q1',
    question: '¿Cuál es tu mayor fortaleza en un equipo?',
    scenario: 'Estás en una entrevista de grupo y te preguntan sobre tu contribución al equipo.',
    forProfile: ['D', 'I', 'S', 'C']
  },
  {
    id: 'q2',
    question: '¿Cómo manejas un conflicto con un compañero?',
    scenario: 'Ha surgido un desacuerdo importante sobre la dirección de un proyecto.',
    forProfile: ['D', 'I', 'S', 'C']
  },
  {
    id: 'q3',
    question: '¿Cuál es tu enfoque bajo presión?',
    scenario: 'El proyecto tiene un plazo crítico y recursos limitados.',
    forProfile: ['D', 'I', 'S', 'C']
  }
]

export default function A1CallEntrenaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuthRedirect()
  
  const [profile, setProfile] = useState<string>('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<string[]>([])
  const [callComplete, setCallComplete] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    const profileParam = searchParams.get('profile')
    if (profileParam && ['D', 'I', 'S', 'C'].includes(profileParam)) {
      setProfile(profileParam)
      setLoading(false)
    } else {
      // Redirect back if no valid profile
      router.push('/despega/a1-report')
    }
  }, [authLoading, searchParams, router])

  const handleAnswer = (answer: string) => {
    const newResponses = [...responses, answer]
    setResponses(newResponses)

    if (currentQuestion < CALL_ENTRENA_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCallComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setResponses([])
    setCallComplete(false)
  }

  const profileNames: Record<string, string> = {
    D: 'Impulsor',
    I: 'Catalizador',
    S: 'Estabilizador',
    C: 'Arquitecto'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    )
  }

  if (callComplete) {
    return (
      <ASection 
        title="A1: Origen" 
        subtitle="Call Entrena Completado" 
        icon="📞" 
        colorClass="from-cyan-500 to-teal-500"
      >
        <ASectionPart title="¡Excelente!" icon={<CheckCircle2 />}>
          <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/20 border border-cyan-500/30 rounded-lg p-8 text-center mb-8">
            <div className="mb-4">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text mb-2">
                {profileNames[profile]}
              </div>
              <p className="text-lg text-slate-300">Completaste tu Call Entrena</p>
              <p className="text-sm text-slate-400 mt-2">Una sesión de entrenamiento para practicar respuestas en entrevistas</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-white mb-4">Tus Respuestas:</h3>
              <div className="space-y-3">
                {responses.map((response, idx) => (
                  <div key={idx} className="border border-slate-600 rounded p-3">
                    <p className="text-xs text-slate-400 mb-1">Pregunta {idx + 1}:</p>
                    <p className="text-slate-200">{response}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-slate-400 mb-6">
              Tu Call Entrena fue adaptado para tu perfil {profileNames[profile]}. Repítelo cuantas veces quieras para mejorar tus respuestas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={handleRestart}
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              Repetir Call Entrena
            </Button>
            <Button 
              onClick={() => router.push('/despega/a1-report')}
              variant="outline"
              className="w-full"
            >
              Ver Mi Perfil
            </Button>
            <Button 
              onClick={() => router.push('/despega')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </ASectionPart>
      </ASection>
    )
  }

  const question = CALL_ENTRENA_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / CALL_ENTRENA_QUESTIONS.length) * 100

  return (
    <ASection 
      title="A1: Origen" 
      subtitle="Call Entrena - Entrenamiento de Entrevista" 
      icon="📞" 
      colorClass="from-cyan-500 to-teal-500"
    >
      <ASectionPart title={`Pregunta ${currentQuestion + 1} de ${CALL_ENTRENA_QUESTIONS.length}`} icon={<Phone />}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-slate-400">Tu Perfil: <span className="font-semibold text-cyan-300">{profileNames[profile]}</span></p>
            <p className="text-sm text-slate-400">{Math.round(progress)}%</p>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="bg-slate-800/40 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 italic mb-4">Contexto: {question.scenario}</p>
            <p className="text-xs text-slate-500">Responde cómo lo haría alguien con tu perfil {profileNames[profile]}.</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-3 mb-8">
          {[
            {
              label: '💪 Respuesta Fuerte',
              description: 'Enfocada en resultados y acción',
              value: 'strong'
            },
            {
              label: '🤝 Respuesta Equilibrada',
              description: 'Considera personas y proceso',
              value: 'balanced'
            },
            {
              label: '🧠 Respuesta Analítica',
              description: 'Detallada y fundamentada',
              value: 'analytical'
            },
            {
              label: '⏰ Respuesta Pragmática',
              description: 'Realista y orientada al tiempo',
              value: 'pragmatic'
            }
          ].map((option) => (
            <Button
              key={option.value}
              onClick={() => handleAnswer(option.label)}
              variant="outline"
              className="h-auto py-4 px-4 flex items-start gap-3 justify-start border-slate-600 hover:border-cyan-500 hover:bg-cyan-950/20"
            >
              <div className="text-left flex-1">
                <p className="font-semibold text-white text-sm">{option.label}</p>
                <p className="text-xs text-slate-400">{option.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Button>
          ))}
        </div>

        <Button 
          onClick={() => router.push('/despega/a1-report')}
          variant="outline"
          className="w-full border-slate-600"
        >
          Salir del Call Entrena
        </Button>
      </ASectionPart>
    </ASection>
  )
}
