"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowRight, BookOpen, Sparkles, Zap, Brain, Users, Target } from "lucide-react"
import Image from "next/image"
import { CompetencyRadarChart } from "@/components/competency-radar-chart"

interface Book {
  id: string
  title: string
  author: string
  description: string
  cover_url: string
  pages: number
  key_takeaways: string[]
}

interface DISCProfile {
  d_score: number
  i_score: number
  s_score: number
  c_score: number
}

export default function BookRecommendationsPage() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<DISCProfile | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const supabase = createClient()
        
        // Get user's DISC profile
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/")
          return
        }

        // Get the latest DISC result
        const { data: discData } = await supabase
          .from("test_results")
          .select("result_data")
          .eq("user_id", user.id)
          .eq("test_type", "disc")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (discData) {
          const result = discData.result_data
          setUserProfile({
            d_score: result.d_score || 0,
            i_score: result.i_score || 0,
            s_score: result.s_score || 0,
            c_score: result.c_score || 0,
          })

          // Determine dominant dimension
          const scores = {
            d: result.d_score || 0,
            i: result.i_score || 0,
            s: result.s_score || 0,
            c: result.c_score || 0,
          }
          
          const maxScore = Math.max(...Object.values(scores))
          const dominantDimensions = Object.entries(scores)
            .filter(([_, score]) => score >= maxScore - 10)
            .map(([dim]) => dim)

          // Fetch recommended books based on DISC profile
          const { data: bookData } = await supabase
            .from("books")
            .select("*")
            .or(
              dominantDimensions
                .map((dim) => {
                  if (dim === "d") return `tags.ilike.%liderazgo%`
                  if (dim === "i") return `tags.ilike.%influencia%`
                  if (dim === "s") return `tags.ilike.%armonía%`
                  if (dim === "c") return `tags.ilike.%excelencia%`
                })
                .join(",")
            )
            .limit(10)

          // If not enough books with tags, get popular ones
          if (!bookData || bookData.length < 2) {
            const { data: popularBooks } = await supabase
              .from("books")
              .select("*")
              .order("popularity_score", { ascending: false })
              .limit(10)

            setBooks(popularBooks?.slice(0, 2) || [])
          } else {
            setBooks(bookData.slice(0, 2))
          }
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-purple mx-auto mb-4 animate-spin" />
          <p className="text-lg text-muted-foreground">Personalizando tus recomendaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Tus Insights Personalizados
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Radar + Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Radar Chart Section */}
            {userProfile && (
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <CompetencyRadarChart
                    data={[
                      {
                        name: "Dominancia",
                        value: userProfile.d_score,
                        fullMark: 100,
                      },
                      {
                        name: "Influencia",
                        value: userProfile.i_score,
                        fullMark: 100,
                      },
                      {
                        name: "Estabilidad",
                        value: userProfile.s_score,
                        fullMark: 100,
                      },
                      {
                        name: "Cumplimiento",
                        value: userProfile.c_score,
                        fullMark: 100,
                      },
                    ]}
                    title="Tu Perfil DISC"
                    description=""
                    strokeColor="#a855f7"
                    fillColor="#a855f7"
                    height={300}
                  />
                </CardContent>
              </Card>
            )}

            {/* Development Path Section */}
            <Card className="bg-background">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Tu Ruta de Desarrollo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted">
                  Basado en tu perfil DISC y 120+ libros de desarrollo profesional.
                </p>
                <div className="bg-white p-3 rounded-[28px] border border-blue/30">
                  <p className="text-xs font-semibold text-indigo-700 mb-1">
                    📍 Enfoque Prioritario
                  </p>
                  <p className="text-xs text-muted">
                    Inteligencia emocional en tu estilo de liderazgo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 2 Books */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Tus 2 Libros Recomendados</h2>
            
            {books.length > 0 ? (
              <div className="grid gap-6">
                {books.map((book, index) => (
                  <Card
                    key={book.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow border-0 bg-white flex flex-row h-64"
                  >
                    {/* Book Cover */}
                    <div className="relative w-40 flex-shrink-0 bg-background">
                      {book.cover_url ? (
                        <Image
                          src={book.cover_url}
                          alt={book.title}
                          width={160}
                          height={240}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <BookOpen className="h-16 w-16 text-purple/40" />
                      )}
                      <div className="absolute top-3 right-3 bg-purple text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>

                    {/* Book Info */}
                    <CardContent className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-sm text-purple font-semibold mb-3">
                          {book.author}
                        </p>

                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {book.description}
                        </p>

                        {book.key_takeaways && book.key_takeaways.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                              Puntos Clave
                            </p>
                            <ul className="space-y-1">
                              {book.key_takeaways.slice(0, 2).map((takeaway, i) => (
                                <li
                                  key={i}
                                  className="text-xs text-muted-foreground flex items-start gap-2"
                                >
                                  <span className="text-purple mt-0.5">•</span>
                                  <span className="line-clamp-1">{takeaway}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-muted/20">
                        <span className="text-xs text-muted-foreground">{book.pages} páginas</span>
                        <Button
                          size="sm"
                          className="bg-purple/80 hover:bg-purple/70 text-white"
                          onClick={() => router.push(`/biblioteca/${book.id}`)}
                        >
                          Explorar <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 border-0 bg-white text-center">
                <p className="text-muted-foreground">Cargando recomendaciones...</p>
              </Card>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4 pt-8 border-t border-muted/20">
          <Button
            onClick={() => router.push("/dashboard?refetch=true")}
            className="bg-blue/80 hover:bg-blue/70 text-white px-8 py-3 text-base"
            size="lg"
          >
            Ir a mi Dashboard
          </Button>
          <p className="text-sm text-muted-foreground">
            Explorar más libros en tu biblioteca en cualquier momento
          </p>
        </div>
      </div>
    </div>
  )
}
