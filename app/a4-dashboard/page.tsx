import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadarEstrategico } from "@/components/radar-estrategico"
import { NoticiasFeed } from "@/components/noticias-feed"
import { GamifiedTests } from "@/components/gamified-tests"
import { PruebasTab } from "@/components/pruebas-tab"
import { Biblioteca } from "@/components/biblioteca"
import { EngagementDashboard } from "@/components/engagement-dashboard"
import { PointsBadgesSystem } from "@/components/points-badges-system"
import { PersonalizationProfile } from "@/components/personalization-profile"

export const metadata: Metadata = {
  title: "A4 Dashboard - Despega",
  description: "Centro de análisis estratégico con radar del mercado, noticias curadas y recursos",
}

export default function A4DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-5xl font-bold text-balance text-white">Centro de Aprendizaje A4</h1>
          <p className="text-lg text-white/85">
            Análisis estratégico, noticias curadas, pruebas interactivas y recursos verificados
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="radar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8 bg-background/50 backdrop-blur-sm border border-border overflow-x-auto">
            <TabsTrigger value="radar" className="text-xs sm:text-sm">
              📡 Radar
            </TabsTrigger>
            <TabsTrigger value="noticias" className="text-xs sm:text-sm">
              📰 Noticias
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-xs sm:text-sm">
              ✅ Pruebas
            </TabsTrigger>
            <TabsTrigger value="casos" className="text-xs sm:text-sm">
              📖 Casos
            </TabsTrigger>
            <TabsTrigger value="biblioteca" className="text-xs sm:text-sm">
              📚 Biblioteca
            </TabsTrigger>
            <TabsTrigger value="engagement" className="text-xs sm:text-sm">
              🎯 Progreso
            </TabsTrigger>
            <TabsTrigger value="badges" className="text-xs sm:text-sm">
              🏆 Insignias
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              👤 Perfil
            </TabsTrigger>
          </TabsList>

          {/* Radar Tab */}
          <TabsContent value="radar" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Radar Estratégico del Día</h2>
              <p className="text-muted-foreground">
                Análisis en profundidad de tesis estratégicas, señales débiles emergentes y noticias clave
              </p>
            </div>
            <RadarEstrategico />
          </TabsContent>

          {/* Noticias Tab */}
          <TabsContent value="noticias" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Centro de Noticias</h2>
              <p className="text-muted-foreground">
                Últimas noticias clasificadas, buscables y curadas según el análisis estratégico
              </p>
            </div>
            <NoticiasFeed />
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Pruebas Gamificadas</h2>
              <p className="text-muted-foreground">
                Completa pruebas interactivas para reforzar tu aprendizaje y ganar puntos
              </p>
            </div>
            <GamifiedTests />
          </TabsContent>

          {/* Casos de Estudio Tab */}
          <TabsContent value="casos" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Casos de Estudio</h2>
              <p className="text-muted-foreground">
                Aprende de casos reales: desafíos, estrategias y resultados de empresas exitosas
              </p>
            </div>
            <PruebasTab />
          </TabsContent>

          {/* Biblioteca Tab */}
          <TabsContent value="biblioteca" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Biblioteca Curada</h2>
              <p className="text-muted-foreground">
                Recursos verificados: artículos, libros, videos y herramientas para profundizar
              </p>
            </div>
            <Biblioteca />
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Tu Progreso y Engagement</h2>
              <p className="text-muted-foreground">
                Sigue tu progreso, racha de lectura, pruebas completadas y puntos ganados
              </p>
            </div>
            <EngagementDashboard />
          </TabsContent>

          {/* Badges & Points Tab */}
          <TabsContent value="badges" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Insignias y Puntos</h2>
              <p className="text-muted-foreground">
                Desbloquea insignias, gana puntos y compite en el ranking global
              </p>
            </div>
            <PointsBadgesSystem />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Tu Perfil Personalizado</h2>
              <p className="text-muted-foreground">
                Perfil DISC, preferencias de contenido y fuentes personalizadas
              </p>
            </div>
            <PersonalizationProfile />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-16 py-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>Despega A4 • Centro de Aprendizaje Estratégico</p>
          <p className="mt-2">
            Última actualización: {new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </main>
  )
}
