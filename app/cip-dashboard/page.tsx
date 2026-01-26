import CIPCapacityDashboard from '@/components/cip-capacity-dashboard'

export const metadata = {
  title: 'CIP - Dashboard de Capacidad | Despega tu Carrera',
  description: 'Gestiona tu capacidad efectiva con el sistema CIP',
}

export default function CIPPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard CIP</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestión de Capacidad Efectiva</p>
        </div>
        
        <CIPCapacityDashboard />
      </div>
    </main>
  )
}
