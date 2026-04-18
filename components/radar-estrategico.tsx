"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Radar as RadarIcon, TrendingUp, AlertCircle, Zap } from "lucide-react"
import { getRadarTesisDelDia, getRadarNoticias, getWeakSignals } from "@/lib/supabase/a4-queries"

export function RadarEstrategico() {
  const [tesis, setTesis] = useState<any>(null)
  const [noticias, setNoticias] = useState<any[]>([])
  const [signals, setSignals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const { user } = useUser()

  useEffect(() => {
    if (!user?.id) return

    const loadData = async () => {
      try {
        const [tesisData, noticiasData, signalsData] = await Promise.all([
          getRadarTesisDelDia(),
          getRadarNoticias(5),
          getWeakSignals(user.id, 5),
        ])

        setTesis(tesisData)
        setNoticias(noticiasData)
        setSignals(signalsData)
      } catch (error) {
        console.error("[v0] Error loading radar data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  if (loading) {
    return (
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardContent className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tesis del Día */}
      {tesis && (
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple/10 rounded-lg">
                <RadarIcon className="w-6 h-6 text-purple" />
              </div>
              <div>
                <CardTitle className="text-xl">Tesis del Día</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(tesis.fecha || new Date()).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold text-balance">{tesis.tesis_estrategica}</p>

            {/* 7 Layers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-background/50 rounded-[28px] border border-border/50">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Delta Estratégico</h4>
                <p className="text-sm">{tesis.delta_estrategico || "Análisis disponible"}</p>
              </div>

              <div className="p-3 bg-background/50 rounded-[28px] border border-border/50">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Nivel de Energía</h4>
                <Badge variant="outline" className="text-xs">
                  {tesis.nivel_energía || "Neutral"}
                </Badge>
              </div>

              <div className="p-3 bg-background/50 rounded-[28px] border border-border/50">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">¿Qué Descuenta Mercado?</h4>
                <p className="text-sm">{tesis.que_descuenta_mercado || "Análisis disponible"}</p>
              </div>

              <div className="p-3 bg-background/50 rounded-[28px] border border-border/50">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Tension Narrativa</h4>
                <p className="text-sm">{tesis.tension_narrativa || "Análisis disponible"}</p>
              </div>

              <div className="p-3 bg-background/50 rounded-[28px] border border-border/50">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Ritmo Narrativo</h4>
                <Badge variant="outline" className="text-xs">
                  {tesis.ritmo_narrativo || "Variable"}
                </Badge>
              </div>

              <div className="p-3 bg-background/50 rounded-[28px] border border-border/50">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Impacto a Plazo</h4>
                <Badge variant="outline" className="text-xs">
                  {tesis.impacto_plazo || "Pendiente"}
                </Badge>
              </div>
            </div>

            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <h4 className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Consensus Score</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(tesis.consensus_score || 0) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {((tesis.consensus_score || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weak Signals */}
      {signals.length > 0 && (
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle>Señales Débiles Emergentes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {signals.map((signal) => (
              <div key={signal.id} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{signal.senal}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{signal.descripcion}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    Probabilidad: {((signal.probabilidad_activacion || 0) * 100).toFixed(0)}%
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Timeframe: {signal.timeframe_activacion || "Variable"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Latest News */}
      {noticias.length > 0 && (
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Noticias del Análisis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {noticias.map((noticia) => (
              <div key={noticia.id} className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-sm line-clamp-2">{noticia.titulo}</h4>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {noticia.capa_1_tesis ? "✓" : "−"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{noticia.descripcion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
