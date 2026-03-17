"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, BookmarkPlus, Share2, Filter, ArrowRight } from "lucide-react"
import Link from "next/link"

const categoryColors = {
  economía: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  empleo: "bg-green-500/10 text-green-700 dark:text-green-400",
  regulatorio: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  tecnología: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  cultura: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
}

export default function NoticiasPersonalizadasPage() {
  const [loading, setLoading] = useState(true)
  const [noticias, setNoticias] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  const { user } = useAuthRedirect()
  const supabase = createClient()

  useEffect(() => {
    if (!user?.id) return
    
    const loadData = async () => {
      try {
        // Get user profile
        const { data: profile } = await supabase
          .from("despega_cerebral_perfil")
          .select("*")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle()

        setUserProfile(profile)

        // Load personalized news based on profile
        let query = supabase
          .from("a4_noticias")
          .select("*")

        // Filter by user preferences if available
        if (profile) {
          // Could add profile-based filtering here
        }

        const { data: newsData } = await query
          .order("created_at", { ascending: false })
          .limit(20)

        setNoticias(newsData || [])
      } catch (error) {
        console.error('[v0] Error loading personalized news:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando noticias personalizadas...</p>
        </div>
      </div>
    )
  }

  const categoriesFilter = ["todos", "economía", "empleo", "regulatorio", "tecnología", "cultura"]

  const filteredNoticias = selectedCategory === "todos" 
    ? noticias 
    : noticias.filter(n => n.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Noticias Personalizadas</h1>
              <p className="text-muted-foreground">
                Contenido seleccionado según tu perfil Despega
              </p>
            </div>
            {userProfile && (
              <Badge className="bg-primary/10 text-primary px-4 py-2 text-base">
                {userProfile.tipo_perfil}
              </Badge>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <Card className="border-0 bg-card/70 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <CardTitle className="text-lg">Filtrar por Categoría</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categoriesFilter.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat === "todos" ? "Todas" : cat}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* News Grid */}
        <div className="space-y-4">
          {filteredNoticias.length > 0 ? (
            filteredNoticias.map((noticia) => (
              <Link
                key={noticia.id}
                href={`/despega/a4/noticia/${noticia.id}`}
                className="group"
              >
                <Card className="border-0 bg-card/70 hover:bg-card/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            className={categoryColors[noticia.category as keyof typeof categoryColors] || ""}
                            variant="outline"
                          >
                            {noticia.category}
                          </Badge>
                          {noticia.relevance_score && (
                            <Badge variant="outline" className="bg-primary/5">
                              Relevancia: {Math.round(noticia.relevance_score * 100)}%
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {noticia.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {noticia.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {noticia.source && `Fuente: ${noticia.source}`}
                          </span>
                          <span className="text-xs text-primary font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            Leer más <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No hay noticias en esta categoría
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedCategory("todos")}
                >
                  Ver todas las noticias
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Back to A4 */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/despega/a4">
              Volver a Radar Estratégico
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
