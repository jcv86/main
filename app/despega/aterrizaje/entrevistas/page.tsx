import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { EntrevistaGuiada } from '@/components/entrevista-guiada'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Entrevistas Guiadas | Aterrizaje - Despega',
  description: 'Aprende y practica entrevistas con asistencia paso a paso',
}

export default async function EntrevistasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Obtener perfil DISC del usuario
  const { data: perfilData } = await supabase
    .from('despega_perfil_informe')
    .select('perfil_tipo')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  const perfilDisc = (perfilData?.perfil_tipo as 'A' | 'B' | 'C' | 'D') || 'C'

  // Obtener progreso en entrevistas
  const { data: progreso } = await supabase
    .from('a3_progreso_entrevistas')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const tieneAcceso = !!progreso

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-black bg-opacity-40 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto py-6 px-4">
          <div className="mb-4">
            <Link href="/despega/aterrizaje" className="text-slate-400 hover:text-white transition mb-2 inline-block">
              ← Volver a Aterrizaje
            </Link>
            <h1 className="text-4xl font-bold text-white">Entrevistas Guiadas</h1>
            <p className="text-slate-300 mt-2">A3 - Empleabilidad y Entrevistas</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto py-12 px-4">
        {!tieneAcceso ? (
          // Introducción para primer acceso
          <div className="max-w-3xl mx-auto space-y-8">
            <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-slate-50">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardTitle className="text-2xl">Bienvenido a Entrevistas Guiadas</CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="space-y-6">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    Este módulo te ayudará a prepararte para entrevistas de manera estructurada y asistida.
                  </p>

                  {/* Estructura del programa */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900">Cómo funciona:</h3>
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Módulos Educativos</h4>
                          <p className="text-slate-600">Aprende qué es una entrevista, a qué te enfrentas, y tips de preparación.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Entrevista Asistida</h4>
                          <p className="text-slate-600">
                            Responde preguntas reales con sugerencias y tips en tiempo real. El sistema te dará feedback
                            automático.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Entrevistas Libres</h4>
                          <p className="text-slate-600">
                            Una vez completes la guiada, puedes hacer entrevistas sin asistencia para practicar.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Beneficios */}
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <h4 className="font-semibold text-green-900 mb-2">Beneficios:</h4>
                    <ul className="space-y-1 text-green-800 text-sm">
                      <li>✓ Feedback personalizado según tu perfil DISC ({perfilDisc})</li>
                      <li>✓ Scoring automático de respuestas</li>
                      <li>✓ Preparación gradual desde principiante a avanzado</li>
                      <li>✓ Seguimiento de progreso</li>
                    </ul>
                  </div>

                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg">
                    Comenzar Entrevista Guiada
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Componente de entrevista guiada
          <EntrevistaGuiada usuarioId={user.id} perfilDisc={perfilDisc} />
        )}
      </div>
    </main>
  )
}
