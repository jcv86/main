import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import A2RoutesHub from '@/components/a2-routes-hub'
import { PerfilTipo } from '@/lib/a2-personalization-logic'

export const metadata = {
  title: 'Rutas de Aprendizaje | Despega A2',
  description: 'Elige tu ruta de aprendizaje personalizada según tu perfil'
}

export default async function A2RutasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Obtener perfil DISC del usuario
  const { data: perfilData } = await supabase
    .from('despega_perfil_informe')
    .select('perfil_tipo')
    .eq('user_id', user.id)
    .order('generado_at', { ascending: false })
    .limit(1)
    .single()

  // Default a 'C' si no tiene perfil
  const userPerfil: PerfilTipo = (perfilData?.perfil_tipo as PerfilTipo) || 'C'

  // Obtener todas las rutas
  const { data: routes } = await supabase
    .from('a2_learning_routes')
    .select('*')
    .eq('activo', true)
    .order('perfil_ideal')

  // Obtener progreso del usuario en todas las rutas
  const { data: progressData } = await supabase
    .from('a2_user_route_progress')
    .select('*')
    .eq('user_id', user.id)

  // Convertir a mapa para fácil acceso
  const userProgress: Record<string, any> = {}
  progressData?.forEach(p => {
    userProgress[p.route_id] = p
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">A2: Rutas de Aprendizaje</h1>
          <p className="text-muted-foreground mt-2">
            Elige tu camino de desarrollo profesional personalizado
          </p>
        </div>

        <A2RoutesHub
          routes={routes || []}
          userPerfil={userPerfil}
          userProgress={userProgress}
          userId={user.id}
        />
      </div>
    </main>
  )
}
