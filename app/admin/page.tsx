import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminTesisManager } from "@/components/admin/admin-tesis-manager"
import { AdminNoticiasManager } from "@/components/admin/admin-noticias-manager"
import { AdminTestsManager } from "@/components/admin/admin-tests-manager"
import { AdminBibliotecaManager } from "@/components/admin/admin-biblioteca-manager"
import { AdminUsersOverview } from "@/components/admin/admin-users-overview"
import { AdminAnalytics } from "@/components/admin/admin-analytics"
import { ProtectedAdminRoute } from "@/components/admin/protected-admin-route"

// Mark page as dynamic since it uses useSession() which requires runtime rendering
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin Dashboard - A4 Despega",
  description: "Panel de administración para gestionar contenido de A4",
}

export default function AdminDashboardPage() {
  return (
    <ProtectedAdminRoute>
      <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 space-y-2">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Gestión de contenido, usuarios y analíticas de la plataforma A4
            </p>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8 bg-background/50 backdrop-blur-sm border border-border">
              <TabsTrigger value="analytics" className="text-xs sm:text-sm">
                📊 Analíticas
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs sm:text-sm">
                👥 Usuarios
              </TabsTrigger>
              <TabsTrigger value="tesis" className="text-xs sm:text-sm">
                📡 Tesis
              </TabsTrigger>
              <TabsTrigger value="noticias" className="text-xs sm:text-sm">
                📰 Noticias
              </TabsTrigger>
              <TabsTrigger value="tests" className="text-xs sm:text-sm">
                ✅ Pruebas
              </TabsTrigger>
              <TabsTrigger value="biblioteca" className="text-xs sm:text-sm">
                📚 Biblioteca
              </TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold">Analíticas de Plataforma</h2>
                <p className="text-muted-foreground">
                  Resumen de engagement, usuario y contenido en la plataforma
                </p>
              </div>
              <AdminAnalytics />
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
                <p className="text-muted-foreground">
                  Monitoreo de usuarios activos, progreso y engagement
                </p>
              </div>
              <AdminUsersOverview />
            </TabsContent>

            {/* Tesis Tab */}
            <TabsContent value="tesis" className="space-y-4">
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold">Gestión de Tesis</h2>
                <p className="text-muted-foreground">
                  Crear, editar y publicar tesis estratégicas diarias
                </p>
              </div>
              <AdminTesisManager />
            </TabsContent>

            {/* Noticias Tab */}
            <TabsContent value="noticias" className="space-y-4">
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold">Gestión de Noticias</h2>
                <p className="text-muted-foreground">
                  Curar, categorizar y ligar noticias a tesis
                </p>
              </div>
              <AdminNoticiasManager />
            </TabsContent>

            {/* Tests Tab */}
            <TabsContent value="tests" className="space-y-4">
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold">Gestión de Pruebas</h2>
                <p className="text-muted-foreground">
                  Crear pruebas gamificadas y configurar puntos
                </p>
              </div>
              <AdminTestsManager />
            </TabsContent>

            {/* Biblioteca Tab */}
            <TabsContent value="biblioteca" className="space-y-4">
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold">Gestión de Biblioteca</h2>
                <p className="text-muted-foreground">
                  Verificar y categorizar recursos de aprendizaje
                </p>
              </div>
              <AdminBibliotecaManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ProtectedAdminRoute>
  )
}
