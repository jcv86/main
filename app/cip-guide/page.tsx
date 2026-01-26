import CIPVisualGuide from '@/components/cip-visual-guide'

export const metadata = {
  title: 'Guía CIP - Entiende tu Capacidad Efectiva',
  description: 'Documentación interactiva del sistema CIP con diagramas y ejemplos',
}

export default function CIPGuidePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-4xl font-bold">Guía Completa del CIP</h1>
          <p className="text-lg text-gray-600 mt-2">
            Sistema de Gestión de Capacidad Efectiva - Aprende los pilares fundamentales
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <CIPVisualGuide />
      </div>
    </main>
  )
}
