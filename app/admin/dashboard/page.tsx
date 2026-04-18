'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminDashboard } from '@/components/admin-dashboard'
import { AdminUserManagement } from '@/components/admin-user-management'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAdminStatus()
  }, [])

  async function checkAdminStatus() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        router.push('/despega')
        return
      }

      // Check if user is admin (would need to implement admin role in your auth)
      const { data } = await supabase
        .from('despega_user_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!data?.is_admin) {
        router.push('/despega')
        return
      }

      setIsAdmin(data?.is_admin || false)
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
      router.push('/despega')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-muted/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/despega" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-4 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-muted/40 mt-2">Monitor de rendimiento y gestión de usuarios</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen General</TabsTrigger>
            <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AdminUserManagement />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6">
              {/* Content Performance */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Rendimiento de Contenido</h2>
                <p className="text-muted-foreground">Análisis detallado de engagement y completación por tipo de contenido</p>
              </div>

              {/* Coach IA Stats */}
              <div className="space-y-4 border-t pt-6">
                <h2 className="text-xl font-semibold">Coach IA Transversal</h2>
                <p className="text-muted-foreground">Sistema de coaching automático integrado en A1-A4</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground">Conversaciones Activas</p>
                    <p className="text-2xl font-bold mt-2">-</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground">Satisfacción Promedio</p>
                    <p className="text-2xl font-bold mt-2">-</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground">Respuestas Generadas</p>
                    <p className="text-2xl font-bold mt-2">-</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                    <p className="text-2xl font-bold mt-2">-</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
