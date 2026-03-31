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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full mb-4">
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">Tu Progreso de Aprendizaje</p>
          </div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">Tu Aprendizaje</h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Nivel: <span className="font-bold text-purple-700 dark:text-purple-400">{profile.current_level}</span>
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
            className="flex items-center gap-3 p-4 border-2 border-purple-200 dark:border-purple-900/50 rounded-lg bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors group shadow-sm"
          >
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
              <Users className="h-5 w-5 text-purple-700 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Leaderboard</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Compite con otros usuarios</p>
            </div>
          </Link>

          <Link
            href="/biblioteca"
            className="flex items-center gap-3 p-4 border-2 border-blue-200 dark:border-blue-900/50 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors group shadow-sm"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
              <BookOpen className="h-5 w-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Biblioteca</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Explora 120+ libros</p>
            </div>
          </Link>

          <Link
            href="/library-recommendations"
            className="flex items-center gap-3 p-4 border-2 border-cyan-200 dark:border-cyan-900/50 rounded-lg bg-white dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-slate-800 transition-colors group shadow-sm"
          >
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/50 transition-colors">
              <TrendingUp className="h-5 w-5 text-cyan-700 dark:text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Próximos Pasos</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Basados en tu nivel</p>
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
