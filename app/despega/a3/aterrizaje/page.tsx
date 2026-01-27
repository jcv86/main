'use client'

import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EntrevistGuiada from '@/components/a3-entrevista-guiada'
import DashboardProgresoA3 from '@/components/a3-dashboard-progreso'
import A3VideoBanco from '@/components/a3-video-banco'

export default function AterrizajePage() {
  const { data: session } = useSession()

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="p-8 bg-slate-800 border-slate-700 text-center">
          <p className="text-gray-400">Por favor inicia sesión para acceder a Aterrizaje</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="container max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded bg-blue-500" />
            <h1 className="text-4xl font-bold text-white">Aterrizaje A3</h1>
          </div>
          <p className="text-gray-400 text-lg ml-5">
            Entrevistas guiadas, feedback con IA y conexión con empleadores
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="entrevistas" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="entrevistas">Entrevistas</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="progreso">Progreso</TabsTrigger>
            <TabsTrigger value="empleadores">Empleadores</TabsTrigger>
          </TabsList>

          <TabsContent value="entrevistas" className="space-y-6">
            <Card className="p-6 bg-slate-800 border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Entrevistas Guiadas</h2>
              <p className="text-gray-400 mb-6">
                Practica entrevistas con feedback inteligente. Cada entrevista está diseñada para tu perfil.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  Próximamente: Entrevistas interactivas con análisis de IA en tiempo real
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <A3VideoBanco />
          </TabsContent>

          <TabsContent value="progreso" className="space-y-6">
            <DashboardProgresoA3 />
          </TabsContent>

          <TabsContent value="empleadores" className="space-y-6">
            <Card className="p-6 bg-slate-800 border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Empleadores</h2>
              <p className="text-gray-400 mb-6">
                Descubre empleadores que buscan perfiles como el tuyo
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="p-4 bg-slate-700 border-slate-600">
                    <div className="h-20 bg-slate-600 rounded mb-3" />
                    <p className="text-white font-semibold mb-2">Empresa {i}</p>
                    <p className="text-sm text-gray-400 mb-3">
                      {75 + i * 5}% de coincidencia
                    </p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
