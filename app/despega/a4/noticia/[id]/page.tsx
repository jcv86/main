"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Share2,
  Bookmark,
  ChevronLeft,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  Loader2,
  Calendar,
  User,
} from "lucide-react"
import Link from "next/link"

interface NewsArticle {
  id: string
  title: string
  content: string
  source: string
  category: string
  published_at: string
  relevance_score?: number
  summary: string
  tags: string[]
}

interface Interpretation {
  title: string
  description: string
  impact: string
  confidence: number
}

interface SuggestedActions {
  action: string
  impact: "alto" | "medio" | "bajo"
  timeframe: string
  priority: boolean
}

const categoryColors = {
  economía: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  empleo: "bg-green-500/10 text-green-700 dark:text-green-400",
  regulatorio: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  tecnología: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  cultura: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
}

export default function NewsDetailPage() {
  const params = useParams()
  const newsId = params.id as string
  const [loading, setLoading] = useState(true)
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const { user } = useAuthRedirect()
  const supabase = createClient()

  useEffect(() => {
    if (!user?.id || !newsId) return

    const loadData = async () => {
      try {
        // Load article
        const { data: articleData } = await supabase
          .from("a4_noticias")
          .select("*")
          .eq("id", newsId)
          .maybeSingle()

        setArticle(articleData)

        // Load user profile
        const { data: profile } = await supabase
          .from("despega_cerebral_perfil")
          .select("*")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle()

        setUserProfile(profile)

        // Check if user has saved this article
        if (articleData) {
          const { data: saved } = await supabase
            .from("user_saved_news")
            .select("id")
            .eq("user_id", user.id)
            .eq("news_id", articleData.id)
            .limit(1)
            .maybeSingle()

          setSaved(!!saved)
        }
      } catch (error) {
        console.error("[v0] Error loading article:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.id, newsId])

  const handleSave = async () => {
    if (!user?.id || !article) return

    try {
      if (saved) {
        await supabase
          .from("user_saved_news")
          .delete()
          .eq("user_id", user.id)
          .eq("news_id", article.id)
      } else {
        await supabase.from("user_saved_news").insert({
          user_id: user.id,
          news_id: article.id,
          saved_at: new Date().toISOString(),
        })
      }
      setSaved(!saved)
    } catch (error) {
      console.error("[v0] Error saving article:", error)
    }
  }

  // Mock interpretation data
  const interpretations: Interpretation[] = [
    {
      title: "Impacto en Inflación",
      description:
        "Este evento afecta las expectativas de inflación a corto plazo. Si bien puede parecer un hecho aislado, refleja patrones estructurales en la economía.",
      impact: "Una mayor inflación erosiona el poder adquisitivo. Tu dinero vale menos cada mes.",
      confidence: 85,
    },
    {
      title: "Implicancias para el Mercado Laboral",
      description:
        "Las decisiones económicas de hoy impactan las contrataciones de mañana. Empresas más cautelosas pueden frenar expansión.",
      impact:
        "Menos crecimiento económico puede llevar a menor creación de empleo y presión en salarios reales.",
      confidence: 72,
    },
  ]

  const suggestedActions: SuggestedActions[] = [
    {
      action: "Revisa tus inversiones y su exposición a activos que reaccionan a inflación",
      impact: "alto",
      timeframe: "Esta semana",
      priority: true,
    },
    {
      action: "Consulta tasas de crédito si planeas comprar algo grande",
      impact: "medio",
      timeframe: "Esta semana",
      priority: true,
    },
    {
      action: "Evalúa tu presupuesto mensual: ¿tus gastos han subido más que tu sueldo?",
      impact: "medio",
      timeframe: "Este mes",
      priority: false,
    },
    {
      action: "Considera un fondo en pesos para protegerte de variaciones en UF/dólar",
      impact: "bajo",
      timeframe: "Próximas semanas",
      priority: false,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando noticia...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50 flex items-center justify-center">
        <Card className="bg-card/70 backdrop-blur-sm border-0">
          <CardContent className="pt-12 pb-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Noticia no encontrada</p>
            <Button asChild>
              <Link href="/despega/a4">Volver al Radar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const publishDate = new Date(article.published_at).toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/despega/a4">
              <ChevronLeft className="w-4 h-4" />
              Volver
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSave}
              className={
                saved
                  ? "bg-primary/10 text-primary border-primary/30"
                  : ""
              }
            >
              <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge
              className={categoryColors[article.category as keyof typeof categoryColors] || ""}
              variant="outline"
            >
              {article.category}
            </Badge>
            {article.relevance_score && (
              <Badge variant="outline" className="bg-primary/5">
                Relevancia: {Math.round(article.relevance_score * 100)}%
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {publishDate}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.source}
            </div>
          </div>

          <Separator className="my-6" />

          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {article.summary}
          </p>
        </div>

        {/* Article Content */}
        <Card className="border-0 bg-card/70 backdrop-blur-sm mb-8">
          <CardContent className="pt-6">
            <div className="prose prose-invert max-w-none">
              <p className="leading-relaxed text-foreground whitespace-pre-wrap">
                {article.content}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="interpretacion" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="interpretacion">Interpretación</TabsTrigger>
            <TabsTrigger value="acciones">Qué Hacer</TabsTrigger>
            <TabsTrigger value="contexto">Contexto</TabsTrigger>
          </TabsList>

          {/* Interpretation Tab */}
          <TabsContent value="interpretacion" className="space-y-4 mt-6">
            {interpretations.map((interp, idx) => (
              <Card key={idx} className="border-0 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{interp.title}</CardTitle>
                    <Badge variant="outline" className="bg-primary/5">
                      {interp.confidence}% confianza
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Análisis</h4>
                    <p className="text-sm text-muted-foreground">{interp.description}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm font-medium">
                      <TrendingUp className="w-4 h-4 inline mr-2 text-primary" />
                      {interp.impact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="acciones" className="space-y-4 mt-6">
            <div className="space-y-3">
              {suggestedActions.map((action, idx) => (
                <Card
                  key={idx}
                  className={`border-0 backdrop-blur-sm transition-all ${
                    action.priority
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-card/70 border border-border"
                  }`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {action.priority ? (
                          <Zap className="w-5 h-5 text-primary" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-2">{action.action}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={
                              action.impact === "alto"
                                ? "bg-red-500/10 text-red-700 dark:text-red-400"
                                : action.impact === "medio"
                                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                  : "bg-green-500/10 text-green-700 dark:text-green-400"
                            }
                          >
                            Impacto {action.impact}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {action.timeframe}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-0 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="text-base">Prioridad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Empieza con las acciones marcadas con <Zap className="w-4 h-4 inline text-primary" /> esta semana.
                  Las demás puedes evaluarlas en tus tiempos.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Context Tab */}
          <TabsContent value="contexto" className="space-y-4 mt-6">
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Contexto Histórico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Este evento se relaciona con tendencias previas en la economía chilena. Para entender su
                  verdadero impacto, conviene considerar:
                </p>
                <ul className="space-y-2">
                  {["Decisiones del Banco Central en los últimos 6 meses", 
                    "Comportamiento del dólar y tasas de cambio",
                    "Indicadores de empleo previos",
                    "Comparación con la región (Argentina, Perú)"
                  ].map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {article.tags && article.tags.length > 0 && (
              <Card className="border-0 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Etiquetas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Related Articles Hint */}
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-accent/5 mt-12">
          <CardContent className="pt-6">
            <p className="text-sm mb-4">
              ¿Quieres seguir aprendiendo sobre este tema?
            </p>
            <Button asChild variant="default" className="w-full">
              <Link href="/despega/a4/noticias-personalizadas">
                Ver más noticias como esta
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Back to Radar */}
        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/despega/a4">Volver a Radar Estratégico</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
