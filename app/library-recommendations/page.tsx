import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/app/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Libros Recomendados para Ti",
  description: "Libros seleccionados especialmente según tu nivel y preferencias",
}

export default async function RecommendedBooksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase
    .from("user_learning_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!profile) {
    redirect("/personalized-learning")
  }

  // Obtener libros completados
  const { data: completedBooks } = await supabase
    .from("user_progress")
    .select("book_id")
    .eq("user_id", user.id)
    .eq("status", "completed")

  const completedIds = completedBooks?.map(b => b.book_id) || []

  // Obtener recomendaciones
  let query = supabase
    .from("knowledge_base")
    .select("id, title, author, category, difficulty_level, estimated_read_time")

  if (completedIds.length > 0) {
    query = query.not("id", "in", `(${completedIds.join(",")})`)
  }

  if (profile.current_level === "beginner") {
    query = query.eq("difficulty_level", "Básico")
  } else if (profile.current_level === "intermediate") {
    query = query.in("difficulty_level", ["Intermedio", "Básico"])
  }

  if (profile.preferred_categories?.length > 0) {
    query = query.in("category", profile.preferred_categories)
  }

  const { data: recommendations } = await query.limit(50)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 via-cyan-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue/10 to-cyan-100 dark:from-blue/30 dark:to-cyan-900/30 rounded-full mb-4">
            <p className="text-sm font-semibold text-blue dark:text-blue/30">Personalizadas para ti</p>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-8 w-8 fill-yellow-500 text-yellow-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue to-blue bg-clip-text text-transparent dark:from-blue/40 dark:to-cyan-400">Libros Recomendados</h1>
          </div>
          <p className="text-lg text-muted/70 dark:text-muted/30 font-medium">
            Basado en tu nivel <span className="font-semibold capitalize">{profile.current_level}</span> y tus intereses en {profile.preferred_categories?.join(", ") || "varias categorías"}
          </p>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((book, index) => (
              <Link
                key={book.id}
                href={`/biblioteca/${book.id}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {(100 - index * 3)}% match
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {book.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {book.difficulty_level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {book.estimated_read_time}min
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      Ver Libro
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">
                No hay más libros recomendados en este momento. ¡Has completado muchos!
              </p>
              <Button variant="outline" asChild className="mt-4 bg-transparent">
                <Link href="/biblioteca">Ver toda la biblioteca</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
