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
  const [scores, setScores] = useState({
    D: 75,
    I: 45,
    S: 30,
    C: 60
  })

  const dominantType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as 'D' | 'I' | 'S' | 'C'
  const config = DESPEGA_CEREBRAL_CONFIG[dominantType]

  const handleScoreChange = (type: 'D' | 'I' | 'S' | 'C', value: number[]) => {
    setScores(prev => ({ ...prev, [type]: value[0] }))
  }

  const sliders = [
    { key: 'D', name: 'Dominancia', subtitle: 'Dirección & Decisión' },
    { key: 'I', name: 'Influencia', subtitle: 'Comunicación & Energía' },
    { key: 'S', name: 'Estabilidad', subtitle: 'Consistencia & Apoyo' },
    { key: 'C', name: 'Cumplimiento', subtitle: 'Precisión & Calidad' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="container max-w-7xl mx-auto py-8">
        {/* Header Premium */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-2 h-8 rounded"
              style={{ backgroundColor: config.color }}
            />
            <h1 className="text-5xl font-bold text-white">
              Despega Cerebral
            </h1>
          </div>
          <p className="text-gray-400 text-lg ml-5">
            Descubre tu perfil ajustando los valores en tiempo real
          </p>
        </div>

        {/* Layout en 3 columnas: Sliders | Radar | Perfil */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* COLUMNA 1: Sliders Interactivos */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-slate-800/50 border-slate-700 sticky top-4 h-fit">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">⚙️</span> Ajustar Puntuaciones
              </h2>

              <div className="space-y-6">
                {sliders.map(({ key, name, subtitle }) => {
                  const color = DESPEGA_CEREBRAL_COLORS[key as keyof typeof DESPEGA_CEREBRAL_COLORS]
                  const score = scores[key as keyof typeof scores]
                  
                  return (
                    <div key={key} className="space-y-2">
                      {/* Label */}
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {key}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white">{name}</div>
                          <div className="text-xs text-gray-400">{subtitle}</div>
                        </div>
                        <div 
                          className="text-lg font-bold text-white px-3 py-1 rounded-full"
                          style={{ backgroundColor: `${color}30` }}
                        >
                          {score}%
                        </div>
                      </div>
                      
                      {/* Slider con color dinámico */}
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r"
                        style={{ 
                          backgroundImage: `linear-gradient(90deg, ${color}20 0%, ${color}60 100%)`
                        }}
                      >
                        <Slider
                          value={[score]}
                          onValueChange={(v) => handleScoreChange(key as 'D' | 'I' | 'S' | 'C', v)}
                          max={100}
                          step={5}
                          className="opacity-0 h-2"
                        />
                      </div>
                      
                      {/* Mini visualización de barra */}
                      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-200"
                          style={{ 
                            width: `${score}%`,
                            backgroundColor: color
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Caja de perfil dominante */}
              <div 
                className="mt-8 p-5 rounded-xl border-2 transition-all"
                style={{ 
                  backgroundColor: `${config.color}15`, 
                  border: `2px solid ${config.color}`,
                }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: config.color }}
                  >
                    {dominantType}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Tu Perfil</div>
                    <h3 className="text-white font-bold text-lg">{config.nombre}</h3>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{config.descripcion}</p>
              </div>
            </Card>
          </div>

          {/* COLUMNA 2: Radar */}
          <div className="lg:col-span-1">
            <Card className="p-8 bg-slate-800/50 border-slate-700 h-full">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span> Mapa Radar
              </h2>
              <div className="flex justify-center items-center h-full">
                <DespegaCerebralRadar 
                  scores={scores} 
                  showLegend={false}
                  size="md"
                />
              </div>
            </Card>
          </div>

          {/* COLUMNA 3: Distribución */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-slate-800/50 border-slate-700 h-full">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">📈</span> Distribución
              </h2>
              
              <div className="space-y-4">
                {Object.entries(DESPEGA_CEREBRAL_CONFIG)
                  .sort((a, b) => {
                    const scoreA = scores[a[0] as keyof typeof scores]
                    const scoreB = scores[b[0] as keyof typeof scores]
                    return scoreB - scoreA
                  })
                  .map(([key, cfg]) => {
                    const score = scores[key as keyof typeof scores]
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: cfg.color }}
                            >
                              {key}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white">{cfg.nombre}</div>
                              <div className="text-xs text-gray-400">{cfg.descripcion.split(',')[0]}</div>
                            </div>
                          </div>
                          <div 
                            className="font-bold text-sm px-2 py-1 rounded"
                            style={{ color: cfg.color }}
                          >
                            {score}%
                          </div>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: `${score}%`,
                              backgroundColor: cfg.color
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Legend de colores */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Referencia</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(DESPEGA_CEREBRAL_CONFIG).map(([key, cfg]) => (
                    <div key={key} className="text-center text-xs">
                      <div 
                        className="w-6 h-6 rounded-full mx-auto mb-1"
                        style={{ backgroundColor: cfg.color }}
                      />
                      <div className="text-gray-300">{key}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Full Width: Resumen del Perfil */}
        <div className="mb-8">
          <DespegaCerebralProfileSummary scores={scores} />
        </div>

        {/* Footer Info */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span>🎯</span> ¿Qué es Despega Cerebral?
              </h3>
              <p className="text-gray-400 text-sm">
                Un modelo de comportamiento de 4 dimensiones que ayuda a entender tu forma de actuar, 
                comunicar y relacionarte en contextos profesionales.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span>💡</span> Cómo usar esta herramienta
              </h3>
              <p className="text-gray-400 text-sm">
                Ajusta los sliders para ver cómo cambia tu perfil. Los valores suman 200% porque 
                puedes tener múltiples características dominantes.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
            
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
