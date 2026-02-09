"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"
import Image from "next/image"

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
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <p className="text-lg text-gray-600">Personalizando tus recomendaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Libros Personalizados para Ti
          </h1>
          <p className="text-lg text-gray-600">
            Basados en tu perfil de personalidad, hemos seleccionado estos libros para potenciar tu crecimiento
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {books.map((book, index) => (
            <Card
              key={book.id}
              className="overflow-hidden hover:shadow-lg transition-shadow border-0 bg-white"
            >
              <CardContent className="p-0">
                <div className="relative h-64 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  {book.cover_url ? (
                    <Image
                      src={book.cover_url}
                      alt={book.title}
                      width={200}
                      height={300}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <BookOpen className="h-24 w-24 text-purple-400" />
                  )}
                  <div className="absolute top-4 right-4 bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-purple-600 font-semibold mb-3">
                    {book.author}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {book.description}
                  </p>

                  {book.key_takeaways && book.key_takeaways.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Puntos Clave
                      </p>
                      <ul className="space-y-1">
                        {book.key_takeaways.slice(0, 2).map((takeaway, i) => (
                          <li
                            key={i}
                            className="text-xs text-gray-600 flex items-start gap-2"
                          >
                            <span className="text-purple-600 mt-1">•</span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{book.pages} páginas</span>
                  </div>

                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => router.push(`/biblioteca/${book.id}`)}
                  >
                    Explorar Libro <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <p className="text-gray-600 mb-6">
            Estos libros están seleccionados especialmente para maximizar tu desarrollo personal
            <br /> según tu perfil único
          </p>

          <Button
            onClick={() => router.push("/dashboard?refetch=true")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            Ir a mi Dashboard
          </Button>

          <p className="text-sm text-gray-500 mt-4">
            Puedes explorar más libros en tu biblioteca en cualquier momento
          </p>
        </div>
      </div>
    </div>
  )
}
