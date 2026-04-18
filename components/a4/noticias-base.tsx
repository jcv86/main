"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookmarkPlus, Share2 } from "lucide-react"
import Link from "next/link"

interface NoticiaBase {
  id: string
  title: string
  category: "economía" | "empleo" | "regulatorio" | "tecnología" | "cultura"
  summary: string
  impact: "alta" | "media" | "baja"
  timeToRead: number
  relevance: string
}

interface NoticiasBaseProps {
  noticias?: NoticiaBase[]
  isLoading?: boolean
}

const categoryColors = {
  economía: "bg-blue-500/10 text-blue dark:text-blue/40",
  empleo: "bg-green-500/10 text-green dark:text-green/40",
  regulatorio: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  tecnología: "bg-purple-500/10 text-purple-700 dark:text-purple/40",
  cultura: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
}

const impactBadges = {
  alta: "bg-red/50/10 text-red",
  media: "bg-amber-500/10 text-amber-700",
  baja: "bg-green-500/10 text-green",
}

export function NoticiasBase({ 
  noticias = [
    {
      id: "1",
      title: "Sube el desempleo juvenil en 2.1%",
      category: "empleo" as const,
      summary: "Más competencia en roles de entrada. Importancia de diferenciar se con evidencia práctica y entrenamientos específicos.",
      impact: "alta",
      timeToRead: 5,
      relevance: "Todos deben saber esto"
    },
    {
      id: "2",
      title: "Banco Central mantiene TPM en 6.25%",
      category: "economía" as const,
      summary: "Decisión de política monetaria. Impacto en tasas de crédito y contratación empresarial.",
      impact: "alta",
      timeToRead: 4,
      relevance: "Contexto económico global"
    },
    {
      id: "3",
      title: "Nuevas reglas de IA en mercado laboral",
      category: "regulatorio" as const,
      summary: "Gobierno publica directrices. Impacto en cómo empresas usan IA para hiring.",
      impact: "media",
      timeToRead: 6,
      relevance: "Cambio estructural"
    }
  ],
  isLoading = false
}: NoticiasBaseProps) {
  return (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Noticias Clave para Todos</CardTitle>
          <Badge variant="outline">6 x Semana</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Lo que todo profesional chileno debería entender este mes
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))
          ) : (
            noticias.map((noticia) => (
              <Link
                key={noticia.id}
                href={`/despega/a4/noticia/${noticia.id}`}
                className="group"
              >
                <div className="p-4 rounded-[28px] border border-border/50 hover:border-border bg-background/30 group-hover:bg-background/60 transition-colors cursor-pointer">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-2 group-hover:text-purple transition-colors">
                        {noticia.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          className={categoryColors[noticia.category]}
                          variant="outline"
                        >
                          {noticia.category.charAt(0).toUpperCase() + noticia.category.slice(1)}
                        </Badge>
                        <Badge 
                          className={impactBadges[noticia.impact]}
                          variant="outline"
                        >
                          Impacto {noticia.impact}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {noticia.timeToRead} min
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-muted-foreground mb-4">
                    {noticia.summary}
                  </p>

                  {/* Relevance & Actions */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-purple/70">
                      📌 {noticia.relevance}
                    </p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        className="p-1.5 hover:bg-purple/10 rounded transition-colors"
                      >
                        <BookmarkPlus className="w-4 h-4 text-muted-foreground hover:text-purple" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        className="p-1.5 hover:bg-purple/10 rounded transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-muted-foreground hover:text-purple" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* CTA */}
        <Button
          asChild
          variant="outline"
          className="w-full mt-6"
        >
          <Link href="/despega/a4/noticias">
            Ver todas las noticias
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
