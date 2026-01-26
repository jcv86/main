import CIPCapacityDashboard from '@/components/cip-capacity-dashboard'

export const metadata = {
  title: 'CIP - Dashboard de Capacidad | Despega tu Carrera',
  description: 'Sistema de Gestión de Capacidad Efectiva - Optimiza tu productividad de forma sostenible',
}

export default function CIPPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-purple-800 bg-black bg-opacity-40 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto py-6 px-4">
          <div className="mb-2">
            <h1 className="text-4xl font-bold text-white">Dashboard CIP</h1>
            <p className="text-purple-300 mt-2">Sistema de Gestión de Capacidad Efectiva</p>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm mt-4 text-purple-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Crítica (0-15%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Alerta (15-68%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Óptima (68-100%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto py-8 px-4">
        <CIPCapacityDashboard />
      </div>

      {/* Footer Info */}
      <div className="border-t border-purple-800 bg-black bg-opacity-40 backdrop-blur-md mt-12">
        <div className="container mx-auto py-6 px-4 text-center text-purple-300 text-sm">
          <p>🎯 Objetivo: Mantener capacidad entre 15-68% para sostenibilidad a largo plazo</p>
          <p className="mt-2 text-purple-400">Datos actualizados en tiempo real</p>
        </div>
      </div>
    </main>
  )
}
