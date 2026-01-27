'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, Download, Lock } from 'lucide-react'
import DespegaCerebralRadar, { 
  DespegaCerebralProfileSummary, 
  DESPEGA_CEREBRAL_COLORS,
  DESPEGA_CEREBRAL_CONFIG 
} from '@/components/despega-cerebral-radar'

interface PerfilDescubiertoProps {
  perfil: any
  isPremium: boolean
}

export default function PerfilDescubiertoViewer({ perfil, isPremium }: PerfilDescubiertoProps) {
  const [activeTab, setActiveTab] = useState('resumen')

  // Mapear tipo a colores Despega Cerebral (DISC)
  const tipoToDisc: Record<string, 'D' | 'I' | 'S' | 'C'> = {
    'A': 'D', // Dominante -> Rojo
    'B': 'I', // Influyente -> Amarillo
    'C': 'C', // Cumplidor -> Azul
    'D': 'S'  // Estable -> Verde
  }

  const tipo = perfil?.perfil_tipo || 'C'
  const discType = tipoToDisc[tipo] || 'C'
  const config = DESPEGA_CEREBRAL_CONFIG[discType]
  const mainColor = DESPEGA_CEREBRAL_COLORS[discType]

  // Extraer scores del perfil (D, I, S, C)
  const discScores = {
    D: perfil?.scores?.D || perfil?.puntuaciones?.A || 25,
    I: perfil?.scores?.I || perfil?.puntuaciones?.B || 25,
    S: perfil?.scores?.S || perfil?.puntuaciones?.D || 25,
    C: perfil?.scores?.C || perfil?.puntuaciones?.C || 25,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="container max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tu Perfil Descubierto</h1>
          <p className="text-gray-400">Basado en Test Despega Cerebral</p>
        </div>

        {/* Main Profile Card con color DISC */}
        <div 
          className="rounded-2xl p-1 mb-8 shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${mainColor}, ${mainColor}80)` }}
        >
          <div className="bg-slate-900 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Tipo dominante */}
              <div className="text-center md:text-left">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto md:mx-0 mb-4"
                  style={{ backgroundColor: mainColor }}
                >
                  {discType}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{config.nombre}</h2>
                <p className="text-gray-300">{config.descripcion}</p>
              </div>

              {/* Radar Chart */}
              <div className="flex-1 w-full">
                <DespegaCerebralRadar 
                  scores={discScores} 
                  showLegend={false}
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resumen del perfil con fortalezas y areas */}
        <DespegaCerebralProfileSummary scores={discScores} />

        {/* Tabs */}
        <div className="flex gap-2 mt-8 mb-8 border-b border-slate-700">
          {['radar', 'fortalezas', 'desarrollo', 'compatibilidad'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'border-b-2'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              style={activeTab === tab ? { color: mainColor, borderColor: mainColor } : {}}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'radar' && (
          <div className="space-y-4 mb-8">
            <Card className="p-6 bg-slate-800 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Mapa de tu Perfil Despega Cerebral</h3>
              <p className="text-gray-400 mb-6">
                Este grafico muestra tu distribucion en las 4 dimensiones del modelo Despega Cerebral
              </p>
              <DespegaCerebralRadar 
                scores={discScores} 
                showLegend={true}
                size="lg"
              />
            </Card>
          </div>
        )}

        {activeTab === 'fortalezas' && (
          <div className="space-y-4 mb-8">
            <Card className="p-6 bg-slate-800 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Tus Fortalezas</h3>
              <ul className="space-y-3">
                {(perfil?.contenido_informe?.fortalezas || config.fortalezas).map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1" style={{ color: DESPEGA_CEREBRAL_COLORS.S }}>&#10003;</span>
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {activeTab === 'desarrollo' && (
          <div className="space-y-4 mb-8">
            <Card className="p-6 bg-slate-800 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Areas de Desarrollo</h3>
              <ul className="space-y-3">
                {(perfil?.contenido_informe?.areas_desarrollo || config.areas).map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1" style={{ color: DESPEGA_CEREBRAL_COLORS.I }}>&#8594;</span>
                    <span className="text-gray-300">{a}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {activeTab === 'compatibilidad' && (
          <div className="space-y-4 mb-8">
            <Card className="p-6 bg-slate-800 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Compatibilidad con Otros Perfiles</h3>
              <p className="text-gray-400 mb-6">
                Como tu perfil {config.nombre} interactua con otros estilos
              </p>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(DESPEGA_CEREBRAL_CONFIG).map(([key, cfg]) => (
                  <div 
                    key={key}
                    className="p-4 rounded-lg border"
                    style={{ 
                      borderColor: cfg.color,
                      backgroundColor: key === discType ? `${cfg.color}20` : 'transparent'
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: cfg.color }}
                      >
                        {key}
                      </div>
                      <span className="text-white font-semibold">{cfg.nombre}</span>
                    </div>
                    <p className="text-sm text-gray-400">{cfg.descripcion}</p>
                    {key === discType && (
                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded" style={{ backgroundColor: cfg.color, color: 'white' }}>
                        Tu perfil
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Premium Features */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-6 mb-8 border border-purple-700">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Desbloquea tu Informe Completo</h3>
                <p className="text-gray-300 mb-4">
                  Acceso a análisis detallado, comparativas con otros usuarios, rutas personalizadas y seguimiento 30-60-90
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Actualizar a Premium
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <Button className="flex-1 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Descargar PDF
          </Button>
          <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 border-slate-600 text-white hover:bg-slate-800">
            <Share2 className="w-4 h-4" />
            Compartir
          </Button>
        </div>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-r from-blue-900 to-cyan-900 border-blue-700 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Continúa tu Desarrollo</h3>
          <p className="text-gray-300 mb-6">
            Acceso a misiones, rutas de aprendizaje y coaching personalizado
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Explorar Mi Ruta de Desarrollo
          </Button>
        </Card>
      </div>
    </div>
  )
}
