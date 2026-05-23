'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react'
import { ModuleCompletionScreen } from '@/components/module-completion-screen'

const STAR_FRAMEWORK = {
  situation: {
    label: 'Situación',
    description: 'Describe el contexto y la situación específica',
    tips: [
      'Sé específico sobre el contexto',
      'Indica el rol que tenías',
      'Explica por qué era relevante',
      'Mantén la brevedad (30-60 segundos)'
    ],
    example: 'En mi rol como analista de ventas, enfrenté una situación donde nuestro equipo estaba perdiendo oportunidades debido a un proceso de seguimiento ineficiente.'
  },
  task: {
    label: 'Tarea',
    description: 'Explica tu responsabilidad en esa situación',
    tips: [
      'Clarifica tu rol específico',
      'Menciona los desafíos del momento',
      'Destaca por qué era importante',
      'Sé claro sobre las expectativas'
    ],
    example: 'Se me encargó revisar y mejorar el proceso de seguimiento de clientes potenciales para aumentar la tasa de conversión.'
  },
  action: {
    label: 'Acción',
    description: 'Describe qué hiciste específicamente',
    tips: [
      'Usa "yo" - destaca tu contribución',
      'Sé específico en los pasos que seguiste',
      'Menciona habilidades clave utilizadas',
      'Explica tu pensamiento/decisiones'
    ],
    example: 'Analicé los datos de seguimiento, identifiqué los cuellos de botella e implementé un sistema de recordatorios automatizado. También capacité al equipo sobre mejores prácticas.'
  },
  result: {
    label: 'Resultado',
    description: 'Explica los resultados medibles de tus acciones',
    tips: [
      'Sé cuantitativo cuando sea posible',
      'Destaca el impacto positivo',
      'Menciona lo que aprendiste',
      'Conecta con la posición actual'
    ],
    example: 'Aumentamos la tasa de conversión en 35% en 3 meses. El sistema se adoptó en toda la región y me promocionaron como líder del proyecto.'
  }
}

const SAMPLE_GOOD_RESPONSE = {
  situation: 'En mi rol de gerente de proyecto, lideraba un equipo de 8 personas en el lanzamiento de una plataforma digital crítica.',
  task: 'Nos enfrentábamos a un retraso de 2 semanas y el cliente estaba insatisfecho con la comunicación.',
  action: 'Reorganicé el flujo de trabajo priorizando funciones críticas, implementé reportes diarios para el cliente e identifiqué y resolví los puntos de fricción principales en el equipo.',
  result: 'Completamos el lanzamiento solo 3 días después de la fecha original. El cliente redujo sus inquietudes y el equipo mejoró en un 40% su eficiencia. Esto llevó a que me asignaran 2 proyectos adicionales de mayor envergadura.'
}

const COMMON_MISTAKES = [
  {
    mistake: 'Demasiado enfoque en la "Situación"',
    impact: 'Consumes tiempo sin mostrar tu valor',
    solution: 'Limita la situación a 30 segundos, enfócate en Acción y Resultado'
  },
  {
    mistake: 'Usar "nosotros" en lugar de "yo"',
    impact: 'No está claro cuál fue tu contribución específica',
    solution: 'Siempre clarifica tu rol individual dentro del equipo'
  },
  {
    mistake: 'Resultados vagos o sin medir',
    impact: 'El impacto no es creíble o memorable',
    solution: 'Usa números, porcentajes, fechas, métricas concretas'
  },
  {
    mistake: 'No conectar con el rol actual',
    impact: 'La experiencia parece no relevante',
    solution: 'Termina con lo que aprendiste y cómo aplica al rol'
  }
]

export default function MetodoSTARPage() {
  const [activeTab, setActiveTab] = useState('learn')
  const [myResponse, setMyResponse] = useState({
    situation: '',
    task: '',
    action: '',
    result: ''
  })
  const [isCompleted, setIsCompleted] = useState(false)

  const calculateCompleteness = () => {
    const filled = Object.values(myResponse).filter(v => v.trim().length > 0).length
    return (filled / 4) * 100
  }

  if (isCompleted) {
    return <ModuleCompletionScreen moduleId="metodo-star" moduleName="Método STAR" xpEarned={120} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link href="/despega/a3" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver a Camino de Aprendizaje
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Método STAR</h1>
              <p className="text-white/60 mt-1">Estructura tus respuestas de entrevista con la técnica STAR comprobada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-black border border-purple-500/20">
            <TabsTrigger value="learn" className="data-[state=active]:bg-purple-500/20">Aprende</TabsTrigger>
            <TabsTrigger value="practice" className="data-[state=active]:bg-purple-500/20">Practica</TabsTrigger>
          </TabsList>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            <div className="rounded-[20px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Qué es la técnica STAR</h3>
                  <p className="text-white/70 text-sm">
                    STAR es un método estructurado para responder preguntas de comportamiento en entrevistas. Ayuda a los entrevistadores entender cómo piensas, actúas y logras resultados en situaciones reales.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(STAR_FRAMEWORK).map(([key, data]) => (
                <Card key={key} className="bg-black border-purple-500/30 hover:border-purple-500/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                        {key[0].toUpperCase()}
                      </span>
                      {data.label}
                    </CardTitle>
                    <p className="text-white/60 text-sm mt-2">{data.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white/80 mb-2">Recuerda:</h4>
                      <ul className="space-y-1">
                        {data.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-white/60 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-purple-500/10 rounded p-3 border border-purple-500/20">
                      <p className="text-xs text-purple-300 font-semibold mb-1">EJEMPLO:</p>
                      <p className="text-sm text-white/70 italic">{data.example}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Good Response Example */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Ejemplo de Respuesta Excelente
              </h3>
              <Card className="rounded-[2px] bg-black border-green-500/30">
                <CardContent className="pt-6 space-y-4">
                  {Object.entries(SAMPLE_GOOD_RESPONSE).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-green-400 font-semibold mb-1 capitalize">
                        {STAR_FRAMEWORK[key as keyof typeof STAR_FRAMEWORK].label}:
                      </p>
                      <p className="text-white/70 text-sm">{value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Common Mistakes */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[rgb(80,160,170)]-500" />
                Errores Comunes a Evitar
              </h3>
              <div className="grid gap-3">
                {COMMON_MISTAKES.map((item, idx) => (
                  <Card key={idx} className="bg-[rgba(80,160,170,0.5)]-500/5 border-[rgb(80,160,170)]-500/20">
                    <CardContent className="pt-4">
                      <p className="font-semibold text-[rgb(80,160,170)]-300 mb-1">{item.mistake}</p>
                      <p className="text-sm text-white/60 mb-2">Impacto: {item.impact}</p>
                      <p className="text-sm text-green-400">Solución: {item.solution}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            <div className="rounded-[20px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-2">Construye Tu Respuesta STAR</h3>
              <p className="text-white/70 text-sm">
                Usa el framework STAR para estructurar una respuesta sobre un logro o desafío importante en tu carrera.
              </p>
            </div>

            <div className="space-y-6">
              {Object.entries(STAR_FRAMEWORK).map(([key, data]) => (
                <div key={key}>
                  <label className="block font-semibold mb-2">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 inline-flex items-center justify-center text-purple-400 text-xs font-bold mr-2">
                      {key[0].toUpperCase()}
                    </span>
                    {data.label}
                  </label>
                  <textarea
                    value={myResponse[key as keyof typeof myResponse]}
                    onChange={(e) => setMyResponse({ ...myResponse, [key]: e.target.value })}
                    placeholder={data.example}
                    className="w-full rounded-[20px] bg-black border border-purple-500/30 rounded-lg p-4 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none min-h-32"
                  />
                  <p className="text-xs text-white/40 mt-1">Recomendado: {key === 'situation' ? '30-60' : '60-90'} palabras</p>
                </div>
              ))}
            </div>

            {/* Progreso */}
            <div className="mt-8 pt-6 border-t border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold">Progreso de Respuesta</p>
                <Badge className="bg-purple-500/20 text-purple-300">{Math.round(calculateCompleteness())}%</Badge>
              </div>
              <div className="w-full rounded-[20px] bg-black border border-purple-500/20 rounded-full h-2">
                <div
                  className="rounded-[20px] bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                  style={{ width: `${calculateCompleteness()}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              <Button
                onClick={() => setMyResponse({ situation: '', task: '', action: '', result: '' })}
                variant="outline"
                className="border-purple-500/30 text-white hover:bg-purple-500/10"
              >
                Limpiar
              </Button>
              <Button
                disabled={calculateCompleteness() < 75}
                onClick={() => setIsCompleted(true)}
                className="rounded-[20px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Save Respuesta
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
