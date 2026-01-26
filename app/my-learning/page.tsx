import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/app/utils/supabase/server"
import { ProgressWidget } from "@/components/progress-widget"
import { RecommendationsWidget } from "@/components/recommendations-widget"
import { CIPCapacityWidgetWrapper } from "@/components/cip-capacity-widget-wrapper"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, TrendingUp, Users, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Mi Aprendizaje",
  description: "Tu dashboard de progreso, logros y recomendaciones personalizadas",
}

export default async function MyLearningPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tu Aprendizaje</h1>
          <p className="text-lg text-muted-foreground">
            Nivel: <span className="font-semibold capitalize text-foreground">{profile.current_level}</span>
          </p>
        </div>

        {/* Progress Stats */}
        <section className="mb-8">
          <ProgressWidget />
        </section>

        {/* CIP Capacity Widget - Client Component Wrapper */}
        <section className="mb-8">
          <div className="border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-amber-500" />
              <h2 className="text-2xl font-bold">Tu Capacidad Efectiva</h2>
              <Link href="/cip-dashboard" className="ml-auto">
                <Button variant="outline" size="sm">Ver Panel Completo</Button>
              </Link>
            </div>
            <CIPCapacityWidgetWrapper userId={user.id} />
          </div>
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/leaderboard"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors group"
          >
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Leaderboard</h3>
              <p className="text-xs text-muted-foreground">Compite con otros usuarios</p>
            </div>
          </Link>

          <Link
            href="/biblioteca"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors group"
          >
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Biblioteca</h3>
              <p className="text-xs text-muted-foreground">Explora 120+ libros</p>
            </div>
          </Link>

          <Link
            href="/library-recommendations"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors group"
          >
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Próximos Pasos</h3>
              <p className="text-xs text-muted-foreground">Basados en tu nivel</p>
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
