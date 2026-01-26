import Metadata from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { PerfilInformeViewer } from '@/components/perfil-informe-viewer'

export const metadata: Metadata = {
  title: 'Tu Perfil Descubierto | Despega',
  description: 'Informe detallado de tu perfil del Test Despega Cerebral',
}

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Obtener perfil del usuario
  const { data: perfil, error: perfilError } = await supabase
    .from('despega_cerebral_perfil')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!perfil || perfilError) {
    redirect('/personalized-learning')
  }

  // Obtener informe (determinar si FREE o PREMIUM según plan del usuario)
  const { data: plan } = await supabase
    .from('user_subscription_plans')
    .select('plan_type')
    .eq('user_id', user.id)
    .single()

  const versionInforme = plan?.plan_type === 'premium' ? 'premium' : 'free'

  const { data: informe } = await supabase
    .from('despega_perfil_informe')
    .select('*')
    .eq('user_id', user.id)
    .eq('version', versionInforme)
    .single()

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <PerfilInformeViewer
          usuario={{
            id: user.id,
            nombre: user.user_metadata?.nombre || user.email,
          }}
          perfil={perfil}
          informe={informe}
          version={versionInforme}
        />
      </div>
    </main>
  )
}
