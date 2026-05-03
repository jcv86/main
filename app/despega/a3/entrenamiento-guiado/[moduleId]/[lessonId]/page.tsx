'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SofiaInterviewer } from '@/components/sofia-interviewer'
import { ArrowLeft, Volume2 } from 'lucide-react'

const LESSONS_DATA: Record<string, Record<string, any>> = {
  'intro-to-star': {
    '1': {
      title: 'Intro a STAR',
      description: 'Por qué STAR es efectivo en entrevistas',
      content: 'STAR es una estructura que tu entrevistador reconoce y aprecia porque te permite demostrar cómo piensas y actúas bajo presión en situaciones reales.'
    },
    '2': {
      title: 'Situación y Tarea',
      description: 'Cómo plantear el contexto correctamente',
      content: 'El contexto es fundamental para que tu historia tenga sentido. Sin un contexto claro, tu audiencia no puede evaluar correctamente tus acciones.'
    },
    '3': {
      title: 'Acción y Resultado',
      description: 'Dónde está el impacto real',
      content: 'Lo que HICISTE tú específicamente es lo que separa una buena respuesta de una excepcional. El equipo puede tener logros, pero el entrevistador quiere saber qué fue TU contribución.'
    },
    '4': {
      title: 'Dominando STAR',
      description: 'Poniéndolo todo junto',
      content: 'Ahora que entiendes cada componente de STAR, es momento de integrarlos en una narrativa cohesiva y convincente.'
    }
  }
}

export default function LessonPage() {
  const params = useParams()
  const moduleId = params.moduleId as string
  const lessonId = params.lessonId as string
  
  const [showingSofia, setShowingSofia] = useState(true)
  const lessonData = LESSONS_DATA[moduleId]?.[lessonId]

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/80">Lección no encontrada</p>
          <Link href="/despega/a3/entrenamiento-guiado">
            <Button variant="outline">Volver al entrenamiento</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <Link href="/despega/a3/entrenamiento-guiado" className="inline-flex items-center gap-2 text-training hover:text-training/80">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">{lessonData.title}</h1>
            <Badge variant="secondary">Lección {lessonId} de 4</Badge>
          </div>
          <Progress value={(parseInt(lessonId) / 4) * 100} className="h-2" />
        </div>

        {/* Main Content with Sofia */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sofia Column - Takes up more space */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="sticky top-8">
              <div className="rounded-xl overflow-hidden border-2 border-training/40">
                <SofiaInterviewer 
                  state="listening" 
                  autoPlay={true}
                  loop={true}
                />
              </div>
              <p className="text-center mt-3 text-white/70 text-sm font-medium">Sofia está escuchando</p>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lesson Content */}
            <Card className="border-training/30 bg-background">
              <CardHeader>
                <CardTitle className="text-training">{lessonData.description}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Lesson Text */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/90 leading-relaxed">
                    {lessonData.content}
                  </p>
                </div>

                {/* Coach Tips */}
                <div className="bg-training/5 border border-training/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-training mb-2">Tu Coach IA explica:</p>
                  <p className="text-sm text-white/85 leading-relaxed">
                    {lessonId === 1 && 'STAR es una estructura que tu entrevistador reconoce y aprecia porque permite que demuestres cómo piensas y actúas bajo presión.'}
                    {lessonId === 2 && 'El contexto de tu historia debe validar por qué actuaste como lo hiciste. Sin contexto, tus acciones parecen impulsivas.'}
                    {lessonId === 3 && 'Lo que HICISTE tú específicamente es lo que separa una buena respuesta de una excepcional. Sé concreto, cuantifica el impacto.'}
                  </p>
                </div>

                {/* Key Points */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Puntos clave a recordar:</h3>
                  <ul className="space-y-2">
                    {lessonId === '1' && (
                      <>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>STAR = Situación, Tarea, Acción, Resultado</span>
                        </li>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>Es la estructura preferida de los entrevistadores</span>
                        </li>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>Demuestra cómo resuelves problemas reales</span>
                        </li>
                      </>
                    )}
                    {lessonId === '2' && (
                      <>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>Situación: El contexto debe ser claro y específico</span>
                        </li>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>Tarea: Tu rol y responsabilidad específica</span>
                        </li>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>Validación: El contexto debe justificar tus acciones</span>
                        </li>
                      </>
                    )}
                    {lessonId === '3' && (
                      <>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>Acción: LO QUE HICISTE (no el equipo)</span>
                        </li>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>Resultado: Impacto medible y cuantificable</span>
                        </li>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>Aprecia cómo el resultado te hace mejor candidato</span>
                        </li>
                      </>
                    )}
                    {lessonId === '4' && (
                      <>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>Integra todos los componentes de STAR</span>
                        </li>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>Practica tu narrativa hasta que suene natural</span>
                        </li>
                        <li className="flex gap-2 text-white/80">
                          <span className="text-training">•</span>
                          <span>Estás listo para practicar con Sofia</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    disabled={lessonId === '1'}
                    onClick={() => router.push(`/despega/a3/entrenamiento-guiado/${moduleId}/${parseInt(lessonId) - 1}`)}
                    className="flex-1"
                  >
                    Lección anterior
                  </Button>
                  <Button
                    onClick={() => setShowingSofia(true)}
                    className="flex-1 bg-training hover:bg-training/90 text-white"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Escuchar de nuevo
                  </Button>
                  <Button
                    disabled={lessonId === '4'}
                    onClick={() => router.push(`/despega/a3/entrenamiento-guiado/${moduleId}/${parseInt(lessonId) + 1}`)}
                    className="flex-1 bg-training hover:bg-training/90 text-white"
                  >
                    Siguiente lección
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Practice Section */}
            <Card className="border-training/30 bg-training/5">
              <CardHeader>
                <CardTitle className="text-training">Practica conmigo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/85">
                  {lessonId === '1' && 'Piensa en un proyecto importante que lideraste. Déjame guiarte a través de STAR.'}
                  {lessonId === '2' && 'Ahora, construyamos la sección "Situación" de tu historia. ¿Cuál era el contexto?'}
                  {lessonId === '3' && 'Ahora, construyamos la sección "Acción" de tu historia. ¿Qué fue lo específico que HICISTE tú?'}
                  {lessonId === '4' && 'Ahora practicaremos todo junto. Cuéntame tu mejor historia STAR.'}
                </p>
                <Button className="w-full bg-training hover:bg-training/90 text-white h-12">
                  Practicar con Sofia
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
