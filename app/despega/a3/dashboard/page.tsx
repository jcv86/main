import DashboardProgresoA3 from '@/components/a3-dashboard-progreso'
import A3VideoBanco from '@/components/a3-video-banco'
import { Card } from '@/components/ui/card'

export default function A3DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="container max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard A3</h1>
          <p className="text-gray-400">Tu progreso en Aterrizaje y empleadores</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main: Progress */}
          <div className="lg:col-span-2 space-y-6">
            <DashboardProgresoA3 />
          </div>

          {/* Sidebar: Quick actions */}
          <div className="space-y-4">
            <Card className="p-6 bg-slate-800 border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Próximos Pasos</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                  <p className="text-sm text-white font-semibold">Entrevista 1</p>
                  <p className="text-xs text-gray-400">Educación básica</p>
                </div>
                <div className="p-3 bg-slate-700 rounded opacity-50">
                  <p className="text-sm text-white font-semibold">Entrevista 2</p>
                  <p className="text-xs text-gray-400">Bloqueada</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-800 border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Recursos</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-blue-400 hover:text-blue-300">
                  Ver banco de videos
                </a>
                <a href="#" className="block text-sm text-blue-400 hover:text-blue-300">
                  Descargar guía
                </a>
                <a href="#" className="block text-sm text-blue-400 hover:text-blue-300">
                  Contactar soporte
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* Videos section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Banco de Videos</h2>
          <A3VideoBanco />
        </div>
      </div>
    </div>
  )
}
