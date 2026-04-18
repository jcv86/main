import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/app/utils/supabase/server"
import { ProgressWidget } from "@/components/progress-widget"
import { RecommendationsWidget } from "@/components/recommendations-widget"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, TrendingUp, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Mi Aprendizaje",
  description: "Tu dashboard de progreso, logros y recomendaciones personalizadas",
}

export default async function MyLearningPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Verificar si completó assessment
  const { data: profile } = await supabase
    .from("user_learning_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!profile) {
    redirect("/personalized-learning")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/5 via-blue/5 to-muted/10 dark:from-background dark:via-muted/90 dark:to-muted/80">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple/10 to-blue/10 dark:from-purple/30 dark:to-blue-900/30 rounded-full mb-4">
            <p className="text-sm font-semibold text-purple dark:text-purple-300">Tu Progreso de Aprendizaje</p>
          </div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple to-blue bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">Tu Aprendizaje</h1>
          <p className="text-lg text-muted/70 dark:text-muted/30">
            Nivel: <span className="font-bold text-purple dark:text-purple/40">{profile.current_level}</span>
          </p>
        </div>

        {/* Progress Stats */}
        <section className="mb-8">
          <ProgressWidget />
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/leaderboard"
            className="flex items-center gap-3 p-4 border-2 border-purple/20 dark:border-purple/50 rounded-lg bg-white dark:bg-background hover:bg-purple/5 dark:hover:bg-muted/80 transition-colors group shadow-sm"
          >
            <div className="p-2 bg-purple/10 dark:bg-purple/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple/50 transition-colors">
              <Users className="h-5 w-5 text-purple dark:text-purple/40" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-muted/90 dark:text-white">Leaderboard</h3>
              <p className="text-xs text-muted/60 dark:text-muted/40">Compite con otros usuarios</p>
            </div>
          </Link>

          <Link
            href="/biblioteca"
            className="flex items-center gap-3 p-4 border-2 border-blue/20 dark:border-blue/50 rounded-lg bg-white dark:bg-background hover:bg-blue/5 dark:hover:bg-muted/80 transition-colors group shadow-sm"
          >
            <div className="p-2 bg-blue/10 dark:bg-blue/30 rounded-lg group-hover:bg-blue/20 dark:group-hover:bg-blue-800/50 transition-colors">
              <BookOpen className="h-5 w-5 text-blue dark:text-blue/40" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-muted/90 dark:text-white">Biblioteca</h3>
              <p className="text-xs text-muted/60 dark:text-muted/40">Explora 120+ libros</p>
            </div>
          </Link>

          <Link
            href="/library-recommendations"
            className="flex items-center gap-3 p-4 border-2 border-blue/20 dark:border-cyan-900/50 rounded-lg bg-white dark:bg-background hover:bg-blue/5 dark:hover:bg-muted/80 transition-colors group shadow-sm"
          >
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/50 transition-colors">
              <TrendingUp className="h-5 w-5 text-cyan-700 dark:text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-muted/90 dark:text-white">Próximos Pasos</h3>
              <p className="text-xs text-muted/60 dark:text-muted/40">Basados en tu nivel</p>
            </div>
          </Link>
        </section>

        {/* Recommendations */}
        <section>
          <RecommendationsWidget />
        </section>
      </div>
    </div>
  )
}
