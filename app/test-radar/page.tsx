'use client'

import { useState } from 'react'
import DespegaCerebralRadar, { 
  DespegaCerebralProfileSummary, 
  DESPEGA_CEREBRAL_COLORS,
  DESPEGA_CEREBRAL_CONFIG 
} from '@/components/despega-cerebral-radar'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

export default function TestRadarPage() {
  // Scores editables para pruebas
  const [scores, setScores] = useState({
    D: 75, // Dominancia - Rojo
    I: 45, // Influencia - Amarillo
    S: 30, // Estabilidad - Verde
    C: 60  // Cumplimiento - Azul
  })

  // Determinar tipo dominante
  const dominantType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as 'D' | 'I' | 'S' | 'C'
  const config = DESPEGA_CEREBRAL_CONFIG[dominantType]

  const handleScoreChange = (type: 'D' | 'I' | 'S' | 'C', value: number[]) => {
    setScores(prev => ({ ...prev, [type]: value[0] }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="container max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Prueba Radar Despega Cerebral</h1>
          <p className="text-gray-400">Ajusta los valores para ver como cambia el perfil</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controles */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Ajustar Puntuaciones</h2>
            
            {/* Slider D - Dominancia */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: DESPEGA_CEREBRAL_COLORS.D }}
                  >
                    D
                  </div>
                  <span className="text-white font-medium">Dominancia</span>
                </div>
                <span className="text-white font-bold">{scores.D}%</span>
              </div>
              <Slider
                value={[scores.D]}
                onValueChange={(v) => handleScoreChange('D', v)}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-red-500"
              />
            </div>

            {/* Slider I - Influencia */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: DESPEGA_CEREBRAL_COLORS.I }}
                  >
                    I
                  </div>
                  <span className="text-white font-medium">Influencia</span>
                </div>
                <span className="text-white font-bold">{scores.I}%</span>
              </div>
              <Slider
                value={[scores.I]}
                onValueChange={(v) => handleScoreChange('I', v)}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-yellow-500"
              />
            </div>

            {/* Slider S - Estabilidad */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: DESPEGA_CEREBRAL_COLORS.S }}
                  >
                    S
                  </div>
                  <span className="text-white font-medium">Estabilidad</span>
                </div>
                <span className="text-white font-bold">{scores.S}%</span>
              </div>
              <Slider
                value={[scores.S]}
                onValueChange={(v) => handleScoreChange('S', v)}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-green-500"
              />
            </div>

            {/* Slider C - Cumplimiento */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: DESPEGA_CEREBRAL_COLORS.C }}
                  >
                    C
                  </div>
                  <span className="text-white font-medium">Cumplimiento</span>
                </div>
                <span className="text-white font-bold">{scores.C}%</span>
              </div>
              <Slider
                value={[scores.C]}
                onValueChange={(v) => handleScoreChange('C', v)}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-blue-500"
              />
            </div>

            {/* Tipo dominante */}
            <div 
              className="mt-8 p-4 rounded-lg"
              style={{ backgroundColor: `${config.color}20`, border: `2px solid ${config.color}` }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: config.color }}
                >
                  {dominantType}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{config.nombre}</h3>
                  <p className="text-gray-400 text-sm">{config.descripcion}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Radar Chart */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Mapa Radar</h2>
            <DespegaCerebralRadar 
              scores={scores} 
              showLegend={true}
              size="lg"
            />
          </Card>
        </div>

        {/* Resumen del perfil */}
        <div className="mt-8">
          <DespegaCerebralProfileSummary scores={scores} />
        </div>

        {/* Referencia de colores */}
        <Card className="mt-8 p-6 bg-slate-800 border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Referencia de Colores Despega Cerebral</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(DESPEGA_CEREBRAL_CONFIG).map(([key, cfg]) => (
              <div key={key} className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: cfg.color }}
                >
                  {key}
                </div>
                <h3 className="text-white font-semibold">{cfg.nombre}</h3>
                <p className="text-gray-400 text-xs">{cfg.color}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
