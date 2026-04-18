'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, TrendingUp, Zap, Crosshair, Eye, Radar } from 'lucide-react'

interface RadarTesisDia {
  id: string
  fecha: string
  tesis_estrategica: string
  delta_estrategico: string
  nivel_energía: 'Alta' | 'Confirmación' | 'Contexto'
  que_descuento_mercado: string
  consensus_score: number
  tension_narrativa?: string
  ritmo_narrativo: 'Acelerando' | 'Estabilizado' | 'Perdiendo fuerza'
  impacto_plazo: 'Corto' | 'Mediano' | 'Largo'
}

interface RadarNoticia {
  id: string
  titulo: string
  descripcion: string
  fuente: string
  url?: string
  capa_1_tesis: string
  capa_2_delta: string
  capa_3_nivel_energia: 'Alta' | 'Confirmación' | 'Contexto'
  capa_4_descuento_mercado: string
  capa_5_consensus: string
  capa_6_ritmo_narrativo: 'Acelerando' | 'Estabilizado' | 'Perdiendo fuerza'
  capa_7_impacto_plazo: 'Corto' | 'Mediano' | 'Largo'
}

export function RadarEstrategico() {
  const [tesisDia, setTesisDia] = useState<RadarTesisDia | null>(null)
  const [noticias, setNoticias] = useState<RadarNoticia[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNoticia, setSelectedNoticia] = useState<RadarNoticia | null>(null)

  useEffect(() => {
    loadRadarData()
  }, [])

  const loadRadarData = async () => {
    try {
      const response = await fetch('/rest/radar-estrategico-data')
      if (!response.ok) throw new Error('Failed to load radar data')

      const data = await response.json()
      setTesisDia(data.tesisDia)
      setNoticias(data.noticias)
    } catch (error) {
      console.error('[v0] Error loading radar:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen animate-pulse" />

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-50 p-6 space-y-8">
      {/* Tesis del Día - Main Strategic Statement */}
      {tesisDia && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Radar className="w-8 h-8 text-blue/40" />
            <h1 className="text-4xl font-bold text-balance">Lectura Estratégica del Día</h1>
          </div>

          <Card className="bg-slate-800 border-blue/50/30">
            <CardHeader>
              <CardTitle className="text-2xl">{tesisDia.tesis_estrategica}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Capa 1: Tesis */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider">
                  Tesis Estratégica
                </h3>
                <p className="text-lg leading-relaxed text-slate-200">{tesisDia.tesis_estrategica}</p>
              </div>

              {/* Capa 2: Delta */}
              <div className="space-y-2 border-t border-slate-700 pt-4">
                <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">
                  Delta vs Ayer
                </h3>
                <p className="text-base text-slate-300">{tesisDia.delta_estrategico}</p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-700 pt-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase">Nivel de Energía</p>
                  <Badge
                    variant="outline"
                    className={`mt-2 ${
                      tesisDia.nivel_energía === 'Alta'
                        ? 'bg-red/50/20 text-red-300 border-red/50/50'
                        : tesisDia.nivel_energía === 'Confirmación'
                          ? 'bg-blue-500/20 text-blue-300 border-blue/50/50'
                          : 'bg-slate-500/20 text-slate-300 border-slate-500/50'
                    }`}
                  >
                    {tesisDia.nivel_energía}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase">Ritmo Narrativo</p>
                  <Badge variant="outline" className="mt-2 bg-purple-500/20 text-purple/30 border-purple-500/50">
                    {tesisDia.ritmo_narrativo}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase">Impacto</p>
                  <Badge variant="outline" className="mt-2 bg-green-500/20 text-green-300 border-green/50">
                    {tesisDia.impacto_plazo} Plazo
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase">Consenso</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: `${tesisDia.consensus_score * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold">{Math.round(tesisDia.consensus_score * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Capa 4: Qué descuenta el mercado */}
              <div className="space-y-2 border-t border-slate-700 pt-4">
                <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                  Qué Descuenta el Mercado
                </h3>
                <p className="text-base text-slate-300">{tesisDia.que_descuento_mercado}</p>
              </div>

              {/* Capa 5: Tensión narrativa */}
              {tesisDia.tension_narrativa && (
                <div className="space-y-2 border-t border-slate-700 pt-4">
                  <h3 className="text-sm font-semibold text-orange-300 uppercase tracking-wider">
                    Tensión Narrativa
                  </h3>
                  <p className="text-base text-slate-300">{tesisDia.tension_narrativa}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Noticias del Radar - Individual Stories */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Señales del Radar</h2>

        <Tabs defaultValue="todas" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="todas">Todas ({noticias.length})</TabsTrigger>
            <TabsTrigger value="alta">Alta Energía</TabsTrigger>
            <TabsTrigger value="acelerando">Acelerando</TabsTrigger>
            <TabsTrigger value="weak-signals">Weak Signals</TabsTrigger>
          </TabsList>

          {/* Tab: Todas */}
          <TabsContent value="todas" className="space-y-4">
            {noticias.map((noticia) => (
              <RadarNoticiaCard
                key={noticia.id}
                noticia={noticia}
                isSelected={selectedNoticia?.id === noticia.id}
                onSelect={setSelectedNoticia}
              />
            ))}
          </TabsContent>

          {/* Tab: Alta Energía */}
          <TabsContent value="alta" className="space-y-4">
            {noticias
              .filter((n) => n.capa_3_nivel_energia === 'Alta')
              .map((noticia) => (
                <RadarNoticiaCard
                  key={noticia.id}
                  noticia={noticia}
                  isSelected={selectedNoticia?.id === noticia.id}
                  onSelect={setSelectedNoticia}
                />
              ))}
          </TabsContent>

          {/* Tab: Acelerando */}
          <TabsContent value="acelerando" className="space-y-4">
            {noticias
              .filter((n) => n.capa_6_ritmo_narrativo === 'Acelerando')
              .map((noticia) => (
                <RadarNoticiaCard
                  key={noticia.id}
                  noticia={noticia}
                  isSelected={selectedNoticia?.id === noticia.id}
                  onSelect={setSelectedNoticia}
                />
              ))}
          </TabsContent>

          {/* Tab: Weak Signals */}
          <TabsContent value="weak-signals" className="space-y-4">
            <div className="text-slate-300 p-4 border border-dashed border-slate-600 rounded-lg">
              Weak signals están siendo procesadas...
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detalle de Noticia Seleccionada */}
      {selectedNoticia && (
        <RadarNoticiaDetail noticia={selectedNoticia} onClose={() => setSelectedNoticia(null)} />
      )}
    </div>
  )
}

interface RadarNoticiaCardProps {
  noticia: RadarNoticia
  isSelected: boolean
  onSelect: (noticia: RadarNoticia) => void
}

function RadarNoticiaCard({ noticia, isSelected, onSelect }: RadarNoticiaCardProps) {
  const getNivelColor = (nivel: string) => {
    if (nivel === 'Alta') return 'bg-red/50/20 text-red-300 border-red/50/50'
    if (nivel === 'Confirmación') return 'bg-blue-500/20 text-blue-300 border-blue/50/50'
    return 'bg-slate-500/20 text-slate-300 border-slate-500/50'
  }

  return (
    <Card
      onClick={() => onSelect(noticia)}
      className={`bg-slate-800 border-slate-700 cursor-pointer transition-all hover:border-blue/50/50 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-100">{noticia.titulo}</h3>
            <Badge variant="outline" className="shrink-0">
              {noticia.fuente}
            </Badge>
          </div>

          <p className="text-sm text-slate-400">{noticia.descripcion}</p>

          {/* Mini 7-Capas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Badge variant="outline" className={getNivelColor(noticia.capa_3_nivel_energia)}>
              {noticia.capa_3_nivel_energia}
            </Badge>
            <Badge variant="outline" className="bg-purple-500/20 text-purple/30 border-purple-500/50">
              {noticia.capa_6_ritmo_narrativo.slice(0, 10)}
            </Badge>
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green/50">
              {noticia.capa_7_impacto_plazo}
            </Badge>
            <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
              Ver más →
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface RadarNoticiaDetailProps {
  noticia: RadarNoticia
  onClose: () => void
}

function RadarNoticiaDetail({ noticia, onClose }: RadarNoticiaDetailProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full bg-slate-900 rounded-t-xl p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{noticia.titulo}</h2>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Las 7 Capas en Profundidad */}
        <div className="space-y-6">
          {/* Capa 1 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-blue-300 uppercase">1. Tesis</h4>
            <p className="text-base text-slate-300">{noticia.capa_1_tesis}</p>
          </div>

          {/* Capa 2 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-amber-300 uppercase">2. Delta vs Ayer</h4>
            <p className="text-base text-slate-300">{noticia.capa_2_delta}</p>
          </div>

          {/* Capa 3-7 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase">3. Nivel de Energía</p>
              <p className="mt-2 text-base font-semibold text-slate-200">{noticia.capa_3_nivel_energia}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">6. Ritmo Narrativo</p>
              <p className="mt-2 text-base font-semibold text-slate-200">{noticia.capa_6_ritmo_narrativo}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">7. Impacto Plazo</p>
              <p className="mt-2 text-base font-semibold text-slate-200">{noticia.capa_7_impacto_plazo}</p>
            </div>
          </div>

          {/* Capa 4 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-cyan-300 uppercase">4. Qué Descuenta el Mercado</h4>
            <p className="text-base text-slate-300">{noticia.capa_4_descuento_mercado}</p>
          </div>

          {/* Capa 5 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-orange-300 uppercase">5. Consenso y Tensión</h4>
            <p className="text-base text-slate-300">{noticia.capa_5_consensus}</p>
          </div>

          {noticia.url && (
            <Button className="w-full" asChild>
              <a href={noticia.url} target="_blank" rel="noopener noreferrer">
                Leer artículo original
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
