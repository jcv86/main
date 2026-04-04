'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Sparkles, Check } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  const [step, setStep] = useState('intro')
  const [demoAnswers, setDemoAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null
  })

  const demoQuestions = [
    {
      id: 'q1',
      question: 'Cuando enfrento un desafío importante, tiendo a ser más...',
      options: [
        { text: 'Decidido y directo', value: 'D' },
        { text: 'Optimista e inspirador', value: 'I' },
        { text: 'Paciente y considerado', value: 'S' },
        { text: 'Analítico y preciso', value: 'C' }
      ]
    },
    {
      id: 'q2',
      question: 'En reuniones o trabajo en equipo, naturalmente...',
      options: [
        { text: 'Tomo decisiones rápidas', value: 'D' },
        { text: 'Inspiro y motivo a otros', value: 'I' },
        { text: 'Creo un ambiente seguro', value: 'S' },
        { text: 'Aseguro que todo sea correcto', value: 'C' }
      ]
    },
    {
      id: 'q3',
      question: 'Mi mayor fortaleza profesional es...',
      options: [
        { text: 'La capacidad de ejecución', value: 'D' },
        { text: 'La influencia y networking', value: 'I' },
        { text: 'La confiabilidad y lealtad', value: 'S' },
        { text: 'El pensamiento estratégico', value: 'C' }
      ]
    },
    {
      id: 'q4',
      question: 'Cuando algo sale mal, típicamente...',
      options: [
        { text: 'Actúo rápido para corregirlo', value: 'D' },
        { text: 'Convenzo a otros a resolver', value: 'I' },
        { text: 'Busco ayuda de mi equipo', value: 'S' },
        { text: 'Analizo qué salió mal', value: 'C' }
      ]
    },
    {
      id: 'q5',
      question: 'Mi ambiente ideal de trabajo es...',
      options: [
        { text: 'Dinámico y orientado a resultados', value: 'D' },
        { text: 'Colaborativo y estimulante', value: 'I' },
        { text: 'Estable y predecible', value: 'S' },
        { text: 'Ordenado y bien planificado', value: 'C' }
      ]
    }
  ]

  const handleAnswer = (questionId, answer) => {
    setDemoAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const calculateProfile = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 }
    Object.values(demoAnswers).forEach(answer => {
      if (answer) scores[answer]++
    })
    
    const max = Math.max(...Object.values(scores))
    const primary = Object.keys(scores).find(key => scores[key] === max)
    const secondary = Object.keys(scores)
      .filter(key => key !== primary && scores[key] > 0)
      .sort((a, b) => scores[b] - scores[a])[0] || 'I'
    
    return { scores, primary, secondary }
  }

  const allAnswered = Object.values(demoAnswers).every(v => v !== null)
  const { scores, primary, secondary } = allAnswered ? calculateProfile() : {}

  const profileNames = {
    D: 'Impulsor',
    I: 'Catalizador',
    S: 'Estabilizador',
    C: 'Arquitecto'
  }

  const profileDescriptions = {
    D: 'Impulsor: Orientado a resultados, decisivo, ejecutor rápido. Brillas en situaciones que requieren acción inmediata y liderazgo firme.',
    I: 'Catalizador: Inspirador, comunicativo, orientado a personas. Brillas motivando equipos y creando conexiones significativas.',
    S: 'Estabilizador: Confiable, cooperativo, paciente. Brillas creando estabilidad y siendo el ancla de tu equipo.',
    C: 'Arquitecto: Analítico, detallista, estratégico. Brillas cuando necesitan pensar a largo plazo y asegurar calidad.'
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-3xl px-4">
        {step === 'intro' && (
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Prueba Despega Tu Carrera</h1>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                Descubre tu perfil de El Ritual en 5 minutos sin crear cuenta. Responde 5 preguntas y obtén tu mini-reporte personalizado.
              </p>
            </div>

            <Button 
              onClick={() => setStep('questions')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-6"
            >
              Comenzar Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="text-left">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  5 Preguntas
                </h3>
                <p className="text-sm text-foreground/60">Científico y rápido. Sin registrarse.</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Perfil Instant
                </h3>
                <p className="text-sm text-foreground/60">Descubre quién eres realmente.</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  Acceso Completo
                </h3>
                <p className="text-sm text-foreground/60">Regístrate para toda la plataforma.</p>
              </div>
            </div>
          </div>
        )}

        {step === 'questions' && !allAnswered && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Descubre Tu Perfil</h2>
              <p className="text-foreground/70">Responde estas 5 preguntas. No hay respuestas "correctas".</p>
            </div>

            {demoQuestions.map((q, idx) => (
              <Card key={q.id} className="border-2 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {idx + 1}. {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {q.options.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(q.id, option.value)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          demoAnswers[q.id] === option.value
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option.text}</span>
                          {demoAnswers[q.id] === option.value && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button 
              onClick={() => setStep('results')}
              disabled={!allAnswered}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg py-6"
            >
              Ver Mi Perfil
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {step === 'results' && allAnswered && (
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="border-4 border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
              <CardHeader>
                <CardTitle className="text-3xl mb-2">Tu Perfil: {profileNames[primary]} + {profileNames[secondary]}</CardTitle>
                <CardDescription className="text-lg">{profileDescriptions[primary]}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {Object.entries(profileNames).map(([key, name]) => (
                    <div key={key} className="text-center">
                      <div className={`font-bold text-2xl mb-2 ${
                        key === primary ? 'text-purple-600' : key === secondary ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        {scores[key]}/5
                      </div>
                      <div className="text-sm font-medium">{name}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-foreground/70">
                  Este es tu perfil basado en 5 preguntas. El análisis completo incluye 28 preguntas científicamente validadas para precisión máxima.
                </p>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>¿Qué Sigue?</CardTitle>
                <CardDescription>Acceso completo a todo con tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold">Análisis Completo de El Ritual (28 preguntas)</h4>
                      <p className="text-sm text-foreground/70">Precisión máxima con 8 insights personalizados por IA</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold">Ruta Personalizada de 90 Días</h4>
                      <p className="text-sm text-foreground/70">Plan específico basado en tu perfil y objetivos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold">Coach IA 24/7 + Simulaciones</h4>
                      <p className="text-sm text-foreground/70">Entrenamientos personalizados y mentoría constante</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                  <Link href="/auth/signin">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg">
                      Crear Mi Cuenta Gratuita
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => setStep('intro')}
                    variant="outline"
                    className="w-full"
                  >
                    Realizar Demo Nuevamente
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trust Signals */}
            <div className="text-center text-sm text-foreground/60">
              <p>✓ Método científicamente validado • ✓ Sin spam • ✓ 100% gratuito</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
